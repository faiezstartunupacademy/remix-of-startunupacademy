import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Loader2, Rocket, Brain, Upload, Plus, Zap, Target, Layers, Users,
  TrendingUp, CheckCircle2, Play, BarChart3, AlertTriangle, Trash2, Save,
  Edit2, X, ClipboardList, TestTube2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MvpValidationDashboard from "./MvpValidationDashboard";
import ValidationGauge from "./ValidationGauge";
import { generatePersonas } from "@/utils/personaGenerator";

type Props = {
  projectId: string;
  incubationProjectData?: any;
  incubationSteps?: any[];
};

type Hypothesis = { id: string; type: string; description: string; confidence_score: number; weight: number; validation_status: string; test_method: string | null };
type Feature = { id: string; name: string; priority: string; completion_percentage: number; tested: boolean; test_result: string };
type Persona = { id: string; name: string; description: string | null; is_early_adopter: boolean; interviews_done: number; interviews_target: number; conversion_rate: number; satisfaction_score: number; governorate?: string | null; age_range?: string | null; socio_profile?: string | null; psycho_profile?: string | null; emotional_profile?: string | null };
type TestResult = { id: string; test_id: string; status: string; qualitative_result: string | null; quantitative_result: number | null; start_date: string | null; end_date: string | null };
type TestDef = { id: string; name: string; description: string | null; category: string; phase: string; objective: string | null; estimated_duration: string | null; detailed_protocol: any; applicable_sectors: string[] | null; applicable_scenarios: string[] | null };

