import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Grid3X3, 
  Leaf, 
  TrendingUp, 
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3,
  DollarSign,
  Users,
  RefreshCw,
  Zap,
  Info,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Types
interface MetricCalculation {
  id: string;
  name: string;
  formula: string;
  inputs: { id: string; label: string; placeholder: string; suffix?: string }[];
  calculate: (values: Record<string, number>) => number;
  format: (value: number) => string;
  interpretation: (value: number, bmType: string) => string;
  benchmarks: Record<string, { good: string; warning: string; bad: string }>;
}

// Business Model Type Configurations
const bmTypes = [
  { 
    id: "saas", 
    name: "SaaS / Subscription", 
    icon: Grid3X3, 
    color: "bg-blue-500",
    source: "Navigator",
    description: "Logiciel en abonnement avec revenus récurrents",
    keyMetrics: ["MRR", "Churn Rate", "LTV/CAC", "NRR"]
  },
  { 
    id: "marketplace", 
    name: "Marketplace", 
    icon: Users, 
    color: "bg-purple-500",
    source: "Navigator",
    description: "Plateforme connectant acheteurs et vendeurs",
    keyMetrics: ["GMV", "Take Rate", "Liquidity", "CAC"]
  },
  { 
    id: "circular", 
    name: "Économie Circulaire", 
    icon: RefreshCw, 
    color: "bg-emerald-500",
    source: "Sustainable",
    description: "Modèle de recyclage et réutilisation",
    keyMetrics: ["Waste Reduction", "Resource Efficiency", "CO2 Saved", "ROI"]
  },
  { 
    id: "product-service", 
    name: "Product-as-a-Service", 
    icon: Leaf, 
    color: "bg-teal-500",
    source: "Sustainable",
    description: "Location et usage plutôt que propriété",
    keyMetrics: ["Utilization Rate", "ARPU", "Churn", "LTV"]
  },
  { 
    id: "freemium", 
    name: "Freemium", 
    icon: Zap, 
    color: "bg-amber-500",
    source: "Navigator",
    description: "Gratuit avec options premium payantes",
    keyMetrics: ["Conversion Rate", "ARPU", "CAC", "Viral Coefficient"]
  },
  { 
    id: "impact", 
    name: "Impact / B Corp", 
    icon: TrendingUp, 
    color: "bg-rose-500",
    source: "BMV",
    description: "Double bottom line: profit + impact",
    keyMetrics: ["SROI", "Impact Score", "NPS", "Retention"]
  }
];

