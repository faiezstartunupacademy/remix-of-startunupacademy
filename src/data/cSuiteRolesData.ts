// Data structure for C-Suite roles based on Startup CxO, Startup CEO, and Startup Boards books
export interface CSuiteRole {
  id: string;
  symbol: string;
  name: string;
  fullName: string;
  category: 'leadership' | 'operations' | 'growth' | 'product' | 'finance' | 'people';
  description: string;
  responsibilities: string[];
  keySkills: string[];
  kpis: string[];
  whenToHire: string;
  signsOfSuccess: string[];
  scalingChallenges: string[];
  fractionalOption: boolean;
  reportingTo: string;
  collaboratesWith: string[];
  source: string;
}

export interface CSuiteCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const cSuiteCategories: CSuiteCategory[] = [
  {
    id: 'leadership',
    name: 'Leadership',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    description: 'Direction stratégique et gouvernance'
  },
  {
    id: 'operations',
    name: 'Opérations',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500',
    textColor: 'text-slate-500',
    description: 'Excellence opérationnelle quotidienne'
  },
  {
    id: 'growth',
    name: 'Croissance',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    description: 'Acquisition, ventes et expansion'
  },
  {
    id: 'product',
    name: 'Produit & Tech',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-500',
    description: 'Innovation et développement produit'
  },
  {
    id: 'finance',
    name: 'Finance',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    description: 'Gestion financière et levées de fonds'
  },
  {
    id: 'people',
    name: 'People',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-500',
    description: 'Culture, talent et organisation'
  }
];

