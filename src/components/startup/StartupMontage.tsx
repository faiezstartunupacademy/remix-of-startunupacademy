import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Factory, 
  Laptop, 
  Building2, 
  Briefcase, 
  Leaf, 
  DollarSign,
  Users,
  Lightbulb,
  Target,
  Cpu,
  Globe,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StartupIngredient {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  items: string[];
  levelLabel?: string;
  levels?: string[];
}

const startupIngredients: StartupIngredient[] = [
  {
    id: "experience",
    name: "Expérience Requise",
    icon: Briefcase,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    items: [],
    levelLabel: "Niveau",
    levels: ["Basique", "Moyenne", "Élevée"]
  },
  {
    id: "industries",
    name: "Industries",
    icon: Factory,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    items: [
      "Technologie", "Santé", "Fintech", "Éducation", "Logistique", "Nourriture",
      "Maison", "Loisirs", "Jeux", "Immobilier", "Pharmaceutique", "Sécurité",
      "Espace (Aéronautique)", "Social", "Analytique", "Logiciel", "Matériel",
      "Média", "Streaming", "Marketing", "Nature", "Consultation", "E-learning"
    ]
  },
  {
    id: "business-model",
    name: "Modèle d'Affaires",
    icon: Building2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    items: ["B2B", "B2C", "B2B2C", "C2C", "D2C"]
  },
  {
    id: "investissement",
    name: "Investissement",
    icon: DollarSign,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    items: [],
    levelLabel: "Niveau",
    levels: ["Initial", "Moyen", "Élevé"]
  },
  {
    id: "legislation",
    name: "Législation",
    icon: Building2,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    items: [],
    levelLabel: "Cadre",
    levels: ["Flexible", "Tolérable", "Rigide"]
  },
  {
    id: "technologies",
    name: "Technologies",
    icon: Cpu,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    items: [
      "IA", "Robotique", "IOT", "RV (Réalité Virtuelle)", "RA (Réalité Augmentée)",
      "Géolocalisation", "Big Data", "Plateformes", "Marketplaces", "Réseaux Sociaux",
      "Drones", "Technologie Verte", "ML (Machine Learning)", "DL (Deep Learning)",
      "IAG (IA Générative)", "Impression 3D", "Biotechnologie", "Blockchain", "Cloud"
    ]
  },
  {
    id: "revenue-model",
    name: "Modèle de Revenus",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    items: [
      "Abonnement (SaaS)", "Annonces (Publicité)", "Commission (Marketplace)",
      "Freemium", "Vente de Produits", "Licence", "Transaction", "Affiliation"
    ]
  },
  {
    id: "competitivite",
    name: "Compétitivité",
    icon: Target,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    items: [],
    levelLabel: "Intensité",
    levels: ["Basique", "Moyenne", "Agressive"]
  },
  {
    id: "impact-environnemental",
    name: "Impact Environnemental",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    items: [],
    levelLabel: "Niveau",
    levels: ["Faible", "Moyen", "Influent"]
  }
];

const StartupMontage = () => {
  const [expandedIngredients, setExpandedIngredients] = useState<string[]>(["industries", "technologies"]);

  const toggleIngredient = (id: string) => {
    setExpandedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1">
          Montage de Startup
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          Les Ingrédients du <span className="text-primary">Développement</span> de Startup
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les composants essentiels à considérer lors de la création et du développement de votre startup.
        </p>
      </div>

      {/* Central Hub Visualization */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            {/* Central Node */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-8"
            >
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border-2 border-primary/20">
                <div className="text-center">
                  <Lightbulb className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-sm font-bold">Développement</p>
                  <p className="text-xs text-muted-foreground">de Startup</p>
                </div>
              </div>
            </motion.div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
              {startupIngredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Collapsible
                    open={expandedIngredients.includes(ingredient.id)}
                    onOpenChange={() => toggleIngredient(ingredient.id)}
                  >
                    <Card className={`border-2 hover:border-primary/30 transition-all ${ingredient.bgColor}`}>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${ingredient.bgColor}`}>
                                <ingredient.icon className={`h-5 w-5 ${ingredient.color}`} />
                              </div>
                              <CardTitle className="text-sm">{ingredient.name}</CardTitle>
                            </div>
                            {expandedIngredients.includes(ingredient.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          {ingredient.levels ? (
                            <div className="flex flex-wrap gap-2">
                              {ingredient.levels.map((level) => (
                                <Badge 
                                  key={level} 
                                  variant="outline"
                                  className={`${ingredient.color.replace('text-', 'border-')} text-xs`}
                                >
                                  {level}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {ingredient.items.map((item) => (
                                <Badge 
                                  key={item} 
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Factory className="h-6 w-6 text-blue-500" />
              <h3 className="font-bold">25+ Industries</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              De la technologie à la santé, en passant par l'aéronautique et l'e-learning. 
              Chaque industrie a ses spécificités et opportunités.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-6 w-6 text-cyan-500" />
              <h3 className="font-bold">15+ Technologies</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              IA, Blockchain, IoT, Réalité Virtuelle... Les technologies qui transforment 
              les business models traditionnels.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-emerald-500" />
              <h3 className="font-bold">8+ Modèles de Revenus</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Abonnement, Freemium, Commission, Publicité... Choisissez le modèle 
              adapté à votre proposition de valeur.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Conseil de Montage</h4>
              <p className="text-muted-foreground">
                Une startup réussie combine généralement <strong>2-3 technologies clés</strong> appliquées 
                à une <strong>industrie spécifique</strong> avec un <strong>modèle de revenus adapté</strong>. 
                Ne vous dispersez pas : la focalisation est votre meilleur atout en phase de démarrage.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">Focus Industry</Badge>
                <Badge variant="outline">1-2 Technologies Core</Badge>
                <Badge variant="outline">1 Modèle de Revenus Principal</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupMontage;
