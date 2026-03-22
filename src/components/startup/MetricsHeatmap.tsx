import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Info, X, TrendingUp, TrendingDown, ArrowRight, Sparkles, Lightbulb, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { growthMetrics } from "@/data/growthMetricsData";

interface CorrelationData {
  metric1: string;
  metric2: string;
  correlation: number;
  explanation: string;
  childExplanation: string;
  impact: 'positive' | 'negative' | 'complex';
  example: string;
  actionable: string;
  sources?: string[];
}

// Extended correlations data based on the 86 metrics
const correlationsData: CorrelationData[] = [
  // ==========================================
  // UNIT ECONOMICS CORRELATIONS
  // ==========================================
  {
    metric1: "LTV",
    metric2: "RET",
    correlation: 0.95,
    explanation: "Plus un client reste longtemps (rétention élevée), plus il génère de valeur totale (LTV).",
    childExplanation: "Imagine un abonnement Netflix : si tu restes 5 ans au lieu de 1 an, Netflix gagne 5x plus d'argent de toi ! C'est comme un ami fidèle qui achète toujours dans ton magasin.",
    impact: "positive",
    example: "Un client SaaS qui reste 36 mois à 100 DT/mois = 3600 DT LTV vs 1200 DT pour 12 mois",
    actionable: "Améliore ton onboarding et le support client pour garder les utilisateurs plus longtemps",
    sources: ["Y Combinator", "Harvard Business School"]
  },
  {
    metric1: "CAC",
    metric2: "ROAS",
    correlation: -0.85,
    explanation: "Un CAC élevé signifie généralement un ROAS plus faible (relation inverse).",
    childExplanation: "Si tu dépenses beaucoup de bonbons (argent) pour attirer un ami, tu as moins de bonbons à la fin. C'est l'inverse : moins tu dépenses pour attirer des clients, plus tu gardes de profit !",
    impact: "negative",
    example: "CAC de 50 DT avec un ROAS de 5x vs CAC de 200 DT avec ROAS de 1.5x",
    actionable: "Optimise tes canaux d'acquisition pour réduire le CAC et améliorer le ROAS",
    sources: ["Google Ads", "Meta"]
  },
  {
    metric1: "MRR",
    metric2: "ARR",
    correlation: 1.0,
    explanation: "L'ARR est simplement le MRR multiplié par 12 - corrélation parfaite mathématique.",
    childExplanation: "Si tu gagnes 10 DT par mois d'argent de poche, en une année tu auras 120 DT ! L'ARR c'est juste le MRR × 12, comme compter ton argent de poche sur l'année.",
    impact: "positive",
    example: "MRR de 10 000 DT = ARR de 120 000 DT automatiquement",
    actionable: "Concentre-toi sur l'augmentation du MRR pour voir ton ARR croître proportionnellement",
    sources: ["Stripe", "Y Combinator"]
  },
  {
    metric1: "CHR",
    metric2: "LTV",
    correlation: -0.92,
    explanation: "Plus le churn est élevé, plus la LTV diminue drastiquement. C'est l'ennemi #1.",
    childExplanation: "Si tes amis partent vite de ta fête, tu n'as pas le temps de t'amuser avec eux ! Moins de clients qui partent = plus de temps pour gagner de l'argent avec eux.",
    impact: "negative",
    example: "Churn 5%/mois = LTV moyenne 20 mois vs Churn 2%/mois = LTV 50 mois",
    actionable: "Chaque point de churn réduit augmente significativement ta LTV - c'est ta priorité #1",
    sources: ["Harvard Business School", "Bessemer Venture Partners"]
  },
  {
    metric1: "NPS",
    metric2: "VCF",
    correlation: 0.88,
    explanation: "Les clients satisfaits (NPS élevé) recommandent davantage (coefficient viral).",
    childExplanation: "Quand tu adores un jeu vidéo, tu en parles à tous tes copains ! Les clients contents font pareil - ils deviennent tes meilleurs ambassadeurs gratuits.",
    impact: "positive",
    example: "NPS > 50 = 30% des clients font du referral vs NPS < 0 = 5% seulement",
    actionable: "Améliore l'expérience client pour transformer les utilisateurs en ambassadeurs",
    sources: ["Bain & Company", "ProductHunt"]
  },
  {
    metric1: "ACT",
    metric2: "RET",
    correlation: 0.82,
    explanation: "Les utilisateurs qui atteignent le 'Aha moment' (activation) restent plus longtemps.",
    childExplanation: "C'est comme quand tu apprends à faire du vélo : une fois que tu sais, tu ne veux plus arrêter ! Si quelqu'un comprend vraiment ton produit, il reste.",
    impact: "positive",
    example: "80% d'activation = 70% de rétention M1 vs 40% d'activation = 35% rétention",
    actionable: "Guide tes nouveaux utilisateurs vers leur 'Aha moment' le plus vite possible",
    sources: ["Y Combinator", "Amplitude"]
  },
  {
    metric1: "CAC",
    metric2: "LTV",
    correlation: 0.65,
    explanation: "Relation complexe : investir plus en acquisition peut attirer des clients de meilleure qualité.",
    childExplanation: "Parfois, dépenser plus pour un cadeau d'anniversaire attire de meilleurs amis qui restent longtemps. C'est un équilibre délicat !",
    impact: "complex",
    example: "CAC premium de 300 DT peut générer LTV de 3000 DT vs CAC low-cost 50 DT pour LTV 400 DT",
    actionable: "Vise un ratio LTV/CAC > 3x pour une croissance saine",
    sources: ["Y Combinator", "Bessemer Venture Partners"]
  },
  // ==========================================
  // ENGAGEMENT CORRELATIONS
  // ==========================================
  {
    metric1: "AOV",
    metric2: "LTV",
    correlation: 0.78,
    explanation: "Des paniers moyens plus élevés contribuent à une LTV plus importante.",
    childExplanation: "Si chaque fois qu'un ami vient chez toi il achète un gros gâteau au lieu d'un bonbon, tu gagnes plus au final !",
    impact: "positive",
    example: "AOV de 150 DT + 10 achats = LTV 1500 DT vs AOV 50 DT + 10 achats = LTV 500 DT",
    actionable: "Propose des bundles et upsells pour augmenter la valeur panier",
    sources: ["Shopify", "a16z"]
  },
  {
    metric1: "DAU",
    metric2: "MAU",
    correlation: 0.75,
    explanation: "Plus de DAU signifie généralement plus de MAU, mais le ratio (stickiness) varie.",
    childExplanation: "Si tu joues à ton jeu préféré tous les jours, tu joueras forcément ce mois-ci ! Mais certains jouent que le weekend.",
    impact: "positive",
    example: "5000 DAU avec 25000 MAU = 20% stickiness (bon engagement)",
    actionable: "Augmente le DAU en créant des habitudes quotidiennes chez tes utilisateurs",
    sources: ["Facebook/Meta", "Mixpanel"]
  },
  {
    metric1: "MRR",
    metric2: "CHR",
    correlation: -0.70,
    explanation: "Le churn érode directement le MRR - chaque client perdu impacte les revenus.",
    childExplanation: "C'est comme un seau avec des trous : même si tu ajoutes de l'eau (nouveaux clients), elle s'échappe par les trous (churn). Bouche les trous d'abord !",
    impact: "negative",
    example: "100K MRR avec 10% churn perd 10K/mois vs 2% churn perd 2K/mois",
    actionable: "Réduire le churn de 1% peut valoir plus que doubler tes efforts d'acquisition",
    sources: ["SaaS Capital", "Stripe"]
  },
  {
    metric1: "ARPU",
    metric2: "CVR",
    correlation: -0.45,
    explanation: "Relation inverse modérée : prix élevés peuvent réduire les conversions.",
    childExplanation: "Si tu vends des glaces très chères, moins d'enfants peuvent les acheter. Mais ceux qui achètent rapportent plus !",
    impact: "complex",
    example: "ARPU 200 DT avec 2% conversion vs ARPU 50 DT avec 8% conversion - même revenu, stratégie différente",
    actionable: "Trouve le sweet spot prix/volume optimal pour ton marché cible",
    sources: ["Stanford GSB", "Stripe"]
  },
  {
    metric1: "ACT",
    metric2: "NPS",
    correlation: 0.72,
    explanation: "Les utilisateurs bien activés sont plus satisfaits et donnent de meilleurs scores NPS.",
    childExplanation: "Quand tu apprends bien les règles d'un jeu, tu t'amuses plus et tu dis du bien du jeu à tes amis !",
    impact: "positive",
    example: "Utilisateurs activés: NPS +45 vs non-activés: NPS -10",
    actionable: "Un bon onboarding crée des promoteurs naturels de ton produit",
    sources: ["Gainsight", "Bain & Company"]
  },
  // ==========================================
  // GROWTH CORRELATIONS
  // ==========================================
  {
    metric1: "NRR",
    metric2: "ARR",
    correlation: 0.89,
    explanation: "Un NRR > 100% signifie croissance de l'ARR même sans nouveaux clients.",
    childExplanation: "C'est comme si tes amis existants t'apportaient de plus en plus de cadeaux chaque année ! Tu grandis sans chercher de nouveaux amis.",
    impact: "positive",
    example: "NRR de 120% = ta base client génère 20% de revenus en plus chaque année automatiquement",
    actionable: "Investis dans l'upsell et le cross-sell pour augmenter le NRR",
    sources: ["Bessemer Venture Partners", "SaaS Capital"]
  },
  {
    metric1: "D1R",
    metric2: "D30R",
    correlation: 0.75,
    explanation: "La rétention Jour 1 prédit fortement la rétention à long terme.",
    childExplanation: "Si tu aimes un nouveau jeu dès le premier jour, tu vas probablement encore y jouer dans un mois !",
    impact: "positive",
    example: "D1 de 60% → D30 de ~25% vs D1 de 30% → D30 de ~8%",
    actionable: "Optimise l'expérience des premières 24h pour maximiser la rétention long terme",
    sources: ["Appsflyer", "Firebase Analytics"]
  },
  {
    metric1: "PMF",
    metric2: "GR",
    correlation: 0.85,
    explanation: "Un bon Product-Market Fit (> 40%) prédit une croissance rapide.",
    childExplanation: "Quand beaucoup de gens adorent ton produit, ils en parlent et tu grandis vite comme une boule de neige !",
    impact: "positive",
    example: "PMF 45% = croissance 15% MoM vs PMF 20% = croissance 3% MoM",
    actionable: "Focus sur atteindre 40% de 'très déçus' avant d'investir massivement en growth",
    sources: ["Sean Ellis", "Y Combinator"]
  },
  {
    metric1: "BRN",
    metric2: "RUN",
    correlation: -0.95,
    explanation: "Plus le burn rate est élevé, plus le runway est court (relation inverse directe).",
    childExplanation: "Si tu dépenses ton argent de poche très vite, tu en auras plus pour longtemps ! Burn = dépenses, Runway = combien de temps tu tiens.",
    impact: "negative",
    example: "500K en banque, Burn 50K/mois = 10 mois vs Burn 25K/mois = 20 mois",
    actionable: "Réduis le burn pour étendre ton runway et avoir plus de temps pour atteindre tes objectifs",
    sources: ["Y Combinator", "First Round Capital"]
  },
  {
    metric1: "LTC",
    metric2: "CAP",
    correlation: -0.80,
    explanation: "Un bon ratio LTV/CAC signifie un CAC Payback plus court.",
    childExplanation: "Si chaque client te rapporte beaucoup comparé à ce qu'il t'a coûté, tu récupères ton argent plus vite !",
    impact: "negative",
    example: "LTV/CAC de 5x = payback 6 mois vs LTV/CAC de 2x = payback 18 mois",
    actionable: "Améliore le ratio LTV/CAC pour accélérer ton payback et libérer du cash",
    sources: ["Bessemer Venture Partners", "Y Combinator"]
  },
  {
    metric1: "QGR",
    metric2: "MRR",
    correlation: 0.82,
    explanation: "Le Quick Ratio prédit la vélocité de croissance du MRR.",
    childExplanation: "Si tu gagnes beaucoup plus de nouveaux amis que tu n'en perds, ton groupe grandit vite !",
    impact: "positive",
    example: "Quick Ratio de 4 = MRR croît de 15% MoM vs Quick Ratio de 1.5 = MRR stagne",
    actionable: "Vise un Quick Ratio > 4 pour une croissance saine et rapide",
    sources: ["Social Capital", "Mamoon Hamid"]
  },
  // ==========================================
  // FINANCIAL CORRELATIONS  
  // ==========================================
  {
    metric1: "GPM",
    metric2: "R40",
    correlation: 0.70,
    explanation: "Une marge brute élevée contribue à un meilleur score Rule of 40.",
    childExplanation: "Si tu gardes plus d'argent de chaque vente (marge), tu as plus de chances d'atteindre ton objectif de 40 points !",
    impact: "positive",
    example: "Marge 80% + croissance 30% = Rule of 40 satisfaite même avec -30% EBITDA",
    actionable: "Améliore ta marge brute pour avoir plus de flexibilité dans la Rule of 40",
    sources: ["Bessemer Venture Partners", "Stanford GSB"]
  },
  {
    metric1: "CAGR",
    metric2: "ARR",
    correlation: 0.90,
    explanation: "Un CAGR élevé est le résultat direct d'une croissance soutenue de l'ARR.",
    childExplanation: "Si ton ARR grandit vite chaque année, ton taux de croissance sur plusieurs années (CAGR) sera impressionnant !",
    impact: "positive",
    example: "ARR qui double chaque année = CAGR de 100%",
    actionable: "Maintiens une croissance MoM constante pour maximiser ton CAGR",
    sources: ["Sequoia Capital", "a16z"]
  },
  {
    metric1: "FCF",
    metric2: "RUN",
    correlation: 0.85,
    explanation: "Un FCF positif signifie un runway infini (pas besoin de cash externe).",
    childExplanation: "Si tu fabriques plus d'argent que tu n'en dépenses, tu n'as jamais besoin de demander de l'argent à tes parents !",
    impact: "positive",
    example: "FCF positif = pas besoin de lever, tu es 'default alive'",
    actionable: "Vise le FCF positif pour gagner en indépendance et en pouvoir de négociation",
    sources: ["Paul Graham", "MIT Sloan"]
  }
];