export const cSuiteRoles: CSuiteRole[] = [
  // LEADERSHIP
  {
    id: 'ceo',
    symbol: 'CEO',
    name: 'Chief Executive Officer',
    fullName: 'Directeur Général',
    category: 'leadership',
    description: 'Le CEO est le leader ultime de la startup. Il définit la vision, construit la culture, et guide l\'entreprise à travers les phases de croissance.',
    responsibilities: [
      'Définir et communiquer la vision stratégique',
      'Construire et maintenir la culture d\'entreprise',
      'Recruter et développer l\'équipe de direction',
      'Lever des fonds et gérer les relations investisseurs',
      'Représenter l\'entreprise auprès des parties prenantes',
      'Prendre les décisions critiques pour l\'entreprise'
    ],
    keySkills: [
      'Leadership authentique',
      'Storytelling',
      'Prise de décision sous pression',
      'Gestion du Board',
      'Résilience émotionnelle'
    ],
    kpis: [
      'ARR / MRR Growth',
      'Runway',
      'Employee NPS',
      'Investor Confidence Score',
      'Key Milestone Achievement'
    ],
    whenToHire: 'Dès la création - le fondateur est souvent le premier CEO',
    signsOfSuccess: [
      'Équipe alignée sur la vision',
      'Culture forte et positive',
      'Confiance des investisseurs',
      'Croissance durable'
    ],
    scalingChallenges: [
      'Délégation efficace',
      'Maintenir la culture à grande échelle',
      'Éviter le micromanagement',
      'Équilibre vie pro/perso'
    ],
    fractionalOption: false,
    reportingTo: 'Board of Directors',
    collaboratesWith: ['CFO', 'COO', 'CTO', 'CPO', 'CMO', 'CHRO'],
    source: 'Startup CEO - Matt Blumberg (2020)'
  },
  {
    id: 'coo',
    symbol: 'COO',
    name: 'Chief Operating Officer',
    fullName: 'Directeur des Opérations',
    category: 'operations',
    description: 'Le COO traduit la vision du CEO en exécution opérationnelle. Il gère les opérations quotidiennes et optimise les processus.',
    responsibilities: [
      'Superviser les opérations quotidiennes',
      'Optimiser les processus internes',
      'Coordonner les équipes transversales',
      'Implémenter la stratégie définie par le CEO',
      'Gérer les projets complexes',
      'Assurer la scalabilité opérationnelle'
    ],
    keySkills: [
      'Excellence opérationnelle',
      'Gestion de projet',
      'Optimisation des processus',
      'Leadership transversal',
      'Résolution de problèmes complexes'
    ],
    kpis: [
      'Operational Efficiency Ratio',
      'Process Cycle Time',
      'Cross-team Collaboration Score',
      'Cost Reduction %',
      'Project Delivery Rate'
    ],
    whenToHire: 'Série A/B - Quand la complexité opérationnelle augmente',
    signsOfSuccess: [
      'Opérations fluides sans intervention du CEO',
      'Processus documentés et optimisés',
      'Équipes bien coordonnées',
      'Scalabilité démontrée'
    ],
    scalingChallenges: [
      'Éviter de devenir un goulet d\'étranglement',
      'Maintenir l\'agilité startup',
      'Équilibrer contrôle et autonomie'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CEO', 'CFO', 'CTO', 'VP Operations'],
    source: 'Startup CxO - Matt Blumberg'
  },
  
  // FINANCE
  {
    id: 'cfo',
    symbol: 'CFO',
    name: 'Chief Financial Officer',
    fullName: 'Directeur Financier',
    category: 'finance',
    description: 'Le CFO gère la stratégie financière, les levées de fonds, et assure la santé financière de l\'entreprise.',
    responsibilities: [
      'Gérer la trésorerie et le runway',
      'Préparer et piloter les levées de fonds',
      'Établir les prévisions financières',
      'Gérer la comptabilité et la conformité',
      'Optimiser la structure de capital',
      'Piloter les unit economics'
    ],
    keySkills: [
      'Modélisation financière',
      'Fundraising',
      'Due diligence',
      'Gestion de trésorerie',
      'Communication investisseurs'
    ],
    kpis: [
      'Runway (months)',
      'Burn Rate',
      'CAC / LTV Ratio',
      'Gross Margin',
      'Cash Conversion Cycle'
    ],
    whenToHire: 'Seed/Série A - Avant une levée de fonds importante',
    signsOfSuccess: [
      'Fundraising réussi à bonne valorisation',
      'Runway confortable',
      'Unit economics sains',
      'Reporting financier clair'
    ],
    scalingChallenges: [
      'Passer de "comptable" à "stratège"',
      'Gérer la complexité internationale',
      'Maintenir l\'agilité avec les contrôles'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CEO', 'COO', 'Board', 'Legal'],
    source: 'Startup CxO - Matt Blumberg'
  },

  // GROWTH
  {
    id: 'cmo',
    symbol: 'CMO',
    name: 'Chief Marketing Officer',
    fullName: 'Directeur Marketing',
    category: 'growth',
    description: 'Le CMO construit la marque, génère la demande, et positionne l\'entreprise sur son marché.',
    responsibilities: [
      'Construire et maintenir la marque',
      'Générer des leads qualifiés pour les ventes',
      'Définir le positionnement produit',
      'Orchestrer les campagnes marketing',
      'Gérer les relations publiques',
      'Mesurer et optimiser le ROI marketing'
    ],
    keySkills: [
      'Brand building',
      'Demand generation',
      'Product marketing',
      'Data-driven marketing',
      'Content strategy'
    ],
    kpis: [
      'Marketing Qualified Leads (MQL)',
      'Customer Acquisition Cost (CAC)',
      'Marketing ROI',
      'Brand Awareness',
      'Pipeline Contribution'
    ],
    whenToHire: 'Seed/Série A - Quand le product-market fit est atteint',
    signsOfSuccess: [
      'Pipeline de leads constant',
      'Marque reconnue dans l\'industrie',
      'CAC optimisé',
      'Alignement Sales-Marketing'
    ],
    scalingChallenges: [
      'Passer du tactique au stratégique',
      'Maintenir la cohérence de marque',
      'Mesurer l\'impact brand vs performance'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CRO', 'CPO', 'CEO', 'Sales'],
    source: 'Startup CxO - Matt Blumberg'
  },
  {
    id: 'cro',
    symbol: 'CRO',
    name: 'Chief Revenue Officer',
    fullName: 'Directeur des Revenus',
    category: 'growth',
    description: 'Le CRO pilote toute la chaîne de revenus, des premiers prospects à la rétention client.',
    responsibilities: [
      'Atteindre les objectifs de revenus',
      'Construire et scaler l\'équipe commerciale',
      'Optimiser le pipeline de ventes',
      'Aligner Sales, Marketing et Customer Success',
      'Définir la stratégie de pricing',
      'Développer de nouveaux canaux de distribution'
    ],
    keySkills: [
      'Sales leadership',
      'Pipeline management',
      'Négociation',
      'Data analysis',
      'Team building'
    ],
    kpis: [
      'Annual Recurring Revenue (ARR)',
      'Net Revenue Retention (NRR)',
      'Sales Velocity',
      'Win Rate',
      'Average Deal Size'
    ],
    whenToHire: 'Série A/B - Quand l\'équipe commerciale dépasse 5-10 personnes',
    signsOfSuccess: [
      'Croissance de revenus prévisible',
      'Équipe commerciale performante',
      'NRR > 100%',
      'Pipeline sain (3x coverage)'
    ],
    scalingChallenges: [
      'Maintenir la vélocité avec la taille',
      'Expansion géographique',
      'Passage à l\'enterprise'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CMO', 'CCO', 'CPO', 'CFO'],
    source: 'Startup CxO - Matt Blumberg'
  },
  {
    id: 'cbdo',
    symbol: 'CBDO',
    name: 'Chief Business Development Officer',
    fullName: 'Directeur du Développement',
    category: 'growth',
    description: 'Le CBDO développe les partenariats stratégiques et les nouvelles opportunités de marché.',
    responsibilities: [
      'Identifier et négocier les partenariats stratégiques',
      'Explorer de nouveaux marchés',
      'Gérer les relations partenaires clés',
      'Piloter les opportunités M&A',
      'Représenter l\'entreprise dans l\'écosystème',
      'Développer les canaux indirects'
    ],
    keySkills: [
      'Négociation stratégique',
      'Relationship building',
      'Market analysis',
      'Deal structuring',
      'Cross-functional leadership'
    ],
    kpis: [
      'Partner Revenue Contribution',
      'Strategic Deals Closed',
      'Partnership Pipeline Value',
      'Time to Partnership Value',
      'Partner Satisfaction Score'
    ],
    whenToHire: 'Série B+ - Quand les partenariats deviennent stratégiques',
    signsOfSuccess: [
      'Partenariats générant des revenus',
      'Écosystème de partenaires actif',
      'Opportunités M&A identifiées',
      'Expansion de marché via partenaires'
    ],
    scalingChallenges: [
      'Prioriser les opportunités',
      'Éviter les partenariats "vanity"',
      'Mesurer le ROI des partenariats'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CEO', 'CRO', 'CPO', 'Legal'],
    source: 'Startup CxO - Matt Blumberg'
  },

  // PRODUCT & TECH
  {
    id: 'cto',
    symbol: 'CTO',
    name: 'Chief Technology Officer',
    fullName: 'Directeur Technique',
    category: 'product',
    description: 'Le CTO définit la vision technologique et assure l\'excellence technique de la plateforme.',
    responsibilities: [
      'Définir l\'architecture technique',
      'Gérer la dette technique',
      'Recruter et développer les ingénieurs',
      'Assurer la sécurité et la scalabilité',
      'Évaluer les nouvelles technologies',
      'Collaborer avec le CPO sur la roadmap'
    ],
    keySkills: [
      'Architecture système',
      'Engineering leadership',
      'Technical strategy',
      'Security & compliance',
      'Team building technique'
    ],
    kpis: [
      'System Uptime',
      'Deployment Frequency',
      'Lead Time for Changes',
      'Mean Time to Recovery',
      'Engineering Velocity'
    ],
    whenToHire: 'Dès le début - Souvent un co-fondateur technique',
    signsOfSuccess: [
      'Plateforme stable et scalable',
      'Équipe technique performante',
      'Innovation continue',
      'Dette technique maîtrisée'
    ],
    scalingChallenges: [
      'Passer de "coder" à "diriger"',
      'Maintenir la vélocité avec la croissance',
      'Recruter les meilleurs talents'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CPO', 'CEO', 'CISO', 'Engineering'],
    source: 'Startup CxO - Matt Blumberg'
  },
  {
    id: 'cpo',
    symbol: 'CPO',
    name: 'Chief Product Officer',
    fullName: 'Directeur Produit',
    category: 'product',
    description: 'Le CPO définit la vision produit et orchestre le développement pour maximiser la valeur client.',
    responsibilities: [
      'Définir la vision et stratégie produit',
      'Prioriser la roadmap produit',
      'Comprendre profondément les utilisateurs',
      'Coordonner produit, design et engineering',
      'Mesurer et optimiser les métriques produit',
      'Évangéliser le produit en interne et externe'
    ],
    keySkills: [
      'Product strategy',
      'User research',
      'Data analysis',
      'Cross-functional leadership',
      'Prioritization frameworks'
    ],
    kpis: [
      'Product-Market Fit Score',
      'Feature Adoption Rate',
      'User Retention',
      'NPS / CSAT',
      'Time to Value'
    ],
    whenToHire: 'Série A - Quand le produit devient complexe',
    signsOfSuccess: [
      'Produit aimé par les utilisateurs',
      'Roadmap alignée sur la stratégie',
      'Métriques produit en croissance',
      'Équipe produit performante'
    ],
    scalingChallenges: [
      'Maintenir le focus avec plus de stakeholders',
      'Équilibrer innovation et dette produit',
      'Gérer plusieurs produits/lignes'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CTO', 'CMO', 'CRO', 'Design'],
    source: 'Startup CxO - Matt Blumberg'
  },
  {
    id: 'ciso',
    symbol: 'CISO',
    name: 'Chief Information Security Officer',
    fullName: 'Directeur Sécurité',
    category: 'product',
    description: 'Le CISO protège les données et systèmes de l\'entreprise contre les menaces de sécurité.',
    responsibilities: [
      'Définir la stratégie de sécurité',
      'Gérer les risques cybersécurité',
      'Assurer la conformité (GDPR, SOC2...)',
      'Former les équipes à la sécurité',
      'Répondre aux incidents de sécurité',
      'Auditer et améliorer les pratiques'
    ],
    keySkills: [
      'Cybersecurity expertise',
      'Risk management',
      'Compliance frameworks',
      'Incident response',
      'Security architecture'
    ],
    kpis: [
      'Security Incidents',
      'Mean Time to Detect/Respond',
      'Compliance Score',
      'Security Training Completion',
      'Vulnerability Remediation Time'
    ],
    whenToHire: 'Série B+ - Quand la conformité devient critique',
    signsOfSuccess: [
      'Zéro breach majeure',
      'Certifications obtenues (SOC2, ISO)',
      'Culture sécurité établie',
      'Conformité maintenue'
    ],
    scalingChallenges: [
      'Équilibrer sécurité et agilité',
      'Gérer la complexité multi-cloud',
      'Rester à jour sur les menaces'
    ],
    fractionalOption: true,
    reportingTo: 'CTO ou CEO',
    collaboratesWith: ['CTO', 'CPO', 'Legal', 'Compliance'],
    source: 'Startup CxO - Matt Blumberg'
  },

  // PEOPLE
  {
    id: 'chro',
    symbol: 'CHRO',
    name: 'Chief Human Resources Officer',
    fullName: 'Directeur des Ressources Humaines',
    category: 'people',
    description: 'Le CHRO construit la culture, attire les talents, et développe le capital humain de l\'entreprise.',
    responsibilities: [
      'Définir et maintenir la culture d\'entreprise',
      'Recruter les meilleurs talents',
      'Développer les programmes de formation',
      'Gérer la compensation et les avantages',
      'Piloter l\'engagement des employés',
      'Accompagner la croissance organisationnelle'
    ],
    keySkills: [
      'Talent acquisition',
      'Culture building',
      'Organizational development',
      'Compensation design',
      'Employee relations'
    ],
    kpis: [
      'Employee NPS (eNPS)',
      'Time to Hire',
      'Retention Rate',
      'Training Completion',
      'Diversity Metrics'
    ],
    whenToHire: 'Série A - Quand l\'équipe dépasse 30-50 personnes',
    signsOfSuccess: [
      'Culture forte et différenciante',
      'Talent pipeline solide',
      'Rétention élevée',
      'Employés engagés'
    ],
    scalingChallenges: [
      'Maintenir la culture en hypercroissance',
      'Gérer la diversité des profils',
      'Équilibrer performance et bien-être'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CEO', 'COO', 'All Departments'],
    source: 'Startup CxO - Matt Blumberg'
  },
  {
    id: 'cco',
    symbol: 'CCO',
    name: 'Chief Customer Officer',
    fullName: 'Directeur Client',
    category: 'people',
    description: 'Le CCO maximise la valeur client en orchestrant l\'expérience client de bout en bout.',
    responsibilities: [
      'Maximiser la rétention client',
      'Piloter le Customer Success',
      'Gérer le support client',
      'Identifier les opportunités d\'upsell',
      'Construire la communauté client',
      'Faire remonter la voix du client'
    ],
    keySkills: [
      'Customer success strategy',
      'Churn prevention',
      'Team leadership',
      'Data analysis',
      'Cross-functional collaboration'
    ],
    kpis: [
      'Net Revenue Retention (NRR)',
      'Gross Revenue Retention (GRR)',
      'Customer Satisfaction (CSAT)',
      'Time to Value',
      'Expansion Revenue'
    ],
    whenToHire: 'Série A/B - Quand la rétention devient prioritaire',
    signsOfSuccess: [
      'NRR > 110%',
      'Churn maîtrisé',
      'Clients ambassadeurs actifs',
      'Expansion revenue significatif'
    ],
    scalingChallenges: [
      'Scaler le high-touch',
      'Automatiser sans déshumaniser',
      'Segmenter efficacement'
    ],
    fractionalOption: true,
    reportingTo: 'CEO ou CRO',
    collaboratesWith: ['CRO', 'CPO', 'CMO', 'Support'],
    source: 'Startup CxO - Matt Blumberg'
  },

  // ADDITIONAL ROLES
  {
    id: 'clo',
    symbol: 'CLO',
    name: 'Chief Legal Officer',
    fullName: 'Directeur Juridique',
    category: 'operations',
    description: 'Le CLO protège l\'entreprise juridiquement et conseille sur les décisions stratégiques.',
    responsibilities: [
      'Gérer les contrats commerciaux',
      'Assurer la conformité réglementaire',
      'Protéger la propriété intellectuelle',
      'Conseiller sur les opérations M&A',
      'Gérer les litiges',
      'Structurer les levées de fonds'
    ],
    keySkills: [
      'Corporate law',
      'Contract negotiation',
      'IP protection',
      'Regulatory compliance',
      'Risk assessment'
    ],
    kpis: [
      'Contract Turnaround Time',
      'Litigation Exposure',
      'Compliance Score',
      'IP Portfolio Value',
      'Deal Closure Rate'
    ],
    whenToHire: 'Série B+ - Quand les enjeux juridiques se complexifient',
    signsOfSuccess: [
      'Zéro litige majeur',
      'Contrats favorables négociés',
      'IP bien protégée',
      'Conformité maintenue'
    ],
    scalingChallenges: [
      'Gérer la complexité internationale',
      'Équilibrer risque et vitesse',
      'Rester accessible aux équipes'
    ],
    fractionalOption: true,
    reportingTo: 'CEO',
    collaboratesWith: ['CEO', 'CFO', 'CBDO', 'HR'],
    source: 'Startup Boards - Brad Feld'
  },
  {
    id: 'cdo',
    symbol: 'CDO',
    name: 'Chief Data Officer',
    fullName: 'Directeur des Données',
    category: 'product',
    description: 'Le CDO maximise la valeur des données pour la prise de décision et l\'innovation produit.',
    responsibilities: [
      'Définir la stratégie data',
      'Construire l\'infrastructure data',
      'Assurer la qualité des données',
      'Développer les capacités analytics',
      'Garantir la gouvernance data',
      'Identifier les opportunités data-driven'
    ],
    keySkills: [
      'Data strategy',
      'Analytics & BI',
      'Data engineering',
      'Machine learning',
      'Data governance'
    ],
    kpis: [
      'Data Quality Score',
      'Analytics Adoption',
      'Data-driven Decisions %',
      'ML Model Accuracy',
      'Data Processing Time'
    ],
    whenToHire: 'Série B+ - Quand les données deviennent un avantage stratégique',
    signsOfSuccess: [
      'Décisions basées sur les données',
      'Infrastructure data robuste',
      'ML/AI en production',
      'Data literacy élevée'
    ],
    scalingChallenges: [
      'Gérer le volume de données',
      'Maintenir la qualité à l\'échelle',
      'Équilibrer innovation et gouvernance'
    ],
    fractionalOption: true,
    reportingTo: 'CTO ou CEO',
    collaboratesWith: ['CTO', 'CPO', 'CMO', 'Analytics'],
    source: 'Startup CxO - Matt Blumberg'
  }
];

// CEO Mindset insights from "Understanding Startup CEOs" by Dan Slagen
export interface CEOMindsetInsight {
  id: string;
  title: string;
  description: string;
  actionable: string;
  category: 'mindset' | 'execution' | 'leadership' | 'wellbeing';
}

export const ceoMindsetInsights: CEOMindsetInsight[] = [
  {
    id: 'betting-life',
    title: 'Ils parient leur vie',
    description: 'Les CEOs de startups investissent tout : temps, argent, réputation. C\'est un engagement total.',
    actionable: 'Comprenez cette intensité et alignez-vous sur la mission.',
    category: 'mindset'
  },
  {
    id: 'rejecting-no',
    title: 'Rejeter le "non" comme réponse',
    description: 'La persistance face au refus est une caractéristique fondamentale des CEOs réussis.',
    actionable: 'Développez votre résilience et cherchez des alternatives créatives.',
    category: 'mindset'
  },
  {
    id: 'early-loyalty',
    title: 'Loyauté des premiers recrutés',
    description: 'Les premiers employés forment le noyau culturel de l\'entreprise.',
    actionable: 'Construisez des relations de confiance durables avec les early joiners.',
    category: 'leadership'
  },
  {
    id: 'remember-everything',
    title: 'Ils se souviennent de tout',
    description: 'Les CEOs retiennent les détails importants - promesses, engagements, échecs.',
    actionable: 'Soyez fiable et tenez vos engagements, même les petits.',
    category: 'execution'
  },
  {
    id: 'hear-everything',
    title: 'Ils entendent tout',
    description: 'Les rumeurs, les tensions, les succès - tout remonte au CEO.',
    actionable: 'Communiquez ouvertement et assumez que vos paroles seront connues.',
    category: 'leadership'
  },
  {
    id: 'gsd',
    title: 'GSD - Get Stuff Done',
    description: 'L\'exécution prime sur la perfection. La vélocité est un avantage compétitif.',
    actionable: 'Priorisez l\'action et l\'apprentissage par l\'expérimentation.',
    category: 'execution'
  },
  {
    id: 'stay-shape',
    title: 'Rester en forme',
    description: 'L\'endurance physique soutient l\'endurance mentale requise.',
    actionable: 'Maintenez votre santé physique comme un investissement professionnel.',
    category: 'wellbeing'
  },
  {
    id: 'believe-mission',
    title: 'Croire en la mission',
    description: 'La conviction authentique est contagieuse et motive les équipes.',
    actionable: 'Connectez votre travail quotidien à l\'impact de la mission.',
    category: 'mindset'
  }
];

// Board composition guidance from "Startup Boards" by Brad Feld
export interface BoardRole {
  type: 'founder' | 'investor' | 'independent';
  title: string;
  description: string;
  value: string;
  whenToAdd: string;
}

export const boardRoles: BoardRole[] = [
  {
    type: 'founder',
    title: 'Fondateur(s) au Board',
    description: 'Les fondateurs représentent la vision originale et l\'ADN de l\'entreprise.',
    value: 'Vision long-terme, connaissance profonde du produit et du marché.',
    whenToAdd: 'Dès la création'
  },
  {
    type: 'investor',
    title: 'Investisseurs au Board',
    description: 'Les VCs apportent capital, réseau et expérience de scaling.',
    value: 'Accès au financement, pattern matching, introductions stratégiques.',
    whenToAdd: 'Après chaque levée significative (Seed, Série A...)'
  },
  {
    type: 'independent',
    title: 'Administrateurs Indépendants',
    description: 'Experts externes sans intérêt financier direct dans l\'entreprise.',
    value: 'Objectivité, expertise sectorielle, gouvernance mature.',
    whenToAdd: 'Série A/B - Pour équilibrer le board'
  }
];
