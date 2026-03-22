import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Users, Sparkles, CheckCircle2, ArrowRight, RotateCcw, 
  Download, Lightbulb, Crosshair, Award, Layers, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface PositioningComponent {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  question: string;
  description: string;
  tips: string[];
  examples: string[];
  placeholder: string;
}

const positioningComponents: PositioningComponent[] = [
  {
    id: "competitive_alternatives",
    title: "Alternatives Compétitives",
    subtitle: "Que feraient vos clients si vous n'existiez pas ?",
    icon: Crosshair,
    color: "from-red-500 to-rose-600",
    question: "Quelles sont les vraies alternatives compétitives à votre produit ?",
    description: "Ne pensez pas uniquement aux concurrents directs. Considérez toutes les façons dont vos clients résolvent leur problème aujourd'hui : ne rien faire, solutions manuelles, produits adjacents, etc.",
    tips: [
      "Listez comment vos clients résolvent ce problème AVANT de vous connaître",
      "Incluez les alternatives 'non-technologiques' (Excel, papier, ne rien faire)",
      "Pensez aux concurrents indirects qui répondent au même besoin",
    ],
    examples: [
      "Excel/Google Sheets (pour un outil de gestion de projet)",
      "Agences externes (pour un outil de marketing automation)",
      "Emails + réunions (pour un outil de collaboration)",
    ],
    placeholder: "Ex: Notre alternative principale est Excel que les équipes utilisent pour suivre leurs projets, ainsi que des outils gratuits comme Trello...",
  },
  {
    id: "unique_attributes",
    title: "Attributs Uniques",
    subtitle: "Qu'avez-vous que les alternatives n'ont pas ?",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
    question: "Quels sont vos attributs ou capacités uniques par rapport aux alternatives ?",
    description: "Focalisez-vous sur ce qui vous différencie vraiment. Ce doivent être des caractéristiques que vos alternatives ne peuvent pas facilement copier ou n'ont pas.",
    tips: [
      "Soyez spécifique et factuel, pas générique ('meilleure qualité' ne compte pas)",
      "Ces attributs doivent être directement liés à vos alternatives compétitives",
      "Limitez-vous à 2-4 attributs vraiment différenciants",
    ],
    examples: [
      "IA native qui automatise 80% des tâches répétitives",
      "Intégration bidirectionnelle temps réel avec Salesforce",
      "Interface no-code permettant de créer des workflows en 5 min",
    ],
    placeholder: "Ex: Nous sommes les seuls à offrir une IA qui génère automatiquement les rapports d'analyse à partir des données brutes...",
  },
  {
    id: "value",
    title: "Valeur pour le Client",
    subtitle: "Quel bénéfice concret en découle ?",
    icon: Award,
    color: "from-green-500 to-emerald-600",
    question: "Quelle valeur ces attributs uniques apportent-ils à vos clients ?",
    description: "Traduisez vos attributs en bénéfices business mesurables. Les clients n'achètent pas des fonctionnalités, ils achètent des résultats.",
    tips: [
      "Quantifiez la valeur quand c'est possible (temps gagné, % d'amélioration)",
      "Focalisez sur les outcomes, pas les outputs",
      "Reliez chaque attribut unique à un bénéfice spécifique",
    ],
    examples: [
      "Réduction de 60% du temps passé sur les tâches administratives",
      "Augmentation de 35% du taux de conversion des leads",
      "Time-to-value de 48h au lieu de 3 mois d'implémentation",
    ],
    placeholder: "Ex: Grâce à notre IA, les équipes marketing gagnent en moyenne 10h par semaine qu'elles peuvent consacrer à des tâches stratégiques...",
  },
  {
    id: "best_fit_customers",
    title: "Clients Best-Fit",
    subtitle: "Qui valorise le plus votre différenciation ?",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    question: "Quelles sont les caractéristiques de vos clients idéaux ?",
    description: "Vos meilleurs clients sont ceux pour qui votre valeur unique résonne le plus fort. Définissez-les par leurs caractéristiques, pas par des données démographiques.",
    tips: [
      "Décrivez-les par leurs comportements et situations, pas juste leur taille",
      "Pensez aux 'triggers' qui les poussent à chercher une solution",
      "Identifiez ce qui fait qu'ils choisissent VOUS plutôt qu'une alternative",
    ],
    examples: [
      "Équipes marketing de 5-15 personnes dans des scale-ups B2B SaaS",
      "Entreprises qui viennent de lever des fonds et doivent scaler rapidement",
      "Organisations avec des données fragmentées dans 5+ outils différents",
    ],
    placeholder: "Ex: Nos clients idéaux sont des scale-ups B2B en phase de croissance (Series A-B) qui ont une équipe marketing de 5-20 personnes et qui...",
  },
  {
    id: "market_category",
    title: "Catégorie de Marché",
    subtitle: "Dans quelle catégorie jouez-vous ?",
    icon: Layers,
    color: "from-orange-500 to-amber-600",
    question: "Quelle catégorie de marché décrit le mieux votre positionnement ?",
    description: "La catégorie active un contexte dans l'esprit du client. Vous pouvez dominer une catégorie existante, en créer une nouvelle, ou vous positionner dans une sous-catégorie.",
    tips: [
      "La catégorie doit être immédiatement compréhensible pour vos clients",
      "Considérez : catégorie existante, sous-catégorie, ou nouvelle catégorie",
      "La catégorie doit mettre en valeur votre différenciation",
    ],
    examples: [
      "Revenue Intelligence Platform (nouvelle catégorie)",
      "CRM pour startups B2B (sous-catégorie)",
      "Alternative à Salesforce pour PME (repositionnement)",
    ],
    placeholder: "Ex: Nous nous positionnons comme une 'Customer Success Platform pour les entreprises SaaS' car cette catégorie met en avant...",
  },
];

const PositioningTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentStep + 1) / positioningComponents.length) * 100;
  const currentComponent = positioningComponents[currentStep];

  const calculateProgress = () => {
    const filledCount = Object.values(data).filter(v => v.trim().length > 20).length;
    return Math.round((filledCount / positioningComponents.length) * 100);
  };

  const handleNext = () => {
    if (currentStep < positioningComponents.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetTool = () => {
    setCurrentStep(0);
    setData({});
    setShowResults(false);
  };

  const exportPositioning = () => {
    const content = `
POSITIONNEMENT PRODUIT
======================
Méthode April Dunford - Obviously Awesome
Date: ${new Date().toLocaleDateString('fr-FR')}

${positioningComponents.map(comp => `
${comp.title.toUpperCase()}
${'-'.repeat(comp.title.length)}
${data[comp.id] || 'Non renseigné'}
`).join('\n')}

STATEMENT DE POSITIONNEMENT
---------------------------
Pour ${data.best_fit_customers || '[clients best-fit]'}
qui ${data.competitive_alternatives ? 'utilisent actuellement ' + data.competitive_alternatives.split('.')[0] : '[alternative actuelle]'},
[Votre produit] est une ${data.market_category || '[catégorie de marché]'}
qui ${data.unique_attributes || '[attributs uniques]'}.
Contrairement aux alternatives, nous ${data.value || '[valeur unique]'}.

PROCHAINES ÉTAPES
-----------------
1. Validez ce positionnement avec 5-10 clients best-fit
2. Testez différentes formulations dans vos landing pages
3. Alignez toute l'équipe sur ce positionnement
4. Révisez tous les 6-12 mois ou après un pivot significatif
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'positionnement-produit.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const useExample = (example: string) => {
    setData(prev => ({
      ...prev,
      [currentComponent.id]: example
    }));
  };

  if (showResults) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2">Votre Positionnement</h2>
          <p className="text-muted-foreground">Synthèse de vos 5 composantes selon la méthode April Dunford</p>
        </div>

        {/* Positioning Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Statement de Positionnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Pour <strong>{data.best_fit_customers?.split('.')[0] || '[clients best-fit]'}</strong>
                {' '}qui utilisent actuellement <strong>{data.competitive_alternatives?.split('.')[0] || '[alternatives]'}</strong>,
                {' '}notre produit est une <strong>{data.market_category?.split('.')[0] || '[catégorie]'}</strong>
                {' '}qui offre <strong>{data.unique_attributes?.split('.')[0] || '[attributs uniques]'}</strong>.
                {' '}Contrairement aux alternatives, nous permettons <strong>{data.value?.split('.')[0] || '[valeur unique]'}</strong>.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Component Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positioningComponents.map((comp, index) => {
            const Icon = comp.icon;
            return (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${comp.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base">{comp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {data[comp.id] || 'Non renseigné'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Flux de Positionnement</CardTitle>
            <CardDescription>Les 5 composantes s'enchaînent de manière logique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {positioningComponents.map((comp, index) => (
                <div key={comp.id} className="flex items-center">
                  <Badge variant={data[comp.id] ? "default" : "outline"} className="whitespace-nowrap">
                    {index + 1}. {comp.title}
                  </Badge>
                  {index < positioningComponents.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={exportPositioning} variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Exporter le positionnement
          </Button>
          <Button onClick={resetTool} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
        </div>
      </div>
    );
  }

  const ComponentIcon = currentComponent.icon;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Méthode April Dunford</span>
        </div>
        <h2 className="text-3xl font-black mb-2">Outil de Positionnement</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Construisez votre positionnement produit avec les 5 composantes du framework "Obviously Awesome" d'April Dunford.
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Composante {currentStep + 1} sur {positioningComponents.length}</span>
          <span>Complétion: {calculateProgress()}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center gap-2 flex-wrap">
        {positioningComponents.map((comp, index) => {
          const Icon = comp.icon;
          const isCompleted = data[comp.id]?.trim().length > 20;
          const isCurrent = index === currentStep;
          return (
            <button
              key={comp.id}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                isCurrent 
                  ? 'bg-primary text-primary-foreground' 
                  : isCompleted 
                    ? 'bg-green-500/10 text-green-600 border border-green-500/30' 
                    : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {isCompleted && !isCurrent && <CheckCircle2 className="h-4 w-4" />}
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{comp.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current Component Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentComponent.color} flex items-center justify-center flex-shrink-0`}>
                  <ComponentIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">{currentStep + 1}/5</Badge>
                  <CardTitle className="text-2xl">{currentComponent.title}</CardTitle>
                  <CardDescription className="text-base mt-1">{currentComponent.subtitle}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">{currentComponent.question}</h4>
                <p className="text-sm text-muted-foreground">{currentComponent.description}</p>
              </div>

              <Textarea
                value={data[currentComponent.id] || ''}
                onChange={(e) => setData(prev => ({ ...prev, [currentComponent.id]: e.target.value }))}
                placeholder={currentComponent.placeholder}
                rows={4}
                className="resize-none"
              />

              {/* Tips */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h5 className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Conseils
                </h5>
                <ul className="space-y-2">
                  {currentComponent.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h5 className="font-semibold text-sm mb-3">Exemples (cliquez pour utiliser)</h5>
                <div className="flex flex-wrap gap-2">
                  {currentComponent.examples.map((example, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => useExample(example)}
                    >
                      {example.length > 50 ? example.substring(0, 50) + '...' : example}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>
        <Button onClick={handleNext}>
          {currentStep === positioningComponents.length - 1 ? 'Voir le résultat' : 'Suivant'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PositioningTool;
