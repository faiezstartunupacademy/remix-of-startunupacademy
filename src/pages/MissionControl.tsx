import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Map, FileText, GraduationCap, Users, Calendar, Wallet, Network, Settings, Sparkles, ArrowRight, TrendingUp, BookOpen, LogOut, Target, Layers, Activity, Flame, Briefcase, LineChart, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";
import { useUserRoles } from "@/hooks/useUserRoles";
import RoleSwitcher from "@/components/mission-control/RoleSwitcher";
import MentorView from "@/components/mission-control/views/MentorView";
import InvestorView from "@/components/mission-control/views/InvestorView";
import IncubatorView from "@/components/mission-control/views/IncubatorView";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const NAV = [
  { title: "Mon Parcours", icon: Map, url: "/roadmap" },
  { title: "Mon Dossier", icon: FileText, url: "/profil/donnees" },
  { title: "Mes Programmes", icon: GraduationCap, url: "/formations" },
  { title: "Mon Équipe", icon: Users, url: "/pole-strategique" },
  { title: "Mentorat", icon: Calendar, url: "/mentors" },
  { title: "Financement", icon: Wallet, url: "/financement" },
  { title: "Deal Room", icon: Briefcase, url: "/deal-room" },
  { title: "Communauté", icon: Network, url: "/communaute" },
  { title: "Market Intel", icon: LineChart, url: "/market-intelligence" },
  { title: "Paramètres", icon: Settings, url: "/profil/consentement" },
];

const ALL_MODULES = [
  { id: "parcours", title: "Mon Parcours", url: "/roadmap", icon: Map, color: "text-blue-600" },
  { id: "programs", title: "Formations", url: "/formations", icon: GraduationCap, color: "text-violet-600" },
  { id: "strategic", title: "Pôle Stratégique", url: "/pole-strategique", icon: Layers, color: "text-fuchsia-600" },
  { id: "mentoring", title: "Mentorat", url: "/mentors", icon: Users, color: "text-amber-600" },
  { id: "funding", title: "Financement", url: "/financement", icon: Wallet, color: "text-emerald-600" },
  { id: "dealroom", title: "Deal Room", url: "/deal-room", icon: Briefcase, color: "text-rose-600" },
  { id: "community", title: "Communauté", url: "/communaute", icon: Network, color: "text-sky-600" },
  { id: "market", title: "Market Intel", url: "/market-intelligence", icon: LineChart, color: "text-orange-600" },
] as const;

const RESOURCES_BY_STAGE: Record<string, Array<{ title: string; url: string }>> = {
  "Idée": [
    { title: "Design Thinking — Idéation", url: "/formation/design-thinking" },
    { title: "Lean Canvas Lab", url: "/lean-canvas-lab" },
    { title: "Effectuation", url: "/fondements/effectuation" },
  ],
  "MVP": [
    { title: "Disciplined Entrepreneurship", url: "/formation/disciplined-entrepreneurship" },
    { title: "MVP Validator", url: "/pole-strategique" },
    { title: "Business Model Patterns", url: "/formation/business-model" },
  ],
  "Lancée": [
    { title: "Growth Hacking", url: "/formation/growth-hacking" },
    { title: "Startup Marketing", url: "/formation/startup-marketing" },
    { title: "Market Intelligence", url: "/market-intelligence" },
  ],
};

type Profile = {
  full_name: string | null; startup_name: string | null; startup_stage: string | null;
  startup_sector: string | null; wilaya: string | null; problem_statement: string | null;
  role_type: string | null; onboarding_completed: boolean;
};

type ModuleCounts = {
  parcours: number; programs: number; strategic: number; mentoring: number;
  funding: number; dealroom: number; community: number; market: number;
};

