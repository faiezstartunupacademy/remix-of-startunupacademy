import { motion } from "framer-motion";
import { useState } from "react";
import { 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Quote,
  Users,
  Heart,
  TrendingUp,
  Search,
  Target,
  Eye,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// The 3 Rules of The Mom Test
const momTestRules = [
  {
    number: 1,
    rule: "Parlez de leur vie, pas de votre idée",
    description: "Ne mentionnez jamais votre idée au début. Concentrez-vous sur les problèmes, habitudes et frustrations de votre interlocuteur.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    number: 2,
    rule: "Demandez des exemples passés, pas des opinions futures",
    description: "Les gens mentent sur ce qu'ils feront. Demandez ce qu'ils ont fait. Les comportements passés prédisent les comportements futurs.",
    icon: Search,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    number: 3,
    rule: "Parlez moins, écoutez plus",
    description: "Si vous parlez plus de 20% du temps, vous pitchez. Posez des questions courtes et laissez-les développer.",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10"
  }
];

// Bad vs Good Questions
const questionExamples = [
  {
    bad: "Trouvez-vous que c'est une bonne idée ?",
    good: "Parlez-moi de la dernière fois où vous avez rencontré ce problème.",
    explanation: "Les opinions sont sans valeur. Seul le marché peut dire si une idée est bonne.",
    category: "Opinion"
  },
  {
    bad: "Achèteriez-vous un produit qui fait X ?",
    good: "Comment gérez-vous ce problème actuellement ? Combien cela vous coûte-t-il ?",
    explanation: "Les gens sont trop optimistes sur ce qu'ils feraient. Observez ce qu'ils font vraiment.",
    category: "Hypothétique"
  },
  {
    bad: "Combien paieriez-vous pour X ?",
    good: "Qu'avez-vous déjà essayé pour résoudre ce problème ? Combien avez-vous dépensé ?",
    explanation: "Le prix qu'ils paieraient est fictif. Ce qu'ils ont déjà payé est réel.",
    category: "Prix"
  },
  {
    bad: "À quoi ressemblerait votre produit idéal ?",
    good: "Pourquoi cela vous dérange-t-il ? Quelles sont les conséquences de ce problème ?",
    explanation: "Ils possèdent le problème, vous possédez la solution. Ne leur demandez pas de concevoir votre produit.",
    category: "Conception"
  },
  {
    bad: "Utiliseriez-vous notre app tous les jours ?",
    good: "Quand avez-vous utilisé pour la dernière fois un outil similaire ? À quelle fréquence ?",
    explanation: "Les promesses futures ne valent rien. Leurs habitudes actuelles disent tout.",
    category: "Usage"
  }
];

// The 3 Types of Bad Data
const badDataTypes = [
  {
    type: "Compliments",
    description: "\"J'adore !\" \"C'est génial !\" — Les compliments sont l'or des fous. Ils ne signifient rien.",
    example: "Eux: \"C'est vraiment cool, j'adore !\" — Cela signifie juste qu'ils veulent être polis.",
    solution: "Déviez le compliment et revenez aux faits concrets.",
    icon: ThumbsUp,
    color: "from-amber-500 to-orange-500"
  },
  {
    type: "Fluff (Vagues)",
    description: "Génériques, hypothétiques et promesses futures — \"Je le ferais probablement\" ne veut rien dire.",
    example: "Eux: \"D'habitude je...\" \"Je le ferais certainement...\" — Pas de données concrètes.",
    solution: "Ancrez les vagues dans des exemples spécifiques du passé.",
    icon: HelpCircle,
    color: "from-purple-500 to-indigo-500"
  },
  {
    type: "Idées",
    description: "Les clients adorent suggérer des fonctionnalités. Leurs idées ne sont pas votre roadmap.",
    example: "Eux: \"Et si vous ajoutiez une fonctionnalité qui...\" — Distraction potentielle.",
    solution: "Creusez la motivation derrière l'idée, pas l'idée elle-même.",
    icon: Lightbulb,
    color: "from-cyan-500 to-blue-500"
  }
];

// Conversation Examples
const conversationFail = [
  { speaker: "fils", text: "Maman, j'ai une idée de business — tu veux l'entendre ?", subtext: "Je vais exposer mon ego — ne blesse pas mes sentiments." },
  { speaker: "maman", text: "Bien sûr, mon chéri.", subtext: "Tu es mon fils, je suis prête à mentir pour te protéger." },
  { speaker: "fils", text: "Tu achèterais une app de recettes à 40€ ?", subtext: "Question hypothétique — tu sais ce que je veux entendre." },
  { speaker: "maman", text: "Oh oui, ça a l'air super !", subtext: "J'ai fait un compliment vide pour te faire plaisir." },
  { speaker: "fils", text: "Génial, merci !", subtext: "J'ai mal interprété cette conversation comme une validation." }
];

const conversationPass = [
  { speaker: "fils", text: "Salut maman, comment va ta nouvelle tablette ?", subtext: "Question neutre, pas de pitch." },
  { speaker: "maman", text: "Super ! Je l'utilise tous les jours.", subtext: "Réponse authentique sur son comportement réel." },
  { speaker: "fils", text: "Qu'as-tu fait dessus la dernière fois ?", subtext: "Demande d'un exemple spécifique et passé." },
  { speaker: "maman", text: "Je cherchais des hôtels pour nos vacances.", subtext: "Données concrètes sur un comportement réel." },
  { speaker: "fils", text: "Tu as utilisé une app pour ça ?", subtext: "Question de suivi pour creuser." },
  { speaker: "maman", text: "Non, juste Google. Je ne savais pas qu'il y avait des apps.", subtext: "Insight crucial : elle ne cherche pas dans l'App Store." }
];

// Key Insights
const keyInsights = [
  {
    insight: "Les gens mentent pour vous faire plaisir",
    detail: "Votre mère vous mentira le plus (parce qu'elle vous aime), mais tout le monde ment un peu.",
    icon: Heart
  },
  {
    insight: "C'est votre responsabilité de trouver la vérité",
    detail: "Ce n'est pas leur job de vous montrer la vérité. C'est le vôtre de la découvrir avec de bonnes questions.",
    icon: Target
  },
  {
    insight: "Les comportements > les opinions",
    detail: "Regardez ce qu'ils font, pas ce qu'ils disent qu'ils feraient. Les actions ne mentent pas.",
    icon: Eye
  },
  {
    insight: "Ils possèdent le problème, vous possédez la solution",
    detail: "Ne leur demandez pas quoi construire. Comprenez leur problème et créez votre propre solution visionnaire.",
    icon: Lightbulb
  }
];

// Commitment Signals
const commitmentSignals = [
  { type: "Temps", examples: ["Prêt à une démo", "Appel de suivi planifié", "Test du prototype"], strength: "Moyen" },
  { type: "Réputation", examples: ["Introduction à d'autres", "Témoignage public", "Participation case study"], strength: "Fort" },
  { type: "Argent", examples: ["Pré-commande", "Lettre d'intention", "Dépôt/Acompte"], strength: "Très Fort" }
];

const MomTest = () => {
  const [activeTab, setActiveTab] = useState("regles");

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium mb-4">
          <MessageCircle className="h-4 w-4" />
          <span>The Mom Test — Rob Fitzpatrick</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comment parler aux clients sans qu'ils vous mentent
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          L'art de poser les bonnes questions pour valider votre business avant d'investir du temps et de l'argent.
        </p>
      </motion.div>

      {/* Quote Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Quote className="h-10 w-10 text-rose-400 opacity-60 flex-shrink-0" />
              <div>
                <p className="text-xl italic mb-4 leading-relaxed">
                  "Personne ne devrait vous demander si votre idée est bonne. Pas même votre mère. C'est une mauvaise question qui invite tout le monde à vous mentir."
                </p>
                <p className="text-rose-400 font-semibold text-right">
                  — Rob Fitzpatrick, The Mom Test
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
          <TabsTrigger value="regles" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">3 Règles</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Exemples</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
        </TabsList>

        {/* 3 Rules Tab */}
        <TabsContent value="regles" className="space-y-8">
          {/* The 3 Rules */}
          <div className="grid md:grid-cols-3 gap-6">
            {momTestRules.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group border-2 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-4`}>
                      <item.icon className={`h-7 w-7 ${item.color}`} />
                    </div>
                    <Badge variant="secondary" className="mb-3">
                      Règle #{item.number}
                    </Badge>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {item.rule}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bad Data Types */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center">
              Les 3 types de mauvaises données
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Ces données vous donnent de faux positifs dangereux
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {badDataTypes.map((item, index) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}/10`}>
                          <item.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h4 className="font-bold text-lg">{item.type}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <div className="bg-muted/50 rounded-lg p-3 mb-4">
                        <p className="text-xs italic text-muted-foreground">
                          {item.example}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium">
                          {item.solution}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Insights Clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {keyInsights.map((item, index) => (
                  <motion.div
                    key={item.insight}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-background rounded-lg"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.insight}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Bonnes vs Mauvaises Questions
            </h3>
            <p className="text-muted-foreground">
              Transformez vos questions hypothétiques en questions qui révèlent la vérité
            </p>
          </div>

          <div className="space-y-4">
            {questionExamples.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2">
                      {/* Bad Question */}
                      <div className="p-6 bg-destructive/5 border-r border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-5 w-5 text-destructive" />
                          <Badge variant="destructive" className="text-xs">
                            {item.category} — Mauvaise
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-destructive">
                          "{item.bad}"
                        </p>
                      </div>
                      {/* Good Question */}
                      <div className="p-6 bg-emerald-500/5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                          <Badge className="text-xs bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">
                            Bonne Alternative
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          "{item.good}"
                        </p>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-muted/30 border-t border-border">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Rule of Thumb */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Règle d'Or</h4>
                  <p className="text-sm text-muted-foreground">
                    Si vous pouvez répondre vous-même à la question sans parler au client, c'est une mauvaise question. 
                    Cherchez des informations que seul le client peut vous donner.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Failing Conversation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-destructive" />
                <h3 className="text-xl font-bold text-destructive">
                  ❌ Échec du Mom Test
                </h3>
              </div>
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-6 space-y-4">
                  {conversationFail.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg ${
                        line.speaker === 'fils' 
                          ? 'bg-blue-500/10 ml-4' 
                          : 'bg-rose-500/10 mr-4'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">
                          {line.speaker === 'fils' ? '👨 Fils' : '👩 Maman'}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">{line.text}</p>
                      <p className="text-xs text-muted-foreground italic">
                        {line.subtext}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
              <div className="flex items-start gap-2 p-4 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">
                  <strong>Résultat :</strong> Faux positif. Le fils pense avoir validé son idée alors qu'il n'a récolté que des compliments vides.
                </p>
              </div>
            </div>

            {/* Passing Conversation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <h3 className="text-xl font-bold text-emerald-600">
                  ✅ Réussite du Mom Test
                </h3>
              </div>
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-6 space-y-4">
                  {conversationPass.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg ${
                        line.speaker === 'fils' 
                          ? 'bg-blue-500/10 ml-4' 
                          : 'bg-emerald-500/10 mr-4'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">
                          {line.speaker === 'fils' ? '👨 Fils' : '👩 Maman'}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">{line.text}</p>
                      <p className="text-xs text-muted-foreground italic">
                        {line.subtext}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
              <div className="flex items-start gap-2 p-4 bg-emerald-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  <strong>Résultat :</strong> Données concrètes. Le fils découvre que sa mère ne cherche pas d'apps dans l'App Store — un insight crucial pour sa stratégie marketing.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Commitment Tab */}
        <TabsContent value="engagement" className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Signaux d'Engagement
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les mots ne suffisent pas. Cherchez des engagements concrets qui prouvent l'intérêt réel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {commitmentSignals.map((signal, index) => (
              <motion.div
                key={signal.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{signal.type}</CardTitle>
                      <Badge variant={
                        signal.strength === "Très Fort" ? "default" :
                        signal.strength === "Fort" ? "secondary" : "outline"
                      }>
                        {signal.strength}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {signal.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Advancement Currency */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <TrendingUp className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">
                  Monnaies d'Avancement
                </h4>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Si une réunion ne se termine pas par un engagement concret, elle a échoué. 
                  Demandez toujours quelque chose de mesurable.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-background rounded-lg">
                  <h5 className="font-semibold mb-2 text-emerald-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Bon signe
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    "Je peux te présenter à notre directeur des achats la semaine prochaine."
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h5 className="font-semibold mb-2 text-destructive flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Mauvais signe
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    "C'est super ! Tiens-moi au courant de l'avancement."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Récapitulatif Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                    <ThumbsUp className="h-4 w-4" />
                    À faire
                  </h5>
                  <ul className="space-y-2">
                    {[
                      "Parler de leur vie, pas de votre idée",
                      "Demander des exemples passés spécifiques",
                      "Chercher les comportements, pas les opinions",
                      "Creuser les motivations derrière les réponses",
                      "Demander des engagements concrets"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                    <ThumbsDown className="h-4 w-4" />
                    À éviter
                  </h5>
                  <ul className="space-y-2">
                    {[
                      "Pitcher votre idée trop tôt",
                      "Demander si c'est une bonne idée",
                      "Poser des questions hypothétiques",
                      "Prendre les compliments pour des validations",
                      "Parler plus de 20% du temps"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MomTest;
