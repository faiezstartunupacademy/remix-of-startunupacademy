import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Map, FileText, GraduationCap, Users, Calendar, Wallet, Network, Settings, Bell, Sparkles, ArrowRight, TrendingUp, BookOpen, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";

const NAV = [
  { title: "Mon Parcours", icon: Map, url: "/mission-control" },
  { title: "Mon Dossier", icon: FileText, url: "/profil/donnees" },
  { title: "Mes Programmes", icon: GraduationCap, url: "/formations" },
  { title: "Mon Équipe", icon: Users, url: "/pole-strategique" },
  { title: "Sessions Mentorat", icon: Calendar, url: "/mission-control" },
  { title: "Financement & Aides", icon: Wallet, url: "/communaute/invest" },
  { title: "Réseau Alumni", icon: Network, url: "/communaute" },
  { title: "Paramètres", icon: Settings, url: "/profil/consentement" },
];

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

const MissionControl = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scores, setScores] = useState({ profile: 0, programs: 0, mentoring: 0, milestones: 0, documents: 0 });
  const [sessions, setSessions] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (!prof || !prof.onboarding_completed) { navigate("/onboarding"); return; }
      setProfile(prof as Profile);

      const [{ data: parts }, { data: sess }, { data: mils }, { data: docs }] = await Promise.all([
        supabase.from("formation_participants").select("id").eq("user_id", user.id),
        supabase.from("mentoring_sessions").select("*").eq("user_id", user.id).order("scheduled_at", { ascending: true }).limit(5),
        supabase.from("incubation_milestones").select("*").eq("user_id", user.id),
        supabase.from("startup_documents").select("id").eq("user_id", user.id),
      ]);

      const profFields = ["startup_name", "startup_sector", "startup_stage", "wilaya", "problem_statement"];
      const filled = profFields.filter(k => (prof as any)[k]).length;
      const profileScore = (filled / profFields.length) * 100;

      const completedMils = (mils || []).filter((m: any) => m.status === "completed").length;
      const completedSess = (sess || []).filter((s: any) => s.status === "completed").length;

      setScores({
        profile: profileScore,
        programs: Math.min(100, (parts?.length || 0) * 50),
        mentoring: Math.min(100, completedSess * 25),
        milestones: Math.min(100, completedMils * 20),
        documents: Math.min(100, (docs?.length || 0) * 20),
      });
      setSessions(sess || []);
      setMilestones(mils || []);
      setLoading(false);
    })();
  }, [navigate]);

  const healthScore = useMemo(() => Math.round((scores.profile + scores.programs + scores.mentoring + scores.milestones + scores.documents) / 5), [scores]);

  const nextStep = useMemo(() => {
    if (scores.profile < 100) return { title: "Compléter votre profil startup", desc: "Ajoutez les informations manquantes pour personnaliser votre parcours.", cta: "Compléter", url: "/onboarding" };
    if (scores.programs === 0) return { title: "Rejoindre votre première formation", desc: "Renforcez vos compétences avec nos modules dédiés.", cta: "Voir les formations", url: "/formations" };
    if (scores.milestones === 0) return { title: "Démarrer votre projet d'incubation", desc: "Lancez la première étape de votre parcours startup.", cta: "Pôle stratégique", url: "/pole-strategique" };
    if (scores.documents === 0) return { title: "Charger vos premiers documents", desc: "Constituez votre dossier startup (pitch, BP, etc).", cta: "Mon dossier", url: "/profil/donnees" };
    if (scores.mentoring < 50) return { title: "Planifier une session de mentorat", desc: "Échangez avec un expert pour accélérer votre projet.", cta: "Planifier", url: "/communaute" };
    return { title: "Vous êtes au top 🚀", desc: "Continuez à valider vos étapes pour rester en forme.", cta: "Voir mon parcours", url: "/pole-strategique" };
  }, [scores]);

  const resources = RESOURCES_BY_STAGE[profile?.startup_stage || "Idée"] || [];

  const gaugeData = [{ name: "score", value: healthScore, fill: healthScore >= 75 ? "hsl(var(--primary))" : healthScore >= 50 ? "hsl(var(--accent))" : "hsl(var(--destructive))" }];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Chargement du cockpit…</div></div>;
  }

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
            <div className="flex-1">
              <h1 className="font-semibold">Bienvenue, {profile?.full_name || "Founder"} 👋</h1>
              <p className="text-xs text-muted-foreground">{profile?.startup_name} · {profile?.startup_sector} · {profile?.wilaya}</p>
            </div>
            <Badge variant="outline" className="hidden md:flex">{profile?.startup_stage}</Badge>
          </header>

          <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl w-full mx-auto">
            {/* Health Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Ma Startup Health Score</CardTitle>
                  <CardDescription>Un score global de la santé de votre projet, mis à jour en temps réel.</CardDescription>
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
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="text-5xl font-bold">{healthScore}</motion.span>
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
              {/* Next Step */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-primary">Prochaine étape</Badge>
                    <CardTitle>{nextStep.title}</CardTitle>
                    <CardDescription>{nextStep.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate(nextStep.url)} className="gap-2">{nextStep.cta} <ArrowRight className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming sessions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-accent" /> Sessions de mentorat à venir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucune session planifiée.</p>
                    ) : (
                      <ul className="space-y-2">
                        {sessions.slice(0, 3).map(s => (
                          <li key={s.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/30">
                            <div>
                              <p className="font-medium">{s.topic || "Session"}</p>
                              <p className="text-xs text-muted-foreground">{s.mentor_name}</p>
                            </div>
                            <span className="text-xs">{new Date(s.scheduled_at).toLocaleDateString("fr-FR")}</span>
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MissionControl;
