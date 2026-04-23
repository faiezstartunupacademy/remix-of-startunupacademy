import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Target, Wrench, Search, X, Filter, Building2, Trophy, Globe, Factory, Sprout, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

interface EcosystemElement {
  id: string;
  symbol: string;
  name: string;
  category: string;
  description: string;
  services: string[];
  duration: string;
  location: string;
  target_phase: string;
}

const ecosystemElements: EcosystemElement[] = [
  // GOV - Gouvernement & Entités Publiques
  {
    id: "GOV-01",
    symbol: "ST",
    name: "Startup Tunisia",
    category: "Programme National",
    description: "Programme national pour le développement de l'écosystème startup tunisien, coordination des initiatives publiques et promotion internationale.",
    services: ["Coordination écosystème", "Promotion internationale", "Politiques publiques", "Événements nationaux"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Tous stades"
  },
  {
    id: "GOV-02",
    symbol: "SC",
    name: "Smart Capital",
    category: "Entité Publique",
    description: "Société de gestion du Startup Act, opérateur du label startup et gestionnaire du fonds de fonds Anava.",
    services: ["Gestion Startup Act", "Label Startup", "Fonds de fonds Anava", "Flywheel Program"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Tous stades (Pre-seed à Scale-up)"
  },
  {
    id: "GOV-03",
    symbol: "AN",
    name: "ANAVA - Fonds de Fonds",
    category: "Fonds d'Investissement Public",
    description: "Fonds de fonds public dédié au financement des startups tunisiennes via des véhicules d'investissement agréés.",
    services: ["Investissement indirect", "Financement fonds VC", "Co-investissement", "Garanties"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "Seed à Growth"
  },
  {
    id: "GOV-04",
    symbol: "CS",
    name: "Centre d'Affaires de Sfax",
    category: "Établissement Public",
    description: "Centre régional d'accompagnement des entreprises et startups dans la région de Sfax.",
    services: ["Accompagnement", "Hébergement", "Formation", "Mise en réseau"],
    duration: "Variable",
    location: "Sfax",
    target_phase: "Création / Early Stage"
  },
  {
    id: "GOV-05",
    symbol: "ME",
    name: "Ministère de l'Emploi",
    category: "Ministère",
    description: "Ministère en charge des politiques d'emploi et de soutien à l'entrepreneuriat des jeunes.",
    services: ["Politiques d'emploi", "Programmes jeunes", "Cadre réglementaire", "Financements publics"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Tous stades"
  },
  {
    id: "GOV-06",
    symbol: "BT",
    name: "Banque Tunisienne de Solidarité",
    category: "Banque Publique",
    description: "Banque publique spécialisée dans le financement des micro-entreprises et projets d'insertion économique.",
    services: ["Microcrédits", "Prêts d'honneur", "Financement TPE", "Accompagnement bancaire"],
    duration: "Selon projet",
    location: "National (Réseau agences)",
    target_phase: "Création / Micro-entreprises"
  },
  {
    id: "GOV-07",
    symbol: "AP",
    name: "APII",
    category: "Entité Publique",
    description: "Agence de Promotion de l'Industrie et de l'Innovation, guichet unique pour la création d'entreprises industrielles.",
    services: ["Création entreprise", "Avantages fiscaux", "Accompagnement industriel", "Zones industrielles"],
    duration: "Permanent",
    location: "National",
    target_phase: "Création / Industrie"
  },
  {
    id: "GOV-08",
    symbol: "SM",
    name: "Smart Tunisia",
    category: "Programme National",
    description: "Programme national pour l'attraction des IDE et le développement du secteur IT en Tunisie.",
    services: ["Attraction investisseurs", "Promotion IT", "Facilitation administrative", "Mise en réseau international"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Scale-up / International"
  },
  
  // FND - Fonds & Programmes de Financement
  {
    id: "FND-01",
    symbol: "FN",
    name: "FONAPRA",
    category: "Fonds National",
    description: "Fonds National de Promotion de l'Artisanat et des Petits Métiers, soutien aux micro-projets.",
    services: ["Subventions", "Prêts bonifiés", "Accompagnement artisanat", "Formation métiers"],
    duration: "Selon projet",
    location: "National",
    target_phase: "Micro-entreprises / Artisanat"
  },
  {
    id: "FND-02",
    symbol: "CR",
    name: "Programme CREE",
    category: "Programme de Formation",
    description: "Programme de formation à l'entrepreneuriat (Créez votre entreprise) avec accompagnement complet.",
    services: ["Formation entrepreneuriat", "Business plan", "Coaching", "Suivi post-création"],
    duration: "3 à 6 mois",
    location: "National (Centres ANETI)",
    target_phase: "Pré-création / Idéation"
  },
  {
    id: "FND-03",
    symbol: "CE",
    name: "Programme CEFE",
    category: "Programme de Formation",
    description: "Création d'Entreprise et Formation d'Entrepreneurs, méthodologie de formation intensive.",
    services: ["Formation intensive", "Simulation business", "Coaching personnalisé", "Networking"],
    duration: "2 à 4 semaines",
    location: "National",
    target_phase: "Pré-création"
  },

  // TEC - Technopoles & Pôles
  {
    id: "TEC-01",
    symbol: "EG",
    name: "Elgazala Technopark",
    category: "Technopole",
    description: "Premier technopole de Tunisie spécialisé dans les TIC, hébergeant de nombreuses startups et centres R&D.",
    services: ["Hébergement entreprises", "Incubation", "R&D", "Formation TIC", "Networking"],
    duration: "Long terme",
    location: "Tunis (Ariana)",
    target_phase: "Startups Tech / Scale-up"
  },
  {
    id: "TEC-02",
    symbol: "TS",
    name: "Technopole de Sfax",
    category: "Technopole",
    description: "Pôle technologique régional dédié à l'innovation et au développement des entreprises à Sfax.",
    services: ["Hébergement", "Incubation", "Laboratoires", "Mise en réseau"],
    duration: "Long terme",
    location: "Sfax",
    target_phase: "Tech / Industrie"
  },
  {
    id: "TEC-03",
    symbol: "NC",
    name: "Novation City",
    category: "Technopole",
    description: "Pôle de compétitivité dédié à l'industrie 4.0, mécatronique et technologies avancées à Sousse.",
    services: ["Incubation industrielle", "Accélération Soft-landing", "Hébergement R&D", "Prototypage"],
    duration: "Long terme",
    location: "Sousse",
    target_phase: "Industrie 4.0 / Mechatronics"
  },
  {
    id: "TEC-04",
    symbol: "PG",
    name: "Pôle de Compétitivité de Gabès",
    category: "Pôle Régional",
    description: "Pôle régional de développement économique et d'innovation dans le sud tunisien.",
    services: ["Accompagnement régional", "Formation", "Hébergement", "Networking local"],
    duration: "Variable",
    location: "Gabès",
    target_phase: "Régional / Early Stage"
  },
  {
    id: "TEC-05",
    symbol: "TB",
    name: "Technopole de Bizerte",
    category: "Technopole",
    description: "Technopole spécialisé dans l'agroalimentaire et les technologies marines.",
    services: ["Incubation agrotech", "Laboratoires", "Hébergement", "Formation"],
    duration: "Long terme",
    location: "Bizerte",
    target_phase: "Agrotech / Blue Economy"
  },
  {
    id: "TEC-06",
    symbol: "TP",
    name: "Technopole de Borj Cédria",
    category: "Technopole",
    description: "Technopole spécialisé dans les énergies renouvelables, l'eau et l'environnement.",
    services: ["R&D énergies vertes", "Incubation cleantech", "Laboratoires", "Formation"],
    duration: "Long terme",
    location: "Borj Cédria",
    target_phase: "Cleantech / GreenTech"
  },

  // SSO - Structures de Support (Incubateurs, Accélérateurs)
  {
    id: "SSO-01",
    symbol: "BC",
    name: "Betacube",
    category: "Startup Studio",
    description: "Venture builder spécialisé dans la co-création de startups tech, fintech et mobilité.",
    services: ["Co-création startups", "Équipe technique dédiée", "Accès marché Fintech/Mobilité", "Investissement"],
    duration: "12 à 18 mois",
    location: "Tunis",
    target_phase: "Idéation à MVP (Fintech)"
  },
  {
    id: "SSO-02",
    symbol: "F6",
    name: "Flat6Labs",
    category: "Accélérateur",
    description: "Accélérateur régional offrant financement, mentorat intensif et accès à un réseau international.",
    services: ["Financement (Cash)", "Mentorat intensif", "Espace de travail", "Demo Day", "Réseau MENA"],
    duration: "4 mois",
    location: "Tunis (Le 15)",
    target_phase: "Seed / Early Growth"
  },
  {
    id: "SSO-03",
    symbol: "WS",
    name: "WikiStartup",
    category: "Incubateur",
    description: "Structure privée d'accompagnement stratégique des startups avec accès aux mécanismes de financement.",
    services: ["Mentoring stratégique", "Accès financement", "Business Planning", "Networking"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "Amorçage / Pré-amorçage"
  },
  {
    id: "SSO-04",
    symbol: "CT",
    name: "CoStartT",
    category: "Incubateur",
    description: "Incubateur dédié aux startups technologiques au sein du technopole de Sfax.",
    services: ["Incubation tech", "Accès laboratoires", "Mentoring", "Prototypage"],
    duration: "12 à 24 mois",
    location: "Sfax (Technopole)",
    target_phase: "Tech / R&D"
  },
  {
    id: "SSO-05",
    symbol: "LE",
    name: "Lab'ess",
    category: "Incubateur ESS",
    description: "Incubateur spécialisé dans l'économie sociale et solidaire, accompagnement des projets à impact.",
    services: ["Incubation ESS", "Prêt d'honneur", "Formation Impact", "Hébergement", "Communauté"],
    duration: "6 à 12 mois",
    location: "Tunis (Belvédère)",
    target_phase: "Idéation / MVP (Impact Social)"
  },
  {
    id: "SSO-06",
    symbol: "CB",
    name: "Carthage Business Angels",
    category: "Business Angels",
    description: "Réseau de business angels tunisiens investissant dans les startups en phase d'amorçage.",
    services: ["Investissement early-stage", "Mentoring", "Networking", "Due diligence"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "Seed / Early Growth"
  },
  {
    id: "SSO-07",
    symbol: "FI",
    name: "Founder Institute Tunis",
    category: "Pré-Accélérateur",
    description: "Programme mondial de pré-accélération pour les entrepreneurs en phase d'idéation.",
    services: ["Validation idée", "Mentorat mondial", "Curriculum structuré", "Réseau international"],
    duration: "4 mois",
    location: "Tunis",
    target_phase: "Idéation / Pre-seed"
  },
  {
    id: "SSO-08",
    symbol: "IB",
    name: "iBAN Tunisia",
    category: "Business Angels",
    description: "Réseau national de business angels tunisiens avec focus sur l'investissement early-stage.",
    services: ["Investissement seed", "Mentorat", "Deal flow", "Syndication"],
    duration: "Variable",
    location: "National",
    target_phase: "Seed / Series A"
  },
  {
    id: "SSO-09",
    symbol: "ML",
    name: "MakerLab",
    category: "FabLab",
    description: "Espace de prototypage et fabrication numérique ouvert aux entrepreneurs et makers.",
    services: ["Prototypage 3D", "Électronique", "Formation maker", "Coworking tech"],
    duration: "Flexible",
    location: "Tunis",
    target_phase: "Prototypage / Hardware"
  },
  {
    id: "SSO-10",
    symbol: "CD",
    name: "CEED Tunisie",
    category: "Programme Formation",
    description: "ONG internationale d'accompagnement et de formation des entrepreneurs en Tunisie.",
    services: ["Formation entrepreneuriat", "Coaching", "Networking international", "Événements"],
    duration: "Programmes courts",
    location: "Tunis",
    target_phase: "Early Stage"
  },
  {
    id: "SSO-11",
    symbol: "RS",
    name: "RedStart Tunisie",
    category: "Accélérateur",
    description: "Accélérateur PME et startups avec focus sur l'ouverture des marchés internationaux.",
    services: ["Accélération In-house", "Marché international", "Conseil stratégique", "Financement"],
    duration: "6 à 12 mois",
    location: "Tunis / Sfax",
    target_phase: "Croissance / PME innovante"
  },
  {
    id: "SSO-12",
    symbol: "OS",
    name: "Open Startup Tunisia (OST)",
    category: "Programme",
    description: "Programme d'open innovation connectant startups et grandes entreprises.",
    services: ["Open innovation", "Matching corporates", "Pilotes", "Networking"],
    duration: "6 mois",
    location: "National",
    target_phase: "Scale-up / Partenariats"
  },
  {
    id: "SSO-13",
    symbol: "FU",
    name: "FOUNDUP",
    category: "Programme",
    description: "Programme de développement et d'accompagnement des fondateurs de startups.",
    services: ["Formation fondateurs", "Coaching", "Peer learning", "Networking"],
    duration: "4 à 6 mois",
    location: "National",
    target_phase: "Early Stage"
  },
  {
    id: "SSO-14",
    symbol: "1K",
    name: "1Kub",
    category: "Incubateur",
    description: "Incubateur promouvant l'inclusion et la diversité dans l'entrepreneuriat.",
    services: ["Incubation inclusive", "Formation", "Accompagnement", "Financement solidaire"],
    duration: "6 à 12 mois",
    location: "National",
    target_phase: "Idéation / Early Stage"
  },
  {
    id: "SSO-15",
    symbol: "MN",
    name: "Minassa (INCO Tunisie)",
    category: "Incubateur",
    description: "Incubateur dédié aux industries créatives et culturelles en Tunisie.",
    services: ["Incubation créative", "Formation arts", "Financement culture", "Événements"],
    duration: "6 à 12 mois",
    location: "Tunis",
    target_phase: "Industries Créatives"
  },
  {
    id: "SSO-16",
    symbol: "KF",
    name: "Kufanya",
    category: "Incubateur ESS",
    description: "Incubateur d'innovation sociale soutenant les projets à fort impact communautaire.",
    services: ["Incubation sociale", "Formation impact", "Financement", "Communauté"],
    duration: "6 à 12 mois",
    location: "Tunis",
    target_phase: "Impact Social"
  },
  {
    id: "SSO-17",
    symbol: "F6B",
    name: "Factory 619",
    category: "Incubateur",
    description: "Incubateur de startups avec focus sur l'innovation et la technologie.",
    services: ["Incubation", "Coworking", "Mentoring", "Événements"],
    duration: "6 à 12 mois",
    location: "Tunis",
    target_phase: "Early Stage"
  },
  {
    id: "SSO-18",
    symbol: "MD",
    name: "MEDIANET",
    category: "Incubateur",
    description: "Incubateur technologique spécialisé dans le digital et les nouvelles technologies.",
    services: ["Incubation tech", "Hébergement", "Formation digitale", "Networking"],
    duration: "12 mois",
    location: "Tunis",
    target_phase: "Tech / Digital"
  },
  {
    id: "SSO-19",
    symbol: "RE",
    name: "Réseau Entreprendre Tunisie",
    category: "Réseau Mentorat",
    description: "Réseau d'accompagnement et de financement par des entrepreneurs pour des entrepreneurs.",
    services: ["Prêt d'honneur", "Mentorat", "Réseau entrepreneurs", "Formation"],
    duration: "24 à 36 mois",
    location: "National",
    target_phase: "Création / Croissance"
  },
  {
    id: "SSO-20",
    symbol: "OD",
    name: "Our Digital Future",
    category: "Programme",
    description: "Incubateur focalisé sur la transformation digitale et les compétences numériques.",
    services: ["Formation digitale", "Incubation", "Mentoring tech", "Projets numériques"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "Digital / Tech"
  },
  {
    id: "SSO-21",
    symbol: "WA",
    name: "Wassbi (Programme Afkar)",
    category: "Programme",
    description: "Programme d'incubation et d'accompagnement des jeunes entrepreneurs.",
    services: ["Incubation", "Formation", "Coaching", "Financement seed"],
    duration: "6 mois",
    location: "Tunis",
    target_phase: "Idéation / Seed"
  },
  {
    id: "SSO-22",
    symbol: "SG",
    name: "StartupGateX",
    category: "Startup Studio",
    description: "Studio de création et d'accélération de startups avec modèle hybride.",
    services: ["Venture building", "Accélération", "Investissement", "Mentorat"],
    duration: "12 à 18 mois",
    location: "Tunis",
    target_phase: "Idéation à Growth"
  },
  {
    id: "SSO-23",
    symbol: "YS",
    name: "Yunus Social Business Tunisia",
    category: "Incubateur ESS",
    description: "Incubateur social inspiré du modèle Yunus, dédié aux entreprises sociales.",
    services: ["Incubation sociale", "Formation impact", "Financement", "Réseau international"],
    duration: "12 mois",
    location: "Tunis",
    target_phase: "Social Business"
  },
  {
    id: "SSO-24",
    symbol: "TC",
    name: "TCSE",
    category: "Incubateur ESS",
    description: "Centre tunisien de soutien à l'entrepreneuriat social et à l'économie solidaire.",
    services: ["Accompagnement ESS", "Formation", "Networking", "Plaidoyer"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "ESS / Impact"
  },
  {
    id: "SSO-25",
    symbol: "WH",
    name: "Westerwelle Startup Haus Tunis",
    category: "Hub",
    description: "Hub international d'entrepreneuriat offrant espace et programmes aux startups.",
    services: ["Coworking", "Programmes internationaux", "Mentoring", "Événements"],
    duration: "Flexible",
    location: "Tunis (Centre-ville)",
    target_phase: "Early Stage / International"
  },
  {
    id: "SSO-26",
    symbol: "DJ",
    name: "Fondation Djagora",
    category: "Fondation",
    description: "Fondation soutenant l'entrepreneuriat, la recherche et le transfert technologique à Sfax.",
    services: ["Formation entrepreneuriale", "Accompagnement scientifique", "Transfert technologique", "Financement"],
    duration: "Variable (Cohortes)",
    location: "Sfax / Sud",
    target_phase: "Idéation / R&D / Early Stage"
  },
  {
    id: "SSO-27",
    symbol: "FS",
    name: "FabLab Solidaires",
    category: "FabLab",
    description: "Réseau national de FabLabs solidaires (Orange) pour l'inclusion numérique et le prototypage.",
    services: ["Formation numérique", "Prototypage 3D", "Inclusion numérique", "Ateliers makers"],
    duration: "Programmes courts",
    location: "Réseau National (Orange)",
    target_phase: "Idéation / Éducation"
  },

  // PEP - Pépinières d'Entreprises
  {
    id: "PEP-01",
    symbol: "PB",
    name: "Pépinière de Ben Arous",
    category: "Pépinière",
    description: "Pépinière d'entreprises de la région de Ben Arous pour l'accompagnement des jeunes entrepreneurs.",
    services: ["Hébergement", "Accompagnement", "Formation", "Orientation financement"],
    duration: "12 à 24 mois",
    location: "Ben Arous",
    target_phase: "Création"
  },
  {
    id: "PEP-02",
    symbol: "PM",
    name: "Pépinière de Monastir",
    category: "Pépinière",
    description: "Pépinière d'entreprises du Sahel spécialisée dans l'accompagnement des projets innovants.",
    services: ["Hébergement", "Formation", "Coaching", "Mise en réseau"],
    duration: "12 à 24 mois",
    location: "Monastir",
    target_phase: "Création / Early Stage"
  },
  {
    id: "PEP-03",
    symbol: "PS",
    name: "Pépinière de Sousse",
    category: "Pépinière",
    description: "Pépinière régionale pour l'accompagnement des créateurs d'entreprises à Sousse.",
    services: ["Hébergement", "Accompagnement", "Formation", "Financement"],
    duration: "12 à 24 mois",
    location: "Sousse",
    target_phase: "Création"
  },
  {
    id: "PEP-04",
    symbol: "PK",
    name: "Pépinière de Kairouan",
    category: "Pépinière",
    description: "Pépinière d'entreprises de Kairouan pour le développement régional.",
    services: ["Hébergement", "Accompagnement", "Formation", "Orientation"],
    duration: "12 à 24 mois",
    location: "Kairouan",
    target_phase: "Création"
  },
  {
    id: "PEP-05",
    symbol: "PJ",
    name: "Pépinière de Jendouba",
    category: "Pépinière",
    description: "Pépinière d'entreprises du Nord-Ouest pour l'inclusion économique régionale.",
    services: ["Hébergement", "Formation", "Accompagnement", "Networking régional"],
    duration: "12 à 24 mois",
    location: "Jendouba",
    target_phase: "Création"
  },

  // STU - Startup Studios & Factories
  {
    id: "STU-01",
    symbol: "BV",
    name: "BeVentures",
    category: "Startup Factory",
    description: "Startup factory qui co-fonde et développe des startups tech avec des entrepreneurs.",
    services: ["Co-fondation", "Équipe technique", "Financement seed", "Product-market fit"],
    duration: "12 à 24 mois",
    location: "Tunis",
    target_phase: "Idéation à Seed"
  },
  {
    id: "STU-02",
    symbol: "VL",
    name: "Venture Lab",
    category: "Startup Studio",
    description: "Studio de création de startups avec expertise produit et technologie.",
    services: ["Venture building", "CTO as a service", "MVP Development", "Growth"],
    duration: "6 à 18 mois",
    location: "Tunis",
    target_phase: "Idéation à MVP"
  },
  {
    id: "STU-03",
    symbol: "DG",
    name: "Digital Gate",
    category: "Startup Studio",
    description: "Studio digital spécialisé dans la création de startups SaaS et marketplace.",
    services: ["Product building", "Tech team", "Go-to-market", "Seed funding"],
    duration: "12 mois",
    location: "Tunis",
    target_phase: "Idéation à Growth"
  },

  // COP - Coopération Internationale
  {
    id: "COP-01",
    symbol: "GZ",
    name: "GIZ Tunisie",
    category: "Coopération Internationale",
    description: "Agence allemande de coopération internationale avec programmes d'appui à l'entrepreneuriat.",
    services: ["Programmes formation", "Financement projets", "Expertise technique", "Networking international"],
    duration: "Variable (Projets)",
    location: "Tunis (National)",
    target_phase: "Tous stades"
  },
  {
    id: "COP-02",
    symbol: "UE",
    name: "Délégation UE - EU4Youth",
    category: "Coopération Internationale",
    description: "Programme européen d'appui à l'employabilité et à l'entrepreneuriat des jeunes.",
    services: ["Financement", "Formation", "Échanges européens", "Capacity building"],
    duration: "Variable (Projets)",
    location: "Tunis",
    target_phase: "Early Stage / Formation"
  },
  {
    id: "COP-03",
    symbol: "AF",
    name: "AFD - Agence Française de Développement",
    category: "Coopération Internationale",
    description: "Agence française finançant des projets de développement et d'entrepreneuriat.",
    services: ["Financement de projets", "Assistance technique", "Études", "Partenariats"],
    duration: "Selon projets",
    location: "Tunis",
    target_phase: "Tous stades"
  },
  {
    id: "COP-04",
    symbol: "US",
    name: "USAID Tunisia",
    category: "Coopération Internationale",
    description: "Agence américaine avec programmes d'appui à l'économie et aux startups tunisiennes.",
    services: ["Programmes entrepreneuriat", "Formation", "Financement", "Partenariats US"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "Tous stades"
  },
  {
    id: "COP-05",
    symbol: "BM",
    name: "Banque Mondiale - Innov'i",
    category: "Coopération Internationale",
    description: "Programme de la Banque Mondiale pour soutenir l'innovation et les startups tunisiennes.",
    services: ["Financement innovation", "Capacity building", "Réformes", "Études"],
    duration: "Programmes pluriannuels",
    location: "Tunis (National)",
    target_phase: "Scale-up / Écosystème"
  },
  {
    id: "COP-06",
    symbol: "KF",
    name: "KfW - Coopération Allemande",
    category: "Coopération Internationale",
    description: "Banque de développement allemande avec programmes de financement pour PME et startups.",
    services: ["Lignes de crédit", "Financement vert", "Assistance technique", "Garanties"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "Growth / Scale-up"
  },
  {
    id: "COP-07",
    symbol: "EN",
    name: "ENABEL - Coopération Belge",
    category: "Coopération Internationale",
    description: "Agence belge de coopération avec programmes d'appui à l'entrepreneuriat.",
    services: ["Formation", "Financement", "Échanges", "Expertise technique"],
    duration: "Variable",
    location: "Tunis / Régions",
    target_phase: "Early Stage / Régional"
  },
  {
    id: "COP-08",
    symbol: "SW",
    name: "Swisscontact Tunisie",
    category: "Coopération Internationale",
    description: "Organisation suisse de développement économique avec programmes entrepreneuriat.",
    services: ["Formation professionnelle", "Appui startups", "Insertion économique", "Partenariats"],
    duration: "Projets pluriannuels",
    location: "Tunis / Régions",
    target_phase: "Formation / Early Stage"
  },

  // CPT - Compétitions & Concours
  {
    id: "CPT-01",
    symbol: "SC",
    name: "Startup Challenge",
    category: "Compétition",
    description: "Compétition nationale de startups avec prix et accompagnement pour les gagnants.",
    services: ["Prix financiers", "Mentorat", "Visibilité médiatique", "Networking"],
    duration: "2-3 mois",
    location: "National",
    target_phase: "Idéation / Early Stage"
  },
  {
    id: "CPT-02",
    symbol: "HT",
    name: "Hult Prize Tunis",
    category: "Compétition",
    description: "Compétition internationale d'entrepreneuriat social organisée à Tunis.",
    services: ["Prix 1M$", "Mentorat global", "Formation impact", "Réseau international"],
    duration: "6 mois",
    location: "Tunis (International)",
    target_phase: "Social Entrepreneurship"
  },
  {
    id: "CPT-03",
    symbol: "SW",
    name: "Seedstars Tunis",
    category: "Compétition",
    description: "Compétition mondiale de startups avec finale régionale à Tunis.",
    services: ["Prix investissement", "Mentorat", "Accès investisseurs", "Bootcamp"],
    duration: "3-4 mois",
    location: "Tunis (MENA)",
    target_phase: "Seed / Series A"
  },
  {
    id: "CPT-04",
    symbol: "EN",
    name: "Enactus Tunisia",
    category: "Compétition",
    description: "Compétition étudiante d'entrepreneuriat social avec projets à impact.",
    services: ["Formation", "Mentorat", "Compétition nationale/mondiale", "Leadership"],
    duration: "Année académique",
    location: "National (Universités)",
    target_phase: "Étudiants / Impact"
  },
  {
    id: "CPT-05",
    symbol: "TT",
    name: "Tunisia Tech Awards",
    category: "Compétition",
    description: "Prix national récompensant les meilleures innovations technologiques tunisiennes.",
    services: ["Prix", "Visibilité", "Networking tech", "Média coverage"],
    duration: "Annuel",
    location: "National",
    target_phase: "Tech / Innovation"
  },
  {
    id: "CPT-06",
    symbol: "OC",
    name: "Orange Corners Tunisia",
    category: "Programme Compétitif",
    description: "Programme compétitif de soutien aux jeunes entrepreneurs par Orange.",
    services: ["Formation", "Financement", "Mentorat", "Hébergement FabLab"],
    duration: "6 mois",
    location: "National",
    target_phase: "Idéation / Early Stage"
  },
  {
    id: "CPT-07",
    symbol: "JC",
    name: "JCI Creative Young Entrepreneur",
    category: "Compétition",
    description: "Concours international de la Jeune Chambre Internationale pour entrepreneurs innovants.",
    services: ["Prix", "Networking JCI", "Formation", "Finale internationale"],
    duration: "4-5 mois",
    location: "National / International",
    target_phase: "Jeunes entrepreneurs"
  },
  {
    id: "CPT-08",
    symbol: "GT",
    name: "Google for Startups Accelerator MENA",
    category: "Programme Compétitif",
    description: "Programme d'accélération Google sélectionnant des startups tech prometteuses de la région MENA.",
    services: ["Mentorat Google", "Cloud credits", "Formation tech", "Réseau global"],
    duration: "3 mois",
    location: "Régional (MENA)",
    target_phase: "Growth / Tech"
  },
  {
    id: "CPT-09",
    symbol: "MS",
    name: "Microsoft for Startups",
    category: "Programme Compétitif",
    description: "Programme Microsoft d'accès aux ressources cloud et mentorat pour startups B2B.",
    services: ["Azure credits", "Mentorat tech", "Go-to-market", "Réseau partenaires"],
    duration: "12 mois",
    location: "National / Global",
    target_phase: "Tech B2B / SaaS"
  },
  {
    id: "CPT-10",
    symbol: "AB",
    name: "Alibaba eFounders Fellowship",
    category: "Programme Compétitif",
    description: "Programme Alibaba de formation et mentorat pour entrepreneurs e-commerce.",
    services: ["Formation Chine", "Mentorat Alibaba", "Accès plateformes", "Réseau"],
    duration: "2 semaines + suivi",
    location: "Chine / National",
    target_phase: "E-commerce / Export"
  },

  // COW - Coworking
  {
    id: "COW-01",
    symbol: "BE",
    name: "Bee Coworking Space",
    category: "Coworking",
    description: "Espace de coworking moderne avec services complets pour entrepreneurs.",
    services: ["Bureaux partagés", "Salles de réunion", "Événements", "Networking"],
    duration: "Journalier / Mensuel",
    location: "Gabès",
    target_phase: "Nomades / Freelances"
  },
  {
    id: "COW-02",
    symbol: "CK",
    name: "Coworky",
    category: "Coworking",
    description: "Espace de coworking dans la région du Cap Bon pour entrepreneurs locaux.",
    services: ["Coworking", "Domiciliation", "Événements", "Formation"],
    duration: "Flexible",
    location: "Cap Bon",
    target_phase: "Régional / Early Stage"
  },
  {
    id: "COW-03",
    symbol: "H1",
    name: "Hive12",
    category: "Coworking",
    description: "Espace de coworking et d'innovation dans la région du Sahel.",
    services: ["Coworking", "Incubation légère", "Événements", "Networking"],
    duration: "Flexible",
    location: "Sahel",
    target_phase: "Régional"
  },
  {
    id: "COW-04",
    symbol: "L1",
    name: "Level 1",
    category: "Coworking",
    description: "Concept anti-café et espace de travail collaboratif pour entrepreneurs créatifs.",
    services: ["Coworking créatif", "Événements", "Networking", "Café"],
    duration: "Horaire / Journalier",
    location: "Tunis",
    target_phase: "Créatifs / Nomades"
  },
  {
    id: "COW-05",
    symbol: "TD",
    name: "The Dot",
    category: "Hub",
    description: "Hub digital gouvernemental offrant coworking et services publics digitalisés.",
    services: ["Coworking", "Domiciliation", "Services publics digitalisés", "Événementiel"],
    duration: "Flexible",
    location: "Tunis (Berges du Lac)",
    target_phase: "Toutes phases (Digital)"
  },
  {
    id: "COW-06",
    symbol: "C1",
    name: "Cogite",
    category: "Coworking",
    description: "Premier espace de coworking en Tunisie, communauté d'entrepreneurs établie.",
    services: ["Coworking", "Événements", "Communauté", "Mentoring informel"],
    duration: "Flexible",
    location: "Tunis (Lafayette)",
    target_phase: "Tous stades"
  },
  {
    id: "COW-07",
    symbol: "EH",
    name: "El Hub",
    category: "Coworking",
    description: "Espace de coworking et hub entrepreneurial dans le centre de Tunis.",
    services: ["Coworking", "Salles de réunion", "Événements", "Formation"],
    duration: "Flexible",
    location: "Tunis",
    target_phase: "Early Stage"
  },

  // GOV - Compléments Gouvernementaux & Agences Nationales
  {
    id: "GOV-09",
    symbol: "AN",
    name: "ANETI",
    category: "Entité Publique",
    description: "Agence Nationale pour l'Emploi et le Travail Indépendant, opérateur public d'accompagnement à la création d'entreprise.",
    services: ["Programmes CREE/CEFE", "Bureaux Emploi", "Accompagnement créateurs", "Stages SIVP"],
    duration: "Permanent",
    location: "National (Réseau bureaux)",
    target_phase: "Pré-création / Création"
  },
  {
    id: "GOV-10",
    symbol: "BF",
    name: "BFPME",
    category: "Banque Publique",
    description: "Banque de Financement des Petites et Moyennes Entreprises, financement direct des PME et startups en phase de croissance.",
    services: ["Crédits investissement", "Crédits gestion", "Co-financement", "Garantie SOTUGAR"],
    duration: "Selon projet",
    location: "National",
    target_phase: "Création / PME"
  },
  {
    id: "GOV-11",
    symbol: "SG",
    name: "SOTUGAR",
    category: "Entité Publique",
    description: "Société Tunisienne de Garantie, mécanisme national de garantie des crédits aux PME et startups.",
    services: ["Garantie de crédits", "Garantie capital-risque", "Couverture risque", "Co-garantie"],
    duration: "Selon contrat",
    location: "Tunis (National)",
    target_phase: "PME / Startups"
  },
  {
    id: "GOV-12",
    symbol: "CD",
    name: "CDC Tunisie",
    category: "Fonds d'Investissement Public",
    description: "Caisse des Dépôts et Consignations, investisseur institutionnel de long terme pour le développement économique.",
    services: ["Investissement direct", "Fonds VC", "Infrastructures", "Capital développement"],
    duration: "Long terme",
    location: "Tunis (National)",
    target_phase: "Growth / Scale-up"
  },
  {
    id: "GOV-13",
    symbol: "DG",
    name: "DGPME",
    category: "Ministère",
    description: "Direction Générale de la Promotion des PME au Ministère de l'Industrie, pilotage des politiques d'appui aux PME.",
    services: ["Politiques PME", "Programmes appui", "Études sectorielles", "Coordination"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "PME / Tous stades"
  },
  {
    id: "GOV-14",
    symbol: "AT",
    name: "API Tunisia (Agriculture)",
    category: "Entité Publique",
    description: "Agence de Promotion des Investissements Agricoles, guichet unique pour les projets agricoles et agroalimentaires.",
    services: ["Création projets agricoles", "Avantages fiscaux", "Études filières", "Foncier agricole"],
    duration: "Permanent",
    location: "National",
    target_phase: "AgriTech / Agroalimentaire"
  },
  {
    id: "GOV-15",
    symbol: "FX",
    name: "FIPA Tunisia",
    category: "Entité Publique",
    description: "Foreign Investment Promotion Agency, agence de promotion de l'investissement étranger en Tunisie.",
    services: ["Attraction IDE", "Accompagnement investisseurs", "Soft-landing", "Promotion internationale"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Scale-up / International"
  },
  {
    id: "GOV-16",
    symbol: "CE",
    name: "CEPEX",
    category: "Entité Publique",
    description: "Centre de Promotion des Exportations, accompagnement des entreprises tunisiennes à l'export.",
    services: ["Diagnostic export", "Salons internationaux", "Études marchés", "Financement export"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Scale-up / Export"
  },
  {
    id: "GOV-17",
    symbol: "MJ",
    name: "Ministère Jeunesse & Sport",
    category: "Ministère",
    description: "Ministère en charge des politiques jeunesse, soutien à l'entrepreneuriat des jeunes via maisons des jeunes.",
    services: ["Maisons des jeunes", "Programmes jeunesse", "Subventions associatives", "Formation"],
    duration: "Permanent",
    location: "National",
    target_phase: "Jeunes entrepreneurs"
  },
  {
    id: "GOV-18",
    symbol: "MI",
    name: "Ministère Industrie & PME",
    category: "Ministère",
    description: "Ministère pilote de la politique industrielle et de soutien aux PME et startups innovantes.",
    services: ["Stratégie industrielle", "Politique innovation", "Cadre réglementaire", "Plans sectoriels"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Industrie / Innovation"
  },
  {
    id: "GOV-19",
    symbol: "MT",
    name: "Ministère Technologies de la Communication",
    category: "Ministère",
    description: "Ministère en charge du numérique, de la transformation digitale et du développement TIC.",
    services: ["Stratégie digitale Tunisie 2025", "Cadre numérique", "Cybersécurité", "e-Gov"],
    duration: "Permanent",
    location: "Tunis (National)",
    target_phase: "Digital / Tech"
  },
  {
    id: "GOV-20",
    symbol: "OD",
    name: "ODNO",
    category: "Établissement Public",
    description: "Office de Développement du Nord-Ouest, organisme régional de développement économique du Nord-Ouest tunisien.",
    services: ["Développement régional", "Études territoriales", "Appui projets", "Animation territoriale"],
    duration: "Permanent",
    location: "Nord-Ouest (Béja)",
    target_phase: "Régional / Tous stades"
  },
  {
    id: "GOV-21",
    symbol: "OS",
    name: "ODS",
    category: "Établissement Public",
    description: "Office de Développement du Sud, organisme régional pour le développement du Sud tunisien.",
    services: ["Développement Sud", "Appui projets locaux", "Études", "Coordination régionale"],
    duration: "Permanent",
    location: "Sud (Médenine)",
    target_phase: "Régional"
  },
  {
    id: "GOV-22",
    symbol: "OC",
    name: "ODCO",
    category: "Établissement Public",
    description: "Office de Développement du Centre-Ouest, soutien au développement économique du Centre-Ouest tunisien.",
    services: ["Développement Centre-Ouest", "Appui régional", "Études territoriales", "Animation"],
    duration: "Permanent",
    location: "Centre-Ouest (Kasserine)",
    target_phase: "Régional"
  },

  // FND - Fonds VC Privés & Capital-Risque
  {
    id: "FND-04",
    symbol: "AI",
    name: "AfricInvest",
    category: "Fonds National",
    description: "Société de capital-investissement panafricaine basée à Tunis, leader régional en private equity et venture capital.",
    services: ["Capital développement", "Capital-risque", "Buy-out", "Mezzanine"],
    duration: "5-7 ans",
    location: "Tunis (Panafricain)",
    target_phase: "Growth / Scale-up"
  },
  {
    id: "FND-05",
    symbol: "BC",
    name: "BIAT Capital Risque",
    category: "Fonds National",
    description: "Filiale capital-risque de la BIAT, financement des PME tunisiennes en croissance.",
    services: ["Capital amorçage", "Capital développement", "Co-investissement", "Accompagnement"],
    duration: "4-6 ans",
    location: "Tunis (National)",
    target_phase: "Seed / Growth"
  },
  {
    id: "FND-06",
    symbol: "UG",
    name: "UGFS",
    category: "Fonds National",
    description: "United Gulf Financial Services, gestionnaire de fonds d'investissement panafricains depuis Tunis.",
    services: ["Capital-risque", "Private equity", "Gestion d'actifs", "Conseil financier"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "Growth / Scale-up"
  },
  {
    id: "FND-07",
    symbol: "SC",
    name: "SAGES Capital",
    category: "Fonds National",
    description: "Société de gestion de fonds d'investissement spécialisée dans le capital-développement en Tunisie.",
    services: ["Capital-développement", "Capital-transmission", "Investissement PME", "Conseil"],
    duration: "5-8 ans",
    location: "Tunis",
    target_phase: "Growth / PME"
  },
  {
    id: "FND-08",
    symbol: "MX",
    name: "Maxula Gestion",
    category: "Fonds National",
    description: "Société de gestion d'actifs et de fonds communs de placement à risque en Tunisie.",
    services: ["FCPR", "SICAR", "Gestion collective", "Conseil investissement"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "PME / Growth"
  },
  {
    id: "FND-09",
    symbol: "TA",
    name: "Tuninvest Africa",
    category: "Fonds National",
    description: "Branche du groupe Integra dédiée à l'investissement panafricain en capital-risque.",
    services: ["Venture capital", "Croissance Afrique", "Co-investissement", "Mentorat"],
    duration: "5-7 ans",
    location: "Tunis (Afrique)",
    target_phase: "Growth / Pan-Africain"
  },
  {
    id: "FND-10",
    symbol: "CV",
    name: "Capsa Capital",
    category: "Fonds National",
    description: "Fonds de capital-investissement tunisien spécialisé dans les PME à fort potentiel.",
    services: ["Capital développement", "Restructuration", "Conseil stratégique", "Accompagnement"],
    duration: "4-6 ans",
    location: "Tunis",
    target_phase: "PME / Growth"
  },
  {
    id: "FND-11",
    symbol: "DT",
    name: "Diaspora Tunisienne Invest",
    category: "Fonds National",
    description: "Fonds dédié à mobiliser la diaspora tunisienne pour investir dans les startups locales.",
    services: ["Investissement diaspora", "Mentorat international", "Mise en réseau", "Co-investissement"],
    duration: "Variable",
    location: "Tunis / International",
    target_phase: "Seed / Growth"
  },

  // TEC - Pôles & Centres Techniques Sectoriels
  {
    id: "TEC-07",
    symbol: "PM",
    name: "Pôle de Compétitivité Monastir-El Fejja",
    category: "Pôle Régional",
    description: "Pôle de compétitivité dédié au textile-habillement, leader national du secteur textile.",
    services: ["Innovation textile", "R&D matériaux", "Formation métiers", "Centre essais"],
    duration: "Long terme",
    location: "Monastir / El Fejja",
    target_phase: "Textile / Mode"
  },
  {
    id: "TEC-08",
    symbol: "PB",
    name: "Pôle Bizerte Mateur",
    category: "Pôle Régional",
    description: "Pôle agroalimentaire et industriel du Nord, soutien aux entreprises de transformation.",
    services: ["Agroalimentaire", "Industrie", "R&D filières", "Hébergement entreprises"],
    duration: "Long terme",
    location: "Bizerte / Mateur",
    target_phase: "Agro / Industrie"
  },
  {
    id: "TEC-09",
    symbol: "CT",
    name: "CETTEX",
    category: "Établissement Public",
    description: "Centre Technique du Textile, centre national de R&D et services au secteur textile-habillement.",
    services: ["R&D textile", "Essais & contrôles", "Formation technique", "Veille sectorielle"],
    duration: "Permanent",
    location: "Ksar Said (Tunis)",
    target_phase: "Textile / R&D"
  },
  {
    id: "TEC-10",
    symbol: "PC",
    name: "PACKTEC",
    category: "Établissement Public",
    description: "Centre Technique de l'Emballage et du Conditionnement, expertise nationale en packaging.",
    services: ["R&D emballage", "Tests qualité", "Formation packaging", "Conseil industriel"],
    duration: "Permanent",
    location: "Tunis",
    target_phase: "Industrie / Packaging"
  },
  {
    id: "TEC-11",
    symbol: "CC",
    name: "CETIME",
    category: "Établissement Public",
    description: "Centre Technique des Industries Mécaniques et Électriques, R&D et essais industriels.",
    services: ["R&D mécanique", "Essais électriques", "Certification", "Formation technique"],
    duration: "Permanent",
    location: "Ksar Said (Tunis)",
    target_phase: "Industrie / Mécatronique"
  },
  {
    id: "TEC-12",
    symbol: "CA",
    name: "CTAA",
    category: "Établissement Public",
    description: "Centre Technique de l'Agroalimentaire, expertise nationale pour l'industrie agroalimentaire.",
    services: ["R&D agroalimentaire", "Analyses", "HACCP", "Formation"],
    duration: "Permanent",
    location: "Tunis",
    target_phase: "AgriFood / R&D"
  },

  // SSO - Incubateurs Universitaires & Régionaux
  {
    id: "SSO-28",
    symbol: "EI",
    name: "ESPRIT Incubator",
    category: "Incubateur",
    description: "Incubateur universitaire de l'École Supérieure Privée d'Ingénierie et Technologies, accompagnement projets étudiants.",
    services: ["Incubation étudiante", "Mentorat académique", "Prototypage", "Pré-amorçage"],
    duration: "12 mois",
    location: "Tunis (ESPRIT)",
    target_phase: "Étudiants / Idéation"
  },
  {
    id: "SSO-29",
    symbol: "IN",
    name: "INSAT Junior Entreprise",
    category: "Incubateur",
    description: "Structure d'accompagnement à l'entrepreneuriat de l'INSAT pour étudiants ingénieurs.",
    services: ["Junior Entreprise", "Mentorat", "Prototypage", "Networking ingénieurs"],
    duration: "Variable",
    location: "Tunis (INSAT)",
    target_phase: "Étudiants / Tech"
  },
  {
    id: "SSO-30",
    symbol: "PT",
    name: "Polytech Incubateur",
    category: "Incubateur",
    description: "Incubateur de l'École Polytechnique de Tunisie pour les projets innovants de ses étudiants et alumni.",
    services: ["Incubation tech", "R&D laboratoires", "Mentorat", "Pré-amorçage"],
    duration: "12-24 mois",
    location: "La Marsa",
    target_phase: "Étudiants / DeepTech"
  },
  {
    id: "SSO-31",
    symbol: "MS",
    name: "Mediterranean School of Business",
    category: "Incubateur",
    description: "MSB Entrepreneurship Center, formation et accompagnement à l'entrepreneuriat.",
    services: ["Formation entrepreneuriat", "Mentorat business", "Bootcamps", "Pitch competitions"],
    duration: "Variable",
    location: "Tunis (MSB)",
    target_phase: "Étudiants / Early Stage"
  },
  {
    id: "SSO-32",
    symbol: "UC",
    name: "UCAR Innovation Center",
    category: "Incubateur",
    description: "Centre d'innovation de l'Université Centrale de Tunis pour la valorisation de la recherche.",
    services: ["Valorisation recherche", "Incubation", "Mentorat académique", "Brevets"],
    duration: "Variable",
    location: "Tunis",
    target_phase: "DeepTech / Recherche"
  },
  {
    id: "SSO-33",
    symbol: "TM",
    name: "Tunis Business School Incubator",
    category: "Incubateur",
    description: "Incubateur de la Tunis Business School pour étudiants et alumni en management et entrepreneuriat.",
    services: ["Incubation business", "Mentorat", "Networking", "Pré-amorçage"],
    duration: "12 mois",
    location: "Tunis (TBS)",
    target_phase: "Étudiants / MBA"
  },
  {
    id: "SSO-34",
    symbol: "FK",
    name: "FabLab Kairouan",
    category: "FabLab",
    description: "FabLab régional de Kairouan, prototypage rapide et inclusion numérique au Centre.",
    services: ["Prototypage 3D", "Découpe laser", "Formation", "Inclusion numérique"],
    duration: "Flexible",
    location: "Kairouan",
    target_phase: "Idéation / Hardware"
  },
  {
    id: "SSO-35",
    symbol: "FG",
    name: "FabLab Gabès",
    category: "FabLab",
    description: "FabLab régional du Sud-Est, espace de prototypage et d'innovation pour le Sud tunisien.",
    services: ["Fabrication numérique", "Formation makers", "Workshops", "Networking"],
    duration: "Flexible",
    location: "Gabès",
    target_phase: "Idéation / Hardware"
  },

  // PEP - Pépinières Régionales Complémentaires
  {
    id: "PEP-06",
    symbol: "PG",
    name: "Pépinière de Gabès",
    category: "Pépinière",
    description: "Pépinière d'entreprises du Sud-Est, accompagnement des créateurs dans la région de Gabès.",
    services: ["Hébergement", "Accompagnement", "Formation", "Orientation financement"],
    duration: "12-24 mois",
    location: "Gabès",
    target_phase: "Création"
  },
  {
    id: "PEP-07",
    symbol: "PT",
    name: "Pépinière de Tataouine",
    category: "Pépinière",
    description: "Pépinière du Sud profond, soutien à la création d'entreprises dans le gouvernorat de Tataouine.",
    services: ["Hébergement", "Accompagnement", "Formation", "Inclusion économique"],
    duration: "12-24 mois",
    location: "Tataouine",
    target_phase: "Création / Régional"
  },
  {
    id: "PEP-08",
    symbol: "PZ",
    name: "Pépinière de Zaghouan",
    category: "Pépinière",
    description: "Pépinière régionale du gouvernorat de Zaghouan pour les créateurs locaux.",
    services: ["Hébergement", "Coaching", "Formation", "Networking régional"],
    duration: "12-24 mois",
    location: "Zaghouan",
    target_phase: "Création"
  },
  {
    id: "PEP-09",
    symbol: "PL",
    name: "Pépinière de Médenine",
    category: "Pépinière",
    description: "Pépinière du Sud-Est tunisien, accompagnement des projets dans la région de Médenine et Djerba.",
    services: ["Hébergement", "Accompagnement", "Formation", "Tourisme & artisanat"],
    duration: "12-24 mois",
    location: "Médenine",
    target_phase: "Création / Tourisme"
  },
  {
    id: "PEP-10",
    symbol: "PN",
    name: "Pépinière de Nabeul",
    category: "Pépinière",
    description: "Pépinière du Cap Bon, accompagnement des créateurs d'entreprises dans la région de Nabeul.",
    services: ["Hébergement", "Accompagnement", "Formation", "Mise en réseau"],
    duration: "12-24 mois",
    location: "Nabeul",
    target_phase: "Création"
  },
  {
    id: "PEP-11",
    symbol: "PB",
    name: "Pépinière de Béja",
    category: "Pépinière",
    description: "Pépinière du Nord-Ouest pour les créateurs d'entreprises et projets agricoles innovants.",
    services: ["Hébergement", "Accompagnement", "AgriBusiness", "Formation"],
    duration: "12-24 mois",
    location: "Béja",
    target_phase: "Création / AgriTech"
  },
  {
    id: "PEP-12",
    symbol: "PR",
    name: "Pépinière de Sidi Bouzid",
    category: "Pépinière",
    description: "Pépinière du Centre-Ouest, soutien aux créateurs et projets d'inclusion économique.",
    services: ["Hébergement", "Formation", "Coaching", "Inclusion"],
    duration: "12-24 mois",
    location: "Sidi Bouzid",
    target_phase: "Création / Inclusion"
  },
  {
    id: "PEP-13",
    symbol: "PA",
    name: "Pépinière de Kasserine",
    category: "Pépinière",
    description: "Pépinière du Centre-Ouest, soutien aux entrepreneurs et projets de développement local.",
    services: ["Hébergement", "Accompagnement", "Formation", "Développement local"],
    duration: "12-24 mois",
    location: "Kasserine",
    target_phase: "Création"
  },
  {
    id: "PEP-14",
    symbol: "PF",
    name: "Pépinière de Gafsa",
    category: "Pépinière",
    description: "Pépinière du Sud-Ouest, accompagnement des créateurs dans le bassin minier de Gafsa.",
    services: ["Hébergement", "Accompagnement", "Reconversion mineurs", "Formation"],
    duration: "12-24 mois",
    location: "Gafsa",
    target_phase: "Création / Reconversion"
  },

  // SSO - Acteurs ESS & Innovation Sociale Régionaux
  {
    id: "SSO-36",
    symbol: "IT",
    name: "IECD Tunisie",
    category: "Incubateur ESS",
    description: "Institut Européen de Coopération et Développement, programmes d'insertion par l'entrepreneuriat.",
    services: ["Insertion économique", "Formation", "Microfinance", "Accompagnement"],
    duration: "Variable",
    location: "Tunis / Régions",
    target_phase: "Inclusion / Micro-entreprise"
  },
  {
    id: "SSO-37",
    symbol: "EN",
    name: "Enda Tamweel",
    category: "Incubateur ESS",
    description: "Institution de microfinance leader en Tunisie, financement et accompagnement des micro-entrepreneurs.",
    services: ["Microcrédits", "Formation entrepreneuriale", "Accompagnement", "Réseau national"],
    duration: "Selon prêt",
    location: "National (90+ agences)",
    target_phase: "Micro-entreprises"
  },
  {
    id: "SSO-38",
    symbol: "TQ",
    name: "Taysir Microfinance",
    category: "Incubateur ESS",
    description: "Institution de microfinance accompagnant les TPE et porteurs de projets en Tunisie.",
    services: ["Microcrédits", "Accompagnement", "Formation gestion", "Réseau régional"],
    duration: "Selon contrat",
    location: "National",
    target_phase: "TPE / Micro"
  },
  {
    id: "SSO-39",
    symbol: "MT",
    name: "Microcred Tunisie",
    category: "Incubateur ESS",
    description: "Institution de microfinance internationale présente en Tunisie pour le financement des TPE.",
    services: ["Microcrédits", "Comptes épargne", "Formation", "Inclusion financière"],
    duration: "Selon contrat",
    location: "National",
    target_phase: "TPE / Inclusion"
  },
  {
    id: "SSO-40",
    symbol: "MB",
    name: "Mashrou3i (ONUDI)",
    category: "Programme",
    description: "Programme ONUDI-Italie d'appui à la création d'entreprises et à l'employabilité en Tunisie.",
    services: ["Formation entrepreneuriale", "Coaching", "Financement", "Soutien sectoriel"],
    duration: "Variable",
    location: "National (Régions)",
    target_phase: "Création / TPE"
  },
  {
    id: "SSO-41",
    symbol: "PA",
    name: "PAQ-Collabora",
    category: "Programme",
    description: "Programme d'appui à la qualité de l'enseignement supérieur, volet entrepreneuriat universitaire.",
    services: ["Entrepreneuriat universitaire", "Formation enseignants", "Bootcamps étudiants", "Innovation"],
    duration: "Programmes pluriannuels",
    location: "National (Universités)",
    target_phase: "Étudiants / Académique"
  },
  {
    id: "SSO-42",
    symbol: "JI",
    name: "JICA Tunisie",
    category: "Coopération Internationale",
    description: "Agence japonaise de coopération internationale avec programmes d'appui aux PME et startups tunisiennes.",
    services: ["Assistance technique", "Formation Japon", "Financement projets", "Partenariats"],
    duration: "Projets pluriannuels",
    location: "Tunis (National)",
    target_phase: "PME / Tous stades"
  },
  {
    id: "SSO-43",
    symbol: "BR",
    name: "BERD Tunisie",
    category: "Coopération Internationale",
    description: "Banque Européenne pour la Reconstruction et le Développement, financement et assistance aux PME.",
    services: ["Financement PME", "Conseil entreprises (ASB)", "Lignes de crédit", "Capital-risque"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "PME / Growth"
  },
  {
    id: "SSO-44",
    symbol: "SF",
    name: "SFI - IFC Tunisie",
    category: "Coopération Internationale",
    description: "Société Financière Internationale (Groupe Banque Mondiale), financement du secteur privé en Tunisie.",
    services: ["Investissement direct", "Conseil", "Mobilisation capitaux", "Assistance technique"],
    duration: "Long terme",
    location: "Tunis",
    target_phase: "PME / Growth"
  },
  {
    id: "SSO-45",
    symbol: "BA",
    name: "Banque Africaine de Développement",
    category: "Coopération Internationale",
    description: "BAD - Programmes de financement et d'appui au secteur privé tunisien et à l'innovation.",
    services: ["Financement projets", "Lignes de crédit", "Appui PME", "Programmes sectoriels"],
    duration: "Long terme",
    location: "Tunis (Siège régional)",
    target_phase: "PME / Infrastructure"
  },

  // CPT - Compétitions & Programmes Complémentaires
  {
    id: "CPT-11",
    symbol: "MI",
    name: "MIT Enterprise Forum Pan Arab",
    category: "Compétition",
    description: "Compétition régionale MIT Enterprise Forum pour startups innovantes du monde arabe avec finale internationale.",
    services: ["Mentorat MIT", "Prix régionaux", "Formation", "Réseau global"],
    duration: "6-9 mois",
    location: "Régional (MENA)",
    target_phase: "Tech / Innovation"
  },
  {
    id: "CPT-12",
    symbol: "WS",
    name: "Women Startup Challenge",
    category: "Compétition",
    description: "Compétition dédiée aux startups fondées ou co-fondées par des femmes en Tunisie.",
    services: ["Prix dédiés femmes", "Mentorat", "Visibilité", "Networking féminin"],
    duration: "3-4 mois",
    location: "National",
    target_phase: "Femmes entrepreneures"
  },
  {
    id: "CPT-13",
    symbol: "GE",
    name: "GEW Tunisia",
    category: "Programme Compétitif",
    description: "Global Entrepreneurship Week, semaine mondiale de l'entrepreneuriat avec événements en Tunisie.",
    services: ["Événements nationaux", "Workshops", "Pitch sessions", "Networking"],
    duration: "1 semaine annuelle",
    location: "National",
    target_phase: "Tous stades"
  },
  {
    id: "CPT-14",
    symbol: "AW",
    name: "AWS Activate",
    category: "Programme Compétitif",
    description: "Programme Amazon Web Services offrant crédits cloud et support technique aux startups.",
    services: ["AWS credits", "Support technique", "Formation cloud", "Réseau startups"],
    duration: "Selon plan",
    location: "Global",
    target_phase: "Tech / Cloud"
  },
  {
    id: "CPT-15",
    symbol: "NV",
    name: "NVIDIA Inception",
    category: "Programme Compétitif",
    description: "Programme NVIDIA dédié aux startups IA, deep learning et data science.",
    services: ["GPU credits", "Formation IA", "Mentorat tech", "Réseau global"],
    duration: "Selon stade",
    location: "Global",
    target_phase: "AI / DeepTech"
  },

  // COW - Coworking & Hubs Régionaux
  {
    id: "COW-08",
    symbol: "WK",
    name: "WeStart Sfax",
    category: "Coworking",
    description: "Espace de coworking et hub entrepreneurial à Sfax, communauté tech du Sud.",
    services: ["Coworking", "Événements tech", "Formations", "Networking"],
    duration: "Flexible",
    location: "Sfax",
    target_phase: "Tech / Régional"
  },
  {
    id: "COW-09",
    symbol: "MK",
    name: "MakerLab Sousse",
    category: "FabLab",
    description: "Espace maker et FabLab dans la région du Sahel, prototypage et fabrication numérique.",
    services: ["Prototypage", "Workshops", "Formation makers", "Coworking"],
    duration: "Flexible",
    location: "Sousse",
    target_phase: "Hardware / Maker"
  },
  {
    id: "COW-10",
    symbol: "HJ",
    name: "Hub Djerba",
    category: "Hub",
    description: "Hub d'innovation à Djerba pour les nomades digitaux, entrepreneurs et créateurs locaux.",
    services: ["Coworking", "Tourism tech", "Networking", "Événements"],
    duration: "Flexible",
    location: "Djerba",
    target_phase: "Nomades / Tourisme"
  },
  {
    id: "COW-11",
    symbol: "KH",
    name: "Kairouan Hub",
    category: "Hub",
    description: "Hub entrepreneurial du Centre tunisien, soutien aux jeunes créateurs de Kairouan.",
    services: ["Coworking", "Formation", "Mentorat", "Événements"],
    duration: "Flexible",
    location: "Kairouan",
    target_phase: "Régional / Jeunes"
  },
];

const categoryColors: Record<string, string> = {
  // Gouvernement & Public
  "Programme National": "bg-gradient-to-br from-red-600 to-rose-700",
  "Entité Publique": "bg-gradient-to-br from-amber-500 to-orange-600",
  "Fonds d'Investissement Public": "bg-gradient-to-br from-yellow-500 to-amber-600",
  "Établissement Public": "bg-gradient-to-br from-lime-500 to-green-600",
  "Ministère": "bg-gradient-to-br from-red-700 to-rose-800",
  "Banque Publique": "bg-gradient-to-br from-orange-500 to-amber-600",
  
  // Fonds & Formation
  "Fonds National": "bg-gradient-to-br from-purple-500 to-violet-600",
  "Programme de Formation": "bg-gradient-to-br from-indigo-500 to-blue-600",
  "Programme Formation": "bg-gradient-to-br from-indigo-500 to-blue-600",
  "Programme": "bg-gradient-to-br from-violet-500 to-purple-600",
  
  // Technopoles
  "Technopole": "bg-gradient-to-br from-teal-500 to-cyan-600",
  "Pôle Régional": "bg-gradient-to-br from-emerald-500 to-teal-600",
  
  // Incubateurs & Accélérateurs
  "Incubateur": "bg-gradient-to-br from-blue-500 to-indigo-600",
  "Accélérateur": "bg-gradient-to-br from-rose-500 to-pink-600",
  "Pré-Accélérateur": "bg-gradient-to-br from-pink-400 to-rose-500",
  "Incubateur ESS": "bg-gradient-to-br from-green-500 to-emerald-600",
  
  // Studios & Factories
  "Startup Studio": "bg-gradient-to-br from-violet-500 to-purple-700",
  "Startup Factory": "bg-gradient-to-br from-fuchsia-500 to-pink-700",
  
  // Pépinières
  "Pépinière": "bg-gradient-to-br from-lime-400 to-green-600",
  
  // Business Angels & Investissement
  "Business Angels": "bg-gradient-to-br from-amber-400 to-yellow-600",
  "Réseau Mentorat": "bg-gradient-to-br from-sky-400 to-blue-600",
  
  // Fondations & ONG
  "Fondation": "bg-gradient-to-br from-orange-500 to-red-600",
  
  // Espaces
  "Coworking": "bg-gradient-to-br from-sky-400 to-cyan-500",
  "Hub": "bg-gradient-to-br from-violet-400 to-purple-500",
  "FabLab": "bg-gradient-to-br from-yellow-400 to-amber-600",
  
  // Coopération Internationale
  "Coopération Internationale": "bg-gradient-to-br from-blue-600 to-indigo-700",
  
  // Compétitions
  "Compétition": "bg-gradient-to-br from-amber-500 to-orange-600",
  "Programme Compétitif": "bg-gradient-to-br from-rose-500 to-red-600",
};

const categoryGroups = [
  { 
    name: "Gouvernement & Public", 
    icon: Building2,
    color: "border-red-500",
    categories: ["Programme National", "Entité Publique", "Fonds d'Investissement Public", "Établissement Public", "Ministère", "Banque Publique"] 
  },
  { 
    name: "Fonds & Formation", 
    icon: Target,
    color: "border-purple-500",
    categories: ["Fonds National", "Programme de Formation", "Programme Formation", "Programme"] 
  },
  { 
    name: "Technopoles", 
    icon: Factory,
    color: "border-teal-500",
    categories: ["Technopole", "Pôle Régional"] 
  },
  { 
    name: "Incubateurs & Accélérateurs", 
    icon: Sprout,
    color: "border-blue-500",
    categories: ["Incubateur", "Accélérateur", "Pré-Accélérateur", "Incubateur ESS"] 
  },
  { 
    name: "Studios & Factories", 
    icon: Factory,
    color: "border-violet-500",
    categories: ["Startup Studio", "Startup Factory"] 
  },
  { 
    name: "Pépinières", 
    icon: Sprout,
    color: "border-lime-500",
    categories: ["Pépinière"] 
  },
  { 
    name: "Investisseurs & Mentorat", 
    icon: Handshake,
    color: "border-amber-500",
    categories: ["Business Angels", "Réseau Mentorat", "Fondation"] 
  },
  { 
    name: "Coopération Internationale", 
    icon: Globe,
    color: "border-indigo-500",
    categories: ["Coopération Internationale"] 
  },
  { 
    name: "Compétitions & Concours", 
    icon: Trophy,
    color: "border-orange-500",
    categories: ["Compétition", "Programme Compétitif"] 
  },
  { 
    name: "Espaces & Hubs", 
    icon: Building2,
    color: "border-cyan-500",
    categories: ["Coworking", "Hub", "FabLab"] 
  },
];

const PeriodicTableStartups = () => {
  const [selectedElement, setSelectedElement] = useState<EcosystemElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredElements = useMemo(() => {
    return ecosystemElements.filter(element => {
      const matchesSearch = searchQuery === "" || 
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || element.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [...new Set(ecosystemElements.map(e => e.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, catégorie, localisation, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            <Filter className="h-3 w-3 mr-1" />
            Tous ({ecosystemElements.length})
          </Badge>
        </div>
      </div>

      {/* Category Groups Legend - Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categoryGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.name} className={`border-2 ${group.color} hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm`}>
              <CardContent className="p-4">
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {group.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.categories.filter(cat => categories.includes(cat)).map((category) => {
                    const count = ecosystemElements.filter(e => e.category === category).length;
                    return (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`cursor-pointer text-[10px] transition-all hover:scale-105 ${
                          selectedCategory === category 
                            ? `${categoryColors[category]} text-white border-0 shadow-md` 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {category.replace("/", " ")} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        {filteredElements.length} acteur{filteredElements.length > 1 ? 's' : ''} trouvé{filteredElements.length > 1 ? 's' : ''}
        {selectedCategory && (
          <Badge variant="secondary" className="ml-2">
            {selectedCategory}
            <button onClick={() => setSelectedCategory(null)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>

      {/* Periodic Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        <AnimatePresence>
          {filteredElements.map((element, index) => (
            <motion.div
              key={element.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => setSelectedElement(element)}
              className="cursor-pointer"
            >
              <Card className={`${categoryColors[element.category] || 'bg-gradient-to-br from-gray-400 to-gray-600'} text-white border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden h-full`}>
                <CardContent className="p-3 text-center relative">
                  <span className="absolute top-1 left-2 text-[10px] opacity-70">{element.id.split('-')[0]}</span>
                  <div className="text-2xl font-bold mb-1">{element.symbol}</div>
                  <div className="text-xs font-medium truncate">{element.name}</div>
                  <div className="text-[9px] opacity-75 truncate mt-1">
                    <MapPin className="h-2 w-2 inline mr-0.5" />
                    {element.location.split('(')[0].trim()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No results */}
      {filteredElements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun acteur trouvé pour cette recherche.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
            className="text-primary hover:underline mt-2"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Selected Element Detail */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <Card className={`${categoryColors[selectedElement.category] || 'bg-gradient-to-br from-gray-400 to-gray-600'} text-white border-0 shadow-2xl`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6 flex-wrap lg:flex-nowrap">
                    <div className="text-center min-w-[100px]">
                      <div className="text-5xl font-bold">{selectedElement.symbol}</div>
                      <div className="text-sm opacity-75 mt-1">{selectedElement.id}</div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{selectedElement.name}</h3>
                        <Badge className="mt-2 bg-white/20 text-white border-0">
                          {selectedElement.category}
                        </Badge>
                      </div>

                      <p className="text-sm opacity-90">{selectedElement.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 opacity-75 flex-shrink-0" />
                          <div>
                            <div className="text-xs opacity-75">Localisation</div>
                            <div className="text-sm font-medium">{selectedElement.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5 opacity-75 flex-shrink-0" />
                          <div>
                            <div className="text-xs opacity-75">Durée</div>
                            <div className="text-sm font-medium">{selectedElement.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 mt-0.5 opacity-75 flex-shrink-0" />
                          <div>
                            <div className="text-xs opacity-75">Phase cible</div>
                            <div className="text-sm font-medium">{selectedElement.target_phase}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <Wrench className="h-4 w-4 mt-0.5 opacity-75 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs opacity-75 mb-2">Services</div>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedElement.services.map((service, idx) => (
                                <Badge key={idx} className="bg-white/20 text-white border-0 text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/20 text-center">
                    <button
                      onClick={() => setSelectedElement(null)}
                      className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeriodicTableStartups;
