import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Network, Zap, Target, TrendingUp, Shield, BarChart3, Lightbulb, BookOpen, FileText, Download, X, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { platformStrategySlidesData } from "@/data/platformStrategySlidesData";
import { platformResourcesData, PlatformResource } from "@/data/platformResourcesData";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

const sections = [
  { name: "Introduction", icon: Layers, range: [1, 5], color: "from-blue-500 to-indigo-600" },
  { name: "Effets de Réseau", icon: Network, range: [6, 10], color: "from-purple-500 to-pink-600" },
  { name: "Monétisation", icon: TrendingUp, range: [11, 14], color: "from-amber-500 to-orange-600" },
  { name: "Gouvernance", icon: Shield, range: [15, 18], color: "from-emerald-500 to-teal-600" },
  { name: "Stratégie", icon: Target, range: [19, 22], color: "from-rose-500 to-red-600" },
  { name: "Métriques", icon: BarChart3, range: [23, 25], color: "from-cyan-500 to-blue-600" },
  { name: "Régulation", icon: Zap, range: [26, 28], color: "from-slate-500 to-gray-600" },
  { name: "Cas Pratiques", icon: BookOpen, range: [29, 32], color: "from-indigo-500 to-purple-600" },
  { name: "Design", icon: Lightbulb, range: [33, 35], color: "from-pink-500 to-rose-600" },
  { name: "Futur", icon: Layers, range: [36, 40], color: "from-violet-500 to-purple-600" },
];

