import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft, ChevronRight, BookOpen, Lightbulb, CheckCircle2,
  Target, Globe, Rocket, Sparkles, Quote, Maximize2, Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface SlideData {
  id: number;
  module: string;
  title: string;
  subtitle?: string;
  content: string[];
  keyPoints?: string[];
  tools?: string[];
  examples?: string[];
  tunisianContext?: string[];
  quote?: { text: string; author: string };
  bulletPoints?: string[];
  tips?: string[];
  type: string;
  image?: string;
}

const typeStylesBase: Record<string, {
  bg: string; icon: typeof Rocket; labelKey: string; textWhite: boolean;
}> = {
  intro: { bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500", icon: Rocket, labelKey: "slides.intro", textWhite: true },
  content: { bg: "bg-card border border-border/50", icon: BookOpen, labelKey: "slides.content", textWhite: false },
  concept: { bg: "bg-card border border-border/50", icon: Lightbulb, labelKey: "slides.concept", textWhite: false },
  "case-study": { bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30", icon: Globe, labelKey: "slides.caseStudy", textWhite: false },
  framework: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30", icon: Target, labelKey: "slides.framework", textWhite: false },
  exercise: { bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/30", icon: Target, labelKey: "slides.exercise", textWhite: false },
  summary: { bg: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950", icon: CheckCircle2, labelKey: "slides.summary", textWhite: true },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
};

interface Props {
  slides: SlideData[];
  title?: string;
  onBack?: () => void;
}

const EnhancedSlidePresentation = ({ slides, title, onBack }: Props) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = slides[current];
  const modules = [...new Set(slides.map(s => s.module))];
  const currentModuleIndex = modules.indexOf(slide.module);
  const progress = ((current + 1) / slides.length) * 100;

  const styleBase = typeStylesBase[slide.type] || typeStylesBase.content;
  const isWhite = styleBase.textWhite;
  const TypeIcon = styleBase.icon;
  const styleLabel = t(styleBase.labelKey);

  const next = useCallback(() => {
    if (current < slides.length - 1) { setDirection(1); setCurrent(c => c + 1); }
  }, [current, slides.length]);

  const prev = useCallback(() => {
    if (current > 0) { setDirection(-1); setCurrent(c => c - 1); }
  }, [current]);

  const goToModule = (i: number) => {
    const idx = slides.findIndex(s => s.module === modules[i]);
    if (idx >= 0) { setDirection(idx > current ? 1 : -1); setCurrent(idx); }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const contentItemDelay = 0.06;

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : ""}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 shrink-0">
              <ChevronLeft className="h-4 w-4" /> {t("common.back")}
            </Button>
          )}
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            {current + 1} / {slides.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 shrink-0">
            <TypeIcon className="h-3 w-3" />
            {styleLabel}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1.5" />

      {/* Module Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {modules.map((mod, i) => (
          <Badge
            key={mod}
            variant={i === currentModuleIndex ? "default" : "outline"}
            className={`cursor-pointer text-xs whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-105 ${
              i < currentModuleIndex ? "opacity-60" : ""
            }`}
            onClick={() => goToModule(i)}
          >
            {mod.replace(/Module \d+:\s?/, "")}
          </Badge>
        ))}
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={`rounded-2xl overflow-hidden shadow-lg ${styleBase.bg} ${isWhite ? "text-white" : ""}`}>
            <div className="p-6 md:p-10 space-y-6">
              {/* Header */}
              <div>
                <Badge
                  variant="secondary"
                  className={`mb-3 text-xs ${isWhite ? "bg-white/15 text-white border-0 backdrop-blur-sm" : ""}`}
                >
                  {slide.module}
                </Badge>
                <h2 className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${isWhite ? "" : "text-foreground"}`}>
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className={`text-base md:text-lg ${isWhite ? "text-white/60" : "text-muted-foreground"}`}>
                    {slide.subtitle}
                  </p>
                )}
              </div>

              {/* Image + Content Layout */}
              <div className={`flex flex-col ${slide.image ? "md:flex-row" : ""} gap-6`}>
                {slide.image && (
                  <motion.div
                    className="md:w-2/5 shrink-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto rounded-xl object-cover max-h-[280px] shadow-md"
                    />
                  </motion.div>
                )}

                <div className="flex-1 space-y-3">
                  {slide.content.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * contentItemDelay + 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        isWhite ? "bg-white/8 hover:bg-white/12" : "bg-muted/40 hover:bg-muted/60"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                        isWhite ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
                      }`}>
                        {i + 1}
                      </div>
                      <p className={`text-sm leading-relaxed ${isWhite ? "text-white/90" : "text-foreground"}`}>
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              {slide.quote && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex gap-4">
                    <Quote className="h-6 w-6 text-primary/40 shrink-0 mt-1" />
                    <div>
                      <p className="text-base italic text-white/90 mb-2 leading-relaxed">"{slide.quote.text}"</p>
                      <p className="text-primary text-sm font-medium">— {slide.quote.author}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bullet Points */}
              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                <ul className="space-y-2">
                  {slide.bulletPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.2 }}
                      className={`flex items-start gap-3 p-3 rounded-xl ${
                        isWhite ? "bg-white/8" : "bg-muted/40"
                      }`}
                    >
                      <ChevronRight className={`h-4 w-4 mt-1 shrink-0 ${isWhite ? "text-white/50" : "text-primary"}`} />
                      <span className="text-sm leading-relaxed">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Key Points */}
              {slide.keyPoints && slide.keyPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-5 rounded-xl ${
                    isWhite ? "bg-white/10 backdrop-blur-sm" : "bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10"
                  }`}
                >
                  <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isWhite ? "text-white" : "text-primary"}`}>
                    <Lightbulb className="h-4 w-4" />
                    {t("slides.keyPoints")}
                  </h4>
                  <div className="space-y-2">
                    {slide.keyPoints.map((kp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${isWhite ? "text-emerald-300" : "text-emerald-500"}`} />
                        <span className={`text-sm ${isWhite ? "text-white/90" : "text-foreground"}`}>{kp}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tools */}
              {slide.tools && slide.tools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2"
                >
                  <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {t("slides.tools")}:
                  </span>
                  {slide.tools.map((tool, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tool}</Badge>
                  ))}
                </motion.div>
              )}

              {/* Examples */}
              {slide.examples && slide.examples.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
                >
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Globe className="h-4 w-4" />
                    {t("slides.examples")}
                  </h4>
                  <ul className="space-y-1.5">
                    {slide.examples.map((ex, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">▸</span> {ex}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Tips */}
              {slide.tips && slide.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-5"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2">{t("slides.tips")}</h4>
                      <ul className="space-y-1">
                        {slide.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tunisian Context */}
              {slide.tunisianContext && slide.tunisianContext.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className={`p-4 rounded-xl ${isWhite ? "bg-red-500/15" : "bg-red-500/5 border border-red-500/10"}`}
                >
                  <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isWhite ? "text-red-200" : "text-red-600 dark:text-red-400"}`}>
                    🇹🇳 {t("slides.tunisianContext")}
                  </h4>
                  <div className="space-y-1.5">
                    {slide.tunisianContext.map((tc, i) => (
                      <p key={i} className={`text-sm ${isWhite ? "text-white/80" : "text-foreground"}`}>• {tc}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev} disabled={current === 0} className="gap-2 rounded-xl">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        <div className="flex gap-1.5 items-center">
          {modules.map((_, i) => (
            <button
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentModuleIndex ? "w-6 h-2.5 bg-primary" : i < currentModuleIndex ? "w-2.5 h-2.5 bg-primary/40" : "w-2.5 h-2.5 bg-muted-foreground/20"
              }`}
              onClick={() => goToModule(i)}
            />
          ))}
        </div>

        <Button onClick={next} disabled={current === slides.length - 1} className="gap-2 rounded-xl">
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Utilisez les flèches ← → du clavier pour naviguer
      </p>
    </div>
  );
};

export default EnhancedSlidePresentation;
