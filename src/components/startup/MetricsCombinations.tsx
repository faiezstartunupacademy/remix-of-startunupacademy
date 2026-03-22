import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Layers,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  DollarSign,
  Users,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flame,
  Clock,
  Activity,
  PieChart,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { growthMetrics } from "@/data/growthMetricsData";

interface MetricCombination {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  formula: string;
  interpretation: string;
  useCase: string;
  stage: string;
  importance: 'critical' | 'high' | 'medium';
  icon: React.ReactNode;
  source: string;
  category: 'unit-economics' | 'growth' | 'engagement' | 'financial' | 'sales';
}

// Extended combinations based on 86 metrics with academic/institutional sources
const combinations: MetricCombination[] = [
  // ==========================================
  // UNIT ECONOMICS FUNDAMENTALS
  // ==========================================
  {
    id: "ltv-cac",
    name: "LTV / CAC Ratio",
    description: "Le ratio fondamental de la rentabilité client",
    metrics: ["LTV", "CAC"],
    formula: "LTV / CAC",
    interpretation: "Mesure combien de valeur un client génère par rapport à son coût d'acquisition. > 3 = sain, > 5 = excellent.",
    useCase: "Décision d'investissement marketing, validation du modèle économique",
    stage: "Growth / Scale",
    importance: "critical",
    icon: <DollarSign className="h-5 w-5" />,
    source: "Y Combinator",
    category: "unit-economics"
  },
  {
    id: "cac-payback",
    name: "CAC Payback Period",
    description: "Temps de récupération de l'investissement client",
    metrics: ["CAC", "MRR", "GPM"],
    formula: "CAC / (MRR × Gross Margin)",
    interpretation: "< 12 mois = bon, 12-18 mois = acceptable, > 18 mois = préoccupant",
    useCase: "Gestion du cash flow, décision pricing",
    stage: "MVP / Growth",
    importance: "high",
    icon: <Clock className="h-5 w-5" />,
    source: "Bessemer Venture Partners",
    category: "unit-economics"
  },
  {
    id: "unit-economics-complete",
    name: "Unit Economics Complet",
    description: "Vue d'ensemble de la rentabilité par client",
    metrics: ["LTV", "CAC", "ARPU", "CHR", "GPM"],
    formula: "LTV = (ARPU × GPM) / CHR, puis LTV - CAC",
    interpretation: "Le profit net par client. Doit être significativement positif pour la viabilité.",
    useCase: "Pitch investisseurs, planification financière",
    stage: "Growth / Scale",
    importance: "critical",
    icon: <PieChart className="h-5 w-5" />,
    source: "Stanford GSB",
    category: "unit-economics"
  },
  {
    id: "throughput",
    name: "Throughput (LTV - CAC)",
    description: "Valeur nette générée par client",
    metrics: ["LTV", "CAC"],
    formula: "LTV - CAC",
    interpretation: "Le profit brut par client. Plus c'est élevé, plus tu peux investir en croissance.",
    useCase: "Calcul de marge, décision d'expansion",
    stage: "Growth",
    importance: "high",
    icon: <TrendingUp className="h-5 w-5" />,
    source: "500 Startups",
    category: "unit-economics"
  },

  // ==========================================
  // GROWTH METRICS
  // ==========================================
  {
    id: "magic-number",
    name: "Magic Number",
    description: "Efficacité des dépenses sales & marketing",
    metrics: ["ARR", "MRR"],
    formula: "(New ARR Qn - New ARR Qn-1) / S&M Spend Qn-1",
    interpretation: "< 0.5 = inefficient, 0.5-0.75 = ok, > 0.75 = efficient, > 1 = très efficient",
    useCase: "Décision d'augmentation du budget marketing",
    stage: "Growth",
    importance: "high",
    icon: <Zap className="h-5 w-5" />,
    source: "Bessemer Venture Partners",
    category: "growth"
  },
  {
    id: "rule-of-40",
    name: "Rule of 40",
    description: "Balance croissance vs profitabilité",
    metrics: ["GR", "EBITDA"],
    formula: "Revenue Growth % + Profit Margin %",
    interpretation: "> 40% = entreprise saine. Permet de justifier des pertes si croissance forte.",
    useCase: "Évaluation santé globale SaaS, préparation levée de fonds",
    stage: "Scale",
    importance: "critical",
    icon: <Target className="h-5 w-5" />,
    source: "Bessemer Venture Partners",
    category: "growth"
  },
  {
    id: "quick-ratio",
    name: "Quick Ratio (SaaS)",
    description: "Vélocité de croissance nette du MRR",
    metrics: ["MRR"],
    formula: "(New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)",
    interpretation: "> 4 = excellent, 2-4 = bon, 1-2 = attention, < 1 = déclin",
    useCase: "Suivi de la dynamique de croissance",
    stage: "Growth / Scale",
    importance: "high",
    icon: <BarChart3 className="h-5 w-5" />,
    source: "Social Capital",
    category: "growth"
  },
  {
    id: "nrr-expansion",
    name: "Net Revenue Retention",
    description: "Croissance via base client existante",
    metrics: ["MRR", "NRR"],
    formula: "(Start MRR + Expansion - Contraction - Churn) / Start MRR × 100",
    interpretation: "> 100% = croissance sans acquisition. Best-in-class > 130%",
    useCase: "Validation du product-market fit, stratégie upsell",
    stage: "Growth / Scale",
    importance: "critical",
    icon: <TrendingUp className="h-5 w-5" />,
    source: "SaaS Capital",
    category: "growth"
  },
  {
    id: "viral-loop",
    name: "Viral Loop Efficiency",
    description: "Efficacité de la croissance virale",
    metrics: ["VCF", "ICT"],
    formula: "Viral Coefficient × Invite Conversion Rate",
    interpretation: "K > 1 = croissance virale exponentielle. Rare mais transformateur.",
    useCase: "Optimisation du système de parrainage",
    stage: "Growth",
    importance: "high",
    icon: <RefreshCw className="h-5 w-5" />,
    source: "Y Combinator",
    category: "growth"
  },
  {
    id: "t2d",
    name: "Time to Double",
    description: "Rapidité de doublement de ta métrique clé",
    metrics: ["GR", "CMGR"],
    formula: "70 / Taux de croissance mensuel",
    interpretation: "< 12 mois = très forte croissance, 12-24 = bonne, > 24 = lente",
    useCase: "Communication avec investisseurs",
    stage: "Growth",
    importance: "medium",
    icon: <Clock className="h-5 w-5" />,
    source: "Paul Graham",
    category: "growth"
  },

  // ==========================================
  // ENGAGEMENT & RETENTION
  // ==========================================
  {
    id: "dau-mau",
    name: "DAU/MAU Ratio (Stickiness)",
    description: "Mesure l'adhérence quotidienne du produit",
    metrics: ["DAU", "MAU"],
    formula: "DAU / MAU × 100",
    interpretation: "> 50% = très sticky (ex: Slack). 20-50% = bon. < 20% = à améliorer",
    useCase: "Évaluation de l'engagement produit",
    stage: "MVP / Growth",
    importance: "high",
    icon: <Users className="h-5 w-5" />,
    source: "Facebook/Meta",
    category: "engagement"
  },
  {
    id: "activation-retention",
    name: "Activation → Retention Chain",
    description: "Corrélation activation et rétention long terme",
    metrics: ["ACT", "D1R", "D7R", "D30R"],
    formula: "Activation Rate × D7 Retention × D30 Retention",
    interpretation: "Identifie les goulots d'étranglement dans le funnel de rétention",
    useCase: "Optimisation onboarding, identification 'Aha moment'",
    stage: "MVP / Growth",
    importance: "high",
    icon: <Activity className="h-5 w-5" />,
    source: "Amplitude",
    category: "engagement"
  },
  {
    id: "retention-curve",
    name: "Retention Curve Analysis",
    description: "Analyse de la courbe de rétention par cohorte",
    metrics: ["D1R", "D7R", "D30R", "RBC"],
    formula: "Analyse comparative D1 → D7 → D30 → D90",
    interpretation: "Courbe qui se stabilise = bon PMF. Courbe qui continue à chuter = problème.",
    useCase: "Validation du Product-Market Fit",
    stage: "MVP / Growth",
    importance: "critical",
    icon: <BarChart3 className="h-5 w-5" />,
    source: "Y Combinator",
    category: "engagement"
  },
  {
    id: "pmf-score",
    name: "Product-Market Fit Score",
    description: "Le test ultime du PMF de Sean Ellis",
    metrics: ["PMF", "NPS", "RET"],
    formula: "% utilisateurs 'très déçus' si produit disparaît",
    interpretation: "> 40% = PMF atteint. C'est le seuil magique avant d'investir en growth.",
    useCase: "Go/No-Go decision pour scaling",
    stage: "MVP",
    importance: "critical",
    icon: <Target className="h-5 w-5" />,
    source: "Sean Ellis",
    category: "engagement"
  },
  {
    id: "engagement-score",
    name: "Product Engagement Score",
    description: "Score global de santé de l'engagement",
    metrics: ["ACT", "STK", "SPU", "FUS"],
    formula: "(Adoption + Stickiness + Growth) / 3",
    interpretation: "> 70 = excellent, 50-70 = bon, < 50 = à améliorer",
    useCase: "Dashboard exécutif, OKRs produit",
    stage: "Growth",
    importance: "medium",
    icon: <Zap className="h-5 w-5" />,
    source: "Gainsight",
    category: "engagement"
  },

  // ==========================================
  // FINANCIAL HEALTH
  // ==========================================
  {
    id: "burn-multiple",
    name: "Burn Multiple",
    description: "Efficacité du cash brûlé",
    metrics: ["BRN", "ARR"],
    formula: "Net Burn / Net New ARR",
    interpretation: "< 1 = excellent, 1-1.5 = bon, 1.5-2 = acceptable, > 2 = inefficient",
    useCase: "Gestion runway, préparation due diligence",
    stage: "Growth",
    importance: "critical",
    icon: <Flame className="h-5 w-5" />,
    source: "David Sacks",
    category: "financial"
  },
  {
    id: "default-alive",
    name: "Default Alive / Dead",
    description: "La startup va-t-elle survivre sans nouveau financement ?",
    metrics: ["RUN", "GR", "BRN"],
    formula: "Runway vs Mois pour atteindre rentabilité",
    interpretation: "Default Alive = tu atteins rentabilité avant fin du runway",
    useCase: "Décision stratégique de levée ou de pivot",
    stage: "Growth",
    importance: "critical",
    icon: <AlertTriangle className="h-5 w-5" />,
    source: "Paul Graham",
    category: "financial"
  },
  {
    id: "arr-per-employee",
    name: "ARR per Employee",
    description: "Productivité organisationnelle",
    metrics: ["ARR"],
    formula: "ARR / Total Employees",
    interpretation: "Benchmark: $100K-$200K early stage, $200K-$300K growth, > $300K scale",
    useCase: "Décision de recrutement, efficacité opérationnelle",
    stage: "Growth / Scale",
    importance: "medium",
    icon: <Users className="h-5 w-5" />,
    source: "Bessemer Venture Partners",
    category: "financial"
  },
  {
    id: "runway-analysis",
    name: "Runway Analysis",
    description: "Analyse complète de la piste de survie",
    metrics: ["RUN", "BRN", "GBR", "FCF"],
    formula: "Cash / Net Burn Rate",
    interpretation: "> 18 mois = confortable, 12-18 = acceptable, < 12 = urgent",
    useCase: "Planification de levée de fonds",
    stage: "All stages",
    importance: "critical",
    icon: <Clock className="h-5 w-5" />,
    source: "Y Combinator",
    category: "financial"
  },

  // ==========================================
  // SALES EFFICIENCY
  // ==========================================
  {
    id: "sales-velocity",
    name: "Sales Velocity",
    description: "Vitesse de génération de revenu",
    metrics: ["ACV", "CVR"],
    formula: "(Opportunities × Win Rate × ACV) / Sales Cycle Days",
    interpretation: "Revenue quotidien potentiel. Améliorer via chaque variable.",
    useCase: "Optimisation du pipeline commercial",
    stage: "Growth / Scale",
    importance: "high",
    icon: <Zap className="h-5 w-5" />,
    source: "Salesforce",
    category: "sales"
  },
  {
    id: "lead-velocity",
    name: "Lead Velocity Rate",
    description: "Croissance du pipeline de leads qualifiés",
    metrics: ["MQL", "SQL", "LCR"],
    formula: "(Leads Month - Leads Month-1) / Leads Month-1 × 100",
    interpretation: "Leading indicator de la croissance future. > Revenue Growth = sain",
    useCase: "Prédiction croissance, allocation budget marketing",
    stage: "Growth",
    importance: "medium",
    icon: <TrendingUp className="h-5 w-5" />,
    source: "HubSpot",
    category: "sales"
  },
  {
    id: "funnel-efficiency",
    name: "Funnel Conversion Efficiency",
    description: "Efficacité globale du funnel de conversion",
    metrics: ["MQL", "SQL", "CVR", "LCR"],
    formula: "MQL → SQL → Opportunity → Customer conversion rates",
    interpretation: "Identifie où tu perds le plus de prospects dans le funnel",
    useCase: "Optimisation marketing-ventes",
    stage: "Growth",
    importance: "high",
    icon: <BarChart3 className="h-5 w-5" />,
    source: "Gartner",
    category: "sales"
  }
];

