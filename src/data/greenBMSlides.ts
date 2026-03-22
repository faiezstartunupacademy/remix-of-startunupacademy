// Entrepreneuriat Vert et Innovation Durable - 70 Slides
// Basé sur le contenu complet de la formation professionnelle

export interface GreenSlide {
  id: number;
  module: string;
  title: string;
  content: string;
  keyPoints?: string[];
  exercise?: string;
  type: "intro" | "content" | "recap" | "exercise";
  icon: string;
}

export const greenBMSlides: GreenSlide[] = [
  // ============================================
  // PARTIE 1: Introduction (Diapos 1-10)
  // ============================================
  {
    id: 1,
    module: "1. Introduction",
    title: "Entrepreneuriat Vert et Innovation Durable",
    content: "Guide complet pour créer et développer une entreprise durable. Formation professionnelle en 70 diapositives couvrant tous les aspects de l'entrepreneuriat vert.",
    keyPoints: [
      "Comprendre l'écosystème de l'entrepreneuriat vert",
      "Identifier les opportunités du marché vert",
      "Maîtriser les modèles d'affaires durables",
      "Explorer le financement et la réglementation"
    ],
    type: "intro",
    icon: "Leaf"
  },
  {
    id: 2,
    module: "1. Introduction",
    title: "Qu'est-ce que l'Entrepreneuriat Vert?",
    content: "L'entrepreneuriat vert est une activité entrepreneuriale durable intégrant les principes de développement durable dans tous les aspects de l'entreprise.",
    keyPoints: [
      "Activité entrepreneuriale durable",
      "Création de valeur économique viable",
      "Préservation de l'environnement",
      "Réponse aux besoins sociaux",
      "Innovation responsable"
    ],
    type: "content",
    icon: "Sprout"
  },
  {
    id: 3,
    module: "1. Introduction",
    title: "Les Trois Piliers du Développement Durable",
    content: "Le développement durable repose sur trois piliers indissociables et interdépendants pour une croissance responsable.",
    keyPoints: [
      "Économique: Viabilité financière, profit et croissance, création d'emplois",
      "Environnemental: Protection de la nature, réduction de l'impact, biodiversité",
      "Social: Équité et bien-être, justice sociale, inclusion et diversité"
    ],
    type: "content",
    icon: "Scale"
  },
  {
    id: 4,
    module: "1. Introduction",
    title: "Contexte Historique",
    content: "Du rapport Brundtland aux Objectifs de Développement Durable, l'entrepreneuriat vert s'inscrit dans une trajectoire historique.",
    keyPoints: [
      "1972: Conférence de Stockholm - Première conférence mondiale sur l'environnement",
      "1987: Rapport Brundtland - Définition du développement durable",
      "1992: Sommet de Rio - Agenda 21 et 'Think Global, Act Local'",
      "1997: Protocole de Kyoto",
      "2010: ISO 26000 - Norme internationale RSE",
      "2015: Accord de Paris et 17 ODD"
    ],
    type: "content",
    icon: "Globe"
  },
  {
    id: 5,
    module: "1. Introduction",
    title: "Pourquoi l'Entrepreneuriat Vert Aujourd'hui?",
    content: "L'urgence climatique, les opportunités de marché et les incitations gouvernementales créent un contexte favorable.",
    keyPoints: [
      "Urgence climatique: Nécessité de réduire l'empreinte environnementale",
      "Pression des consommateurs: 70% exigent des produits durables",
      "Incitations gouvernementales: Aides et politiques favorables",
      "Avantage concurrentiel: Différenciation et fidélisation",
      "Technologies vertes accessibles"
    ],
    type: "content",
    icon: "TrendingUp"
  },
  {
    id: 6,
    module: "1. Introduction",
    title: "État Actuel de l'Économie Verte",
    content: "L'économie verte représente un moteur de croissance durable avec des chiffres significatifs.",
    keyPoints: [
      "500 000 emplois en France dans l'économie verte",
      "70 Md€ de production en éco-activités",
      "3-5% de croissance annuelle constante",
      "Secteurs clés: Énergies renouvelables, Eau, Déchets, Bâtiment, Mobilité"
    ],
    type: "content",
    icon: "BarChart3"
  },
  {
    id: 7,
    module: "1. Introduction",
    title: "Définitions Clés",
    content: "Comprendre les termes essentiels de l'entrepreneuriat vert et de la responsabilité sociétale.",
    keyPoints: [
      "Éco-entrepreneur: Individu intégrant le développement durable dans son modèle d'affaires",
      "Éco-entreprise: Organisation pratiquant la responsabilité sociétale",
      "RSE: Intégration volontaire des préoccupations sociales et environnementales",
      "Éco-activités: Marchés axés sur le respect de l'environnement"
    ],
    type: "content",
    icon: "BookOpen"
  },
  {
    id: 8,
    module: "1. Introduction",
    title: "Profil de l'Entrepreneur Vert",
    content: "Un entrepreneur vert combine compétences entrepreneuriales et conscience écologique pour créer un impact positif.",
    keyPoints: [
      "Vision à long terme et anticipation des besoins futurs",
      "Capacité d'innovation et créativité",
      "Persévérance et résilience face aux défis",
      "Conscience écologique et sensibilité environnementale",
      "Compromis équilibré entre profit et impact",
      "Ouverture à la collaboration et partenariats"
    ],
    type: "content",
    icon: "Users"
  },
  {
    id: 9,
    module: "1. Introduction",
    title: "Objectifs de la Formation",
    content: "Ce que vous allez maîtriser à travers cette formation complète.",
    keyPoints: [
      "Comprendre l'écosystème et les enjeux",
      "Identifier les opportunités de marché",
      "Concevoir des modèles d'affaires durables",
      "Explorer le financement vert",
      "Développer un business plan intégrant la RSE",
      "Comprendre le cadre réglementaire"
    ],
    type: "content",
    icon: "Target"
  },
  {
    id: 10,
    module: "1. Introduction",
    title: "Points Clés - Module 1",
    content: "Récapitulatif des fondements de l'entrepreneuriat vert.",
    keyPoints: [
      "L'entrepreneuriat vert est un modèle économique viable",
      "Les trois piliers sont indissociables",
      "Le contexte est favorable (réglementation, demande, technologies)"
    ],
    type: "recap",
    icon: "CheckCircle2"
  },

  // ============================================
  // PARTIE 2: Opportunités du Marché (Diapos 11-15)
  // ============================================
  {
    id: 11,
    module: "2. Opportunités",
    title: "Taille du Marché et Potentiel",
    content: "L'économie verte représente un potentiel énorme avec une croissance constante.",
    keyPoints: [
      "500 000 salariés en France dans l'économie verte",
      "70 Md€ de production nationale",
      "Cleantech: Technologies propres et innovation",
      "Énergies renouvelables: Solaire, éolien, biomasse",
      "Économie circulaire: Réutilisation, recyclage"
    ],
    type: "content",
    icon: "TrendingUp"
  },
  {
    id: 12,
    module: "2. Opportunités",
    title: "Principaux Secteurs Verts",
    content: "Les secteurs clés de l'économie verte offrent des opportunités variées.",
    keyPoints: [
      "Énergies renouvelables: Solaire, Éolien, Biomasse, Hydroélectricité",
      "Traitement des déchets: Recyclage, Valorisation, Compostage",
      "Transport vert: Mobilité douce, Transport public, Logistique verte",
      "Éco-conception: Analyse du cycle de vie, Matériaux recyclés",
      "Gestion de l'eau: Assainissement, traitement, distribution",
      "Agriculture biologique: Bio, Circuits courts, Agriculture durable"
    ],
    type: "content",
    icon: "Leaf"
  },
  {
    id: 13,
    module: "2. Opportunités",
    title: "Tendances de Consommation Verte",
    content: "Une nouvelle génération de consommateurs conscients et influents transforme le marché.",
    keyPoints: [
      "Produits durables: Préférence croissante pour l'écologique",
      "Anti-greenwashing: Sensibilité aux fausses allégations",
      "Prix premium: Volonté de payer plus pour la qualité éthique",
      "Segment LOHAS: 30-35% de la population",
      "Transparence demandée sur l'origine et l'impact",
      "Influence des réseaux sociaux sur les choix"
    ],
    type: "content",
    icon: "Users"
  },
  {
    id: 14,
    module: "2. Opportunités",
    title: "Les Moteurs Réglementaires",
    content: "Les réglementations environnementales stimulent l'innovation verte et créent des opportunités.",
    keyPoints: [
      "Accords de Paris: Réduction des émissions de CO2",
      "Directive Européenne: Règlements environnementaux UE",
      "Lois nationales: Grenelle, NRE, transition écologique",
      "ISO 26000: Norme internationale RSE",
      "Certifications: ENERGY STAR, LEED, BREEAM"
    ],
    type: "content",
    icon: "FileText"
  },
  {
    id: 15,
    module: "2. Opportunités",
    title: "Les Moteurs Financiers",
    content: "De nombreux dispositifs soutiennent les projets verts.",
    keyPoints: [
      "Crédits d'impôt: Production et investissement verts",
      "Subventions: ADEME, Bpifrance, régions",
      "Prêts verts: Financement à taux préférentiels",
      "Obligations vertes: Green Bonds",
      "Incitations fiscales: Réductions pour R&D"
    ],
    type: "content",
    icon: "Coins"
  },

  // ============================================
  // PARTIE 3: Piliers du Développement Durable (Diapos 16-20)
  // ============================================
  {
    id: 16,
    module: "3. Piliers DD",
    title: "Le Pilier Économique",
    content: "Concilier performance financière et responsabilité environnementale.",
    keyPoints: [
      "Création de valeur: Génération de richesses durables",
      "Rentabilité long terme: Performance économique pérenne",
      "Innovation durable: Développement de produits verts",
      "Compétitivité verte: Positionnement avantageux",
      "Emplois verts: Création de postes dans l'économie verte",
      "Partage de la valeur équitable"
    ],
    type: "content",
    icon: "DollarSign"
  },
  {
    id: 17,
    module: "3. Piliers DD",
    title: "Le Pilier Environnemental",
    content: "Préserver la planète pour les générations futures.",
    keyPoints: [
      "Ressources naturelles: Protection et gestion durable",
      "Empreinte écologique: Réduction de l'impact",
      "Gestion des déchets: Valorisation et recyclage",
      "Biodiversité: Préservation des écosystèmes",
      "Changement climatique: Lutte contre le réchauffement",
      "Économie circulaire: Réduire, réutiliser, recycler"
    ],
    type: "content",
    icon: "TreePine"
  },
  {
    id: 18,
    module: "3. Piliers DD",
    title: "Le Pilier Social",
    content: "Construire une entreprise inclusive et équitable.",
    keyPoints: [
      "Équité et inclusion: Traitement juste pour tous",
      "Bien-être des employés: Qualité de vie au travail",
      "Diversité: Non-discrimination et inclusion",
      "Conditions de travail: Environnement sûr et sain",
      "Engagement communautaire: Contribution positive",
      "Besoins essentiels: Satisfaction des besoins fondamentaux"
    ],
    type: "content",
    icon: "Heart"
  },
  {
    id: 19,
    module: "3. Piliers DD",
    title: "Principes Clés du Développement Durable",
    content: "Guide de conduite pour une entreprise responsable.",
    keyPoints: [
      "Prévention: Éviter les dommages avant qu'ils surviennent",
      "Précaution: Agir même sans certitude scientifique",
      "Information et participation: Transparence totale",
      "Bonne gouvernance: Responsabilité et éthique",
      "Pollueur-payeur: Internalisation des coûts",
      "Solidarité: Responsabilité spatiale et temporelle"
    ],
    type: "content",
    icon: "Scale"
  },
  {
    id: 20,
    module: "3. Piliers DD",
    title: "La RSE - Responsabilité Sociétale",
    content: "Intégration volontaire des préoccupations sociales et environnementales.",
    keyPoints: [
      "Engagement volontaire: Au-delà des obligations légales",
      "Développement durable: Contribution active",
      "ISO 26000: Référentiel international",
      "Création de valeur partagée",
      "Performance économique ET responsabilité sociale/environnementale"
    ],
    type: "content",
    icon: "Award"
  },

  // ============================================
  // PARTIE 4: Modèles d'Affaires Verts (Diapos 21-30)
  // ============================================
  {
    id: 21,
    module: "4. Modèles Verts",
    title: "Comprendre les Modèles d'Affaires",
    content: "Le modèle d'affaires est un système interconnecté de 9 blocs de construction.",
    keyPoints: [
      "Proposition de valeur: Problèmes résolus, besoins satisfaits",
      "Segments de clientèle: Marchés cibles",
      "Canaux: Distribution et communication",
      "Relations clients: Type de relation et fidélisation",
      "Flux de revenus: Sources de cash",
      "Ressources et Activités clés",
      "Partenariats stratégiques"
    ],
    type: "content",
    icon: "Layers"
  },
  {
    id: 22,
    module: "4. Modèles Verts",
    title: "Caractéristiques des Modèles Verts",
    content: "Intégration systématique de la durabilité dans le modèle économique.",
    keyPoints: [
      "Intégration durable: Piliers économique, environnemental et social",
      "Mesure d'impact: Quantification des effets positifs",
      "Transparence: Traçabilité et communication honnête",
      "Innovation: Proposition de valeur verte unique",
      "Création de valeur partagée: Gagnant-gagnant-gagnant",
      "Avantage concurrentiel: Différenciation et fidélisation"
    ],
    type: "content",
    icon: "Leaf"
  },
  {
    id: 23,
    module: "4. Modèles Verts",
    title: "L'Économie Circulaire",
    content: "Fermer le cycle des matériaux et de l'énergie avec les 7R.",
    keyPoints: [
      "Refuser: Éviter la consommation inutile",
      "Réduire: Minimiser la consommation",
      "Réutiliser: Donner une seconde vie",
      "Réparer: Prolonger la durée de vie",
      "Refaire: Remettre à neuf",
      "Recycler: Transformer les déchets",
      "Restaurer: Régénérer les écosystèmes"
    ],
    type: "content",
    icon: "Recycle"
  },
  {
    id: 24,
    module: "4. Modèles Verts",
    title: "Modèles Product-as-a-Service",
    content: "Vendre l'usage et les services, pas le produit.",
    keyPoints: [
      "Abonnements: Paiement récurrent pour l'accès",
      "Locations: Accès temporaire à l'équipement",
      "Maintenance incluse: Service et entretien intégrés",
      "Revenus récurrents et fidélisation clients",
      "Moins de déchets et durabilité garantie",
      "Exemples: SaaS, Location IT, Covoiturage"
    ],
    type: "content",
    icon: "RefreshCw"
  },
  {
    id: 25,
    module: "4. Modèles Verts",
    title: "Économie de Partage",
    content: "Partage de ressources et d'actifs pour optimiser l'utilisation.",
    keyPoints: [
      "Plateformes d'intermédiation numérique",
      "Communautés et réseaux collaboratifs",
      "Coûts réduits et avantages sociaux",
      "Impact écologique: Moins de surproduction",
      "Exemples: Airbnb, BlaBlaCar, Coworking",
      "Optimisation maximale des ressources"
    ],
    type: "content",
    icon: "Users"
  },
  {
    id: 26,
    module: "4. Modèles Verts",
    title: "Chaînes d'Approvisionnement Durables",
    content: "Intégrer la durabilité dans toute la chaîne de valeur.",
    keyPoints: [
      "Achats locaux: Soutenir l'économie locale",
      "Achats éthiques: Commerce équitable",
      "Certification fournisseurs: Standards et labels",
      "Réduction carbone: Transport optimisé",
      "Traçabilité: Blockchain et RFID",
      "Avantages: Moins de risques, réputation, économies"
    ],
    type: "content",
    icon: "Link"
  },
  {
    id: 27,
    module: "4. Modèles Verts",
    title: "B Corp et Entreprises Sociales",
    content: "Standards mesurables d'impact social et environnemental.",
    keyPoints: [
      "Certification B Corp: 200+ points de contrôle",
      "Gouvernance inclusive: Participation des parties prenantes",
      "Transparence: Communication ouverte",
      "Entreprise sociale: Profit + impact positif",
      "Réévaluation tous les 3 ans",
      "Avantages: Crédibilité, réseau, croissance"
    ],
    type: "content",
    icon: "Award"
  },
  {
    id: 28,
    module: "4. Modèles Verts",
    title: "Investissement à Impact",
    content: "Profit financier + impact positif mesurable.",
    keyPoints: [
      "ESG: Critères Environnementaux, Sociaux, Gouvernance",
      "Double bottom line: Performance + impact",
      "Types: Capital croissance, Venture capital, Fonds durables",
      "Mesure d'impact: Indicateurs extra-financiers",
      "Avantages: Réputation, moins de risques, innovation",
      "Rapports d'impact réguliers obligatoires"
    ],
    type: "content",
    icon: "TrendingUp"
  },
  {
    id: 29,
    module: "4. Modèles Verts",
    title: "Green Tech et Innovation",
    content: "Innovation pour un avenir durable dans tous les secteurs.",
    keyPoints: [
      "Panneaux solaires: Énergie photovoltaïque avancée",
      "Véhicules électriques: Mobilité sans émissions",
      "Stockage énergie: Batteries nouvelle génération",
      "Purification eau: Technologies propres",
      "R&D durable: Recherche éco-responsable",
      "Innovation frugale: Solutions simples et efficaces"
    ],
    type: "content",
    icon: "Zap"
  },
  {
    id: 30,
    module: "4. Modèles Verts",
    title: "Modèles Hybrides",
    content: "Combinaison stratégique de plusieurs modèles verts pour plus de résilience.",
    keyPoints: [
      "B Corp + Circulaire: Certification + économie circulaire",
      "As-a-service + Vert: Modèle service + certification",
      "Partage + Tech: Économie de partage + green tech",
      "Évolution progressive vers le vert",
      "Mesure de l'impact par modèle intégré",
      "Agilité et adaptation au changement"
    ],
    type: "content",
    icon: "Layers"
  },

  // ============================================
  // PARTIE 5: Développer Votre Idée Verte (Diapos 31-40)
  // ============================================
  {
    id: 31,
    module: "5. Développement",
    title: "Identifier les Opportunités Vertes",
    content: "Convertir les défis environnementaux en opportunités entrepreneuriales.",
    keyPoints: [
      "Problèmes environnementaux: Pollution, déchets, ressources rares",
      "Besoins non satisfaits: Consommateurs exigeants",
      "Méthodes: Entretiens clients, études de marché, analyse données",
      "Observation active: Repérer les problèmes non résolus",
      "Critères: Impact mesurable + viabilité économique",
      "Créativité et pensée différente"
    ],
    type: "content",
    icon: "Search"
  },
  {
    id: 32,
    module: "5. Développement",
    title: "Approche Problème-Solution",
    content: "Du problème à la solution entrepreneuriale en 3 étapes.",
    keyPoints: [
      "1. Identifier: Problème environnemental ou social",
      "2. Analyser: Bénéficiaires et impact mesurable",
      "3. Créer: Solution unique et différenciée",
      "Innovation clé: Valeur ajoutée et durabilité",
      "Cibles claires: Résultats quantifiables",
      "Définir avec précision le problème"
    ],
    type: "content",
    icon: "Lightbulb"
  },
  {
    id: 33,
    module: "5. Développement",
    title: "Recherche de Marché",
    content: "Comprendre votre marché avant de vous lancer.",
    keyPoints: [
      "Taille du marché: TAM, SAM, SOM",
      "Clients cibles: Profils et segments",
      "Analyse de la concurrence: Directe, indirecte, émergente",
      "Benchmark et positionnement",
      "Tendances de marché et évolutions",
      "Potentiel de croissance et opportunités futures"
    ],
    type: "content",
    icon: "BarChart3"
  },
  {
    id: 34,
    module: "5. Développement",
    title: "Valider Votre Concept Vert",
    content: "Tester, mesurer, itérer rapidement pour valider le marché.",
    keyPoints: [
      "MVP: Produit minimum viable",
      "Tests utilisateurs: Beta testing et pilotes",
      "Cycle de validation: Prototyper → Tester → Mesurer → Itérer",
      "KPIs environnementaux: Tonnes CO2, litres économisés, tonnes recyclées",
      "Feedback clients: Écoute active et intégration",
      "Validation hypothèses: Preuve de concept"
    ],
    type: "content",
    icon: "CheckCircle2"
  },
  {
    id: 35,
    module: "5. Développement",
    title: "De l'Idée au Plan d'Affaires",
    content: "Transformation structurée du concept à la stratégie d'affaires.",
    keyPoints: [
      "1. Documenter: Idée et concept clairement définis",
      "2. Analyser: Faisabilité technique et économique",
      "3. Stratégie: Modèle d'affaires structuré",
      "Projections financières: Revenus, coûts, profitabilité",
      "Processus itératif: Affinement continu",
      "Préparation investisseurs: Pitch et présentation"
    ],
    type: "content",
    icon: "FileText"
  },
  {
    id: 36,
    module: "5. Développement",
    title: "Composantes du Plan d'Affaires Vert",
    content: "Les éléments essentiels d'un business plan durable.",
    keyPoints: [
      "Résumé opérationnel: Vision et proposition de valeur",
      "Description entreprise: Mission, valeurs durables",
      "Analyse de marché: Opportunités et segmentation",
      "Produits/services: Offre verte",
      "Plan marketing: Stratégie verte",
      "Financier: Projections et mesure d'impact",
      "Annexes: Certifications, RSE, documentation"
    ],
    type: "content",
    icon: "BookOpen"
  },
  {
    id: 37,
    module: "5. Développement",
    title: "Résumé Opérationnel",
    content: "Les éléments clés à présenter aux investisseurs.",
    keyPoints: [
      "Vision et mission: Ambition à long terme",
      "Proposition de valeur unique et différenciante",
      "Opportunité de marché: Taille et potentiel",
      "Modèle d'affaires: Génération de revenus",
      "Avantage concurrentiel: Pourquoi vous gagnez",
      "Équipe fondatrice: Compétences et passion",
      "Objectifs financiers: Projection 3-5 ans"
    ],
    type: "content",
    icon: "Target"
  },
  {
    id: 38,
    module: "5. Développement",
    title: "Analyse de Marché",
    content: "Comprendre le marché total, accessible et cible.",
    keyPoints: [
      "TAM: Total Addressable Market - Marché total",
      "SAM: Serviceable Addressable Market - Marché accessible",
      "SOM: Serviceable Obtainable Market - Marché cible",
      "Segmentation client précise",
      "Analyse concurrentielle: Avantages compétitifs",
      "Tendances et barrières à l'entrée"
    ],
    type: "content",
    icon: "PieChart"
  },
  {
    id: 39,
    module: "5. Développement",
    title: "Proposition de Valeur Verte",
    content: "Définir clairement ce qui vous distingue et crée de l'impact.",
    keyPoints: [
      "Problème résolu: Défi environnemental ou social",
      "Solution unique: Approche innovante et différenciée",
      "Avantages différenciants vs concurrence",
      "Preuve de concept: Validation empirique",
      "Avantages écologiques: Carbone, ressources, déchets",
      "Avantages sociaux: Emplois, santé, communautés"
    ],
    type: "content",
    icon: "Leaf"
  },
  {
    id: 40,
    module: "5. Développement",
    title: "Modèle de Revenus",
    content: "Structurer la viabilité financière de votre entreprise verte.",
    keyPoints: [
      "Sources de revenus: Vente, abonnements, services, licences",
      "Structure de coûts: Fixes, variables, marges brutes",
      "Stratégie de tarification compétitive",
      "Projections de ventes: 3-5 ans",
      "Point mort (Break-even): Seuil de rentabilité",
      "Scénarios: Optimiste, réaliste, pessimiste"
    ],
    type: "content",
    icon: "DollarSign"
  },

  // ============================================
  // PARTIE 6: Construire Votre Start-up Verte (Diapos 41-50)
  // ============================================
  {
    id: 41,
    module: "6. Construction",
    title: "Structures Juridiques",
    content: "Choisir la forme juridique adaptée à votre projet vert.",
    keyPoints: [
      "SARL: Responsabilité limitée",
      "SAS: Flexibilité maximale",
      "EURL: Entreprise individuelle",
      "B Corp: Certification impact",
      "Critères: Nombre d'associés, responsabilité, fiscalité",
      "Conseil: Consulter un expert-comptable"
    ],
    type: "content",
    icon: "Building2"
  },
  {
    id: 42,
    module: "6. Construction",
    title: "Choisir Votre Forme Juridique",
    content: "Critères de sélection selon votre projet et vos ambitions.",
    keyPoints: [
      "Nombre d'associés: Sélection selon cofondateurs",
      "Responsabilité: Protection du patrimoine personnel",
      "Croissance: Capacité à attirer des investisseurs",
      "Complexité administrative: Gestion des obligations",
      "Fiscalité: IS, IR, TVA, optimisation",
      "Coûts de création et de gestion"
    ],
    type: "content",
    icon: "Scale"
  },
  {
    id: 43,
    module: "6. Construction",
    title: "Constituer la Société",
    content: "Les étapes clés pour créer officiellement votre entreprise.",
    keyPoints: [
      "1. Statuts: Rédaction et signature",
      "2. Publication: Journal officiel et annonces légales",
      "3. Inscription: RCS et obtention du SIRET",
      "Banque professionnelle: Ouverture de compte",
      "Assurances: RC professionnelle, multirisque",
      "Chronologie typique: 3 semaines"
    ],
    type: "content",
    icon: "FileCheck"
  },
  {
    id: 44,
    module: "6. Construction",
    title: "Constituer l'Équipe Fondatrice",
    content: "Bâtir une équipe complémentaire et engagée.",
    keyPoints: [
      "Nombre optimal: 2 à 4 cofondateurs",
      "Complémentarité: Technique, business, marketing, finance",
      "Pacte d'associés: Droits et obligations",
      "Partage de l'équité selon apport et rôle",
      "Processus de décision clair",
      "Communication transparente régulière"
    ],
    type: "content",
    icon: "Users"
  },
  {
    id: 45,
    module: "6. Construction",
    title: "Recruter des Talents Verts",
    content: "Attirer et retenir les meilleurs profils engagés.",
    keyPoints: [
      "Marque employeur verte: Réputation comme atout",
      "Plateformes spécialisées: Recrutement vert",
      "Culture durable: Valeurs intégrées au recrutement",
      "Salaires compétitifs et avantages sociaux",
      "Formation continue et plan de carrière",
      "Diversité, inclusion et engagement mission"
    ],
    type: "content",
    icon: "UserPlus"
  },
  {
    id: 46,
    module: "6. Construction",
    title: "Culture et Valeurs Vertes",
    content: "Créer une culture d'entreprise authentiquement durable.",
    keyPoints: [
      "Mission environnementale: Protection de la planète",
      "Vision à long terme: Avenir durable et équitable",
      "Durabilité dans toutes les décisions",
      "Innovation et créativité continues",
      "Transparence: Communication ouverte",
      "Engagement employés: Participation et formation"
    ],
    type: "content",
    icon: "Heart"
  },
  {
    id: 47,
    module: "6. Construction",
    title: "Gouvernance et Conseil d'Administration",
    content: "Structurer la prise de décision responsable.",
    keyPoints: [
      "Composition équilibrée: Fondateurs, investisseurs, indépendants",
      "Rôles des administrateurs: Surveillance, objectifs, risques",
      "Intégration ESG dans la gouvernance",
      "Fréquence des réunions adaptée",
      "Processus de décision clair",
      "Mesure de performance impact"
    ],
    type: "content",
    icon: "Building2"
  },
  {
    id: 48,
    module: "6. Construction",
    title: "Opérations Durables",
    content: "Intégrer la durabilité dans les opérations quotidiennes.",
    keyPoints: [
      "Efficacité énergétique: Réduction consommation",
      "Zéro déchet: Objectif de circularité",
      "Achats responsables: Fournisseurs verts",
      "Télétravail: Réduction empreinte transport",
      "Bureaux verts: Certifications LEED/BREEAM",
      "Mesure et reporting régulier"
    ],
    type: "content",
    icon: "Settings"
  },
  {
    id: 49,
    module: "6. Construction",
    title: "Partenariats Stratégiques",
    content: "Construire un écosystème de partenaires alignés.",
    keyPoints: [
      "Partenaires fournisseurs verts certifiés",
      "Associations sectorielles durables",
      "Universités et centres de recherche",
      "ONG et organisations environnementales",
      "Collectivités territoriales",
      "Réseaux d'entrepreneurs verts"
    ],
    type: "content",
    icon: "Handshake"
  },
  {
    id: 50,
    module: "6. Construction",
    title: "Points Clés - Modules 5 & 6",
    content: "Récapitulatif du développement et de la construction.",
    keyPoints: [
      "Valider le marché avant de construire",
      "L'équipe est aussi importante que l'idée",
      "La culture durable se construit dès le jour 1",
      "La gouvernance impacte la performance long terme"
    ],
    type: "recap",
    icon: "CheckCircle2"
  },

  // ============================================
  // PARTIE 7: Financement (Diapos 51-58)
  // ============================================
  {
    id: 51,
    module: "7. Financement",
    title: "Panorama du Financement Vert",
    content: "Les différentes sources de financement pour les entreprises durables.",
    keyPoints: [
      "Bootstrapping: Autofinancement initial",
      "Love money: Famille et amis",
      "Crowdfunding: Financement participatif",
      "Business angels: Investisseurs providentiels",
      "Fonds d'impact: Capital-risque vert",
      "Subventions publiques et européennes"
    ],
    type: "content",
    icon: "Coins"
  },
  {
    id: 52,
    module: "7. Financement",
    title: "Crowdfunding et Financement Participatif",
    content: "Mobiliser la communauté autour de votre projet vert.",
    keyPoints: [
      "Plateformes: Ulule, KissKissBankBank, Lita.co",
      "Types: Don, prêt, investissement",
      "Avantages: Validation marché + financement",
      "Campagne réussie: Storytelling et contreparties",
      "Montants: 5 000€ à 500 000€+",
      "Communauté engagée dès le lancement"
    ],
    type: "content",
    icon: "Users"
  },
  {
    id: 53,
    module: "7. Financement",
    title: "Investissement à Impact",
    content: "Attirer les investisseurs recherchant rendement ET impact.",
    keyPoints: [
      "Fonds d'impact: Phitrust, Mirova, Impact Partners",
      "Critères ESG: Performance extra-financière",
      "Due diligence impact: Mesure et reporting",
      "Patient capital: Vision long terme",
      "Ticket moyen: 100k€ à plusieurs millions",
      "Accompagnement stratégique inclus"
    ],
    type: "content",
    icon: "TrendingUp"
  },
  {
    id: 54,
    module: "7. Financement",
    title: "Subventions et Aides Publiques",
    content: "Accéder aux dispositifs de soutien pour les projets verts.",
    keyPoints: [
      "ADEME: Agence de la transition écologique",
      "Bpifrance: Prêts verts et garanties",
      "Régions: Aides locales à l'innovation",
      "Europe: Horizon Europe, LIFE, Green Deal",
      "Crédit Impôt Recherche (CIR)",
      "Jeune Entreprise Innovante (JEI)"
    ],
    type: "content",
    icon: "Award"
  },
  {
    id: 55,
    module: "7. Financement",
    title: "Green Bonds et Obligations Vertes",
    content: "Financement par la dette pour les projets environnementaux.",
    keyPoints: [
      "Définition: Obligations dédiées projets verts",
      "Certification: Climate Bonds Standard",
      "Émetteurs: Entreprises, collectivités, États",
      "Avantages: Taux préférentiels, image",
      "Reporting annuel d'impact obligatoire",
      "Marché en croissance exponentielle"
    ],
    type: "content",
    icon: "FileText"
  },
  {
    id: 56,
    module: "7. Financement",
    title: "Préparer sa Levée de Fonds",
    content: "Les étapes clés pour convaincre les investisseurs.",
    keyPoints: [
      "Pitch deck: 12-15 slides percutantes",
      "Business plan détaillé et projections",
      "Mesure d'impact: Théorie du changement",
      "Data room: Documentation complète",
      "Valorisation réaliste et négociable",
      "Term sheet et négociation"
    ],
    type: "content",
    icon: "Presentation"
  },
  {
    id: 57,
    module: "7. Financement",
    title: "Relations Investisseurs",
    content: "Maintenir une relation de confiance avec vos financeurs.",
    keyPoints: [
      "Reporting régulier: Mensuel ou trimestriel",
      "Transparence sur les difficultés",
      "Communication proactive",
      "Réunions du board structurées",
      "KPIs financiers ET impact",
      "Anticipation des besoins futurs"
    ],
    type: "content",
    icon: "Handshake"
  },
  {
    id: 58,
    module: "7. Financement",
    title: "Points Clés - Financement",
    content: "Récapitulatif des stratégies de financement vert.",
    keyPoints: [
      "Diversifier les sources de financement",
      "L'impact attire de nouveaux investisseurs",
      "Les subventions ne suffisent pas seules",
      "La transparence renforce la confiance"
    ],
    type: "recap",
    icon: "CheckCircle2"
  },

  // ============================================
  // PARTIE 8: Marketing et Vente Verte (Diapos 59-62)
  // ============================================
  {
    id: 59,
    module: "8. Marketing",
    title: "Marketing Vert Authentique",
    content: "Communiquer sur votre impact sans tomber dans le greenwashing.",
    keyPoints: [
      "Authenticité: Messages basés sur des preuves",
      "Transparence: Communiquer aussi les limites",
      "Storytelling impact: Raconter le changement",
      "Éviter le greenwashing: Preuves et certifications",
      "Cibles: Consommateurs LOHAS sensibilisés",
      "Canaux adaptés: Réseaux sociaux engagés"
    ],
    type: "content",
    icon: "Megaphone"
  },
  {
    id: 60,
    module: "8. Marketing",
    title: "Stratégie de Communication Durable",
    content: "Construire une présence de marque responsable.",
    keyPoints: [
      "Identité de marque verte: Logo, valeurs, ton",
      "Content marketing: Éducation et sensibilisation",
      "Relations presse: Médias spécialisés",
      "Événements: Salons green, conférences impact",
      "Partenariats: Influenceurs engagés",
      "Mesure: Engagement et notoriété responsable"
    ],
    type: "content",
    icon: "Globe"
  },
  {
    id: 61,
    module: "8. Marketing",
    title: "Vente B2B et B2C Verte",
    content: "Adapter son approche commerciale aux clients durables.",
    keyPoints: [
      "B2B: RSE des grands groupes comme levier",
      "Argumentaire impact: ROI + valeur sociétale",
      "Certifications: Preuve de crédibilité",
      "B2C: Éducation et simplification du message",
      "Premium justifié par la qualité durable",
      "Fidélisation par les valeurs partagées"
    ],
    type: "content",
    icon: "ShoppingBag"
  },
  {
    id: 62,
    module: "8. Marketing",
    title: "Points Clés - Marketing",
    content: "Récapitulatif du marketing et de la vente verte.",
    keyPoints: [
      "L'authenticité est non négociable",
      "Le greenwashing détruit la confiance",
      "L'impact est un argument de vente",
      "La communauté amplifie le message"
    ],
    type: "recap",
    icon: "CheckCircle2"
  },

  // ============================================
  // PARTIE 9: Réglementations (Diapos 63-66)
  // ============================================
  {
    id: 63,
    module: "9. Réglementations",
    title: "Cadre Réglementaire Environnemental",
    content: "Comprendre les obligations légales et les opportunités.",
    keyPoints: [
      "Droit de l'environnement: Obligations générales",
      "ICPE: Installations Classées",
      "REP: Responsabilité Élargie du Producteur",
      "Bilan carbone: Obligation pour certaines tailles",
      "Devoir de vigilance: Grandes entreprises",
      "Taxonomie verte européenne"
    ],
    type: "content",
    icon: "FileText"
  },
  {
    id: 64,
    module: "9. Réglementations",
    title: "Certifications et Labels",
    content: "Les certifications qui renforcent la crédibilité.",
    keyPoints: [
      "B Corp: Impact global de l'entreprise",
      "ISO 14001: Management environnemental",
      "ISO 26000: Responsabilité sociétale",
      "Labels produits: Ecolabel, Agriculture Bio",
      "Labels bâtiment: HQE, BREEAM, LEED",
      "Labels carbone: Bas carbone, Neutralité"
    ],
    type: "content",
    icon: "Award"
  },
  {
    id: 65,
    module: "9. Réglementations",
    title: "Conformité et Anticipation",
    content: "Transformer la réglementation en avantage compétitif.",
    keyPoints: [
      "Veille réglementaire: Anticiper les changements",
      "Conformité proactive: Au-delà du minimum",
      "Avantage premier entrant: Être prêt avant les autres",
      "Lobbying positif: Contribuer à l'élaboration",
      "Formation équipes: Culture de conformité",
      "Documentation: Preuves et traçabilité"
    ],
    type: "content",
    icon: "Shield"
  },
  {
    id: 66,
    module: "9. Réglementations",
    title: "Points Clés - Réglementations",
    content: "Récapitulatif du cadre réglementaire.",
    keyPoints: [
      "La réglementation s'intensifie rapidement",
      "L'anticipation crée un avantage compétitif",
      "Les certifications renforcent la crédibilité",
      "La conformité protège et valorise l'entreprise"
    ],
    type: "recap",
    icon: "CheckCircle2"
  },

  // ============================================
  // PARTIE 10: Croissance et Expansion (Diapos 67-69)
  // ============================================
  {
    id: 67,
    module: "10. Croissance",
    title: "Stratégies de Croissance Durable",
    content: "Scaler sans compromettre la mission et l'impact.",
    keyPoints: [
      "Croissance maîtrisée: Qualité avant quantité",
      "Préserver la mission: L'impact guide la croissance",
      "Internationalisation: Réplication du modèle",
      "Partenariats stratégiques: Accélérer sans diluer",
      "Innovation continue: Nouveaux produits/marchés",
      "Mesure d'impact à l'échelle"
    ],
    type: "content",
    icon: "TrendingUp"
  },
  {
    id: 68,
    module: "10. Croissance",
    title: "Mesure d'Impact à l'Échelle",
    content: "Maintenir la rigueur de mesure pendant la croissance.",
    keyPoints: [
      "KPIs impact intégrés au pilotage",
      "Reporting automatisé et fréquent",
      "Théorie du changement actualisée",
      "Audits externes réguliers",
      "Communication transparente des résultats",
      "Amélioration continue basée sur les données"
    ],
    type: "content",
    icon: "BarChart3"
  },
  {
    id: 69,
    module: "10. Croissance",
    title: "Exit et Transmission",
    content: "Préparer l'avenir de l'entreprise au-delà des fondateurs.",
    keyPoints: [
      "Mission lock: Protéger la mission dans les statuts",
      "Exit à impact: Choisir des repreneurs alignés",
      "Transmission interne: Former la relève",
      "SCIC: Transmission aux parties prenantes",
      "Fondation: Pérenniser l'impact",
      "Legacy: L'empreinte positive durable"
    ],
    type: "content",
    icon: "Gift"
  },

  // ============================================
  // PARTIE 11: Conclusion (Diapo 70)
  // ============================================
  {
    id: 70,
    module: "11. Conclusion",
    title: "Conclusion et Points Clés",
    content: "Vous êtes maintenant équipé pour créer et développer une entreprise verte durable et viable.",
    keyPoints: [
      "L'entrepreneuriat vert est économiquement viable",
      "Les trois piliers sont indissociables",
      "Le marché et la réglementation sont favorables",
      "L'impact attire talents et financements",
      "La croissance doit préserver la mission",
      "Passez à l'action : le monde a besoin de vous !"
    ],
    type: "intro",
    icon: "Rocket"
  }
];

export default greenBMSlides;
