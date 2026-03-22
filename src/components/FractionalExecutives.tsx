import { motion } from "framer-motion";
import { 
  Clock, DollarSign, Users, Target, CheckCircle2, 
  AlertTriangle, Briefcase, TrendingUp, Building2,
  ArrowRight, Sparkles, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FractionalRole {
  id: string;
  symbol: string;
  name: string;
  idealFor: string[];
  typicalEngagement: string;
  costRange: string;
  transitionTriggers: string[];
  keyDeliverables: string[];
  color: string;
}

const fractionalRoles: FractionalRole[] = [
  {
    id: "cfo",
    symbol: "CFO",
    name: "Chief Financial Officer",
    idealFor: [
      "Startups pré-Série A avec besoins financiers complexes",
      "Préparation de levée de fonds",
      "Mise en place de reporting et KPIs financiers"
    ],
    typicalEngagement: "1-2 jours/semaine",
    costRange: "2 000 - 5 000 €/mois",
    transitionTriggers: [
      "Levée Série A+ réussie",
      "Équipe finance > 3 personnes",
      "Complexité comptable internationale"
    ],
    keyDeliverables: [
      "Modèle financier robuste",
      "Dashboard KPIs",
      "Data room investisseurs",
      "Processus budgétaires"
    ],
    color: "from-emerald-500 to-emerald-600"
  },
  {
    id: "cmo",
    symbol: "CMO",
    name: "Chief Marketing Officer",
    idealFor: [
      "Définition de la stratégie de marque",
      "Lancement de nouveaux produits/marchés",
      "Structuration de l'équipe marketing"
    ],
    typicalEngagement: "2-3 jours/semaine",
    costRange: "3 000 - 7 000 €/mois",
    transitionTriggers: [
      "Budget marketing > 500K€/an",
      "Équipe marketing > 5 personnes",
      "Expansion multi-marchés"
    ],
    keyDeliverables: [
      "Stratégie de marque",
      "Plan marketing annuel",
      "Stack MarTech optimisé",
      "Playbook d'acquisition"
    ],
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "cro",
    symbol: "CRO",
    name: "Chief Revenue Officer",
    idealFor: [
      "Structuration du cycle de vente",
      "Passage de Founder-led sales à équipe dédiée",
      "Optimisation du funnel revenue"
    ],
    typicalEngagement: "2-3 jours/semaine",
    costRange: "4 000 - 8 000 €/mois",
    transitionTriggers: [
      "ARR > 2M€",
      "Équipe sales > 10 personnes",
      "Process sales matures et répétables"
    ],
    keyDeliverables: [
      "Playbook commercial",
      "Forecast process",
      "Structure de compensation",
      "Tech stack revenue"
    ],
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "cto",
    symbol: "CTO",
    name: "Chief Technology Officer",
    idealFor: [
      "Audit et refonte d'architecture",
      "Définition de la roadmap technique",
      "Recrutement de l'équipe tech senior"
    ],
    typicalEngagement: "2-3 jours/semaine",
    costRange: "4 000 - 10 000 €/mois",
    transitionTriggers: [
      "Équipe tech > 15 personnes",
      "Produit devient core business",
      "Enjeux de scalabilité critiques"
    ],
    keyDeliverables: [
      "Architecture scalable",
      "Standards de code",
      "Processus de recrutement tech",
      "Roadmap technique"
    ],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "chro",
    symbol: "CHRO",
    name: "Chief Human Resources Officer",
    idealFor: [
      "Mise en place des processus RH",
      "Création de la culture d'entreprise",
      "Gestion de croissance rapide (+50%/an)"
    ],
    typicalEngagement: "1-2 jours/semaine",
    costRange: "2 000 - 5 000 €/mois",
    transitionTriggers: [
      "Effectif > 50 personnes",
      "Turnover > 20%",
      "Expansion internationale"
    ],
    keyDeliverables: [
      "Processus de recrutement",
      "Grille de salaires",
      "Culture book",
      "Performance reviews"
    ],
    color: "from-rose-500 to-rose-600"
  },
  {
    id: "coo",
    symbol: "COO",
    name: "Chief Operating Officer",
    idealFor: [
      "Structuration des opérations",
      "Optimisation des processus internes",
      "Préparation à l'hypercroissance"
    ],
    typicalEngagement: "2-3 jours/semaine",
    costRange: "4 000 - 8 000 €/mois",
    transitionTriggers: [
      "Complexité opérationnelle élevée",
      "Multi-sites ou multi-produits",
      "CEO débordé par l'opérationnel"
    ],
    keyDeliverables: [
      "OKRs et KPIs opérationnels",
      "Processus documentés",
      "Outils de collaboration",
      "Rituels d'équipe"
    ],
    color: "from-indigo-500 to-indigo-600"
  }
];

const stageRecommendations = [
  {
    stage: "Pre-Seed / Seed",
    employees: "1-10",
    revenue: "< 100K€",
    recommended: ["CFO (ponctuel)", "CTO (si non-tech founder)"],
    notRecommended: ["COO", "CHRO", "CRO"],
    advice: "Focus sur le produit. Seuls besoins: comptabilité basique et architecture technique si pas de CTO fondateur."
  },
  {
    stage: "Série A",
    employees: "10-30",
    revenue: "100K - 1M€",
    recommended: ["CFO", "CTO", "CMO ou CRO"],
    notRecommended: ["COO", "CHRO"],
    advice: "Structurer les fonctions clés. Le fractional permet de professionnaliser sans sur-investir."
  },
  {
    stage: "Série B",
    employees: "30-100",
    revenue: "1M - 10M€",
    recommended: ["CHRO", "COO"],
    notRecommended: [],
    advice: "Transition vers full-time pour CFO/CTO. Le fractional reste pertinent pour RH et Ops en début de scaling."
  },
  {
    stage: "Série C+",
    employees: "100+",
    revenue: "> 10M€",
    recommended: ["Advisory board", "Experts spécialisés"],
    notRecommended: ["Fractional opérationnels"],
    advice: "À ce stade, tous les rôles C-Suite clés doivent être full-time. Le fractional devient conseil stratégique."
  }
];

const prosAndCons = {
  pros: [
    {
      title: "Coût optimisé",
      description: "70-80% moins cher qu'un executive full-time avec avantages",
      icon: DollarSign
    },
    {
      title: "Expertise immédiate",
      description: "Accès à des profils seniors expérimentés dès le jour 1",
      icon: Sparkles
    },
    {
      title: "Flexibilité",
      description: "Ajustement du temps selon les besoins et la croissance",
      icon: Clock
    },
    {
      title: "Réseau étendu",
      description: "Apportent leur carnet d'adresses et best practices",
      icon: Users
    }
  ],
  cons: [
    {
      title: "Disponibilité limitée",
      description: "Ne peuvent pas être présents pour les urgences quotidiennes",
      icon: Calendar
    },
    {
      title: "Moins d'ownership",
      description: "Investissement émotionnel moindre que le full-time",
      icon: Target
    },
    {
      title: "Risque de dépendance",
      description: "Transition délicate si la relation s'éternise",
      icon: AlertTriangle
    },
    {
      title: "Alignement culturel",
      description: "Plus difficile d'incarner et transmettre la culture",
      icon: Building2
    }
  ]
};

const FractionalExecutives = () => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Rôles Fractional
          </TabsTrigger>
          <TabsTrigger value="stages" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Par Stade
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Qu'est-ce qu'un Fractional Executive ?</h3>
            <p className="text-muted-foreground text-lg">
              Un <strong>fractional executive</strong> est un dirigeant expérimenté qui travaille 
              à temps partiel pour votre startup. C'est une alternative stratégique au recrutement 
              full-time, permettant d'accéder à une expertise C-level sans le coût complet.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { value: "70%", label: "d'économie vs full-time", color: "text-emerald-500" },
              { value: "1-3", label: "jours/semaine en moyenne", color: "text-blue-500" },
              { value: "6-18", label: "mois d'engagement typique", color: "text-purple-500" },
              { value: "85%", label: "de startups satisfaites", color: "text-orange-500" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Avantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prosAndCons.pros.map((pro, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <pro.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{pro.title}</p>
                      <p className="text-xs text-muted-foreground">{pro.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Points d'attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prosAndCons.cons.map((con, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <con.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{con.title}</p>
                      <p className="text-xs text-muted-foreground">{con.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Decision Framework */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-8">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quand choisir un Fractional vs Full-Time ?
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-white/70 mb-3">✅ Fractional est idéal quand :</p>
                  <ul className="space-y-2">
                    {[
                      "Le besoin est stratégique mais pas quotidien",
                      "Le budget ne permet pas un C-level full-time",
                      "Vous avez besoin d'expertise immédiate",
                      "La fonction n'est pas encore à maturité",
                      "Vous préparez une levée ou un exit"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-3">🎯 Full-time devient nécessaire quand :</p>
                  <ul className="space-y-2">
                    {[
                      "La fonction est critique au quotidien",
                      "L'équipe sous cette fonction dépasse 5-10 personnes",
                      "Les décisions nécessitent une présence constante",
                      "L'entreprise dépasse 50-100 employés",
                      "Le budget le permet post-Série A/B"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                        <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Rôles Fractional les plus courants</h3>
            <p className="text-muted-foreground">
              Découvrez les 6 rôles C-Suite les plus adaptés au format fractional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fractionalRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader className={`bg-gradient-to-r ${role.color} text-white rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black">{role.symbol}</span>
                      <Badge className="bg-white/20 text-white border-0">
                        {role.typicalEngagement}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Idéal pour :</p>
                      <ul className="space-y-1">
                        {role.idealFor.map((item, i) => (
                          <li key={i} className="text-xs flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Budget indicatif</span>
                        <Badge variant="outline" className="text-xs">{role.costRange}</Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Transition full-time si :</p>
                      <ul className="space-y-1">
                        {role.transitionTriggers.map((trigger, i) => (
                          <li key={i} className="text-xs flex items-start gap-1">
                            <ArrowRight className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Livrables clés :</p>
                      <div className="flex flex-wrap gap-1">
                        {role.keyDeliverables.map((del, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{del}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Stages Tab */}
        <TabsContent value="stages" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Recommandations par Stade</h3>
            <p className="text-muted-foreground">
              Quels rôles fractional sont pertinents selon votre maturité
            </p>
          </div>

          <div className="space-y-6">
            {stageRecommendations.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden border-l-4 ${
                  index === 0 ? 'border-l-gray-400' :
                  index === 1 ? 'border-l-blue-500' :
                  index === 2 ? 'border-l-purple-500' :
                  'border-l-emerald-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="md:w-1/4">
                        <h4 className="text-xl font-bold">{stage.stage}</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            {stage.employees} employés
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <DollarSign className="h-3 w-3 inline mr-1" />
                            CA: {stage.revenue}
                          </p>
                        </div>
                      </div>

                      <div className="md:w-3/4 grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Fractional recommandé
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {stage.recommended.map((role, i) => (
                              <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {stage.notRecommended.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Pas encore pertinent
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {stage.notRecommended.map((role, i) => (
                                <Badge key={i} variant="outline" className="text-muted-foreground">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="md:col-span-2 mt-2 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            💡 <strong>Conseil :</strong> {stage.advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FractionalExecutives;
