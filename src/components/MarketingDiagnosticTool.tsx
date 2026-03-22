import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, 
  Download, Users, Target, BarChart3, Megaphone, Zap, TrendingUp,
  Building2, Lightbulb, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DiagnosticQuestion {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  question: string;
  options: {
    value: number;
    label: string;
    description: string;
  }[];
}

const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "structure",
    category: "Structure Organisationnelle",
    categoryIcon: Building2,
    question: "Comment est structurée votre équipe marketing ?",
    options: [
      { value: 1, label: "Pas d'équipe dédiée", description: "Le marketing est géré ad-hoc par les fondateurs" },
      { value: 2, label: "Une personne polyvalente", description: "Un profil généraliste qui gère tout le marketing" },
      { value: 3, label: "Équipe émergente", description: "2-3 personnes avec des rôles partiellement définis" },
      { value: 4, label: "Équipe structurée", description: "Équipe avec rôles clairs (Growth, Content, Brand)" },
      { value: 5, label: "Organisation matricielle", description: "Équipes spécialisées avec squads cross-fonctionnels" },
    ],
  },
  {
    id: "alignment",
    category: "Alignement Stratégique",
    categoryIcon: Target,
    question: "Comment le marketing est-il aligné avec les objectifs business ?",
    options: [
      { value: 1, label: "Aucun alignement formel", description: "Le marketing opère de façon indépendante" },
      { value: 2, label: "Alignement ponctuel", description: "Réunions occasionnelles avec la direction" },
      { value: 3, label: "OKRs partagés", description: "Objectifs trimestriels connectés à la stratégie" },
      { value: 4, label: "Revenue marketing", description: "KPIs directement liés aux revenus et pipeline" },
      { value: 5, label: "Growth loops intégrés", description: "Marketing intégré dans les boucles de croissance produit" },
    ],
  },
  {
    id: "data",
    category: "Data & Analytics",
    categoryIcon: BarChart3,
    question: "Quel est votre niveau de maturité data marketing ?",
    options: [
      { value: 1, label: "Intuition pure", description: "Décisions basées sur le ressenti" },
      { value: 2, label: "Métriques basiques", description: "Suivi de trafic et vanity metrics" },
      { value: 3, label: "Attribution simple", description: "Tracking des conversions par canal" },
      { value: 4, label: "Attribution multi-touch", description: "Modèles d'attribution avancés et LTV" },
      { value: 5, label: "Marketing prédictif", description: "ML pour scoring et optimisation automatique" },
    ],
  },
  {
    id: "acquisition",
    category: "Acquisition",
    categoryIcon: TrendingUp,
    question: "Comment acquérez-vous vos clients ?",
    options: [
      { value: 1, label: "Bouche-à-oreille uniquement", description: "Croissance organique non structurée" },
      { value: 2, label: "1-2 canaux testés", description: "Expérimentation limitée sur quelques canaux" },
      { value: 3, label: "Multi-canal optimisé", description: "3-5 canaux avec tests et optimisation" },
      { value: 4, label: "Growth engine", description: "Système reproductible avec CAC optimisé" },
      { value: 5, label: "Viral loops + PLG", description: "Croissance virale et product-led intégrés" },
    ],
  },
  {
    id: "content",
    category: "Content & Brand",
    categoryIcon: Megaphone,
    question: "Quelle est votre stratégie de contenu et de marque ?",
    options: [
      { value: 1, label: "Pas de stratégie", description: "Production de contenu occasionnelle et réactive" },
      { value: 2, label: "Contenu régulier", description: "Blog et réseaux sociaux actifs mais non mesurés" },
      { value: 3, label: "Content machine", description: "Calendrier éditorial et distribution structurée" },
      { value: 4, label: "Thought leadership", description: "Positionnement expert reconnu dans l'industrie" },
      { value: 5, label: "Media company", description: "L'audience est un actif stratégique de l'entreprise" },
    ],
  },
  {
    id: "experimentation",
    category: "Expérimentation",
    categoryIcon: Zap,
    question: "Comment pratiquez-vous l'expérimentation marketing ?",
    options: [
      { value: 1, label: "Aucune", description: "Campagnes lancées sans hypothèses ni tests" },
      { value: 2, label: "Tests A/B ponctuels", description: "Quelques tests sur les emails et landing pages" },
      { value: 3, label: "Process ICE", description: "Backlog d'expériences priorisées par impact" },
      { value: 4, label: "Culture test & learn", description: "Minimum 10 expériences/semaine avec learnings partagés" },
      { value: 5, label: "Experimentation platform", description: "Infrastructure de test automatisée à grande échelle" },
    ],
  },
  {
    id: "tools",
    category: "Stack Technologique",
    categoryIcon: Lightbulb,
    question: "Quelle est la maturité de votre stack marketing ?",
    options: [
      { value: 1, label: "Outils basiques", description: "Spreadsheets et outils gratuits uniquement" },
      { value: 2, label: "Point solutions", description: "Outils spécialisés non connectés entre eux" },
      { value: 3, label: "Stack intégré", description: "CRM, analytics et automation connectés" },
      { value: 4, label: "CDP + orchestration", description: "Customer Data Platform avec journeys automatisés" },
      { value: 5, label: "AI-powered stack", description: "IA génératives et prédictives intégrées partout" },
    ],
  },
  {
    id: "team_skills",
    category: "Compétences Équipe",
    categoryIcon: Users,
    question: "Comment évaluez-vous les compétences de votre équipe ?",
    options: [
      { value: 1, label: "Généralistes juniors", description: "Profils en formation avec peu d'expérience" },
      { value: 2, label: "Mix généralistes/spécialistes", description: "Quelques expertises mais gaps importants" },
      { value: 3, label: "T-shaped marketers", description: "Profils avec expertise profonde + compétences larges" },
      { value: 4, label: "Experts spécialisés", description: "Experts reconnus dans chaque discipline" },
      { value: 5, label: "Growth engineers", description: "Profils hybrides marketing + tech + data" },
    ],
  },
];

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  recommendation: string;
}

