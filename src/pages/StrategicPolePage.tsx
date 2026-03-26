import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, Rocket, Users, AlertTriangle, BarChart3, Map,
  Plus, MessageSquare, ChevronRight, Trash2, Loader2,
  Send, Bot, User as UserIcon, ArrowLeft, GraduationCap,
  BookOpen, Mic, Sparkles, CheckCircle2, Target, DollarSign,
  Clock, ShieldCheck, Lock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import StartupStageSelector, { EARLY_STAGES } from "@/components/strategic/StartupStageSelector";
import IncubationSpace from "@/components/strategic/IncubationSpace";
import ReportExport from "@/components/strategic/ReportExport";
import BusinessPlanGenerator from "@/components/strategic/BusinessPlanGenerator";
import InvestSpace from "@/components/strategic/InvestSpace";

const PHASES = [
  { id: 1, name: "Disruption", icon: Zap, color: "from-violet-500 to-purple-600", bgLight: "bg-violet-500/10", textColor: "text-violet-600", description: "Identification de la disruption" },
  { id: 2, name: "Réglementaire", icon: Shield, color: "from-blue-500 to-cyan-600", bgLight: "bg-blue-500/10", textColor: "text-blue-600", description: "Certifications, Brevets, Normes" },
  { id: 3, name: "Running Lean", icon: Rocket, color: "from-emerald-500 to-green-600", bgLight: "bg-emerald-500/10", textColor: "text-emerald-600", description: "Lean Canvas & MVP Roadmap" },
  { id: 4, name: "MVP ↔ Personas", icon: Users, color: "from-amber-500 to-orange-600", bgLight: "bg-amber-500/10", textColor: "text-amber-600", description: "Analyse MVP & Personas" },
  { id: 5, name: "Risques", icon: AlertTriangle, color: "from-red-500 to-rose-600", bgLight: "bg-red-500/10", textColor: "text-red-600", description: "Risques systémiques" },
  { id: 6, name: "Métriques", icon: BarChart3, color: "from-teal-500 to-emerald-600", bgLight: "bg-teal-500/10", textColor: "text-teal-600", description: "Métriques combinées" },
  { id: 7, name: "Plan Tactique", icon: Map, color: "from-indigo-500 to-blue-600", bgLight: "bg-indigo-500/10", textColor: "text-indigo-600", description: "Plan d'implémentation 12 mois" },
];

type Project = {
  id: string; name: string; sector: string | null; description: string | null;
  current_phase: number; startup_stage: string; has_idea: boolean;
  incubation_active: boolean; completed_at: string | null; created_at: string;
};