// Metrics Calculations
const metricsCalculations: MetricCalculation[] = [
  {
    id: "ltv-cac",
    name: "LTV/CAC Ratio",
    formula: "LTV ÷ CAC",
    inputs: [
      { id: "arpu", label: "ARPU mensuel", placeholder: "100", suffix: "DT" },
      { id: "lifetime", label: "Durée vie client (mois)", placeholder: "24" },
      { id: "margin", label: "Marge brute", placeholder: "70", suffix: "%" },
      { id: "cac", label: "CAC", placeholder: "500", suffix: "DT" }
    ],
    calculate: (v) => {
      const ltv = v.arpu * v.lifetime * (v.margin / 100);
      return ltv / v.cac;
    },
    format: (v) => `${v.toFixed(2)}x`,
    interpretation: (v, bm) => {
      if (v >= 3) return "Excellent ! Votre acquisition client est très rentable.";
      if (v >= 2) return "Bon ratio, mais il y a de la marge d'amélioration.";
      if (v >= 1) return "Attention : vous récupérez à peine votre investissement.";
      return "Critique : vous perdez de l'argent sur chaque client.";
    },
    benchmarks: {
      saas: { good: "> 3x", warning: "2-3x", bad: "< 2x" },
      marketplace: { good: "> 2x", warning: "1.5-2x", bad: "< 1.5x" },
      circular: { good: "> 2.5x", warning: "1.5-2.5x", bad: "< 1.5x" },
      "product-service": { good: "> 4x", warning: "2-4x", bad: "< 2x" },
      freemium: { good: "> 3x", warning: "2-3x", bad: "< 2x" },
      impact: { good: "> 2x", warning: "1.5-2x", bad: "< 1.5x" }
    }
  },
  {
    id: "cac-payback",
    name: "CAC Payback",
    formula: "CAC ÷ (ARPU × Marge)",
    inputs: [
      { id: "cac", label: "CAC", placeholder: "500", suffix: "DT" },
      { id: "arpu", label: "ARPU mensuel", placeholder: "100", suffix: "DT" },
      { id: "margin", label: "Marge brute", placeholder: "70", suffix: "%" }
    ],
    calculate: (v) => v.cac / (v.arpu * (v.margin / 100)),
    format: (v) => `${v.toFixed(1)} mois`,
    interpretation: (v, bm) => {
      if (v <= 12) return "Excellent ! Vous récupérez votre CAC en moins d'un an.";
      if (v <= 18) return "Correct, mais surveillez votre cash flow.";
      if (v <= 24) return "Attention : délai de récupération élevé.";
      return "Critique : le payback est trop long pour être viable.";
    },
    benchmarks: {
      saas: { good: "< 12 mois", warning: "12-18 mois", bad: "> 18 mois" },
      marketplace: { good: "< 6 mois", warning: "6-12 mois", bad: "> 12 mois" },
      circular: { good: "< 18 mois", warning: "18-24 mois", bad: "> 24 mois" },
      "product-service": { good: "< 12 mois", warning: "12-18 mois", bad: "> 18 mois" },
      freemium: { good: "< 6 mois", warning: "6-12 mois", bad: "> 12 mois" },
      impact: { good: "< 18 mois", warning: "18-24 mois", bad: "> 24 mois" }
    }
  },
  {
    id: "unit-economics",
    name: "Unit Economics",
    formula: "LTV - CAC",
    inputs: [
      { id: "arpu", label: "ARPU mensuel", placeholder: "100", suffix: "DT" },
      { id: "lifetime", label: "Durée vie client (mois)", placeholder: "24" },
      { id: "margin", label: "Marge brute", placeholder: "70", suffix: "%" },
      { id: "cac", label: "CAC", placeholder: "500", suffix: "DT" }
    ],
    calculate: (v) => {
      const ltv = v.arpu * v.lifetime * (v.margin / 100);
      return ltv - v.cac;
    },
    format: (v) => `${v.toFixed(0)} DT`,
    interpretation: (v, bm) => {
      if (v > 1000) return "Excellent ! Vous générez beaucoup de valeur par client.";
      if (v > 500) return "Bon niveau de profitabilité par client.";
      if (v > 0) return "Marge positive mais faible, optimisez.";
      return "Négatif ! Vous perdez de l'argent sur chaque client.";
    },
    benchmarks: {
      saas: { good: "> 1000 DT", warning: "500-1000 DT", bad: "< 500 DT" },
      marketplace: { good: "> 200 DT", warning: "50-200 DT", bad: "< 50 DT" },
      circular: { good: "> 500 DT", warning: "200-500 DT", bad: "< 200 DT" },
      "product-service": { good: "> 800 DT", warning: "400-800 DT", bad: "< 400 DT" },
      freemium: { good: "> 300 DT", warning: "100-300 DT", bad: "< 100 DT" },
      impact: { good: "> 400 DT", warning: "150-400 DT", bad: "< 150 DT" }
    }
  },
  {
    id: "runway",
    name: "Runway",
    formula: "Cash ÷ Burn Rate",
    inputs: [
      { id: "cash", label: "Cash disponible", placeholder: "100000", suffix: "DT" },
      { id: "revenue", label: "Revenus mensuels", placeholder: "20000", suffix: "DT" },
      { id: "expenses", label: "Dépenses mensuelles", placeholder: "35000", suffix: "DT" }
    ],
    calculate: (v) => v.cash / (v.expenses - v.revenue),
    format: (v) => v > 0 ? `${v.toFixed(1)} mois` : "Positif !",
    interpretation: (v, bm) => {
      if (v < 0) return "Bravo ! Vous êtes rentable, pas besoin de runway.";
      if (v >= 18) return "Excellent runway, vous avez le temps de croître.";
      if (v >= 12) return "Correct, mais anticipez votre prochaine levée.";
      if (v >= 6) return "Attention : commencez à lever maintenant !";
      return "Critique : vous avez moins de 6 mois de cash.";
    },
    benchmarks: {
      saas: { good: "> 18 mois", warning: "12-18 mois", bad: "< 12 mois" },
      marketplace: { good: "> 18 mois", warning: "12-18 mois", bad: "< 12 mois" },
      circular: { good: "> 24 mois", warning: "12-24 mois", bad: "< 12 mois" },
      "product-service": { good: "> 18 mois", warning: "12-18 mois", bad: "< 12 mois" },
      freemium: { good: "> 18 mois", warning: "12-18 mois", bad: "< 12 mois" },
      impact: { good: "> 24 mois", warning: "18-24 mois", bad: "< 18 mois" }
    }
  },
  {
    id: "nrr",
    name: "Net Revenue Retention",
    formula: "(MRR fin - Churn + Expansion) ÷ MRR début × 100",
    inputs: [
      { id: "mrrStart", label: "MRR début de période", placeholder: "50000", suffix: "DT" },
      { id: "churn", label: "MRR churné", placeholder: "3000", suffix: "DT" },
      { id: "expansion", label: "Expansion MRR", placeholder: "8000", suffix: "DT" }
    ],
    calculate: (v) => ((v.mrrStart - v.churn + v.expansion) / v.mrrStart) * 100,
    format: (v) => `${v.toFixed(1)}%`,
    interpretation: (v, bm) => {
      if (v >= 120) return "Excellent ! Forte expansion sur base existante.";
      if (v >= 100) return "Bon : vous maintenez et grandissez votre base.";
      if (v >= 90) return "Attention : légère contraction du MRR.";
      return "Critique : vous perdez des revenus rapidement.";
    },
    benchmarks: {
      saas: { good: "> 120%", warning: "100-120%", bad: "< 100%" },
      marketplace: { good: "> 110%", warning: "100-110%", bad: "< 100%" },
      circular: { good: "> 105%", warning: "95-105%", bad: "< 95%" },
      "product-service": { good: "> 115%", warning: "100-115%", bad: "< 100%" },
      freemium: { good: "> 110%", warning: "100-110%", bad: "< 100%" },
      impact: { good: "> 105%", warning: "95-105%", bad: "< 95%" }
    }
  },
  {
    id: "sroi",
    name: "Social Return on Investment",
    formula: "(Valeur sociale créée) ÷ Investissement",
    inputs: [
      { id: "socialValue", label: "Valeur sociale créée", placeholder: "500000", suffix: "DT" },
      { id: "investment", label: "Investissement total", placeholder: "100000", suffix: "DT" }
    ],
    calculate: (v) => v.socialValue / v.investment,
    format: (v) => `${v.toFixed(2)}:1`,
    interpretation: (v, bm) => {
      if (v >= 4) return "Impact exceptionnel ! Chaque DT génère " + v.toFixed(1) + " DT de valeur sociale.";
      if (v >= 2) return "Bon niveau d'impact social par rapport à l'investissement.";
      if (v >= 1) return "Impact positif mais améliorable.";
      return "Réfléchissez à maximiser votre impact social.";
    },
    benchmarks: {
      saas: { good: "> 2:1", warning: "1-2:1", bad: "< 1:1" },
      marketplace: { good: "> 2:1", warning: "1-2:1", bad: "< 1:1" },
      circular: { good: "> 4:1", warning: "2-4:1", bad: "< 2:1" },
      "product-service": { good: "> 3:1", warning: "1.5-3:1", bad: "< 1.5:1" },
      freemium: { good: "> 2:1", warning: "1-2:1", bad: "< 1:1" },
      impact: { good: "> 5:1", warning: "3-5:1", bad: "< 3:1" }
    }
  }
];

