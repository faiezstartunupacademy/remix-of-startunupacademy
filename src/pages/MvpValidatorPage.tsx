import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Plus, Loader2, ArrowLeft, Trash2, ChevronRight, ClipboardList, BarChart3, TestTube2, Eye, Target, Bot, Shuffle, FileCheck2, DollarSign, BookOpen, Network, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import MvpOnboardingWizard from "@/components/mvp-validator/MvpOnboardingWizard";
import MvpTestsLibraryV2 from "@/components/mvp-validator/MvpTestsLibraryV2";
import MvpProjectDashboard from "@/components/mvp-validator/MvpProjectDashboard";
import MvpValidationDashboard from "@/components/mvp-validator/MvpValidationDashboard";
import MvpAIChatbot from "@/components/mvp-validator/MvpAIChatbot";
import MvpPivotSimulation from "@/components/mvp-validator/MvpPivotSimulation";
import MvpMetricsDashboard from "@/components/mvp-validator/MvpMetricsDashboard";
import MvpTeamEvaluation from "@/components/mvp-validator/MvpTeamEvaluation";
import MvpReportPDF from "@/components/mvp-validator/MvpReportPDF";
import InvestSpace from "@/components/strategic/InvestSpace";
import BusinessPlanGenerator from "@/components/strategic/BusinessPlanGenerator";
import TechIntegrationLab from "@/components/mvp-validator/TechIntegrationLab";
import ScrumBoard from "@/components/mvp-validator/ScrumBoard";

type MvpProject = { id: string; name: string; description: string | null; sector: string; scenario: string; cofounders_count: number; governorate: string | null; sso: string | null; incubation_program: string | null; status: string; created_at: string; };