type Message = {
  id: string; role: "user" | "assistant"; content: string; phase: number; created_at: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strategic-orchestrator`;
const EARLY_STAGE_REQUIRING_FORMATION = ["student", "student-entrepreneur", "pre-seed"];

const StrategicPolePage = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectSector, setNewProjectSector] = useState("");
  const [newProjectStage, setNewProjectStage] = useState("student");
  const [newProjectHasIdea, setNewProjectHasIdea] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [viewMode, setViewMode] = useState<"phases" | "incubation" | "business-plan" | "invest">("phases");
  const [formationAccess, setFormationAccess] = useState<{ hasAccess: boolean; score: number; level: string } | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessRequest, setAccessRequest] = useState<{ status: string; id: string } | null>(null);
  const [requestForm, setRequestForm] = useState({ startup_name: "", sector: "", motivation: "" });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [accessDiscussions, setAccessDiscussions] = useState<any[]>([]);
  const [discussionInput, setDiscussionInput] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || authLoading) return;
    if (isAdmin) { setFormationAccess({ hasAccess: true, score: 100, level: "expert" }); setCheckingAccess(false); return; }
    const checkAccess = async () => {
      // Check formation score
      const { data } = await supabase.from("formation_completions" as any).select("score, access_level")
        .eq("user_id", user.id).gte("score", 70).order("score", { ascending: false }).limit(1);
      if (data && (data as any[]).length > 0) {
        const best = (data as any[])[0];
        setFormationAccess({ hasAccess: true, score: best.score, level: best.access_level });
      } else {
        setFormationAccess({ hasAccess: false, score: 0, level: "none" });
        setCheckingAccess(false);
        return;
      }
      // Check access request status
      const { data: reqData } = await supabase
        .from("strategic_access_requests" as any)
        .select("id, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (reqData && (reqData as any[]).length > 0) {
        setAccessRequest(reqData[0] as any);
      }
      setCheckingAccess(false);
    };
    checkAccess();
  }, [user, authLoading, isAdmin]);

  // Load discussions for user's access request
  useEffect(() => {
    if (!accessRequest?.id || accessRequest.status === "approved") return;
    const loadDiscussions = async () => {
      const { data } = await supabase
        .from("strategic_discussions" as any)
        .select("*")
        .eq("request_id", accessRequest.id)
        .order("created_at", { ascending: true });
      if (data) setAccessDiscussions(data as any);
    };
    loadDiscussions();

    const channel = supabase
      .channel("user-access-discussions")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "strategic_discussions", filter: `request_id=eq.${accessRequest.id}` },
        (payload) => setAccessDiscussions(prev => [...prev, payload.new as any])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [accessRequest?.id]);

  const submitAccessRequest = async () => {
    if (!user) return;
    setSubmittingRequest(true);
    try {
      const profile = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
      const { data, error } = await supabase.from("strategic_access_requests" as any).insert({
        user_id: user.id,
        user_name: profile.data?.full_name || user.email?.split("@")[0],
        user_email: user.email,
        startup_name: requestForm.startup_name || null,
        sector: requestForm.sector || null,
        motivation: requestForm.motivation || null,
      } as any).select().single();
      if (error) throw error;
      setAccessRequest({ id: (data as any).id, status: "pending" });

      // Notify all admins
      const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
      if (admins) {
        const notifications = admins.map(a => ({
          user_id: a.user_id,
          type: "strategic_access_request",
          title: "🔔 Nouvelle demande d'accès",
          message: `${profile.data?.full_name || user.email} demande l'accès au Pôle Stratégique${requestForm.startup_name ? ` — ${requestForm.startup_name}` : ""}`,
          link: "/admin",
        }));
        await supabase.from("notifications" as any).insert(notifications);
      }

      toast({ title: "✅ Demande envoyée", description: "L'administrateur examinera votre demande." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const sendDiscussionMessage = async () => {
    if (!discussionInput.trim() || !user || !accessRequest) return;
    await supabase.from("strategic_discussions" as any).insert({
      request_id: accessRequest.id,
      sender_id: user.id,
      content: discussionInput.trim(),
      is_admin: false,
    } as any);
    setDiscussionInput("");
  };

  const hasStrategicAccess = isAdmin || accessRequest?.status === "approved";

  // Listen for real-time approval updates
  useEffect(() => {
    if (!user || !accessRequest || accessRequest.status !== "pending") return;
    const channel = supabase
      .channel("access-approval-listener")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "strategic_access_requests", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newStatus = (payload.new as any).status;
          if (newStatus === "approved") {
            setAccessRequest({ ...accessRequest, status: "approved" });
            toast({ title: "🎉 Accès débloqué !", description: "Votre accès au Pôle Stratégique a été approuvé. Les 4 espaces sont maintenant disponibles." });
          } else if (newStatus === "rejected") {
            setAccessRequest({ ...accessRequest, status: "rejected" });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, accessRequest?.id]);

  useEffect(() => { if (user && formationAccess?.hasAccess && hasStrategicAccess) loadProjects(); }, [user, formationAccess, hasStrategicAccess]);
  useEffect(() => {
    if (activeProject) {
      loadMessages(activeProject.id);
      setActivePhase(activeProject.current_phase);
      setViewMode(activeProject.incubation_active ? "incubation" : "phases");
    }
  }, [activeProject?.id]);

  const loadProjects = async () => {
    const { data, error } = await supabase.from("strategic_projects").select("*").order("updated_at", { ascending: false });
    if (!error && data) setProjects(data.map(p => ({
      ...p, startup_stage: (p as any).startup_stage || "student", has_idea: (p as any).has_idea || false,
      incubation_active: (p as any).incubation_active || false, completed_at: (p as any).completed_at || null,
    })));
    setLoadingProjects(false);
  };

  const loadMessages = async (projectId: string) => {
    const { data, error } = await supabase.from("strategic_messages").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
    if (!error && data) setMessages(data as Message[]);
  };

  const isEarlyStage = EARLY_STAGES.includes(newProjectStage);

  const createProject = async () => {
    if (!user) return;
    const projectName = isEarlyStage ? `Projet ${new Date().toLocaleDateString("fr-FR")}` : newProjectName.trim();
    if (!isEarlyStage && !projectName) return;
    const { data, error } = await supabase.from("strategic_projects").insert({
      name: projectName, sector: isEarlyStage ? null : (newProjectSector.trim() || null),
      user_id: user.id, startup_stage: newProjectStage, has_idea: isEarlyStage ? newProjectHasIdea : true,
    } as any).select().single();
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else if (data) {
      const project = { ...data, startup_stage: (data as any).startup_stage || "student", has_idea: (data as any).has_idea || false, incubation_active: false, completed_at: null } as Project;
      setProjects(prev => [project, ...prev]);
      setActiveProject(project);
      setShowNewProject(false); setNewProjectName(""); setNewProjectSector(""); setNewProjectStage("student"); setNewProjectHasIdea(false);
    }
  };

  const deleteProject = async (id: string) => {
    await supabase.from("strategic_projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) { setActiveProject(null); setMessages([]); }
  };

  const activateIncubation = async () => {
    if (!activeProject) return;
    await supabase.from("strategic_projects").update({ incubation_active: true, completed_at: new Date().toISOString(), current_phase: 7 } as any).eq("id", activeProject.id);
    setActiveProject({ ...activeProject, incubation_active: true, completed_at: new Date().toISOString() });
    setViewMode("incubation");
    toast({ title: "🎓 Incubation activée" });
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming || !activeProject || !user) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim(), phase: activePhase, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]); setInput(""); setIsStreaming(true);
    await supabase.from("strategic_messages").insert({ project_id: activeProject.id, user_id: user.id, role: "user", content: userMsg.content, phase: activePhase });

    let assistantContent = "";
    const assistantId = crypto.randomUUID();
    try {
      const chatMessages = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: chatMessages, phase: activePhase, startupStage: activeProject.startup_stage, hasIdea: activeProject.has_idea }),
      });
      if (!resp.ok || !resp.body) { const errData = await resp.json().catch(() => ({})); throw new Error(errData.error || "Erreur IA"); }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { id: assistantId, role: "assistant", content: assistantContent, phase: activePhase, created_at: new Date().toISOString() }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
      if (assistantContent) {
        await supabase.from("strategic_messages").insert({ project_id: activeProject.id, user_id: user.id, role: "assistant", content: assistantContent, phase: activePhase });
      }
    } catch (e: any) { toast({ title: "Erreur IA", description: e.message, variant: "destructive" }); }
    finally { setIsStreaming(false); }
  };

  if (authLoading || checkingAccess) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return null;

  // Formation gate for early-stage users
  if (!isAdmin && formationAccess && !formationAccess.hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg text-center p-8">
            <div className="p-4 rounded-full bg-amber-500/10 w-fit mx-auto mb-6"><GraduationCap className="h-12 w-12 text-amber-600" /></div>
            <h2 className="text-2xl font-bold mb-3">Formation requise</h2>
            <p className="text-muted-foreground mb-6">Score minimum de <strong>70/100</strong> requis pour accéder au Pôle Stratégique.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/formations")} className="gap-2"><GraduationCap className="h-4 w-4" /> Accéder aux formations</Button>
              <Button variant="ghost" onClick={() => navigate("/")}>Retour à l'accueil</Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show "Accès débloqué" banner when just approved
  const showAccessUnlockedBanner = !isAdmin && accessRequest?.status === "approved";

  // Access request gate (after formation check)
  if (!isAdmin && !hasStrategicAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full p-8">
            {!accessRequest ? (
              /* Request form */
              <div className="text-center space-y-6">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Demande d'accès requise</h2>
                  <p className="text-muted-foreground">L'accès au Pôle Stratégique nécessite une validation par l'administrateur.</p>
                </div>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <Input
                      placeholder="Nom de votre startup / projet"
                      value={requestForm.startup_name}
                      onChange={e => setRequestForm(p => ({ ...p, startup_name: e.target.value }))}
                    />
                    <Input
                      placeholder="Secteur (ex: FinTech, AgriTech, EdTech...)"
                      value={requestForm.sector}
                      onChange={e => setRequestForm(p => ({ ...p, sector: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Décrivez votre projet et votre motivation..."
                      value={requestForm.motivation}
                      onChange={e => setRequestForm(p => ({ ...p, motivation: e.target.value }))}
                      className="min-h-[80px]"
                    />
                    <Button onClick={submitAccessRequest} disabled={submittingRequest} className="w-full gap-2">
                      {submittingRequest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Envoyer la demande
                    </Button>
                  </CardContent>
                </Card>
                <Button variant="ghost" onClick={() => navigate("/")}>Retour à l'accueil</Button>
              </div>
            ) : accessRequest.status === "pending" ? (
              /* Pending state with discussion */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-amber-500/10 w-fit mx-auto mb-4">
                    <Clock className="h-12 w-12 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Demande en cours d'examen</h2>
                  <p className="text-muted-foreground">L'administrateur examinera votre demande prochainement. Vous serez notifié(e).</p>
                </div>

                {/* Discussion with admin */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Discussion avec l'administrateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ScrollArea className="max-h-60 min-h-[100px]">
                      {accessDiscussions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-6">Aucun message pour le moment. L'admin peut vous contacter ici.</p>
                      ) : (
                        <div className="space-y-2 pr-2">
                          {accessDiscussions.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                                msg.is_admin ? "bg-muted" : "bg-primary text-primary-foreground"
                              }`}>
                                <p className="text-[10px] font-medium mb-0.5 opacity-70">{msg.is_admin ? "Admin" : "Vous"}</p>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Envoyer un message..."
                        value={discussionInput}
                        onChange={e => setDiscussionInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendDiscussionMessage()}
                        className="h-9 text-sm"
                      />
                      <Button size="sm" className="h-9 px-3" onClick={sendDiscussionMessage}>
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button variant="ghost" onClick={() => navigate("/")}>Retour à l'accueil</Button>
                </div>
              </div>
            ) : (
              /* Rejected state */
              <div className="text-center space-y-6">
                <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
                  <Lock className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Demande refusée</h2>
                <p className="text-muted-foreground">Votre demande d'accès a été refusée. Contactez l'administrateur pour plus d'informations.</p>
                
                {/* Discussion */}
                <Card>
                  <CardContent className="pt-6">
                    <ScrollArea className="max-h-40">
                      <div className="space-y-2">
                        {accessDiscussions.map((msg: any) => (
                          <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                              msg.is_admin ? "bg-muted" : "bg-primary text-primary-foreground"
                            }`}>
                              <p className="text-[10px] font-medium mb-0.5 opacity-70">{msg.is_admin ? "Admin" : "Vous"}</p>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Envoyer un message..."
                        value={discussionInput}
                        onChange={e => setDiscussionInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendDiscussionMessage()}
                        className="h-9 text-sm"
                      />
                      <Button size="sm" className="h-9 px-3" onClick={sendDiscussionMessage}>
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="ghost" onClick={() => navigate("/")}>Retour à l'accueil</Button>
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const phasesWithMessages = new Set(messages.map(m => m.phase));
  const allPhasesComplete = PHASES.every(p => phasesWithMessages.has(p.id));
  const completedPhasesCount = PHASES.filter(p => phasesWithMessages.has(p.id)).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero - Redesigned */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                              radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)`
          }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
          <div className="container relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
              {showAccessUnlockedBanner && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300 font-semibold">Accès débloqué — 4 espaces disponibles</span>
                </motion.div>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-white/80 font-medium">{t("strategic.badge")}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
                {t("strategic.title")}
                <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t("strategic.titleHighlight")}
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">{t("strategic.desc")}</p>
              {/* Phase indicators */}
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {PHASES.map(phase => {
                  const Icon = phase.icon;
                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: phase.id * 0.08 }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                      title={phase.name}
                    >
                      <Icon className="h-4 w-4 text-white/50" />
                    </motion.div>
                  );
                })}
                <div className="mx-2 h-px w-4 bg-white/20" />
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                  title="Business Plan & Pitch">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          {!activeProject ? (
            /* ─── Project List ─── */
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold">{t("strategic.myProjects")}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("strategic.projectDesc")}</p>
                </div>
                <Button onClick={() => setShowNewProject(true)} className="gap-2 rounded-full shadow-lg">
                  <Plus className="h-4 w-4" /> {t("strategic.newProject")}
                </Button>
              </div>

              <AnimatePresence>
                {showNewProject && (
                  <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}>
                    <Card className="border-primary/30 shadow-lg shadow-primary/5">
                      <CardContent className="pt-6 space-y-4">
                        <StartupStageSelector stage={newProjectStage} hasIdea={newProjectHasIdea} onStageChange={setNewProjectStage} onHasIdeaChange={setNewProjectHasIdea} />
                        {!isEarlyStage && (
                          <>
                            <Input placeholder="Nom du projet (ex: FoodTech Platform)" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="h-12" />
                            <Input placeholder="Secteur (ex: AgriTech, FinTech, EdTech...)" value={newProjectSector} onChange={e => setNewProjectSector(e.target.value)} className="h-12" />
                          </>
                        )}
                        <div className="flex gap-2">
                          <Button onClick={createProject} disabled={!isEarlyStage && !newProjectName.trim()} className="h-11">Créer le projet</Button>
                          <Button variant="ghost" onClick={() => setShowNewProject(false)} className="h-11">Annuler</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {loadingProjects ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : projects.length === 0 ? (
                <Card className="text-center py-20 border-dashed border-2">
                  <CardContent>
                    <div className="p-4 rounded-2xl bg-primary/5 w-fit mx-auto mb-4">
                      <Rocket className="h-12 w-12 text-primary/40" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucun projet encore</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Créez votre premier projet pour commencer l'analyse stratégique IA en 7 phases.</p>
                    <Button onClick={() => setShowNewProject(true)} className="gap-2 rounded-full"><Plus className="h-4 w-4" /> Créer un projet</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((project, idx) => {
                    const projectPhasesComplete = new Set<number>();
                    // We don't have per-project messages here, so use progress bar based on current_phase
                    return (
                      <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Card className="cursor-pointer group relative overflow-hidden border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                          onClick={() => setActiveProject(project)}>
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.name}</CardTitle>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive"
                                onClick={e => { e.stopPropagation(); deleteProject(project.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex gap-2 flex-wrap mt-1">
                              {project.sector && <Badge variant="secondary" className="font-normal">{project.sector}</Badge>}
                              <Badge variant="outline" className="text-xs font-normal">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {project.startup_stage}
                              </Badge>
                              {project.incubation_active && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 text-xs">🎓 Incubation</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                {project.incubation_active ? "Incubation active" : `Phase ${project.current_phase}/7`}
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            {/* Phase progress */}
                            <div className="flex gap-1">
                              {PHASES.map(p => (
                                <div key={p.id} className={`h-2 flex-1 rounded-full transition-all ${
                                  p.id <= project.current_phase
                                    ? `bg-gradient-to-r ${p.color}`
                                    : "bg-muted"
                                }`} />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ─── Active Project ─── */
            <div className="max-w-6xl mx-auto">
              {/* Project header */}
              <div className="mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setActiveProject(null); setMessages([]); setViewMode("phases"); }}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-bold">{activeProject.name}</h2>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {activeProject.sector && <Badge variant="secondary">{activeProject.sector}</Badge>}
                        <Badge variant="outline" className="text-xs">{activeProject.has_idea ? "💡 Avec idée" : "🔍 Exploration"}</Badge>
                        <Badge variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {completedPhasesCount}/7 phases
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {/* View mode toggles */}
                    {allPhasesComplete && (
                      <>
                        <Button
                          variant={viewMode === "business-plan" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode(viewMode === "business-plan" ? "phases" : "business-plan")}
                          className="gap-1.5"
                        >
                          <BookOpen className="h-4 w-4" />
                          Business Plan & Pitch
                        </Button>
                        <Button
                          variant={viewMode === "invest" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode(viewMode === "invest" ? "phases" : "invest")}
                          className="gap-1.5 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        >
                          <DollarSign className="h-4 w-4" />
                          Invest
                        </Button>
                      </>
                    )}
                    {activeProject.incubation_active && (
                      <Button
                        variant={viewMode === "incubation" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode(viewMode === "incubation" ? "phases" : "incubation")}
                        className="gap-1.5"
                      >
                        <GraduationCap className="h-4 w-4" />
                        {viewMode === "incubation" ? "Voir les Phases" : "Espace Incubation"}
                      </Button>
                    )}
                    {allPhasesComplete && !activeProject.incubation_active && (
                      <Button onClick={activateIncubation} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20">
                        <GraduationCap className="h-4 w-4" /> Activer l'Incubation
                      </Button>
                    )}
                    {allPhasesComplete && (
                      <ReportExport projectName={activeProject.name} sector={activeProject.sector} messages={messages} startupStage={activeProject.startup_stage} />
                    )}
                  </div>
                </div>

                {/* Completion banner */}
                {allPhasesComplete && !activeProject.incubation_active && viewMode === "phases" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <Card className="border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-lg shadow-emerald-500/10">
                      <CardContent className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-emerald-700 dark:text-emerald-300">🎉 Les 7 phases sont complètes !</p>
                            <p className="text-sm text-muted-foreground">Générez votre Business Plan, activez l'incubation ou exportez le rapport PDF.</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button onClick={() => setViewMode("business-plan")} variant="outline" className="gap-2 border-emerald-300">
                            <BookOpen className="h-4 w-4" /> Business Plan
                          </Button>
                          <Button onClick={() => setViewMode("invest")} variant="outline" className="gap-2 border-amber-300 text-amber-700">
                            <DollarSign className="h-4 w-4" /> Invest
                          </Button>
                          <Button onClick={activateIncubation} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
                            <GraduationCap className="h-4 w-4" /> Incubation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* ─── Business Plan View ─── */}
              {viewMode === "business-plan" && allPhasesComplete ? (
                <BusinessPlanGenerator
                  projectName={activeProject.name}
                  sector={activeProject.sector}
                  messages={messages}
                  startupStage={activeProject.startup_stage}
                />
              ) : viewMode === "invest" && allPhasesComplete ? (
                <InvestSpace
                  projectId={activeProject.id}
                  projectName={activeProject.name}
                  sector={activeProject.sector}
                  startupStage={activeProject.startup_stage}
                  messages={messages}
                />
              ) : viewMode === "incubation" && activeProject.incubation_active ? (
                <IncubationSpace projectId={activeProject.id} projectName={activeProject.name} userId={user.id} sector={activeProject.sector} startupStage={activeProject.startup_stage} />
              ) : (
                <>
                  {/* ─── Phase Navigator - Redesigned ─── */}
                  <div className="mb-6">
                    <div className="grid grid-cols-7 gap-2">
                      {PHASES.map(phase => {
                        const Icon = phase.icon;
                        const isActive = activePhase === phase.id;
                        const hasContent = phasesWithMessages.has(phase.id);
                        return (
                          <button
                            key={phase.id}
                            onClick={() => setActivePhase(phase.id)}
                            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-br " + phase.color + " text-white shadow-lg scale-105"
                                : hasContent
                                  ? phase.bgLight + " " + phase.textColor + " border border-current/10"
                                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="hidden md:block truncate w-full text-center">{phase.name}</span>
                            <span className="md:hidden">{phase.id}</span>
                            {hasContent && !isActive && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phase Description */}
                  <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-muted/30 to-muted/10">
                    <CardContent className="py-3 flex items-center gap-3">
                      {(() => { const P = PHASES[activePhase - 1]; const Icon = P.icon; return (
                        <div className={`p-2 rounded-lg ${P.bgLight}`}><Icon className={`h-5 w-5 ${P.textColor}`} /></div>
                      ); })()}
                      <div className="flex-1">
                        <span className="font-semibold text-sm">Phase {activePhase} — {PHASES[activePhase - 1].name}</span>
                        <p className="text-xs text-muted-foreground">{PHASES[activePhase - 1].description}</p>
                      </div>
                      {activePhase === 2 && (
                        <div className="hidden md:flex gap-1 flex-wrap">
                          {["Certifications", "Brevets", "Normes", "Exigences"].map(bloc => (
                            <Badge key={bloc} variant="outline" className="text-xs">{bloc}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Chat Messages */}
                  <div className="bg-muted/10 rounded-2xl border min-h-[400px] max-h-[60vh] overflow-y-auto p-4 space-y-4 mb-4">
                    {messages.filter(m => m.phase === activePhase).length === 0 && (
                      <div className="text-center py-16 text-muted-foreground">
                        <div className="p-4 rounded-2xl bg-muted/30 w-fit mx-auto mb-4">
                          <Bot className="h-10 w-10 opacity-30" />
                        </div>
                        <p className="font-medium">Démarrez la Phase {activePhase}</p>
                        <p className="text-sm mt-1 max-w-md mx-auto">
                          {activePhase === 2
                            ? "L'IA analysera : Certifications → Brevets → Normes → Exigences"
                            : "Décrivez votre projet ou posez une question sur cette phase."}
                        </p>
                      </div>
                    )}
                    {messages.filter(m => m.phase === activePhase).map(msg => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border shadow-sm"}`}>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_table]:border [&_th]:border [&_td]:border [&_table]:border-border">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                        {msg.role === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <UserIcon className="h-4 w-4" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isStreaming && (
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> L'IA analyse...
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder={`Message pour Phase ${activePhase} — ${PHASES[activePhase - 1].name}...`}
                      disabled={isStreaming}
                      className="rounded-full h-12 shadow-sm"
                    />
                    <Button onClick={sendMessage} disabled={isStreaming || !input.trim()} size="icon" className="rounded-full h-12 w-12 shrink-0 shadow-lg">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategicPolePage;
