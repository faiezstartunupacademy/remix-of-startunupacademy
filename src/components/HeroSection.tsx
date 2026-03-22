import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, BookOpen, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoStartunup from "@/assets/logo_startunup_new.png";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/30 to-primary/20 rounded-full blur-3xl" 
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <img src={logoStartunup} alt="StarTunUp Academy" className="h-24 md:h-32 w-auto drop-shadow-2xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {t("hero.title1")}{" "}
              <span className="text-gradient-gold">{t("hero.titleHighlight")}</span>{" "}
              {t("hero.title2")}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-white/70 max-w-xl"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild className="shadow-glow group rounded-full h-14 px-8 text-lg">
                <Link to="/formations">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-full h-14 px-8">
                <Link to="/formations">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t("hero.explore")}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="grid gap-4">
              <Link to="/formation/growth-hacking">
                <motion.div whileHover={{ scale: 1.03, y: -8 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-elevated cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">{t("hero.growthHacking")}</h3>
                      <p className="text-sm text-white/60">{t("hero.growthHackingDesc")}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link to="/formation/design-thinking">
                  <motion.div whileHover={{ scale: 1.03, y: -8 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer group">
                    <div className="p-3 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors w-fit mb-4">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-accent transition-colors">{t("hero.designThinking")}</h3>
                    <p className="text-sm text-white/60 mt-1">{t("hero.designThinkingDesc")}</p>
                  </motion.div>
                </Link>

                <Link to="/formation/lean-canvas">
                  <motion.div whileHover={{ scale: 1.03, y: -8 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer group">
                    <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors w-fit mb-4">
                      <Target className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{t("hero.leanCanvas")}</h3>
                    <p className="text-sm text-white/60 mt-1">{t("hero.leanCanvasDesc")}</p>
                  </motion.div>
                </Link>
              </div>

              <Link to="/ecosysteme">
                <motion.div whileHover={{ scale: 1.03, y: -8 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 rounded-2xl gradient-gold border border-accent/30 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                      <Users className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-accent-foreground">{t("hero.ecosystem")}</h3>
                      <p className="text-sm text-accent-foreground/70">{t("hero.ecosystemDesc")}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