const MissionControl = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [scores, setScores] = useState({ profile: 0, programs: 0, mentoring: 0, milestones: 0, documents: 0 });
  const [sessions, setSessions] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [journeyDone, setJourneyDone] = useState(0);
  const [streak, setStreak] = useState<{ current: number; longest: number; points: number } | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [moduleCounts, setModuleCounts] = useState<ModuleCounts>({ parcours: 0, programs: 0, strategic: 0, mentoring: 0, funding: 0, dealroom: 0, community: 0, market: 0 });
  const [strategicEligibility, setStrategicEligibility] = useState<{
    status: "none" | "pending" | "validated" | "rejected";
    title?: string;
    theme?: string;
    reason?: string | null;
    participants?: number;
    date?: string;
  }>({ status: "none" });
  const [loading, setLoading] = useState(true);
  const { roles, activeRole, setActiveRole } = useUserRoles(userId);

  const loadAll = useCallback(async (uid: string, prof: Profile) => {
    const [
      { data: parts },
      { data: sess },
      { data: mils },
      { data: docs },
      { data: journey },
      { data: strk },
      { data: bdg },
      { data: apps },
      { data: deals },
      { data: posts },
    ] = await Promise.all([
      supabase.from("formation_participants").select("id").eq("user_id", uid),
      supabase.from("mentoring_sessions").select("*").eq("user_id", uid).order("scheduled_at", { ascending: true }).limit(5),
      supabase.from("incubation_milestones").select("*").eq("user_id", uid),
      supabase.from("startup_documents").select("id").eq("user_id", uid),
      supabase.from("startup_journey_progress").select("id, completed").eq("user_id", uid),
      supabase.from("journey_streaks").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("journey_badges").select("*").eq("user_id", uid),
      supabase.from("funding_applications").select("id").eq("user_id", uid),
      supabase.from("deal_room_deals").select("id").eq("user_id", uid),
      supabase.from("community_posts").select("id").eq("user_id", uid),
    ]);

    const profFields = ["startup_name", "startup_sector", "startup_stage", "wilaya", "problem_statement"];
    const filled = profFields.filter(k => (prof as any)[k]).length;
    const profileScore = (filled / profFields.length) * 100;
    const completedMils = (mils || []).filter((m: any) => m.status === "completed").length;
    const completedSess = (sess || []).filter((s: any) => s.status === "completed").length;
    const journeyCompleted = (journey || []).filter((j: any) => j.completed).length;

    setScores({
      profile: profileScore,
      programs: Math.min(100, (parts?.length || 0) * 50),
      mentoring: Math.min(100, completedSess * 25),
      milestones: Math.min(100, completedMils * 20),
      documents: Math.min(100, (docs?.length || 0) * 20),
    });
    setSessions(sess || []);
    setMilestones(mils || []);
    setJourneyDone(journeyCompleted);
    setStreak(strk ? { current: strk.current_streak || 0, longest: strk.longest_streak || 0, points: strk.total_points || 0 } : { current: 0, longest: 0, points: 0 });
    setBadges(bdg || []);
    setModuleCounts({
      parcours: journeyCompleted,
      programs: parts?.length || 0,
      strategic: completedMils,
      mentoring: sess?.length || 0,
      funding: apps?.length || 0,
      dealroom: deals?.length || 0,
      community: posts?.length || 0,
      market: 0,
    });

    // Strategic Pole eligibility based on trainer-animated sessions
    const { data: trainerSess } = await supabase
      .from("trainer_animated_sessions" as any)
      .select("*")
      .eq("trainer_user_id", uid)
      .order("scheduled_date", { ascending: false });
    const list = (trainerSess || []) as any[];
    if (list.length === 0) {
      setStrategicEligibility({ status: "none" });
    } else {
      const validated = list.find(s => s.status === "validated");
      const rejected = list.find(s => s.status === "rejected");
      const pending = list.find(s => s.status === "planned" || s.status === "completed");
      if (validated) {
        setStrategicEligibility({ status: "validated", title: validated.title, theme: validated.theme, participants: validated.participants_count, date: validated.validated_at || validated.scheduled_date });
      } else if (pending) {
        setStrategicEligibility({ status: "pending", title: pending.title, theme: pending.theme, participants: pending.participants_count, date: pending.scheduled_date });
      } else if (rejected) {
        setStrategicEligibility({ status: "rejected", title: rejected.title, theme: rejected.theme, reason: rejected.admin_notes, participants: rejected.participants_count, date: rejected.scheduled_date });
      } else {
        setStrategicEligibility({ status: "none" });
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      // First login (email or Google) without a chosen role → onboarding
      if (!prof || !(prof as any).role_type) {
        navigate("/onboarding");
        return;
      }
      const safeProf: Profile = prof as any;
      setProfile(safeProf);
      setUserId(user.id);
      await loadAll(user.id, safeProf);
    })();
  }, [navigate, loadAll]);


  // Realtime: any change in user data refreshes KPIs
  useEffect(() => {
    if (!userId || !profile) return;
    const reload = () => loadAll(userId, profile);
    const channel = supabase
      .channel("mission-control-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "startup_journey_progress", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "incubation_milestones", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "mentoring_sessions", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "funding_applications", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "deal_room_deals", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "journey_streaks", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "journey_badges", filter: `user_id=eq.${userId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "trainer_animated_sessions", filter: `trainer_user_id=eq.${userId}` }, reload)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, profile, loadAll]);

  const healthScore = useMemo(() => Math.round((scores.profile + scores.programs + scores.mentoring + scores.milestones + scores.documents) / 5), [scores]);
  const connectedModules = useMemo(() => Object.values(moduleCounts).filter(c => c > 0).length, [moduleCounts]);
  const goalsReached = journeyDone + milestones.filter(m => m.status === "completed").length + badges.length;

  const recommendedActions = useMemo(() => {
    const acts: Array<{ icon: any; title: string; desc: string; url: string; priority: "high" | "medium" | "low" }> = [];
    if (scores.profile < 100) acts.push({ icon: FileText, title: "Compléter votre profil startup", desc: "Personnalisez vos recommandations.", url: "/onboarding", priority: "high" });
    if (moduleCounts.strategic === 0) acts.push({ icon: Layers, title: "Démarrer le Pôle Stratégique", desc: "Validez votre première étape d'incubation.", url: "/pole-strategique", priority: "high" });
    if (moduleCounts.programs === 0) acts.push({ icon: GraduationCap, title: "Suivre une formation", desc: "Renforcez vos compétences clés.", url: "/formations", priority: "medium" });
    if (moduleCounts.mentoring === 0) acts.push({ icon: Users, title: "Planifier une session mentorat", desc: "Échangez avec un expert.", url: "/mentors", priority: "medium" });
    if (moduleCounts.funding === 0) acts.push({ icon: Wallet, title: "Postuler à un programme de financement", desc: "Découvrez les appels ouverts en TN.", url: "/financement", priority: "medium" });
    if (moduleCounts.dealroom === 0 && (profile?.startup_stage === "MVP" || profile?.startup_stage === "Lancée")) {
      acts.push({ icon: Briefcase, title: "Préparer votre Deal Room", desc: "Structurez votre levée et pipeline investisseurs.", url: "/deal-room", priority: "low" });
    }
    if (moduleCounts.market === 0) acts.push({ icon: LineChart, title: "Générer un rapport Market Intel", desc: "Obtenez vos insights de marché.", url: "/market-intelligence", priority: "low" });
    if (acts.length === 0) acts.push({ icon: Sparkles, title: "Vous êtes au top 🚀", desc: "Continuez à valider vos étapes.", url: "/roadmap", priority: "low" });
    return acts.slice(0, 4);
  }, [scores, moduleCounts, profile]);

  const resources = RESOURCES_BY_STAGE[profile?.startup_stage || "Idée"] || [];
  const gaugeData = [{ name: "score", value: healthScore, fill: healthScore >= 75 ? "hsl(var(--primary))" : healthScore >= 50 ? "hsl(var(--accent))" : "hsl(var(--destructive))" }];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Chargement du cockpit…</div></div>;
  }

  const kpis = [
    { label: "Goals atteints", value: goalsReached, icon: Target, sub: `${badges.length} badge(s)`, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Modules connectés", value: `${connectedModules}/${ALL_MODULES.length}`, icon: Layers, sub: "modules actifs", color: "text-violet-600 bg-violet-500/10" },
    { label: "Taux d'avancement", value: `${healthScore}%`, icon: Activity, sub: "santé globale", color: "text-blue-600 bg-blue-500/10" },
    { label: "Série quotidienne", value: streak?.current ?? 0, icon: Flame, sub: `${streak?.points ?? 0} pts · record ${streak?.longest ?? 0}`, color: "text-orange-600 bg-orange-500/10" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4 border-b">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="group-data-[collapsible=icon]:hidden">Mission Control</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
                      <LogOut className="h-4 w-4" /><span>Déconnexion</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b px-4 gap-3 sticky top-0 bg-background/95 backdrop-blur z-10">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">Bienvenue, {profile?.full_name || "Founder"} 👋</h1>
              <p className="text-xs text-muted-foreground truncate">{profile?.startup_name} · {profile?.startup_sector} · {profile?.wilaya}</p>
            </div>
            <Badge className="hidden sm:flex bg-primary/15 text-primary border-primary/30 gap-1">
              <Sparkles className="h-3 w-3" /> Stade : {profile?.startup_stage || "—"}
            </Badge>
            <Badge variant="outline" className="hidden md:flex gap-1 text-xs">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Temps réel
            </Badge>
            <RoleSwitcher roles={roles} activeRole={activeRole} onChange={setActiveRole} />
          </header>

          <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl w-full mx-auto">
            {activeRole === "mentor" && userId && <MentorView userId={userId} />}
            {activeRole === "investor" && <InvestorView />}
            {activeRole === "incubator" && <IncubatorView />}
            {(activeRole === null || activeRole === "startuper") && (<>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {kpis.map((k, i) => (
                <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{k.label}</p>
                        <p className="text-2xl font-bold mt-1">{k.value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</p>
                      </div>
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${k.color}`}>
                        <k.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick access strip — Forum & Communauté / Pôle Stratégique Formations / Mes Programmes */}
            <div className="grid md:grid-cols-3 gap-3">
              <Link to="/communaute/forum" className="group rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-emerald-500/15 flex items-center justify-center"><Users className="h-5 w-5 text-emerald-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Forum & Communauté</p>
                    <p className="text-[11px] text-muted-foreground truncate">Discussions, formations & collab temps réel</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition" />
                </div>
              </Link>
              <Link to="/communaute/devenir-formateur" className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/5 p-4 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Pôle Stratégique — Formations</p>
                    <p className="text-[11px] text-muted-foreground truncate">Animer une formation pour débloquer l'accès</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition" />
                </div>
              </Link>
              <Link to="/formations" className="group rounded-xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-4 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-violet-500/15 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-violet-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Mes Programmes</p>
                    <p className="text-[11px] text-muted-foreground truncate">Catalogue des formations & parcours</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition" />
                </div>
              </Link>
            </div>

            {/* Strategic Pole eligibility indicator */}
            {(() => {
              const e = strategicEligibility;
              const cfg = {
                none:      { label: "Non demandé",  cls: "border-muted bg-muted/30",                                  badge: "bg-muted text-muted-foreground",                                 icon: ShieldCheck, iconCls: "text-muted-foreground", desc: "Animez une formation (15+ participants) pour débloquer l'accès au Pôle Stratégique." },
                pending:   { label: "En attente",   cls: "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/5", badge: "bg-amber-500/15 text-amber-700 border-amber-500/30",   icon: Activity,    iconCls: "text-amber-600",         desc: "Votre formation est en cours d'examen par un administrateur." },
                validated: { label: "Validé ✓",     cls: "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5", badge: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30", icon: ShieldCheck, iconCls: "text-emerald-600",       desc: "Accès complet au Pôle Stratégique débloqué." },
                rejected:  { label: "Refusé",       cls: "border-destructive/40 bg-gradient-to-br from-destructive/10 to-rose-500/5", badge: "bg-destructive/15 text-destructive border-destructive/30", icon: ShieldCheck, iconCls: "text-destructive",       desc: "Votre dernière demande n'a pas été validée." },
              }[e.status];
              const Icon = cfg.icon;
              return (
                <Card className={`border-2 ${cfg.cls}`}>
                  <CardContent className="p-4 flex items-start gap-4 flex-wrap">
                    <div className="h-11 w-11 rounded-lg bg-background flex items-center justify-center shrink-0">
                      <Icon className={`h-5 w-5 ${cfg.iconCls}`} />
                    </div>
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">Éligibilité Pôle Stratégique</p>
                        <Badge variant="outline" className={`text-[11px] ${cfg.badge}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {e.title ? <span><b>{e.title}</b>{e.theme && <> · {e.theme}</>}{typeof e.participants === "number" && <> · {e.participants} participant·e·s</>}</span> : cfg.desc}
                      </p>
                      {e.status === "rejected" && (
                        <div className="mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20 text-xs">
                          <b className="text-destructive">Raison du refus : </b>
                          <span className="text-foreground/80">{e.reason || "Non précisée par l'administrateur."}</span>
                        </div>
                      )}
                      {e.status === "pending" && (
                        <p className="text-[11px] text-amber-700 mt-1.5">⏳ Décision habituellement rendue sous 48–72h.</p>
                      )}
                    </div>
                    <Button asChild size="sm" variant={e.status === "validated" ? "default" : "outline"} className="shrink-0">
                      <Link to={e.status === "validated" ? "/pole-strategique" : "/communaute/devenir-formateur"} className="gap-1">
                        {e.status === "validated" ? "Accéder au Pôle" : e.status === "rejected" ? "Re-soumettre" : "Gérer mes formations"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })()}




            {/* Active modules */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><Layers className="h-4 w-4 text-primary" /> Modules actifs</CardTitle>
                <CardDescription>Cliquez sur un module pour accéder à votre espace. Les compteurs se mettent à jour en temps réel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ALL_MODULES.map(m => {
                    const count = moduleCounts[m.id as keyof ModuleCounts];
                    const active = count > 0;
                    return (
                      <Link key={m.id} to={m.url} className={`group rounded-lg border p-3 transition hover:border-primary hover:shadow-sm ${active ? "bg-card" : "bg-muted/30 border-dashed"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <m.icon className={`h-5 w-5 ${active ? m.color : "text-muted-foreground"}`} />
                          {active ? (
                            <Badge variant="secondary" className="text-[10px] h-5">{count}</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5">Inactif</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{m.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 group-hover:text-primary transition">
                          {active ? "Continuer →" : "Activer →"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Health Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Ma Startup Health Score</CardTitle>
                  <CardDescription>Score global mis à jour en temps réel à chaque action.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="h-56 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                          <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(var(--muted))" }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <motion.span key={healthScore} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="text-5xl font-bold">{healthScore}</motion.span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      {[
                        { label: "Profil complet", val: scores.profile },
                        { label: "Programmes", val: scores.programs },
                        { label: "Sessions mentorat", val: scores.mentoring },
                        { label: "Milestones", val: scores.milestones },
                        { label: "Documents", val: scores.documents },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{s.label}</span><span className="font-medium">{Math.round(s.val)}%</span>
                          </div>
                          <Progress value={s.val} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommended actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-primary">Actions recommandées</Badge>
                    <CardTitle>Prochaines étapes pour vous</CardTitle>
                    <CardDescription>Personnalisé selon votre stade « {profile?.startup_stage} » et votre activité.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recommendedActions.map((a, idx) => (
                      <button key={idx} onClick={() => navigate(a.url)} className="w-full text-left flex items-center gap-3 p-2.5 rounded-md hover:bg-background/60 transition group">
                        <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${a.priority === "high" ? "bg-destructive/15 text-destructive" : a.priority === "medium" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}>
                          <a.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming sessions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-accent" /> Prochaines sessions</CardTitle>
                    <CardDescription>Mentorat et rendez-vous à venir</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">Aucune session planifiée.</p>
                        <Button size="sm" variant="outline" onClick={() => navigate("/mentors")}>Planifier maintenant</Button>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {sessions.slice(0, 4).map(s => (
                          <li key={s.id} className="flex justify-between items-center text-sm p-2.5 rounded-md bg-muted/30">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{s.topic || "Session"}</p>
                              <p className="text-xs text-muted-foreground truncate">{s.mentor_name || "Mentor"}</p>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <p className="text-xs font-medium">{new Date(s.scheduled_at).toLocaleDateString("fr-FR")}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(s.scheduled_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Milestones timeline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-primary" /> Mes milestones</CardTitle>
                    <CardDescription>{milestones.filter(m => m.status === "completed").length}/{milestones.length || "?"} complétés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {milestones.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun milestone défini. <Link to="/pole-strategique" className="text-primary underline">Démarrer</Link></p>
                    ) : (
                      <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {milestones.slice(0, 5).map(m => (
                          <li key={m.id} className="text-sm flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${m.status === "completed" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            <span className={m.status === "completed" ? "line-through text-muted-foreground" : ""}>{m.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recommended resources */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-accent" /> Ressources recommandées</CardTitle>
                    <CardDescription>Sélection pour le stade « {profile?.startup_stage} »</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resources.map(r => (
                        <li key={r.url}>
                          <Link to={r.url} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm">
                            <span>{r.title}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            </>)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MissionControl;
