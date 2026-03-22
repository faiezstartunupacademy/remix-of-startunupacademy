export interface TractionChannel {
  id: string;
  number: number;
  symbol: string;
  name: string;
  nameEn: string;
  category: "paid" | "organic" | "viral" | "outbound" | "unconventional";
  description: string;
  examples: string[];
  metrics: string[];
  startupStage: "early" | "growth" | "all";
  costLevel: "low" | "medium" | "high";
  timeToResults: "fast" | "medium" | "slow";
  tactics: string[];
  caseStudy?: {
    company: string;
    result: string;
  };
}

export interface TractionCategory {
  id: string;
  name: string;
  color: string;
  textColor: string;
  bgLight: string;
  icon: string;
  description: string;
}

export const tractionCategories: TractionCategory[] = [
  {
    id: "paid",
    name: "Publicité Payante",
    color: "bg-red-500",
    textColor: "text-red-600",
    bgLight: "bg-red-500/10",
    icon: "💰",
    description: "Canaux nécessitant un investissement publicitaire direct"
  },
  {
    id: "organic",
    name: "Croissance Organique",
    color: "bg-green-500",
    textColor: "text-green-600",
    bgLight: "bg-green-500/10",
    icon: "🌱",
    description: "Canaux basés sur le contenu et le référencement naturel"
  },
  {
    id: "viral",
    name: "Marketing Viral",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgLight: "bg-purple-500/10",
    icon: "🚀",
    description: "Canaux exploitant l'effet de réseau et le bouche-à-oreille"
  },
  {
    id: "outbound",
    name: "Outbound",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgLight: "bg-blue-500/10",
    icon: "📞",
    description: "Canaux de prospection directe et relations publiques"
  },
  {
    id: "unconventional",
    name: "Non-Conventionnel",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgLight: "bg-orange-500/10",
    icon: "🎯",
    description: "Canaux créatifs et stratégies de guérilla marketing"
  }
];

