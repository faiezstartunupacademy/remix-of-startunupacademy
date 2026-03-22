import { useState } from "react";
import { Download, FileText, Loader2, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { growthMetrics, categories as metricCategories } from "@/data/growthMetricsData";
import { BM_PATTERNS, SUSTAINABLE_PATTERNS } from "@/data/businessModelPatterns";
import { greenActors } from "@/data/greenEcosystemData";
import {
  exportMetricsToPDF,
  exportPatternsToPDF,
  exportEcosystemToPDF,
  exportCombosToPDF,
  exportAllCardsToPDF,
} from "@/utils/exportUtils";

// Import combos data - we'll need to access this from the component
const defaultCombos = [
  { name: "LTV/CAC Ratio", category: "Unit Economics", formula: "LTV / CAC", interpretation: "Ratio idéal > 3:1" },
  { name: "CAC Payback Period", category: "Unit Economics", formula: "CAC / (ARPU × Gross Margin)", interpretation: "< 12 mois pour SaaS" },
  { name: "Magic Number", category: "Growth", formula: "Net New ARR / S&M Spend", interpretation: "> 1 = efficacité élevée" },
  { name: "Rule of 40", category: "Financial", formula: "Revenue Growth % + EBITDA Margin %", interpretation: "> 40% = santé financière" },
  { name: "Quick Ratio", category: "Growth", formula: "(New MRR + Expansion) / (Churn + Contraction)", interpretation: "> 4 = croissance saine" },
  { name: "NRR", category: "Retention", formula: "(Starting MRR + Expansion - Churn - Contraction) / Starting MRR", interpretation: "> 100% = croissance nette" },
  { name: "DAU/MAU Ratio", category: "Engagement", formula: "DAU / MAU × 100", interpretation: "> 25% = stickiness élevée" },
  { name: "PMF Score", category: "Validation", formula: "% Very Disappointed if gone", interpretation: "> 40% = PMF atteint" },
];

interface DownloadAllCardsProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  combos?: any[];
  ecosystemActors?: any[];
}

const DownloadAllCards = ({
  variant = "outline",
  size = "default",
  className = "",
  combos = defaultCombos,
  ecosystemActors,
}: DownloadAllCardsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setLoading(type);
    setCompleted(null);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      switch (type) {
        case "metrics":
          exportMetricsToPDF(growthMetrics, metricCategories);
          break;
        case "bm-navigator":
          exportPatternsToPDF(BM_PATTERNS, "Business Model Navigator - 60 Patterns", "bm-navigator-patterns.pdf");
          break;
        case "sustainable":
          exportPatternsToPDF(SUSTAINABLE_PATTERNS, "Sustainable Patterns - 45 Patterns", "sustainable-patterns.pdf");
          break;
        case "ecosystem":
          if (ecosystemActors) {
            exportEcosystemToPDF(ecosystemActors, "Écosystème Startup Tunisien", "ecosysteme-tunisien.pdf");
          }
          break;
        case "green":
          exportEcosystemToPDF(greenActors, "Écosystème Green Tunisien", "ecosysteme-green-tunisie.pdf");
          break;
        case "combos":
          exportCombosToPDF(combos);
          break;
        case "all":
          exportAllCardsToPDF(
            growthMetrics,
            metricCategories,
            BM_PATTERNS,
            SUSTAINABLE_PATTERNS,
            ecosystemActors || [],
            combos
          );
          break;
      }
      setCompleted(type);
      setTimeout(() => setCompleted(null), 2000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Export failed:", error);
      }
    } finally {
      setLoading(null);
    }
  };

  const getIcon = (type: string) => {
    if (loading === type) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (completed === type) return <Check className="h-4 w-4 text-emerald-500" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          <Download className="h-4 w-4" />
          Télécharger les cartes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleExport("metrics")} className="gap-2">
          {getIcon("metrics")}
          Métriques (86 cartes)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("bm-navigator")} className="gap-2">
          {getIcon("bm-navigator")}
          BM Navigator (60 patterns)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("sustainable")} className="gap-2">
          {getIcon("sustainable")}
          Sustainable (45 patterns)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("combos")} className="gap-2">
          {getIcon("combos")}
          Combos Métriques
        </DropdownMenuItem>
        {ecosystemActors && (
          <DropdownMenuItem onClick={() => handleExport("ecosystem")} className="gap-2">
            {getIcon("ecosystem")}
            Écosystème Tunisien
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleExport("green")} className="gap-2">
          {getIcon("green")}
          Écosystème Green
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("all")} className="gap-2 font-medium">
          <Package className="h-4 w-4" />
          Tout télécharger (PDF)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadAllCards;
