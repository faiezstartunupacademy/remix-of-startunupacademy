import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Award,
  Radar,
  GraduationCap,
  Building2,
  Rocket,
  Factory
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

// Vanity vs Actionable metrics data
const vanityVsActionableData = [
  { month: 'Jan', vanity: 500, actionable: 50 },
  { month: 'Fév', vanity: 1200, actionable: 80 },
  { month: 'Mar', vanity: 1900, actionable: 120 },
  { month: 'Avr', vanity: 2800, actionable: 150 },
  { month: 'Mai', vanity: 4500, actionable: 180 },
  { month: 'Juin', vanity: 6200, actionable: 210 },
];

// Radar chart data for balanced KPIs
const radarData = [
  { subject: 'MRR', value: 85, fullMark: 100 },
  { subject: 'CAC', value: 70, fullMark: 100 },
  { subject: 'LTV', value: 90, fullMark: 100 },
  { subject: 'Churn', value: 75, fullMark: 100 },
  { subject: 'NPS', value: 60, fullMark: 100 },
];

// Metrics by department
const metricsByDepartment = [
  { department: 'Marketing', count: 45 },
  { department: 'Produit', count: 38 },
  { department: 'Ventes', count: 32 },
  { department: 'Finance', count: 25 },
  { department: 'Support', count: 20 },
];

// Comparison table data
const comparisonData = [
  {
    characteristic: "Objectif",
    metric: "Suivre une activité",
    kpi: "Évaluer la performance"
  },
  {
    characteristic: "Portée",
    metric: "Large et variée",
    kpi: "Ciblée et spécifique"
  },
  {
    characteristic: "Lien Stratégique",
    metric: "Peut être faible ou inexistant",
    kpi: "Directement lié à un objectif clé"
  },
  {
    characteristic: "Exemple",
    metric: "Visiteurs uniques du site",
    kpi: "Taux de conversion des visiteurs"
  }
];

// 4 Steps to choose KPIs
const kpiSteps = [
  {
    step: 1,
    title: "Définir les Objectifs Stratégiques",
    description: "Que voulez-vous accomplir ?",
    example: "Ex: Atteindre la rentabilité",
    color: "text-cyan-500"
  },
  {
    step: 2,
    title: "Identifier les Facteurs de Succès",
    description: "Qu'est-ce qui est critique pour y arriver ?",
    example: "Ex: Acquérir et retenir des clients",
    color: "text-pink-500"
  },
  {
    step: 3,
    title: "Sélectionner les Métriques Pertinentes",
    description: "Comment mesurer ces facteurs ?",
    example: "Ex: MRR, Churn, CAC",
    color: "text-purple-500"
  },
  {
    step: 4,
    title: "Élever en KPI et Fixer une Cible",
    description: "Quel est l'objectif à atteindre ?",
    example: "Ex: Atteindre 5% de churn mensuel",
    color: "text-amber-500"
  }
];

// KPIs by startup stage
const kpisByStage = [
  {
    stage: "Pre-Seed",
    focus: "Validation",
    kpis: ["Problem-Solution Fit", "Early Adopters", "Engagement Rate", "Activation Rate"],
    schools: ["Lean Startup (Eric Ries)", "Customer Development (Steve Blank)"],
    color: "bg-purple-500"
  },
  {
    stage: "Seed",
    focus: "Traction",
    kpis: ["MRR", "CAC", "Activation Rate", "Week 1 Retention", "NPS"],
    schools: ["Y Combinator", "Techstars", "500 Startups"],
    color: "bg-blue-500"
  },
  {
    stage: "Series A",
    focus: "Growth",
    kpis: ["MRR Growth Rate", "LTV/CAC Ratio", "Net Revenue Retention", "Sales Efficiency"],
    schools: ["a16z", "Sequoia", "SaaS Capital"],
    color: "bg-emerald-500"
  },
  {
    stage: "Series B+",
    focus: "Scale",
    kpis: ["ARR", "Gross Margin", "Rule of 40", "Magic Number", "Burn Multiple"],
    schools: ["Bessemer Cloud", "OpenView Partners"],
    color: "bg-amber-500"
  }
];

// KPIs by startup nature
const kpisByNature = [
  {
    type: "SaaS B2B",
    icon: Building2,
    primaryKpis: ["MRR", "Net Dollar Retention", "CAC Payback"],
    benchmark: "LTV/CAC > 3x, NDR > 100%",
    reference: "SaaS Capital, ChartMogul"
  },
  {
    type: "Marketplace",
    icon: Factory,
    primaryKpis: ["GMV", "Take Rate", "Liquidity Score"],
    benchmark: "Take Rate 10-20%, GMV growth > 30%",
    reference: "a16z Marketplace Guide"
  },
  {
    type: "Consumer App",
    icon: Rocket,
    primaryKpis: ["DAU/MAU", "D7 Retention", "Viral Coefficient"],
    benchmark: "Stickiness > 25%, D7 > 40%",
    reference: "Facebook Growth Team, Sequoia"
  }
];

