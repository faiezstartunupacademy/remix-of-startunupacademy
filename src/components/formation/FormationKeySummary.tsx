import { motion } from "framer-motion";
import { CheckCircle, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormationKeySummaryProps {
  points: string[];
  title?: string;
}

const FormationKeySummary = ({ points, title }: FormationKeySummaryProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          {title || t("formations.keySummary")}
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {points.map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border/50"
          >
            <CheckCircle className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-foreground/80 leading-relaxed">{point}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FormationKeySummary;
