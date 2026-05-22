import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Lock, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

type Milestone = { id: string; label: string };
type Phase = {
  id: number;
  emoji: string;
  name: string;
  subtitle: string;
  gradient: string;
  milestones: Milestone[];
  tools: { label: string; to?: string }[];
};

const PHASES: Phase[] = [
  {
    id: 1, emoji: "💡", name: "Idéation", subtitle: "Trouver le bon problème",
    gradient: "from-purple-500 to-fuchsia-500",
    milestones: [
      { id: "problem-validation", label: "Validation du problème (10 interviews)" },
      { id: "bmc", label: "Business Model Canvas rédigé" },
      { id: "market-research", label: "Étude de marché cible" },
      { id: "competitors", label: "Analyse concurrentielle" },
    ],
    tools: [
      { label: "BMC Builder", to: "/formation/business-model" },
      { label: "Problem-Solution Fit", to: "/lean-canvas-lab" },
    ],
  },
  {
    id: 2, emoji: "🛠️", name: "Pré-incubation", subtitle: "Du concept au prototype",
    gradient: "from-blue-500 to-cyan-500",
    milestones: [
      { id: "mvp-proto", label: "Prototype MVP fonctionnel" },
      { id: "team", label: "Équipe fondatrice constituée" },
      { id: "legal-structure", label: "Structure légale (SUARL/SA/Startup Act)" },
      { id: "customer-interviews", label: "Premiers entretiens clients" },
    ],
    tools: [
      { label: "Pitch Deck Template", to: "/pole-strategique" },
      { label: "Checklist APII / RNE", to: "/knowledge" },
    ],
  },
  {
    id: 3, emoji: "🚀", name: "Incubation", subtitle: "Atteindre le Product-Market Fit",
    gradient: "from-emerald-500 to-green-500",
    milestones: [
      { id: "pmf", label: "Product-Market Fit validé" },
      { id: "first-revenue", label: "Premier chiffre d'affaires" },
      { id: "mentor-8", label: "8 sessions de mentorat" },
      { id: "kpi-dashboard", label: "Dashboard KPI configuré" },
      { id: "investor-deck", label: "Deck investisseur prêt" },
    ],
    tools: [
      { label: "KPI Tracker", to: "/mission-control" },
      { label: "Mentor Booking", to: "/communaute" },
    ],
  },
  {
    id: 4, emoji: "⚡", name: "Accélération", subtitle: "Scale & expansion",
    gradient: "from-orange-500 to-amber-500",
    milestones: [
      { id: "team-scale", label: "Équipe étendue (>10)" },
      { id: "series-a", label: "Préparation Series A" },
      { id: "export", label: "Marchés export ouverts" },
      { id: "partners", label: "Partenariats CEPEX / Tunisia Export" },
    ],
    tools: [
      { label: "Investor CRM", to: "/communaute/invest" },
      { label: "Deal Room", to: "/deal-room" },
    ],
  },
  {
    id: 5, emoji: "🌟", name: "Alumni & Impact", subtitle: "Donner au prochain",
    gradient: "from-yellow-400 to-amber-600",
    milestones: [
      { id: "community", label: "Contribution active communauté" },
      { id: "mentor-juniors", label: "Mentor de startupers juniors" },
      { id: "fundraising-complete", label: "Levée de fonds complétée" },
    ],
    tools: [
      { label: "Annuaire Alumni", to: "/communaute" },
      { label: "Showcase Success", to: "/marketplace" },
    ],
  },
];

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/auth"); return; }
      setUserId(data.user.id);
      loadProgress(data.user.id);
    });
  }, [navigate]);

  async function loadProgress(uid: string) {
    const { data } = await supabase
      .from("startup_journey_progress")
      .select("phase_id,milestone_id,completed")
      .eq("user_id", uid);
    const s = new Set<string>();
    (data || []).forEach((r: any) => { if (r.completed) s.add(`${r.phase_id}:${r.milestone_id}`); });
    setCompleted(s);
    setLoading(false);
  }

  function phaseProgress(p: Phase) {
    const done = p.milestones.filter(m => completed.has(`${p.id}:${m.id}`)).length;
    return Math.round((done / p.milestones.length) * 100);
  }

  function phaseUnlocked(p: Phase) {
    if (p.id === 1) return true;
    const prev = PHASES.find(x => x.id === p.id - 1)!;
    return phaseProgress(prev) === 100;
  }

  async function toggleMilestone(phase: Phase, m: Milestone) {
    if (!userId) return;
    if (!phaseUnlocked(phase)) { toast.error("Phase verrouillée — complétez la précédente"); return; }
    const key = `${phase.id}:${m.id}`;
    const wasDone = completed.has(key);
    const wasFull = phaseProgress(phase) === 100;
    const next = new Set(completed);
    if (wasDone) next.delete(key); else next.add(key);
    setCompleted(next);

    const { error } = await supabase
      .from("startup_journey_progress")
      .upsert({
        user_id: userId, phase_id: phase.id, milestone_id: m.id,
        completed: !wasDone, completed_at: !wasDone ? new Date().toISOString() : null,
      }, { onConflict: "user_id,phase_id,milestone_id" });
    if (error) { toast.error("Erreur sauvegarde"); setCompleted(completed); return; }

    // Confetti when phase reaches 100%
    const doneCount = phase.milestones.filter(x => next.has(`${phase.id}:${x.id}`)).length;
    if (!wasFull && doneCount === phase.milestones.length) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setCelebrating(phase.id);
      toast.success(`🎉 Phase ${phase.name} complétée !`);
      setTimeout(() => setCelebrating(null), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🗺️ Mon Parcours Startup</h1>
          <p className="text-sm text-muted-foreground">5 phases pour transformer ton idée en startup à impact</p>
        </div>
        <Button variant="outline" asChild><Link to="/mission-control">Mission Control</Link></Button>
      </header>

      <main className="overflow-x-auto pb-12">
        <div className="flex gap-6 px-6 py-8 min-w-max">
          {PHASES.map((phase, idx) => {
            const progress = phaseProgress(phase);
            const unlocked = phaseUnlocked(phase);
            const isFull = progress === 100;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-stretch gap-4"
              >
                <Card className={`w-[340px] flex flex-col overflow-hidden border-2 ${isFull ? "border-primary" : "border-border"} ${!unlocked ? "opacity-60" : ""} ${celebrating === phase.id ? "ring-4 ring-primary animate-pulse" : ""}`}>
                  <div className={`bg-gradient-to-br ${phase.gradient} p-5 text-white`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl">{phase.emoji}</div>
                      {!unlocked && <Lock className="w-5 h-5" />}
                      {isFull && <Badge className="bg-white text-foreground">Complétée</Badge>}
                    </div>
                    <h2 className="text-xl font-bold">Phase {phase.id} — {phase.name}</h2>
                    <p className="text-sm opacity-90">{phase.subtitle}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1"><span>Progression</span><span>{progress}%</span></div>
                      <Progress value={progress} className="h-2 bg-white/30" />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestones</h3>
                      {phase.milestones.map(m => {
                        const done = completed.has(`${phase.id}:${m.id}`);
                        return (
                          <button
                            key={m.id}
                            onClick={() => toggleMilestone(phase, m)}
                            disabled={!unlocked || loading}
                            className="flex items-start gap-2 text-left w-full hover:bg-muted/50 rounded p-1.5 transition disabled:cursor-not-allowed"
                          >
                            {done ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />}
                            <span className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-border space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outils</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.tools.map(t => (
                          t.to ? (
                            <Button key={t.label} size="sm" variant="secondary" asChild>
                              <Link to={t.to}>{t.label}</Link>
                            </Button>
                          ) : <Badge key={t.label} variant="secondary">{t.label}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
                {idx < PHASES.length - 1 && (
                  <div className="flex items-center text-muted-foreground">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
