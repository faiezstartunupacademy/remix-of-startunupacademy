import { motion } from "framer-motion";
import { Leaf, Recycle, Sun, Droplets, Wind, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const GreenBusinessSection = () => {
  const { t } = useTranslation();

  const greenTopics = [
    { icon: Recycle, title: t("green.circularEconomy"), description: t("green.circularEconomyDesc") },
    { icon: Sun, title: t("green.solarEnergy"), description: t("green.solarEnergyDesc") },
    { icon: Droplets, title: t("green.waterMgmt"), description: t("green.waterMgmtDesc") },
    { icon: Wind, title: t("green.windEnergy"), description: t("green.windEnergyDesc") },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-emerald-glow/5">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">{t("green.badge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("green.title")}<br />
              <span className="text-primary">{t("green.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg">{t("green.desc")}</p>
            <div className="grid grid-cols-2 gap-4">
              {greenTopics.map((topic, index) => (
                <motion.div key={topic.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="p-2 rounded-lg bg-primary/10"><topic.icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{topic.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button asChild className="shadow-glow">
              <Link to="/formation/business-model"><TreePine className="mr-2 h-5 w-5" />{t("green.exploreGreen")}</Link>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-glow">
                <p className="text-4xl font-bold">10K</p>
                <p className="text-sm text-primary-foreground/80 mt-1">{t("green.globalMarket")}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <p className="text-4xl font-bold text-accent">45%</p>
                <p className="text-sm text-muted-foreground mt-1">{t("green.co2Reduction")}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <p className="text-4xl font-bold text-primary">3000+</p>
                <p className="text-sm text-muted-foreground mt-1">{t("green.sunshineHours")}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl gradient-gold">
                <p className="text-4xl font-bold text-accent-foreground">+1.1°C</p>
                <p className="text-sm text-accent-foreground/80 mt-1">{t("green.tempRise")}</p>
              </motion.div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GreenBusinessSection;