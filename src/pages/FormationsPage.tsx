import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Lightbulb, Target, TrendingUp, Briefcase, BarChart3, Settings, Crown, Scale, Clock, Layers, Sparkles, GraduationCap, ArrowRight, Users, ClipboardCheck, UserPlus, Rocket, BrainCircuit, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainerRegistrationForm from "@/components/formation/TrainerRegistrationForm";
import ParticipantRegistrationForm from "@/components/formation/ParticipantRegistrationForm";
import FormationEvaluationForm from "@/components/formation/FormationEvaluationForm";
import TrainerAppGenerator from "@/components/formation/TrainerAppGenerator";
import FormationEvaluationSpace from "@/components/formation/FormationEvaluationSpace";
import MindMapGenerator from "@/components/formation/MindMapGenerator";

const FormationsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("startunup");

  const startunupFormations = [
    { title: t("formations.startupMontage"), description: t("formations.startupMontageDesc"), href: "/formation/startup-montage", icon: "🎓", gradient: "from-violet-600 via-purple-600 to-indigo-700", duration: "12 " + t("formationsPage.hours"), modules: 6, level: t("formationsPage.expert"), isNew: true, isFeatured: true, restricted: true },
    { title: t("formationsPage.platformStrategy"), description: t("formationsPage.platformStrategyDesc"), href: "/formation/platform-strategy", icon: "🌐", gradient: "from-blue-600 via-indigo-600 to-blue-700", duration: "10 " + t("formationsPage.hours"), modules: 40, level: t("formationsPage.expert"), isNew: true, restricted: true },
    { title: t("formationsPage.bmcVsLean"), description: t("formationsPage.bmcVsLeanDesc"), href: "/formation/bm-comparison", icon: "⚖️", gradient: "from-rose-600 via-pink-600 to-rose-700", duration: "4 " + t("formationsPage.hours"), modules: 5, level: t("formationsPage.expert"), restricted: true },
    { title: "Design Thinking", description: t("formations.designThinkingDesc"), href: "/formation/design-thinking", icon: "🎨", gradient: "from-purple-600 via-fuchsia-600 to-purple-700", duration: "8 " + t("formationsPage.hours"), modules: 12, level: t("formationsPage.beginner"), restricted: true },
    { title: "Lean Canvas", description: t("formations.leanCanvasDesc"), href: "/formation/lean-canvas", icon: "📋", gradient: "from-emerald-600 via-teal-600 to-emerald-700", duration: "6 " + t("formationsPage.hours"), modules: 10, level: t("formationsPage.intermediate"), restricted: true },
    { title: "Growth Hacking", description: t("formations.growthHackingDesc"), href: "/formation/growth-hacking", icon: "🚀", gradient: "from-orange-600 via-amber-600 to-orange-700", duration: "16 " + t("formationsPage.hours"), modules: 14, level: t("formationsPage.advanced"), restricted: true },
    { title: t("formationsPage.businessModel"), description: t("formationsPage.businessModelDesc"), href: "/formation/business-model", icon: "💼", gradient: "from-blue-600 via-sky-600 to-blue-700", duration: "12 " + t("formationsPage.hours"), modules: 15, level: t("formationsPage.intermediate"), restricted: true },
    { title: t("formationsPage.marketingStartups"), description: t("formationsPage.marketingStartupsDesc"), href: "/formation/startup-marketing", icon: "📈", gradient: "from-pink-600 via-rose-600 to-pink-700", duration: "14 " + t("formationsPage.hours"), modules: 18, level: t("formationsPage.intermediate"), restricted: true },
    { title: t("formationsPage.operatingModel"), description: t("formationsPage.operatingModelDesc"), href: "/formation/operating-model", icon: "⚙️", gradient: "from-indigo-600 via-blue-600 to-indigo-700", duration: "10 " + t("formationsPage.hours"), modules: 12, level: t("formationsPage.advanced"), restricted: true },
    { title: t("formationsPage.cChief"), description: t("formationsPage.cChiefDesc"), href: "/c-chief", icon: "👑", gradient: "from-amber-600 via-yellow-600 to-amber-700", duration: "8 " + t("formationsPage.hours"), modules: 14, level: t("formationsPage.advanced"), restricted: true },
    { title: t("formations.disciplined"), description: t("formations.disciplinedDesc"), href: "/formation/disciplined-entrepreneurship", icon: "🎯", gradient: "from-cyan-600 via-teal-600 to-cyan-700", duration: "8 " + t("formationsPage.hours"), modules: 22, level: t("formationsPage.expert"), isNew: true, restricted: true },
    { title: t("formationsPage.aiBusiness"), description: t("formationsPage.aiBusinessDesc"), href: "/formation/ai-business", icon: "🤖", gradient: "from-violet-600 via-fuchsia-600 to-pink-700", duration: "6 " + t("formationsPage.hours"), modules: 8, level: t("formationsPage.intermediate"), isNew: true, restricted: true },
  ];

  const getLevelColor = (level: string) => {
    const beginner = t("formationsPage.beginner");
    const intermediate = t("formationsPage.intermediate");
    const advanced = t("formationsPage.advanced");
    const expert = t("formationsPage.expert");
    if (level === beginner) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (level === intermediate) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    if (level === advanced) return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    if (level === expert) return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    return "bg-muted text-muted-foreground";
  };

  const featured = startunupFormations.filter(f => f.isFeatured);
  const others = startunupFormations.filter(f => !f.isFeatured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-hero py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" /> {t("common.backToHome")}
            </Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-8 border border-white/10">
                <GraduationCap className="h-4 w-4" />
                <span>{t("formationsPage.trainingSpace")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t("formationsPage.heroTitle")}{" "}
                <span className="text-gradient-gold">{t("formationsPage.heroHighlight")}</span>
              </h1>
              <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-2xl">{t("formationsPage.heroDesc")}</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "10+", label: t("formationsPage.coursesCount"), icon: BookOpen },
                  { value: "100+", label: t("formationsPage.hoursCount"), icon: Clock },
                  { value: "140+", label: t("formationsPage.toolsCount"), icon: Layers },
                ].map((stat) => (
                  <motion.div key={stat.label} whileHover={{ y: -2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 flex items-center gap-4">
                    <stat.icon className="h-5 w-5 text-white/40" />
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 pb-20">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-6">
                <TabsTrigger value="startunup" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /><span className="hidden sm:inline">{t("formationsPage.startunupTab")}</span></TabsTrigger>
                <TabsTrigger value="mindmap" className="flex items-center gap-2"><BrainCircuit className="h-4 w-4" /><span className="hidden sm:inline">Mind Maps</span></TabsTrigger>
                <TabsTrigger value="external" className="flex items-center gap-2"><Users className="h-4 w-4" /><span className="hidden sm:inline">{t("formationsPage.externalTab")}</span></TabsTrigger>
                <TabsTrigger value="trainer" className="flex items-center gap-2"><UserPlus className="h-4 w-4" /><span className="hidden sm:inline">{t("formationsPage.trainerTab")}</span></TabsTrigger>
                <TabsTrigger value="generator" className="flex items-center gap-2"><Rocket className="h-4 w-4" /><span className="hidden sm:inline">{t("formationsPage.createTab")}</span></TabsTrigger>
                <TabsTrigger value="evaluation" className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /><span className="hidden sm:inline">{t("formationsPage.evaluationTab")}</span></TabsTrigger>
              </TabsList>

              <TabsContent value="startunup" className="space-y-8">
                {featured.map((formation) => (
                  <motion.div key={formation.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Link to={formation.href}>
                      <div className={`relative rounded-3xl bg-gradient-to-br ${formation.gradient} p-8 md:p-12 overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-5">
                              <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm"><Sparkles className="h-3 w-3 mr-1.5" /> {t("formationsPage.eliteFormation")}</Badge>
                              <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">{t("common.new")}</Badge>
                              <Badge className={`backdrop-blur-sm border-white/20 ${formation.restricted ? "bg-amber-500/20 text-amber-200" : "bg-emerald-500/20 text-emerald-200"}`}>
                                {formation.restricted ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                                {formation.restricted ? t("formationsPage.restricted") : t("formationsPage.freeAccess")}
                              </Badge>
                            </div>
                            <div className="text-5xl mb-4">{formation.icon}</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{formation.title}</h2>
                            <p className="text-white/70 text-lg max-w-xl leading-relaxed">{formation.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-6 text-white/60 text-sm">
                              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formation.duration}</span>
                              <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" />{formation.modules} {t("formations.modules")}</span>
                              <span className="flex items-center gap-1.5"><Target className="h-4 w-4" />{formation.level}</span>
                            </div>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 group-hover:bg-white/30 transition-colors">
                            {t("common.start")} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{t("formationsPage.startunupFormations")}</h2>
                  <p className="text-muted-foreground mb-6">{t("formationsPage.startunupDesc")}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {others.map((formation, index) => (
                    <motion.div key={formation.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                      <Link to={formation.href}>
                        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}
                          className="group relative h-full rounded-2xl bg-card border border-border hover:border-primary/30 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                          <div className={`h-1.5 bg-gradient-to-r ${formation.gradient}`} />
                          <div className="p-6">
                            {formation.isNew && <Badge className="absolute top-5 right-14 bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs">{t("common.new")}</Badge>}
                            <div className={`absolute top-5 right-5 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${formation.restricted ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                              {formation.restricted ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            </div>
                            <div className="text-3xl mb-4">{formation.icon}</div>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{formation.title}</h3>
                            <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">{formation.description}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formation.duration}</span>
                              <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{formation.modules} mod.</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={`text-xs ${getLevelColor(formation.level)}`}>{formation.level}</Badge>
                              <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {t("common.discover")} <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mindmap" className="space-y-8">
                <MindMapGenerator formations={[
                  { name: "Design Thinking", icon: "🎨", keyPoints: t("formations.keySummaryDesignThinking").split("|") },
                  { name: "Lean Canvas", icon: "📋", keyPoints: t("formations.keySummaryLeanCanvas").split("|") },
                  { name: "Growth Hacking", icon: "🚀", keyPoints: t("formations.keySummaryGrowthHacking").split("|") },
                  { name: "AI Business", icon: "🤖", keyPoints: t("formations.keySummaryAIBusiness").split("|") },
                  { name: "Disciplined Entrepreneurship", icon: "🎯", keyPoints: t("formations.keySummaryDisciplined").split("|") },
                  { name: "Montage des Startups", icon: "🎓", keyPoints: t("formations.keySummaryStartupMontage").split("|") },
                ]} />
              </TabsContent>

              <TabsContent value="external" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4"><Users className="h-8 w-8 text-primary" /></div>
                  <h2 className="text-2xl font-bold mb-3">{t("formationsPage.externalTitle")}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t("formationsPage.externalDesc")}
                    <strong> {t("formationsPage.externalRequired")}</strong> {t("formationsPage.externalRequiredDesc")}
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
                    <strong>{t("formationsPage.prerequisite")}</strong> {t("formationsPage.prerequisiteDesc")}
                  </div>
                </motion.div>
                <ParticipantRegistrationForm />
              </TabsContent>

              <TabsContent value="trainer" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4"><UserPlus className="h-8 w-8 text-primary" /></div>
                  <h2 className="text-2xl font-bold mb-3">{t("formationsPage.becomeTrainer")}</h2>
                  <p className="text-muted-foreground mb-6">{t("formationsPage.becomeTrainerDesc")}</p>
                </motion.div>
                <TrainerRegistrationForm />
              </TabsContent>

              <TabsContent value="generator" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4"><Rocket className="h-8 w-8 text-primary" /></div>
                  <h2 className="text-2xl font-bold mb-3">{t("formationsPage.createTitle")}</h2>
                  <p className="text-muted-foreground mb-6">{t("formationsPage.createDesc")}</p>
                </motion.div>
                <TrainerAppGenerator />
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4"><ClipboardCheck className="h-8 w-8 text-primary" /></div>
                  <h2 className="text-2xl font-bold mb-3">{t("formationsPage.evaluationTitle")}</h2>
                  <p className="text-muted-foreground mb-6">{t("formationsPage.evaluationDesc")}</p>
                </motion.div>
                <FormationEvaluationSpace />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FormationsPage;
