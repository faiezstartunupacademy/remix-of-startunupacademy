// Lean Canvas Tools - Based on Running Lean & Scaling Lean by Ash Maurya

export interface LeanCanvasTool {
  id: string;
  symbol: string;
  name: string;
  category: 'modeling' | 'discovery' | 'validation' | 'metrics' | 'growth' | 'strategy';
  axis: 'Running Lean' | 'Scaling Lean' | 'Both';
  description: string;
  usage: string;
  templateUrl?: string;
  source: string;
  keyElements?: string[];
}

export const leanCanvasToolCategories = [
  { id: 'modeling', name: 'Modélisation', color: 'bg-blue-600', textColor: 'text-blue-600', bgLight: 'bg-blue-600/10', icon: '📋' },
  { id: 'discovery', name: 'Découverte', color: 'bg-emerald-600', textColor: 'text-emerald-600', bgLight: 'bg-emerald-600/10', icon: '🔍' },
  { id: 'validation', name: 'Validation', color: 'bg-amber-600', textColor: 'text-amber-600', bgLight: 'bg-amber-600/10', icon: '✓' },
  { id: 'metrics', name: 'Métriques', color: 'bg-purple-600', textColor: 'text-purple-600', bgLight: 'bg-purple-600/10', icon: '📊' },
  { id: 'growth', name: 'Croissance', color: 'bg-rose-600', textColor: 'text-rose-600', bgLight: 'bg-rose-600/10', icon: '🚀' },
  { id: 'strategy', name: 'Stratégie', color: 'bg-indigo-600', textColor: 'text-indigo-600', bgLight: 'bg-indigo-600/10', icon: '🎯' },
];

