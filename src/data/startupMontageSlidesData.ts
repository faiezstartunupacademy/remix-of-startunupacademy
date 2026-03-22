export interface MontageModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  duration: string;
  objectives: string[];
  slides: MontageSlide[];
  activity: MontageActivity;
}

export interface MontageSlide {
  id: string;
  type: 'intro' | 'concept' | 'framework' | 'case-study' | 'exercise' | 'summary';
  title: string;
  content: string;
  bulletPoints?: string[];
  quote?: { text: string; author: string };
  visual?: string;
  tips?: string[];
}

export interface MontageActivity {
  id: string;
  title: string;
  type: 'brainstorm' | 'canvas' | 'debate' | 'pitch' | 'quiz' | 'simulation' | 'reflection';
  duration: string;
  description: string;
  instructions: string[];
  deliverables: string[];
  evaluation?: string[];
}

export const montageModules: MontageModule[] = [
  {
    id: "module-1",
    title: "L'ADN de l'Entrepreneur",
    subtitle: "Mindset & Effectuation",
    icon: "🧬",
    color: "from-violet-500 to-purple-600",
    duration: "90 min",
    objectives: [
      "Comprendre la neurobiologie de l'entrepreneur",
      "Maîtriser les principes de l'effectuation (Sarasvathy)",
      "Développer un mindset d'exploration vs exploitation"
    ],
    slides: [
      {
        id: "1-1",
        type: "intro",
        title: "Le Cerveau Entrepreneurial",
        content: "L'entrepreneuriat n'est pas un talent inné mais une compétence qui se développe. La recherche en neurosciences révèle que les entrepreneurs développent des circuits neuronaux spécifiques.",
        quote: { 
          text: "L'entrepreneur ne prédit pas l'avenir, il le crée.", 
          author: "Saras Sarasvathy" 
        }
      },
      {
        id: "1-2",
        type: "concept",
        title: "Effectuation vs Causation",
        content: "Deux logiques de raisonnement opposées pour créer une entreprise.",
        bulletPoints: [
          "CAUSATION: Définir un objectif → Chercher les moyens (MBA traditionnel)",
          "EFFECTUATION: Partir de vos moyens → Imaginer les objectifs possibles",
          "L'oiseau dans la main: Qui suis-je? Que sais-je? Qui je connais?",
          "La perte acceptable: Combien suis-je prêt à perdre?"
        ]
      },
      {
        id: "1-3",
        type: "framework",
        title: "Les 5 Principes de l'Effectuation",
        content: "Framework développé par Saras Sarasvathy après l'étude de 27 entrepreneurs experts.",
        bulletPoints: [
          "🐦 Bird-in-Hand: Commencer avec ce que vous avez",
          "💰 Affordable Loss: Se concentrer sur ce qu'on peut perdre",
          "🤝 Crazy Quilt: Construire des partenariats dès le départ",
          "🍋 Lemonade: Transformer les surprises en opportunités",
          "✈️ Pilot-in-the-Plane: L'avenir se crée, ne se prédit pas"
        ],
        tips: [
          "Les experts utilisent l'effectuation, les novices la causation",
          "Plus l'incertitude est grande, plus l'effectuation est efficace"
        ]
      },
      {
        id: "1-4",
        type: "case-study",
        title: "Airbnb: L'Effectuation en Action",
        content: "Comment Brian Chesky a appliqué l'effectuation sans le savoir.",
        bulletPoints: [
          "Bird-in-Hand: Un appartement + des matelas gonflables",
          "Affordable Loss: Quelques centaines de dollars maximum",
          "Crazy Quilt: Premiers utilisateurs = premiers ambassadeurs",
          "Lemonade: Rejet de 7 investisseurs → pivot vers l'expérience"
        ]
      },
      {
        id: "1-5",
        type: "summary",
        title: "Points Clés - Module 1",
        content: "Ce qu'il faut retenir sur le mindset entrepreneurial.",
        bulletPoints: [
          "L'entrepreneuriat est une méthode, pas un trait de personnalité",
          "Commencez avec vos moyens, pas avec un business plan parfait",
          "Acceptez l'incertitude comme source d'opportunités",
          "Construisez en avançant, ne planifiez pas tout à l'avance"
        ]
      }
    ],
    activity: {
      id: "activity-1",
      title: "Mon Inventaire Entrepreneurial",
      type: "reflection",
      duration: "25 min",
      description: "Exercice d'introspection pour identifier vos ressources effectuales.",
      instructions: [
        "Listez 10 compétences uniques que vous possédez",
        "Identifiez 15 personnes de votre réseau avec leurs expertises",
        "Définissez votre perte acceptable (temps, argent, opportunités)",
        "Imaginez 3 projets possibles avec ces ressources"
      ],
      deliverables: [
        "Carte des ressources personnelles",
        "Liste des partenaires potentiels",
        "Pitch de 30 secondes pour chaque idée"
      ]
    }
  },
  {
    id: "module-2",
    title: "Découverte du Problème",
    subtitle: "Design Thinking & Empathie",
    icon: "🔍",
    color: "from-blue-500 to-cyan-600",
    duration: "120 min",
    objectives: [
      "Maîtriser l'approche Human-Centered Design",
      "Conduire des interviews utilisateurs efficaces",
      "Identifier les vrais problèmes vs symptômes"
    ],
    slides: [
      {
        id: "2-1",
        type: "intro",
        title: "Fall in Love with the Problem",
        content: "La plus grande erreur des startups: tomber amoureux de leur solution avant de comprendre le problème.",
        quote: {
          text: "Si j'avais une heure pour résoudre un problème, je passerais 55 minutes à comprendre le problème et 5 minutes à trouver la solution.",
          author: "Albert Einstein"
        }
      },
      {
        id: "2-2",
        type: "framework",
        title: "Le Double Diamant",
        content: "Processus de design en 4 phases: Découvrir, Définir, Développer, Délivrer.",
        bulletPoints: [
          "DIVERGER: Explorer largement, sans jugement",
          "CONVERGER: Synthétiser, prioriser, décider",
          "Premier diamant: Trouver le BON problème",
          "Second diamant: Trouver la BONNE solution"
        ]
      },
      {
        id: "2-3",
        type: "concept",
        title: "Le Mom Test",
        content: "L'art de poser des questions qui révèlent la vérité (Rob Fitzpatrick).",
        bulletPoints: [
          "❌ 'Tu achèterais mon produit?' → Mensonge garanti",
          "✅ 'Parle-moi de la dernière fois où tu as eu ce problème'",
          "❌ 'C'est une bonne idée?' → Opinion sans valeur",
          "✅ 'Qu'as-tu déjà essayé pour résoudre ce problème?'",
          "❌ 'Combien paierais-tu?' → Hypothétique",
          "✅ 'Combien ce problème te coûte actuellement?'"
        ],
        tips: [
          "Les faits passés valent plus que les opinions futures",
          "Demandez des engagements, pas des compliments"
        ]
      },
      {
        id: "2-4",
        type: "concept",
        title: "Jobs-to-be-Done (JTBD)",
        content: "Les gens n'achètent pas des produits, ils 'embauchent' des solutions pour faire un travail.",
        bulletPoints: [
          "Quand [situation], je veux [motivation], pour que [résultat attendu]",
          "Job fonctionnel: Ce que le client veut accomplir",
          "Job émotionnel: Comment il veut se sentir",
          "Job social: Comment il veut être perçu"
        ]
      },
      {
        id: "2-5",
        type: "summary",
        title: "Points Clés - Module 2",
        content: "L'empathie est votre super-pouvoir entrepreneurial.",
        bulletPoints: [
          "Ne construisez jamais sans avoir parlé à 20+ utilisateurs potentiels",
          "Les problèmes fréquents + douloureux = opportunités en or",
          "Observez ce que les gens FONT, pas ce qu'ils DISENT",
          "Un bon problème vaut mieux qu'une bonne solution"
        ]
      }
    ],
    activity: {
      id: "activity-2",
      title: "Safari d'Observation",
      type: "simulation",
      duration: "45 min",
      description: "Immersion terrain pour observer et interviewer de vrais utilisateurs.",
      instructions: [
        "Choisissez un lieu pertinent pour votre cible (café, supermarché, gare...)",
        "Observez pendant 15 min sans interagir: comportements, frustrations",
        "Réalisez 3 mini-interviews de 5 min avec des inconnus",
        "Utilisez exclusivement les questions du Mom Test"
      ],
      deliverables: [
        "Carnet d'observation avec 10 insights",
        "Verbatims des 3 interviews",
        "Formulation du problème en format JTBD"
      ],
      evaluation: [
        "Qualité des questions posées (pas d'opinions, des faits)",
        "Profondeur des insights découverts",
        "Pertinence du problème identifié"
      ]
    }
  },
  {
    id: "module-3",
    title: "Validation de la Solution",
    subtitle: "Lean Startup & MVP",
    icon: "🧪",
    color: "from-green-500 to-emerald-600",
    duration: "120 min",
    objectives: [
      "Appliquer la méthodologie Build-Measure-Learn",
      "Concevoir un MVP efficace",
      "Pivoter ou persévérer avec des données"
    ],
    slides: [
      {
        id: "3-1",
        type: "intro",
        title: "L'Art de la Validation Rapide",
        content: "Le but n'est pas de construire un produit parfait, mais d'apprendre le plus vite possible.",
        quote: {
          text: "Si vous n'avez pas honte de la première version de votre produit, c'est que vous l'avez lancé trop tard.",
          author: "Reid Hoffman, LinkedIn"
        }
      },
      {
        id: "3-2",
        type: "framework",
        title: "La Boucle Build-Measure-Learn",
        content: "Le cœur de la méthodologie Lean Startup (Eric Ries).",
        bulletPoints: [
          "BUILD: Créer le MVP le plus simple possible",
          "MEASURE: Collecter des données actionables",
          "LEARN: Valider ou invalider vos hypothèses",
          "Objectif: Minimiser le temps de boucle"
        ],
        tips: [
          "Une startup n'est pas une petite entreprise, c'est une machine à apprendre",
          "Chaque cycle doit tester UNE hypothèse critique"
        ]
      },
      {
        id: "3-3",
        type: "concept",
        title: "Types de MVP",
        content: "Le MVP n'est pas un produit minimum, c'est un véhicule d'apprentissage.",
        bulletPoints: [
          "🎬 Video MVP: Dropbox (3 min video → 75K signups)",
          "🚪 Concierge MVP: Food on the Table (service manuel)",
          "🧙 Wizard of Oz: Faire croire à l'automatisation",
          "📄 Landing Page: Tester la proposition de valeur",
          "💀 Smoke Test: Mesurer l'intention d'achat"
        ]
      },
      {
        id: "3-4",
        type: "concept",
        title: "Pivot vs Persévère",
        content: "Quand changer de direction? La décision la plus difficile.",
        bulletPoints: [
          "🚨 Signaux d'alerte: Métriques plates, feedback tiède, pas de traction",
          "Types de pivots: Zoom-in, Zoom-out, Segment client, Canal, Technologie",
          "Le pivot n'est pas un échec, c'est un apprentissage validé",
          "Twitter = pivot de Odeo (podcasts), YouTube = pivot de site de rencontres"
        ]
      },
      {
        id: "3-5",
        type: "summary",
        title: "Points Clés - Module 3",
        content: "Validez avant de construire, apprenez avant d'investir.",
        bulletPoints: [
          "Le MVP teste votre hypothèse risquée, pas votre vision complète",
          "Les métriques de vanité (likes, visites) ≠ métriques actionables",
          "Pivoter sur des données, pas sur des émotions",
          "1 client payant > 1000 'super intéressés'"
        ]
      }
    ],
    activity: {
      id: "activity-3",
      title: "MVP en 60 Minutes",
      type: "simulation",
      duration: "60 min",
      description: "Concevoir et tester un MVP sans écrire une ligne de code.",
      instructions: [
        "Identifiez votre hypothèse risquée la plus critique",
        "Choisissez le type de MVP le plus rapide à créer",
        "Construisez votre MVP (landing page, mockup, script vidéo)",
        "Présentez-le à 3 personnes et collectez du feedback"
      ],
      deliverables: [
        "MVP fonctionnel (même rudimentaire)",
        "3 feedbacks utilisateurs documentés",
        "Décision: Pivot ou Persévère avec justification"
      ],
      evaluation: [
        "Vitesse d'exécution",
        "Pertinence du type de MVP choisi",
        "Qualité des apprentissages extraits"
      ]
    }
  },
  {
    id: "module-4",
    title: "Business Model Design",
    subtitle: "Canvas & Innovation",
    icon: "🎯",
    color: "from-orange-500 to-amber-600",
    duration: "120 min",
    objectives: [
      "Maîtriser le Business Model Canvas",
      "Identifier les patterns de business models gagnants",
      "Innover sur le modèle économique"
    ],
    slides: [
      {
        id: "4-1",
        type: "intro",
        title: "Au-delà du Produit",
        content: "Un excellent produit avec un mauvais business model échouera. Un produit moyen avec un excellent business model peut réussir.",
        quote: {
          text: "Une startup ne meurt jamais de manque d'idées, elle meurt de manque de business model.",
          author: "Steve Blank"
        }
      },
      {
        id: "4-2",
        type: "framework",
        title: "Business Model Canvas",
        content: "Les 9 blocs pour visualiser et innover votre modèle économique.",
        bulletPoints: [
          "DÉSIRABILITÉ: Segments clients, Proposition de valeur, Canaux, Relations",
          "FAISABILITÉ: Activités clés, Ressources clés, Partenaires clés",
          "VIABILITÉ: Structure de coûts, Flux de revenus",
          "Le canvas n'est pas un document statique, c'est un outil de conversation"
        ]
      },
      {
        id: "4-3",
        type: "concept",
        title: "Lean Canvas (Ash Maurya)",
        content: "Adaptation du BMC pour les startups à haut risque.",
        bulletPoints: [
          "Remplace Partenaires → PROBLÈME (top 3)",
          "Remplace Activités → SOLUTION",
          "Remplace Ressources → MÉTRIQUES CLÉS",
          "Ajoute AVANTAGE INJUSTE (ce qui ne se copie pas)",
          "Plus actionable pour les phases early-stage"
        ]
      },
      {
        id: "4-4",
        type: "concept",
        title: "Patterns de Business Models",
        content: "Ne réinventez pas la roue: apprenez des modèles qui marchent.",
        bulletPoints: [
          "🔓 Freemium: Gratuit + Premium (Spotify, LinkedIn)",
          "📦 Subscription: Revenus récurrents (Netflix, SaaS)",
          "🏪 Marketplace: Commission sur transactions (Airbnb, Uber)",
          "🪒 Razor & Blade: Produit pas cher + consommables (Nespresso)",
          "📢 Ads: Monétisation par la publicité (Google, Facebook)"
        ]
      },
      {
        id: "4-5",
        type: "summary",
        title: "Points Clés - Module 4",
        content: "Le business model est votre avantage compétitif durable.",
        bulletPoints: [
          "Un business model innovant peut disruper un marché établi",
          "Testez plusieurs modèles de revenus en parallèle",
          "L'avantage injuste = ce qui ne se copie pas en 6 mois",
          "Le BMC évolue: revisitez-le chaque mois"
        ]
      }
    ],
    activity: {
      id: "activity-4",
      title: "Canvas Battle",
      type: "debate",
      duration: "45 min",
      description: "Compétition entre équipes pour créer le meilleur business model.",
      instructions: [
        "Équipes de 3-4 personnes",
        "Chaque équipe complète un Lean Canvas en 20 min",
        "Présentation pitch de 3 min par équipe",
        "Vote et feedback croisé entre équipes"
      ],
      deliverables: [
        "Lean Canvas complété",
        "Pitch de 3 minutes",
        "Feedback structuré des autres équipes"
      ],
      evaluation: [
        "Cohérence entre les 9 blocs",
        "Clarté de la proposition de valeur",
        "Crédibilité du modèle de revenus"
      ]
    }
  },
  {
    id: "module-5",
    title: "Stratégie de Croissance",
    subtitle: "Growth Hacking & Traction",
    icon: "🚀",
    color: "from-pink-500 to-rose-600",
    duration: "120 min",
    objectives: [
      "Comprendre le framework AARRR (Pirate Metrics)",
      "Identifier les canaux de traction prioritaires",
      "Concevoir des expériences de croissance"
    ],
    slides: [
      {
        id: "5-1",
        type: "intro",
        title: "La Croissance n'est pas un Accident",
        content: "Les startups qui réussissent ne 'deviennent' pas virales, elles conçoivent la viralité.",
        quote: {
          text: "La croissance résout tous les problèmes... temporairement.",
          author: "Paul Graham, Y Combinator"
        }
      },
      {
        id: "5-2",
        type: "framework",
        title: "Le Funnel AARRR",
        content: "Les 5 métriques pirates pour mesurer et optimiser la croissance.",
        bulletPoints: [
          "🎯 ACQUISITION: Comment les utilisateurs vous trouvent?",
          "⚡ ACTIVATION: Première expérience 'wow'",
          "🔄 RÉTENTION: Reviennent-ils?",
          "💰 REVENU: Comment monétisez-vous?",
          "📣 RÉFÉRRAL: Recommandent-ils?"
        ],
        tips: [
          "Focus sur UNE métrique à la fois (North Star)",
          "La rétention avant l'acquisition!"
        ]
      },
      {
        id: "5-3",
        type: "concept",
        title: "Bullseye Framework",
        content: "19 canaux de traction: trouvez les 3 qui marchent pour vous.",
        bulletPoints: [
          "CERCLE EXTERNE: Brainstorm tous les canaux possibles",
          "CERCLE MILIEU: Testez les 3 plus prometteurs",
          "CENTRE (Bullseye): Scalez le canal gagnant",
          "Canaux: SEO, Content, Viral, PR, Ads, Partnerships, Events..."
        ]
      },
      {
        id: "5-4",
        type: "concept",
        title: "Expériences de Croissance",
        content: "Le growth hacking est une méthode scientifique appliquée au marketing.",
        bulletPoints: [
          "HYPOTHÈSE: 'Si nous faisons X, alors Y augmentera de Z%'",
          "EXPÉRIENCE: Test A/B avec groupe contrôle",
          "ANALYSE: Statistiquement significatif?",
          "DÉCISION: Scale, Kill, ou Iterate",
          "Cadence: 2-3 expériences par semaine minimum"
        ]
      },
      {
        id: "5-5",
        type: "summary",
        title: "Points Clés - Module 5",
        content: "La croissance est un processus, pas un événement.",
        bulletPoints: [
          "Fixez votre North Star Metric et optimisez tout autour",
          "Un seul canal peut représenter 80% de votre croissance",
          "La viralité se conçoit: coefficient K > 1",
          "Growth = Expérimentation continue"
        ]
      }
    ],
    activity: {
      id: "activity-5",
      title: "Growth Sprint",
      type: "brainstorm",
      duration: "45 min",
      description: "Générer et prioriser 10 expériences de croissance.",
      instructions: [
        "Mappez votre funnel AARRR actuel avec les métriques",
        "Identifiez le plus gros 'leak' du funnel",
        "Brainstormez 20 idées pour colmater ce leak",
        "Priorisez avec ICE Score (Impact, Confidence, Ease)"
      ],
      deliverables: [
        "Funnel AARRR avec métriques",
        "Top 3 expériences priorisées",
        "Protocole d'expérience pour l'expérience #1"
      ],
      evaluation: [
        "Qualité des hypothèses (spécifiques, mesurables)",
        "Créativité des idées de growth",
        "Rigueur du protocole d'expérience"
      ]
    }
  },
  {
    id: "module-6",
    title: "Pitch & Financement",
    subtitle: "Storytelling & Levée de Fonds",
    icon: "💎",
    color: "from-indigo-500 to-blue-600",
    duration: "90 min",
    objectives: [
      "Structurer un pitch deck convaincant",
      "Comprendre les attentes des investisseurs",
      "Maîtriser l'art du storytelling"
    ],
    slides: [
      {
        id: "6-1",
        type: "intro",
        title: "Vendre sa Vision",
        content: "Un pitch n'est pas une présentation de produit, c'est une histoire qui inspire l'action.",
        quote: {
          text: "Les investisseurs n'investissent pas dans des idées, ils investissent dans des fondateurs.",
          author: "Marc Andreessen, a16z"
        }
      },
      {
        id: "6-2",
        type: "framework",
        title: "Structure du Pitch Deck",
        content: "Les 12 slides essentielles selon Sequoia Capital.",
        bulletPoints: [
          "1. Titre: Nom + One-liner mémorable",
          "2. Problème: La douleur que vous résolvez",
          "3. Solution: Votre réponse unique",
          "4. Pourquoi maintenant: Timing et tendances",
          "5. Marché: TAM → SAM → SOM",
          "6. Produit: Démo ou screenshots",
          "7. Business Model: Comment vous gagnez de l'argent",
          "8. Traction: Preuves de succès",
          "9. Équipe: Pourquoi vous?",
          "10. Concurrence: Votre avantage",
          "11. Financiers: Projections",
          "12. Ask: Ce que vous demandez"
        ]
      },
      {
        id: "6-3",
        type: "concept",
        title: "L'Art du Storytelling",
        content: "Une histoire mémorable suit une structure narrative.",
        bulletPoints: [
          "LE HÉROS: Votre client, pas votre produit",
          "LE PROBLÈME: Le dragon à combattre",
          "LE GUIDE: Vous (et votre solution)",
          "LE VOYAGE: Comment vous allez les aider",
          "LA TRANSFORMATION: L'après vs l'avant"
        ],
        tips: [
          "Commencez par une anecdote personnelle",
          "Chiffres + Émotions = Mémorabilité"
        ]
      },
      {
        id: "6-4",
        type: "concept",
        title: "Questions d'Investisseurs",
        content: "Anticipez les 10 questions les plus fréquentes.",
        bulletPoints: [
          "Pourquoi vous? (Founder-Market Fit)",
          "Quelle est votre unfair advantage?",
          "Comment vous défendez-vous contre les géants?",
          "Quel est votre CAC vs LTV?",
          "Comment utilisez-vous les fonds?",
          "Quelle est votre stratégie de sortie?"
        ]
      },
      {
        id: "6-5",
        type: "summary",
        title: "Points Clés - Module 6",
        content: "Le pitch est un exercice de conviction, pas d'information.",
        bulletPoints: [
          "10 slides, 10 minutes, 10 secondes de mémorabilité",
          "Vendez le problème avant de vendre la solution",
          "La traction parle plus fort que les projections",
          "Préparez-vous à 100 'non' avant un 'oui'"
        ]
      }
    ],
    activity: {
      id: "activity-6",
      title: "Elevator Pitch Battle",
      type: "pitch",
      duration: "45 min",
      description: "Compétition de pitchs avec feedback en temps réel.",
      instructions: [
        "Préparez un pitch de 60 secondes",
        "Présentez devant le groupe (en ascenseur simulé!)",
        "Recevez feedback: Clarté, Conviction, Mémorabilité",
        "Itérez et re-pitchez en version améliorée"
      ],
      deliverables: [
        "Pitch de 60 secondes maîtrisé",
        "One-liner mémorable",
        "3 feedbacks documentés"
      ],
      evaluation: [
        "Clarté du problème et de la solution",
        "Présence et conviction",
        "Mémorabilité du hook"
      ]
    }
  }
];

export const courseMetadata = {
  title: "Montage des Startups",
  subtitle: "De l'idée au lancement: Masterclass en création d'entreprise",
  instructor: {
    name: "Formation Élite",
    credentials: "Expert International en Entrepreneuriat",
    philosophy: "Apprendre par l'action, valider par les données"
  },
  duration: "12 heures",
  modules: 6,
  activities: 6,
  level: "Intermédiaire à Avancé",
  prerequisites: [
    "Motivation entrepreneuriale",
    "Ouverture au feedback",
    "Capacité à sortir de sa zone de confort"
  ],
  outcomes: [
    "Maîtrise des méthodologies Lean et Design Thinking",
    "Capacité à valider une idée en moins de 2 semaines",
    "Business model testé et validé",
    "Pitch prêt pour investisseurs"
  ]
};
