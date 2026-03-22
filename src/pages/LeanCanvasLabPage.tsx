import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical, Send, Bot, User as UserIcon, Loader2, ArrowLeft,
  Sparkles, Target, CheckCircle2, Clock, Beaker, BarChart3,
  TrendingUp, Rocket, FileText, MessageSquare, ChevronRight,
  BookOpen, Lightbulb, Zap, Search, ChevronDown, ChevronUp,
  Lock, Unlock, ArrowRight, Link2, AlertCircle, Award,
  ClipboardCheck, Eye, Layers, GitBranch, Play, Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import LeanCanvasToolsTable from "@/components/LeanCanvasToolsTable";
import { leanCanvasTools } from "@/data/leanCanvasToolsData";

// ─── Tool Interconnections ───
const TOOL_CONNECTIONS: Record<string, { feeds: string[]; feedsFrom: string[]; description: string }> = {
  LC: { feeds: ["FE", "TR", "OM", "PI"], feedsFrom: [], description: "Le Lean Canvas alimente tous les outils de cadrage et sert de point de départ pour les interviews." },
  FE: { feeds: ["TR"], feedsFrom: ["LC"], description: "L'estimation Fermi valide la viabilité et affine la Traction Roadmap." },
  TR: { feeds: ["VP", "90"], feedsFrom: ["LC", "FE"], description: "La Traction Roadmap structure les milestones qui guident le Validation Plan et les cycles de 90 jours." },
  OM: { feeds: ["LD", "PM"], feedsFrom: ["LC"], description: "L'OMTM devient le centre du Lean Dashboard et oriente les Pirate Metrics." },
  PI: { feeds: ["FC", "CT", "ER"], feedsFrom: ["LC", "MT"], description: "Les interviews problème alimentent le Customer Forces Canvas et la Customer Timeline." },
  MT: { feeds: ["PI", "SI"], feedsFrom: [], description: "Le Mom Test guide la qualité de toutes les interviews (problème et solution)." },
  FC: { feeds: ["MO", "SI"], feedsFrom: ["PI"], description: "Le Customer Forces Canvas révèle les leviers pour construire la Mafia Offer." },
  CT: { feeds: ["MO", "CF"], feedsFrom: ["PI"], description: "La Customer Timeline éclaire le parcours client pour le Customer Factory Blueprint." },
  MO: { feeds: ["SI", "MV"], feedsFrom: ["FC", "CT"], description: "La Mafia Offer est testée en Solution Interview et guide le choix du MVP." },
  MV: { feeds: ["LS"], feedsFrom: ["MO", "SI"], description: "Le type de MVP choisi détermine les Lean Sprints de construction." },
  SI: { feeds: ["VP", "MV"], feedsFrom: ["MO", "MT"], description: "Les Solution Interviews valident la solution et alimentent le Validation Plan." },
  VP: { feeds: ["LS", "ER"], feedsFrom: ["TR", "SI"], description: "Le Validation Plan structure les Lean Sprints et les Experiment Reports." },
  ER: { feeds: ["PP", "CA"], feedsFrom: ["PI", "VP", "LS"], description: "Les Experiment Reports documentent les apprentissages pour la décision Pivot/Persévérer." },
  LS: { feeds: ["PM", "UE", "LD", "ER"], feedsFrom: ["MV", "VP"], description: "Les Lean Sprints génèrent les données pour les métriques et le dashboard." },
  PM: { feeds: ["CF", "LD"], feedsFrom: ["LS", "OM"], description: "Les Pirate Metrics AARRR structurent le Customer Factory Blueprint." },
  UE: { feeds: ["PP", "TM"], feedsFrom: ["LS"], description: "Les Unit Economics (LTV/CAC) alimentent la décision et le Traction Model." },
  CA: { feeds: ["PP", "CO"], feedsFrom: ["ER", "LS"], description: "L'analyse par cohortes révèle la rétention réelle pour la Constraint Analysis." },
  LD: { feeds: ["SU", "CA"], feedsFrom: ["OM", "PM", "LS"], description: "Le Lean Dashboard centralise les métriques pour le reporting et l'analyse." },
  TM: { feeds: ["PP", "GE"], feedsFrom: ["UE"], description: "Le Traction Model projette la croissance et guide le choix du Growth Engine." },
  CO: { feeds: ["GE"], feedsFrom: ["CA"], description: "La Constraint Analysis identifie le goulot pour optimiser le Growth Engine." },
  PP: { feeds: ["GE", "90", "LC"], feedsFrom: ["ER", "CA", "UE", "TM"], description: "La matrice Pivot/Persévérer décide de la direction : scale ou nouveau Lean Canvas." },
  GE: { feeds: ["CF", "90"], feedsFrom: ["TM", "CO", "PP"], description: "Le Growth Engine choisi structure le Customer Factory Blueprint final." },
  CF: { feeds: ["90", "SU"], feedsFrom: ["PM", "CT", "GE"], description: "Le Customer Factory Blueprint complet alimente le plan de 90 jours." },
  "90": { feeds: ["SU", "LC"], feedsFrom: ["TR", "PP", "GE", "CF"], description: "Le cycle de 90 jours lance un nouveau Lean Canvas si pivot, ou itère si persévérer." },
  SU: { feeds: [], feedsFrom: ["LD", "CF", "90"], description: "Le Stakeholder Update communique les résultats aux investisseurs et parties prenantes." },
};

