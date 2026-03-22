import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, CheckCircle, Circle, ChevronRight, ChevronDown,
  Video, HelpCircle, Award, BarChart3, Lock, BookOpen, Clock, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// --- Types ---
type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Module = {
  id: string;
  title: string;
  type: "video" | "quiz" | "reading";
  duration: string;
  videoUrl?: string;
  content?: string;
  quiz?: QuizQuestion[];
};

type LMSFormation = {
  id: string;
  title: string;
  domain: string;
  modules: Module[];
};

// --- Sample LMS data (will be replaced with DB data later) ---
const SAMPLE_FORMATIONS: LMSFormation[] = [
  {
    id: "lms-design-thinking",
    title: "Introduction au Design Thinking",
    domain: "Design Thinking",
    modules: [
      {
        id: "dt-1", title: "Qu'est-ce que le Design Thinking ?", type: "video", duration: "12 min",
        videoUrl: "https://www.youtube.com/embed/gHGN6hs2gZY",
        content: "Le Design Thinking est une approche centrée utilisateur pour résoudre des problèmes complexes."
      },
      {
        id: "dt-2", title: "Les 5 phases du processus", type: "reading", duration: "8 min",
        content: "Les 5 phases du Design Thinking sont :\n\n1. **Empathie** — Comprendre les besoins réels des utilisateurs\n2. **Définition** — Formuler le problème de manière claire\n3. **Idéation** — Générer un maximum d'idées créatives\n4. **Prototypage** — Créer des solutions tangibles rapidement\n5. **Test** — Valider les solutions avec les utilisateurs\n\nChaque phase est itérative et peut être revisitée à tout moment."
      },
      {
        id: "dt-3", title: "Quiz : Design Thinking Fondamentaux", type: "quiz", duration: "5 min",
        quiz: [
          { question: "Quelle est la première phase du Design Thinking ?", options: ["Idéation", "Empathie", "Prototypage", "Test"], correctIndex: 1 },
          { question: "Le Design Thinking est centré sur :", options: ["La technologie", "Le profit", "L'utilisateur", "Le concurrent"], correctIndex: 2 },
          { question: "Combien de phases compte le processus ?", options: ["3", "4", "5", "6"], correctIndex: 2 },
        ]
      },
    ]
  },
  {
    id: "lms-lean-startup",
    title: "Lean Startup Essentials",
    domain: "Lean Startup",
    modules: [
      {
        id: "ls-1", title: "Le cycle Build-Measure-Learn", type: "video", duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/RSaIOCHbuYw",
        content: "Le cycle Build-Measure-Learn est au cœur de la méthodologie Lean Startup."
      },
      {
        id: "ls-2", title: "MVP : Minimum Viable Product", type: "reading", duration: "10 min",
        content: "Le MVP est la version la plus simple de votre produit qui permet de tester votre hypothèse principale.\n\n**Principes clés :**\n- Construire le minimum nécessaire\n- Mesurer les résultats réels\n- Apprendre et pivoter si nécessaire\n\n**Exemples célèbres :**\n- Dropbox : une simple vidéo démonstrative\n- Zappos : photos de chaussures d'un magasin local\n- Airbnb : location de matelas gonflables"
      },
      {
        id: "ls-3", title: "Quiz : Lean Startup", type: "quiz", duration: "5 min",
        quiz: [
          { question: "Que signifie MVP ?", options: ["Maximum Value Product", "Minimum Viable Product", "Most Valuable Process", "Minimum Value Proposal"], correctIndex: 1 },
          { question: "Le cycle Lean Startup est :", options: ["Plan-Do-Check-Act", "Build-Measure-Learn", "Design-Develop-Deploy", "Think-Make-Sell"], correctIndex: 1 },
        ]
      },
    ]
  },
  {
    id: "lms-growth-hacking",
    title: "Growth Hacking 101",
    domain: "Growth Hacking",
    modules: [
      {
        id: "gh-1", title: "Introduction au Growth Hacking", type: "video", duration: "10 min",
        videoUrl: "https://www.youtube.com/embed/ajccEoAhfmc",
        content: "Le Growth Hacking combine marketing, data et product pour accélérer la croissance."
      },
      {
        id: "gh-2", title: "Le framework AARRR", type: "reading", duration: "12 min",
        content: "Le framework AARRR (Pirate Metrics) se décompose en :\n\n1. **Acquisition** — Comment les utilisateurs découvrent votre produit\n2. **Activation** — La première expérience positive\n3. **Rétention** — Les utilisateurs reviennent-ils ?\n4. **Revenue** — Comment monétisez-vous ?\n5. **Referral** — Les utilisateurs recommandent-ils ?\n\nChaque étape est mesurable et optimisable."
      },
      {
        id: "gh-3", title: "Quiz : Growth Hacking", type: "quiz", duration: "5 min",
        quiz: [
          { question: "Que signifie le 'R' de Referral dans AARRR ?", options: ["Revenue", "Recommandation", "Rétention", "Réduction"], correctIndex: 1 },
          { question: "Le Growth Hacking se concentre sur :", options: ["Le branding", "La croissance rapide", "Le design", "La comptabilité"], correctIndex: 1 },
        ]
      },
    ]
  }
];

