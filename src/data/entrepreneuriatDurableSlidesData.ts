// Entrepreneuriat Durable - Slides Data
// Based on Dressler, Haldar and international best practices

export interface DurableSlide {
  id: number;
  module: string;
  title: string;
  type: "intro" | "content" | "framework" | "case-study" | "recap";
  content: {
    definition?: string;
    keyPoints?: string[];
    table?: { headers: string[]; rows: string[][] };
    framework?: { title: string; elements: { name: string; description: string; icon?: string }[] };
    caseStudy?: { name: string; sector: string; context: string; impact: string; lesson: string };
    quote?: string;
  };
  icon: string;
  color: string;
}

export const DURABLE_MODULES = [
  { id: 1, name: "Introduction", color: "bg-emerald-600", slides: [1, 5] },
  { id: 2, name: "Fondamentaux Théoriques", color: "bg-teal-600", slides: [6, 12] },
  { id: 3, name: "Profil Entrepreneur", color: "bg-cyan-600", slides: [13, 18] },
  { id: 4, name: "Stratégie & Gouvernance", color: "bg-blue-600", slides: [19, 26] },
  { id: 5, name: "Modèles Économiques", color: "bg-indigo-600", slides: [27, 35] },
];

export const ENTREPRENEURIAT_DURABLE_SLIDES: DurableSlide[] = [
  // Module 1: Introduction
  {
    id: 1,
    module: "Introduction",
    title: "Entrepreneuriat Durable et Modèles Économiques Innovants",
    type: "intro",
    content: {
      definition: "Un guide stratégique et méthodique pour les futurs leaders du changement. Formation Elite 2026 basée sur les recherches de Dressler, Haldar et les meilleures pratiques internationales.",
      keyPoints: [
        "Comprendre les enjeux du XXIe siècle",
        "Maîtriser les cadres théoriques du développement durable",
        "Concevoir des business models innovants et responsables",
        "Développer une vision stratégique à long terme",
        "Acquérir les compétences de leadership éthique"
      ]
    },
    icon: "Globe",
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 2,
    module: "Introduction",
    title: "Définition de l'Entrepreneuriat Durable",
    type: "content",
    content: {
      definition: "L'entrepreneuriat durable est une approche qui intègre les dimensions économique, environnementale et sociale dans la création et la gestion d'entreprises, visant à générer de la valeur à long terme pour toutes les parties prenantes.",
      keyPoints: [
        "Création de richesse tout en régénérant les écosystèmes naturels",
        "Renforcement du tissu social par l'activité économique",
        "Vision à long terme intégrant les générations futures",
        "Équilibre entre profit, planète et personnes"
      ],
      quote: "Créer de la richesse tout en régénérant les écosystèmes naturels et en renforçant le tissu social."
    },
    icon: "Leaf",
    color: "from-emerald-500/20 to-green-500/10"
  },
  {
    id: 3,
    module: "Introduction",
    title: "Les Grands Enjeux du XXIe Siècle",
    type: "framework",
    content: {
      framework: {
        title: "Trois Dimensions des Enjeux",
        elements: [
          { 
            name: "Climatiques", 
            description: "Réchauffement global, Transition énergétique, Économie bas-carbone",
            icon: "Thermometer"
          },
          { 
            name: "Sociaux", 
            description: "Inégalités croissantes, Emploi durable, Inclusion sociale",
            icon: "Users"
          },
          { 
            name: "Économiques", 
            description: "Volatilité des marchés, Raréfaction des ressources, Nouveaux modèles",
            icon: "TrendingUp"
          }
        ]
      }
    },
    icon: "Globe",
    color: "from-teal-500/20 to-cyan-500/10"
  },
  {
    id: 4,
    module: "Introduction",
    title: "Plan du Cours - Vue d'Ensemble",
    type: "content",
    content: {
      definition: "Formation de 30 heures en format hybride combinant théorie et ateliers pratiques.",
      table: {
        headers: ["Modules", "Contenu", "Durée"],
        rows: [
          ["1-3", "Fondamentaux & Profil Entrepreneur", "10h"],
          ["4-6", "Stratégie & Business Models", "10h"],
          ["7-11", "Innovation & Pratique", "10h"]
        ]
      }
    },
    icon: "BookOpen",
    color: "from-emerald-500/20 to-emerald-500/5"
  },
  {
    id: 5,
    module: "Introduction",
    title: "Objectifs du Cours",
    type: "recap",
    content: {
      keyPoints: [
        "Maîtriser les cadres théoriques du développement durable",
        "Concevoir des business models innovants et responsables",
        "Développer une vision stratégique à long terme",
        "Acquérir les compétences de leadership éthique",
        "Mettre en pratique via des études de cas réels"
      ]
    },
    icon: "Target",
    color: "from-emerald-500/20 to-emerald-500/5"
  },

  // Module 2: Fondamentaux Théoriques
  {
    id: 6,
    module: "Fondamentaux Théoriques",
    title: "Le Triptyque du Développement Durable",
    type: "framework",
    content: {
      definition: "Au cœur de l'entreprise durable: l'équilibre entre les trois dimensions environnement, social et économie.",
      framework: {
        title: "Les Trois Piliers",
        elements: [
          { name: "Environnement", description: "Protection des ressources naturelles et biodiversité" },
          { name: "Social", description: "Équité, bien-être des parties prenantes, inclusion" },
          { name: "Économie", description: "Viabilité financière et création de valeur durable" }
        ]
      },
      quote: "L'intersection des trois piliers crée une zone de viabilité où l'entreprise peut prospérer durablement."
    },
    icon: "Triangle",
    color: "from-teal-500/20 to-teal-500/5"
  },
  {
    id: 7,
    module: "Fondamentaux Théoriques",
    title: "Triple Bottom Line (3BL)",
    type: "framework",
    content: {
      definition: "Concept développé par John Elkington (1994): mesurer la performance sur trois axes simultanément.",
      framework: {
        title: "Les 3P",
        elements: [
          { name: "Profit", description: "Viabilité économique et performance financière" },
          { name: "Planet", description: "Impact environnemental et empreinte écologique" },
          { name: "People", description: "Impact social et bien-être des parties prenantes" }
        ]
      },
      quote: "Application: Mesurer la performance sur ces 3 axes simultanément."
    },
    icon: "PieChart",
    color: "from-teal-500/20 to-emerald-500/10"
  },
  {
    id: 8,
    module: "Fondamentaux Théoriques",
    title: "Stakeholder Theory",
    type: "content",
    content: {
      definition: "R. Edward Freeman (1984): L'entreprise doit créer de la valeur pour TOUTES ses parties prenantes, pas seulement les actionnaires.",
      keyPoints: [
        "Employés: Conditions de travail, développement professionnel",
        "Clients: Qualité, satisfaction, expérience",
        "Communauté: Impact local, contribution sociale",
        "Fournisseurs: Relations équitables, partenariats durables",
        "Investisseurs: Rendement responsable",
        "Environnement: Préservation des écosystèmes"
      ]
    },
    icon: "Network",
    color: "from-cyan-500/20 to-teal-500/10"
  },
  {
    id: 9,
    module: "Fondamentaux Théoriques",
    title: "Le Rôle des PME",
    type: "content",
    content: {
      definition: "90% des entreprises mondiales sont des PME. Elles jouent un rôle crucial dans la transition durable.",
      table: {
        headers: ["Avantages", "Défis", "Opportunités"],
        rows: [
          ["Agilité", "Ressources limitées", "Niches vertes"],
          ["Proximité territoriale", "Accès au financement", "Économie locale"],
          ["Innovation rapide", "Compétences techniques", "Coopération"]
        ]
      }
    },
    icon: "Building2",
    color: "from-teal-500/20 to-blue-500/10"
  },
  {
    id: 10,
    module: "Fondamentaux Théoriques",
    title: "Économie Circulaire - Principes",
    type: "framework",
    content: {
      definition: "Boucle fermée: chaque sortie devient une entrée. Objectif: zéro déchet.",
      framework: {
        title: "Cycle de l'Économie Circulaire",
        elements: [
          { name: "Conception", description: "Design pour durabilité et recyclabilité" },
          { name: "Production", description: "Processus optimisés, matériaux recyclés" },
          { name: "Distribution", description: "Logistique verte, emballages réutilisables" },
          { name: "Usage", description: "Prolonger la durée de vie, réparation" },
          { name: "Collecte/Recyclage", description: "Récupération et transformation" },
          { name: "Régénération", description: "Retour des matières dans le cycle" }
        ]
      }
    },
    icon: "Recycle",
    color: "from-emerald-500/20 to-green-500/10"
  },
  {
    id: 11,
    module: "Fondamentaux Théoriques",
    title: "Économie de la Fonctionnalité",
    type: "content",
    content: {
      definition: "Vendre l'usage plutôt que le produit. Principe: l'entreprise reste propriétaire et responsable du produit.",
      keyPoints: [
        "Michelin vend des kilomètres parcourus, pas des pneus",
        "Philips vend de la lumière, pas des ampoules",
        "Xerox vend des copies, pas des photocopieurs",
        "Revenus récurrents et fidélisation client",
        "Incitation à la durabilité et à la réparation",
        "Réduction des déchets et de l'obsolescence programmée"
      ],
      caseStudy: {
        name: "Michelin Fleet Solutions",
        sector: "Transport/Pneumatiques",
        context: "Vente de kilomètres au lieu de pneus pour flottes de camions",
        impact: "Réduction de 20% de la consommation de pneus, maintenance optimisée",
        lesson: "L'alignement d'intérêts entre client et fournisseur favorise la durabilité"
      }
    },
    icon: "RefreshCw",
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 12,
    module: "Fondamentaux Théoriques",
    title: "Points Clés - Fondamentaux",
    type: "recap",
    content: {
      keyPoints: [
        "Le développement durable repose sur 3 piliers interdépendants",
        "La Triple Bottom Line mesure profit, planète et personnes",
        "La Stakeholder Theory élargit la responsabilité au-delà des actionnaires",
        "L'économie circulaire vise le zéro déchet",
        "L'économie de la fonctionnalité aligne intérêts économiques et environnementaux"
      ]
    },
    icon: "CheckCircle2",
    color: "from-teal-500/20 to-teal-500/5"
  },

  // Module 3: Profil de l'Entrepreneur Durable
  {
    id: 13,
    module: "Profil Entrepreneur",
    title: "Caractéristiques Clés de l'Entrepreneur Durable",
    type: "framework",
    content: {
      framework: {
        title: "Les 6 Caractéristiques Essentielles",
        elements: [
          { name: "Créativité", description: "Capacité à imaginer des solutions innovantes aux problèmes sociétaux" },
          { name: "Résilience", description: "Persévérance face aux obstacles et capacité d'adaptation" },
          { name: "Vision long terme", description: "Pensée systémique et anticipation des impacts futurs" },
          { name: "Empathie", description: "Compréhension profonde des besoins des parties prenantes" },
          { name: "Intégrité", description: "Cohérence entre valeurs déclarées et actions concrètes" },
          { name: "Conscience systémique", description: "Compréhension des interconnexions globales" }
        ]
      }
    },
    icon: "Brain",
    color: "from-cyan-500/20 to-cyan-500/5"
  },
  {
    id: 14,
    module: "Profil Entrepreneur",
    title: "Compétences Essentielles",
    type: "content",
    content: {
      definition: "Les compétences clés pour réussir en entrepreneuriat durable.",
      table: {
        headers: ["Compétence", "Description"],
        rows: [
          ["Leadership Éthique", "Inspire et mobilise autour de valeurs partagées"],
          ["Pensée Stratégique", "Analyse, planification et exécution durable"],
          ["Gestion du Changement", "Accompagne les transformations organisationnelles"],
          ["Innovation Systémique", "Repense modèles et processus en profondeur"],
          ["Intelligence Émotionnelle", "Gère émotions et relations interpersonnelles"],
          ["Maîtrise Financière", "Équilibre rentabilité et impact positif"]
        ]
      }
    },
    icon: "Award",
    color: "from-cyan-500/20 to-blue-500/10"
  },
  {
    id: 15,
    module: "Profil Entrepreneur",
    title: "Étude de Cas - Interface (Ray Anderson)",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Interface",
        sector: "Textile/Moquette industrielle",
        context: "Vision 'Mission Zero' - éliminer tout impact négatif d'ici 2020",
        impact: "-96% émissions GES, rentabilité maintenue, leader mondial de la moquette durable",
        lesson: "Une vision ambitieuse combinée à l'innovation continue peut transformer une industrie entière"
      },
      keyPoints: [
        "Économie circulaire: recyclage des moquettes usagées",
        "Innovation matériaux: fibres recyclées et bio-sourcées",
        "Modèle Net-Works: collecte de filets de pêche dans les pays en développement",
        "Preuve qu'écologie et rentabilité sont compatibles"
      ]
    },
    icon: "Building2",
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 16,
    module: "Profil Entrepreneur",
    title: "Étude de Cas - Barefoot College (Bunker Roy)",
    type: "case-study",
    content: {
      caseStudy: {
        name: "Barefoot College",
        sector: "Éducation/Énergie solaire - Inde",
        context: "Former des femmes rurales analphabètes en ingénierie solaire",
        impact: "Électrification de 1000+ villages, autonomisation de communautés entières",
        lesson: "L'innovation frugale et l'apprentissage par la pratique peuvent résoudre des problèmes systémiques"
      },
      keyPoints: [
        "Formation de 'Solar Mamas' en 6 mois",
        "Approche participative et communautaire",
        "Modèle répliqué dans 96 pays",
        "Impact social: éducation, santé, égalité des genres"
      ]
    },
    icon: "Sun",
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 17,
    module: "Profil Entrepreneur",
    title: "Le Processus d'Apprentissage",
    type: "framework",
    content: {
      framework: {
        title: "Les 4 Phases de l'Entrepreneur Durable",
        elements: [
          { name: "Phase 1: Prise de conscience", description: "Comprendre les enjeux systémiques du développement durable" },
          { name: "Phase 2: Développement des compétences", description: "Formation technique, leadership, gestion stratégique" },
          { name: "Phase 3: Expérimentation", description: "Prototypage, tests, itérations sur le modèle" },
          { name: "Phase 4: Mise à l'échelle", description: "Croissance responsable, essaimage, impact systémique" }
        ]
      }
    },
    icon: "GraduationCap",
    color: "from-indigo-500/20 to-purple-500/10"
  },
  {
    id: 18,
    module: "Profil Entrepreneur",
    title: "Points Clés - Profil Entrepreneur",
    type: "recap",
    content: {
      keyPoints: [
        "6 caractéristiques clés: créativité, résilience, vision, empathie, intégrité, conscience systémique",
        "Compétences essentielles combinant hard skills et soft skills",
        "Apprentissage continu à travers 4 phases progressives",
        "Exemples inspirants: Interface, Barefoot College montrent que c'est possible"
      ]
    },
    icon: "CheckCircle2",
    color: "from-cyan-500/20 to-cyan-500/5"
  },

  // Module 4: Stratégie & Gouvernance
  {
    id: 19,
    module: "Stratégie & Gouvernance",
    title: "Vision, Mission, Valeurs",
    type: "framework",
    content: {
      framework: {
        title: "Le Triptyque Stratégique",
        elements: [
          { 
            name: "VISION", 
            description: "L'état futur souhaité - l'étoile polaire de l'organisation. Ex: 'Leader mobilité zéro-carbone Europe 2035'" 
          },
          { 
            name: "MISSION", 
            description: "La raison d'être - pourquoi l'entreprise existe. Ex: 'Faciliter l'accès à des transports propres pour tous'" 
          },
          { 
            name: "VALEURS", 
            description: "Les principes qui guident décisions et comportements. Ex: Transparence, Innovation, Inclusivité" 
          }
        ]
      }
    },
    icon: "Target",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    id: 20,
    module: "Stratégie & Gouvernance",
    title: "SWOT Durable",
    type: "content",
    content: {
      definition: "L'analyse SWOT intégrant les dimensions environnementales et sociales dans chaque quadrant.",
      table: {
        headers: ["Forces", "Faiblesses"],
        rows: [
          ["Expertise technique verte", "Coûts de production élevés"],
          ["Réputation RSE", "Manque de notoriété"],
          ["Chaîne locale", "Dépendance certifications"],
          ["Culture d'innovation", "Équipe réduite"]
        ]
      },
      keyPoints: [
        "Opportunités: Demande croissante produits durables, Subventions vertes, Partenariats stratégiques",
        "Menaces: Concurrence accrue, Greenwashing généralisé, Volatilité réglementaire"
      ]
    },
    icon: "Grid3X3",
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 21,
    module: "Stratégie & Gouvernance",
    title: "Analyse PESTEL Durable",
    type: "framework",
    content: {
      framework: {
        title: "Les 6 Dimensions PESTEL",
        elements: [
          { name: "Politique", description: "Politiques climatiques, Accords de Paris, Subventions vertes, Réglementation RSE" },
          { name: "Économique", description: "Prix carbone, Finance verte, Taxonomie UE, Coût des ressources naturelles" },
          { name: "Socioculturel", description: "Consommation responsable, Sensibilité écologique, Attentes jeunes générations" },
          { name: "Technologique", description: "Énergies renouvelables, IA pour optimisation ressources, Blockchain traçabilité" },
          { name: "Environnemental", description: "Changement climatique, Raréfaction ressources, Biodiversité, Pollution" },
          { name: "Légal", description: "Directive CSRD, Loi devoir de vigilance, ISO 14001, Labels écologiques" }
        ]
      }
    },
    icon: "Layers",
    color: "from-indigo-500/20 to-purple-500/10"
  },
  {
    id: 22,
    module: "Stratégie & Gouvernance",
    title: "Carte d'Alignement Stratégique",
    type: "content",
    content: {
      definition: "De la Vision aux Actions Opérationnelles: un alignement cohérent à tous les niveaux.",
      keyPoints: [
        "Vision Stratégique → Objectifs Stratégiques (ex: 30% réduction CO₂)",
        "Objectifs → Initiatives (ex: Flotte électrique, Partenariats verts)",
        "Initiatives → KPIs (ex: Tonnes CO₂, NPS, ROI)",
        "KPIs → Actions Opérationnelles (ex: Formation équipes, Audit fournisseurs)"
      ]
    },
    icon: "MapPin",
    color: "from-blue-500/20 to-cyan-500/10"
  },
  {
    id: 23,
    module: "Stratégie & Gouvernance",
    title: "Gouvernance Partagée",
    type: "content",
    content: {
      definition: "Principes de gouvernance durable pour une prise de décision responsable.",
      keyPoints: [
        "Transparence et reporting extra-financier",
        "Participation des parties prenantes aux décisions",
        "Comités dédiés (RSE, Éthique, Impact)",
        "Rémunération indexée sur critères ESG",
        "Modèles coopératifs ou sociétés à mission"
      ],
      caseStudy: {
        name: "Patagonia",
        sector: "Textile outdoor",
        context: "1% for the Planet, actionnariat environnemental, transparence supply chain complète",
        impact: "Marque la plus respectée dans l'outdoor, croissance continue malgré anti-croissance",
        lesson: "La gouvernance responsable peut être un avantage compétitif majeur"
      }
    },
    icon: "Users",
    color: "from-purple-500/20 to-pink-500/10"
  },
  {
    id: 24,
    module: "Stratégie & Gouvernance",
    title: "Évaluation d'un Business Model Durable",
    type: "framework",
    content: {
      framework: {
        title: "Grille d'Analyse à 5 Dimensions",
        elements: [
          { name: "Viabilité Économique", description: "Sources revenus diversifiées? Marge suffisante? Scalabilité?" },
          { name: "Impact Environnemental", description: "Réduction nette empreinte? ACV positive? Circularité?" },
          { name: "Impact Social", description: "Création d'emplois? Inclusion? Bien-être parties prenantes?" },
          { name: "Gouvernance", description: "Transparence? Participation? Responsabilité?" },
          { name: "Résilience", description: "Capacité d'adaptation? Robustesse face aux chocs?" }
        ]
      }
    },
    icon: "ClipboardCheck",
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 25,
    module: "Stratégie & Gouvernance",
    title: "Mesure d'Impact - Indicateurs Clés",
    type: "content",
    content: {
      definition: "Les indicateurs pour mesurer la performance durable au-delà du financier.",
      table: {
        headers: ["Dimension", "Indicateurs"],
        rows: [
          ["Environnement", "Tonnes CO₂ évitées, % recyclage, Consommation eau/énergie"],
          ["Social", "NPS, Turnover, Index diversité, Heures formation"],
          ["Économie", "CA vert, Marge EBITDA, Part clients B Corp"],
          ["Gouvernance", "Score ESG, % femmes direction, Audits éthiques"]
        ]
      }
    },
    icon: "BarChart3",
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 26,
    module: "Stratégie & Gouvernance",
    title: "Points Clés - Stratégie & Gouvernance",
    type: "recap",
    content: {
      keyPoints: [
        "Vision-Mission-Valeurs forment le triptyque stratégique fondateur",
        "SWOT et PESTEL doivent intégrer les dimensions durables",
        "L'alignement stratégique assure la cohérence vision → action",
        "La gouvernance partagée renforce la légitimité et la performance",
        "La mesure d'impact va au-delà des indicateurs financiers traditionnels"
      ]
    },
    icon: "CheckCircle2",
    color: "from-blue-500/20 to-blue-500/5"
  },

  // Module 5: Modèles Économiques Durables
  {
    id: 27,
    module: "Modèles Économiques",
    title: "Canvas du Business Model Durable",
    type: "framework",
    content: {
      definition: "Adaptation du Business Model Canvas intégrant les dimensions environnementales et sociales.",
      framework: {
        title: "Les 9 Blocs + Impact",
        elements: [
          { name: "Proposition de Valeur", description: "Économique (ROI) + Environnementale (-CO₂) + Sociale (emplois locaux)" },
          { name: "Partenaires Clés", description: "ONG, fournisseurs éthiques, collectivités, coopératives" },
          { name: "Activités Clés", description: "Production circulaire, R&D verte, sensibilisation" },
          { name: "Ressources Clés", description: "Matériaux recyclés, énergies renouvelables, savoir-faire" },
          { name: "Relations Clients", description: "Communauté, transparence, co-création" }
        ]
      }
    },
    icon: "Layout",
    color: "from-indigo-500/20 to-indigo-500/5"
  },
  {
    id: 28,
    module: "Modèles Économiques",
    title: "Typologie des Modèles Innovants",
    type: "content",
    content: {
      definition: "Les principaux modèles économiques durables et leurs caractéristiques.",
      table: {
        headers: ["Modèle", "Principe", "Exemple"],
        rows: [
          ["Économie de la Fonctionnalité", "Vendre l'usage plutôt que le produit", "Michelin vend des km"],
          ["Plateformes Circulaires", "Connecter offre/demande ressources réutilisables", "Too Good To Go, Vinted"],
          ["Business to Nature (B2N)", "Entreprises régénératives", "Agriculture régénérative"],
          ["Freemium Vert", "Service gratuit + premium impact renforcé", "Apps carbone"],
          ["Pay-What-You-Can", "Prix libre basé sur capacité contributive", "Restaurants solidaires"],
          ["Cross-Subsidization", "Marché premium finance accès vulnérables", "Produits éco-solidaires"]
        ]
      }
    },
    icon: "Lightbulb",
    color: "from-purple-500/20 to-pink-500/10"
  },
  {
    id: 29,
    module: "Modèles Économiques",
    title: "B Corp et Entreprises Sociales",
    type: "content",
    content: {
      definition: "Standards mesurables d'impact social et environnemental.",
      keyPoints: [
        "Certification B Corp: 200+ points de contrôle",
        "Gouvernance inclusive: Participation des parties prenantes",
        "Transparence: Communication ouverte et reporting",
        "Entreprise sociale: Profit + impact positif",
        "Réévaluation tous les 3 ans",
        "Avantages: Crédibilité, réseau mondial, croissance différenciée"
      ],
      caseStudy: {
        name: "Danone North America",
        sector: "Agroalimentaire",
        context: "Plus grande B Corp au monde avec $6 milliards de CA",
        impact: "Engagements environnementaux contraignants, gouvernance stakeholder",
        lesson: "La certification B Corp est accessible même aux grandes entreprises"
      }
    },
    icon: "Award",
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 30,
    module: "Modèles Économiques",
    title: "Investissement à Impact",
    type: "content",
    content: {
      definition: "Profit financier + impact positif mesurable.",
      keyPoints: [
        "ESG: Critères Environnementaux, Sociaux, Gouvernance",
        "Double bottom line: Performance financière + impact",
        "Impact Bonds: Financement lié à l'atteinte d'objectifs",
        "Venture capital impact: Investissement à fort potentiel de changement",
        "Mesure d'impact: Indicateurs extra-financiers standardisés",
        "Rapports d'impact réguliers obligatoires"
      ]
    },
    icon: "TrendingUp",
    color: "from-emerald-500/20 to-green-500/10"
  },
  {
    id: 31,
    module: "Modèles Économiques",
    title: "Green Tech et Innovation",
    type: "content",
    content: {
      definition: "Technologies propres pour un avenir durable dans tous les secteurs.",
      keyPoints: [
        "Panneaux solaires: Énergie photovoltaïque nouvelle génération",
        "Véhicules électriques: Mobilité sans émissions",
        "Stockage énergie: Batteries avancées et hydrogène vert",
        "Purification eau: Technologies membranaires et UV",
        "Agriculture de précision: IoT et IA pour réduire les intrants",
        "Innovation frugale: Solutions simples, efficaces, accessibles"
      ]
    },
    icon: "Zap",
    color: "from-cyan-500/20 to-blue-500/10"
  },
  {
    id: 32,
    module: "Modèles Économiques",
    title: "Chaînes d'Approvisionnement Durables",
    type: "content",
    content: {
      definition: "Intégrer la durabilité dans toute la chaîne de valeur.",
      keyPoints: [
        "Achats locaux: Soutenir l'économie locale, réduire transport",
        "Achats éthiques: Commerce équitable, conditions de travail dignes",
        "Certification fournisseurs: Standards et labels vérifiés",
        "Traçabilité: Blockchain et RFID pour transparence totale",
        "Logistique verte: Optimisation des flux, dernière mile propre",
        "Avantages: Moins de risques, réputation, économies long terme"
      ]
    },
    icon: "Link",
    color: "from-teal-500/20 to-emerald-500/10"
  },
  {
    id: 33,
    module: "Modèles Économiques",
    title: "Le Twin Advantage: Digital + Durabilité",
    type: "content",
    content: {
      definition: "Leveraging digital pour la durabilité: la double transition.",
      keyPoints: [
        "IoT pour monitoring environnemental en temps réel",
        "IA pour optimisation des ressources et prédiction",
        "Blockchain pour traçabilité et certification automatique",
        "Plateformes pour économie de partage à grande échelle",
        "Data analytics pour mesure d'impact précise",
        "Digital twins pour simulation et optimisation"
      ],
      quote: "La transition numérique et la transition écologique sont indissociables. Ensemble, elles créent un avantage compétitif durable."
    },
    icon: "Binary",
    color: "from-indigo-500/20 to-purple-500/10"
  },
  {
    id: 34,
    module: "Modèles Économiques",
    title: "AI-Driven Business Model Innovation",
    type: "content",
    content: {
      definition: "L'intelligence artificielle comme catalyseur de l'innovation durable.",
      table: {
        headers: ["Archétype", "Application"],
        rows: [
          ["Optimisation", "Réduction consommation énergie, déchets, émissions"],
          ["Prédiction", "Maintenance prédictive, demande, risques climatiques"],
          ["Personnalisation", "Offres durables adaptées, nudges comportementaux"],
          ["Automatisation", "Reporting ESG, certification, traçabilité"]
        ]
      }
    },
    icon: "Brain",
    color: "from-violet-500/20 to-purple-500/10"
  },
  {
    id: 35,
    module: "Modèles Économiques",
    title: "Points Clés - Modèles Économiques",
    type: "recap",
    content: {
      keyPoints: [
        "Le Canvas durable intègre impact social et environnemental",
        "Multiples typologies: fonctionnalité, circulaire, B2N, cross-subsidization",
        "B Corp et ESG créent des cadres de mesure standardisés",
        "Green Tech et IA accélèrent la transition",
        "La chaîne d'approvisionnement est clé pour l'impact global",
        "Twin Advantage: digital + durabilité = avantage compétitif"
      ]
    },
    icon: "CheckCircle2",
    color: "from-indigo-500/20 to-indigo-500/5"
  }
];