export const leanCanvasTools: LeanCanvasTool[] = [
  // Modeling Tools
  {
    id: 'lean-canvas',
    symbol: 'LC',
    name: 'Lean Canvas',
    category: 'modeling',
    axis: 'Running Lean',
    description: 'Template d\'une page pour déconstruire votre idée en 9 blocs testables : Problème, Segments, Proposition de Valeur Unique, Solution, Canaux, Revenus, Coûts, Métriques, Avantage Injuste.',
    usage: 'Utilisez-le en début de projet pour documenter votre Plan A en moins de 15 minutes. Mettez-le à jour au fur et à mesure de vos apprentissages.',
    templateUrl: 'lean-canvas-template',
    source: 'Running Lean, Ch. 1',
    keyElements: ['Problème (3 max)', 'Segments clients', 'UVP', 'Solution (3 features)', 'Canaux', 'Revenus', 'Coûts', 'Métriques clés', 'Avantage injuste']
  },
  {
    id: 'customer-factory-blueprint',
    symbol: 'CF',
    name: 'Customer Factory Blueprint',
    category: 'modeling',
    axis: 'Scaling Lean',
    description: 'Visualise votre startup comme une usine qui transforme des prospects en clients heureux. Basé sur le framework AARRR (Acquisition, Activation, Retention, Revenue, Referral).',
    usage: 'Utilisez-le pour identifier les goulots d\'étranglement dans votre funnel client et optimiser chaque étape systématiquement.',
    templateUrl: 'customer-factory-blueprint',
    source: 'Scaling Lean, Ch. 4',
    keyElements: ['Acquisition', 'Activation', 'Rétention', 'Revenue', 'Referral', 'Goal', 'Throughput']
  },
  {
    id: 'customer-forces-canvas',
    symbol: 'FC',
    name: 'Customer Forces Canvas',
    category: 'discovery',
    axis: 'Running Lean',
    description: 'Comprend les 4 forces qui influencent la décision d\'un client d\'adopter une nouvelle solution : Push (frustrations), Pull (attraits), Inertia (habitudes), Friction (anxiétés).',
    usage: 'Utilisez-le pour analyser pourquoi les clients changeraient (ou non) pour votre solution et identifier les leviers à activer.',
    templateUrl: 'customer-forces-canvas',
    source: 'Running Lean, Ch. 8',
    keyElements: ['Push (Triggering Events)', 'Pull (Desired Outcome)', 'Inertia (Habits)', 'Friction (Anxieties)', 'Existing Solution', 'Chosen Solution']
  },
  {
    id: 'customer-timeline',
    symbol: 'CT',
    name: 'Customer Timeline',
    category: 'discovery',
    axis: 'Running Lean',
    description: 'Documente le parcours complet du client depuis la première pensée jusqu\'au job done, en capturant les moments clés de décision.',
    usage: 'Utilisez-le après les interviews clients pour synthétiser le parcours d\'achat et identifier les opportunités d\'intervention.',
    templateUrl: 'customer-timeline',
    source: 'Running Lean, Ch. 8',
    keyElements: ['First Thought', 'Triggering Event', 'Consideration', 'Acquisition', 'Activation', 'Retention', 'Job Done']
  },
  {
    id: 'traction-roadmap',
    symbol: 'TR',
    name: 'Traction Roadmap',
    category: 'strategy',
    axis: 'Both',
    description: 'Définit vos milestones clés sur le chemin vers le product/market fit : Problem/Solution Fit, Product/Market Fit, Scale.',
    usage: 'Utilisez-le pour planifier votre stratégie de validation par étapes et communiquer vos objectifs aux stakeholders.',
    source: 'Running Lean, Ch. 4',
    keyElements: ['Problem/Solution Fit', 'Product/Market Fit', 'Scale', 'Minimum Success Criteria']
  },
  {
    id: 'validation-plan',
    symbol: 'VP',
    name: 'Validation Plan (One Page)',
    category: 'validation',
    axis: 'Running Lean',
    description: 'Plan de validation sur une page qui résume vos hypothèses clés, les expérimentations prévues, les métriques à suivre et les critères de succès.',
    usage: 'Utilisez-le au début de chaque cycle de 90 jours pour aligner l\'équipe sur les priorités de validation.',
    source: 'Running Lean, Ch. 7',
    keyElements: ['Hypothèse risquée', 'Expérimentation', 'Métriques', 'Critère de succès', 'Timeline']
  },
  {
    id: 'experiment-report',
    symbol: 'ER',
    name: 'Experiment Report',
    category: 'validation',
    axis: 'Both',
    description: 'Template structuré pour documenter chaque expérimentation : hypothèse, méthode, résultats, apprentissages et prochaines étapes.',
    usage: 'Utilisez-le pour chaque expérimentation afin de maximiser les apprentissages et maintenir un historique des décisions.',
    source: 'Scaling Lean, Ch. 8',
    keyElements: ['Hypothèse', 'Expérimentation', 'Métriques', 'Critères', 'Résultats', 'Apprentissages', 'Actions']
  },
  {
    id: 'problem-interview-script',
    symbol: 'PI',
    name: 'Problem Interview Script',
    category: 'discovery',
    axis: 'Running Lean',
    description: 'Script structuré pour découvrir les problèmes réels des clients à travers des questions ouvertes sur leur vécu et comportement passé.',
    usage: 'Utilisez-le pour conduire des interviews de découverte problème. Écoutez 80%, parlez 20%.',
    source: 'Running Lean, Ch. 8',
    keyElements: ['Set the Stage', 'Demographics', 'Tell a Story', 'Probe the Problem', 'Explore Emotion', 'Wrap Up']
  },
  {
    id: 'solution-interview-script',
    symbol: 'SI',
    name: 'Solution Interview Script',
    category: 'validation',
    axis: 'Running Lean',
    description: 'Script pour valider votre solution avec des démos et tester la désirabilité, le pricing et l\'engagement réel.',
    usage: 'Utilisez-le après avoir validé le problème pour tester votre solution proposée et obtenir des pré-engagements.',
    source: 'Running Lean, Ch. 9',
    keyElements: ['Welcome', 'Problem Recap', 'Demo Solution', 'Test UVP', 'Test Pricing', 'Ask for Commitment']
  },
  {
    id: 'mafia-offer',
    symbol: 'MO',
    name: 'Mafia Offer Canvas',
    category: 'validation',
    axis: 'Running Lean',
    description: 'Une offre que vos clients ne peuvent pas refuser. Combine proposition de valeur, pricing et garantie qui élimine le risque perçu.',
    usage: 'Utilisez-le pour créer une offre irrésistible qui valide à la fois la demande et le pricing.',
    source: 'Running Lean, Ch. 10',
    keyElements: ['Proposition de Valeur', 'Pricing', 'Garantie', 'Bonus', 'Urgence/Rareté']
  },
  {
    id: 'fermi-estimation',
    symbol: 'FE',
    name: 'Fermi Estimation',
    category: 'strategy',
    axis: 'Both',
    description: 'Calcul rapide "au dos de l\'enveloppe" pour tester la viabilité de votre business model avec des estimations approximatives.',
    usage: 'Utilisez-le pour valider rapidement si votre modèle peut atteindre vos critères minimaux de succès.',
    source: 'Scaling Lean, Ch. 2',
    keyElements: ['Revenu cible', 'Prix moyen', 'Nombre de clients', 'Taux de conversion', 'Trafic nécessaire']
  },
  {
    id: 'traction-model',
    symbol: 'TM',
    name: 'Traction Model',
    category: 'metrics',
    axis: 'Scaling Lean',
    description: 'Modèle simple pour projeter votre croissance basé sur vos métriques actuelles et identifier les leviers d\'amélioration.',
    usage: 'Utilisez-le pour définir vos objectifs 10x et identifier quel levier a le plus d\'impact sur votre croissance.',
    source: 'Scaling Lean, Ch. 3',
    keyElements: ['Visiteurs', 'Taux conversion', 'Clients', 'ARPU', 'MRR', 'Levier principal']
  },
  {
    id: 'pirate-metrics',
    symbol: 'PM',
    name: 'Pirate Metrics (AARRR)',
    category: 'metrics',
    axis: 'Scaling Lean',
    description: 'Framework de Dave McClure pour mesurer et optimiser chaque étape du parcours client : Acquisition, Activation, Retention, Revenue, Referral.',
    usage: 'Utilisez-le pour structurer votre tableau de bord et identifier l\'étape du funnel à optimiser en priorité.',
    source: 'Scaling Lean, Ch. 4',
    keyElements: ['Acquisition', 'Activation', 'Retention', 'Revenue', 'Referral']
  },
  {
    id: 'cohort-analysis',
    symbol: 'CA',
    name: 'Cohort Analysis',
    category: 'metrics',
    axis: 'Scaling Lean',
    description: 'Analyse qui groupe les utilisateurs par date d\'inscription pour comparer leur comportement dans le temps et détecter les vraies améliorations.',
    usage: 'Utilisez-le pour mesurer la rétention réelle et valider que vos améliorations fonctionnent vraiment.',
    source: 'Scaling Lean, Ch. 5',
    keyElements: ['Cohorte (semaine/mois)', 'Rétention par période', 'Tendances', 'Comparaison']
  },
  {
    id: 'unit-economics',
    symbol: 'UE',
    name: 'Unit Economics Calculator',
    category: 'metrics',
    axis: 'Both',
    description: 'Calcul de la rentabilité au niveau d\'un seul client : LTV (Lifetime Value), CAC (Customer Acquisition Cost), ratio LTV/CAC.',
    usage: 'Utilisez-le pour valider que votre modèle est viable économiquement avant de scaler.',
    source: 'Scaling Lean, Ch. 2',
    keyElements: ['LTV', 'CAC', 'LTV/CAC ratio (>3)', 'Payback period', 'ARPU', 'Churn']
  },
  {
    id: 'omtm',
    symbol: 'OM',
    name: 'One Metric That Matters',
    category: 'metrics',
    axis: 'Scaling Lean',
    description: 'LA métrique qui compte le plus à votre stade actuel. Focalisez toute l\'équipe dessus jusqu\'à ce qu\'elle atteigne l\'objectif.',
    usage: 'Utilisez-le pour aligner l\'équipe sur une priorité unique et éviter la dispersion des efforts.',
    source: 'Scaling Lean, Ch. 5',
    keyElements: ['Stade actuel', 'Métrique principale', 'Objectif', 'Fréquence de review']
  },
  {
    id: 'lean-dashboard',
    symbol: 'LD',
    name: 'Lean Dashboard',
    category: 'metrics',
    axis: 'Scaling Lean',
    description: 'Tableau de bord simplifié avec 5-7 métriques essentielles pour piloter votre startup au quotidien.',
    usage: 'Utilisez-le pour le suivi hebdomadaire en équipe et le reporting aux stakeholders.',
    source: 'Scaling Lean, Ch. 5',
    keyElements: ['North Star Metric', 'Métriques AARRR', 'Tendances', 'Comparaison périodes']
  },
  {
    id: 'constraint-analysis',
    symbol: 'CO',
    name: 'Constraint Analysis',
    category: 'growth',
    axis: 'Scaling Lean',
    description: 'Processus en 5 étapes de Goldratt pour identifier et lever la contrainte principale de votre système.',
    usage: 'Utilisez-le quand votre croissance stagne pour identifier le vrai goulot d\'étranglement.',
    source: 'Scaling Lean, Ch. 6',
    keyElements: ['Identifier', 'Exploiter', 'Subordonner', 'Élever', 'Répéter']
  },
  {
    id: 'growth-engine',
    symbol: 'GE',
    name: 'Growth Engine Selector',
    category: 'growth',
    axis: 'Scaling Lean',
    description: 'Choisir parmi les 3 moteurs de croissance : Sticky (rétention), Viral (recommandation), Paid (acquisition payante rentable).',
    usage: 'Utilisez-le pour choisir et maîtriser UN moteur principal avant d\'en ajouter d\'autres.',
    source: 'Scaling Lean, Ch. 4',
    keyElements: ['Sticky (churn < acquisition)', 'Viral (K > 1)', 'Paid (LTV > 3x CAC)']
  },
  {
    id: 'lean-sprint',
    symbol: 'LS',
    name: 'Lean Sprint',
    category: 'validation',
    axis: 'Scaling Lean',
    description: 'Cycle d\'une semaine pour tester rapidement une hypothèse avec toute l\'équipe alignée : Planifier, Construire, Tester, Analyser.',
    usage: 'Utilisez-le pour des expérimentations rapides et focalisées avec des apprentissages hebdomadaires.',
    source: 'Scaling Lean, Ch. 10',
    keyElements: ['Lundi (Plan)', 'Mar-Mer (Build)', 'Jeudi (Test)', 'Vendredi (Analyze)']
  },
  {
    id: '90-day-cycle',
    symbol: '90',
    name: '90-Day Cycle',
    category: 'strategy',
    axis: 'Running Lean',
    description: 'Structure de validation en cycles de 90 jours pour maintenir le focus, créer de l\'urgence et mesurer les progrès.',
    usage: 'Utilisez-le pour structurer votre stratégie de validation avec des objectifs trimestriels clairs.',
    source: 'Running Lean, Ch. 6',
    keyElements: ['Objectifs du cycle', 'Hypothèses à tester', 'Expérimentations', 'Cycle Review']
  },
  {
    id: 'pivot-persevere',
    symbol: 'PP',
    name: 'Pivot or Persevere Matrix',
    category: 'strategy',
    axis: 'Both',
    description: 'Cadre de décision pour choisir entre pivoter (changer de direction) ou persévérer (continuer) basé sur les données.',
    usage: 'Utilisez-le à la fin de chaque cycle de validation pour prendre des décisions éclairées.',
    source: 'Running Lean, Ch. 11',
    keyElements: ['Données collectées', 'Critères de succès', 'Options de pivot', 'Décision']
  },
  {
    id: 'mvp-types',
    symbol: 'MV',
    name: 'MVP Types Selector',
    category: 'validation',
    axis: 'Running Lean',
    description: 'Guide pour choisir le bon type de MVP : Concierge, Wizard of Oz, Landing Page, Single Feature.',
    usage: 'Utilisez-le pour choisir le type de MVP le plus adapté à ce que vous voulez valider.',
    source: 'Running Lean, Ch. 4',
    keyElements: ['Concierge (service manuel)', 'Wizard of Oz (humain derrière)', 'Landing Page', 'Single Feature']
  },
  {
    id: 'stakeholder-update',
    symbol: 'SU',
    name: 'Stakeholder Update Template',
    category: 'strategy',
    axis: 'Both',
    description: 'Template de reporting mensuel pour communiquer les progrès aux investisseurs, board et équipe.',
    usage: 'Utilisez-le pour un reporting régulier, honnête et structuré à vos stakeholders.',
    source: 'Scaling Lean, Ch. 11',
    keyElements: ['Ce qu\'on a fait', 'Ce qu\'on a appris', 'Métriques clés', 'Défis', 'Prochaines étapes']
  },
  {
    id: 'mom-test',
    symbol: 'MT',
    name: 'Mom Test Questions',
    category: 'discovery',
    axis: 'Running Lean',
    description: 'Technique de Rob Fitzpatrick : des questions auxquelles même votre mère ne pourrait pas mentir. Focus sur le passé, pas les intentions.',
    usage: 'Utilisez-le pour poser des questions qui révèlent la vérité sur les comportements réels, pas les opinions.',
    source: 'Running Lean, Ch. 8',
    keyElements: ['Passé (pas futur)', 'Comportements (pas opinions)', 'Faits (pas compliments)', 'Actions (pas intentions)']
  },
];