export const tractionChannels: TractionChannel[] = [
  // PAID CHANNELS
  {
    id: "sem",
    number: 1,
    symbol: "SEM",
    name: "Search Engine Marketing",
    nameEn: "Search Engine Marketing",
    category: "paid",
    description: "Publicité payante sur les moteurs de recherche (Google Ads, Bing Ads). Permet de cibler des utilisateurs avec une intention d'achat élevée via des mots-clés spécifiques.",
    examples: [
      "Google Ads pour capturer la demande existante",
      "Bing Ads pour un CPC plus faible",
      "Retargeting sur le réseau display"
    ],
    metrics: ["CPC", "CTR", "Conversion Rate", "ROAS", "Quality Score"],
    startupStage: "all",
    costLevel: "high",
    timeToResults: "fast",
    tactics: [
      "Commencer par des mots-clés de longue traîne",
      "Tester plusieurs variantes d'annonces",
      "Optimiser les landing pages pour la conversion",
      "Utiliser les extensions d'annonces"
    ],
    caseStudy: {
      company: "Zapier",
      result: "A utilisé SEM pour cibler '[app 1] + [app 2] integration' et dominer les recherches d'intégration"
    }
  },
  {
    id: "social-ads",
    number: 2,
    symbol: "SOC",
    name: "Publicité Réseaux Sociaux",
    nameEn: "Social & Display Ads",
    category: "paid",
    description: "Publicité sur Facebook, Instagram, LinkedIn, Twitter et plateformes display. Excellent pour le targeting démographique et comportemental.",
    examples: [
      "Facebook/Instagram Ads pour B2C",
      "LinkedIn Ads pour B2B",
      "Twitter Ads pour l'engagement",
      "Programmatic display"
    ],
    metrics: ["CPM", "CPC", "CPL", "ROAS", "Frequency"],
    startupStage: "all",
    costLevel: "medium",
    timeToResults: "fast",
    tactics: [
      "Créer des audiences lookalike à partir des meilleurs clients",
      "Tester différents formats créatifs (vidéo, carousel)",
      "Retargeter les visiteurs du site",
      "Optimiser pour les micro-conversions"
    ],
    caseStudy: {
      company: "Dollar Shave Club",
      result: "Vidéo virale sponsorisée ayant généré 12,000 commandes en 48h"
    }
  },
  {
    id: "offline-ads",
    number: 3,
    symbol: "OFF",
    name: "Publicité Offline",
    nameEn: "Offline Ads",
    category: "paid",
    description: "Publicité traditionnelle : TV, radio, affichage, presse. Peut être très efficace pour la notoriété de marque et certaines cibles démographiques.",
    examples: [
      "Spots TV locaux ou nationaux",
      "Publicité radio",
      "Affichage urbain",
      "Presse spécialisée"
    ],
    metrics: ["GRP", "Reach", "Brand Lift", "Recall", "CPM"],
    startupStage: "growth",
    costLevel: "high",
    timeToResults: "medium",
    tactics: [
      "Tester sur des marchés locaux avant de scaler",
      "Mesurer l'impact via des codes promo uniques",
      "Combiner avec le digital pour l'attribution",
      "Cibler des moments clés (podcasts de niche)"
    ],
    caseStudy: {
      company: "Casper",
      result: "Publicités dans le métro de NYC ayant créé un buzz urbain massif"
    }
  },
  // ORGANIC CHANNELS
  {
    id: "seo",
    number: 4,
    symbol: "SEO",
    name: "Référencement Naturel",
    nameEn: "Search Engine Optimization",
    category: "organic",
    description: "Optimisation pour apparaître dans les résultats organiques des moteurs de recherche. Stratégie long-terme mais avec un ROI très élevé.",
    examples: [
      "SEO on-page (contenu, meta, structure)",
      "SEO technique (vitesse, mobile)",
      "Link building éditorial",
      "SEO local"
    ],
    metrics: ["Rankings", "Organic Traffic", "Domain Authority", "CTR SERP", "Backlinks"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "slow",
    tactics: [
      "Créer du contenu 10x meilleur que la concurrence",
      "Cibler des mots-clés de longue traîne",
      "Construire des liens via du contenu linkable",
      "Optimiser pour les featured snippets"
    ],
    caseStudy: {
      company: "HubSpot",
      result: "A construit un empire SEO avec le blog marketing, générant 6M+ de visites/mois"
    }
  },
  {
    id: "content-marketing",
    number: 5,
    symbol: "CON",
    name: "Marketing de Contenu",
    nameEn: "Content Marketing",
    category: "organic",
    description: "Création de contenu de valeur pour attirer et engager une audience. Blog, guides, webinars, podcasts, vidéos éducatives.",
    examples: [
      "Articles de blog optimisés SEO",
      "Guides et ebooks téléchargeables",
      "Podcasts et webinars",
      "Études de cas clients"
    ],
    metrics: ["Traffic", "Time on Page", "Downloads", "Subscribers", "MQLs"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "slow",
    tactics: [
      "Définir des piliers de contenu alignés sur l'expertise",
      "Créer un calendrier éditorial consistant",
      "Repurposer le contenu sur plusieurs formats",
      "Gater le contenu premium pour générer des leads"
    ],
    caseStudy: {
      company: "Buffer",
      result: "Blog transparence a attiré 1.5M lecteurs/mois et défini leur marque"
    }
  },
  {
    id: "email-marketing",
    number: 6,
    symbol: "EML",
    name: "Email Marketing",
    nameEn: "Email Marketing",
    category: "organic",
    description: "Nurturing et conversion via des campagnes email. Canal avec le meilleur ROI quand bien exécuté, essentiel pour la rétention.",
    examples: [
      "Newsletters éducatives",
      "Séquences d'onboarding",
      "Campagnes de nurturing",
      "Emails transactionnels optimisés"
    ],
    metrics: ["Open Rate", "Click Rate", "Conversion Rate", "Unsubscribe Rate", "Revenue/Email"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "medium",
    tactics: [
      "Segmenter la liste par comportement et intérêt",
      "Personnaliser au maximum (prénom, données)",
      "A/B tester sujets et contenus",
      "Automatiser les séquences clés"
    ],
    caseStudy: {
      company: "Airbnb",
      result: "Emails de recommandation personnalisés générant 25% des réservations"
    }
  },
  // VIRAL CHANNELS
  {
    id: "viral-marketing",
    number: 7,
    symbol: "VIR",
    name: "Marketing Viral",
    nameEn: "Viral Marketing",
    category: "viral",
    description: "Création de contenu ou mécaniques incitant au partage organique. L'effet multiplicateur peut créer une croissance exponentielle.",
    examples: [
      "Vidéos virales partageables",
      "Outils gratuits buzzables",
      "Challenges et memes",
      "Campagnes controversées"
    ],
    metrics: ["K-Factor", "Viral Coefficient", "Shares", "Earned Media Value"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "fast",
    tactics: [
      "Créer des émotions fortes (surprise, humour, inspiration)",
      "Faciliter le partage avec des boutons sociaux",
      "Incentiver le partage dans le produit",
      "Timer avec des tendances culturelles"
    ],
    caseStudy: {
      company: "Dropbox",
      result: "Vidéo explicative simple ayant généré 70K inscriptions en 1 nuit"
    }
  },
  {
    id: "engineering-marketing",
    number: 8,
    symbol: "ENG",
    name: "Engineering as Marketing",
    nameEn: "Engineering as Marketing",
    category: "viral",
    description: "Créer des outils gratuits, calculateurs ou APIs qui génèrent du trafic et des leads qualifiés. Le produit devient le marketing.",
    examples: [
      "Calculateurs en ligne",
      "Outils d'audit gratuits",
      "APIs publiques",
      "Extensions browser"
    ],
    metrics: ["Tool Users", "Signups from Tool", "Backlinks Generated", "Brand Mentions"],
    startupStage: "all",
    costLevel: "medium",
    timeToResults: "medium",
    tactics: [
      "Identifier un problème résolu par un outil simple",
      "Rendre l'outil valuable même sans inscription",
      "Optimiser pour le SEO (liens entrants)",
      "Collecter les emails en échange de résultats"
    ],
    caseStudy: {
      company: "HubSpot",
      result: "Website Grader a généré des millions de leads qualifiés gratuitement"
    }
  },
  {
    id: "referral",
    number: 9,
    symbol: "REF",
    name: "Programme de Parrainage",
    nameEn: "Referral Programs",
    category: "viral",
    description: "Inciter les clients existants à recommander le produit via des récompenses. Double-sided rewards pour maximiser la conversion.",
    examples: [
      "Parrainage double-récompense",
      "Crédits pour invitations",
      "Programme VIP parrains",
      "Gamification du referral"
    ],
    metrics: ["Referral Rate", "K-Factor", "CAC Referral vs Paid", "LTV Referred Users"],
    startupStage: "growth",
    costLevel: "medium",
    timeToResults: "medium",
    tactics: [
      "Récompenser les deux parties (parrain + filleul)",
      "Rendre le partage simple (1-click)",
      "Tester différents types de récompenses",
      "Déclencher au moment de max satisfaction"
    ],
    caseStudy: {
      company: "Dropbox",
      result: "Programme 'Give 500MB, Get 500MB' ayant fait croître de 3900% en 15 mois"
    }
  },
  {
    id: "community",
    number: 10,
    symbol: "COM",
    name: "Community Building",
    nameEn: "Community Building",
    category: "viral",
    description: "Créer et animer une communauté autour du produit ou de la mission. Génère loyalty, feedback et advocacy organique.",
    examples: [
      "Forums et groupes privés",
      "Slack/Discord communities",
      "Meetups et événements",
      "User conferences"
    ],
    metrics: ["Active Members", "Engagement Rate", "NPS", "User-Generated Content"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "slow",
    tactics: [
      "Définir une mission claire pour la communauté",
      "Identifier et empowerer les super-users",
      "Créer du contenu exclusif pour les membres",
      "Faciliter les connexions entre membres"
    ],
    caseStudy: {
      company: "Notion",
      result: "Communauté d'ambassadeurs créant templates et tutoriels gratuitement"
    }
  },
  // OUTBOUND CHANNELS
  {
    id: "pr",
    number: 11,
    symbol: "PR",
    name: "Relations Publiques",
    nameEn: "Public Relations",
    category: "outbound",
    description: "Obtenir de la couverture médiatique via des journalistes et influenceurs. Peut générer un pic de trafic et de crédibilité massive.",
    examples: [
      "Communiqués de presse",
      "Pitches personnalisés aux journalistes",
      "Exclusivités médias",
      "Storytelling fondateur"
    ],
    metrics: ["Media Mentions", "Reach", "Domain Authority Links", "Referral Traffic"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "fast",
    tactics: [
      "Construire des relations avant d'avoir besoin de couverture",
      "Créer des angles newsworthy (data, controversy)",
      "Offrir des exclusivités aux journalistes clés",
      "Newsjacker les tendances du moment"
    ],
    caseStudy: {
      company: "Airbnb",
      result: "Campagne Obama O's et McCain Chips pendant l'élection 2008"
    }
  },
  {
    id: "unconventional-pr",
    number: 12,
    symbol: "UPR",
    name: "PR Non-Conventionnel",
    nameEn: "Unconventional PR",
    category: "outbound",
    description: "Coups d'éclat et stunts marketing créant un buzz médiatique. Prend des risques mais peut générer une couverture massive.",
    examples: [
      "Publicity stunts créatifs",
      "Cascades et événements spectaculaires",
      "Campagnes controversées calculées",
      "Guerilla marketing IRL"
    ],
    metrics: ["Viral Reach", "Earned Media Value", "Brand Recall", "Social Mentions"],
    startupStage: "all",
    costLevel: "medium",
    timeToResults: "fast",
    tactics: [
      "Créer quelque chose de visuellement spectaculaire",
      "Associer la marque à une cause ou moment culturel",
      "Préparer le storytelling avant le stunt",
      "Avoir du contenu prêt à être partagé"
    ],
    caseStudy: {
      company: "Red Bull",
      result: "Stratos Jump de Felix Baumgartner vu par 8M de personnes en live"
    }
  },
  {
    id: "sales",
    number: 13,
    symbol: "SAL",
    name: "Ventes Directes",
    nameEn: "Sales",
    category: "outbound",
    description: "Prospection directe B2B via des commerciaux. Essentiel pour les produits enterprise avec des cycles de vente longs.",
    examples: [
      "Cold emailing ciblé",
      "Appels de découverte",
      "Démos produit",
      "Account-Based Selling"
    ],
    metrics: ["Meetings Booked", "Pipeline Value", "Win Rate", "Sales Cycle Length", "ACV"],
    startupStage: "all",
    costLevel: "high",
    timeToResults: "medium",
    tactics: [
      "Personnaliser chaque outreach au maximum",
      "Multi-touch avec différents canaux",
      "Qualifier tôt pour focus sur les bons comptes",
      "Créer des playbooks reproductibles"
    ],
    caseStudy: {
      company: "Salesforce",
      result: "Équipe Inside Sales pionnière ayant révolutionné la vente SaaS"
    }
  },
  {
    id: "bd",
    number: 14,
    symbol: "BD",
    name: "Développement Business",
    nameEn: "Business Development",
    category: "outbound",
    description: "Partenariats stratégiques pour accéder à de nouvelles audiences. APIs, co-marketing, intégrations, distribution deals.",
    examples: [
      "Partenariats de distribution",
      "Intégrations API",
      "Co-marketing avec des partenaires",
      "Programmes revendeurs"
    ],
    metrics: ["Partners Signed", "Revenue from Partners", "Integration Adoption", "Co-Marketing ROI"],
    startupStage: "growth",
    costLevel: "medium",
    timeToResults: "slow",
    tactics: [
      "Identifier des partenaires avec audience complémentaire",
      "Proposer une valeur claire pour les deux parties",
      "Commencer petit avant de scaler",
      "Créer des ressources facilitant l'intégration"
    ],
    caseStudy: {
      company: "Spotify",
      result: "Partenariat Facebook ayant permis l'explosion du social listening"
    }
  },
  // UNCONVENTIONAL CHANNELS
  {
    id: "speaking",
    number: 15,
    symbol: "SPK",
    name: "Speaking & Conférences",
    nameEn: "Speaking Engagements",
    category: "unconventional",
    description: "Prendre la parole dans des conférences et événements pour établir l'expertise et générer des leads qualifiés.",
    examples: [
      "Keynotes en conférences",
      "Panels d'experts",
      "Webinars et masterclass",
      "Meetups locaux"
    ],
    metrics: ["Speaking Opportunities", "Audience Reach", "Leads Generated", "Follow-Up Rate"],
    startupStage: "all",
    costLevel: "low",
    timeToResults: "medium",
    tactics: [
      "Développer un talk signature mémorable",
      "Postuler à de nombreux CFP (Call for Papers)",
      "Capturer les emails pendant la présentation",
      "Créer du contenu réutilisable depuis les talks"
    ],
    caseStudy: {
      company: "Drift",
      result: "David Cancel a bâti la marque via des talks sur le conversational marketing"
    }
  },
  {
    id: "trade-shows",
    number: 16,
    symbol: "TRD",
    name: "Salons & Événements",
    nameEn: "Trade Shows",
    category: "unconventional",
    description: "Participation à des salons professionnels pour générer des leads B2B et rencontrer des partenaires potentiels.",
    examples: [
      "Stands dans les salons majeurs",
      "Sponsoring d'événements",
      "Side events créatifs",
      "Networking structuré"
    ],
    metrics: ["Leads Scanned", "Meetings Booked", "Brand Impressions", "ROI Event"],
    startupStage: "growth",
    costLevel: "high",
    timeToResults: "fast",
    tactics: [
      "Qualifier les leads sur le stand",
      "Créer des expériences mémorables",
      "Organiser des side events exclusifs",
      "Follow-up immédiat post-événement"
    ],
    caseStudy: {
      company: "Slack",
      result: "Présence créative aux conférences tech avec des activations originales"
    }
  },
  {
    id: "offline-events",
    number: 17,
    symbol: "EVT",
    name: "Événements Offline",
    nameEn: "Offline Events",
    category: "unconventional",
    description: "Organiser ses propres événements pour créer des expériences de marque et des opportunités de networking.",
    examples: [
      "Meetups thématiques",
      "Workshops pratiques",
      "Conférence annuelle",
      "Dîners VIP clients"
    ],
    metrics: ["Attendance", "NPS Event", "Community Growth", "Brand Sentiment"],
    startupStage: "growth",
    costLevel: "medium",
    timeToResults: "medium",
    tactics: [
      "Commencer petit (meetups) avant de scaler",
      "Partnering avec d'autres marques",
      "Capturer du contenu réutilisable",
      "Créer des expériences partageables"
    ],
    caseStudy: {
      company: "SaaStr",
      result: "Jason Lemkin a créé la conférence SaaS référence mondiale"
    }
  },
  {
    id: "existing-platforms",
    number: 18,
    symbol: "PLT",
    name: "Plateformes Existantes",
    nameEn: "Existing Platforms",
    category: "unconventional",
    description: "Utiliser des plateformes établies (marketplaces, app stores, réseaux) pour accéder à leur audience captive.",
    examples: [
      "Product Hunt launches",
      "App Store optimization",
      "Amazon/Shopify marketplaces",
      "YouTube/TikTok organic"
    ],
    metrics: ["Platform Traffic", "Conversion Rate", "Reviews/Ratings", "Organic Ranking"],
    startupStage: "early",
    costLevel: "low",
    timeToResults: "fast",
    tactics: [
      "Optimiser pour les algorithmes de chaque plateforme",
      "Générer des reviews positives early",
      "Exploiter les périodes de lancement",
      "Cross-platform promotion"
    ],
    caseStudy: {
      company: "Zynga",
      result: "A exploité la plateforme Facebook pour atteindre 300M d'utilisateurs"
    }
  },
  {
    id: "affiliate",
    number: 19,
    symbol: "AFF",
    name: "Affiliation",
    nameEn: "Affiliate Programs",
    category: "unconventional",
    description: "Rémunérer des affiliés pour générer des ventes ou leads. Modèle à la performance permettant de scaler avec un risque limité.",
    examples: [
      "Programme d'affiliation classique",
      "Influencer partnerships à la commission",
      "Review sites deals",
      "Comparateurs de prix"
    ],
    metrics: ["Affiliate Sales", "Commission Rate", "EPC (Earnings Per Click)", "Active Affiliates"],
    startupStage: "growth",
    costLevel: "medium",
    timeToResults: "medium",
    tactics: [
      "Offrir des commissions compétitives",
      "Créer des ressources marketing pour les affiliés",
      "Recruter activement les top affiliés du secteur",
      "Tracker et optimiser les performances"
    ],
    caseStudy: {
      company: "Amazon",
      result: "Programme Associates ayant révolutionné le marketing digital"
    }
  }
];
