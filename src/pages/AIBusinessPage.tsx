import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Brain, Cpu, Rocket, Sparkles,
  PlayCircle, FileText, Download, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSlidePresentation from "@/components/formation/EnhancedSlidePresentation";
import FormationChatbot from "@/components/formation/FormationChatbot";
import FormationPDFDownload from "@/components/formation/FormationPDFDownload";
import FormationKeySummary from "@/components/formation/FormationKeySummary";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { getAIBusinessSlides, aiBusinessSlidesData } from "@/data/aiBusinessSlidesData";

type ViewMode = "overview" | "presentation";

const getModulesFromSlides = (slides: typeof aiBusinessSlidesData) => {
  const moduleNames = [...new Set(slides.map(s => s.module))];
  const colors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
  return moduleNames.map((name, index) => ({
    id: `module-${index}`,
    title: name,
    description: `${slides.filter(s => s.module === name).length} slides`,
    color: colors[index % colors.length],
  }));
};

const AIBusinessPage = () => {
  const { i18n, t } = useTranslation();
  const slides = useMemo(() => getAIBusinessSlides(i18n.language), [i18n.language]);
  const formationContext = useMemo(() => buildFormationContext(slides), [slides]);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activeTab, setActiveTab] = useState("cours");
  const keyPoints = t("formations.keySummaryAIBusiness").split("|");

  const getPDFContent = (lang: string) => {
    const langSlides = getAIBusinessSlides(lang);
    const modules = [...new Set(langSlides.map(s => s.module))];
    return {
      title: "AI For Business",
      sections: modules.map(mod => ({
        heading: mod,
        bullets: langSlides.filter(s => s.module === mod).map(s => s.title),
      })),
    };
  };

  if (viewMode === "presentation") {
    return (
      <EnhancedSlidePresentation
        slides={slides}
        title="AI For Business"
        onBack={() => setViewMode("overview")}
      />
    );
  }

  const modules = getModulesFromSlides(slides);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <Link to="/formations" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" /> Retour aux formations
            </Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/10">
                <Brain className="h-4 w-4" />
                <span>Formation AI Business</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                AI For <span className="text-gradient-gold">Business</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                Maîtrisez l'intelligence artificielle appliquée au business.
                Stratégies, outils et cas pratiques — {slides.length} slides interactives.
              </p>
              <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-white/50 text-sm">
                    Source : <strong className="text-amber-400">STACK/</strong> <strong className="text-white/80">Abdelrahman Sleem</strong>
                  </p>
                  <p className="text-white/40 text-xs">Adapté et enrichi par <strong className="text-white/60">STARTUNUP Academy</strong></p>
                </div>
              </div>
              <div className="mt-6">
                <FormationPDFDownload formationName="AI-Business" getContent={getPDFContent} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Summary */}
        <section className="py-8 -mt-4">
          <div className="container max-w-4xl">
            <FormationKeySummary points={keyPoints} />
          </div>
        </section>

        {/* Content */}
        <section className="py-12 pb-20">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-12 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="cours" className="rounded-full data-[state=active]:shadow-sm gap-2">
                  <Cpu className="h-4 w-4 hidden sm:block" />
                  <span className="text-xs sm:text-sm">Cours</span>
                </TabsTrigger>
                <TabsTrigger value="support" className="rounded-full data-[state=active]:shadow-sm gap-2">
                  <FileText className="h-4 w-4 hidden sm:block" />
                  <span className="text-xs sm:text-sm">Support PDF</span>
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="rounded-full data-[state=active]:shadow-sm gap-2">
                  <Sparkles className="h-4 w-4 hidden sm:block" />
                  <span className="text-xs sm:text-sm">IA Assistant</span>
                </TabsTrigger>
              </TabsList>

              {/* Cours Tab */}
              <TabsContent value="cours" className="mt-0">
                <section className="py-8">
                  <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                      <h2 className="text-3xl font-bold mb-4">AI For Business — Cours Complet</h2>
                      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {modules.length} modules couvrant de l'introduction à l'IA jusqu'à l'implémentation stratégique.
                      </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                      {modules.map((module, index) => (
                        <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                          <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className={`w-10 h-10 rounded-xl ${module.color} flex items-center justify-center mb-4`}>
                                <BookOpen className="h-5 w-5 text-white" />
                              </div>
                              <h3 className="font-bold text-foreground mb-1">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="text-center">
                      <Button size="lg" className="rounded-full shadow-lg" onClick={() => setViewMode("presentation")}>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Lancer la présentation ({slides.length} slides)
                      </Button>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Support PDF Tab */}
              <TabsContent value="support" className="mt-0">
                <section className="py-8">
                  <div className="container max-w-4xl">
                    <div className="bg-muted/50 border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
                      <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                        <FileText className="h-10 w-10 text-primary" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-lg text-foreground">AI For Business — Support complet</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Document PDF couvrant les stratégies IA, les modèles de déploiement et les frameworks de transformation digitale.
                        </p>
                      </div>
                      <Button asChild className="gap-2 shrink-0">
                        <a href="/resources/ai-business/AI_For_Business.pdf" download>
                          <Download className="h-4 w-4" /> Télécharger
                        </a>
                      </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border" style={{ height: "700px" }}>
                      <iframe src="/resources/ai-business/AI_For_Business.pdf" className="w-full h-full" title="AI For Business PDF" />
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Chatbot Tab */}
              <TabsContent value="chatbot" className="mt-0">
                <section className="py-8">
                  <div className="container max-w-4xl">
                    <FormationChatbot formationContext={formationContext} formationName="AI For Business" />
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIBusinessPage;
