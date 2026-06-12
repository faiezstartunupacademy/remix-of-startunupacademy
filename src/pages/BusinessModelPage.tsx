import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  PlayCircle, 
  Leaf, 
  Grid3X3,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Layers,
  Globe
} from "lucide-react";
import DownloadableResources from "@/components/DownloadableResources";
import InlineLicenseGate from "@/components/InlineLicenseGate";
import PatternsSpace from "@/components/patterns/PatternsSpace";
import GreenBMPresentation from "@/components/GreenBMPresentation";
import BMCGuidePresentation from "@/components/BMCGuidePresentation";
import BMInnovationPresentation from "@/components/BMInnovationPresentation";
import EntrepreneuriatDurablePresentation from "@/components/EntrepreneuriatDurablePresentation";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { BMC_SLIDES } from "@/data/bmcGuideSlidesData";

type MainTab = "formation" | "patterns" | "green-bm";
type FormationMode = "overview" | "bmc-guide" | "bm-innovation" | "green-training" | "entrepreneuriat-durable";

const BusinessModelPage = () => {
  const [mainTab, setMainTab] = useState<MainTab>("formation");
  const [formationMode, setFormationMode] = useState<FormationMode>("overview");
  const formationContext = useMemo(() => buildFormationContext(BMC_SLIDES), []);

  const handleStartCourse = (course: FormationMode) => {
    setFormationMode(course);
  };

  const handleBackToOverview = () => {
    setFormationMode("overview");
  };

  // Formation mode: show specific course presentation
  if (formationMode !== "overview") {
    const gateSlug = formationMode === "bmc-guide" ? "bm-bmc-guide" 
      : formationMode === "bm-innovation" ? "bm-innovation"
      : formationMode === "green-training" ? "bm-green-training"
      : "bm-green-training";
    const gateName = formationMode === "bmc-guide" ? "BMC Guide Pratique"
      : formationMode === "bm-innovation" ? "BM Innovation"
      : formationMode === "green-training" ? "Entrepreneuriat Vert"
      : "Entrepreneuriat Durable";

    const renderContent = () => {
      if (formationMode === "bmc-guide") return <BMCGuidePresentation onClose={handleBackToOverview} />;
      if (formationMode === "bm-innovation") return <BMInnovationPresentation onClose={handleBackToOverview} />;
      if (formationMode === "green-training") return (
        <div className="min-h-screen bg-background">
          <div className="container py-6">
            <Button variant="ghost" onClick={handleBackToOverview} className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour aux parcours
            </Button>
            <GreenBMPresentation />
          </div>
        </div>
      );
      if (formationMode === "entrepreneuriat-durable") return <EntrepreneuriatDurablePresentation onClose={handleBackToOverview} />;
      return null;
    };

    return renderContent();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 py-16 lg:py-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-background/60 hover:text-background transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20 text-sm text-background/90 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Business Model & Entrepreneuriat Vert</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight">
                Maîtrisez l'Innovation de{" "}
                <span className="text-gradient">Business Model</span>
              </h1>
              <p className="text-lg md:text-xl text-background/70 mb-10 max-w-2xl leading-relaxed">
                Formation complète intégrant les 60 patterns de business model, 
                les modèles durables et les méthodologies de validation pour entrepreneurs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Tabs Navigation */}
        <section className="py-6 border-b bg-card/50 sticky top-0 z-20 backdrop-blur-lg">
          <div className="container">
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)} className="w-full">
              <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-3 h-14 p-1.5 bg-muted/50 rounded-xl">
                <TabsTrigger 
                  value="formation" 
                  className="gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Formation</span>
                  <span className="sm:hidden">Form.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="patterns" 
                  className="gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Patterns</span>
                  <span className="sm:hidden">Pat.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="green-bm" 
                  className="gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                >
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Green BM</span>
                  <span className="sm:hidden">Green</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {mainTab === "formation" && (
            <motion.div
              key="formation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 3 Training Paths */}
              <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
                <div className="container">
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                        <GraduationCap className="h-4 w-4" />
                        3 Parcours de Formation
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">Choisissez Votre Parcours</h2>
                      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Des formations interactives complètes pour maîtriser les fondamentaux et l'innovation des modèles économiques.
                      </p>
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* BMC Guide Pratique */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="h-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-elevated hover:border-primary/40 transition-all group">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                              <GraduationCap className="h-7 w-7 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">BMC Guide Pratique</h3>
                              </div>
                              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                                91 slides
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 text-sm flex-1">
                            Formation complète basée sur Sophie Racquez. Maîtrisez les 9 blocs du Business Model Canvas, de la motivation à la croissance.
                          </p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Layers className="h-3.5 w-3.5 text-primary" />
                              <span>9 Modules : Motivations → Croissance</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Lightbulb className="h-3.5 w-3.5 text-primary" />
                              <span>Exercices pratiques & études de cas</span>
                            </div>
                          </div>

                          <Button 
                            size="lg" 
                            className="w-full shadow-glow gap-2 mt-auto" 
                            onClick={() => handleStartCourse("bmc-guide")}
                          >
                            <PlayCircle className="h-5 w-5" />
                            Démarrer
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* BM Innovation */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="h-full border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-elevated hover:border-accent/40 transition-all group">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 group-hover:scale-110 transition-transform">
                              <Sparkles className="h-7 w-7 text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">BM Innovation</h3>
                              </div>
                              <Badge variant="outline" className="text-xs bg-accent/10 border-accent/20">
                                78 slides
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 text-sm flex-1">
                            Basé sur HBR Must Reads & Chander Velu. Maîtrisez le 4V Framework, le Customer Value Proposition et le leadership de l'innovation.
                          </p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Layers className="h-3.5 w-3.5 text-accent" />
                              <span>10 Modules : Introduction → Mise en œuvre</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Lightbulb className="h-3.5 w-3.5 text-accent" />
                              <span>Études de cas : Netflix, Amazon, Hilti...</span>
                            </div>
                          </div>

                          <Button 
                            size="lg" 
                            variant="outline"
                            className="w-full gap-2 mt-auto border-accent/30 hover:bg-accent/10" 
                            onClick={() => handleStartCourse("bm-innovation")}
                          >
                            <PlayCircle className="h-5 w-5" />
                            Démarrer
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Entrepreneuriat Vert */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="h-full border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent hover:shadow-elevated hover:border-emerald-500/40 transition-all group">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                              <Leaf className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">Entrepreneuriat Vert</h3>
                              </div>
                              <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/20">
                                70 slides
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 text-sm flex-1">
                            Créez une entreprise durable et viable. Green Business Canvas, modèles circulaires, ESG et mesure d'impact environnemental.
                          </p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Layers className="h-3.5 w-3.5 text-emerald-600" />
                              <span>11 Modules : Fondements → Croissance</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Lightbulb className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Contexte tunisien & financement vert</span>
                            </div>
                          </div>

                          <Button 
                            size="lg" 
                            variant="outline"
                            className="w-full gap-2 mt-auto border-emerald-500/30 hover:bg-emerald-500/10" 
                            onClick={() => handleStartCourse("green-training")}
                          >
                            <PlayCircle className="h-5 w-5" />
                            Démarrer
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Resources */}
              <section className="py-16 bg-muted/30">
                <div className="container">
                  <DownloadableResources />
                </div>
              </section>
            </motion.div>
          )}

          {mainTab === "patterns" && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12"
            >
              <div className="container">
                <InlineLicenseGate contentSlug="bm-patterns" contentName="Business Model Patterns">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Business Model <span className="text-gradient">Patterns</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                      Explorez les 60 patterns de business model, les modèles durables et les métriques de validation.
                    </p>
                  </div>
                  <PatternsSpace />
                </InlineLicenseGate>
              </div>
            </motion.div>
          )}

          {mainTab === "green-bm" && (
            <motion.div
              key="green-bm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12"
            >
              <div className="container">
                <GreenBMPresentation />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <FormationChatbot formationName="Business Model Canvas" formationContext={formationContext} />
    </div>
  );
};

export default BusinessModelPage;