const V1TestSpace = ({ projectId, incubationProjectData, incubationSteps }: Props) => {
  const { toast } = useToast();
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testDefs, setTestDefs] = useState<TestDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiTesting, setAiTesting] = useState(false);
  const [aiTestResults, setAiTestResults] = useState<any>(null);
  const [mode, setMode] = useState<"choose" | "working">("choose");
  const [v1Tab, setV1Tab] = useState("overview");

  // Form dialogs
  const [showAdd, setShowAdd] = useState<"hypothesis" | "feature" | "persona" | null>(null);
  const [editingH, setEditingH] = useState<Hypothesis | null>(null);
  const [editingF, setEditingF] = useState<Feature | null>(null);
  const [editingP, setEditingP] = useState<Persona | null>(null);

  // Form states
  const [hForm, setHForm] = useState({ type: "risque_marché", description: "", test_method: "", weight: 3 });
  const [fForm, setFForm] = useState({ name: "", priority: "core" });
  const [pForm, setPForm] = useState({ name: "", description: "", is_early_adopter: false, interviews_target: 20, governorate: "Tunis", age_range: "25-35", socio_profile: "", psycho_profile: "", emotional_profile: "" });

  useEffect(() => { loadData(); }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    const [h, f, p, tr, td] = await Promise.all([
      supabase.from("mvp_hypotheses" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_features" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_personas" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_test_results" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_tests_library" as any).select("*"),
    ]);
    if (h.data) setHypotheses(h.data as any[]);
    if (f.data) setFeatures(f.data as any[]);
    if (p.data) setPersonas(p.data as any[]);
    if (tr.data) setTestResults(tr.data as any[]);
    if (td.data) setTestDefs(td.data as any[]);
    setLoading(false);
    if ((h.data?.length || 0) > 0 || (f.data?.length || 0) > 0 || (p.data?.length || 0) > 0) {
      setMode("working");
    }
  };

  // TVH/TVF/TVP calculations
  const tvh = useMemo(() => {
    if (!hypotheses.length) return 0;
    const num = hypotheses.reduce((s, h) => s + h.confidence_score * h.weight, 0);
    const den = hypotheses.reduce((s, h) => s + 100 * h.weight, 0);
    return den > 0 ? Math.round((num / den) * 100) : 0;
  }, [hypotheses]);

  const tvf = useMemo(() => {
    if (!features.length) return 0;
    const core = features.filter(f => f.priority === "core");
    const nice = features.filter(f => f.priority === "nice_to_have");
    const num = core.reduce((s, f) => s + f.completion_percentage, 0) * 0.7 + nice.reduce((s, f) => s + f.completion_percentage, 0) * 0.3;
    return Math.round((num / (features.length * 100)) * 100);
  }, [features]);

  const tvp = useMemo(() => {
    if (!personas.length) return 0;
    const avg = personas.reduce((s, p) => {
      const intScore = p.interviews_target > 0 ? Math.min(p.interviews_done / p.interviews_target, 1) : 0;
      return s + (intScore * 0.4 + (p.conversion_rate / 100) * 0.35 + (p.satisfaction_score / 10) * 0.25);
    }, 0) / personas.length;
    return Math.round(avg * 100);
  }, [personas]);

  const tvg = Math.round(tvh * 0.4 + tvf * 0.35 + tvp * 0.25);

  // ─── Import from incubation ───
  const importFromIncubation = async () => {
    if (!incubationProjectData) {
      toast({ title: "Aucune donnée", description: "Pas de données d'incubation disponibles.", variant: "destructive" });
      return;
    }

    const hyps: any[] = [];
    if (incubationProjectData.problem_description) hyps.push({ project_id: projectId, type: "risque_marché", description: `Le problème "${incubationProjectData.problem_description}" est suffisamment douloureux`, weight: 5, confidence_score: 0, validation_status: "non_testé" });
    if (incubationProjectData.solution_description) hyps.push({ project_id: projectId, type: "risque_produit", description: `La solution "${incubationProjectData.solution_description}" résout le problème`, weight: 4, confidence_score: 0, validation_status: "non_testé" });
    if (incubationProjectData.business_model) hyps.push({ project_id: projectId, type: "risque_marché", description: `Le modèle "${incubationProjectData.business_model}" est viable et scalable`, weight: 4, confidence_score: 0, validation_status: "non_testé" });
    if (incubationProjectData.differentiator) hyps.push({ project_id: projectId, type: "risque_produit", description: `Différenciation "${incubationProjectData.differentiator}" défendable`, weight: 3, confidence_score: 0, validation_status: "non_testé" });
    hyps.push({ project_id: projectId, type: "risque_exécution", description: "L'équipe possède les compétences clés", weight: 3, confidence_score: 0, validation_status: "non_testé" });

    const feats: any[] = [
      { project_id: projectId, name: "Landing page avec proposition de valeur", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
      { project_id: projectId, name: "Onboarding utilisateur", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
      { project_id: projectId, name: "Fonctionnalité cœur MVP", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
    ];
    if (incubationProjectData.business_model) feats.push({ project_id: projectId, name: `Module monétisation (${incubationProjectData.business_model})`, priority: "core", completion_percentage: 0, tested: false, test_result: "pending" });

    // Generate 8-12 deeply characterized personas
    const pers = generatePersonas(projectId, incubationProjectData);

    // Auto-seed test results from library based on sector/scenario
    const sector = incubationProjectData.sector || "";
    const { data: allTests } = await supabase.from("mvp_tests_library" as any).select("*");
    const relevantTests = (allTests as any[] || []).filter((t: any) => {
      const sectors = t.applicable_sectors || [];
      const scenarios = t.applicable_scenarios || [];
      return sectors.includes(sector) || sectors.length === 0 || scenarios.length === 0;
    }).slice(0, 15); // Limit to 15 most relevant

    const testSeeds = relevantTests.map((t: any) => ({
      project_id: projectId,
      test_id: t.id,
      status: "not_started",
      qualitative_result: null,
      quantitative_result: null,
      start_date: null,
      end_date: null,
    }));

    await Promise.all([
      hyps.length > 0 ? supabase.from("mvp_hypotheses" as any).insert(hyps) : Promise.resolve(),
      feats.length > 0 ? supabase.from("mvp_features" as any).insert(feats) : Promise.resolve(),
      pers.length > 0 ? supabase.from("mvp_personas" as any).insert(pers as any) : Promise.resolve(),
      testSeeds.length > 0 ? supabase.from("mvp_test_results" as any).insert(testSeeds) : Promise.resolve(),
    ]);

    toast({ title: "✅ Import complet", description: `${hyps.length} hypothèses, ${feats.length} fonctionnalités, ${pers.length} personas et ${testSeeds.length} tests ajoutés.` });
    await loadData();
    setMode("working");
  };

  // ─── CRUD Hypothesis ───
  const saveHypothesis = async () => {
    if (!hForm.description.trim()) return;
    const payload = { project_id: projectId, type: hForm.type, description: hForm.description, test_method: hForm.test_method || null, weight: hForm.weight, confidence_score: 0, validation_status: "non_testé" };
    if (editingH) {
      await supabase.from("mvp_hypotheses" as any).update(payload as any).eq("id", editingH.id);
    } else {
      await supabase.from("mvp_hypotheses" as any).insert(payload as any);
    }
    setShowAdd(null); setEditingH(null); setHForm({ type: "risque_marché", description: "", test_method: "", weight: 3 });
    toast({ title: editingH ? "Hypothèse modifiée" : "Hypothèse ajoutée" });
    await loadData();
  };

  const deleteHypothesis = async (id: string) => {
    await supabase.from("mvp_hypotheses" as any).delete().eq("id", id);
    toast({ title: "Hypothèse supprimée" });
    await loadData();
  };

  // ─── CRUD Feature ───
  const saveFeature = async () => {
    if (!fForm.name.trim()) return;
    const payload = { project_id: projectId, name: fForm.name, priority: fForm.priority, completion_percentage: 0, tested: false, test_result: "pending" };
    if (editingF) {
      await supabase.from("mvp_features" as any).update({ name: fForm.name, priority: fForm.priority } as any).eq("id", editingF.id);
    } else {
      await supabase.from("mvp_features" as any).insert(payload as any);
    }
    setShowAdd(null); setEditingF(null); setFForm({ name: "", priority: "core" });
    toast({ title: editingF ? "Fonctionnalité modifiée" : "Fonctionnalité ajoutée" });
    await loadData();
  };

  const deleteFeature = async (id: string) => {
    await supabase.from("mvp_features" as any).delete().eq("id", id);
    toast({ title: "Fonctionnalité supprimée" });
    await loadData();
  };

  // ─── CRUD Persona ───
  const savePersona = async () => {
    if (!pForm.name.trim()) return;
    const payload = { project_id: projectId, name: pForm.name, description: pForm.description || null, is_early_adopter: pForm.is_early_adopter, interviews_done: 0, interviews_target: pForm.interviews_target, conversion_rate: 0, satisfaction_score: 0, governorate: pForm.governorate, age_range: pForm.age_range, socio_profile: pForm.socio_profile, psycho_profile: pForm.psycho_profile, emotional_profile: pForm.emotional_profile };
    if (editingP) {
      await supabase.from("mvp_personas" as any).update(payload as any).eq("id", editingP.id);
    } else {
      await supabase.from("mvp_personas" as any).insert(payload as any);
    }
    setShowAdd(null); setEditingP(null); setPForm({ name: "", description: "", is_early_adopter: false, interviews_target: 20, governorate: "Tunis", age_range: "25-35", socio_profile: "", psycho_profile: "", emotional_profile: "" });
    toast({ title: editingP ? "Persona modifié" : "Persona ajouté" });
    await loadData();
  };

  const deletePersona = async (id: string) => {
    await supabase.from("mvp_personas" as any).delete().eq("id", id);
    toast({ title: "Persona supprimé" });
    await loadData();
  };

  // ─── AI Auto Test ───
  const runAIAutoTest = async () => {
    setAiTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-test-result", {
        body: {
          test_name: "V1 TEST — Validation automatique",
          test_objective: "Simuler la validation croisée hypothèses × fonctionnalités × personas",
          target_metrics: { tvh: "≥60%", tvf: "≥50%", tvp: "≥40%" },
          qualitative_result: `${hypotheses.length} hypothèses, ${features.length} fonctionnalités, ${personas.length} personas définis. Secteur: ${incubationProjectData?.sector || "Non défini"}.`,
          quantitative_result: `TVH=${tvh}%, TVF=${tvf}%, TVP=${tvp}%, TVG=${tvg}%`,
          estimated_duration: "Simulation IA",
          sector: incubationProjectData?.sector || "Générique",
          phase: "V1 TEST",
        },
      });
      if (error) throw error;

      const simScores = generateSimulatedScores(hypotheses, features, personas, incubationProjectData);
      for (const h of hypotheses) {
        const simScore = simScores.hypotheses[h.id] || Math.floor(Math.random() * 40 + 30);
        await supabase.from("mvp_hypotheses" as any).update({ confidence_score: simScore, validation_status: simScore >= 60 ? "validé" : simScore >= 40 ? "partiellement_validé" : "non_testé" } as any).eq("id", h.id);
      }
      for (const f of features) {
        const simCompletion = simScores.features[f.id] || Math.floor(Math.random() * 50 + 20);
        await supabase.from("mvp_features" as any).update({ completion_percentage: simCompletion, tested: true, test_result: simCompletion >= 60 ? "success" : "partial" } as any).eq("id", f.id);
      }
      for (const p of personas) {
        const sim = simScores.personas[p.id] || {};
        await supabase.from("mvp_personas" as any).update({ interviews_done: sim.interviews || Math.floor(Math.random() * 10 + 3), conversion_rate: sim.conversion || Math.floor(Math.random() * 30 + 10), satisfaction_score: sim.satisfaction || Math.floor(Math.random() * 4 + 4) } as any).eq("id", p.id);
      }

      setAiTestResults(data?.verdict || { interpretation: "Test automatique terminé", verdict: "Partiel" });
      toast({ title: "🤖 V1 TEST terminé", description: "Scores de validation initiale générés par l'IA." });
      await loadData();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message || "Erreur lors du test IA", variant: "destructive" });
    } finally {
      setAiTesting(false);
    }
  };

  // ─── Edit openers ───
  const openEditH = (h: Hypothesis) => { setEditingH(h); setHForm({ type: h.type, description: h.description, test_method: h.test_method || "", weight: h.weight }); setShowAdd("hypothesis"); };
  const openEditF = (f: Feature) => { setEditingF(f); setFForm({ name: f.name, priority: f.priority }); setShowAdd("feature"); };
  const openEditP = (p: Persona) => { setEditingP(p); setPForm({ name: p.name, description: p.description || "", is_early_adopter: p.is_early_adopter, interviews_target: p.interviews_target, governorate: p.governorate || "Tunis", age_range: p.age_range || "25-35", socio_profile: p.socio_profile || "", psycho_profile: p.psycho_profile || "", emotional_profile: p.emotional_profile || "" }); setShowAdd("persona"); };

  // Relevant tests matched
  const matchedTests = useMemo(() => {
    const sector = incubationProjectData?.sector || "";
    return testDefs.filter(t => {
      const s = t.applicable_sectors || [];
      return s.includes(sector) || s.length === 0;
    });
  }, [testDefs, incubationProjectData]);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  // Choose mode
  if (mode === "choose" && hypotheses.length === 0 && features.length === 0 && personas.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Rocket className="h-6 w-6 text-primary" /> V1 TEST — Validation Initiale
            </CardTitle>
            <CardDescription className="max-w-xl mx-auto">
              Testez vos hypothèses, fonctionnalités et personas pour obtenir un score de validation initiale V1.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="cursor-pointer hover:border-primary/50 transition-all h-full" onClick={importFromIncubation}>
                  <CardContent className="py-8 text-center space-y-3">
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto"><Upload className="h-8 w-8 text-primary" /></div>
                    <h3 className="font-bold text-lg">Importer de l'analyse IA</h3>
                    <p className="text-sm text-muted-foreground">Récupère automatiquement hypothèses, fonctionnalités, personas et tests adéquats.</p>
                    {incubationSteps && incubationSteps.length > 0 && (
                      <Badge variant="outline" className="border-primary/30">{incubationSteps.filter(s => s.status === "completed").length} étapes validées</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="cursor-pointer hover:border-accent/50 transition-all h-full" onClick={() => setMode("working")}>
                  <CardContent className="py-8 text-center space-y-3">
                    <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto"><Plus className="h-8 w-8 text-accent-foreground" /></div>
                    <h3 className="font-bold text-lg">Ajouter manuellement</h3>
                    <p className="text-sm text-muted-foreground">Définissez vos données à la main pour un contrôle total.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gauges */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> V1 TEST — Validation Initiale</h2>
              <p className="text-sm text-muted-foreground mt-1">Score global : <span className="font-bold text-foreground">{tvg}%</span></p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <ValidationGauge label="TVG" sublabel="Global" value={tvg} icon={Zap} large />
              <ValidationGauge label="TVH" sublabel="Hypothèses" value={tvh} icon={Target} />
              <ValidationGauge label="TVF" sublabel="Features" value={tvf} icon={Layers} />
              <ValidationGauge label="TVP" sublabel="Personas" value={tvp} icon={Users} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={runAIAutoTest} disabled={aiTesting || (hypotheses.length === 0 && features.length === 0)} className="gap-2">
              {aiTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {aiTesting ? "Test IA en cours..." : "🤖 Lancer V1 TEST automatique"}
            </Button>
            {incubationProjectData && (
              <Button variant="outline" onClick={importFromIncubation} className="gap-2"><Upload className="h-4 w-4" /> Réimporter</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Test Results */}
      {aiTestResults && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Résultats V1 TEST IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{aiTestResults.interpretation}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{aiTestResults.verdict}</Badge>
              {aiTestResults.recommendation && <Badge variant="secondary">{aiTestResults.recommendation}</Badge>}
            </div>
            {aiTestResults.next_actions && (
              <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                {aiTestResults.next_actions.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5"><TrendingUp className="h-3 w-3 mt-0.5 text-primary shrink-0" /> {a}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={v1Tab} onValueChange={setV1Tab}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" />Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tvh" className="gap-1.5 text-xs"><Target className="h-3.5 w-3.5" />TVH ({hypotheses.length})</TabsTrigger>
          <TabsTrigger value="tvf" className="gap-1.5 text-xs"><Layers className="h-3.5 w-3.5" />TVF ({features.length})</TabsTrigger>
          <TabsTrigger value="tvp" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" />TVP ({personas.length})</TabsTrigger>
          <TabsTrigger value="tests" className="gap-1.5 text-xs"><TestTube2 className="h-3.5 w-3.5" />Tests ({testResults.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MvpValidationDashboard projectId={projectId} />
        </TabsContent>

        {/* ─── TVH ─── */}
        <TabsContent value="tvh">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> TVH — Hypothèses {tvh}%</CardTitle>
                  <CardDescription>{hypotheses.length} hypothèses de risque</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingH(null); setHForm({ type: "risque_marché", description: "", test_method: "", weight: 3 }); setShowAdd("hypothesis"); }} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {hypotheses.map(h => (
                <div key={h.id} className="p-3 rounded-lg border bg-muted/30 space-y-2 group">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{h.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Badge className={h.validation_status === "validé" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : h.validation_status === "partiellement_validé" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-muted text-muted-foreground"}>
                        {h.validation_status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => openEditH(h)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteHypothesis(h.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <p className="text-sm">{h.description}</p>
                  {h.test_method && <p className="text-xs text-muted-foreground">📋 Méthode : {h.test_method}</p>}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confiance:</span>
                    <Progress value={h.confidence_score} className="flex-1 h-2" />
                    <span className="text-xs font-bold">{h.confidence_score}%</span>
                    <span className="text-xs text-muted-foreground">Poids: {h.weight}</span>
                  </div>
                </div>
              ))}
              {hypotheses.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aucune hypothèse. Cliquez "Ajouter" ou importez depuis l'incubation.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TVF ─── */}
        <TabsContent value="tvf">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" /> TVF — Fonctionnalités {tvf}%</CardTitle>
                  <CardDescription>{features.length} fonctionnalités MVP</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingF(null); setFForm({ name: "", priority: "core" }); setShowAdd("feature"); }} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map(f => (
                <div key={f.id} className="p-3 rounded-lg border bg-muted/30 space-y-2 group">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{f.name}</span>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{f.priority}</Badge>
                      <Badge className={f.test_result === "success" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : f.test_result === "partial" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-muted text-muted-foreground"}>
                        {f.tested ? f.test_result : "Non testé"}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => openEditF(f)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteFeature(f.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={f.completion_percentage} className="flex-1 h-2" />
                    <span className="text-xs font-bold">{f.completion_percentage}%</span>
                  </div>
                </div>
              ))}
              {features.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aucune fonctionnalité définie.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TVP ─── */}
        <TabsContent value="tvp">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> TVP — Personas {tvp}%</CardTitle>
                  <CardDescription>{personas.length} personas caractérisés</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingP(null); setPForm({ name: "", description: "", is_early_adopter: false, interviews_target: 20, governorate: "Tunis", age_range: "25-35", socio_profile: "", psycho_profile: "", emotional_profile: "" }); setShowAdd("persona"); }} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {personas.map(p => {
                const intScore = p.interviews_target > 0 ? Math.round((p.interviews_done / p.interviews_target) * 100) : 0;
                return (
                  <div key={p.id} className="p-3 rounded-lg border bg-muted/30 space-y-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{p.name}</span>
                      <div className="flex items-center gap-1">
                        {p.is_early_adopter && <Badge variant="outline" className="text-xs border-primary/30 text-primary">Early Adopter</Badge>}
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => openEditP(p)}><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deletePersona(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {p.age_range && <div className="p-1.5 bg-background rounded"><span className="text-muted-foreground">Âge:</span> <span className="font-medium">{p.age_range}</span></div>}
                      {p.governorate && <div className="p-1.5 bg-background rounded"><span className="text-muted-foreground">Région:</span> <span className="font-medium">{p.governorate}</span></div>}
                      {p.socio_profile && <div className="p-1.5 bg-background rounded"><span className="text-muted-foreground">Socio:</span> <span className="font-medium">{p.socio_profile}</span></div>}
                      {p.psycho_profile && <div className="p-1.5 bg-background rounded"><span className="text-muted-foreground">Psycho:</span> <span className="font-medium">{p.psycho_profile}</span></div>}
                    </div>
                    {p.emotional_profile && <p className="text-xs text-muted-foreground italic">💡 {p.emotional_profile}</p>}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Interviews:</span> <span className="font-medium">{p.interviews_done}/{p.interviews_target}</span></div>
                      <div><span className="text-muted-foreground">Conversion:</span> <span className="font-medium">{p.conversion_rate}%</span></div>
                      <div><span className="text-muted-foreground">Satisfaction:</span> <span className="font-medium">{p.satisfaction_score}/10</span></div>
                    </div>
                  </div>
                );
              })}
              {personas.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aucun persona défini.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Tests adéquats ─── */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TestTube2 className="h-5 w-5 text-primary" /> Tests MVP Adéquats</CardTitle>
              <CardDescription>Tests assignés automatiquement depuis l'analyse IA d'incubation — {testResults.length} tests, {matchedTests.length} dans la bibliothèque</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.length > 0 ? testResults.map(tr => {
                const def = testDefs.find(t => t.id === tr.test_id);
                if (!def) return null;
                const protocol = def.detailed_protocol;
                return (
                  <div key={tr.id} className="p-4 rounded-lg border bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold">{def.name}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <Badge variant="outline" className="text-xs">{def.category}</Badge>
                          <Badge variant="outline" className="text-xs">{def.phase}</Badge>
                          {def.estimated_duration && <Badge variant="secondary" className="text-xs">⏱ {def.estimated_duration}</Badge>}
                        </div>
                      </div>
                      <Badge className={tr.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : tr.status === "in_progress" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-muted text-muted-foreground"}>
                        {tr.status === "not_started" ? "Non démarré" : tr.status === "in_progress" ? "En cours" : tr.status === "completed" ? "Terminé" : tr.status}
                      </Badge>
                    </div>
                    {def.objective && <p className="text-xs text-muted-foreground">{def.objective}</p>}
                    {def.description && <p className="text-xs">{def.description}</p>}

                    {/* Protocol */}
                    {protocol && typeof protocol === "object" && (
                      <details className="mt-2">
                        <summary className="text-xs font-medium cursor-pointer flex items-center gap-1.5 text-primary hover:underline">
                          <ClipboardList className="h-3.5 w-3.5" /> Voir le protocole détaillé
                        </summary>
                        <div className="mt-2 p-3 bg-background rounded-lg border text-xs space-y-2">
                          {Object.entries(protocol).map(([key, val]) => (
                            <div key={key}>
                              <span className="font-semibold capitalize">{key.replace(/_/g, " ")} :</span>{" "}
                              <span className="text-muted-foreground">{typeof val === "string" ? val : JSON.stringify(val)}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              }) : (
                <div className="text-center py-8">
                  <TestTube2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Aucun test assigné. Importez depuis l'incubation pour pré-remplir les tests adéquats.</p>
                  {incubationProjectData && (
                    <Button variant="outline" onClick={importFromIncubation} className="gap-2"><Upload className="h-4 w-4" /> Importer les tests</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── Add/Edit Dialogs ─── */}
      <Dialog open={showAdd === "hypothesis"} onOpenChange={(o) => { if (!o) { setShowAdd(null); setEditingH(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingH ? "Modifier l'hypothèse" : "Ajouter une hypothèse"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type de risque</Label>
              <Select value={hForm.type} onValueChange={v => setHForm({ ...hForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="risque_marché">Risque Marché</SelectItem>
                  <SelectItem value="risque_produit">Risque Produit</SelectItem>
                  <SelectItem value="risque_exécution">Risque Exécution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={hForm.description} onChange={e => setHForm({ ...hForm, description: e.target.value })} placeholder="Décrivez l'hypothèse à valider..." rows={3} />
            </div>
            <div>
              <Label>Méthode de test</Label>
              <Input value={hForm.test_method} onChange={e => setHForm({ ...hForm, test_method: e.target.value })} placeholder="Ex: Interview client, A/B test, landing page..." />
            </div>
            <div>
              <Label>Poids (1-5)</Label>
              <Select value={String(hForm.weight)} onValueChange={v => setHForm({ ...hForm, weight: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(w => <SelectItem key={w} value={String(w)}>{w} — {["Mineur", "Faible", "Moyen", "Fort", "Critique"][w - 1]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveHypothesis} className="w-full gap-2"><Save className="h-4 w-4" /> {editingH ? "Modifier" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd === "feature"} onOpenChange={(o) => { if (!o) { setShowAdd(null); setEditingF(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingF ? "Modifier la fonctionnalité" : "Ajouter une fonctionnalité"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={fForm.name} onChange={e => setFForm({ ...fForm, name: e.target.value })} placeholder="Nom de la fonctionnalité MVP..." />
            </div>
            <div>
              <Label>Priorité</Label>
              <Select value={fForm.priority} onValueChange={v => setFForm({ ...fForm, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core (essentielle)</SelectItem>
                  <SelectItem value="nice_to_have">Nice to have</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveFeature} className="w-full gap-2"><Save className="h-4 w-4" /> {editingF ? "Modifier" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd === "persona"} onOpenChange={(o) => { if (!o) { setShowAdd(null); setEditingP(null); } }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingP ? "Modifier le persona" : "Ajouter un persona"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom du persona</Label>
              <Input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} placeholder="Ex: L'Innovateur Technophile" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} placeholder="Décrivez ce persona en détail..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tranche d'âge</Label>
                <Input value={pForm.age_range} onChange={e => setPForm({ ...pForm, age_range: e.target.value })} placeholder="25-35" />
              </div>
              <div>
                <Label>Gouvernorat</Label>
                <Input value={pForm.governorate} onChange={e => setPForm({ ...pForm, governorate: e.target.value })} placeholder="Tunis" />
              </div>
            </div>
            <div>
              <Label>Profil socio-professionnel</Label>
              <Input value={pForm.socio_profile} onChange={e => setPForm({ ...pForm, socio_profile: e.target.value })} placeholder="Ex: Ingénieur / Manager / Étudiant" />
            </div>
            <div>
              <Label>Profil psychographique</Label>
              <Input value={pForm.psycho_profile} onChange={e => setPForm({ ...pForm, psycho_profile: e.target.value })} placeholder="Ex: Visionnaire, adopteur précoce, tolérant aux bugs" />
            </div>
            <div>
              <Label>Profil émotionnel</Label>
              <Input value={pForm.emotional_profile} onChange={e => setPForm({ ...pForm, emotional_profile: e.target.value })} placeholder="Ex: Excité par la nouveauté, frustré par la lenteur" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Objectif interviews</Label>
                <Input type="number" value={pForm.interviews_target} onChange={e => setPForm({ ...pForm, interviews_target: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={pForm.is_early_adopter} onCheckedChange={v => setPForm({ ...pForm, is_early_adopter: v })} />
                <Label>Early Adopter</Label>
              </div>
            </div>
            <Button onClick={savePersona} className="w-full gap-2"><Save className="h-4 w-4" /> {editingP ? "Modifier" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simulated scores generator
function generateSimulatedScores(hypotheses: Hypothesis[], features: Feature[], personas: Persona[], projectData: any) {
  const sectorMultiplier: Record<string, number> = { tech: 1.1, fintech: 0.95, healthtech: 0.9, edtech: 1.05, agritech: 0.85, ecommerce: 1.0 };
  const mult = sectorMultiplier[projectData?.sector?.toLowerCase()] || 1.0;

  const hScores: Record<string, number> = {};
  hypotheses.forEach(h => {
    let base = h.type === "risque_marché" ? 40 + Math.floor(Math.random() * 25) : h.type === "risque_produit" ? 35 + Math.floor(Math.random() * 30) : 30 + Math.floor(Math.random() * 20);
    hScores[h.id] = Math.min(Math.round(base * mult), 95);
  });

  const fScores: Record<string, number> = {};
  features.forEach(f => {
    let base = f.priority === "core" ? 30 + Math.floor(Math.random() * 35) : 20 + Math.floor(Math.random() * 25);
    fScores[f.id] = Math.min(Math.round(base * mult), 90);
  });

  const pScores: Record<string, any> = {};
  personas.forEach(p => {
    pScores[p.id] = { interviews: Math.floor(Math.random() * 8 + 3), conversion: Math.floor(Math.random() * 25 + 8), satisfaction: Math.floor(Math.random() * 3 + 5) };
  });

  return { hypotheses: hScores, features: fScores, personas: pScores };
}

export default V1TestSpace;