// ─── Phase Data ───
const PROTOCOL_PHASES = [
  {
    id: 1, name: "Cadrage", weeks: "1-2", icon: Target,
    gradient: "from-sky-500 to-blue-600",
    bgGlow: "bg-sky-500/10",
    borderAccent: "border-sky-500/40",
    textAccent: "text-sky-600 dark:text-sky-400",
    description: "Documenter le Plan A et valider la viabilité du modèle",
    objectives: [
      "Formaliser votre vision en un document structuré et testable",
      "Vérifier que le marché est assez grand pour supporter votre ambition",
      "Définir les milestones clés vers le Product/Market Fit",
      "Choisir LA métrique qui focalisera tous vos efforts",
    ],
    expectedResults: [
      "Un Lean Canvas complet avec les 9 blocs remplis",
      "Un calcul Fermi montrant un marché ≥ 10x votre objectif de revenu",
      "3 milestones datés : Problem/Solution Fit → PMF → Scale",
      "Une OMTM claire avec objectif chiffré et fréquence de mesure",
    ],
    tools: [
      { symbol: "LC", name: "Lean Canvas", role: "Documenter le Plan A en 9 blocs en 15 min" },
      { symbol: "FE", name: "Fermi Estimation", role: "Valider la viabilité du marché au dos de l'enveloppe" },
      { symbol: "TR", name: "Traction Roadmap", role: "Fixer les milestones Problem/Solution Fit → PMF → Scale" },
      { symbol: "OM", name: "OMTM", role: "Identifier LA métrique qui compte à votre stade actuel" },
    ],
    steps: [
      { title: "Remplir le Lean Canvas (15 min)", detail: "Commencez par le Problème et les Segments. Ne perfectionnez pas — capturez votre Plan A tel quel. Cet artefact sera itéré au fil du protocole.", action: "Remplir le formulaire Lean Canvas" },
      { title: "Estimer la viabilité (Fermi)", detail: "Revenu cible → prix moyen → nb clients nécessaires → taux de conversion → trafic requis. Si les chiffres sont irréalistes, pivotez le modèle AVANT de commencer les interviews.", action: "Calculer avec le simulateur" },
      { title: "Tracer la Traction Roadmap", detail: "Définissez 3 milestones : 1) Problem/Solution Fit (problème validé), 2) Product/Market Fit (clients qui reviennent), 3) Scale (croissance rentable).", action: "Définir les milestones" },
      { title: "Choisir l'OMTM", detail: "À ce stade, votre OMTM est probablement le nombre d'interviews réalisées ou le % de personnes confirmant le problème. Elle évoluera à chaque phase.", action: "Sélectionner la métrique" },
    ],
    deliverables: [
      { name: "Lean Canvas v1", type: "canvas", fields: ["probleme", "segments", "uvp", "solution", "canaux", "revenus", "couts", "metriques", "avantage_injuste"] },
      { name: "Estimation Fermi", type: "calculator", fields: ["revenu_cible", "prix_moyen", "nb_clients", "taux_conversion", "trafic"] },
      { name: "Traction Roadmap", type: "timeline", fields: ["milestone_psf", "milestone_pmf", "milestone_scale"] },
      { name: "OMTM défini", type: "metric", fields: ["metrique", "objectif", "frequence"] },
    ],
    gateCriteria: "Le modèle est viable selon l'estimation Fermi (marché ≥ 10x objectif)",
    gateChecklist: [
      "Lean Canvas v1 complété (9 blocs)",
      "Estimation Fermi > 10x objectif de revenu",
      "3 milestones définis et datés",
      "OMTM identifiée avec objectif chiffré",
    ],
    nextPhaseUnlock: "Lorsque le calcul Fermi confirme la viabilité, passez à la Phase 2 pour valider le problème avec de vrais clients.",
  },
  {
    id: 2, name: "Découverte Problème", weeks: "3-4", icon: Search,
    gradient: "from-emerald-500 to-green-600",
    bgGlow: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/40",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    description: "Découvrir et valider les vrais problèmes des clients",
    objectives: [
      "Valider que le problème identifié existe réellement chez vos clients cibles",
      "Comprendre les forces qui poussent (ou freinent) l'adoption",
      "Cartographier le parcours client complet",
      "Documenter les apprentissages de manière structurée",
    ],
    expectedResults: [
      "10-15 interviews documentées avec des verbatims clés",
      "≥80% des interviewés confirment le Problème #1",
      "Customer Forces Canvas rempli par segment",
      "Customer Timeline complète de la première pensée au job done",
    ],
    tools: [
      { symbol: "PI", name: "Problem Interview Script", role: "Structurer l'interview : Set the Stage → Probe → Explore → Wrap Up" },
      { symbol: "MT", name: "Mom Test Questions", role: "Poser des questions sur le passé, pas le futur — des faits, pas des opinions" },
      { symbol: "FC", name: "Customer Forces Canvas", role: "Mapper les 4 forces : Push, Pull, Inertia, Friction" },
      { symbol: "CT", name: "Customer Timeline", role: "Documenter le parcours de la première pensée au job done" },
    ],
    steps: [
      { title: "Préparer le script d'interview", detail: "Utilisez le Problem Interview Script. Préparez 5-7 questions ouvertes basées sur le Mom Test : focus sur le passé, les comportements réels, les solutions actuelles.", action: "Générer le script" },
      { title: "Mener 10-15 interviews", detail: "Écoutez 80%, parlez 20%. Ne vendez rien. Notez les verbatims exacts. Cherchez les patterns entre les réponses.", action: "Tracker les interviews" },
      { title: "Remplir le Customer Forces Canvas", detail: "Pour chaque segment, identifiez : Push (frustrations qui poussent au changement), Pull (attraits de la nouvelle solution), Inertia (habitudes qui retiennent), Friction (anxiétés face au changement).", action: "Remplir le canvas" },
      { title: "Construire la Customer Timeline", detail: "Cartographiez le parcours complet : First Thought → Triggering Event → Consideration → Acquisition → Activation → Retention → Job Done.", action: "Mapper le parcours" },
      { title: "Documenter avec l'Experiment Report", detail: "Pour chaque lot d'interviews, créez un Experiment Report : hypothèse testée, méthode, résultats quantitatifs et qualitatifs, apprentissages, prochaines étapes.", action: "Créer le rapport" },
    ],
    deliverables: [
      { name: "Journal d'interviews", type: "form", fields: ["interviewe", "date", "verbatims", "problemes_confirmes", "insights"] },
      { name: "Customer Forces Canvas", type: "canvas", fields: ["push", "pull", "inertia", "friction", "existing_solution"] },
      { name: "Customer Timeline", type: "timeline", fields: ["first_thought", "trigger", "consideration", "acquisition", "activation", "retention", "job_done"] },
      { name: "Rapport de synthèse", type: "report", fields: ["hypothese", "methode", "resultats", "apprentissages", "next_steps"] },
    ],
    gateCriteria: "≥80% des interviewés confirment le Problème #1 comme prioritaire",
    gateChecklist: [
      "10-15 interviews complétées et documentées",
      "≥80% confirmation du problème principal",
      "Customer Forces Canvas rempli pour chaque segment",
      "Customer Timeline complète",
      "Experiment Report de synthèse rédigé",
    ],
    nextPhaseUnlock: "Quand ≥80% confirment le problème, passez à la Phase 3 pour valider votre solution avec la Mafia Offer.",
  },
  {
    id: 3, name: "Validation Solution", weeks: "5-8", icon: CheckCircle2,
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/10",
    borderAccent: "border-amber-500/40",
    textAccent: "text-amber-600 dark:text-amber-400",
    description: "Valider la solution, le pricing et obtenir des pré-engagements",
    objectives: [
      "Créer une offre irrésistible basée sur les forces clients identifiées",
      "Choisir le type de MVP le plus adapté à votre contexte",
      "Valider la désirabilité et le pricing avec de vrais prospects",
      "Obtenir des pré-engagements concrets (LOI, pré-commandes, dépôts)",
    ],
    expectedResults: [
      "Mafia Offer formulée avec UVP, pricing et garantie",
      "Type de MVP choisi et justifié",
      "10-15 Solution Interviews documentées",
      "≥5 pré-engagements ou early adopters confirmés",
    ],
    tools: [
      { symbol: "MO", name: "Mafia Offer Canvas", role: "Créer une offre que vos clients ne peuvent pas refuser" },
      { symbol: "MV", name: "MVP Types Selector", role: "Choisir : Concierge, Wizard of Oz, Landing Page, Single Feature" },
      { symbol: "SI", name: "Solution Interview Script", role: "Valider la solution avec démo, tester pricing et engagement" },
      { symbol: "VP", name: "Validation Plan", role: "Structurer le plan de validation sur une page" },
    ],
    steps: [
      { title: "Créer la Mafia Offer", detail: "Combinez : UVP (résultat souhaité + délai spécifique), Pricing (ancrage + offre), Garantie (éliminez le risque perçu), Bonus (valeur ajoutée). L'offre doit être si bonne que le prospect se sentirait stupide de refuser.", action: "Construire l'offre" },
      { title: "Choisir le type de MVP", detail: "Concierge (vous faites tout manuellement), Wizard of Oz (apparence automatique, humain derrière), Landing Page (tester la demande), Single Feature (une seule fonctionnalité clé).", action: "Sélectionner le MVP" },
      { title: "Mener 10-15 Solution Interviews", detail: "Récapitulez le problème → Demo de la solution → Testez l'UVP → Testez le pricing → Demandez un engagement concret (pas juste 'c'est cool').", action: "Tracker les interviews" },
      { title: "Rédiger le Validation Plan", detail: "Résumez sur une page : hypothèses clés, expérimentations prévues, métriques cibles, critères de succès, timeline.", action: "Rédiger le plan" },
    ],
    deliverables: [
      { name: "Mafia Offer", type: "canvas", fields: ["uvp", "pricing", "garantie", "bonus", "urgence"] },
      { name: "MVP choisi", type: "selector", fields: ["type_mvp", "justification", "features_core", "timeline_build"] },
      { name: "Interviews Solution", type: "form", fields: ["interviewe", "reaction_demo", "pricing_feedback", "engagement_type", "objections"] },
      { name: "Validation Plan", type: "report", fields: ["hypotheses", "experimentations", "metriques", "criteres_succes", "timeline"] },
    ],
    gateCriteria: "≥5 pré-engagements ou early adopters confirmés",
    gateChecklist: [
      "Mafia Offer complète et testée",
      "Type de MVP choisi et justifié",
      "10-15 Solution Interviews documentées",
      "≥5 pré-engagements concrets obtenus",
      "Validation Plan rédigé",
    ],
    nextPhaseUnlock: "Avec ≥5 pré-engagements, passez à la Phase 4 pour construire et tester le MVP en sprints hebdomadaires.",
  },
  {
    id: 4, name: "Construction & Test MVP", weeks: "9-12", icon: Beaker,
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10",
    borderAccent: "border-violet-500/40",
    textAccent: "text-violet-600 dark:text-violet-400",
    description: "Construire, lancer et mesurer le MVP en sprints hebdomadaires",
    objectives: [
      "Construire le MVP minimum en sprints courts et focalisés",
      "Mettre en place le tracking complet des métriques AARRR",
      "Mesurer la rentabilité unitaire (LTV vs CAC)",
      "Itérer chaque semaine basé sur les données réelles",
    ],
    expectedResults: [
      "MVP fonctionnel déployé avec premiers utilisateurs",
      "Dashboard AARRR configuré avec données réelles",
      "Unit Economics calculés : LTV, CAC, ratio LTV/CAC",
      "4 rapports de sprint avec apprentissages documentés",
    ],
    tools: [
      { symbol: "LS", name: "Lean Sprint", role: "Cycle hebdomadaire : Lundi Plan → Mar-Mer Build → Jeudi Test → Vendredi Analyze" },
      { symbol: "PM", name: "Pirate Metrics AARRR", role: "Tracker chaque étape du funnel : Acquisition → Activation → Retention → Revenue → Referral" },
      { symbol: "UE", name: "Unit Economics", role: "Calculer LTV, CAC, ratio LTV/CAC (objectif > 3)" },
      { symbol: "LD", name: "Lean Dashboard", role: "Tableau de bord avec 5-7 métriques essentielles" },
    ],
    steps: [
      { title: "Sprint 1 : MVP Core", detail: "Lundi: définir l'hypothèse de la semaine et les métriques. Mar-Mer: construire la feature principale. Jeudi: déployer et tester avec 5-10 utilisateurs. Vendredi: analyser les résultats et documenter.", action: "Lancer le sprint" },
      { title: "Implémenter le tracking AARRR", detail: "Acquisition (d'où viennent les users?), Activation (vivent-ils le 'Aha moment'?), Retention (reviennent-ils?), Revenue (paient-ils?), Referral (recommandent-ils?).", action: "Configurer le tracking" },
      { title: "Calculer les Unit Economics", detail: "LTV = ARPU × Durée de vie client. CAC = Coût total acquisition / Nombre de clients. Objectif : LTV/CAC > 3 et payback < 12 mois.", action: "Calculer LTV/CAC" },
      { title: "Configurer le Lean Dashboard", detail: "5-7 métriques : North Star Metric, les 5 AARRR, et 1-2 métriques business spécifiques. Mise à jour hebdomadaire.", action: "Créer le dashboard" },
      { title: "Itérer semaine après semaine", detail: "Chaque vendredi : analyse des données → identification du goulot → hypothèse pour la semaine suivante. 4 sprints = 4 itérations d'apprentissage.", action: "Documenter les sprints" },
    ],
    deliverables: [
      { name: "MVP fonctionnel", type: "checklist", fields: ["url_mvp", "features_deployees", "nb_users", "date_lancement"] },
      { name: "Dashboard AARRR", type: "metrics", fields: ["acquisition", "activation", "retention", "revenue", "referral"] },
      { name: "Unit Economics", type: "calculator", fields: ["ltv", "cac", "ratio_ltv_cac", "arpu", "churn", "payback"] },
      { name: "4 Rapports de Sprint", type: "report", fields: ["sprint_num", "hypothese", "resultats", "apprentissages", "next_sprint"] },
    ],
    gateCriteria: "Ratio LTV/CAC > 3 OU tendance positive sur 4 semaines consécutives",
    gateChecklist: [
      "MVP déployé avec utilisateurs réels",
      "Dashboard AARRR configuré et alimenté",
      "Unit Economics calculés (LTV, CAC, ratio)",
      "4 rapports de sprint documentés",
      "Tendance positive identifiée",
    ],
    nextPhaseUnlock: "Quand les Unit Economics montrent un ratio > 3 ou une tendance positive, passez à la Phase 5 pour analyser et décider.",
  },
  {
    id: 5, name: "Analyse & Décision", weeks: "13", icon: BarChart3,
    gradient: "from-rose-500 to-red-600",
    bgGlow: "bg-rose-500/10",
    borderAccent: "border-rose-500/40",
    textAccent: "text-rose-600 dark:text-rose-400",
    description: "Analyser les résultats et décider : pivoter ou persévérer",
    objectives: [
      "Mesurer la rétention réelle par analyse de cohortes",
      "Identifier le goulot d'étranglement principal du système",
      "Comparer les résultats réels au modèle de traction projeté",
      "Prendre une décision éclairée : pivot ou persévérer",
    ],
    expectedResults: [
      "Analyse de cohortes montrant la rétention réelle par semaine/mois",
      "Goulot d'étranglement identifié et quantifié",
      "Écart documenté entre résultats réels et projections",
      "Décision Pivot/Persévérer documentée avec justification",
    ],
    tools: [
      { symbol: "CA", name: "Cohort Analysis", role: "Grouper les users par cohorte et mesurer la rétention dans le temps" },
      { symbol: "CO", name: "Constraint Analysis", role: "5 étapes de Goldratt : Identifier → Exploiter → Subordonner → Élever → Répéter" },
      { symbol: "PP", name: "Pivot or Persevere Matrix", role: "Cadre de décision basé sur les données collectées" },
      { symbol: "TM", name: "Traction Model", role: "Comparer les résultats réels aux projections de croissance" },
    ],
    steps: [
      { title: "Analyser par cohortes", detail: "Groupez vos utilisateurs par semaine/mois d'inscription. Mesurez le % de rétention à S+1, S+2, S+4, S+8. La courbe se stabilise-t-elle (bonne rétention) ou tend vers 0 (problème critique)?", action: "Créer l'analyse" },
      { title: "Identifier le goulot (Constraint Analysis)", detail: "Étape 1: Identifier la contrainte. Étape 2: L'exploiter au maximum. Étape 3: Subordonner tout le reste. Étape 4: Élever la contrainte. Étape 5: Recommencer.", action: "Analyser les contraintes" },
      { title: "Comparer au Traction Model", detail: "Résultats réels vs projections : Visiteurs? Conversion? Clients? ARPU? MRR? L'écart est-il comblable par optimisation ou nécessite-t-il un pivot?", action: "Comparer les modèles" },
      { title: "Décider avec la matrice Pivot/Persévérer", detail: "Critères : Rétention > X% ? LTV/CAC > 3 ? Croissance positive ? Si ≥2 critères échouent → Pivot. Si ≥2 réussissent → Persévérer et Scale.", action: "Prendre la décision" },
    ],
    deliverables: [
      { name: "Analyse de cohortes", type: "metrics", fields: ["cohorte", "retention_s1", "retention_s4", "retention_s8", "tendance"] },
      { name: "Constraint Analysis", type: "report", fields: ["contrainte_principale", "impact_quantifie", "plan_exploitation", "plan_elevation"] },
      { name: "Comparaison au modèle", type: "report", fields: ["metrique", "projection", "reel", "ecart", "analyse"] },
      { name: "Décision documentée", type: "form", fields: ["decision", "justification", "criteres_atteints", "prochaines_etapes"] },
    ],
    gateCriteria: "Décision Pivot ou Persévérer prise et documentée avec données",
    gateChecklist: [
      "Analyse de cohortes réalisée",
      "Goulot d'étranglement identifié",
      "Comparaison résultats vs projections faite",
      "Décision Pivot/Persévérer prise avec justification",
    ],
    nextPhaseUnlock: "Décision prise → Phase 6 : Scale si Persévérer, ou retour Phase 1 avec nouveau Lean Canvas si Pivot.",
  },
  {
    id: 6, name: "Scale ou Pivot", weeks: "14+", icon: Rocket,
    gradient: "from-indigo-500 to-blue-600",
    bgGlow: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/40",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    description: "Scaler le moteur de croissance ou pivoter avec un nouveau plan",
    objectives: [
      "Choisir et maîtriser un moteur de croissance principal",
      "Structurer l'usine à clients complète (Customer Factory)",
      "Lancer un cycle de 90 jours structuré",
      "Communiquer les résultats aux parties prenantes",
    ],
    expectedResults: [
      "Growth Engine choisi (Sticky, Viral ou Paid) avec métriques cibles",
      "Customer Factory Blueprint opérationnel",
      "Plan de 90 jours avec objectifs clairs et métriques",
      "Premier Stakeholder Update envoyé",
    ],
    tools: [
      { symbol: "GE", name: "Growth Engine Selector", role: "Choisir : Sticky (churn < acquisition), Viral (K > 1), Paid (LTV > 3x CAC)" },
      { symbol: "CF", name: "Customer Factory Blueprint", role: "Visualiser l'usine à clients basée sur AARRR" },
      { symbol: "90", name: "90-Day Cycle", role: "Structurer la validation en cycles trimestriels" },
      { symbol: "SU", name: "Stakeholder Update", role: "Reporting mensuel aux investisseurs et parties prenantes" },
    ],
    steps: [
      { title: "Choisir le Growth Engine", detail: "Sticky : votre rétention est forte, focalisez sur réduire le churn. Viral : vos users recommandent naturellement, optimisez le coefficient K. Paid : votre LTV/CAC est > 3, scalez l'acquisition payante.", action: "Choisir le moteur" },
      { title: "Structurer le Customer Factory", detail: "Visualisez votre startup comme une usine : inputs (visiteurs) → process (AARRR) → outputs (clients heureux). Identifiez le throughput actuel et les objectifs.", action: "Construire le blueprint" },
      { title: "Lancer le cycle de 90 jours", detail: "Définissez 3 objectifs clés pour le trimestre. Chaque objectif a des hypothèses à tester, des expérimentations prévues et des critères de succès.", action: "Planifier le cycle" },
      { title: "Préparer le Stakeholder Update", detail: "Structure : Ce qu'on a fait → Ce qu'on a appris → Métriques clés → Défis → Prochaines étapes. Honnête, concis et orienté données.", action: "Rédiger l'update" },
    ],
    deliverables: [
      { name: "Growth Engine", type: "selector", fields: ["type_engine", "metrique_cle", "objectif", "plan_action"] },
      { name: "Customer Factory Blueprint", type: "canvas", fields: ["acquisition_input", "activation_rate", "retention_rate", "revenue_rate", "referral_rate", "throughput"] },
      { name: "Plan 90 jours", type: "report", fields: ["objectif_1", "objectif_2", "objectif_3", "hypotheses", "criteres_succes"] },
      { name: "Stakeholder Update", type: "report", fields: ["realisations", "apprentissages", "metriques", "defis", "next_steps"] },
    ],
    gateCriteria: "Croissance mesurable sur la métrique principale du Growth Engine",
    gateChecklist: [
      "Growth Engine choisi et métriques configurées",
      "Customer Factory Blueprint opérationnel",
      "Plan de 90 jours rédigé avec objectifs clairs",
      "Stakeholder Update envoyé",
    ],
    nextPhaseUnlock: "Cycle continu : chaque 90 jours, réévaluez et itérez. Si pivot → retour Phase 1 avec un nouveau Lean Canvas.",
  },
];

