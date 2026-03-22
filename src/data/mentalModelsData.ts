// Mental Models Data - Based on Super Thinking by Gabriel Weinberg & Lauren McCann

export interface MentalModel {
  id: string;
  name: string;
  category: string;
  definition: string;
  example: string;
  application: string;
  icon: string;
}

export interface MentalModelCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const MENTAL_MODEL_CATEGORIES: MentalModelCategory[] = [
  {
    id: "decision",
    name: "Décisions",
    description: "Modèles pour prendre de meilleures décisions",
    color: "bg-blue-500",
    icon: "Target"
  },
  {
    id: "thinking",
    name: "Pensée Critique",
    description: "Éviter les biais et les erreurs de raisonnement",
    color: "bg-purple-500",
    icon: "Brain"
  },
  {
    id: "systems",
    name: "Systèmes",
    description: "Comprendre les systèmes complexes",
    color: "bg-emerald-500",
    icon: "Network"
  },
  {
    id: "strategy",
    name: "Stratégie",
    description: "Modèles pour la planification stratégique",
    color: "bg-amber-500",
    icon: "Chess"
  },
  {
    id: "productivity",
    name: "Productivité",
    description: "Optimiser son temps et ses ressources",
    color: "bg-rose-500",
    icon: "Clock"
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Diriger et influencer efficacement",
    color: "bg-indigo-500",
    icon: "Users"
  }
];

