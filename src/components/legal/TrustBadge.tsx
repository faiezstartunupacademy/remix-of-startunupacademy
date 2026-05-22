import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  className?: string;
  variant?: "default" | "compact";
}

const TrustBadge = ({ className, variant = "default" }: TrustBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm",
        className,
      )}
      title="Plateforme conforme à la loi tunisienne n°2004-63 (INPDP) et au RGPD"
    >
      <ShieldCheck className="h-4 w-4 text-primary" />
      {variant === "compact" ? (
        <span>Conforme INPDP 🇹🇳</span>
      ) : (
        <span>Données Protégées — Conforme INPDP 🇹🇳</span>
      )}
    </div>
  );
};

export default TrustBadge;