const categoryFilters = [
  { id: "all", label: "Toutes", icon: Layers },
  { id: "unit-economics", label: "Unit Economics", icon: DollarSign },
  { id: "growth", label: "Croissance", icon: TrendingUp },
  { id: "engagement", label: "Engagement", icon: Activity },
  { id: "financial", label: "Finance", icon: PieChart },
  { id: "sales", label: "Ventes", icon: Target }
];

const MetricsCombinations = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCombination, setSelectedCombination] = useState<MetricCombination | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCombinations = combinations.filter(c => {
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.metrics.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const criticalCombinations = filteredCombinations.filter(c => c.importance === 'critical');
  const highCombinations = filteredCombinations.filter(c => c.importance === 'high');

  // Get full metric names
  const getMetricName = (code: string): string => {
    const metric = growthMetrics.find(m => m.code === code);
    return metric?.nameFr || code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Combinaisons de Métriques
                <Badge variant="secondary" className="ml-2">{combinations.length} combos</Badge>
              </h3>
              <p className="text-white/70">
                Les métriques isolées ne racontent qu'une partie de l'histoire. 
                Découvrez les combinaisons clés utilisées par Y Combinator, Harvard, et les meilleures startups 
                pour évaluer la santé et le potentiel de croissance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une combinaison ou métrique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map(cat => {
            const Icon = cat.icon;
            return (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {cat.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Tabs by importance */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">Toutes ({filteredCombinations.length})</TabsTrigger>
          <TabsTrigger value="critical">Critiques ({criticalCombinations.length})</TabsTrigger>
          <TabsTrigger value="high">Importantes ({highCombinations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCombinations.map((combo, index) => (
              <CombinationCard 
                key={combo.id} 
                combination={combo} 
                index={index}
                onSelect={setSelectedCombination}
                isSelected={selectedCombination?.id === combo.id}
                getMetricName={getMetricName}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalCombinations.map((combo, index) => (
              <CombinationCard 
                key={combo.id} 
                combination={combo} 
                index={index}
                onSelect={setSelectedCombination}
                isSelected={selectedCombination?.id === combo.id}
                getMetricName={getMetricName}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highCombinations.map((combo, index) => (
              <CombinationCard 
                key={combo.id} 
                combination={combo} 
                index={index}
                onSelect={setSelectedCombination}
                isSelected={selectedCombination?.id === combo.id}
                getMetricName={getMetricName}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected detail */}
      {selectedCombination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {selectedCombination.icon}
                  </div>
                  {selectedCombination.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedCombination.source}</Badge>
                  <Badge className={
                    selectedCombination.importance === 'critical' 
                      ? 'bg-destructive/10 text-destructive border-destructive/30'
                      : selectedCombination.importance === 'high'
                      ? 'bg-accent/10 text-accent-foreground border-accent/30'
                      : 'bg-primary/10 text-primary border-primary/30'
                  }>
                    {selectedCombination.importance === 'critical' ? '🔴 Critique' : 
                     selectedCombination.importance === 'high' ? '🟠 Important' : '🔵 Utile'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Formule</div>
                  <code className="block bg-background p-3 rounded-lg font-mono text-sm">
                    {selectedCombination.formula}
                  </code>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Métriques utilisées</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCombination.metrics.map(m => (
                      <Badge 
                        key={m} 
                        variant="secondary"
                        title={getMetricName(m)}
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Interprétation</div>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedCombination.interpretation}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Cas d'usage:</span>
                  <span>{selectedCombination.useCase}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Stage:</span>
                  <Badge variant="outline">{selectedCombination.stage}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Framework cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h4 className="font-semibold">Indicateurs de santé</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {"LTV/CAC > 3, NRR > 100%, Burn Multiple < 2, Rule of 40 > 40%, Quick Ratio > 4"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h4 className="font-semibold">Signaux d'alerte</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {"CAC Payback > 18 mois, Quick Ratio < 1, Churn > 5%/mois, PMF < 40%, Default Dead"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold">Best Practices</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Suivre les tendances MoM, comparer les cohortes, segmenter par canal et par segment client.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface CombinationCardProps {
  combination: MetricCombination;
  index: number;
  onSelect: (c: MetricCombination) => void;
  isSelected: boolean;
  getMetricName: (code: string) => string;
}

const CombinationCard = ({ combination, index, onSelect, isSelected, getMetricName }: CombinationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card 
        className={`h-full cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
        }`}
        onClick={() => onSelect(combination)}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {combination.icon}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant="outline"
                className={
                  combination.importance === 'critical' 
                    ? 'border-rose-500/30 text-rose-500'
                    : combination.importance === 'high'
                    ? 'border-amber-500/30 text-amber-500'
                    : 'border-blue-500/30 text-blue-500'
                }
              >
                {combination.stage}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{combination.source}</span>
            </div>
          </div>

          <h3 className="font-bold mb-2">{combination.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{combination.description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {combination.metrics.slice(0, 4).map(m => (
              <Badge 
                key={m} 
                variant="secondary" 
                className="text-[10px]"
                title={getMetricName(m)}
              >
                {m}
              </Badge>
            ))}
            {combination.metrics.length > 4 && (
              <Badge variant="secondary" className="text-[10px]">
                +{combination.metrics.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-primary">
            <span>Voir détails</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricsCombinations;
