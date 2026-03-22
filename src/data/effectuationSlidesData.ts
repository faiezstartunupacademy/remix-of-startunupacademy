export interface EffectuationSlide {
  id: number;
  module: string;
  title: string;
  content: string[];
  icon?: string;
  color?: string;
  image?: string;
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

export const effectuationSlidesData: EffectuationSlide[] = [
  // Module 1: Introduction
  {
    id: 1,
    module: "Introduction",
    title: "Qu'est-ce que l'Effectuation?",
    content: [
      "L'effectuation est une logique d'expertise entrepreneuriale découverte par Saras Sarasvathy",
      "Basée sur l'étude de 27 entrepreneurs experts ayant créé des entreprises de plus de 200M$",
      "Une science de l'entrepreneuriat: un ensemble de principes observés chez les entrepreneurs à succès",
      "Travailler avec ce que vous contrôlez pour co-créer de nouveaux futurs avec des partenaires"
    ],
    icon: "🎯",
    color: "from-blue-500 to-indigo-600",
    keyTakeaway: "L'entrepreneuriat n'est pas un acte héroïque risqué mais une démarche pragmatique et contrôlée"
  },
  {
    id: 2,
    module: "Introduction",
    title: "Saras Sarasvathy: La Pionnière",
    content: [
      "Professeure à la Darden School of Business, University of Virginia",
      "A étudié 27 entrepreneurs ayant créé des entreprises d'au moins 200M$ à 6,5B$",
      "Sa recherche révèle que les entrepreneurs experts pensent différemment des managers",
      "L'effectuation inverse la logique traditionnelle: partir des moyens, pas des objectifs"
    ],
    icon: "👩‍🔬",
    color: "from-purple-500 to-violet-600",
    quote: {
      text: "Expert entrepreneurs don't think about the future, they create it.",
      author: "Saras Sarasvathy"
    }
  },
  {
    id: 3,
    module: "Introduction",
    title: "Les 4 Principes Fondamentaux",
    content: [
      "🐦 Bird-in-Hand: Commencez avec vos moyens disponibles",
      "💸 Affordable Loss: Évaluez ce que vous pouvez vous permettre de perdre",
      "🧩 Crazy Quilt: Formez des partenariats avec ceux qui veulent co-créer",
      "🍋 Lemonade: Transformez les surprises en opportunités"
    ],
    icon: "🔑",
    color: "from-emerald-500 to-teal-600",
    keyTakeaway: "Ces principes inversent la logique traditionnelle des organisations matures"
  },
  {
    id: 4,
    module: "Introduction",
    title: "Causation vs Effectuation",
    content: [
      "CAUSATION (Logique managériale):",
      "• Partir d'un objectif précis → Accumuler les moyens nécessaires",
      "• Basée sur la prédiction et le contrôle du futur",
      "EFFECTUATION (Logique entrepreneuriale):",
      "• Partir des moyens disponibles → Imaginer les fins possibles",
      "• Basée sur le contrôle et la co-création du futur"
    ],
    icon: "⚖️",
    color: "from-purple-500 to-violet-600",
    keyTakeaway: "L'effectuation est guidée par les moyens, la causation par les objectifs"
  },
  {
    id: 5,
    module: "Introduction",
    title: "Le Pilote dans l'Avion",
    content: [
      "Principe méta de l'effectuation: le pilotage actif du futur",
      "Ne pas essayer de prédire le futur - le créer activement",
      "Le futur n'est pas quelque chose qui vous arrive, c'est quelque chose que vous façonnez",
      "Concentrez-vous sur ce que vous pouvez contrôler, pas sur ce que vous ne pouvez pas"
    ],
    icon: "✈️",
    color: "from-sky-500 to-blue-600",
    keyTakeaway: "Dans la mesure où nous pouvons contrôler le futur, nous n'avons pas besoin de le prédire"
  },

  // Module 2: Bird-in-Hand
  {
    id: 6,
    module: "Bird-in-Hand",
    title: "Principe 1: Commencez avec ce que vous avez",
    content: [
      "Ne cherchez pas l'opportunité parfaite - agissez avec ce que vous avez",
      "Les trois catégories de moyens universels:",
      "• QUI JE SUIS: traits, préférences, valeurs, passions",
      "• CE QUE JE SAIS: expertise, expérience, connaissances",
      "• QUI JE CONNAIS: réseaux sociaux, contacts, relations"
    ],
    icon: "🐦",
    color: "from-amber-500 to-orange-600",
    keyTakeaway: "Créer une entreprise n'est pas un acte héroïque - vous pouvez commencer maintenant"
  },
  {
    id: 7,
    module: "Bird-in-Hand",
    title: "Qui Je Suis: L'Avantage Concurrentiel Imbattable",
    content: [
      "Votre unicité est la source d'opportunités à haute valeur",
      "Il n'existe pas un ensemble spécifique de compétences pour réussir",
      "Les entreprises à succès reflètent souvent les bizarreries de leurs fondateurs",
      "Mark Cuban (flamboyant) et Daniel Snyder (prudent) = propriétaires de franchises NBA/NFL"
    ],
    icon: "🪞",
    color: "from-rose-500 to-pink-600",
    keyTakeaway: "Qui vous êtes peut être non seulement le point de départ mais l'ingrédient de base de votre opportunité"
  },
  {
    id: 8,
    module: "Bird-in-Hand",
    title: "Ce Que Je Sais: Apporter le Savoir au Projet",
    content: [
      "Vos connaissances croissent en chemin et façonnent votre trajectoire",
      "Steve Jobs: un cours de calligraphie → typographie Apple révolutionnaire",
      "On ne peut pas connecter les points en regardant vers l'avenir",
      "Faites confiance au fait que les points se connecteront dans votre futur"
    ],
    icon: "📚",
    color: "from-cyan-500 to-blue-600",
    caseStudy: {
      name: "Steve Jobs & Apple",
      description: "Un cours de calligraphie pris après avoir quitté l'université a fondé la typographie révolutionnaire du Mac",
      lesson: "Les connaissances 'inutiles' peuvent devenir des avantages compétitifs majeurs"
    }
  },
  {
    id: 9,
    module: "Bird-in-Hand",
    title: "Qui Je Connais: Six Degrés de Séparation",
    content: [
      "Votre réseau est une ressource sous-estimée mais puissante",
      "Classmates, alumni, rencontres fortuites, inconnus de votre vie",
      "Les partenariats amplifient vos moyens de manière exponentielle",
      "Chaque nouvelle connexion ouvre des portes insoupçonnées"
    ],
    icon: "🤝",
    color: "from-indigo-500 to-purple-600",
    keyTakeaway: "Votre réseau peut transformer une petite idée en opportunité mondiale"
  },
  {
    id: 10,
    module: "Bird-in-Hand",
    title: "Les Ressources Slack: Trouver de la Valeur Cachée",
    content: [
      "Le monde est plein de 'slack' - ressources inexploitées ou gaspillées",
      "Espace inutilisé, temps libre, déchets, failles réglementaires",
      "J.R. Simplot: a commencé en collectant des porcs destinés à l'abattoir",
      "Estée Lauder: temps mort des femmes sous les sèche-cheveux → makeovers gratuits"
    ],
    icon: "♻️",
    color: "from-green-500 to-emerald-600",
    caseStudy: {
      name: "Airbnb",
      description: "Brian Chesky et Joe Gebbia ont loué des matelas gonflables dans leur salon pour payer leur loyer",
      lesson: "Une ressource 'slack' (espace inutilisé) peut devenir une entreprise de 10 milliards $"
    }
  },
  {
    id: 11,
    module: "Bird-in-Hand",
    title: "Exercice: Cartographier Vos Moyens",
    content: [
      "1. QUI JE SUIS: Listez vos traits de personnalité, passions, valeurs",
      "2. CE QUE JE SAIS: Notez vos compétences, expériences, expertises",
      "3. QUI JE CONNAIS: Inventoriez votre réseau (famille, amis, collègues)",
      "4. Identifiez les ressources 'slack' autour de vous",
      "5. Imaginez 3 opportunités possibles avec ces moyens"
    ],
    icon: "📝",
    color: "from-teal-500 to-cyan-600",
    keyTakeaway: "L'action commence par un inventaire honnête de vos ressources actuelles"
  },

  // Module 3: Affordable Loss
  {
    id: 12,
    module: "Affordable Loss",
    title: "Principe 2: Investissez Peu, Apprenez Beaucoup",
    content: [
      "Évaluez les opportunités par le risque acceptable, pas le gain potentiel",
      "Question clé: 'Que puis-je me permettre de perdre?' plutôt que 'Combien puis-je gagner?'",
      "Préservez la capacité de revenir au port si nécessaire",
      "Les entrepreneurs experts ne parient pas tout - ils font des paris contrôlés"
    ],
    icon: "💸",
    color: "from-red-500 to-rose-600",
    keyTakeaway: "Le risque acceptable vous permet d'expérimenter sans compromettre votre avenir"
  },
  {
    id: 13,
    module: "Affordable Loss",
    title: "Calcul de la Perte Acceptable",
    content: [
      "La perte acceptable est personnelle et contextuelle",
      "Financière: combien d'argent puis-je perdre sans catastrophe?",
      "Temps: combien de mois puis-je consacrer à cette aventure?",
      "Réputation: quel impact sur ma carrière si ça échoue?",
      "Opportunité: que pourrais-je faire d'autre avec ces ressources?"
    ],
    icon: "🧮",
    color: "from-orange-500 to-amber-600",
    keyTakeaway: "Définissez votre perte acceptable avant de commencer, pas après"
  },
  {
    id: 14,
    module: "Affordable Loss",
    title: "La Perte Abordable en Pratique",
    content: [
      "Chaque partie prenante contribue selon ses propres moyens et perte acceptable",
      "Cela génère de nouveaux sous-objectifs et façonne le projet",
      "Approche itérative: petits pas dans l'incertitude plutôt que grands sauts",
      "L'échec devient une expérience d'apprentissage, pas une catastrophe"
    ],
    icon: "🎲",
    color: "from-orange-500 to-amber-600",
    keyTakeaway: "En ne risquant que ce que vous pouvez perdre, vous augmentez la probabilité de rebondir"
  },
  {
    id: 15,
    module: "Affordable Loss",
    title: "ROI vs Perte Acceptable: Deux Logiques",
    content: [
      "ROI (Return on Investment): logique managériale traditionnelle",
      "• Calculer le retour attendu avant d'investir",
      "• Nécessite des prévisions fiables (difficile en contexte incertain)",
      "Affordable Loss: logique effectuale",
      "• Combien puis-je me permettre de perdre pour apprendre?",
      "• Ne nécessite pas de prédire le futur"
    ],
    icon: "📊",
    color: "from-rose-500 to-pink-600",
    keyTakeaway: "Dans l'incertitude, la perte acceptable est plus fiable que le ROI projeté"
  },

  // Module 4: Crazy Quilt
  {
    id: 16,
    module: "Crazy Quilt",
    title: "Principe 3: Formez des Partenariats",
    content: [
      "Co-créez l'avenir avec des personnes qui veulent travailler avec vous",
      "Ne vous inquiétez pas trop des analyses concurrentielles",
      "Les partenaires apportent leurs propres moyens et façonnent les objectifs",
      "Le 'Crazy Quilt': chaque pièce unique contribue à l'ensemble"
    ],
    icon: "🧩",
    color: "from-violet-500 to-purple-600",
    keyTakeaway: "Les parties prenantes ne sont pas des fournisseurs de ressources mais des co-créateurs"
  },
  {
    id: 17,
    module: "Crazy Quilt",
    title: "Demander des Engagements",
    content: [
      "Les vrais partenaires font des engagements réels, pas des promesses vagues",
      "Chaque engagement transforme le projet et ouvre de nouvelles possibilités",
      "Self-sélection: attirez ceux qui veulent façonner les objectifs avec vous",
      "La diversité des partenaires augmente la probabilité de surprises innovantes"
    ],
    icon: "🤲",
    color: "from-teal-500 to-cyan-600",
    caseStudy: {
      name: "World Central Kitchen - José Andrés",
      description: "Le chef étoilé a créé un réseau mondial de cuisiniers pour nourrir les victimes de catastrophes",
      lesson: "Techniquement aucune infrastructure, mais une infrastructure partout grâce aux partenariats"
    }
  },
  {
    id: 18,
    module: "Crazy Quilt",
    title: "Types d'Engagements des Partenaires",
    content: [
      "💰 ARGENT: investissements, prépaiements, contributions financières",
      "⏰ TEMPS: heures de travail, mentorat, expertise gratuite",
      "🎤 RÉPUTATION: recommandations, témoignages, introductions",
      "🔧 RESSOURCES: équipements, locaux, matériaux",
      "💡 CONNAISSANCES: expertise technique, conseils stratégiques"
    ],
    icon: "📋",
    color: "from-indigo-500 to-blue-600",
    keyTakeaway: "Les engagements non-financiers sont souvent aussi précieux que l'argent"
  },
  {
    id: 19,
    module: "Crazy Quilt",
    title: "Construire le Crazy Quilt",
    content: [
      "1. Identifiez qui montre un intérêt spontané pour votre projet",
      "2. Demandez des engagements concrets, pas des opinions",
      "3. Laissez les partenaires influencer la direction du projet",
      "4. Chaque nouveau partenaire apporte de nouveaux moyens",
      "5. L'objectif évolue avec les contributions des partenaires"
    ],
    icon: "🔗",
    color: "from-purple-500 to-violet-600",
    keyTakeaway: "Le projet se définit par ceux qui s'engagent, pas par un plan préétabli"
  },

  // Module 5: Lemonade
  {
    id: 20,
    module: "Lemonade",
    title: "Principe 4: Transformez les Surprises",
    content: [
      "Quand la vie vous donne des citrons, faites de la limonade!",
      "Embrassez les surprises plutôt que de vous accrocher aux objectifs existants",
      "Restez flexible et ouvert aux changements de direction",
      "Les contingences sont des sources d'opportunités, pas des obstacles"
    ],
    icon: "🍋",
    color: "from-yellow-500 to-amber-600",
    keyTakeaway: "La flexibilité face à l'imprévu est une force, pas une faiblesse"
  },
  {
    id: 21,
    module: "Lemonade",
    title: "Exploiter les Contingences",
    content: [
      "Les entrepreneurs experts ne prédisent pas - ils s'adaptent et contrôlent",
      "Chaque surprise porte le germe d'une nouvelle opportunité",
      "Dr. Fad (Ken Hakuta): un jouet collant reçu de sa mère → 240 millions de Wacky WallWalkers vendus",
      "Le succès vient souvent de pivots inattendus"
    ],
    icon: "🔄",
    color: "from-lime-500 to-green-600",
    caseStudy: {
      name: "Wacky WallWalkers",
      description: "Ken Hakuta, diplômé de Harvard sans emploi, a transformé un jouet japonais en phénomène mondial",
      lesson: "Les meilleures opportunités surgissent souvent des circonstances les plus inattendues"
    }
  },
  {
    id: 22,
    module: "Lemonade",
    title: "Surprises Positives et Négatives",
    content: [
      "SURPRISES POSITIVES: opportunités inattendues à saisir",
      "• Un client demande quelque chose de différent → nouveau marché",
      "• Une technologie émerge → nouveau produit possible",
      "SURPRISES NÉGATIVES: obstacles à transformer",
      "• Un fournisseur fait faillite → occasion de verticalisation",
      "• Une réglementation change → nouveau positionnement"
    ],
    icon: "🎭",
    color: "from-amber-500 to-orange-600",
    keyTakeaway: "Les deux types de surprises peuvent créer de la valeur si vous restez flexible"
  },
  {
    id: 23,
    module: "Lemonade",
    title: "Le Pivot Effectual",
    content: [
      "Le pivot n'est pas un échec - c'est l'effectuation en action",
      "YouTube: site de rencontres vidéo → plateforme de partage de vidéos",
      "Slack: jeu vidéo multijoueur → outil de communication d'équipe",
      "Twitter: plateforme de podcasting → réseau social de microblogging",
      "Instagram: application de check-in → partage de photos"
    ],
    icon: "🔀",
    color: "from-green-500 to-emerald-600",
    keyTakeaway: "Les plus grandes entreprises tech sont nées de pivots stratégiques"
  },

  // Module 6: Le Processus Effectual
  {
    id: 24,
    module: "Processus Effectual",
    title: "Mettre le Tout Ensemble",
    content: [
      "1. Partez de vos moyens (Bird-in-Hand)",
      "2. Évaluez votre perte acceptable (Affordable Loss)",
      "3. Formez des partenariats (Crazy Quilt)",
      "4. Transformez les surprises (Lemonade)",
      "5. Itérez: chaque cycle enrichit vos moyens et clarifie vos objectifs"
    ],
    icon: "🔁",
    color: "from-blue-500 to-indigo-600",
    keyTakeaway: "L'effectuation est un processus itératif où moyens et fins co-évoluent"
  },
  {
    id: 25,
    module: "Processus Effectual",
    title: "Le Cycle Effectual",
    content: [
      "MOYENS → ACTIONS → INTERACTIONS → ENGAGEMENTS → NOUVEAUX MOYENS",
      "Chaque cycle élargit votre ensemble de moyens disponibles",
      "Les objectifs émergent et se précisent au fil des interactions",
      "Le marché est créé par l'action, pas découvert par l'analyse",
      "L'entreprise prend forme progressivement, pas d'un seul coup"
    ],
    icon: "🌀",
    color: "from-violet-500 to-purple-600",
    keyTakeaway: "L'effectuation est cyclique et expansive, pas linéaire et réductive"
  },
  {
    id: 26,
    module: "Processus Effectual",
    title: "Avantages de l'Approche Effectuale",
    content: [
      "✓ Pas besoin de courir après les investisseurs",
      "✓ Pas d'attente de l'opportunité parfaite",
      "✓ Travaillez avec vos forces sans surmonter vos faiblesses d'abord",
      "✓ Attirez des co-créateurs, pas juste des fournisseurs de ressources",
      "✓ Augmentez la probabilité de surprises innovantes"
    ],
    icon: "✅",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 27,
    module: "Processus Effectual",
    title: "Quand Utiliser l'Effectuation?",
    content: [
      "✓ Contexte d'incertitude élevée (marchés nouveaux)",
      "✓ Ressources limitées (bootstrapping)",
      "✓ Objectifs flous ou évolutifs",
      "✓ Innovation de rupture",
      "✗ Environnements prévisibles → Causation plus appropriée",
      "✗ Objectifs clairs et moyens abondants → Planification classique"
    ],
    icon: "🎚️",
    color: "from-cyan-500 to-blue-600",
    keyTakeaway: "L'effectuation et la causation sont complémentaires selon le contexte"
  },

  // Module 7: Études de Cas
  {
    id: 28,
    module: "Études de Cas",
    title: "Airbnb: De 3 Matelas à 100 Milliards $",
    content: [
      "2007: Joe Gebbia et Brian Chesky ne peuvent pas payer leur loyer à SF",
      "Moyens: espace de vie, compétences design/web, un ami développeur (Nathan)",
      "Première action: 3 matelas gonflables + petit déjeuner pour une conférence design",
      "Itération: photos professionnelles, partenariats locaux, pivot vers l'hébergement complet",
      "Résultat: Valorisation 100B$+, présence dans 220 pays"
    ],
    icon: "🏠",
    color: "from-rose-500 to-pink-600",
    caseStudy: {
      name: "Airbnb",
      description: "Trois amis ont transformé un problème de loyer en révolution de l'hébergement mondial",
      lesson: "Les moyens les plus modestes peuvent créer les plus grandes entreprises"
    }
  },
  {
    id: 29,
    module: "Études de Cas",
    title: "World Central Kitchen: Nourrir l'Espoir",
    content: [
      "José Andrés: chef étoilé Michelin avec expérience de cuisine de masse",
      "Déclencheur: regarder l'inaction pendant l'ouragan Katrina en 2005",
      "Insight: 'Les cuisiniers comme moi, on connaît la nourriture!'",
      "Modèle: pas d'infrastructure, mais une infrastructure partout via les partenariats",
      "Impact: présence mondiale lors de crises (Ukraine, Syrie, Maroc, Gaza...)"
    ],
    icon: "🍲",
    color: "from-orange-500 to-red-600",
    keyTakeaway: "L'expertise culinaire + la passion humanitaire = impact mondial"
  },
  {
    id: 30,
    module: "Études de Cas",
    title: "Biocon: Du Garage aux Milliards",
    content: [
      "Kiran Mazumdar-Shaw: 120$ et un garage à 25 ans en Inde",
      "Aujourd'hui: entreprise pharmaceutique de 2,8 milliards $",
      "Innovation sociale: cliniques rurales + prix différenciés",
      "Modèle: riches paient plein prix (8h-17h), pauvres gratuits (nuit)",
      "'Innovation et commerce sont des outils aussi puissants pour le progrès social'"
    ],
    icon: "💊",
    color: "from-purple-500 to-violet-600",
    caseStudy: {
      name: "Biocon & Arogya Raksha Yojana",
      description: "Du succès commercial à l'impact social avec le même esprit entrepreneurial",
      lesson: "Le business peut être un outil de changement social autant que de création de richesse"
    }
  },
  {
    id: 31,
    module: "Études de Cas",
    title: "EcoEnvelopes: L'Invention par Nécessité",
    content: [
      "Nathan a voulu créer des enveloppes réutilisables pour réduire le gaspillage",
      "Problème: pas de financement pour lancer une usine",
      "Solution: approche effectuale - partenariat avec imprimeries existantes",
      "Résultat: moins d'investissement, plus de flexibilité, adoption rapide",
      "Le produit a évolué selon les feedbacks des premiers utilisateurs"
    ],
    icon: "📧",
    color: "from-emerald-500 to-green-600",
    keyTakeaway: "Les contraintes de ressources forcent l'innovation dans les partenariats"
  },
  {
    id: 32,
    module: "Études de Cas",
    title: "Noma: Réinventer la Cuisine Nordique",
    content: [
      "René Redzepi: commencer avec les ingrédients locaux disponibles",
      "Bird-in-Hand: champignons, baies, produits de la forêt danoise",
      "Crazy Quilt: partenariats avec fermiers, pêcheurs, cueilleurs locaux",
      "Lemonade: les 'contraintes' nordiques sont devenues l'identité unique",
      "Résultat: Meilleur restaurant du monde (4 fois), mouvement culinaire mondial"
    ],
    icon: "🍽️",
    color: "from-teal-500 to-cyan-600",
    keyTakeaway: "Les limitations géographiques peuvent devenir des avantages compétitifs"
  },

  // Module 8: L'Entrepreneur dans les Grandes Organisations
  {
    id: 33,
    module: "Intrapreneuriat",
    title: "Les 3 Barrières Structurelles",
    content: [
      "PRÉDICTION: le succès passé renforce la dépendance aux prévisions",
      "STRUCTURE: la croissance sépare décision et action",
      "PROCESSUS: les règles éliminent la nouveauté du système",
      "Ces attributs aident les entreprises à grandir mais inhibent l'innovation"
    ],
    icon: "🏢",
    color: "from-slate-500 to-gray-600",
    keyTakeaway: "Les forces des grandes entreprises sont aussi leurs faiblesses pour l'innovation"
  },
  {
    id: 34,
    module: "Intrapreneuriat",
    title: "Créer une Culture Entrepreneuriale",
    content: [
      "Redesigner prédiction, structure et processus pour libérer la créativité",
      "Permettre aux équipes de créer le prochain marché/produit/service",
      "Appliquer les principes effectuaux aux projets d'innovation interne",
      "'Nous avons besoin d'une société entrepreneuriale' - Peter Drucker"
    ],
    icon: "🌱",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 35,
    module: "Intrapreneuriat",
    title: "L'Effectuation en Entreprise",
    content: [
      "1. Permettre aux équipes de commencer avec leurs moyens existants",
      "2. Définir des budgets d'expérimentation (perte acceptable)",
      "3. Encourager les partenariats internes et externes",
      "4. Valoriser les pivots et l'apprentissage des échecs",
      "5. Créer des espaces protégés pour l'innovation"
    ],
    icon: "💼",
    color: "from-indigo-500 to-blue-600",
    keyTakeaway: "L'effectuation peut transformer la culture d'innovation des grandes organisations"
  },

  // Module 9: Mythes et Réalités
  {
    id: 36,
    module: "Mythes et Réalités",
    title: "Mythe 1: Les Entrepreneurs Sont des Preneurs de Risques",
    content: [
      "MYTHE: Les entrepreneurs aiment le risque et parient gros",
      "RÉALITÉ: Les entrepreneurs experts minimisent le risque",
      "Ils ne risquent que ce qu'ils peuvent se permettre de perdre",
      "Ils contrôlent ce qu'ils peuvent, pas ce qu'ils ne peuvent pas",
      "L'effectuation est une approche de gestion du risque, pas de prise de risque"
    ],
    icon: "🎰",
    color: "from-red-500 to-rose-600",
    keyTakeaway: "Les entrepreneurs réussis sont des gestionnaires de risques prudents"
  },
  {
    id: 37,
    module: "Mythes et Réalités",
    title: "Mythe 2: Il Faut une Grande Idée",
    content: [
      "MYTHE: Le succès entrepreneurial vient d'idées brillantes et uniques",
      "RÉALITÉ: La plupart des entreprises réussies ont commencé modestement",
      "L'idée initiale évolue considérablement en cours de route",
      "L'exécution et l'adaptation sont plus importantes que l'idée initiale",
      "Les opportunités sont construites, pas découvertes"
    ],
    icon: "💡",
    color: "from-amber-500 to-yellow-600",
    keyTakeaway: "L'action crée les opportunités, pas la réflexion passive"
  },
  {
    id: 38,
    module: "Mythes et Réalités",
    title: "Mythe 3: Il Faut Beaucoup d'Argent",
    content: [
      "MYTHE: Sans financement important, impossible de lancer une entreprise",
      "RÉALITÉ: La plupart des entreprises commencent avec très peu",
      "Le bootstrapping force l'innovation et la discipline",
      "Les partenariats peuvent remplacer le capital",
      "L'argent arrive après la validation, pas avant"
    ],
    icon: "💰",
    color: "from-emerald-500 to-green-600",
    keyTakeaway: "Les contraintes financières favorisent la créativité et les partenariats"
  },

  // Module 10: Conclusion
  {
    id: 39,
    module: "Conclusion",
    title: "Le Plan de Ne Pas Avoir de Plan",
    content: [
      "Vince (Ecotricity): 'Il faut être flexible, réévaluer constamment ce qu'on tient pour vrai'",
      "Les business plans ne sont ni toujours nécessaires ni toujours nuisibles",
      "La vraie question: 'À quoi un business plan est-il utile pour MON projet?'",
      "Avec ou sans plan, rien ne se passe sans action et sans parties prenantes"
    ],
    icon: "📝",
    color: "from-indigo-500 to-blue-600",
    keyTakeaway: "Le plan est un outil, pas une fin en soi - adaptez votre approche au contexte"
  },
  {
    id: 40,
    module: "Conclusion",
    title: "Vous Pouvez Commencer Maintenant",
    content: [
      "L'effectuation transforme la question fondamentale:",
      "DE: 'Comment construire une entreprise à succès?'",
      "À: 'Que puis-je créer avec qui je suis, ce que je sais, et qui je connais?'",
      "Vous n'avez pas besoin de prédire le futur parfait",
      "Travaillez avec des gens qui veulent travailler avec vous"
    ],
    icon: "🚀",
    color: "from-primary to-purple-600",
    keyTakeaway: "L'entrepreneuriat effectual vous libère de l'attente de conditions parfaites"
  },
  {
    id: 41,
    module: "Conclusion",
    title: "Les 5 Leçons Clés de l'Effectuation",
    content: [
      "🐦 Commencez avec vos moyens, pas vos rêves",
      "💸 Risquez ce que vous pouvez perdre, pas ce que vous espérez gagner",
      "🧩 Co-créez avec des partenaires engagés",
      "🍋 Transformez les obstacles en opportunités",
      "✈️ Pilotez activement le futur au lieu de le prédire"
    ],
    icon: "🎓",
    color: "from-amber-500 to-orange-600",
    keyTakeaway: "L'effectuation est une science pratique de création de valeur dans l'incertitude"
  },
  {
    id: 42,
    module: "Conclusion",
    title: "L'Appel à l'Action",
    content: [
      "L'effectuation n'est pas une théorie abstraite - c'est une pratique",
      "Commencez aujourd'hui avec un petit pas dans vos moyens",
      "Parlez à quelqu'un qui pourrait être intéressé",
      "Demandez un engagement concret, pas une opinion",
      "Embrassez ce qui arrive et ajustez votre direction"
    ],
    icon: "🌟",
    color: "from-violet-500 to-purple-600",
    quote: {
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker (cité par Sarasvathy)"
    }
  }
];

export const effectuationModules = [
  { name: "Introduction", icon: "🎯", slides: 5 },
  { name: "Bird-in-Hand", icon: "🐦", slides: 6 },
  { name: "Affordable Loss", icon: "💸", slides: 4 },
  { name: "Crazy Quilt", icon: "🧩", slides: 4 },
  { name: "Lemonade", icon: "🍋", slides: 4 },
  { name: "Processus Effectual", icon: "🔁", slides: 4 },
  { name: "Études de Cas", icon: "📊", slides: 5 },
  { name: "Intrapreneuriat", icon: "🏢", slides: 3 },
  { name: "Mythes et Réalités", icon: "🎭", slides: 3 },
  { name: "Conclusion", icon: "🎓", slides: 4 }
];
