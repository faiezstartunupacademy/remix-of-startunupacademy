export type JourneyTask = { id: string; label: string; points?: number };
export type JourneyKpi = { id: string; label: string; target: string; unit?: string };
export type JourneyResource = { label: string; to?: string; href?: string };
export type JourneyStage = {
  id: number;
  emoji: string;
  name: string;
  subtitle: string;
  gradient: string;
  tasks: JourneyTask[];
  resources: JourneyResource[];
  kpis: JourneyKpi[];
  badge: { code: string; label: string; icon: string };
  recommendedNext: string[];
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1, emoji: "💡", name: "Idéation", subtitle: "Trouver le bon problème",
    gradient: "from-purple-500 to-fuchsia-500",
    tasks: [
      { id: "problem-statement", label: "Problem Statement rédigé", points: 10 },
      { id: "interviews-10", label: "10 entretiens clients réalisés", points: 20 },
      { id: "competitor-map", label: "Carte concurrentielle initiale", points: 10 },
      { id: "value-prop", label: "Proposition de valeur claire", points: 10 },
    ],
    resources: [
      { label: "Design Thinking", to: "/formation/design-thinking" },
      { label: "Mom Test", to: "/formation/lean-canvas" },
      { label: "Effectuation", to: "/fondements/effectuation" },
    ],
    kpis: [
      { id: "interviews", label: "Entretiens clients", target: "≥ 10" },
      { id: "problem-fit", label: "Score Problem-Fit", target: "≥ 70%" },
    ],
    badge: { code: "ideator", label: "Idéateur", icon: "💡" },
    recommendedNext: ["Réaliser 10 interviews qualitatifs", "Rédiger un BMC v1", "Tester le pitch en 30s"],
  },
  {
    id: 2, emoji: "🔍", name: "Validation", subtitle: "Valider le Problem-Solution Fit",
    gradient: "from-indigo-500 to-blue-500",
    tasks: [
      { id: "lean-canvas", label: "Lean Canvas complet", points: 15 },
      { id: "smoke-test", label: "Smoke Test / Landing", points: 15 },
      { id: "early-adopters", label: "10 early adopters identifiés", points: 15 },
      { id: "psf-validated", label: "Problem-Solution Fit validé", points: 25 },
    ],
    resources: [
      { label: "Lean Canvas Lab", to: "/lean-canvas-lab" },
      { label: "Market Intelligence", to: "/market-intelligence" },
      { label: "BMC vs Lean", to: "/formation/bm-comparison" },
    ],
    kpis: [
      { id: "signups", label: "Inscriptions landing", target: "≥ 100" },
      { id: "conversion", label: "Taux d'intérêt", target: "≥ 15%" },
    ],
    badge: { code: "validator", label: "Validateur", icon: "🔍" },
    recommendedNext: ["Lancer un smoke test", "Recueillir 100 leads qualifiés", "Définir le persona principal"],
  },
  {
    id: 3, emoji: "🛠️", name: "MVP", subtitle: "Construire et tester",
    gradient: "from-cyan-500 to-teal-500",
    tasks: [
      { id: "mvp-built", label: "MVP fonctionnel livré", points: 30 },
      { id: "user-tests", label: "20 tests utilisateurs", points: 20 },
      { id: "iteration-3", label: "3 itérations produit", points: 15 },
      { id: "tech-stack", label: "Stack technique stable", points: 10 },
    ],
    resources: [
      { label: "Pôle Stratégique", to: "/pole-strategique" },
      { label: "Tests MVP", to: "/pole-strategique" },
      { label: "Disciplined Entrepreneurship", to: "/formation/disciplined-entrepreneurship" },
    ],
    kpis: [
      { id: "users-mvp", label: "Utilisateurs actifs MVP", target: "≥ 50" },
      { id: "nps", label: "NPS", target: "≥ 30" },
    ],
    badge: { code: "builder", label: "Builder", icon: "🛠️" },
    recommendedNext: ["Compléter 7 étapes incubation", "Définir 3 KPIs MVP", "Recueillir 20 retours utilisateurs"],
  },
  {
    id: 4, emoji: "🎯", name: "Go-to-Market", subtitle: "Atteindre le Product-Market Fit",
    gradient: "from-emerald-500 to-green-500",
    tasks: [
      { id: "gtm-plan", label: "Plan GTM rédigé", points: 15 },
      { id: "first-revenue", label: "Premier revenu encaissé", points: 30 },
      { id: "channels-3", label: "3 canaux acquisition testés", points: 15 },
      { id: "pmf", label: "Product-Market Fit confirmé", points: 30 },
    ],
    resources: [
      { label: "Growth Hacking", to: "/formation/growth-hacking" },
      { label: "Startup Marketing", to: "/formation/startup-marketing" },
      { label: "Bullseye Channels", to: "/formation/growth-hacking" },
    ],
    kpis: [
      { id: "mrr", label: "MRR", target: "≥ 1k TND" },
      { id: "cac-ltv", label: "Ratio LTV/CAC", target: "≥ 3" },
    ],
    badge: { code: "marketer", label: "Marketer", icon: "🎯" },
    recommendedNext: ["Tester 3 canaux d'acquisition", "Mesurer CAC/LTV", "Postuler à un programme d'accélération"],
  },
  {
    id: 5, emoji: "📈", name: "Croissance", subtitle: "Métriques et traction",
    gradient: "from-orange-500 to-amber-500",
    tasks: [
      { id: "kpi-dashboard", label: "Dashboard KPI temps réel", points: 15 },
      { id: "team-5", label: "Équipe ≥ 5 personnes", points: 15 },
      { id: "growth-30", label: "Croissance MoM ≥ 30%", points: 25 },
      { id: "seed-round", label: "Tour Seed finalisé", points: 30 },
    ],
    resources: [
      { label: "Croissance & Métriques", to: "/formation/croissance" },
      { label: "Deal Room", to: "/deal-room" },
      { label: "Financement", to: "/financement" },
    ],
    kpis: [
      { id: "mom-growth", label: "Croissance MoM", target: "≥ 30%" },
      { id: "burn", label: "Runway", target: "≥ 12 mois" },
    ],
    badge: { code: "grower", label: "Growth Hacker", icon: "📈" },
    recommendedNext: ["Lever un tour Seed", "Recruter Head of Growth", "Automatiser le pipeline ventes"],
  },
  {
    id: 6, emoji: "🚀", name: "Scaling", subtitle: "Expansion internationale",
    gradient: "from-pink-500 to-rose-500",
    tasks: [
      { id: "series-a", label: "Series A préparée", points: 25 },
      { id: "export", label: "Marchés export ouverts", points: 25 },
      { id: "team-15", label: "Équipe ≥ 15 personnes", points: 15 },
      { id: "ops-scale", label: "Operating Model scalable", points: 20 },
    ],
    resources: [
      { label: "Operating Model", to: "/formation/operating-model" },
      { label: "Platform Strategy", to: "/formation/platform-strategy" },
      { label: "Partenaires Export", to: "/annuaire?program=Export" },
    ],
    kpis: [
      { id: "intl-revenue", label: "Revenu international", target: "≥ 25%" },
      { id: "arr", label: "ARR", target: "≥ 1M TND" },
    ],
    badge: { code: "scaler", label: "Scaler", icon: "🚀" },
    recommendedNext: ["Préparer une Series A", "Recruter VP International", "Structurer la gouvernance"],
  },
  {
    id: 7, emoji: "🌟", name: "Exit / Impact", subtitle: "Donner au prochain",
    gradient: "from-yellow-400 to-amber-600",
    tasks: [
      { id: "alumni", label: "Profil Alumni actif", points: 10 },
      { id: "mentor-5", label: "Mentorat 5 startupers", points: 25 },
      { id: "impact-report", label: "Rapport d'impact publié", points: 20 },
      { id: "exit-or-ipo", label: "Exit / IPO / nouveau cycle", points: 45 },
    ],
    resources: [
      { label: "Marketplace", to: "/marketplace" },
      { label: "Communauté", to: "/feed" },
      { label: "Mentors", to: "/mentors" },
    ],
    kpis: [
      { id: "mentees", label: "Mentees accompagnés", target: "≥ 5" },
      { id: "impact-score", label: "Score d'impact", target: "≥ 80" },
    ],
    badge: { code: "alumni", label: "Alumni & Mentor", icon: "🌟" },
    recommendedNext: ["Devenir mentor", "Publier un retour d'expérience", "Investir en angel"],
  },
];

export const totalMaxPoints = JOURNEY_STAGES.reduce(
  (s, st) => s + st.tasks.reduce((a, t) => a + (t.points || 0), 0),
  0
);
