import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Lightbulb, BarChart3, Wrench, PlayCircle } from "lucide-react";
import FormationPDFDownload from "@/components/formation/FormationPDFDownload";
import FormationKeySummary from "@/components/formation/FormationKeySummary";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesignThinkingPresentation from "@/components/DesignThinkingPresentation";
import DesignThinkingToolsTable from "@/components/DesignThinkingToolsTable";
import { fondementsSlidesData, businessGrowthSlidesData, metricsSlidesData } from "@/data/designThinkingSlidesData";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

type ViewMode = 'overview' | 'fondements' | 'growth' | 'metrics';

const getModulesFromSlides = (slides: typeof fondementsSlidesData) => {
  const moduleNames = [...new Set(slides.map(s => s.module))];
  return moduleNames.map((name, index) => {
    const moduleSlides = slides.filter(s => s.module === name);
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    return { id: `module-${index}`, title: name, description: `${moduleSlides.length} slides`, color: colors[index % colors.length] };
  });
};

const DesignThinkingPage = () => {
  const { t } = useTranslation();
  const formationContext = useMemo(() => buildFormationContext([...fondementsSlidesData, ...businessGrowthSlidesData, ...metricsSlidesData]), []);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [activeTab, setActiveTab] = useState('fondements');
  const keyPoints = t("formations.keySummaryDesignThinking").split("|");

  const getPDFContent = (lang: string) => {
    const allSlides = [...fondementsSlidesData, ...businessGrowthSlidesData, ...metricsSlidesData];
    const modules = [...new Set(allSlides.map(s => s.module))];
    return {
      title: "Design Thinking",
      sections: modules.map(mod => ({
        heading: mod,
        bullets: allSlides.filter(s => s.module === mod).map(s => s.title),
      })),
    };
  };

  if (viewMode === 'fondements') return <DesignThinkingPresentation slides={fondementsSlidesData} title={t("designThinking.foundationsTitle")} onBack={() => setViewMode('overview')} />;
  if (viewMode === 'growth') return <DesignThinkingPresentation slides={businessGrowthSlidesData} title={t("designThinking.growthTitle")} onBack={() => setViewMode('overview')} />;
  if (viewMode === 'metrics') return <DesignThinkingPresentation slides={metricsSlidesData} title={t("designThinking.metricsTitle")} onBack={() => setViewMode('overview')} />;

  const fondementsModules = getModulesFromSlides(fondementsSlidesData);
  const growthModules = getModulesFromSlides(businessGrowthSlidesData);
  const metricsModules = getModulesFromSlides(metricsSlidesData);

  const renderModuleSection = (title: string, desc: string, modules: ReturnType<typeof getModulesFromSlides>, slideCount: number, mode: ViewMode) => (
    <section className="py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{desc}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {modules.map((module, index) => (
              <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center text-white text-sm font-bold`}>{String(index + 1).padStart(2, '0')}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" className="rounded-full shadow-lg" onClick={() => setViewMode(mode)}>
              <PlayCircle className="mr-2 h-5 w-5" />
              {t("designThinking.launchPresentation")} ({slideCount} {t("common.slides")})
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-hero py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="container relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"><ArrowLeft className="h-4 w-4" />{t("common.backToHome")}</Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Design Thinking</h1>
              <div className="mt-4">
                <FormationPDFDownload formationName="Design-Thinking" getContent={getPDFContent} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Summary */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <FormationKeySummary points={keyPoints} />
          </div>
        </section>

        <section className="py-8 border-b bg-background sticky top-0 z-40">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-12 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="fondements" className="rounded-full data-[state=active]:shadow-sm gap-2"><Brain className="h-4 w-4 hidden sm:block" /><span className="text-xs sm:text-sm">{t("designThinking.foundations")}</span></TabsTrigger>
                <TabsTrigger value="growth" className="rounded-full data-[state=active]:shadow-sm gap-2"><Lightbulb className="h-4 w-4 hidden sm:block" /><span className="text-xs sm:text-sm">{t("designThinking.growth")}</span></TabsTrigger>
                <TabsTrigger value="metrics" className="rounded-full data-[state=active]:shadow-sm gap-2"><BarChart3 className="h-4 w-4 hidden sm:block" /><span className="text-xs sm:text-sm">{t("designThinking.metrics")}</span></TabsTrigger>
                <TabsTrigger value="outils" className="rounded-full data-[state=active]:shadow-sm gap-2"><Wrench className="h-4 w-4 hidden sm:block" /><span className="text-xs sm:text-sm">{t("designThinking.tools")}</span></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="fondements" className="mt-0">{renderModuleSection(t("designThinking.foundationsTitle"), t("designThinking.foundationsDesc"), fondementsModules, fondementsSlidesData.length, 'fondements')}</TabsContent>
          <TabsContent value="growth" className="mt-0">{renderModuleSection(t("designThinking.growthTitle"), t("designThinking.growthDesc"), growthModules, businessGrowthSlidesData.length, 'growth')}</TabsContent>
          <TabsContent value="metrics" className="mt-0">{renderModuleSection(t("designThinking.metricsTitle"), t("designThinking.metricsDesc"), metricsModules, metricsSlidesData.length, 'metrics')}</TabsContent>
          <TabsContent value="outils" className="mt-0">
            <section className="py-12">
              <div className="container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">{t("designThinking.toolsTitle")}</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("designThinking.toolsDesc")}</p>
                </motion.div>
                <DesignThinkingToolsTable />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <FormationChatbot formationName="Design Thinking" formationContext={formationContext} />
    </div>
  );
};

export default DesignThinkingPage;
