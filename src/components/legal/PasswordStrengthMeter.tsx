import { cn } from "@/lib/utils";

export type StrengthLevel = "weak" | "fair" | "good" | "strong";

export const getPasswordStrength = (pw: string): { score: number; level: StrengthLevel } => {
  let score = 0;
  if (pw.length >= 10) score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const level: StrengthLevel = score <= 1 ? "weak" : score === 2 ? "fair" : score === 3 ? "good" : "strong";
  return { score: Math.min(score, 4), level };
};

interface Props {
  password: string;
  className?: string;
}

const COLORS: Record<StrengthLevel, string> = {
  weak: "bg-destructive",
  fair: "bg-orange-500",
  good: "bg-yellow-500",
  strong: "bg-green-500",
};

const LABELS: Record<StrengthLevel, string> = {
  weak: "Faible",
  fair: "Moyen",
  good: "Bon",
  strong: "Fort",
};

const PasswordStrengthMeter = ({ password, className }: Props) => {
  if (!password) return null;
  const { score, level } = getPasswordStrength(password);
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? COLORS[level] : "bg-muted",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Force : <span className="font-medium text-foreground">{LABELS[level]}</span></span>
        <span>Min. 10 caractères, maj/min/chiffre/spécial</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
