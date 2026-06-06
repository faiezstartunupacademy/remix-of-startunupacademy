import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronUp, Clock, Wrench,
  Lightbulb, FileText, CheckCircle2, XCircle, Play, Loader2,
  GraduationCap, Star, AlertTriangle, Brain, Users, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { productStageToTestPhase, PRODUCT_STAGE_LABEL, type ProductStage } from "@/utils/stageTaxonomy";


type ProtocolStep = { step: number; title: string; description: string };
type FormField = { name: string; label: string; type: string; options?: string[] };

type Test = {
  id: string; phase: string; name: string; description: string | null;
  applicable_sectors: string[]; applicable_scenarios: string[];
  protocol_steps: ProtocolStep[]; techniques: string[]; required_tools: string[];
  estimated_duration: string | null; difficulty: string | null; form_fields: FormField[];
};

type TestResult = {
  id: string; test_id: string; status: string;
  start_date: string | null; end_date: string | null;
  qualitative_result: string | null; quantitative_result: number | null;
};

type TeamMember = {
  name: string; role: string; skills: Record<string, number>;
  availability_percent: number; experience_years: number;
};

type IncubationContext = {
  businessModel?: string | null;
  phase?: string | null;
  ecosystem?: string | null;
  aiInsights: string[];
  stepScores: { step: string; score: number }[];
};

type Props = {
  project: { id: string; sector: string; scenario: string; description?: string | null; name?: string; product_stage?: string | null };
};


const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  not_started: { label: "Non commencé", icon: Play, color: "text-muted-foreground" },
  in_progress: { label: "En cours", icon: Play, color: "text-blue-500" },
  passed: { label: "Réussi", icon: CheckCircle2, color: "text-emerald-500" },
  failed: { label: "Échoué", icon: XCircle, color: "text-red-500" },
};

// Mentor reasoning engine
const PHASE_RATIONALE: Record<string, string> = {
  "Problem-Solution Fit": "À ce stade, votre priorité absolue est de valider que le problème existe réellement et que votre solution y répond. Comme le dit Steve Blank : « Get out of the building! »",
  "Product-Market Fit": "Vous devez maintenant prouver que votre produit trouve son marché. C'est la phase où 90% des startups échouent — chaque test ici réduit votre risque d'exécution.",
  "Scale": "Vous avez validé le fit. Ces tests mesurent votre capacité à croître de manière rentable et durable.",
};

const SKILL_TEST_MAP: Record<string, string[]> = {
  technique: ["API", "tech", "développeur", "intégration", "prototype", "code", "architecture"],
  business: ["business model", "pricing", "revenue", "vente", "commercial", "B2B"],
  marketing: ["acquisition", "viral", "SEO", "publicité", "contenu", "growth", "canal", "trafic"],
  design: ["UX", "UI", "prototype", "wireframe", "design", "utilisateur", "ergonomie"],
  analytics: ["métriques", "KPI", "données", "analytics", "mesure", "tracking", "dashboard"],
  leadership: ["pitch", "investisseur", "équipe", "recrutement", "vision"],
};

const BM_TEST_KEYWORDS: Record<string, { keywords: string[]; rationale: string }> = {
  "SaaS": { keywords: ["rétention", "churn", "MRR", "onboarding", "activation", "NPS", "abonnement"], rationale: "Modèle SaaS → priorité à la rétention, activation et métriques récurrentes (MRR/Churn)" },
  "Marketplace": { keywords: ["liquidité", "matching", "offre", "demande", "réseau", "commission", "deux faces"], rationale: "Marketplace → résoudre le problème poule-œuf et atteindre la liquidité" },
  "E-commerce": { keywords: ["conversion", "panier", "logistique", "pricing", "fiche produit"], rationale: "E-commerce → optimiser le tunnel de conversion et la logistique" },
  "FinTech": { keywords: ["compliance", "sécurité", "confiance", "régulation", "paiement"], rationale: "FinTech → la confiance et la compliance sont des prérequis non-négociables" },
  "HealthTech": { keywords: ["réglementation", "essai clinique", "patient", "praticien", "certification"], rationale: "HealthTech → validation réglementaire et acceptation par les praticiens" },
  "EdTech": { keywords: ["engagement", "apprentissage", "complétion", "pédagogie", "certification"], rationale: "EdTech → mesurer l'engagement et les résultats d'apprentissage" },
  "DeepTech": { keywords: ["brevet", "R&D", "prototype", "preuve de concept", "performance"], rationale: "DeepTech → prouver la faisabilité technique avant le marché" },
  "AgriTech": { keywords: ["terrain", "agriculteur", "saison", "rendement", "IoT"], rationale: "AgriTech → valider sur le terrain avec les agriculteurs" },
  "CleanTech": { keywords: ["impact", "carbone", "durabilité", "réglementation", "ESG"], rationale: "CleanTech → quantifier l'impact environnemental mesurable" },
};

