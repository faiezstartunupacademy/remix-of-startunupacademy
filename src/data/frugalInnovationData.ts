export interface FrugalSlide {
  id: number;
  module: string;
  title: string;
  content: string[];
  icon?: string;
  color?: string;
  keyTakeaway?: string;
  caseStudy?: {
    name: string;
    description: string;
    lesson: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}

export const frugalInnovationSlidesData: FrugalSlide[] = [
  // Module 1: Introduction
  {
    id: 1,
    module: "Introduction",
    title: "L'Économie Frugale: Faire Mieux avec Moins",
    content: [
      "L'économie frugale vise à créer plus de valeur économique, sociale et écologique simultanément",
      "Basée sur les travaux de Navi Radjou, co-auteur de 'Jugaad Innovation'",
      "Contrairement au 'faire plus avec plus' capitaliste, elle cherche à 'faire mieux avec moins'",
      "Répond aux besoins des consommateurs conscients cherchant simplicité et durabilité"
    ],
    icon: "🌍",
    color: "from-emerald-500 to-teal-600",
    keyTakeaway: "L'économie frugale réconcilie prospérité économique et responsabilité écologique"
  },
  {
    id: 2,
    module: "Introduction",
    title: "Respecter et Dépasser les Limites",
    content: [
      "6 des 9 limites planétaires ont déjà été franchies",
      "Paradoxe: nous sommes câblés pour faire PLUS, pas moins",
      "Solution: respecter les limites planétaires tout en dépassant nos limites humaines",
      "Élargir notre conscience pour devenir de meilleurs humains dans les limites écologiques"
    ],
    icon: "🔮",
    color: "from-violet-500 to-purple-600",
    quote: {
      text: "La voie vers la richesse est aussi claire que la voie vers le marché. Elle repose sur deux mots: industrie et frugalité.",
      author: "Benjamin Franklin"
    }
  },
  {
    id: 3,
    module: "Introduction",
    title: "Le Modèle de Croissance Actuel Ne Fonctionne Pas",
    content: [
      "Earth Overshoot Day: 2 août 2023 (vs 12 septembre 2003)",
      "56% des adultes américains ne peuvent couvrir une dépense d'urgence de 1000$",
      "100 millions d'Européens risquent la pauvreté (22% de la population)",
      "Les femmes entrepreneurs sont 63% moins susceptibles d'obtenir du VC"
    ],
    icon: "📉",
    color: "from-red-500 to-rose-600",
    keyTakeaway: "Le modèle actuel exclut les gens et épuise les ressources"
  },
  {
    id: 4,
    module: "Introduction",
    title: "Du Découplage au Recouplage",
    content: [
      "DÉCOUPLAGE: produire plus tout en polluant moins (économie verte)",
      "Problème: ne change pas fondamentalement les modèles économiques",
      "RECOUPLAGE: réintégrer les activités économiques avec les communautés et la planète",
      "Objectif: développement régénératif qui booste le développement humain"
    ],
    icon: "🔄",
    color: "from-blue-500 to-indigo-600",
    keyTakeaway: "Plutôt que dématerialiser l'économie, il faut la rematerialiser pour les citoyens"
  },
  {
    id: 5,
    module: "Introduction",
    title: "Les 3 Mégatendances de l'Économie Frugale",
    content: [
      "1. PARTAGE B2B: Les entreprises concurrentes apprennent à coopérer et partager",
      "2. FABRICATION DISTRIBUÉE: Production locale proche des clients",
      "3. TRIPLE RÉGÉNÉRATION: Régénérer les personnes, les lieux et la planète",
      "Ces tendances transforment déjà l'économie mondiale"
    ],
    icon: "🚀",
    color: "from-amber-500 to-orange-600"
  },

  // Module 2: B2B Sharing
  {
    id: 6,
    module: "Partage B2B",
    title: "La Révolution du Partage B2B",
    content: [
      "Le partage B2B pourrait éclipser l'économie de partage C2C (Uber, Airbnb)",
      "En 2015, 18% des adultes US participaient à l'économie de partage C2C",
      "Projection: de 15B$ (2013) à 335B$ (2025) pour le C2C",
      "Le B2B représente un potentiel encore plus grand mais sous-exploité"
    ],
    icon: "🤝",
    color: "from-blue-500 to-cyan-600",
    keyTakeaway: "Les entreprises ont plus de ressources à partager que les particuliers"
  },
  {
    id: 7,
    module: "Partage B2B",
    title: "Les 6 Niveaux de Partage B2B",
    content: [
      "Niveau 1: Partage des déchets et ressources inutilisées",
      "Niveau 2: Partage des actifs physiques (équipements, locaux)",
      "Niveau 3: Partage du pouvoir d'achat (groupements d'achats)",
      "Niveau 4: Partage des employés (talents partagés)",
      "Niveau 5: Partage des clients (références croisées)",
      "Niveau 6: Partage de la propriété intellectuelle et des connaissances"
    ],
    icon: "📊",
    color: "from-indigo-500 to-violet-600"
  },
  {
    id: 8,
    module: "Partage B2B",
    title: "Niveau 1: Partage des Déchets",
    content: [
      "Les déchets d'une entreprise sont les ressources d'une autre",
      "Symbiose industrielle: les parcs éco-industriels connectent les flux de matières",
      "Exemple: Kalundborg (Danemark) - 30 flux de ressources partagées entre entreprises",
      "Réduction des coûts + impact environnemental positif"
    ],
    icon: "♻️",
    color: "from-green-500 to-emerald-600",
    caseStudy: {
      name: "Kalundborg Symbiosis",
      description: "Premier exemple de symbiose industrielle où les déchets d'une usine deviennent les matières premières d'une autre",
      lesson: "La coopération entre concurrents peut créer de la valeur pour tous"
    }
  },
  {
    id: 9,
    module: "Partage B2B",
    title: "Du Partage Intelligent au Partage Sage",
    content: [
      "Valeur vs Valeurs: ne pas seulement créer de la valeur économique",
      "Partage sage: aligner le partage avec les ODD (Objectifs de Développement Durable)",
      "Atteindre les ODD plus vite, mieux et moins cher grâce au partage",
      "Les entreprises leaders maîtrisent tout le spectre du partage B2B"
    ],
    icon: "🧠",
    color: "from-purple-500 to-violet-600",
    keyTakeaway: "Le partage B2B peut accélérer l'atteinte des objectifs de durabilité"
  },

  // Module 3: Fabrication Distribuée
  {
    id: 10,
    module: "Fabrication Distribuée",
    title: "Scaling Out vs Scaling Up",
    content: [
      "SCALING UP: Centraliser la production pour les économies d'échelle",
      "SCALING OUT: Décentraliser la production près des clients",
      "COVID-19 et 9/11 ont révélé la fragilité des chaînes centralisées",
      "Les réseaux distribués sont plus résilients et adaptables"
    ],
    icon: "🏭",
    color: "from-slate-500 to-gray-600"
  },
  {
    id: 11,
    module: "Fabrication Distribuée",
    title: "Avantages de la Production Locale",
    content: [
      "✓ Réduction de l'empreinte carbone du transport",
      "✓ Création d'emplois locaux",
      "✓ Personnalisation aux besoins locaux",
      "✓ Résilience face aux perturbations mondiales",
      "✓ Rapprochement producteur-consommateur ('prosumer')"
    ],
    icon: "📍",
    color: "from-emerald-500 to-green-600",
    keyTakeaway: "La production locale maximise l'impact économique local tout en réduisant l'impact environnemental"
  },
  {
    id: 12,
    module: "Fabrication Distribuée",
    title: "Les Réseaux de Valeur Hyper-Locaux (HYLOVAN)",
    content: [
      "La chaîne de valeur traditionnelle ne fonctionne plus",
      "Elle n'engage pas les 'prosumers' (producteurs-consommateurs)",
      "Elle ne favorise pas la collaboration externe",
      "Elle est optimisée pour l'efficience, pas l'adaptabilité",
      "Elle est trop complexe pour décarboner et atteindre le net zéro"
    ],
    icon: "🔗",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 13,
    module: "Fabrication Distribuée",
    title: "Économies Vertueuses de Nouvelle Génération",
    content: [
      "🗑️ Transformer les déchets en or (économie circulaire)",
      "🌱 Guérir notre addiction aux combustibles fossiles (bioéconomie)",
      "💊 Améliorer les vies via la médecine personnalisée",
      "🌫️ Capturer et utiliser le CO2 pour créer de la valeur locale"
    ],
    icon: "✨",
    color: "from-amber-500 to-yellow-600",
    caseStudy: {
      name: "AFYREN",
      description: "Bioraffinerie située près des fournisseurs et clients, transformant les déchets agricoles en acides organiques",
      lesson: "La proximité géographique crée des synergies économiques et écologiques"
    }
  },

  // Module 4: Triple Régénération
  {
    id: 14,
    module: "Triple Régénération",
    title: "Au-delà de la Durabilité: La Régénération",
    content: [
      "DURABILITÉ: Réduire les impacts négatifs (faire moins mal)",
      "RÉGÉNÉRATION: Créer des impacts positifs (faire du bien)",
      "Les entreprises régénératives augmentent leur empreinte sociale et écologique positive",
      "Objectif: revitaliser les personnes, les lieux et la planète simultanément"
    ],
    icon: "🌳",
    color: "from-green-500 to-emerald-600",
    keyTakeaway: "La régénération va au-delà de la durabilité en créant activement de la valeur positive"
  },
  {
    id: 15,
    module: "Triple Régénération",
    title: "Régénérer les Personnes",
    content: [
      "Humaniser la régénération en la centrant sur les individus",
      "Meiji Yasuda (Japon): booste votre vitalité plutôt que d'assurer contre la mortalité",
      "Programmes de bien-être qui augmentent la santé, pas seulement réduisent les maladies",
      "Investir dans le développement humain comme moteur économique"
    ],
    icon: "👤",
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 16,
    module: "Triple Régénération",
    title: "Régénérer les Lieux",
    content: [
      "Ancrer la régénération dans les territoires spécifiques",
      "Revitaliser l'esprit des villes et régions en déclin",
      "Développement régénératif: élargir la conscience et agir consciemment",
      "Les entreprises peuvent être catalyseurs de renaissance territoriale"
    ],
    icon: "🏘️",
    color: "from-blue-500 to-indigo-600",
    caseStudy: {
      name: "Eileen Fisher",
      description: "Mode durable qui mène la triple régénération: recyclage des vêtements, soutien aux communautés, transparence supply chain",
      lesson: "La mode peut régénérer les personnes, les lieux et la planète"
    }
  },
  {
    id: 17,
    module: "Triple Régénération",
    title: "Régénérer la Planète",
    content: [
      "De l'extraction à la régénération des écosystèmes",
      "Agriculture régénérative: sols plus riches, biodiversité accrue",
      "Séquestration du carbone par des pratiques naturelles",
      "Économie circulaire: zéro déchet, ressources en boucle fermée"
    ],
    icon: "🌍",
    color: "from-teal-500 to-cyan-600",
    keyTakeaway: "Les entreprises peuvent devenir des agents de régénération écologique"
  },
  {
    id: 18,
    module: "Triple Régénération",
    title: "Booster la Vitalité et la Longévité des Entreprises",
    content: [
      "La triple régénération augmente la résilience organisationnelle",
      "Employés engagés, communautés fidèles, écosystèmes sains",
      "Les entreprises régénératives attirent les meilleurs talents",
      "Avantage compétitif durable basé sur des relations profondes"
    ],
    icon: "💪",
    color: "from-violet-500 to-purple-600"
  },

  // Module 5: Innovation Frugale en Pratique
  {
    id: 19,
    module: "Pratique",
    title: "Les Principes du Jugaad",
    content: [
      "JUGAAD: ingéniosité frugale originaire d'Inde",
      "1. Chercher les opportunités dans l'adversité",
      "2. Faire plus avec moins",
      "3. Penser et agir de manière flexible",
      "4. Rester simple",
      "5. Inclure les exclus",
      "6. Suivre son cœur"
    ],
    icon: "💡",
    color: "from-orange-500 to-amber-600",
    quote: {
      text: "Quand on met une limitation sur les ressources, on enlève la limitation sur la créativité.",
      author: "Navi Radjou"
    }
  },
  {
    id: 20,
    module: "Pratique",
    title: "Innovation Frugale vs Innovation Traditionnelle",
    content: [
      "TRADITIONNELLE: Plus de R&D → Plus de fonctionnalités → Prix élevé",
      "FRUGALE: Contraintes → Créativité → Accessibilité",
      "Moins de ressources peut générer plus d'innovation",
      "L'objectif: valeur maximale au coût minimal"
    ],
    icon: "⚖️",
    color: "from-indigo-500 to-blue-600",
    keyTakeaway: "L'innovation frugale démocratise l'accès à des solutions de qualité"
  },
  {
    id: 21,
    module: "Pratique",
    title: "Cas: Soins de Santé Frugaux",
    content: [
      "Aravind Eye Care (Inde): chirurgies de la cataracte à 30$ (vs 3000$ aux USA)",
      "Même qualité, 1% du coût grâce à l'optimisation des processus",
      "Narayana Health: chirurgies cardiaques de qualité mondiale à prix accessibles",
      "Modèle: hauts volumes, efficience opérationnelle, tarification différenciée"
    ],
    icon: "🏥",
    color: "from-red-500 to-rose-600",
    caseStudy: {
      name: "Aravind Eye Care System",
      description: "Réseau d'hôpitaux offrant des chirurgies oculaires gratuites ou à bas prix tout en étant rentable",
      lesson: "L'excellence médicale peut être accessible à tous grâce à l'innovation frugale"
    }
  },
  {
    id: 22,
    module: "Pratique",
    title: "L'Amérique Frugale",
    content: [
      "Les USA peuvent mener par l'exemple malgré leur culture de consommation",
      "Pionnier en soins de santé frugaux (Kaiser Permanente)",
      "Entrepreneuriat grassroots qui autonomise les femmes",
      "3,143 économies locales (counties) peuvent devenir frugales"
    ],
    icon: "🇺🇸",
    color: "from-blue-500 to-red-500"
  },
  {
    id: 23,
    module: "Pratique",
    title: "Construire des Économies Locales Frugales",
    content: [
      "1. Partage B2B: Remplacer la compétition par la coopération",
      "2. Fabrication distribuée: Libérer les opportunités hyper-locales",
      "3. Triple régénération: Revitaliser l'âme des territoires",
      "Chaque région peut adapter ces principes à son contexte"
    ],
    icon: "🏗️",
    color: "from-emerald-500 to-teal-600"
  },

  // Module 6: Conclusion
  {
    id: 24,
    module: "Conclusion",
    title: "L'Essor des Frugal Natives",
    content: [
      "Nouvelle génération de consommateurs et entrepreneurs frugaux",
      "Ils cherchent simplicité, durabilité et sens communautaire",
      "Ils rejettent la surconsommation au profit de l'essentiel",
      "Ils préfèrent l'accès à la propriété"
    ],
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    keyTakeaway: "Les Frugal Natives transforment le marché par leurs choix de consommation"
  },
  {
    id: 25,
    module: "Conclusion",
    title: "Les 7 Vertus vs Les 7 Péchés",
    content: [
      "La frugalité comme pratique spirituelle et économique",
      "Remplacer la luxure par la chasteté (consommation modérée)",
      "Remplacer la gloutonnerie par la tempérance",
      "Remplacer l'avarice par la charité (partage)",
      "Remplacer l'orgueil par l'humilité"
    ],
    icon: "⚖️",
    color: "from-violet-500 to-purple-600",
    quote: {
      text: "Rien ne se perd, rien ne se crée, tout se transforme.",
      author: "Antoine Lavoisier"
    }
  },
  {
    id: 26,
    module: "Conclusion",
    title: "Vers une Société Consciente",
    content: [
      "L'économie frugale mène vers une société plus consciente",
      "Équilibrer activités économiques avec développement humain",
      "Harmoniser l'harmonie sociale et écologique",
      "Élargir la conscience collective pour un impact systémique"
    ],
    icon: "🧘",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 27,
    module: "Conclusion",
    title: "Votre Rôle dans l'Économie Frugale",
    content: [
      "🏢 ENTREPRISES: Adoptez les 6 niveaux de partage B2B",
      "🏭 PRODUCTEURS: Localisez et distribuez votre fabrication",
      "🌍 TOUS: Engagez-vous dans la triple régénération",
      "👤 INDIVIDUS: Devenez un 'frugal native' conscient",
      "🤝 COMMUNAUTÉS: Construisez des réseaux de valeur hyper-locaux"
    ],
    icon: "🌟",
    color: "from-amber-500 to-orange-600",
    keyTakeaway: "Chacun peut contribuer à construire un monde meilleur avec moins"
  }
];

export const frugalModules = [
  { name: "Introduction", icon: "🌍", slides: 5 },
  { name: "Partage B2B", icon: "🤝", slides: 4 },
  { name: "Fabrication Distribuée", icon: "🏭", slides: 4 },
  { name: "Triple Régénération", icon: "🌳", slides: 5 },
  { name: "Pratique", icon: "💡", slides: 5 },
  { name: "Conclusion", icon: "🌟", slides: 4 }
];
