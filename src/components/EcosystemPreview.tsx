import { motion } from "framer-motion";
import { ArrowRight, Building2, Landmark, Users2, Lightbulb, Banknote, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const EcosystemPreview = () => {
  const { t } = useTranslation();

  const ecosystemActors = [
    { icon: Building2, title: t("ecosystem.incubators"), count: "15+", examples: ["Wiki Start-Up", "Flat6Labs", "Founder Institute"], color: "bg-blue-500/10 text-blue-600" },
    { icon: Lightbulb, title: t("ecosystem.accelerators"), count: "10+", examples: ["Startup Act", "iBAN", "Carthage Business Angels"], color: "bg-amber-500/10 text-amber-600" },
    { icon: Banknote, title: t("ecosystem.investors"), count: "20+", examples: ["AfricInvest", "BIAT Capital", "CDC Tunisie"], color: "bg-emerald-500/10 text-emerald-600" },
    { icon: GraduationCap, title: t("ecosystem.universities"), count: "25+", examples: ["INSAT", "Polytechnique", "ESPRIT"], color: "bg-purple-500/10 text-purple-600" },
    { icon: Landmark, title: t("ecosystem.institutions"), count: "10+", examples: ["APII", "Smart Tunisia", "Startup Tunisia"], color: "bg-rose-500/10 text-rose-600" },
    { icon: Users2, title: t("ecosystem.communities"), count: "30+", examples: ["Google Dev Groups", "JCI", "Enactus"], color: "bg-cyan-500/10 text-cyan-600" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            {t("ecosystem.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("ecosystem.dynamicEcosystem")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("ecosystem.dynamicEcosystemDesc")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ecosystemActors.map((actor, index) => (
            <motion.div key={actor.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${actor.color}`}><actor.icon className="h-6 w-6" /></div>
                <span className="text-2xl font-bold text-primary">{actor.count}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{actor.title}</h3>
              <div className="flex flex-wrap gap-2">
                {actor.examples.map((example) => (
                  <span key={example} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">{example}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/ecosysteme">{t("ecosystem.exploreComplete")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EcosystemPreview;