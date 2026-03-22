import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, FileText, TrendingUp, Upload, Download, Trash2,
  BarChart3, ClipboardCheck, Loader2, Lock, Building2,
  CheckCircle2, Clock, AlertCircle, FolderOpen, PieChart,
  DollarSign, Users, Briefcase, ArrowLeft, Eye
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IncubationStep {
  id: string;
  step_number: number;
  name: string;
  status: string | null;
  ai_report_score: number | null;
  completed_at: string | null;
}

interface IncubationReport {
  id: string;
  title: string;
  report_type: string;
  ai_score: number | null;
  status: string | null;
  created_at: string | null;
  step_id: string;
}

interface KPI {
  id: string;
  metric_name: string;
  metric_value: string;
  recorded_at: string;
}

interface PrivateDoc {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  category: string;
  file_size: number;
  created_at: string;
}

interface DataroomDeliverable {
  id: string;
  deliverable_id: string;
  completed: boolean;
  completed_at: string | null;
}

const DELIVERABLE_LABELS: Record<string, string> = {
  "pitch-deck": "Pitch Deck (12 slides)",
  "teaser": "Teaser / One-Pager",
  "investment-memo": "Investment Memorandum",
  "business-plan": "Business Plan Financier",
  "valorisation": "Valorisation Multi-Méthodes",
  "montage-financier": "Montage Financier",
  "cap-table": "Cap Table",
  "term-sheet": "Term Sheet / LOI",
  "safe-contract": "Contrat SAFE",
  "shareholder-agreement": "Pacte d'Actionnaires",
  "data-room": "Data Room Structurée",
  "financial-projections": "Projections Financières 3 ans",
  "kpi-dashboard": "Dashboard KPIs Investisseur",
  "esg-report": "Reporting ESG",
};

const FILE_CATEGORIES = [
  { value: "general", label: "Général" },
  { value: "legal", label: "Juridique" },
  { value: "financial", label: "Financier" },
  { value: "technical", label: "Technique" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "Ressources Humaines" },
];

