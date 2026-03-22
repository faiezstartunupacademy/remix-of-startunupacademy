import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Search, Play, Grid3X3,
  Leaf, Globe, Users, Target, CheckCircle2, Quote, Building2, 
  BookOpen, TrendingUp, Recycle, Award, Zap, Brain, Scale,
  Heart, PieChart, Network, Layers, Link, Sun, GraduationCap,
  ClipboardCheck, BarChart3, Layout, Lightbulb, Binary
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ENTREPRENEURIAT_DURABLE_SLIDES, 
  DURABLE_MODULES, 
  type DurableSlide 
} from "@/data/entrepreneuriatDurableSlidesData";

const iconMap: Record<string, typeof Leaf> = {
  Leaf, Globe, Users, Target, CheckCircle2, Building2, BookOpen,
  TrendingUp, Recycle, Award, Zap, Brain, Scale, Heart, PieChart,
  Network, Layers, Link, Sun, GraduationCap, ClipboardCheck,
  BarChart3, Layout, Lightbulb, Binary, Triangle: Scale, RefreshCw: Recycle,
  MapPin: Target
};

interface EntrepreneuriatDurablePresentationProps {
  onClose: () => void;
}

const EntrepreneuriatDurablePresentation = ({ onClose }: EntrepreneuriatDurablePresentationProps) => {
  const [viewMode, setViewMode] = useState<'overview' | 'slides'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const filteredSlides = useMemo(() => {
    return ENTREPRENEURIAT_DURABLE_SLIDES.filter(slide => {
      const matchesSearch = searchQuery === "" || 
        slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slide.module.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = !selectedModule || slide.module === selectedModule;
      return matchesSearch && matchesModule;
    });
  }, [searchQuery, selectedModule]);

  const progress = ((currentSlide + 1) / ENTREPRENEURIAT_DURABLE_SLIDES.length) * 100;
  const slide = ENTREPRENEURIAT_DURABLE_SLIDES[currentSlide];

  const getIcon = (iconName: string) => iconMap[iconName] || Leaf;

  const renderSlideContent = (slide: DurableSlide) => {
    const SlideIcon = getIcon(slide.icon);
    
    return (
      <Card className={`overflow-hidden bg-gradient-to-br ${slide.color} border-2 shadow-elevated`}>
        <CardContent className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">{slide.module}</Badge>
            <Badge variant="outline">{slide.type}</Badge>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <SlideIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold flex-1">{slide.title}</h2>
          </div>

          {slide.content.definition && (
            <p className="text-lg text-muted-foreground mb-6">{slide.content.definition}</p>
          )}

          {slide.content.keyPoints && (
            <ul className="space-y-2 mb-6">
              {slide.content.keyPoints.map((point, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-2 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {slide.content.table && (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>{slide.content.table.headers.map((h, i) => (
                    <th key={i} className="p-3 bg-emerald-500/10 text-left font-semibold border border-border/50">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {slide.content.table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => (
                      <td key={j} className="p-3 border border-border/50 bg-background/30">{cell}</td>
                    ))}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {slide.content.framework && (
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-emerald-600">{slide.content.framework.title}</h4>
              <div className="grid gap-3">
                {slide.content.framework.elements.map((el, i) => (
                  <div key={i} className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <strong className="text-emerald-600">{el.name}</strong>
                    <p className="text-sm text-muted-foreground">{el.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.content.caseStudy && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-amber-600" />
                <strong>{slide.content.caseStudy.name}</strong>
                <Badge variant="outline" className="ml-2">{slide.content.caseStudy.sector}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{slide.content.caseStudy.context}</p>
              <p className="text-sm mb-2"><strong>Impact:</strong> {slide.content.caseStudy.impact}</p>
              <p className="text-sm font-medium text-amber-600">💡 {slide.content.caseStudy.lesson}</p>
            </div>
          )}

          {slide.content.quote && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <Quote className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <p className="italic text-muted-foreground">{slide.content.quote}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (viewMode === 'overview') {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10">
          <div className="container py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={onClose} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
            <h1 className="text-xl font-bold">Entrepreneuriat Durable</h1>
            <Badge variant="outline">{ENTREPRENEURIAT_DURABLE_SLIDES.length} slides</Badge>
          </div>
        </div>

        <div className="container py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4 border border-emerald-500/20">
              <Leaf className="h-4 w-4" />
              Formation Avancée
            </div>
            <h2 className="text-3xl font-bold mb-2">Entrepreneuriat Durable et Modèles Économiques Innovants</h2>
            <p className="text-muted-foreground">Basé sur Dressler, Haldar et les meilleures pratiques internationales</p>
            <Button size="lg" className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setViewMode('slides'); setCurrentSlide(0); }}>
              <Play className="h-5 w-5" /> Démarrer la présentation
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {DURABLE_MODULES.map((module) => {
              const isSelected = selectedModule === module.name;
              return (
                <Badge key={module.id} variant={isSelected ? "default" : "outline"} 
                  className={`cursor-pointer ${isSelected ? module.color + ' text-white' : ''}`}
                  onClick={() => setSelectedModule(isSelected ? null : module.name)}>
                  {module.name}
                </Badge>
              );
            })}
          </div>

          <div className="relative mb-6 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          <ScrollArea className="h-[500px]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlides.map((slide) => (
                <Card key={slide.id} className="cursor-pointer hover:shadow-lg transition-all group"
                  onClick={() => { setCurrentSlide(slide.id - 1); setViewMode('slides'); }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{slide.id}</Badge>
                      <Badge className="text-xs bg-emerald-500/20 text-emerald-600">{slide.module}</Badge>
                    </div>
                    <h3 className="font-semibold group-hover:text-emerald-600 transition-colors line-clamp-2">{slide.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('overview')} className="gap-2">
              <Grid3X3 className="h-4 w-4" /> Sommaire
            </Button>
            <span className="text-sm font-medium bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">{currentSlide + 1} / {ENTREPRENEURIAT_DURABLE_SLIDES.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-4xl">
            {renderSlideContent(slide)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t bg-card/80 backdrop-blur-lg">
        <div className="container py-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Précédent
          </Button>
          <div className="hidden md:flex gap-1">
            {DURABLE_MODULES.map((m) => (
              <button key={m.id} onClick={() => setCurrentSlide(m.slides[0] - 1)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide + 1 >= m.slides[0] && currentSlide + 1 <= m.slides[1] ? 'bg-emerald-500 w-4' : 'bg-muted-foreground/30'}`} />
            ))}
          </div>
          <Button onClick={() => setCurrentSlide(Math.min(ENTREPRENEURIAT_DURABLE_SLIDES.length - 1, currentSlide + 1))} disabled={currentSlide === ENTREPRENEURIAT_DURABLE_SLIDES.length - 1} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            Suivant <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneuriatDurablePresentation;
