export const DISCIPLINED_ENTREPRENEURSHIP_SLIDES = [
  // ===== INTRODUCTION =====
  {
    id: 1,
    title: "Disciplined Entrepreneurship — Startup Tactics",
    subtitle: "15 Tactiques pour transformer une idée en entreprise rentable",
    module: "Introduction",
    type: "intro",
    content: {
      definition: "Ce cours est basé sur le livre 'Disciplined Entrepreneurship Startup Tactics' de Bill Aulet & Paul Cheek (MIT). Il va au-delà de la théorie — chaque tactique est un outil concret d'exécution.",
      keyPoints: [
        "24 étapes du Disciplined Entrepreneurship + 15 Tactiques d'exécution",
        "Approche MIT : Rigueur académique + pragmatisme terrain",
        "Chaque tactique = Workbook + Prompt + Métriques",
        "Objectif : Réduire le risque entrepreneurial par la méthode"
      ],
    },
    keyPoints: ["Framework MIT en 24 étapes", "15 tactiques d'exécution concrètes", "Workbooks & prompts intégrés"],
    quote: { text: "L'entrepreneuriat peut être enseigné. Ce n'est pas de l'art, c'est un craft.", author: "Bill Aulet, MIT" },
  },

  // ===== TACTIC 1: GET STARTED =====
  {
    id: 2,
    title: "Tactic #1 — Get Started : Trouver votre idée",
    subtitle: "Du brainstorming structuré à la sélection d'opportunité",
    module: "Phase 1 : Découverte",
    type: "concept",
    content: {
      definition: "Avant de créer, il faut identifier QUOI créer. Cette tactique utilise la méthode des 3 cercles : Passion × Compétence × Opportunité marché.",
      keyPoints: [
        "Lister 10 idées en 10 minutes — exercice de brainstorming contraint",
        "Filtrer avec la matrice Passion / Compétence / Marché",
        "Évaluer chaque idée avec un score pondéré de 1 à 5",
        "Sélectionner les 3 meilleures pour validation rapide"
      ],
      caseStudy: {
        name: "Dropbox",
        context: "Drew Houston a identifié un problème personnel (oubli de clé USB) qu'il a validé comme universel",
        lesson: "Les meilleures idées résolvent un problème que vous vivez vous-même"
      },
    },
  },
  {
    id: 3,
    title: "Workbook #1 — Matrice de sélection d'idées",
    subtitle: "Exercice pratique : Évaluer et prioriser vos opportunités",
    module: "Phase 1 : Découverte",
    type: "exercise",
    content: {
      definition: "Utilisez cette matrice pour scorer objectivement vos idées avant de vous engager.",
      table: {
        headers: ["Critère", "Idée A", "Idée B", "Idée C"],
        rows: [
          ["Passion (1-5)", "___", "___", "___"],
          ["Compétence (1-5)", "___", "___", "___"],
          ["Taille du marché (1-5)", "___", "___", "___"],
          ["Urgence du problème (1-5)", "___", "___", "___"],
          ["Faisabilité (1-5)", "___", "___", "___"],
          ["TOTAL /25", "___", "___", "___"],
        ],
      },
      tips: [
        "Prompt animateur : 'Listez 10 idées en 10 min, puis scorez vos top 3'",
        "Chronométrer strictement — la pression crée la créativité",
        "Faire voter le groupe sur les idées les plus prometteuses"
      ],
    },
  },

  // ===== TACTIC 2: MARKET SEGMENTATION =====
  {
    id: 4,
    title: "Tactic #2 — Segmentation Marché",
    subtitle: "Identifier et prioriser vos segments de marché",
    module: "Phase 1 : Découverte",
    type: "concept",
    content: {
      definition: "Ne ciblez pas 'tout le monde'. La segmentation est l'acte stratégique de choisir un beachhead market — le segment où vous pouvez gagner en premier.",
      steps: [
        { step: "1. Brainstormer les segments", description: "Lister tous les utilisateurs potentiels par industrie, taille, géographie" },
        { step: "2. Réduire à 6-12 segments", description: "Regrouper les segments similaires" },
        { step: "3. Recherche primaire", description: "Parler à 5+ personnes par segment" },
        { step: "4. Réduire à 3 segments", description: "Scorer chaque segment" },
        { step: "5. Choisir le Beachhead", description: "Le segment où vous avez le plus d'avantage" },
      ],
      keyPoints: [
        "TAM → SAM → SOM : Du macro au micro",
        "Le Beachhead Market = votre D-Day",
        "Critères : Urgence + Accessibilité + Willingness to Pay",
        "Un seul segment à la fois — pas de dispersion"
      ],
    },
  },

  // ===== TACTIC 3: BUILD END-USER PROFILE =====
  {
    id: 5,
    title: "Tactic #3 — Profil de l'Utilisateur Final",
    subtitle: "Persona détaillé : Qui est votre client idéal ?",
    module: "Phase 1 : Découverte",
    type: "framework",
    content: {
      definition: "Le End-User Profile est un portrait ultra-détaillé de votre client dans le beachhead market. Ce n'est pas un persona marketing classique — c'est une personne réelle avec un nom.",
      framework: {
        name: "End-User Profile Canvas",
        elements: [
          { name: "Démographie", description: "Âge, genre, localisation, revenus, éducation" },
          { name: "Motivations", description: "Qu'est-ce qui le pousse à chercher une solution ?" },
          { name: "Comportement", description: "Comment résout-il le problème aujourd'hui ?" },
          { name: "Frustrations", description: "Quelles sont ses top 3 douleurs ?" },
          { name: "Critères d'achat", description: "Prix, fonctionnalités, UX, confiance ?" },
          { name: "Influence", description: "Qui influence sa décision d'achat ?" },
        ],
      },
      tips: [
        "Utilisez une VRAIE photo et un VRAI nom",
        "Basez-vous sur des interviews, pas des hypothèses",
        "Un seul persona pour le beachhead — pas 5"
      ],
    },
  },

  // ===== TACTIC 4: CALCULATE TAM =====
  {
    id: 6,
    title: "Tactic #4 — Calculer le TAM",
    subtitle: "Total Addressable Market : Méthode top-down + bottom-up",
    module: "Phase 2 : Validation",
    type: "concept",
    content: {
      definition: "Le TAM n'est pas un chiffre que vous trouvez sur Google. C'est un calcul rigoureux qui combine approche top-down (industrie) et bottom-up (unit economics).",
      keyPoints: [
        "Top-Down : Marché global × % adressable × Part réaliste",
        "Bottom-Up : Nombre de clients potentiels × Revenue/client × Fréquence",
        "SAM = TAM × % que vous pouvez réellement servir",
        "SOM = SAM × Part de marché réaliste (Year 1-3)"
      ],
      table: {
        headers: ["Méthode", "Calcul", "Exemple"],
        rows: [
          ["Top-Down", "Marché $10B × 5% segment × 2% capture", "$10M"],
          ["Bottom-Up", "50K entreprises × $200/mois × 12", "$120M TAM"],
          ["SAM", "10K dans votre zone × $200/mois × 12", "$24M"],
          ["SOM Year 1", "200 clients × $200/mois × 12", "$480K"],
        ],
      },
    },
  },

  // ===== TACTIC 5: DEFINE VALUE PROPOSITION =====
  {
    id: 7,
    title: "Tactic #5 — Proposition de Valeur",
    subtitle: "Pourquoi VOUS et pas un concurrent ?",
    module: "Phase 2 : Validation",
    type: "framework",
    content: {
      definition: "Votre proposition de valeur doit répondre en une phrase à : 'Pourquoi un client rationnel choisirait-il votre produit plutôt que le status quo ?'",
      framework: {
        name: "Value Proposition Stack",
        elements: [
          { name: "Problème #1", description: "Le problème le plus douloureux (quantifié)" },
          { name: "Solution unique", description: "Votre approche différenciée" },
          { name: "Bénéfice clé", description: "Le gain mesurable pour le client" },
          { name: "Preuve", description: "Témoignage, data, démo" },
        ],
      },
      keyPoints: [
        "Formule : 'Nous aidons [persona] à [résoudre problème] grâce à [méthode unique]'",
        "Doit être testable empiriquement — pas un slogan",
        "Le Quantified Value Proposition chiffre le ROI client",
        "Évitez les buzzwords : 'innovant', 'disruptif', 'révolutionnaire'"
      ],
      caseStudy: {
        name: "Slack",
        context: "Proposition : 'Réduire les emails internes de 48%'",
        lesson: "Chiffre concret = crédibilité instantanée"
      },
    },
  },

  // ===== TACTIC 6: IDENTIFY YOUR PERSONA =====
  {
    id: 8,
    title: "Tactic #6 — The Persona Deep Dive",
    subtitle: "Au-delà du profil : Comprendre les jobs-to-be-done",
    module: "Phase 2 : Validation",
    type: "concept",
    content: {
      definition: "La tactique persona va au-delà de la démographie. Elle intègre les Jobs-to-be-Done (JTBD) : les tâches fonctionnelles, émotionnelles et sociales que votre client essaie d'accomplir.",
      keyPoints: [
        "Job fonctionnel : Que doit-il FAIRE concrètement ?",
        "Job émotionnel : Comment veut-il SE SENTIR ?",
        "Job social : Comment veut-il ÊTRE PERÇU ?",
        "Pains > Gains : Les clients achètent pour éliminer la douleur"
      ],
      tips: [
        "Prompt interview : 'Racontez-moi la dernière fois que vous avez eu ce problème'",
        "Ne demandez JAMAIS 'Achèteriez-vous ce produit ?' — c'est du Mom Test",
        "Observez le comportement, ne croyez pas les déclarations"
      ],
    },
  },

  // ===== TACTIC 7: MAP THE FULL LIFECYCLE =====
  {
    id: 9,
    title: "Tactic #7 — Cartographier le Cycle de Vie Client",
    subtitle: "Du premier contact à l'advocacy : chaque touchpoint compte",
    module: "Phase 3 : Exécution",
    type: "framework",
    content: {
      definition: "Cartographiez chaque étape du parcours client pour identifier les points de friction et d'opportunité. Le cycle ne s'arrête pas à l'achat — il inclut l'adoption, la rétention et le referral.",
      steps: [
        { step: "Awareness", description: "Comment le client découvre-t-il votre solution ?" },
        { step: "Consideration", description: "Comment compare-t-il les alternatives ?" },
        { step: "Acquisition", description: "Quel est le processus d'achat/signup ?" },
        { step: "Activation", description: "Quand vit-il le 'Aha moment' ?" },
        { step: "Revenue", description: "Quand et comment paie-t-il ?" },
        { step: "Retention", description: "Pourquoi revient-il ?" },
        { step: "Referral", description: "Comment recommande-t-il ?" },
      ],
      keyPoints: [
        "Framework AARRR de Dave McClure adapté",
        "Chaque étape a un taux de conversion à mesurer",
        "Identifiez le 'bottleneck' — l'étape avec le plus gros drop-off",
        "Le Aha Moment est le prédicteur #1 de rétention"
      ],
    },
  },

  // ===== TACTIC 8: QUANTIFY VALUE PROPOSITION =====
  {
    id: 10,
    title: "Tactic #8 — Quantifier la Proposition de Valeur",
    subtitle: "Transformer un bénéfice qualitatif en ROI chiffré",
    module: "Phase 3 : Exécution",
    type: "concept",
    content: {
      definition: "Un Quantified Value Proposition (QVP) traduit votre proposition de valeur en termes financiers pour le client. C'est l'arme ultime en B2B.",
      table: {
        headers: ["Métrique", "Sans votre produit", "Avec votre produit", "Gain"],
        rows: [
          ["Temps/tâche", "4 heures", "30 minutes", "87.5%"],
          ["Coût/erreur", "500€", "50€", "90%"],
          ["Revenue/client", "1 000€", "1 500€", "+50%"],
          ["Churn mensuel", "8%", "3%", "-62.5%"],
        ],
      },
      keyPoints: [
        "ROI client = (Gain - Coût de votre solution) / Coût × 100",
        "Visez un ROI > 300% pour que la décision soit évidente",
        "Collectez des data réelles via des pilots/betas",
        "Utilisez les chiffres dans votre pitch deck"
      ],
      tips: [
        "Demandez aux betas : 'Combien de temps/argent avez-vous gagné ?'",
        "Créez un calculateur ROI sur votre landing page"
      ],
    },
  },

  // ===== TACTIC 9: DEFINE YOUR CORE =====
  {
    id: 11,
    title: "Tactic #9 — Définir votre Core",
    subtitle: "Votre avantage compétitif durable et défendable",
    module: "Phase 3 : Exécution",
    type: "concept",
    content: {
      definition: "Votre Core est ce qui rend votre startup irremplaçable. C'est le moat — le fossé compétitif que les concurrents ne peuvent pas facilement traverser.",
      keyPoints: [
        "Network Effects : Plus d'utilisateurs = plus de valeur (ex: LinkedIn)",
        "Data Moat : Vos data uniques vous rendent plus intelligent (ex: Waze)",
        "Switching Costs : Changer coûte trop cher au client (ex: Salesforce)",
        "Brand : La confiance accumulée (ex: Apple)",
        "Technologie propriétaire : Brevets, algorithmes uniques (ex: Google Search)"
      ],
      caseStudy: {
        name: "Tesla",
        context: "Core = Data de conduite autonome de millions de véhicules",
        lesson: "Le core n'est pas le produit — c'est l'asset stratégique derrière"
      },
    },
  },

  // ===== TACTIC 10: DESIGN A BUSINESS MODEL =====
  {
    id: 12,
    title: "Tactic #10 — Concevoir le Business Model",
    subtitle: "Comment capturer la valeur que vous créez",
    module: "Phase 4 : Monétisation",
    type: "framework",
    content: {
      definition: "Le business model décrit comment vous monétisez. Il y a 17+ patterns de business models — le choix du bon pattern est critique.",
      framework: {
        name: "Business Model Decision Matrix",
        elements: [
          { name: "SaaS / Abonnement", description: "Revenue récurrent, prévisible. Idéal pour logiciels B2B." },
          { name: "Marketplace / Commission", description: "Prenez un % sur chaque transaction. Nécessite liquidité." },
          { name: "Freemium", description: "Gratuit + Premium. Conversion 2-5% typique." },
          { name: "Usage-Based", description: "Payez selon l'utilisation. Réduit la friction d'entrée." },
          { name: "Razor & Blade", description: "Produit pas cher + consommables. Lock-in physique." },
        ],
      },
      keyPoints: [
        "Le business model doit s'aligner avec les habitudes d'achat du persona",
        "LTV > 3× CAC est la règle d'or",
        "Testez 2-3 modèles en parallèle avec des landing pages",
        "Le pricing est une hypothèse — testez-le comme un feature"
      ],
    },
  },

  // ===== TACTIC 11: SET PRICING =====
  {
    id: 13,
    title: "Tactic #11 — Fixer le Prix",
    subtitle: "La méthode Van Westendorp + Willingness to Pay",
    module: "Phase 4 : Monétisation",
    type: "concept",
    content: {
      definition: "Le pricing n'est PAS un calcul de coût + marge. C'est une conversation avec le marché. Utilisez la méthode Van Westendorp pour trouver le price point optimal.",
      steps: [
        { step: "1. Enquête Van Westendorp", description: "Posez 4 questions : Trop cher ? Cher mais OK ? Bon prix ? Trop bon marché ?" },
        { step: "2. Analyser les courbes", description: "L'intersection donne le prix optimal" },
        { step: "3. Tester 3 tiers", description: "Basic / Pro / Enterprise avec ancrage" },
        { step: "4. Itérer trimestriellement", description: "Le prix optimal change avec la maturité" },
      ],
      keyPoints: [
        "Les 4 questions Van Westendorp révèlent la psychologie prix",
        "Ancrage : Le tier du milieu est souvent le best-seller",
        "Pricing page : testez A/B avec 2 niveaux vs 3 niveaux",
        "En B2B : prix basé sur la valeur, pas sur le coût"
      ],
      tips: [
        "Prompt : 'À quel prix ce produit vous semblerait-il si cher que vous ne l'achèteriez jamais ?'",
        "Ne sous-estimez JAMAIS votre prix — les startups sous-pricing est épidémique"
      ],
    },
  },

  // ===== TACTIC 12: DESIGN MVP =====
  {
    id: 14,
    title: "Tactic #12 — Concevoir le MVP",
    subtitle: "Minimum Viable Product : Le moins possible pour valider le plus possible",
    module: "Phase 5 : Produit",
    type: "concept",
    content: {
      definition: "Le MVP n'est PAS une version cheap de votre produit final. C'est l'expérience la plus petite possible qui teste votre hypothèse la plus risquée.",
      keyPoints: [
        "MVP ≠ Prototype. MVP = Produit livré à de vrais clients",
        "Identifiez votre hypothèse la plus risquée (Riskiest Assumption)",
        "Types de MVP : Concierge, Wizard of Oz, Landing Page, Single Feature",
        "Critère de succès : Taux d'activation > X% ou Revenue > $Y"
      ],
      comparison: [
        { before: "Construire tout le produit", after: "Single Feature MVP", pivot: "Build → Measure → Learn" },
        { before: "Développer 6 mois", after: "Livrer en 2 semaines", pivot: "Speed > Perfection" },
        { before: "Demander 'Vous aimez ?'", after: "Mesurer le comportement", pivot: "Actions > Opinions" },
      ],
      tips: [
        "Prompt : 'Quelle est l'hypothèse qui, si elle est fausse, tue le projet ?'",
        "Le MVP doit créer le Aha Moment — ou vous pivotez"
      ],
    },
  },

  // ===== TACTIC 13: TEST KEY ASSUMPTIONS =====
  {
    id: 15,
    title: "Tactic #13 — Tester les Hypothèses Clés",
    subtitle: "Design d'expériences et métriques de validation",
    module: "Phase 5 : Produit",
    type: "framework",
    content: {
      definition: "Chaque startup est un ensemble d'hypothèses non validées. La tactique 13 vous apprend à les lister, les prioriser et les tester systématiquement.",
      framework: {
        name: "Hypothesis Testing Framework",
        elements: [
          { name: "Hypothèse", description: "Formulation claire : 'Nous croyons que [segment] paiera [prix] pour [solution]'" },
          { name: "Métrique", description: "Le KPI qui prouve/invalide : Taux de conversion, NPS, Revenue" },
          { name: "Seuil de succès", description: "Le chiffre minimum : 'Si < 5% conversion → pivoter'" },
          { name: "Expérience", description: "Le test concret : Landing page, interview, prototype" },
          { name: "Durée", description: "Time-box : 2-4 semaines maximum" },
        ],
      },
      table: {
        headers: ["Hypothèse", "Test", "Métrique", "Seuil", "Résultat"],
        rows: [
          ["Le problème existe", "20 interviews", "% qui confirment", ">80%", "___"],
          ["Ils paieront 29€/mois", "Landing page", "Taux de pré-commande", ">3%", "___"],
          ["MVP résout le problème", "Beta 50 users", "NPS", ">40", "___"],
          ["Canal d'acquisition", "Google Ads test", "CPC + Conversion", "CAC < 30€", "___"],
        ],
      },
    },
  },

  // ===== TACTIC 14: CUSTOMER ACQUISITION =====
  {
    id: 16,
    title: "Tactic #14 — Acquisition Client",
    subtitle: "Les 19 canaux de traction de Bullseye Framework",
    module: "Phase 6 : Croissance",
    type: "concept",
    content: {
      definition: "L'acquisition n'est pas un afterthought — c'est un processus structuré. Le Bullseye Framework vous aide à identifier les 2-3 canaux qui fonctionnent pour VOTRE startup.",
      keyPoints: [
        "19 canaux de traction : SEO, PR, Content, Paid, Viral, Sales, etc.",
        "Étape 1 : Brainstormer les 19 canaux (tous sans exception)",
        "Étape 2 : Prioriser 6 canaux pour des tests rapides",
        "Étape 3 : Focus sur les 2-3 qui montrent des résultats",
        "Étape 4 : Optimiser et scaler le canal #1"
      ],
      caseStudy: {
        name: "Airbnb",
        context: "Canal #1 = Craigslist hack + SEO (pas de paid ads au début)",
        lesson: "Le meilleur canal est souvent contre-intuitif et spécifique à votre marché"
      },
      tips: [
        "Budget test par canal : 500-1000€ maximum",
        "Durée test : 2 semaines par canal",
        "Métrique clé : CAC (Cost per Acquisition)"
      ],
    },
  },

  // ===== TACTIC 15: PLAN FOR GROWTH =====
  {
    id: 17,
    title: "Tactic #15 — Plan de Croissance",
    subtitle: "De 0 à 1, puis de 1 à N : Deux jeux très différents",
    module: "Phase 6 : Croissance",
    type: "concept",
    content: {
      definition: "La croissance post-Product/Market Fit est un sport différent de la validation. Les métriques changent, l'équipe doit évoluer, et l'exécution devient le facteur critique.",
      keyPoints: [
        "0 → 1 : Trouver le PMF. Metric = Retention + NPS > 40",
        "1 → N : Scaler. Metric = Growth Rate + Unit Economics",
        "Les 3 moteurs de croissance (Eric Ries) : Sticky, Viral, Paid",
        "Rule of 40 : Growth Rate + Profit Margin > 40%",
        "Blitzscaling : Quand scaler vite > scaler efficacement (rare)"
      ],
      table: {
        headers: ["Phase", "Focus", "Métrique clé", "Erreur commune"],
        rows: [
          ["0 → 1", "Problem/Solution Fit", "Qualitative interviews", "Scaler trop tôt"],
          ["1 → 10", "Product/Market Fit", "Retention + NPS", "Sous-investir en produit"],
          ["10 → 100", "Channel Fit", "CAC/LTV + Growth Rate", "Ignorer unit economics"],
          ["100 → N", "Moat Building", "Market Share + Margins", "Perdre la culture"],
        ],
      },
    },
  },

  // ===== SLIDES COMPLÉMENTAIRES =====
  {
    id: 18,
    title: "Workbook — Unit Economics Calculator",
    subtitle: "Calculez votre viabilité économique en temps réel",
    module: "Phase 4 : Monétisation",
    type: "exercise",
    content: {
      definition: "Les Unit Economics sont LE test de viabilité. Si votre LTV < 3× CAC, vous brûlez du cash plus vite que vous n'en créez.",
      table: {
        headers: ["Métrique", "Formule", "Votre chiffre", "Benchmark"],
        rows: [
          ["ARPU (Average Revenue Per User)", "Revenue total / Nb users", "___€", "Dépend du secteur"],
          ["CAC (Customer Acquisition Cost)", "Dépenses marketing / Nb nouveaux clients", "___€", "< 1/3 LTV"],
          ["LTV (Lifetime Value)", "ARPU × Durée de vie moyenne", "___€", "> 3× CAC"],
          ["Churn Rate", "Clients perdus / Total clients × 100", "___%", "< 5% mensuel (SaaS)"],
          ["Payback Period", "CAC / ARPU mensuel", "___ mois", "< 12 mois"],
          ["Burn Rate", "Dépenses mensuelles - Revenue mensuel", "___€", "Runway > 18 mois"],
        ],
      },
      tips: [
        "Prompt : 'Calculez vos unit economics réels, pas espérés'",
        "Si LTV/CAC < 1 → Problème critique : changez le modèle",
        "Le Payback Period est plus important que le LTV en early-stage"
      ],
    },
  },

  {
    id: 19,
    title: "Workbook — Pitch Deck Structure",
    subtitle: "Les 12 slides qui lèvent des fonds",
    module: "Phase 6 : Croissance",
    type: "exercise",
    content: {
      definition: "Votre pitch deck doit raconter une histoire en 12 slides maximum. Chaque slide a un objectif précis.",
      steps: [
        { step: "Slide 1 : Hook", description: "Statistique choc ou question provocante (10 secondes max)" },
        { step: "Slide 2 : Problème", description: "Le problème QUANTIFIÉ que vous résolvez" },
        { step: "Slide 3 : Solution", description: "Votre approche unique en 1 phrase + démo visuelle" },
        { step: "Slide 4 : Traction", description: "Les métriques qui prouvent le PMF (courbe en hausse)" },
        { step: "Slide 5 : Marché", description: "TAM/SAM/SOM avec sources crédibles" },
        { step: "Slide 6 : Business Model", description: "Comment vous gagnez de l'argent (unit economics)" },
        { step: "Slide 7 : Concurrence", description: "Matrice de positionnement (vous en haut à droite)" },
        { step: "Slide 8 : Équipe", description: "Pourquoi VOUS êtes l'équipe pour cette mission" },
        { step: "Slide 9 : Roadmap", description: "Plan 12-18 mois avec milestones" },
        { step: "Slide 10 : Financials", description: "Projections 3 ans + hypothèses claires" },
        { step: "Slide 11 : Ask", description: "Combien + pour quoi (use of funds)" },
        { step: "Slide 12 : Vision", description: "Où serez-vous dans 5 ans ? Inspirez." },
      ],
    },
  },

  {
    id: 20,
    title: "Framework — Decision Metrics Dashboard",
    subtitle: "Les métriques qui comptent à chaque étape",
    module: "Phase 6 : Croissance",
    type: "framework",
    content: {
      definition: "Chaque phase de startup nécessite des métriques différentes. Suivre les mauvaises métriques au mauvais moment est la cause #1 d'échec.",
      table: {
        headers: ["Phase", "North Star Metric", "Leading Indicators", "Lagging Indicators"],
        rows: [
          ["Discovery", "Nb d'interviews", "Insights qualifiés", "Hypothèses validées"],
          ["Validation", "Taux de conversion LP", "Visiteurs uniques", "Pré-commandes"],
          ["MVP", "Activation Rate", "Temps to Aha Moment", "Retention D7/D30"],
          ["Growth", "MRR Growth Rate", "Paid CAC + Organic %", "Churn + NPS"],
          ["Scale", "Revenue per Employee", "Gross Margin %", "Market Share"],
        ],
      },
      keyPoints: [
        "North Star Metric = LA métrique qui résume votre succès",
        "Leading Indicators prédisent le futur — agissez dessus",
        "Lagging Indicators confirment le passé — analysez-les",
        "Vanity Metrics (downloads, followers) sont des pièges"
      ],
    },
  },

  // ===== RÉCAPITULATIF =====
  {
    id: 21,
    title: "Récapitulatif — Les 15 Tactiques en Action",
    subtitle: "Checklist de sortie : Avez-vous exécuté chaque tactique ?",
    module: "Conclusion",
    type: "summary",
    content: {
      definition: "L'entrepreneuriat discipliné n'est pas un exercice théorique. Chaque tactique doit être exécutée, mesurée et itérée.",
      table: {
        headers: ["#", "Tactique", "Livrable", "Status"],
        rows: [
          ["1", "Get Started", "Matrice 3 idées scorées", "☐"],
          ["2", "Segmentation", "Beachhead market identifié", "☐"],
          ["3", "End-User Profile", "Persona basé sur interviews", "☐"],
          ["4", "Calculer TAM", "TAM/SAM/SOM chiffrés", "☐"],
          ["5", "Value Proposition", "1 phrase + QVP", "☐"],
          ["6", "Persona Deep Dive", "JTBD + Pain points", "☐"],
          ["7", "Cycle de Vie", "Funnel AARRR cartographié", "☐"],
          ["8", "Quantifier VP", "ROI client calculé", "☐"],
          ["9", "Core / Moat", "Avantage compétitif défini", "☐"],
          ["10", "Business Model", "Pattern + pricing validé", "☐"],
          ["11", "Pricing", "Van Westendorp + 3 tiers", "☐"],
          ["12", "MVP Design", "Hypothèse + MVP livré", "☐"],
          ["13", "Test Hypothèses", "Tableau résultats rempli", "☐"],
          ["14", "Acquisition", "Bullseye : 2-3 canaux trouvés", "☐"],
          ["15", "Plan Croissance", "Roadmap 12 mois + KPIs", "☐"],
        ],
      },
    },
    quote: { text: "Ideas are easy. Execution is everything.", author: "John Doerr" },
  },

  {
    id: 22,
    title: "Notes de l'Animateur — Guide d'Animation",
    subtitle: "Script et timing pour une séance de 4 heures",
    module: "Conclusion",
    type: "content",
    content: {
      definition: "Ce guide donne le script complet pour animer une séance pratique basée sur les 15 tactiques. Chaque bloc de 20 minutes alterne théorie (5 min) et exercice pratique (15 min).",
      steps: [
        { step: "00:00 - 00:20 : Ice-breaker", description: "Chaque participant pitch son idée en 60 secondes. Vote sur les 5 meilleures." },
        { step: "00:20 - 01:00 : Tactiques 1-3", description: "Get Started + Segmentation + Persona. Exercice : Remplir le End-User Profile Canvas." },
        { step: "01:00 - 01:15 : Pause", description: "Networking + échanges informels entre groupes." },
        { step: "01:15 - 02:00 : Tactiques 4-7", description: "TAM + VP + JTBD + Lifecycle. Exercice : Calculer TAM bottom-up." },
        { step: "02:00 - 02:45 : Tactiques 8-11", description: "QVP + Core + BM + Pricing. Exercice : Unit Economics Calculator." },
        { step: "02:45 - 03:00 : Pause", description: "" },
        { step: "03:00 - 03:40 : Tactiques 12-15", description: "MVP + Tests + Acquisition + Growth. Exercice : Design du MVP + Bullseye." },
        { step: "03:40 - 04:00 : Pitch final", description: "Chaque groupe pitch son projet complet en 3 min. Feedback collectif." },
      ],
      tips: [
        "Imprimez les workbooks avant la séance",
        "Utilisez un timer visible pour chaque exercice",
        "Groupes de 3-4 personnes maximum",
        "Encouragez le feedback brutal mais constructif"
      ],
    },
  },
];
