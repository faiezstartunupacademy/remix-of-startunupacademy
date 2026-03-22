import { motion } from "framer-motion";
import StartupResources from "@/components/startup/StartupResources";
import { useState } from "react";
import { 
  Brain, 
  Lightbulb, 
  Zap, 
  Eye, 
  Target,
  Moon,
  Sparkles,
  Heart,
  TreePine,
  ArrowRight,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Scale,
  Users,
  Trophy,
  AlertTriangle
} from "lucide-react";
import cerveauEntrepreneurialImg from "@/assets/cerveau-entrepreneurial.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Module 1: Architecture Cérébrale
const brainNetworks = [
  {
    id: "DMN",
    name: "Réseau du Mode par Défaut",
    shortName: "DMN",
    percentage: 70,
    color: "#0d9488", // teal-600
    role: "Le Générateur d'Idées",
    description: "Actif pendant le repos et le vagabondage mental, il combine nos souvenirs pour créer des associations nouvelles et spontanées.",
    characteristics: [
      "Actif au repos mental",
      "Associations spontanées",
      "Souvenirs créatifs",
      "Vagabondage mental"
    ]
  },
  {
    id: "ECN",
    name: "Réseau de Contrôle Exécutif",
    shortName: "ECN",
    percentage: 20,
    color: "#f97316", // orange-500
    role: "L'Évaluateur Critique",
    description: "S'active pour les tâches exigeantes, il analyse, filtre et affine les idées pour les rendre logiques et applicables.",
    characteristics: [
      "Analyse critique",
      "Filtrage des idées",
      "Logique et structure",
      "Raffinement conceptuel"
    ]
  },
  {
    id: "SN",
    name: "Réseau de Saillance",
    shortName: "SN",
    percentage: 10,
    color: "#eab308", // yellow-500
    role: "L'Aiguilleur Dynamique",
    description: "Détecte les idées prometteuses et orchestre le passage entre la génération (DMN) et l'évaluation (ECN).",
    characteristics: [
      "Détection de saillance",
      "Orchestration cérébrale",
      "Passage DMN ↔ ECN",
      "Idées prometteuses"
    ]
  }
];

// Module 2: Genèse d'une Idée - 4 étapes
const ideaGenesis = [
  {
    step: 1,
    name: "Préparation",
    description: "Immersion intense dans le problème. Recherche et collecte de données.",
    network: "ECN Dominant",
    networkColor: "#f97316",
    icon: BookOpen,
    activities: ["Recherche active", "Collecte d'informations", "Étude du contexte", "Analyse des contraintes"]
  },
  {
    step: 2,
    name: "Incubation",
    description: "Prise de distance. Le cerveau travaille en arrière-plan et fait des associations.",
    network: "DMN Dominant",
    networkColor: "#0d9488",
    icon: Moon,
    activities: ["Repos mental", "Lâcher prise", "Associations inconscientes", "Maturation des idées"]
  },
  {
    step: 3,
    name: "Illumination",
    description: "L'éclair de génie ! La solution émerge soudainement à la conscience.",
    network: "SN Déclenche",
    networkColor: "#eab308",
    icon: Lightbulb,
    activities: ["Moment Eureka", "Connexion soudaine", "Intuition créative", "Émergence de l'idée"]
  },
  {
    step: 4,
    name: "Vérification",
    description: "L'idée est testée, critiquée et raffinée pour devenir une solution concrète.",
    network: "ECN Dominant",
    networkColor: "#f97316",
    icon: Target,
    activities: ["Test de viabilité", "Critique constructive", "Raffinement", "Validation"]
  }
];

// Module 3: Cerveau Entrepreneurial
const entrepreneurBrainData = [
  { subject: "Sensibilité Récompense", entrepreneur: 9, manager: 6, fullMark: 10 },
  { subject: "Aversion à la Perte", entrepreneur: 4, manager: 8, fullMark: 10 },
  { subject: "Contrôle Cognitif", entrepreneur: 7, manager: 5, fullMark: 10 },
];

const cognitiveFlexibility = [
  { name: "Managers", value: 45, color: "#f87171" },
  { name: "Entrepreneurs", value: 78, color: "#0d9488" },
];

// Module 4: Cultiver le Potentiel
const innovationPractices = [
  {
    title: "Priorisez le Sommeil",
    emoji: "🌙",
    description: "Le sommeil consolide les souvenirs et crée des associations inattendues.",
    tip: "\"Dormir sur un problème\" est une stratégie neurobiologique efficace.",
    color: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-500"
  },
  {
    title: "Gérez le Stress",
    emoji: "🧘",
    description: "Le stress chronique verrouille le cerveau en mode \"survie\", inhibant le vagabondage mental nécessaire à la créativité.",
    tip: "La méditation et l'exercice physique réduisent le cortisol.",
    color: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-500"
  },
  {
    title: "Cultivez l'Affect Positif",
    emoji: "💚",
    description: "Les émotions positives élargissent notre champ d'attention et favorisent la flexibilité cognitive et les idées originales.",
    tip: "Gratitude, optimisme et connexions sociales boostent la créativité.",
    color: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500"
  },
  {
    title: "Explorez la Nouveauté",
    emoji: "🌳",
    description: "Exposez-vous à de nouvelles expériences et à la nature. Cela nourrit votre cerveau en matière première pour de futures innovations.",
    tip: "Voyages, lectures variées, rencontres interdisciplinaires.",
    color: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-500"
  }
];

