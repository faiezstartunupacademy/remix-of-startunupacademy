// Complete Growth Hacking Slides Data from Formation PDF
// 50 slides covering full AARRR methodology

export interface GrowthSlide {
  id: number;
  title: string;
  subtitle?: string;
  module: string;
  type: 'intro' | 'concept' | 'framework' | 'tactic' | 'case-study' | 'tools' | 'exercise';
  content: {
    definition?: string;
    keyPoints?: string[];
    comparison?: { left: string[]; right: string[] };
    table?: { headers: string[]; rows: string[][] };
    metrics?: string[];
    tools?: string[];
    examples?: { name: string; tactic: string; result: string }[];
    steps?: { step: string; description: string }[];
    tips?: string[];
  };
  color: string;
}

export const growthHackingSlides: GrowthSlide[] = [
  // MODULE 1: INTRODUCTION (Slides 1-5)
  {
    id: 1,
    title: "Formation Growth Hacking pour Startups",
    subtitle: "Stratégies & Tactiques pour une Croissance Explosive",
    module: "Introduction",
    type: "intro",
    content: {
      keyPoints: [
        "Mindset Data-Driven",
        "Expérimentation Rapide",
        "Approche Scientifique"
      ]
    },
    color: "from-primary to-primary/70"
  },
  {
    id: 2,
    title: "Bienvenue & Objectifs de la Formation",
    subtitle: "Ce que vous allez apprendre",
    module: "Introduction",
    type: "concept",
    content: {
      keyPoints: [
        "Comprendre le Growth Hacking et le framework AARRR",
        "Culture Data-Driven et prise de décision basée sur les données",
        "Stratégies de croissance concrètes et actionnables",
        "Outils et techniques : stack technique et méthodologie",
        "Approche scientifique : expérimentation et optimisation continue"
      ]
    },
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 3,
    title: "Qu'est-ce que le Growth Hacking?",
    subtitle: "Définition et éléments clés",
    module: "Introduction",
    type: "concept",
    content: {
      definition: "Approche systématique et souvent non conventionnelle pour accélérer la croissance d'une startup grâce à l'expérimentation rapide et l'analyse de données.",
      comparison: {
        left: ["GROWTH (80%)", "Expérimentation continue", "Approche scientifique", "Cycle itératif rapide", "Optimisation data-driven"],
        right: ["HACKING (20%)", "Pensée créative", "Rupture des conventions", "Détournement créatif", "Astuces et créativité"]
      },
      keyPoints: ["Vitesse", "Données", "Expérimentation"]
    },
    color: "from-emerald-500 to-emerald-600"
  },
  {
    id: 4,
    title: "L'état d'esprit Growth Hacker",
    subtitle: "Les 4 Piliers du Mindset",
    module: "Introduction",
    type: "concept",
    content: {
      keyPoints: [
        "Test, Fail, Learn - Expérimentation continue",
        "Rien n'est impossible - Créativité sans limites",
        "Data-Driven - Analyse rigoureuse",
        "Scalable - Processus répétable"
      ],
      tips: [
        "Osez tester de nouvelles actions et idées",
        "Plutôt que de demander la permission, demandez pardon si cela ne fonctionne pas"
      ]
    },
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 5,
    title: "Growth Hacking vs Marketing Traditionnel",
    subtitle: "Comparaison des approches",
    module: "Introduction",
    type: "concept",
    content: {
      table: {
        headers: ["Marketing Traditionnel", "Growth Hacking"],
        rows: [
          ["Campagnes planifiées", "Expérimentation continue"],
          ["Stratégies long terme, peu flexibles", "Tests rapides et itérations fréquentes"],
          ["Budget élevé", "Budget optimisé"],
          ["Investissements massifs en publicité", "Ressources ciblées et mesurables"],
          ["Intuition", "Données"],
          ["Décisions basées sur l'expérience", "Décisions basées sur les métriques"],
          ["Résultats lents", "Résultats rapides"],
          ["ROI visible sur plusieurs mois", "Impact immédiat et mesurable"]
        ]
      }
    },
    color: "from-orange-500 to-orange-600"
  },

  // MODULE 2: FRAMEWORK AARRR (Slides 6-9)
  {
    id: 6,
    title: "Le Framework AARRR",
    subtitle: "Le funnel de croissance - Les 5 étapes",
    module: "Framework AARRR",
    type: "framework",
    content: {
      steps: [
        { step: "A - Acquisition", description: "Attirer des prospects qualifiés" },
        { step: "A - Activation", description: "Première interaction positive" },
        { step: "R - Retention", description: "Fidéliser les utilisateurs" },
        { step: "R - Referral", description: "Faire parler du produit" },
        { step: "R - Revenue", description: "Monétiser les clients" }
      ]
    },
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: 7,
    title: "Pourquoi les Startups ont besoin du Growth Hacking",
    subtitle: "Les Avantages Clés",
    module: "Framework AARRR",
    type: "concept",
    content: {
      table: {
        headers: ["Avantage", "Impact"],
        rows: [
          ["Croissance Rapide", "Scaleable et mesurable"],
          ["Ressources Optimisées", "Budget maîtrisé"],
          ["Avantage Concurrentiel", "Innovation continue"],
          ["Validation Rapide", "Semaines vs mois"],
          ["Adaptation Continue", "Agilité face au marché"]
        ]
      },
      keyPoints: [
        "Réduction de 50% des coûts d'acquisition",
        "Croissance 2-3x plus rapide"
      ]
    },
    color: "from-teal-500 to-teal-600"
  },
  {
    id: 8,
    title: "Études de Succès",
    subtitle: "Case Studies légendaires",
    module: "Framework AARRR",
    type: "case-study",
    content: {
      examples: [
        { 
          name: "Airbnb", 
          tactic: "Cross-posting sur Craigslist", 
          result: "100,000+ utilisateurs en quelques mois"
        },
        { 
          name: "Dropbox", 
          tactic: "Programme de parrainage - espace gratuit par ami invité", 
          result: "De 100k à 4 millions d'utilisateurs en 15 mois"
        },
        { 
          name: "Hotmail", 
          tactic: "Signature email 'PS: I love you. Get your free email at Hotmail'", 
          result: "8.5 millions d'utilisateurs en 18 mois"
        }
      ],
      keyPoints: [
        "Exploiter les plateformes existantes",
        "Incentiver la viralité naturelle",
        "Intégrer le marketing dans le produit"
      ]
    },
    color: "from-pink-500 to-pink-600"
  },
  {
    id: 9,
    title: "Growth Hacking: White Hat vs Black Hat",
    subtitle: "Les 3 Types de Techniques",
    module: "Framework AARRR",
    type: "concept",
    content: {
      table: {
        headers: ["White Hat ✅", "Gray Hat ⚠️", "Black Hat ❌"],
        rows: [
          ["SEO légitime", "Content Marketing agressif", "Spam"],
          ["A/B Testing", "Gaming léger", "Hacking"],
          ["Techniques éthiques", "Exploitation créative", "Contenu volé"],
          ["Durables", "Limite acceptable", "Achats de liens"]
        ]
      },
      tips: [
        "Toujours respecter les règles des plateformes",
        "Construire une image de marque durable",
        "Se concentrer sur la valeur ajoutée",
        "Le succès durable vient de techniques éthiques et scalables"
      ]
    },
    color: "from-slate-600 to-slate-700"
  },

  // MODULE 3: CULTURE DATA-DRIVEN (Slides 10-12)
  {
    id: 10,
    title: "Culture Data-Driven",
    subtitle: "L'Importance des Données",
    module: "Culture Data-Driven",
    type: "concept",
    content: {
      definition: "La prise de décision basée sur des données objectives plutôt que sur l'intuition subjective",
      keyPoints: [
        "Transition Intuition → Données : Décisions objectives et mesurables",
        "Décisions Rapides : Réactivité basée sur les KPIs en temps réel",
        "Optimisation Continue : Cycle d'amélioration perpétuelle"
      ],
      tools: ["Google Analytics", "Mixpanel", "Amplitude"]
    },
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: 11,
    title: "Prérequis pour le Succès",
    subtitle: "Les 3 Éléments Fondamentaux",
    module: "Culture Data-Driven",
    type: "framework",
    content: {
      table: {
        headers: ["Culture Data-Driven", "Alignement Mission", "Infrastructure"],
        rows: [
          ["Encourager l'usage des données", "Objectifs SMART clairs", "Plateformes d'analytics"],
          ["Partager les apprentissages", "Priorité aux décisions data-driven", "Outils de visualisation"],
          ["Accepter les échecs", "Alignement avec la vision", "Tracking des expériences"],
          ["Réunions régulières d'analyse", "Collaboration inter-équipes", "KPIs en temps réel"],
          ["Organisation apprenante", "Soutien de la direction", "Capacité de scalabilité"]
        ]
      }
    },
    color: "from-violet-500 to-violet-600"
  },
  {
    id: 12,
    title: "L'écosystème du Growth Hacking",
    subtitle: "Les 4 Piliers de l'Écosystème",
    module: "Culture Data-Driven",
    type: "framework",
    content: {
      steps: [
        { step: "Profils Équipes", description: "T-shaped, cross-fonctionnelles et autonomes" },
        { step: "Outils", description: "Stack technique et plateforme de mesure" },
        { step: "Processus", description: "Cycle Analyse-Idéer-Prioriser-Tester" },
        { step: "Culture", description: "Data-driven, expérimentation et innovation" }
      ],
      keyPoints: [
        "Culture ➔ Processus",
        "Processus ➔ Outils",
        "Outils ➔ Équipes",
        "Une synergie parfaite crée un écosystème de croissance durable"
      ]
    },
    color: "from-rose-500 to-rose-600"
  },

  // MODULE 4: CONNAISSANCE CLIENT (Slides 13-16)
  {
    id: 13,
    title: "L'importance de connaître votre client",
    subtitle: "Fondement de toute stratégie de croissance",
    module: "Connaissance Client",
    type: "concept",
    content: {
      definition: "La compréhension profonde de votre client est le fondement de toute stratégie de croissance réussie.",
      table: {
        headers: ["Avantages", "Impact"],
        rows: [
          ["Produit aligné sur les besoins", "Product Market Fit"],
          ["Marketing efficace et ciblé", "Trafic qualifié"],
          ["Réduction du temps de market fit", "Taux de conversion +"],
          ["Fidélisation client", "Coût acquisition ↓"]
        ]
      }
    },
    color: "from-amber-500 to-amber-600"
  },
  {
    id: 14,
    title: "Méthodologie des Personas",
    subtitle: "Qu'est-ce qu'un Persona?",
    module: "Connaissance Client",
    type: "concept",
    content: {
      keyPoints: [
        "Bio et démographie : Âge, localisation, profession",
        "Frustrations : Points de douleur et obstacles",
        "Goals : Objectifs et aspirations",
        "Motivations : Ce qui les pousse à agir",
        "Channels : Où les trouver"
      ],
      tips: [
        "Best Practice: Validé sur le terrain avec de vrais prospects, pas basé sur des assumptions"
      ]
    },
    color: "from-lime-500 to-lime-600"
  },
  {
    id: 15,
    title: "Créer des Personas efficaces",
    subtitle: "Les Étapes Clés",
    module: "Connaissance Client",
    type: "tactic",
    content: {
      table: {
        headers: ["Éléments Essentiels", "Recherches", "Analyse"],
        rows: [
          ["Démographie", "Âge, localisation, revenu", "Objectifs, motivations"],
          ["Entretiens Qualitatifs", "10+ prospects à interroger", "Peurs & Frustrations"],
          ["Analyse de Communautés", "Obstacles, objections", "Résultats attendus"],
          ["Réseaux sociaux & forums", "Citations verbatim", "Parcours d'achat"],
          ["Validation sur le Terrain", "Tests avec cobayes réels", ""]
        ]
      }
    },
    color: "from-green-500 to-green-600"
  },
  {
    id: 16,
    title: "Cartographie du parcours client",
    subtitle: "Customer Journey Mapping",
    module: "Connaissance Client",
    type: "framework",
    content: {
      definition: "Visualisation détaillée des interactions de votre client avec votre produit, de la découverte à la fidélisation",
      steps: [
        { step: "Découverte", description: "Identifier les points de friction" },
        { step: "Évaluation", description: "Optimiser le parcours" },
        { step: "Choix et achat", description: "Simplifier la conversion" },
        { step: "Utilisation", description: "Maximiser la valeur" },
        { step: "Réutilisation et recommandation", description: "Fidéliser et viraliser" }
      ],
      tips: ["Testez votre parcours avec de vrais prospects avant de lancer pour identifier les frictions invisibles"]
    },
    color: "from-sky-500 to-sky-600"
  },

  // MODULE 5: VALIDATION (Slides 17-21)
  {
    id: 17,
    title: "Validation du marché",
    subtitle: "Éviter les erreurs coûteuses",
    module: "Validation",
    type: "concept",
    content: {
      definition: "Ne pas investir des mois dans un produit sans valider que le marché existe réellement",
      keyPoints: [
        "Prototypage : MVP, Maquettes et wireframes",
        "A/B Testing : Tester deux versions",
        "Entretiens : Conversations profondes",
        "Rapidité : Valider en semaines, pas mois",
        "Données Réelles : Feedback de vrais prospects"
      ],
      table: {
        headers: ["Questions Clés à Poser"],
        rows: [
          ["Quel problème voulez-vous résoudre?"],
          ["Quelle solution utilisez-vous actuellement?"],
          ["Quelles sont vos frustrations?"],
          ["Payeriez-vous pour cette solution?"]
        ]
      }
    },
    color: "from-red-500 to-red-600"
  },
  {
    id: 18,
    title: "MVP (Minimum Viable Product)",
    subtitle: "Exemples Célèbres",
    module: "Validation",
    type: "case-study",
    content: {
      definition: "Produit avec le minimum de fonctionnalités nécessaires pour valider le marché et obtenir du feedback",
      examples: [
        { name: "Dropbox", tactic: "Vidéo de démonstration", result: "Tester l'intérêt avant de construire" },
        { name: "Zappos", tactic: "Concierge - photos et livraisons manuelles", result: "Valider le marché des chaussures en ligne" },
        { name: "Airbnb", tactic: "Cross-posting sur Craigslist", result: "Premières réservations sans développement complexe" }
      ],
      keyPoints: [
        "Valider Rapidement : Lancement en semaines",
        "Économiser les Ressources : Budget optimisé",
        "Obtenir du Feedback : Données réelles utilisateurs"
      ]
    },
    color: "from-fuchsia-500 to-fuchsia-600"
  },
  {
    id: 19,
    title: "La méthode SPRINT",
    subtitle: "5 jours pour valider une idée",
    module: "Validation",
    type: "framework",
    content: {
      steps: [
        { step: "1. Map", description: "Cartographier le problème et identifier les défis clés" },
        { step: "2. Sketch", description: "Esquisser des solutions sans jugement" },
        { step: "3. Decide", description: "Choisir la meilleure idée et créer un storyboard" },
        { step: "4. Prototype", description: "Construire un prototype réaliste en une journée" },
        { step: "5. Test", description: "Tester avec de vrais utilisateurs et obtenir du feedback" }
      ],
      keyPoints: [
        "Gagner du Temps : Semaines de travail en 5 jours",
        "Valider Rapidement : Feedback immédiat clients",
        "Réduire les Risques : Éviter les investissements inutiles"
      ]
    },
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: 20,
    title: "Product Market Fit",
    subtitle: "Le Saint Graal des Startups",
    module: "Validation",
    type: "concept",
    content: {
      definition: "Moment où votre produit rencontre parfaitement un marché et résout un problème urgent pour vos utilisateurs",
      table: {
        headers: ["Métrique", "Objectif"],
        rows: [
          ["40% Rule", "40% des utilisateurs seraient très déçus sans votre produit"],
          ["NPS Score", "Score Net Promoter supérieur à 50"]
        ]
      },
      keyPoints: [
        "Croissance Naturelle : Demande excède l'offre",
        "Taux de conversion élevé",
        "Utilisateurs recommandent le produit",
        "Marketing efficace et prix accepté"
      ],
      examples: [
        { name: "Instagram", tactic: "Pivot de Burbn vers la fonctionnalité photo filtre", result: "1M d'utilisateurs en 2 mois" }
      ]
    },
    color: "from-emerald-600 to-emerald-700"
  },
  {
    id: 21,
    title: "Techniques de recherche client",
    subtitle: "Méthodes Quantitatives & Qualitatives",
    module: "Validation",
    type: "tactic",
    content: {
      table: {
        headers: ["Quantitatives", "Qualitatives"],
        rows: [
          ["Enquêtes - Questionnaires structurés", "Entretiens - Conversations 1-1 approfondies"],
          ["Analytics - Données d'utilisation", "Observations - Comportements utilisateurs"],
          ["A/B Testing - Mesurer l'impact", "Focus Groups - Discussions de groupe"]
        ]
      },
      tools: ["Google Forms", "SurveyMonkey", "Typeform", "Google Analytics", "Hotjar"]
    },
    color: "from-blue-600 to-blue-700"
  },

  // MODULE 6: ACQUISITION DEEP DIVE (Slides 22-28)
  {
    id: 22,
    title: "Prescripteurs & Influenceurs",
    subtitle: "Identifier les leviers d'influence",
    module: "Acquisition",
    type: "tactic",
    content: {
      steps: [
        { step: "Niveau 1: Décision d'achat", description: "Experts comptables, consultants, leaders d'opinion" },
        { step: "Niveau 2: Opinion", description: "Blogueurs, comparateurs, revues en ligne" }
      ],
      keyPoints: [
        "Analyser votre réseau professionnel",
        "Étudier les leaders d'opinion de votre secteur",
        "Identifier les blogs et médias influents",
        "Rechercher sur LinkedIn et Twitter"
      ],
      tips: [
        "Partenariats et événements",
        "Co-création de contenu",
        "Accès VIP beta"
      ]
    },
    color: "from-purple-600 to-purple-700"
  },
  {
    id: 23,
    title: "Construire l'empathie client",
    subtitle: "Comprendre profondément vos utilisateurs",
    module: "Acquisition",
    type: "concept",
    content: {
      definition: "Comprendre profondément les besoins, motivations et frustrations de vos clients crée des produits et expériences qui résonnent vraiment.",
      steps: [
        { step: "Écoute Active", description: "Prêter attention sans jugement" },
        { step: "Se Mettre à la Place", description: "Vivre le parcours client" },
        { step: "Raconter", description: "Créer des histoires vraies de vos clients" }
      ],
      keyPoints: [
        "Produits plus pertinents",
        "Marketing plus efficace",
        "Fidélisation client accrue",
        "Innovation centrée utilisateur"
      ],
      tools: ["Journaux Clients", "Feedback Sessions", "User Testing"]
    },
    color: "from-pink-600 to-pink-700"
  },
  {
    id: 24,
    title: "Deep Dive: Acquisition",
    subtitle: "Inbound vs Outbound",
    module: "Acquisition",
    type: "framework",
    content: {
      table: {
        headers: ["Inbound (Pull)", "Outbound (Push)"],
        rows: [
          ["Tirer les clients vers vous", "Aller chercher les clients"],
          ["SEO", "Publicité"],
          ["Contenu de valeur", "Email marketing"],
          ["Trafic organique durable", "Impact immédiat"]
        ]
      },
      keyPoints: [
        "Optimiser le taux de conversion",
        "Améliorer la qualité du trafic",
        "Réduire le coût d'acquisition"
      ],
      metrics: ["CPA (Cost Per Acquisition)", "CTR (Click-Through Rate)", "ROAS (Return on Ad Spend)"]
    },
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 25,
    title: "Aperçu des canaux d'acquisition",
    subtitle: "Digital Marketing Mix",
    module: "Acquisition",
    type: "tools",
    content: {
      table: {
        headers: ["Canal", "Description"],
        rows: [
          ["SEO", "Optimisation pour moteurs de recherche"],
          ["SEM", "Publicité payante sur recherche"],
          ["Social Media", "Réseaux sociaux et communautés"],
          ["Email Marketing", "Campagnes email et newsletters"],
          ["Blog & Content", "E-books, guides, articles"],
          ["Affiliation", "Partenariats et programmes d'affiliation"]
        ]
      },
      tips: [
        "Choisissez les canaux adaptés à votre audience",
        "Testez, mesurez, optimisez"
      ]
    },
    color: "from-cyan-600 to-cyan-700"
  },
  {
    id: 26,
    title: "Stratégies Inbound",
    subtitle: "Pull Tactics - Attirer naturellement",
    module: "Acquisition",
    type: "tactic",
    content: {
      definition: "Attirer les clients vers votre produit grâce à un contenu de valeur et pertinent",
      table: {
        headers: ["Type", "Description"],
        rows: [
          ["SEO", "Optimisation organique"],
          ["Blogging", "Articles réguliers"],
          ["Podcast", "Audio éducatif"],
          ["Webinars", "En ligne interactif"]
        ]
      },
      keyPoints: [
        "Trafic organique durable",
        "Fidélisation audience",
        "Autorité naturelle",
        "ROI élevé long terme"
      ],
      examples: [
        { name: "HubSpot", tactic: "Guides et templates", result: "Leader inbound marketing" },
        { name: "Moz", tactic: "SEO education", result: "Référence SEO mondiale" },
        { name: "Buffer", tactic: "Social media guides", result: "Millions de lecteurs" }
      ],
      tips: ["Qualité > Quantité", "Consistance", "Personnalisation"]
    },
    color: "from-green-600 to-green-700"
  },
  {
    id: 27,
    title: "Stratégies Outbound",
    subtitle: "Push Tactics - Prospecter activement",
    module: "Acquisition",
    type: "tactic",
    content: {
      definition: "Aller activement chercher les clients et prospects pour votre produit ou service",
      table: {
        headers: ["Canal", "Description"],
        rows: [
          ["Ads Payants", "Google Ads, Facebook, LinkedIn"],
          ["Cold Email", "Prospection personnalisée"],
          ["Cold Calling", "Prospection téléphonique"],
          ["Influenceurs Payants", "Ambassadeurs rémunérés"],
          ["Événements", "Conférences et salons"]
        ]
      },
      keyPoints: [
        "Quand utiliser: Lancement produit, Besoin urgent, Marché concurrentiel"
      ],
      metrics: ["CPA", "CPC", "ROI"],
      tips: ["Ciblage précis", "Personnalisation", "Follow-up rapide"]
    },
    color: "from-orange-600 to-orange-700"
  },
  {
    id: 28,
    title: "Tactiques SEO",
    subtitle: "Les 3 Piliers du SEO",
    module: "Acquisition",
    type: "tactic",
    content: {
      table: {
        headers: ["On-page", "Off-page", "Technique"],
        rows: [
          ["Contenu", "Backlinks", "Performance"],
          ["Structure", "Autorité", "Sitemap"],
          ["Balises H1, H2, meta", "Link Building", "Google My Business"],
          ["Mots-clés longue traîne", "Backlinks qualitatifs", "SEO Local"]
        ]
      },
      tools: ["Google Search Console", "SEMrush", "Ahrefs"],
      keyPoints: [
        "Trafic organique durable",
        "Autorité naturelle",
        "ROI durable"
      ]
    },
    color: "from-teal-600 to-teal-700"
  },

  // MODULE 7: PUBLICITÉ & SOCIAL (Slides 29-31)
  {
    id: 29,
    title: "Publicité Payante",
    subtitle: "Google Ads & Social Ads",
    module: "Publicité",
    type: "tools",
    content: {
      table: {
        headers: ["Plateforme", "Format", "Ciblage"],
        rows: [
          ["Google Ads Search", "Ads dans résultats recherche", "Intent-based"],
          ["Google Ads Display", "Bannières graphiques", "Audience"],
          ["Google Shopping", "Produits E-commerce", "Produit"],
          ["Facebook Ads", "Targeting par intérêts", "Remarketing intelligent"],
          ["LinkedIn", "Professionnels B2B", "Fonction, industrie"],
          ["TikTok", "Génération Z", "Viralité"]
        ]
      },
      keyPoints: [
        "A/B Testing des Ads",
        "Optimisation: CPA, ROAS, CTR, CVR",
        "Quality Score et negative keywords"
      ]
    },
    color: "from-red-600 to-red-700"
  },
  {
    id: 30,
    title: "Acquisition via Réseaux Sociaux",
    subtitle: "Stratégies par Plateforme",
    module: "Publicité",
    type: "tactic",
    content: {
      table: {
        headers: ["Plateforme", "Focus", "Tactiques"],
        rows: [
          ["LinkedIn", "Professionnels B2B", "Calendrier éditorial, engagement"],
          ["Facebook", "Public général", "Images haute qualité, communauté"],
          ["Instagram", "Visuel, inspiration", "Stories, Reels"],
          ["Twitter/X", "Real-time, conversations", "Threads, engagement"],
          ["TikTok", "Viralité, Gen Z", "UGC, authenticité"]
        ]
      },
      keyPoints: [
        "Contenu engageant et authentique",
        "Construction de communauté",
        "Viralité naturelle et amplifiée"
      ],
      tools: ["Hootsuite", "Buffer", "Analytics sociaux"]
    },
    color: "from-violet-600 to-violet-700"
  },

  // MODULE 8: ACTIVATION (Slides 31-35)
  {
    id: 31,
    title: "Deep Dive: Activation",
    subtitle: "Première interaction signifiante",
    module: "Activation",
    type: "framework",
    content: {
      definition: "Première interaction signifiante d'un utilisateur avec votre produit",
      steps: [
        { step: "Niveau 1", description: "Navigation > 30 sec" },
        { step: "Niveau 2", description: "Lead capture (email)" },
        { step: "Niveau 3", description: "Création de compte" }
      ],
      table: {
        headers: ["Métrique", "Description"],
        rows: [
          ["Taux d'Activation", "% visiteurs activés"],
          ["Temps vers Activation", "Délai moyen"]
        ]
      },
      keyPoints: [
        "CTA clairs et A/B testing",
        "Friction minimale",
        "Optimisation onboarding",
        "Personnalisation"
      ]
    },
    color: "from-amber-600 to-amber-700"
  },
  {
    id: 32,
    title: "Optimisation des Landing Pages",
    subtitle: "Éléments Clés de Conversion",
    module: "Activation",
    type: "tactic",
    content: {
      keyPoints: [
        "Titre H1 convaincant + sous-titre",
        "CTA clair et visible",
        "Bénéfices clairs avec liste à puces",
        "Preuve sociale : témoignages, avis",
        "Formulaire simple"
      ],
      table: {
        headers: ["Test A/B", "Éléments"],
        rows: [
          ["Titres", "Variations de copywriting"],
          ["CTA", "Texte, couleur, position"],
          ["Images", "Visuel impact"]
        ]
      },
      tips: [
        "Vitesse de chargement optimale",
        "Mobile-first design",
        "Navigation intuitive",
        "User testing régulier"
      ],
      tools: ["Heatmaps", "Session recordings", "Unbounce", "Leadpages"]
    },
    color: "from-lime-600 to-lime-700"
  },
  {
    id: 33,
    title: "Optimisation du Taux de Conversion (CRO)",
    subtitle: "Processus A/B Testing",
    module: "Activation",
    type: "framework",
    content: {
      definition: "Processus d'amélioration du taux de conversion grâce à l'analyse et l'expérimentation",
      steps: [
        { step: "Hypothèse", description: "Formuler une hypothèse basée sur les données" },
        { step: "Test", description: "Créer et lancer l'expérience" },
        { step: "Analyse", description: "Mesurer et analyser les résultats" },
        { step: "Implementation", description: "Déployer la variante gagnante" }
      ],
      table: {
        headers: ["Méthode CRO"],
        rows: [
          ["A/B Testing"],
          ["Multivariate Testing"],
          ["Heatmaps"],
          ["User Recordings"]
        ]
      },
      tools: ["Optimizely", "VWO", "Hotjar"]
    },
    color: "from-sky-600 to-sky-700"
  },
  {
    id: 34,
    title: "Stratégies d'Onboarding",
    subtitle: "Maximiser l'activation et la rétention",
    module: "Activation",
    type: "tactic",
    content: {
      keyPoints: [
        "Simple & Rapide : Moins de 5 minutes pour commencer",
        "Valeur Immédiate : Wow moment dès les premières étapes",
        "Personnalisé : Adapté au persona et au contexte",
        "Progressif : Étape par étape, sur demande",
        "Impact: Augmente la rétention, réduit le churn, accélère time-to-value"
      ],
      table: {
        headers: ["Type d'Onboarding", "Description"],
        rows: [
          ["Guided Tour", "Visite guidée du produit"],
          ["Tooltips", "Indices contextuels"],
          ["Checklists", "Liste de tâches à accomplir"],
          ["Gamification", "Points, badges, progress bars"]
        ]
      },
      tools: ["Intercom", "Userpilot", "Appcues"]
    },
    color: "from-indigo-600 to-indigo-700"
  },

  // MODULE 9: RÉTENTION (Slides 35-40)
  {
    id: 35,
    title: "Deep Dive: Rétention",
    subtitle: "Garder les clients sur le long terme",
    module: "Rétention",
    type: "framework",
    content: {
      definition: "Faire revenir les utilisateurs et les garder comme clients sur le long terme",
      table: {
        headers: ["Stratégie", "Description"],
        rows: [
          ["Notifications", "Email, push, in-app"],
          ["Communauté", "Forums, groupes, events"],
          ["Loyauté", "Points, rewards, gamification"],
          ["Produit", "Features, UX, value"],
          ["Support", "Chat, email, téléphone"],
          ["Analytics", "Monitoring, optimisation"]
        ]
      },
      metrics: ["Cohort Analysis", "Churn Rate", "Retention Rate"],
      keyPoints: [
        "Communication régulière sans spam",
        "Créer des habitudes utilisateur"
      ]
    },
    color: "from-rose-600 to-rose-700"
  },
  {
    id: 36,
    title: "Construire des Habitudes Utilisateur",
    subtitle: "Hook Model de Nir Eyal",
    module: "Rétention",
    type: "framework",
    content: {
      steps: [
        { step: "Trigger", description: "Déclencheur - Notifications push, email, in-app" },
        { step: "Action", description: "Action simple et facilitée" },
        { step: "Variable Reward", description: "Récompense variable et surprenante" },
        { step: "Investment", description: "Investissement de l'utilisateur" }
      ],
      table: {
        headers: ["Gamification", "Techniques"],
        rows: [
          ["Streaks", "Séries consécutives"],
          ["Badges", "Récompenses visuelles"],
          ["Classements", "Leaderboards sociaux"],
          ["Défis quotidiens", "Challenges engageants"]
        ]
      },
      tips: [
        "Nudges subtils et contextuels",
        "Timings optimaux et personnalisés",
        "Progression visible"
      ]
    },
    color: "from-purple-600 to-fuchsia-600"
  },
  {
    id: 37,
    title: "Email Marketing & Automation",
    subtitle: "Workflows automatisés",
    module: "Rétention",
    type: "tools",
    content: {
      table: {
        headers: ["Type d'Email", "Objectif"],
        rows: [
          ["Welcome Series", "Séquence onboarding"],
          ["Drip Campaigns", "Contenu éducatif progressif"],
          ["Abandoned Cart", "Récupération panier"],
          ["Re-engagement", "Retrouver les inactifs"],
          ["Newsletters", "Information régulière"],
          ["Transactional", "Confirmations, factures"]
        ]
      },
      metrics: ["Open rate", "Click rate", "Conversion rate", "Unsubscribe rate"],
      keyPoints: [
        "Segmentation avancée",
        "Personnalisation contextuelle",
        "Fréquence optimale",
        "Design responsive",
        "Test A/B continu"
      ],
      tools: ["Mailchimp", "ConvertKit", "ActiveCampaign"]
    },
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: 38,
    title: "Gamification",
    subtitle: "Engager par le jeu",
    module: "Rétention",
    type: "concept",
    content: {
      definition: "Application de principes de jeux dans des contextes non-ludiques pour motiver et engager les utilisateurs",
      table: {
        headers: ["Élément", "Description"],
        rows: [
          ["Points", "Système de récompense"],
          ["Badges", "Reconnaissances visuelles"],
          ["Leaderboards", "Classements sociaux"],
          ["Challenges", "Défis quotidiens"],
          ["Progress Bars", "Progression visible"],
          ["Récompenses", "Avantages tangibles"]
        ]
      },
      keyPoints: [
        "Augmente l'engagement",
        "Améliore la rétention",
        "Motive les utilisateurs",
        "Crée de la valeur sociale"
      ],
      examples: [
        { name: "Duolingo", tactic: "Streaks et XP", result: "Leader engagement éducation" },
        { name: "Strava", tactic: "Segments et classements", result: "Communauté sportive massive" }
      ],
      tips: ["Équilibre challenge/récompense", "Feedback immédiat", "Progression visible"]
    },
    color: "from-yellow-600 to-orange-600"
  },
  {
    id: 39,
    title: "Construction de Communauté",
    subtitle: "Plateformes et engagement",
    module: "Rétention",
    type: "tactic",
    content: {
      keyPoints: [
        "Bouche-à-oreille organique",
        "Fidélisation accrue",
        "Feedback précieux",
        "Co-création avec utilisateurs"
      ],
      table: {
        headers: ["Plateforme", "Description"],
        rows: [
          ["Discord", "Chat vocal & textuel, serveurs thématiques"],
          ["Slack", "Teams, canaux, intégrations business"],
          ["Facebook Groups", "Groupes, événements, discussions"],
          ["Forums", "Reddit, Discourse, discussions"]
        ]
      },
      tips: [
        "Support peer-to-peer et AMAs",
        "Tips & tricks et contenu exclusif",
        "Règles claires et modérateurs actifs",
        "Contenu généré par les utilisateurs"
      ]
    },
    color: "from-emerald-600 to-teal-600"
  },

  // MODULE 10: RECOMMANDATION (Slides 40-44)
  {
    id: 40,
    title: "Deep Dive: Recommandation",
    subtitle: "Viralité et bouche-à-oreille",
    module: "Recommandation",
    type: "framework",
    content: {
      definition: "Processus où les utilisateurs recommandent activement votre produit à leur réseau",
      table: {
        headers: ["Stratégie", "Description"],
        rows: [
          ["Programme de Parrainage", "Récompenses mutuelles"],
          ["Reviews & Avis", "Témoignages clients"],
          ["Viralité Organique", "Contenu partageable, viral loops"],
          ["Influenceurs", "Ambassadeurs authentiques"]
        ]
      },
      keyPoints: [
        "Confiance sociale élevée",
        "Coût acquisition le plus bas",
        "Qualité prospects supérieure"
      ],
      metrics: ["NPS", "Referral Rate", "K-Factor (coefficient viral)"],
      examples: [
        { name: "Dropbox", tactic: "Referral program", result: "Croissance exponentielle" },
        { name: "WhatsApp", tactic: "Viralité native", result: "Adoption massive" },
        { name: "Airbnb", tactic: "Reviews", result: "Confiance communauté" }
      ]
    },
    color: "from-green-600 to-emerald-600"
  },
  {
    id: 41,
    title: "Stratégies de Bouche-à-Oreille",
    subtitle: "Word of Mouth (WOM)",
    module: "Recommandation",
    type: "tactic",
    content: {
      definition: "92% des consommateurs font confiance aux recommandations d'amis",
      table: {
        headers: ["Stratégie WOM", "Tactique"],
        rows: [
          ["Parrainage", "Programme de récompenses"],
          ["Email Invites", "Invitations personnalisées"],
          ["Social Proof", "Avis & témoignages"],
          ["Reviews", "Plateformes de reviews"],
          ["Share Buttons", "Facilité de partage"],
          ["Événements", "Lancements & rencontres"]
        ]
      },
      keyPoints: [
        "Credibilité authentique",
        "Taux de conversion élevé",
        "Coût acquisition minimal",
        "Recommandations naturelles"
      ],
      tips: [
        "Gamification parrainage",
        "Campagnes référentielles",
        "Influenceurs ambassadeurs",
        "Contenu partageable"
      ]
    },
    color: "from-pink-600 to-rose-600"
  },

  // MODULE 11: REVENUS (Slides 42-46)
  {
    id: 42,
    title: "Deep Dive: Revenus",
    subtitle: "Stratégies de Monétisation",
    module: "Revenus",
    type: "framework",
    content: {
      definition: "Processus de transformation des utilisateurs en clients payants et d'optimisation des flux de revenus",
      table: {
        headers: ["Modèle", "Description"],
        rows: [
          ["Subscription", "Paiement récurrent"],
          ["One-Time", "Paiement unique"],
          ["Freemium", "Essai gratuit + premium"],
          ["Marketplace", "Commission sur transaction"],
          ["Advertising", "Publicité intégrée"],
          ["Usage-Based", "Pay-as-you-go"]
        ]
      },
      metrics: ["LTV (Lifetime Value)", "CAC (Coût Acquisition)", "Margin (Marge nette)", "MRR (Revenu mensuel)"],
      keyPoints: [
        "Upselling & cross-selling",
        "Dynamic pricing",
        "Réduction du churn",
        "Bundling de services"
      ]
    },
    color: "from-emerald-600 to-green-700"
  },
  {
    id: 43,
    title: "Stratégies de Monétisation",
    subtitle: "Pricing Strategies",
    module: "Revenus",
    type: "tactic",
    content: {
      table: {
        headers: ["Stratégie", "Description"],
        rows: [
          ["Freemium", "Accès gratuit + features payantes"],
          ["Tiered Pricing", "Basic, Pro, Enterprise"],
          ["Pay-As-You-Go", "Paiement à l'utilisation"],
          ["Dynamic Pricing", "Prix en temps réel / algorithmes IA"],
          ["Bundling", "Packs de services groupés"],
          ["Value-Based", "Prix basé sur la valeur perçue"]
        ]
      },
      keyPoints: [
        "A/B Testing des prix",
        "Psychological pricing (9,99€ vs 10€)",
        "Ancrage des prix",
        "Discount sociaux",
        "Offrir plusieurs options de paiement"
      ]
    },
    color: "from-yellow-600 to-amber-700"
  },
  {
    id: 44,
    title: "Stratégies Avancées de Revenus",
    subtitle: "Upselling, Cross-selling & Modèles hybrides",
    module: "Revenus",
    type: "tactic",
    content: {
      table: {
        headers: ["Tactique", "Description"],
        rows: [
          ["Upselling", "Plans supérieurs au bon moment"],
          ["Cross-Selling", "Produits complémentaires suggérés"],
          ["Downselling", "Alternatives moins chères"],
          ["Free Trials", "Essai gratuit avec engagement"],
          ["Social Proof", "Témoignages clients visibles"]
        ]
      },
      keyPoints: [
        "LTV = ARPU × Lifetime",
        "CAC = Marketing + Sales",
        "LTV:CAC > 3:1",
        "Payback < 12 mois"
      ]
    },
    color: "from-orange-600 to-red-600"
  },

  // MODULE 12: MÉTHODE SCIENTIFIQUE (Slides 47-50)
  {
    id: 45,
    title: "La Méthode Scientifique en Growth Hacking",
    subtitle: "Processus d'expérimentation",
    module: "Méthode Scientifique",
    type: "framework",
    content: {
      steps: [
        { step: "1. Observation & Analyse", description: "Analyser comportement utilisateur" },
        { step: "2. Formulation d'hypothèse", description: "Hypothèses testables" },
        { step: "3. Expérimentation", description: "Tester de manière contrôlée" },
        { step: "4. Mesure & Conclusion", description: "Analyser les résultats" }
      ],
      table: {
        headers: ["Data-Driven ✅", "Intuition ❌"],
        rows: [
          ["Basé sur données objectives", "Basé sur opinion subjective"],
          ["Mesure et itération", "Hasard et chance"],
          ["Cycle continu d'amélioration", "Suppositions et opinions"],
          ["Décisions objectives et scalables", "Décisions non reproductibles"]
        ]
      },
      keyPoints: [
        "La méthode scientifique transforme les suppositions en connaissances validées et actionnables"
      ]
    },
    color: "from-indigo-600 to-violet-700"
  },
  {
    id: 46,
    title: "ICE Score Framework",
    subtitle: "Prioriser les expériences",
    module: "Méthode Scientifique",
    type: "framework",
    content: {
      definition: "Framework de priorisation des expériences de croissance",
      steps: [
        { step: "I - Impact", description: "Quel sera l'impact potentiel? (1-10)" },
        { step: "C - Confidence", description: "Quel est votre niveau de confiance? (1-10)" },
        { step: "E - Ease", description: "Quelle est la facilité d'implémentation? (1-10)" }
      ],
      keyPoints: [
        "ICE Score = Impact × Confidence × Ease",
        "Prioriser les expériences avec le score le plus élevé",
        "Réévaluer régulièrement les scores"
      ],
      tips: [
        "Utilisez un backlog d'idées",
        "Documentez toutes les expériences",
        "Partagez les learnings avec l'équipe"
      ]
    },
    color: "from-cyan-600 to-blue-700"
  },
  {
    id: 47,
    title: "Métriques Clés & KPIs",
    subtitle: "Choisir les bons indicateurs",
    module: "Méthode Scientifique",
    type: "tools",
    content: {
      table: {
        headers: ["AARRR", "Métriques Clés"],
        rows: [
          ["Acquisition", "Trafic, Leads, CAC"],
          ["Activation", "Taux activation, Onboarding"],
          ["Rétention", "Churn rate, LTV, DAU/MAU"],
          ["Recommandation", "NPS, Referral Rate, K-Factor"],
          ["Revenus", "MRR, ARPU, CLV"]
        ]
      },
      keyPoints: [
        "Alignés avec objectifs business",
        "Actionnables et mesurables",
        "Impact sur croissance"
      ],
      tips: [
        "⚠ Éviter les Vanity Metrics: Visites totales, Followers sociaux, Likes et impressions"
      ]
    },
    color: "from-slate-600 to-gray-700"
  },

  // MODULE 13: OUTILS & STACK (Slides 48-50)
  {
    id: 48,
    title: "Stack Technique du Growth Hacker",
    subtitle: "Outils essentiels par catégorie",
    module: "Outils",
    type: "tools",
    content: {
      table: {
        headers: ["Catégorie", "Outils"],
        rows: [
          ["Analytics", "Google Analytics 4, Mixpanel, Amplitude"],
          ["Automation", "Zapier, Make, n8n"],
          ["Email", "Mailchimp, ConvertKit, ActiveCampaign"],
          ["CRM", "HubSpot, Pipedrive, Salesforce"],
          ["SEO", "Ahrefs, SEMrush, Google Search Console"],
          ["Ads", "Google Ads, Meta Ads, LinkedIn Campaign Manager"],
          ["Landing Pages", "Unbounce, Leadpages, Carrd"],
          ["Heatmaps", "Hotjar, Clarity, FullStory"],
          ["A/B Testing", "Optimizely, VWO, Google Optimize"],
          ["Social", "Hootsuite, Buffer, Later"]
        ]
      }
    },
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: 49,
    title: "IA & Automatisation",
    subtitle: "Le futur du Growth Hacking",
    module: "Outils",
    type: "tools",
    content: {
      table: {
        headers: ["Usage IA", "Outils"],
        rows: [
          ["Copywriting", "ChatGPT, Claude, Copy.ai"],
          ["Images", "Midjourney, DALL-E, Stable Diffusion"],
          ["Automation", "Phantombuster, Waalaxy, Dripify"],
          ["Vidéo", "Synthesia, Runway, HeyGen"],
          ["Transcription", "Otter.ai, Descript"],
          ["Code", "GitHub Copilot, Cursor"]
        ]
      },
      keyPoints: [
        "Productivité x10 avec l'IA",
        "Automatisation des tâches répétitives",
        "Personnalisation à grande échelle",
        "Analyse prédictive"
      ]
    },
    color: "from-fuchsia-600 to-pink-600"
  },
  {
    id: 50,
    title: "Récapitulatif & Prochaines Étapes",
    subtitle: "Votre roadmap Growth Hacking",
    module: "Conclusion",
    type: "intro",
    content: {
      steps: [
        { step: "1. Fondations", description: "Comprendre vos clients et valider le Product Market Fit" },
        { step: "2. Acquisition", description: "Attirer les bons prospects avec les bons canaux" },
        { step: "3. Activation", description: "Optimiser l'onboarding et le time-to-value" },
        { step: "4. Rétention", description: "Créer des habitudes et fidéliser" },
        { step: "5. Recommandation", description: "Transformer les clients en ambassadeurs" },
        { step: "6. Revenus", description: "Optimiser la monétisation et le LTV" }
      ],
      keyPoints: [
        "Commencez par une métrique clé (North Star Metric)",
        "Expérimentez rapidement et mesurez",
        "Documentez tous vos apprentissages",
        "Itérez et améliorez continuellement",
        "🚀 Le Growth Hacking est un marathon, pas un sprint!"
      ]
    },
    color: "from-primary to-primary/80"
  }
];