// Academic references
const academicReferences = [
  {
    source: "Y Combinator",
    insight: "Focus on one metric that matters (North Star)",
    metrics: ["Weekly Growth Rate", "Retention", "Revenue"]
  },
  {
    source: "Lean Analytics (Alistair Croll)",
    insight: "OMTM - One Metric That Matters par stage",
    metrics: ["Empathy → Stickiness → Virality → Revenue → Scale"]
  },
  {
    source: "Pirate Metrics (Dave McClure)",
    insight: "AARRR Framework pour structurer l'analyse",
    metrics: ["Acquisition", "Activation", "Retention", "Referral", "Revenue"]
  },
  {
    source: "SaaStr (Jason Lemkin)",
    insight: "Triple-Triple-Double-Double-Double growth pattern",
    metrics: ["ARR Growth", "Net Retention", "Sales Efficiency"]
  }
];

const KPIsVsMetrics = () => {
  const [activeSection, setActiveSection] = useState("fundamentals");

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-1">
          Cours Premium - $10,000 Value
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          KPIs <span className="text-pink-500">VS</span> Métriques
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pilotez votre Startup vers le Succès avec les bons indicateurs
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5">
          <TabsTrigger value="fundamentals">Fondamentaux</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="vanity">Vanity Trap</TabsTrigger>
          <TabsTrigger value="stages">Par Phase</TabsTrigger>
          <TabsTrigger value="references">Références</TabsTrigger>
        </TabsList>

        {/* Fundamentals Tab */}
        <TabsContent value="fundamentals" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* What is a Metric */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <BarChart3 className="h-5 w-5" />
                    Qu'est-ce qu'une Métrique ?
                  </CardTitle>
                  <Badge variant="outline" className="w-fit border-cyan-500 text-cyan-400">
                    L'Océan de Données
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80">
                    Les métriques sont toutes les données quantifiables que vous pouvez suivre. 
                    Elles vous donnent une vision d'ensemble de vos activités sur différents fronts. 
                    Il en existe des centaines, des visiteurs du site web au nombre de tickets de support.
                  </p>
                  
                  {/* Bar chart visualization */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metricsByDepartment} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="department" type="category" stroke="#888" width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-white/50 text-center">
                    Nombre de métriques potentielles par département
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* What is a KPI */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-400">
                    <Target className="h-5 w-5" />
                    Qu'est-ce qu'un KPI ?
                  </CardTitle>
                  <Badge variant="outline" className="w-fit border-pink-500 text-pink-400">
                    Le Focus Stratégique
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80">
                    Un KPI est une métrique choisie pour sa capacité à mesurer la performance par rapport 
                    à un objectif crucial. Il répond à la question : "Atteignons-nous notre objectif le plus important ?". 
                    Pour une startup SaaS, le Revenu Mensuel Récurrent (MRR) est souvent le KPI roi.
                  </p>
                  
                  {/* KPI Example Card */}
                  <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-pink-300 mb-2">EXEMPLE DE KPI : MRR</p>
                      <p className="text-4xl font-bold text-white">42 500 €</p>
                      <p className="text-sm text-white/60 mt-2">Revenu Mensuel Récurrent</p>
                      <p className="text-xs text-white/40 mt-4">
                        Ce chiffre unique informe instantanément sur la santé financière et la croissance de l'entreprise
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Venn Diagram Concept */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 p-8">
            <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">La Différence Fondamentale</h3>
                <p className="text-white/80 max-w-lg">
                  Dans l'univers des startups, les termes "métrique" et "KPI" sont souvent utilisés de manière 
                  interchangeable, mais ils désignent des concepts distincts. Comprendre cette différence est 
                  crucial pour se concentrer sur ce qui compte vraiment.
                </p>
              </div>
              <div className="relative w-64 h-64">
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-cyan-500/30 border-2 border-cyan-500 flex items-center justify-center">
                  <span className="text-cyan-300 font-bold">Métriques</span>
                </div>
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-pink-500/30 border-2 border-pink-500 flex items-center justify-center">
                  <span className="text-pink-300 font-bold">KPIs</span>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500/50 rounded-full w-16 h-16 flex items-center justify-center border-2 border-purple-400">
                  <span className="text-xs text-white text-center">KPIs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-8">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardHeader>
              <CardTitle>Tableau Récapitulatif</CardTitle>
              <p className="text-white/60">Les différences clés entre les métriques et les KPIs en un coup d'œil.</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 text-white/80">Caractéristique</th>
                      <th className="text-left py-4 px-4 text-cyan-400">Métrique</th>
                      <th className="text-left py-4 px-4 text-pink-400">KPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-4 px-4 font-medium text-white/90">{row.characteristic}</td>
                        <td className="py-4 px-4 text-white/70">{row.metric}</td>
                        <td className="py-4 px-4 text-white/70">{row.kpi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 4 Steps Process */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center">Comment Choisir ses KPIs en 4 Étapes</h3>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Le choix des bons KPIs est un processus stratégique. Il ne s'agit pas de piocher des métriques 
              au hasard, mais de les aligner sur vos objectifs commerciaux fondamentaux.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {kpiSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      <div className={`text-5xl font-bold ${step.color} mb-4`}>{step.step}</div>
                      <h4 className="font-bold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <Badge variant="outline" className="text-xs">{step.example}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Vanity Trap Tab */}
        <TabsContent value="vanity" className="space-y-8">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Le Piège des "Vanity Metrics"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80">
                Certaines métriques, comme le nombre total d'inscriptions, sont flatteuses mais peuvent être trompeuses. 
                Elles augmentent constamment sans forcément refléter l'engagement réel des utilisateurs. 
                Un KPI actionnable, comme les utilisateurs actifs mensuels, donne une image plus fidèle de la santé de votre produit.
              </p>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vanityVsActionableData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="vanity" 
                      stroke="#22d3ee" 
                      strokeWidth={3}
                      name="Total Inscriptions (Vanity Metric)"
                      dot={{ fill: '#22d3ee' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actionable" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      name="Utilisateurs Actifs Mensuels (KPI)"
                      dot={{ fill: '#ec4899' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-white/50 text-center">
                Le graphique compare une métrique de vanité (croissance continue) à un KPI actionnable (croissance réelle de l'engagement)
              </p>
            </CardContent>
          </Card>

          {/* Balanced KPIs Radar */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5 text-purple-400" />
                KPIs Essentiels pour une Startup
              </CardTitle>
              <p className="text-white/60">
                Les startups en phase de démarrage doivent surveiller un ensemble équilibré de KPIs pour assurer une croissance saine.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" stroke="#888" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" />
                    <RechartsRadar
                      name="Performance de la Startup (sur 100)"
                      dataKey="value"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.5}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-white/50 text-center mt-4">
                Une performance équilibrée sur ces KPIs est un signe de santé globale
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Stage Tab */}
        <TabsContent value="stages" className="space-y-8">
          {/* By Stage */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpisByStage.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <Badge className={`${stage.color} text-white w-fit`}>{stage.stage}</Badge>
                    <CardTitle className="text-lg">{stage.focus}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">KPIs PRIORITAIRES</p>
                      <div className="flex flex-wrap gap-1">
                        {stage.kpis.map(kpi => (
                          <Badge key={kpi} variant="outline" className="text-xs">{kpi}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">ÉCOLES / APPROCHES</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {stage.schools.map(school => (
                          <li key={school} className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {school}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* By Nature */}
          <h3 className="text-xl font-bold">KPIs par Nature de Startup</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {kpisByNature.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{type.type}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">KPIs PRIMAIRES</p>
                      <div className="flex flex-wrap gap-1">
                        {type.primaryKpis.map(kpi => (
                          <Badge key={kpi} variant="secondary" className="text-xs">{kpi}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1">BENCHMARK</p>
                      <p className="text-sm">{type.benchmark}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {type.reference}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {academicReferences.map((ref, index) => (
              <motion.div
                key={ref.source}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{ref.source}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground italic">"{ref.insight}"</p>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">MÉTRIQUES CLÉS</p>
                      <div className="flex flex-wrap gap-1">
                        {ref.metrics.map(metric => (
                          <Badge key={metric} variant="outline" className="text-xs">{metric}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Y Combinator Advice */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Conseil Y Combinator</h4>
                  <p className="text-muted-foreground">
                    "Make something people want, and measure if they want it. Focus on <strong>weekly growth rate</strong> 
                    in the early days. 5-7% week-over-week growth is good. Talk to users constantly. 
                    The best metric is <strong>revenue</strong> - it's the ultimate proof of value."
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 font-medium">
                    — Paul Graham, Y Combinator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KPIsVsMetrics;
