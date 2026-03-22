import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FormationCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  modules: number;
  duration: string;
  students: number;
  variant?: "default" | "featured";
  index?: number;
}

const FormationCard = ({
  title,
  description,
  icon,
  href,
  modules,
  duration,
  students,
  variant = "default",
  index = 0,
}: FormationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={href}>
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "group relative p-6 rounded-2xl transition-all duration-300 overflow-hidden",
            variant === "featured"
              ? "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg"
              : "bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-elevated"
          )}
        >
          {/* Top accent for default */}
          {variant === "default" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}

          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5",
              variant === "featured" ? "bg-white/15" : "bg-primary/5"
            )}
          >
            {icon}
          </div>

          {/* Content */}
          <h3
            className={cn(
              "text-lg font-bold mb-2",
              variant === "featured" ? "text-white" : "text-foreground group-hover:text-primary transition-colors"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm mb-6 line-clamp-2 leading-relaxed",
              variant === "featured" ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {description}
          </p>

          {/* Stats */}
          <div
            className={cn(
              "flex items-center gap-4 text-xs mb-5",
              variant === "featured" ? "text-white/50" : "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{modules} modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{students}+</span>
            </div>
          </div>

          {/* CTA */}
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all",
              variant === "featured" ? "text-white/80" : "text-primary"
            )}
          >
            <span>Découvrir</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default FormationCard;
