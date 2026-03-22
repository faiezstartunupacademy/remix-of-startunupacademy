// Business Model Innovation Slides Data - Based on HBR Must Reads & Chander Velu's Blueprint

export interface BMISlide {
  id: number;
  module: string;
  title: string;
  type: 'intro' | 'concept' | 'framework' | 'case-study' | 'tool' | 'recap';
  content: {
    definition?: string;
    keyPoints?: string[];
    table?: { headers: string[]; rows: string[][] };
    steps?: { step: string; description: string }[];
    caseStudy?: { name: string; context: string; lesson: string };
    quote?: string;
    framework?: { title: string; elements: { name: string; description: string }[] };
  };
  color: string;
}

export const BMI_MODULES = [
  { id: 1, name: "Introduction", color: "bg-blue-600", slides: [1, 6] },
  { id: 2, name: "Fondamentaux", color: "bg-purple-600", slides: [7, 14] },
  { id: 3, name: "4V Framework", color: "bg-emerald-600", slides: [15, 22] },
  { id: 4, name: "Customer Value", color: "bg-amber-600", slides: [23, 30] },
  { id: 5, name: "Profit Formula", color: "bg-rose-600", slides: [31, 38] },
  { id: 6, name: "Ressources & Processus", color: "bg-indigo-600", slides: [39, 46] },
  { id: 7, name: "Quand Innover?", color: "bg-teal-600", slides: [47, 54] },
  { id: 8, name: "Leadership & Organisation", color: "bg-orange-600", slides: [55, 62] },
  { id: 9, name: "Cas d'Études", color: "bg-pink-600", slides: [63, 70] },
  { id: 10, name: "Mise en Œuvre", color: "bg-cyan-600", slides: [71, 78] },
];