const StartupPrivateSpace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [startup, setStartup] = useState<any>(null);
  const [incubationProject, setIncubationProject] = useState<any>(null);
  const [steps, setSteps] = useState<IncubationStep[]>([]);
  const [reports, setReports] = useState<IncubationReport[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [privateDocs, setPrivateDocs] = useState<PrivateDoc[]>([]);
  const [deliverables, setDeliverables] = useState<DataroomDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("general");

  useEffect(() => {
    if (id && user) fetchAll();
  }, [id, user]);

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch startup info
      const { data: s } = await supabase
        .from("marketplace_startups")
        .select("*")
        .eq("id", id)
        .single();
      setStartup(s);

      // Check access: owner or admin
      if (s && s.created_by !== user?.id && !isAdmin) {
        navigate("/marketplace");
        return;
      }

      // Fetch linked incubation project
      const { data: incProj } = await supabase
        .from("incubation_projects")
        .select("*")
        .eq("startup_id", id)
        .maybeSingle();
      setIncubationProject(incProj);

      if (incProj) {
        const [stepsRes, reportsRes] = await Promise.all([
          supabase.from("incubation_steps").select("*").eq("project_id", incProj.id).order("step_number"),
          supabase.from("incubation_reports").select("*").eq("project_id", incProj.id).order("created_at", { ascending: false }),
        ]);
        setSteps((stepsRes.data || []) as IncubationStep[]);
        setReports((reportsRes.data || []) as IncubationReport[]);
      }

      // Fetch KPIs
      const { data: kpisData } = await supabase
        .from("marketplace_kpis")
        .select("*")
        .eq("startup_id", id)
        .order("recorded_at", { ascending: false });
      setKpis((kpisData || []) as KPI[]);

      // Fetch private documents
      const { data: docs } = await supabase
        .from("startup_private_documents")
        .select("*")
        .eq("startup_id", id)
        .order("created_at", { ascending: false });
      setPrivateDocs((docs || []) as PrivateDoc[]);

      // Fetch dataroom deliverables
      if (incProj) {
        const { data: deliv } = await supabase
          .from("dataroom_deliverables")
          .select("*")
          .eq("project_id", incProj.id);
        setDeliverables((deliv || []) as DataroomDeliverable[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || !user) return;
    setUploading(true);
    try {
      const filePath = `${id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("startup-private-files")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("startup-private-files")
        .getPublicUrl(filePath);

      await supabase.from("startup_private_documents").insert({
        startup_id: id,
        user_id: user.id,
        file_name: file.name,
        file_url: filePath,
        file_type: file.type || "document",
        file_size: file.size,
        category: uploadCategory,
      });

      toast({ title: "Fichier uploadé", description: file.name });
      fetchAll();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteDoc = async (doc: PrivateDoc) => {
    try {
      await supabase.storage.from("startup-private-files").remove([doc.file_url]);
      await supabase.from("startup_private_documents").delete().eq("id", doc.id);
      toast({ title: "Fichier supprimé" });
      fetchAll();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  const handleDownloadDoc = async (doc: PrivateDoc) => {
    const { data } = await supabase.storage.from("startup-private-files").download(doc.file_url);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Accès Restreint</h2>
            <p className="text-muted-foreground mb-4">Connectez-vous pour accéder à cet espace privé.</p>
            <Button onClick={() => navigate("/auth")}>Se connecter</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Startup introuvable</h2>
            <Button onClick={() => navigate("/marketplace")}>Retour au Marketplace</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const avgScore = reports.length > 0
    ? Math.round(reports.filter(r => r.ai_score).reduce((sum, r) => sum + (r.ai_score || 0), 0) / reports.filter(r => r.ai_score).length)
    : 0;
  const completedDeliverables = deliverables.filter(d => d.completed).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white mb-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button>
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="h-10 w-10 text-blue-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{startup.name}</h1>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Lock className="h-3 w-3 mr-1" /> Espace Privé
                  </Badge>
                </div>
                <p className="text-white/70 max-w-2xl">{startup.tagline || startup.description}</p>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">{completedSteps}/7</div>
                    <div className="text-xs text-white/50">Étapes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-300">{avgScore}%</div>
                    <div className="text-xs text-white/50">Score IA moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-300">{completedDeliverables}/{Object.keys(DELIVERABLE_LABELS).length}</div>
                    <div className="text-xs text-white/50">Livrables Invest</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-violet-300">{privateDocs.length}</div>
                    <div className="text-xs text-white/50">Documents privés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="incubation" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="incubation" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ClipboardCheck className="h-4 w-4" /> Incubation
              </TabsTrigger>
              <TabsTrigger value="invest" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Briefcase className="h-4 w-4" /> Documents Invest
              </TabsTrigger>
              <TabsTrigger value="metrics" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" /> Métriques & KPIs
              </TabsTrigger>
              <TabsTrigger value="files" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FolderOpen className="h-4 w-4" /> Fichiers Privés
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Incubation */}
            <TabsContent value="incubation" className="space-y-6">
              {!incubationProject ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun projet d'incubation lié</h3>
                    <p className="text-muted-foreground mb-4">Cette startup n'a pas encore de parcours d'incubation associé.</p>
                    <Button onClick={() => navigate("/pole-strategique/new")}>Démarrer un parcours</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        Progression des 7 Étapes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={(completedSteps / 7) * 100} className="h-3 mb-6" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {steps.map((step) => (
                          <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              step.status === "completed"
                                ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                                : step.status === "in_progress"
                                ? "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20"
                                : "border-muted bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step.status === "completed" ? "bg-emerald-500 text-white"
                                : step.status === "in_progress" ? "bg-blue-500 text-white"
                                : "bg-muted text-muted-foreground"
                              }`}>
                                {step.step_number}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{step.name}</div>
                                {step.ai_report_score != null && (
                                  <div className="text-xs text-muted-foreground">Score IA: {step.ai_report_score}%</div>
                                )}
                              </div>
                              {step.status === "completed" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                              {step.status === "in_progress" && <Clock className="h-5 w-5 text-blue-500" />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {reports.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Rapports Générés ({reports.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {reports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <div className="font-medium text-sm">{report.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {report.report_type} • {report.created_at ? new Date(report.created_at).toLocaleDateString("fr-FR") : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {report.ai_score != null && (
                                  <Badge variant="outline" className="text-xs">
                                    Score: {report.ai_score}%
                                  </Badge>
                                )}
                                <Badge variant={report.status === "completed" ? "default" : "secondary"} className="text-xs">
                                  {report.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* TAB 2: Invest Documents */}
            <TabsContent value="invest" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Livrables Pôle Invest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(DELIVERABLE_LABELS).map(([key, label]) => {
                      const done = deliverables.find(d => d.deliverable_id === key && d.completed);
                      return (
                        <div key={key} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          done ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-muted bg-muted/20"
                        }`}>
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                          )}
                          <span className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
                          {done?.completed_at && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(done.completed_at).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Progression Data Room</span>
                    </div>
                    <Progress value={(completedDeliverables / Object.keys(DELIVERABLE_LABELS).length) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completedDeliverables} / {Object.keys(DELIVERABLE_LABELS).length} livrables complétés
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Metrics & KPIs */}
            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Métriques & KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kpis.length === 0 ? (
                    <div className="py-12 text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun KPI enregistré</h3>
                      <p className="text-muted-foreground text-sm">Les KPIs seront ajoutés depuis la fiche Marketplace de votre startup.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {kpis.map((kpi) => (
                        <motion.div key={kpi.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl border bg-gradient-to-br from-muted/30 to-muted/10"
                        >
                          <div className="text-xs text-muted-foreground mb-1">{kpi.metric_name}</div>
                          <div className="text-2xl font-bold text-foreground">{kpi.metric_value}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(kpi.recorded_at).toLocaleDateString("fr-FR")}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Startup info summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Informations Startup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Secteur", value: startup.sector, icon: Building2 },
                      { label: "Phase", value: startup.stage, icon: TrendingUp },
                      { label: "Votes", value: startup.votes_count, icon: Users },
                      { label: "Vues", value: startup.views_count, icon: Eye },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 border text-center">
                        <item.icon className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        <div className="text-lg font-bold">{item.value || "—"}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Private Files */}
            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    Fichiers Confidentiels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload zone */}
                  <div className="p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 text-center">
                    <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-3">Uploader un document confidentiel</p>
                    <div className="flex items-center gap-3 justify-center mb-3">
                      <Select value={uploadCategory} onValueChange={setUploadCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FILE_CATEGORIES.map(c => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="inline-block">
                      <Button disabled={uploading} asChild>
                        <span>
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                          {uploading ? "Upload..." : "Choisir un fichier"}
                        </span>
                      </Button>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>

                  {/* Files list */}
                  {privateDocs.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Lock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>Aucun document confidentiel uploadé.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {FILE_CATEGORIES.map(cat => {
                        const catDocs = privateDocs.filter(d => d.category === cat.value);
                        if (catDocs.length === 0) return null;
                        return (
                          <div key={cat.value}>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-4">{cat.label}</h4>
                            {catDocs.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border mb-2">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-primary shrink-0" />
                                  <div>
                                    <div className="font-medium text-sm">{doc.file_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="icon" variant="ghost" onClick={() => handleDownloadDoc(doc)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteDoc(doc)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartupPrivateSpace;
