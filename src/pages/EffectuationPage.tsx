import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  Play, Pause, RotateCcw, Grid, Lightbulb, BookOpen, Quote
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { effectuationSlidesData, effectuationModules } from "@/data/effectuationSlidesData";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

// Images
import bookCover from "@/assets/effectuation/book-cover.jpg";
import sarasSarasvathy from "@/assets/effectuation/saras-sarasvathy.jpg";
import causalVsEffectual from "@/assets/effectuation/causal-vs-effectual.jpg";
import birdInHand from "@/assets/effectuation/bird-in-hand.jpg";
import airbnbStory from "@/assets/effectuation/airbnb-story.jpg";
import worldCentralKitchen from "@/assets/effectuation/world-central-kitchen.jpg";

const EffectuationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'presentation'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  const slide = effectuationSlidesData[currentSlide];
  const progress = ((currentSlide + 1) / effectuationSlidesData.length) * 100;
  const formationContext = useMemo(() => buildFormationContext(effectuationSlidesData), []);
  const totalSlides = effectuationSlidesData.length;

  const nextSlide = () => {
    if (currentSlide < effectuationSlidesData.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setViewMode('presentation');
  };

  // Get image for specific slides
  const getSlideImage = (slideId: number) => {
    if (slideId === 1 || slideId === 2) return bookCover;
    if (slideId === 3) return causalVsEffectual;
    if (slideId === 4 || slideId === 5) return birdInHand;
    if (slideId === 17) return airbnbStory;
    if (slideId === 18) return worldCentralKitchen;
    return null;
  };

  // Overview Mode
  if (viewMode === 'overview') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="container relative z-10">
              <Link
                to="/startups"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux Fondements
              </Link>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">
                    Saras Sarasvathy • 3ème Édition 2025
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Effectual Entrepreneurship
                  </h1>
                  <p className="text-xl text-white/80 mb-6">
                    La science de l'entrepreneuriat expert: comment créer de la valeur 
                    avec ce que vous avez, en contrôlant ce que vous pouvez contrôler.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                      🐦 Bird-in-Hand
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                      💸 Affordable Loss
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                      🧩 Crazy Quilt
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                      🍋 Lemonade
                    </Badge>
                  </div>
                  <Button 
                    size="lg" 
                    className="rounded-full shadow-lg bg-white text-primary hover:bg-white/90 mb-4"
                    onClick={() => setViewMode('presentation')}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Lancer la présentation ({effectuationSlidesData.length} slides)
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden lg:block"
                >
                  <div className="relative">
                    <img 
                      src={bookCover} 
                      alt="Effectual Entrepreneurship Book"
                      className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
                      <img 
                        src={sarasSarasvathy}
                        alt="Prof. Saras Sarasvathy"
                        className="w-20 h-20 rounded-full object-cover border-4 border-primary"
                      />
                      <p className="text-xs font-medium mt-2 text-center">Prof. Saras Sarasvathy</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Modules Grid */}
          <section className="py-16 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl font-bold text-center mb-4">Structure du Cours</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                {effectuationModules.length} modules • {effectuationSlidesData.length} slides interactives
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {effectuationModules.map((module, index) => {
                  const moduleSlides = effectuationSlidesData.filter(s => s.module === module.name);
                  const firstSlideIndex = effectuationSlidesData.findIndex(s => s.module === module.name);
                  
                  return (
                    <motion.div
                      key={module.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="h-full hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => goToSlide(firstSlideIndex)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl">{module.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {module.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {moduleSlides.length} slides
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Key Principles Visual */}
          <section className="py-16">
            <div className="container">
              <h2 className="text-3xl font-bold text-center mb-12">Les 4 Principes Clés</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: "🐦", title: "Bird-in-Hand", desc: "Commencez avec vos moyens", color: "from-amber-500 to-orange-600" },
                  { icon: "💸", title: "Affordable Loss", desc: "Risquez ce que vous pouvez perdre", color: "from-red-500 to-rose-600" },
                  { icon: "🧩", title: "Crazy Quilt", desc: "Formez des partenariats", color: "from-violet-500 to-purple-600" },
                  { icon: "🍋", title: "Lemonade", desc: "Transformez les surprises", color: "from-yellow-500 to-amber-600" },
                ].map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full bg-gradient-to-br ${principle.color} text-white overflow-hidden`}>
                      <CardContent className="p-6 text-center">
                        <span className="text-5xl mb-4 block">{principle.icon}</span>
                        <h3 className="font-bold text-xl mb-2">{principle.title}</h3>
                        <p className="text-white/80">{principle.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <FormationChatbot formationName="Effectuation" formationContext={formationContext} />
      </div>
    );
  }

  // Presentation Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('overview')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vue d'ensemble
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              {currentSlide + 1} / {effectuationSlidesData.length}
            </span>
            <Badge variant="outline" className="border-white/30 text-white/80">
              {slide.module}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentSlide(0)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-white/10" />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 min-h-screen flex items-center">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${slide.color} mb-6`}>
                    <span className="text-2xl">{slide.icon}</span>
                    <span className="font-medium">{slide.module}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-6">{slide.title}</h2>

                  <ul className="space-y-4 mb-8">
                    {slide.content.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-lg text-white/90"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {slide.keyTakeaway && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-primary/20 border border-primary/40 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                        <p className="text-white/90 font-medium">{slide.keyTakeaway}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right: Image or Case Study */}
                <div className="space-y-6">
                  {getSlideImage(slide.id) && (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      src={getSlideImage(slide.id)!}
                      alt={slide.title}
                      className="rounded-2xl shadow-2xl w-full"
                    />
                  )}

                  {slide.quote && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <Quote className="h-5 w-5 text-amber-400 mt-1 shrink-0" />
                        <div>
                          <p className="italic text-white/80 mb-2">"{slide.quote.text}"</p>
                          <p className="text-sm text-amber-400">— {slide.quote.author}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {slide.caseStudy && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-5 w-5 text-amber-400" />
                        <span className="font-bold text-amber-400">Étude de cas</span>
                      </div>
                      <h4 className="font-bold text-xl mb-2">{slide.caseStudy.name}</h4>
                      <p className="text-white/70 mb-4">{slide.caseStudy.description}</p>
                      <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                        <Quote className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <p className="text-sm text-white/80 italic">{slide.caseStudy.lesson}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="container flex items-center justify-between h-20">
          <Button
            variant="ghost"
            size="lg"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Précédent
          </Button>

          {/* Module Navigator */}
          <div className="hidden md:flex items-center gap-1">
            {effectuationModules.map((module, index) => {
              const moduleSlides = effectuationSlidesData.filter(s => s.module === module.name);
              const firstIndex = effectuationSlidesData.findIndex(s => s.module === module.name);
              const isActive = slide.module === module.name;
              
              return (
                <button
                  key={module.name}
                  onClick={() => setCurrentSlide(firstIndex)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                  title={module.name}
                >
                  {module.icon}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="lg"
            onClick={nextSlide}
            disabled={currentSlide === effectuationSlidesData.length - 1}
            className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            Suivant
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EffectuationPage;