type Msg = { role: "user" | "assistant"; content: string };
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lean-canvas-chatbot`;

const SUGGESTIONS = [
  "Comment remplir mon Lean Canvas en 15 minutes ?",
  "Aide-moi à préparer mes interviews problème avec le Mom Test",
  "Comment créer une Mafia Offer irrésistible ?",
  "Quel type de MVP choisir pour mon projet ?",
  "Comment calculer mes Unit Economics (LTV/CAC) ?",
  "Explique-moi les interconnexions entre les outils Lean Canvas",
];

// ─── Deliverable Form Component ───
const DeliverableForm = ({ deliverable, phaseGradient }: { deliverable: typeof PROTOCOL_PHASES[0]["deliverables"][0]; phaseGradient: string }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const typeIcons: Record<string, typeof FileText> = {
    canvas: Layers,
    calculator: BarChart3,
    timeline: GitBranch,
    metric: Target,
    form: ClipboardCheck,
    report: FileText,
    checklist: CheckCircle2,
    metrics: BarChart3,
    selector: Zap,
  };
  const Icon = typeIcons[deliverable.type] || FileText;

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${phaseGradient} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold">{deliverable.name}</CardTitle>
            <Badge variant="outline" className="text-[10px] mt-1">{deliverable.type}</Badge>
          </div>
          {saved && <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 text-xs">✓ Sauvegardé</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {deliverable.fields.map(field => (
            <div key={field}>
              <Label className="text-xs capitalize text-muted-foreground">{field.replace(/_/g, " ")}</Label>
              {field.includes("description") || field.includes("detail") || field.includes("justification") || field.includes("verbatims") || field.includes("apprentissages") || field.includes("next") || field.includes("plan") ? (
                <Textarea
                  placeholder={`Entrez ${field.replace(/_/g, " ")}...`}
                  className="mt-1 text-xs min-h-[60px] bg-background/50"
                  value={formData[field] || ""}
                  onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                />
              ) : (
                <Input
                  placeholder={field.replace(/_/g, " ")}
                  className="mt-1 text-xs bg-background/50"
                  value={formData[field] || ""}
                  onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <Button size="sm" className={`w-full gap-2 bg-gradient-to-r ${phaseGradient} text-white hover:opacity-90`} onClick={handleSave}>
          <CheckCircle2 className="h-3 w-3" /> Sauvegarder le livrable
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Tool Connection Dialog ───
const ToolConnectionDialog = ({ symbol, open, onClose }: { symbol: string; open: boolean; onClose: () => void }) => {
  const conn = TOOL_CONNECTIONS[symbol];
  const tool = leanCanvasTools.find(t => t.symbol === symbol);
  if (!conn || !tool) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl">
              {symbol}
            </div>
            <div>
              <DialogTitle>{tool.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Interconnexions dans le protocole</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <p className="text-sm text-foreground/80">{conn.description}</p>

          {conn.feedsFrom.length > 0 && (
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <h4 className="text-sm font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" /> Reçoit de
              </h4>
              <div className="flex flex-wrap gap-2">
                {conn.feedsFrom.map(s => {
                  const t = leanCanvasTools.find(x => x.symbol === s);
                  return <Badge key={s} variant="secondary" className="text-xs">{s} — {t?.name}</Badge>;
                })}
              </div>
            </div>
          )}

          {conn.feeds.length > 0 && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4" /> Alimente
              </h4>
              <div className="flex flex-wrap gap-2">
                {conn.feeds.map(s => {
                  const t = leanCanvasTools.find(x => x.symbol === s);
                  return <Badge key={s} variant="secondary" className="text-xs">{s} — {t?.name}</Badge>;
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LeanCanvasLabPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("protocol");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [expandedSection, setExpandedSection] = useState<string>("steps");
  const [completedGates, setCompletedGates] = useState<Record<number, boolean[]>>({});
  const [selectedToolSymbol, setSelectedToolSymbol] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleGateCheck = (phaseId: number, idx: number) => {
    setCompletedGates(prev => {
      const current = prev[phaseId] || [];
      const updated = [...current];
      updated[idx] = !updated[idx];
      return { ...prev, [phaseId]: updated };
    });
  };

  const getPhaseProgress = (phaseId: number) => {
    const phase = PROTOCOL_PHASES.find(p => p.id === phaseId);
    if (!phase) return 0;
    const checks = completedGates[phaseId] || [];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / phase.gateChecklist.length) * 100);
  };

  const isPhaseUnlocked = (phaseId: number) => {
    if (phaseId === 1) return true;
    return getPhaseProgress(phaseId - 1) === 100;
  };

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;
    const userMsg: Msg = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    let assistantContent = "";
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur IA");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantContent += c;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.08) 0%, transparent 50%)
            `
          }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }} />
          <div className="container relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <Button variant="ghost" onClick={() => navigate("/communaute")} className="text-white/50 hover:text-white mb-6 gap-2 text-xs">
                <ArrowLeft className="h-3 w-3" /> Retour Communauté
              </Button>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
                <FlaskConical className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-white/70 font-medium">Pôle Stratégique — Lean Canvas Lab</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight leading-[1.1]">
                Test & Validation
                <span className="block bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent mt-1">
                  MVP Protocol
                </span>
              </h1>
              <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                Protocole méthodique en <strong className="text-white/70">6 phases</strong> et <strong className="text-white/70">25 outils</strong> pour transformer votre idée en startup validée. Basé sur Running Lean & Scaling Lean d'Ash Maurya.
              </p>

              {/* Phase Progress Bar */}
              <div className="flex items-center justify-center gap-1 mt-10 max-w-2xl mx-auto">
                {PROTOCOL_PHASES.map((phase, i) => {
                  const Icon = phase.icon;
                  const progress = getPhaseProgress(phase.id);
                  const unlocked = isPhaseUnlocked(phase.id);
                  return (
                    <motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }} className="flex items-center flex-1">
                      <button
                        onClick={() => { setActiveTab("protocol"); setExpandedPhase(phase.id); }}
                        className={`flex flex-col items-center gap-1.5 w-full group ${!unlocked ? 'opacity-40' : ''}`}>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-lg
                          ${progress === 100 ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
                          group-hover:scale-110 transition-transform`}>
                          {progress === 100 ? <CheckCircle2 className="h-5 w-5 text-white" /> :
                            !unlocked ? <Lock className="h-4 w-4 text-white/70" /> :
                              <Icon className="h-5 w-5 text-white" />}
                        </div>
                        <span className="text-[10px] text-white/40 font-medium">{phase.name}</span>
                        {unlocked && <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${phase.gradient} transition-all`} style={{ width: `${progress}%` }} />
                        </div>}
                      </button>
                      {i < PROTOCOL_PHASES.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-white/20 mx-0.5 shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto mb-10 h-12 bg-muted/50 p-1">
              <TabsTrigger value="protocol" className="gap-2 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white">
                <FileText className="h-4 w-4" /> Protocole MVP
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-2 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                <Beaker className="h-4 w-4" /> 25 Outils
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="gap-2 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <Bot className="h-4 w-4" /> Coach IA
              </TabsTrigger>
            </TabsList>

            {/* ─── PROTOCOL TAB ─── */}
            <TabsContent value="protocol">
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Protocole de Test MVP en 6 Phases
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    14 semaines pour passer de l'idée au Product/Market Fit. Chaque phase a des objectifs précis, des outils dédiés, des livrables dynamiques et un critère de passage à la phase suivante.
                  </p>
                </div>

                {PROTOCOL_PHASES.map((phase, index) => {
                  const Icon = phase.icon;
                  const isExpanded = expandedPhase === phase.id;
                  const progress = getPhaseProgress(phase.id);
                  const unlocked = isPhaseUnlocked(phase.id);

                  return (
                    <motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}>
                      <Card className={`border-2 transition-all overflow-hidden
                        ${!unlocked ? 'opacity-50 border-border/50' : isExpanded ? `shadow-xl ${phase.borderAccent}` : 'hover:shadow-lg border-border hover:border-border/80'}
                        ${isExpanded ? phase.bgGlow : ''}`}>

                        {/* Phase Header */}
                        <div className={`cursor-pointer ${unlocked ? '' : 'pointer-events-none'}`}
                          onClick={() => unlocked && setExpandedPhase(isExpanded ? null : phase.id)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                                {!unlocked ? <Lock className="h-6 w-6 text-white/70" /> : <Icon className="h-7 w-7 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <CardTitle className="text-xl font-bold">
                                    Phase {phase.id} : {phase.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {progress > 0 && (
                                      <Badge className={`${progress === 100 ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 border-amber-500/30'} text-xs`}>
                                        {progress}%
                                      </Badge>
                                    )}
                                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <Badge variant="outline" className={`text-xs ${phase.textAccent} border-current/30`}>
                                    <Clock className="h-3 w-3 mr-1" /> Sem. {phase.weeks}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground truncate">{phase.description}</span>
                                </div>
                                {unlocked && (
                                  <Progress value={progress} className="mt-2 h-1.5" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && unlocked && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}>
                              <CardContent className="pt-0 space-y-6" onClick={e => e.stopPropagation()}>
                                {/* Sub-tabs for sections */}
                                <div className="flex flex-wrap gap-2 border-b pb-3">
                                  {[
                                    { id: "steps", label: "Étapes", icon: Play },
                                    { id: "objectives", label: "Objectifs & Résultats", icon: Target },
                                    { id: "tools", label: "Outils & Liens", icon: Link2 },
                                    { id: "deliverables", label: "Livrables", icon: FileText },
                                    { id: "gate", label: "Validation", icon: Award },
                                  ].map(section => (
                                    <Button key={section.id} variant={expandedSection === section.id ? "default" : "ghost"} size="sm"
                                      className={`gap-1.5 text-xs ${expandedSection === section.id ? `bg-gradient-to-r ${phase.gradient} text-white` : ''}`}
                                      onClick={() => setExpandedSection(section.id)}>
                                      <section.icon className="h-3.5 w-3.5" />
                                      {section.label}
                                    </Button>
                                  ))}
                                </div>

                                {/* ─── STEPS SECTION ─── */}
                                {expandedSection === "steps" && (
                                  <div className="space-y-4">
                                    <h4 className={`text-sm font-bold ${phase.textAccent} flex items-center gap-2`}>
                                      <Play className="h-4 w-4" /> Guide étape par étape
                                    </h4>
                                    {phase.steps.map((step, i) => (
                                      <Card key={i} className="border border-border/50 bg-card/50">
                                        <CardContent className="pt-4 pb-4">
                                          <div className="flex gap-4">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${phase.gradient} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                                              {i + 1}
                                            </div>
                                            <div className="flex-1">
                                              <h5 className="font-semibold text-sm mb-1">{step.title}</h5>
                                              <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                                              <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-7"
                                                  onClick={() => { setActiveTab("chatbot"); sendMessage(`Guide-moi pour "${step.title}" de la Phase ${phase.id} (${phase.name})`); }}>
                                                  <Bot className="h-3 w-3" /> Aide IA
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}

                                {/* ─── OBJECTIVES SECTION ─── */}
                                {expandedSection === "objectives" && (
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <h4 className={`text-sm font-bold ${phase.textAccent} flex items-center gap-2`}>
                                        <Target className="h-4 w-4" /> Objectifs
                                      </h4>
                                      {phase.objectives.map((obj, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm">
                                          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${phase.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <span className="text-[10px] text-white font-bold">{i + 1}</span>
                                          </div>
                                          <span className="text-foreground/80">{obj}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                        <Eye className="h-4 w-4" /> Résultats attendus
                                      </h4>
                                      {phase.expectedResults.map((res, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                          <span className="text-foreground/80">{res}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* ─── TOOLS & CONNECTIONS SECTION ─── */}
                                {expandedSection === "tools" && (
                                  <div className="space-y-4">
                                    <h4 className={`text-sm font-bold ${phase.textAccent} flex items-center gap-2`}>
                                      <Link2 className="h-4 w-4" /> Outils & Interconnexions
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                      {phase.tools.map(tool => {
                                        const conn = TOOL_CONNECTIONS[tool.symbol];
                                        return (
                                          <Card key={tool.symbol} className="border border-border/50 bg-card/50 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => setSelectedToolSymbol(tool.symbol)}>
                                            <CardContent className="pt-4 pb-4">
                                              <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0
                                                  group-hover:scale-110 transition-transform`}>
                                                  {tool.symbol}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <h5 className="font-semibold text-sm">{tool.name}</h5>
                                                  <p className="text-xs text-muted-foreground mt-0.5">{tool.role}</p>
                                                  {conn && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                      {conn.feedsFrom.length > 0 && (
                                                        <Badge variant="outline" className="text-[10px] gap-1">
                                                          <ArrowLeft className="h-2.5 w-2.5" /> {conn.feedsFrom.length} entrée(s)
                                                        </Badge>
                                                      )}
                                                      {conn.feeds.length > 0 && (
                                                        <Badge variant="outline" className="text-[10px] gap-1">
                                                          <ArrowRight className="h-2.5 w-2.5" /> {conn.feeds.length} sortie(s)
                                                        </Badge>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        );
                                      })}
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground flex items-start gap-2">
                                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                      <span>Cliquez sur un outil pour voir ses interconnexions détaillées : quels outils l'alimentent et quels outils il alimente dans le protocole.</span>
                                    </div>
                                  </div>
                                )}

                                {/* ─── DELIVERABLES SECTION ─── */}
                                {expandedSection === "deliverables" && (
                                  <div className="space-y-4">
                                    <h4 className={`text-sm font-bold ${phase.textAccent} flex items-center gap-2`}>
                                      <FileText className="h-4 w-4" /> Livrables dynamiques
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      {phase.deliverables.map(d => (
                                        <DeliverableForm key={d.name} deliverable={d} phaseGradient={phase.gradient} />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* ─── GATE VALIDATION SECTION ─── */}
                                {expandedSection === "gate" && (
                                  <div className="space-y-4">
                                    <div className={`p-4 rounded-xl bg-gradient-to-r ${phase.gradient} text-white`}>
                                      <h4 className="font-bold flex items-center gap-2 mb-2">
                                        <Award className="h-5 w-5" /> Critère de passage — Phase {phase.id}
                                      </h4>
                                      <p className="text-sm text-white/90">{phase.gateCriteria}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <h5 className="text-sm font-semibold flex items-center gap-2">
                                        <ClipboardCheck className="h-4 w-4" /> Checklist de validation
                                      </h5>
                                      {phase.gateChecklist.map((check, idx) => {
                                        const isChecked = completedGates[phase.id]?.[idx] || false;
                                        return (
                                          <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                            ${isChecked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card/50 border-border/50 hover:border-border'}`}>
                                            <input type="checkbox" checked={isChecked} onChange={() => toggleGateCheck(phase.id, idx)}
                                              className="h-4 w-4 rounded border-2 accent-emerald-500" />
                                            <span className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}>{check}</span>
                                          </label>
                                        );
                                      })}
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Progress value={progress} className="flex-1 h-2" />
                                      <span className={`text-sm font-bold ${progress === 100 ? 'text-emerald-600' : 'text-muted-foreground'}`}>{progress}%</span>
                                    </div>

                                    {progress === 100 ? (
                                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                                        <Unlock className="h-5 w-5 text-emerald-500" />
                                        <div>
                                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Phase validée !</p>
                                          <p className="text-xs text-muted-foreground">{phase.nextPhaseUnlock}</p>
                                        </div>
                                        {phase.id < 6 && (
                                          <Button size="sm" className={`ml-auto gap-1.5 bg-gradient-to-r ${PROTOCOL_PHASES[phase.id].gradient} text-white`}
                                            onClick={() => setExpandedPhase(phase.id + 1)}>
                                            Phase {phase.id + 1} <ArrowRight className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50 flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">Complétez tous les critères pour débloquer la phase suivante.</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Ask AI */}
                                <div className="border-t pt-4">
                                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto"
                                    onClick={() => { setActiveTab("chatbot"); sendMessage(`Guide-moi dans la Phase ${phase.id} : ${phase.name} du protocole de test MVP. Explique chaque étape en détail.`); }}>
                                    <Bot className="h-4 w-4" /> Demander au Coach IA pour cette phase
                                  </Button>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ─── TOOLS TAB ─── */}
            <TabsContent value="tools">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black mb-3">Boîte à Outils Lean Canvas</h2>
                  <p className="text-muted-foreground">25 outils issus de Running Lean & Scaling Lean — cliquez pour voir les détails et interconnexions</p>
                </div>
                <LeanCanvasToolsTable />
              </div>
            </TabsContent>

            {/* ─── CHATBOT TAB ─── */}
            <TabsContent value="chatbot">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-sky-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Coach IA Lean Canvas</h2>
                  <p className="text-muted-foreground text-sm">Expert en Running Lean, Scaling Lean et les 25 outils — guide personnalisé pour votre startup</p>
                </div>

                <Card className="border-2 min-h-[500px] flex flex-col shadow-lg">
                  <CardContent className="flex-1 flex flex-col p-4">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]">
                      {messages.length === 0 && (
                        <div className="text-center py-12 space-y-6">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">Posez votre question</h3>
                            <p className="text-sm text-muted-foreground">Je vous accompagne dans le protocole de test MVP et l'utilisation des 25 outils.</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                            {SUGGESTIONS.map((s, i) => (
                              <Button key={i} variant="outline" size="sm" className="text-left text-xs h-auto py-2.5 px-3 whitespace-normal hover:bg-primary/5"
                                onClick={() => sendMessage(s)}>
                                <Sparkles className="h-3 w-3 mr-2 shrink-0 text-amber-500" />
                                {s}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                          </div>
                          {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <UserIcon className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-muted rounded-2xl px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Posez votre question sur le Lean Canvas, le MVP, les métriques..."
                        className="flex-1"
                        disabled={isStreaming}
                      />
                      <Button onClick={() => sendMessage()} disabled={isStreaming || !input.trim()} size="icon"
                        className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                        {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Tool Connection Dialog */}
      <ToolConnectionDialog
        symbol={selectedToolSymbol || ""}
        open={!!selectedToolSymbol}
        onClose={() => setSelectedToolSymbol(null)}
      />

      <Footer />
    </div>
  );
};

export default LeanCanvasLabPage;
