export interface PlatformSlide {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  keyPoints?: string[];
  examples?: string[];
  framework?: string;
  quote?: { text: string; author: string };
  icon?: string;
  color?: string;
}

export const platformStrategySlidesData: PlatformSlide[] = [
  // SECTION 1: Introduction aux Plateformes (1-10)
  {
    id: 1,
    title: "Bienvenue dans la Révolution des Plateformes",
    subtitle: "Comment les marchés en réseau transforment l'économie",
    content: [
      "Les plateformes représentent le modèle d'affaires le plus disruptif du 21ème siècle",
      "En 2024, 7 des 10 entreprises les plus valorisées au monde sont des plateformes",
      "Uber, Airbnb, Amazon, Google - aucun actif traditionnel, des milliards de valorisation"
    ],
    keyPoints: [
      "Airbnb : +500,000 propriétés dans 119 pays sans posséder un seul hôtel",
      "Uber : $50+ milliards de valorisation sans posséder un seul véhicule",
      "Alibaba : milliards de produits sans aucun inventaire propre"
    ],
    icon: "🌐",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Qu'est-ce qu'une Plateforme ?",
    subtitle: "Définition et caractéristiques fondamentales",
    content: [
      "Une plateforme est un modèle d'affaires qui utilise la technologie pour connecter des personnes, organisations et ressources dans un écosystème interactif",
      "Elle crée de la valeur en facilitant les échanges entre producteurs et consommateurs",
      "La plateforme ne possède pas les moyens de production mais orchestre les interactions"
    ],
    framework: "Pipeline vs Plateforme : Le modèle linéaire (input → transformation → output) vs le modèle en réseau (facilitation des interactions multi-faces)",
    keyPoints: [
      "Valeur créée par les participants, pas seulement par l'entreprise",
      "Effets de réseau comme moteur de croissance",
      "Scalabilité quasi-infinie avec des coûts marginaux faibles"
    ],
    icon: "🔄",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    title: "Les Deux Types de Plateformes",
    subtitle: "Innovation vs Transaction",
    content: [
      "Plateformes de Transaction : facilitent les échanges commerciaux (Uber, Airbnb, eBay)",
      "Plateformes d'Innovation : permettent le développement de produits complémentaires (iOS, Android, Windows)",
      "Plateformes Hybrides : combinent les deux (Amazon, Apple)"
    ],
    examples: [
      "Transaction : Uber connecte chauffeurs et passagers",
      "Innovation : iOS permet aux développeurs de créer des apps",
      "Hybride : Amazon vend ses produits ET héberge une marketplace"
    ],
    icon: "⚡",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 4,
    title: "L'Architecture d'une Plateforme",
    subtitle: "Les composants essentiels",
    content: [
      "Core : l'infrastructure technique et les règles de base",
      "Interfaces : les points de connexion avec les participants (APIs, applications)",
      "Données : le carburant de la plateforme pour améliorer les interactions"
    ],
    framework: "Architecture modulaire : Noyau stable + Périphérie flexible permettant l'innovation par les tiers",
    keyPoints: [
      "APIs ouvertes pour l'extensibilité",
      "Gouvernance des données et de la qualité",
      "Balance entre contrôle et ouverture"
    ],
    icon: "🏗️",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 5,
    title: "Pipeline vs Plateforme",
    subtitle: "Le changement de paradigme",
    content: [
      "Pipeline : création de valeur linéaire, contrôle de la chaîne de valeur",
      "Plateforme : orchestration de valeur en réseau, facilitation des échanges",
      "Les plateformes peuvent créer plus de valeur avec moins de ressources propres"
    ],
    examples: [
      "Hotel Marriott (pipeline) vs Airbnb (plateforme)",
      "Encyclopedia Britannica (pipeline) vs Wikipedia (plateforme)",
      "Taxi traditionnel (pipeline) vs Uber (plateforme)"
    ],
    quote: {
      text: "Les plateformes battent les pipelines parce qu'elles peuvent croître sans limite de capacité propre",
      author: "Parker, Van Alstyne & Choudary"
    },
    icon: "🔀",
    color: "from-cyan-500 to-blue-600"
  },

  // SECTION 2: Effets de Réseau (6-15)
  {
    id: 6,
    title: "Les Effets de Réseau",
    subtitle: "Le pouvoir de la plateforme",
    content: [
      "Un effet de réseau se produit quand la valeur d'un produit augmente avec le nombre d'utilisateurs",
      "C'est le principal avantage compétitif des plateformes",
      "Plus il y a d'utilisateurs, plus la plateforme devient attractive pour de nouveaux utilisateurs"
    ],
    framework: "Loi de Metcalfe : La valeur d'un réseau est proportionnelle au carré du nombre de ses utilisateurs (n²)",
    keyPoints: [
      "Croissance exponentielle possible",
      "Effet boule de neige positif",
      "Barrière à l'entrée pour les concurrents"
    ],
    icon: "📈",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 7,
    title: "Types d'Effets de Réseau",
    subtitle: "Same-side vs Cross-side",
    content: [
      "Same-side (même côté) : la valeur augmente avec plus d'utilisateurs du même type",
      "Cross-side (croisés) : la valeur pour un groupe augmente avec plus d'utilisateurs de l'autre groupe",
      "Les plateformes les plus puissantes exploitent les deux types"
    ],
    examples: [
      "Same-side positif : Facebook - plus d'amis = plus de valeur",
      "Cross-side positif : Uber - plus de chauffeurs = moins d'attente pour les passagers",
      "Same-side négatif : eBay - plus de vendeurs = plus de compétition"
    ],
    icon: "🔗",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 8,
    title: "Le Problème de la Poule et l'Œuf",
    subtitle: "Comment démarrer une plateforme ?",
    content: [
      "Challenge : attirer simultanément producteurs et consommateurs",
      "Sans vendeurs, pas d'acheteurs ; sans acheteurs, pas de vendeurs",
      "Le démarrage est la phase la plus critique pour une plateforme"
    ],
    keyPoints: [
      "Subventionner un côté pour attirer l'autre",
      "Commencer avec une niche géographique ou thématique",
      "Créer de la valeur standalone avant les effets de réseau"
    ],
    quote: {
      text: "BlaBlaCar a mis 7 ans pour atteindre son premier million de membres",
      author: "Frédéric Mazzella, Fondateur BlaBlaCar"
    },
    icon: "🥚",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 9,
    title: "8 Stratégies de Lancement",
    subtitle: "Résoudre le problème de démarrage",
    content: [
      "1. Follow-the-Rabbit : commencer comme pipeline puis évoluer en plateforme",
      "2. Piggyback : exploiter la base d'utilisateurs d'une autre plateforme",
      "3. Seeding : créer du contenu/offre initial pour attirer le premier côté",
      "4. Marquee : attirer des utilisateurs stars pour créer de l'attraction"
    ],
    keyPoints: [
      "5. Single-side : offrir de la valeur à un seul côté d'abord",
      "6. Producer Evangelism : convertir des producteurs existants",
      "7. Big Bang : lancement massif avec marketing intensif",
      "8. Micro-market : dominer un petit marché avant d'étendre"
    ],
    icon: "🚀",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 10,
    title: "La Masse Critique",
    subtitle: "Le point de basculement",
    content: [
      "Masse critique : nombre minimum d'utilisateurs pour que les effets de réseau deviennent auto-entretenus",
      "Avant ce seuil : croissance difficile, investissements lourds",
      "Après ce seuil : croissance virale, effets de réseau positifs"
    ],
    framework: "Courbe en S : Lente adoption → Masse critique → Croissance exponentielle → Saturation",
    examples: [
      "Facebook : masse critique atteinte avec les campus universitaires",
      "Uber : ville par ville, quartier par quartier",
      "Airbnb : événements spéciaux (conférences) puis expansion"
    ],
    icon: "💫",
    color: "from-indigo-500 to-blue-600"
  },

  // SECTION 3: Monétisation (11-18)
  {
    id: 11,
    title: "Stratégies de Monétisation",
    subtitle: "Capturer la valeur créée par les effets de réseau",
    content: [
      "La monétisation des plateformes diffère radicalement des modèles traditionnels",
      "L'objectif : maximiser les interactions tout en capturant une partie de la valeur",
      "Équilibre délicat entre croissance et revenus"
    ],
    keyPoints: [
      "Commission par transaction (Uber : 20-25%)",
      "Abonnement (LinkedIn Premium)",
      "Publicité (Facebook, Google)",
      "Freemium (Spotify, Dropbox)"
    ],
    icon: "💰",
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: 12,
    title: "Le Pricing Asymétrique",
    subtitle: "Subventionner un côté pour maximiser la valeur",
    content: [
      "Principe : identifier quel côté est le plus sensible au prix",
      "Subventionner le côté qui génère le plus d'effets de réseau croisés",
      "Monétiser le côté qui bénéficie le plus de ces effets"
    ],
    examples: [
      "Google : gratuit pour utilisateurs, payant pour annonceurs",
      "Adobe PDF : gratuit pour lecteurs, payant pour créateurs",
      "PlayStation : console vendue à perte, jeux rentables"
    ],
    quote: {
      text: "Dans les marchés bi-faces, le côté subventionné n'est pas celui qui paie mais celui qui attire l'autre côté",
      author: "Jean Tirole, Prix Nobel d'Économie"
    },
    icon: "⚖️",
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: 13,
    title: "Les 4 Catégories de Monétisation",
    subtitle: "Framework de capture de valeur",
    content: [
      "1. Accès : frais pour rejoindre la plateforme (Costco membership)",
      "2. Usage : frais par transaction ou par utilisation (Uber par course)",
      "3. Enhanced access : fonctionnalités premium (LinkedIn Recruiter)",
      "4. Enhanced curation : meilleure visibilité/matching (Boost Airbnb)"
    ],
    framework: "Matrice Monétisation : [Gratuit | Freemium | Premium | Enterprise] × [Producteurs | Consommateurs]",
    icon: "📊",
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 14,
    title: "Éviter le Mispricing",
    subtitle: "Erreurs fatales de tarification",
    content: [
      "Mispricing : fixer des prix qui inhibent les effets de réseau",
      "Trop cher trop tôt : tue la croissance avant la masse critique",
      "Trop de gratuité : difficile de monétiser plus tard"
    ],
    examples: [
      "Échec : Moviepass - prix trop bas, modèle non viable",
      "Échec : Google+ - pas assez de différenciation pour justifier le switch",
      "Succès : WhatsApp - gratuit puis acquis par Facebook pour les données"
    ],
    keyPoints: [
      "Tester les prix progressivement",
      "Segmenter les utilisateurs par willingness-to-pay",
      "Préserver les effets de réseau avant tout"
    ],
    icon: "⚠️",
    color: "from-red-500 to-orange-600"
  },

  // SECTION 4: Gouvernance et Confiance (15-22)
  {
    id: 15,
    title: "La Confiance comme Moteur",
    subtitle: "Le sang dans les veines des plateformes",
    content: [
      "Sans confiance, pas d'interaction entre inconnus",
      "Les plateformes doivent créer des mécanismes de confiance digitale",
      "La confiance permet des échanges à grande échelle entre pairs"
    ],
    framework: "Triangle de la Confiance : Identité vérifiée + Historique d'évaluations + Garanties de la plateforme",
    keyPoints: [
      "88% des membres BlaBlaCar font confiance à un profil complet",
      "Les avis et évaluations créent une réputation portable",
      "La vérification d'identité réduit les risques"
    ],
    icon: "🤝",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 16,
    title: "Systèmes de Réputation",
    subtitle: "Construire la confiance à grande échelle",
    content: [
      "Les systèmes de notation transforment les inconnus en pairs de confiance",
      "La réputation devient un actif précieux pour les utilisateurs",
      "Effet vertueux : bonne réputation → plus de transactions → meilleure réputation"
    ],
    examples: [
      "Airbnb : notes détaillées sur propreté, communication, exactitude",
      "Uber : double évaluation chauffeur/passager",
      "eBay : score de feedback cumulatif sur des années"
    ],
    keyPoints: [
      "Évaluations bilatérales pour équilibrer le pouvoir",
      "Détection et suppression des faux avis",
      "Contexte des évaluations (pas juste une note)"
    ],
    icon: "⭐",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: 17,
    title: "Gouvernance des Plateformes",
    subtitle: "Règles et politiques pour la croissance saine",
    content: [
      "La gouvernance définit ce que les utilisateurs peuvent et ne peuvent pas faire",
      "Équilibre entre ouverture (croissance) et contrôle (qualité)",
      "Les règles évoluent avec la maturité de la plateforme"
    ],
    framework: "Spectre d'Ouverture : Fermé (Apple Store) → Semi-ouvert (Android) → Ouvert (Web)",
    keyPoints: [
      "Standards de qualité pour les producteurs",
      "Mécanismes de résolution des conflits",
      "Protection des données et vie privée"
    ],
    icon: "📜",
    color: "from-slate-500 to-gray-600"
  },
  {
    id: 18,
    title: "L'Openness Paradox",
    subtitle: "Ouverture vs Contrôle",
    content: [
      "Plus d'ouverture = plus d'innovation et de croissance",
      "Mais aussi plus de risques : fraude, qualité variable, abus",
      "Trouver le bon équilibre est un défi permanent"
    ],
    examples: [
      "Apple : contrôle strict = qualité mais moins d'apps",
      "Android : ouverture = plus d'apps mais fragmentation",
      "Wikipedia : ouverture totale mais mécanismes de modération"
    ],
    quote: {
      text: "L'ouverture est un spectre, pas un choix binaire",
      author: "Annabelle Gawer, Surrey Business School"
    },
    icon: "🔓",
    color: "from-purple-500 to-violet-600"
  },

  // SECTION 5: Stratégie Concurrentielle (19-26)
  {
    id: 19,
    title: "Winner-Take-All vs Winner-Take-Most",
    subtitle: "Quand un marché bascule vers un monopole ?",
    content: [
      "Certains marchés plateforme tendent vers un seul gagnant",
      "D'autres permettent la coexistence de plusieurs plateformes",
      "Comprendre la dynamique de votre marché est crucial"
    ],
    keyPoints: [
      "Facteurs Winner-Take-All : forts effets de réseau, coûts de switching élevés, homogénéité des besoins",
      "Facteurs de coexistence : multi-homing facile, différenciation possible, besoins hétérogènes"
    ],
    examples: [
      "Winner-Take-All : Google Search (90%+ de part de marché)",
      "Winner-Take-Most : réseaux sociaux (Facebook, Instagram, TikTok coexistent)",
      "Marchés fragmentés : food delivery (DoorDash, UberEats, Deliveroo)"
    ],
    icon: "🏆",
    color: "from-gold-500 to-amber-600"
  },
  {
    id: 20,
    title: "Le Multi-Homing",
    subtitle: "Quand les utilisateurs sont sur plusieurs plateformes",
    content: [
      "Multi-homing : utilisation simultanée de plusieurs plateformes concurrentes",
      "Réduit le pouvoir de chaque plateforme individuelle",
      "Les plateformes cherchent à maximiser le single-homing"
    ],
    framework: "Stratégies anti-multi-homing : Exclusivités, intégration profonde, coûts de switching, super-apps",
    examples: [
      "Chauffeurs sur Uber ET Lyft simultanément",
      "Contre-exemple : iPhone vs Android (fort single-homing)",
      "Stratégie : Amazon Prime crée de la fidélité"
    ],
    icon: "🔄",
    color: "from-cyan-500 to-teal-600"
  },
  {
    id: 21,
    title: "Disruption des Industries Traditionnelles",
    subtitle: "Comment les plateformes conquièrent les marchés",
    content: [
      "Les plateformes désintermédialisent les chaînes de valeur traditionnelles",
      "Elles créent de nouveaux marchés en libérant des ressources sous-utilisées",
      "La disruption vient souvent de la marge, pas du centre"
    ],
    examples: [
      "Hôtellerie : Airbnb libère les chambres inutilisées",
      "Transport : Uber libère les voitures particulières",
      "Retail : Amazon marketplace libère les petits vendeurs"
    ],
    keyPoints: [
      "Identifier les inefficiences du marché actuel",
      "Proposer une expérience utilisateur supérieure",
      "Utiliser les données pour optimiser en continu"
    ],
    icon: "💥",
    color: "from-red-500 to-rose-600"
  },
  {
    id: 22,
    title: "Répondre à la Disruption",
    subtitle: "Build, Buy, or Belong",
    content: [
      "Les entreprises traditionnelles ont 3 options face aux plateformes",
      "Build : construire sa propre plateforme (risqué mais contrôle total)",
      "Buy : acquérir une plateforme existante (rapide mais coûteux)",
      "Belong : rejoindre une plateforme existante (facile mais dépendance)"
    ],
    examples: [
      "Build : Walmart lance sa marketplace",
      "Buy : Facebook achète Instagram et WhatsApp",
      "Belong : Petits hôtels sur Booking.com"
    ],
    keyPoints: [
      "Évaluer ses ressources et compétences",
      "Analyser la maturité du marché",
      "Considérer les hybrides (pipeline + plateforme)"
    ],
    icon: "🛠️",
    color: "from-indigo-500 to-purple-600"
  },

  // SECTION 6: Métriques et Performance (23-28)
  {
    id: 23,
    title: "Métriques des Plateformes",
    subtitle: "Mesurer ce qui compte vraiment",
    content: [
      "Les métriques traditionnelles ne suffisent pas pour les plateformes",
      "Focus sur les interactions, pas seulement les utilisateurs",
      "Qualité des matches aussi importante que la quantité"
    ],
    framework: "Framework de Métriques : Liquidity × Match Quality × Trust × Repeat",
    keyPoints: [
      "Liquidity : densité offre/demande",
      "Match Quality : pertinence des connexions",
      "Trust : niveau de confiance moyen",
      "Repeat : taux de réutilisation"
    ],
    icon: "📏",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 24,
    title: "Le Cycle de Vie des Plateformes",
    subtitle: "Startup → Scale-up → Leadership → Renouvellement",
    content: [
      "Phase 1 - Startup : résoudre le problème poule/œuf, atteindre la masse critique",
      "Phase 2 - Scale-up : accélérer la croissance, optimiser les effets de réseau",
      "Phase 3 - Leadership : défendre la position, maximiser la monétisation",
      "Phase 4 - Renouvellement : innover pour éviter la disruption"
    ],
    keyPoints: [
      "Chaque phase nécessite des compétences différentes",
      "Les métriques prioritaires changent selon la phase",
      "Risque de stagnation entre chaque phase"
    ],
    icon: "🔄",
    color: "from-emerald-500 to-green-600"
  },
  {
    id: 25,
    title: "Liquidity : La Métrique Clé",
    subtitle: "La densité du marché",
    content: [
      "Liquidity = probabilité qu'une intention se transforme en transaction réussie",
      "Une plateforme illiquide frustre les utilisateurs des deux côtés",
      "La liquidité précède les effets de réseau"
    ],
    examples: [
      "Uber : temps d'attente < 5 min = bonne liquidité",
      "Airbnb : disponibilité dans la zone et dates souhaitées",
      "LinkedIn : taux de réponse aux InMails"
    ],
    framework: "Liquidité = Listings × Conversion Rate × Repeat Rate",
    icon: "💧",
    color: "from-blue-400 to-blue-600"
  },

  // SECTION 7: Régulation et Éthique (26-30)
  {
    id: 26,
    title: "Enjeux Réglementaires",
    subtitle: "Les plateformes face aux régulateurs",
    content: [
      "Les plateformes opèrent souvent dans des zones grises juridiques",
      "Questions : statut des travailleurs, responsabilité, fiscalité, concurrence",
      "La régulation rattrape progressivement l'innovation"
    ],
    keyPoints: [
      "GDPR en Europe : protection des données",
      "Digital Markets Act : régulation des gatekeepers",
      "Classification des travailleurs (gig economy)",
      "Responsabilité du contenu (Section 230 aux USA)"
    ],
    quote: {
      text: "Mieux vaut s'autoréguler que d'attendre que les régulateurs vous rattrapent",
      author: "Cusumano, Gawer & Yoffie"
    },
    icon: "⚖️",
    color: "from-slate-500 to-gray-600"
  },
  {
    id: 27,
    title: "Le Pouvoir des Plateformes",
    subtitle: "Double tranchant : opportunités et abus",
    content: [
      "Les plateformes dominantes ont un pouvoir considérable sur leur écosystème",
      "Ce pouvoir peut être utilisé pour l'innovation ou pour l'abus",
      "La responsabilité des plateformes est un débat majeur"
    ],
    examples: [
      "Apple : commission de 30% sur l'App Store",
      "Amazon : data des vendeurs utilisée pour ses propres produits",
      "Google : favoriser ses propres services dans la recherche"
    ],
    keyPoints: [
      "Transparence des algorithmes",
      "Équité dans le traitement des participants",
      "Protection contre les décisions arbitraires"
    ],
    icon: "💪",
    color: "from-red-500 to-orange-600"
  },
  {
    id: 28,
    title: "Plateformes et Travail",
    subtitle: "La Gig Economy en question",
    content: [
      "Les plateformes ont créé de nouvelles formes de travail flexible",
      "Mais aussi de la précarité et un manque de protection sociale",
      "Débat : indépendants ou salariés ?"
    ],
    framework: "Spectre du travail : Salarié classique → Travailleur de plateforme → Indépendant → Entrepreneur",
    keyPoints: [
      "Flexibilité vs Sécurité",
      "Algorithmic management",
      "Évolution vers des statuts hybrides"
    ],
    icon: "👷",
    color: "from-amber-500 to-yellow-600"
  },

  // SECTION 8: Cas Pratiques (29-35)
  {
    id: 29,
    title: "Cas BlaBlaCar",
    subtitle: "Libérer le potentiel du covoiturage",
    content: [
      "BlaBlaCar : plus grande communauté de covoiturage au monde (60M+ membres)",
      "Philosophie 'Be the Member' : utiliser son propre service",
      "Clés du succès : confiance, liquidité, pertinence du matching"
    ],
    keyPoints: [
      "7 ans pour atteindre le premier million de membres",
      "Taux d'occupation passé de 1,6 à 2,8 personnes/voiture",
      "87% des membres ont des expériences enrichissantes"
    ],
    quote: {
      text: "La confiance est le sang dans les veines des plateformes",
      author: "Frédéric Mazzella, BlaBlaCar"
    },
    icon: "🚗",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 30,
    title: "Cas Amazon",
    subtitle: "Du e-commerce à la super-plateforme",
    content: [
      "Amazon combine modèle pipeline (retail propre) et plateforme (marketplace)",
      "Évolution continue : AWS, Prime, Alexa ecosystem",
      "Les vendeurs tiers représentent 50%+ des ventes"
    ],
    keyPoints: [
      "Flywheel effect : plus de vendeurs → plus de choix → plus de clients → plus de vendeurs",
      "AWS : infrastructure as a platform",
      "Prime : création de lock-in par les services"
    ],
    icon: "📦",
    color: "from-orange-500 to-amber-600"
  },
  {
    id: 31,
    title: "Cas Apple",
    subtitle: "L'écosystème le plus profitable",
    content: [
      "Apple : master du modèle hybride hardware + plateforme",
      "App Store : 2M+ apps, $85B+ reversés aux développeurs",
      "Contrôle strict mais qualité garantie"
    ],
    framework: "Walled Garden : Écosystème fermé mais intégration parfaite entre appareils et services",
    keyPoints: [
      "Commission de 15-30% controversée",
      "Curated marketplace vs open marketplace",
      "Services : revenus croissants et récurrents"
    ],
    icon: "🍎",
    color: "from-gray-500 to-slate-600"
  },
  {
    id: 32,
    title: "Plateformes B2B",
    subtitle: "La révolution silencieuse",
    content: [
      "Les plateformes B2B représentent un marché énorme mais sous-estimé",
      "Alibaba B2B, SAP Ariba, Salesforce AppExchange",
      "Même logique d'effets de réseau, contexte différent"
    ],
    examples: [
      "Alibaba.com : connecte fabricants et acheteurs professionnels",
      "Salesforce : écosystème de 5000+ apps",
      "Stripe : plateforme de paiement pour plateformes"
    ],
    keyPoints: [
      "Cycles de vente plus longs",
      "Intégration technique plus complexe",
      "Valeur par transaction plus élevée"
    ],
    icon: "🏢",
    color: "from-indigo-500 to-blue-600"
  },

  // SECTION 9: Design et Lancement (33-38)
  {
    id: 33,
    title: "Design de Plateforme",
    subtitle: "Les 4 étapes fondamentales",
    content: [
      "1. Choisir les côtés du marché (qui seront les producteurs et consommateurs ?)",
      "2. Résoudre le problème poule/œuf (stratégie de lancement)",
      "3. Designer le business model (comment capturer la valeur ?)",
      "4. Établir les règles de gouvernance (contrôle vs ouverture)"
    ],
    framework: "Canvas de Plateforme : Participants × Unité de Valeur × Filtre × Interaction Clé × Monétisation",
    icon: "✏️",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 34,
    title: "L'Unité de Valeur",
    subtitle: "Le cœur de chaque interaction",
    content: [
      "L'unité de valeur est ce qui est échangé sur la plateforme",
      "Elle doit être clairement définie et mesurable",
      "La qualité de l'unité de valeur détermine la qualité des interactions"
    ],
    examples: [
      "Airbnb : une nuit dans un logement",
      "Uber : un trajet d'un point A à un point B",
      "YouTube : une vidéo",
      "LinkedIn : un profil professionnel"
    ],
    keyPoints: [
      "Standardisation pour faciliter la comparaison",
      "Filtres pour garantir la qualité",
      "Évolution possible de l'unité de valeur"
    ],
    icon: "💎",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 35,
    title: "Les Erreurs Fatales",
    subtitle: "4 pièges à éviter",
    content: [
      "1. Mispricing : prix mal calibrés qui tuent les effets de réseau",
      "2. Mistrust : manque de mécanismes de confiance",
      "3. Mistiming : trop tôt ou trop tard sur le marché",
      "4. Hubris : sous-estimer la concurrence"
    ],
    examples: [
      "Mispricing : MoviePass - modèle non viable",
      "Mistrust : premiers sites de rencontre sans vérification",
      "Mistiming : Google+ arrivé trop tard vs Facebook",
      "Hubris : Nokia et Blackberry vs iPhone"
    ],
    icon: "🚫",
    color: "from-red-500 to-rose-600"
  },

  // SECTION 10: Futur des Plateformes (36-40)
  {
    id: 36,
    title: "Tendances Émergentes",
    subtitle: "L'avenir des plateformes",
    content: [
      "Plateformes décentralisées (Web3, blockchain)",
      "Super-apps : plateformes tout-en-un (WeChat, Grab)",
      "AI-powered platforms : personnalisation extrême",
      "Sustainable platforms : impact social et environnemental"
    ],
    keyPoints: [
      "Décentralisation vs centralisation",
      "Interopérabilité entre plateformes",
      "Régulation croissante des big tech",
      "Nouvelles industries à platformiser"
    ],
    icon: "🔮",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 37,
    title: "Plateformes et IA",
    subtitle: "L'intelligence artificielle comme catalyseur",
    content: [
      "L'IA améliore chaque aspect des plateformes",
      "Matching plus précis, détection de fraude, personnalisation",
      "Nouvelles plateformes basées sur l'IA générative"
    ],
    examples: [
      "Netflix : recommandations IA = 80% du temps de visionnage",
      "Uber : pricing dynamique par algorithme",
      "ChatGPT : plateforme d'applications IA (GPT Store)"
    ],
    framework: "AI augmente : Discovery → Matching → Transaction → Trust → Feedback loop",
    icon: "🤖",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 38,
    title: "Web3 et Plateformes Décentralisées",
    subtitle: "La promesse de la désintermédiation totale",
    content: [
      "Web3 promet des plateformes sans intermédiaire central",
      "Blockchain pour la confiance, tokens pour les incitations",
      "Challenges : scalabilité, UX, adoption"
    ],
    keyPoints: [
      "DAOs : gouvernance décentralisée",
      "NFTs : propriété digitale vérifiable",
      "DeFi : finance sans banques",
      "Creator economy : revenus directs pour les créateurs"
    ],
    icon: "🌐",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 39,
    title: "Construire Votre Plateforme",
    subtitle: "Checklist de lancement",
    content: [
      "✓ Identifier un marché avec friction ou inefficience",
      "✓ Définir clairement les deux côtés et l'unité de valeur",
      "✓ Choisir une stratégie de lancement adaptée",
      "✓ Designer des mécanismes de confiance dès le début"
    ],
    keyPoints: [
      "✓ Commencer petit (micro-market)",
      "✓ Mesurer la liquidity avant tout",
      "✓ Itérer rapidement sur le feedback",
      "✓ Penser à la monétisation mais ne pas la prioriser"
    ],
    icon: "✅",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 40,
    title: "Conclusion : La Révolution Continue",
    subtitle: "Ce que nous avons appris",
    content: [
      "Les plateformes ont transformé l'économie mondiale en 20 ans",
      "Les effets de réseau sont leur avantage compétitif principal",
      "La confiance et la gouvernance sont essentielles au succès",
      "La révolution ne fait que commencer - de nouvelles industries seront platformisées"
    ],
    quote: {
      text: "Les plateformes gagnent car elles peuvent croître sans limite de capacité propre, en orchestrant la création de valeur par leur écosystème",
      author: "Platform Revolution"
    },
    keyPoints: [
      "Pensez écosystème, pas produit",
      "Facilitez les interactions, ne les contrôlez pas",
      "Construisez pour le long terme"
    ],
    icon: "🎯",
    color: "from-primary to-purple-600"
  }
];
