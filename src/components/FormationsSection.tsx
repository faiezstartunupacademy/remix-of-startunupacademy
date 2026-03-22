import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FormationCard from "./FormationCard";

const FormationsSection = () => {
  const { t } = useTranslation();

  const formations = [
    {
      title: t("formations.startupMontage"),
      description: t("formations.startupMontageDesc"),
      icon: "🎓",
      href: "/formation/startup-montage",
      modules: 6,
      duration: "12h",
      students: 89,
      variant: "featured" as const,
    },
    {
      title: t("formations.designThinking"),
      description: t("formations.designThinkingDesc"),
      icon: "🎨",
      href: "/formation/design-thinking",
      modules: 8,
      duration: "12h",
      students: 156,
    },
    {
      title: t("formations.leanCanvas"),
      description: t("formations.leanCanvasDesc"),
      icon: "📋",
      href: "/formation/lean-canvas",
      modules: 10,
      duration: "15h",
      students: 234,
    },
    {
      title: t("formations.growthHacking"),
      description: t("formations.growthHackingDesc"),
      icon: "🚀",
      href: "/formation/growth-hacking",
      modules: 12,
      duration: "18h",
      students: 189,
    },
    {
      title: t("formations.aiBusiness"),
      description: t("formations.aiBusinessDesc"),
      icon: "🤖",
      href: "/formation/ai-business",
      modules: 6,
      duration: "10h",
      students: 112,
    },
    {
      title: t("formations.disciplined"),
      description: t("formations.disciplinedDesc"),
      icon: "🎯",
      href: "/formation/disciplined-entrepreneurship",
      modules: 22,
      duration: "8h",
      students: 67,
    },
    {
      title: t("formations.aiBusiness"),
      description: t("formations.aiBusinessDesc"),
      icon: "🤖",
      href: "/formation/ai-business",
      modules: 6,
      duration: "10h",
      students: 112,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("formations.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("formations.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("formations.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation, index) => (
            <FormationCard key={formation.href} {...formation} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormationsSection;
