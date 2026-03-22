// Startup Program Design - Support de cours complet
// Basé sur: "Designing the Successful Corporate Accelerator" (Miller & Kagan, Wiley 2021)
// et "Startup Program Design" (Lombardi & Berk, McGraw Hill 2022)
// Contextualisé pour l'écosystème tunisien

export interface SPSlide {
  id: number;
  module: string;
  title: string;
  subtitle?: string;
  content: string[];
  keyPoints?: string[];
  examples?: string[];
  tunisianContext?: string[];
  type: 'intro' | 'content' | 'case-study' | 'framework' | 'summary';
}

export const startupProgramSlidesData: SPSlide[] = [
  // ═══════════════════════════════════════════
  // MODULE 1: Fondements & Contexte (1-15)
  // ═══════════════════════════════════════════
  {
    id: 1, module: "Module 1: Fondements",
    title: "Startup Program Design",
    subtitle: "Concevoir des Accélérateurs et Incubateurs Performants",
    content: [
      "Un guide complet pour concevoir, lancer et gérer des programmes startup",
      "Basé sur l'analyse de +500 programmes dans le monde",
      "Adapté au contexte de l'écosystème tunisien"
    ],
    type: 'intro'
  },
  {
    id: 2, module: "Module 1: Fondements",
    title: "Pourquoi les Startup Programs ?",
    subtitle: "L'Innovation par la Collaboration",
    content: [
      "80% des dirigeants estiment que leur business model est menacé de disruption (McKinsey)",
      "84% considèrent l'innovation essentielle à leur stratégie de croissance",
      "88% pensent que la collaboration avec les startups est indispensable (KPMG)",
      "60% des accélérateurs corporate échouent dans les 2 premières années"
    ],
    keyPoints: [
      "L'innovation ne peut pas être planifiée — elle doit être favorisée",
      "Les startups offrent agilité, technologie et détermination",
      "Les programmes structurés maximisent les chances de succès"
    ],
    type: 'content'
  },
  {
    id: 3, module: "Module 1: Fondements",
    title: "Build, Buy or Partner ?",
    subtitle: "Les 3 Stratégies d'Innovation",
    content: [
      "BUILD (Interne): Souvent inefficace — 'pousser l'eau en montée'. Les organisations rejettent naturellement les distractions",
      "BUY (Externe): L'intégration talent/tech est complexe. Risque de créer des chimères sans cohérence stratégique",
      "PARTNER (Collaboration): Le pont parfait — personnalisation du Build sans absorption totale du Buy"
    ],
    keyPoints: [
      "Le partenariat fonctionne quand les deux parties sont engagées",
      "Ces 3 stratégies coexistent dans la plupart des organisations",
      "L'innovation nécessite essai-erreur, itération et apprentissage continu"
    ],
    tunisianContext: [
      "En Tunisie, le Startup Act favorise le modèle 'Partner' via des incitations fiscales",
      "Les grandes entreprises tunisiennes (Telnet, Poulina) explorent les 3 voies"
    ],
    type: 'content'
  },
  {
    id: 4, module: "Module 1: Fondements",
    title: "Le Big Bang des Startup Programs",
    subtitle: "De Y Combinator aux Milliers de Programmes",
    content: [
      "2005: Y Combinator — Premier accélérateur moderne à Boston",
      "2008-2012: Microsoft, Google, Sprint, T-Mobile ouvrent des accélérateurs corporate",
      "2010: Start-Up Chile — Premier programme gouvernemental majeur",
      "2011: Wayra (Telefónica) — 14 pays, modèle d'accélérateur corporate global",
      "Aujourd'hui: Des milliers de programmes hybrides dans le monde entier"
    ],
    keyPoints: [
      "Le CVC s'est 'dégroupé' en programmes spécialisés",
      "Chaque modèle excelle dans un contexte spécifique",
      "Les frontières entre accélérateur, incubateur et hackathon s'estompent"
    ],
    type: 'content'
  },
  {
    id: 5, module: "Module 1: Fondements",
    title: "Qu'est-ce qu'un Startup Program ?",
    subtitle: "Définition Unifiée",
    content: [
      "Un processus pour engager des startups externes et créer des partenariats d'innovation temporaires de manière gérable, répétable et améliorable",
      "La collaboration peut durer d'un jour (hackathon) à plusieurs années (investissement equity)",
      "L'equity devient un paramètre de configuration, pas une caractéristique définissante"
    ],
    keyPoints: [
      "Accélérateurs, incubateurs, hackathons = outils d'un même coffre",
      "Le design du programme dépend du contexte, pas d'un template fixe",
      "Les meilleurs opérateurs adaptent constamment leur modèle"
    ],
    type: 'framework'
  },
  {
    id: 6, module: "Module 1: Fondements",
    title: "L'Innovation Theater — Le Piège #1",
    subtitle: "Quand l'Accélérateur Devient un Zoo",
    content: [
      "Symptômes: Beaucoup de hype, peu de substance. Espaces trendy sans résultats",
      "Exemple 'The Zoo': Cabinet européen avec accélérateur splendide — zéro partenariat réel",
      "Les partenariats avec les startups participantes se concrétisent moins de 1% du temps",
      "Innovation theater = tactiques startup (hackathons, lean, agile) sans engagement réel"
    ],
    keyPoints: [
      "Pas de ping-pong ou de café exotic sans stratégie réelle",
      "Un accélérateur n'est PAS un programme marketing",
      "Le succès se mesure en partenariats, pas en articles de presse"
    ],
    tunisianContext: [
      "Risque en Tunisie: lancer des 'demo days' sans suivi ni intégration réelle",
      "Flat6Labs Tunis et Impact Partner illustrent des modèles structurés efficaces"
    ],
    type: 'content'
  },
  {
    id: 7, module: "Module 1: Fondements",
    title: "Ce que font les Experts vs les Novices",
    subtitle: "Leçons des Vétérans du Secteur",
    content: [
      "NOVICES: Copient Y Combinator/Techstars sans avoir les mêmes atouts (mentors, réseau, marque)",
      "NOVICES: Créent des programmes 'Frankenstein' en mélangeant sans intention",
      "EXPERTS: Commencent par 'Qu'essayez-vous d'accomplir?' avant de choisir le modèle",
      "EXPERTS: Interviewent des dizaines de parties prenantes internes avant de décider"
    ],
    keyPoints: [
      "Copier-coller un modèle qui marche ailleurs ne fonctionne JAMAIS",
      "Le design intentionnel est la clé du succès",
      "Adapter le programme au contexte local est critique"
    ],
    type: 'content'
  },
  {
    id: 8, module: "Module 1: Fondements",
    title: "L'Écosystème Tunisien des Programmes Startup",
    subtitle: "Cartographie des Acteurs Clés",
    content: [
      "Accélérateurs: Flat6Labs Tunis, Founder Institute Tunis, Startupbootcamp",
      "Incubateurs: BIAT Labs, Lella Cowork, Wiki Start Up",
      "Support: Impact Partner, Lab'ess, Open Startup Tunisia",
      "Financement: CDC, BFPME, Smart Capital, Anava Seed Fund"
    ],
    tunisianContext: [
      "Le Startup Act (2018) a créé un cadre légal unique en Afrique",
      "+800 startups labellisées depuis 2019",
      "Défis: fragmentation des programmes, manque de suivi post-programme",
      "Opportunité: créer des programmes plus intentionnels et mesurables"
    ],
    type: 'content'
  },
  {
    id: 9, module: "Module 1: Fondements",
    title: "Cas d'Étude: Wayra (Telefónica)",
    subtitle: "L'Évolution d'un Programme Corporate Global",
    content: [
      "2011: Lancement comme accélérateur — 14 'Academies' dans 14 pays",
      "Investissement initial: 50 000€ pour 5-10% d'equity en seed-stage",
      "2018: Relancement — plus de startups matures, focus sur le fit stratégique",
      "Les 'Academies' deviennent des 'Open Innovation Hubs'",
      "Résultat: +25M$ de contrats pour les startups, 170+ collaborations actives"
    ],
    keyPoints: [
      "Le programme a évolué de 'accélérateur' à 'micro-CVC'",
      "54M€ investis, 600M€ de co-investissements tiers attirés",
      "Le changement d'identité reflète l'évolution des objectifs stratégiques"
    ],
    type: 'case-study'
  },
  {
    id: 10, module: "Module 1: Fondements",
    title: "Cas d'Étude: Start-Up Chile",
    subtitle: "Un Modèle Gouvernemental Inspirant pour la Tunisie",
    content: [
      "2010: Lancé par CORFO pour encourager l'entrepreneuriat via des fondateurs étrangers",
      "Grants non-dilutifs: 20 000$ à 100 000$ — pas d'equity prise",
      "Contrepartie: 'Give Back' — événements, conférences, mentorat dans les universités",
      "1 960 startups accompagnées, 1,27 milliard$ de revenus cumulés",
      "300 000 Chiliens impliqués dans des événements d'innovation"
    ],
    tunisianContext: [
      "Le Startup Act tunisien s'inspire partiellement de ce modèle",
      "La Tunisie pourrait développer un programme similaire via la CDC ou Smart Capital",
      "L'approche 'Give Back' est applicable aux technopoles tunisiennes"
    ],
    type: 'case-study'
  },

  // ═══════════════════════════════════════════
  // MODULE 2: Théorie de l'Innovation Corporate (11-25)
  // ═══════════════════════════════════════════
  {
    id: 11, module: "Module 2: Innovation Corporate",
    title: "L'Innovation Corporate est Difficile",
    subtitle: "Comprendre les Défis Structurels",
    content: [
      "Le dilemme court-terme vs long-terme: cycle de résultats à 90 jours vs investissement innovation",
      "Le Dilemme de l'Innovateur (Christensen): ce qui a mené au succès empêche le succès futur",
      "Le défi du talent: les entrepreneurs préfèrent être entrepreneurs, pas employés",
      "La résistance culturelle: les organisations sont conçues pour exécuter, pas pour explorer"
    ],
    keyPoints: [
      "L'innovation requiert prise de risque — antithétique à la culture corporate",
      "Les 'intrapreneurs' ont besoin d'un bouclier contre la bureaucratie",
      "Sans sponsor exécutif, les programmes d'innovation meurent"
    ],
    type: 'content'
  },
  {
    id: 12, module: "Module 2: Innovation Corporate",
    title: "Théorie de l'Innovation — Crash Course",
    subtitle: "Les Cadres Fondamentaux",
    content: [
      "Clayton Christensen: Innovation disruptive vs sustaining — les nouveaux entrants attaquent par le bas",
      "Steve Blank: Lean Startup — 'tester et itérer, puis tester encore'",
      "Geoffrey Moore: Crossing the Chasm — le gouffre entre early adopters et majorité",
      "Rita McGrath: Discovery-Driven Planning — planifier dans l'incertitude"
    ],
    keyPoints: [
      "L'innovation disruptive menace les business models établis",
      "Le Lean Startup est la méthode scientifique appliquée au business",
      "Les grandes entreprises doivent apprendre à 'explorer' comme les startups"
    ],
    type: 'content'
  },
  {
    id: 13, module: "Module 2: Innovation Corporate",
    title: "L'Ambidextrie Organisationnelle",
    subtitle: "Explorer ET Exploiter Simultanément",
    content: [
      "EXPLOITER: Optimiser les business existants — efficacité, processus, marges",
      "EXPLORER: Rechercher de nouveaux modèles — expérimentation, incertitude, disruption",
      "L'ambidextrie = séparer ces deux fonctions en développant des routes parallèles",
      "Les startup programs sont l'outil idéal pour la route 'Explorer'"
    ],
    keyPoints: [
      "Les routes internes et externes à l'innovation doivent coexister",
      "Le CVC, les accélérateurs et les studios sont des outils complémentaires",
      "L'erreur fatale: utiliser les mêmes processus pour exploiter et explorer"
    ],
    tunisianContext: [
      "Les groupes tunisiens (Amen Group, BIAT, Poulina) commencent cette transition",
      "Le défi: la gouvernance familiale freine souvent l'exploration"
    ],
    type: 'framework'
  },
  {
    id: 14, module: "Module 2: Innovation Corporate",
    title: "La Machine Complexe vs la Machine Simple",
    subtitle: "Simplifier l'Innovation Corporate",
    content: [
      "MACHINE COMPLEXE: Silos multiples, processus lourds, décisions lentes, approbations en cascade",
      "MACHINE SIMPLE: Équipe dédiée, autonomie de décision, cycles rapides, métriques claires",
      "L'accélérateur corporate = transformer la machine complexe en machine simple pour l'innovation",
      "Principe clé: protéger l'équipe innovation de la bureaucratie corporate"
    ],
    keyPoints: [
      "Commencer petit, prouver la valeur, puis scaler",
      "L'équipe innovation doit reporter directement au CEO/Board",
      "Les métriques d'innovation ≠ les métriques business traditionnelles"
    ],
    type: 'content'
  },
  {
    id: 15, module: "Module 2: Innovation Corporate",
    title: "Le Spectre des Programmes d'Innovation",
    subtitle: "De l'Interne à l'Externe",
    content: [
      "R&D Interne: Recherche fondamentale, brevets, développement produit — très contrôlé",
      "Skunkworks: Équipes internes protégées, hors process — semi-autonome",
      "Corporate Venture Capital: Investissement dans des startups externes — financial focus",
      "Accélérateurs: Programmes structurés d'engagement startup — partenariat focus",
      "Hackathons / Challenges: Événements courts de sourcing d'innovation — exploration rapide"
    ],
    keyPoints: [
      "Chaque outil a un objectif et un contexte optimal",
      "Un programme ne remplace pas un autre — ils se complètent",
      "L'erreur: attendre d'un hackathon ce que seul un accélérateur peut livrer"
    ],
    type: 'framework'
  },

  // ═══════════════════════════════════════════
  // MODULE 3: Archétypes & Design (16-30)
  // ═══════════════════════════════════════════
  {
    id: 16, module: "Module 3: Archétypes & Design",
    title: "Les Archétypes d'Accélérateurs",
    subtitle: "Quel Modèle pour Quel Objectif ?",
    content: [
      "1. VENTURE ACCELERATOR: Focus retour financier — modèle VC, equity, demo day investisseurs",
      "2. ECOSYSTEM ACCELERATOR: Développement communautaire — institutions publiques, réseaux locaux",
      "3. MATCHMAKING ACCELERATOR: Résolution de problèmes — corporate, pilotes, intégration produit",
      "4. IMPACT ACCELERATOR: Mission sociale/environnementale — ONG, gouvernements, ODD"
    ],
    keyPoints: [
      "Le choix de l'archétype détermine TOUT le design du programme",
      "Ne pas mélanger les archétypes sans intention claire",
      "Un programme peut évoluer d'un archétype à un autre (cf. Wayra)"
    ],
    tunisianContext: [
      "Flat6Labs Tunis: Venture Accelerator — seed funding + equity",
      "Impact Partner: Impact Accelerator — Yunus Social Business",
      "Open Startup Tunisia: Ecosystem Accelerator — pré-incubation + ODD"
    ],
    type: 'framework'
  },
  {
    id: 17, module: "Module 3: Archétypes & Design",
    title: "Know Your Why",
    subtitle: "La Question Fondamentale Avant Tout Design",
    content: [
      "Avant de choisir un modèle: POURQUOI voulez-vous travailler avec des startups ?",
      "Objectif Croissance: Accéder à de nouvelles technologies, marchés, talents",
      "Objectif Solution Sourcing: Résoudre un problème spécifique avec une startup",
      "Objectif Ecosystem Building: Développer un écosystème d'innovation local",
      "Objectif Impact: Utiliser l'entrepreneuriat pour résoudre des défis sociaux/environnementaux"
    ],
    keyPoints: [
      "Le 'Why' guide toutes les décisions de conception",
      "Des objectifs différents = des programmes radicalement différents",
      "Sans 'Why' clair → Innovation Theater garanti"
    ],
    type: 'content'
  },
  {
    id: 18, module: "Module 3: Archétypes & Design",
    title: "Le Context-Aware Design",
    subtitle: "Adapter le Programme à VOTRE Réalité",
    content: [
      "Cercle 1 — UNIQUENESS & READINESS: Qui êtes-vous ? Quels sont vos atouts uniques ?",
      "Cercle 2 — OBJECTIVES: Que voulez-vous accomplir ? Croissance, solutions, écosystème, impact ?",
      "Cercle 3 — TARGET STARTUPS: Quelles startups cibler ? Stage, secteur, géographie ?",
      "L'intersection des 3 cercles = votre design optimal de programme"
    ],
    keyPoints: [
      "Un framework de design en 3 cercles concentriques",
      "L'auto-évaluation honnête est le point de départ",
      "Les startups cibles dépendent de vos objectifs ET de vos capacités"
    ],
    type: 'framework'
  },
  {
    id: 19, module: "Module 3: Archétypes & Design",
    title: "Cercle 1: Uniqueness & Readiness",
    subtitle: "Évaluer Votre Organisation",
    content: [
      "ATOUTS UNIQUES: Marque, réseau, technologie, données, clients, distribution",
      "CULTURE: Appétit pour le risque, tolérance à l'échec, vitesse de décision",
      "RESSOURCES: Budget, équipe dédiée, espace physique, temps management",
      "SPONSOR EXÉCUTIF: Le facteur #1 de succès — sans sponsor, pas de programme"
    ],
    keyPoints: [
      "Question clé: Qu'avez-vous que les startups veulent et ne peuvent obtenir ailleurs ?",
      "L'honnêteté sur vos limitations est plus importante que vos ambitions",
      "Un programme modeste mais bien exécuté bat un programme ambitieux mal soutenu"
    ],
    tunisianContext: [
      "Évaluer les atouts des institutions tunisiennes: accès au marché maghrébin/africain",
      "Les technopoles (El Ghazala, Sfax, Sousse) offrent infrastructure + talent",
      "Le réseau diaspora tunisienne est un atout sous-exploité"
    ],
    type: 'content'
  },
  {
    id: 20, module: "Module 3: Archétypes & Design",
    title: "Cercle 2: Objectifs Stratégiques",
    subtitle: "4 Objectifs Fondamentaux",
    content: [
      "🚀 CROISSANCE: Nouvelles technologies, marchés, modèles business — Innovation pipeline",
      "🔍 SOLUTION SOURCING: Résoudre un problème identifié — PoC, pilote, intégration",
      "🌐 ECOSYSTEM BUILDING: Créer un réseau d'innovation — communauté, événements, co-création",
      "💚 IMPACT: Résoudre des défis sociaux/environnementaux — ODD, inclusion, climat"
    ],
    keyPoints: [
      "Chaque objectif implique des métriques, durées et structures différentes",
      "Un programme peut avoir un objectif principal et des objectifs secondaires",
      "L'alignement objectifs ↔ parties prenantes est critique"
    ],
    type: 'framework'
  },
  {
    id: 21, module: "Module 3: Archétypes & Design",
    title: "Cercle 3: Les Startups Cibles",
    subtitle: "Qui Voulez-Vous Attirer ?",
    content: [
      "STAGE: Idée, pre-seed, seed, Série A+ — Le stage détermine le type de support nécessaire",
      "SECTEUR: Vertical (même industrie) vs Horizontal (tech applicable partout)",
      "GÉOGRAPHIE: Local, régional, international — Impact sur la diversité du deal flow",
      "MATURITÉ TECH: Deep tech vs Digital vs Hybride — Impact sur la durée du programme"
    ],
    keyPoints: [
      "Plus la startup est early-stage, plus le programme doit être éducatif",
      "Plus la startup est mature, plus le programme doit être orienté business",
      "Le match startup ↔ organisation est aussi important que le programme lui-même"
    ],
    tunisianContext: [
      "Les startups tunisiennes sont majoritairement en pre-seed/seed",
      "Secteurs porteurs: FinTech, EdTech, AgriTech, HealthTech, GreenTech",
      "L'Afrique francophone est un marché d'expansion naturel"
    ],
    type: 'content'
  },
  {
    id: 22, module: "Module 3: Archétypes & Design",
    title: "Le Startup Program Canvas",
    subtitle: "Outil de Design Visuel",
    content: [
      "1. CONTEXTE: Qui sommes-nous ? Quels atouts ? Quel écosystème ?",
      "2. OBJECTIFS: Pourquoi ce programme ? Quels résultats attendus ?",
      "3. CIBLES: Quelles startups ? Quel stage ? Quel secteur ?",
      "4. VALUE PROP: Que leur offrons-nous ? Pourquoi nous choisir ?",
      "5. STRUCTURE: Durée, format, cohorte, curriculum",
      "6. SÉLECTION: Critères, processus, nombre de startups",
      "7. CAPTURE DE VALEUR: Equity, partenariat, IP, données",
      "8. MÉTRIQUES: Comment mesurer le succès ?"
    ],
    keyPoints: [
      "Un Canvas à remplir AVANT de lancer le programme",
      "Outil de communication avec les parties prenantes internes",
      "Doit être itéré et mis à jour après chaque cohorte"
    ],
    type: 'framework'
  },

  // ═══════════════════════════════════════════
  // MODULE 4: Engagement des Parties Prenantes (23-32)
  // ═══════════════════════════════════════════
  {
    id: 23, module: "Module 4: Parties Prenantes",
    title: "L'Engagement des Parties Prenantes",
    subtitle: "Le Facteur #1 de Succès ou d'Échec",
    content: [
      "Sans buy-in organisationnel, même le meilleur programme échouera",
      "Les parties prenantes internes déterminent la survie du programme",
      "L'engagement doit être obtenu AVANT le lancement, pas après",
      "Un sponsor exécutif au niveau C-suite est non-négociable"
    ],
    keyPoints: [
      "Mappper toutes les parties prenantes: supporters, neutres, résistants",
      "Transformer les résistants en alliés via des victoires rapides",
      "Communiquer les résultats régulièrement et en termes business"
    ],
    type: 'content'
  },
  {
    id: 24, module: "Module 4: Parties Prenantes",
    title: "La Carte des Parties Prenantes",
    subtitle: "Qui Soutient, Qui Bloque, Qui Décide ?",
    content: [
      "CEO/Board: Sponsor stratégique — doit voir l'innovation comme survie, pas luxe",
      "BU Leaders: Clients internes — doivent être co-créateurs, pas spectateurs",
      "Finance/Legal: Gardiens — doivent comprendre les métriques d'innovation",
      "RH: Facilitateurs — talent, culture, incentives pour l'innovation",
      "Marketing/Com: Amplificateurs — storytelling interne et externe"
    ],
    keyPoints: [
      "Chaque partie prenante a ses propres motivations et peurs",
      "Adapter le pitch à chaque audience",
      "Les 'middle managers' sont souvent les plus grands résistants"
    ],
    tunisianContext: [
      "En Tunisie, la gouvernance familiale implique souvent le fondateur/patriarche comme décideur unique",
      "Les structures publiques nécessitent un alignement avec la tutelle ministérielle",
      "Les bailleurs internationaux (GIZ, AFD, UE) sont des parties prenantes clés"
    ],
    type: 'content'
  },
  {
    id: 25, module: "Module 4: Parties Prenantes",
    title: "Ressources Nécessaires",
    subtitle: "Budget, Équipe et Infrastructure",
    content: [
      "BUDGET: De 50K$ (programme minimal) à 5M$+ (accélérateur corporate global)",
      "ÉQUIPE: Program manager dédié (pas à temps partiel !), coordinateur, mentors",
      "ESPACE: Coworking, salle de réunion, accès aux labs/prototypage",
      "RÉSEAU: Mentors, experts sectoriels, investisseurs, clients potentiels",
      "TEMPS MANAGEMENT: Engagement hebdomadaire des sponsors et BU leaders"
    ],
    keyPoints: [
      "Le sous-investissement est la cause #1 d'échec",
      "Mieux vaut un petit programme bien financé qu'un grand programme sous-financé",
      "Le temps des executives est la ressource la plus rare et la plus précieuse"
    ],
    type: 'content'
  },
  {
    id: 26, module: "Module 4: Parties Prenantes",
    title: "Outsourcing vs In-House",
    subtitle: "Quand Externaliser le Programme ?",
    content: [
      "IN-HOUSE: Contrôle total, alignement stratégique, apprentissage organisationnel",
      "OUTSOURCE: Expertise immédiate, réseau établi, crédibilité marché",
      "HYBRIDE: Design interne, exécution externe — le modèle le plus courant",
      "Opérateurs spécialisés: Techstars, Plug and Play, Founder Institute, MassChallenge"
    ],
    keyPoints: [
      "L'outsourcing n'est PAS une abdication de responsabilité",
      "L'opérateur externe doit comprendre votre contexte stratégique",
      "Prévoir un transfert de compétences vers l'équipe interne"
    ],
    tunisianContext: [
      "En Tunisie: Flat6Labs opère via franchise internationale",
      "Les GIZ/USAID financent souvent des opérateurs locaux",
      "Opportunité: développer des opérateurs tunisiens de classe internationale"
    ],
    type: 'content'
  },

  // ═══════════════════════════════════════════
  // MODULE 5: Avant le Programme (27-38)
  // ═══════════════════════════════════════════
  {
    id: 27, module: "Module 5: Avant le Programme",
    title: "Recrutement et Sélection",
    subtitle: "Attirer les Meilleures Startups",
    content: [
      "LE DEAL FLOW: Pipeline de candidatures — qualité > quantité",
      "SOURCING: Appels à candidatures, événements, scouts, réseau de mentors/VC",
      "APPLICATION: Formulaire structuré mais pas bureaucratique — max 30 minutes",
      "SCREENING: Premier filtre — fit thématique, stade, équipe, traction"
    ],
    keyPoints: [
      "Une startup de qualité a des dizaines d'options — pourquoi vous choisir ?",
      "Votre value proposition pour les startups doit être claire et unique",
      "Le process de sélection est aussi votre première impression"
    ],
    tunisianContext: [
      "Le deal flow tunisien est concentré sur Tunis — élargir vers les régions",
      "Les universités (INSAT, ESPRIT, ENIT, ESB) sont des sources sous-exploitées",
      "Les communautés tech (Google Dev, AWS Community) sont des canaux efficaces"
    ],
    type: 'content'
  },
  {
    id: 28, module: "Module 5: Avant le Programme",
    title: "Critères de Sélection",
    subtitle: "Comment Évaluer les Candidatures ?",
    content: [
      "ÉQUIPE (40%): Complémentarité, résilience, coachability, engagement full-time",
      "PROBLÈME/MARCHÉ (25%): Taille du marché, urgence du problème, timing",
      "SOLUTION/PRODUIT (20%): Différenciation, IP, prototype/MVP, early traction",
      "FIT PROGRAMME (15%): Alignement avec les objectifs, value-add mutuel, motivation"
    ],
    keyPoints: [
      "L'équipe est TOUJOURS le critère #1 — les idées pivotent, les équipes exécutent",
      "La 'coachability' est plus importante que l'expertise technique",
      "Attention au biais de sélection: ne choisir que des profils similaires aux vôtres"
    ],
    type: 'content'
  },
  {
    id: 29, module: "Module 5: Avant le Programme",
    title: "Processus de Sélection en 4 Étapes",
    subtitle: "De 500 Candidatures à 10 Startups",
    content: [
      "ÉTAPE 1 — Screening (500→100): Revue rapide, fit basique, complétude dossier",
      "ÉTAPE 2 — Deep Dive (100→30): Analyse détaillée, due diligence légère, appels",
      "ÉTAPE 3 — Pitch Day (30→15): Présentation devant jury, Q&A, interaction",
      "ÉTAPE 4 — Final Selection (15→10): Entretiens individuels, références, offre"
    ],
    keyPoints: [
      "Chaque étape a des critères et des décideurs différents",
      "Impliquer les BU leaders dans les étapes finales (skin in the game)",
      "Communiquer un feedback constructif à tous les candidats non retenus"
    ],
    type: 'content'
  },
  {
    id: 30, module: "Module 5: Avant le Programme",
    title: "L'Investissement dans les Startups",
    subtitle: "Equity, Convertibles ou Grants ?",
    content: [
      "EQUITY DIRECTE: 5-10% pour 25-150K$ — standard des venture accelerators (YC, Techstars)",
      "NOTES CONVERTIBLES / SAFE: Investissement converti en equity au prochain tour",
      "GRANTS NON-DILUTIFS: Subventions sans equity — modèle gouvernemental (Start-Up Chile)",
      "ZERO INVESTMENT: Accès aux ressources corporate sans contrepartie financière"
    ],
    keyPoints: [
      "L'equity crée de l'alignement mais effraie les meilleures startups",
      "Les grants attirent plus de candidats mais créent moins d'engagement",
      "Le modèle dépend de votre archétype: Venture → equity, Ecosystem → grants"
    ],
    tunisianContext: [
      "Le Startup Act offre un cadre légal pour les convertibles et SAFE en Tunisie",
      "La CDC et Smart Capital proposent des tickets en equity (50-500K TND)",
      "Les programmes internationaux (USAID, UE) privilégient les grants"
    ],
    type: 'content'
  },
  {
    id: 31, module: "Module 5: Avant le Programme",
    title: "Value Proposition pour les Startups",
    subtitle: "Pourquoi une Startup Choisirait VOTRE Programme ?",
    content: [
      "FINANCEMENT: Cash, crédits cloud, outils gratuits — mais pas le seul levier",
      "RÉSEAU: Mentors, investisseurs, clients potentiels, pairs — souvent le plus valorisé",
      "EXPERTISE: Accès à des experts sectoriels, techniques, business",
      "DISTRIBUTION: Accès à des canaux de vente, clients, marchés — l'avantage corporate",
      "CRÉDIBILITÉ: Association à une marque reconnue — validation marché"
    ],
    keyPoints: [
      "La value prop doit être SPÉCIFIQUE et VÉRIFIABLE",
      "Les startups comparent: que faites-vous que les autres ne font pas ?",
      "La promesse non tenue est pire que pas de promesse du tout"
    ],
    type: 'content'
  },
  {
    id: 32, module: "Module 5: Avant le Programme",
    title: "Métriques et KPIs du Programme",
    subtitle: "Comment Mesurer le Succès ?",
    content: [
      "OUTPUT METRICS: Nombre de startups, de PoC lancés, de partenariats signés",
      "OUTCOME METRICS: Revenus générés, économies réalisées, nouveaux marchés ouverts",
      "IMPACT METRICS: Emplois créés, fonds levés par les startups, satisfaction startups",
      "LEARNING METRICS: Insights générés, pivots identifiés, compétences développées"
    ],
    keyPoints: [
      "Ne PAS mesurer uniquement le nombre de startups passées par le programme",
      "Les métriques doivent être alignées avec les objectifs du programme",
      "Suivre les métriques sur 3-5 ans, pas seulement pendant le programme"
    ],
    tunisianContext: [
      "KPI spécifiques Tunisie: taux de labellisation Startup Act, expansion en Afrique",
      "Métriques d'impact: emplois régionaux créés, inclusion genre, deep tech"
    ],
    type: 'framework'
  },

  // ═══════════════════════════════════════════
  // MODULE 6: Pendant le Programme (33-45)
  // ═══════════════════════════════════════════
  {
    id: 33, module: "Module 6: Pendant le Programme",
    title: "La Programmation du Curriculum",
    subtitle: "Structure et Contenu du Programme",
    content: [
      "SEMAINE 1-2: Onboarding, diagnostic, objectifs individuels, team building",
      "SEMAINE 3-6: Workshops intensifs — product-market fit, modèle économique, go-to-market",
      "SEMAINE 7-10: Développement client, pilotes, prototypage, itérations rapides",
      "SEMAINE 11-12: Préparation Demo Day, pitch practice, connexions investisseurs"
    ],
    keyPoints: [
      "Structure typique: 12 semaines — adaptable selon le contexte",
      "Balance entre contenu éducatif et temps de travail individuel",
      "Éviter le 'death by workshop' — les startups ont besoin de temps pour exécuter"
    ],
    type: 'content'
  },
  {
    id: 34, module: "Module 6: Pendant le Programme",
    title: "Les Composantes du Curriculum",
    subtitle: "Les 6 Piliers d'un Programme Efficace",
    content: [
      "1. ÉDUCATION: Workshops, masterclasses — Lean Startup, business model, finance",
      "2. MENTORAT: Sessions 1:1 régulières avec mentors sectoriels et business",
      "3. DÉVELOPPEMENT PRODUIT: Support technique, prototypage, tests utilisateurs",
      "4. BUSINESS DEVELOPMENT: Introductions clients, pilotes, partenariats",
      "5. FUNDRAISING: Préparation levée de fonds, pitch training, introductions VC",
      "6. COMMUNAUTÉ: Pair-à-pair learning, alumni network, événements sociaux"
    ],
    keyPoints: [
      "Chaque pilier requiert des ressources et expertises différentes",
      "Le ratio workshop/travail individuel optimal: 30/70",
      "La communauté est souvent l'élément le plus valorisé à long terme"
    ],
    type: 'content'
  },
  {
    id: 35, module: "Module 6: Pendant le Programme",
    title: "Le Mentorat — Clé de Voûte",
    subtitle: "Structurer un Programme de Mentorat Efficace",
    content: [
      "TYPES DE MENTORS: Experts sectoriels, entrepreneurs expérimentés, corporate executives, techniques",
      "MATCHING: Assigner 3-5 mentors par startup selon les besoins spécifiques",
      "CADENCE: Sessions bi-hebdomadaires de 1h — régularité > durée",
      "FORMATION: Les mentors doivent être formés — mentorer ≠ conseiller"
    ],
    keyPoints: [
      "Un bon mentor pose des questions, un mauvais mentor donne des réponses",
      "Le match mentor-startup est plus important que le CV du mentor",
      "Rotation des mentors selon les phases du programme"
    ],
    tunisianContext: [
      "La diaspora tunisienne est une source riche de mentors internationaux",
      "Les réseaux d'anciens (INSAT Alumni, Polytechnique) peuvent être mobilisés",
      "Le mentorat virtuel élargit l'accès aux experts globaux"
    ],
    type: 'content'
  },
  {
    id: 36, module: "Module 6: Pendant le Programme",
    title: "Faire Fonctionner les Partenariats",
    subtitle: "L'Art du Corporate-Startup Partnership",
    content: [
      "LE DÉFI: Les startups bougent vite, les corporates bougent lentement",
      "SOLUTION 1: Nommer un 'champion interne' dédié à chaque startup dans le corporate",
      "SOLUTION 2: Définir des milestones clairs avec des délais courts (sprints de 2 semaines)",
      "SOLUTION 3: Sécuriser un budget PoC pré-approuvé (10-50K$) pour éviter les cycles d'approbation"
    ],
    keyPoints: [
      "Le partenariat échoue quand il n'y a pas de 'skin in the game' côté corporate",
      "Les startups ne peuvent pas attendre 6 mois pour un bon de commande",
      "Créer un 'fast track procurement' spécifique aux startups"
    ],
    tunisianContext: [
      "Les délais d'approbation dans les entreprises publiques tunisiennes sont un frein majeur",
      "Le code des marchés publics doit être adapté pour les achats d'innovation",
      "Les sandbox réglementaires (BCT pour FinTech) sont des modèles à reproduire"
    ],
    type: 'content'
  },
  {
    id: 37, module: "Module 6: Pendant le Programme",
    title: "Le Demo Day",
    subtitle: "L'Événement Culminant du Programme",
    content: [
      "OBJECTIF: Présenter les startups à un public d'investisseurs, corporates et médias",
      "FORMAT: Pitch de 5-7 min par startup + Q&A de 3-5 min",
      "AUDIENCE: Investisseurs ciblés, business units internes, partenaires potentiels, médias",
      "PRÉPARATION: Minimum 10 sessions de pitch practice avec feedback expert"
    ],
    keyPoints: [
      "Le Demo Day n'est PAS la fin du programme — c'est le début de la phase suivante",
      "Inviter des investisseurs AVANT le Demo Day pour créer de l'anticipation",
      "Le follow-up post-Demo Day est plus important que l'événement lui-même"
    ],
    tunisianContext: [
      "Les Demo Days de Flat6Labs Tunis sont devenus des événements phares",
      "Impliquer les VCs de la région MENA: 500 Global, Sawari Ventures, Algebra Ventures",
      "Streamer l'événement pour la diaspora et les investisseurs internationaux"
    ],
    type: 'content'
  },

  // ═══════════════════════════════════════════
  // MODULE 7: Après le Programme (38-47)
  // ═══════════════════════════════════════════
  {
    id: 38, module: "Module 7: Après le Programme",
    title: "Post-Programme: La Phase Critique",
    subtitle: "Gestion du Portfolio et Suivi",
    content: [
      "70% de la valeur d'un programme se crée APRÈS le programme, pas pendant",
      "Le suivi post-programme est souvent le maillon faible des accélérateurs",
      "Les startups ont besoin de soutien continu: fundraising, clients, scaling"
    ],
    keyPoints: [
      "Créer un réseau alumni actif avec des événements réguliers",
      "Tracker les métriques clés pendant 3-5 ans après graduation",
      "Les alumni à succès deviennent les meilleurs ambassadeurs du programme"
    ],
    type: 'content'
  },
  {
    id: 39, module: "Module 7: Après le Programme",
    title: "Gestion du Portfolio",
    subtitle: "Suivre et Soutenir les Startups Diplômées",
    content: [
      "REPORTING: Dashboard mensuel — revenus, traction, levées de fonds, pivot",
      "SUPPORT CONTINU: Office hours mensuelles avec mentors et experts",
      "INTRODUCTIONS: Connexions ciblées — investisseurs follow-on, clients stratégiques",
      "ALUMNI EVENTS: Rencontres trimestrielles, mixage avec nouvelles cohortes"
    ],
    keyPoints: [
      "Automatiser le reporting avec des outils simples (Airtable, Notion)",
      "Les meilleures introductions sont chirurgicales, pas massives",
      "Célébrer les succès publiquement — fuel pour les futures cohortes"
    ],
    type: 'content'
  },
  {
    id: 40, module: "Module 7: Après le Programme",
    title: "Planifier le Succès Long Terme",
    subtitle: "Pérenniser le Programme",
    content: [
      "ITÉRER: Collecter le feedback systématiquement après chaque cohorte",
      "PROUVER LA VALEUR: Documenter le ROI en termes que le board comprend",
      "SCALER: Élargir le scope géographique, sectoriel ou fonctionnel",
      "SYSTÉMISER: Créer un 'system of programs' — hackathon → accélérateur → CVC → M&A"
    ],
    keyPoints: [
      "Un programme est un 'produit' — itérer comme un Product Manager",
      "La survie du programme dépend de la preuve de valeur business",
      "Prévoir des changements de leadership — le programme doit survivre aux individus"
    ],
    type: 'content'
  },
  {
    id: 41, module: "Module 7: Après le Programme",
    title: "Système de Programmes",
    subtitle: "Au-delà du Programme Unique",
    content: [
      "HACKATHON: Sourcing d'idées et de talents (1-3 jours) → FILTRE vers le programme",
      "PRÉ-ACCÉLÉRATEUR: Validation d'idée (4-8 semaines) → FILTRE vers l'accélérateur",
      "ACCÉLÉRATEUR: Scaling du produit et du business (12-16 semaines)",
      "POST-ACCÉLÉRATEUR / SCALE-UP: Expansion, levée Série A+, internationalization",
      "CVC / M&A: Investissement stratégique ou acquisition des champions"
    ],
    keyPoints: [
      "Chaque programme alimente le suivant — c'est un funnel d'innovation",
      "Tous les programmes ne sont pas nécessaires — commencez par ce qui manque",
      "Les meilleurs écosystèmes ont un pipeline continu, pas des événements ponctuels"
    ],
    tunisianContext: [
      "Modèle possible pour la Tunisie: Startup Weekend → Flat6Labs → Smart Capital → Exit",
      "Le Startup Act peut servir de liant entre les étapes du funnel",
      "Les technopoles régionales comme points d'entrée du funnel"
    ],
    type: 'framework'
  },

  // ═══════════════════════════════════════════
  // MODULE 8: Application Tunisienne (42-50)
  // ═══════════════════════════════════════════
  {
    id: 42, module: "Module 8: Application Tunisienne",
    title: "Designer un Programme pour la Tunisie",
    subtitle: "Framework d'Application Locale",
    content: [
      "ATOUTS TUNISIENS: Talent tech abondant, coûts compétitifs, position géographique MENA-Afrique",
      "CADRE LÉGAL: Startup Act, avantages fiscaux, cadre des convertibles",
      "DÉFIS: Accès au financement, bureaucratie, fuite des cerveaux, marché local petit",
      "OPPORTUNITÉS: Marché africain francophone, diaspora qualifiée, secteurs émergents"
    ],
    keyPoints: [
      "La Tunisie a tous les ingrédients — il manque le design intentionnel",
      "Se positionner comme hub d'innovation pour l'Afrique francophone",
      "Combiner expertise locale et réseaux internationaux"
    ],
    type: 'content'
  },
  {
    id: 43, module: "Module 8: Application Tunisienne",
    title: "Modèle: Accélérateur Sectoriel Tunisien",
    subtitle: "Exemple: Programme FinTech / AgriTech",
    content: [
      "SPONSOR: Banque ou opérateur télécom tunisien + bailleur international (GIZ/UE)",
      "OBJECTIF: Solution sourcing — résoudre 3-5 challenges business identifiés",
      "CIBLE: 10 startups seed en FinTech/AgriTech, 60% tunisiennes, 40% africaines",
      "DURÉE: 16 semaines: 4 sem discovery + 8 sem build + 4 sem pilote",
      "INVESTISSEMENT: Grant de 15K TND + accès client + mentoring"
    ],
    tunisianContext: [
      "Partenaires potentiels: BIAT, Amen Bank, Ooredoo, Orange Tunisie",
      "Pilotes avec des entreprises membres de CONECT ou UTICA",
      "Demo Day avec investisseurs MENA: 212 Founders, UM6P Ventures, Sawari"
    ],
    type: 'case-study'
  },
  {
    id: 44, module: "Module 8: Application Tunisienne",
    title: "Modèle: Programme d'Impact Social",
    subtitle: "Exemple: Entrepreneuriat Régional",
    content: [
      "SPONSOR: Ministère + bailleur (USAID/AFD) + institution locale (APIA/APII)",
      "OBJECTIF: Ecosystem building + impact — développer l'entrepreneuriat dans les régions",
      "CIBLE: 20 projets pre-seed dans les gouvernorats de l'intérieur",
      "DURÉE: 24 semaines: 8 sem idéation + 12 sem MVP + 4 sem pitch",
      "INVESTISSEMENT: Grant de 10K TND + espace coworking + mentorat"
    ],
    tunisianContext: [
      "Cible: gouvernorats de Gafsa, Kasserine, Sidi Bouzid, Jendouba",
      "Partenariat avec les universités régionales et les centres de formation",
      "Give-back: workshops dans les lycées et collèges locaux",
      "KPIs: emplois créés, taux de survie à 2 ans, revenus générés localement"
    ],
    type: 'case-study'
  },
  {
    id: 45, module: "Module 8: Application Tunisienne",
    title: "Modèle: Corporate Innovation Hub",
    subtitle: "Exemple: Grande Entreprise Tunisienne",
    content: [
      "SPONSOR: Groupe Poulina, Telnet, ou STEG/Tunisie Telecom",
      "OBJECTIF: Croissance — innover le business model via des partenariats startup",
      "FORMAT: Innovation Hub permanent avec cycles de 3 programmes/an",
      "Cycle 1: Hackathon (3 jours) → Cycle 2: Pré-accélérateur (6 sem) → Cycle 3: Pilote (12 sem)"
    ],
    tunisianContext: [
      "Budget estimé: 300-500K TND/an (comparable à un recrutement de 3-4 ingénieurs)",
      "ROI attendu: 3-5 innovations testées/an, 1-2 intégrations réelles",
      "Positionnement employeur: attirer et retenir les meilleurs talents tech tunisiens"
    ],
    type: 'case-study'
  },
  {
    id: 46, module: "Module 8: Application Tunisienne",
    title: "Les Erreurs à Éviter en Tunisie",
    subtitle: "Pièges Fréquents de l'Écosystème Local",
    content: [
      "❌ Copier Silicon Valley: Le contexte tunisien est différent — adaptez le modèle",
      "❌ Ignorer les régions: L'innovation n'est pas un monopole de Tunis",
      "❌ Sous-financer: Un programme mal financé nuit plus qu'il n'aide",
      "❌ Négliger le suivi post-programme: Le programme ne finit pas au Demo Day",
      "❌ Ignorer le marché: Les startups tunisiennes doivent viser l'export dès le jour 1"
    ],
    keyPoints: [
      "✅ Commencer petit, itérer, prouver la valeur",
      "✅ Impliquer le secteur privé comme co-investisseur, pas juste spectateur",
      "✅ Mesurer l'impact réel, pas juste l'activité",
      "✅ Construire des ponts avec l'Afrique et le monde arabe"
    ],
    type: 'content'
  },
  {
    id: 47, module: "Module 8: Application Tunisienne",
    title: "Roadmap: Construire l'Écosystème Idéal",
    subtitle: "Vision à 5 Ans pour la Tunisie",
    content: [
      "ANNÉE 1: Lancer 2-3 programmes pilotes sectoriels (FinTech, AgriTech, GreenTech)",
      "ANNÉE 2: Créer un réseau national de pré-accélérateurs dans 5 gouvernorats",
      "ANNÉE 3: Attirer 3-5 programmes internationaux (Techstars, Plug and Play, 500 Global)",
      "ANNÉE 4: Lancer un fonds de co-investissement public-privé (Scale-up Fund)",
      "ANNÉE 5: Positionner la Tunisie comme hub #1 d'innovation en Afrique francophone"
    ],
    keyPoints: [
      "Chaque année construit sur la précédente — pas de raccourcis",
      "L'alignement gouvernement-secteur privé-bailleurs est la condition sine qua non",
      "Le talent tunisien est l'avantage compétitif — investir dans sa rétention"
    ],
    type: 'summary'
  },
  {
    id: 48, module: "Module 8: Application Tunisienne",
    title: "Checklist de Lancement",
    subtitle: "10 Étapes pour Lancer Votre Programme",
    content: [
      "1. Définir votre WHY — pourquoi ce programme ? Quel problème résolvez-vous ?",
      "2. Mapper vos parties prenantes — qui soutient ? qui bloque ?",
      "3. Évaluer vos atouts uniques — qu'offrez-vous que personne d'autre n'offre ?",
      "4. Choisir votre archétype — venture, ecosystem, matchmaking ou impact ?",
      "5. Designer votre value proposition — pourquoi une startup vous choisirait ?",
      "6. Définir vos métriques — comment saurez-vous si ça marche ?",
      "7. Sécuriser budget et sponsor exécutif — pas de programme sans ressources",
      "8. Recruter l'équipe programme — program manager dédié minimum",
      "9. Lancer un programme pilote minimal — tester avant de scaler",
      "10. Itérer systématiquement — collecter feedback, mesurer, améliorer"
    ],
    type: 'summary'
  },
  {
    id: 49, module: "Module 8: Application Tunisienne",
    title: "Ressources et Références",
    subtitle: "Pour Aller Plus Loin",
    content: [
      "📚 'Startup Program Design' — Lombardi & Berk (McGraw Hill, 2022)",
      "📚 'Designing the Successful Corporate Accelerator' — Miller & Kagan (Wiley, 2021)",
      "📚 'The Startup Owner's Manual' — Blank & Dorf (Wiley, 2012)",
      "🌐 startupprogramdesign.com — Companion website avec templates et cas",
      "🇹🇳 startup.gov.tn — Portail Startup Act Tunisie"
    ],
    keyPoints: [
      "Le design de programme est une compétence qui s'apprend",
      "L'écosystème tunisien a un potentiel immense — il faut l'activer intentionnellement",
      "Chaque programme réussi inspire 10 autres — l'effet boule de neige"
    ],
    type: 'summary'
  },
  {
    id: 50, module: "Module 8: Application Tunisienne",
    title: "Conclusion",
    subtitle: "Le Futur des Startup Programs en Tunisie",
    content: [
      "L'innovation par les startups n'est plus une option — c'est une nécessité stratégique",
      "Les programmes startup sont les liaisons qui simplifient les relations entre systèmes complexes",
      "La Tunisie dispose de tous les ingrédients: talent, cadre légal, position géographique",
      "Il manque un seul élément: le design intentionnel — et c'est ce que VOUS apportez"
    ],
    keyPoints: [
      "Si vous voulez aller vite, allez seul. Si vous voulez aller loin, allez ensemble.",
      "Les startups sont les véhicules de l'innovation — les programmes sont les routes",
      "Commencez aujourd'hui. Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment, c'est maintenant."
    ],
    type: 'intro'
  }
];
