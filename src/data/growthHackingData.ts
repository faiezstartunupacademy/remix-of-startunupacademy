import { 
  Users2, Heart, Repeat, Users, DollarSign, Target, Rocket, 
  Megaphone, Mail, Search, Link2, Smartphone, Video, 
  Bot, Zap, BarChart3, Settings, TrendingUp, Award
} from "lucide-react";

export interface GrowthWeek {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  trainings: GrowthTraining[];
}

export interface GrowthTraining {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "débutant" | "intermédiaire" | "avancé";
  tools?: string[];
}

export const growthHackingProgram: GrowthWeek[] = [
  {
    id: 1,
    title: "Semaine 1",
    subtitle: "Avant de vous lancer dans la bataille",
    description: "Définir sa cible, comprendre les besoins clients et préparer sa stratégie de croissance.",
    icon: "🎯",
    color: "bg-blue-500",
    trainings: [
      {
        id: "1-1",
        title: "Définir sa cible avec la méthode des personas",
        description: "Créez des profils détaillés de vos clients idéaux pour mieux comprendre leurs besoins, motivations et comportements d'achat.",
        duration: "2h",
        level: "débutant",
        tools: ["Persona Canvas", "Empathy Map"]
      },
      {
        id: "1-2",
        title: "Comment être sûr de répondre aux besoins du client ?",
        description: "Validez votre proposition de valeur grâce aux interviews clients et au Problem-Solution Fit.",
        duration: "3h",
        level: "débutant",
        tools: ["Interview Script", "Value Proposition Canvas"]
      },
      {
        id: "1-3",
        title: "Communication et expérience client, les clés de la réussite !",
        description: "Construisez un parcours client optimisé et une communication qui convertit.",
        duration: "2h",
        level: "intermédiaire",
        tools: ["Customer Journey Map", "Message Market Fit"]
      }
    ]
  },
  {
    id: 2,
    title: "Semaine 2",
    subtitle: "Mettez en place votre camp de base",
    description: "Construire les fondations techniques et marketing pour une croissance scalable.",
    icon: "🏕️",
    color: "bg-emerald-500",
    trainings: [
      {
        id: "2-1",
        title: "L'équipement de base du Growth Hacker",
        description: "Découvrez les outils essentiels : analytics, CRM, email marketing, et automatisation.",
        duration: "3h",
        level: "débutant",
        tools: ["Google Analytics 4", "HubSpot", "Mailchimp", "Zapier"]
      },
      {
        id: "2-2",
        title: "Le tunnel de vente et le terrassement du camp",
        description: "Construisez un funnel de conversion optimisé de l'acquisition à la fidélisation.",
        duration: "4h",
        level: "intermédiaire",
        tools: ["Funnel Builder", "A/B Testing"]
      },
      {
        id: "2-3",
        title: "Construire une landing page qui convertit",
        description: "Les secrets d'une landing page à fort taux de conversion avec les bonnes pratiques UX/UI.",
        duration: "3h",
        level: "intermédiaire",
        tools: ["Unbounce", "Leadpages", "Carrd"]
      },
      {
        id: "2-4",
        title: "Doper les taux de conversion de son site web",
        description: "Techniques CRO avancées : heatmaps, session recordings, et optimisation continue.",
        duration: "3h",
        level: "avancé",
        tools: ["Hotjar", "Clarity", "Optimizely"]
      },
      {
        id: "2-5",
        title: "Le marketing automation",
        description: "Automatisez vos campagnes marketing pour gagner du temps et augmenter les conversions.",
        duration: "4h",
        level: "avancé",
        tools: ["ActiveCampaign", "Sendinblue", "Make"]
      }
    ]
  },
  {
    id: 3,
    title: "Semaine 3",
    subtitle: "Recrutez rapidement vos premiers prospects",
    description: "Stratégies d'acquisition payantes et organiques pour générer du trafic qualifié.",
    icon: "🎣",
    color: "bg-amber-500",
    trainings: [
      {
        id: "3-1",
        title: "Comment construire une campagne Google Ads rentable ?",
        description: "Maîtrisez Google Ads du ciblage aux enchères pour un ROI optimal.",
        duration: "4h",
        level: "intermédiaire",
        tools: ["Google Ads", "Keyword Planner", "Google Tag Manager"]
      },
      {
        id: "3-2",
        title: "Générer des leads grâce à Facebook & Instagram Ads",
        description: "Créez des campagnes Meta Ads performantes avec le bon ciblage et les bons créatifs.",
        duration: "4h",
        level: "intermédiaire",
        tools: ["Meta Ads Manager", "Creative Hub"]
      },
      {
        id: "3-3",
        title: "LinkedIn, X, TikTok… des challengers Ads à tester !",
        description: "Explorez les plateformes alternatives pour toucher votre audience.",
        duration: "3h",
        level: "avancé",
        tools: ["LinkedIn Campaign Manager", "TikTok Ads", "X Ads"]
      },
      {
        id: "3-4",
        title: "Le SEO hyperciblé",
        description: "Stratégies SEO pour startups : quick wins et contenus à forte valeur ajoutée.",
        duration: "4h",
        level: "intermédiaire",
        tools: ["Ahrefs", "Semrush", "Google Search Console"]
      },
      {
        id: "3-5",
        title: "Le réseau proche, une pompe à prospects",
        description: "Activez votre réseau personnel et professionnel pour générer vos premiers clients.",
        duration: "2h",
        level: "débutant",
        tools: ["LinkedIn", "Calendly", "Loom"]
      },
      {
        id: "3-6",
        title: "La prospection sortante ciblée",
        description: "Cold emailing et social selling : les bonnes pratiques pour prospecter sans spammer.",
        duration: "3h",
        level: "intermédiaire",
        tools: ["Apollo.io", "Lemlist", "Hunter.io"]
      }
    ]
  },
  {
    id: 4,
    title: "Semaine 4",
    subtitle: "Devenez incontournable grâce au content hacking",
    description: "Créer du contenu qui attire, engage et convertit votre audience cible.",
    icon: "✍️",
    color: "bg-purple-500",
    trainings: [
      {
        id: "4-1",
        title: "Produire du contenu pour plaire aux algorithmes ET à vos prospects",
        description: "L'équilibre parfait entre SEO et valeur ajoutée pour maximiser votre visibilité.",
        duration: "3h",
        level: "intermédiaire",
        tools: ["Surfer SEO", "ChatGPT", "Notion"]
      },
      {
        id: "4-2",
        title: "Du bon contenu sans se prendre la tête : le snack content",
        description: "Créez du contenu viral et engageant rapidement pour les réseaux sociaux.",
        duration: "2h",
        level: "débutant",
        tools: ["Canva", "CapCut", "Opus Clip"]
      },
      {
        id: "4-3",
        title: "Le contenu qui attire du trafic",
        description: "Articles piliers, guides complets et ressources téléchargeables pour générer des leads.",
        duration: "4h",
        level: "avancé",
        tools: ["WordPress", "ConvertKit", "Gumroad"]
      },
      {
        id: "4-4",
        title: "Faire du neuf avec du vieux : le content repurposing",
        description: "Multipliez la portée de vos contenus en les adaptant à chaque plateforme.",
        duration: "2h",
        level: "intermédiaire",
        tools: ["Repurpose.io", "Descript", "Castmagic"]
      }
    ]
  },
  {
    id: 5,
    title: "Semaine 5",
    subtitle: "Formez vos bataillons et recrutez des mercenaires",
    description: "Construire des alliances stratégiques et développer votre réseau de partenaires.",
    icon: "🤝",
    color: "bg-rose-500",
    trainings: [
      {
        id: "5-1",
        title: "Recruter des mercenaires off shore",
        description: "Externalisez intelligemment pour scaler vos opérations marketing.",
        duration: "2h",
        level: "avancé",
        tools: ["Upwork", "Fiverr", "Malt"]
      },
      {
        id: "5-2",
        title: "La mise en place d'alliances secrètes",
        description: "Créez des partenariats stratégiques gagnant-gagnant avec des entreprises complémentaires.",
        duration: "3h",
        level: "avancé",
        tools: ["PartnerStack", "Crossbeam"]
      },
      {
        id: "5-3",
        title: "La mise en place d'un programme d'affiliation",
        description: "Transformez vos clients en ambassadeurs rémunérés de votre marque.",
        duration: "3h",
        level: "avancé",
        tools: ["Rewardful", "Tapfiliate", "FirstPromoter"]
      },
      {
        id: "5-4",
        title: "Les parrainages",
        description: "Créez un programme de parrainage viral pour accélérer votre croissance.",
        duration: "2h",
        level: "intermédiaire",
        tools: ["ReferralCandy", "Viral Loops"]
      },
      {
        id: "5-5",
        title: "Les partenariats stratégiques",
        description: "Identifiez et négociez des partenariats à fort potentiel de croissance.",
        duration: "3h",
        level: "avancé"
      }
    ]
  },
  {
    id: 6,
    title: "Semaine 6",
    subtitle: "Occupez le terrain réel ou virtuel",
    description: "Développer votre présence et votre influence dans votre écosystème.",
    icon: "🏟️",
    color: "bg-cyan-500",
    trainings: [
      {
        id: "6-1",
        title: "Devenir un diplomate Growth Hacker",
        description: "L'art du networking stratégique pour ouvrir des portes et créer des opportunités.",
        duration: "2h",
        level: "intermédiaire"
      },
      {
        id: "6-2",
        title: "Le networking virtuel",
        description: "Maximisez votre présence sur LinkedIn et les communautés en ligne.",
        duration: "3h",
        level: "intermédiaire",
        tools: ["LinkedIn", "Slack", "Discord"]
      },
      {
        id: "6-3",
        title: "Devenir un ninja : voler les clients de ses concurrents",
        description: "Techniques éthiques pour capter l'attention des clients de vos concurrents.",
        duration: "2h",
        level: "avancé",
        tools: ["SimilarWeb", "SpyFu", "Competitor Analysis"]
      },
      {
        id: "6-4",
        title: "Organiser un sommet virtuel ou un événement physique",
        description: "Positionnez-vous comme leader d'opinion en organisant des événements marquants.",
        duration: "4h",
        level: "avancé",
        tools: ["Hopin", "Eventbrite", "StreamYard"]
      },
      {
        id: "6-5",
        title: "La mise en place de concours et de quiz",
        description: "Créez de l'engagement et collectez des leads grâce aux jeux-concours.",
        duration: "2h",
        level: "intermédiaire",
        tools: ["Gleam", "KingSumo", "Typeform"]
      },
      {
        id: "6-6",
        title: "Fédérer sa communauté de clients",
        description: "Construisez une communauté engagée autour de votre marque.",
        duration: "3h",
        level: "avancé",
        tools: ["Circle", "Mighty Networks", "Discord"]
      }
    ]
  },
  {
    id: 7,
    title: "Semaine 7",
    subtitle: "Automatisez pour lancer une campagne de propagande",
    description: "Utiliser l'IA et l'automatisation pour démultiplier vos efforts marketing.",
    icon: "🤖",
    color: "bg-indigo-500",
    trainings: [
      {
        id: "7-1",
        title: "Doper son business grâce à l'intelligence artificielle",
        description: "Intégrez l'IA dans votre stack marketing pour gagner en productivité.",
        duration: "4h",
        level: "avancé",
        tools: ["ChatGPT", "Claude", "Midjourney", "Copy.ai"]
      },
      {
        id: "7-2",
        title: "L'automatisation entre plusieurs applications",
        description: "Créez des workflows automatisés pour connecter tous vos outils.",
        duration: "4h",
        level: "avancé",
        tools: ["Zapier", "Make", "n8n"]
      },
      {
        id: "7-3",
        title: "Les logiciels d'automatisation d'actions",
        description: "Automatisez les tâches répétitives sur les réseaux sociaux et le web.",
        duration: "3h",
        level: "avancé",
        tools: ["Phantombuster", "Waalaxy", "Dripify"]
      }
    ]
  },
  {
    id: 8,
    title: "Semaine 8",
    subtitle: "La montée en puissance, la clé de la victoire",
    description: "Optimiser, retenir et scaler votre croissance de manière durable.",
    icon: "🚀",
    color: "bg-orange-500",
    trainings: [
      {
        id: "8-1",
        title: "L'onboarding process (accueil des nouveaux clients)",
        description: "Créez une expérience d'onboarding qui maximise l'activation et la rétention.",
        duration: "3h",
        level: "intermédiaire",
        tools: ["Intercom", "Userpilot", "Appcues"]
      },
      {
        id: "8-2",
        title: "L'effet wow et les moments de vérité",
        description: "Identifiez et optimisez les moments clés du parcours client.",
        duration: "2h",
        level: "intermédiaire"
      },
      {
        id: "8-3",
        title: "Améliorer la rétention et réduire l'attrition",
        description: "Stratégies pour garder vos clients plus longtemps et réduire le churn.",
        duration: "4h",
        level: "avancé",
        tools: ["Mixpanel", "Amplitude", "ChurnZero"]
      },
      {
        id: "8-4",
        title: "Générer plus de revenus et améliorer son produit",
        description: "Techniques d'upsell, cross-sell et optimisation des prix.",
        duration: "3h",
        level: "avancé",
        tools: ["Stripe", "ProfitWell", "Chargebee"]
      },
      {
        id: "8-5",
        title: "Utiliser la gamification pour maintenir la motivation",
        description: "Intégrez des mécaniques de jeu pour engager vos utilisateurs.",
        duration: "2h",
        level: "intermédiaire",
        tools: ["Badgeville", "Bunchball"]
      },
      {
        id: "8-6",
        title: "Vision, mission et branding",
        description: "Construisez une marque forte qui résonne avec votre audience.",
        duration: "3h",
        level: "intermédiaire"
      },
      {
        id: "8-7",
        title: "La montée en puissance et la création d'une équipe",
        description: "Structurez votre équipe growth pour une croissance exponentielle.",
        duration: "3h",
        level: "avancé"
      }
    ]
  }
];