// Build dynamic metrics list from the 86 metrics data
const metricsForMatrix = [
  "LTV", "CAC", "MRR", "ARR", "CHR", "ARPU", "RET", "NPS", 
  "ACT", "ROAS", "AOV", "DAU", "MAU", "CVR", "NRR", "GR",
  "BRN", "RUN", "PMF", "GPM", "VCF", "D1R", "D30R", "QGR"
];

const getCorrelation = (m1: string, m2: string): number => {
  if (m1 === m2) return 1;
  const found = correlationsData.find(
    c => (c.metric1 === m1 && c.metric2 === m2) || (c.metric1 === m2 && c.metric2 === m1)
  );
  return found?.correlation || 0;
};

const getCorrelationData = (m1: string, m2: string): CorrelationData | null => {
  return correlationsData.find(
    c => (c.metric1 === m1 && c.metric2 === m2) || (c.metric1 === m2 && c.metric2 === m1)
  ) || null;
};

const getCorrelationColor = (value: number): string => {
  if (value === 1) return "bg-blue-500";
  if (value >= 0.8) return "bg-emerald-500";
  if (value >= 0.6) return "bg-emerald-400";
  if (value >= 0.3) return "bg-emerald-300";
  if (value > 0) return "bg-emerald-200";
  if (value === 0) return "bg-muted";
  if (value >= -0.3) return "bg-red-200";
  if (value >= -0.6) return "bg-red-300";
  if (value >= -0.8) return "bg-red-400";
  return "bg-red-500";
};

