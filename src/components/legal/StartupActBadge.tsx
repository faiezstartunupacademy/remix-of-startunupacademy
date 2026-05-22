import { Award } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import StartupActGuideModal from "./StartupActGuideModal";

interface Props {
  /** When true, show the prestigious gold badge. Otherwise show a muted "Comment l'obtenir ?" CTA. */
  verified: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Gold "🏅 Labellisée Startup Act" badge with tooltip explaining the 3 benefits.
 * If not verified, shows a discreet "Comment obtenir le label ?" trigger that opens the guide modal.
 */
const StartupActBadge = ({ verified, size = "md", className }: Props) => {
  const [guideOpen, setGuideOpen] = useState(false);

  const sizes = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  } as const;

  if (verified) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className={cn(
                "inline-flex items-center font-bold rounded-full",
                "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-950",
                "shadow-lg shadow-amber-500/30 ring-1 ring-amber-300/60",
                "hover:shadow-xl hover:shadow-amber-500/40 transition-shadow",
                sizes[size],
                className
              )}
              aria-label="Badge Startup Act"
            >
              <span aria-hidden>🏅</span>
              <span>Labellisée Startup Act</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3 space-y-2">
            <p className="font-bold text-sm">3 avantages exclusifs Startup Act</p>
            <ul className="space-y-1 text-xs">
              <li className="flex gap-2"><span>→</span><span>Exonération fiscale totale pendant 8 ans</span></li>
              <li className="flex gap-2"><span>→</span><span>Compte en devises autorisé</span></li>
              <li className="flex gap-2"><span>→</span><span>Couverture sociale des fondateurs par l'État</span></li>
            </ul>
            <p className="text-[10px] text-muted-foreground italic pt-1 border-t">
              Cliquer pour ouvrir le guide
            </p>
          </TooltipContent>
        </Tooltip>
        <StartupActGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
      </TooltipProvider>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400",
          "hover:underline underline-offset-4",
          className
        )}
      >
        <Award className="h-4 w-4" />
        Comment obtenir le label Startup Act ?
      </button>
      <StartupActGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </>
  );
};

export default StartupActBadge;
