import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import claytonChristensen from "@/assets/clayton-christensen.jpg";
import {
  Zap, 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  DollarSign,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Play,
  Video,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building,
  Rocket,
  Layers,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

// Définitions Clayton Christensen
const disruptiveDefinition = {
  quote: "La disruption décrit un processus par lequel un produit ou service prend racine dans des applications simples au bas du marché — généralement en étant moins cher et plus accessible — puis remonte inexorablement vers le haut du marché, finissant par déplacer les concurrents établis.",
  author: "Clayton M. Christensen",
  source: "The Innovator's Dilemma (1997)"
};

// Types d'innovation
const innovationTypes = [
  {
    type: "SUSTAINING",
    name: "Innovation de Maintien",
    shortName: "Sustaining",
    description: "Amélioration continue des produits existants pour les clients actuels les plus rentables.",
    characteristics: [
      "Améliore les performances du produit existant",
      "Cible les clients haut de gamme",
      "Avantage les entreprises établies",
      "Suit la trajectoire existante du marché"
    ],
    examples: ["Nouvelle génération iPhone", "Voitures plus performantes", "Logiciels avec plus de fonctionnalités"],
    color: "#3b82f6", // blue
    icon: TrendingUp,
    risk: "Faible",
    reward: "Prévisible"
  },
  {
    type: "LOW_END",
    name: "Disruption par le Bas",
    shortName: "Low-End",
    description: "Cibler les clients sur-servis par une offre simplifiée et moins chère.",
    characteristics: [
      "Produit \"assez bon\" pour les clients négligés",
      "Prix significativement plus bas",
      "Marges plus faibles mais volumes supérieurs",
      "Remonte progressivement le marché"
    ],
    examples: ["Toyota vs Big 3 US", "Southwest Airlines", "Xiaomi smartphones"],
    color: "#f97316", // orange
    icon: TrendingDown,
    risk: "Modéré",
    reward: "Élevée"
  },
  {
    type: "NEW_MARKET",
    name: "Disruption Nouveau Marché",
    shortName: "New-Market",
    description: "Créer un nouveau marché en servant des non-consommateurs.",
    characteristics: [
      "Cible les non-consommateurs",
      "Crée une nouvelle catégorie de marché",
      "Souvent plus simple et accessible",
      "Rend la consommation possible pour la première fois"
    ],
    examples: ["PC personnel vs Mainframe", "Kodak camera portable", "Photocopieurs personnels Xerox"],
    color: "#10b981", // emerald
    icon: Users,
    risk: "Élevé",
    reward: "Transformation"
  }
];

// Trajectoires de performance
const performanceData = [
  { year: "T0", incumbent: 30, disruptor: 5, demand: 20 },
  { year: "T1", incumbent: 45, disruptor: 12, demand: 25 },
  { year: "T2", incumbent: 60, disruptor: 25, demand: 30 },
  { year: "T3", incumbent: 72, disruptor: 40, demand: 35 },
  { year: "T4", incumbent: 82, disruptor: 55, demand: 42 },
  { year: "T5", incumbent: 88, disruptor: 70, demand: 50 },
  { year: "T6", incumbent: 92, disruptor: 85, demand: 60 },
];

// Cas d'école de disruption
const disruptionCases = [
  {
    disruptor: "Netflix",
    incumbent: "Blockbuster",
    type: "LOW_END → NEW_MARKET",
    year: "1997-2010",
    description: "DVD par courrier (low-end) puis streaming (new-market). Blockbuster a ignoré la menace jusqu'à la faillite.",
    lesson: "Les leaders méprisent les alternatives \"inférieures\" jusqu'à ce qu'il soit trop tard."
  },
  {
    disruptor: "Amazon",
    incumbent: "Librairies traditionnelles",
    type: "NEW_MARKET",
    year: "1994-2000",
    description: "Accès à des millions de livres sans stock physique. A rendu possible l'achat de livres rares impossibles à trouver localement.",
    lesson: "Les non-consommateurs deviennent souvent le plus grand marché."
  },
  {
    disruptor: "Airbnb",
    incumbent: "Hôtels",
    type: "LOW_END + NEW_MARKET",
    year: "2008-présent",
    description: "Logements moins chers (low-end) + expériences uniques pour voyageurs exclus du marché hôtelier premium.",
    lesson: "La disruption peut combiner les deux stratégies simultanément."
  },
  {
    disruptor: "Tesla",
    incumbent: "Constructeurs automobiles",
    type: "HIGH-END (Exception)",
    year: "2008-présent",
    description: "Cas atypique : Tesla a commencé par le haut de gamme (Roadster) avant de descendre (Model 3).",
    lesson: "Toute innovation réussie n'est pas une disruption au sens strict de Christensen."
  }
];

// Signaux d'alerte pour les entreprises établies
const warningSignals = [
  {
    signal: "Fuite vers le Haut",
    description: "L'entreprise cède volontairement le bas de gamme pour se concentrer sur les clients premium plus rentables.",
    danger: "Critique",
    icon: TrendingUp
  },
  {
    signal: "Mépris du Nouveau Venu",
    description: "\"Leur produit est inférieur\" - Les dirigeants sous-estiment systématiquement les disrupteurs.",
    danger: "Élevé",
    icon: XCircle
  },
  {
    signal: "Over-serving",
    description: "Le produit dépasse largement les besoins de la majorité des clients, créant une opportunité pour des offres simplifiées.",
    danger: "Élevé",
    icon: Settings
  },
  {
    signal: "Dépendance aux Meilleurs Clients",
    description: "Les processus décisionnels favorisent exclusivement les besoins des clients les plus rentables actuels.",
    danger: "Modéré",
    icon: DollarSign
  }
];

// Dimensions de la disruption
const disruptionDimensions = [
  {
    dimension: "Verticale (Performance)",
    description: "Trajectoire d'amélioration des performances du produit sur les attributs traditionnels valorisés par le marché.",
    direction: "Vers le haut",
    icon: ArrowUp,
    color: "text-blue-500"
  },
  {
    dimension: "Horizontale (Marché)",
    description: "Extension vers de nouveaux segments de clients : non-consommateurs ou clients sur-servis des marchés adjacents.",
    direction: "Latérale",
    icon: ArrowRight,
    color: "text-emerald-500"
  }
];

// Vidéos YouTube de Clayton Christensen
const christensenVideos = [
  {
    id: "qDrMAzCHFUU",
    title: "Clayton Christensen on Disruptive Innovation",
    description: "Conférence magistrale où Christensen explique sa théorie de l'innovation disruptive avec des exemples concrets de l'industrie.",
    duration: "28 min"
  },
  {
    id: "aMsvWmvTmxw",
    title: "The Innovator's Dilemma Explained",
    description: "Pourquoi les grandes entreprises échouent face aux nouveaux entrants ? Christensen décortique le dilemme fondamental des leaders de marché.",
    duration: "15 min"
  },
  {
    id: "Zn6-KksdOgE",
    title: "Jobs to Be Done Theory",
    description: "La théorie complémentaire des 'Jobs to Be Done' : comprendre pourquoi les clients 'embauchent' un produit pour accomplir une tâche.",
    duration: "12 min"
  }
];

// Slides des idées clés de Clayton Christensen
const keyInsightsSlides = [
  {
    id: 1,
    title: "L'Asymétrie de la Motivation",
    icon: "🎯",
    content: "Les disrupteurs sont motivés à monter en gamme, mais les incumbents n'ont aucune motivation à descendre vers des marchés moins rentables.",
    quote: "Les entreprises établies sont rationnellement incitées à fuir les marchés de base.",
    color: "from-blue-600 to-blue-800"
  },
  {
    id: 2,
    title: "Le Piège du Client Premium",
    icon: "💰",
    content: "Écouter ses meilleurs clients est généralement sage, mais cela rend les entreprises aveugles aux menaces venant du bas du marché.",
    quote: "Ce qui fait le succès rend également vulnérable à la disruption.",
    color: "from-amber-600 to-orange-700"
  },
  {
    id: 3,
    title: "Good Enough is Good Enough",
    icon: "✅",
    content: "Un produit 'suffisamment bon' à un prix inférieur finit toujours par capturer le mainstream quand les performances dépassent les besoins.",
    quote: "La performance dépasse les besoins du marché. L'opportunité émerge.",
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: 4,
    title: "Jobs to Be Done",
    icon: "🔧",
    content: "Les clients n'achètent pas des produits, ils les 'embauchent' pour accomplir une tâche. Comprenez le job, pas la démographie.",
    quote: "Les gens n'achètent pas un foret de 6mm, ils achètent un trou de 6mm.",
    color: "from-purple-600 to-indigo-700"
  },
  {
    id: 5,
    title: "Les Non-Consommateurs",
    icon: "👥",
    content: "Le plus grand marché est souvent composé de gens qui n'utilisent rien du tout. Créer l'accessibilité crée de nouveaux marchés.",
    quote: "Ciblez ceux qui ne consomment pas, pas ceux qui consomment déjà.",
    color: "from-rose-600 to-pink-700"
  },
  {
    id: 6,
    title: "Séparer pour Innover",
    icon: "🏢",
    content: "Pour survivre à la disruption, créez des unités autonomes avec leurs propres processus, P&L et KPIs - loin du core business.",
    quote: "Vous ne pouvez pas disrupter vous-même depuis l'intérieur.",
    color: "from-cyan-600 to-blue-700"
  }
];

const InnovationDisruptive = () => {
  const [activeSection, setActiveSection] = useState<'definition' | 'types' | 'trajectoire' | 'cases' | 'signals' | 'videos'>('definition');
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % keyInsightsSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + keyInsightsSlides.length) % keyInsightsSlides.length);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Innovation Disruptive
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          La théorie de Clayton Christensen qui a influencé Steve Jobs, Jeff Bezos et Andy Grove
        </p>
      </motion.div>

      {/* Section Navigation */}
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge
          variant={activeSection === 'definition' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('definition')}
        >
          <BookOpen className="h-3 w-3 mr-1" />
          Définition
        </Badge>
        <Badge
          variant={activeSection === 'types' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('types')}
        >
          <Layers className="h-3 w-3 mr-1" />
          Types d'Innovation
        </Badge>
        <Badge
          variant={activeSection === 'trajectoire' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('trajectoire')}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Trajectoires
        </Badge>
        <Badge
          variant={activeSection === 'cases' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('cases')}
        >
          <Rocket className="h-3 w-3 mr-1" />
          Cas d'École
        </Badge>
        <Badge
          variant={activeSection === 'signals' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('signals')}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Signaux d'Alerte
        </Badge>
        <Badge
          variant={activeSection === 'videos' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
          onClick={() => setActiveSection('videos')}
        >
          <Video className="h-3 w-3 mr-1" />
          Vidéos
        </Badge>
      </div>

      {/* Section: Définition */}
      {activeSection === 'definition' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Quote Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Zap className="h-10 w-10 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xl italic mb-4 leading-relaxed">
                    "{disruptiveDefinition.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-semibold">
                      — {disruptiveDefinition.author}
                    </p>
                    <Badge variant="outline" className="text-white/60 border-white/30">
                      {disruptiveDefinition.source}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Concept Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <h4 className="font-bold text-lg">Ce qu'EST la Disruption</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5" />
                    Un processus progressif, pas un événement soudain
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5" />
                    Commence par des marchés négligés ou de nouveaux consommateurs
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5" />
                    Offre initialement un produit "inférieur" sur les critères traditionnels
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5" />
                    Améliore progressivement sa performance jusqu'à satisfaire le mainstream
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-rose-500/20 bg-rose-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-rose-500" />
                  <h4 className="font-bold text-lg">Ce que N'EST PAS la Disruption</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-rose-500 mt-0.5" />
                    Pas toute innovation qui perturbe un marché
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-rose-500 mt-0.5" />
                    Pas une technologie révolutionnaire en soi
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-rose-500 mt-0.5" />
                    Pas une attaque frontale sur le marché haut de gamme
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-rose-500 mt-0.5" />
                    Tesla et Uber NE sont PAS des exemples classiques de disruption
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>Dimensions de la Disruption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {disruptionDimensions.map((dim, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                    <div className={`p-3 rounded-xl bg-background ${dim.color}`}>
                      <dim.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{dim.dimension}</h4>
                      <p className="text-sm text-muted-foreground">{dim.description}</p>
                      <Badge variant="outline" className="mt-2">{dim.direction}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section: Types d'Innovation */}
      {activeSection === 'types' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Trois Types d'Innovation selon Christensen
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Comprendre la différence est crucial : toutes les innovations ne sont pas disruptives, 
                et <strong className="text-primary">les entreprises établies excellent généralement dans l'innovation de maintien</strong>, 
                mais échouent face à la disruption.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {innovationTypes.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-all border-2"
                  style={{ borderColor: `${type.color}30` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
                        <type.icon className="h-6 w-6" style={{ color: type.color }} />
                      </div>
                      <Badge 
                        variant="outline"
                        style={{ borderColor: type.color, color: type.color }}
                      >
                        {type.shortName}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-lg mb-2">{type.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{type.description}</p>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">CARACTÉRISTIQUES</p>
                        <ul className="space-y-1">
                          {type.characteristics.map((char, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5" style={{ color: type.color }} />
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">EXEMPLES</p>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.map((ex, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Risque: <strong>{type.risk}</strong></span>
                        <span className="text-muted-foreground">Récompense: <strong>{type.reward}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section: Trajectoires */}
      {activeSection === 'trajectoire' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Le Dilemme de l'Innovateur
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Les entreprises établies améliorent leurs produits (ligne bleue) <strong className="text-blue-400">plus vite que les besoins du marché évoluent</strong> (ligne verte). 
                Cela crée un espace pour les disrupteurs (ligne orange) qui offrent "juste assez" de performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trajectoires de Performance : Le Croisement Fatal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Performance', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="incumbent" 
                      name="Entreprise établie"
                      stroke="#3b82f6" 
                      fill="#3b82f680" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="disruptor" 
                      name="Disrupteur"
                      stroke="#f97316" 
                      fill="#f9731680" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="demand" 
                      name="Besoin du marché"
                      stroke="#10b981" 
                      fill="#10b98140" 
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/50">
                <h4 className="font-bold mb-2">Lecture du graphique</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-blue-500">L'entreprise établie</strong> dépasse rapidement les besoins du marché (over-serving).
                  <strong className="text-orange-500"> Le disrupteur</strong> démarre avec une performance "insuffisante" mais 
                  <strong className="text-emerald-500"> atteint le seuil requis par le marché</strong> à T4-T5.
                  À ce moment, il capture le mainstream avec un produit moins cher et plus simple.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Insight */}
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Lightbulb className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Pourquoi les Leaders Échouent</h4>
                  <p className="text-sm text-muted-foreground">
                    Les entreprises établies sont <strong>rationnellement incitées</strong> à fuir vers le haut du marché 
                    (clients plus rentables) et à ignorer les disrupteurs. Leurs propres processus de décision, 
                    optimisés pour écouter les meilleurs clients actuels, les rendent aveugles à la menace.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section: Cas d'École */}
      {activeSection === 'cases' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Cas d'École de Disruption
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Ces exemples illustrent comment des géants ont été renversés par des acteurs 
                qu'ils ont initialement <strong className="text-primary">ignorés ou méprisés</strong>.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {disruptionCases.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.disruptor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Rocket className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold">{caseStudy.disruptor}</h4>
                          <p className="text-xs text-muted-foreground">vs {caseStudy.incumbent}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {caseStudy.year}
                      </Badge>
                    </div>

                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                      {caseStudy.type}
                    </Badge>

                    <p className="text-sm text-muted-foreground mb-4">
                      {caseStudy.description}
                    </p>

                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs">
                        <strong className="text-amber-600">💡 Leçon :</strong>{" "}
                        <span className="text-muted-foreground">{caseStudy.lesson}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section: Signaux d'Alerte */}
      {activeSection === 'signals' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Signaux d'Alerte pour les Entreprises Établies
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Ces indicateurs précoces suggèrent qu'une entreprise est 
                <strong className="text-rose-400"> vulnérable à la disruption</strong>. Les reconnaître est la première étape de la survie.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {warningSignals.map((signal, index) => (
              <motion.div
                key={signal.signal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full border-2 ${
                    signal.danger === 'Critique' 
                      ? 'border-rose-500/30 bg-rose-500/5' 
                      : signal.danger === 'Élevé' 
                        ? 'border-amber-500/30 bg-amber-500/5' 
                        : 'border-blue-500/30 bg-blue-500/5'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        signal.danger === 'Critique' 
                          ? 'bg-rose-500/20' 
                          : signal.danger === 'Élevé' 
                            ? 'bg-amber-500/20' 
                            : 'bg-blue-500/20'
                      }`}>
                        <signal.icon className={`h-6 w-6 ${
                          signal.danger === 'Critique' 
                            ? 'text-rose-500' 
                            : signal.danger === 'Élevé' 
                              ? 'text-amber-500' 
                              : 'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold">{signal.signal}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              signal.danger === 'Critique' 
                                ? 'border-rose-500 text-rose-500' 
                                : signal.danger === 'Élevé' 
                                  ? 'border-amber-500 text-amber-500' 
                                  : 'border-blue-500 text-blue-500'
                            }`}
                          >
                            {signal.danger}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{signal.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Comment Survivre à la Disruption</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selon Christensen, les entreprises établies doivent créer des <strong>unités autonomes</strong> avec 
                    des processus, priorités et modèles économiques distincts pour explorer les opportunités disruptives 
                    sans être sabotées par le cœur de métier.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-primary text-primary">Unités autonomes</Badge>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">P&L séparé</Badge>
                    <Badge variant="outline" className="border-amber-500 text-amber-500">Tolérance à l'échec</Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-500">KPIs différents</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section: Vidéos */}
      {activeSection === 'videos' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                🎬 Conférences de Clayton Christensen
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto">
                Découvrez la théorie de l'innovation disruptive expliquée par son créateur lui-même. 
                Ces conférences sont <strong className="text-primary">essentielles pour tout entrepreneur</strong> souhaitant comprendre 
                les dynamiques de disruption des marchés.
              </p>
            </CardContent>
          </Card>

          {/* Slider des Idées Clés */}
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3">
                {/* Portrait Section */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col items-center justify-center text-white">
                  <div className="relative mb-4">
                      <img 
                      src={claytonChristensen} 
                      alt="Pr Clayton Christensen"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/50 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      1952-2020
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-center">Clayton M. Christensen</h4>
                  <p className="text-sm text-white/70 text-center">Harvard Business School</p>
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    <Badge variant="outline" className="text-xs border-white/30 text-white/80">HBS Professor</Badge>
                    <Badge variant="outline" className="text-xs border-white/30 text-white/80">5x NY Times Bestseller</Badge>
                  </div>
                </div>

                {/* Slide Content */}
                <div className="md:col-span-2 p-6 relative min-h-[320px]">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-primary/10 text-primary">
                      💡 Idée Clé {currentSlide + 1}/{keyInsightsSlides.length}
                    </Badge>
                    <div className="flex gap-2">
                      <button 
                        onClick={prevSlide}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className={`inline-flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${keyInsightsSlides[currentSlide].color} text-white`}>
                        <span className="text-2xl">{keyInsightsSlides[currentSlide].icon}</span>
                        <h3 className="font-bold text-xl">{keyInsightsSlides[currentSlide].title}</h3>
                      </div>

                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {keyInsightsSlides[currentSlide].content}
                      </p>

                      <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80">
                        "{keyInsightsSlides[currentSlide].quote}"
                      </blockquote>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress Dots */}
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    {keyInsightsSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide 
                            ? 'bg-primary w-6' 
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {christensenVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all overflow-hidden">
                  <div className="aspect-video relative bg-slate-900">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        {video.duration}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm mb-2">{video.title}</h4>
                    <p className="text-xs text-muted-foreground">{video.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Lectures Recommandées</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pour approfondir la théorie de l'innovation disruptive de Clayton Christensen :
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="font-semibold text-sm">📘 The Innovator's Dilemma</p>
                      <p className="text-xs text-muted-foreground">Le livre fondateur (1997)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="font-semibold text-sm">📗 The Innovator's Solution</p>
                      <p className="text-xs text-muted-foreground">Comment créer une disruption (2003)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="font-semibold text-sm">📙 Competing Against Luck</p>
                      <p className="text-xs text-muted-foreground">Jobs to Be Done theory (2016)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="font-semibold text-sm">📕 Seeing What's Next</p>
                      <p className="text-xs text-muted-foreground">Prédire les disruptions (2004)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default InnovationDisruptive;
