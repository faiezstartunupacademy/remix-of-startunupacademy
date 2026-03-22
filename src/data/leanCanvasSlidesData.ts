// Lean Canvas Slides Data based on Running Lean & Scaling Lean by Ash Maurya

export interface LeanCanvasSlide {
  id: number;
  module: string;
  axis: "Running Lean" | "Scaling Lean";
  title: string;
  type: "concept" | "outil" | "processus" | "méthode" | "cas" | "exercice";
  color: string;
  image?: string;
  content: {
    definition?: string;
    keyPoints?: string[];
    table?: { headers: string[]; rows: string[][] };
    steps?: { step: string; description: string }[];
    caseStudy?: { name: string; context: string; lesson: string };
    quote?: string;
    tips?: string[];
    framework?: { name: string; elements: { label: string; description: string }[] };
  };
}

export const LEAN_CANVAS_MODULES = [
  // Running Lean Axis
  { id: "rl-intro", name: "Introduction", axis: "Running Lean", slides: [1, 8], color: "bg-blue-600" },
  { id: "rl-canvas", name: "Lean Canvas", axis: "Running Lean", slides: [9, 20], color: "bg-emerald-600" },
  { id: "rl-desirability", name: "Désirabilité", axis: "Running Lean", slides: [21, 28], color: "bg-amber-600" },
  { id: "rl-viability", name: "Viabilité", axis: "Running Lean", slides: [29, 36], color: "bg-rose-600" },
  { id: "rl-feasibility", name: "Faisabilité", axis: "Running Lean", slides: [37, 42], color: "bg-purple-600" },
  { id: "rl-validation", name: "Validation", axis: "Running Lean", slides: [43, 52], color: "bg-cyan-600" },
  { id: "rl-interviews", name: "Interviews Client", axis: "Running Lean", slides: [53, 60], color: "bg-orange-600" },
  // Scaling Lean Axis
  { id: "sl-traction", name: "Traction", axis: "Scaling Lean", slides: [61, 68], color: "bg-indigo-600" },
  { id: "sl-factory", name: "Usine à Clients", axis: "Scaling Lean", slides: [69, 76], color: "bg-pink-600" },
  { id: "sl-metrics", name: "Métriques", axis: "Scaling Lean", slides: [77, 84], color: "bg-teal-600" },
  { id: "sl-constraints", name: "Contraintes", axis: "Scaling Lean", slides: [85, 90], color: "bg-red-600" },
  { id: "sl-experiments", name: "Expérimentations", axis: "Scaling Lean", slides: [91, 98], color: "bg-violet-600" },
];