export const AdvancedMetricsCalculator = () => {
  const [selectedBM, setSelectedBM] = useState("saas");
  const [selectedMetric, setSelectedMetric] = useState("ltv-cac");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const currentBM = bmTypes.find(bm => bm.id === selectedBM)!;
  const currentMetric = metricsCalculations.find(m => m.id === selectedMetric)!;

  const handleInputChange = (inputId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [inputId]: value }));
    setResult(null);
  };

  const handleCalculate = () => {
    const numericValues: Record<string, number> = {};
    for (const input of currentMetric.inputs) {
      const value = parseFloat(inputValues[input.id] || "0");
      if (isNaN(value)) {
        alert(`Veuillez entrer une valeur valide pour ${input.label}`);
        return;
      }
      numericValues[input.id] = value;
    }
    const calculatedResult = currentMetric.calculate(numericValues);
    setResult(calculatedResult);
    setShowRecommendations(true);
  };

  const getResultStatus = (value: number, metric: MetricCalculation, bmId: string): "good" | "warning" | "bad" => {
    const benchmarks = metric.benchmarks[bmId];
    // Simple heuristic based on the interpretation
    const interpretation = metric.interpretation(value, bmId);
    if (interpretation.toLowerCase().includes("excellent") || interpretation.toLowerCase().includes("bravo")) return "good";
    if (interpretation.toLowerCase().includes("attention") || interpretation.toLowerCase().includes("correct")) return "warning";
    if (interpretation.toLowerCase().includes("critique") || interpretation.toLowerCase().includes("négatif")) return "bad";
    return "warning";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20">
          <Calculator className="h-4 w-4" />
          Calculateur Avancé
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Métriques × Business Model
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculez vos métriques de croissance avec des benchmarks adaptés à votre type de modèle d'affaires
        </p>
      </div>

      {/* Business Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            1. Sélectionnez votre Business Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bmTypes.map((bm) => {
              const Icon = bm.icon;
              return (
                <motion.div
                  key={bm.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedBM === bm.id 
                        ? "ring-2 ring-primary shadow-lg" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedBM(bm.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${bm.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{bm.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{bm.description}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {bm.source}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected BM Key Metrics */}
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium mb-2">Métriques clés pour {currentBM.name} :</p>
            <div className="flex flex-wrap gap-2">
              {currentBM.keyMetrics.map((metric) => (
                <Badge key={metric} variant="secondary">{metric}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-accent" />
            2. Choisissez la métrique à calculer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une métrique" />
            </SelectTrigger>
            <SelectContent>
              {metricsCalculations.map((metric) => (
                <SelectItem key={metric.id} value={metric.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.name}</span>
                    <span className="text-xs text-muted-foreground">({metric.formula})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Formula Display */}
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">Formule :</p>
            <code className="text-lg font-mono">{currentMetric.formula}</code>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-emerald-500" />
            3. Entrez vos valeurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {currentMetric.inputs.map((input) => (
              <div key={input.id} className="space-y-2">
                <Label htmlFor={input.id}>{input.label}</Label>
                <div className="relative">
                  <Input
                    id={input.id}
                    type="number"
                    placeholder={input.placeholder}
                    value={inputValues[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className="pr-12"
                  />
                  {input.suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {input.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full mt-6" 
            size="lg"
            onClick={handleCalculate}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculer
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border-2 ${
            getResultStatus(result, currentMetric, selectedBM) === "good" ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" :
            getResultStatus(result, currentMetric, selectedBM) === "warning" ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20" :
            "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20"
          }`}>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">{currentMetric.name}</p>
                <div className={`text-5xl font-bold ${
                  getResultStatus(result, currentMetric, selectedBM) === "good" ? "text-emerald-600" :
                  getResultStatus(result, currentMetric, selectedBM) === "warning" ? "text-amber-600" :
                  "text-rose-600"
                }`}>
                  {currentMetric.format(result)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background/50 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Interprétation</p>
                    <p className="text-sm text-muted-foreground">
                      {currentMetric.interpretation(result, selectedBM)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benchmarks */}
              <Collapsible open={showRecommendations} onOpenChange={setShowRecommendations}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Info className="h-4 w-4 mr-2" />
                    Voir les benchmarks pour {currentBM.name}
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showRecommendations ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <p className="text-xs text-emerald-600 font-medium mb-1">Bon</p>
                      <p className="text-sm font-bold text-emerald-700">{currentMetric.benchmarks[selectedBM].good}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                      <p className="text-xs text-amber-600 font-medium mb-1">Attention</p>
                      <p className="text-sm font-bold text-amber-700">{currentMetric.benchmarks[selectedBM].warning}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                      <p className="text-xs text-rose-600 font-medium mb-1">Critique</p>
                      <p className="text-sm font-bold text-rose-700">{currentMetric.benchmarks[selectedBM].bad}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedMetricsCalculator;