const MvpValidatorPage = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<MvpProject[]>([]);
  const [activeProject, setActiveProject] = useState<MvpProject | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) loadProjects(); }, [user]);

  const loadProjects = async () => {
    const { data, error } = await supabase.from("mvp_validator_projects" as any).select("*").order("updated_at", { ascending: false });
    if (!error && data) setProjects(data as any[]);
    setLoadingProjects(false);
  };

  const deleteProject = async (id: string) => {
    await supabase.from("mvp_validator_projects" as any).delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
    toast({ title: t("mvp.projectDeleted") });
  };

  const onProjectCreated = (project: MvpProject) => {
    setProjects(prev => [project, ...prev]);
    setActiveProject(project);
    setShowWizard(false);
    setActiveTab("tests");
    toast({ title: t("mvp.projectCreated"), description: t("mvp.startTests") });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="container relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1">{t("mvp.badge")}</Badge>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t("mvp.title").split("MVP")[0]}<span className="text-amber-300">MVP</span></h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">{t("mvp.subtitle")}</p>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          {showWizard ? (
            <div className="max-w-3xl mx-auto">
              <Button variant="ghost" onClick={() => setShowWizard(false)} className="mb-4 gap-2"><ArrowLeft className="h-4 w-4" /> {t("common.back")}</Button>
              <MvpOnboardingWizard userId={user.id} onComplete={onProjectCreated} />
            </div>
          ) : activeProject ? (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => { setActiveProject(null); setActiveTab("details"); }}><ArrowLeft className="h-5 w-5" /></Button>
                  <div>
                    <h2 className="text-xl font-bold">{activeProject.name}</h2>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{activeProject.sector}</Badge>
                      <Badge variant="outline" className="text-xs">{activeProject.scenario === "A" ? t("mvp.ideaOnly") : t("mvp.ideaPlusBM")}</Badge>
                      {activeProject.sso && <Badge variant="outline" className="text-xs">{activeProject.sso}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 flex-wrap h-auto gap-1">
                  <TabsTrigger value="details" className="gap-2"><Eye className="h-4 w-4" />{t("mvp.details")}</TabsTrigger>
                  <TabsTrigger value="chatbot" className="gap-2"><Bot className="h-4 w-4" />{t("mvp.aiAnalysis")}</TabsTrigger>
                  <TabsTrigger value="tests" className="gap-2"><TestTube2 className="h-4 w-4" />{t("mvp.commercialTests")}</TabsTrigger>
                  <TabsTrigger value="tech-tests" className="gap-2"><Network className="h-4 w-4" />{t("mvp.techTests")}</TabsTrigger>
                  <TabsTrigger value="metrics" className="gap-2"><BarChart3 className="h-4 w-4" />{t("mvp.metrics")}</TabsTrigger>
                  <TabsTrigger value="scrum" className="gap-2"><RotateCcw className="h-4 w-4" />SCRUM</TabsTrigger>
                  <TabsTrigger value="pivot" className="gap-2"><Shuffle className="h-4 w-4" />{t("mvp.pivot")}</TabsTrigger>
                  <TabsTrigger value="docs" className="gap-2"><FileCheck2 className="h-4 w-4" />{t("mvp.docs")}</TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-2"><BarChart3 className="h-4 w-4" />{t("mvp.dashboard")}</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Card>
                    <CardHeader><CardTitle>{t("mvp.projectCard")}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { label: t("mvp.name"), value: activeProject.name },
                          { label: t("mvp.sector"), value: activeProject.sector },
                          { label: t("mvp.scenario"), value: activeProject.scenario === "A" ? t("mvp.ideaOnly") : t("mvp.ideaPlusBM") },
                          { label: t("mvp.cofounders"), value: activeProject.cofounders_count },
                          { label: t("mvp.governorate"), value: activeProject.governorate || "—" },
                          { label: t("mvp.sso"), value: activeProject.sso || t("common.noNone") },
                          { label: t("mvp.program"), value: activeProject.incubation_program || "—" },
                          { label: t("mvp.status"), value: activeProject.status },
                        ].map(item => (
                          <div key={item.label} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{item.label}</p><p className="font-medium">{item.value}</p></div>
                        ))}
                      </div>
                      {activeProject.description && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{t("common.description")}</p><p className="text-sm">{activeProject.description}</p></div>}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="chatbot"><MvpAIChatbot projectId={activeProject.id} projectName={activeProject.name} sector={activeProject.sector} scenario={activeProject.scenario} description={activeProject.description || undefined} /></TabsContent>
                <TabsContent value="tests"><MvpTestsLibraryV2 project={activeProject} /></TabsContent>
                <TabsContent value="tech-tests"><TechIntegrationLab projectId={activeProject.id} /></TabsContent>
                <TabsContent value="metrics"><MvpMetricsDashboard projectId={activeProject.id} /></TabsContent>
                <TabsContent value="scrum"><ScrumBoard projectId={activeProject.id} projectName={activeProject.name} sector={activeProject.sector} /></TabsContent>
                <TabsContent value="pivot"><MvpPivotSimulation projectId={activeProject.id} sector={activeProject.sector} /></TabsContent>
                <TabsContent value="docs">
                  <div className="space-y-8">
                    <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-primary" /> {t("mvp.reports")}</h3><MvpReportPDF project={activeProject} /></div>
                    <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> {t("mvp.businessPlan")}</h3><BusinessPlanGenerator projectName={activeProject.name} sector={activeProject.sector} messages={[{ role: "user", content: `Projet: ${activeProject.name}\nSecteur: ${activeProject.sector}\nScénario: ${activeProject.scenario === "A" ? "Idée seule" : "Idée + BM validé"}\nDescription: ${activeProject.description || "Non renseigné"}\nGouvernorat: ${activeProject.governorate || "Non renseigné"}\nSSO: ${activeProject.sso || "Aucun"}\nProgramme: ${activeProject.incubation_program || "Aucun"}`, phase: 1 }]} startupStage={activeProject.scenario === "A" ? "pre-seed" : "seed"} /></div>
                    <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> {t("mvp.pitchInvest")}</h3><InvestSpace projectId={activeProject.id} projectName={activeProject.name} sector={activeProject.sector} startupStage={activeProject.scenario === "A" ? "pre-seed" : "seed"} messages={[{ role: "user", content: `Projet: ${activeProject.name}\nSecteur: ${activeProject.sector}\nDescription: ${activeProject.description || "Non renseigné"}`, phase: 1 }]} /></div>
                  </div>
                </TabsContent>
                <TabsContent value="dashboard">
                  <div className="space-y-8">
                    <MvpProjectDashboard project={activeProject} />
                    <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> {t("mvp.validation")}</h3><MvpValidationDashboard projectId={activeProject.id} /></div>
                    <div><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> {t("mvp.team")}</h3><MvpTeamEvaluation projectId={activeProject.id} /></div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("mvp.myProjects")}</h2>
                <Button onClick={() => setShowWizard(true)} className="gap-2 rounded-full"><Plus className="h-4 w-4" /> {t("mvp.newProject")}</Button>
              </div>
              {loadingProjects ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : projects.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Rocket className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("mvp.noProjects")}</h3>
                    <p className="text-muted-foreground mb-4">{t("mvp.noProjectsDesc")}</p>
                    <Button onClick={() => setShowWizard(true)} className="gap-2"><Plus className="h-4 w-4" /> {t("mvp.createProject")}</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map(project => (
                    <motion.div key={project.id} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="cursor-pointer hover:border-primary/50 transition-all group" onClick={() => setActiveProject(project)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={e => { e.stopPropagation(); deleteProject(project.id); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{project.sector}</Badge>
                            <Badge variant="outline" className="text-xs">{project.scenario === "A" ? "💡 " + t("mvp.ideaOnly").split(" ").slice(-1) : "📋 BM"}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{project.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{t("mvp.createdOn")} {new Date(project.created_at).toLocaleDateString("fr-FR")}</span>
                            <ChevronRight className="h-5 w-5 group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MvpValidatorPage;