export const aarrrFramework = [
  {
    letter: "A",
    name: "Acquisition",
    description: "Comment les utilisateurs vous découvrent-ils ?",
    question: "Comment attirer des prospects vers votre produit/site ?",
    channels: ["SEO", "SEA", "Social Media", "Content Marketing", "Email", "Referral", "Relations Presse"],
    metrics: ["Visiteurs uniques", "Sources de trafic", "Coût par visite", "CAC"],
    color: "bg-blue-500"
  },
  {
    letter: "A",
    name: "Activation",
    description: "Les utilisateurs ont-ils une bonne première expérience ?",
    question: "L'utilisateur va-t-il avoir une première interaction positive avec le produit ?",
    channels: ["Onboarding", "UX/UI", "Première valeur", "Emails de bienvenue"],
    metrics: ["Taux d'inscription", "Complétion onboarding", "Temps première action", "Activation rate"],
    color: "bg-emerald-500"
  },
  {
    letter: "R",
    name: "Rétention",
    description: "Les utilisateurs reviennent-ils ?",
    question: "L'utilisateur revient-il sur votre produit ? Comment le convaincre de racheter ?",
    channels: ["Email automation", "Notifications push", "Nouvelles features", "Communauté"],
    metrics: ["Taux de rétention J1/J7/J30", "DAU/MAU", "Churn rate", "Fréquence d'usage"],
    color: "bg-amber-500"
  },
  {
    letter: "R",
    name: "Referral",
    description: "Les utilisateurs en parlent-ils à leurs amis ?",
    question: "Est-ce que vos utilisateurs sont suffisamment satisfaits pour en parler ?",
    channels: ["Programme parrainage", "Social sharing", "Témoignages", "Contenu viral"],
    metrics: ["Coefficient viral (K)", "NPS", "Partages sociaux", "Invitations envoyées"],
    color: "bg-purple-500"
  },
  {
    letter: "R",
    name: "Revenue",
    description: "Comment monétisez-vous vos utilisateurs ?",
    question: "À quel moment et comment gagnez-vous de l'argent ?",
    channels: ["Pricing", "Upsell/Cross-sell", "Freemium", "Abonnement"],
    metrics: ["LTV", "ARPU", "MRR/ARR", "Taux de conversion payant"],
    color: "bg-rose-500"
  }
];