// Module configuration for navigation
export const growthModules = [
  { id: "Introduction", name: "Introduction", slides: [1, 5], color: "bg-blue-500", icon: "🎯" },
  { id: "Framework AARRR", name: "Framework AARRR", slides: [6, 9], color: "bg-emerald-500", icon: "📊" },
  { id: "Culture Data-Driven", name: "Culture Data-Driven", slides: [10, 12], color: "bg-violet-500", icon: "📈" },
  { id: "Connaissance Client", name: "Connaissance Client", slides: [13, 16], color: "bg-amber-500", icon: "👥" },
  { id: "Validation", name: "Validation", slides: [17, 21], color: "bg-red-500", icon: "✅" },
  { id: "Acquisition", name: "Acquisition", slides: [22, 28], color: "bg-blue-600", icon: "🎣" },
  { id: "Publicité", name: "Publicité & Social", slides: [29, 30], color: "bg-pink-500", icon: "📣" },
  { id: "Activation", name: "Activation", slides: [31, 34], color: "bg-lime-500", icon: "⚡" },
  { id: "Rétention", name: "Rétention", slides: [35, 39], color: "bg-rose-500", icon: "❤️" },
  { id: "Recommandation", name: "Recommandation", slides: [40, 41], color: "bg-green-500", icon: "🔄" },
  { id: "Revenus", name: "Revenus", slides: [42, 44], color: "bg-yellow-500", icon: "💰" },
  { id: "Méthode Scientifique", name: "Méthode Scientifique", slides: [45, 47], color: "bg-indigo-500", icon: "🔬" },
  { id: "Outils", name: "Outils & Stack", slides: [48, 49], color: "bg-purple-500", icon: "🛠️" },
  { id: "Conclusion", name: "Conclusion", slides: [50, 50], color: "bg-primary", icon: "🚀" }
];