export const MENTAL_MODELS: MentalModel[] = [
  // Décisions
  {
    id: "first-principles",
    name: "First Principles Thinking",
    category: "decision",
    definition: "Décomposer un problème jusqu'à ses vérités fondamentales et reconstruire le raisonnement à partir de zéro, sans suppositions héritées.",
    example: "Elon Musk a réduit le coût des batteries Tesla en analysant les matériaux de base (cobalt, nickel, aluminium) plutôt que d'accepter le prix du marché.",
    application: "Avant d'accepter une convention, demandez-vous: 'Qu'est-ce qui est fondamentalement vrai ici?' et reconstruisez votre solution.",
    icon: "Layers"
  },
  {
    id: "inversion",
    name: "Inversion",
    category: "decision",
    definition: "Aborder un problème à l'envers. Au lieu de demander 'Comment réussir?', demandez 'Comment échouer?' et évitez ces erreurs.",
    example: "Carl Jacobi: 'Invert, always invert.' Pour un régime, plutôt que de chercher les aliments sains, évitez d'abord les aliments malsains.",
    application: "Pour tout objectif, listez d'abord toutes les façons d'échouer, puis travaillez à éviter chacune.",
    icon: "RotateCcw"
  },
  {
    id: "ockhams-razor",
    name: "Rasoir d'Ockham",
    category: "decision",
    definition: "L'explication la plus simple est généralement la meilleure. Ne multipliez pas les hypothèses inutilement.",
    example: "En médecine: 'Quand vous entendez des sabots, pensez chevaux, pas zèbres.' Un rhume est plus probable qu'une maladie rare.",
    application: "Avant de construire une théorie complexe, vérifiez si une explication simple suffit.",
    icon: "Scissors"
  },
  {
    id: "mvp",
    name: "Minimum Viable Product (MVP)",
    category: "decision",
    definition: "Construire la version la plus simple d'un produit qui permet de tester vos hypothèses avec de vrais utilisateurs.",
    example: "Reid Hoffman (LinkedIn): 'Si vous n'êtes pas gêné par la première version de votre produit, vous avez lancé trop tard.'",
    application: "Ne perfectionnez pas avant de valider. Lancez vite, apprenez, itérez.",
    icon: "Rocket"
  },
  {
    id: "de-risking",
    name: "De-Risking",
    category: "decision",
    definition: "Identifier et tester vos hypothèses les plus risquées avant d'investir massivement dans une direction.",
    example: "Une startup teste d'abord si les clients veulent son produit (hypothèse critique) avant de construire une équipe complète.",
    application: "Pour chaque projet, identifiez vos 3 hypothèses les plus risquées et testez-les en premier.",
    icon: "Shield"
  },

  // Pensée Critique
  {
    id: "confirmation-bias",
    name: "Biais de Confirmation",
    category: "thinking",
    definition: "Tendance à rechercher, interpréter et mémoriser les informations qui confirment nos croyances existantes.",
    example: "Un investisseur convaincu d'une action ne voit que les nouvelles positives et ignore les signaux d'alerte.",
    application: "Cherchez activement des preuves qui contredisent votre position. Demandez: 'Que faudrait-il pour que j'aie tort?'",
    icon: "Search"
  },
  {
    id: "conjunction-fallacy",
    name: "Erreur de Conjonction",
    category: "thinking",
    definition: "Croire qu'une combinaison spécifique d'événements est plus probable qu'un seul événement général.",
    example: "Paradoxe de Linda: les gens pensent que 'Linda est caissière ET féministe' est plus probable que simplement 'Linda est caissière'.",
    application: "Méfiez-vous des scénarios trop détaillés. La spécificité n'augmente pas la probabilité.",
    icon: "AlertTriangle"
  },
  {
    id: "overfitting",
    name: "Surapprentissage (Overfitting)",
    category: "thinking",
    definition: "Créer une explication trop complexe qui s'ajuste parfaitement aux données passées mais prédit mal l'avenir.",
    example: "En dating: avoir 50 critères spécifiques basés sur vos ex crée un 'pool' de candidats inutilement restreint.",
    application: "Simplifiez vos critères. Une ligne droite explique souvent mieux qu'une courbe complexe.",
    icon: "TrendingUp"
  },
  {
    id: "antifragile",
    name: "Antifragile",
    category: "thinking",
    definition: "Au-delà de la résilience: ce qui bénéficie des chocs, de la volatilité et du stress. Le contraire de fragile.",
    example: "Les muscles deviennent plus forts après l'exercice. Votre pensée s'améliore après des erreurs analysées.",
    application: "Exposez-vous délibérément à de petits stress pour devenir plus fort. Apprenez de chaque échec.",
    icon: "Zap"
  },
  {
    id: "unforced-error",
    name: "Erreur Non Forcée",
    category: "thinking",
    definition: "Une erreur due à votre propre jugement ou exécution, pas à une action brillante de l'adversaire.",
    example: "En tennis: frapper une balle facile dans le filet. En business: ne pas considérer toutes vos options.",
    application: "Analysez vos échecs. Combien étaient des erreurs évitables vs des défaites face à un concurrent supérieur?",
    icon: "XCircle"
  },

  // Systèmes
  {
    id: "critical-mass",
    name: "Masse Critique",
    category: "systems",
    definition: "Le seuil minimum nécessaire pour qu'un processus s'auto-entretienne ou qu'un changement devienne irréversible.",
    example: "Uber a besoin d'assez de chauffeurs dans une ville pour que les clients commencent à utiliser le service régulièrement.",
    application: "Identifiez le seuil critique de votre projet. Concentrez vos ressources pour l'atteindre rapidement.",
    icon: "Atom"
  },
  {
    id: "network-effects",
    name: "Effets de Réseau",
    category: "systems",
    definition: "Un produit devient plus précieux à mesure que plus de personnes l'utilisent.",
    example: "Facebook, WhatsApp, Airbnb - la valeur augmente exponentiellement avec chaque nouvel utilisateur.",
    application: "Construisez des produits où chaque utilisateur apporte de la valeur aux autres utilisateurs.",
    icon: "Network"
  },
  {
    id: "feedback-loops",
    name: "Boucles de Rétroaction",
    category: "systems",
    definition: "Les sorties d'un système deviennent ses entrées, créant des cycles d'amplification ou de stabilisation.",
    example: "Boucle positive: plus de followers → plus de visibilité → plus de followers. Boucle négative: thermostat.",
    application: "Identifiez les boucles dans votre environnement. Amplifiez les positives, corrigez les négatives.",
    icon: "RefreshCw"
  },
  {
    id: "second-order-thinking",
    name: "Pensée au Second Ordre",
    category: "systems",
    definition: "Considérer non seulement les conséquences immédiates d'une action, mais aussi les conséquences des conséquences.",
    example: "Une baisse de prix peut augmenter les ventes (1er ordre) mais aussi déclencher une guerre des prix (2e ordre).",
    application: "Pour chaque décision, demandez: 'Et ensuite?' au moins 2-3 fois.",
    icon: "GitBranch"
  },
  {
    id: "emergence",
    name: "Émergence",
    category: "systems",
    definition: "Des propriétés complexes émergent de l'interaction de composants simples, imprévisibles à partir des parties seules.",
    example: "Une colonie de fourmis présente une intelligence collective qu'aucune fourmi individuelle ne possède.",
    application: "Ne réduisez pas un système à ses parties. Observez les comportements qui émergent des interactions.",
    icon: "Sparkles"
  },

  // Stratégie
  {
    id: "competitive-moat",
    name: "Avantage Compétitif (Moat)",
    category: "strategy",
    definition: "Une barrière durable qui protège une entreprise de la concurrence, comme un fossé protège un château.",
    example: "Apple: écosystème fermé. Amazon: infrastructure logistique. Google: données et algorithmes.",
    application: "Construisez des avantages difficiles à copier: réseau, marque, coûts de changement, brevets.",
    icon: "Castle"
  },
  {
    id: "opportunity-cost",
    name: "Coût d'Opportunité",
    category: "strategy",
    definition: "Ce que vous sacrifiez en choisissant une option plutôt qu'une autre. Le vrai coût d'une décision.",
    example: "Le coût d'un MBA n'est pas seulement les frais de scolarité, mais aussi 2 ans de salaire perdu.",
    application: "Avant chaque décision, demandez: 'Que pourrais-je faire d'autre avec ce temps/argent/énergie?'",
    icon: "Scale"
  },
  {
    id: "leverage",
    name: "Effet de Levier",
    category: "strategy",
    definition: "Utiliser un petit input pour générer un grand output. Multiplier votre impact avec moins d'effort.",
    example: "Le code peut servir des millions d'utilisateurs. Un livre touche plus de gens qu'une conversation.",
    application: "Cherchez des activités à rendement croissant: créer vs consommer, automatiser vs répéter.",
    icon: "TrendingUp"
  },
  {
    id: "asymmetric-upside",
    name: "Asymétrie Risque/Récompense",
    category: "strategy",
    definition: "Des situations où le gain potentiel est beaucoup plus grand que la perte potentielle.",
    example: "Postuler à un job de rêve: pire cas = rejet (coût faible), meilleur cas = carrière transformée.",
    application: "Recherchez des paris où vous pouvez perdre peu mais gagner beaucoup.",
    icon: "ArrowUpRight"
  },
  {
    id: "local-global-maximum",
    name: "Maximum Local vs Global",
    category: "strategy",
    definition: "Une solution optimale localement peut vous empêcher d'atteindre une meilleure solution globale.",
    example: "Rester dans un bon emploi (maximum local) peut vous empêcher de trouver votre vocation (maximum global).",
    application: "Parfois, il faut accepter de régresser temporairement pour atteindre un meilleur sommet.",
    icon: "Mountain"
  },

  // Productivité
  {
    id: "pareto-principle",
    name: "Principe de Pareto (80/20)",
    category: "productivity",
    definition: "Environ 80% des résultats proviennent de 20% des efforts. Concentrez-vous sur les 20% qui comptent.",
    example: "20% de vos clients génèrent 80% de vos revenus. 20% de vos tâches créent 80% de votre valeur.",
    application: "Identifiez vos activités à fort impact et éliminez ou déléguez le reste.",
    icon: "PieChart"
  },
  {
    id: "parkinsons-law",
    name: "Loi de Parkinson",
    category: "productivity",
    definition: "Le travail s'étend pour remplir le temps disponible. Sans deadline, les projets s'éternisent.",
    example: "Une présentation prendra 2 semaines si vous avez 2 semaines, mais aussi 2 jours si vous n'avez que 2 jours.",
    application: "Fixez des deadlines agressives mais réalistes. Limitez le temps alloué aux tâches.",
    icon: "Timer"
  },
  {
    id: "eisenhower-matrix",
    name: "Matrice d'Eisenhower",
    category: "productivity",
    definition: "Classer les tâches par urgence et importance. Ce qui est urgent n'est pas toujours important.",
    example: "Important + Urgent: Crise client. Important + Non-urgent: Stratégie. Urgent + Non-important: Emails.",
    application: "Passez plus de temps sur l'important non-urgent (prévention) pour réduire les crises.",
    icon: "Grid3X3"
  },
  {
    id: "activation-energy",
    name: "Énergie d'Activation",
    category: "productivity",
    definition: "L'effort initial nécessaire pour commencer une tâche. Une fois lancé, le mouvement continue.",
    example: "Aller à la salle de sport est difficile, mais une fois sur place, l'entraînement se fait naturellement.",
    application: "Réduisez l'énergie d'activation: préparez vos affaires la veille, commencez par 2 minutes.",
    icon: "Flame"
  },
  {
    id: "compounding",
    name: "Intérêts Composés",
    category: "productivity",
    definition: "De petits gains réguliers s'accumulent exponentiellement avec le temps. La 8e merveille du monde.",
    example: "1% d'amélioration quotidienne = 37x en un an. L'apprentissage continu crée des écarts énormes.",
    application: "Investissez dans des compétences et relations qui s'accumulent avec le temps.",
    icon: "TrendingUp"
  },

  // Leadership
  {
    id: "radical-candor",
    name: "Franchise Radicale",
    category: "leadership",
    definition: "Combiner le souci sincère des personnes avec des défis directs sur leur travail.",
    example: "Dire 'Ce rapport n'est pas bon, voici pourquoi et comment l'améliorer' plutôt que d'éviter le feedback.",
    application: "Soyez direct ET bienveillant. L'honnêteté avec empathie aide les gens à progresser.",
    icon: "MessageSquare"
  },
  {
    id: "circle-of-competence",
    name: "Cercle de Compétence",
    category: "leadership",
    definition: "Connaître les limites de votre expertise. Restez dans votre domaine ou apprenez avant d'agir.",
    example: "Warren Buffett n'investit que dans des entreprises qu'il comprend profondément.",
    application: "Identifiez clairement ce que vous savez et ce que vous ne savez pas. Déléguez ou apprenez.",
    icon: "Circle"
  },
  {
    id: "hanlons-razor",
    name: "Rasoir de Hanlon",
    category: "leadership",
    definition: "N'attribuez jamais à la malveillance ce qui peut être expliqué par l'incompétence ou l'erreur.",
    example: "Un collègue qui ne répond pas aux emails est probablement débordé, pas hostile.",
    application: "Avant de présumer une mauvaise intention, considérez les explications innocentes.",
    icon: "Heart"
  },
  {
    id: "forcing-function",
    name: "Fonction de Forçage",
    category: "leadership",
    definition: "Une contrainte qui force un comportement souhaité. Un mécanisme qui rend l'action inévitable.",
    example: "Un deadline public vous force à livrer. Annoncer un objectif vous engage à l'atteindre.",
    application: "Créez des contraintes qui vous poussent naturellement vers vos objectifs.",
    icon: "Lock"
  },
  {
    id: "spillover-effects",
    name: "Effets de Débordement",
    category: "leadership",
    definition: "Les actions dans un domaine affectent d'autres domaines de manière inattendue.",
    example: "Améliorer la qualité des produits augmente la motivation des employés qui en sont fiers.",
    application: "Considérez comment vos décisions affectent d'autres parties de l'organisation.",
    icon: "Waves"
  }
];

