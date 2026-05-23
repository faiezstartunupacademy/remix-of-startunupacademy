import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Circle, Target, Flame, Trophy, Sparkles, Users, ArrowRight, Award, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { JOURNEY_STAGES, totalMaxPoints, type JourneyStage } from "@/data/journeyStages";
import StageStepper from "@/components/journey/StageStepper";
import MaturityGauge from "@/components/journey/MaturityGauge";

const APP_STATUSES = ["draft", "submitted", "review", "interview", "accepted", "rejected"] as const;
const APP_LABEL: Record<string, string> = {
  draft: "Brouillon", submitted: "Soumise", review: "En revue",
  interview: "Entretien", accepted: "Acceptée", rejected: "Refusée",
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [badges, setBadges] = useState<{ badge_code: string; label: string; icon: string; earned_at: string }[]>([]);
  const [streak, setStreak] = useState<{ current_streak: number; longest_streak: number; total_points: number } | null>(null);
  const [leaderboardOptin, setLeaderboardOptin] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; points: number; current_streak: number }[]>([]);
  const [activeStage, setActiveStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [validationOpen, setValidationOpen] = useState(false);
  const [selfScore, setSelfScore] = useState(70);
  const [evidence, setEvidence] = useState("");
  const [validations, setValidations] = useState<any[]>([]);

  // --- Load ---
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { navigate("/auth"); return; }
      const uid = data.user.id;
      setUserId(uid);
      await Promise.all([loadProgress(uid), loadBadges(uid), loadStreak(uid), loadOptin(uid), loadApps(uid), loadValidations(uid)]);
      setLoading(false);
      bumpStreak(uid);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProgress(uid: string) {
    const { data } = await supabase.from("startup_journey_progress").select("phase_id,milestone_id,completed").eq("user_id", uid);
    const s = new Set<string>();
    (data || []).forEach((r: any) => { if (r.completed) s.add(`${r.phase_id}:${r.milestone_id}`); });
    setCompleted(s);
    // Active = first stage not 100%
    const first = JOURNEY_STAGES.find((st) => {
      const done = st.tasks.filter((t) => s.has(`${st.id}:${t.id}`)).length;
      return done < st.tasks.length;
    });
    setActiveStage(first?.id || 7);
  }
  async function loadBadges(uid: string) {
    const { data } = await (supabase as any).from("journey_badges").select("badge_code,label,icon,earned_at").eq("user_id", uid).order("earned_at", { ascending: false });
    setBadges(data || []);
  }
  async function loadStreak(uid: string) {
    const { data } = await (supabase as any).from("journey_streaks").select("current_streak,longest_streak,total_points").eq("user_id", uid).maybeSingle();
    setStreak(data || { current_streak: 0, longest_streak: 0, total_points: 0 });
  }
  async function loadOptin(uid: string) {
    const { data } = await (supabase as any).from("journey_leaderboard_optin").select("is_optin").eq("user_id", uid).maybeSingle();
    setLeaderboardOptin(!!data?.is_optin);
    refreshLeaderboard();
  }
  async function refreshLeaderboard() {
    const { data: optins } = await (supabase as any).from("journey_leaderboard_optin").select("user_id,display_name,is_anonymous").eq("is_optin", true).limit(20);
    if (!optins?.length) return setLeaderboard([]);
    const ids = optins.map((o: any) => o.user_id);
    const { data: streaks } = await (supabase as any).from("journey_streaks").select("user_id,current_streak,total_points").in("user_id", ids);
    const map = new Map((streaks || []).map((s: any) => [s.user_id, s]));
    const rows = optins.map((o: any) => {
      const s: any = map.get(o.user_id) || {};
      return { name: o.is_anonymous ? "Startuper anonyme" : (o.display_name || "Startuper"), points: s.total_points || 0, current_streak: s.current_streak || 0 };
    }).sort((a: any, b: any) => b.points - a.points);
    setLeaderboard(rows);
  }
  async function loadApps(uid: string) {
    const { data } = await (supabase as any).from("funding_applications").select("id,status,submitted_at,programs:program_id(name,organization)").eq("user_id", uid).order("submitted_at", { ascending: false }).limit(10);
    setApplications(data || []);
  }
  async function loadValidations(uid: string) {
    const { data } = await (supabase as any).from("journey_stage_validations").select("phase_id,status,coach_notes,reviewed_at").eq("user_id", uid);
    setValidations(data || []);
  }

  // --- Streak bump (once per day) ---
  async function bumpStreak(uid: string) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: cur } = await (supabase as any).from("journey_streaks").select("*").eq("user_id", uid).maybeSingle();
    if (cur?.last_activity_date === today) return;
    const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
    const newStreak = cur?.last_activity_date === yesterday ? (cur.current_streak || 0) + 1 : 1;
    const longest = Math.max(cur?.longest_streak || 0, newStreak);
    await (supabase as any).from("journey_streaks").upsert({
      user_id: uid, current_streak: newStreak, longest_streak: longest,
      last_activity_date: today, total_points: cur?.total_points || 0, updated_at: new Date().toISOString(),
    });
    setStreak({ current_streak: newStreak, longest_streak: longest, total_points: cur?.total_points || 0 });
  }

  // --- Stats ---
  const stageProgress = useCallback((id: number) => {
    const st = JOURNEY_STAGES.find((x) => x.id === id)!;
    const done = st.tasks.filter((t) => completed.has(`${id}:${t.id}`)).length;
    return Math.round((done / st.tasks.length) * 100);
  }, [completed]);

  const stageUnlocked = useCallback((id: number) => {
    if (id === 1) return true;
    return stageProgress(id - 1) >= 60; // 60% to unlock next
  }, [stageProgress]);

  const maturityScore = useMemo(() => {
    let earned = 0;
    JOURNEY_STAGES.forEach((st) => st.tasks.forEach((t) => { if (completed.has(`${st.id}:${t.id}`)) earned += t.points || 0; }));
    return Math.round((earned / totalMaxPoints) * 100);
  }, [completed]);

  const stage = JOURNEY_STAGES.find((s) => s.id === activeStage)!;
  const stageValidation = validations.find((v) => v.phase_id === activeStage);

  // --- Toggle task ---
  async function toggleTask(st: JourneyStage, taskId: string, points: number) {
    if (!userId) return;
    if (!stageUnlocked(st.id)) { toast.error("Étape verrouillée — atteignez 60% sur l'étape précédente"); return; }
    const key = `${st.id}:${taskId}`;
    const wasDone = completed.has(key);
    const wasFull = stageProgress(st.id) === 100;
    const next = new Set(completed);
    if (wasDone) next.delete(key); else next.add(key);
    setCompleted(next);

    const { error } = await supabase.from("startup_journey_progress").upsert(
      { user_id: userId, phase_id: st.id, milestone_id: taskId, completed: !wasDone, completed_at: !wasDone ? new Date().toISOString() : null },
      { onConflict: "user_id,phase_id,milestone_id" }
    );
    if (error) { toast.error("Erreur sauvegarde"); setCompleted(completed); return; }

    // Update points
    const delta = wasDone ? -points : points;
    const newTotal = Math.max(0, (streak?.total_points || 0) + delta);
    await (supabase as any).from("journey_streaks").upsert({
      user_id: userId, total_points: newTotal, current_streak: streak?.current_streak || 1,
      longest_streak: streak?.longest_streak || 1, last_activity_date: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString(),
    });
    setStreak((s) => s ? { ...s, total_points: newTotal } : s);

    // Badge on stage 100%
    const doneCount = st.tasks.filter((t) => next.has(`${st.id}:${t.id}`)).length;
    if (!wasFull && doneCount === st.tasks.length) {
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
      toast.success(`🎉 Étape ${st.name} complétée !`);
      const { error: bErr } = await (supabase as any).from("journey_badges").upsert(
        { user_id: userId, badge_code: st.badge.code, phase_id: st.id, label: st.badge.label, icon: st.badge.icon },
        { onConflict: "user_id,badge_code" }
      );
      if (!bErr) loadBadges(userId);
    }
  }

  // --- Coach validation request ---
  async function requestValidation() {
    if (!userId) return;
    await (supabase as any).from("journey_stage_validations").insert({
      user_id: userId, phase_id: activeStage,
      self_assessment_score: selfScore, evidence_notes: evidence.slice(0, 2000),
    });
    toast.success("Demande envoyée à un coach");
    setValidationOpen(false); setEvidence("");
    loadValidations(userId);
  }

  // --- Leaderboard opt-in ---
  async function toggleOptin(value: boolean) {
    if (!userId) return;
    setLeaderboardOptin(value);
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", userId).maybeSingle();
    await (supabase as any).from("journey_leaderboard_optin").upsert({
      user_id: userId, is_optin: value, display_name: profile?.full_name || "Startuper", updated_at: new Date().toISOString(),
    });
    if (value) { toast.success("Vous apparaissez désormais dans le classement"); refreshLeaderboard(); }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement…</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">🗺️ Mon Parcours</h1>
            <p className="text-muted-foreground">7 étapes pour transformer ton idée en startup à impact</p>
          </div>
          <Button variant="outline" asChild><Link to="/mission-control">Mission Control →</Link></Button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,1fr] gap-4">
          <Card className="p-5 flex items-center justify-center"><MaturityGauge score={maturityScore} /></Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><Flame className="w-5 h-5 text-orange-500" />Streak quotidien</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{streak?.current_streak || 0}</span>
              <span className="text-sm text-muted-foreground">jour{(streak?.current_streak || 0) > 1 ? "s" : ""}</span>
            </div>
            <div className="text-xs text-muted-foreground">Record : {streak?.longest_streak || 0} jours • Total : {streak?.total_points || 0} pts</div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs">Apparaître dans le classement</div>
              <Switch checked={leaderboardOptin} onCheckedChange={toggleOptin} />
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><Award className="w-5 h-5 text-amber-500" />Badges débloqués ({badges.length}/7)</div>
            <div className="flex flex-wrap gap-2">
              {JOURNEY_STAGES.map((s) => {
                const earned = badges.find((b) => b.badge_code === s.badge.code);
                return (
                  <div key={s.id} title={earned ? `${s.badge.label} — débloqué` : `${s.badge.label} — verrouillé`} className={`w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 transition ${earned ? `bg-gradient-to-br ${s.gradient} border-transparent` : "bg-muted border-dashed border-border opacity-40 grayscale"}`}>
                    {s.badge.icon}
                  </div>
                );
              })}
            </div>
            {badges[0] && <div className="text-xs text-muted-foreground">Dernier : <span className="font-medium">{badges[0].label}</span></div>}
          </Card>
        </div>

        {/* Stepper */}
        <Card className="p-5">
          <StageStepper stages={JOURNEY_STAGES} activeStage={activeStage} stageProgress={stageProgress} stageUnlocked={stageUnlocked} onSelect={setActiveStage} />
        </Card>

        {/* Active stage detail */}
        <AnimatePresence mode="wait">
          <motion.div key={stage.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Card className="overflow-hidden">
              <div className={`bg-gradient-to-br ${stage.gradient} p-6 text-white`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm opacity-90">Étape {stage.id} / 7</div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">{stage.emoji} {stage.name}</h2>
                    <p className="opacity-90">{stage.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-3xl font-bold">{stageProgress(stage.id)}%</div>
                    {stageValidation && (
                      <Badge className={
                        stageValidation.status === "approved" ? "bg-emerald-500/20 text-white border-white/30" :
                        stageValidation.status === "rejected" ? "bg-red-500/20 text-white border-white/30" :
                        "bg-amber-500/20 text-white border-white/30"
                      }>
                        Coach : {stageValidation.status === "approved" ? "Validée ✓" : stageValidation.status === "rejected" ? "Refusée" : "En attente"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="tasks" className="p-6">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                  <TabsTrigger value="tasks"><ClipboardList className="w-4 h-4 mr-1" />Tâches</TabsTrigger>
                  <TabsTrigger value="resources"><Sparkles className="w-4 h-4 mr-1" />Ressources</TabsTrigger>
                  <TabsTrigger value="kpis"><Target className="w-4 h-4 mr-1" />KPIs</TabsTrigger>
                  <TabsTrigger value="next">Next steps</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-4 space-y-2">
                  {stage.tasks.map((t) => {
                    const done = completed.has(`${stage.id}:${t.id}`);
                    return (
                      <button key={t.id} onClick={() => toggleTask(stage, t.id, t.points || 10)} disabled={!stageUnlocked(stage.id)}
                        className="flex items-center justify-between gap-3 w-full p-3 rounded-md border hover:bg-muted/50 transition disabled:cursor-not-allowed disabled:opacity-50 text-left">
                        <div className="flex items-center gap-3">
                          {done ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                          <span className={done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">+{t.points || 10} pts</Badge>
                      </button>
                    );
                  })}
                  <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">Auto-évaluation et validation par un coach pour passer officiellement à l'étape suivante.</div>
                    <Button size="sm" disabled={stageProgress(stage.id) < 60 || stageValidation?.status === "pending"} onClick={() => setValidationOpen(true)}>
                      <Users className="w-4 h-4 mr-1" />
                      {stageValidation?.status === "pending" ? "Validation en attente" : "Demander validation coach"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-4 flex flex-wrap gap-2">
                  {stage.resources.map((r) => (
                    <Button key={r.label} variant="secondary" size="sm" asChild>
                      {r.to ? <Link to={r.to}>{r.label} →</Link> : <a href={r.href} target="_blank" rel="noreferrer">{r.label} →</a>}
                    </Button>
                  ))}
                  <Button variant="secondary" size="sm" asChild><Link to="/mentors">Réserver un mentor →</Link></Button>
                </TabsContent>

                <TabsContent value="kpis" className="mt-4 grid sm:grid-cols-2 gap-3">
                  {stage.kpis.map((k) => (
                    <Card key={k.id} className="p-4">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
                      <div className="text-xl font-bold mt-1">Cible : {k.target}</div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="next" className="mt-4 space-y-2">
                  {stage.recommendedNext.map((rec) => (
                    <div key={rec} className="flex items-start gap-2 p-3 rounded-md border bg-muted/30">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Mes candidatures + Leaderboard */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><ClipboardList className="w-4 h-4" />Mes Candidatures</h3>
              <Button size="sm" variant="outline" asChild><Link to="/candidatures">Tout voir →</Link></Button>
            </div>
            {applications.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">Aucune candidature pour le moment. <Link to="/financement" className="text-primary hover:underline">Explorer les programmes</Link></div>
            ) : (
              <ul className="space-y-2">
                {applications.slice(0, 5).map((a: any) => (
                  <li key={a.id} className="flex items-center justify-between text-sm p-2 rounded border">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{a.programs?.name || "Programme"}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.programs?.organization}</div>
                    </div>
                    <Badge variant={a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                      {APP_LABEL[a.status] || a.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" />Classement (opt-in)</h3>
              <span className="text-xs text-muted-foreground">{leaderboard.length} participants</span>
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">Personne n'a encore activé le classement. Soyez le premier !</div>
            ) : (
              <ol className="space-y-1.5">
                {leaderboard.slice(0, 8).map((row, i) => (
                  <li key={i} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 text-center font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"}`}>{i + 1}</span>
                      <span className="truncate max-w-[180px]">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{row.current_streak}</span>
                      <span className="font-semibold">{row.points} pts</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </main>

      {/* Validation dialog */}
      <Dialog open={validationOpen} onOpenChange={setValidationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation de l'étape {stage.name}</DialogTitle>
            <DialogDescription>Auto-évaluez votre maîtrise et joignez vos preuves. Un coach examinera votre demande.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm"><span>Auto-évaluation</span><span className="font-bold">{selfScore}/100</span></div>
              <Slider value={[selfScore]} onValueChange={(v) => setSelfScore(v[0])} min={0} max={100} step={5} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Preuves et notes</label>
              <Textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} rows={4} maxLength={2000} placeholder="Liens, métriques, livrables réalisés..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidationOpen(false)}>Annuler</Button>
            <Button onClick={requestValidation}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
