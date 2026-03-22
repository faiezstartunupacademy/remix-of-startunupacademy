import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, CheckCircle2, Clock, Plus, Send,
  Bot, Loader2, TrendingUp, Shield, BarChart3, Trash2, Users,
  Rocket, FileText, Zap, Globe, Upload, FileCheck, BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import TeamAnalyzer from "./TeamAnalyzer";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const CATEGORIES = [
  { value: "product", label: "Produit", icon: Target, color: "bg-blue-500/10 text-blue-600" },
  { value: "market", label: "Marché", icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
  { value: "legal", label: "Juridique", icon: Shield, color: "bg-amber-500/10 text-amber-600" },
  { value: "metrics", label: "Métriques", icon: BarChart3, color: "bg-purple-500/10 text-purple-600" },
  { value: "team", label: "Équipe", icon: Users, color: "bg-teal-500/10 text-teal-600" },
  { value: "ecosystem", label: "Écosystème", icon: Globe, color: "bg-indigo-500/10 text-indigo-600" },
  { value: "general", label: "Général", icon: CheckCircle2, color: "bg-muted text-muted-foreground" },
];

const INCUBATION_PHASES = [
  { id: 1, label: "Onboarding & Diagnostic", weeks: "S1-2", icon: FileText },
  { id: 2, label: "Problem/Solution Fit", weeks: "S3-6", icon: Target },
  { id: 3, label: "Validation MVP", weeks: "S7-12", icon: Rocket },
  { id: 4, label: "Financement & Déploiement", weeks: "S13+", icon: Zap },
];

// Auto-generated milestones per phase
const PHASE_MILESTONES: Record<number, { title: string; category: string }[]> = {
  1: [
    { title: "Upload et analyse du rapport initial (7 phases)", category: "general" },
    { title: "Diagnostic des forces et faiblesses de l'équipe", category: "team" },
    { title: "Cartographie de l'écosystème et partenaires potentiels", category: "ecosystem" },
    { title: "Identification des failles techniques pré-identifiées", category: "product" },
    { title: "Identification des failles commerciales pré-identifiées", category: "market" },
    { title: "Roadmap d'incubation personnalisée générée", category: "general" },
  ],
  2: [
    { title: "Trame d'interviews clients validée", category: "market" },
    { title: "Minimum 10 interviews clients réalisées", category: "market" },
    { title: "Analyse des retours clients documentée", category: "market" },
    { title: "Problem/Solution Fit validé ou pivot défini", category: "product" },
    { title: "Persona principal affiné avec données terrain", category: "market" },
  ],
  3: [
    { title: "Périmètre fonctionnel MVP défini", category: "product" },
    { title: "Critères d'acceptation et tests utilisateurs rédigés", category: "product" },
    { title: "Faisabilité technique évaluée vs ressources équipe", category: "team" },
    { title: "Business Model et Pricing définis", category: "market" },
    { title: "KPIs d'acquisition identifiés (CAC, LTV, Conversion)", category: "metrics" },
    { title: "Stratégie Go-To-Market ou LOI obtenues", category: "market" },
    { title: "Score maturité technique ≥ 7/10", category: "product" },
    { title: "Score maturité commerciale ≥ 7/10", category: "market" },
  ],
  4: [
    { title: "Pitch deck finalisé et validé", category: "market" },
    { title: "Session Pitch Deck Roasting complétée", category: "market" },
    { title: "Métriques techniques de sortie validées", category: "metrics" },
    { title: "Métriques commerciales de sortie validées", category: "metrics" },
    { title: "Rapport de fin d'incubation généré", category: "general" },
    { title: "Recommandation GO / NO-GO / PIVOT émise", category: "general" },
  ],
};

// Phase-specific dashboard metrics
const PHASE_METRICS: Record<number, { label: string; icon: any; key: string }[]> = {
  1: [
    { label: "Diagnostic Équipe", icon: Users, key: "team_diagnostic" },
    { label: "Écosystème Mappé", icon: Globe, key: "ecosystem_mapped" },
    { label: "Roadmap Générée", icon: FileText, key: "roadmap_generated" },
  ],
  2: [
    { label: "Interviews Clients", icon: Users, key: "interviews" },
    { label: "Taux Confirmation", icon: TrendingUp, key: "confirmation_rate" },
    { label: "P/S Fit Score", icon: Target, key: "ps_fit" },
  ],
  3: [
    { label: "Maturité Tech", icon: Rocket, key: "tech_maturity" },
    { label: "Maturité Commerciale", icon: TrendingUp, key: "commercial_maturity" },
    { label: "KPIs Définis", icon: BarChart3, key: "kpis_defined" },
  ],
  4: [
    { label: "Pitch Score", icon: Zap, key: "pitch_score" },
    { label: "Métriques Validées", icon: CheckCircle2, key: "metrics_validated" },
    { label: "Statut Sortie", icon: Shield, key: "exit_status" },
  ],
};

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/incubation-coach`;

interface IncubationSpaceProps {
  projectId: string;
  projectName: string;
  userId: string;
  sector?: string | null;
  startupStage?: string;
}

const IncubationSpace = ({ projectId, projectName, userId, sector, startupStage }: IncubationSpaceProps) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [incubationPhase, setIncubationPhase] = useState(1);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfDiagnostic, setPdfDiagnostic] = useState("");

  useEffect(() => { loadMilestones(); }, [projectId]);

  const loadMilestones = async () => {
    const { data } = await supabase
      .from("incubation_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (data) setMilestones(data as Milestone[]);
  };

  const addMilestone = async () => {
    if (!newMilestone.trim()) return;
    const { data, error } = await supabase
      .from("incubation_milestones")
      .insert({ project_id: projectId, user_id: userId, title: newMilestone.trim(), category: newCategory })
      .select()
      .single();
    if (!error && data) {
      setMilestones(prev => [...prev, data as Milestone]);
      setNewMilestone("");
      setShowAddMilestone(false);
    }
  };

  const generatePhaseMilestones = async (phase: number) => {
    const phaseItems = PHASE_MILESTONES[phase];
    if (!phaseItems) return;

    // Check if milestones already exist for this phase
    const existingTitles = new Set(milestones.map(m => m.title));
    const newItems = phaseItems.filter(p => !existingTitles.has(p.title));
    if (newItems.length === 0) {
      toast({ title: "Info", description: "Les jalons de cette phase existent déjà." });
      return;
    }

    const inserts = newItems.map(item => ({
      project_id: projectId,
      user_id: userId,
      title: item.title,
      category: item.category,
    }));

    const { data, error } = await supabase
      .from("incubation_milestones")
      .insert(inserts)
      .select();

    if (!error && data) {
      setMilestones(prev => [...prev, ...(data as Milestone[])]);
      toast({ title: `✅ ${data.length} jalons ajoutés`, description: `Phase ${phase} : ${INCUBATION_PHASES[phase - 1]?.label}` });
    }
  };

  const toggleMilestone = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "pending" : "done";
    await supabase
      .from("incubation_milestones")
      .update({ status: newStatus, completed_at: newStatus === "done" ? new Date().toISOString() : null })
      .eq("id", id);
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: newStatus, completed_at: newStatus === "done" ? new Date().toISOString() : null } : m));
  };

  const deleteMilestone = async (id: string) => {
    await supabase.from("incubation_milestones").delete().eq("id", id);
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  // Check if a phase is "validated" (all its milestones are done)
  const isPhaseValidated = (phase: number) => {
    const phaseItems = PHASE_MILESTONES[phase];
    if (!phaseItems) return false;
    return phaseItems.every(p => milestones.some(m => m.title === p.title && m.status === "done"));
  };

  // Check if previous phase is validated to unlock next
  const canGeneratePhase = (phase: number) => {
    if (phase === 1) return true;
    return isPhaseValidated(phase - 1);
  };

  const hasPhoneMilestones = (phase: number) => {
    const phaseItems = PHASE_MILESTONES[phase];
    if (!phaseItems) return false;
    return phaseItems.some(p => milestones.some(m => m.title === p.title));
  };

  const completedCount = milestones.filter(m => m.status === "done").length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  // Phase-specific milestone stats
  const getPhaseStats = (phase: number) => {
    const phaseItems = PHASE_MILESTONES[phase];
    if (!phaseItems) return { total: 0, done: 0, pct: 0 };
    const phaseMilestones = phaseItems.map(p => milestones.find(m => m.title === p.title)).filter(Boolean);
    const done = phaseMilestones.filter(m => m?.status === "done").length;
    return { total: phaseItems.length, done, pct: phaseItems.length > 0 ? Math.round((done / phaseItems.length) * 100) : 0 };
  };

  const sendIncubationMessage = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const allMessages = chatMessages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch(COACH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: allMessages,
          incubationPhase,
          projectContext: { projectName, sector, startupStage },
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur de communication");
      }
      if (!resp.body) throw new Error("Pas de stream");

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
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast({ title: "Erreur", description: "Veuillez sélectionner un fichier PDF.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Le fichier ne doit pas dépasser 20 Mo.", variant: "destructive" });
      return;
    }

    setUploadingPdf(true);
    setPdfDiagnostic("");

    try {
      // Upload to storage
      const filePath = `${userId}/${projectId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("incubation-reports")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // Remove data:...;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Send to AI for analysis
      const resp = await fetch(COACH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          analyzePdf: true,
          pdfContent: base64,
          projectContext: { projectName, sector, startupStage },
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur d'analyse du PDF");
      }
      if (!resp.body) throw new Error("Pas de réponse");

      // Stream the diagnostic
      const reader2 = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let diagnosticContent = "";

      while (true) {
        const { done, value } = await reader2.read();
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
              diagnosticContent += content;
              setPdfDiagnostic(diagnosticContent);
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      setPdfUploaded(true);
      toast({ title: "✅ Rapport analysé", description: "Le diagnostic d'incubation a été généré avec succès." });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setUploadingPdf(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center py-4 space-y-3">
        <Badge className="mb-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-sm px-4 py-1">
          🎓 Mode Incubation Activé
        </Badge>
        <h2 className="text-2xl font-bold">Espace Incubation — {projectName}</h2>
        <p className="text-muted-foreground mt-1">Venture Builder interactif — Coaching stratégique par phase</p>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/knowledge">
            <BookOpen className="h-4 w-4" /> Espace Base de connaissance
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="coaching">🤖 Coaching IA</TabsTrigger>
          <TabsTrigger value="team">👥 Équipe & Equity</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-4">
          {/* Phase Selector with progress */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4 space-y-3">
              <h4 className="text-sm font-semibold">Phase d'incubation actuelle</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {INCUBATION_PHASES.map(p => {
                  const stats = getPhaseStats(p.id);
                  const validated = isPhaseValidated(p.id);
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setIncubationPhase(p.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        incubationPhase === p.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : validated
                            ? "border-green-300 bg-green-50 dark:bg-green-950/20"
                            : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold">{p.weeks}</span>
                        {validated && <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{p.label}</p>
                      {stats.total > 0 && (
                        <Progress value={stats.pct} className="h-1 mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* PDF Upload - Phase 1 only */}
          {incubationPhase === 1 && (
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="py-6">
                <div className="text-center space-y-3">
                  {pdfUploaded ? (
                    <FileCheck className="h-10 w-10 mx-auto text-green-500" />
                  ) : uploadingPdf ? (
                    <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                  ) : (
                    <Upload className="h-10 w-10 mx-auto text-primary/50" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold">
                      {pdfUploaded ? "✅ Rapport analysé" : uploadingPdf ? "Analyse en cours..." : "📄 Upload du rapport initial (7 phases)"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pdfUploaded
                        ? "Le diagnostic d'incubation a été généré ci-dessous."
                        : uploadingPdf
                          ? "L'IA analyse votre rapport et génère le diagnostic complet..."
                          : "Uploadez le PDF exporté de l'analyse stratégique (7 phases) pour générer automatiquement le diagnostic d'incubation."
                      }
                    </p>
                  </div>
                  {!pdfUploaded && !uploadingPdf && (
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      Sélectionner le PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handlePdfUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* PDF Diagnostic Result */}
          {pdfDiagnostic && incubationPhase === 1 && (
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-500" />
                  Diagnostic d'Incubation — Généré par IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_table]:border [&_th]:border [&_td]:border [&_table]:border-border">
                  <ReactMarkdown>{pdfDiagnostic}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phase-specific metrics */}
          <div className="grid grid-cols-3 gap-3">
            {(PHASE_METRICS[incubationPhase] || []).map(m => {
              const Icon = m.icon;
              const stats = getPhaseStats(incubationPhase);
              return (
                <Card key={m.key}>
                  <CardContent className="pt-4 text-center">
                    <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <div className="text-lg font-bold mt-1">
                      {m.key === "team_diagnostic" || m.key === "ecosystem_mapped" || m.key === "roadmap_generated"
                        ? (stats.done > 0 ? "✓" : "—")
                        : `${stats.done}/${stats.total}`
                      }
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Global Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-muted-foreground">{completedCount}/{milestones.length} jalons</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Phase Milestones Generator */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Jalons — Phase {incubationPhase} : {INCUBATION_PHASES[incubationPhase - 1]?.label}
                </CardTitle>
                <div className="flex gap-2">
                  {!hasPhoneMilestones(incubationPhase) && canGeneratePhase(incubationPhase) && (
                    <Button size="sm" onClick={() => generatePhaseMilestones(incubationPhase)} className="gap-1 bg-gradient-to-r from-emerald-500 to-teal-500">
                      <Zap className="h-3 w-3" /> Générer les jalons
                    </Button>
                  )}
                  {!canGeneratePhase(incubationPhase) && !hasPhoneMilestones(incubationPhase) && (
                    <Badge variant="outline" className="text-xs text-amber-600">
                      🔒 Validez la phase {incubationPhase - 1} d'abord
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setShowAddMilestone(!showAddMilestone)} className="gap-1">
                    <Plus className="h-3 w-3" /> Manuel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddMilestone && (
                <div className="flex gap-2 items-end">
                  <Input className="flex-1" value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                    placeholder="Nouveau jalon..." onKeyDown={e => e.key === "Enter" && addMilestone()} />
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={addMilestone} disabled={!newMilestone.trim()}>Ajouter</Button>
                </div>
              )}

              {/* Show current phase milestones first, then others */}
              {(() => {
                const phaseTitles = PHASE_MILESTONES[incubationPhase]?.map(p => p.title) || [];
                const phaseMilestones = milestones.filter(m => phaseTitles.includes(m.title));
                const otherMilestones = milestones.filter(m => !phaseTitles.includes(m.title));
                const displayList = [...phaseMilestones, ...otherMilestones];

                if (displayList.length === 0) {
                  return <p className="text-sm text-muted-foreground text-center py-6">
                    Cliquez sur "Générer les jalons" pour créer automatiquement les objectifs de cette phase.
                  </p>;
                }

                return (
                  <div className="space-y-2">
                    {displayList.map(m => {
                      const cat = CATEGORIES.find(c => c.value === m.category) || CATEGORIES[CATEGORIES.length - 1];
                      const Icon = cat.icon;
                      const isPhaseItem = phaseTitles.includes(m.title);
                      return (
                        <div key={m.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          m.status === "done" ? "bg-muted/30 opacity-70" : isPhaseItem ? "border-primary/20 bg-primary/5" : "hover:bg-muted/20"
                        }`}>
                          <button onClick={() => toggleMilestone(m.id, m.status)} className="flex-shrink-0">
                            {m.status === "done" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-muted-foreground" />}
                          </button>
                          <Badge variant="outline" className={`text-xs ${cat.color}`}><Icon className="h-3 w-3 mr-1" />{cat.label}</Badge>
                          <span className={`flex-1 text-sm ${m.status === "done" ? "line-through" : ""}`}>{m.title}</span>
                          <button onClick={() => deleteMilestone(m.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-primary">{completedCount}</div><p className="text-xs text-muted-foreground">Complétés</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-amber-500">{milestones.filter(m => m.status === "pending").length}</div><p className="text-xs text-muted-foreground">En cours</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-emerald-500">{Math.round(progress)}%</div><p className="text-xs text-muted-foreground">Progression</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-indigo-500">{[1,2,3,4].filter(p => isPhaseValidated(p)).length}/4</div><p className="text-xs text-muted-foreground">Phases validées</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="mt-4 space-y-4">
          {/* Phase context bar */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm">
                <span className="font-semibold">Phase de coaching : </span>
                <Badge variant="outline">{INCUBATION_PHASES[incubationPhase - 1]?.label}</Badge>
              </div>
              <div className="flex gap-1">
                {INCUBATION_PHASES.map(p => (
                  <Button key={p.id} variant={incubationPhase === p.id ? "default" : "ghost"} size="sm"
                    onClick={() => setIncubationPhase(p.id)} className="h-7 text-xs px-2">
                    P{p.id}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/20 rounded-2xl border min-h-[400px] max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Venture Builder IA — Coaching d'Incubation</p>
                <p className="text-sm mt-1 max-w-md mx-auto">
                  {incubationPhase === 1 && "Décrivez votre contexte, équipe et objectifs. L'IA générera votre roadmap personnalisée."}
                  {incubationPhase === 2 && "Partagez vos retours d'interviews clients. L'IA évaluera votre Problem/Solution Fit."}
                  {incubationPhase === 3 && "Soumettez votre MVP pour validation technique et commerciale simultanée."}
                  {incubationPhase === 4 && "Préparez votre pitch, l'IA simulera un jury d'investisseurs."}
                </p>
              </div>
            )}
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border shadow-sm"}`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Le coach analyse...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendIncubationMessage()}
              placeholder={`Phase ${incubationPhase} — ${INCUBATION_PHASES[incubationPhase - 1]?.label}...`}
              disabled={isStreaming} className="rounded-full h-12"
            />
            <Button onClick={sendIncubationMessage} disabled={isStreaming || !input.trim()} size="icon" className="rounded-full h-12 w-12 shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <TeamAnalyzer projectName={projectName} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default IncubationSpace;
