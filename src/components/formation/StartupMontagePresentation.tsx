import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, BookOpen, Target, Lightbulb,
  Quote, CheckCircle, Clock, Sparkles, Maximize2, Minimize2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { montageModules } from "@/data/startupMontageSlidesData";
import StartupMontageActivity from "./StartupMontageActivity";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
};

const typeConfig: Record<string, { icon: typeof Sparkles; label: string }> = {
  intro: { icon: Sparkles, label: "Introduction" },
  concept: { icon: Lightbulb, label: "Concept Clé" },
  framework: { icon: Target, label: "Framework" },
  "case-study": { icon: BookOpen, label: "Étude de Cas" },
  exercise: { icon: Target, label: "Exercice" },
  summary: { icon: CheckCircle, label: "Synthèse" },
};

const StartupMontagePresentation = () => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentModule = montageModules[currentModuleIndex];
  const currentSlide = currentModule.slides[currentSlideIndex];
  const totalSlides = currentModule.slides.length;
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const config = typeConfig[currentSlide.type] || typeConfig.concept;
  const TypeIcon = config.icon;

  const goToNextSlide = () => {
    setDirection(1);
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setShowActivity(true);
    }
  };

  const goToPrevSlide = () => {
    setDirection(-1);
    if (showActivity) {
      setShowActivity(false);
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const selectModule = (index: number) => {
    setDirection(index > currentModuleIndex ? 1 : -1);
    setCurrentModuleIndex(index);
    setCurrentSlideIndex(0);
    setShowActivity(false);
  };

  const completeModule = () => {
    if (!completedModules.includes(currentModule.id)) {
      setCompletedModules([...completedModules, currentModule.id]);
    }
    if (currentModuleIndex < montageModules.length - 1) {
      setDirection(1);
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentSlideIndex(0);
      setShowActivity(false);
    }
  };

  const isIntro = currentSlide.type === "intro";
  const isSummary = currentSlide.type === "summary";
  const isWhite = isIntro || isSummary;

  const getSlideBackground = () => {
    if (isIntro) return `bg-gradient-to-br ${currentModule.color} text-white`;
    if (isSummary) return "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white";
    if (currentSlide.type === "case-study") return "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30";
    if (currentSlide.type === "framework") return "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30";
    return "bg-card border border-border/50";
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : ""}`}>
      {/* Module Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {montageModules.map((module, index) => (
          <button
            key={module.id}
            onClick={() => selectModule(index)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium ${
              currentModuleIndex === index
                ? `bg-gradient-to-r ${module.color} text-white shadow-lg scale-105`
                : completedModules.includes(module.id)
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{module.icon}</span>
              <span className="whitespace-nowrap">Module {index + 1}</span>
              {completedModules.includes(module.id) && <CheckCircle className="h-3.5 w-3.5" />}
            </div>
          </button>
        ))}
      </div>

      {/* Module Header */}
      <div className={`rounded-2xl bg-gradient-to-r ${currentModule.color} text-white p-5 md:p-7`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentModule.icon}</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold">{currentModule.title}</h2>
              <p className="text-white/50 text-sm">{currentModule.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{currentModule.duration}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{totalSlides} slides</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {currentModule.objectives.map((obj, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
              <CheckCircle className="h-3 w-3 text-white/40" />
              {obj}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs">
            <TypeIcon className="h-3 w-3" />
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {showActivity ? 'Activité' : `Slide ${currentSlideIndex + 1}/${totalSlides}`}
          </span>
        </div>
        <Progress value={showActivity ? 100 : progress} className="h-1.5 flex-1" />
        <span className="text-xs text-muted-foreground">
          {showActivity ? '100%' : `${Math.round(progress)}%`}
        </span>
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait" custom={direction}>
        {showActivity ? (
          <motion.div
            key="activity"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <StartupMontageActivity 
              activity={currentModule.activity}
              onComplete={completeModule}
              moduleColor={currentModule.color}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={`rounded-2xl overflow-hidden shadow-lg ${getSlideBackground()}`}>
              <div className="p-6 md:p-10 space-y-5">
                {/* Title */}
                <div>
                  <Badge
                    variant="secondary"
                    className={`mb-3 text-xs ${isWhite ? "bg-white/15 text-white border-0 backdrop-blur-sm" : ""}`}
                  >
                    {currentModule.title}
                  </Badge>
                  <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${isWhite ? "" : "text-foreground"}`}>
                    {currentSlide.title}
                  </h2>
                </div>

                {/* Content */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`text-base leading-relaxed ${isWhite ? "text-white/80" : "text-muted-foreground"}`}
                >
                  {currentSlide.content}
                </motion.p>

                {/* Quote */}
                {currentSlide.quote && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex gap-4">
                      <Quote className="h-6 w-6 text-primary/40 shrink-0 mt-1" />
                      <div>
                        <p className="text-base italic text-white/90 mb-2 leading-relaxed">"{currentSlide.quote.text}"</p>
                        <p className="text-primary text-sm font-medium">— {currentSlide.quote.author}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bullet Points */}
                {currentSlide.bulletPoints && (
                  <ul className="space-y-2">
                    {currentSlide.bulletPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 + 0.15 }}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                          isWhite ? "bg-white/8 hover:bg-white/12" : "bg-muted/40 hover:bg-muted/60"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isWhite ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Tips */}
                {currentSlide.tips && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2">
                          Conseils d'Expert
                        </h4>
                        <ul className="space-y-1">
                          {currentSlide.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-1">
        <Button
          variant="outline"
          onClick={goToPrevSlide}
          disabled={currentSlideIndex === 0 && !showActivity}
          className="gap-2 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        <div className="flex gap-1.5 items-center">
          {currentModule.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlideIndex ? 1 : -1);
                setCurrentSlideIndex(index);
                setShowActivity(false);
              }}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlideIndex && !showActivity
                  ? 'w-6 h-2.5 bg-primary'
                  : index < currentSlideIndex || showActivity
                  ? 'w-2.5 h-2.5 bg-primary/40'
                  : 'w-2.5 h-2.5 bg-muted-foreground/20'
              }`}
            />
          ))}
          <button
            onClick={() => { setDirection(1); setShowActivity(true); }}
            className={`rounded-full transition-all duration-300 ${
              showActivity ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/20'
            }`}
          />
        </div>

        <Button onClick={goToNextSlide} className="gap-2 rounded-xl">
          <span className="hidden sm:inline">
            {showActivity ? 'Module suivant' : currentSlideIndex === totalSlides - 1 ? 'Activité' : 'Suivant'}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Utilisez les flèches ← → du clavier pour naviguer
      </p>
    </div>
  );
};

export default StartupMontagePresentation;