const getLevel = (percentage: number): string => {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Avancé";
  if (percentage >= 40) return "Intermédiaire";
  if (percentage >= 20) return "Émergent";
  return "Initial";
};

const getOverallLevel = (percentage: number): { level: string; description: string; color: string } => {
  if (percentage >= 80) return { 
    level: "Licorne Ready", 
    description: "Votre organisation marketing est au niveau des meilleures scale-ups. Focus sur l'innovation et l'expansion.",
    color: "from-violet-500 to-purple-600"
  };
  if (percentage >= 60) return { 
    level: "Scale-up Mode", 
    description: "Base solide en place. Priorité à l'automatisation et à l'optimisation des processus.",
    color: "from-blue-500 to-cyan-600"
  };
  if (percentage >= 40) return { 
    level: "Growth Ready", 
    description: "Fondations établies. Focus sur la structuration des équipes et l'alignement stratégique.",
    color: "from-green-500 to-emerald-600"
  };
  if (percentage >= 20) return { 
    level: "Early Stage", 
    description: "Organisation émergente. Priorité à l'embauche des premiers profils clés et au choix des canaux.",
    color: "from-orange-500 to-amber-600"
  };
  return { 
    level: "Pre-Seed", 
    description: "Phase d'amorçage. Focus sur le product-market fit avant d'investir massivement en marketing.",
    color: "from-red-500 to-rose-600"
  };
};

const getRecommendation = (categoryId: string, score: number): string => {
  const recommendations: Record<string, Record<number, string>> = {
    structure: {
      1: "Définissez d'abord vos canaux prioritaires avant de recruter",
      2: "Identifiez les gaps critiques pour votre prochain recrutement",
      3: "Clarifiez les rôles et responsabilités avec une matrice RACI",
      4: "Introduisez des squads cross-fonctionnels pour plus d'agilité",
      5: "Développez le coaching et le leadership au sein des équipes",
    },
    alignment: {
      1: "Implémentez des OKRs marketing alignés sur les objectifs business",
      2: "Créez un dashboard partagé avec les métriques clés",
      3: "Passez à des métriques de revenue marketing (pipeline, ARR)",
      4: "Intégrez le marketing dans les product squads",
      5: "Développez une culture de growth commune à toute l'entreprise",
    },
    data: {
      1: "Commencez par tracker les conversions de base (GA4, Mixpanel)",
      2: "Implémentez le tracking UTM et l'attribution par canal",
      3: "Déployez un modèle d'attribution multi-touch",
      4: "Calculez LTV/CAC par segment et canal",
      5: "Explorez le marketing prédictif et les modèles ML",
    },
    acquisition: {
      1: "Testez systématiquement les 19 canaux de traction",
      2: "Appliquez le framework Bullseye pour identifier vos top 3",
      3: "Optimisez le CAC et les taux de conversion par canal",
      4: "Construisez des growth loops reproductibles",
      5: "Développez les effets de réseau et le product-led growth",
    },
    content: {
      1: "Définissez votre positionnement et votre territoire éditorial",
      2: "Créez un calendrier éditorial avec distribution structurée",
      3: "Développez des formats signature et du thought leadership",
      4: "Construisez une audience propriétaire (newsletter, communauté)",
      5: "Monétisez votre audience comme un actif stratégique",
    },
    experimentation: {
      1: "Lancez vos premières expériences A/B sur les landing pages",
      2: "Implémentez le framework ICE pour prioriser vos tests",
      3: "Créez une culture de test avec des revues hebdomadaires",
      4: "Augmentez le rythme à 10+ expériences par semaine",
      5: "Automatisez les tests avec une experimentation platform",
    },
    tools: {
      1: "Choisissez un CRM adapté à votre stade (HubSpot Free, Pipedrive)",
      2: "Intégrez vos outils avec Zapier ou Make",
      3: "Déployez une stack cohérente avec des intégrations natives",
      4: "Implémentez un CDP pour unifier vos données clients",
      5: "Intégrez l'IA dans vos workflows marketing",
    },
    team_skills: {
      1: "Investissez dans la formation continue de l'équipe",
      2: "Recrutez des profils avec une expertise spécifique clé",
      3: "Développez des T-shaped marketers polyvalents",
      4: "Attirez des experts reconnus dans l'industrie",
      5: "Construisez une équipe de growth engineers hybrides",
    },
  };
  return recommendations[categoryId]?.[score] || "Continuez à développer cette dimension";
};

const MarketingDiagnosticTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentStep + 1) / diagnosticQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const question = diagnosticQuestions[currentStep];
    setAnswers(prev => ({ ...prev, [question.id]: value }));
    
    if (currentStep < diagnosticQuestions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateResults = (): { categoryScores: CategoryScore[]; totalScore: number; totalMaxScore: number } => {
    const categoryScores: CategoryScore[] = diagnosticQuestions.map(q => {
      const score = answers[q.id] || 0;
      const maxScore = 5;
      const percentage = (score / maxScore) * 100;
      return {
        category: q.category,
        score,
        maxScore,
        percentage,
        level: getLevel(percentage),
        recommendation: getRecommendation(q.id, score),
      };
    });

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const totalMaxScore = diagnosticQuestions.length * 5;

    return { categoryScores, totalScore, totalMaxScore };
  };

  const exportResults = () => {
    const { categoryScores, totalScore, totalMaxScore } = calculateResults();
    const overallPercentage = (totalScore / totalMaxScore) * 100;
    const overallLevel = getOverallLevel(overallPercentage);

    const content = `
DIAGNOSTIC ORGANISATION MARKETING
================================
Date: ${new Date().toLocaleDateString('fr-FR')}

RÉSULTAT GLOBAL
---------------
Niveau: ${overallLevel.level}
Score: ${totalScore}/${totalMaxScore} (${overallPercentage.toFixed(0)}%)
${overallLevel.description}

DÉTAIL PAR CATÉGORIE
--------------------
${categoryScores.map(cs => `
${cs.category}
Score: ${cs.score}/${cs.maxScore} - ${cs.level}
Recommandation: ${cs.recommendation}
`).join('')}

PROCHAINES ÉTAPES PRIORITAIRES
------------------------------
${categoryScores
  .sort((a, b) => a.percentage - b.percentage)
  .slice(0, 3)
  .map((cs, i) => `${i + 1}. ${cs.category}: ${cs.recommendation}`)
  .join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagnostic-marketing.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetDiagnostic = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const { categoryScores, totalScore, totalMaxScore } = calculateResults();
    const overallPercentage = (totalScore / totalMaxScore) * 100;
    const overallLevel = getOverallLevel(overallPercentage);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2">Résultats du Diagnostic</h2>
          <p className="text-muted-foreground">Analyse de votre organisation marketing</p>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className={`bg-gradient-to-br ${overallLevel.color} text-white`}>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Award className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-4xl font-black mb-2">{overallLevel.level}</h3>
                <p className="text-xl opacity-90 mb-4">
                  Score: {totalScore}/{totalMaxScore} ({overallPercentage.toFixed(0)}%)
                </p>
                <p className="max-w-xl mx-auto opacity-90">
                  {overallLevel.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryScores.map((cs, index) => {
            const Icon = diagnosticQuestions[index].categoryIcon;
            return (
              <motion.div
                key={cs.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{cs.category}</h4>
                          <Badge variant={cs.percentage >= 60 ? "default" : "secondary"}>
                            {cs.level}
                          </Badge>
                        </div>
                        <Progress value={cs.percentage} className="h-2 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {cs.recommendation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Priority Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Actions Prioritaires
            </CardTitle>
            <CardDescription>
              Focus sur les 3 dimensions avec le plus grand potentiel d'amélioration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryScores
                .sort((a, b) => a.percentage - b.percentage)
                .slice(0, 3)
                .map((cs, index) => (
                  <div key={cs.category} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{cs.category}</h4>
                      <p className="text-sm text-muted-foreground">{cs.recommendation}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={exportResults} variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
          <Button onClick={resetDiagnostic} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Refaire le diagnostic
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = diagnosticQuestions[currentStep];
  const CategoryIcon = currentQuestion.categoryIcon;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Diagnostic Organisation Marketing</span>
        </div>
        <h2 className="text-3xl font-black mb-2">Évaluez votre structure marketing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          8 questions pour identifier vos forces et axes d'amélioration, avec des recommandations personnalisées basées sur les meilleures pratiques des scale-ups.
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1} sur {diagnosticQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <CategoryIcon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline">{currentQuestion.category}</Badge>
              </div>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString()} 
                onValueChange={(val) => handleAnswer(parseInt(val))}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="flex items-start gap-4 p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem 
                        value={option.value.toString()} 
                        id={`option-${option.value}`}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-medium block mb-1">{option.label}</span>
                        <span className="text-sm text-muted-foreground">{option.description}</span>
                      </div>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        {currentStep === diagnosticQuestions.length - 1 && answers[currentQuestion.id] && (
          <Button onClick={() => setShowResults(true)}>
            Voir les résultats
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MarketingDiagnosticTool;
