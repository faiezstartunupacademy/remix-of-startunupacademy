import { motion } from "framer-motion";
import { 
  Building2, Rocket, ArrowRight, CheckCircle2, XCircle, 
  Target, Lightbulb, TrendingUp, Users, Scale, Clock,
  Briefcase, Zap, HelpCircle, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from "recharts";

const BMCvsLeanCanvas = () => {
  // Data for focus distribution charts
  const bmcFocusData = [
    { name: "Exécution & Opérations", value: 45, color: "hsl(var(--primary))" },
    { name: "Stratégie & Planification", value: 35, color: "hsl(var(--accent))" },
    { name: "Optimisation", value: 20, color: "hsl(var(--muted-foreground))" }
  ];

  const leanFocusData = [
    { name: "Validation du Problème", value: 40, color: "hsl(346, 77%, 50%)" },
    { name: "Test de la Solution", value: 35, color: "hsl(43, 96%, 56%)" },
    { name: "Mesure & Apprentissage", value: 25, color: "hsl(162, 63%, 41%)" }
  ];

  // Lifecycle evolution data
  const lifecycleData = [
    { stage: "Idée & Concept\n(Lean Canvas)", certitude: 10, risque: 90 },
    { stage: "Adéquation\nProblème/Solution\n(Lean Canvas)", certitude: 30, risque: 70 },
    { stage: "Adéquation\nProduit/Marché\n(Transition)", certitude: 50, risque: 50 },
    { stage: "Mise à\nl'Échelle\n(BMC)", certitude: 75, risque: 25 },
    { stage: "Maturité &\nOptimisation\n(BMC)", certitude: 95, risque: 5 }
  ];

  // Block comparisons
  const blockComparisons = [
    {
      bmc: { title: "Partenaires Clés", subtitle: "Qui nous aide ?" },
      lean: { title: "Problème", subtitle: "Quel problème résolvons-nous ?" },
      insight: "Le risque n'est pas l'optimisation des opérations, mais l'absence d'un problème qui vaille la peine d'être résolu. La priorité est de valider le besoin du marché.",
      icon: HelpCircle
    },
    {
      bmc: { title: "Activités Clés", subtitle: "Que faisons-nous ?" },
      lean: { title: "Solution", subtitle: "Comment le résolvons-nous (MVP) ?" },
      insight: "Le focus passe des processus internes à la construction d'un Produit Minimum Viable pour tester l'hypothèse de la solution le plus rapidement possible.",
      icon: Zap
    },
    {
      bmc: { title: "Ressources Clés", subtitle: "De quoi avons-nous besoin ?" },
      lean: { title: "Indicateurs Clés", subtitle: "Comment mesurons-nous le succès ?" },
      insight: "Le succès d'une startup ne se mesure pas par les actifs accumulés, mais par l'apprentissage validé. Les indicateurs actionnables sont le véritable moteur du progrès.",
      icon: BarChart3
    },
    {
      bmc: { title: "Relations Clients", subtitle: "Comment interagissons-nous ?" },
      lean: { title: "Avantage Injuste", subtitle: "Qu'est-ce qui nous rend unique ?" },
      insight: "Avant de gérer des relations à grande échelle, une startup doit identifier ce qui la rendra défendable à long terme. C'est la question de la survie stratégique.",
      icon: Target
    }
  ];

  // Common blocks
  const commonBlocks = [
    { name: "Segments de Clients", desc: "Qui sont nos clients cibles ?", icon: Users },
    { name: "Proposition de Valeur", desc: "Quelle valeur unique offrons-nous ?", icon: Lightbulb },
    { name: "Canaux", desc: "Comment atteignons-nous nos clients ?", icon: TrendingUp },
    { name: "Structure de Coûts", desc: "Quels sont nos principaux coûts ?", icon: Scale },
    { name: "Sources de Revenus", desc: "Comment gagnons-nous de l'argent ?", icon: Briefcase }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Business Model Canvas vs. Lean Canvas
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Deux outils, deux philosophies. Découvrez lequel est fait pour votre projet et 
          transformez votre vision en stratégie.
        </p>
      </motion.div>

      {/* Philosophy Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* BMC Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">L'Architecte : Business Model Canvas</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Conçu pour les <strong>entreprises établies</strong> ou les projets sur des <strong>marchés connus</strong>. 
                Il se concentre sur l'exécution, l'optimisation et la description d'un modèle d'affaires complet. 
                C'est le plan directeur pour <span className="text-primary font-semibold">construire et développer</span>.
              </p>

              <div>
                <h4 className="font-semibold mb-4 text-sm text-muted-foreground">Répartition du Focus du BMC</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bmcFocusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bmcFocusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {bmcFocusData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic border-l-4 border-primary/30 pl-4">
                Le BMC met l'accent sur la mise en œuvre d'un plan solide.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lean Canvas Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-2 border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Rocket className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl text-amber-600 dark:text-amber-400">L'Explorateur : Lean Canvas</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Adapté pour les <strong>startups</strong> et les environnements à <strong>haute incertitude</strong>. 
                Il est axé sur la découverte, la validation des hypothèses et l'itération rapide. 
                C'est la boussole pour <span className="text-amber-600 font-semibold">naviguer dans l'inconnu</span>.
              </p>

              <div>
                <h4 className="font-semibold mb-4 text-sm text-muted-foreground">Répartition du Focus du Lean Canvas</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leanFocusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leanFocusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {leanFocusData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic border-l-4 border-amber-500/30 pl-4">
                Le Lean Canvas privilégie l'apprentissage et la validation des risques.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Block Transformations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center">
          <Badge className="mb-4">Analyse Bloc par Bloc</Badge>
          <h2 className="text-2xl font-bold mb-2">Les 4 Transformations Clés</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Le Lean Canvas remplace 4 blocs du BMC pour mieux répondre aux besoins des startups en phase d'exploration.
          </p>
        </div>

        <div className="space-y-4">
          {blockComparisons.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                    {/* BMC Block */}
                    <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="font-bold text-primary">{comparison.bmc.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{comparison.bmc.subtitle}</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    {/* Lean Block */}
                    <div className="text-center p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <h4 className="font-bold text-rose-600 dark:text-rose-400">{comparison.lean.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{comparison.lean.subtitle}</p>
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-start gap-3">
                    <comparison.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      {comparison.insight.split('. ').map((sentence, i) => {
                        const highlighted = sentence.includes('priorité') || sentence.includes('MVP') || 
                                           sentence.includes('actionnables') || sentence.includes('défendable');
                        return (
                          <span key={i}>
                            {highlighted ? (
                              <span className="text-primary font-medium">{sentence}</span>
                            ) : sentence}
                            {i < comparison.insight.split('. ').length - 1 && '. '}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Common Blocks */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center">
          <Badge variant="outline" className="mb-4">5 Blocs Identiques</Badge>
          <h2 className="text-2xl font-bold mb-2">Ce Qui Ne Change Pas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les deux canvas partagent ces éléments fondamentaux car ils restent essentiels quelle que soit la maturité de l'entreprise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {commonBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="p-3 rounded-xl bg-muted inline-flex mb-3">
                    <block.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{block.name}</h4>
                  <p className="text-xs text-muted-foreground">{block.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Decision Flowchart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center">
          <Badge className="bg-gradient-to-r from-primary to-accent text-white mb-4">Guide Décisionnel</Badge>
          <h2 className="text-2xl font-bold mb-2">Quel Canvas Choisir ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Suivez ce parcours pour identifier l'outil le plus adapté à votre situation actuelle.
          </p>
        </div>

        <Card className="p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Start */}
            <div className="text-center">
              <div className="inline-block px-6 py-3 rounded-full bg-muted border-2 border-border font-medium">
                Début du projet
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-border" />
            </div>

            {/* Question 1 */}
            <div className="text-center">
              <div className="inline-block px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 max-w-md">
                Le problème que vous résolvez est-il bien défini et validé ?
              </div>
            </div>

            {/* Branches */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* NON Branch */}
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="text-rose-500 border-rose-500">NON</Badge>
                </div>
                <Card className="p-4 bg-rose-500/5 border-rose-500/20">
                  <p className="text-sm text-center text-muted-foreground">
                    Votre priorité est de valider le problème et de trouver une solution (forte incertitude).
                  </p>
                </Card>
                <div className="text-center">
                  <div className="inline-block px-6 py-4 rounded-xl bg-rose-500 text-white font-bold shadow-lg">
                    Utilisez le Lean Canvas
                  </div>
                </div>
              </div>

              {/* OUI Branch */}
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500">OUI</Badge>
                </div>
                <div className="text-center">
                  <div className="inline-block px-4 py-2 rounded-lg bg-muted text-sm">
                    Votre marché et vos clients sont-ils bien connus ?
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-rose-500 border-rose-500 mx-auto block w-fit">NON</Badge>
                    <Card className="p-3 bg-amber-500/5 border-amber-500/20">
                      <p className="text-xs text-center">
                        Vous innovez sur un marché existant mais avec un nouveau modèle.
                      </p>
                    </Card>
                    <div className="text-center">
                      <div className="inline-block px-3 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold">
                        Commencez avec LC, puis passez au BMC
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500 mx-auto block w-fit">OUI</Badge>
                    <Card className="p-3 bg-emerald-500/5 border-emerald-500/20">
                      <p className="text-xs text-center">
                        Votre priorité est d'exécuter, d'optimiser et de mettre à l'échelle.
                      </p>
                    </Card>
                    <div className="text-center">
                      <div className="inline-block px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold">
                        Utilisez le Business Model Canvas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Lifecycle Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center">
          <Badge className="bg-gradient-to-r from-emerald-500 to-primary text-white mb-4">Cycle de Vie</Badge>
          <h2 className="text-2xl font-bold mb-2">De la Recherche à la Croissance</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Les deux canevas ne s'opposent pas, ils se complètent. Une startup prospère passe naturellement du 
            Lean Canvas, axé sur la recherche, au Business Model Canvas, axé sur la croissance.
          </p>
        </div>

        <Card className="p-6">
          <h3 className="text-center font-semibold mb-6">Évolution du Risque et de la Certitude</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lifecycleData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  height={80}
                />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="certitude" 
                  stackId="1"
                  stroke="hsl(162, 63%, 41%)" 
                  fill="hsl(162, 63%, 41%)" 
                  fillOpacity={0.6}
                  name="Niveau de Certitude"
                />
                <Area 
                  type="monotone" 
                  dataKey="risque" 
                  stackId="2"
                  stroke="hsl(346, 77%, 50%)" 
                  fill="hsl(346, 77%, 50%)" 
                  fillOpacity={0.6}
                  name="Niveau de Risque"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            À mesure que l'incertitude diminue et que le modèle économique se solidifie, 
            l'outil stratégique évolue pour répondre aux nouveaux défis de l'entreprise.
          </p>
        </Card>
      </motion.section>

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2">
          <CardContent className="p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">L'Essentiel à Retenir</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-bold text-primary mb-2">BMC</h4>
                  <p className="text-sm text-muted-foreground">
                    Pour les entreprises qui ont validé leur marché et cherchent à <strong>exécuter</strong> et <strong>optimiser</strong> leur modèle.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Rocket className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">Lean Canvas</h4>
                  <p className="text-sm text-muted-foreground">
                    Pour les startups en phase d'exploration qui cherchent à <strong>valider</strong> leurs hypothèses et <strong>apprendre</strong> rapidement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};

export default BMCvsLeanCanvas;
