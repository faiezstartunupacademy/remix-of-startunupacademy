import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, XCircle, Loader2, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Question = {
  id: number;
  question: string;
  choices: Record<string, string>;
  difficulty: string;
};

type QuestionWithAnswer = Question & {
  correct: string;
  explanation: string;
  user_answer: string;
  is_correct: boolean;
};

type Props = {
  formationId: string;
  formationTitle: string;
  formationDomain?: string;
  formationDescription?: string;
  onQuizPassed?: (score: number) => void;
};

const FormationQuiz = ({ formationId, formationTitle, formationDomain, formationDescription, onQuizPassed }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    results: QuestionWithAnswer[];
  } | null>(null);

  // Select 10 random questions from loaded set
  const selectedQuestions = useMemo(() => {
    if (allQuestions.length <= 10) return allQuestions;
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [allQuestions]);

  useEffect(() => {
    loadExistingQuiz();
  }, [formationId]);

  const loadExistingQuiz = async () => {
    setLoading(true);
    // Use secure function that strips answers
    const { data } = await supabase.rpc("get_quiz_questions_safe" as any, { p_formation_id: formationId });
    if (data) {
      setAllQuestions(data as Question[]);
    }
    setLoading(false);
  };

  const generateQuiz = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { formationTitle, formationDomain: formationDomain || "general", formationDescription },
      });

      if (error) throw error;
      if (data?.questions) {
        // Save full questions to DB (with answers - admin only via RLS)
        await supabase.from("formation_quizzes" as any).insert({
          formation_id: formationId,
          questions: data.questions,
        } as any);
        // Reload using secure function (no answers)
        await loadExistingQuiz();
        toast({ title: "✅ QCM généré", description: "15 questions ont été générées par IA." });
      }
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message || "Impossible de générer le QCM", variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < selectedQuestions.length) {
      toast({ title: "Incomplet", description: "Répondez à toutes les questions.", variant: "destructive" });
      return;
    }

    setSubmitted(true);

    // Validate answers server-side
    const { data: result } = await supabase.rpc("validate_quiz_answers" as any, {
      p_formation_id: formationId,
      p_answers: answers,
    });

    if (result && !(result as any).error) {
      const typedResult = result as { score: number; total: number; percentage: number; results: QuestionWithAnswer[] };
      setValidationResult(typedResult);

      // Filter results to only show selected questions
      const selectedIds = new Set(selectedQuestions.map(q => q.id));
      const filteredResults = typedResult.results.filter(r => selectedIds.has(r.id));
      const correctCount = filteredResults.filter(r => r.is_correct).length;
      const score = Math.round((correctCount / selectedQuestions.length) * 100);
      const passed = score >= 70;

      setValidationResult({ ...typedResult, results: filteredResults, score: correctCount, total: selectedQuestions.length, percentage: score });

      if (user) {
        const { data: quiz } = await supabase
          .from("formation_quizzes" as any)
          .select("id")
          .eq("formation_id", formationId)
          .order("generated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (quiz) {
          await supabase.from("quiz_attempts" as any).insert({
            user_id: user.id,
            formation_id: formationId,
            quiz_id: (quiz as any).id,
            selected_questions: selectedQuestions.map(q => q.id),
            answers,
            score,
            total_questions: selectedQuestions.length,
            passed,
          } as any);
        }
      }

      setShowResult(true);
      if (passed && onQuizPassed) onQuizPassed(score);
    } else {
      toast({ title: "Erreur", description: "Impossible de valider le quiz.", variant: "destructive" });
      setSubmitted(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setShowResult(false);
    setValidationResult(null);
    setAllQuestions(prev => [...prev]);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (allQuestions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-bold">QCM de Certification</h3>
          <p className="text-muted-foreground">
            L'IA va générer 15 questions QCM. Vous devrez répondre à 10 questions sélectionnées aléatoirement.
            Score minimum : <strong>70%</strong> pour obtenir le badge.
          </p>
          <Button onClick={generateQuiz} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {generating ? "Génération en cours..." : "Générer le QCM"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResult && validationResult) {
    const { score, total, percentage, results } = validationResult;
    const passed = percentage >= 70;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {passed ? (
            <Trophy className="h-16 w-16 text-amber-500 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
          )}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {passed ? "🎉 Félicitations !" : "Pas encore..."}
            </h3>
            <p className="text-4xl font-bold text-primary mb-2">{score}/{total}</p>
            <p className="text-muted-foreground">Score: {percentage}%</p>
          </div>
          <Badge className={passed ? "bg-emerald-500/10 text-emerald-600 text-lg px-4 py-1" : "bg-destructive/10 text-destructive text-lg px-4 py-1"}>
            {passed ? "✅ QCM validé" : "❌ Score insuffisant (min 70%)"}
          </Badge>

          {/* Show corrections from server */}
          <div className="text-left space-y-4 mt-6">
            {results.map((q, i) => (
              <div key={q.id} className={`p-4 rounded-lg border ${q.is_correct ? "border-emerald-500/30 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                <p className="font-medium text-sm mb-1">Q{i + 1}: {q.question}</p>
                <p className="text-xs text-muted-foreground">
                  Votre réponse: <strong>{q.choices[q.user_answer]}</strong> {q.is_correct ? "✅" : `❌ → ${q.choices[q.correct]}`}
                </p>
                {!q.is_correct && <p className="text-xs text-muted-foreground mt-1 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>

          {!passed && (
            <Button onClick={resetQuiz} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentQ = selectedQuestions[currentIndex];
  const progress = ((currentIndex + 1) / selectedQuestions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Question {currentIndex + 1}/{selectedQuestions.length}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {currentQ.difficulty === "easy" ? "🟢 Facile" : currentQ.difficulty === "medium" ? "🟡 Moyen" : "🔴 Difficile"}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-medium text-lg">{currentQ.question}</p>

        <RadioGroup
          value={answers[currentQ.id] || ""}
          onValueChange={(v) => handleAnswer(currentQ.id, v)}
        >
          {Object.entries(currentQ.choices).map(([key, value]) => (
            <div key={key} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
              answers[currentQ.id] === key ? "border-primary bg-primary/5" : "border-border"
            }`}>
              <RadioGroupItem value={key} id={`q-${currentQ.id}-${key}`} />
              <Label htmlFor={`q-${currentQ.id}-${key}`} className="flex-1 cursor-pointer">
                <span className="font-bold mr-2">{key}.</span>{value}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Précédent
          </Button>
          {currentIndex < selectedQuestions.length - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)} disabled={!answers[currentQ.id]} className="gap-2">
              Suivant <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length < selectedQuestions.length} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4" /> Valider le QCM
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationQuiz;
