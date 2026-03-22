// BMC Guide Pratique - Formation pour Startupeurs (Sophie Racquez)
// 91 slides interactives

export interface BMCSlide {
  id: number;
  title: string;
  module: string;
  type: 'intro' | 'concept' | 'case-study' | 'framework' | 'exercise' | 'tools' | 'recap';
  content: {
    definition?: string;
    keyPoints?: string[];
    table?: { headers: string[]; rows: string[][] };
    quote?: string;
    caseStudy?: { name: string; context: string; lesson: string };
    steps?: { step: string; description: string }[];
    tips?: string[];
  };
  color: string;
}

export const BMC_MODULES = [
  { id: 'intro', name: 'Introduction', color: 'bg-gradient-to-br from-emerald-500 to-teal-600', slides: [1, 4] },
  { id: 'motivations', name: 'Motivations', color: 'bg-gradient-to-br from-blue-500 to-indigo-600', slides: [5, 15] },
  { id: 'connaissance', name: 'Se Connaître', color: 'bg-gradient-to-br from-purple-500 to-violet-600', slides: [16, 28] },
  { id: 'bmc-intro', name: 'Business Model', color: 'bg-gradient-to-br from-amber-500 to-orange-600', slides: [29, 32] },
  { id: 'bmc-blocs', name: 'Les 9 Blocs', color: 'bg-gradient-to-br from-rose-500 to-pink-600', slides: [33, 42] },
  { id: 'validation', name: 'Validation', color: 'bg-gradient-to-br from-cyan-500 to-sky-600', slides: [43, 55] },
  { id: 'finance', name: 'Finances', color: 'bg-gradient-to-br from-green-500 to-emerald-600', slides: [56, 68] },
  { id: 'lancement', name: 'Lancement', color: 'bg-gradient-to-br from-indigo-500 to-blue-600', slides: [69, 80] },
  { id: 'croissance', name: 'Croissance', color: 'bg-gradient-to-br from-fuchsia-500 to-purple-600', slides: [81, 91] }
];