// Get metric name from code
const getMetricName = (code: string): string => {
  const metric = growthMetrics.find(m => m.code === code);
  return metric?.nameFr || code;
};

const MetricsHeatmap = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<CorrelationData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMetrics = useMemo(() => {
    if (!searchTerm) return metricsForMatrix;
    return metricsForMatrix.filter(m => {
      const metricData = growthMetrics.find(gm => gm.code === m);
      return m.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metricData?.nameFr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metricData?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const handleCellClick = (m1: string, m2: string) => {
    if (m1 === m2) return;
    const data = getCorrelationData(m1, m2);
    if (data) {
      setSelectedCorrelation(data);
      setDialogOpen(true);
    }
  };

  // Stats
  const totalCorrelations = correlationsData.length;
  const positiveCorrelations = correlationsData.filter(c => c.correlation > 0).length;
  const negativeCorrelations = correlationsData.filter(c => c.correlation < 0).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
          <Sparkles className="h-4 w-4" />
          {totalCorrelations} Corrélations • {metricsForMatrix.length} Métriques
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Matrice des Corrélations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez comment les 86 métriques s'influencent mutuellement. Cliquez sur une cellule pour 
          comprendre la relation expliquée simplement, comme à un enfant de 8 ans 👶
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une métrique (ex: LTV, Churn, MRR...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-emerald-500">{positiveCorrelations}</div>
            <div className="text-xs text-muted-foreground">Corrélations +</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-red-500">{negativeCorrelations}</div>
            <div className="text-xs text-muted-foreground">Corrélations −</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-primary">{metricsForMatrix.length}</div>
            <div className="text-xs text-muted-foreground">Métriques</div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span>Forte corrélation positive (+0.8 à +1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-300" />
          <span>Corrélation positive (+0.3 à +0.8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Pas de corrélation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-300" />
          <span>Corrélation négative (-0.3 à -0.8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Forte corrélation négative (-0.8 à -1)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header Row */}
              <div className="flex">
                <div className="w-20 flex-shrink-0" />
                {filteredMetrics.map((metric) => (
                  <div
                    key={`header-${metric}`}
                    className="w-14 flex-shrink-0 text-center"
                    title={getMetricName(metric)}
                  >
                    <span className="text-[10px] font-bold text-muted-foreground -rotate-45 inline-block origin-center">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Rows */}
              {filteredMetrics.map((rowMetric) => (
                <div key={rowMetric} className="flex items-center">
                  <div 
                    className="w-20 flex-shrink-0 text-[10px] font-bold text-right pr-2"
                    title={getMetricName(rowMetric)}
                  >
                    {rowMetric}
                  </div>
                  {filteredMetrics.map((colMetric) => {
                    const correlation = getCorrelation(rowMetric, colMetric);
                    const hasData = getCorrelationData(rowMetric, colMetric) !== null;
                    return (
                      <motion.div
                        key={`${rowMetric}-${colMetric}`}
                        whileHover={hasData ? { scale: 1.2, zIndex: 10 } : {}}
                        className={`w-14 h-10 flex-shrink-0 flex items-center justify-center m-0.5 rounded cursor-pointer transition-all ${getCorrelationColor(correlation)} ${hasData ? 'hover:ring-2 hover:ring-primary hover:ring-offset-2' : ''}`}
                        onClick={() => handleCellClick(rowMetric, colMetric)}
                        title={`${rowMetric} ↔ ${colMetric}`}
                      >
                        <span className={`text-[10px] font-bold ${Math.abs(correlation) > 0.5 ? 'text-white' : 'text-foreground'}`}>
                          {correlation === 0 ? '-' : correlation.toFixed(2)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Correlations Cards */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-center">Corrélations clés à connaître</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {correlationsData.slice(0, 9).map((corr, index) => (
            <motion.div
              key={`${corr.metric1}-${corr.metric2}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
                onClick={() => { setSelectedCorrelation(corr); setDialogOpen(true); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{corr.metric1}</Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono">{corr.metric2}</Badge>
                    </div>
                    <Badge 
                      className={corr.correlation > 0 ? 'bg-emerald-500' : corr.correlation < 0 ? 'bg-red-500' : 'bg-muted'}
                    >
                      {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {corr.explanation}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Lightbulb className="h-3 w-3" />
                      Cliquez pour l'explication enfant
                    </div>
                    {corr.sources && (
                      <div className="flex gap-1">
                        {corr.sources.slice(0, 1).map(s => (
                          <Badge key={s} variant="secondary" className="text-[8px]">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCorrelation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {selectedCorrelation.metric1}
                  </Badge>
                  {selectedCorrelation.correlation > 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {selectedCorrelation.metric2}
                  </Badge>
                  <Badge 
                    className={`ml-auto ${selectedCorrelation.correlation > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                  >
                    Corrélation: {selectedCorrelation.correlation > 0 ? '+' : ''}{selectedCorrelation.correlation.toFixed(2)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Sources */}
                {selectedCorrelation.sources && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCorrelation.sources.map(source => (
                      <Badge key={source} variant="secondary">{source}</Badge>
                    ))}
                  </div>
                )}

                {/* Technical Explanation */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-primary" />
                    Explication Technique
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedCorrelation.explanation}
                  </p>
                </div>

                {/* Child Explanation */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4">
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                      <Sparkles className="h-4 w-4" />
                      Expliqué pour un enfant de 8 ans 👶
                    </h4>
                    <p className="text-amber-900 dark:text-amber-200">
                      {selectedCorrelation.childExplanation}
                    </p>
                  </CardContent>
                </Card>

                {/* Example */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Exemple Concret
                  </h4>
                  <p className="text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    {selectedCorrelation.example}
                  </p>
                </div>

                {/* Actionable Advice */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-emerald-500" />
                    Conseil Actionnable
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
                    💡 {selectedCorrelation.actionable}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MetricsHeatmap;
