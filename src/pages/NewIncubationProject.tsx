import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Rocket, Loader2, Sparkles, Bot, Lightbulb, Tag, Brain, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { knowledgeBaseTests } from "@/data/knowledgeBaseTests";
import { filterRelevantTests } from "@/utils/mvpTestFilter";
import { BM_PATTERNS } from "@/data/businessModelPatterns";
import { toast } from "sonner";

const SECTORS = ["SaaS", "Marketplace", "E-commerce", "FinTech", "HealthTech", "EdTech", "FoodTech", "GreenTech", "DeepTech", "Social Impact", "Autre"];
const STAGES = ["Idée", "Prototype", "MVP", "Traction initiale"];

const STEP_DEFINITIONS = [
  { step_number: 1, name: "Disruption", description: "Analyse du marché existant et identification des opportunités de rupture", gate_criteria: "≥70% des interviewés confirment le problème + marché >100M$" },
  { step_number: 2, name: "Réglementaire", description: "Évaluation du cadre légal et des risques de conformité", gate_criteria: "Voie réglementaire claire et tous les risques critiques mitigés" },
  { step_number: 3, name: "Running Lean", description: "Construction et validation du Lean Canvas", gate_criteria: "Lean Canvas validé par le terrain, hypothèses reclassées" },
  { step_number: 4, name: "MVP-Personas", description: "Définition des personas et périmètre MVP", gate_criteria: "Persona prioritaire identifié + MVP scope confirmé par les tests" },
  { step_number: 5, name: "Risques", description: "Identification et mitigation des risques critiques", gate_criteria: "Tous les risques critiques mitigés avec plan B documenté" },
  { step_number: 6, name: "Métriques", description: "Mise en place du framework AARRR et unit economics", gate_criteria: "Framework AARRR alimenté avec données réelles, LTV/CAC >3" },
  { step_number: 7, name: "Plan Tactique", description: "Roadmap 90 jours et préparation Demo Day", gate_criteria: "Plan tactique calibré avec données terrain, ready for Demo Day" },
];

interface DisruptionIdea {
  name: string;
  description: string;
  value_proposition: string;
  disruption_type: string;
  bm_pattern: string;
  bm_symbol: string;
  potential_score: number;
  target_market: string;
}

interface DisruptionResult {
  analysis: string;
  ideas: DisruptionIdea[];
  recommended_bm: string;
  recommended_bm_symbol: string;
}

interface BMClassification {
  primary: {
    number: number;
    symbol: string;
    name: string;
    confidence: number;
    reasoning: string;
    characteristics: string[];
    incubation_alignment: {
      disruption: string;
      lean_canvas: string;
      mvp_focus: string;
      metrics_focus: string;
    };
  };
  alternatives: { number: number; symbol: string; name: string; reasoning: string }[];
  key_metrics: { name: string; description: string; target: string; decision_rule: string }[];
  go_nogo_rules: string[];
}

const NewIncubationProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Disruption chatbot state
  const [chatKeywords, setChatKeywords] = useState("");
  const [chatCompany, setChatCompany] = useState("");
  const [chatActivity, setChatActivity] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [disruptionResult, setDisruptionResult] = useState<DisruptionResult | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<DisruptionIdea | null>(null);
  const [hasIdea, setHasIdea] = useState<boolean | null>(null);

  // BM Classification state
  const [bmClassification, setBmClassification] = useState<BMClassification | null>(null);
  const [classifyLoading, setClassifyLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", description: "", sector: "", stage: "",
    problem_description: "", solution_description: "", target_customers: "", business_model: "",
    business_model_symbol: "",
    competitor1: "", competitor2: "", competitor3: "", differentiator: "",
    has_users: false, user_count: 0, has_revenue: false, revenue_amount: 0,
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 1) return hasIdea !== null && (hasIdea ? (form.name.length >= 3 && form.sector && form.stage) : (selectedIdea !== null));
    if (step === 2) return form.name.length >= 3 && form.sector && form.stage && form.problem_description.length >= 20 && form.solution_description.length >= 20;
    if (step === 3) return true;
    return true;
  };

  const handleDisruptionGenerate = async () => {
    if (!chatKeywords && !chatCompany && !chatActivity) {
      toast.error("Entrez au moins un mot-clé, une entreprise ou une activité");
      return;
    }
    setChatLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("disruption-chatbot", {
        body: { keywords: chatKeywords, company: chatCompany, activity: chatActivity, sector: form.sector },
      });
      if (error) throw error;
      setDisruptionResult(data);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la génération");
    } finally {
      setChatLoading(false);
    }
  };

  const applyIdea = (idea: DisruptionIdea) => {
    setSelectedIdea(idea);
    update("name", idea.name);
    update("description", idea.description);
    update("problem_description", idea.value_proposition);
    update("solution_description", idea.description);
    update("business_model", idea.bm_pattern);
    update("business_model_symbol", idea.bm_symbol);
    toast.success(`Idée "${idea.name}" sélectionnée !`);
  };

  // Auto-classify BM based on project details
  const handleAutoClassify = async () => {
    if (form.problem_description.length < 20 || form.solution_description.length < 20) {
      toast.error("Remplissez le problème et la solution (min 20 caractères)");
      return;
    }
    setClassifyLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("classify-bm", {
        body: {
          name: form.name,
          description: form.description,
          problem: form.problem_description,
          solution: form.solution_description,
          sector: form.sector,
        },
      });
      if (error) throw error;
      if (data?.primary) {
        setBmClassification(data);
        update("business_model", data.primary.name);
        update("business_model_symbol", data.primary.symbol);
        toast.success(`BM classifié : ${data.primary.symbol} — ${data.primary.name} (${data.primary.confidence}% confiance)`);
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de classification");
    } finally {
      setClassifyLoading(false);
    }
  };

  const applyAlternativeBM = (alt: { number: number; symbol: string; name: string }) => {
    update("business_model", alt.name);
    update("business_model_symbol", alt.symbol);
    toast.success(`BM changé pour : ${alt.symbol} — ${alt.name}`);
  };

  const handleSubmit = async () => {
    if (!user) { toast.error("Vous devez être connecté"); return; }
    setSubmitting(true);
    try {
      const competitors = [form.competitor1, form.competitor2, form.competitor3].filter(Boolean);
      const { data: project, error: projectError } = await supabase
        .from("incubation_projects")
        .insert({
          user_id: user.id, name: form.name, description: form.description,
          sector: form.sector, stage: form.stage,
          problem_description: form.problem_description, solution_description: form.solution_description,
          target_customers: form.target_customers, business_model: form.business_model,
          competitors, differentiator: form.differentiator,
          has_users: form.has_users, user_count: form.has_users ? form.user_count : 0,
          has_revenue: form.has_revenue, revenue_amount: form.has_revenue ? form.revenue_amount : 0,
        })
        .select().single();

      if (projectError) throw projectError;

      const stepsToInsert = STEP_DEFINITIONS.map(s => ({
        project_id: project.id, step_number: s.step_number, name: s.name,
        description: s.description, status: s.step_number === 1 ? "active" : "locked",
        gate_criteria: s.gate_criteria,
      }));

      const { data: stepsData, error: stepsError } = await supabase
        .from("incubation_steps").insert(stepsToInsert).select();
      if (stepsError) throw stepsError;

      const filteredTests = filterRelevantTests(knowledgeBaseTests, {
        sector: form.sector,
        businessModel: form.business_model,
        bmSymbol: form.business_model_symbol,
        problemDescription: form.problem_description,
        solutionDescription: form.solution_description,
      });

      const testsToInsert: any[] = [];
      for (const stepRow of stepsData) {
        const stepTests = filteredTests.filter(t => t.associated_step === stepRow.step_number);
        stepTests.forEach(t => {
          testsToInsert.push({
            step_id: stepRow.id, project_id: project.id, test_number: t.test_number,
            name: t.name, category: t.category, objective: t.objective,
            protocol: t.detailed_protocol, target_metrics: t.target_metrics,
            recommended_tools: t.recommended_tools, status: "not_started",
          });
        });
      }

      if (testsToInsert.length > 0) {
        const { error: testsError } = await supabase.from("mvp_tests").insert(testsToInsert);
        if (testsError) throw testsError;
      }

      toast.success(`🚀 Projet créé avec ${testsToInsert.length} tests MVP pertinents !`);
      navigate(`/pole-strategique/${project.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la création du projet");
    } finally {
      setSubmitting(false);
    }
  };

  const wizardSteps = ["Idéation", "Détails", "Concurrence", "Confirmation"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/pole-strategique")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <h1 className="text-2xl font-bold mb-6">Nouveau projet d'incubation</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {wizardSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 < step ? "bg-emerald-500 text-white" :
                i + 1 === step ? "bg-primary text-primary-foreground ring-4 ring-primary/30" :
                "bg-muted text-muted-foreground"
              }`}>
                {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden md:inline">{s}</span>
              {i < wizardSteps.length - 1 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "bg-emerald-500" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card>
              <CardContent className="p-6 space-y-5">
                {step === 1 && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-base font-bold">Avez-vous déjà une idée de projet ?</Label>
                      <RadioGroup
                        value={hasIdea === null ? "" : hasIdea ? "yes" : "no"}
                        onValueChange={v => setHasIdea(v === "yes")}
                        className="flex gap-4"
                      >
                        <Label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${hasIdea === true ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                          <RadioGroupItem value="yes" /> Oui, j'ai une idée
                        </Label>
                        <Label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${hasIdea === false ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                          <RadioGroupItem value="no" /> Non, aidez-moi !
                        </Label>
                      </RadioGroup>
                    </div>

                    {hasIdea === true && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div><Label>Nom du projet *</Label><Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Mon projet innovant" /></div>
                        <div><Label>Secteur *</Label>
                          <Select value={form.sector} onValueChange={v => update("sector", v)}>
                            <SelectTrigger><SelectValue placeholder="Choisir un secteur" /></SelectTrigger>
                            <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Stade actuel *</Label>
                          <RadioGroup value={form.stage} onValueChange={v => update("stage", v)} className="flex flex-wrap gap-3 mt-2">
                            {STAGES.map(s => (
                              <Label key={s} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.stage === s ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                                <RadioGroupItem value={s} />{s}
                              </Label>
                            ))}
                          </RadioGroup>
                        </div>
                      </motion.div>
                    )}

                    {hasIdea === false && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <Card className="border-primary/30 bg-primary/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Bot className="h-5 w-5 text-primary" />
                              Chatbot Innovation Disruptive
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              Entrez des mots-clés, une entreprise ou une activité pour générer des idées de disruption verticale et horizontale.
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div><Label className="text-xs">Mots-clés (secteur, technologie, tendance...)</Label>
                              <Input value={chatKeywords} onChange={e => setChatKeywords(e.target.value)} placeholder="ex: mobilité, IA, santé mentale, agriculture..." />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><Label className="text-xs">Entreprise à disrupter</Label>
                                <Input value={chatCompany} onChange={e => setChatCompany(e.target.value)} placeholder="ex: Uber, Airbnb..." />
                              </div>
                              <div><Label className="text-xs">Activité / Secteur</Label>
                                <Input value={chatActivity} onChange={e => setChatActivity(e.target.value)} placeholder="ex: livraison, éducation..." />
                              </div>
                            </div>
                            <div><Label className="text-xs">Écosystème cible</Label>
                              <Select value={form.sector} onValueChange={v => update("sector", v)}>
                                <SelectTrigger><SelectValue placeholder="Choisir un secteur" /></SelectTrigger>
                                <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleDisruptionGenerate} disabled={chatLoading} className="w-full gap-2">
                              {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                              {chatLoading ? "Génération en cours..." : "Générer des idées disruptives"}
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Disruption Results */}
                        {disruptionResult && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                            {disruptionResult.analysis && (
                              <Card className="bg-muted/50">
                                <CardContent className="p-4">
                                  <p className="text-sm"><Lightbulb className="h-4 w-4 inline mr-1 text-primary" /> {disruptionResult.analysis}</p>
                                </CardContent>
                              </Card>
                            )}
                            {disruptionResult.ideas?.map((idea, i) => (
                              <Card key={i} className={`cursor-pointer transition-all hover:shadow-md ${selectedIdea?.name === idea.name ? "ring-2 ring-primary border-primary" : "border-border"}`}
                                onClick={() => applyIdea(idea)}>
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-bold text-sm">{idea.name}</h4>
                                      <p className="text-xs text-muted-foreground">{idea.description}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs shrink-0">
                                      {idea.potential_score}/10
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-[10px]">
                                      <Tag className="h-3 w-3 mr-1" />{idea.bm_pattern} ({idea.bm_symbol})
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px]">
                                      {idea.disruption_type === "verticale" ? "↕️" : "↔️"} {idea.disruption_type}
                                    </Badge>
                                  </div>
                                  {selectedIdea?.name === idea.name && (
                                    <p className="text-xs text-primary font-medium">✓ Idée sélectionnée</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </motion.div>
                        )}

                        {selectedIdea && (
                          <div className="space-y-3 pt-2">
                            <div><Label>Stade actuel *</Label>
                              <RadioGroup value={form.stage || "Idée"} onValueChange={v => update("stage", v)} className="flex flex-wrap gap-3 mt-2">
                                {STAGES.map(s => (
                                  <Label key={s} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.stage === s ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                                    <RadioGroupItem value={s} />{s}
                                  </Label>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <div><Label>Nom du projet *</Label><Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Mon projet innovant" /></div>
                    <div><Label>Description courte (max 280 caractères)</Label><Textarea value={form.description} onChange={e => update("description", e.target.value.slice(0, 280))} placeholder="Décrivez brièvement votre projet..." maxLength={280} /><p className="text-xs text-muted-foreground mt-1">{form.description.length}/280</p></div>
                    <div><Label>Quel problème résolvez-vous ? * (min 20 caractères)</Label><Textarea value={form.problem_description} onChange={e => update("problem_description", e.target.value)} placeholder="Décrivez le problème que vous cherchez à résoudre..." rows={4} /><p className="text-xs text-muted-foreground mt-1">{form.problem_description.length} caractères</p></div>
                    <div><Label>Quelle est votre solution ? * (min 20 caractères)</Label><Textarea value={form.solution_description} onChange={e => update("solution_description", e.target.value)} placeholder="Décrivez votre solution..." rows={4} /><p className="text-xs text-muted-foreground mt-1">{form.solution_description.length} caractères</p></div>
                    <div><Label>Clients cibles</Label><Textarea value={form.target_customers} onChange={e => update("target_customers", e.target.value)} placeholder="PME du secteur retail en France..." rows={2} /></div>

                    {/* Auto-classify BM button */}
                    <div className="border-t pt-4">
                      <Button
                        onClick={handleAutoClassify}
                        disabled={classifyLoading || form.problem_description.length < 20 || form.solution_description.length < 20}
                        variant="outline"
                        className="w-full gap-2 border-primary/30 hover:bg-primary/5"
                      >
                        {classifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4 text-primary" />}
                        {classifyLoading ? "Classification IA en cours..." : "🎯 Classifier automatiquement le Business Model"}
                      </Button>
                      <p className="text-[11px] text-muted-foreground text-center mt-1">
                        L'IA analyse votre projet pour recommander le pattern BM le plus adapté
                      </p>
                    </div>

                    {/* BM Classification Result */}
                    {bmClassification && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* Primary BM */}
                        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                  <span className="font-mono font-bold text-primary text-sm">{bmClassification.primary.symbol}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm">{bmClassification.primary.name}</h4>
                                  <p className="text-[11px] text-muted-foreground">Pattern #{bmClassification.primary.number}</p>
                                </div>
                              </div>
                              <Badge className={`${bmClassification.primary.confidence >= 75 ? "bg-emerald-500" : bmClassification.primary.confidence >= 50 ? "bg-amber-500" : "bg-red-500"} text-white`}>
                                {bmClassification.primary.confidence}% confiance
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{bmClassification.primary.reasoning}</p>

                            {/* Characteristics */}
                            <div>
                              <p className="text-xs font-semibold mb-1.5">Caractéristiques clés</p>
                              <div className="flex flex-wrap gap-1">
                                {bmClassification.primary.characteristics.map((c, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px]">{c}</Badge>
                                ))}
                              </div>
                            </div>

                            {/* Incubation Alignment */}
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(bmClassification.primary.incubation_alignment).map(([key, value]) => (
                                <div key={key} className="p-2 rounded-lg bg-background/60 border">
                                  <p className="text-[10px] font-semibold capitalize text-primary">{key.replace(/_/g, " ")}</p>
                                  <p className="text-[11px] text-muted-foreground leading-tight">{value}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Key Metrics */}
                        <Card className="border-blue-500/20">
                          <CardHeader className="pb-2 pt-4 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-500" />
                              Métriques principales & Règles de décision
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 space-y-2">
                            {bmClassification.key_metrics.map((m, i) => (
                              <div key={i} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-xs">{m.name}</span>
                                  <Badge variant="outline" className="text-[10px] font-mono">{m.target}</Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{m.description}</p>
                                <div className="flex items-start gap-1 mt-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-amber-700 dark:text-amber-400">{m.decision_rule}</p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* GO/NO-GO Rules */}
                        <Card className="border-emerald-500/20">
                          <CardHeader className="pb-2 pt-4 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Règles GO / NO-GO
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4">
                            <ul className="space-y-1.5">
                              {bmClassification.go_nogo_rules.map((rule, i) => (
                                <li key={i} className="text-xs flex items-start gap-2">
                                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                    rule.toLowerCase().includes("go si") || rule.toLowerCase().startsWith("go") 
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" 
                                      : rule.toLowerCase().includes("no-go") 
                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                  }`}>
                                    {rule.toLowerCase().includes("no-go") ? "✕" : rule.toLowerCase().includes("pivot") ? "↻" : "✓"}
                                  </span>
                                  <span className="text-muted-foreground">{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Alternatives */}
                        {bmClassification.alternatives?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2">Patterns alternatifs</p>
                            <div className="flex flex-wrap gap-2">
                              {bmClassification.alternatives.map((alt, i) => (
                                <Button
                                  key={i}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-auto py-2 px-3"
                                  onClick={() => applyAlternativeBM(alt)}
                                >
                                  <span className="font-mono mr-1.5">{alt.symbol}</span>
                                  {alt.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Fallback manual BM select */}
                    {!bmClassification && !form.business_model && (
                      <div><Label>Ou choisir manuellement</Label>
                        <Select value={form.business_model} onValueChange={v => {
                          update("business_model", v);
                          const pattern = BM_PATTERNS.find(p => p.name === v);
                          if (pattern) update("business_model_symbol", pattern.symbol);
                        }}>
                          <SelectTrigger><SelectValue placeholder="Choisir un pattern BM" /></SelectTrigger>
                          <SelectContent className="max-h-60">
                            {BM_PATTERNS.map(p => (
                              <SelectItem key={p.number} value={p.name}>
                                <span className="font-mono text-xs mr-2">{p.symbol}</span> {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {!bmClassification && form.business_model && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground">Business Model classifié</p>
                        <p className="font-medium text-sm"><span className="font-mono mr-1">{form.business_model_symbol}</span> {form.business_model}</p>
                        <p className="text-xs text-muted-foreground mt-1">{BM_PATTERNS.find(p => p.name === form.business_model)?.idea}</p>
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <div><Label>Concurrents directs (jusqu'à 3)</Label>
                      <div className="space-y-2 mt-2">
                        <Input value={form.competitor1} onChange={e => update("competitor1", e.target.value)} placeholder="Concurrent 1" />
                        <Input value={form.competitor2} onChange={e => update("competitor2", e.target.value)} placeholder="Concurrent 2" />
                        <Input value={form.competitor3} onChange={e => update("competitor3", e.target.value)} placeholder="Concurrent 3" />
                      </div>
                    </div>
                    <div><Label>En quoi êtes-vous différent ?</Label><Textarea value={form.differentiator} onChange={e => update("differentiator", e.target.value)} placeholder="Notre avantage unique..." rows={3} /></div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <Label>Avez-vous déjà des utilisateurs ?</Label>
                      <Switch checked={form.has_users} onCheckedChange={v => update("has_users", v)} />
                    </div>
                    {form.has_users && <div><Label>Nombre d'utilisateurs</Label><Input type="number" value={form.user_count} onChange={e => update("user_count", parseInt(e.target.value) || 0)} /></div>}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <Label>Avez-vous déjà du revenu ?</Label>
                      <Switch checked={form.has_revenue} onCheckedChange={v => update("has_revenue", v)} />
                    </div>
                    {form.has_revenue && <div><Label>Montant mensuel (€)</Label><Input type="number" value={form.revenue_amount} onChange={e => update("revenue_amount", parseInt(e.target.value) || 0)} /></div>}
                  </>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Récapitulatif</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Nom</p><p className="font-medium">{form.name}</p></div>
                      <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Secteur</p><p className="font-medium">{form.sector}</p></div>
                      <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Stade</p><p className="font-medium">{form.stage}</p></div>
                      <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Business Model</p><p className="font-medium">{form.business_model_symbol ? `${form.business_model_symbol} — ` : ""}{form.business_model || "—"}</p></div>
                    </div>
                    {form.description && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Description</p><p className="text-sm">{form.description}</p></div>}
                    {form.problem_description && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Problème</p><p className="text-sm">{form.problem_description}</p></div>}
                    {form.solution_description && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Solution</p><p className="text-sm">{form.solution_description}</p></div>}

                    {/* BM Metrics in recap */}
                    {bmClassification && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <p className="text-xs font-semibold">📊 Métriques clés ({bmClassification.primary.symbol} — {bmClassification.primary.name})</p>
                        {bmClassification.key_metrics.map((m, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="font-medium">{m.name}</span>
                            <span className="text-muted-foreground font-mono">{m.target}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {[form.competitor1, form.competitor2, form.competitor3].filter(Boolean).length > 0 && (
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Concurrents</p>
                        <div className="flex flex-wrap gap-2">{[form.competitor1, form.competitor2, form.competitor3].filter(Boolean).map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                      </div>
                    )}
                    <div className="flex gap-4 text-sm">
                      {form.has_users && <span>👥 {form.user_count} utilisateurs</span>}
                      {form.has_revenue && <span>💰 {form.revenue_amount}€/mois</span>}
                    </div>
                    {/* Tests preview */}
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Tests MVP sélectionnés intelligemment</p>
                      <p className="text-sm font-medium">
                        {filterRelevantTests(knowledgeBaseTests, {
                          sector: form.sector, businessModel: form.business_model,
                          bmSymbol: form.business_model_symbol,
                          problemDescription: form.problem_description,
                          solutionDescription: form.solution_description,
                        }).length} tests / {knowledgeBaseTests.length} disponibles
                      </p>
                      <p className="text-xs text-muted-foreground">Filtrage basé sur : {[form.sector, form.business_model, "contexte projet"].filter(Boolean).join(" + ")}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Précédent
          </Button>
          {step < 4 ? (
            <Button onClick={() => {
              if (step === 1 && hasIdea === false && selectedIdea && !form.stage) {
                update("stage", "Idée");
              }
              setStep(s => s + 1);
            }} disabled={!canNext()} className="gap-2">
              Suivant <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-gradient-to-r from-primary to-purple-600 shadow-lg">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              {submitting ? "Création en cours..." : "Lancer l'analyse IA"}
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewIncubationProject;
