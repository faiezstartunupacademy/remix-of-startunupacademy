import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, BookOpen, GraduationCap, Layers, ChevronLeft, ChevronRight, Search, Grid3X3, X, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OMC_SLIDES, OMC_CATEGORIES } from "@/data/operatingModelCanvasSlidesData";
import TransformationRoadmap from "@/components/TransformationRoadmap";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

const OperatingModelPage = () => {
  const formationContext = useMemo(() => buildFormationContext(OMC_SLIDES), []);
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'grid'>('slides');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSlides = OMC_SLIDES.filter(slide =>
    slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slide.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progress = ((currentSlide + 1) / OMC_SLIDES.length) * 100;
  const slide = OMC_SLIDES[currentSlide];
  const category = OMC_CATEGORIES.find(c => c.id === slide?.category);

  if (showPresentation) {
    if (viewMode === 'grid') {
      return (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={() => setShowPresentation(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setViewMode('slides')}>
                  <PlayCircle className="mr-2 h-4 w-4" /> Mode Slides
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSlides.map((s, idx) => {
                const cat = OMC_CATEGORIES.find(c => c.id === s.category);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => { setCurrentSlide(OMC_SLIDES.indexOf(s)); setViewMode('slides'); }}
                    className="cursor-pointer"
                  >
                    <Card className={`h-full hover:shadow-lg transition-all border-2 hover:border-primary/50`}>
                      <CardContent className="p-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center text-xl mb-3`}>
                          {cat?.icon}
                        </div>
                        <Badge variant="outline" className="mb-2 text-xs">{s.id}</Badge>
                        <h3 className="font-semibold text-sm line-clamp-2">{s.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{cat?.name}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setShowPresentation(false)}>
              <X className="mr-2 h-4 w-4" /> Fermer
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentSlide + 1}/{OMC_SLIDES.length}</Badge>
              <Badge className={`bg-gradient-to-r ${category?.color} text-white`}>
                {category?.icon} {category?.name}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setViewMode('grid')}>
              <Grid3X3 className="mr-2 h-4 w-4" /> Grille
            </Button>
          </div>
          <Progress value={progress} className="h-1 mt-3" />
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl w-full"
          >
            <Card className="shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category?.color} flex items-center justify-center text-3xl mb-6`}>
                  {category?.icon}
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-2">{slide.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{slide.subtitle}</p>
                <p className="text-lg leading-relaxed mb-6">{slide.content}</p>
                
                {slide.keyPoints && (
                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold mb-4">Points clés</h3>
                    <ul className="space-y-2">
                      {slide.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">{i+1}</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {slide.framework && (
                  <div className="bg-primary/5 rounded-xl p-6 mb-6">
                    <h3 className="font-bold mb-4">{slide.framework.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {slide.framework.elements.map((el, i) => (
                        <div key={i} className="bg-background rounded-lg p-4 border">
                          <div className="text-2xl font-black text-primary mb-1">{el.letter}</div>
                          <div className="font-semibold text-sm">{el.name}</div>
                          <div className="text-xs text-muted-foreground">{el.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {slide.tableData && (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          {slide.tableData.headers.map((h, i) => (
                            <th key={i} className="p-3 text-left font-semibold border">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {slide.tableData.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-muted/50">
                            {row.map((cell, j) => (
                              <td key={j} className="p-3 border">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">Source: {slide.source}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <div className="flex gap-1 overflow-x-auto max-w-md">
              {OMC_CATEGORIES.map(cat => {
                const catSlides = OMC_SLIDES.filter(s => s.category === cat.id);
                const firstIdx = OMC_SLIDES.indexOf(catSlides[0]);
                const isActive = slide?.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentSlide(firstIdx)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                );
              })}
            </div>
            <Button
              onClick={() => setCurrentSlide(Math.min(OMC_SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === OMC_SLIDES.length - 1}
            >
              Suivant <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Formation Operating Model</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Operating Model <span className="text-primary">Canvas</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Maîtrisez le framework POLISM pour transformer votre stratégie en excellence opérationnelle.
            Basé sur le livre "Operating Model Canvas" de Campbell & Gutierrez.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <BookOpen className="mr-2 h-4 w-4" /> {OMC_SLIDES.length} Slides
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <GraduationCap className="mr-2 h-4 w-4" /> {OMC_CATEGORIES.length} Modules
            </Badge>
          </div>
          <Button size="lg" className="shadow-glow" onClick={() => setShowPresentation(true)}>
            <PlayCircle className="mr-2 h-5 w-5" /> Commencer la formation
          </Button>
        </motion.div>

        <Tabs defaultValue="modules" className="w-full">
          <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-xl py-4 border-b mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="modules">
                <GraduationCap className="mr-2 h-4 w-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="roadmap">
                <Calendar className="mr-2 h-4 w-4" />
                Roadmap
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="modules">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {OMC_CATEGORIES.map((cat, idx) => {
                const catSlides = OMC_SLIDES.filter(s => s.category === cat.id);
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer" onClick={() => { setCurrentSlide(OMC_SLIDES.indexOf(catSlides[0])); setShowPresentation(true); }}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4`}>
                          {cat.icon}
                        </div>
                        <h3 className="font-bold mb-1">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{catSlides.length} slides</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
            <TransformationRoadmap />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <FormationChatbot formationName="Operating Model Canvas" formationContext={formationContext} />
    </div>
  );
};

export default OperatingModelPage;
