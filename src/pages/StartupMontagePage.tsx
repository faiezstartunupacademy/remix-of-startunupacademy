import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, GraduationCap, Clock, BookOpen, Target, Award, Rocket, CheckCircle, Play, Layers, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StartupMontagePresentation from "@/components/formation/StartupMontagePresentation";
import { montageModules, courseMetadata } from "@/data/startupMontageSlidesData";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

const StartupMontagePage = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'overview' | 'course'>('overview');
  const formationContext = useMemo(() => buildFormationContext(montageModules), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-hero py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <Link to="/formations" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-10 transition-colors text-sm"><ArrowLeft className="h-4 w-4" />{t("common.backToFormations")}</Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-white/10 text-white border-white/10 backdrop-blur-sm px-4 py-1.5"><Sparkles className="h-3.5 w-3.5 mr-2" />{t("startupMontage.eliteFormation")}</Badge>
                <Badge className="bg-amber-500/15 text-amber-200 border-amber-400/20 backdrop-blur-sm px-4 py-1.5"><Award className="h-3.5 w-3.5 mr-2" />{t("startupMontage.certification")}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">{courseMetadata.title}</h1>
              <p className="text-lg text-white/60 mb-8 leading-relaxed max-w-2xl">{courseMetadata.subtitle}</p>
              <div className="flex flex-wrap items-center gap-5 text-white/50 text-sm mb-10">
                {[
                  { icon: Clock, text: courseMetadata.duration },
                  { icon: Layers, text: `${courseMetadata.modules} ${t("formations.modules")}` },
                  { icon: Target, text: `${courseMetadata.activities} ${t("startupMontage.activities")}` },
                  { icon: BookOpen, text: courseMetadata.level },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/5"><item.icon className="h-4 w-4" /><span>{item.text}</span></div>
                ))}
              </div>
              {activeView === 'overview' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={() => setActiveView('course')} className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-6 text-base rounded-xl"><Play className="mr-2 h-5 w-5" />{t("startupMontage.startFormation")}</Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            {activeView === 'overview' ? (
              <div className="space-y-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                    <CardContent className="p-8 md:p-10 relative z-10">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg">🎓</div>
                        <div className="flex-1 text-center md:text-left">
                          <Badge className="mb-3 bg-white/10 text-white/80 border-white/10">{courseMetadata.instructor.credentials}</Badge>
                          <h3 className="text-2xl font-bold mb-3">{courseMetadata.instructor.name}</h3>
                          <p className="text-white/50 text-lg italic leading-relaxed">"{courseMetadata.instructor.philosophy}"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{t("startupMontage.whatYouWillMaster")}</h2>
                    <p className="text-muted-foreground">{t("startupMontage.skillsDesc")}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {courseMetadata.outcomes.map((outcome, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /></div>
                        <span className="text-sm text-foreground leading-relaxed">{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{t("startupMontage.detailedProgram")}</h2>
                    <p className="text-muted-foreground">{t("startupMontage.programDesc")}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {montageModules.map((module, index) => (
                      <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }} onClick={() => setActiveView('course')} className="cursor-pointer">
                        <motion.div whileHover={{ y: -4 }} className={`h-full rounded-2xl bg-gradient-to-br ${module.color} text-white border-0 overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-3xl">{module.icon}</span>
                              <span className="bg-white/15 text-white/80 text-xs px-3 py-1 rounded-full backdrop-blur-sm">{module.duration}</span>
                            </div>
                            <div className="text-xs text-white/50 uppercase tracking-wider font-medium mb-1">{t("startupMontage.module")} {index + 1}</div>
                            <h3 className="text-lg font-bold mb-1">{module.title}</h3>
                            <p className="text-white/60 text-sm mb-5">{module.subtitle}</p>
                            <ul className="space-y-1.5 mb-5">
                              {module.objectives.slice(0, 2).map((obj, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-white/70"><CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-white/50" /><span className="line-clamp-1">{obj}</span></li>
                              ))}
                            </ul>
                            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/50">
                              <span>{module.slides.length} {t("common.slides")}</span>
                              <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3" />{t("startupMontage.access")}</span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("startupMontage.prerequisites")}</h2>
                  <div className="flex flex-wrap gap-2">
                    {courseMetadata.prerequisites.map((prereq, index) => <Badge key={index} variant="outline" className="px-4 py-2 text-sm rounded-xl">{prereq}</Badge>)}
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" /></div>
                    <div className="relative z-10 p-10 md:p-14 text-center">
                      <Rocket className="h-10 w-10 mx-auto mb-5 text-white/80" />
                      <h3 className="text-3xl font-bold text-white mb-3">{t("startupMontage.readyToLaunch")}</h3>
                      <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">{t("startupMontage.readyDesc")}</p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button size="lg" onClick={() => setActiveView('course')} className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base rounded-xl"><Play className="mr-2 h-5 w-5" />{t("startupMontage.startNow")}</Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div>
                <Button variant="ghost" onClick={() => setActiveView('overview')} className="mb-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 h-4 w-4" />{t("common.backToOverview")}</Button>
                <StartupMontagePresentation />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="Montage des Startups" formationContext={formationContext} />
    </div>
  );
};

export default StartupMontagePage;
