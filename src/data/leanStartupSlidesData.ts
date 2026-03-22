export interface LeanStartupSlide {
  id: number;
  module: string;
  title: string;
  type: "concept" | "framework" | "example" | "exercise" | "quote" | "video";
  color: string;
  content: {
    definition?: string;
    keyPoints?: string[];
    quote?: { text: string; author: string };
    table?: { headers: string[]; rows: string[][] };
    steps?: { step: string; description: string }[];
    caseStudy?: { name: string; context: string; lesson: string };
    framework?: { name: string; elements: { label: string; description: string }[] };
    tips?: string[];
    videoRef?: { url: string; title: string; source: string };
    pivotType?: { name: string; description: string; example: string };
    comparison?: { before: string; after: string; pivot: string }[];
  };
}

export const LEAN_STARTUP_MODULES = [
  { id: 1, name: "Introduction", slides: [1, 5], color: "bg-blue-600" },
  { id: 2, name: "Validated Learning", slides: [6, 10], color: "bg-purple-600" },
  { id: 3, name: "Build-Measure-Learn", slides: [11, 16], color: "bg-emerald-600" },
  { id: 4, name: "MVP", slides: [17, 28], color: "bg-orange-600" },
  { id: 5, name: "Pivot", slides: [29, 42], color: "bg-rose-600" },
  { id: 6, name: "Innovation Accounting", slides: [43, 48], color: "bg-indigo-600" },
  { id: 7, name: "Startup Way", slides: [49, 70], color: "bg-teal-600" },
];

