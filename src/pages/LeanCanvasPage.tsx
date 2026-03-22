import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, FileText, BookOpen, Rocket, TrendingUp, Wrench, Calculator } from "lucide-react";
import InlineLicenseGate from "@/components/InlineLicenseGate";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LeanCanvasPresentation from "@/components/LeanCanvasPresentation";
import LeanCanvasToolsTable from "@/components/LeanCanvasToolsTable";
import AdvancedMetricsCalculator from "@/components/startup/AdvancedMetricsCalculator";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { LEAN_CANVAS_SLIDES } from "@/data/leanCanvasSlidesData";

const LeanCanvasPage = () => {
  const { t } = useTranslation();
  const [showPresentation, setShowPresentation] = useState(false);
  const formationContext = useMemo(() => buildFormationContext(LEAN_CANVAS_SLIDES), []);

  if (showPresentation) return <LeanCanvasPresentation onClose={() => setShowPresentation(false)} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-hero py-16 lg:py-24">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"><ArrowLeft className="h-4 w-4" />{t("common.backToHome")}</Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6">
                <span className="text-2xl">📋</span><span>{t("leanCanvas.methodology")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("leanCanvas.title")}</h1>
              <p className="text-lg text-white/70 mb-8">{t("leanCanvas.desc")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="shadow-glow" onClick={() => setShowPresentation(true)}><PlayCircle className="mr-2 h-5 w-5" />{t("leanCanvas.startFormation")}</Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild><a href="#outils"><Wrench className="mr-2 h-5 w-5" />{t("leanCanvas.exploreTools")}</a></Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="formation" className="space-y-8">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                <TabsTrigger value="formation" className="gap-2"><BookOpen className="h-4 w-4" /> {t("leanCanvas.formationTab")}</TabsTrigger>
                <TabsTrigger value="outils" className="gap-2" id="outils"><Wrench className="h-4 w-4" /> {t("leanCanvas.toolsTab")}</TabsTrigger>
                <TabsTrigger value="ressources" className="gap-2"><FileText className="h-4 w-4" /> {t("leanCanvas.resourcesTab")}</TabsTrigger>
              </TabsList>

              <TabsContent value="formation" className="space-y-8">
                <Tabs defaultValue="running" className="space-y-6">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="running" className="gap-2">📘 {t("leanCanvas.runningLean")}</TabsTrigger>
                    <TabsTrigger value="scaling" className="gap-2">📙 {t("leanCanvas.scalingLean")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="running" className="space-y-6">
                    <InlineLicenseGate contentSlug="lc-running-lean" contentName="Running Lean">
                      <div className="text-center mb-8">
                        <Badge className="bg-blue-600 text-white mb-4">60 {t("common.slides")}</Badge>
                        <h2 className="text-2xl font-bold mb-2">{t("leanCanvas.ideaToFit")}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{t("leanCanvas.ideaToFitDesc")}</p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { title: t("leanCanvas.design"), desc: "Lean Canvas, stress-test", modules: "Introduction, Lean Canvas" },
                          { title: t("leanCanvas.validation"), desc: "Cycles 90 jours, interviews", modules: "Validation, Interviews" },
                          { title: t("leanCanvas.growthPhase"), desc: "Lancement, moteur de croissance", modules: "Transition Scaling" }
                        ].map((phase, i) => (
                          <Card key={i} className="border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6">
                              <div className="text-3xl font-bold text-blue-600 mb-2">{i + 1}</div>
                              <h3 className="font-bold mb-2">{phase.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{phase.desc}</p>
                              <p className="text-xs text-blue-600">{phase.modules}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </InlineLicenseGate>
                  </TabsContent>
                  <TabsContent value="scaling" className="space-y-6">
                    <InlineLicenseGate contentSlug="lc-scaling-lean" contentName="Scaling Lean">
                      <div className="text-center mb-8">
                        <Badge className="bg-indigo-600 text-white mb-4">38 {t("common.slides")}</Badge>
                        <h2 className="text-2xl font-bold mb-2">{t("leanCanvas.masterGrowth")}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{t("leanCanvas.masterGrowthDesc")}</p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { title: t("leanCanvas.definition"), desc: "Traction, Throughput", modules: "Traction" },
                          { title: t("leanCanvas.prioritization"), desc: "Customer Factory, métriques", modules: "Usine à Clients" },
                          { title: t("leanCanvas.revelation"), desc: "Expérimentations, Lean Sprints", modules: "Expérimentations" }
                        ].map((phase, i) => (
                          <Card key={i} className="border-indigo-200 dark:border-indigo-800">
                            <CardContent className="pt-6">
                              <div className="text-3xl font-bold text-indigo-600 mb-2">{i + 1}</div>
                              <h3 className="font-bold mb-2">{phase.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{phase.desc}</p>
                              <p className="text-xs text-indigo-600">{phase.modules}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-12">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 mb-4">
                            <Calculator className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{t("leanCanvas.interactiveTool")}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{t("leanCanvas.scalingCalculator")}</h3>
                          <p className="text-muted-foreground max-w-xl mx-auto text-sm">{t("leanCanvas.scalingCalcDesc")}</p>
                        </div>
                        <AdvancedMetricsCalculator />
                      </div>
                    </InlineLicenseGate>
                  </TabsContent>
                </Tabs>
                <div className="text-center mt-8">
                  <Button size="lg" onClick={() => setShowPresentation(true)} className="gap-2"><Rocket className="h-5 w-5" />{t("leanCanvas.exploreSlides")}</Button>
                </div>
              </TabsContent>

              <TabsContent value="outils" className="space-y-6">
                <div className="text-center mb-8">
                  <Badge variant="outline" className="mb-4">26 {t("designThinking.tools").toLowerCase()}</Badge>
                  <h2 className="text-2xl font-bold mb-2">{t("leanCanvas.toolsTitle")}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">{t("leanCanvas.toolsDesc")}</p>
                </div>
                <LeanCanvasToolsTable />
              </TabsContent>

              <TabsContent value="ressources" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">{t("leanCanvas.downloadableResources")}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">{t("leanCanvas.downloadableResourcesDesc")}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Lean Canvas", desc: "Template 9 blocs", icon: "📋", color: "bg-blue-500" },
                    { name: "Customer Factory Blueprint", desc: "AARRR", icon: "🏭", color: "bg-indigo-500" },
                    { name: "Customer Forces Canvas", desc: "Push/Pull/Inertia/Friction", icon: "⚡", color: "bg-amber-500" },
                    { name: "Customer Timeline", desc: "First Thought → Job Done", icon: "📅", color: "bg-emerald-500" }
                  ].map((resource, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="pt-6 text-center">
                        <div className={`w-16 h-16 ${resource.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>{resource.icon}</div>
                        <h3 className="font-bold mb-2">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{resource.desc}</p>
                        <Button variant="outline" size="sm" className="w-full"><FileText className="h-4 w-4 mr-2" />{t("common.download")}</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="Lean Canvas & Running Lean" formationContext={formationContext} />
    </div>
  );
};

export default LeanCanvasPage;