// Pie chart data for network cooperation
const networkCooperationData = [
  { name: "DMN", value: 70, color: "#0d9488" },
  { name: "ECN", value: 20, color: "#f97316" },
  { name: "SN", value: 10, color: "#eab308" },
];

const FondementsEntrepreneuriat = () => {
  const [activeModule, setActiveModule] = useState<'neuro' | 'genesis' | 'brain' | 'cultivate' | 'resources'>('neuro');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">
          La Neurobiologie de l'Idée
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comment le cerveau produit l'innovation entrepreneuriale
        </p>
      </motion.div>

      {/* Module Navigation */}
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge
          variant={activeModule === 'neuro' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveModule('neuro')}
        >
          <Brain className="h-3 w-3 mr-1" />
          Architecture Cérébrale
        </Badge>
        <Badge
          variant={activeModule === 'genesis' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveModule('genesis')}
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          Genèse de l'Idée
        </Badge>
        <Badge
          variant={activeModule === 'brain' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveModule('brain')}
        >
          <Zap className="h-3 w-3 mr-1" />
          Cerveau Entrepreneurial
        </Badge>
        <Badge
          variant={activeModule === 'cultivate' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveModule('cultivate')}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Cultiver l'Innovation
        </Badge>
        <Badge
          variant={activeModule === 'resources' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveModule('resources')}
        >
          <BookOpen className="h-3 w-3 mr-1" />
          📚 Ressources
        </Badge>
      </div>

      {/* Module 1: Architecture Cérébrale */}
      {activeModule === 'neuro' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                L'Architecture Cérébrale de la Créativité
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                L'innovation n'est pas le fruit d'une seule région, mais d'une <strong className="text-primary">"danse neuronale"</strong> entre 
                trois grands réseaux cérébraux qui collaborent de manière dynamique.
              </p>
            </CardContent>
          </Card>

          {/* Three Networks Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {brainNetworks.map((network, index) => (
              <motion.div
                key={network.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group border-2 hover:border-primary/30">
                  <CardContent className="p-6">
                    {/* Percentage Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="text-3xl font-bold"
                        style={{ color: network.color }}
                      >
                        {network.percentage}%
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: network.color, color: network.color }}
                      >
                        {network.shortName}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-lg mb-2">{network.name}</h4>
                    <p 
                      className="text-sm font-semibold mb-3"
                      style={{ color: network.color }}
                    >
                      {network.role}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {network.description}
                    </p>

                    {/* Progress bar */}
                    <Progress 
                      value={network.percentage} 
                      className="h-2"
                      style={{ 
                        '--progress-foreground': network.color 
                      } as React.CSSProperties}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pie Chart - Network Cooperation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                La Danse des Réseaux : Coopération pour l'Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full lg:w-1/2 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={networkCooperationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {networkCooperationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-4">
                  <p className="text-muted-foreground">
                    Ce graphique illustre l'équilibre dynamique. La <strong>performance créative</strong> dépend 
                    de la connectivité et de la <strong>coopération flexible</strong> entre ces trois réseaux, 
                    et non de la dominance d'un seul.
                  </p>
                  <div className="space-y-2">
                    {brainNetworks.map((network) => (
                      <div key={network.id} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: network.color }}
                        />
                        <span className="text-sm font-medium">{network.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Module 2: Genèse de l'Idée */}
      {activeModule === 'genesis' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                La Genèse d'une Idée en 4 Étapes
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Le processus créatif, de la première recherche à la solution finale, suit un parcours structuré qui 
                <strong className="text-primary"> alterne travail intense et repos mental</strong>.
              </p>
            </CardContent>
          </Card>

          {/* 4 Steps Timeline */}
          <div className="grid md:grid-cols-4 gap-4">
            {ideaGenesis.map((stage, index) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    {/* Step number */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-4"
                      style={{ backgroundColor: stage.networkColor }}
                    >
                      {stage.step}
                    </div>

                    <h4 className="font-bold text-lg mb-2">{stage.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {stage.description}
                    </p>

                    <Badge 
                      variant="outline"
                      className="mb-4"
                      style={{ borderColor: stage.networkColor, color: stage.networkColor }}
                    >
                      {stage.network}
                    </Badge>

                    <ul className="space-y-1">
                      {stage.activities.map((activity, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <ChevronRight className="h-3 w-3" style={{ color: stage.networkColor }} />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Arrow connector */}
                {index < ideaGenesis.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Key Insight */}
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Insight Clé</h4>
                  <p className="text-sm text-muted-foreground">
                    L'étape d'<strong>Incubation</strong> est souvent négligée mais cruciale. C'est pendant 
                    cette phase de "lâcher prise" que le cerveau fait ses associations les plus créatives. 
                    Forcer la créativité peut paradoxalement la bloquer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Module 3: Cerveau Entrepreneurial */}
      {activeModule === 'brain' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Le Cerveau Entrepreneurial : Une Signature Distincte
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Au-delà de la créativité, le cerveau entrepreneurial montre des caractéristiques uniques, 
                optimisées pour la <strong className="text-primary">reconnaissance d'opportunités</strong> et 
                la <strong className="text-accent">prise de décision en incertitude</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Brain Image - VMPFC/Striatum vs Insula/Amygdala */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Arbitrage Neuronal : Récompense vs. Menace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <img 
                  src={cerveauEntrepreneurialImg} 
                  alt="VMPFC/Striatum vs Insula/Amygdala - Arbitrage neuronal entrepreneurial" 
                  className="w-full max-w-4xl rounded-xl shadow-lg border border-border"
                />
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-cyan-500" />
                      <h4 className="font-bold text-cyan-600">VMPFC / Striatum</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Système de récompense</strong> : motivation, comportements d'approche, objectifs à long terme.
                      Les entrepreneurs montrent une activité accrue dans ces régions face aux opportunités.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-rose-500" />
                      <h4 className="font-bold text-rose-600">Insula / Amygdale</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Système de menace</strong> : détection du danger, peur, anxiété, comportements d'évitement.
                      Les managers montrent une réponse plus forte dans ces régions face aux risques.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cognitive Flexibility */}
            <Card>
              <CardHeader>
                <CardTitle>Flexibilité Cognitive Accrue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={cognitiveFlexibility}
                    >
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {cognitiveFlexibility.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Les entrepreneurs présentent une <strong>connectivité plus forte</strong> entre le Réseau de Saillance (SN) 
                  et le Réseau de Contrôle Exécutif (ECN). Cela leur permet de basculer plus agilement entre 
                  l'<span className="text-primary font-semibold">exploration</span> de nouvelles idées et 
                  l'<span className="text-accent font-semibold">exploitation</span> des opérations existantes.
                </p>
              </CardContent>
            </Card>

            {/* Risk vs Reward */}
            <Card>
              <CardHeader>
                <CardTitle>Calcul Risque vs. Récompense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={entrepreneurBrainData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar
                        name="Entrepreneur"
                        dataKey="entrepreneur"
                        stroke="#0d9488"
                        fill="#0d9488"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Manager"
                        dataKey="manager"
                        stroke="#f87171"
                        fill="#f87171"
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  La décision entrepreneuriale est un <strong>arbitrage neuronal</strong>. Leur cerveau semble 
                  pondérer plus fortement la valeur de la <span className="text-primary font-semibold">récompense potentielle</span> (via 
                  le circuit vmPFC/Striatum) par rapport à l'aversion à la <span className="text-rose-500 font-semibold">perte potentielle</span> (via 
                  l'Insula/Amygdale).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key characteristics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold mb-2">Orientation Opportunité</h4>
                <p className="text-sm text-muted-foreground">
                  Détection rapide des signaux faibles et des tendances émergentes
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-6 text-center">
                <Scale className="h-8 w-8 text-accent mx-auto mb-3" />
                <h4 className="font-bold mb-2">Tolérance à l'Ambiguïté</h4>
                <p className="text-sm text-muted-foreground">
                  Capacité à décider et agir malgré l'incertitude et l'information incomplète
                </p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Intelligence Sociale</h4>
                <p className="text-sm text-muted-foreground">
                  Lecture fine des besoins du marché et capacité à convaincre
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Module 4: Cultiver l'Innovation */}
      {activeModule === 'cultivate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Comment Cultiver Votre Potentiel Innovant
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                L'innovation n'est pas un don, mais une <strong className="text-primary">compétence qui peut être entraînée</strong> en 
                gérant consciemment nos états biologiques et notre environnement.
              </p>
            </CardContent>
          </Card>

          {/* 4 Practices Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovationPractices.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full border-2 ${practice.color} hover:shadow-lg transition-all`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{practice.emoji}</div>
                    <h4 className="font-bold text-lg mb-3">{practice.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {practice.description}
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs italic text-muted-foreground">
                        💡 {practice.tip}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-primary/20">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3">Conclusion : L'Entrepreneur comme Athlète Cérébral</h4>
                  <p className="text-muted-foreground">
                    Tout comme un athlète entraîne son corps, l'entrepreneur doit entraîner son cerveau. 
                    La créativité et la prise de décision en incertitude sont des <strong>muscles cognitifs</strong> qui 
                    se développent avec la pratique, l'hygiène de vie et l'exposition à de nouveaux stimuli.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="border-indigo-500 text-indigo-500">Sommeil</Badge>
                    <Badge variant="outline" className="border-rose-500 text-rose-500">Gestion du stress</Badge>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">Émotions positives</Badge>
                    <Badge variant="outline" className="border-teal-500 text-teal-500">Nouvelles expériences</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {activeModule === 'resources' && (
        <StartupResources />
      )}
    </div>
  );
};

export default FondementsEntrepreneuriat;