export const LEAN_STARTUP_SLIDES: LeanStartupSlide[] = [
  // === MODULE 1: INTRODUCTION ===
  {
    id: 1,
    module: "Introduction",
    title: "Qu'est-ce que le Lean Startup?",
    type: "concept",
    color: "from-blue-500/20 to-indigo-500/20",
    content: {
      definition: "Le Lean Startup est une méthodologie pour développer des entreprises et des produits, qui vise à raccourcir les cycles de développement en adoptant une combinaison d'expérimentation rapide, de validation des hypothèses et d'apprentissage itératif.",
      quote: {
        text: "Une startup est une institution humaine conçue pour créer un nouveau produit ou service dans des conditions d'extrême incertitude.",
        author: "Eric Ries, The Lean Startup (2011)"
      },
      keyPoints: [
        "Né de l'expérience d'Eric Ries chez IMVU (2004-2008)",
        "Combine Lean Manufacturing + Customer Development (Steve Blank)",
        "Focus sur l'élimination du gaspillage et l'apprentissage rapide",
        "Applicable aux startups ET aux grandes entreprises (intrapreneuriat)"
      ]
    }
  },
  {
    id: 2,
    module: "Introduction",
    title: "Les Origines du Mouvement",
    type: "concept",
    color: "from-blue-500/20 to-indigo-500/20",
    content: {
      definition: "Le Lean Startup puise ses racines dans trois courants majeurs qui ont révolutionné la gestion d'entreprise.",
      framework: {
        name: "Les 3 Piliers Fondateurs",
        elements: [
          { label: "Lean Manufacturing", description: "Toyota Production System: éliminer le gaspillage, flux continu, amélioration continue (Kaizen)" },
          { label: "Customer Development", description: "Steve Blank: sortir du bâtiment, valider les hypothèses auprès des clients avant de construire" },
          { label: "Agile Development", description: "Développement itératif, sprints courts, adaptation au changement plutôt que suivi d'un plan rigide" }
        ]
      },
      keyPoints: [
        "Taiichi Ohno (Toyota) → Eric Ries adapte pour les startups tech",
        "Steve Blank → Mentor d'Eric Ries, créateur du Customer Development",
        "Manifeste Agile (2001) → Cycles courts et feedback continu"
      ]
    }
  },
  {
    id: 3,
    module: "Introduction",
    title: "Le Problème des Startups Traditionnelles",
    type: "concept",
    color: "from-blue-500/20 to-indigo-500/20",
    content: {
      definition: "L'approche traditionnelle 'Build it and they will come' échoue dans 90% des cas. Eric Ries identifie les causes profondes de cet échec.",
      table: {
        headers: ["Approche Traditionnelle", "Approche Lean Startup"],
        rows: [
          ["Plan d'affaires détaillé sur 5 ans", "Hypothèses à valider rapidement"],
          ["Développement en mode 'stealth'", "Lancement rapide et feedback client"],
          ["Perfection avant lancement", "MVP imparfait mais fonctionnel"],
          ["Métriques de vanité (users, downloads)", "Métriques actionnables (rétention, conversion)"],
          ["Pivoter = échec", "Pivoter = apprentissage validé"]
        ]
      },
      quote: {
        text: "La plupart des startups échouent non pas parce qu'elles ne peuvent pas construire leur produit, mais parce qu'elles construisent le mauvais produit.",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 4,
    module: "Introduction",
    title: "Les 5 Principes du Lean Startup",
    type: "framework",
    color: "from-blue-500/20 to-indigo-500/20",
    content: {
      framework: {
        name: "Les 5 Principes Fondamentaux",
        elements: [
          { label: "1. Les entrepreneurs sont partout", description: "Le Lean Startup s'applique à toute entreprise créant des produits dans l'incertitude" },
          { label: "2. L'entrepreneuriat est du management", description: "Une startup nécessite un nouveau type de management adapté à l'incertitude" },
          { label: "3. Validated Learning", description: "Les startups existent pour apprendre à construire une entreprise durable" },
          { label: "4. Build-Measure-Learn", description: "La boucle fondamentale pour transformer les idées en produits et mesurer l'impact" },
          { label: "5. Innovation Accounting", description: "Nouvelles métriques pour mesurer le progrès et prioriser le travail" }
        ]
      }
    }
  },
  {
    id: 5,
    module: "Introduction",
    title: "Eric Ries: Le Parcours",
    type: "example",
    color: "from-blue-500/20 to-indigo-500/20",
    content: {
      caseStudy: {
        name: "IMVU - Le Laboratoire du Lean Startup",
        context: "En 2004, Eric Ries co-fonde IMVU, une plateforme de chat 3D. Après des mois de développement secret, le lancement révèle que les clients ne veulent pas du produit prévu.",
        lesson: "Cette expérience traumatisante conduit Ries à développer la méthodologie Lean Startup: valider avant de construire, lancer tôt, itérer rapidement."
      },
      keyPoints: [
        "2004: Co-fondateur et CTO d'IMVU",
        "2008: IMVU atteint 50M$ de revenus avec la méthode Lean",
        "2011: Publication de 'The Lean Startup' - best-seller mondial",
        "2017: 'The Startup Way' - application aux grandes entreprises",
        "Aujourd'hui: Conseiller de GE, Toyota, Dropbox, gouvernement US"
      ]
    }
  },

  // === MODULE 2: VALIDATED LEARNING ===
  {
    id: 6,
    module: "Validated Learning",
    title: "Qu'est-ce que l'Apprentissage Validé?",
    type: "concept",
    color: "from-purple-500/20 to-pink-500/20",
    content: {
      definition: "L'apprentissage validé est le processus de démonstration empirique qu'une équipe a découvert des vérités précieuses sur les perspectives commerciales présentes et futures d'une startup.",
      quote: {
        text: "L'apprentissage est l'unité essentielle de progrès pour les startups. L'effort qui n'est pas absolument nécessaire pour apprendre ce que les clients veulent peut être éliminé.",
        author: "Eric Ries"
      },
      keyPoints: [
        "Ce n'est PAS une excuse pour l'échec ('nous avons beaucoup appris')",
        "C'est un processus rigoureux soutenu par des données empiriques",
        "Chaque expérience doit avoir une hypothèse claire et mesurable",
        "L'apprentissage doit pouvoir être démontré à des parties prenantes"
      ]
    }
  },
  {
    id: 7,
    module: "Validated Learning",
    title: "Hypothèses de Valeur vs Croissance",
    type: "framework",
    color: "from-purple-500/20 to-pink-500/20",
    content: {
      definition: "Toute startup repose sur deux hypothèses fondamentales qu'elle doit valider le plus rapidement possible.",
      framework: {
        name: "Les 2 Hypothèses Fondamentales (Leap of Faith)",
        elements: [
          { label: "Hypothèse de Valeur", description: "Est-ce que le produit délivre réellement de la valeur aux clients? Les clients reviennent-ils? Paient-ils?" },
          { label: "Hypothèse de Croissance", description: "Comment les nouveaux clients découvriront-ils le produit? Le moteur de croissance est-il durable?" }
        ]
      },
      table: {
        headers: ["Type", "Question Clé", "Indicateurs"],
        rows: [
          ["Valeur", "Le produit résout-il un vrai problème?", "Rétention, NPS, engagement, willingness to pay"],
          ["Croissance", "Peut-on acquérir des clients à l'échelle?", "Viralité, CAC, LTV, taux de conversion"]
        ]
      }
    }
  },
  {
    id: 8,
    module: "Validated Learning",
    title: "Le Genchi Gembutsu",
    type: "concept",
    color: "from-purple-500/20 to-pink-500/20",
    content: {
      definition: "Terme japonais signifiant 'aller voir par soi-même'. Dans le contexte Lean Startup, cela signifie sortir du bâtiment pour comprendre vraiment les clients.",
      quote: {
        text: "Il n'y a pas de substitut à l'observation directe des clients dans leur environnement naturel.",
        author: "Taiichi Ohno (adapté par Eric Ries)"
      },
      keyPoints: [
        "Les rapports et analyses ne remplacent pas l'observation directe",
        "Les founders doivent personnellement parler aux premiers clients",
        "Comprendre le 'job-to-be-done' dans le contexte réel",
        "Identifier les 'hacks' que les clients utilisent actuellement"
      ],
      tips: [
        "Faites au moins 10 entretiens clients avant de coder quoi que ce soit",
        "Observez les clients utiliser votre produit en temps réel",
        "Ne demandez pas 'aimeriez-vous X?', demandez 'montrez-moi comment vous faites X aujourd'hui'"
      ]
    }
  },
  {
    id: 9,
    module: "Validated Learning",
    title: "Métriques de Vanité vs Métriques Actionnables",
    type: "framework",
    color: "from-purple-500/20 to-pink-500/20",
    content: {
      definition: "Une métrique de vanité fait du bien à l'ego mais ne guide pas les décisions. Une métrique actionnable permet de prendre des décisions business claires.",
      table: {
        headers: ["Métrique de Vanité ❌", "Métrique Actionnable ✅", "Pourquoi?"],
        rows: [
          ["Nombre total d'utilisateurs", "Nouveaux utilisateurs actifs/semaine", "Montre la croissance réelle, pas l'accumulation"],
          ["Pages vues", "Taux de conversion", "Montre l'engagement, pas juste le trafic"],
          ["Téléchargements app", "Rétention J7 / J30", "Montre si les users reviennent"],
          ["Followers réseaux sociaux", "Engagement rate", "Montre l'intérêt réel vs nombre passif"],
          ["Temps passé sur le site", "Taux d'accomplissement de tâche", "Montre l'efficacité, pas la confusion"]
        ]
      },
      tips: [
        "Règle des 3 A: Actionnable, Accessible, Auditable",
        "Posez-vous: 'Cette métrique changera-t-elle mes décisions?'",
        "Préférez les cohortes aux totaux cumulés"
      ]
    }
  },
  {
    id: 10,
    module: "Validated Learning",
    title: "Étude de Cas: Dropbox",
    type: "example",
    color: "from-purple-500/20 to-pink-500/20",
    content: {
      caseStudy: {
        name: "Dropbox - Valider avant de Construire",
        context: "En 2007, Drew Houston veut créer un service de synchronisation de fichiers. Le défi: impossible de démontrer la valeur sans construire un produit techniquement complexe.",
        lesson: "Au lieu de développer pendant des mois, Houston crée une vidéo de 3 minutes montrant le produit 'comme s'il existait'. La liste d'attente passe de 5,000 à 75,000 en une nuit."
      },
      keyPoints: [
        "MVP: Une simple vidéo de démonstration (pas de produit réel)",
        "Validation: 75,000 inscriptions prouvent la demande",
        "Apprentissage: Les gens veulent la simplicité, pas les fonctionnalités techniques",
        "Résultat: $12B de valorisation, 700M+ utilisateurs"
      ],
      quote: {
        text: "La vidéo a validé notre hypothèse de valeur: les gens veulent que 'ça marche simplement' sans penser au cloud.",
        author: "Drew Houston, Fondateur Dropbox"
      }
    }
  },

  // === MODULE 3: BUILD-MEASURE-LEARN ===
  {
    id: 11,
    module: "Build-Measure-Learn",
    title: "La Boucle Fondamentale",
    type: "framework",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      definition: "Le cœur de la méthode Lean Startup est une boucle de feedback qui transforme les idées en produits, mesure la réaction des clients, et permet d'apprendre si l'on doit pivoter ou persévérer.",
      framework: {
        name: "Build → Measure → Learn",
        elements: [
          { label: "BUILD (Construire)", description: "Transformer les hypothèses en un MVP testable le plus rapidement possible" },
          { label: "MEASURE (Mesurer)", description: "Collecter des données quantitatives et qualitatives sur l'utilisation du MVP" },
          { label: "LEARN (Apprendre)", description: "Analyser les données pour valider ou invalider les hypothèses initiales" }
        ]
      },
      quote: {
        text: "L'objectif n'est pas de produire plus de choses, mais d'apprendre le plus vite possible si vous construisez quelque chose que les gens veulent.",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 12,
    module: "Build-Measure-Learn",
    title: "Minimiser le Temps de Boucle",
    type: "concept",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      definition: "L'avantage compétitif d'une startup est sa vitesse d'apprentissage. Plus la boucle est rapide, plus vous pouvez itérer avant d'épuiser vos ressources.",
      keyPoints: [
        "Objectif: Réduire le temps total de la boucle (idéalement < 1 semaine)",
        "Chaque étape doit être optimisée pour la vitesse, pas la perfection",
        "Éliminer tout travail qui ne contribue pas à l'apprentissage",
        "Automatiser les mesures pour obtenir des résultats en temps réel"
      ],
      table: {
        headers: ["Startup Lente", "Startup Lean"],
        rows: [
          ["6 mois pour le premier lancement", "2 semaines pour le premier MVP"],
          ["1 itération par trimestre", "1 itération par semaine"],
          ["Décisions basées sur l'intuition", "Décisions basées sur les données"],
          ["Pivote après échec catastrophique", "Pivote après apprentissage validé"]
        ]
      }
    }
  },
  {
    id: 13,
    module: "Build-Measure-Learn",
    title: "Planifier à l'Envers: Learn First",
    type: "framework",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      definition: "Bien que la boucle s'exécute Build → Measure → Learn, la PLANIFICATION doit se faire dans l'ordre inverse: Learn → Measure → Build.",
      steps: [
        { step: "1. Que devons-nous apprendre?", description: "Identifier l'hypothèse la plus risquée qui, si fausse, invalide tout le business model" },
        { step: "2. Comment allons-nous mesurer?", description: "Définir les métriques précises qui prouveront si l'hypothèse est vraie ou fausse" },
        { step: "3. Que devons-nous construire?", description: "Concevoir le MVP minimum nécessaire pour obtenir ces mesures" }
      ],
      tips: [
        "Commencez toujours par la question: 'Quelle est notre hypothèse la plus risquée?'",
        "Un bon MVP teste UNE hypothèse, pas dix",
        "Si vous ne savez pas ce que vous apprenez, vous ne pouvez pas mesurer"
      ]
    }
  },
  {
    id: 14,
    module: "Build-Measure-Learn",
    title: "Les Signaux d'Alerte",
    type: "concept",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      definition: "Comment savoir si votre boucle Build-Measure-Learn fonctionne mal?",
      table: {
        headers: ["Signal d'Alerte 🚨", "Cause Probable", "Solution"],
        rows: [
          ["Vous n'avez pas lancé depuis 3+ mois", "Over-engineering, peur de l'échec", "Définir un MVP en 2 semaines max"],
          ["Vous ne savez pas si vos métriques bougent", "Pas de tracking en place", "Implémenter analytics dès le jour 1"],
          ["Vos meetings ne mentionnent pas les données", "Culture de l'opinion vs données", "Commencer chaque meeting par les métriques"],
          ["Vous ajoutez des fonctionnalités sans valider", "Feature creep, syndrome du fondateur", "Retour aux hypothèses de base"],
          ["L'équipe ne sait pas ce qu'on teste", "Manque de clarté stratégique", "Afficher l'hypothèse actuelle partout"]
        ]
      }
    }
  },
  {
    id: 15,
    module: "Build-Measure-Learn",
    title: "Étude de Cas: IMVU",
    type: "example",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      caseStudy: {
        name: "IMVU - Naissance du Lean Startup",
        context: "IMVU développe pendant 6 mois un add-on pour les messageries existantes (AIM, MSN). Au lancement, personne ne l'utilise. Les utilisateurs ne veulent pas ajouter leurs amis sur une nouvelle plateforme.",
        lesson: "L'équipe découvre que les clients veulent une NOUVELLE plateforme pour rencontrer de NOUVELLES personnes, pas connecter leurs amis existants. Pivot complet du produit."
      },
      keyPoints: [
        "6 mois de développement 'perdu' sur la mauvaise hypothèse",
        "Leçon: Auraient pu découvrir cela en 2 semaines avec un MVP",
        "Nouveau produit: Chat 3D pour rencontrer des inconnus",
        "Résultat: $50M+ de revenus, utilisé par des millions"
      ],
      quote: {
        text: "Nous avons appris plus en 2 semaines de tests avec de vrais clients qu'en 6 mois de développement en chambre.",
        author: "Eric Ries sur l'expérience IMVU"
      }
    }
  },
  {
    id: 16,
    module: "Build-Measure-Learn",
    title: "Exercice: Votre Première Boucle",
    type: "exercise",
    color: "from-emerald-500/20 to-teal-500/20",
    content: {
      definition: "Appliquez la boucle Build-Measure-Learn à votre propre projet.",
      steps: [
        { step: "Hypothèse de Valeur", description: "Complétez: 'Nous croyons que [segment client] a le problème de [X] et paierait pour [solution Y]'" },
        { step: "Métrique de Succès", description: "Complétez: 'Nous saurons que c'est vrai si [X]% des testeurs [action mesurable]'" },
        { step: "MVP Minimum", description: "Complétez: 'Pour tester cela, nous devons construire seulement [fonctionnalité minimale]'" },
        { step: "Délai", description: "Complétez: 'Nous aurons des résultats dans [X] jours/semaines'" }
      ],
      tips: [
        "Soyez précis: '50% de rétention à J7' pas 'les gens aiment le produit'",
        "Soyez ambitieux sur le délai: divisez votre estimation par 2",
        "Partagez votre hypothèse avec 3 personnes pour feedback"
      ]
    }
  },

  // === MODULE 4: MVP (12 slides) ===
  {
    id: 17,
    module: "MVP",
    title: "Qu'est-ce qu'un MVP?",
    type: "concept",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Le Minimum Viable Product (MVP) est la version d'un nouveau produit qui permet à une équipe de collecter le maximum d'apprentissage validé sur les clients avec le minimum d'effort.",
      quote: {
        text: "Le MVP n'est pas le plus petit produit imaginable. C'est le chemin le plus rapide à travers la boucle Build-Measure-Learn.",
        author: "Eric Ries, The Lean Startup"
      },
      keyPoints: [
        "Objectif: APPRENDRE, pas impressionner",
        "Qualité suffisante pour tester l'hypothèse, pas plus",
        "Peut être embarrassant pour les perfectionnistes",
        "Doit générer des données pour prendre des décisions"
      ]
    }
  },
  {
    id: 18,
    module: "MVP",
    title: "Ce que le MVP n'est PAS",
    type: "concept",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Le MVP est souvent mal compris. Clarifions les idées reçues.",
      table: {
        headers: ["Idée Reçue ❌", "Réalité ✅"],
        rows: [
          ["Un prototype quick & dirty", "Un produit qui délivre de la valeur réelle"],
          ["La version 1.0 du produit final", "Un outil d'apprentissage jetable"],
          ["Le moins de fonctionnalités possible", "Les fonctionnalités nécessaires pour tester l'hypothèse"],
          ["Un produit non fini", "Un produit fini, mais limité en scope"],
          ["Quelque chose de honteux", "Quelque chose qui résout un vrai problème"]
        ]
      },
      quote: {
        text: "Si vous n'êtes pas embarrassé par la première version de votre produit, vous avez lancé trop tard.",
        author: "Reid Hoffman, Fondateur LinkedIn"
      }
    }
  },
  {
    id: 19,
    module: "MVP",
    title: "Les Types de MVP",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Il existe plusieurs formats de MVP selon ce que vous devez valider.",
      framework: {
        name: "Typologie des MVP",
        elements: [
          { label: "Landing Page MVP", description: "Une page web décrivant le produit avec un bouton 'S'inscrire' pour mesurer l'intérêt" },
          { label: "Video MVP", description: "Une vidéo de démonstration (ex: Dropbox) pour valider la proposition de valeur" },
          { label: "Concierge MVP", description: "Service manuel personnalisé pour les premiers clients (ex: Food on the Table)" },
          { label: "Wizard of Oz MVP", description: "Façade automatisée, mais humains derrière (ex: Zappos)" },
          { label: "Single-Feature MVP", description: "Un produit réel mais avec une seule fonctionnalité clé" }
        ]
      }
    }
  },
  {
    id: 20,
    module: "MVP",
    title: "Landing Page MVP en Détail",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Le MVP le plus simple: une page web qui présente votre produit et mesure l'intérêt avant de construire quoi que ce soit.",
      steps: [
        { step: "1. Headline", description: "Proposition de valeur claire en une phrase (ex: 'Vos fichiers, partout')" },
        { step: "2. Sous-titre", description: "Comment ça fonctionne en 10 mots" },
        { step: "3. Visuel", description: "Screenshot ou vidéo du produit 'comme s'il existait'" },
        { step: "4. CTA", description: "Bouton 'Inscrivez-vous' ou 'Pré-commandez'" },
        { step: "5. Mesure", description: "Taux de conversion = intérêt réel du marché" }
      ],
      tips: [
        "Utilisez Google Ads ou Facebook Ads pour amener du trafic qualifié",
        "Testez plusieurs headlines en A/B testing",
        "Un taux de conversion > 5% est généralement un bon signe"
      ],
      videoRef: {
        url: "https://www.youtube.com/watch?v=1hHMwLxN6EM",
        title: "The Minimum Viable Product",
        source: "Eric Ries - Lean Startup Conference"
      }
    }
  },
  {
    id: 21,
    module: "MVP",
    title: "Concierge MVP: Le Service Manuel",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Délivrer manuellement ce que votre produit fera automatiquement. Permet d'apprendre les besoins réels avant d'investir en développement.",
      caseStudy: {
        name: "Food on the Table",
        context: "Manuel Rosso veut créer une app de planification de repas. Au lieu de développer, il trouve UN client et fait tout manuellement: il va au supermarché, note les promotions, crée les menus personnalisés à la main.",
        lesson: "Après des mois à servir manuellement des clients un par un, il comprend exactement ce qu'ils veulent. ENSUITE il développe l'app qui automatise ce service."
      },
      keyPoints: [
        "Pas de code nécessaire au début",
        "Vous apprenez les vrais besoins en servant réellement les clients",
        "Les clients paient pour la valeur, pas pour la technologie",
        "Scale = automatiser ce qui fonctionne manuellement"
      ],
      videoRef: {
        url: "https://www.youtube.com/watch?v=Pf1F7PWTSEk",
        title: "Concierge MVP Explained",
        source: "Lean Startup Co."
      }
    }
  },
  {
    id: 22,
    module: "MVP",
    title: "Wizard of Oz MVP",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Une façade qui semble automatisée au client, mais avec des humains qui font le travail en coulisses.",
      caseStudy: {
        name: "Zappos - Le Magicien des Chaussures",
        context: "Nick Swinmurn veut vendre des chaussures en ligne en 1999. Au lieu de construire un inventaire, il photographie des chaussures dans les magasins locaux. Quand un client commande, il achète la paire au magasin et l'expédie.",
        lesson: "Sans investir dans l'inventaire ni la logistique, Zappos valide que les gens VEULENT acheter des chaussures en ligne. Acquisition par Amazon pour $1.2 milliard."
      },
      keyPoints: [
        "Le client voit un produit 'fini'",
        "L'équipe fait le travail manuellement en arrière-plan",
        "Teste la demande AVANT l'investissement",
        "Différence avec Concierge: le client ne sait pas que c'est manuel"
      ]
    }
  },
  {
    id: 23,
    module: "MVP",
    title: "Le Video MVP: Cas Dropbox",
    type: "example",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Une vidéo de démonstration qui montre le produit 'comme s'il existait' pour valider l'intérêt avant développement.",
      caseStudy: {
        name: "Dropbox - 75,000 Inscriptions en 1 Nuit",
        context: "Drew Houston ne peut pas expliquer Dropbox facilement. Le produit est techniquement complexe à développer. Solution: une vidéo de 3 minutes montrant l'expérience utilisateur.",
        lesson: "La vidéo génère 75,000 inscriptions sur la waiting list en une nuit. Preuve irréfutable de la demande AVANT d'écrire une ligne de code complexe."
      },
      keyPoints: [
        "Durée idéale: 2-4 minutes",
        "Montrer le 'job-to-be-done', pas les fonctionnalités",
        "Inclure un CTA clair (inscription, pré-commande)",
        "Partager sur les communautés ciblées (Hacker News pour Dropbox)"
      ],
      videoRef: {
        url: "https://www.youtube.com/watch?v=-wiYrm17r3I",
        title: "The Original Dropbox MVP Video",
        source: "Drew Houston / Y Combinator"
      }
    }
  },
  {
    id: 24,
    module: "MVP",
    title: "Single-Feature MVP",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Un produit réel et fonctionnel, mais limité à UNE seule fonctionnalité core qui délivre la valeur principale.",
      caseStudy: {
        name: "Twitter - 140 caractères, c'est tout",
        context: "Le premier Twitter (2006) n'avait qu'une fonctionnalité: poster des messages de 140 caractères. Pas de photos, pas de vidéos, pas de DMs, pas de retweets.",
        lesson: "Cette contrainte extrême a validé l'hypothèse centrale: les gens veulent partager des pensées courtes publiquement."
      },
      keyPoints: [
        "Identifiez LA fonctionnalité qui délivre 80% de la valeur",
        "Tout le reste est du 'nice to have'",
        "Permet de lancer en semaines, pas en mois",
        "Les fonctionnalités supplémentaires viennent APRÈS validation"
      ],
      tips: [
        "Question clé: 'Si notre produit ne faisait QU'UNE chose, laquelle?'",
        "Les premiers utilisateurs pardonnent le manque de features",
        "Instagram a lancé avec UNIQUEMENT des filtres photos"
      ]
    }
  },
  {
    id: 25,
    module: "MVP",
    title: "Erreurs Classiques du MVP",
    type: "concept",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Les pièges les plus fréquents qui sabotent les MVP.",
      table: {
        headers: ["Erreur", "Conséquence", "Solution"],
        rows: [
          ["Trop de fonctionnalités", "Délai de lancement, feedback dilué", "Couper 50% de ce que vous pensez nécessaire"],
          ["Pas assez de valeur", "Pas d'apprentissage car pas d'usage", "Résoudre UN problème complètement"],
          ["Mauvaise cible de test", "Feedback non représentatif", "Cibler les early adopters, pas le mass market"],
          ["Pas de métriques définies avant", "Pas d'apprentissage validé", "Définir le succès AVANT de lancer"],
          ["Abandonner trop vite", "Faux négatifs", "Minimum 2 semaines de données"],
          ["Persister trop longtemps", "Gaspillage de ressources", "Définir les critères de pivot à l'avance"]
        ]
      }
    }
  },
  {
    id: 26,
    module: "MVP",
    title: "Ressources Vidéo: Comprendre le MVP",
    type: "video",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Sélection de ressources vidéo pour approfondir le concept de MVP.",
      framework: {
        name: "Vidéos Recommandées",
        elements: [
          { label: "The Minimum Viable Product", description: "Eric Ries explique le concept fondamental du MVP" },
          { label: "Concierge MVP", description: "Comment valider sans code avec le service manuel" },
          { label: "Dropbox MVP Video", description: "Le MVP vidéo qui a généré 75,000 inscriptions" },
          { label: "How to Build an MVP", description: "Guide pratique pour construire votre premier MVP" }
        ]
      },
      keyPoints: [
        "📺 youtu.be/1hHMwLxN6EM - The Minimum Viable Product (Eric Ries)",
        "📺 youtu.be/Pf1F7PWTSEk - Concierge MVP Explained",
        "📺 youtu.be/-wiYrm17r3I - Original Dropbox MVP",
        "📺 youtu.be/b7Gxihlfq-0 - How to Build an MVP (Y Combinator)"
      ]
    }
  },
  {
    id: 27,
    module: "MVP",
    title: "Choisir le Bon Type de MVP",
    type: "framework",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Comment choisir le format de MVP adapté à votre situation.",
      table: {
        headers: ["Situation", "MVP Recommandé", "Exemple"],
        rows: [
          ["Idée très nouvelle, incertitude maximale", "Landing Page + Ads", "Buffer a validé l'idée avec une page Twitter"],
          ["Produit complexe à expliquer", "Video MVP", "Dropbox, Kickstarter projects"],
          ["Service personnalisé, B2C", "Concierge MVP", "Food on the Table, early Airbnb"],
          ["Marketplace ou logistique", "Wizard of Oz", "Zappos, early DoorDash"],
          ["Produit simple, une fonctionnalité clé", "Single-Feature MVP", "Twitter, Instagram v1"],
          ["Hardware ou produit physique", "Crowdfunding + Prototype", "Pebble Watch, Oculus"]
        ]
      },
      tips: [
        "Règle d'or: Choisissez le MVP le plus rapide à lancer",
        "Vous pouvez combiner plusieurs types",
        "Le MVP évolue: Landing Page → Concierge → Produit réel"
      ]
    }
  },
  {
    id: 28,
    module: "MVP",
    title: "Exercice: Définir Votre MVP",
    type: "exercise",
    color: "from-orange-500/20 to-amber-500/20",
    content: {
      definition: "Appliquez le framework MVP à votre propre projet.",
      steps: [
        { step: "1. Hypothèse Core", description: "Quelle est l'hypothèse #1 que votre MVP doit valider?" },
        { step: "2. Type de MVP", description: "Quel format (Landing Page, Concierge, Video, Single-Feature) est le plus adapté?" },
        { step: "3. Scope Minimal", description: "Listez les 3-5 éléments ESSENTIELS de votre MVP" },
        { step: "4. Métrique de Succès", description: "Quel chiffre prouvera que votre hypothèse est vraie?" },
        { step: "5. Délai", description: "En combien de jours/semaines pouvez-vous lancer ce MVP?" }
      ],
      tips: [
        "Règle du 10x: Si votre MVP prend plus de 2 semaines, coupez encore",
        "Partagez votre plan MVP avec 3 personnes pour feedback",
        "Le premier MVP n'est presque jamais le bon - préparez-vous à itérer"
      ]
    }
  },

  // === MODULE 5: PIVOT (14 slides) ===
  {
    id: 29,
    module: "Pivot",
    title: "Qu'est-ce qu'un Pivot?",
    type: "concept",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Un pivot est un changement structuré de stratégie conçu pour tester une nouvelle hypothèse fondamentale sur le produit, le business model ou le moteur de croissance.",
      quote: {
        text: "Un pivot n'est pas un échec - c'est un apprentissage validé qui vous rapproche du product-market fit.",
        author: "Eric Ries, The Lean Startup"
      },
      keyPoints: [
        "Ce n'est PAS un changement de direction aléatoire",
        "C'est basé sur des données et des apprentissages validés",
        "Garde un pied dans ce qui a été appris, change l'autre",
        "Un bon pivot utilise les connaissances acquises pour une nouvelle direction"
      ]
    }
  },
  {
    id: 30,
    module: "Pivot",
    title: "Pivot vs Persévérance: Le Dilemme",
    type: "concept",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "La décision la plus difficile pour un entrepreneur: quand pivoter vs quand persévérer?",
      table: {
        headers: ["Signaux pour Pivoter 🔄", "Signaux pour Persévérer ➡️"],
        rows: [
          ["Les métriques stagnent malgré les efforts", "Croissance lente mais constante"],
          ["Les clients n'utilisent pas la feature principale", "Rétention forte sur le core use case"],
          ["Le CAC ne diminue pas avec l'apprentissage", "Le bouche-à-oreille augmente"],
          ["L'équipe perd la motivation/conviction", "L'équipe croit toujours à la vision"],
          ["Chaque conversation client révèle un autre problème", "Les clients demandent plus de la même chose"]
        ]
      },
      quote: {
        text: "La runway d'une startup se mesure en nombre de pivots restants, pas en mois de cash.",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 31,
    module: "Pivot",
    title: "Les 10 Types de Pivots",
    type: "framework",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Eric Ries identifie 10 types de pivots différents. Chacun change une dimension spécifique du business model.",
      framework: {
        name: "Catalogue des Pivots (1/2)",
        elements: [
          { label: "1. Zoom-In Pivot", description: "Une fonctionnalité devient le produit entier" },
          { label: "2. Zoom-Out Pivot", description: "Le produit entier devient une fonctionnalité d'un plus grand produit" },
          { label: "3. Customer Segment Pivot", description: "Même produit, mais pour un segment client différent" },
          { label: "4. Customer Need Pivot", description: "Le problème que vous résolvez change" },
          { label: "5. Platform Pivot", description: "Passage d'application à plateforme (ou inverse)" }
        ]
      }
    }
  },
  {
    id: 32,
    module: "Pivot",
    title: "Les 10 Types de Pivots (suite)",
    type: "framework",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      framework: {
        name: "Catalogue des Pivots (2/2)",
        elements: [
          { label: "6. Business Architecture Pivot", description: "Passage de high-margin/low-volume à low-margin/high-volume (ou inverse)" },
          { label: "7. Value Capture Pivot", description: "Changement du modèle de monétisation" },
          { label: "8. Engine of Growth Pivot", description: "Changement du moteur de croissance (viral, paid, sticky)" },
          { label: "9. Channel Pivot", description: "Changement du canal de distribution" },
          { label: "10. Technology Pivot", description: "Même solution, technologie différente" }
        ]
      }
    }
  },
  {
    id: 33,
    module: "Pivot",
    title: "Zoom-In Pivot: Instagram",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand une fonctionnalité unique devient le produit entier.",
      caseStudy: {
        name: "Burbn → Instagram",
        context: "Kevin Systrom crée Burbn, une app de check-in avec jeux, photos et récompenses (comme Foursquare). L'app est complexe et l'adoption faible. L'équipe analyse les données: UNE fonctionnalité est sur-utilisée - le partage de photos avec filtres.",
        lesson: "Ils suppriment TOUT sauf les photos + filtres. Instagram naît et atteint 25,000 users le premier jour. Acquisition par Facebook: $1 milliard."
      },
      keyPoints: [
        "Avant: App sociale complexe avec 10+ fonctionnalités",
        "Pivot: Focus sur UNE seule fonctionnalité (photos + filtres)",
        "Après: Leader mondial du partage photo",
        "Temps du pivot: 8 semaines de développement"
      ]
    }
  },
  {
    id: 34,
    module: "Pivot",
    title: "Customer Segment Pivot: YouTube",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand le même produit trouve son marché dans un segment client inattendu.",
      caseStudy: {
        name: "YouTube: Du Dating au Divertissement",
        context: "YouTube est lancé comme un site de rencontres vidéo ('Tune in, Hook up'). Les utilisateurs devaient poster des vidéos d'eux-mêmes pour trouver des partenaires. Personne ne l'utilisait pour ça.",
        lesson: "Les créateurs ont remarqué que les gens uploadaient des vidéos de... tout SAUF des rencontres. Ils ont pivoté vers le partage vidéo général."
      },
      keyPoints: [
        "Avant: Site de rencontres par vidéo",
        "Observation: Les utilisateurs postent des vidéos de chats, musique, humour",
        "Pivot: Plateforme de partage vidéo généraliste",
        "Résultat: Acquisition par Google pour $1.65 milliard"
      ]
    }
  },
  {
    id: 35,
    module: "Pivot",
    title: "Platform Pivot: Slack",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand un outil interne devient le produit principal.",
      caseStudy: {
        name: "Glitch (jeu vidéo) → Slack",
        context: "Stewart Butterfield (co-fondateur de Flickr) crée un jeu en ligne appelé Glitch. Le jeu échoue et ferme en 2012. Mais l'équipe avait développé un outil de communication interne qui fonctionnait incroyablement bien.",
        lesson: "L'outil de chat interne devient Slack. En 2019, valorisation de $20+ milliards et IPO."
      },
      keyPoints: [
        "Le produit original (jeu Glitch) a échoué",
        "L'outil interne de l'équipe était le vrai trésor",
        "Pivot: D'un jeu B2C à un SaaS B2B",
        "Butterfield a aussi pivoté de Game Neverending vers Flickr!"
      ],
      quote: {
        text: "Nous n'avions aucune idée que nous construisions Slack. Nous construisions juste l'outil dont nous avions besoin pour travailler ensemble.",
        author: "Stewart Butterfield"
      }
    }
  },
  {
    id: 36,
    module: "Pivot",
    title: "Value Capture Pivot: Starbucks",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand le modèle de monétisation change radicalement.",
      caseStudy: {
        name: "Starbucks: Du B2B au B2C",
        context: "Starbucks original vendait des grains de café en gros aux restaurants et hôtels (B2B). Howard Schultz visite Milan et découvre la culture des cafés italiens - l'expérience, pas juste le produit.",
        lesson: "Pivot de la vente de grains (B2B, faible marge) à la vente d'une expérience café (B2C, haute marge). Le prix d'un espresso passe de $0.50 à $5."
      },
      keyPoints: [
        "Avant: Vente de grains de café (commodity)",
        "Pivot: Vente de 'l'expérience Starbucks'",
        "Changement: B2B → B2C, produit → service",
        "Résultat: 30,000+ cafés, $100B+ valorisation"
      ]
    }
  },
  {
    id: 37,
    module: "Pivot",
    title: "Engine of Growth Pivot: PayPal",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand le moteur de croissance change fondamentalement.",
      caseStudy: {
        name: "PayPal: 6 Pivots en 2 Ans",
        context: "PayPal a commencé comme un système de paiement pour Palm Pilots (crypto). Puis paiement web général. Puis ils découvrent que 80% du volume vient d'eBay.",
        lesson: "Pivot vers le moteur de croissance viral sur eBay. Ils payaient littéralement les gens $10 pour s'inscrire et $10 pour référer un ami."
      },
      keyPoints: [
        "Pivot 1: Crypto Palm Pilot → Web payments",
        "Pivot 2: Web payments → Focus eBay",
        "Pivot 3: Moteur paid → Moteur viral (referral bonus)",
        "Résultat: Acquisition par eBay pour $1.5B"
      ],
      quote: {
        text: "Nous avons trouvé le product-market fit par accident en observant où les utilisateurs nous tiraient.",
        author: "Max Levchin, Co-fondateur PayPal"
      }
    }
  },
  {
    id: 38,
    module: "Pivot",
    title: "Channel Pivot: Warby Parker",
    type: "example",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Quand le canal de distribution change radicalement.",
      caseStudy: {
        name: "Warby Parker: Du Web aux Boutiques",
        context: "Warby Parker lance en ligne uniquement (DTC - Direct to Consumer). Succès massif mais découvre que beaucoup de clients veulent essayer les lunettes en personne.",
        lesson: "Après le succès en ligne, pivot vers l'ajout de boutiques physiques 'showrooms' qui complètent le web."
      },
      keyPoints: [
        "Avant: 100% e-commerce, anti-retail",
        "Insight: Les clients veulent toucher/essayer",
        "Pivot: Ajout de 150+ boutiques physiques",
        "Modèle hybride: Web pour la transaction, boutique pour l'expérience"
      ]
    }
  },
  {
    id: 39,
    module: "Pivot",
    title: "Le Processus de Décision de Pivot",
    type: "framework",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Comment structurer la décision de pivoter dans votre organisation.",
      steps: [
        { step: "1. Réunion Pivot Régulière", description: "Planifiez des 'Pivot or Persevere' meetings réguliers (mensuel ou trimestriel)" },
        { step: "2. Revue des Métriques", description: "Examinez les innovation accounting metrics, pas les vanity metrics" },
        { step: "3. Analyse des Cohortes", description: "Comparez les nouvelles cohortes aux anciennes - amélioration ou stagnation?" },
        { step: "4. Customer Insights", description: "Que disent vraiment les clients? Patterns récurrents?" },
        { step: "5. Décision Collective", description: "Impliquez l'équipe. La conviction partagée est essentielle." }
      ],
      tips: [
        "Définissez les critères de pivot AVANT de lancer l'expérience",
        "Évitez le 'zombie startup': ni croissance ni mort",
        "Un pivot n'est pas un aveu d'échec, c'est un signe de maturité"
      ]
    }
  },
  {
    id: 40,
    module: "Pivot",
    title: "Pivots Célèbres: Récapitulatif",
    type: "concept",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Les plus grands succès tech ont souvent pivoté radicalement.",
      table: {
        headers: ["Entreprise", "Avant", "Après", "Type de Pivot"],
        rows: [
          ["Instagram", "App check-in (Burbn)", "Partage photos + filtres", "Zoom-In"],
          ["YouTube", "Site de rencontres vidéo", "Partage vidéo général", "Customer Segment"],
          ["Slack", "Jeu vidéo (Glitch)", "Chat entreprise", "Platform"],
          ["Twitter", "Podcasting (Odeo)", "Microblogging", "Customer Need"],
          ["Netflix", "Location DVD par courrier", "Streaming", "Technology"],
          ["Pinterest", "Shopping app (Tote)", "Tableau d'inspiration visuel", "Customer Need"],
          ["Shopify", "Magasin de snowboards", "Plateforme e-commerce", "Platform"],
          ["Nintendo", "Cartes à jouer", "Jeux vidéo", "Technology + Customer Need"]
        ]
      }
    }
  },
  {
    id: 41,
    module: "Pivot",
    title: "Erreurs à Éviter lors d'un Pivot",
    type: "concept",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Les pièges les plus courants qui sabotent les pivots.",
      table: {
        headers: ["Erreur", "Conséquence", "Prévention"],
        rows: [
          ["Pivoter sans données", "Changement aléatoire, pas d'apprentissage", "Toujours baser sur des métriques validées"],
          ["Pivoter trop souvent", "Pas assez de temps pour valider", "Minimum 6-8 semaines entre les pivots"],
          ["Pivoter trop tard", "Épuisement des ressources", "Définir les critères de pivot à l'avance"],
          ["Tout changer à la fois", "Impossible de savoir ce qui marche", "Changer UNE variable majeure"],
          ["Ignorer ce qui marchait", "Perte des acquis", "Le pivot garde un pied dans l'apprentissage"],
          ["Pas de buy-in de l'équipe", "Démotivation, départs", "Impliquer l'équipe dans la décision"]
        ]
      }
    }
  },
  {
    id: 42,
    module: "Pivot",
    title: "Exercice: Planifier Votre Pivot",
    type: "exercise",
    color: "from-rose-500/20 to-red-500/20",
    content: {
      definition: "Préparez-vous à pivoter en définissant vos critères à l'avance.",
      steps: [
        { step: "1. Métriques Actuelles", description: "Listez vos 3 métriques clés actuelles et leurs valeurs" },
        { step: "2. Seuil de Pivot", description: "À quel niveau de chaque métrique considéreriez-vous un pivot?" },
        { step: "3. Alternatives de Pivot", description: "Si vous deviez pivoter, quels 2-3 types de pivot seraient les plus pertinents?" },
        { step: "4. Plan B", description: "Décrivez brièvement ce que serait chaque direction de pivot" },
        { step: "5. Timeline", description: "Dans combien de semaines prendrez-vous la décision pivot/persévère?" }
      ],
      tips: [
        "Écrivez ces critères maintenant, pas quand vous serez émotionnellement investi",
        "Partagez avec un advisor externe pour un regard objectif",
        "Un bon entrepreneur a toujours un 'Plan B' en tête"
      ]
    }
  },

  // === MODULE 6: INNOVATION ACCOUNTING ===
  {
    id: 43,
    module: "Innovation Accounting",
    title: "Qu'est-ce que l'Innovation Accounting?",
    type: "concept",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      definition: "L'Innovation Accounting est un cadre pour évaluer le progrès des startups quand les métriques financières traditionnelles (revenus, profits) sont encore insignifiantes.",
      quote: {
        text: "La comptabilité traditionnelle ne marche pas pour les startups. Nous avons besoin d'une nouvelle discipline pour mesurer le progrès vers un business model viable.",
        author: "Eric Ries"
      },
      keyPoints: [
        "Les startups early-stage ne génèrent pas (encore) de revenus significatifs",
        "Mesure les progrès vers le product-market fit",
        "Focus sur les indicateurs avancés (leading indicators)",
        "Permet de comparer objectivement les options de pivot"
      ]
    }
  },
  {
    id: 44,
    module: "Innovation Accounting",
    title: "Les 3 Étapes de l'Innovation Accounting",
    type: "framework",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      definition: "Un processus en 3 phases pour établir et améliorer vos métriques.",
      framework: {
        name: "Le Processus en 3 Étapes",
        elements: [
          { label: "1. Établir la Baseline", description: "Lancez un MVP et mesurez où vous en êtes réellement (pas où vous espérez être)" },
          { label: "2. Tuner le Moteur", description: "Faites des expériences pour améliorer les métriques de la baseline vers l'idéal" },
          { label: "3. Pivot ou Persévère", description: "Si les améliorations stagnent, il est temps de pivoter" }
        ]
      },
      keyPoints: [
        "Baseline: Acceptez la réalité, même si elle est décevante",
        "Tuning: Chaque sprint doit améliorer au moins une métrique",
        "Décision: Des métriques stagnantes = signal de pivot"
      ]
    }
  },
  {
    id: 45,
    module: "Innovation Accounting",
    title: "Métriques par Étape de Startup",
    type: "framework",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      definition: "Les métriques à suivre évoluent avec la maturité de la startup.",
      table: {
        headers: ["Étape", "Focus", "Métriques Clés"],
        rows: [
          ["Problem/Solution Fit", "Validation du problème", "# d'interviews, % qui ont le problème, intensité douleur (1-10)"],
          ["MVP Launch", "Premiers utilisateurs", "Inscriptions, activation rate, feedback qualité"],
          ["Product/Market Fit", "Rétention et engagement", "Rétention J7/J30, DAU/MAU, NPS, time in app"],
          ["Scale", "Croissance durable", "CAC, LTV, Payback period, Net revenue retention"],
          ["Expansion", "Efficacité et profit", "Unit economics, Gross margin, Burn multiple"]
        ]
      }
    }
  },
  {
    id: 46,
    module: "Innovation Accounting",
    title: "Cohort Analysis: L'Outil Clé",
    type: "concept",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      definition: "L'analyse par cohortes compare les comportements de groupes d'utilisateurs acquis à différentes périodes.",
      keyPoints: [
        "Cohorte = groupe d'utilisateurs acquis pendant la même période",
        "Compare la rétention/engagement entre cohortes",
        "Révèle si les améliorations produit ont un impact réel",
        "Évite le piège des totaux cumulés (toujours croissants)"
      ],
      table: {
        headers: ["Cohorte", "Semaine 1", "Semaine 2", "Semaine 4", "Semaine 8"],
        rows: [
          ["Janvier", "100%", "40%", "25%", "15%"],
          ["Février (après pivot)", "100%", "55%", "40%", "30%"],
          ["Mars (itération)", "100%", "60%", "48%", "38%"]
        ]
      },
      tips: [
        "Une courbe de rétention qui s'aplatit = product-market fit potentiel",
        "Comparez toujours avec la cohorte précédente",
        "Si la nouvelle cohorte est pire, vous avez peut-être cassé quelque chose"
      ]
    }
  },
  {
    id: 47,
    module: "Innovation Accounting",
    title: "Le Funnel AARRR (Pirate Metrics)",
    type: "framework",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      definition: "Le framework AARRR de Dave McClure pour mesurer le cycle de vie client complet.",
      framework: {
        name: "AARRR - Pirate Metrics",
        elements: [
          { label: "Acquisition", description: "Comment les utilisateurs découvrent-ils votre produit? (Sources de trafic, CTR)" },
          { label: "Activation", description: "Ont-ils une première expérience positive? (Signup to Aha moment)" },
          { label: "Retention", description: "Reviennent-ils? (DAU/MAU, cohort retention)" },
          { label: "Referral", description: "Recommandent-ils à d'autres? (Viral coefficient, NPS)" },
          { label: "Revenue", description: "Paient-ils? (Conversion, ARPU, LTV)" }
        ]
      },
      tips: [
        "Optimisez dans l'ordre: Rétention → Activation → Acquisition",
        "Pas de sens d'acquérir si la rétention est mauvaise",
        "Chaque startup a un goulot d'étranglement différent"
      ]
    }
  },
  {
    id: 48,
    module: "Innovation Accounting",
    title: "Étude de Cas: Grockit",
    type: "example",
    color: "from-indigo-500/20 to-violet-500/20",
    content: {
      caseStudy: {
        name: "Grockit - Innovation Accounting en Action",
        context: "Grockit était une plateforme de préparation aux examens (GMAT, GRE). L'équipe suivait les totaux d'utilisateurs (toujours croissants) et pensait tout aller bien.",
        lesson: "En passant à l'analyse par cohortes, ils ont découvert que la rétention était catastrophique. Chaque nouvelle cohorte performait MOINS bien que la précédente. Les totaux masquaient la réalité."
      },
      keyPoints: [
        "Vanity metric: 'Nous avons 100,000 utilisateurs!'",
        "Réalité (cohortes): Rétention en chute libre à chaque cohorte",
        "Action: Pivot du business model vers le B2B (vente aux écoles)",
        "Résultat: Acquisition par Kaplan pour $10+ millions"
      ],
      quote: {
        text: "Les totaux cumulés sont comme un compte bancaire où vous ne pouvez voir que les dépôts, jamais les retraits.",
        author: "Eric Ries"
      }
    }
  },

  // === MODULE 7: THE STARTUP WAY ===
  {
    id: 49,
    module: "Startup Way",
    title: "Le Lean Startup pour les Grandes Entreprises",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "The Startup Way (2017) adapte les principes du Lean Startup aux grandes organisations cherchant à innover de manière continue.",
      quote: {
        text: "La transformation ne consiste pas à devenir une startup. Il s'agit de créer une capacité permanente d'innovation entrepreneuriale.",
        author: "Eric Ries, The Startup Way (2017)"
      },
      keyPoints: [
        "Applicable aux entreprises de toute taille (GE, Toyota, Intuit...)",
        "Crée des 'équipes startup' au sein de l'organisation",
        "Funding basé sur les métriques, pas les présentations",
        "Gouvernance adaptée à l'incertitude (Metered Funding)"
      ]
    }
  },
  {
    id: 50,
    module: "Startup Way",
    title: "Les 5 Principes pour les Grandes Entreprises",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      framework: {
        name: "The Startup Way Framework",
        elements: [
          { label: "1. Innovation Continue", description: "L'innovation n'est pas un événement ponctuel mais une capacité organisationnelle permanente" },
          { label: "2. Startup comme Unité Atomique", description: "Créer des équipes cross-fonctionnelles avec l'autonomie d'une startup" },
          { label: "3. Missing Function", description: "L'entrepreneuriat doit devenir une fonction comme le marketing ou la finance" },
          { label: "4. Second Founding", description: "Transformation culturelle nécessitant un engagement du leadership" },
          { label: "5. Transformation Continue", description: "Le système lui-même doit être itéré avec la méthode Lean" }
        ]
      }
    }
  },
  {
    id: 51,
    module: "Startup Way",
    title: "Metered Funding: Le Financement par Métriques",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Au lieu de gros budgets annuels, les projets d'innovation reçoivent un financement par tranches basé sur l'atteinte de métriques.",
      steps: [
        { step: "Tranche 1: Exploration", description: "Budget minimal pour valider le problème (interviews clients, landing page)" },
        { step: "Tranche 2: MVP", description: "Financement pour construire et tester le MVP avec de vrais utilisateurs" },
        { step: "Tranche 3: Validation", description: "Budget pour atteindre des métriques de product-market fit" },
        { step: "Tranche 4: Scale", description: "Financement significatif uniquement si les métriques prouvent le potentiel" }
      ],
      keyPoints: [
        "Chaque tranche nécessite de prouver les hypothèses de la phase précédente",
        "Échec rapide et peu coûteux vs échec lent et massif",
        "Les équipes sont accountable sur les apprentissages, pas juste le budget dépensé"
      ]
    }
  },
  {
    id: 52,
    module: "Startup Way",
    title: "Growth Board: La Gouvernance de l'Innovation",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Un comité d'investissement interne qui gère le portfolio d'innovation comme un VC gère ses investissements.",
      framework: {
        name: "Rôle du Growth Board",
        elements: [
          { label: "Portfolio Thinking", description: "Gérer un portefeuille diversifié de paris d'innovation" },
          { label: "Kill Decisions", description: "Arrêter les projets qui ne progressent pas (aussi important que de les lancer)" },
          { label: "Resource Allocation", description: "Redistribuer les ressources des échecs vers les succès" },
          { label: "Métriques Unifiées", description: "Standards de mesure cohérents pour comparer les projets" }
        ]
      },
      tips: [
        "Composition: Mix de leaders business, tech et externes",
        "Fréquence: Réunions mensuelles ou trimestrielles",
        "La majorité des projets doivent échouer (c'est normal)"
      ]
    }
  },
  {
    id: 53,
    module: "Startup Way",
    title: "Étude de Cas: General Electric",
    type: "example",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      caseStudy: {
        name: "GE FastWorks - Transformation d'un Géant",
        context: "General Electric (300,000 employés) adopte le Lean Startup en 2012 sous le CEO Jeff Immelt. Programme 'FastWorks' pour transformer la culture d'innovation.",
        lesson: "GE a formé 40,000+ employés au Lean Startup, créé des Growth Boards, et réduit le cycle de développement produit de 5 ans à 12-18 mois sur plusieurs gammes."
      },
      keyPoints: [
        "Exemple: Nouvelle turbine à gaz développée en 18 mois vs 5 ans habituellement",
        "Metered Funding appliqué aux projets d'innovation",
        "Résistance culturelle importante au début ('we're not a startup')",
        "Formation massive et sponsorship du CEO essentiels"
      ],
      quote: {
        text: "FastWorks n'est pas un programme. C'est notre nouvelle façon de travailler.",
        author: "Beth Comstock, ex-Vice-Chair GE"
      }
    }
  },
  {
    id: 54,
    module: "Startup Way",
    title: "Les Obstacles à la Transformation",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Les défis les plus courants lors de l'adoption du Lean Startup dans les grandes organisations.",
      table: {
        headers: ["Obstacle", "Manifestation", "Solution"],
        rows: [
          ["Culture du 'pas inventé ici'", "Rejet des méthodes externes", "Adapter le vocabulaire, montrer des succès internes"],
          ["Peur de l'échec", "Personne ne veut tuer son projet", "Célébrer les 'smart failures' et les apprentissages"],
          ["Silos organisationnels", "Équipes non cross-fonctionnelles", "Créer des équipes dédiées avec autonomie"],
          ["Métriques incompatibles", "Reporting trimestriel vs itérations hebdo", "Créer un 'innovation accounting' séparé"],
          ["Middle management résistant", "Blocage des initiatives bottom-up", "Sponsorship du CEO + incentives alignés"]
        ]
      }
    }
  },
  {
    id: 55,
    module: "Startup Way",
    title: "Récapitulatif: Les Enseignements Clés",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Les principes fondamentaux du Lean Startup à retenir.",
      framework: {
        name: "Les 10 Enseignements Clés d'Eric Ries",
        elements: [
          { label: "1", description: "L'entrepreneuriat est du management, pas du chaos créatif" },
          { label: "2", description: "Le produit que les clients veulent rarement correspond à ce que vous imaginez" },
          { label: "3", description: "L'apprentissage validé est la vraie mesure du progrès" },
          { label: "4", description: "Build-Measure-Learn: la boucle fondamentale de toute startup" },
          { label: "5", description: "Le MVP n'est pas un produit minimal, c'est un outil d'apprentissage maximal" },
          { label: "6", description: "Pivoter n'est pas échouer, c'est apprendre" },
          { label: "7", description: "Les métriques de vanité tuent les startups" },
          { label: "8", description: "La vitesse de la boucle est votre avantage compétitif" },
          { label: "9", description: "Les grandes entreprises peuvent et doivent innover comme des startups" },
          { label: "10", description: "La transformation est un processus continu, pas un événement" }
        ]
      },
      quote: {
        text: "La seule façon de gagner est d'apprendre plus vite que la concurrence.",
        author: "Eric Ries"
      }
    }
  },

  // === MODULE 8: MOTEURS DE CROISSANCE ===
  {
    id: 56,
    module: "Startup Way",
    title: "Les 3 Moteurs de Croissance",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Eric Ries identifie trois moteurs de croissance distincts. Chaque startup doit comprendre lequel alimente sa croissance pour optimiser ses efforts.",
      framework: {
        name: "Engines of Growth",
        elements: [
          { label: "Moteur Viral", description: "La croissance vient des utilisateurs existants qui invitent de nouveaux utilisateurs. Ex: Facebook, WhatsApp, Hotmail" },
          { label: "Moteur Sticky (Rétention)", description: "La croissance vient d'une forte rétention. Focus sur réduire le churn plutôt que d'acquérir. Ex: Netflix, Salesforce" },
          { label: "Moteur Paid", description: "La croissance vient de l'acquisition payante rentable (LTV > CAC). Ex: Google Ads, entreprises B2B" }
        ]
      },
      keyPoints: [
        "Chaque moteur a des métriques et tactiques différentes",
        "La plupart des startups n'utilisent qu'UN moteur principal",
        "Changer de moteur = un type de pivot"
      ]
    }
  },
  {
    id: 57,
    module: "Startup Way",
    title: "Moteur Viral: Le Coefficient Viral",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Le moteur viral fonctionne quand chaque utilisateur amène en moyenne plus d'un nouvel utilisateur.",
      table: {
        headers: ["Coefficient Viral (K)", "Signification", "Croissance"],
        rows: [
          ["K < 1", "Chaque utilisateur amène moins d'1 nouveau", "Déclin sans acquisition payante"],
          ["K = 1", "Équilibre - croissance linéaire", "Stable mais pas exponentiel"],
          ["K > 1", "Croissance virale exponentielle", "🚀 Croissance massive sans marketing"]
        ]
      },
      tips: [
        "K = (invitations par user) × (taux de conversion des invités)",
        "Hotmail a atteint K > 1 avec 'Get your free email at Hotmail'",
        "Même un K de 0.9 est précieux - réduit le CAC de 90%"
      ],
      caseStudy: {
        name: "Dropbox Referral Program",
        context: "Dropbox offrait 500MB d'espace gratuit pour chaque ami invité, pour l'inviteur ET l'invité.",
        lesson: "Le programme de parrainage a augmenté les inscriptions de 60%, réduisant le CAC de $388 à quasi-zéro."
      }
    }
  },
  {
    id: 58,
    module: "Startup Way",
    title: "Moteur Sticky: Rétention et Engagement",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Le moteur sticky se concentre sur la rétention des utilisateurs existants plutôt que l'acquisition massive.",
      keyPoints: [
        "Taux de rétention élevé = clients qui restent longtemps",
        "Règle: Si rétention > churn, la base grandit mécaniquement",
        "Focus sur l'onboarding et l'engagement régulier",
        "Les SaaS B2B utilisent souvent ce moteur"
      ],
      table: {
        headers: ["Métrique", "Formule", "Cible"],
        rows: [
          ["Taux de Churn", "Clients perdus / Total clients", "< 5% mensuel (B2C), < 2% (B2B SaaS)"],
          ["Net Revenue Retention", "(MRR fin - churn + expansion) / MRR début", "> 100% (expansion > churn)"],
          ["Customer Lifetime", "1 / Taux de churn", "> 24 mois"]
        ]
      },
      quote: {
        text: "Un leaky bucket ne se remplit jamais. Fixez la rétention avant de verser plus d'eau (acquisition).",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 59,
    module: "Startup Way",
    title: "Moteur Paid: L'Économie de l'Acquisition",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Le moteur paid fonctionne quand le revenu généré par client dépasse le coût d'acquisition de manière prévisible.",
      framework: {
        name: "Les Métriques du Moteur Paid",
        elements: [
          { label: "CAC", description: "Customer Acquisition Cost - Coût total pour acquérir un client" },
          { label: "LTV", description: "Lifetime Value - Revenu total généré par un client sur sa durée de vie" },
          { label: "Payback Period", description: "Temps pour récupérer le CAC en revenu" },
          { label: "LTV/CAC Ratio", description: "Ratio de rentabilité de l'acquisition (cible: > 3x)" }
        ]
      },
      tips: [
        "LTV > 3x CAC = moteur paid viable",
        "Payback < 12 mois idéal pour les startups",
        "Testez différents canaux pour trouver le meilleur CAC"
      ]
    }
  },
  {
    id: 60,
    module: "Startup Way",
    title: "Petits Lots: La Puissance du Small Batch",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Inspiré du Toyota Production System, le travail en petits lots permet de détecter les erreurs rapidement et d'itérer plus vite.",
      keyPoints: [
        "Grands lots = erreurs découvertes tardivement = coût élevé de correction",
        "Petits lots = feedback immédiat = correction rapide",
        "L'intuition dit 'grands lots = efficacité', mais c'est souvent faux",
        "Les startups lean travaillent en cycles d'une semaine, pas d'un trimestre"
      ],
      caseStudy: {
        name: "L'Expérience des Enveloppes",
        context: "Expérience classique: plier, insérer et cacheter 100 lettres. Méthode A: faire toutes les pliures, puis toutes les insertions. Méthode B: compléter chaque lettre une par une.",
        lesson: "Contre-intuitivement, la méthode B (petit lot) est 40% plus rapide. Le changement de tâche et les erreurs en lot font perdre du temps."
      },
      quote: {
        text: "La taille du lot idéale est d'un seul élément.",
        author: "Taiichi Ohno, Toyota"
      }
    }
  },
  {
    id: 61,
    module: "Startup Way",
    title: "La Méthode des 5 Pourquoi",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Technique issue de Toyota pour trouver la cause racine d'un problème en posant 'Pourquoi?' cinq fois successivement.",
      steps: [
        { step: "Problème", description: "Le site web est en panne" },
        { step: "Pourquoi 1", description: "Le serveur a crashé → Pourquoi?" },
        { step: "Pourquoi 2", description: "La mémoire était pleine → Pourquoi?" },
        { step: "Pourquoi 3", description: "Un processus avait une fuite mémoire → Pourquoi?" },
        { step: "Pourquoi 4", description: "Le code n'a pas été testé pour ce cas → Pourquoi?" },
        { step: "Pourquoi 5", description: "Nous n'avons pas de tests automatisés → CAUSE RACINE" }
      ],
      tips: [
        "La solution est souvent humaine/processus, pas technique",
        "Investissement proportionnel: petit problème = petite solution",
        "Faites-le en équipe pour éviter le blame game"
      ]
    }
  },
  {
    id: 62,
    module: "Startup Way",
    title: "L'Andon Cord: Arrêter pour Progresser",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Chez Toyota, n'importe quel employé peut tirer l'Andon Cord pour arrêter la chaîne de production quand un problème est détecté.",
      keyPoints: [
        "Principe: Mieux vaut arrêter tôt que propager une erreur",
        "Appliqué aux startups: N'importe qui peut bloquer un déploiement problématique",
        "Crée une culture de qualité et de responsabilité partagée",
        "Réduit le 'technical debt' et les bugs en production"
      ],
      caseStudy: {
        name: "IMVU Continuous Deployment",
        context: "IMVU déployait en production 50+ fois par jour. Avec autant de déploiements, les bugs sont inévitables.",
        lesson: "Solution: système de 'immune system' automatique qui détecte les régressions et rollback automatiquement. Équivalent tech de l'Andon Cord."
      }
    }
  },
  {
    id: 63,
    module: "Startup Way",
    title: "Organisation Adaptative",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Une organisation adaptative peut changer de direction rapidement sans perdre son efficacité. C'est l'objectif ultime du Lean Startup.",
      framework: {
        name: "Les 4 Piliers de l'Adaptabilité",
        elements: [
          { label: "Équipes Cross-Fonctionnelles", description: "Dev, design, business ensemble pour des décisions rapides" },
          { label: "Autonomie Locale", description: "Les équipes peuvent décider sans escalader chaque choix" },
          { label: "Apprentissage Continu", description: "Formation continue et partage des connaissances" },
          { label: "Fail Fast Culture", description: "L'échec rapide est célébré, pas puni" }
        ]
      },
      quote: {
        text: "Dans un monde incertain, l'entreprise qui apprend le plus vite gagne.",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 64,
    module: "Startup Way",
    title: "Phase 1: Masse Critique",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "La première phase de transformation d'une grande entreprise vers le Startup Way: créer une masse critique de succès.",
      steps: [
        { step: "1. Identifier les Champions", description: "Trouver des leaders internes motivés par l'innovation" },
        { step: "2. Former les Équipes Pilotes", description: "Former 5-10 équipes aux méthodes Lean Startup" },
        { step: "3. Quick Wins", description: "Démontrer des résultats rapides et visibles" },
        { step: "4. Documenter et Partager", description: "Créer des case studies internes des succès" }
      ],
      keyPoints: [
        "Objectif: Prouver que ça marche dans NOTRE contexte",
        "Commencer petit mais visible (pas en mode stealth)",
        "Le sponsorship d'un senior leader est essentiel"
      ]
    }
  },
  {
    id: 65,
    module: "Startup Way",
    title: "Phase 2: Mise à l'Échelle",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "La deuxième phase: étendre les pratiques Lean au-delà des équipes pilotes.",
      steps: [
        { step: "1. Formation de Masse", description: "Former des centaines/milliers de personnes via des bootcamps et coaching" },
        { step: "2. Créer l'Infrastructure", description: "Metered Funding, Growth Boards, métriques standardisées" },
        { step: "3. Adapter les Processus", description: "Modifier HR, Finance, IT pour supporter le nouveau mode" },
        { step: "4. Certification Interne", description: "Créer des 'coaches Lean' internes certifiés" }
      ],
      keyPoints: [
        "Risque principal: dilution du message lors du scaling",
        "La qualité de la formation doit rester élevée",
        "Les résistances du middle management apparaissent ici"
      ]
    }
  },
  {
    id: 66,
    module: "Startup Way",
    title: "Phase 3: Systèmes Profonds",
    type: "framework",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "La troisième phase: changer les systèmes fondamentaux de l'entreprise pour pérenniser la transformation.",
      framework: {
        name: "Changements Systémiques",
        elements: [
          { label: "RH & Carrières", description: "L'entrepreneuriat devient un parcours de carrière valorisé" },
          { label: "Finance & Budgets", description: "Metered Funding remplace le cycle budgétaire annuel" },
          { label: "Gouvernance", description: "Growth Boards deviennent partie de la structure décisionnelle" },
          { label: "Culture", description: "L'expérimentation et l'apprentissage sont dans l'ADN" }
        ]
      },
      quote: {
        text: "Une transformation n'est complète que lorsqu'elle survit au départ de ses champions initiaux.",
        author: "Eric Ries"
      }
    }
  },
  {
    id: 67,
    module: "Startup Way",
    title: "Cas Intuit: TurboTax et SnapTax",
    type: "example",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      caseStudy: {
        name: "Intuit - Innovation dans une Entreprise Établie",
        context: "Intuit, créateur de TurboTax (logiciel fiscal), a adopté le Lean Startup pour innover au sein de son business mature. Une équipe a créé SnapTax: faire sa déclaration d'impôts en prenant une photo de son W-2.",
        lesson: "En utilisant des MVP et itérations rapides, SnapTax est passé de l'idée au #1 de l'App Store Finance en 2 semaines, démontrant qu'une grande entreprise peut innover comme une startup."
      },
      keyPoints: [
        "MVP: Version très limitée testée avec de vrais utilisateurs",
        "Méthode: Build-Measure-Learn en cycles de 2 semaines",
        "Résultat: Innovation majeure au sein d'un produit mature",
        "Preuve que 'startup = incertitude', pas 'startup = petit'"
      ]
    }
  },
  {
    id: 68,
    module: "Startup Way",
    title: "L'Entrepreneuriat comme Fonction",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Eric Ries propose que l'entrepreneuriat devienne une fonction organisationnelle au même titre que le Marketing ou la Finance.",
      table: {
        headers: ["Fonction", "Responsabilité", "Équivalent Entrepreneuriat"],
        rows: [
          ["Finance", "Gérer les ressources financières", "Innovation Accounting - mesurer le progrès incertain"],
          ["Marketing", "Acquérir et retenir des clients", "Customer Development - comprendre les vrais besoins"],
          ["RH", "Gérer les talents", "Créer des parcours pour les intrapreneurs"],
          ["R&D", "Développer des technologies", "Build-Measure-Learn - développer des business models"]
        ]
      },
      keyPoints: [
        "Aujourd'hui: l'entrepreneuriat est dispersé ou inexistant",
        "Demain: Chief Entrepreneurship Officer et équipes dédiées",
        "Budget, métriques, gouvernance propres à l'innovation"
      ]
    }
  },
  {
    id: 69,
    module: "Startup Way",
    title: "Le Concept de 'Second Founding'",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Le 'Second Founding' est le moment où une entreprise établie se transforme radicalement pour retrouver son esprit entrepreneurial.",
      quote: {
        text: "Chaque entreprise a deux fondations: la création originale, et le moment où elle décide de se réinventer pour le futur.",
        author: "Eric Ries, The Startup Way"
      },
      keyPoints: [
        "Ce n'est pas un programme temporaire, c'est une refondation",
        "Nécessite l'engagement total du leadership",
        "Change les systèmes, pas juste les comportements individuels",
        "Exemples: Microsoft sous Satya Nadella, Apple au retour de Jobs"
      ],
      caseStudy: {
        name: "Toyota Post-2010",
        context: "Après la crise des rappels massifs de 2010, Toyota a dû se 'refonder' autour de la qualité et de l'écoute client.",
        lesson: "Même les inventeurs du Lean peuvent perdre leur chemin - et le retrouver par un 'second founding'."
      }
    }
  },
  {
    id: 70,
    module: "Startup Way",
    title: "Conclusion: Votre Startup Way",
    type: "concept",
    color: "from-teal-500/20 to-cyan-500/20",
    content: {
      definition: "Que vous soyez fondateur d'une startup ou leader dans une grande organisation, les principes restent les mêmes.",
      framework: {
        name: "Checklist du Startup Way",
        elements: [
          { label: "✓ Vision Claire", description: "Savez-vous quel problème vous résolvez et pour qui?" },
          { label: "✓ Hypothèses Explicites", description: "Vos assumptions sont-elles écrites et testables?" },
          { label: "✓ Métriques Actionnables", description: "Mesurez-vous ce qui compte vraiment?" },
          { label: "✓ Boucle Rapide", description: "Pouvez-vous itérer en semaines, pas en mois?" },
          { label: "✓ Culture d'Apprentissage", description: "Les échecs sont-ils célébrés comme des apprentissages?" }
        ]
      },
      quote: {
        text: "Le futur est déjà là - il n'est simplement pas distribué uniformément. Votre travail est de le trouver et de le construire.",
        author: "Eric Ries, adapté de William Gibson"
      }
    }
  }
];