export const BMC_SLIDES: BMCSlide[] = [
  // Introduction (1-4)
  {
    id: 1,
    title: "BMC Guide Pratique - Formation pour Startupeurs",
    module: "Introduction",
    type: "intro",
    content: {
      definition: "Transformez votre idée en entreprise viable. Basé sur l'ouvrage de Sophie Racquez.",
      keyPoints: [
        "Formation complète de l'idée au lancement",
        "Maîtriser les 9 blocs du Business Model Canvas",
        "Méthodes de test et validation",
        "Stratégies de croissance"
      ]
    },
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 2,
    title: "Ce que vous allez apprendre",
    module: "Introduction",
    type: "concept",
    content: {
      definition: "Ce programme complet vous guidera de l'idée initiale au lancement de votre entreprise.",
      keyPoints: [
        "Comprendre vos motivations - Identifier pourquoi entreprendre",
        "Vous connaître - Évaluer vos forces et faiblesses",
        "Business Model Canvas - Maîtriser les 9 blocs clés",
        "Valider votre modèle - Méthodes de test et validation",
        "Lancer votre entreprise - Étapes pratiques de démarrage"
      ]
    },
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 3,
    title: "Pourquoi entreprendre aujourd'hui?",
    module: "Introduction",
    type: "concept",
    content: {
      definition: "Entreprendre est avant tout une aventure humaine!",
      keyPoints: [
        "Accessibilité accrue - Plus facile que jamais de lancer",
        "Intérêt grandissant - Public de plus en plus large",
        "Économie des services - Opportunités de création de valeur",
        "Ouverture sans barrières - Plus besoin d'école de commerce",
        "Clarifiez votre vision de vous, de votre idée, de votre projet"
      ],
      quote: "Avant de définir votre projet, clarifiez vos aspirations."
    },
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: 4,
    title: "12 Raisons pour Entreprendre",
    module: "Introduction",
    type: "framework",
    content: {
      definition: "Chaque parcours est unique. Découvrez ce qui peut vous motiver à entreprendre.",
      table: {
        headers: ["Catégorie 1", "Catégorie 2", "Catégorie 3", "Catégorie 4"],
        rows: [
          ["Première vie", "Chômage", "Intrapreneur", "Inventeur"],
          ["Hobby", "Déménagement", "Valeurs humaines", "Consomm'acteur"],
          ["Produit étranger", "Santé", "Télétravail", "Changement"]
        ]
      }
    },
    color: "from-emerald-500/20 to-teal-500/10"
  },
  // Motivations (5-15)
  {
    id: 5,
    title: "David Della Vecchia • RFIDea",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Coincé dans votre première vie?",
      caseStudy: {
        name: "David Della Vecchia - RFIDea",
        context: "Ingénieur en télécoms, brillant mais en désaccord avec sa direction. Rupture de contrat. Vision perspicace sur les technologies RFID.",
        lesson: "Fondée en 2003, acquise par ZETES en 2011. La perte d'emploi peut être la plus grande chance de votre vie."
      },
      quote: "La perte d'emploi peut être la plus grande chance de votre vie : du temps libre pour préparer votre projet."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 6,
    title: "Ressource précieuse : Le temps",
    module: "Motivations",
    type: "concept",
    content: {
      definition: "Sans emploi? Opportunité de redéfinir votre trajectoire!",
      keyPoints: [
        "Liberté temporelle - Disponible à temps plein pour préparer votre projet",
        "Avantage stratégique - Les compétiteurs sont toujours à leur poste",
        "Nécessité comme moteur - Rien à perdre, tout à gagner",
        "Transformez le déficit d'argent en opportunité de création"
      ],
      quote: "David Della Vecchia a transformé son chômage en succès : RFIDea acquise par ZETES après 8 ans."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 7,
    title: "Howard Schultz & Starbucks",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Vision et persévérance",
      caseStudy: {
        name: "Howard Schultz - Starbucks",
        context: "Directeur marketing chez Starbucks en 1982 (4 points de vente). Découvre les cafés italiens à Milan en 1983. Dirigeants refusent sa vision.",
        lesson: "Fonde sa propre affaire, puis rachète Starbucks en 1987 et crée une multinationale."
      },
      quote: "La vision sans persévérance n'est rien. Schultz a transformé 4 cafés en un empire mondial."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 8,
    title: "Exemples de succès - Inventeurs",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "De inventeur à entrepreneur : quand l'innovation ne trouve pas preneur",
      keyPoints: [
        "Google - Refusé par AltaVista et Yahoo, puis devenu leader mondial",
        "Geox - Innovation chaussure respirante, créée après refus des grands fabricants",
        "Luc Michel (Eureka-Concept) - WC sans odeur, prix entreprise la plus innovante 2006"
      ],
      quote: "L'innovation cherche son créateur. Refusée par d'autres, elle prospère chez l'inventeur."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 9,
    title: "Jean-Luc Fonck • Sttellla - Hobby qui prend",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Transformer une passion en activité professionnelle viable",
      caseStudy: {
        name: "Jean-Luc Fonck - Sttellla",
        context: "Chanteur du groupe Sttellla avec succès, travaillant au Ministère de la Justice. Décision courageuse de vivre sa passion.",
        lesson: "Écumer les salles de spectacle, vivre sa passion comme mode de vie."
      },
      tips: [
        "Vie 'métro-boulot-dodo' sans saveur?",
        "Faire des heures sans valeur ajoutée?",
        "Rencontrer plus de succès dans votre hobby?"
      ],
      quote: "À vaincre sans péril, on triomphe sans gloire. Suivez votre passion."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 10,
    title: "Déménagement - Stratégies entrepreneuriales",
    module: "Motivations",
    type: "concept",
    content: {
      definition: "Suivre son conjoint et transformer la contrainte en opportunité entrepreneuriale",
      keyPoints: [
        "Compétences transférables - Utilisez vos compétences pour créer votre activité",
        "Nouveau marché - Opportunités inexploitées dans le pays d'accueil",
        "Indépendance - Éviter les démarches d'embauche complexes",
        "Créativité entrepreneuriale - Transformer l'obstacle en tremplin"
      ],
      quote: "Quand l'économie ne s'adapte pas à vous, adaptez-vous à l'entrepreneuriat."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 11,
    title: "Clean The World - Entrepreneuriat social",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Valeurs plus humaines",
      caseStudy: {
        name: "Shawn Sheipler - Clean The World",
        context: "Voyage d'affaires, observation du manque d'hygiène. Solution innovante : recycler les savons d'hôtel pour les distribuer aux populations démunies.",
        lesson: "12 millions de savons distribués dans 65 pays. Double action : éviter le gaspillage ET sauver des vies."
      },
      keyPoints: [
        "Commerce équitable",
        "Économie sociale",
        "Développement durable",
        "Économie 3.0 - Hybridation"
      ],
      quote: "L'entrepreneuriat social peut changer le monde, un savon à la fois."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 12,
    title: "Consomm'acteur - Créer des solutions",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Créer des solutions pour résoudre vos propres problèmes",
      keyPoints: [
        "Frédéric Monjoie - Chpop : Décapsuleur multiple pour 2, 4, 6 bouteilles (née au vestiaire de foot)",
        "Geox - Chaussures respirantes (première paire créée avec un couteau suisse)"
      ],
      steps: [
        { step: "1. Problème spécifique", description: "Rencontré personnellement" },
        { step: "2. Aucune solution", description: "Sur le marché existant" },
        { step: "3. Création personnelle", description: "Artisanale d'abord" },
        { step: "4. Demande croissante", description: "Détectée progressivement" }
      ],
      quote: "L'innovation commence souvent par la frustration personnelle."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 13,
    title: "Elaine Embree • Silly Bandz - Produit à l'étranger",
    module: "Motivations",
    type: "case-study",
    content: {
      definition: "Importer et adapter des produits innovants pour votre marché",
      caseStudy: {
        name: "Elaine Embree - Silly Bandz",
        context: "Visite USA en 2010, reçoit un bracelet de sa nièce. Phénomène américain dans les cours de récré.",
        lesson: "Partenariat exclusif avec BCP Imports LLC USA. Importation exclusive du produit, premier sur le marché local."
      },
      keyPoints: [
        "Détecter les tendances internationales",
        "Exclusivité d'importation",
        "Premier sur le marché local"
      ],
      quote: "L'innovation voyage. Soyez le premier à l'importer."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 14,
    title: "Ennuis de santé - Changement de carrière",
    module: "Motivations",
    type: "concept",
    content: {
      definition: "Transformer l'adversité en opportunité entrepreneuriale",
      caseStudy: {
        name: "Comédienne → Coach en prise de parole",
        context: "Comédienne talentueuse, carrière prometteuse. Accident grave, perte de capacités physiques malgré la rééducation.",
        lesson: "Devenue coach en prise de parole en public, maximisant l'usage de ses compétences pour aider d'autres."
      },
      tips: [
        "Accident grave nécessitant réorientation",
        "Maladie contraignant à l'arrêt",
        "Capacités physiques diminuées",
        "Vie trop courte pour être mal vécue"
      ],
      quote: "Les obstacles sont des déguisements pour des opportunités."
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  {
    id: 15,
    title: "Télétravail - Flexibilité totale",
    module: "Motivations",
    type: "concept",
    content: {
      definition: "Flexibilité et équilibre vie professionnelle/personnelle",
      keyPoints: [
        "Gestion autonome du temps",
        "Plus de temps pour la famille",
        "Voir ses enfants, partager des moments avec son conjoint"
      ],
      tips: [
        "Autodiscipline requise",
        "Frontière vie pro/vie personnelle ténue",
        "Rythme parfois imposé par le client",
        "Travailler quelques soirs et weekends parfois nécessaire"
      ],
      quote: "Métro-boulot-dodo vers chez vous - mais avec autodiscipline!"
    },
    color: "from-blue-500/20 to-indigo-500/10"
  },
  // Se Connaître (16-28)
  {
    id: 16,
    title: "Changement de carrière - Questions clés",
    module: "Se Connaître",
    type: "exercise",
    content: {
      definition: "Identifier votre véritable valeur ajoutée et votre passion",
      keyPoints: [
        "Quelle est votre valeur ajoutée?",
        "Êtes-vous facilement remplaçable dans votre job actuel?",
        "Éprouvez-vous le flow? (moments de concentration maximale)",
        "Avez-vous des défis motivants?",
        "Êtes-vous l'expert consulté pour des questions spécifiques?"
      ],
      tips: [
        "Tâches algorithmiques - Suivre des instructions précises",
        "Tâches heuristiques - Expérimenter et créer des solutions nouvelles"
      ],
      quote: "Notez vos moments de flow. Ils révéleront votre véritable passion."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 17,
    title: "Les principaux obstacles",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Obstacles courants à l'entrepreneuriat",
      table: {
        headers: ["Manque de ressources", "Soutien familial"],
        rows: [
          ["Pas de temps disponible", "Conjoint non adhérent au projet"],
          ["Finances familiales instables", "Inquiétude des proches"],
          ["Logement trop petit", "Pression environnementale"],
          ["Confiance en soi", "Convaincre les autres"],
          ["Doute de ses capacités", "Idée trop novatrice"],
          ["Peur de l'échec", "Résistance au changement"]
        ]
      }
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 18,
    title: "Solutions pragmatiques",
    module: "Se Connaître",
    type: "tools",
    content: {
      definition: "Des excuses valables ou moins valables",
      keyPoints: [
        "Accordez-vous un temps régulier pour développer votre concept",
        "Progression étape par étape - Avancez pas à pas",
        "Pauses café créatives - Utilisez les petits moments",
        "Les choses se mettent en place quand on va dans la bonne direction"
      ],
      quote: "La régularité vaut mieux que l'intensité. 15 min par jour suffisent."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 19,
    title: "Impliquer son conjoint",
    module: "Se Connaître",
    type: "tools",
    content: {
      definition: "Conjoint non adhérent au projet? Plus fréquent qu'on ne le croit.",
      keyPoints: [
        "Compétences informatiques - Création du site web, maintenance",
        "Design infographique - Création logo, plaquette, identité visuelle",
        "Maîtrise de l'anglais - Traduction, communication internationale",
        "Compétences juridiques - Contrats types, CGV"
      ],
      quote: "Lorsqu'on utilise les compétences du conjoint, son investissement augmente naturellement."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 20,
    title: "Les 4 stades de compétence",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Manquez de confiance en vous? La réussite n'est pas innée.",
      table: {
        headers: ["Stade", "Description"],
        rows: [
          ["1. Incompétence inconsciente", "Je ne sais pas que je ne sais pas"],
          ["2. Incompétence consciente", "Je sais que je ne sais pas"],
          ["3. Compétence consciente", "Je sais que je sais"],
          ["4. Compétence inconsciente", "Je ne sais pas que je sais (gut feeling)"]
        ]
      },
      quote: "Le succès, c'est 1% d'inspiration et 99% de transpiration. — Thomas Edison"
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 21,
    title: "Les génies ont d'abord échoué",
    module: "Se Connaître",
    type: "case-study",
    content: {
      definition: "Du mal à convaincre? Être visionnaire n'est pas facile.",
      keyPoints: [
        "Thomas Edison - 10 000 essais avant l'ampoule. 'J'ai trouvé 10 000 moyens qui ne fonctionnent pas.'",
        "James Dyson - 5 127 prototypes pour l'aspirateur sans sac. Le 5 128ème a réussi.",
        "Walt Disney - 302 banques ont refusé Disney World. La 303ème a dit oui."
      ],
      tips: [
        "Business model documenté",
        "Capacité de rebond",
        "Ténacité à toute épreuve"
      ],
      quote: "La principale qualité de l'entrepreneur est la ténacité. Ne baissez jamais les bras."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 22,
    title: "L'importance de se connaître",
    module: "Se Connaître",
    type: "concept",
    content: {
      definition: "Avant de construire votre entreprise, construisez-vous",
      table: {
        headers: ["Motivations", "Potentiels", "Aspirations"],
        rows: [
          ["Comprendre ce qui vous pousse à entreprendre", "Identifier vos forces uniques", "Clarifier votre vision de vie"]
        ]
      },
      quote: "Entreprendre est avant tout une aventure humaine."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 23,
    title: "Les 4 stades détaillés",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Analogie avec l'apprentissage de la conduite",
      steps: [
        { step: "1. Incompétence inconsciente", description: "L'enfant admire les voitures, persuadé que c'est facile." },
        { step: "2. Incompétence consciente", description: "L'élève s'inscrit à l'auto-école, cale au démarrage, se décourage." },
        { step: "3. Compétence consciente", description: "Permis décroché, maîtrise la conduite mais doit se concentrer." },
        { step: "4. Compétence inconsciente", description: "Gestes automatiques, peut penser à autre chose en conduisant." }
      ],
      quote: "Ne comparez pas votre stade 2 avec quelqu'un à l'étape 4."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 24,
    title: "Théorie des intelligences multiples",
    module: "Se Connaître",
    type: "concept",
    content: {
      definition: "Howard Gardner - Chaque individu possède un mélange unique d'intelligences",
      caseStudy: {
        name: "John Lennon",
        context: "À l'école, il faisait le clown, se battait et ne montrait aucun intérêt pour les matières traditionnelles.",
        lesson: "Il possédait une intelligence musicale-rythmique exceptionnelle."
      },
      quote: "Si vous n'étiez pas bon à l'école, cela ne signifie pas que vous êtes un raté. Vous avez certainement un talent qui ne demande qu'à être développé."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 25,
    title: "Les types d'intelligence (1/3)",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Identifier vos forces naturelles",
      table: {
        headers: ["Intelligence", "Description", "Professions"],
        rows: [
          ["Logico-mathématique", "Capacité de calculer, mesurer, résoudre des problèmes", "Scientifiques, Ingénieurs"],
          ["Spatiale", "Représentation mentale spatiale du monde", "Architectes, Pilotes, Géographes"],
          ["Interpersonnelle", "Capacité à agir correctement avec les autres", "Managers, Diplomates, Thérapeutes"]
        ]
      }
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 26,
    title: "Les types d'intelligence (2/3)",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Chaque intelligence peut être développée",
      table: {
        headers: ["Intelligence", "Description", "Professions"],
        rows: [
          ["Corporelle-kinesthésique", "Utiliser son corps pour exprimer des idées", "Danseurs, Chirurgiens, Artisans"],
          ["Verbo-linguistique", "Penser avec des mots, exprimer des idées complexes", "Orateurs, Avocats, Écrivains"],
          ["Intrapersonnelle", "Représentation précise de soi-même", "Philosophes, Psychologues"]
        ]
      }
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 27,
    title: "Les types d'intelligence (3/3)",
    module: "Se Connaître",
    type: "framework",
    content: {
      definition: "Identifier votre combinaison unique",
      table: {
        headers: ["Intelligence", "Description", "Domaines"],
        rows: [
          ["Musicale-rythmique", "Penser en rythme et mélodies", "Musiciens, Compositeurs"],
          ["Naturaliste-écologiste", "Sensibilité à ce qui est vivant", "Botanistes, Zoologistes, Écologues"],
          ["Existentielle", "Questionner le sens et l'origine des choses", "Philosophes, Spiritualité"]
        ]
      },
      quote: "On ne peut pas cumuler tous les types, mais on peut s'appuyer sur ses forces et s'entourer pour pallier ses lacunes."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  {
    id: 28,
    title: "Identifier vos forces et faiblesses",
    module: "Se Connaître",
    type: "tools",
    content: {
      definition: "Le processus d'évaluation et stratégies de complémentarité",
      steps: [
        { step: "1. Connaissance de soi", description: "Identifiez votre mélange unique d'intelligences" },
        { step: "2. Exploiter vos forces", description: "Construisez votre business model autour de vos atouts" },
        { step: "3. S'entourer intelligemment", description: "Constituez une équipe couvrant les compétences nécessaires" },
        { step: "4. Externaliser", description: "Déléguez les domaines où vous n'excellez pas" },
        { step: "5. Se former", description: "Développez les compétences clés pour votre domaine" }
      ],
      quote: "La clé du succès : s'appuyer sur ses forces et savoir s'entourer."
    },
    color: "from-purple-500/20 to-violet-500/10"
  },
  // Business Model - Introduction (29-32)
  {
    id: 29,
    title: "Qu'est-ce qu'un Business Model?",
    module: "Business Model",
    type: "concept",
    content: {
      definition: "Un business model explique comment votre future entreprise va créer, livrer et capturer de la valeur.",
      table: {
        headers: ["Business Model", "Business Plan"],
        rows: [
          ["Visuel et stratégique", "Document détaillé"],
          ["Structure et hypothèses", "Planification et exécution"],
          ["Plus rapide et agile", "Plus complet"],
          ["Facile à modifier et tester", "Formel et structuré"]
        ]
      },
      keyPoints: [
        "Permet d'itérer et pivoter",
        "Vision d'ensemble claire"
      ]
    },
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 30,
    title: "Les 9 blocs du Business Model Canvas",
    module: "Business Model",
    type: "framework",
    content: {
      definition: "Architecture des 9 blocs - Cost centers vs Profit centers",
      keyPoints: [
        "1. Customer Segments - Qui sont vos clients?",
        "2. Value Propositions - Quelle valeur vous apportez?",
        "3. Channels - Comment toucher vos clients?",
        "4. Customer Relationships - Comment interagir avec eux?",
        "5. Revenue Streams - Comment générez-vous des revenus?",
        "6. Key Resources - Quelles ressources essentielles?",
        "7. Key Activities - Quelles activités cruciales?",
        "8. Key Partners - Qui sont vos partenaires clés?",
        "9. Cost Structure - Quels sont vos coûts?"
      ]
    },
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 31,
    title: "Bloc 1 : Customer Segments",
    module: "Business Model",
    type: "concept",
    content: {
      definition: "Pour qui créez-vous de la valeur? Qui sont vos clients les plus importants?",
      keyPoints: [
        "Marché de masse - Large groupe homogène",
        "Marché de niche - Segment spécifique et spécialisé",
        "Segmenté - Segments distincts avec besoins différents",
        "Diversifié - Segments non liés",
        "Multi-faces - Deux segments interdépendants (ex: plateforme)"
      ],
      tips: [
        "Identifier les caractéristiques communes",
        "Comprendre les besoins spécifiques",
        "Prioriser les segments les plus profitables"
      ]
    },
    color: "from-amber-500/20 to-orange-500/10"
  },
  {
    id: 32,
    title: "Bloc 2 : Value Propositions",
    module: "Business Model",
    type: "concept",
    content: {
      definition: "Quel problème résolvez-vous? Quels bénéfices apportez-vous?",
      keyPoints: [
        "Nouveauté - Innovation jamais offerte",
        "Performance - Amélioration des performances",
        "Personnalisation - Adaptation aux besoins spécifiques",
        "Design - Esthétique et expérience",
        "Marque/Statut - Image et prestige",
        "Prix - Rapport qualité/prix",
        "Réduction des coûts - Économies pour le client",
        "Réduction des risques - Sécurité et garanties",
        "Accessibilité - Rendre disponible ce qui ne l'était pas",
        "Commodité/Usabilité - Facilité d'utilisation"
      ]
    },
    color: "from-amber-500/20 to-orange-500/10"
  },
  // Les 9 Blocs (33-42)
  {
    id: 33,
    title: "Bloc 3 : Channels",
    module: "Les 9 Blocs",
    type: "framework",
    content: {
      definition: "Comment touchons-nous nos clients?",
      table: {
        headers: ["Phase", "Question"],
        rows: [
          ["Conscience", "Comment le client apprend notre existence?"],
          ["Évaluation", "Comment juge-t-il notre valeur?"],
          ["Achat", "Comment achète-t-il?"],
          ["Livraison", "Comment reçoit-il le produit/service?"],
          ["Support", "Comment l'aidons-nous après-vente?"]
        ]
      },
      keyPoints: [
        "Canaux propres - Vente directe, e-commerce, apps",
        "Canaux partenaires - Distribution tierce, boutiques"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 34,
    title: "Bloc 4 : Customer Relationships",
    module: "Les 9 Blocs",
    type: "concept",
    content: {
      definition: "Comment interagissons-nous avec nos clients?",
      keyPoints: [
        "Assistance personnelle - Interaction humaine directe",
        "Assistance dédiée - Un conseiller attitré",
        "Self-service - Autonomie du client",
        "Services automatisés - Systèmes automatisés",
        "Communautés - Plateformes d'échange",
        "Co-création - Clients co-développent"
      ],
      tips: [
        "Acquisition de nouveaux clients",
        "Rétention et fidélisation",
        "Augmentation des ventes (upselling)"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 35,
    title: "Bloc 5 : Revenue Streams",
    module: "Les 9 Blocs",
    type: "concept",
    content: {
      definition: "Les flux de revenus représentent l'argent généré auprès de chaque segment.",
      keyPoints: [
        "Vente d'actifs - Droits de propriété",
        "Frais d'utilisation - Paiement à l'usage",
        "Frais d'abonnement - Accès continu",
        "Prêt/Location - Usage temporaire",
        "Licence - Droits de propriété intellectuelle",
        "Publicité - Espace publicitaire"
      ],
      tips: [
        "Le revenu généré par transaction",
        "Le prix actuel du marché",
        "Les revenus récurrents vs ponctuels"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 36,
    title: "Bloc 6 : Key Resources",
    module: "Les 9 Blocs",
    type: "framework",
    content: {
      definition: "Quelles ressources nous sont essentielles?",
      table: {
        headers: ["Type", "Exemples"],
        rows: [
          ["Physiques", "Installations, bâtiments, véhicules, machines"],
          ["Intellectuelles", "Marques, brevets, bases de données, connaissances"],
          ["Humaines", "Compétences, savoir-faire, expertise, leadership"],
          ["Financières", "Trésorerie, lignes de crédit, réserves"]
        ]
      },
      tips: [
        "Permettent de créer et livrer de la valeur",
        "Atteignent les segments de clients",
        "Gèrent les relations clients"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 37,
    title: "Bloc 7 : Key Activities",
    module: "Les 9 Blocs",
    type: "concept",
    content: {
      definition: "Quelles activités sont cruciales?",
      keyPoints: [
        "Production - Design, développement, fabrication, assemblage, logistique",
        "Résolution de problèmes - Consulting, conseil, support technique",
        "Plateforme/Réseau - Logiciels, apps, marketplaces, collaboration"
      ],
      tips: [
        "Créer et livrer la valeur proposée",
        "Atteindre les segments de marchés",
        "Maintenir les relations clients",
        "Générer des revenus"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 38,
    title: "Bloc 8 : Key Partnerships",
    module: "Les 9 Blocs",
    type: "concept",
    content: {
      definition: "Qui sont nos partenaires clés? Le réseau de fournisseurs et partenaires.",
      keyPoints: [
        "Alliances stratégiques - Entreprises non-concurrentes",
        "Coopétition - Partenariats entre concurrents",
        "Joint ventures - Projets communs"
      ],
      tips: [
        "Optimisation de l'économie et réduction des coûts",
        "Réduction des risques et incertitudes",
        "Acquisition de ressources et activités spécifiques"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 39,
    title: "Bloc 9 : Cost Structure",
    module: "Les 9 Blocs",
    type: "framework",
    content: {
      definition: "Tous les coûts encourus pour faire fonctionner le business model.",
      table: {
        headers: ["Coûts fixes", "Coûts variables"],
        rows: [
          ["Salaires", "Matériaux"],
          ["Loyer", "Expédition"],
          ["Machines", "Services"],
          ["Impôts", "Commissions"]
        ]
      },
      keyPoints: [
        "Économies d'échelle - Coûts unitaires diminuent avec le volume",
        "Économies de gamme - Partage des ressources entre activités",
        "Focus coûts vs Focus valeur"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 40,
    title: "Synthèse du Business Model Canvas",
    module: "Les 9 Blocs",
    type: "recap",
    content: {
      definition: "Intégration des 9 blocs - Le modèle fonctionne quand l'infrastructure supporte la valeur client.",
      keyPoints: [
        "Segments de clients, propositions de valeur, canaux, relations",
        "Chaque bloc influence et est influencé par les autres",
        "Le canvas est un outil vivant qui évolue avec le projet",
        "Itération continue basée sur les apprentissages terrain"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 41,
    title: "Étude de cas : Amazon",
    module: "Les 9 Blocs",
    type: "case-study",
    content: {
      definition: "Application du BMC à Amazon",
      caseStudy: {
        name: "Amazon",
        context: "Consommateurs online, vendeurs tiers, entreprises B2B. Largeur d'offre, prix compétitifs, livraison rapide.",
        lesson: "Multiples flux de revenus : E-commerce, AWS, Advertising, Subscription (Prime)."
      },
      keyPoints: [
        "Partenaires : Vendeurs tiers, fournisseurs, livreurs",
        "Activités : E-commerce, cloud computing, logistique",
        "Ressources : Warehouses, serveurs AWS, réseau de distribution global"
      ]
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  {
    id: 42,
    title: "Exercice : Votre Business Model Canvas",
    module: "Les 9 Blocs",
    type: "exercise",
    content: {
      definition: "Remplissez votre propre Business Model Canvas",
      steps: [
        { step: "1. Segments clients", description: "Identifiez vos 2-3 segments principaux" },
        { step: "2. Proposition de valeur", description: "Définissez votre offre unique" },
        { step: "3. Canaux", description: "Comment atteindre vos clients?" },
        { step: "4. Relations", description: "Type d'interaction avec chaque segment" },
        { step: "5. Revenus", description: "Sources de revenus pour chaque segment" },
        { step: "6-9. Infrastructure", description: "Ressources, activités, partenaires, coûts" }
      ],
      quote: "Commencez par les segments clients et la proposition de valeur, puis construisez l'infrastructure."
    },
    color: "from-rose-500/20 to-pink-500/10"
  },
  // Validation (43-55)
  {
    id: 43,
    title: "Pourquoi valider votre Business Model?",
    module: "Validation",
    type: "concept",
    content: {
      definition: "Valider avant le lancement permet d'éviter des erreurs coûteuses.",
      table: {
        headers: ["Objectif", "Bénéfice"],
        rows: [
          ["Réduire le risque", "Tester vos hypothèses avant d'investir"],
          ["Économiser temps et argent", "Apprendre rapidement et ajuster"],
          ["Comprendre le client", "Obtenir des retours directs"],
          ["Améliorer le produit", "Affiner selon les besoins réels"],
          ["Apprendre et pivoter", "S'adapter sans perdre de temps"],
          ["Gagner en confiance", "Décisions basées sur des données"]
        ]
      },
      quote: "La validation n'est pas une faiblesse, c'est une preuve de professionnalisme."
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 44,
    title: "Méthodes de Recherche de Marché",
    module: "Validation",
    type: "framework",
    content: {
      definition: "Deux approches complémentaires pour comprendre votre marché",
      table: {
        headers: ["Recherche Primaire", "Recherche Secondaire"],
        rows: [
          ["Collecte directe auprès de votre cible", "Analyse de données existantes"],
          ["Entretiens en profondeur (1-1)", "Rapports d'étude de marché"],
          ["Sondages et questionnaires", "Analyse de la concurrence"],
          ["Groupes de discussion (focus groups)", "Sources en ligne et statistiques"]
        ]
      }
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 45,
    title: "Découverte Client",
    module: "Validation",
    type: "tools",
    content: {
      definition: "Comprendre vos futurs clients par l'écoute active",
      keyPoints: [
        "Entretiens ouverts - Questions ouvertes, pas de vente",
        "Écoute active - Plus d'écoute que de parole",
        "Observation directe - Observer les comportements",
        "Prototype et feedback - Tester des maquettes"
      ],
      tips: [
        "Poser des questions 'pourquoi' et 'comment'",
        "Ne pas vendre, mais comprendre",
        "Chercher les problèmes non résolus",
        "Valider les hypothèses critiques"
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 46,
    title: "Définir votre Persona",
    module: "Validation",
    type: "tools",
    content: {
      definition: "Créer un portrait-robot de votre client idéal",
      keyPoints: [
        "Données démographiques - Âge, sexe, localisation, revenus",
        "Comportements - Habitudes d'achat, médias consultés",
        "Motivations - Objectifs, aspirations, valeurs",
        "Frustrations - Problèmes, obstacles, douleurs",
        "Critères de décision - Ce qui influence l'achat"
      ],
      quote: "Un persona bien défini guide toutes vos décisions marketing et produit."
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 47,
    title: "Minimum Viable Product (MVP)",
    module: "Validation",
    type: "concept",
    content: {
      definition: "La version la plus simple de votre produit qui permet d'apprendre.",
      keyPoints: [
        "Minimum - Le strict nécessaire pour tester",
        "Viable - Suffisant pour créer de la valeur",
        "Product - Un produit réel, pas une idée"
      ],
      steps: [
        { step: "1. Identifier", description: "L'hypothèse la plus risquée à tester" },
        { step: "2. Concevoir", description: "Le MVP le plus simple pour la tester" },
        { step: "3. Construire", description: "Rapidement et à moindre coût" },
        { step: "4. Mesurer", description: "Collecter des données de feedback" },
        { step: "5. Apprendre", description: "Tirer des conclusions et itérer" }
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 48,
    title: "Types de MVP",
    module: "Validation",
    type: "framework",
    content: {
      definition: "Différentes approches selon votre contexte",
      keyPoints: [
        "Landing page - Page simple avec inscription pour tester l'intérêt",
        "Vidéo explicative - Dropbox a lancé avec juste une vidéo",
        "Concierge - Service manuel avant l'automatisation",
        "Wizard of Oz - Interface automatique, travail humain derrière",
        "Crowdfunding - Pré-ventes pour valider la demande",
        "Prototype papier - Maquettes low-fi pour tester les concepts"
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 49,
    title: "Lean Startup - Boucle Build-Measure-Learn",
    module: "Validation",
    type: "framework",
    content: {
      definition: "Le cycle d'apprentissage continu",
      steps: [
        { step: "1. Build", description: "Construire rapidement un MVP" },
        { step: "2. Measure", description: "Mesurer les résultats (métriques clés)" },
        { step: "3. Learn", description: "Apprendre et décider : persévérer ou pivoter" }
      ],
      keyPoints: [
        "Vitesse d'apprentissage = avantage compétitif",
        "Fail fast, fail cheap - Échouer vite et à moindre coût",
        "Validated learning - Apprentissages validés par des données"
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 50,
    title: "Pivoter ou Persévérer",
    module: "Validation",
    type: "concept",
    content: {
      definition: "La décision critique basée sur les apprentissages",
      table: {
        headers: ["Persévérer", "Pivoter"],
        rows: [
          ["Les métriques s'améliorent", "Les métriques stagnent ou déclinent"],
          ["Feedback client positif", "Pas d'engagement réel"],
          ["Product-Market Fit visible", "Pas de fit clair"],
          ["La vision reste pertinente", "Besoin de changer de direction"]
        ]
      },
      tips: [
        "Zoom-in Pivot - Focus sur une feature qui marche",
        "Zoom-out Pivot - Le produit devient une feature d'un produit plus large",
        "Customer Segment Pivot - Changer de cible",
        "Channel Pivot - Changer de canal de distribution"
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 51,
    title: "Métriques de validation",
    module: "Validation",
    type: "tools",
    content: {
      definition: "Mesurer ce qui compte vraiment",
      keyPoints: [
        "Métriques vanité - Impressionnantes mais peu utiles (pages vues, téléchargements)",
        "Métriques actionnables - Guident les décisions (conversion, rétention, NPS)"
      ],
      table: {
        headers: ["Métrique", "Ce qu'elle mesure"],
        rows: [
          ["Taux de conversion", "% de visiteurs qui deviennent clients"],
          ["Taux de rétention", "% de clients qui reviennent"],
          ["NPS", "Recommandation (promoteurs - détracteurs)"],
          ["CAC", "Coût d'acquisition d'un client"],
          ["LTV", "Valeur vie d'un client"]
        ]
      }
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 52,
    title: "Problem-Solution Fit",
    module: "Validation",
    type: "concept",
    content: {
      definition: "Première étape : valider que vous résolvez un vrai problème",
      keyPoints: [
        "Le problème existe-t-il vraiment?",
        "Est-il assez douloureux pour justifier une solution payante?",
        "Votre solution résout-elle le problème efficacement?",
        "Les gens sont-ils prêts à payer pour cette solution?"
      ],
      quote: "N'aimez pas votre solution, aimez le problème."
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 53,
    title: "Product-Market Fit",
    module: "Validation",
    type: "concept",
    content: {
      definition: "Le Graal : quand votre produit répond parfaitement aux besoins du marché",
      keyPoints: [
        "Les clients achètent sans effort de vente intense",
        "Le bouche-à-oreille fonctionne naturellement",
        "La croissance est organique",
        "Les clients reviennent et recommandent"
      ],
      tips: [
        "Question de Sean Ellis : 'Comment vous sentiriez-vous si vous ne pouviez plus utiliser ce produit?'",
        "Si 40%+ répondent 'très déçu', vous avez le PMF"
      ],
      quote: "Product-Market Fit est le moment où le marché tire votre produit, plutôt que vous le pousser."
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 54,
    title: "Tests A/B et expérimentation",
    module: "Validation",
    type: "tools",
    content: {
      definition: "Comparer deux versions pour optimiser",
      steps: [
        { step: "1. Hypothèse", description: "Formuler ce que vous voulez tester" },
        { step: "2. Variantes", description: "Créer version A (contrôle) et B (test)" },
        { step: "3. Trafic", description: "Répartir le trafic de façon aléatoire" },
        { step: "4. Mesure", description: "Collecter les données sur la métrique cible" },
        { step: "5. Analyse", description: "Déterminer le gagnant statistiquement" }
      ],
      tips: [
        "Tester une seule variable à la fois",
        "Taille d'échantillon suffisante",
        "Patience pour des résultats significatifs"
      ]
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  {
    id: 55,
    title: "Récapitulatif Validation",
    module: "Validation",
    type: "recap",
    content: {
      definition: "Les étapes clés de la validation",
      keyPoints: [
        "1. Définir les hypothèses critiques",
        "2. Créer un MVP pour les tester",
        "3. Mesurer avec des métriques actionnables",
        "4. Apprendre et itérer rapidement",
        "5. Décider : pivoter ou persévérer",
        "6. Atteindre le Problem-Solution Fit puis le Product-Market Fit"
      ],
      quote: "La validation est un processus continu, pas une étape unique."
    },
    color: "from-cyan-500/20 to-sky-500/10"
  },
  // Finances (56-68)
  {
    id: 56,
    title: "Financer votre startup",
    module: "Finances",
    type: "intro",
    content: {
      definition: "Comprendre les différentes sources de financement et quand les utiliser.",
      keyPoints: [
        "Bootstrapping - Autofinancement",
        "Love money - Famille et amis",
        "Business Angels - Investisseurs individuels",
        "Venture Capital - Fonds d'investissement",
        "Crowdfunding - Financement participatif",
        "Subventions et aides publiques"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 57,
    title: "Bootstrapping",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Démarrer avec ses propres moyens, sans investisseurs externes.",
      keyPoints: [
        "Contrôle total - Pas de dilution, pas de comptes à rendre",
        "Focus client - Priorité aux revenus dès le début",
        "Frugalité - Optimisation des ressources",
        "Croissance organique - À votre rythme"
      ],
      tips: [
        "Idéal pour les business à faible besoin de capital",
        "Développe la discipline financière",
        "Limite le risque personnel"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 58,
    title: "Love Money et Business Angels",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Les premiers investisseurs externes",
      table: {
        headers: ["Love Money", "Business Angels"],
        rows: [
          ["Famille et amis", "Investisseurs individuels expérimentés"],
          ["Montants modestes (5-50K€)", "Montants moyens (25-250K€)"],
          ["Relation affective", "Relation professionnelle"],
          ["Peu ou pas de contrôle", "Conseils et réseau en plus du capital"],
          ["Risque relationnel", "Attentes de rendement"]
        ]
      },
      tips: [
        "Formaliser même avec la famille",
        "Choisir des BA dans votre secteur"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 59,
    title: "Venture Capital",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Capital-risque pour les startups à fort potentiel de croissance",
      keyPoints: [
        "Montants importants (500K€ à plusieurs M€)",
        "Dilution significative du capital",
        "Attentes de rendement élevées (x10)",
        "Accompagnement stratégique",
        "Horizon de sortie (5-7 ans)"
      ],
      steps: [
        { step: "Seed", description: "100-500K€ pour valider le concept" },
        { step: "Série A", description: "1-5M€ pour accélérer la croissance" },
        { step: "Série B+", description: "5M€+ pour scaler internationalement" }
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 60,
    title: "Crowdfunding",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Financement participatif via des plateformes en ligne",
      table: {
        headers: ["Type", "Description", "Exemples"],
        rows: [
          ["Reward", "Contreparties non financières", "Kickstarter, Ulule"],
          ["Equity", "Parts de l'entreprise", "Seedrs, Crowdcube"],
          ["Lending", "Prêts participatifs", "October, Lending Club"],
          ["Donation", "Dons sans contrepartie", "GoFundMe"]
        ]
      },
      tips: [
        "Excellent outil de validation",
        "Crée une communauté d'ambassadeurs",
        "Demande un effort marketing important"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 61,
    title: "Aides et subventions",
    module: "Finances",
    type: "tools",
    content: {
      definition: "Financement non dilutif disponible pour les entrepreneurs",
      keyPoints: [
        "Subventions - Argent gratuit pour des projets spécifiques",
        "Prêts d'honneur - Sans intérêt ni garantie",
        "Crédit d'impôt - Réduction fiscale (CIR, JEI)",
        "Concours - Prix et récompenses",
        "Incubateurs/Accélérateurs - Accompagnement + financement"
      ],
      tips: [
        "Commencer tôt les démarches (délais longs)",
        "Bien documenter les dépenses éligibles",
        "Combiner plusieurs sources"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 62,
    title: "Préparer un Pitch Deck",
    module: "Finances",
    type: "tools",
    content: {
      definition: "Les slides essentielles pour convaincre les investisseurs",
      steps: [
        { step: "1. Problème", description: "Le problème que vous résolvez" },
        { step: "2. Solution", description: "Comment vous le résolvez" },
        { step: "3. Marché", description: "Taille et potentiel du marché" },
        { step: "4. Business Model", description: "Comment vous gagnez de l'argent" },
        { step: "5. Traction", description: "Preuves de succès (clients, revenus)" },
        { step: "6. Équipe", description: "Pourquoi vous êtes les bonnes personnes" },
        { step: "7. Financials", description: "Projections et besoins de financement" },
        { step: "8. Ask", description: "Ce que vous demandez" }
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 63,
    title: "Valorisation de startup",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Comment évaluer la valeur de votre entreprise",
      keyPoints: [
        "Pre-money - Valeur avant l'investissement",
        "Post-money - Valeur après l'investissement",
        "Dilution - % du capital cédé"
      ],
      tips: [
        "Méthode des comparables - Valorisation d'entreprises similaires",
        "Méthode DCF - Actualisation des flux futurs",
        "Méthode VC - Valorisation visée à la sortie / rendement attendu"
      ],
      quote: "Valorisation = ce que quelqu'un est prêt à payer."
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 64,
    title: "Gestion de la trésorerie",
    module: "Finances",
    type: "tools",
    content: {
      definition: "Cash is king - La trésorerie est vitale pour la survie",
      keyPoints: [
        "Burn rate - Consommation mensuelle de cash",
        "Runway - Nombre de mois avant épuisement",
        "Cash flow - Flux de trésorerie (entrées - sorties)"
      ],
      tips: [
        "Prévoir un coussin de sécurité (6 mois)",
        "Suivre les métriques hebdomadairement",
        "Anticiper les besoins de financement",
        "Négocier les délais de paiement"
      ],
      quote: "Une startup ne meurt pas de manque de clients, mais de manque de cash."
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 65,
    title: "Business Plan Financier",
    module: "Finances",
    type: "framework",
    content: {
      definition: "Les documents financiers essentiels",
      keyPoints: [
        "Compte de résultat prévisionnel - Revenus et charges sur 3-5 ans",
        "Plan de trésorerie - Flux mois par mois",
        "Bilan prévisionnel - Actifs et passifs",
        "Point mort - Quand l'entreprise devient rentable"
      ],
      tips: [
        "Être réaliste dans les hypothèses",
        "Prévoir plusieurs scénarios (optimiste, pessimiste, réaliste)",
        "Actualiser régulièrement"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 66,
    title: "Unit Economics",
    module: "Finances",
    type: "concept",
    content: {
      definition: "Rentabilité à l'échelle d'un client ou d'une transaction",
      table: {
        headers: ["Métrique", "Formule", "Objectif"],
        rows: [
          ["CAC", "Dépenses acquisition / Nouveaux clients", "Le plus bas possible"],
          ["LTV", "ARPU × Durée de vie client", "Le plus haut possible"],
          ["LTV/CAC", "Lifetime Value / Coût acquisition", "> 3"],
          ["Payback", "CAC / (ARPU × Marge)", "< 12 mois"]
        ]
      },
      quote: "Si LTV/CAC > 3 et payback < 12 mois, vous avez un business scalable."
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 67,
    title: "Pricing Strategy",
    module: "Finances",
    type: "tools",
    content: {
      definition: "Comment fixer le bon prix",
      keyPoints: [
        "Cost-plus - Coût + marge",
        "Value-based - Basé sur la valeur perçue",
        "Competitor-based - Aligné sur la concurrence",
        "Penetration - Prix bas pour conquérir le marché",
        "Premium - Prix élevé pour positionner haut de gamme"
      ],
      tips: [
        "Tester différents prix (A/B testing)",
        "Offrir plusieurs niveaux de prix",
        "Communiquer la valeur, pas le prix"
      ]
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  {
    id: 68,
    title: "Récapitulatif Finances",
    module: "Finances",
    type: "recap",
    content: {
      definition: "Les clés d'une gestion financière saine",
      keyPoints: [
        "Choisir le bon type de financement selon votre stade",
        "Maîtriser votre burn rate et votre runway",
        "Comprendre vos unit economics",
        "Préparer un pitch deck convaincant",
        "Gérer la trésorerie avec rigueur"
      ],
      quote: "L'argent est le carburant, mais la vision est le GPS."
    },
    color: "from-green-500/20 to-emerald-500/10"
  },
  // Lancement (69-80)
  {
    id: 69,
    title: "Préparer le lancement",
    module: "Lancement",
    type: "intro",
    content: {
      definition: "Les étapes clés pour réussir votre mise sur le marché",
      keyPoints: [
        "Choisir le bon statut juridique",
        "Construire une identité de marque",
        "Préparer votre stratégie marketing",
        "Définir vos canaux de distribution",
        "Planifier les premières ventes"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 70,
    title: "Choix du statut juridique",
    module: "Lancement",
    type: "framework",
    content: {
      definition: "Le statut juridique impacte fiscalité, responsabilité et crédibilité.",
      table: {
        headers: ["Statut", "Avantages", "Inconvénients"],
        rows: [
          ["Auto-entrepreneur", "Simple, peu de charges", "Plafond CA, pas d'associés"],
          ["EURL/SARL", "Responsabilité limitée, crédible", "Formalités, charges sociales"],
          ["SAS/SASU", "Flexibilité, attractif pour investisseurs", "Coût, complexité"],
          ["SA", "Levée de fonds, crédibilité", "Capital minimum, lourdeur"]
        ]
      }
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 71,
    title: "Construire sa marque",
    module: "Lancement",
    type: "tools",
    content: {
      definition: "Une marque forte différencie et fidélise",
      keyPoints: [
        "Nom - Mémorable, disponible, évocateur",
        "Logo - Simple, reconnaissable, adapté",
        "Charte graphique - Couleurs, typographies, style",
        "Tone of voice - Comment vous parlez à vos clients",
        "Story - L'histoire et les valeurs de votre marque"
      ],
      tips: [
        "Vérifier la disponibilité du nom (INPI, domaines)",
        "Cohérence sur tous les points de contact",
        "Évoluer avec le temps tout en restant reconnaissable"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 72,
    title: "Stratégie Go-to-Market",
    module: "Lancement",
    type: "framework",
    content: {
      definition: "Comment atteindre et conquérir votre marché",
      steps: [
        { step: "1. Cible", description: "Qui sont vos premiers clients (early adopters)?" },
        { step: "2. Message", description: "Quelle proposition de valeur leur parle?" },
        { step: "3. Canaux", description: "Où les trouver et comment les atteindre?" },
        { step: "4. Pricing", description: "À quel prix et avec quel modèle?" },
        { step: "5. Metrics", description: "Comment mesurer le succès?" }
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 73,
    title: "Marketing Digital",
    module: "Lancement",
    type: "tools",
    content: {
      definition: "Les leviers digitaux pour acquérir des clients",
      keyPoints: [
        "SEO - Référencement naturel sur les moteurs",
        "SEA - Publicité payante (Google Ads, etc.)",
        "Social Media - Réseaux sociaux organiques et payants",
        "Content Marketing - Blog, vidéos, podcasts",
        "Email Marketing - Newsletters et automation",
        "Influencer Marketing - Partenariats avec influenceurs"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 74,
    title: "Premiers clients",
    module: "Lancement",
    type: "concept",
    content: {
      definition: "Acquérir vos premiers clients - le plus dur est de commencer",
      keyPoints: [
        "Réseau personnel - Commencez par votre entourage",
        "Cold outreach - Emails/appels à des prospects ciblés",
        "Communautés - Forums, groupes, événements",
        "Partenariats - Collaborations stratégiques",
        "PR et médias - Couverture presse"
      ],
      tips: [
        "Chaque client compte - soignez l'expérience",
        "Demandez des témoignages et références",
        "Apprenez de chaque interaction"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 75,
    title: "Sales Funnel",
    module: "Lancement",
    type: "framework",
    content: {
      definition: "L'entonnoir de conversion",
      steps: [
        { step: "Awareness", description: "Le prospect découvre votre existence" },
        { step: "Interest", description: "Il s'intéresse à votre offre" },
        { step: "Consideration", description: "Il évalue par rapport aux alternatives" },
        { step: "Intent", description: "Il montre une intention d'achat" },
        { step: "Purchase", description: "Il devient client" },
        { step: "Loyalty", description: "Il revient et recommande" }
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 76,
    title: "Customer Success",
    module: "Lancement",
    type: "concept",
    content: {
      definition: "Assurer le succès de vos clients pour les fidéliser",
      keyPoints: [
        "Onboarding - Accompagner les nouveaux clients",
        "Support - Répondre rapidement aux problèmes",
        "Feedback - Collecter et agir sur les retours",
        "Upselling - Proposer des services additionnels",
        "Advocacy - Transformer les clients en ambassadeurs"
      ],
      quote: "Il coûte 5x moins cher de garder un client que d'en acquérir un nouveau."
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 77,
    title: "S'entourer",
    module: "Lancement",
    type: "tools",
    content: {
      definition: "Construire son équipe et son réseau de soutien",
      keyPoints: [
        "Co-fondateurs - Complémentarité et vision partagée",
        "Premiers employés - Culture et polyvalence",
        "Mentors - Expérience et conseils",
        "Advisors - Expertise spécifique",
        "Communauté - Autres entrepreneurs"
      ],
      tips: [
        "Rechercher la complémentarité",
        "Aligner sur les valeurs",
        "Formaliser les relations (pacte d'associés, equity)"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 78,
    title: "Erreurs à éviter",
    module: "Lancement",
    type: "concept",
    content: {
      definition: "Les pièges classiques des premières phases",
      keyPoints: [
        "Perfectionnisme - Attendre trop longtemps avant de lancer",
        "Isolation - Ne pas chercher de feedback",
        "Dispersion - Vouloir tout faire en même temps",
        "Sous-estimer le temps - Tout prend plus de temps que prévu",
        "Mauvaise équipe - Recruter trop vite ou mal",
        "Ignorer les finances - Ne pas suivre ses chiffres"
      ],
      quote: "Done is better than perfect."
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 79,
    title: "Checklist Lancement",
    module: "Lancement",
    type: "tools",
    content: {
      definition: "Les éléments essentiels avant de lancer",
      keyPoints: [
        "✅ Statut juridique créé",
        "✅ Compte bancaire professionnel ouvert",
        "✅ Marque et identité visuelle prêtes",
        "✅ Site web ou landing page en ligne",
        "✅ MVP ou offre minimum définie",
        "✅ Premiers prospects identifiés",
        "✅ Processus de vente documenté",
        "✅ Outils de gestion en place"
      ]
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  {
    id: 80,
    title: "Récapitulatif Lancement",
    module: "Lancement",
    type: "recap",
    content: {
      definition: "Vous êtes prêt à lancer!",
      keyPoints: [
        "Choisir le bon statut pour commencer",
        "Construire une marque mémorable",
        "Définir une stratégie go-to-market claire",
        "Acquérir vos premiers clients avec créativité",
        "Assurer le succès de vos clients",
        "S'entourer des bonnes personnes"
      ],
      quote: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment, c'est maintenant."
    },
    color: "from-indigo-500/20 to-blue-500/10"
  },
  // Croissance (81-91)
  {
    id: 81,
    title: "Stratégies de croissance",
    module: "Croissance",
    type: "intro",
    content: {
      definition: "Après le lancement, place à la croissance!",
      keyPoints: [
        "Optimiser ce qui fonctionne",
        "Scaler les canaux d'acquisition",
        "Diversifier les sources de revenus",
        "Internationaliser si pertinent",
        "Construire une équipe pour grandir"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 82,
    title: "Growth Hacking",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "Croissance rapide avec des tactiques créatives et peu coûteuses",
      keyPoints: [
        "Expérimentation rapide - Tester beaucoup d'idées",
        "Data-driven - Décisions basées sur les données",
        "Viral loops - Mécanismes de viralité intégrés",
        "Automation - Automatiser les tâches répétitives",
        "Product-led growth - Le produit comme moteur de croissance"
      ],
      tips: [
        "Dropbox : Parrainage avec espace gratuit",
        "Hotmail : 'Get your free email' dans chaque email",
        "Airbnb : Intégration Craigslist"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 83,
    title: "Framework AARRR",
    module: "Croissance",
    type: "framework",
    content: {
      definition: "Les métriques pirates pour mesurer la croissance",
      steps: [
        { step: "Acquisition", description: "Comment les utilisateurs arrivent?" },
        { step: "Activation", description: "Ont-ils une bonne première expérience?" },
        { step: "Retention", description: "Reviennent-ils?" },
        { step: "Revenue", description: "Comment monétisez-vous?" },
        { step: "Referral", description: "Recommandent-ils à d'autres?" }
      ],
      quote: "Optimisez chaque étape du funnel pour une croissance exponentielle."
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 84,
    title: "Scaling Operations",
    module: "Croissance",
    type: "tools",
    content: {
      definition: "Préparer votre infrastructure pour la croissance",
      keyPoints: [
        "Processus - Documenter et standardiser",
        "Automatisation - Réduire les tâches manuelles",
        "Outils - Investir dans les bons outils SaaS",
        "Équipe - Recruter stratégiquement",
        "Culture - Préserver ce qui vous rend unique"
      ],
      tips: [
        "Ce qui vous a mené à 10 clients ne vous mènera pas à 100",
        "Anticiper les goulots d'étranglement"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 85,
    title: "Expansion internationale",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "Conquérir de nouveaux marchés géographiques",
      keyPoints: [
        "Analyse de marché - Potentiel, concurrence, réglementation",
        "Localisation - Langue, culture, paiement",
        "Go-to-market local - Adapter la stratégie",
        "Équipe locale - Recruter sur place ou remote",
        "Test and learn - Commencer petit avant de scaler"
      ],
      tips: [
        "Choisir les bons marchés (proximité culturelle, taille)",
        "Ne pas sous-estimer les différences locales"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 86,
    title: "Diversification",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "Élargir votre offre ou votre marché",
      table: {
        headers: ["Stratégie", "Description"],
        rows: [
          ["Nouveaux produits", "Lancer des produits complémentaires"],
          ["Nouveaux segments", "Cibler d'autres types de clients"],
          ["Nouveaux canaux", "Explorer de nouveaux moyens de distribution"],
          ["Acquisitions", "Racheter des entreprises complémentaires"]
        ]
      },
      tips: [
        "Rester proche de son cœur de métier",
        "Tester avant de s'engager pleinement"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 87,
    title: "Levée de fonds Série A+",
    module: "Croissance",
    type: "tools",
    content: {
      definition: "Financer la phase de scaling",
      keyPoints: [
        "Prérequis - Product-Market Fit prouvé, métriques solides",
        "Montants - 1-10M€+ selon le stade",
        "Investisseurs - VCs spécialisés dans la croissance",
        "Utilisation - Équipe, marketing, internationalisation"
      ],
      tips: [
        "Préparer un data room complet",
        "Avoir plusieurs term sheets pour négocier",
        "Choisir des investisseurs pour leur valeur ajoutée"
      ]
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 88,
    title: "Construire une culture d'entreprise",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "La culture mange la stratégie au petit-déjeuner",
      keyPoints: [
        "Valeurs - Définir et vivre vos valeurs",
        "Recrutement - Embaucher pour le culture fit",
        "Communication - Transparence et alignement",
        "Reconnaissance - Célébrer les succès",
        "Développement - Investir dans les personnes"
      ],
      quote: "La culture est ce qui se passe quand le CEO n'est pas dans la pièce."
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 89,
    title: "Sortie et Exit",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "Les options de sortie pour les fondateurs et investisseurs",
      table: {
        headers: ["Type", "Description"],
        rows: [
          ["Acquisition", "Rachat par une entreprise plus grande"],
          ["IPO", "Introduction en bourse"],
          ["Secondary", "Vente de parts à d'autres investisseurs"],
          ["Management buyout", "Rachat par l'équipe de direction"],
          ["Lifestyle", "Rester et profiter des profits"]
        ]
      }
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 90,
    title: "Pérennité et Impact",
    module: "Croissance",
    type: "concept",
    content: {
      definition: "Construire une entreprise qui dure et qui compte",
      keyPoints: [
        "Vision long terme - Au-delà de la prochaine levée",
        "Impact positif - Sur les clients, employés, société",
        "Développement durable - Intégrer les enjeux ESG",
        "Transmission - Préparer la succession",
        "Héritage - Que voulez-vous laisser?"
      ],
      quote: "Une grande entreprise est celle qui rend le monde meilleur."
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  },
  {
    id: 91,
    title: "Conclusion - Votre aventure commence!",
    module: "Croissance",
    type: "recap",
    content: {
      definition: "Félicitations! Vous avez toutes les clés pour réussir.",
      keyPoints: [
        "Comprenez vos motivations et vos forces",
        "Maîtrisez le Business Model Canvas",
        "Validez vos hypothèses avant d'investir",
        "Gérez vos finances avec rigueur",
        "Lancez avec courage et apprenez vite",
        "Croissez avec ambition et responsabilité"
      ],
      quote: "Le plus grand risque est de ne prendre aucun risque. Bonne chance dans votre aventure entrepreneuriale!"
    },
    color: "from-fuchsia-500/20 to-purple-500/10"
  }
];

export default BMC_SLIDES;