// --- Components ---

const VideoPlayer = ({ url }: { url: string }) => (
  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 border border-border">
    <iframe
      src={url}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Module vidéo"
    />
  </div>
);

const ReadingContent = ({ content }: { content: string }) => (
  <div className="prose prose-sm dark:prose-invert max-w-none p-6 rounded-xl bg-muted/50 border border-border">
    {content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h4 key={i} className="font-bold text-foreground mt-4 mb-2">{line.replace(/\*\*/g, "")}</h4>;
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
      }
      if (/^\d+\./.test(line)) {
        const parts = line.split("**");
        return (
          <p key={i} className="text-muted-foreground mb-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-muted-foreground">{line}</p>;
    })}
  </div>
);

const QuizComponent = ({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete: (score: number) => void }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ]: parseInt(value) }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.length) return;
    setShowResults(true);
    const correct = quiz.filter((q, i) => answers[i] === q.correctIndex).length;
    const score = Math.round((correct / quiz.length) * 100);
    onComplete(score);
  };

  if (showResults) {
    const correct = quiz.filter((q, i) => answers[i] === q.correctIndex).length;
    return (
      <div className="space-y-4">
        <div className="text-center p-6 rounded-xl bg-muted/50 border border-border">
          <Award className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h4 className="text-xl font-bold mb-1">{correct}/{quiz.length} correct</h4>
          <p className="text-sm text-muted-foreground">
            {correct === quiz.length ? "Parfait ! 🎉" : correct >= quiz.length / 2 ? "Bien joué ! 👏" : "Continuez à apprendre ! 💪"}
          </p>
        </div>
        {quiz.map((q, i) => (
          <div key={i} className={`p-4 rounded-lg border ${answers[i] === q.correctIndex ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <p className="font-medium text-sm mb-1">{q.question}</p>
            <p className="text-xs text-muted-foreground">
              Votre réponse : {q.options[answers[i]]} {answers[i] === q.correctIndex ? "✅" : `❌ (Correct: ${q.options[q.correctIndex]})`}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const q = quiz[currentQ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Question {currentQ + 1}/{quiz.length}</Badge>
        <Progress value={((currentQ + 1) / quiz.length) * 100} className="w-32 h-2" />
      </div>
      <h4 className="text-lg font-semibold">{q.question}</h4>
      <RadioGroup value={answers[currentQ]?.toString()} onValueChange={handleAnswer}>
        {q.options.map((opt, i) => (
          <div key={i} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
            answers[currentQ] === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
          }`}>
            <RadioGroupItem value={i.toString()} id={`q${currentQ}-${i}`} />
            <Label htmlFor={`q${currentQ}-${i}`} className="cursor-pointer flex-1">{opt}</Label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentQ(c => c - 1)} disabled={currentQ === 0}>Précédent</Button>
        {currentQ < quiz.length - 1 ? (
          <Button onClick={() => setCurrentQ(c => c + 1)} disabled={answers[currentQ] === undefined}>Suivant</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.length}>Valider le quiz</Button>
        )}
      </div>
    </div>
  );
};

// --- Main LMS Component ---
const MiniLMS = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFormation, setSelectedFormation] = useState<LMSFormation | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  const activeModule = selectedFormation?.modules.find(m => m.id === activeModuleId);
  const progressPercent = selectedFormation
    ? Math.round((completedModules.size / selectedFormation.modules.length) * 100)
    : 0;

  const markComplete = (moduleId: string) => {
    setCompletedModules(prev => new Set([...prev, moduleId]));
    // Auto-advance
    if (selectedFormation) {
      const idx = selectedFormation.modules.findIndex(m => m.id === moduleId);
      if (idx < selectedFormation.modules.length - 1) {
        setActiveModuleId(selectedFormation.modules[idx + 1].id);
      }
    }
    toast({ title: "Module complété ✅" });
  };

  const handleQuizComplete = (moduleId: string, score: number) => {
    setQuizScores(prev => ({ ...prev, [moduleId]: score }));
    markComplete(moduleId);
  };

  // Formation selector
  if (!selectedFormation) {
    return (
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Mini-LMS Interactif</h2>
          <p className="text-muted-foreground mb-6">
            Formations à distance avec modules vidéo, contenus interactifs et quiz d'évaluation.
            Complétez tous les modules pour valider votre progression.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_FORMATIONS.map((f) => (
            <motion.div key={f.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="cursor-pointer hover:border-primary/30 transition-all h-full" onClick={() => { setSelectedFormation(f); setActiveModuleId(f.modules[0].id); setCompletedModules(new Set()); }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{f.domain}</Badge>
                    <Badge variant="secondary" className="text-xs">{f.modules.length} modules</Badge>
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {f.modules.map(m => (
                      <div key={m.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {m.type === "video" ? <Video className="h-3.5 w-3.5 text-blue-500" /> :
                         m.type === "quiz" ? <HelpCircle className="h-3.5 w-3.5 text-amber-500" /> :
                         <BookOpen className="h-3.5 w-3.5 text-emerald-500" />}
                        <span className="truncate">{m.title}</span>
                        <span className="ml-auto text-xs shrink-0">{m.duration}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 gap-2" variant="outline">
                    <Play className="h-4 w-4" /> Commencer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Active LMS view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedFormation(null); setActiveModuleId(null); }} className="mb-2 -ml-2">
            ← Retour aux formations
          </Button>
          <h2 className="text-2xl font-bold">{selectedFormation.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline">{selectedFormation.domain}</Badge>
            <span className="text-sm text-muted-foreground">{completedModules.size}/{selectedFormation.modules.length} modules</span>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-[200px]">
          <Progress value={progressPercent} className="flex-1 h-3" />
          <span className="text-sm font-bold text-primary">{progressPercent}%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar - Module list */}
        <div className="space-y-1">
          {selectedFormation.modules.map((m, idx) => {
            const isCompleted = completedModules.has(m.id);
            const isActive = m.id === activeModuleId;
            const isLocked = idx > 0 && !completedModules.has(selectedFormation.modules[idx - 1].id) && !isCompleted;

            return (
              <button
                key={m.id}
                onClick={() => !isLocked && setActiveModuleId(m.id)}
                disabled={isLocked}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive ? "bg-primary/10 border border-primary/30" :
                  isCompleted ? "bg-emerald-500/5 border border-emerald-500/20" :
                  isLocked ? "opacity-50 cursor-not-allowed border border-transparent" :
                  "hover:bg-muted border border-transparent"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? <CheckCircle className="h-5 w-5 text-emerald-500" /> :
                   isLocked ? <Lock className="h-5 w-5 text-muted-foreground" /> :
                   isActive ? <Play className="h-5 w-5 text-primary" /> :
                   <Circle className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>{m.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {m.type === "video" ? <Video className="h-3 w-3 text-blue-500" /> :
                     m.type === "quiz" ? <HelpCircle className="h-3 w-3 text-amber-500" /> :
                     <BookOpen className="h-3 w-3 text-emerald-500" />}
                    <span className="text-xs text-muted-foreground">{m.duration}</span>
                    {quizScores[m.id] !== undefined && (
                      <Badge variant="secondary" className="text-xs">{quizScores[m.id]}%</Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <Card className="overflow-hidden">
          <AnimatePresence mode="wait">
            {activeModule && (
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    {activeModule.type === "video" ? <Video className="h-5 w-5 text-blue-500" /> :
                     activeModule.type === "quiz" ? <HelpCircle className="h-5 w-5 text-amber-500" /> :
                     <BookOpen className="h-5 w-5 text-emerald-500" />}
                    <Badge variant="outline" className="text-xs capitalize">{activeModule.type === "reading" ? "Lecture" : activeModule.type === "quiz" ? "Quiz" : "Vidéo"}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1"><Clock className="h-3 w-3" />{activeModule.duration}</span>
                  </div>
                  <CardTitle>{activeModule.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activeModule.type === "video" && activeModule.videoUrl && (
                    <>
                      <VideoPlayer url={activeModule.videoUrl} />
                      {activeModule.content && <p className="text-muted-foreground text-sm">{activeModule.content}</p>}
                      {!completedModules.has(activeModule.id) && (
                        <Button onClick={() => markComplete(activeModule.id)} className="gap-2">
                          <CheckCircle className="h-4 w-4" /> Marquer comme terminé
                        </Button>
                      )}
                    </>
                  )}

                  {activeModule.type === "reading" && activeModule.content && (
                    <>
                      <ReadingContent content={activeModule.content} />
                      {!completedModules.has(activeModule.id) && (
                        <Button onClick={() => markComplete(activeModule.id)} className="gap-2">
                          <CheckCircle className="h-4 w-4" /> J'ai lu ce module
                        </Button>
                      )}
                    </>
                  )}

                  {activeModule.type === "quiz" && activeModule.quiz && (
                    completedModules.has(activeModule.id) ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                        <p className="font-bold">Quiz complété — Score : {quizScores[activeModule.id]}%</p>
                      </div>
                    ) : (
                      <QuizComponent quiz={activeModule.quiz} onComplete={(score) => handleQuizComplete(activeModule.id, score)} />
                    )
                  )}

                  {completedModules.has(activeModule.id) && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm">
                      <CheckCircle className="h-4 w-4" /> Module complété
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Completion */}
      {progressPercent === 100 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
            <CardContent className="pt-6 text-center">
              <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Formation Complétée ! 🎉</h3>
              <p className="text-muted-foreground mb-4">
                Vous avez terminé tous les modules. Rendez-vous dans l'onglet Évaluation pour obtenir votre certificat.
              </p>
              <Button variant="outline" onClick={() => { setSelectedFormation(null); setActiveModuleId(null); }}>
                Retour aux formations
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MiniLMS;