export const growthPillars = [
  {
    name: "Produit",
    icon: "🎨",
    description: "Un produit qui se vend tout seul",
    items: [
      "UI/UX optimisé pour la conversion",
      "Gamification et engagement",
      "Système de referral intégré",
      "Onboarding fluide et efficace",
      "Features virales"
    ]
  },
  {
    name: "Marketing",
    icon: "📢",
    description: "Acquérir et convertir efficacement",
    items: [
      "Stratégies inbound/outbound",
      "Marketing viral et buzz",
      "Content marketing stratégique",
      "Publicités ciblées (Google, Meta, LinkedIn)",
      "SEO et SEM"
    ]
  },
  {
    name: "Technologie",
    icon: "⚙️",
    description: "Automatiser et optimiser à l'échelle",
    items: [
      "Outils d'automatisation marketing",
      "Intégrations API",
      "Analyse de données et BI",
      "Tests A/B automatisés",
      "IA et machine learning"
    ]
  }
];

export const growthTactics = [
  {
    category: "Acquisition",
    color: "bg-blue-500",
    items: [
      { name: "SEO & Content Marketing", description: "Créer du contenu de valeur pour attirer du trafic organique" },
      { name: "Publicités ciblées", description: "Google Ads, Meta Ads, LinkedIn Ads avec ciblage précis" },
      { name: "Partenariats stratégiques", description: "S'associer avec des marques complémentaires" },
      { name: "Marketing viral", description: "Créer du contenu partageable naturellement" },
      { name: "Cold outreach", description: "Prospection personnalisée à grande échelle" }
    ]
  },
  {
    category: "Activation",
    color: "bg-emerald-500",
    items: [
      { name: "Onboarding optimisé", description: "Guider l'utilisateur vers sa première valeur rapidement" },
      { name: "Gamification", description: "Utiliser des mécaniques de jeu pour engager" },
      { name: "Emails de bienvenue", description: "Séquence automatisée pour activer les inscrits" },
      { name: "Tutoriels interactifs", description: "Apprendre en faisant avec des guides step-by-step" }
    ]
  },
  {
    category: "Rétention",
    color: "bg-amber-500",
    items: [
      { name: "Notifications push", description: "Rappeler intelligemment la valeur du produit" },
      { name: "Email automation", description: "Séquences basées sur le comportement utilisateur" },
      { name: "Programme de fidélité", description: "Récompenser l'engagement et la récurrence" },
      { name: "Nouvelles fonctionnalités", description: "Donner des raisons de revenir régulièrement" }
    ]
  },
  {
    category: "Referral",
    color: "bg-purple-500",
    items: [
      { name: "Programme de parrainage", description: "Incentiver le bouche-à-oreille" },
      { name: "Incitations sociales", description: "Récompenses pour les partages sociaux" },
      { name: "Contenu partageable", description: "Créer des templates et assets à partager" },
      { name: "Témoignages clients", description: "Mettre en avant les success stories" }
    ]
  }
];