export const MENTAL_MODEL_SLIDES = [
  {
    id: 1,
    title: "Introduction aux Modèles Mentaux",
    content: "Les modèles mentaux sont des outils de réflexion qui permettent de comprendre rapidement une situation et de prendre de meilleures décisions.",
    keyPoints: [
      "Plus de 300 modèles mentaux utilisés par les meilleurs penseurs",
      "Basé sur 'Super Thinking' de Gabriel Weinberg (fondateur de DuckDuckGo)",
      "Issus de disciplines variées: physique, économie, psychologie, stratégie",
      "Permettent de 'penser à un niveau supérieur' comme la multiplication vs l'addition"
    ],
    quote: "You've got to have models in your head. And you've got to array your experience on this latticework of models. - Charlie Munger"
  },
  {
    id: 2,
    title: "Pourquoi les Modèles Mentaux?",
    content: "Comme les mathématiques ont les formules, la pensée stratégique a les modèles mentaux.",
    keyPoints: [
      "Raccourcis vers une pensée de niveau supérieur",
      "Évitent les erreurs de raisonnement courantes",
      "Permettent de reconnaître des patterns dans des situations nouvelles",
      "Améliorent la prise de décision sous incertitude"
    ],
    quote: "The first rule is that you can't really know anything if you just remember isolated facts. - Charlie Munger"
  },
  {
    id: 3,
    title: "La Boîte à Outils du Penseur",
    content: "80 à 90 modèles mentaux importants couvrent 90% des situations de la vie quotidienne.",
    keyPoints: [
      "Modèles de décision: First Principles, Inversion, MVP",
      "Modèles de systèmes: Feedback Loops, Network Effects, Emergence",
      "Modèles stratégiques: Moats, Opportunity Cost, Leverage",
      "Modèles cognitifs: Biais de confirmation, Overfitting, Antifragile"
    ],
    quote: "If all you have is a hammer, everything looks like a nail."
  }
];
