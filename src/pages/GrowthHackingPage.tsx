import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Clock, BookOpen, Users, PlayCircle, FileText, 
  TrendingUp, Users2, DollarSign, BarChart3, Repeat, Heart, ChevronDown,
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Zap, Target, Presentation
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrowthHackingPresentation from "@/components/GrowthHackingPresentation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { growthHackingProgram, aarrrFramework, growthPillars, growthTactics } from "@/data/growthHackingData";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { growthHackingSlides as ghSlidesData } from "@/data/growthHackingSlidesData";

// Slides data for the Growth Hacking course
const slides = [
  {
    id: 1,
    title: "Le Growth Hacking",
    subtitle: "8 semaines pour doubler le nombre de vos prospects",
    bgClass: "gradient-hero",
    icon: <Rocket className="h-16 w-16" />,
    content: (
      <div className="text-center text-white">
        <p className="text-xl opacity-80 mt-6">Basé sur le best-seller de Frédéric Canevet, Grégoire Gambatto & Olivier Zongo-Martin</p>
      </div>
    )
  },
  {
    id: 2,
    title: "Qu'est-ce que le Growth Hacking ?",
    icon: <Target className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
          Le Growth Hacking est une méthodologie marketing axée sur la croissance rapide, combinant créativité, analyse de données et technologie pour acquérir et fidéliser des clients de manière efficiente.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Croissance rapide", desc: "Focus sur des résultats mesurables et une croissance exponentielle", icon: <TrendingUp className="h-8 w-8" /> },
            { title: "Data-Driven", desc: "Décisions basées sur l'analyse de données et les métriques", icon: <BarChart3 className="h-8 w-8" /> },
            { title: "Expérimentation", desc: "Tests continus et itérations rapides pour optimiser", icon: <Zap className="h-8 w-8" /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Le Framework AARRR",
    subtitle: "Les 5 étapes du tunnel de conversion",
    icon: <BarChart3 className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-4">
        {aarrrFramework.map((step, index) => (
          <motion.div
            key={step.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`${step.color} w-full md:w-20 flex items-center justify-center py-4 md:py-0`}>
                  <span className="text-3xl font-bold text-white">{step.letter}</span>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-bold mb-1">{step.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 4,
    title: "Acquisition",
    subtitle: "Comment attirer de nouveaux visiteurs ?",
    icon: <Users className="h-12 w-12 text-blue-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "SEO & Content Marketing", desc: "Créer du contenu de qualité pour attirer du trafic organique", tools: ["Blog", "SEO", "Mots-clés"] },
            { title: "Publicité Payante", desc: "Investir dans des campagnes publicitaires ciblées", tools: ["Google Ads", "Facebook Ads", "LinkedIn Ads"] },
            { title: "Réseaux Sociaux", desc: "Développer une présence active sur les réseaux sociaux", tools: ["LinkedIn", "Twitter", "Instagram"] },
            { title: "Partenariats", desc: "Collaborer avec d'autres entreprises pour élargir sa portée", tools: ["Co-marketing", "Affiliation", "Guest posting"] },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-muted/50 border"
            >
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Activation",
    subtitle: "Comment transformer les visiteurs en utilisateurs actifs ?",
    icon: <Zap className="h-12 w-12 text-amber-500" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
          L'activation consiste à faire vivre une première expérience positive à vos utilisateurs pour qu'ils comprennent la valeur de votre produit.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Onboarding Efficace", desc: "Guider l'utilisateur vers le 'Aha Moment' le plus rapidement possible", metric: "Taux de complétion onboarding" },
            { title: "Première Valeur", desc: "Démontrer la valeur du produit dès la première utilisation", metric: "Time to First Value" },
            { title: "Réduction des Frictions", desc: "Éliminer tous les obstacles à l'utilisation du produit", metric: "Taux d'abandon" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20"
            >
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">{item.metric}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Rétention",
    subtitle: "Comment fidéliser vos utilisateurs ?",
    icon: <Heart className="h-12 w-12 text-rose-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-rose-500/5 border-rose-500/20">
            <CardHeader>
              <CardTitle className="text-rose-600">Pourquoi la rétention est cruciale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Acquérir un nouveau client coûte 5x plus cher que de retenir un client existant",
                "Une augmentation de 5% de la rétention peut augmenter les profits de 25-95%",
                "Les clients fidèles dépensent 67% de plus que les nouveaux",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stratégies de rétention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Email nurturing", desc: "Séquences d'emails personnalisées" },
                { name: "Notifications push", desc: "Rappels et mises à jour pertinentes" },
                { name: "Programme de fidélité", desc: "Récompenses pour l'engagement" },
                { name: "Support proactif", desc: "Anticiper les problèmes clients" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <span className="font-medium text-sm">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Referral",
    subtitle: "Comment transformer vos clients en ambassadeurs ?",
    icon: <Users2 className="h-12 w-12 text-green-500" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
          Le bouche-à-oreille est le canal d'acquisition le plus puissant. Les recommandations de clients existants ont un taux de conversion 4x supérieur.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Programme de parrainage", desc: "Offrir des récompenses pour chaque nouveau client apporté", example: "Dropbox: 500MB gratuit par parrainage" },
            { title: "Contenu viral", desc: "Créer du contenu facilement partageable", example: "Hotmail: signature 'Get your free email'" },
            { title: "Expérience exceptionnelle", desc: "Dépasser les attentes pour générer du bouche-à-oreille naturel", example: "Zappos: service client légendaire" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-xl bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20"
            >
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <p className="text-xs italic text-green-600">{item.example}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Revenue",
    subtitle: "Comment monétiser efficacement ?",
    icon: <DollarSign className="h-12 w-12 text-emerald-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Optimisation du pricing", desc: "Tester différentes stratégies de prix pour maximiser les revenus", metrics: ["ARPU", "LTV", "Prix optimal"] },
            { title: "Upselling & Cross-selling", desc: "Proposer des produits complémentaires ou premium", metrics: ["Panier moyen", "Taux d'upsell"] },
            { title: "Réduction du churn", desc: "Identifier et adresser les raisons de départ", metrics: ["Taux de churn", "MRR"] },
            { title: "Expansion revenue", desc: "Augmenter les revenus des clients existants", metrics: ["Net Revenue Retention", "Expansion MRR"] },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-muted/50 border"
            >
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.metrics.map((m) => (
                  <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Les 3 piliers du Growth Hacking",
    icon: <Rocket className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {growthPillars.map((pillar, index) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="text-4xl mb-3">{pillar.icon}</div>
                  <CardTitle>{pillar.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 text-center">La synergie des trois piliers</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-background/60 text-center">
                <span className="font-medium">Produit + Marketing</span>
                <p className="text-muted-foreground mt-1">= Acquisition optimale</p>
              </div>
              <div className="p-4 rounded-xl bg-background/60 text-center">
                <span className="font-medium">Produit + Technologie</span>
                <p className="text-muted-foreground mt-1">= Activation efficace</p>
              </div>
              <div className="p-4 rounded-xl bg-background/60 text-center">
                <span className="font-medium">Marketing + Technologie</span>
                <p className="text-muted-foreground mt-1">= Rétention durable</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 text-center">
                <span className="font-medium text-primary">Les trois ensemble</span>
                <p className="text-primary mt-1">= Croissance exponentielle 🚀</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: 10,
    title: "Semaine 1 : Les fondamentaux",
    subtitle: "Comprendre les bases du Growth Hacking",
    icon: <BookOpen className="h-12 w-12 text-blue-500" />,
    content: (
      <div className="space-y-4">
        {growthHackingProgram[0]?.trainings.map((training, i) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{training.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{training.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {training.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{training.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 11,
    title: "Semaine 2-3 : Acquisition",
    subtitle: "Attirer les bons visiteurs",
    icon: <Users className="h-12 w-12 text-purple-500" />,
    content: (
      <div className="space-y-4">
        {[...growthHackingProgram[1]?.trainings || [], ...growthHackingProgram[2]?.trainings || []].slice(0, 6).map((training, i) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{training.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{training.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {training.tools?.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 12,
    title: "Semaine 4-5 : Activation & Rétention",
    subtitle: "Convertir et fidéliser",
    icon: <Heart className="h-12 w-12 text-rose-500" />,
    content: (
      <div className="space-y-4">
        {[...growthHackingProgram[3]?.trainings || [], ...growthHackingProgram[4]?.trainings || []].slice(0, 6).map((training, i) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{training.title}</h4>
                    <p className="text-sm text-muted-foreground">{training.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 13,
    title: "Semaine 6-7 : Referral & Revenue",
    subtitle: "Croître et monétiser",
    icon: <DollarSign className="h-12 w-12 text-emerald-500" />,
    content: (
      <div className="space-y-4">
        {[...growthHackingProgram[5]?.trainings || [], ...growthHackingProgram[6]?.trainings || []].slice(0, 6).map((training, i) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{training.title}</h4>
                    <p className="text-sm text-muted-foreground">{training.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 14,
    title: "Semaine 8 : Optimisation & Scale",
    subtitle: "Passer à l'échelle",
    icon: <TrendingUp className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-4">
        {growthHackingProgram[7]?.trainings.map((training, i) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{training.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{training.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {training.tools?.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 15,
    title: "Tactiques de Growth",
    icon: <Zap className="h-12 w-12 text-amber-500" />,
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        {growthTactics.map((tactic, index) => (
          <motion.div
            key={tactic.category}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${tactic.color}`} />
                  <CardTitle className="text-lg">{tactic.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tactic.items.map((item) => (
                    <div key={item.name} className="p-3 rounded-lg bg-muted/50">
                      <span className="font-medium text-sm">{item.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 16,
    title: "Outils du Growth Hacker",
    subtitle: "L'arsenal complet pour hacker votre croissance",
    icon: <Target className="h-12 w-12 text-cyan-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { category: "Analytics & Tracking", tools: ["Google Analytics 4", "Mixpanel", "Amplitude", "Hotjar", "Clarity"], color: "bg-blue-500" },
            { category: "Email & Automation", tools: ["Mailchimp", "ActiveCampaign", "Sendinblue", "Zapier", "Make"], color: "bg-emerald-500" },
            { category: "SEO & Content", tools: ["Ahrefs", "Semrush", "Surfer SEO", "Google Search Console"], color: "bg-amber-500" },
            { category: "Ads & Acquisition", tools: ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads"], color: "bg-rose-500" },
            { category: "CRM & Sales", tools: ["HubSpot", "Pipedrive", "Apollo.io", "Lemlist"], color: "bg-purple-500" },
            { category: "IA & Productivité", tools: ["ChatGPT", "Claude", "Copy.ai", "Midjourney"], color: "bg-indigo-500" },
          ].map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <h4 className="font-semibold text-sm">{cat.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 17,
    title: "Métriques Clés par Étape AARRR",
    icon: <BarChart3 className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-4">
        {[
          { stage: "Acquisition", metrics: ["CAC", "Coût par visite", "Sources de trafic", "Visiteurs uniques", "CTR"], color: "bg-blue-500" },
          { stage: "Activation", metrics: ["Taux d'inscription", "Complétion onboarding", "Time to First Value", "Activation Rate"], color: "bg-emerald-500" },
          { stage: "Rétention", metrics: ["Taux de rétention D1/D7/D30", "DAU/MAU", "Churn Rate", "Session duration"], color: "bg-amber-500" },
          { stage: "Referral", metrics: ["Coefficient viral (K)", "NPS", "Partages sociaux", "Taux de parrainage"], color: "bg-purple-500" },
          { stage: "Revenue", metrics: ["LTV", "ARPU", "MRR/ARR", "Conversion payant", "LTV/CAC"], color: "bg-rose-500" },
        ].map((item, i) => (
          <motion.div
            key={item.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`${item.color} text-white px-4 py-2 rounded-lg font-bold text-center md:min-w-[120px]`}>
                    {item.stage}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <Badge key={metric} variant="outline">{metric}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 18,
    title: "Le Processus d'Expérimentation",
    subtitle: "Méthode scientifique appliquée à la croissance",
    icon: <Zap className="h-12 w-12 text-amber-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { step: "1", title: "Identifier", desc: "Analyser les données pour trouver des opportunités", icon: "🔍" },
            { step: "2", title: "Hypothèse", desc: "Formuler une hypothèse testable et mesurable", icon: "💡" },
            { step: "3", title: "Prioritiser", desc: "Utiliser ICE Score (Impact × Confiance × Ease)", icon: "📊" },
            { step: "4", title: "Tester", desc: "Lancer le test A/B avec un groupe contrôle", icon: "🧪" },
            { step: "5", title: "Analyser", desc: "Mesurer les résultats et documenter les learnings", icon: "📈" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-2">
                {item.step}
              </div>
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-3 text-center">ICE Score = Impact × Confiance × Ease</h4>
            <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
              Priorisez vos expérimentations en notant chaque critère de 1 à 10. Les tests avec le score le plus élevé doivent être lancés en premier.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: 19,
    title: "Études de Cas Réussies",
    subtitle: "Exemples de growth hacking légendaires",
    icon: <Rocket className="h-12 w-12 text-rose-500" />,
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { company: "Dropbox", tactic: "Programme de parrainage", result: "+3900% d'inscriptions", desc: "500MB gratuits pour chaque parrainage" },
          { company: "Hotmail", tactic: "Signature email virale", result: "12M utilisateurs en 18 mois", desc: "'Get your free email at Hotmail'" },
          { company: "Airbnb", tactic: "Integration Craigslist", result: "Trafic massif gratuit", desc: "Cross-posting automatique des annonces" },
          { company: "LinkedIn", tactic: "Import de contacts", result: "Croissance exponentielle", desc: "Invitation automatisée des contacts" },
        ].map((cas, i) => (
          <motion.div
            key={cas.company}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{cas.company}</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-700">{cas.result}</Badge>
                </div>
                <h4 className="font-semibold text-primary mb-2">{cas.tactic}</h4>
                <p className="text-sm text-muted-foreground">{cas.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 20,
    title: "Conclusion",
    subtitle: "Vous êtes prêt à hacker votre croissance !",
    bgClass: "gradient-hero",
    icon: <Rocket className="h-16 w-16" />,
    content: (
      <div className="text-center text-white space-y-6">
        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { title: "Framework AARRR", desc: "5 étapes pour structurer" },
            { title: "3 Piliers", desc: "Produit, Marketing, Tech" },
            { title: "8 Semaines", desc: "Programme complet" },
            { title: "50+ Outils", desc: "Arsenal du Growth Hacker" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm opacity-80">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="pt-4">
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Le Growth Hacking n'est pas une recette magique, mais une méthode structurée combinant créativité, données et expérimentation continue.
          </p>
        </div>
        <Link to="/">
          <Button size="lg" variant="secondary" className="rounded-full mt-4">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    )
  },
];

const GrowthHackingPage = () => {
  const formationContext = useMemo(() => buildFormationContext(ghSlidesData), []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'slides' | 'fullPresentation'>('overview');
  const [activeWeek, setActiveWeek] = useState<number | null>(null);

  const totalTrainings = growthHackingProgram.reduce((acc, week) => acc + week.trainings.length, 0);
  const totalHours = growthHackingProgram.reduce((acc, week) => 
    acc + week.trainings.reduce((sum, t) => sum + parseInt(t.duration), 0), 0
  );

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Full Presentation Mode (50 slides from PDF)
  if (viewMode === 'fullPresentation') {
    return <GrowthHackingPresentation onClose={() => setViewMode('overview')} />;
  }

  // Slide View
  if (viewMode === 'slides') {
    const slide = slides[currentSlide];
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          {/* Progress bar */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="container py-3 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setViewMode('overview')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'aperçu
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>

          {/* Slide content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 flex flex-col ${slide.bgClass || ''}`}
              >
                <div className="container py-12 flex-1 flex flex-col">
                  <div className={`text-center mb-10 ${slide.bgClass ? 'text-white' : ''}`}>
                    {slide.icon && !slide.bgClass && (
                      <div className="mx-auto mb-4">{slide.icon}</div>
                    )}
                    {slide.icon && slide.bgClass && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mb-6 h-24 w-24 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        {slide.icon}
                      </motion.div>
                    )}
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${slide.bgClass ? 'text-white' : ''}`}>
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className={`text-lg ${slide.bgClass ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 flex items-start justify-center">
                    <div className="w-full max-w-5xl">{slide.content}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t">
            <div className="container py-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-md">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-6 bg-primary'
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Overview mode
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="container relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6 backdrop-blur-sm">
                  <span className="text-2xl">🚀</span>
                  <span>Programme intensif de 8 semaines</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Le <span className="text-gradient-gold">Growth Hacking</span>
                </h1>
                
                <p className="text-xl text-white/80 mb-4 font-medium">
                  8 semaines pour doubler le nombre de vos prospects
                </p>
                
                <p className="text-lg text-white/60 mb-8">
                  Basé sur le best-seller de Frédéric Canevet, Grégoire Gambatto & Olivier Zongo-Martin. 
                  Une méthodologie éprouvée par plus de 10 000 entrepreneurs.
                </p>


                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="shadow-glow rounded-full text-lg h-14 px-8"
                    onClick={() => setViewMode('slides')}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Voir le cours en slides
                  </Button>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Framework Preview */}
        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="aarrr" className="space-y-8">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold">Méthodologie Growth Hacking</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Maîtrisez le framework AARRR et les 3 piliers du Growth Hacking
                </p>
              </div>

              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="aarrr" className="rounded-full data-[state=active]:shadow-sm">Framework AARRR</TabsTrigger>
                <TabsTrigger value="pillars" className="rounded-full data-[state=active]:shadow-sm">Les 3 piliers</TabsTrigger>
              </TabsList>

              <TabsContent value="aarrr" className="space-y-6">
                <div className="grid gap-4">
                  {aarrrFramework.map((step, index) => (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden card-interactive">
                        <div className="flex flex-col md:flex-row">
                          <div className={`${step.color} w-full md:w-20 flex items-center justify-center py-4 md:py-0`}>
                            <span className="text-3xl font-bold text-white">{step.letter}</span>
                          </div>
                          <div className="flex-1 p-6">
                            <h3 className="text-xl font-bold mb-1">{step.name}</h3>
                            <p className="text-muted-foreground mb-4">{step.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {step.metrics.map((metric) => (
                                <Badge key={metric} variant="secondary" className="text-xs">
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pillars" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {growthPillars.map((pillar, index) => (
                    <motion.div
                      key={pillar.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full card-interactive">
                        <CardHeader>
                          <div className="text-4xl mb-3">{pillar.icon}</div>
                          <CardTitle>{pillar.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{pillar.description}</p>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {pillar.items.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

            </Tabs>

            <div className="text-center mt-12 space-y-4">
              <Button 
                size="lg" 
                className="rounded-full shadow-glow"
                onClick={() => setViewMode('fullPresentation')}
              >
                <Presentation className="mr-2 h-5 w-5" />
                Formation Complète (50 slides)
              </Button>
              <div>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setViewMode('slides')}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Aperçu Rapide (20 slides)
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="Growth Hacking" formationContext={formationContext} />
    </div>
  );
};

export default GrowthHackingPage;
