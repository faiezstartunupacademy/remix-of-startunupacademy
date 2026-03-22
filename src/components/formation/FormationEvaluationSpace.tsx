import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Brain, Award, Loader2, CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import FormationQuiz from "./FormationQuiz";
import FormationBadge from "./FormationBadge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Formation = {
  id: string;
  title: string;
  domain: string;
  description: string | null;
  scheduled_date?: string | null;
  trainer_name?: string | null;
};

const FormationEvaluationSpace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState("quiz");

  useEffect(() => {
    loadFormations();
  }, []);

  useEffect(() => {
    if (selectedFormation && user) checkProgress();
  }, [selectedFormation, user]);

  const loadFormations = async () => {
    const { data } = await supabase
      .from("forum_threads")
      .select("id, title, category, content, scheduled_date, trainer_name")
      .eq("category", "formation")
      .not("scheduled_date", "is", null)
      .order("scheduled_date", { ascending: true });
    if (data) {
      setFormations(data.map(t => ({
        id: t.id,
        title: t.title,
        domain: "Formation programmée",
        description: t.content,
        scheduled_date: t.scheduled_date,
        trainer_name: t.trainer_name,
      })));
    }
    setLoading(false);
  };

  const checkProgress = async () => {
    if (!user || !selectedFormation) return;
    
    // Check quiz attempts
    const { data: attempts } = await supabase
      .from("quiz_attempts" as any)
      .select("score, passed")
      .eq("user_id", user.id)
      .eq("formation_id", selectedFormation.id)
      .eq("passed", true)
      .limit(1);
    
    if (attempts && (attempts as any[]).length > 0) {
      setQuizPassed(true);
      setQuizScore((attempts as any[])[0].score);
    }
  };

  const handleQuizPassed = async (score: number) => {
    setQuizPassed(true);
    setQuizScore(score);
    setActiveStep("badge");
    
    if (user && selectedFormation) {
      await supabase.from("notifications" as any).insert({
        user_id: user.id,
        type: "evaluation",
        title: "✅ QCM validé !",
        message: `Vous avez obtenu ${score}% au QCM de "${selectedFormation.title}". Votre badge est prêt !`,
        link: "/communaute/forum",
      } as any);

      await supabase.from("notifications" as any).insert({
        user_id: user.id,
        type: "badge_earned",
        title: "🏆 Badge STARTUNUP obtenu !",
        message: `Félicitations ! Vous avez obtenu le badge pour "${selectedFormation.title}".`,
        link: "/pole-strategique",
      } as any);

      toast({
        title: "🎉 Badge obtenu !",
        description: "Félicitations, votre badge est prêt !",
      });
    }
  };

  const badgeReady = quizPassed;

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (!selectedFormation) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <ClipboardCheck className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Espace Évaluation</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Sélectionnez une formation programmée pour accéder au QCM et à l'étude de cas avec correction par les pairs.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-3">
          {formations.map(f => (
            <motion.div key={f.id} whileHover={{ scale: 1.01 }}>
              <Card 
                className="cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => { setSelectedFormation(f); setActiveStep("quiz"); }}
              >
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {f.scheduled_date && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {format(new Date(f.scheduled_date), "dd MMM yyyy", { locale: fr })}
                        </Badge>
                      )}
                      {f.trainer_name && (
                        <span className="text-xs text-muted-foreground">par {f.trainer_name}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Évaluer</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {formations.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Aucune formation programmée disponible.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{selectedFormation.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedFormation.domain}</p>
            </div>
            <button onClick={() => { setSelectedFormation(null); setQuizPassed(false); }} className="text-sm text-primary hover:underline">
              ← Changer
            </button>
          </div>
          <div className="flex gap-4">
            {[
              { key: "quiz", label: "QCM (10/15)", icon: Brain, done: quizPassed },
              { key: "badge", label: "Badge", icon: Award, done: badgeReady },
            ].map((step, i) => (
              <button
                key={step.key}
                onClick={() => setActiveStep(step.key)}
                className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                  activeStep === step.key ? "border-primary bg-primary/5" :
                  step.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"
                }`}
              >
                <step.icon className={`h-5 w-5 mx-auto mb-1 ${step.done ? "text-emerald-500" : "text-muted-foreground"}`} />
                <p className="text-xs font-medium">{step.label}</p>
                {step.done && <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] mt-1">✓</Badge>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      {activeStep === "quiz" && (
        <FormationQuiz
          formationId={selectedFormation.id}
          formationTitle={selectedFormation.title}
          formationDomain={selectedFormation.domain}
          formationDescription={selectedFormation.description || undefined}
          onQuizPassed={handleQuizPassed}
        />
      )}

      {activeStep === "badge" && (
        badgeReady ? (
          <FormationBadge
            fullName={user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Participant"}
            formationTitle={selectedFormation.title}
            quizScore={quizScore}
            caseStudyScore={quizScore}
            date={new Date().toISOString()}
          />
        ) : (
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Complétez le QCM et l'étude de cas pour obtenir votre badge.</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default FormationEvaluationSpace;