function generateMentorRationale(test: Test, sector: string, scenario: string, teamSkills: Record<string, number>, description?: string | null, incubation?: IncubationContext): { score: number; rationale: string; priority: "essentiel" | "recommandé" | "optionnel" } {
  const testText = `${test.name} ${test.description || ""} ${test.techniques?.join(" ") || ""}`.toLowerCase();
  let score = 50;
  const reasons: string[] = [];

  // 0. Sector & Scenario matching bonus/penalty
  const sectorMatch = (test.applicable_sectors || []).length === 0 || (test.applicable_sectors || []).includes(sector);
  const scenarioMatch = (test.applicable_scenarios || []).length === 0 || (test.applicable_scenarios || []).includes(scenario);
  
  if (sectorMatch && scenarioMatch) {
    score += 15;
    reasons.push("✅ Ce test correspond à votre secteur et scénario");
  } else if (sectorMatch) {
    score += 5;
    reasons.push("📋 Ce test correspond à votre secteur mais pas au scénario actuel");
  } else if (scenarioMatch) {
    score += 5;
    reasons.push("📋 Ce test correspond à votre scénario mais pas à votre secteur");
  } else {
    score -= 15;
    reasons.push("ℹ️ Ce test est générique — moins prioritaire pour votre configuration");
  }

  // 1. Sector alignment
  const sectorConfig = BM_TEST_KEYWORDS[sector];
  if (sectorConfig) {
    const matches = sectorConfig.keywords.filter(kw => testText.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      score += matches.length * 12;
      reasons.push(`🎯 ${sectorConfig.rationale}`);
    }
  }

  // 2. Scenario alignment
  if (scenario === "A" && test.phase === "Problem-Solution Fit") {
    score += 15;
    reasons.push("💡 Scénario « Idée seule » → priorité à la découverte problème/solution");
  } else if (scenario === "B" && test.phase === "Product-Market Fit") {
    score += 15;
    reasons.push("📋 Scénario « Idée + BM » → vous pouvez passer directement aux tests PMF");
  }

  // 3. Team skills match
  const avgTeamSkills = Object.entries(teamSkills);
  const strongSkills = avgTeamSkills.filter(([, v]) => v >= 7).map(([k]) => k);
  const weakSkills = avgTeamSkills.filter(([, v]) => v > 0 && v < 4).map(([k]) => k);

  for (const skill of strongSkills) {
    const keywords = SKILL_TEST_MAP[skill] || [];
    if (keywords.some(kw => testText.includes(kw.toLowerCase()))) {
      score += 8;
      reasons.push(`💪 Votre équipe excelle en ${skill} — vous pouvez exécuter ce test efficacement`);
      break;
    }
  }

  for (const skill of weakSkills) {
    const keywords = SKILL_TEST_MAP[skill] || [];
    if (keywords.some(kw => testText.includes(kw.toLowerCase()))) {
      score -= 5;
      reasons.push(`⚠️ Compétence ${skill} faible dans l'équipe — envisagez un mentor ou un partenaire pour ce test`);
      break;
    }
  }

  // 4. Description context matching
  if (description) {
    const descLower = description.toLowerCase();
    const testKeywords = (test.techniques || []).map(t => t.toLowerCase());
    if (testKeywords.some(kw => descLower.includes(kw))) {
      score += 10;
      reasons.push("🔗 Ce test est directement lié à la description de votre projet");
    }
  }

  // 5. Difficulty vs team experience
  if (test.difficulty === "difficile" && avgTeamSkills.every(([, v]) => v < 5)) {
    score -= 10;
    reasons.push("🎓 Test avancé — votre équipe pourrait bénéficier d'un accompagnement expert");
  }
  if (test.difficulty === "facile") {
    score += 5;
    reasons.push("✅ Test fondamental — recommandé comme point de départ");
  }

  // 6. Incubation IA context enrichment
  if (incubation) {
    // Business model alignment from incubation
    if (incubation.businessModel) {
      const bmLower = incubation.businessModel.toLowerCase();
      const bmKeywordsAll = Object.entries(BM_TEST_KEYWORDS);
      for (const [bmKey, config] of bmKeywordsAll) {
        if (bmLower.includes(bmKey.toLowerCase())) {
          const matches = config.keywords.filter(kw => testText.includes(kw.toLowerCase()));
          if (matches.length > 0) {
            score += matches.length * 8;
            reasons.push(`🧠 Incubation IA : BM "${incubation.businessModel}" → ${config.rationale}`);
            break;
          }
        }
      }
    }

    // Phase alignment from incubation progress
    if (incubation.phase) {
      const phaseLower = incubation.phase.toLowerCase();
      if (phaseLower.includes("découverte") || phaseLower.includes("problème")) {
        if (test.phase === "Problem-Solution Fit") { score += 10; reasons.push("🔬 Phase incubation : Découverte → priorité aux tests PSF"); }
      } else if (phaseLower.includes("validation") || phaseLower.includes("marché")) {
        if (test.phase === "Product-Market Fit") { score += 10; reasons.push("📈 Phase incubation : Validation → priorité aux tests PMF"); }
      } else if (phaseLower.includes("croissance") || phaseLower.includes("scale")) {
        if (test.phase === "Scale") { score += 10; reasons.push("🚀 Phase incubation : Scale → priorité aux tests de croissance"); }
      }
    }

    // AI insights from incubation reports
    for (const insight of incubation.aiInsights) {
      const insightLower = insight.toLowerCase();
      const testKeywords = (test.techniques || []).map(t => t.toLowerCase());
      if (testKeywords.some(kw => insightLower.includes(kw))) {
        score += 6;
        reasons.push("🤖 L'IA d'incubation recommande ce type de validation");
        break;
      }
    }

    // Weak step scores → recommend related tests
    for (const stepScore of incubation.stepScores) {
      if (stepScore.score < 60) {
        const stepLower = stepScore.step.toLowerCase();
        if (testText.includes(stepLower.split(" ")[0])) {
          score += 8;
          reasons.push(`📉 Score faible (${stepScore.score}/100) à l'étape "${stepScore.step}" → ce test peut renforcer cette dimension`);
          break;
        }
      }
    }

    // Ecosystem context
    if (incubation.ecosystem) {
      const ecoLower = incubation.ecosystem.toLowerCase();
      if (ecoLower.includes("plateforme") && testText.includes("réseau")) { score += 5; reasons.push("🌐 Écosystème plateforme → tests réseau pertinents"); }
      if (ecoLower.includes("marketplace") && testText.includes("liquidité")) { score += 5; reasons.push("🏪 Écosystème marketplace → liquidité prioritaire"); }
      if (ecoLower.includes("b2b") && testText.includes("enterprise")) { score += 5; reasons.push("🏢 Écosystème B2B → validation enterprise"); }
    }
  }

  // Default rationale
  if (reasons.length === 0) {
    reasons.push("📊 Test standard de validation — applicable à tout type de startup");
  }

  score = Math.min(Math.max(score, 10), 100);
  const priority = score >= 75 ? "essentiel" : score >= 50 ? "recommandé" : "optionnel";

  return { score, rationale: reasons.join("\n"), priority };
}

