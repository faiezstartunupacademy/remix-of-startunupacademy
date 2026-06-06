import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, BarChart3, Target, ExternalLink, Users, ArrowLeft,
  Wallet, Rocket, Globe, LineChart, Loader2, AlertTriangle,
  TestTube2, Bot, Network, Shuffle, FileCheck2, RotateCcw, Eye,
  Trash2, ChevronRight, Plus, Brain, BookOpen
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AIStrategicConsultant } from "@/components/strategic/AIStrategicConsultant";
import { BusinessIntelligenceDashboard } from "@/components/strategic/BusinessIntelligenceDashboard";
import InvestSpace from "@/components/strategic/InvestSpace";
import MvpOnboardingWizard from "@/components/mvp-validator/MvpOnboardingWizard";
import MvpTestsLibraryV2 from "@/components/mvp-validator/MvpTestsLibraryV2";
import MvpProjectDashboard from "@/components/mvp-validator/MvpProjectDashboard";
import MvpValidationDashboard from "@/components/mvp-validator/MvpValidationDashboard";
import MvpAIChatbot from "@/components/mvp-validator/MvpAIChatbot";
import MvpPivotSimulation from "@/components/mvp-validator/MvpPivotSimulation";
import MvpMetricsDashboard from "@/components/mvp-validator/MvpMetricsDashboard";
import MvpTeamEvaluation from "@/components/mvp-validator/MvpTeamEvaluation";
import MvpReportPDF from "@/components/mvp-validator/MvpReportPDF";
import BusinessPlanGenerator from "@/components/strategic/BusinessPlanGenerator";
import KnowledgeBaseDownloadButton from "@/components/strategic/KnowledgeBaseDownloadButton";
import TechIntegrationLab from "@/components/mvp-validator/TechIntegrationLab";
import ScrumBoard from "@/components/mvp-validator/ScrumBoard";
import V1TestSpace from "@/components/mvp-validator/V1TestSpace";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generatePersonas } from "@/utils/personaGenerator";
import { useAuth } from "@/hooks/useAuth";
import {
  productStageToScenario,
  productStageToCapitalStage,
  PRODUCT_STAGE_LABEL,
  CAPITAL_STAGE_LABEL,
  type ProductStage,
} from "@/utils/stageTaxonomy";


const StrategicConsolePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phaseMessages, setPhaseMessages] = useState<any[]>([]);
  const [mvpProject, setMvpProject] = useState<any>(null);
  const [mvpProjects, setMvpProjects] = useState<any[]>([]);
  const [showMvpWizard, setShowMvpWizard] = useState(false);
  const [showMvpProjectsList, setShowMvpProjectsList] = useState(true);
  const [mvpTab, setMvpTab] = useState("details");
  const [incubationSteps, setIncubationSteps] = useState<any[]>([]);
  const [importingFromIncubation, setImportingFromIncubation] = useState(false);

  useEffect(() => {
    if (!projectId || projectId === ':projectId') {
      toast({ title: "Erreur", description: "Aucun projet sélectionné. Veuillez d'abord choisir un projet.", variant: "destructive" });
      navigate("/pole-strategique");
      return;
    }
    loadProjectData();
    loadPhaseMessages();
    loadMvpProjects();
    loadIncubationSteps();
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("incubation_projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      setProjectData(data);
    } catch (error: any) {
      console.error("Project load error:", error);
      toast({ title: "Erreur", description: "Impossible de charger le projet", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadPhaseMessages = async () => {
    try {
      const { data } = await supabase
        .from("strategic_messages")
        .select("role, content, phase")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: true });
      if (data) setPhaseMessages(data);
    } catch {
      // silent
    }
  };

  const loadIncubationSteps = async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from("incubation_steps")
      .select("*")
      .eq("project_id", projectId)
      .order("step_number", { ascending: true });
    if (data) setIncubationSteps(data);
  };

  const loadMvpProjects = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("mvp_validator_projects" as any)
      .select("*")
      .order("updated_at", { ascending: false });

    if (data) {
      setMvpProjects(data as any[]);
      if (!mvpProject && data.length > 0) {
        setMvpProject(data[0]);
      }
    }
  };

  const seedFromIncubation = async (mvpId: string, project: any) => {
    try {
      // Build hypotheses from incubation data
      const hypotheses: any[] = [];
      if (project.problem_description) {
        hypotheses.push({ project_id: mvpId, type: "risque_marché", description: `Le problème "${project.problem_description}" est suffisamment douloureux pour que les clients paient`, weight: 5, confidence_score: 0, validation_status: "non_testé" });
      }
      if (project.solution_description) {
        hypotheses.push({ project_id: mvpId, type: "risque_produit", description: `La solution "${project.solution_description}" résout le problème mieux que les alternatives`, weight: 4, confidence_score: 0, validation_status: "non_testé" });
      }
      if (project.business_model) {
        hypotheses.push({ project_id: mvpId, type: "risque_marché", description: `Le modèle économique "${project.business_model}" est viable et scalable`, weight: 4, confidence_score: 0, validation_status: "non_testé" });
      }
      if (project.differentiator) {
        hypotheses.push({ project_id: mvpId, type: "risque_produit", description: `Le différenciateur "${project.differentiator}" est défendable face à la concurrence`, weight: 3, confidence_score: 0, validation_status: "non_testé" });
      }
      hypotheses.push(
        { project_id: mvpId, type: "risque_marché", description: "Le marché cible est assez large pour soutenir la croissance", weight: 3, confidence_score: 0, validation_status: "non_testé" },
        { project_id: mvpId, type: "risque_exécution", description: "L'équipe possède les compétences clés pour exécuter", weight: 3, confidence_score: 0, validation_status: "non_testé" }
      );

      // Build features from solution/problem
      const features: any[] = [
        { project_id: mvpId, name: "Landing page avec proposition de valeur", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
        { project_id: mvpId, name: "Onboarding utilisateur simplifié", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
        { project_id: mvpId, name: "Fonctionnalité cœur MVP", priority: "core", completion_percentage: 0, tested: false, test_result: "pending" },
      ];
      if (project.business_model) {
        features.push({ project_id: mvpId, name: `Module de monétisation (${project.business_model})`, priority: "core", completion_percentage: 0, tested: false, test_result: "pending" });
      }
      features.push(
        { project_id: mvpId, name: "Dashboard analytics utilisateur", priority: "nice_to_have", completion_percentage: 0, tested: false, test_result: "pending" },
        { project_id: mvpId, name: "Intégrations tierces", priority: "nice_to_have", completion_percentage: 0, tested: false, test_result: "pending" }
      );

      // Build personas from project data (8-12 deeply characterized)
      const personas = generatePersonas(mvpId, project);

      // Auto-seed tests from library based on sector
      const { data: allTests } = await supabase.from("mvp_tests_library" as any).select("*");
      const relevantTests = (allTests as any[] || []).filter((t: any) => {
        const sectors = t.applicable_sectors || [];
        return sectors.includes(project.sector) || sectors.length === 0;
      }).slice(0, 15);
      const testSeeds = relevantTests.map((t: any) => ({
        project_id: mvpId, test_id: t.id, status: "not_started",
        qualitative_result: null, quantitative_result: null, start_date: null, end_date: null,
      }));

      // Insert all in parallel
      await Promise.all([
        hypotheses.length > 0 ? supabase.from("mvp_hypotheses" as any).insert(hypotheses as any) : Promise.resolve(),
        features.length > 0 ? supabase.from("mvp_features" as any).insert(features as any) : Promise.resolve(),
        personas.length > 0 ? supabase.from("mvp_personas" as any).insert(personas as any) : Promise.resolve(),
        testSeeds.length > 0 ? supabase.from("mvp_test_results" as any).insert(testSeeds as any) : Promise.resolve(),
      ]);
    } catch (err) {
      console.error("Seed from incubation error:", err);
    }
  };

  const createMvpFromIncubation = async () => {
    if (!user || !projectData) return;
    setImportingFromIncubation(true);

    const scenario = productStageToScenario(projectData.stage);

    const { data, error } = await supabase
      .from("mvp_validator_projects" as any)
      .insert({
        user_id: user.id,
        name: projectData.name,
        description: [
          projectData.description,
          projectData.problem_description ? `Problème: ${projectData.problem_description}` : null,
          projectData.solution_description ? `Solution: ${projectData.solution_description}` : null,
          projectData.target_customers ? `Clients cibles: ${projectData.target_customers}` : null,
          projectData.differentiator ? `Différenciation: ${projectData.differentiator}` : null,
        ].filter(Boolean).join("\n"),
        sector: projectData.sector || "Autre",
        scenario,
        product_stage: projectData.stage || null,
        cofounders_count: 1,
        governorate: null,
        sso: null,
        incubation_program: projectData.stage || null,
        status: "active",
      } as any)
      .select()
      .single();

    setImportingFromIncubation(false);


    if (!error && data) {
      const newProjectId = (data as any).id;

      // Auto-seed hypotheses, features, and personas from incubation data
      await seedFromIncubation(newProjectId, projectData);

      setMvpProjects(prev => [data as any, ...prev]);
      setMvpProject(data);
      setShowMvpProjectsList(false);
      setShowMvpWizard(false);
      setMvpTab("details");
      toast({ title: "🚀 Projet MVP créé depuis l'incubation !", description: "Hypothèses, fonctionnalités et personas pré-remplies. Vous pouvez les modifier manuellement." });
    } else {
      toast({ title: "Erreur", description: "Impossible de créer le projet MVP", variant: "destructive" });
    }
  };

  const openMvpProject = (project: any) => {
    setMvpProject(project);
    setMvpTab("details");
    setShowMvpProjectsList(false);
  };

  const deleteMvpProject = async (projectToDelete: any) => {
    const { error } = await supabase
      .from("mvp_validator_projects" as any)
      .delete()
      .eq("id", projectToDelete.id);

    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer ce projet", variant: "destructive" });
      return;
    }

    const updatedProjects = mvpProjects.filter((project) => project.id !== projectToDelete.id);
    setMvpProjects(updatedProjects);

    if (mvpProject?.id === projectToDelete.id) {
      setMvpProject(updatedProjects[0] ?? null);
      setShowMvpProjectsList(updatedProjects.length > 0);
    }

    toast({ title: "Projet MVP supprimé" });
  };

  const onMvpProjectCreated = (project: any) => {
    setMvpProjects(prev => [project, ...prev]);
    setMvpProject(project);
    setShowMvpWizard(false);
    setShowMvpProjectsList(false);
    setMvpTab("tests");
    toast({ title: "🚀 Projet MVP créé !" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Chargement du projet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h2 className="text-xl font-bold">Projet introuvable</h2>
            <p className="text-muted-foreground max-w-md">
              Ce projet n'existe pas ou vous n'avez pas les permissions nécessaires pour y accéder.
            </p>
            <Button asChild className="gap-2 mt-2">
              <Link to="/pole-strategique"><ArrowLeft className="h-4 w-4" /> Retour au Pôle Stratégique</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stageColors: Record<string, string> = {
    ideation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    mvp: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "product-market-fit": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    growth: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    scale: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Back nav */}
          <Link to="/pole-strategique" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Retour au Pôle Stratégique
          </Link>

          {/* Project Header */}
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-8 mb-8">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                    <Rocket className="h-3 w-3 mr-1" /> Console Stratégique Unifiée
                  </Badge>
                  {projectData.stage && (
                    <Badge variant="outline" className={stageColors[projectData.stage] || ""}>
                      {projectData.stage}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{projectData.name}</h1>
                {projectData.description && (
                  <p className="text-muted-foreground mt-2 max-w-2xl text-sm">{projectData.description}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {projectData.sector && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" /> {projectData.sector}
                  </div>
                )}
                {projectData.overall_progress != null && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
                    <LineChart className="h-4 w-4 text-muted-foreground" /> {projectData.overall_progress}%
                  </div>
                )}
                <KnowledgeBaseDownloadButton />
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="consultant" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="consultant" className="gap-2 text-xs sm:text-sm">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Consultant IA</span>
                <span className="sm:hidden">IA</span>
              </TabsTrigger>
              
              <TabsTrigger value="mvp" className="gap-2 text-xs sm:text-sm">
                <TestTube2 className="h-4 w-4" />
                <span className="hidden sm:inline">MVP Validator</span>
                <span className="sm:hidden">MVP</span>
              </TabsTrigger>
              
              <TabsTrigger value="tools" className="gap-2 text-xs sm:text-sm">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Outils</span>
                <span className="sm:hidden">+</span>
              </TabsTrigger>
            </TabsList>

            {/* Consultant IA */}
            <TabsContent value="consultant">
              <AIStrategicConsultant 
                projectId={projectId} 
                autoFillData={{
                  name: projectData.name,
                  sector: projectData.sector,
                  description: projectData.description,
                  stage: projectData.stage,
                  problem_description: projectData.problem_description,
                  solution_description: projectData.solution_description,
                }}
              />
            </TabsContent>

            

            {/* MVP Validator - Integrated */}
            <TabsContent value="mvp">
              {showMvpWizard && user ? (
                <div className="max-w-3xl mx-auto">
                  <Button variant="ghost" onClick={() => setShowMvpWizard(false)} className="mb-4 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </Button>
                  <MvpOnboardingWizard userId={user.id} onComplete={onMvpProjectCreated} />
                </div>
              ) : showMvpProjectsList ? (
                <div className="space-y-4">
                  {/* Incubation context banner */}
                  {incubationSteps.length > 0 && (
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Brain className="h-4 w-4 text-primary" /> Données d'incubation IA disponibles
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {incubationSteps.filter(s => s.status === "completed").length}/{incubationSteps.length} étapes validées — 
                              Score moyen : {(() => {
                                const scores = incubationSteps.filter(s => s.ai_report_score).map(s => Number(s.ai_report_score));
                                return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : "N/A";
                              })()}/100
                            </p>
                          </div>
                          <Button size="sm" onClick={createMvpFromIncubation} disabled={importingFromIncubation} className="gap-1.5">
                            {importingFromIncubation ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
                            Créer MVP depuis l'incubation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">Espace MVP Validator</h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setShowMvpWizard(true)} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Nouveau MVP
                      </Button>
                    </div>
                  </div>

                  {mvpProjects.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="py-12 text-center">
                        <TestTube2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun projet MVP</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {incubationSteps.length > 0
                            ? "Importez les données de votre incubation IA pour démarrer rapidement."
                            : "Créez votre premier projet MVP pour commencer la validation."}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {incubationSteps.length > 0 && (
                            <Button onClick={createMvpFromIncubation} disabled={importingFromIncubation} className="gap-2">
                              {importingFromIncubation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                              Importer depuis l'incubation
                            </Button>
                          )}
                          <Button variant={incubationSteps.length > 0 ? "outline" : "default"} onClick={() => setShowMvpWizard(true)} className="gap-2">
                            <Plus className="h-4 w-4" /> Créer manuellement
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {mvpProjects.map((project: any) => (
                        <motion.div key={project.id} whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Card className="cursor-pointer hover:border-primary/50 transition-all group" onClick={() => openMvpProject(project)}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{project.name}</CardTitle>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteMvpProject(project);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{project.sector}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">{project.status}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{new Date(project.created_at).toLocaleDateString("fr-FR")}</span>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : mvpProject ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setShowMvpProjectsList(true)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-lg font-semibold">{mvpProject.name}</h3>
                      <Badge variant="secondary">{mvpProject.sector}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {mvpProjects.length > 1 && (
                        <select
                          className="text-xs border rounded px-2 py-1 bg-background"
                          value={mvpProject.id}
                          onChange={(event) => {
                            const selectedProject = mvpProjects.find((project: any) => project.id === event.target.value);
                            if (selectedProject) openMvpProject(selectedProject);
                          }}
                        >
                          {mvpProjects.map((project: any) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setShowMvpWizard(true)} className="gap-1.5">
                        <Rocket className="h-3.5 w-3.5" /> Nouveau MVP
                      </Button>
                    </div>
                  </div>

                  <Tabs value={mvpTab} onValueChange={setMvpTab}>
                    <TabsList className="mb-4 flex-wrap h-auto gap-1">
                      <TabsTrigger value="details" className="gap-1.5 text-xs"><Eye className="h-3.5 w-3.5" />Fiche</TabsTrigger>
                      <TabsTrigger value="chatbot" className="gap-1.5 text-xs"><Bot className="h-3.5 w-3.5" />IA</TabsTrigger>
                      <TabsTrigger value="tests" className="gap-1.5 text-xs"><TestTube2 className="h-3.5 w-3.5" />Tests</TabsTrigger>
                      <TabsTrigger value="tech-tests" className="gap-1.5 text-xs"><Network className="h-3.5 w-3.5" />Tech</TabsTrigger>
                      <TabsTrigger value="metrics" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" />Métriques</TabsTrigger>
                      <TabsTrigger value="scrum" className="gap-1.5 text-xs"><RotateCcw className="h-3.5 w-3.5" />SCRUM</TabsTrigger>
                      <TabsTrigger value="pivot" className="gap-1.5 text-xs"><Shuffle className="h-3.5 w-3.5" />Pivot</TabsTrigger>
                      <TabsTrigger value="v1test" className="gap-1.5 text-xs"><Rocket className="h-3.5 w-3.5" />V1 TEST</TabsTrigger>
                      <TabsTrigger value="docs" className="gap-1.5 text-xs"><FileCheck2 className="h-3.5 w-3.5" />Docs</TabsTrigger>
                      <TabsTrigger value="dashboard" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader><CardTitle>Fiche Projet MVP</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              {[
                                { label: "Nom", value: mvpProject.name },
                                { label: "Secteur", value: mvpProject.sector },
                                { label: "Scénario", value: mvpProject.scenario === "A" ? "💡 Idée seule" : "📋 Idée + BM" },
                                { label: "Co-fondateurs", value: mvpProject.cofounders_count },
                                { label: "Gouvernorat", value: mvpProject.governorate || "—" },
                                { label: "SSO", value: mvpProject.sso || "Aucun" },
                                { label: "Programme", value: mvpProject.incubation_program || "—" },
                                { label: "Statut", value: mvpProject.status },
                              ].map(item => (
                                <div key={item.label} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{item.label}</p><p className="font-medium">{item.value}</p></div>
                              ))}
                            </div>
                            {mvpProject.description && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Description</p><p className="text-sm whitespace-pre-line">{mvpProject.description}</p></div>}
                          </CardContent>
                        </Card>

                        {/* Team Evaluation shared between Fiche & IA */}
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Équipe</h3>
                          <MvpTeamEvaluation projectId={mvpProject.id} />
                        </div>

                        {/* Incubation insights */}
                        {incubationSteps.length > 0 && (
                          <Card className="border-primary/20">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Brain className="h-5 w-5 text-primary" /> Données importées de l'Incubation IA
                              </CardTitle>
                              <CardDescription>Résultats de validation par étape — utilisés pour filtrer les tests MVP</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                {incubationSteps.map((step) => {
                                  const score = step.ai_report_score ? Number(step.ai_report_score) : null;
                                  const isCompleted = step.status === "completed";
                                  return (
                                    <div key={step.id} className={`p-2 rounded-lg text-center border ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-muted/30"}`}>
                                      <p className="text-lg mb-0.5">{["🔥", "⚖️", "📐", "👥", "⚠️", "📈", "🎯"][step.step_number - 1]}</p>
                                      <p className="text-[10px] font-medium leading-tight">{step.name}</p>
                                      {score !== null ? (
                                        <p className={`text-sm font-bold mt-1 ${score >= 70 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-destructive"}`}>{score}/100</p>
                                      ) : (
                                        <p className="text-[10px] text-muted-foreground mt-1">{isCompleted ? "✅" : "—"}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {projectData && (
                                <div className="mt-3 grid md:grid-cols-3 gap-2 text-xs">
                                  {projectData.business_model && (
                                    <div className="p-2 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Business Model:</span> <span className="font-medium">{projectData.business_model}</span></div>
                                  )}
                                  {projectData.target_customers && (
                                    <div className="p-2 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Clients cibles:</span> <span className="font-medium">{projectData.target_customers}</span></div>
                                  )}
                                  {projectData.differentiator && (
                                    <div className="p-2 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Différenciation:</span> <span className="font-medium">{projectData.differentiator}</span></div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="chatbot">
                      <div className="space-y-6">
                        <MvpAIChatbot projectId={mvpProject.id} projectName={mvpProject.name} sector={mvpProject.sector} scenario={mvpProject.scenario} />
                        {/* Team also visible in IA tab for context */}
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Équipe</h3>
                          <MvpTeamEvaluation projectId={mvpProject.id} />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="tests">
                      <MvpTestsLibraryV2 project={{ id: mvpProject.id, sector: mvpProject.sector, scenario: mvpProject.scenario, description: mvpProject.description, name: mvpProject.name }} />
                    </TabsContent>
                    <TabsContent value="tech-tests">
                      <TechIntegrationLab projectId={mvpProject.id} />
                    </TabsContent>
                    <TabsContent value="metrics">
                      <MvpMetricsDashboard projectId={mvpProject.id} />
                    </TabsContent>
                    <TabsContent value="scrum">
                      <ScrumBoard projectId={mvpProject.id} projectName={mvpProject.name} sector={mvpProject.sector} />
                    </TabsContent>
                    <TabsContent value="pivot">
                      <MvpPivotSimulation projectId={mvpProject.id} sector={mvpProject.sector} />
                    </TabsContent>
                    <TabsContent value="v1test">
                      <V1TestSpace projectId={mvpProject.id} incubationProjectData={projectData} incubationSteps={incubationSteps} />
                    </TabsContent>
                    <TabsContent value="docs">
                      <div className="space-y-8">
                        <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-primary" /> Rapports</h3><MvpReportPDF project={mvpProject} /></div>
                        <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Business Plan</h3><BusinessPlanGenerator projectName={mvpProject.name} sector={mvpProject.sector} messages={phaseMessages} startupStage={projectData.stage || "early-stage"} /></div>
                        <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /> Pitch & Invest</h3><InvestSpace projectId={mvpProject.id} projectName={mvpProject.name} sector={mvpProject.sector} startupStage={projectData.stage || "early-stage"} messages={phaseMessages} /></div>
                      </div>
                    </TabsContent>
                    <TabsContent value="dashboard">
                      <div className="space-y-8">
                        <MvpProjectDashboard project={mvpProject} />
                        <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Validation</h3><MvpValidationDashboard projectId={mvpProject.id} /></div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center">
                    <TestTube2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun projet MVP</h3>
                    <p className="text-sm text-muted-foreground mb-4">Créez votre premier projet MVP pour commencer la validation.</p>
                    <Button onClick={() => setShowMvpWizard(true)} className="gap-2">
                      <Rocket className="h-4 w-4" /> Créer un projet MVP
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            

            {/* Outils complémentaires */}
            <TabsContent value="tools">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Namviek — Gestion de Projet
                    </CardTitle>
                    <CardDescription>
                      Plateforme open-source de gestion de projet avancée : Gantt, Kanban, collaboration temps réel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>• Gestion multi-projets</span>
                      <span>• Planification Gantt/Kanban</span>
                      <span>• Collaboration d'équipe</span>
                      <span>• Suivi du temps</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="gap-1.5">
                        <a href="https://github.com/hudy9x/namviek" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" /> GitHub
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <a href="https://namviek.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" /> Documentation
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-primary" />
                      Market Intelligence
                    </CardTitle>
                    <CardDescription>
                      Méthodologie Y Combinator : données brutes → stratégie expert.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="sm" className="gap-1.5">
                      <Link to="/market-intelligence"><BarChart3 className="h-3.5 w-3.5" /> Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Rocket className="h-5 w-5 text-primary" />
                      Lean Canvas Lab
                    </CardTitle>
                    <CardDescription>
                      Protocole en 6 phases pour tester et valider votre MVP avec 25 outils Lean Canvas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="sm" className="gap-1.5">
                      <Link to="/communaute/lean-canvas-lab"><Target className="h-3.5 w-3.5" /> Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Base de Connaissance
                    </CardTitle>
                    <CardDescription>
                      Tests, protocoles et méthodologies de validation startup.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild size="sm" className="gap-1.5">
                      <Link to="/knowledge"><BookOpen className="h-3.5 w-3.5" /> Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategicConsolePage;