const PlatformStrategyPage = () => {
  const formationContext = useMemo(() => buildFormationContext(platformStrategySlidesData), []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedResource, setSelectedResource] = useState<PlatformResource | null>(null);
  const slide = platformStrategySlidesData[currentSlide];
  const progress = ((currentSlide + 1) / platformStrategySlidesData.length) * 100;

  const currentSection = sections.find(
    (s) => slide.id >= s.range[0] && slide.id <= s.range[1]
  );

  const goToSlide = (index: number) => {
    if (index >= 0 && index < platformStrategySlidesData.length) {
      setCurrentSlide(index);
    }
  };

  const goToSection = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const slideIndex = platformStrategySlidesData.findIndex(
      (s) => s.id === section.range[0]
    );
    if (slideIndex !== -1) setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-12 lg:py-16">
          <div className="container">
            <Link
              to="/formations"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux formations
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  40 slides
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  Nouveau
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                🌐 Platform Strategy
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                Maîtrisez l'économie des plateformes : effets de réseau, monétisation,
                gouvernance et stratégies gagnantes. Basé sur les travaux de Parker,
                Van Alstyne, Choudary, Cusumano et Gawer.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Slide {currentSlide + 1} / {platformStrategySlidesData.length}
                </span>
                {currentSection && (
                  <Badge variant="outline" className={`bg-gradient-to-r ${currentSection.color} text-white border-0`}>
                    {currentSection.name}
                  </Badge>
                )}
              </div>
              <Progress value={progress} className="flex-1 max-w-md h-2" />
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b bg-muted/30">
          <div className="container py-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sections.map((section, index) => {
                const isActive =
                  slide.id >= section.range[0] && slide.id <= section.range[1];
                const SectionIcon = section.icon;
                return (
                  <Button
                    key={section.name}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToSection(index)}
                    className={`whitespace-nowrap gap-2 ${
                      isActive ? `bg-gradient-to-r ${section.color} border-0` : ""
                    }`}
                  >
                    <SectionIcon className="h-4 w-4" />
                    {section.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <section className="py-8 lg:py-12">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-2 shadow-xl">
                  <div className={`h-2 bg-gradient-to-r ${slide.color || "from-blue-500 to-purple-600"}`} />
                  <CardContent className="p-6 lg:p-10">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-8">
                      {slide.icon && (
                        <span className="text-5xl">{slide.icon}</span>
                      )}
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-lg text-muted-foreground">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {/* Main Content */}
                        <div className="space-y-4">
                          {slide.content.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-3"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <p className="text-base lg:text-lg">{item}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Framework */}
                        {slide.framework && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Framework
                            </h4>
                            <p className="text-sm">{slide.framework}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Key Points */}
                        {slide.keyPoints && slide.keyPoints.length > 0 && (
                          <div className="p-4 rounded-xl bg-muted/50">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-amber-500" />
                              Points Clés
                            </h4>
                            <ul className="space-y-2">
                              {slide.keyPoints.map((point, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="text-primary">→</span>
                                  {point}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Examples */}
                        {slide.examples && slide.examples.length > 0 && (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                              <BookOpen className="h-4 w-4" />
                              Exemples
                            </h4>
                            <ul className="space-y-2">
                              {slide.examples.map((example, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <span className="text-emerald-500">•</span>
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Quote */}
                        {slide.quote && (
                          <blockquote className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-l-4 border-amber-500">
                            <p className="italic text-base mb-2">"{slide.quote.text}"</p>
                            <cite className="text-sm text-muted-foreground">
                              — {slide.quote.author}
                            </cite>
                          </blockquote>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => goToSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Précédent
              </Button>

              <div className="hidden md:flex items-center gap-1">
                {platformStrategySlidesData.slice(
                  Math.max(0, currentSlide - 3),
                  Math.min(platformStrategySlidesData.length, currentSlide + 4)
                ).map((s, index) => {
                  const actualIndex = Math.max(0, currentSlide - 3) + index;
                  return (
                    <button
                      key={s.id}
                      onClick={() => goToSlide(actualIndex)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        actualIndex === currentSlide
                          ? "bg-primary scale-125"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  );
                })}
              </div>

              <Button
                size="lg"
                onClick={() => goToSlide(currentSlide + 1)}
                disabled={currentSlide === platformStrategySlidesData.length - 1}
                className="gap-2"
              >
                Suivant
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Articles & Resources Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-purple-500/5 border-t">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">📖 Articles HBR Arabia</h3>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                {platformResourcesData.length} Articles
              </Badge>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Collection d'articles de Harvard Business Review sur les stratégies de plateformes, 
              la disruption et les modèles d'affaires innovants. Cliquez sur un titre pour lire le contenu complet.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {platformResourcesData.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${resource.color}`} />
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {resource.readTime}
                        </div>
                      </div>
                      <h4 
                        className="font-semibold text-sm mb-2 text-primary hover:underline cursor-pointer line-clamp-2 leading-relaxed"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResource(resource);
                        }}
                      >
                        {resource.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {resource.source}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Detail Modal */}
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            {selectedResource && (
              <>
                <DialogHeader>
                  <div className={`h-1 -mx-6 -mt-6 mb-4 bg-gradient-to-r ${selectedResource.color} rounded-t-lg`} />
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{selectedResource.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {selectedResource.readTime}
                    </div>
                  </div>
                  <DialogTitle className="text-xl leading-relaxed pr-8">
                    {selectedResource.title}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedResource.source}
                  </p>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] pr-4">
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">{selectedResource.description}</p>
                    </div>

                    {/* Full Content */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Contenu de l'article
                      </h4>
                      {selectedResource.fullContent.map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Key Points */}
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg border border-primary/10">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Points clés à retenir
                      </h4>
                      <ul className="space-y-2">
                        {selectedResource.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">→</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <Button variant="outline" onClick={() => setSelectedResource(null)}>
                    Fermer
                  </Button>
                  <a href={selectedResource.file} download>
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Télécharger le PDF
                    </Button>
                  </a>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <section className="py-12 bg-muted/30 border-t">
          <div className="container">
            <h3 className="text-xl font-bold mb-6">📚 Sources et Références</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Platform Revolution", authors: "Parker, Van Alstyne & Choudary", year: "2016" },
                { title: "Platform Strategy", authors: "Reillier & Reillier", year: "2017" },
                { title: "Platform Business Models", authors: "R. Srinivasan", year: "2021" },
                { title: "The Business of Platforms", authors: "Cusumano, Gawer & Yoffie", year: "2019" },
                { title: "HBR's 10 Must Reads on Platforms", authors: "Harvard Business Review", year: "2020" },
                { title: "Platform Ecosystems", authors: "Amrit Tiwana", year: "2013" },
              ].map((source, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-sm">{source.title}</h4>
                  <p className="text-xs text-muted-foreground">{source.authors}</p>
                  <Badge variant="outline" className="mt-2 text-xs">{source.year}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="Platform Strategy" formationContext={formationContext} />
    </div>
  );
};

export default PlatformStrategyPage;