const MvpTestsLibraryV2 = ({ project }: Props) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [incubationCtx, setIncubationCtx] = useState<IncubationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);
  const [resultForm, setResultForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [analyzingVerdict, setAnalyzingVerdict] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showAllPhases, setShowAllPhases] = useState<boolean>(false);
  const { toast } = useToast();

  const targetPhase = useMemo(() => productStageToTestPhase(project.product_stage), [project.product_stage]);


  useEffect(() => { loadData(); }, [project.id]);

  async function loadData() {
    const [{ data: testsData }, { data: resultsData }, { data: teamData }] = await Promise.all([
      supabase.from("mvp_tests_library" as any).select("*"),
      supabase.from("mvp_test_results" as any).select("*").eq("project_id", project.id),
      supabase.from("mvp_team_members" as any).select("*").eq("project_id", project.id),
    ]);
    if (testsData) {
      // Include ALL tests, filtering logic is handled by the mentor scoring system
      // Tests matching sector/scenario get higher scores; non-matching become "optionnel"
      setTests(testsData as any[]);
    }
    if (resultsData) setResults(resultsData as any[]);
    if (teamData) setTeamMembers(teamData as any[]);

    // Fetch incubation context for enriched filtering
    await loadIncubationContext();
    setLoading(false);
  }

  async function loadIncubationContext() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find the user's incubation project (latest active or completed)
      const { data: incProjects } = await supabase
        .from("incubation_projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (!incProjects || incProjects.length === 0) return;

      const incProject = incProjects[0];

      // Fetch incubation steps with AI reports
      const { data: steps } = await supabase
        .from("incubation_steps")
        .select("*")
        .eq("project_id", incProject.id)
        .order("step_number");

      const aiInsights: string[] = [];
      const stepScores: { step: string; score: number }[] = [];

      if (steps) {
        for (const step of steps) {
          if (step.ai_report_score) {
            stepScores.push({ step: step.name, score: Number(step.ai_report_score) });
          }
          if (step.ai_report_content && typeof step.ai_report_content === "object") {
            const report = step.ai_report_content as Record<string, unknown>;
            for (const value of Object.values(report)) {
              if (typeof value === "string" && value.length > 20) {
                aiInsights.push(value.slice(0, 200));
              }
            }
          }
        }
      }

      // Determine current phase from progress
      const progress = incProject.overall_progress || 0;
      let phase = "Découverte";
      if (progress >= 70) phase = "Croissance / Scale";
      else if (progress >= 40) phase = "Validation marché";

      setIncubationCtx({
        businessModel: incProject.business_model,
        phase,
        ecosystem: incProject.sector,
        aiInsights: aiInsights.slice(0, 10), // Limit to 10 insights
        stepScores,
      });
    } catch (e) {
      console.error("Incubation context load error:", e);
    }
  }

  // Aggregate team skills
  const avgTeamSkills = useMemo(() => {
    if (teamMembers.length === 0) return {};
    const totals: Record<string, number[]> = {};
    teamMembers.forEach(m => {
      const skills = typeof m.skills === "object" && m.skills ? m.skills : {};
      Object.entries(skills).forEach(([k, v]) => {
        if (!totals[k]) totals[k] = [];
        totals[k].push(Number(v) || 0);
      });
    });
    const avg: Record<string, number> = {};
    Object.entries(totals).forEach(([k, vals]) => {
      avg[k] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    return avg;
  }, [teamMembers]);

  // Compute mentor rationale for each test (enriched with incubation context)
  const testsWithRationale = useMemo(() => {
    return tests.map(test => {
      const analysis = generateMentorRationale(test, project.sector, project.scenario, avgTeamSkills, project.description, incubationCtx || undefined);
      return { ...test, ...analysis };
    }).sort((a, b) => b.score - a.score);
  }, [tests, avgTeamSkills, project.sector, project.scenario, project.description, incubationCtx]);

  const filteredTests = useMemo(() => {
    let list = testsWithRationale;
    // 1. Filter by product stage -> test phase (auto, with toggle to reveal all)
    if (targetPhase && !showAllPhases) {
      list = list.filter(t => t.phase === targetPhase);
    }
    // 2. Filter by priority
    if (filterPriority !== "all") {
      list = list.filter(t => t.priority === filterPriority);
    }
    return list;
  }, [testsWithRationale, filterPriority, targetPhase, showAllPhases]);


  const openTest = (test: Test) => {
    const existing = results.find(r => r.test_id === test.id);
    setResultForm({
      status: existing?.status || "not_started",
      start_date: existing?.start_date || "",
      end_date: existing?.end_date || "",
      qualitative_result: existing?.qualitative_result || "",
      quantitative_result: existing?.quantitative_result?.toString() || "",
    });
    setAiVerdict(null);
    setSelectedTest(test);
  };

  const saveResult = async () => {
    if (!selectedTest) return;
    setSaving(true);
    const existing = results.find(r => r.test_id === selectedTest.id);
    const payload = {
      project_id: project.id,
      test_id: selectedTest.id,
      status: resultForm.status || "not_started",
      start_date: resultForm.start_date || null,
      end_date: resultForm.end_date || null,
      qualitative_result: resultForm.qualitative_result || null,
      quantitative_result: resultForm.quantitative_result ? parseFloat(resultForm.quantitative_result) : null,
    };
    if (existing) {
      await supabase.from("mvp_test_results" as any).update(payload as any).eq("id", existing.id);
    } else {
      await supabase.from("mvp_test_results" as any).insert(payload as any);
    }
    await loadData();
    setSaving(false);
    setSelectedTest(null);
    toast({ title: "Résultat sauvegardé !" });
  };

  const getResult = (testId: string) => results.find(r => r.test_id === testId);
  const phases = [...new Set(filteredTests.map(t => t.phase))];
  const difficultyColor = (d: string | null) => d === "facile" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : d === "difficile" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  const priorityConfig = {
    essentiel: { color: "bg-red-500/10 text-red-600 border-red-500/30", icon: AlertTriangle, label: "Essentiel" },
    recommandé: { color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Star, label: "Recommandé" },
    optionnel: { color: "bg-muted text-muted-foreground border-border", icon: Lightbulb, label: "Optionnel" },
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const essentialCount = testsWithRationale.filter(t => t.priority === "essentiel").length;
  const recommendedCount = testsWithRationale.filter(t => t.priority === "recommandé").length;
  const optionalCount = testsWithRationale.filter(t => t.priority === "optionnel").length;

  return (
    <div className="space-y-6">
      {/* Header with mentor intro */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Recommandations du Mentor IA
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                En tant que mentor senior, j'ai analysé votre <strong>secteur ({project.sector})</strong>, 
                votre <strong>scénario ({project.scenario === "A" ? "Idée seule" : "Idée + BM validé"})</strong>
                {teamMembers.length > 0 && <>, les <strong>compétences de votre équipe ({teamMembers.length} membres)</strong></>}
                {incubationCtx && <>, les <strong>résultats de votre incubation IA (BM: {incubationCtx.businessModel || "—"}, Phase: {incubationCtx.phase}, {incubationCtx.stepScores.length} scores d'étapes)</strong></>}
                {" "}pour sélectionner et prioriser les tests les plus pertinents.
              </p>
              {!incubationCtx && (
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Lancez un projet d'incubation IA pour un filtrage enrichi basé sur votre BM, écosystème et rapports IA.
                </p>
              )}
              {teamMembers.length === 0 && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Ajoutez les membres de votre équipe dans l'onglet Dashboard → Équipe pour un filtrage encore plus précis.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage filter banner */}
      {targetPhase && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-600 text-white">
                Stade produit : {PRODUCT_STAGE_LABEL[project.product_stage as ProductStage]}
              </Badge>
              <span className="text-muted-foreground">
                {showAllPhases
                  ? "Affichage : tous les tests (toutes phases)"
                  : <>Affichage : phase <strong>{targetPhase}</strong> uniquement</>}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAllPhases(v => !v)} className="text-xs">
              {showAllPhases ? "Filtrer sur ma phase" : "Voir tous les tests"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Tests MVP & Protocoles</h3>
        <div className="flex gap-2 ml-auto flex-wrap">
          <Button size="sm" variant={filterPriority === "all" ? "default" : "outline"} onClick={() => setFilterPriority("all")} className="text-xs">
            Tous ({testsWithRationale.length})
          </Button>
          <Button size="sm" variant={filterPriority === "essentiel" ? "default" : "outline"} onClick={() => setFilterPriority("essentiel")} className="text-xs gap-1">
            <AlertTriangle className="h-3 w-3" /> Essentiels ({essentialCount})
          </Button>
          <Button size="sm" variant={filterPriority === "recommandé" ? "default" : "outline"} onClick={() => setFilterPriority("recommandé")} className="text-xs gap-1">
            <Star className="h-3 w-3" /> Recommandés ({recommendedCount})
          </Button>
          <Button size="sm" variant={filterPriority === "optionnel" ? "default" : "outline"} onClick={() => setFilterPriority("optionnel")} className="text-xs gap-1">
            <Lightbulb className="h-3 w-3" /> Optionnels ({optionalCount})
          </Button>
        </div>
      </div>


      {filteredTests.length === 0 ? (
        <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">Aucun test pour ce filtre.</p></CardContent></Card>
      ) : (
        phases.map(phase => {
          const phaseTests = filteredTests.filter(t => t.phase === phase);
          if (phaseTests.length === 0) return null;
          return (
            <div key={phase} className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className={phase === "Problem-Solution Fit" ? "bg-amber-500" : phase === "Product-Market Fit" ? "bg-blue-500" : "bg-emerald-500"}>
                  {phase}
                </Badge>
                <span className="text-xs text-muted-foreground italic">{PHASE_RATIONALE[phase]}</span>
              </div>
              <div className="space-y-3">
                {phaseTests.map((test: any) => {
                  const result = getResult(test.id);
                  const config = STATUS_CONFIG[result?.status || "not_started"];
                  const Icon = config.icon;
                  const isExpanded = expandedProtocol === test.id;
                  const isRationaleOpen = expandedRationale === test.id;
                  const pConfig = priorityConfig[test.priority as keyof typeof priorityConfig];
                  const PIcon = pConfig.icon;

                  return (
                    <motion.div key={test.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className={`transition-all ${result?.status === "passed" ? "border-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10" : result?.status === "failed" ? "border-red-300 bg-red-50/30 dark:bg-red-950/10" : ""}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant="outline" className={`text-xs gap-1 ${pConfig.color}`}>
                                  <PIcon className="h-3 w-3" /> {pConfig.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-primary/5">Score: {test.score}/100</Badge>
                                <h5 className="font-semibold">{test.name}</h5>
                                <Icon className={`h-4 w-4 ${config.color}`} />
                                <Badge variant="outline" className="text-xs">{config.label}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{test.description}</p>
                            </div>
                            <Button size="sm" onClick={() => openTest(test)}>Résultats</Button>
                          </div>

                          {/* Mentor rationale */}
                          <Collapsible open={isRationaleOpen} onOpenChange={() => setExpandedRationale(isRationaleOpen ? null : test.id)}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-2 w-full justify-start text-xs mt-1 text-primary">
                                <Sparkles className="h-3 w-3" />
                                Pourquoi ce test ? — Argumentation du mentor
                                {isRationaleOpen ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm space-y-1">
                                {test.rationale.split("\n").map((line: string, i: number) => (
                                  <p key={i}>{line}</p>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Meta info */}
                          <div className="flex gap-2 flex-wrap mt-2 mb-2">
                            {test.estimated_duration && (
                              <Badge variant="outline" className="text-xs gap-1"><Clock className="h-3 w-3" />{test.estimated_duration}</Badge>
                            )}
                            {test.difficulty && (
                              <Badge className={`text-xs ${difficultyColor(test.difficulty)}`}>{test.difficulty}</Badge>
                            )}
                            {test.techniques?.map((t: string) => (
                              <Badge key={t} variant="secondary" className="text-xs"><Lightbulb className="h-3 w-3 mr-1" />{t}</Badge>
                            ))}
                          </div>

                          {/* Collapsible Protocol */}
                          {test.protocol_steps?.length > 0 && (
                            <Collapsible open={isExpanded} onOpenChange={() => setExpandedProtocol(isExpanded ? null : test.id)}>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start text-xs mt-1">
                                  <FileText className="h-3 w-3" />
                                  Protocole détaillé ({test.protocol_steps.length} étapes)
                                  {isExpanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="mt-3 space-y-2 pl-4 border-l-2 border-primary/20">
                                  {test.protocol_steps.map((step: ProtocolStep) => (
                                    <div key={step.step} className="flex gap-3">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">{step.step}</div>
                                      <div>
                                        <p className="text-sm font-medium">{step.title}</p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {test.required_tools?.length > 0 && (
                                  <div className="mt-3 flex gap-1 flex-wrap">
                                    <Wrench className="h-3 w-3 text-muted-foreground mt-0.5" />
                                    {test.required_tools.map((tool: string) => (
                                      <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                                    ))}
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Result Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={o => !o && setSelectedTest(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedTest?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedTest?.description}</p>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={resultForm.status || "not_started"} onValueChange={v => setResultForm(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Non commencé</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="passed">Réussi</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date de début</Label><Input type="date" value={resultForm.start_date || ""} onChange={e => setResultForm(p => ({ ...p, start_date: e.target.value }))} /></div>
              <div><Label>Date de fin</Label><Input type="date" value={resultForm.end_date || ""} onChange={e => setResultForm(p => ({ ...p, end_date: e.target.value }))} /></div>
            </div>

            {selectedTest?.form_fields?.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <h5 className="font-medium text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Données du test</h5>
                {selectedTest.form_fields.map((field: FormField) => (
                  <div key={field.name} className="space-y-1">
                    <Label className="text-sm">{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea value={resultForm[field.name] || ""} onChange={e => setResultForm(p => ({ ...p, [field.name]: e.target.value }))} />
                    ) : field.type === "select" ? (
                      <Select value={resultForm[field.name] || ""} onValueChange={v => setResultForm(p => ({ ...p, [field.name]: v }))}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                        <SelectContent>
                          {field.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input type={field.type} value={resultForm[field.name] || ""} onChange={e => setResultForm(p => ({ ...p, [field.name]: e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Résultat qualitatif</Label>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Décrivez vos observations terrain : retours clients, comportements observés, verbatims recueillis, 
                points de friction identifiés, insights qualitatifs. Ex: « 8 utilisateurs sur 10 ont mentionné la 
                difficulté de l'onboarding. Les early adopters veulent une intégration Slack. »
              </p>
              <Textarea value={resultForm.qualitative_result || ""} onChange={e => setResultForm(p => ({ ...p, qualitative_result: e.target.value }))} placeholder="Ex: Les utilisateurs interrogés ont exprimé un besoin fort pour..." />
            </div>
            <div className="space-y-2">
              <Label>Résultat quantitatif</Label>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Entrez la métrique chiffrée mesurée : taux de conversion (%), NPS score, nombre d'inscriptions, 
                taux de rétention, CAC en €, etc. Ce chiffre sera comparé à la métrique cible du test pour 
                déterminer le verdict IA (succès/échec/partiel).
              </p>
              <Input type="number" value={resultForm.quantitative_result || ""} onChange={e => setResultForm(p => ({ ...p, quantitative_result: e.target.value }))} placeholder="Ex: 85 (taux de conversion %)" />
            </div>

            {/* AI Verdict */}
            {(resultForm.qualitative_result || resultForm.quantitative_result) && (
              <div className="border-t pt-4 space-y-3">
                <Button
                  onClick={async () => {
                    if (!selectedTest) return;
                    setAnalyzingVerdict(true);
                    setAiVerdict(null);
                    try {
                      const { data, error } = await supabase.functions.invoke("analyze-test-result", {
                        body: {
                          test_name: selectedTest.name,
                          test_objective: selectedTest.description,
                          target_metrics: null,
                          qualitative_result: resultForm.qualitative_result,
                          quantitative_result: resultForm.quantitative_result,
                          estimated_duration: selectedTest.estimated_duration,
                          sector: project.sector,
                          phase: selectedTest.phase,
                        },
                      });
                      if (error) throw error;
                      setAiVerdict(data?.verdict || null);
                    } catch (e: any) {
                      toast({ title: "Erreur d'analyse IA", description: e.message, variant: "destructive" });
                    } finally {
                      setAnalyzingVerdict(false);
                    }
                  }}
                  disabled={analyzingVerdict}
                  variant="outline"
                  className="w-full gap-2 border-primary/30 text-primary"
                  size="sm"
                >
                  {analyzingVerdict ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyse IA en cours...</> : <><Brain className="h-4 w-4" /> Obtenir le verdict IA</>}
                </Button>

                {aiVerdict && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={aiVerdict.verdict === "Succès" ? "bg-emerald-500" : aiVerdict.verdict === "Échec" ? "bg-red-500" : "bg-amber-500"}>
                        {aiVerdict.verdict}
                      </Badge>
                      <Badge variant="outline">{aiVerdict.recommendation}</Badge>
                    </div>
                    {aiVerdict.interpretation && <p className="text-muted-foreground text-xs">{aiVerdict.interpretation}</p>}
                    {aiVerdict.duration_analysis && <p className="text-muted-foreground text-xs"><strong>⏱ Durée :</strong> {aiVerdict.duration_analysis}</p>}
                    {aiVerdict.next_actions?.length > 0 && (
                      <div>
                        <p className="font-medium text-xs mb-1">Prochaines actions :</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                          {aiVerdict.next_actions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <Button onClick={saveResult} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sauvegarder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MvpTestsLibraryV2;