export const LEAN_CANVAS_SLIDES: LeanCanvasSlide[] = [
  // ======= RUNNING LEAN: Introduction (1-8) =======
  {
    id: 1,
    module: "Introduction",
    axis: "Running Lean",
    title: "La Nouvelle Ère de l'Entrepreneuriat",
    type: "concept",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "Nous vivons une renaissance entrepreneuriale mondiale. Aujourd'hui, créer un produit est plus facile et moins cher que jamais, ce qui signifie plus de compétition que jamais.",
      keyPoints: [
        "Il est moins cher et plus facile que jamais de créer un produit",
        "Plus de produits = plus de choix pour les clients et investisseurs",
        "Les investisseurs ne financent plus les solutions qui fonctionnent, mais les business models qui fonctionnent",
        "Le défi n'est plus 'Peut-on le construire ?' mais 'Devrait-on le construire ?'"
      ],
      quote: "La vie est trop courte pour construire quelque chose dont personne ne veut."
    }
  },
  {
    id: 2,
    module: "Introduction",
    axis: "Running Lean",
    title: "L'Approche Traction-First",
    type: "concept",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "Contrairement à l'approche build-first ou investor-first, l'approche traction-first vous permet de démontrer la valeur de votre idée avant même d'avoir un produit complet.",
      keyPoints: [
        "Les clients ne se soucient pas de votre solution, ils se soucient de leurs problèmes",
        "Build-Demo-Sell est l'ancienne approche",
        "Demo-Sell-Build est la nouvelle approche",
        "La traction n'est pas être premier sur le marché, mais premier à l'adoption du marché"
      ],
      tips: [
        "Vous n'avez pas besoin d'un produit fonctionnel pour découvrir des problèmes à résoudre",
        "Vous pouvez même obtenir vos premiers clients payants sans produit"
      ]
    }
  },
  {
    id: 3,
    module: "Introduction",
    axis: "Running Lean",
    title: "Les 10 Mindsets de l'Innovateur",
    type: "concept",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "La différence entre un Artiste (qui aime sa solution) et un Innovateur (qui transforme les inventions en business models viables) réside dans 10 changements de mentalité clés.",
      keyPoints: [
        "1. Le business model EST le produit",
        "2. Aimez le problème, pas votre solution",
        "3. La traction est l'objectif",
        "4. Bonne action au bon moment",
        "5. Attaquez vos hypothèses risquées par étapes"
      ]
    }
  },
  {
    id: 4,
    module: "Introduction",
    axis: "Running Lean",
    title: "Les 10 Mindsets (Suite)",
    type: "concept",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      keyPoints: [
        "6. Les contraintes sont un cadeau",
        "7. Tenez-vous responsable de manière externe",
        "8. Placez plusieurs petits paris",
        "9. Prenez des décisions basées sur les preuves",
        "10. Les percées nécessitent des résultats inattendus"
      ],
      quote: "Les innovateurs transforment les inventions en business models viables."
    }
  },
  {
    id: 5,
    module: "Introduction",
    axis: "Running Lean",
    title: "Le Continuous Innovation Framework",
    type: "processus",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "Un framework de frameworks qui combine les meilleurs éléments de Lean Startup, Design Thinking, Business Model Design, Jobs-to-Be-Done, Systems Thinking et Behavior Design.",
      framework: {
        name: "Continuous Innovation",
        elements: [
          { label: "DESIGN", description: "Déconstruisez votre idée et stress-testez-la" },
          { label: "VALIDATION", description: "Testez vos hypothèses en cycles de 90 jours" },
          { label: "GROWTH", description: "Trouvez votre moteur de croissance scalable" }
        ]
      }
    }
  },
  {
    id: 6,
    module: "Introduction",
    axis: "Running Lean",
    title: "Les 3 Phases de Running Lean",
    type: "processus",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "La méthode Running Lean se décompose en trois phases distinctes, chacune avec des objectifs et des outils spécifiques.",
      steps: [
        { step: "DESIGN", description: "Déconstruire votre idée sur un Lean Canvas et stress-tester pour la désirabilité, viabilité et faisabilité" },
        { step: "VALIDATION", description: "Valider votre idée en cycles de 90 jours avec des interviews clients et des expérimentations" },
        { step: "GROWTH", description: "Se préparer au lancement, créer des clients heureux et trouver votre moteur de croissance" }
      ]
    }
  },
  {
    id: 7,
    module: "Introduction",
    axis: "Running Lean",
    title: "Le Cycle Model-Prioritize-Test",
    type: "processus",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "Chaque cycle de 90 jours est structuré autour de trois activités clés qui permettent de rechercher systématiquement un business model reproductible et scalable.",
      steps: [
        { step: "Modélisation", description: "Mettre à jour et réviser les business models (Lean Canvas et traction roadmap) pour aligner l'équipe" },
        { step: "Priorisation", description: "Identifier collectivement les hypothèses les plus risquées et proposer des stratégies de validation" },
        { step: "Test", description: "Faire plusieurs petits paris sur les campagnes prometteuses via des expérimentations itératives rapides" }
      ]
    }
  },
  {
    id: 8,
    module: "Introduction",
    axis: "Running Lean",
    title: "Pourquoi Running Lean Fonctionne",
    type: "concept",
    color: "from-blue-500/20 to-blue-600/10",
    content: {
      definition: "Running Lean vous permet d'éviter de gaspiller du temps, de l'argent et des efforts à construire un produit que vous espérez que les clients achèteront, pour construire un produit que vous savez qu'ils achèteront.",
      keyPoints: [
        "Engagez les clients continuellement tout au long du développement",
        "Testez ce qui est le plus risqué, pas ce qui est le plus facile",
        "Évitez les gros échecs 'big-bang' par des corrections de cap progressives",
        "Commencez petit avec un high-touch customer experience"
      ],
      caseStudy: {
        name: "Larry vs Steve",
        context: "Un an après avoir eu la même idée, Larry a des clients payants et une équipe grandissante, tandis que Steve travaille encore seul sur son produit.",
        lesson: "La différence n'est pas les compétences différentes, mais les mentalités différentes."
      }
    }
  },

  // ======= RUNNING LEAN: Lean Canvas (9-20) =======
  {
    id: 9,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Qu'est-ce que le Lean Canvas ?",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    image: "lean-canvas-template",
    content: {
      definition: "Le Lean Canvas est un template d'une page pour déconstruire votre idée en ses hypothèses clés. Adapté du Business Model Canvas d'Osterwalder, il est spécifiquement conçu pour les startups.",
      keyPoints: [
        "Rapide : documentez votre Plan A en moins de 15 minutes",
        "Portable : tient sur une seule page",
        "Actionnable : focus sur les hypothèses testables",
        "Remplace Partenaires/Activités/Ressources par Problème/Solution/Avantage Injuste"
      ]
    }
  },
  {
    id: 10,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Les 9 Blocs du Lean Canvas",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      table: {
        headers: ["Bloc", "Question Clé", "Focus"],
        rows: [
          ["1. Problème", "Quels sont les 3 problèmes principaux ?", "Customer"],
          ["2. Segments", "Qui sont vos early adopters ?", "Customer"],
          ["3. Proposition de Valeur", "Pourquoi êtes-vous différent ?", "Product"],
          ["4. Solution", "Quelles sont les 3 fonctionnalités clés ?", "Product"],
          ["5. Canaux", "Comment atteindre vos clients ?", "Market"],
          ["6. Revenus", "Sources de revenus ?", "Viability"],
          ["7. Coûts", "Coûts fixes et variables ?", "Viability"],
          ["8. Métriques", "Indicateurs clés ?", "Viability"],
          ["9. Avantage Injuste", "Qu'est-ce qui ne peut être copié ?", "Defensibility"]
        ]
      }
    }
  },
  {
    id: 11,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 1 : Le Problème",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Listez les 3 problèmes principaux que vos clients cibles rencontrent. Si votre produit ne résout pas un problème assez important, rien ne peut sauver votre business model.",
      keyPoints: [
        "Commencez toujours par le problème, pas la solution",
        "Identifiez les alternatives existantes (comment le problème est résolu aujourd'hui)",
        "Comprenez le coût du problème pour le client",
        "Plus le problème est douloureux, plus le client est prêt à payer"
      ],
      tips: [
        "Parlez aux clients potentiels pour valider le problème",
        "Ne vous fiez pas aux sondages, observez le comportement réel"
      ]
    }
  },
  {
    id: 12,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 2 : Segments de Clientèle",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Identifiez vos early adopters - les clients les plus susceptibles d'acheter votre produit en premier. Ne visez pas tout le monde.",
      keyPoints: [
        "Les early adopters ont le problème de manière aigüe",
        "Ils sont conscients qu'ils ont un problème",
        "Ils cherchent activement une solution",
        "Ils peuvent assembler une solution temporaire"
      ],
      tips: [
        "Créez un persona détaillé de votre early adopter",
        "Distinguez utilisateurs et clients (qui paie ?)"
      ]
    }
  },
  {
    id: 13,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 3 : Proposition de Valeur Unique",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Un message simple, clair et convaincant qui explique pourquoi vous êtes différent et méritez l'attention. Votre 'X pour Y' analogy.",
      keyPoints: [
        "Doit être compréhensible en 8 secondes",
        "Focus sur le résultat obtenu, pas les fonctionnalités",
        "Différent = meilleur dans l'esprit du client",
        "Utilisez l'analogie 'X pour Y' (ex: YouTube = Flickr pour vidéos)"
      ],
      caseStudy: {
        name: "Exemple UVP",
        context: "Au lieu de lister des fonctionnalités techniques...",
        lesson: "'Économisez 10h/semaine sur votre comptabilité' est plus puissant que 'Logiciel de comptabilité avec synchronisation cloud'"
      }
    }
  },
  {
    id: 14,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 4 : La Solution",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Esquissez les 3 fonctionnalités principales qui adressent les 3 problèmes identifiés. Ne vous attachez pas trop à la solution initiale - elle va évoluer.",
      keyPoints: [
        "Maximum 3 fonctionnalités clés (pas une liste exhaustive)",
        "Chaque fonctionnalité doit correspondre à un problème",
        "La solution est votre hypothèse la moins importante à ce stade",
        "MVP = la plus petite solution qui crée de la valeur"
      ],
      quote: "Le Minimum Viable Product n'est pas le plus petit produit imaginable. C'est la plus petite solution qui crée, délivre et capture de la valeur client."
    }
  },
  {
    id: 15,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 5 : Les Canaux",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Identifiez votre chemin vers les clients. Comment allez-vous les atteindre et les acquérir ?",
      table: {
        headers: ["Type", "Exemples", "Caractéristiques"],
        rows: [
          ["Inbound", "SEO, Content Marketing, Referrals", "Gratuit, lent à démarrer, scalable"],
          ["Outbound", "Cold Emails, Ads, Events", "Payant, rapide, coût par acquisition"],
          ["Viral", "Word of mouth, Social sharing", "Gratuit, nécessite produit exceptionnel"]
        ]
      },
      tips: [
        "Pour les early adopters, privilégiez les canaux directs et personnels",
        "Ne dispersez pas vos efforts sur trop de canaux au début"
      ]
    }
  },
  {
    id: 16,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 6 : Flux de Revenus",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Comment allez-vous gagner de l'argent ? Le prix fait partie du produit et doit être testé comme une fonctionnalité.",
      keyPoints: [
        "Chargez dès le premier jour (même en beta)",
        "Le prix est un signal de valeur perçue",
        "Testez votre pricing avec des vrais clients",
        "Revenue = Prix × Volume"
      ],
      table: {
        headers: ["Modèle", "Description"],
        rows: [
          ["Abonnement", "Revenus récurrents mensuels/annuels"],
          ["Transactionnel", "Paiement à l'usage ou à l'unité"],
          ["Freemium", "Version gratuite + premium payante"],
          ["Marketplace", "Commission sur transactions"]
        ]
      }
    }
  },
  {
    id: 17,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 7 : Structure de Coûts",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Listez vos coûts fixes et variables pour atteindre le seuil de rentabilité et au-delà.",
      keyPoints: [
        "Coûts fixes : salaires, loyer, serveurs...",
        "Coûts variables : coût d'acquisition client (CAC), coût de servir un client",
        "Le burn rate détermine votre runway",
        "Bootstrap = contraintes = créativité"
      ],
      tips: [
        "Calculez votre break-even point",
        "Les contraintes budgétaires forcent l'innovation"
      ]
    }
  },
  {
    id: 18,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 8 : Métriques Clés",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Identifiez les indicateurs qui vous disent vraiment comment se porte votre business. Évitez les vanity metrics.",
      framework: {
        name: "Pirate Metrics (AARRR)",
        elements: [
          { label: "Acquisition", description: "Comment les utilisateurs vous trouvent" },
          { label: "Activation", description: "Première expérience réussie" },
          { label: "Rétention", description: "Reviennent-ils ?" },
          { label: "Revenue", description: "Paient-ils ?" },
          { label: "Referral", description: "Recommandent-ils ?" }
        ]
      }
    }
  },
  {
    id: 19,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Bloc 9 : Avantage Injuste",
    type: "outil",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Ce qui ne peut pas être facilement copié ou acheté. C'est souvent le bloc le plus difficile à remplir au début.",
      keyPoints: [
        "Expertise ou connaissances uniques",
        "Réseau ou communauté exclusive",
        "Données propriétaires",
        "Effets de réseau",
        "Équipe exceptionnelle"
      ],
      tips: [
        "C'est OK de laisser ce bloc vide au début",
        "L'avantage injuste se construit souvent avec le temps",
        "Les brevets et le code ne sont généralement PAS un avantage injuste"
      ]
    }
  },
  {
    id: 20,
    module: "Lean Canvas",
    axis: "Running Lean",
    title: "Ordre de Remplissage du Canvas",
    type: "processus",
    color: "from-emerald-500/20 to-emerald-600/10",
    content: {
      definition: "Remplissez le Lean Canvas dans un ordre spécifique pour maximiser la cohérence et l'apprentissage.",
      steps: [
        { step: "Problème + Segments", description: "Commencez par qui a le problème et quel est ce problème" },
        { step: "Proposition de Valeur Unique", description: "Qu'est-ce qui vous rend différent ?" },
        { step: "Solution", description: "Esquissez seulement 3 fonctionnalités clés" },
        { step: "Canaux", description: "Comment atteindre les early adopters ?" },
        { step: "Revenus + Coûts", description: "Le business est-il viable ?" },
        { step: "Métriques", description: "Quels indicateurs suivre ?" },
        { step: "Avantage Injuste", description: "Souvent le dernier à être clarifié" }
      ]
    }
  },

  // ======= RUNNING LEAN: Désirabilité (21-28) =======
  {
    id: 21,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Le Test de Désirabilité",
    type: "concept",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "La désirabilité teste si les clients veulent vraiment votre solution. C'est le risque #1 pour la plupart des produits aujourd'hui.",
      keyPoints: [
        "Les clients achètent pour des résultats (outcomes), pas des fonctionnalités",
        "Comprenez le Job-to-be-Done de vos clients",
        "La désirabilité précède la viabilité et la faisabilité",
        "Sans désirabilité, rien d'autre n'a d'importance"
      ],
      quote: "Les clients n'achètent pas des produits, ils louent des solutions pour accomplir un job."
    }
  },
  {
    id: 22,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Customer Forces Canvas",
    type: "outil",
    color: "from-amber-500/20 to-amber-600/10",
    image: "customer-forces-canvas",
    content: {
      definition: "Un outil pour comprendre les forces qui poussent et retiennent les clients dans leur décision d'adopter une nouvelle solution.",
      framework: {
        name: "Les 4 Forces",
        elements: [
          { label: "PUSH", description: "Ce qui pousse le client loin de sa solution actuelle (frustrations)" },
          { label: "PULL", description: "Ce qui attire vers la nouvelle solution (bénéfices perçus)" },
          { label: "INERTIA", description: "Habitudes et résistance au changement" },
          { label: "FRICTION", description: "Anxiétés et craintes face à la nouvelle solution" }
        ]
      }
    }
  },
  {
    id: 23,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Le Triggering Event",
    type: "concept",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "L'événement déclencheur est le moment où le client décide de chercher activement une solution. C'est le meilleur moment pour l'approcher.",
      keyPoints: [
        "Le problème existait déjà, mais quelque chose a changé",
        "C'est un changement de contexte ou une deadline",
        "Exemples : changement de poste, nouveau projet, échec d'une solution...",
        "Identifiez le moment 'Ah-ha' de vos clients"
      ],
      caseStudy: {
        name: "Exemple de Triggering Event",
        context: "Un entrepreneur utilise Excel pour sa compta jusqu'au jour où il reçoit un contrôle fiscal...",
        lesson: "Le contrôle fiscal est le triggering event qui le pousse à chercher un vrai logiciel de comptabilité."
      }
    }
  },
  {
    id: 24,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Jobs-to-Be-Done",
    type: "concept",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "Les clients 'embauchent' des produits pour accomplir un job. Comprenez le job, pas la démographie.",
      keyPoints: [
        "Un job = le progrès que le client veut accomplir",
        "Jobs fonctionnels : tâches pratiques à accomplir",
        "Jobs émotionnels : comment veulent-ils se sentir ?",
        "Jobs sociaux : comment veulent-ils être perçus ?"
      ],
      quote: "Les gens n'achètent pas une perceuse de 6mm. Ils achètent un trou de 6mm dans le mur."
    }
  },
  {
    id: 25,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Desired Outcome vs Actual Outcome",
    type: "concept",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "Le résultat désiré est ce que le client espère obtenir. Le résultat réel est ce qu'il obtient vraiment. L'écart crée l'opportunité.",
      keyPoints: [
        "Desired Outcome = le 'job done' idéal",
        "Actual Outcome = ce qui se passe vraiment aujourd'hui",
        "Plus l'écart est grand, plus l'opportunité est grande",
        "Votre solution doit réduire cet écart"
      ],
      tips: [
        "Demandez aux clients de décrire leur situation idéale",
        "Comparez avec leur situation actuelle"
      ]
    }
  },
  {
    id: 26,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Understand Customers Better Than They Do",
    type: "méthode",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "Votre objectif n'est pas de demander aux clients ce qu'ils veulent, mais de comprendre leurs problèmes mieux qu'ils ne les comprennent eux-mêmes.",
      keyPoints: [
        "Les clients ne savent pas toujours exprimer ce qu'ils veulent",
        "Observez ce qu'ils font, pas seulement ce qu'ils disent",
        "Creusez le 'pourquoi' derrière le 'quoi'",
        "Devenez l'expert de leur problème"
      ],
      quote: "Si j'avais demandé aux gens ce qu'ils voulaient, ils auraient dit des chevaux plus rapides. — Henry Ford"
    }
  },
  {
    id: 27,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "La Mafia Offer",
    type: "concept",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "Une offre que vos clients ne peuvent pas refuser. Elle combine votre proposition de valeur, votre pricing, et une garantie qui élimine le risque.",
      keyPoints: [
        "Réduit le risque perçu à zéro",
        "Crée un déséquilibre : le client a tout à gagner, rien à perdre",
        "Inclut souvent une garantie de satisfaction",
        "Permet de tester le pricing et la valeur perçue"
      ],
      caseStudy: {
        name: "Exemple de Mafia Offer",
        context: "Un coach propose : 'Si vous ne doublez pas vos leads en 90 jours, je vous rembourse ET je vous paie 500€.'",
        lesson: "L'offre élimine toute anxiété et démontre la confiance dans la solution."
      }
    }
  },
  {
    id: 28,
    module: "Désirabilité",
    axis: "Running Lean",
    title: "Design Your Solution to Cause a Switch",
    type: "méthode",
    color: "from-amber-500/20 to-amber-600/10",
    content: {
      definition: "Votre solution doit être conçue pour faire 'switcher' le client de sa solution actuelle vers la vôtre. Cela nécessite de surmonter l'inertie et la friction.",
      steps: [
        { step: "Amplifiez le PUSH", description: "Mettez en lumière les frustrations de la solution actuelle" },
        { step: "Maximisez le PULL", description: "Montrez clairement le bénéfice de votre solution" },
        { step: "Réduisez l'INERTIA", description: "Facilitez la migration et l'apprentissage" },
        { step: "Éliminez la FRICTION", description: "Adressez les anxiétés avec des garanties" }
      ]
    }
  },

  // ======= RUNNING LEAN: Viabilité (29-36) =======
  {
    id: 29,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Le Test de Viabilité",
    type: "concept",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "La viabilité teste si votre business model peut générer suffisamment de revenus pour être durable. Un produit désiré mais non viable n'est pas un business.",
      keyPoints: [
        "Revenus suffisants pour couvrir les coûts",
        "Marges saines pour croître",
        "Scalabilité du modèle",
        "Unit economics positifs"
      ],
      quote: "Revenue is vanity, profit is sanity, cash is king."
    }
  },
  {
    id: 30,
    module: "Viabilité",
    axis: "Running Lean",
    title: "L'Estimation Fermi",
    type: "méthode",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "L'estimation Fermi vous permet de tester rapidement si votre business model 'tient la route' avec des calculs approximatifs mais révélateurs.",
      keyPoints: [
        "Nommé d'après le physicien Enrico Fermi",
        "Décomposez un problème complexe en sous-problèmes estimables",
        "Mieux vaut être approximativement juste que précisément faux",
        "Identifie les hypothèses les plus sensibles"
      ],
      caseStudy: {
        name: "Combien d'accordeurs de piano à Chicago ?",
        context: "Population × % foyers avec piano × fréquence accordage × temps par accordage ÷ heures travail/an",
        lesson: "L'exactitude importe moins que la structure du raisonnement."
      }
    }
  },
  {
    id: 31,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Minimum Success Criteria",
    type: "concept",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "Définissez vos critères minimaux de réussite : le minimum que votre business doit atteindre pour que ça vaille la peine de continuer.",
      keyPoints: [
        "Combien devez-vous gagner personnellement minimum ?",
        "En combien de temps voulez-vous y arriver ?",
        "Quelles sont vos contraintes (famille, savings...) ?",
        "Définit votre 'exit velocity' minimale"
      ],
      tips: [
        "Soyez honnête sur vos besoins réels",
        "Cela vous évite de poursuivre un projet non viable"
      ]
    }
  },
  {
    id: 32,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Back-of-the-Envelope Calculation",
    type: "exercice",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "Un calcul rapide 'au dos de l'enveloppe' pour valider la viabilité de votre modèle en quelques minutes.",
      steps: [
        { step: "Définir le revenu cible", description: "Ex: 1M€/an dans 3 ans" },
        { step: "Définir le prix moyen", description: "Ex: 100€/mois par client" },
        { step: "Calculer le nombre de clients", description: "1M€ ÷ (100€ × 12) = 833 clients actifs" },
        { step: "Estimer le taux de conversion", description: "Ex: 5% des leads deviennent clients" },
        { step: "Calculer le trafic nécessaire", description: "833 ÷ 5% = 16 660 leads/an" }
      ]
    }
  },
  {
    id: 33,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Unit Economics",
    type: "concept",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "L'économie unitaire analyse la rentabilité au niveau d'un seul client. Si un client n'est pas rentable, 1000 clients ne le seront pas plus.",
      table: {
        headers: ["Métrique", "Formule", "Objectif"],
        rows: [
          ["LTV (Lifetime Value)", "ARPU × Durée de vie moyenne", "Valeur totale d'un client"],
          ["CAC (Customer Acquisition Cost)", "Coûts marketing ÷ Nouveaux clients", "Coût pour acquérir un client"],
          ["Ratio LTV/CAC", "LTV ÷ CAC", "> 3 pour être sain"]
        ]
      },
      keyPoints: [
        "LTV/CAC > 3 = modèle sain",
        "LTV/CAC < 1 = vous perdez de l'argent à chaque client",
        "Payback period < 12 mois idéalement"
      ]
    }
  },
  {
    id: 34,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Le Pricing Comme Feature",
    type: "concept",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "Le prix fait partie du produit et doit être testé comme une fonctionnalité. Le bon prix maximise la valeur perçue ET le revenu.",
      keyPoints: [
        "Le prix communique la valeur",
        "Prix trop bas = signale faible qualité",
        "Prix trop haut = barrière à l'entrée",
        "Testez différents prix avec différents segments"
      ],
      tips: [
        "Commencez plus haut que vous pensez",
        "Il est plus facile de baisser que d'augmenter",
        "Le prix doit être proportionnel à la douleur résolue"
      ]
    }
  },
  {
    id: 35,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Chargez Dès le Jour 1",
    type: "méthode",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "Ne donnez pas votre produit gratuitement, même en beta. Charger dès le début valide la vraie demande et filtre les vrais clients.",
      keyPoints: [
        "Un client qui paie est différent d'un utilisateur gratuit",
        "Le paiement démontre un engagement réel",
        "Les feedbacks des clients payants sont plus pertinents",
        "'Gratuit' n'est pas un business model"
      ],
      quote: "Le meilleur signal qu'un client veut votre produit, c'est qu'il sorte sa carte de crédit."
    }
  },
  {
    id: 36,
    module: "Viabilité",
    axis: "Running Lean",
    title: "Les Archetypes de Business Model",
    type: "concept",
    color: "from-rose-500/20 to-rose-600/10",
    content: {
      definition: "Comprendre les grands archetypes de business models vous aide à choisir le bon pour votre contexte.",
      table: {
        headers: ["Archetype", "Exemple", "Caractéristique clé"],
        rows: [
          ["Direct", "E-commerce, SaaS", "Vente directe au client final"],
          ["Marketplace", "Airbnb, Uber", "Connecte offre et demande, commission"],
          ["Advertising", "Google, Facebook", "Gratuit pour utilisateurs, payé par annonceurs"],
          ["Aggregator", "Netflix, Spotify", "Agrège du contenu/services tiers"]
        ]
      }
    }
  },

  // ======= RUNNING LEAN: Faisabilité (37-42) =======
  {
    id: 37,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Le Test de Faisabilité",
    type: "concept",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "La faisabilité teste si vous pouvez effectivement construire et délivrer la solution. C'est souvent le risque le moins élevé pour les startups tech aujourd'hui.",
      keyPoints: [
        "Avez-vous les compétences techniques nécessaires ?",
        "Pouvez-vous livrer dans les délais et budget ?",
        "Y a-t-il des obstacles réglementaires ou légaux ?",
        "Avez-vous accès aux ressources nécessaires ?"
      ],
      quote: "Le risque de faisabilité a significativement diminué avec les nouvelles technologies et le cloud."
    }
  },
  {
    id: 38,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Le Minimum Viable Product (MVP)",
    type: "concept",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "Le MVP n'est pas le plus petit produit possible, mais la plus petite solution qui crée, délivre et capture de la valeur client.",
      keyPoints: [
        "MVP ≠ produit incomplet ou bâclé",
        "MVP = produit minimum qui résout le problème core",
        "Doit créer de la valeur (résoudre le problème)",
        "Doit capturer de la valeur (générer du revenu)"
      ],
      tips: [
        "Focalisez sur les fonctionnalités qui différencient",
        "Enlevez tout ce qui n'est pas essentiel au job core"
      ]
    }
  },
  {
    id: 39,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Types de MVP",
    type: "outil",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "Il existe plusieurs types de MVP selon ce que vous voulez tester et vos ressources.",
      table: {
        headers: ["Type", "Description", "Quand l'utiliser"],
        rows: [
          ["Concierge", "Service manuel derrière une façade", "Valider la demande sans tech"],
          ["Wizard of Oz", "Humain imite la tech automatisée", "Tester l'UX sans développer"],
          ["Landing Page", "Page expliquant le produit", "Tester l'intérêt (emails, précommandes)"],
          ["Single Feature", "Une seule fonctionnalité", "Valider la proposition de valeur core"]
        ]
      }
    }
  },
  {
    id: 40,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Build-Measure-Learn Accelerated",
    type: "processus",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "Accélérez le cycle Build-Measure-Learn en commençant par ce que vous voulez apprendre, pas par ce que vous voulez construire.",
      steps: [
        { step: "LEARN", description: "Quelle est l'hypothèse à valider ?" },
        { step: "MEASURE", description: "Quel indicateur prouvera ou invalidera l'hypothèse ?" },
        { step: "BUILD", description: "Quelle est la plus petite chose à construire pour obtenir cet indicateur ?" }
      ],
      quote: "Commencez par la fin en tête : que devez-vous apprendre ?"
    }
  },
  {
    id: 41,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Contraintes = Créativité",
    type: "concept",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "Les contraintes (temps, argent, ressources) ne sont pas des obstacles mais des catalyseurs de créativité et d'innovation.",
      keyPoints: [
        "Moins de ressources = plus de focus",
        "Contraintes forcent à prioriser ruthlessly",
        "Bootstrap vs VC : différents avantages",
        "Le temps est votre ressource la plus rare"
      ],
      caseStudy: {
        name: "Dropbox MVP",
        context: "Au lieu de construire un produit complexe, Drew Houston a créé une vidéo de 3 minutes démontrant le concept.",
        lesson: "La waitlist a explosé, validant la demande sans écrire une ligne de code backend."
      }
    }
  },
  {
    id: 42,
    module: "Faisabilité",
    axis: "Running Lean",
    title: "Le Traction Roadmap",
    type: "outil",
    color: "from-purple-500/20 to-purple-600/10",
    content: {
      definition: "La roadmap de traction définit vos milestones clés sur le chemin vers le product/market fit, pas vos fonctionnalités.",
      steps: [
        { step: "Problem/Solution Fit", description: "Valider que le problème existe et que votre solution y répond" },
        { step: "Product/Market Fit", description: "Prouver que les clients veulent et paient pour votre produit" },
        { step: "Scale", description: "Développer un modèle d'acquisition scalable et rentable" }
      ],
      tips: [
        "Chaque milestone a des critères de succès clairs",
        "Ne passez pas au suivant avant d'avoir validé le précédent"
      ]
    }
  },

  // ======= RUNNING LEAN: Validation (43-52) =======
  {
    id: 43,
    module: "Validation",
    axis: "Running Lean",
    title: "Les Cycles de 90 Jours",
    type: "processus",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Structurez votre validation en cycles de 90 jours pour maintenir le focus, créer de l'urgence et mesurer les progrès.",
      keyPoints: [
        "90 jours = assez long pour des résultats significatifs",
        "90 jours = assez court pour maintenir l'urgence",
        "Chaque cycle a des objectifs clairs",
        "Terminez par un 'cycle review' avec les stakeholders"
      ],
      quote: "Le pire gaspillage est de construire efficacement quelque chose qui n'aurait jamais dû être construit."
    }
  },
  {
    id: 44,
    module: "Validation",
    axis: "Running Lean",
    title: "Kick Off Your First Cycle",
    type: "processus",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Le premier cycle de 90 jours est critique. Son objectif est souvent de valider l'adéquation problème/solution.",
      steps: [
        { step: "Semaine 1-2", description: "Finaliser le Lean Canvas et identifier les risques" },
        { step: "Semaine 3-6", description: "Conduire les interviews de découverte problème" },
        { step: "Semaine 7-10", description: "Affiner la solution et créer le MVP" },
        { step: "Semaine 11-12", description: "Premiers tests avec early adopters et review" }
      ]
    }
  },
  {
    id: 45,
    module: "Validation",
    axis: "Running Lean",
    title: "Problem Discovery vs Solution Discovery",
    type: "concept",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "La validation se fait en deux phases distinctes : d'abord valider le problème, puis valider la solution.",
      table: {
        headers: ["Phase", "Objectif", "Méthode"],
        rows: [
          ["Problem Discovery", "Valider que le problème existe", "Interviews, observations"],
          ["Solution Discovery", "Valider que la solution résout le problème", "Démos, prototypes, MVPs"]
        ]
      },
      quote: "Ne tombez pas amoureux de votre solution avant d'être tombé amoureux du problème."
    }
  },
  {
    id: 46,
    module: "Validation",
    axis: "Running Lean",
    title: "Pivoter ou Persévérer ?",
    type: "concept",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "À la fin de chaque cycle, vous devez décider : pivoter (changer de direction) ou persévérer (continuer).",
      keyPoints: [
        "Basez la décision sur les données, pas les intuitions",
        "Un pivot n'est pas un échec, c'est un apprentissage",
        "Types de pivots : segment, problème, canal, revenue model...",
        "Persévérer sans progrès = entêtement, pas persévérance"
      ],
      tips: [
        "Définissez vos critères de décision AVANT le cycle",
        "Impliquez votre équipe et vos advisors dans la décision"
      ]
    }
  },
  {
    id: 47,
    module: "Validation",
    axis: "Running Lean",
    title: "Le Validation Plan (One Page)",
    type: "outil",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Un plan de validation sur une page qui résume vos hypothèses clés, comment les tester, et les critères de succès.",
      table: {
        headers: ["Élément", "Description"],
        rows: [
          ["Hypothèse risquée", "L'hypothèse la plus critique à tester"],
          ["Expérimentation", "Comment allez-vous la tester ?"],
          ["Métriques", "Quel indicateur mesurer ?"],
          ["Critère de succès", "Quel résultat valide l'hypothèse ?"],
          ["Timeline", "Combien de temps pour le test ?"]
        ]
      }
    }
  },
  {
    id: 48,
    module: "Validation",
    axis: "Running Lean",
    title: "Experiment Report",
    type: "outil",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Documentez chaque expérimentation avec un rapport structuré pour maximiser l'apprentissage et la prise de décision.",
      steps: [
        { step: "Hypothèse", description: "Nous croyons que [hypothèse]" },
        { step: "Expérimentation", description: "Pour valider, nous allons [action]" },
        { step: "Métriques", description: "Nous mesurerons [indicateurs]" },
        { step: "Critères", description: "L'hypothèse est validée si [conditions]" },
        { step: "Résultats", description: "Nous avons observé [données]" },
        { step: "Apprentissages", description: "Nous avons appris que [insights]" },
        { step: "Prochaines étapes", description: "Nous allons maintenant [actions]" }
      ]
    }
  },
  {
    id: 49,
    module: "Validation",
    axis: "Running Lean",
    title: "Biais Cognitifs à Éviter",
    type: "concept",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Les biais cognitifs peuvent fausser votre interprétation des résultats. Apprenez à les reconnaître.",
      keyPoints: [
        "Biais de confirmation : chercher ce qui confirme nos croyances",
        "Biais d'ancrage : s'accrocher aux premières informations",
        "Biais de survie : ne voir que les succès, pas les échecs",
        "Biais de proximité : surpondérer les feedbacks proches"
      ],
      tips: [
        "Faites valider vos conclusions par des externes",
        "Cherchez activement des contre-exemples",
        "Utilisez des données quantitatives, pas juste qualitatives"
      ]
    }
  },
  {
    id: 50,
    module: "Validation",
    axis: "Running Lean",
    title: "Le 90-Day Cycle Review",
    type: "processus",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Le cycle review est une réunion formelle à la fin de chaque cycle pour faire le point et décider de la suite.",
      steps: [
        { step: "Ce qu'on a fait", description: "Rappel des objectifs et actions du cycle" },
        { step: "Ce qu'on a appris", description: "Insights clés des expérimentations" },
        { step: "Où on en est", description: "Mise à jour du Lean Canvas et des métriques" },
        { step: "Ce qu'on va faire", description: "Objectifs et hypothèses du prochain cycle" }
      ]
    }
  },
  {
    id: 51,
    module: "Validation",
    axis: "Running Lean",
    title: "Éviter le Piège du Build",
    type: "concept",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "Le 'build trap' est le piège de construire sans fin en croyant que la prochaine feature sera la bonne. La validation vous en protège.",
      keyPoints: [
        "Construire est addictif mais pas toujours productif",
        "Plus de features ≠ plus de valeur",
        "Le vrai progrès = clients heureux qui paient",
        "Sortez du bureau avant de coder"
      ],
      quote: "Il n'y a pas de fait à l'intérieur de votre bureau, alors sortez. — Steve Blank"
    }
  },
  {
    id: 52,
    module: "Validation",
    axis: "Running Lean",
    title: "Acceptez l'Échec Comme Apprentissage",
    type: "concept",
    color: "from-cyan-500/20 to-cyan-600/10",
    content: {
      definition: "L'échec d'une expérimentation n'est pas un vrai échec si vous en tirez des apprentissages actionnables.",
      keyPoints: [
        "Les hypothèses ne peuvent qu'être réfutées, pas prouvées",
        "Un 'non' clair vaut mieux qu'un 'peut-être' flou",
        "Chaque échec vous rapproche de la bonne réponse",
        "Échouez petit et vite plutôt que gros et tard"
      ],
      quote: "Le seul vrai échec est de ne pas apprendre."
    }
  },

  // ======= RUNNING LEAN: Interviews Client (53-60) =======
  {
    id: 53,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "L'Art de l'Interview Client",
    type: "méthode",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "L'interview client est votre outil principal pour comprendre les problèmes. C'est une conversation structurée, pas un interrogatoire.",
      keyPoints: [
        "Objectif : comprendre, pas vendre",
        "Durée idéale : 30-45 minutes",
        "Ratio : 80% écoute, 20% questions",
        "En personne > visio > téléphone > email"
      ],
      quote: "La meilleure façon de prédire le comportement futur est d'observer le comportement passé."
    }
  },
  {
    id: 54,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Script d'Interview Problem Discovery",
    type: "outil",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Un script structuré pour découvrir les problèmes réels de vos clients potentiels.",
      steps: [
        { step: "Set the Stage", description: "Expliquez le contexte, rassurez sur la confidentialité" },
        { step: "Collect Demographics", description: "Qui sont-ils ? Quel est leur rôle ?" },
        { step: "Tell a Story", description: "Racontez-moi la dernière fois que vous avez eu ce problème" },
        { step: "Probe the Problem", description: "Comment gérez-vous ça aujourd'hui ? Qu'avez-vous essayé ?" },
        { step: "Explore Emotion", description: "Qu'est-ce qui est le plus frustrant ? Quel impact ?" },
        { step: "Wrap Up", description: "Qui d'autre devrais-je interviewer ?" }
      ]
    }
  },
  {
    id: 55,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Questions à Poser (et à Éviter)",
    type: "outil",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Les bonnes questions révèlent des insights. Les mauvaises biaisent les réponses.",
      table: {
        headers: ["À faire ✓", "À éviter ✗"],
        rows: [
          ["Racontez-moi la dernière fois que...", "Est-ce que vous achèteriez X ?"],
          ["Comment faites-vous X aujourd'hui ?", "Ne pensez-vous pas que Y serait mieux ?"],
          ["Qu'est-ce qui est le plus frustrant ?", "Sur une échelle de 1 à 10..."],
          ["Combien cela vous coûte-t-il ?", "Questions fermées (oui/non)"],
          ["Qu'avez-vous déjà essayé ?", "Questions hypothétiques sur le futur"]
        ]
      }
    }
  },
  {
    id: 56,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "La Technique Mom Test",
    type: "méthode",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Le 'Mom Test' de Rob Fitzpatrick : des questions auxquelles même votre mère ne pourrait pas mentir.",
      keyPoints: [
        "Ne parlez pas de votre idée, parlez de leur vie",
        "Demandez du passé concret, pas des opinions futures",
        "Cherchez des faits, pas des compliments",
        "Les gens mentent sur leurs intentions, pas sur leurs actions"
      ],
      caseStudy: {
        name: "Mauvais vs Bon",
        context: "'Achèteriez-vous X ?' → 'Oui !' (mensonge poli) vs 'Combien avez-vous dépensé pour résoudre ça l'année dernière ?' → '0€' (vérité révélatrice)",
        lesson: "La seconde question révèle que le problème n'est pas assez douloureux."
      }
    }
  },
  {
    id: 57,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Combien d'Interviews Faire ?",
    type: "concept",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Le nombre d'interviews dépend de la saturation : quand vous n'apprenez plus rien de nouveau.",
      keyPoints: [
        "Minimum : 10-15 interviews par segment",
        "Saturation : vous entendez les mêmes patterns",
        "Diversité : variez les profils dans le segment",
        "Itérez : affinez vos questions entre les interviews"
      ],
      tips: [
        "5 interviews révèlent 85% des problèmes (Jakob Nielsen)",
        "Mais continuez pour valider les patterns"
      ]
    }
  },
  {
    id: 58,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Trouver des Interviewés",
    type: "méthode",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Trouver les bonnes personnes à interviewer peut être un défi. Voici des stratégies qui fonctionnent.",
      keyPoints: [
        "Votre réseau existant (1er degré)",
        "Réseau de votre réseau (2ème degré)",
        "LinkedIn et communautés en ligne",
        "Events et meetups de l'industrie",
        "Cold outreach ciblé et personnalisé"
      ],
      tips: [
        "Offrez de partager vos learnings en échange",
        "Demandez à chaque interviewé qui d'autre contacter"
      ]
    }
  },
  {
    id: 59,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Customer Timeline",
    type: "outil",
    color: "from-orange-500/20 to-orange-600/10",
    image: "customer-timeline",
    content: {
      definition: "La timeline client documente le parcours complet depuis la première pensée jusqu'au job done.",
      steps: [
        { step: "First Thought", description: "Premier moment où le besoin émerge" },
        { step: "Triggering Event", description: "Ce qui déclenche la recherche active" },
        { step: "Consideration", description: "Options considérées" },
        { step: "Acquisition", description: "Achat/inscription" },
        { step: "Activation", description: "Première utilisation réussie" },
        { step: "Retention", description: "Usage continu" },
        { step: "Job Done", description: "Résultat obtenu" }
      ]
    }
  },
  {
    id: 60,
    module: "Interviews Client",
    axis: "Running Lean",
    title: "Synthétiser les Learnings",
    type: "processus",
    color: "from-orange-500/20 to-orange-600/10",
    content: {
      definition: "Après les interviews, synthétisez vos apprentissages de manière structurée pour en tirer des insights actionnables.",
      steps: [
        { step: "Transcription", description: "Notez les verbatims clés (pas de paraphrase)" },
        { step: "Patterns", description: "Identifiez les thèmes récurrents" },
        { step: "Surprises", description: "Notez ce qui vous a surpris" },
        { step: "Contradictions", description: "Identifiez les incohérences" },
        { step: "Actions", description: "Définissez les prochaines étapes" }
      ],
      tips: [
        "Faites la synthèse dans les 24h après l'interview",
        "Partagez avec votre équipe pour éviter les biais"
      ]
    }
  },

  // ======= SCALING LEAN: Traction (61-68) =======
  {
    id: 61,
    module: "Traction",
    axis: "Scaling Lean",
    title: "Qu'est-ce que la Traction ?",
    type: "concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "La traction est la preuve que des gens autres que vous, votre équipe et votre mère, se soucient de votre produit. C'est la preuve d'un business model qui fonctionne.",
      keyPoints: [
        "Traction = clients payants satisfaits",
        "Traction ≠ être premier sur le marché",
        "Traction = premier à l'adoption du marché",
        "Les investisseurs financent la traction, pas les idées"
      ],
      quote: "La traction est le meilleur levier pour attirer tout le reste : équipe, investisseurs, partenaires."
    }
  },
  {
    id: 62,
    module: "Traction",
    axis: "Scaling Lean",
    title: "Le Throughput",
    type: "concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Le Throughput est le taux auquel vous créez de nouveaux clients payants. C'est LA métrique de traction à optimiser.",
      keyPoints: [
        "Throughput = nombre de clients créés / période",
        "Différent du revenue (qui peut fluctuer avec le pricing)",
        "Focus sur la vitesse de création de clients",
        "Le Throughput prédit la croissance future"
      ],
      quote: "Le Throughput client est votre North Star Metric pour la traction."
    }
  },
  {
    id: 63,
    module: "Traction",
    axis: "Scaling Lean",
    title: "La Métaphore de l'Usine",
    type: "concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Imaginez votre startup comme une usine qui transforme des prospects en clients heureux. Cette métaphore aide à identifier les goulots d'étranglement.",
      keyPoints: [
        "Input = prospects (trafic, leads)",
        "Process = conversion (AARRR funnel)",
        "Output = clients payants satisfaits (Throughput)",
        "Optimisez les contraintes, pas tout le système"
      ],
      quote: "Une startup est une usine à clients. Votre job est d'optimiser cette usine."
    }
  },
  {
    id: 64,
    module: "Traction",
    axis: "Scaling Lean",
    title: "Les 3 Stades de Croissance",
    type: "processus",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Chaque startup passe par trois stades distincts avec des objectifs et des métriques différentes.",
      steps: [
        { step: "Problem/Solution Fit", description: "Valider que le problème vaut la peine d'être résolu. Objectif : démontrer la demande." },
        { step: "Product/Market Fit", description: "Prouver que le produit satisfait le marché. Objectif : rétention et satisfaction." },
        { step: "Scale", description: "Accélérer la croissance. Objectif : acquisition scalable et rentable." }
      ],
      tips: [
        "Ne sautez pas d'étape",
        "Chaque stade a ses propres métriques de succès"
      ]
    }
  },
  {
    id: 65,
    module: "Traction",
    axis: "Scaling Lean",
    title: "La Reproductibilité Avant la Croissance",
    type: "concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Avant de scaler, vous devez avoir un processus reproductible pour créer des clients. Scaler trop tôt amplifie les problèmes.",
      keyPoints: [
        "Un processus qui marche 1x doit marcher 10x",
        "Reproductibilité = prédictibilité",
        "Scalabilité = faire plus avec moins",
        "Croissance prématurée = cause #1 d'échec des startups"
      ],
      caseStudy: {
        name: "Pourquoi Facebook a battu MySpace",
        context: "Facebook a pris le temps de perfectionner son modèle sur Harvard avant de l'étendre.",
        lesson: "La croissance lente et reproductible bat la croissance rapide et chaotique."
      }
    }
  },
  {
    id: 66,
    module: "Traction",
    axis: "Scaling Lean",
    title: "Le Modèle de Traction",
    type: "outil",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Un modèle simple pour projeter votre croissance basé sur vos métriques actuelles.",
      table: {
        headers: ["Métrique", "Aujourd'hui", "Objectif 10x"],
        rows: [
          ["Visiteurs/mois", "1 000", "10 000"],
          ["Taux de conversion", "2%", "5%"],
          ["Clients/mois", "20", "500"],
          ["ARPU", "50€", "100€"],
          ["MRR", "1 000€", "50 000€"]
        ]
      },
      tips: [
        "Identifiez quel levier a le plus d'impact",
        "Focalisez sur un levier à la fois"
      ]
    }
  },
  {
    id: 67,
    module: "Traction",
    axis: "Scaling Lean",
    title: "La Stratégie du 10x",
    type: "concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Pensez en paliers de 10x plutôt qu'en améliorations incrémentales de 10%. Cela force à repenser les stratégies.",
      keyPoints: [
        "10% d'amélioration = optimisation tactique",
        "10x = changement de stratégie",
        "Planifiez par paliers : 10 → 100 → 1000 clients",
        "Chaque palier nécessite des stratégies différentes"
      ],
      quote: "Ce qui vous a amené ici ne vous amènera pas là-bas."
    }
  },
  {
    id: 68,
    module: "Traction",
    axis: "Scaling Lean",
    title: "Minimum Success Criteria pour Scaling",
    type: "outil",
    color: "from-indigo-500/20 to-indigo-600/10",
    content: {
      definition: "Définissez des critères clairs pour savoir si vous êtes prêt à scaler.",
      keyPoints: [
        "Rétention : les clients restent (< 5% churn mensuel)",
        "NPS : les clients recommandent (NPS > 50)",
        "Unit Economics : LTV/CAC > 3",
        "Payback Period : < 12 mois"
      ],
      tips: [
        "N'injectez pas d'argent dans un funnel percé",
        "Validez ces critères sur un échantillon significatif"
      ]
    }
  },

  // ======= SCALING LEAN: Usine à Clients (69-76) =======
  {
    id: 69,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "Customer Factory Blueprint",
    type: "outil",
    color: "from-pink-500/20 to-pink-600/10",
    image: "customer-factory-blueprint",
    content: {
      definition: "Le Customer Factory Blueprint visualise votre machine à créer des clients comme un processus industriel optimisable.",
      framework: {
        name: "Les 5 Étapes",
        elements: [
          { label: "ACQUISITION", description: "Comment identifier et attirer des utilisateurs ?" },
          { label: "ACTIVATION", description: "Comment créer une première expérience 'Aha!' ?" },
          { label: "RETENTION", description: "Comment faire revenir les utilisateurs ?" },
          { label: "REVENUE", description: "Comment convertir en clients payants ?" },
          { label: "REFERRAL", description: "Comment transformer en ambassadeurs ?" }
        ]
      }
    }
  },
  {
    id: 70,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "La Boucle des Clients Heureux",
    type: "concept",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Le succès durable vient de clients heureux qui restent et recommandent. C'est un cercle vertueux.",
      keyPoints: [
        "Clients heureux → Retention → Revenue récurrent",
        "Clients heureux → Referrals → Acquisition gratuite",
        "Focus sur la satisfaction, pas juste l'acquisition",
        "Le bouche-à-oreille est le meilleur canal"
      ],
      quote: "Il coûte 5x plus cher d'acquérir un nouveau client que de garder un existant."
    }
  },
  {
    id: 71,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "Les 3 Moteurs de Croissance",
    type: "concept",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Eric Ries identifie trois moteurs de croissance distincts. Choisissez celui qui correspond à votre modèle.",
      table: {
        headers: ["Moteur", "Mécanisme", "Métrique clé"],
        rows: [
          ["Sticky (Rétention)", "Les clients restent longtemps", "Churn < Acquisition"],
          ["Viral", "Les clients en attirent d'autres", "Coefficient viral > 1"],
          ["Paid", "Acquisition payante rentable", "LTV > CAC × 3"]
        ]
      },
      tips: [
        "Concentrez-vous sur un moteur principal",
        "Maîtrisez-le avant d'en ajouter un autre"
      ]
    }
  },
  {
    id: 72,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "Macro vs Micro Métriques",
    type: "concept",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Distinguez les macro-métriques (vue d'ensemble) des micro-métriques (diagnostic détaillé).",
      table: {
        headers: ["Type", "Exemples", "Usage"],
        rows: [
          ["Macro", "MRR, Throughput, Churn", "Pilotage stratégique, reporting"],
          ["Micro", "Taux par étape du funnel", "Diagnostic, optimisation tactique"]
        ]
      },
      tips: [
        "Surveillez les macro régulièrement",
        "Plongez dans les micro pour diagnostiquer les problèmes"
      ]
    }
  },
  {
    id: 73,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "L'Entonnoir Pirate (AARRR)",
    type: "outil",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Le framework AARRR de Dave McClure pour mesurer et optimiser chaque étape du parcours client.",
      steps: [
        { step: "Acquisition", description: "D'où viennent les utilisateurs ?" },
        { step: "Activation", description: "Ont-ils une bonne première expérience ?" },
        { step: "Retention", description: "Reviennent-ils ?" },
        { step: "Revenue", description: "Paient-ils ?" },
        { step: "Referral", description: "Recommandent-ils ?" }
      ],
      quote: "Optimisez l'entonnoir de haut en bas, une étape à la fois."
    }
  },
  {
    id: 74,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "Throughput Client vs Throughput Revenu",
    type: "concept",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Le Throughput client (nombre de clients) et le Throughput revenu (MRR) sont liés mais distincts.",
      keyPoints: [
        "Throughput Client = focus sur la création de valeur",
        "Throughput Revenu = focus sur la capture de valeur",
        "Les deux sont importants mais à différents stades",
        "Early stage : priorité au Throughput client"
      ],
      quote: "D'abord créez de la valeur (clients), ensuite capturez-la (revenu)."
    }
  },
  {
    id: 75,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "L'Effet Un Jour Sans Fin",
    type: "concept",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Comme dans le film 'Un jour sans fin', vous devez répéter et améliorer votre processus jusqu'à ce qu'il soit parfait.",
      keyPoints: [
        "Chaque jour/semaine est une itération",
        "Apprenez de chaque cycle",
        "Améliorez progressivement chaque étape",
        "La répétition mène à la maîtrise"
      ],
      caseStudy: {
        name: "Le Paradoxe de la Répétition",
        context: "Les mêmes actions produisent les mêmes résultats. Pour changer les résultats, changez les actions.",
        lesson: "Itérez consciemment, pas mécaniquement."
      }
    }
  },
  {
    id: 76,
    module: "Usine à Clients",
    axis: "Scaling Lean",
    title: "Exercice : Ébauche de Votre Usine",
    type: "exercice",
    color: "from-pink-500/20 to-pink-600/10",
    content: {
      definition: "Documentez votre usine à clients actuelle pour identifier les opportunités d'amélioration.",
      steps: [
        { step: "Acquisition", description: "Listez vos 3 principaux canaux d'acquisition et leur volume" },
        { step: "Activation", description: "Quel est votre taux d'activation ? Quel est le 'Aha moment' ?" },
        { step: "Retention", description: "Quel est votre taux de rétention hebdo/mensuel ?" },
        { step: "Revenue", description: "Quel est votre taux de conversion payant ? ARPU ?" },
        { step: "Referral", description: "Quel % de clients vous recommandent ?" }
      ]
    }
  },

  // ======= SCALING LEAN: Métriques (77-84) =======
  {
    id: 77,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "Vanity Metrics vs Actionable Metrics",
    type: "concept",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "Les vanity metrics flattent l'ego mais ne guident pas les décisions. Les actionable metrics permettent d'agir.",
      table: {
        headers: ["Vanity Metrics ✗", "Actionable Metrics ✓"],
        rows: [
          ["Total utilisateurs inscrits", "Utilisateurs actifs ce mois"],
          ["Pages vues totales", "Temps passé par session"],
          ["Nombre de téléchargements", "Taux de rétention jour 7"],
          ["Followers sur les réseaux", "Taux de conversion"]
        ]
      },
      quote: "La seule métrique qui compte est celle qui change votre comportement."
    }
  },
  {
    id: 78,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "One Metric That Matters (OMTM)",
    type: "concept",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "À chaque stade, identifiez LA métrique qui compte le plus. Focalisez toute l'équipe dessus.",
      keyPoints: [
        "Problem/Solution Fit : taux de réponse interviews",
        "Product/Market Fit : rétention / NPS",
        "Scale : CAC / LTV ratio",
        "L'OMTM change selon le stade"
      ],
      tips: [
        "Affichez l'OMTM dans le bureau",
        "Revoyez-la en équipe chaque semaine",
        "Changez-la quand vous passez au stade suivant"
      ]
    }
  },
  {
    id: 79,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "L'Analyse par Cohortes",
    type: "outil",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "L'analyse par cohortes groupe les utilisateurs par date d'inscription pour comparer leur comportement dans le temps.",
      keyPoints: [
        "Une cohorte = groupe d'utilisateurs inscrits la même semaine/mois",
        "Compare les cohortes entre elles",
        "Détecte si les améliorations fonctionnent vraiment",
        "Révèle les tendances cachées par les moyennes"
      ],
      table: {
        headers: ["Cohorte", "Semaine 1", "Semaine 2", "Semaine 4", "Semaine 8"],
        rows: [
          ["Janvier", "100%", "45%", "30%", "20%"],
          ["Février", "100%", "50%", "35%", "25%"],
          ["Mars", "100%", "55%", "40%", "30%"]
        ]
      }
    }
  },
  {
    id: 80,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "La Comptabilité de l'Innovation",
    type: "concept",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "La comptabilité de l'innovation mesure les progrès vers le product/market fit, pas les métriques financières traditionnelles.",
      keyPoints: [
        "Les métriques comptables classiques ne marchent pas au début",
        "Mesurez les progrès vers les hypothèses validées",
        "Créez un tableau de bord d'apprentissage",
        "Communiquez les progrès aux stakeholders"
      ],
      quote: "Vous êtes le premier investisseur de votre startup. Investissez votre temps comme vous investiriez de l'argent."
    }
  },
  {
    id: 81,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "Établir un Baseline",
    type: "processus",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "Avant d'optimiser, vous devez établir un baseline - votre point de référence actuel.",
      steps: [
        { step: "Mesurer l'état actuel", description: "Collectez des données sur 2-4 semaines" },
        { step: "Documenter", description: "Notez toutes les métriques clés" },
        { step: "Identifier les tendances", description: "Sont-elles stables, en hausse, en baisse ?" },
        { step: "Définir les objectifs", description: "Basés sur le baseline, pas sur des voeux pieux" }
      ]
    }
  },
  {
    id: 82,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "Le Dashboard Lean",
    type: "outil",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "Un dashboard simple avec les métriques essentielles pour piloter votre startup au quotidien.",
      keyPoints: [
        "Maximum 5-7 métriques visibles",
        "Une métrique North Star en haut",
        "Métriques du funnel AARRR",
        "Tendances visuelles (graphiques)",
        "Comparaison avec les périodes précédentes"
      ],
      tips: [
        "Automatisez la collecte de données",
        "Revoyez le dashboard chaque semaine en équipe"
      ]
    }
  },
  {
    id: 83,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "Le Reporting aux Stakeholders",
    type: "méthode",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "Communiquez vos progrès de manière claire et honnête à vos stakeholders (investisseurs, board, équipe).",
      steps: [
        { step: "Ce qu'on a fait", description: "Actions et expérimentations du mois" },
        { step: "Ce qu'on a appris", description: "Insights et surprises" },
        { step: "Métriques clés", description: "Évolution vs mois précédent" },
        { step: "Défis", description: "Obstacles et blocages" },
        { step: "Prochaines étapes", description: "Priorités du mois suivant" }
      ]
    }
  },
  {
    id: 84,
    module: "Métriques",
    axis: "Scaling Lean",
    title: "Exercice : Votre Tableau de Bord",
    type: "exercice",
    color: "from-teal-500/20 to-teal-600/10",
    content: {
      definition: "Construisez votre tableau de bord de métriques personnalisé.",
      steps: [
        { step: "Identifiez votre stade", description: "Problem/Solution, Product/Market, ou Scale ?" },
        { step: "Choisissez votre OMTM", description: "La métrique qui compte le plus maintenant" },
        { step: "Listez les métriques secondaires", description: "4-6 métriques de support" },
        { step: "Définissez la fréquence", description: "Journalière, hebdo, mensuelle ?" },
        { step: "Choisissez l'outil", description: "Spreadsheet, Amplitude, Mixpanel..." }
      ]
    }
  },

  // ======= SCALING LEAN: Contraintes (85-90) =======
  {
    id: 85,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "La Théorie des Contraintes",
    type: "concept",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Issue de Goldratt, la Théorie des Contraintes stipule que tout système est limité par un petit nombre de contraintes. Optimiser ailleurs est du gaspillage.",
      keyPoints: [
        "Un système ne peut aller plus vite que son maillon le plus faible",
        "Identifiez la contrainte avant d'optimiser",
        "Une fois la contrainte levée, une nouvelle apparaît",
        "Focus = ne pas disperser les efforts"
      ],
      quote: "Un système de productivité n'est jamais plus fort que son maillon le plus faible."
    }
  },
  {
    id: 86,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "Identifier la Contrainte",
    type: "méthode",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Pour identifier votre contrainte actuelle, analysez votre funnel et trouvez le 'goulot d'étranglement'.",
      steps: [
        { step: "Cartographiez le funnel", description: "Acquisition → Activation → Retention → Revenue → Referral" },
        { step: "Mesurez chaque étape", description: "Taux de conversion entre chaque étape" },
        { step: "Identifiez la plus faible", description: "Où perdez-vous le plus de monde ?" },
        { step: "Validez", description: "Est-ce bien le principal problème ?" }
      ]
    }
  },
  {
    id: 87,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "Types de Contraintes",
    type: "concept",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Les contraintes peuvent être physiques (ressources limitées) ou liées aux règles (politiques, processus).",
      table: {
        headers: ["Type", "Exemples", "Solution"],
        rows: [
          ["Physique", "Manque de trafic, équipe trop petite", "Acquérir plus de ressources"],
          ["Règle/Politique", "Processus complexe, bureaucratie", "Simplifier, automatiser"],
          ["Marché", "Demande limitée, concurrence", "Pivoter segment ou proposition"]
        ]
      }
    }
  },
  {
    id: 88,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "Les 5 Étapes de Focalisation",
    type: "processus",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Le processus en 5 étapes de Goldratt pour gérer les contraintes systématiquement.",
      steps: [
        { step: "Identifier", description: "Trouvez la contrainte principale" },
        { step: "Exploiter", description: "Maximisez l'output de la contrainte actuelle" },
        { step: "Subordonner", description: "Alignez tout le reste sur la contrainte" },
        { step: "Élever", description: "Investissez pour lever la contrainte" },
        { step: "Répéter", description: "Revenez à l'étape 1, une nouvelle contrainte apparaît" }
      ]
    }
  },
  {
    id: 89,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "Les Contraintes Comme Avantage",
    type: "concept",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Les contraintes (temps, argent, équipe) ne sont pas des obstacles mais des catalyseurs d'innovation et de focus.",
      keyPoints: [
        "Contraintes = créativité forcée",
        "Bootstrap > levée de fonds au début",
        "Petite équipe = décisions rapides",
        "Les géants ont le problème inverse"
      ],
      caseStudy: {
        name: "37signals (Basecamp)",
        context: "Une petite équipe bootstrappée a créé des produits utilisés par des millions de personnes.",
        lesson: "Moins de ressources = focus sur ce qui compte vraiment."
      }
    }
  },
  {
    id: 90,
    module: "Contraintes",
    axis: "Scaling Lean",
    title: "Exercice : Votre Contrainte Principale",
    type: "exercice",
    color: "from-red-500/20 to-red-600/10",
    content: {
      definition: "Identifiez et planifiez comment lever votre contrainte principale.",
      steps: [
        { step: "État actuel", description: "Dessinez votre funnel avec les taux actuels" },
        { step: "Identification", description: "Quelle étape a le plus faible taux ?" },
        { step: "Root cause", description: "Pourquoi ce taux est-il si faible ?" },
        { step: "Hypothèses", description: "3 hypothèses pour améliorer ce taux" },
        { step: "Prochaine expérimentation", description: "Quelle hypothèse tester en premier ?" }
      ]
    }
  },

  // ======= SCALING LEAN: Expérimentations (91-98) =======
  {
    id: 91,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "La Science de l'Entrepreneuriat",
    type: "concept",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "L'entrepreneuriat peut être approché de manière scientifique : hypothèses, expérimentations, analyse, itération.",
      keyPoints: [
        "Les hypothèses ne peuvent être que réfutées, pas prouvées",
        "Chaque expérimentation est un test d'hypothèse",
        "Les données guident les décisions",
        "L'intuition génère des hypothèses, les données les valident"
      ],
      quote: "La méthode scientifique en quelques mots : observer, hypothétiser, expérimenter, analyser, répéter."
    }
  },
  {
    id: 92,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Le Lean Sprint",
    type: "processus",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "Le Lean Sprint est un cycle d'une semaine pour tester rapidement des hypothèses avec toute l'équipe alignée.",
      steps: [
        { step: "Lundi - Planifier", description: "Définir l'hypothèse et l'expérimentation" },
        { step: "Mardi/Mercredi - Construire", description: "Créer le minimum nécessaire pour tester" },
        { step: "Jeudi - Tester", description: "Lancer l'expérimentation" },
        { step: "Vendredi - Analyser", description: "Analyser les résultats et décider" }
      ]
    }
  },
  {
    id: 93,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Tester des Stratégies Ambitieuses",
    type: "concept",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "Testez des stratégies ambitieuses (10x) à travers de petites expérimentations rapides et réversibles.",
      keyPoints: [
        "Grande vision, petits tests",
        "Fail fast, fail cheap",
        "Plusieurs petits paris > un gros pari",
        "Optionalité : gardez vos options ouvertes"
      ],
      quote: "La meilleure façon de prédire l'avenir est de le créer à travers des expérimentations."
    }
  },
  {
    id: 94,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Le Rapport d'Expérimentation",
    type: "outil",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "Un template structuré pour documenter chaque expérimentation et maximiser l'apprentissage.",
      table: {
        headers: ["Section", "Contenu"],
        rows: [
          ["Hypothèse", "Ce que nous croyons être vrai"],
          ["Expérimentation", "Ce que nous allons faire pour tester"],
          ["Métriques", "Ce que nous allons mesurer"],
          ["Critères de succès", "Ce qui validerait l'hypothèse"],
          ["Résultats", "Ce que nous avons observé"],
          ["Apprentissages", "Ce que nous avons appris"],
          ["Actions", "Ce que nous allons faire ensuite"]
        ]
      }
    }
  },
  {
    id: 95,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Les 7 Habitudes des Expérimentations Efficaces",
    type: "méthode",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      keyPoints: [
        "1. Une hypothèse claire et falsifiable",
        "2. Un critère de succès défini à l'avance",
        "3. La plus petite expérimentation possible",
        "4. Un timeframe court (1-2 semaines max)",
        "5. Isoler les variables (tester une chose à la fois)",
        "6. Documenter tout (processus et résultats)",
        "7. Partager les apprentissages avec l'équipe"
      ]
    }
  },
  {
    id: 96,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Éviter les Biais dans les Expérimentations",
    type: "concept",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "Les biais cognitifs peuvent fausser la conception et l'interprétation des expérimentations.",
      keyPoints: [
        "Biais de confirmation : définissez des critères d'échec clairs",
        "Biais de survie : analysez aussi les churns, pas juste les actifs",
        "Biais d'ancrage : variez l'ordre de présentation",
        "Effet Hawthorne : les utilisateurs se comportent différemment quand observés"
      ],
      tips: [
        "Faites valider votre design d'expérimentation par un externe",
        "Cherchez activement à invalider vos hypothèses"
      ]
    }
  },
  {
    id: 97,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Interpréter les Résultats",
    type: "méthode",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "Les résultats d'une expérimentation peuvent valider, invalider, ou être non concluants. Chaque cas nécessite une réponse différente.",
      table: {
        headers: ["Résultat", "Signification", "Action"],
        rows: [
          ["Validé", "L'hypothèse semble vraie", "Scaler ou passer à la prochaine hypothèse"],
          ["Invalidé", "L'hypothèse est fausse", "Pivoter ou abandonner cette direction"],
          ["Non concluant", "Pas assez de données", "Refaire avec plus de volume ou de temps"]
        ]
      }
    }
  },
  {
    id: 98,
    module: "Expérimentations",
    axis: "Scaling Lean",
    title: "Le Cycle Continu d'Innovation",
    type: "concept",
    color: "from-violet-500/20 to-violet-600/10",
    content: {
      definition: "L'innovation continue est un état d'esprit, pas un projet ponctuel. Même après le product/market fit, continuez à expérimenter.",
      keyPoints: [
        "Le produit parfait n'existe pas",
        "Les besoins clients évoluent",
        "La concurrence innove aussi",
        "Allouez du temps pour l'exploration (ex: 20%)"
      ],
      quote: "Le jour où vous arrêtez d'expérimenter est le jour où vous commencez à mourir. — Jeff Bezos (paraphrasé)"
    }
  }
];
