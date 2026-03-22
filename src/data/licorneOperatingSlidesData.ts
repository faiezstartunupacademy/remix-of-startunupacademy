export interface LicorneSlide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  keyPoints?: string[];
  framework?: {
    name: string;
    elements: string[];
  };
  quote?: {
    text: string;
    author: string;
  };
  caseStudy?: {
    company: string;
    context: string;
    result: string;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  source: string;
}

export const LICORNE_OPERATING_SLIDES: LicorneSlide[] = [
  // MODULE 1: INTRODUCTION - 8 slides
  {
    id: 1,
    title: "L'Operating Model des Licornes",
    subtitle: "Comment les start-up et licornes réinventent le marketing",
    category: "licorne-intro",
    content: "Ce que vous allez découvrir dans ce module basé sur les retours d'expériences de 30+ CMO de licornes françaises (Alan, Contentsquare, Malt, PayFit, etc.)",
    keyPoints: [
      "Vision stratégique vs exécution tactique",
      "Organisation agile des équipes marketing",
      "Alignement CEO/Board et Go-To-Market",
      "Growth, Data et IA au service du marketing"
    ],
    source: "TechMarketingLeaders - 30+ CMO de la Tech Française"
  },
  {
    id: 2,
    title: "Le Marketing : Fonction Centrale",
    subtitle: "Le rôle stratégique du CMO dans les entreprises tech",
    category: "licorne-intro",
    content: "Le marketing dans les start-up n'est pas un département support - c'est le cœur stratégique qui connecte produit, clients et vision.",
    keyPoints: [
      "Connecter mission, produit et clients",
      "Définir le positionnement et les messages",
      "Créer le désir pour la marque",
      "Piloter la croissance durable"
    ],
    framework: {
      name: "La Mission du Marketing",
      elements: [
        "Faire comprendre les problèmes (conscients ou non)",
        "Cultiver le désir pour la marque",
        "Raconter la meilleure histoire produit",
        "Définir le pricing reflétant la valeur",
        "Optimiser la distribution (sales, self-service, partenaires)",
        "Démontrer la valeur créée pour fidéliser"
      ]
    },
    source: "Jean-Baptiste Sciandra, CEO Shine"
  },
  {
    id: 3,
    title: "Start-up vs Grandes Entreprises",
    subtitle: "Pourquoi le marketing est existentiel dans la tech",
    category: "licorne-intro",
    content: "Dans les start-up, le marketing n'est pas un exercice ponctuel mais un processus itératif et continu. C'est littéralement une question existentielle.",
    keyPoints: [
      "Pas d'historique ni de marque ancrée",
      "Mode survie permanent",
      "Remise en question quotidienne",
      "Conséquences désastreuses si erreur"
    ],
    quote: {
      text: "Si Decathlon rate ses lancements pendant un an, il survivra. Mais si une start-up tech rate une fonctionnalité clé, les conséquences peuvent être désastreuses.",
      author: "Jean-Baptiste Sciandra"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 4,
    title: "Le Parcours du CMO",
    subtitle: "Défis et réalités du rôle de Chief Marketing Officer",
    category: "licorne-intro",
    content: "Le CMO doit être omniscient : growth, product marketing, data, management, discussions board. Un mouton à 5 pattes impossible à trouver.",
    keyPoints: [
      "Premier board, premier budget",
      "Premières discussions effectifs",
      "Première gestion de crise",
      "Premier Go-To-Market solo"
    ],
    quote: {
      text: "J'ai eu énormément de moments de solitude, je me suis remise en question, j'ai dû prendre des décisions difficiles, mais qu'est-ce que j'ai appris !",
      author: "Emmanuelle Benoliel Kleinmann, CMO PayFit"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 5,
    title: "Les 4 Réinventions du Marketing",
    subtitle: "Comment les licornes transforment les pratiques",
    category: "licorne-intro",
    content: "Les start-up et scale-up ont réinventé le marketing sur 4 axes fondamentaux qui les distinguent des entreprises traditionnelles.",
    framework: {
      name: "4 Axes de Réinvention",
      elements: [
        "1. Produit et Innovation : ADN de création de marché",
        "2. Vitesse d'exécution : Libérés des plans 12-18 mois",
        "3. Data systématique : Le nerf de la guerre",
        "4. Organisations agiles : Squads et équipes transverses"
      ]
    },
    source: "Aurélie Fliedel, CMO Alan"
  },
  {
    id: 6,
    title: "Vitesse d'Exécution Alan",
    subtitle: "Cas pratique : réactivité marketing en temps réel",
    category: "licorne-intro",
    content: "Alan a déployé en quelques semaines début 2024 une nouvelle stratégie marketing pour tirer parti de l'intérêt grandissant pour l'IA.",
    keyPoints: [
      "Pas de grand plan marketing stratégique",
      "Être là au bon moment",
      "Réagir aux tendances en temps réel",
      "Exploiter l'avance technologique"
    ],
    caseStudy: {
      company: "Alan",
      context: "Toutes les entreprises réalisent qu'elles ne peuvent pas passer à côté de l'IA",
      result: "Création d'ateliers IA, événements, relations écosystème, narratif propriétaire fort"
    },
    source: "Aurélie Fliedel, CMO Alan"
  },
  {
    id: 7,
    title: "La Data : Nerf de la Guerre",
    subtitle: "Les outils au service de l'autonomie marketing",
    category: "licorne-intro",
    content: "Pour accéder au maximum de données et rendre les équipes marketing autonomes, les scale-up déploient des outils dédiés.",
    keyPoints: [
      "Développer ses propres outils internes",
      "Intégrer rapidement les outils du marché",
      "Customer.io pour emails/newsletters",
      "Webflow/Prismic pour le CMS"
    ],
    quote: {
      text: "David Ogilvy affirmait en 1963 : 'Les publicitaires qui ignorent la recherche sont aussi dangereux que les généraux qui négligent le décryptage.'",
      author: "Jordan Chenevier, CEO Bulldozer"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 8,
    title: "Équipes Transverses",
    subtitle: "Le secret des parcours de conversion réussis",
    category: "licorne-intro",
    content: "La solution pour réussir un parcours de souscription réside dans une petite équipe transverse regroupant toutes les compétences.",
    framework: {
      name: "Squad Transverse (5-6 personnes)",
      elements: [
        "Produit : UX et tunnels de conversion",
        "Technique : Performance et site",
        "Marketing : Proposition de valeur et messages",
        "Design : Interface utilisateur",
        "Data : Mesure et optimisation"
      ]
    },
    source: "Aurélie Fliedel, CMO Alan"
  },

  // MODULE 2: ORGANISATION ÉQUIPE - 10 slides
  {
    id: 9,
    title: "Construire l'Équipe Marketing",
    subtitle: "Vision, objectifs et structuration",
    category: "licorne-organisation",
    content: "Bâtir une équipe marketing ne se résume pas à aligner des compétences techniques, mais à façonner un collectif inspiré par une vision commune.",
    keyPoints: [
      "Comprendre la vision long-terme",
      "Déduire les objectifs marketing concrets",
      "Guider la constitution de l'équipe",
      "Créer créativité, collaboration, résilience"
    ],
    source: "Camille Moreau, CMO LittleBig Connection"
  },
  {
    id: 10,
    title: "Profils Selon Priorités",
    subtitle: "Adapter les recrutements aux enjeux stratégiques",
    category: "licorne-organisation",
    content: "Les premiers recrutements dépendent directement de vos priorités stratégiques actuelles.",
    framework: {
      name: "Profils par Priorité",
      elements: [
        "Notoriété → Branding, RP, Content Marketing",
        "Acquisition → Growth, Lead Generation",
        "Rétention → CRM, Customer Marketing",
        "International → Field Marketing Managers"
      ]
    },
    keyPoints: [
      "Équipe = 10-20% des effectifs",
      "1 manager pour 6-8 personnes",
      "Juniors ok si budget limité",
      "Solliciter aide autres départements"
    ],
    source: "Leslie Tedgui, VP Marketing CoachHub"
  },
  {
    id: 11,
    title: "4 Modes d'Organisation",
    subtitle: "Choisir la structure adaptée à vos enjeux",
    category: "licorne-organisation",
    content: "Il existe différents modèles d'organisation : ce sont vos enjeux et contraintes internes qui orienteront votre choix.",
    framework: {
      name: "Modèles d'Organisation",
      elements: [
        "1. Par Expertise : Brand, Growth, Product Marketing",
        "2. Par Cible : B2B vs B2C séparés",
        "3. Par Pays : Field Marketing par zone",
        "4. Hybride : Combinaison des modèles"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 12,
    title: "Organisation par Expertise",
    subtitle: "Pour les entreprises à ICP unique",
    category: "licorne-organisation",
    content: "Convient aux entreprises ayant une cible unique. Les collaborateurs sont regroupés par compétences marketing spécifiques.",
    tableData: {
      headers: ["CMO", "Brand & Comm", "Growth", "Product Marketing"],
      rows: [
        ["Direction", "Brand Content", "Paid Acquisition", "PMMs Produits"],
        ["Stratégie", "Communication/RP", "SEO/Content", "Lancement Features"],
        ["Budget", "Événements", "CRM", "Enablement Sales"]
      ]
    },
    source: "Camille Moreau, CMO LittleBig Connection"
  },
  {
    id: 13,
    title: "Organisation par Cible",
    subtitle: "Pour les entreprises B2B + B2C",
    category: "licorne-organisation",
    content: "Adaptée aux entreprises ayant des cibles B2B et B2C très différentes, avec des stratégies marketing distinctes.",
    tableData: {
      headers: ["CMO", "B2B", "B2C", "Transverse"],
      rows: [
        ["Direction", "Growth B2B", "Growth B2C", "Brand Global"],
        ["Stratégie", "Product Marketing", "Communication", "Marketing Ops"],
        ["Budget", "Sales Enablement", "Engagement", "Data & Analytics"]
      ]
    },
    source: "Leslie Tedgui, VP Marketing CoachHub"
  },
  {
    id: 14,
    title: "Organisation par Pays",
    subtitle: "Pour les entreprises internationales",
    category: "licorne-organisation",
    content: "Structure l'équipe en fonction des marchés géographiques avec des Field Marketing Managers locaux.",
    tableData: {
      headers: ["CMO", "Zone Europe", "Zone Amérique", "Global"],
      rows: [
        ["Direction", "France + Pays EU", "USA + Latam", "Brand"],
        ["Stratégie", "Field Marketing", "Field Marketing", "Marketing Ops"],
        ["Budget", "Content Local", "Content Local", "Product Marketing"]
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 15,
    title: "Le Product Marketing",
    subtitle: "Connecter Produit et Sales",
    category: "licorne-organisation",
    content: "Le Product Marketing traduit la puissance du produit en messages percutants pour attirer et convaincre les prospects.",
    framework: {
      name: "Organisation PMM Alan",
      elements: [
        "PMM Business : Pitch, présentations, démo valeur → avec équipes Sales",
        "PMM Produit : Lancement, communication innovations → avec équipes Product",
        "PMM Transverse : Feedback loop, veille concurrentielle"
      ]
    },
    keyPoints: [
      "Valeurs communes sales/marketing/product",
      "Objectifs partagés (conversion, signatures)",
      "Équipe décentralisée et intégrée"
    ],
    source: "Aurélie Fliedel, CMO Alan"
  },
  {
    id: 16,
    title: "Recrutement Efficace",
    subtitle: "Méthodes pour attirer les meilleurs talents",
    category: "licorne-organisation",
    content: "Un recrutement ne doit pas se faire à l'instinct ; il repose sur des méthodes adaptées pour attirer, évaluer et intégrer les candidats.",
    keyPoints: [
      "Définir besoins et objectifs clairement",
      "Utiliser LinkedIn stratégiquement",
      "Exploiter recommandations internes/externes",
      "Élargir avec le travail à distance",
      "Optimiser l'expérience candidat",
      "Analyser les données de recrutement"
    ],
    source: "Joël Gaudeul, VP Marketing Swan"
  },
  {
    id: 17,
    title: "Profils Scale-up",
    subtitle: "Les qualités clés au-delà des compétences métier",
    category: "licorne-organisation",
    content: "En scale-up, les priorités évoluent, les organisations changent à un rythme effréné. Le savoir-être est clé.",
    framework: {
      name: "3 Qualités Essentielles",
      elements: [
        "1. Adaptabilité : Capable de changer de métier et périmètre rapidement",
        "2. Audace & Énergie : Flamme pour mener les projets de zéro",
        "3. Hands-on : Vision macro ET gestion du détail"
      ]
    },
    quote: {
      text: "Beaucoup des premiers employés de ManoMano ont eu plusieurs métiers différents en quelques années.",
      author: "Roxane Labat, Head of Performance Marketing ManoMano"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 18,
    title: "Méthode Agile Marketing",
    subtitle: "Synchroniser l'équipe avec les sprints",
    category: "licorne-organisation",
    content: "La méthode Agile privilégie la communication, l'amélioration continue et l'adaptation au changement.",
    framework: {
      name: "Sprint Marketing (2 semaines)",
      elements: [
        "Feuille de route trimestrielle (OKR)",
        "Réunion début de cycle : tâches à livrer",
        "Estimation effort : 5h/jour par personne",
        "Tâches max 4h (sinon découper)",
        "Daily/Weekly pour état d'avancement",
        "Répartition : 60% construction, 40% campagnes"
      ]
    },
    source: "Joël Gaudeul, VP Marketing Swan"
  },

  // MODULE 3: ALIGNEMENT STRATÉGIQUE - 8 slides
  {
    id: 19,
    title: "Alignement CEO & Board",
    subtitle: "Le CMO au cœur de la stratégie d'entreprise",
    category: "licorne-alignement",
    content: "La collaboration étroite avec le CEO et le board est essentielle pour garantir que le marketing soutient la vision globale.",
    keyPoints: [
      "Comprendre la vision long-terme",
      "Traduire en objectifs marketing",
      "Présenter les résultats au board",
      "Justifier le budget et les investissements"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 20,
    title: "Go-To-Market Intégré",
    subtitle: "Marketing + Sales + Product = Succès",
    category: "licorne-alignement",
    content: "Le bon département marketing a toujours à cœur de servir les autres départements du Go-To-Market tout en bâtissant sa propre réussite.",
    framework: {
      name: "Alignement GTM",
      elements: [
        "Rendre les autres canaux plus performants",
        "Accélérer la notoriété (bouche-à-oreille + outbound)",
        "Créer sa propre dynamique de pipeline",
        "Canaux : trafic payant, organique, événements"
      ]
    },
    source: "Romain Doutriaux, Head of Marketing Pigment"
  },
  {
    id: 21,
    title: "Quand Recruter Marketing ?",
    subtitle: "Le moment clé pour investir dans le marketing",
    category: "licorne-alignement",
    content: "Quand une start-up s'inquiète sérieusement de son marketing, c'est souvent qu'elle a épuisé ses premiers canaux de génération de leads.",
    keyPoints: [
      "Réseau des fondateurs épuisé",
      "Dynamique outbound en plateau",
      "Besoin de machine récurrente",
      "Nouvelles forces pour grandir à l'échelle"
    ],
    quote: {
      text: "Le marketing va créer une machine récurrente qui rendra les autres canaux plus performants.",
      author: "Romain Doutriaux, Head of Marketing Pigment"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 22,
    title: "Dynamiques Interéquipes",
    subtitle: "Collaboration transversale réussie",
    category: "licorne-alignement",
    content: "Comment s'assure-t-on que les métiers marketing fonctionnent efficacement ensemble ? Par la communication et les objectifs partagés.",
    keyPoints: [
      "Inclure managers dans stratégie",
      "Créer synergie dans le collectif",
      "Partager les enjeux business",
      "Sensibiliser sur les interdépendances"
    ],
    source: "Joël Gaudeul, VP Marketing Swan"
  },
  {
    id: 23,
    title: "Phases de Développement",
    subtitle: "Adapter le marketing au stade de l'entreprise",
    category: "licorne-alignement",
    content: "Le marketing doit s'adapter en permanence au stade de développement de l'entreprise.",
    framework: {
      name: "Marketing par Phase",
      elements: [
        "Early Stage : Généralistes polyvalents, fondateurs impliqués",
        "Growth : Spécialistes et premier management",
        "Scale-up : Organisation structurée, international",
        "Licorne : Équipes pays, brand global"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 24,
    title: "Internationalisation Étape 1",
    subtitle: "Préparation avant l'expansion",
    category: "licorne-alignement",
    content: "Avant de recruter des équipes locales, plusieurs éléments doivent être préparés.",
    keyPoints: [
      "Objectifs clairs par pays",
      "Contenu localisé vs traduit",
      "Transition vers l'anglais en interne",
      "Documentation en anglais",
      "Réunions d'équipe en anglais"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 25,
    title: "Field Marketing Managers",
    subtitle: "Le profil idéal pour l'international",
    category: "licorne-alignement",
    content: "Les premiers Field Marketing Managers jouent un rôle déterminant dans le succès des stratégies marketing locales.",
    keyPoints: [
      "Natifs du pays cible",
      "Parfaite connaissance culturelle",
      "Couteaux suisses polyvalents",
      "Très autonomes et résilients",
      "Capables de tâches annexes (juridique, traduction)"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 26,
    title: "Localisation de l'Équipe",
    subtitle: "Centraliser ou décentraliser ?",
    category: "licorne-alignement",
    content: "Avant les premiers recrutements, décidez de la localisation géographique de votre équipe.",
    tableData: {
      headers: ["Option", "Avantages", "Inconvénients"],
      rows: [
        ["Centralisation", "Culture cohérente, collaboration facile", "Moins de proximité marché"],
        ["Local par pays", "Connaissance approfondie, réactivité", "Synchronisation plus difficile"]
      ]
    },
    source: "TechMarketingLeaders"
  },

  // MODULE 4: GROWTH & DATA - 10 slides
  {
    id: 27,
    title: "Growth Marketing 360°",
    subtitle: "Vue complète de la croissance marketing",
    category: "licorne-growth",
    content: "Le growth marketing dans les licornes va bien au-delà de l'acquisition : c'est une approche systémique de la croissance.",
    framework: {
      name: "Piliers du Growth",
      elements: [
        "Acquisition : Paid, SEO, Content, Events",
        "Activation : Onboarding, Time-to-Value",
        "Rétention : Email, Product, Community",
        "Revenue : Upsell, Cross-sell, Pricing",
        "Referral : Programmes ambassadeurs"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 28,
    title: "Segmentation & ICP",
    subtitle: "Maximiser acquisition et rétention",
    category: "licorne-growth",
    content: "Affiner la segmentation et l'ICP (Ideal Customer Profile) est essentiel pour concentrer les efforts sur les bons prospects.",
    keyPoints: [
      "Définir les caractéristiques du client idéal",
      "Segmenter par comportement et intérêt",
      "Personnaliser les messages par segment",
      "Mesurer performance par segment"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 29,
    title: "ABM & Outbound",
    subtitle: "Marketing ciblé pour les grands comptes",
    category: "licorne-growth",
    content: "L'Account-Based Marketing permet de traiter les grands comptes comme des marchés individuels.",
    framework: {
      name: "Stratégie ABM",
      elements: [
        "Identifier les comptes cibles stratégiques",
        "Créer du contenu personnalisé par compte",
        "Orchestrer campagnes multi-canaux",
        "Aligner Sales et Marketing sur chaque compte",
        "Mesurer engagement et pipeline par compte"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 30,
    title: "Data-Driven Marketing",
    subtitle: "Maximiser l'impact avec les données",
    category: "licorne-growth",
    content: "Dans les start-up très orientées data, le marketing n'échappe pas à la règle. La data est le nerf de la guerre.",
    keyPoints: [
      "Tracking précis de chaque action",
      "Attribution multi-touch",
      "A/B testing systématique",
      "Dashboards temps réel",
      "Prédiction et scoring"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 31,
    title: "Stack Martech Licorne",
    subtitle: "Les outils des meilleures équipes marketing",
    category: "licorne-growth",
    content: "Les scale-up se distinguent par la mise en place d'outils dédiés pour maximiser l'autonomie marketing.",
    framework: {
      name: "Stack Martech Typique",
      elements: [
        "CRM : HubSpot, Salesforce",
        "Email : Customer.io, Braze",
        "CMS : Webflow, Prismic",
        "Analytics : Amplitude, Mixpanel, Contentsquare",
        "Ads : Google, Meta, LinkedIn",
        "SEO : Ahrefs, Semrush"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 32,
    title: "L'IA au Service du Marketing",
    subtitle: "Comment en tirer parti concrètement",
    category: "licorne-growth",
    content: "L'IA générative transforme les pratiques marketing : contenu, personnalisation, analyse, automation.",
    keyPoints: [
      "Génération de contenu assistée",
      "Personnalisation à grande échelle",
      "Analyse prédictive",
      "Automatisation des tâches répétitives",
      "Chatbots et conversationnel"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 33,
    title: "Réseaux Sociaux & Influence",
    subtitle: "Stratégies pour les entreprises tech",
    category: "licorne-growth",
    content: "Les réseaux sociaux et le marketing d'influence sont des leviers puissants pour les marques tech.",
    keyPoints: [
      "LinkedIn pour le B2B",
      "Employee advocacy",
      "Thought leadership du CEO/CMO",
      "Micro-influenceurs sectoriels",
      "Contenu authentique et transparent"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 34,
    title: "Marketing Communautaire",
    subtitle: "Construire une communauté engagée",
    category: "licorne-growth",
    content: "Le marketing axé sur le client et la communauté génère loyalty, feedback et advocacy organique.",
    framework: {
      name: "Stratégie Communauté",
      elements: [
        "Forums et groupes privés",
        "Slack/Discord communities",
        "User conferences",
        "Programmes ambassadeurs",
        "User-generated content"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 35,
    title: "Événementiel B2B",
    subtitle: "Des ateliers aux flagship events",
    category: "licorne-growth",
    content: "L'événementiel reste un canal puissant pour le B2B : rencontres qualifiées, démonstration expertise, création de relations.",
    keyPoints: [
      "Webinars éducatifs",
      "Workshops clients",
      "Side events conférences",
      "User conferences annuelles",
      "Dîners VIP prospects/clients"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 36,
    title: "Relations Publiques B2B",
    subtitle: "Bâtir et maintenir sa réputation",
    category: "licorne-growth",
    content: "Les relations publiques sont essentielles pour construire la crédibilité et la notoriété de la marque tech.",
    keyPoints: [
      "Relations journalistes tech/business",
      "Storytelling fondateur",
      "Thought leadership articles",
      "Awards et classements",
      "Gestion de crise préparée"
    ],
    source: "TechMarketingLeaders"
  },

  // MODULE 5: BRANDING & POSITIONNEMENT - 6 slides
  {
    id: 37,
    title: "Développement de Marque",
    subtitle: "Créer une marque tech mémorable",
    category: "licorne-brand",
    content: "La marque est un actif stratégique qui différencie et crée de la valeur à long terme.",
    keyPoints: [
      "Mission et vision claires",
      "Positionnement différenciant",
      "Identité visuelle cohérente",
      "Tone of voice authentique",
      "Brand guidelines documentées"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 38,
    title: "Diffusion de Marque",
    subtitle: "Faire rayonner la marque sur tous les touchpoints",
    category: "licorne-brand",
    content: "Une fois la marque définie, il faut la déployer de façon cohérente sur tous les points de contact.",
    framework: {
      name: "Touchpoints Marque",
      elements: [
        "Site web et landing pages",
        "Réseaux sociaux et contenu",
        "Produit et UX",
        "Sales enablement",
        "Événements et supports",
        "Communication interne"
      ]
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 39,
    title: "Cas Alan : Members First",
    subtitle: "Créer une nouvelle catégorie de marché",
    category: "licorne-brand",
    content: "Alan a mis au centre de son produit l'innovation pour proposer la meilleure expérience possible, créant une nouvelle catégorie.",
    caseStudy: {
      company: "Alan",
      context: "Marché traditionnel de l'assurance santé dominé par des acteurs historiques",
      result: "Remplacement de 'assurance' par 'partenaire santé' - Expériences innovantes (lunettes en ligne, médecin en ligne)"
    },
    quote: {
      text: "C'est ainsi que l'on se démarque de nos concurrents et crée une nouvelle catégorie sur le marché.",
      author: "Aurélie Fliedel, CMO Alan"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 40,
    title: "Apprendre des Concurrents",
    subtitle: "Veille et intelligence compétitive",
    category: "licorne-brand",
    content: "Comprendre ses concurrents permet de mieux se positionner et d'anticiper les évolutions du marché.",
    keyPoints: [
      "Veille systématique des concurrents",
      "Analyse des positionnements",
      "Benchmark des pratiques marketing",
      "Identification des opportunités",
      "Partage avec les équipes"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 41,
    title: "Budget Marketing",
    subtitle: "Planification et gestion efficace",
    category: "licorne-brand",
    content: "La planification budgétaire est un exercice stratégique qui doit être aligné avec les objectifs business.",
    keyPoints: [
      "Aligner sur les objectifs de croissance",
      "Arbitrer entre brand et performance",
      "Prévoir flexibilité pour opportunités",
      "Mesurer ROI par canal",
      "Justifier au board avec data"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 42,
    title: "Externalisation Marketing",
    subtitle: "Quand et comment faire appel à des partenaires",
    category: "licorne-brand",
    content: "L'externalisation permet de compléter les compétences internes et d'accéder à des expertises pointues.",
    framework: {
      name: "Quand Externaliser",
      elements: [
        "Expertise rare non disponible en interne",
        "Pic d'activité ponctuel",
        "Test de nouveaux canaux",
        "Besoin de regard externe",
        "Production de contenu volume"
      ]
    },
    source: "TechMarketingLeaders"
  },

  // MODULE 6: CRISES & RESPONSABILITÉ - 8 slides
  {
    id: 43,
    title: "Gestion de Crise",
    subtitle: "Préparation et réaction aux situations difficiles",
    category: "licorne-responsable",
    content: "Toute entreprise tech sera confrontée à des crises. La préparation est la clé d'une gestion réussie.",
    keyPoints: [
      "Identifier les risques potentiels",
      "Préparer les scénarios de réponse",
      "Former les porte-paroles",
      "Avoir des templates prêts",
      "Définir la chaîne de décision"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 44,
    title: "Nouvelles Régulations",
    subtitle: "S'adapter aux évolutions réglementaires",
    category: "licorne-responsable",
    content: "Le contexte réglementaire évolue rapidement : RGPD, fin des cookies, IA Act. Le marketing doit s'adapter.",
    keyPoints: [
      "Fin des cookies tiers",
      "RGPD et consentement",
      "IA Act et transparence",
      "First-party data strategy",
      "Privacy by design"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 45,
    title: "Marketing Responsable",
    subtitle: "L'ère du marketing éthique et durable",
    category: "licorne-responsable",
    content: "Nous sommes dans l'ère du marketing responsable. Les consommateurs attendent des marques qu'elles s'engagent.",
    keyPoints: [
      "Authenticité et transparence",
      "Engagement sociétal réel",
      "Communication non-manipulative",
      "Impact environnemental réduit",
      "Respect des données personnelles"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 46,
    title: "Mentors & Communautés",
    subtitle: "Le rôle des pairs dans le développement",
    category: "licorne-responsable",
    content: "Les mentors, fonds, advisors et communautés de pairs sont essentiels pour progresser.",
    framework: {
      name: "Écosystème de Support",
      elements: [
        "Communautés de CMO (TechMarketingLeaders)",
        "Advisors et mentors expérimentés",
        "VCs avec expertise marketing",
        "Peer groups confidentiels",
        "Conférences et formations"
      ]
    },
    quote: {
      text: "Le PARTAGE est au cœur de notre rôle de CMO, c'est donc la solution et la clé de votre succès.",
      author: "Emmanuelle Benoliel Kleinmann, CMO PayFit"
    },
    source: "TechMarketingLeaders"
  },
  {
    id: 47,
    title: "Le CMO du Futur",
    subtitle: "Compétences et évolutions du rôle",
    category: "licorne-responsable",
    content: "Le rôle du CMO évolue vers plus de stratégie, de data et de transversalité.",
    keyPoints: [
      "De spécialiste à généraliste stratégique",
      "Maîtrise de la data et de l'IA",
      "Leadership transversal",
      "Business acumen renforcé",
      "Capacité d'influence au board"
    ],
    source: "TechMarketingLeaders"
  },
  {
    id: 48,
    title: "Synthèse Operating Model",
    subtitle: "Les 10 principes des licornes marketing",
    category: "licorne-responsable",
    content: "Les principes fondamentaux qui guident le marketing des licornes françaises.",
    framework: {
      name: "10 Principes Licornes",
      elements: [
        "1. Le marketing est stratégique, pas support",
        "2. Vitesse d'exécution > plan parfait",
        "3. Data au cœur de chaque décision",
        "4. Équipes transverses et autonomes",
        "5. Alignement total CEO/Sales/Product",
        "6. International dès que possible",
        "7. Brand et performance ensemble",
        "8. Communauté et pairs indispensables",
        "9. Adaptabilité permanente",
        "10. Marketing responsable et éthique"
      ]
    },
    source: "TechMarketingLeaders"
  }
];

export const LICORNE_MODULES = [
  { id: "licorne-intro", name: "Introduction", icon: "🦄", color: "from-violet-500 to-purple-600", slides: 8 },
  { id: "licorne-organisation", name: "Organisation Équipe", icon: "👥", color: "from-blue-500 to-cyan-600", slides: 10 },
  { id: "licorne-alignement", name: "Alignement Stratégique", icon: "🎯", color: "from-green-500 to-emerald-600", slides: 8 },
  { id: "licorne-growth", name: "Growth & Data", icon: "📈", color: "from-orange-500 to-red-600", slides: 10 },
  { id: "licorne-brand", name: "Branding", icon: "💎", color: "from-pink-500 to-rose-600", slides: 6 },
  { id: "licorne-responsable", name: "Responsabilité", icon: "🌱", color: "from-teal-500 to-cyan-600", slides: 6 }
];