export const BMI_SLIDES: BMISlide[] = [
  // MODULE 1 - Introduction (slides 1-6)
  {
    id: 1,
    module: "Introduction",
    title: "Business Model Innovation",
    type: "intro",
    content: {
      definition: "L'innovation de business model est la découverte et l'adoption de modes fondamentalement différents de proposition de valeur, de création et de capture de valeur pour transformer les marchés.",
      keyPoints: [
        "Plus puissante que l'innovation produit ou technologique",
        "11 des 27 entreprises Fortune 500 des 25 dernières années ont grandi par l'innovation de BM",
        "Les entreprises focalisées sur l'innovation BM surpassent leurs concurrents",
        "Clé pour résoudre le paradoxe de productivité"
      ]
    },
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    id: 2,
    module: "Introduction",
    title: "Pourquoi l'Innovation de Business Model?",
    type: "concept",
    content: {
      definition: "Dans un monde en mutation rapide, les modèles d'affaires traditionnels deviennent obsolètes. L'innovation de business model est devenue un impératif stratégique.",
      keyPoints: [
        "50%+ des dirigeants croient que le BM innovation sera plus important que l'innovation produit",
        "Les technologies digitales catalysent de nouveaux modèles d'affaires",
        "Les entreprises qui n'innovent pas risquent d'être disruptées",
        "Amazon, Uber, Airbnb, Netflix ont tous construit sur l'innovation BM"
      ],
      quote: "A good business model remains essential to every successful organization, whether it's a new venture or an established player."
    },
    color: "from-blue-500/20 to-purple-500/10"
  },
  {
    id: 3,
    module: "Introduction",
    title: "Le Business Model comme Histoire",
    type: "concept",
    content: {
      definition: "Un business model est une histoire qui explique comment l'entreprise fonctionne. Comme une bonne histoire, il contient des personnages précis, des motivations plausibles et une intrigue basée sur la création de valeur.",
      keyPoints: [
        "Qui est le client?",
        "Qu'est-ce que le client valorise?",
        "Comment gagnons-nous de l'argent?",
        "Quelle logique économique explique notre proposition de valeur?"
      ],
      caseStudy: {
        name: "American Express Traveler's Check",
        context: "En 1892, J.C. Fargo a créé le chèque de voyage après avoir eu des difficultés à convertir ses lettres de crédit en Europe.",
        lesson: "L'innovation était le 'float' - les clients payaient avant d'utiliser, créant un prêt sans intérêt pour l'entreprise."
      }
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 4,
    module: "Introduction",
    title: "Business Model vs Stratégie",
    type: "framework",
    content: {
      definition: "Un business model décrit comment les pièces d'une entreprise s'assemblent. La stratégie, elle, intègre la dimension compétitive: comment se différencier des concurrents.",
      table: {
        headers: ["Business Model", "Stratégie"],
        rows: [
          ["Décrit comment l'entreprise crée de la valeur", "Définit comment se différencier des concurrents"],
          ["Focus sur la cohérence interne", "Focus sur le positionnement externe"],
          ["Répond au 'comment'", "Répond au 'pourquoi' et 'où'"],
          ["Peut être copié", "Difficile à répliquer (ressources uniques)"]
        ]
      }
    },
    color: "from-blue-500/20 to-cyan-500/10"
  },
  {
    id: 5,
    module: "Introduction",
    title: "Deux Tests Critiques",
    type: "framework",
    content: {
      definition: "Tout business model doit passer deux tests fondamentaux pour réussir: le test narratif et le test des chiffres.",
      framework: {
        title: "Tests de Validation",
        elements: [
          { name: "Test Narratif", description: "L'histoire a-t-elle du sens? Les motivations des acteurs sont-elles cohérentes?" },
          { name: "Test des Chiffres", description: "Le P&L fonctionne-t-il? Les marges sont-elles suffisantes?" }
        ]
      },
      caseStudy: {
        name: "Webvan (échec)",
        context: "L'épicerie en ligne a échoué au test des chiffres - marges trop faibles, coûts de livraison trop élevés.",
        lesson: "Même avec une bonne technologie, sans modèle économique viable, l'échec est inévitable."
      }
    },
    color: "from-blue-500/20 to-emerald-500/10"
  },
  {
    id: 6,
    module: "Introduction",
    title: "Points Clés - Introduction",
    type: "recap",
    content: {
      keyPoints: [
        "L'innovation de BM peut créer des avantages compétitifs durables",
        "Un bon BM raconte une histoire cohérente sur la création de valeur",
        "Il doit passer le test narratif ET le test des chiffres",
        "BM ≠ Stratégie: le BM est le 'comment', la stratégie est le 'pourquoi'"
      ]
    },
    color: "from-blue-500/20 to-blue-500/5"
  },

  // MODULE 2 - Fondamentaux (slides 7-14)
  {
    id: 7,
    module: "Fondamentaux",
    title: "Définition du Business Model",
    type: "concept",
    content: {
      definition: "Un business model est un système d'activités qui connecte les aspects internes de l'entreprise (ressources, routines) avec les aspects externes (partenaires, marchés, clients).",
      keyPoints: [
        "Contenu: quelles activités font partie du modèle",
        "Structure: comment ces activités sont liées entre elles",
        "Gouvernance: qui prend les décisions",
        "Architecture: le pont entre valeur créée et valeur capturée"
      ]
    },
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    id: 8,
    module: "Fondamentaux",
    title: "Les 4 Éléments du Business Model",
    type: "framework",
    content: {
      definition: "Selon Johnson, Christensen et Kagermann, un business model se compose de quatre éléments interdépendants qui créent et délivrent de la valeur.",
      framework: {
        title: "Les 4 Éléments",
        elements: [
          { name: "Customer Value Proposition", description: "La façon dont vous aidez les clients à accomplir un 'job to be done'" },
          { name: "Profit Formula", description: "Le blueprint qui définit comment vous créez de la valeur pour l'entreprise" },
          { name: "Key Resources", description: "Les actifs requis pour délivrer la proposition de valeur" },
          { name: "Key Processes", description: "Les processus opérationnels et managériaux qui permettent la répétabilité" }
        ]
      }
    },
    color: "from-purple-500/20 to-indigo-500/10"
  },
  {
    id: 9,
    module: "Fondamentaux",
    title: "Interdépendance des Éléments",
    type: "concept",
    content: {
      definition: "La puissance du framework réside dans les interdépendances complexes entre ses éléments. Un changement majeur dans l'un affecte tous les autres.",
      keyPoints: [
        "Les entreprises prospères créent un système stable où ces éléments se renforcent",
        "La CVP et la Profit Formula définissent la valeur pour le client et l'entreprise",
        "Les ressources et processus décrivent comment délivrer cette valeur",
        "Modifier un élément nécessite de recalibrer tous les autres"
      ],
      quote: "As simple as this framework may seem, its power lies in the complex interdependencies of its parts."
    },
    color: "from-purple-500/20 to-pink-500/10"
  },
  {
    id: 10,
    module: "Fondamentaux",
    title: "Le Business Model comme Système Complexe",
    type: "concept",
    content: {
      definition: "Le business model peut être vu comme un système organisationnel complexe qui transforme des inputs en propositions de valeur pour les clients.",
      keyPoints: [
        "Les sous-systèmes sont interconnectés et interdépendants",
        "Un changement peut créer des effets en cascade",
        "La cohérence entre composants est essentielle",
        "L'approche holistique est requise pour l'innovation"
      ],
      caseStudy: {
        name: "Blockbuster vs Netflix",
        context: "Blockbuster a tenté d'intégrer un nouveau modèle en ligne à son modèle existant de magasins.",
        lesson: "L'incohérence entre les composants a conduit à la faillite - le ratio coût/revenu est passé de 0.72 à 1.11."
      }
    },
    color: "from-purple-500/20 to-rose-500/10"
  },
  {
    id: 11,
    module: "Fondamentaux",
    title: "Types d'Innovation de Business Model",
    type: "framework",
    content: {
      definition: "L'innovation de BM peut prendre plusieurs formes, de l'ajustement tactique à la transformation radicale.",
      table: {
        headers: ["Type", "Description", "Exemple"],
        rows: [
          ["Réactivation", "Réutiliser des éléments existants dans un nouveau contexte", "McDonald's franchising"],
          ["Reliaison", "Reconnecter les activités différemment", "Dell direct model"],
          ["Repartition", "Redistribuer les rôles entre partenaires", "Apple iTunes/iPod"],
          ["Relocalisation", "Déplacer les activités vers de nouveaux marchés", "Tata Nano"]
        ]
      }
    },
    color: "from-purple-500/20 to-amber-500/10"
  },
  {
    id: 12,
    module: "Fondamentaux",
    title: "La Cohérence Dynamique",
    type: "concept",
    content: {
      definition: "L'objectif du management est de maintenir la cohérence dynamique - la congruence entre les composants du business model tout en permettant l'innovation.",
      keyPoints: [
        "Fit interne: cohérence entre les composants du modèle",
        "Fit externe: alignement avec l'environnement",
        "La cohérence est mesurable via le Business Model Coherence Scorecard",
        "Le manque de cohérence mène à des performances sous-optimales"
      ]
    },
    color: "from-purple-500/20 to-teal-500/10"
  },
  {
    id: 13,
    module: "Fondamentaux",
    title: "Le Paradoxe de Productivité",
    type: "concept",
    content: {
      definition: "Malgré la prévalence des technologies digitales, la croissance de la productivité a ralenti. L'innovation de business model est un enabler critique pour résoudre ce paradoxe.",
      keyPoints: [
        "La productivité mondiale a ralenti de 2.4% à 2.1% entre 1996-2006 et 2007-2014",
        "Les industries les plus intensives en IT ont le plus contribué au ralentissement",
        "Historiquement, il faut 40+ ans pour que les nouvelles technologies impactent la productivité",
        "L'innovation de BM accélère la réalisation des bénéfices technologiques"
      ]
    },
    color: "from-purple-500/20 to-cyan-500/10"
  },
  {
    id: 14,
    module: "Fondamentaux",
    title: "Points Clés - Fondamentaux",
    type: "recap",
    content: {
      keyPoints: [
        "Le BM connecte ressources internes et environnement externe",
        "4 éléments: CVP, Profit Formula, Key Resources, Key Processes",
        "L'interdépendance crée de la complexité mais aussi de la valeur",
        "La cohérence dynamique est essentielle pour la performance"
      ]
    },
    color: "from-purple-500/20 to-purple-500/5"
  },

  // MODULE 3 - 4V Framework (slides 15-22)
  {
    id: 15,
    module: "4V Framework",
    title: "Le Framework des 4V",
    type: "framework",
    content: {
      definition: "Chander Velu propose le framework des 4V pour analyser et innover les business models de manière systématique.",
      framework: {
        title: "Les 4V du Business Model",
        elements: [
          { name: "Value Proposition", description: "Qui sont vos clients et qu'est-ce qu'ils valorisent?" },
          { name: "Value Creation", description: "Comment la chaîne de valeur est-elle configurée?" },
          { name: "Value Capture", description: "Quelle est la logique économique pour générer un retour?" },
          { name: "Value Network", description: "Quel est le rôle dans le réseau de valeur avec les partenaires?" }
        ]
      }
    },
    color: "from-emerald-500/20 to-emerald-500/5"
  },
  {
    id: 16,
    module: "4V Framework",
    title: "Value Proposition en Détail",
    type: "concept",
    content: {
      definition: "La proposition de valeur définit les clients cibles et les solutions offertes pour résoudre leurs problèmes ou accomplir leurs 'jobs to be done'.",
      keyPoints: [
        "Identifier clairement le segment client cible",
        "Comprendre les 'jobs to be done' non satisfaits",
        "Définir la solution unique que vous apportez",
        "Articuler la différenciation par rapport aux alternatives"
      ],
      table: {
        headers: ["Question Clé", "Focus"],
        rows: [
          ["Qui sont vos clients?", "Segmentation et ciblage précis"],
          ["Quel problème résolvez-vous?", "Jobs to be done non satisfaits"],
          ["Quelle est votre solution?", "Produit/service différencié"],
          ["Pourquoi vous choisir?", "Proposition de valeur unique"]
        ]
      }
    },
    color: "from-emerald-500/20 to-green-500/10"
  },
  {
    id: 17,
    module: "4V Framework",
    title: "Value Creation en Détail",
    type: "concept",
    content: {
      definition: "La création de valeur décrit comment la chaîne de valeur est configurée - production, inventaire, distribution - pour délivrer la proposition de valeur.",
      keyPoints: [
        "Production: Comment fabriquez-vous votre offre?",
        "Inventaire: Comment gérez-vous vos stocks?",
        "Distribution: Comment atteignez-vous vos clients?",
        "Optimisation de bout en bout de la chaîne"
      ]
    },
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 18,
    module: "4V Framework",
    title: "Value Capture en Détail",
    type: "concept",
    content: {
      definition: "La capture de valeur définit la logique économique - comment l'entreprise génère un retour financier en délivrant sa proposition de valeur.",
      keyPoints: [
        "Modèle de revenus: Prix × Volume",
        "Structure de coûts: Coûts directs, indirects, économies d'échelle",
        "Architecture financière: Financement et trésorerie",
        "Métriques de performance: Marges, rotation des actifs"
      ],
      table: {
        headers: ["Composant", "Description"],
        rows: [
          ["Revenue Model", "Comment les revenus sont générés (abonnement, vente, commission...)"],
          ["Cost Structure", "Principaux centres de coûts et leviers d'optimisation"],
          ["Margin Model", "Marges cibles par transaction"],
          ["Asset Velocity", "Vitesse de rotation des actifs et inventaires"]
        ]
      }
    },
    color: "from-emerald-500/20 to-lime-500/10"
  },
  {
    id: 19,
    module: "4V Framework",
    title: "Value Network en Détail",
    type: "concept",
    content: {
      definition: "Le réseau de valeur définit le rôle de l'entreprise dans son écosystème de partenaires, complémenteurs et autres parties prenantes.",
      keyPoints: [
        "Partenaires clés: Qui sont vos alliés stratégiques?",
        "Complémentarités: Quelles offres s'ajoutent à la vôtre?",
        "Intégration: Verticale ou horizontale?",
        "Orchestration: Êtes-vous plateforme ou participant?"
      ]
    },
    color: "from-emerald-500/20 to-cyan-500/10"
  },
  {
    id: 20,
    module: "4V Framework",
    title: "Application du Framework 4V",
    type: "tool",
    content: {
      definition: "Pour innover votre business model, analysez systématiquement chaque V et identifiez les opportunités de transformation.",
      steps: [
        { step: "Diagnostic", description: "Cartographiez votre modèle actuel selon les 4V" },
        { step: "Analyse", description: "Identifiez les incohérences et les opportunités" },
        { step: "Idéation", description: "Générez des alternatives pour chaque V" },
        { step: "Évaluation", description: "Testez la cohérence des nouvelles configurations" },
        { step: "Implémentation", description: "Pilotez les changements avec des KPIs" }
      ]
    },
    color: "from-emerald-500/20 to-blue-500/10"
  },
  {
    id: 21,
    module: "4V Framework",
    title: "Le Business Model Coherence Scorecard",
    type: "tool",
    content: {
      definition: "Le BMCS est un outil pour mesurer et gérer la cohérence entre les composants du business model afin d'assurer efficacité et efficience.",
      keyPoints: [
        "Mesure le 'fit' entre Value Proposition et Value Creation",
        "Évalue l'alignement entre Value Capture et Value Network",
        "Identifie les désalignements avant qu'ils ne causent des problèmes",
        "Guide les décisions d'innovation de business model"
      ],
      table: {
        headers: ["Dimension", "Indicateurs"],
        rows: [
          ["Cohérence Interne", "Alignement VP-VC-VCap-VN"],
          ["Cohérence Externe", "Fit avec le marché et l'environnement"],
          ["Cohérence Temporelle", "Durabilité du modèle dans le temps"],
          ["Cohérence Stratégique", "Alignement avec la vision et la stratégie"]
        ]
      }
    },
    color: "from-emerald-500/20 to-indigo-500/10"
  },
  {
    id: 22,
    module: "4V Framework",
    title: "Points Clés - 4V Framework",
    type: "recap",
    content: {
      keyPoints: [
        "Les 4V: Value Proposition, Creation, Capture, Network",
        "Chaque V doit être cohérent avec les autres",
        "Le BMCS mesure et gère la cohérence",
        "L'innovation peut porter sur un ou plusieurs V"
      ]
    },
    color: "from-emerald-500/20 to-emerald-500/5"
  },

  // MODULE 4 - Customer Value Proposition (slides 23-30)
  {
    id: 23,
    module: "Customer Value",
    title: "La Customer Value Proposition",
    type: "concept",
    content: {
      definition: "La CVP est l'élément le plus important du business model. C'est la façon dont vous créez de la valeur pour vos clients en les aidant à accomplir un 'job to be done'.",
      keyPoints: [
        "Plus le job est important pour le client, plus la CVP est puissante",
        "Plus la satisfaction actuelle est faible, plus l'opportunité est grande",
        "Mieux votre solution accomplit le job, plus vous pouvez capturer de valeur",
        "Les meilleures CVP font un seul job parfaitement"
      ]
    },
    color: "from-amber-500/20 to-amber-500/5"
  },
  {
    id: 24,
    module: "Customer Value",
    title: "Le Concept de Job-to-Be-Done",
    type: "framework",
    content: {
      definition: "Un 'job' est un problème fondamental dans une situation donnée qui nécessite une solution. Les clients 'embauchent' des produits pour faire un job.",
      steps: [
        { step: "Identifier le Job", description: "Quel problème fondamental le client essaie-t-il de résoudre?" },
        { step: "Comprendre le Contexte", description: "Dans quelle situation le client rencontre-t-il ce problème?" },
        { step: "Mapper le Processus", description: "Quelles sont les étapes pour accomplir ce job?" },
        { step: "Identifier les Obstacles", description: "Qu'est-ce qui empêche le client de faire le job efficacement?" },
        { step: "Concevoir la Solution", description: "Comment pouvez-vous faire le job mieux que les alternatives?" }
      ]
    },
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 25,
    module: "Customer Value",
    title: "Créer une CVP Puissante",
    type: "concept",
    content: {
      definition: "Les CVP les plus puissantes émergent quand les alternatives existantes n'ont pas été conçues avec le vrai job en tête.",
      keyPoints: [
        "Focalisez-vous sur le job, pas sur le produit existant",
        "Identifiez les 'non-consommateurs' - ceux exclus par les solutions actuelles",
        "Simplifiez et rendez accessible ce qui était complexe ou cher",
        "Créez une solution qui fait le job - et seulement ce job - parfaitement"
      ],
      caseStudy: {
        name: "Apple iPod + iTunes",
        context: "Le Rio et le Cabo existaient déjà comme lecteurs MP3, mais aucun ne rendait le téléchargement de musique facile.",
        lesson: "Apple a créé une CVP en combinant hardware, software et service pour faire le 'job' de profiter de sa musique n'importe où."
      }
    },
    color: "from-amber-500/20 to-yellow-500/10"
  },
  {
    id: 26,
    module: "Customer Value",
    title: "Le Prix dans la CVP",
    type: "concept",
    content: {
      definition: "Le prix n'est pas un add-on - c'est une partie intégrante de la CVP. Un prix élevé peut disqualifier une solution, même excellente.",
      table: {
        headers: ["Stratégie de Prix", "Quand l'utiliser"],
        rows: [
          ["Premium", "Job critique + solution nettement supérieure"],
          ["Value-based", "Solution différenciée + alternatives disponibles"],
          ["Pénétration", "Marché de masse + économies d'échelle possibles"],
          ["Freemium", "Coût marginal faible + conversion possible"]
        ]
      }
    },
    color: "from-amber-500/20 to-lime-500/10"
  },
  {
    id: 27,
    module: "Customer Value",
    title: "Exemple: Tata Nano",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Tata Nano",
        context: "Ratan Tata a observé des familles entières sur des scooters en Inde. Il a identifié un job: transport sûr et abordable pour les familles à faible revenu.",
        lesson: "La CVP exigeait un prix de $2,000 - 10x moins qu'une voiture normale. Cela a forcé une réinvention complète du modèle."
      },
      keyPoints: [
        "CVP: Voiture la moins chère du monde pour les familles indiennes",
        "Job: Mobilité sûre, abordable, pour familles de 4+",
        "Prix cible: $2,000 (contrainte de design)",
        "Cela a nécessité de repenser tout le business model"
      ]
    },
    color: "from-amber-500/20 to-red-500/10"
  },
  {
    id: 28,
    module: "Customer Value",
    title: "Exemple: MinuteClinics",
    type: "case-study",
    content: {
      caseStudy: {
        name: "MinuteClinics (CVS)",
        context: "Les patients avec des problèmes mineurs (rhume, vaccins) n'avaient pas besoin d'un médecin complet mais attendaient des heures.",
        lesson: "En utilisant des infirmières praticiennes pour des cas simples, MinuteClinic a créé une CVP: soins rapides, abordables, sans rendez-vous."
      },
      keyPoints: [
        "Job: Obtenir des soins pour un problème mineur rapidement",
        "Solution: Infirmières praticiennes dans les pharmacies",
        "Différenciation: Pas de rendez-vous, attente <15 min",
        "Prix: 40-60% moins cher qu'une visite chez le médecin"
      ]
    },
    color: "from-amber-500/20 to-pink-500/10"
  },
  {
    id: 29,
    module: "Customer Value",
    title: "Valider la CVP",
    type: "tool",
    content: {
      definition: "Avant d'investir massivement, validez que votre CVP résonne vraiment avec les clients cibles.",
      steps: [
        { step: "Problem Interview", description: "Confirmez que le job existe et qu'il est douloureux" },
        { step: "Solution Interview", description: "Testez si votre concept résout le job" },
        { step: "MVP", description: "Créez une version minimale pour tester la demande réelle" },
        { step: "Métriques", description: "Mesurez engagement, rétention, willingness-to-pay" },
        { step: "Itération", description: "Affinez basé sur les retours" }
      ]
    },
    color: "from-amber-500/20 to-teal-500/10"
  },
  {
    id: 30,
    module: "Customer Value",
    title: "Points Clés - Customer Value",
    type: "recap",
    content: {
      keyPoints: [
        "La CVP est l'élément le plus critique du business model",
        "Focalisez-vous sur le 'job to be done', pas sur le produit",
        "Le prix fait partie intégrante de la CVP",
        "Validez avec les clients avant d'investir massivement"
      ]
    },
    color: "from-amber-500/20 to-amber-500/5"
  },

  // MODULE 5 - Profit Formula (slides 31-38)
  {
    id: 31,
    module: "Profit Formula",
    title: "La Profit Formula",
    type: "concept",
    content: {
      definition: "La profit formula est le blueprint qui définit comment l'entreprise crée de la valeur pour elle-même en délivrant de la valeur au client.",
      keyPoints: [
        "Revenue Model: Prix × Volume",
        "Cost Structure: Coûts directs, indirects, économies d'échelle",
        "Margin Model: Contribution par transaction",
        "Resource Velocity: Rotation des actifs"
      ]
    },
    color: "from-rose-500/20 to-rose-500/5"
  },
  {
    id: 32,
    module: "Profit Formula",
    title: "Construire la Profit Formula",
    type: "framework",
    content: {
      definition: "La meilleure approche: partir du prix requis pour délivrer la CVP, puis travailler à rebours vers les coûts et marges.",
      steps: [
        { step: "Prix Cible", description: "Déterminez le prix que les clients sont prêts à payer" },
        { step: "Coûts Variables", description: "Calculez ce que chaque unité coûte à produire/délivrer" },
        { step: "Marge Requise", description: "Définissez la marge nécessaire pour couvrir les fixes et profit" },
        { step: "Volume Cible", description: "Calculez le volume nécessaire pour atteindre vos objectifs" },
        { step: "Velocity", description: "Déterminez la rotation d'actifs nécessaire" }
      ]
    },
    color: "from-rose-500/20 to-red-500/10"
  },
  {
    id: 33,
    module: "Profit Formula",
    title: "Modèles de Revenus",
    type: "framework",
    content: {
      definition: "Le modèle de revenus définit comment vous monétisez votre proposition de valeur.",
      table: {
        headers: ["Modèle", "Description", "Exemple"],
        rows: [
          ["Vente directe", "Paiement unique pour un produit/service", "Achat de voiture"],
          ["Abonnement", "Paiement récurrent pour un accès continu", "Netflix, SaaS"],
          ["Freemium", "Gratuit de base, payant pour premium", "Spotify, LinkedIn"],
          ["Commission", "% sur chaque transaction facilitée", "Airbnb, Uber"],
          ["Publicité", "Monétisation de l'attention", "Google, Facebook"],
          ["Razor-Blade", "Base bon marché, consommables chers", "Imprimantes, Gillette"]
        ]
      }
    },
    color: "from-rose-500/20 to-orange-500/10"
  },
  {
    id: 34,
    module: "Profit Formula",
    title: "Structures de Coûts",
    type: "concept",
    content: {
      definition: "La structure de coûts doit être alignée avec votre CVP et votre modèle de revenus.",
      table: {
        headers: ["Type de Structure", "Caractéristiques", "Convient pour"],
        rows: [
          ["Cost-driven", "Minimiser les coûts, efficacité maximale", "Marchés prix-sensibles"],
          ["Value-driven", "Focus sur valeur premium, coûts élevés OK", "Marchés différenciés"],
          ["Fixed-heavy", "Gros investissements initiaux, coûts marginaux faibles", "Plateformes, SaaS"],
          ["Variable-heavy", "Coûts proportionnels au volume", "Services, consulting"]
        ]
      }
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 35,
    module: "Profit Formula",
    title: "Exemple: Hilti Fleet Management",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Hilti - Du Produit au Service",
        context: "Hilti vendait des outils électriques premium. Face à la commoditisation, ils ont pivoté vers un modèle de leasing/abonnement.",
        lesson: "Le passage à la location a nécessité de transformer toute la profit formula: revenus récurrents, actifs au bilan, nouveaux KPIs."
      },
      keyPoints: [
        "Avant: Vente de produits, marge par outil",
        "Après: Abonnement mensuel, gestion de flotte",
        "Changement: Actifs passent du client à Hilti",
        "Nouvelle métrique: Revenus récurrents mensuels (MRR)"
      ]
    },
    color: "from-rose-500/20 to-purple-500/10"
  },
  {
    id: 36,
    module: "Profit Formula",
    title: "Le Float: Un Modèle Puissant",
    type: "concept",
    content: {
      definition: "Le 'float' se produit quand les clients paient avant de recevoir la valeur, créant un prêt sans intérêt pour l'entreprise.",
      keyPoints: [
        "Exemple classique: American Express Traveler's Checks",
        "Modernes: Cartes cadeaux, abonnements pré-payés",
        "Avantage: Financement gratuit des opérations",
        "Bonus: Certains paiements ne sont jamais utilisés (breakage)"
      ],
      caseStudy: {
        name: "Starbucks Cards",
        context: "Les cartes Starbucks représentent >$1B de float - argent des clients utilisable avant qu'ils consomment.",
        lesson: "Le float peut devenir une source majeure d'avantage financier."
      }
    },
    color: "from-rose-500/20 to-amber-500/10"
  },
  {
    id: 37,
    module: "Profit Formula",
    title: "Métriques de la Profit Formula",
    type: "tool",
    content: {
      definition: "Chaque business model a ses métriques clés. Choisissez celles qui reflètent vraiment votre création de valeur.",
      table: {
        headers: ["Type de BM", "Métriques Clés"],
        rows: [
          ["SaaS/Abonnement", "MRR, Churn, LTV, CAC, LTV/CAC"],
          ["E-commerce", "AOV, Conversion Rate, Repeat Rate"],
          ["Marketplace", "GMV, Take Rate, Liquidity"],
          ["Freemium", "Free-to-Paid Conversion, Viral Coefficient"],
          ["Enterprise", "ACV, Sales Cycle, Win Rate"]
        ]
      }
    },
    color: "from-rose-500/20 to-teal-500/10"
  },
  {
    id: 38,
    module: "Profit Formula",
    title: "Points Clés - Profit Formula",
    type: "recap",
    content: {
      keyPoints: [
        "Partez du prix cible et travaillez à rebours",
        "Alignez structure de coûts et modèle de revenus",
        "Choisissez les métriques qui reflètent votre BM",
        "Explorez les opportunités de float et revenus récurrents"
      ]
    },
    color: "from-rose-500/20 to-rose-500/5"
  },

  // MODULE 6 - Key Resources & Processes (slides 39-46)
  {
    id: 39,
    module: "Ressources & Processus",
    title: "Ressources et Processus Clés",
    type: "concept",
    content: {
      definition: "Les ressources et processus clés décrivent comment l'entreprise délivre la proposition de valeur de manière répétable et scalable.",
      keyPoints: [
        "Ressources: Actifs requis pour délivrer la valeur",
        "Processus: Activités qui permettent répétabilité et scale",
        "L'intégration unique crée l'avantage compétitif",
        "Focalisez-vous sur les éléments qui font la différence"
      ]
    },
    color: "from-indigo-500/20 to-indigo-500/5"
  },
  {
    id: 40,
    module: "Ressources & Processus",
    title: "Types de Ressources Clés",
    type: "framework",
    content: {
      definition: "Les ressources clés sont les actifs les plus importants pour faire fonctionner votre business model.",
      table: {
        headers: ["Type", "Exemples", "Secteurs Typiques"],
        rows: [
          ["Humaines", "Talents, expertise, culture", "Services, Tech, Consulting"],
          ["Physiques", "Équipements, immobilier, infrastructure", "Manufacturing, Retail"],
          ["Intellectuelles", "Brevets, marques, données, algorithmes", "Tech, Pharma, Media"],
          ["Financières", "Trésorerie, lignes de crédit, accès capital", "Finance, Startups"]
        ]
      }
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 41,
    module: "Ressources & Processus",
    title: "Types de Processus Clés",
    type: "framework",
    content: {
      definition: "Les processus clés sont les activités opérationnelles et managériales qui permettent de délivrer la valeur de façon répétable.",
      table: {
        headers: ["Catégorie", "Exemples"],
        rows: [
          ["Opérationnels", "Production, livraison, service client, qualité"],
          ["Managériaux", "Planning, budgeting, formation, performance"],
          ["Règles & Normes", "Standards, guidelines, métriques, incentives"],
          ["Innovation", "R&D, design, expérimentation, amélioration continue"]
        ]
      }
    },
    color: "from-indigo-500/20 to-purple-500/10"
  },
  {
    id: 42,
    module: "Ressources & Processus",
    title: "L'Intégration qui Crée l'Avantage",
    type: "concept",
    content: {
      definition: "Ce n'est pas les ressources ou processus individuels qui font la différence, mais leur intégration unique.",
      keyPoints: [
        "L'intégration crée un avantage compétitif durable",
        "Difficile à répliquer car systémique",
        "Doit être alignée avec CVP et Profit Formula",
        "Évolue avec le temps et les apprentissages"
      ],
      caseStudy: {
        name: "National Jewish Health",
        context: "Plutôt que 'tout pour tous', ils se focalisent sur les maladies pulmonaires.",
        lesson: "La focalisation permet d'intégrer spécialistes et équipements de façon unique et propriétaire."
      }
    },
    color: "from-indigo-500/20 to-cyan-500/10"
  },
  {
    id: 43,
    module: "Ressources & Processus",
    title: "Exemple: Tata Nano - Ressources",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Tata Nano - Réinvention des Ressources",
        context: "Pour atteindre le prix de $2,000, Tata a dû repenser fondamentalement ses ressources et leur utilisation.",
        lesson: "85% des composants outsourcés, 60% moins de fournisseurs - une réinvention complète de la chaîne."
      },
      keyPoints: [
        "Équipe de jeunes ingénieurs (pas contraints par l'existant)",
        "Design modulaire pour simplifier la fabrication",
        "Réseau de mini-assembleurs entrepreneuriaux",
        "Nombre de pièces drastiquement réduit"
      ]
    },
    color: "from-indigo-500/20 to-amber-500/10"
  },
  {
    id: 44,
    module: "Ressources & Processus",
    title: "Règles, Normes et Métriques",
    type: "concept",
    content: {
      definition: "Les règles, normes et métriques sont souvent le dernier élément à émerger - et le plus difficile à changer.",
      keyPoints: [
        "Elles émergent après avoir testé le modèle",
        "Elles codifient 'comment on fait les choses ici'",
        "Elles créent de l'inertie organisationnelle",
        "Les changer est essentiel pour innover le BM"
      ],
      quote: "Rules, norms, and metrics are often the last element to emerge in a developing business model."
    },
    color: "from-indigo-500/20 to-rose-500/10"
  },
  {
    id: 45,
    module: "Ressources & Processus",
    title: "Exemple: Xiameter - Nouvelles Règles",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Dow Corning → Xiameter",
        context: "Pour servir le segment commoditisé, Dow Corning a créé Xiameter avec des règles radicalement différentes.",
        lesson: "Tailles de commande fixes, délais standardisés, service payant - des règles 'hérétiques' pour Dow Corning."
      },
      keyPoints: [
        "Commandes: Quelques tailles standards seulement",
        "Délais: 2-4 semaines fixes (exceptions payantes)",
        "Crédit: Termes fixes, pas de négociation",
        "Service: Self-service, support payant"
      ]
    },
    color: "from-indigo-500/20 to-teal-500/10"
  },
  {
    id: 46,
    module: "Ressources & Processus",
    title: "Points Clés - Ressources & Processus",
    type: "recap",
    content: {
      keyPoints: [
        "C'est l'intégration unique qui crée l'avantage",
        "Les règles et normes sont les plus difficiles à changer",
        "Alignez ressources/processus avec CVP et Profit Formula",
        "Parfois, il faut créer une nouvelle unité avec de nouvelles règles"
      ]
    },
    color: "from-indigo-500/20 to-indigo-500/5"
  },

  // MODULE 7 - Quand Innover? (slides 47-54)
  {
    id: 47,
    module: "Quand Innover?",
    title: "Quand un Nouveau BM Est Nécessaire?",
    type: "concept",
    content: {
      definition: "L'innovation de business model ne doit pas être entreprise à la légère. Certaines situations l'exigent, d'autres non.",
      keyPoints: [
        "N'innovez que si l'opportunité est assez grande",
        "Le nouveau modèle doit être 'game-changing' pour l'industrie",
        "Parfois, le modèle existant peut capturer l'opportunité",
        "Un nouveau BM est nécessaire quand les 4 éléments doivent changer"
      ]
    },
    color: "from-teal-500/20 to-teal-500/5"
  },
  {
    id: 48,
    module: "Quand Innover?",
    title: "5 Situations qui Exigent l'Innovation",
    type: "framework",
    content: {
      definition: "Cinq circonstances stratégiques appellent souvent à l'innovation de business model.",
      steps: [
        { step: "Non-Consommateurs", description: "Opportunité d'adresser ceux exclus par les solutions existantes (trop chères/complexes)" },
        { step: "Nouvelle Technologie", description: "Opportunité de wrapper une technologie dans un nouveau BM (Apple iPod)" },
        { step: "Job-Focus Absent", description: "Industries focalisées produit où un focus 'job' peut redéfinir la compétition" },
        { step: "Disrupteurs Low-End", description: "Besoin de contrer des entrants qui cassent les prix" },
        { step: "Shift Compétitif", description: "Les bases de la compétition changent, rendant l'ancien modèle obsolète" }
      ]
    },
    color: "from-teal-500/20 to-green-500/10"
  },
  {
    id: 49,
    module: "Quand Innover?",
    title: "Quand le Modèle Existant Suffit",
    type: "concept",
    content: {
      definition: "Vous n'avez PAS besoin d'un nouveau business model si vous pouvez capturer l'opportunité avec votre modèle actuel.",
      keyPoints: [
        "Vous pouvez utiliser votre profit formula actuelle",
        "Vous pouvez utiliser la plupart de vos ressources/processus",
        "Les mêmes métriques, règles et normes fonctionnent",
        "L'exemple P&G: Swiffer et Febreze utilisent le modèle existant"
      ],
      caseStudy: {
        name: "P&G Swiffer",
        context: "Swiffer était une innovation produit disruptive, mais utilisait le modèle de distribution et vente existant de P&G.",
        lesson: "Innovation produit ≠ Innovation de business model. Parfois, le modèle existant est le bon véhicule."
      }
    },
    color: "from-teal-500/20 to-cyan-500/10"
  },
  {
    id: 50,
    module: "Quand Innover?",
    title: "4 Questions de Validation",
    type: "tool",
    content: {
      definition: "Avant de vous lancer dans l'innovation de BM, répondez à ces 4 questions. Un 'oui' à toutes augmente les chances de succès.",
      table: {
        headers: ["Question", "Focus"],
        rows: [
          ["Pouvez-vous 'nailez' le job avec une CVP focalisée et compelling?", "Value Proposition"],
          ["Pouvez-vous concevoir un modèle où tous les éléments s'alignent?", "Cohérence"],
          ["Pouvez-vous créer un processus libre des influences négatives du core business?", "Exécution"],
          ["Le nouveau modèle va-t-il disrupter les concurrents?", "Impact"]
        ]
      }
    },
    color: "from-teal-500/20 to-blue-500/10"
  },
  {
    id: 51,
    module: "Quand Innover?",
    title: "Le Défi Cognitif",
    type: "concept",
    content: {
      definition: "Le premier obstacle à l'innovation de BM est cognitif: les managers sont 'boundedly rational' et attachés à la logique dominante.",
      keyPoints: [
        "La logique dominante filtre les informations du marché",
        "Les managers voient les opportunités à travers le prisme existant",
        "Les métaphores et heuristiques simplifient mais aveuglent",
        "Rafraîchir la logique dominante est essentiel pour innover"
      ]
    },
    color: "from-teal-500/20 to-purple-500/10"
  },
  {
    id: 52,
    module: "Quand Innover?",
    title: "Le Défi de Reconfiguration",
    type: "concept",
    content: {
      definition: "Le second obstacle est la reconfiguration: même avec la bonne vision, exécuter le changement est difficile.",
      keyPoints: [
        "Les processus existants créent de l'inertie",
        "Les compétences actuelles peuvent être inadaptées",
        "Le réseau de partenaires doit parfois être reconfiguré",
        "Maintenir la cohérence pendant la transition est critique"
      ],
      quote: "Management faces the reconfiguration challenge, which is to execute the required change in the business model."
    },
    color: "from-teal-500/20 to-rose-500/10"
  },
  {
    id: 53,
    module: "Quand Innover?",
    title: "Nokia: Échec de Reconfiguration",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Nokia - Le Géant Déchu",
        context: "Nokia dominait le mobile mais n'a pas pu se transformer assez vite pour les smartphones.",
        lesson: "Manque de vision stratégique claire, structure matricielle paralysante, focus court-terme sur les ventes trimestrielles."
      },
      keyPoints: [
        "Structure matricielle a ralenti la prise de décision",
        "Pas de vision claire pour la transition hardware → software",
        "Cap de 10% R&D/ventes a limité l'innovation",
        "Focus sur améliorer l'existant plutôt que transformer"
      ]
    },
    color: "from-teal-500/20 to-amber-500/10"
  },
  {
    id: 54,
    module: "Quand Innover?",
    title: "Points Clés - Quand Innover?",
    type: "recap",
    content: {
      keyPoints: [
        "5 situations exigent l'innovation de BM",
        "Parfois le modèle existant suffit",
        "Défis cognitif ET de reconfiguration à surmonter",
        "Utilisez les 4 questions pour valider avant de vous lancer"
      ]
    },
    color: "from-teal-500/20 to-teal-500/5"
  },

  // MODULE 8 - Leadership & Organisation (slides 55-62)
  {
    id: 55,
    module: "Leadership & Organisation",
    title: "Leadership pour l'Innovation de BM",
    type: "concept",
    content: {
      definition: "L'innovation de business model requiert un leadership spécifique capable de naviguer l'ambiguïté et de protéger le nouveau du l'ancien.",
      keyPoints: [
        "Vision claire du nouveau modèle cible",
        "Capacité à prendre des décisions rapides dans l'incertitude",
        "Protection du nouveau contre les 'anticorps' organisationnels",
        "Équilibre entre exploitation de l'existant et exploration du nouveau"
      ]
    },
    color: "from-orange-500/20 to-orange-500/5"
  },
  {
    id: 56,
    module: "Leadership & Organisation",
    title: "Séparation vs Intégration",
    type: "framework",
    content: {
      definition: "Une décision clé: faut-il intégrer le nouveau BM dans l'organisation existante ou le séparer?",
      table: {
        headers: ["Approche", "Quand l'utiliser", "Risques"],
        rows: [
          ["Intégration", "Synergies fortes, ressources partagées critiques", "Anticorps, contamination par les règles existantes"],
          ["Séparation", "Règles radicalement différentes, conflits inévitables", "Perte de synergies, duplication des coûts"],
          ["Hybride", "Besoin de certaines ressources mais nouvelles règles", "Complexité de coordination"]
        ]
      }
    },
    color: "from-orange-500/20 to-red-500/10"
  },
  {
    id: 57,
    module: "Leadership & Organisation",
    title: "Les Anticorps Organisationnels",
    type: "concept",
    content: {
      definition: "Comme un système immunitaire, l'organisation existante tend à rejeter les initiatives qui menacent le statu quo.",
      keyPoints: [
        "Les processus existants écrasent les nouvelles façons de faire",
        "Les métriques actuelles pénalisent le nouveau modèle",
        "Les talents sont attirés vers le core business",
        "Les incentives favorisent les résultats court-terme"
      ],
      caseStudy: {
        name: "Xiameter War Game",
        context: "Don Sheets a testé comment les systèmes existants réagiraient au nouveau modèle via un 'war game' interne.",
        lesson: "Il s'est fait 'écraser' - les habitudes et processus ont tué l'initiative. Preuve que la séparation était nécessaire."
      }
    },
    color: "from-orange-500/20 to-amber-500/10"
  },
  {
    id: 58,
    module: "Leadership & Organisation",
    title: "Créer une Unité Séparée",
    type: "framework",
    content: {
      definition: "Quand la séparation est nécessaire, suivez ces principes pour maximiser les chances de succès.",
      steps: [
        { step: "Liberté sur les Règles", description: "La nouvelle unité définit ses propres règles, normes et métriques" },
        { step: "Leadership Entrepreneurial", description: "Recrutez des risk-takers capables de décider vite dans l'ambiguïté" },
        { step: "Accès aux Ressources", description: "Permettez l'accès à l'expertise sans importer le mindset" },
        { step: "Protection Executive", description: "Un sponsor senior protège l'unité des attaques politiques" },
        { step: "Métriques Adaptées", description: "Mesurez le progrès avec des KPIs appropriés au stade" }
      ]
    },
    color: "from-orange-500/20 to-yellow-500/10"
  },
  {
    id: 59,
    module: "Leadership & Organisation",
    title: "Exemple: Xiameter Organisation",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Xiameter - Nouvelle Unité, Nouvelles Règles",
        context: "Dow Corning a créé Xiameter comme unité séparée avec sa propre marque, ses propres règles et son propre leadership.",
        lesson: "La séparation a permis d'éviter la contamination par les règles high-touch de Dow Corning."
      },
      keyPoints: [
        "Marque distincte pour éviter la confusion",
        "Équipe recrutée pour la prise de risque (test: décision sur le champ)",
        "IT au cœur (vs. accessoire chez DC)",
        "Processus automatisés et standardisés"
      ]
    },
    color: "from-orange-500/20 to-lime-500/10"
  },
  {
    id: 60,
    module: "Leadership & Organisation",
    title: "Le Dual Business Model",
    type: "concept",
    content: {
      definition: "Parfois, il faut opérer deux business models en parallèle - l'ancien pour les revenus actuels, le nouveau pour la croissance future.",
      keyPoints: [
        "Challenge: allocation des ressources entre les deux",
        "Risque de cannibalisation",
        "Besoin de métriques séparées",
        "Leadership ambidextre requis"
      ],
      table: {
        headers: ["Core Business", "New Business"],
        rows: [
          ["Exploitation", "Exploration"],
          ["Efficience", "Expérimentation"],
          ["Métriques de profit", "Métriques de learning"],
          ["Horizon court-terme", "Horizon long-terme"]
        ]
      }
    },
    color: "from-orange-500/20 to-teal-500/10"
  },
  {
    id: 61,
    module: "Leadership & Organisation",
    title: "Systèmes d'Information pour l'Innovation",
    type: "concept",
    content: {
      definition: "Les systèmes d'information peuvent enabler ou bloquer l'innovation de business model selon leur conception.",
      keyPoints: [
        "Les systèmes legacy peuvent empêcher les nouvelles façons de facturer",
        "Le nouveau modèle peut nécessiter de nouvelles données",
        "L'IT modulaire facilite l'expérimentation",
        "Le BMCS (Coherence Scorecard) requiert des données temps réel"
      ]
    },
    color: "from-orange-500/20 to-cyan-500/10"
  },
  {
    id: 62,
    module: "Leadership & Organisation",
    title: "Points Clés - Leadership & Organisation",
    type: "recap",
    content: {
      keyPoints: [
        "Le leadership doit protéger le nouveau des anticorps",
        "Séparation nécessaire quand les règles sont incompatibles",
        "Le dual model requiert un leadership ambidextre",
        "Les systèmes d'information peuvent enabler ou bloquer"
      ]
    },
    color: "from-orange-500/20 to-orange-500/5"
  },

  // MODULE 9 - Case Studies (slides 63-70)
  {
    id: 63,
    module: "Cas d'Études",
    title: "Apple: iPod + iTunes",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Apple iPod + iTunes",
        context: "En 2003, Apple a lancé l'iPod avec l'iTunes Store, révolutionnant le divertissement portable et transformant l'entreprise.",
        lesson: "Apple n'a pas inventé le lecteur MP3 - ils ont inventé un business model qui rendait le téléchargement de musique facile."
      },
      keyPoints: [
        "Rio (1998) et Cabo (2000) existaient avant l'iPod",
        "CVP: Écouter sa musique n'importe où, facilement",
        "Modèle Razor-Blade inversé: 'lames' à faible marge (iTunes) pour vendre le 'rasoir' (iPod)",
        "Résultat: $10B de revenus en 3 ans, 50% du chiffre d'affaires"
      ]
    },
    color: "from-pink-500/20 to-pink-500/5"
  },
  {
    id: 64,
    module: "Cas d'Études",
    title: "Netflix vs Blockbuster",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Netflix vs Blockbuster",
        context: "Netflix a lancé un modèle d'abonnement sans frais de retard. Blockbuster a tenté de répondre en 2004.",
        lesson: "Blockbuster a essayé d'intégrer le nouveau modèle à l'ancien, créant des incohérences fatales."
      },
      keyPoints: [
        "Blockbuster: $600M/an de frais de retard (10% des revenus)",
        "Suppression des frais = perte de revenus + problèmes d'inventaire",
        "Retour des DVD en magasin = complexité supplémentaire",
        "Ratio coût/revenu: 0.72 (2003) → 1.11 (2009) → Faillite 2010"
      ]
    },
    color: "from-pink-500/20 to-red-500/10"
  },
  {
    id: 65,
    module: "Cas d'Études",
    title: "Dell: Le Modèle Direct",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Dell Direct Model",
        context: "Michael Dell a créé un modèle de vente directe, éliminant les intermédiaires et assemblant à la commande.",
        lesson: "Le modèle direct a créé un avantage de coût massif, utilisé pour gagner des parts de marché."
      },
      keyPoints: [
        "CVP: PC personnalisé, livré rapidement, prix compétitif",
        "Profit Formula: Inventaire négatif (payé avant achat composants)",
        "Ressources: Assemblage à la commande, logistics lean",
        "Processus: Build-to-order, support téléphonique"
      ]
    },
    color: "from-pink-500/20 to-blue-500/10"
  },
  {
    id: 66,
    module: "Cas d'Études",
    title: "Southwest Airlines",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Southwest Airlines",
        context: "Southwest a créé le modèle low-cost airline, transformant le transport aérien aux États-Unis.",
        lesson: "Chaque élément du modèle est aligné: un seul type d'avion, pas de sièges assignés, rotations rapides."
      },
      keyPoints: [
        "CVP: Voyages courts, fréquents, abordables",
        "Un seul type d'avion (737) = maintenance simplifiée",
        "Pas de hub = pas de retards en cascade",
        "Rotations de 20 min vs 45+ chez les concurrents"
      ]
    },
    color: "from-pink-500/20 to-purple-500/10"
  },
  {
    id: 67,
    module: "Cas d'Études",
    title: "Amazon: De la Librairie au Tout",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Amazon - Évolution du Business Model",
        context: "Amazon a commencé comme librairie en ligne et a évolué vers une plateforme multi-business.",
        lesson: "L'innovation de BM peut être évolutive: marketplace, AWS, Prime se sont ajoutés progressivement."
      },
      keyPoints: [
        "1995: Librairie en ligne (sélection > magasin physique)",
        "2000: Marketplace (3rd party sellers)",
        "2006: AWS (cloud computing)",
        "2005+: Prime (abonnement = lock-in + fréquence)"
      ]
    },
    color: "from-pink-500/20 to-orange-500/10"
  },
  {
    id: 68,
    module: "Cas d'Études",
    title: "Uber: Plateforme Multi-Sided",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Uber - Platform Business Model",
        context: "Uber a créé une plateforme connectant conducteurs et passagers, sans posséder de véhicules.",
        lesson: "Les plateformes créent de la valeur par le 'matching' et les effets de réseau."
      },
      keyPoints: [
        "CVP (passagers): Transport fiable, traçable, sans cash",
        "CVP (conducteurs): Flexibilité, revenus supplémentaires",
        "Capture: ~25% de commission sur chaque course",
        "Réseau: Plus de conducteurs = moins d'attente = plus de passagers"
      ]
    },
    color: "from-pink-500/20 to-teal-500/10"
  },
  {
    id: 69,
    module: "Cas d'Études",
    title: "Michelin Fleet Solutions",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Michelin - Pneus-as-a-Service",
        context: "Michelin a pivoté de la vente de pneus vers la vente de kilomètres parcourus pour les flottes.",
        lesson: "En alignant les incentives (Michelin veut des pneus durables = client veut des coûts bas), le modèle crée de la valeur partagée."
      },
      keyPoints: [
        "Avant: Vente de pneus (incentive à l'usure rapide)",
        "Après: Facturation au kilomètre (incentive à la durabilité)",
        "Michelin gère l'entretien, le client n'achète que des km",
        "Résultat: -30% de coûts pour le client, marges meilleures pour Michelin"
      ]
    },
    color: "from-pink-500/20 to-emerald-500/10"
  },
  {
    id: 70,
    module: "Cas d'Études",
    title: "Points Clés - Cas d'Études",
    type: "recap",
    content: {
      keyPoints: [
        "L'innovation de BM peut créer des leaders de marché (Apple, Netflix)",
        "L'échec d'adaptation détruit les géants (Blockbuster, Nokia)",
        "Les plateformes créent de la valeur par le matching et les effets réseau",
        "L'évolution incrémentale du BM est possible (Amazon)"
      ]
    },
    color: "from-pink-500/20 to-pink-500/5"
  },

  // MODULE 10 - Mise en Œuvre (slides 71-78)
  {
    id: 71,
    module: "Mise en Œuvre",
    title: "Processus d'Innovation de BM",
    type: "framework",
    content: {
      definition: "L'innovation de business model suit un processus structuré qui commence par le 'job to be done', pas par le produit.",
      steps: [
        { step: "1. Job Discovery", description: "Identifiez le job à accomplir pour les clients cibles" },
        { step: "2. CVP Design", description: "Concevez une proposition de valeur focalisée sur ce job" },
        { step: "3. Profit Formula", description: "Définissez comment capturer de la valeur" },
        { step: "4. Resources & Processes", description: "Identifiez ce qu'il faut pour délivrer" },
        { step: "5. Cohérence Check", description: "Vérifiez que tous les éléments s'alignent" }
      ]
    },
    color: "from-cyan-500/20 to-cyan-500/5"
  },
  {
    id: 72,
    module: "Mise en Œuvre",
    title: "L'Approche Expérimentale",
    type: "concept",
    content: {
      definition: "L'innovation de BM est un processus d'apprentissage. Chaque hypothèse doit être testée avant d'investir massivement.",
      keyPoints: [
        "Formulez des hypothèses explicites sur chaque élément",
        "Testez les hypothèses les plus risquées en premier",
        "Utilisez des MVPs pour valider rapidement et à faible coût",
        "Pivotez quand les hypothèses sont invalidées"
      ],
      quote: "Business modeling is, in this sense, the managerial equivalent of the scientific method—you start with a hypothesis, which you then test in action and revise when necessary."
    },
    color: "from-cyan-500/20 to-blue-500/10"
  },
  {
    id: 73,
    module: "Mise en Œuvre",
    title: "Gérer la Transition",
    type: "framework",
    content: {
      definition: "La transition d'un ancien BM vers un nouveau est critique et risquée. Trois approches possibles.",
      table: {
        headers: ["Approche", "Description", "Quand l'utiliser"],
        rows: [
          ["Big Bang", "Basculement complet et rapide", "Rare - seulement si l'ancien est non viable"],
          ["Parallèle", "Deux modèles en simultané", "Segments différents, peu de cannibalisation"],
          ["Progressif", "Migration graduelle des clients", "Risque de disruption minimisé"]
        ]
      }
    },
    color: "from-cyan-500/20 to-purple-500/10"
  },
  {
    id: 74,
    module: "Mise en Œuvre",
    title: "Métriques de Transition",
    type: "tool",
    content: {
      definition: "Pendant la transition, vous devez suivre à la fois les métriques du core business et celles du nouveau modèle.",
      table: {
        headers: ["Phase", "Métriques Clés"],
        rows: [
          ["Early Stage", "Learning velocity, hypothèses validées, coût par apprentissage"],
          ["Product-Market Fit", "Engagement, rétention, NPS, willingness-to-pay"],
          ["Scale", "Unit economics, CAC, LTV, growth rate"],
          ["Optimization", "Efficiency metrics, margins, profitability"]
        ]
      }
    },
    color: "from-cyan-500/20 to-teal-500/10"
  },
  {
    id: 75,
    module: "Mise en Œuvre",
    title: "Surmonter la Résistance",
    type: "concept",
    content: {
      definition: "L'innovation de BM génère inévitablement de la résistance. Anticipez et gérez-la activement.",
      keyPoints: [
        "Crainte de cannibalisation par les équipes du core",
        "Résistance des partenaires dont le rôle change",
        "Inertie des systèmes et processus existants",
        "Conflits de ressources entre ancien et nouveau modèle"
      ],
      steps: [
        { step: "Communication", description: "Expliquez le 'pourquoi' et la vision" },
        { step: "Quick Wins", description: "Montrez des succès rapides pour créer du momentum" },
        { step: "Coalitions", description: "Construisez un réseau de supporters influents" },
        { step: "Incentives", description: "Alignez les récompenses avec le changement souhaité" }
      ]
    },
    color: "from-cyan-500/20 to-rose-500/10"
  },
  {
    id: 76,
    module: "Mise en Œuvre",
    title: "Rôle de la Culture",
    type: "concept",
    content: {
      definition: "La culture organisationnelle peut être le plus grand enabler ou le plus grand obstacle à l'innovation de BM.",
      keyPoints: [
        "Culture d'expérimentation vs culture d'exécution",
        "Tolérance à l'échec vs punition des erreurs",
        "Orientation client vs orientation produit",
        "Collaboration vs silos fonctionnels"
      ],
      table: {
        headers: ["Culture qui Bloque", "Culture qui Enable"],
        rows: [
          ["Perfection avant lancement", "Itération rapide"],
          ["Hiérarchie rigide", "Autonomie des équipes"],
          ["Succès = ne pas échouer", "Succès = apprendre vite"],
          ["Protéger le core", "Cannibaliser avant les autres"]
        ]
      }
    },
    color: "from-cyan-500/20 to-amber-500/10"
  },
  {
    id: 77,
    module: "Mise en Œuvre",
    title: "Checklist d'Innovation de BM",
    type: "tool",
    content: {
      definition: "Utilisez cette checklist pour évaluer votre préparation à l'innovation de business model.",
      keyPoints: [
        "□ Job-to-be-done clairement identifié et validé",
        "□ CVP différenciée et testée avec les clients",
        "□ Profit formula viable et cohérente",
        "□ Ressources et processus clés identifiés",
        "□ Cohérence entre tous les éléments vérifiée",
        "□ Décision séparation/intégration prise",
        "□ Leadership et sponsor en place",
        "□ Métriques adaptées au stade définies",
        "□ Plan de gestion de la résistance établi"
      ]
    },
    color: "from-cyan-500/20 to-indigo-500/10"
  },
  {
    id: 78,
    module: "Mise en Œuvre",
    title: "Points Clés - Mise en Œuvre",
    type: "recap",
    content: {
      keyPoints: [
        "Commencez par le job, pas par le produit",
        "Testez les hypothèses avant d'investir massivement",
        "Choisissez la bonne approche de transition",
        "Gérez activement la résistance et la culture"
      ]
    },
    color: "from-cyan-500/20 to-cyan-500/5"
  }
];
