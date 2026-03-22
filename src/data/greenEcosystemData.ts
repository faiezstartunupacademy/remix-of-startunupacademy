// Green Ecosystem Data - Acteurs de l'entrepreneuriat vert en Tunisie
// Source de référence : https://greengate.tn/ - Plateforme GreenGate
import { Leaf, Zap, Recycle, Tractor, Palmtree, Building2, Landmark, GraduationCap, Banknote, Factory, FlaskConical, Globe, Handshake } from "lucide-react";

export interface GreenPartner {
  name: string;
  logo?: string;
  url: string;
  description: string;
}

export const greenGateInfo = {
  name: "GreenGate",
  url: "https://greengate.tn/",
  description: "Plateforme digitale qui centralise les acteurs de l'entrepreneuriat vert en Tunisie. Elle renforce la visibilité, la connaissance et les synergies au sein de l'écosystème, en offrant une cartographie interactive des structures, entreprises et initiatives engagées dans la transition écologique.",
  mission: "Renforcer la visibilité et les synergies de l'écosystème entrepreneurial vert tunisien",
};

export const greenPartners: GreenPartner[] = [
  { name: "Union Européenne", url: "https://european-union.europa.eu/index_fr", description: "Partenaire institutionnel majeur du programme Tunisie Verte" },
  { name: "Tunisie Verte et Durable", url: "https://tunisie-verte-durable.org/", description: "Programme national pour la transition écologique" },
  { name: "Expertise France", url: "https://www.expertisefrance.fr/fr", description: "Agence publique française de coopération technique internationale" },
  { name: "CITET", url: "http://www.citet.nat.tn/", description: "Centre International des Technologies de l'Environnement de Tunis" },
  { name: "Ministère de l'Économie et de la Planification", url: "https://www.mdici.gov.tn/", description: "Tutelle gouvernementale planification économique" },
  { name: "Ministère de l'Environnement", url: "https://www.environnement.gov.tn/", description: "Tutelle gouvernementale environnement" },
];

export interface GreenActor {
  id: string;
  symbol: string;
  name: string;
  category: string;
  sector: string;
  description: string;
  activities: string[];
  location: string;
  type: "startup" | "public" | "enterprise" | "support" | "finance" | "expert";
}

export const greenCategories = [
  { id: "startups", name: "Startups GreenTech", icon: Leaf, color: "bg-emerald-500", description: "Innovation & disruption verte" },
  { id: "public", name: "Structures Publiques", icon: Landmark, color: "bg-blue-600", description: "Régulation & soutien étatique" },
  { id: "enterprise", name: "Grandes Entreprises", icon: Factory, color: "bg-slate-600", description: "Acteurs industriels engagés" },
  { id: "support", name: "Accompagnement", icon: GraduationCap, color: "bg-amber-500", description: "Support à l'entrepreneuriat vert" },
  { id: "finance", name: "Financement", icon: Banknote, color: "bg-purple-500", description: "Banques & fonds verts" },
  { id: "expert", name: "Experts & R&D", icon: FlaskConical, color: "bg-rose-500", description: "Savoir-faire technique" },
];

export const greenActors: GreenActor[] = [
  // STARTUPS - Énergie
  {
    id: "ST-01",
    symbol: "Wn",
    name: "Wattnow",
    category: "Startups GreenTech",
    sector: "Énergie",
    description: "Solution IoT pour le monitoring et l'optimisation de la consommation électrique en temps réel pour les entreprises.",
    activities: ["Monitoring énergie", "IoT industriel", "Optimisation consommation", "Analytics temps réel"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-02",
    symbol: "Bk",
    name: "Bako Motors",
    category: "Startups GreenTech",
    sector: "Énergie",
    description: "Conception et fabrication de véhicules électriques (triporteurs) fonctionnant à l'énergie solaire pour la logistique du dernier kilomètre.",
    activities: ["Véhicules électriques", "Énergie solaire", "Logistique verte", "Mobilité durable"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-03",
    symbol: "Sp",
    name: "Saphon Energy",
    category: "Startups GreenTech",
    sector: "Énergie",
    description: "Innovation dans l'éolien 'sans pales' (Zero-Blade Technology), inspiré par la nature (biomimétisme).",
    activities: ["Éolien innovant", "Biomimétisme", "R&D énergies", "Brevets technologiques"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-04",
    symbol: "Ay",
    name: "Ayer",
    category: "Startups GreenTech",
    sector: "Énergie",
    description: "Solutions basées sur l'intelligence artificielle pour l'optimisation énergétique.",
    activities: ["IA énergétique", "Optimisation", "Prédiction consommation", "Smart grid"],
    location: "Tunis",
    type: "startup"
  },
  
  // STARTUPS - Économie Circulaire
  {
    id: "ST-05",
    symbol: "Bb",
    name: "Barbecha",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Application mobile connectant les chiffonniers (Barbechas) aux particuliers pour optimiser la collecte des déchets.",
    activities: ["Collecte déchets", "Économie informelle", "App mobile", "Recyclage"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-06",
    symbol: "Sl",
    name: "Split",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Application de covoiturage urbain pour réduire l'empreinte carbone et les embouteillages.",
    activities: ["Covoiturage", "Mobilité partagée", "Réduction CO2", "Transport urbain"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-07",
    symbol: "Db",
    name: "Dabchy",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Marketplace de mode de seconde main (vide-dressing) favorisant la réutilisation des vêtements.",
    activities: ["Seconde main", "Mode durable", "Marketplace", "Économie circulaire"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-08",
    symbol: "Md",
    name: "Moodha",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Plateforme dédiée à la mode éthique et durable, valorisant l'artisanat et les matériaux écologiques.",
    activities: ["Mode éthique", "Artisanat local", "Matériaux éco", "Slow fashion"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-09",
    symbol: "Cl",
    name: "Colibris",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Collecte sélective des déchets ménagers et de bureaux avec un service de logistique optimisé.",
    activities: ["Tri sélectif", "Collecte entreprises", "Logistique déchets", "Sensibilisation"],
    location: "Tunis",
    type: "startup"
  },
  
  // STARTUPS - AgriTech
  {
    id: "ST-10",
    symbol: "Sx",
    name: "Seabex",
    category: "Startups GreenTech",
    sector: "AgriTech",
    description: "Plateforme d'agriculture de précision utilisant l'IA et des capteurs pour optimiser l'irrigation (économie d'eau).",
    activities: ["Agriculture de précision", "IoT agricole", "Économie d'eau", "IA prédictive"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-11",
    symbol: "Ea",
    name: "Eagri",
    category: "Startups GreenTech",
    sector: "AgriTech",
    description: "Solutions numériques pour la gestion agricole et l'accès aux marchés pour les agriculteurs.",
    activities: ["Digitalisation agricole", "Accès marchés", "Gestion exploitation", "Conseil agricole"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-12",
    symbol: "Rc",
    name: "RoboCare",
    category: "Startups GreenTech",
    sector: "AgriTech",
    description: "Utilisation de drones et de satellites pour surveiller les cultures et détecter les maladies des plantes précocement.",
    activities: ["Drones agricoles", "Imagerie satellite", "Détection maladies", "Agriculture de précision"],
    location: "Tunis",
    type: "startup"
  },
  
  // STARTUPS - Écotourisme
  {
    id: "ST-13",
    symbol: "Wy",
    name: "WildyNess",
    category: "Startups GreenTech",
    sector: "Écotourisme",
    description: "Plateforme de réservation d'expériences de voyage authentiques et écologiques en Tunisie.",
    activities: ["Écotourisme", "Expériences locales", "Tourisme durable", "Réservation en ligne"],
    location: "Tunis",
    type: "startup"
  },
  
  // STARTUPS - Eau
  {
    id: "ST-14",
    symbol: "Km",
    name: "Kumulus",
    category: "Startups GreenTech",
    sector: "Eau",
    description: "Générateurs d'eau potable à partir de l'air, innovation technologique pour les zones arides.",
    activities: ["Production d'eau", "Innovation climatique", "Zones arides", "Technologie propre"],
    location: "Tunis",
    type: "startup"
  },
  
  // STRUCTURES PUBLIQUES
  {
    id: "PU-01",
    symbol: "AM",
    name: "ANME",
    category: "Structures Publiques",
    sector: "Énergie",
    description: "Agence Nationale pour la Maîtrise de l'Énergie - Pilotage de la politique énergétique nationale.",
    activities: ["Politique énergétique", "Subventions solaire", "Audit énergétique", "Efficacité énergétique"],
    location: "Tunis",
    type: "public"
  },
  {
    id: "PU-02",
    symbol: "AG",
    name: "ANGed",
    category: "Structures Publiques",
    sector: "Déchets",
    description: "Agence Nationale de Gestion des Déchets - Gestion des décharges et promotion du recyclage.",
    activities: ["Gestion décharges", "Régulation déchets", "Promotion recyclage", "Filières REP"],
    location: "Tunis",
    type: "public"
  },
  {
    id: "PU-03",
    symbol: "AP",
    name: "ANPE",
    category: "Structures Publiques",
    sector: "Environnement",
    description: "Agence Nationale de Protection de l'Environnement - Contrôle pollution et études d'impact.",
    activities: ["Contrôle pollution", "Études d'impact", "Éducation environnement", "Conformité réglementaire"],
    location: "Tunis",
    type: "public"
  },
  {
    id: "PU-04",
    symbol: "AL",
    name: "APAL",
    category: "Structures Publiques",
    sector: "Littoral",
    description: "Agence de Protection et d'Aménagement du Littoral - Protection des zones côtières.",
    activities: ["Protection côtière", "Lutte érosion", "Aménagement littoral", "Urbanisme durable"],
    location: "Tunis",
    type: "public"
  },
  {
    id: "PU-05",
    symbol: "AI",
    name: "APIA",
    category: "Structures Publiques",
    sector: "Agriculture",
    description: "Agence de Promotion des Investissements Agricoles - Avantages pour l'agriculture durable.",
    activities: ["Financement agricole", "Avantages fiscaux", "Projets durables", "Accompagnement"],
    location: "Tunis",
    type: "public"
  },
  {
    id: "PU-06",
    symbol: "CD",
    name: "CDC",
    category: "Structures Publiques",
    sector: "Finance",
    description: "Caisse des Dépôts et Consignations - Investisseur long terme dans les projets verts.",
    activities: ["Investissement LT", "Fonds verts", "Infrastructures", "Co-investissement"],
    location: "Tunis",
    type: "public"
  },
  
  // GRANDES ENTREPRISES
  {
    id: "EN-01",
    symbol: "Va",
    name: "Valeo",
    category: "Grandes Entreprises",
    sector: "Automobile",
    description: "Centre de R&D et production de composants pour l'électrification des véhicules.",
    activities: ["Électrification véhicules", "R&D mobilité", "Composants EV", "Réduction émissions"],
    location: "Tunis",
    type: "enterprise"
  },
  {
    id: "EN-02",
    symbol: "Cf",
    name: "Coficab",
    category: "Grandes Entreprises",
    sector: "Câblage",
    description: "Leader mondial du câble automobile, engagé dans la production de câbles pour véhicules électriques.",
    activities: ["Câbles EV", "E-mobility", "Innovation matériaux", "Production verte"],
    location: "Tunis",
    type: "enterprise"
  },
  {
    id: "EN-03",
    symbol: "Ot",
    name: "OneTech",
    category: "Grandes Entreprises",
    sector: "Industrie",
    description: "Groupe industriel diversifié investissant dans l'efficacité énergétique industrielle.",
    activities: ["Mécatronique", "Efficacité énergétique", "Innovation industrielle", "Câblage"],
    location: "Tunis",
    type: "enterprise"
  },
  {
    id: "EN-04",
    symbol: "Dl",
    name: "Délice",
    category: "Grandes Entreprises",
    sector: "Agroalimentaire",
    description: "Gestion optimisée des ressources en eau et énergie dans ses usines laitières.",
    activities: ["Épuration eaux", "Cogénération", "Économie ressources", "Production durable"],
    location: "Tunis",
    type: "enterprise"
  },
  {
    id: "EN-05",
    symbol: "As",
    name: "Assad",
    category: "Grandes Entreprises",
    sector: "Batteries",
    description: "Fabrication et recyclage de batteries, développement de solutions de stockage d'énergie.",
    activities: ["Batteries", "Recyclage", "Stockage énergie", "Économie circulaire"],
    location: "Tunis",
    type: "enterprise"
  },
  {
    id: "EN-06",
    symbol: "De",
    name: "Deloitte / EY",
    category: "Grandes Entreprises",
    sector: "Conseil",
    description: "Accompagnement des entreprises dans leur stratégie ESG et audit vert.",
    activities: ["Conseil ESG", "Audit vert", "Stratégie durabilité", "Reporting extra-financier"],
    location: "Tunis",
    type: "enterprise"
  },
  
  // STRUCTURES D'ACCOMPAGNEMENT
  {
    id: "AC-01",
    symbol: "F6",
    name: "Flat6Labs",
    category: "Accompagnement",
    sector: "Accélérateur",
    description: "Accélérateur & VC avec programme de financement et mentorat pour startups innovantes.",
    activities: ["Accélération", "Financement seed", "Mentorat", "Demo Day"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-02",
    symbol: "IP",
    name: "Impact Partner",
    category: "Accompagnement",
    sector: "Impact",
    description: "Accompagnement spécialisé pour les entrepreneurs à fort impact social et environnemental.",
    activities: ["Accompagnement impact", "Financement social", "Mentorat Yunus", "Mesure d'impact"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-03",
    symbol: "LE",
    name: "Lab'ess",
    category: "Accompagnement",
    sector: "ESS",
    description: "Incubateur dédié à l'Économie Sociale et Solidaire, soutenant les projets verts/citoyens.",
    activities: ["Incubation ESS", "Prêt d'honneur", "Formation impact", "Communauté"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-04",
    symbol: "RS",
    name: "RedStart Tunisie",
    category: "Accompagnement",
    sector: "Accélérateur",
    description: "Accompagnement des PME et startups à fort potentiel de croissance.",
    activities: ["Accélération PME", "Conseil stratégique", "Ouverture marchés", "Financement"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-05",
    symbol: "OS",
    name: "Open Startup (OST)",
    category: "Accompagnement",
    sector: "Programme",
    description: "Programmes de pré-incubation et d'éducation entrepreneuriale liés aux ODD.",
    activities: ["Pré-incubation", "Formation ODD", "Open innovation", "Networking"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-06",
    symbol: "CN",
    name: "CONECT",
    category: "Accompagnement",
    sector: "Syndicat",
    description: "Organisation patronale avec composante RSE et 'Green', défendant les PME vertes.",
    activities: ["Représentation PME", "RSE", "Plaidoyer vert", "Networking"],
    location: "Tunis",
    type: "support"
  },
  
  // FINANCEMENT
  {
    id: "FI-01",
    symbol: "BH",
    name: "BH Bank",
    category: "Financement",
    sector: "Banque",
    description: "Financement de l'efficacité énergétique des bâtiments (Crédits Éco-Habitat).",
    activities: ["Crédit éco-habitat", "Financement immobilier vert", "Efficacité bâtiments", "Prêts verts"],
    location: "Tunis",
    type: "finance"
  },
  {
    id: "FI-02",
    symbol: "AB",
    name: "Amen Bank",
    category: "Financement",
    sector: "Banque",
    description: "Lignes de crédit dédiées aux investissements verts et partenariats internationaux.",
    activities: ["Lignes vertes", "Partenariats internationaux", "Crédit environnemental", "PME vertes"],
    location: "Tunis",
    type: "finance"
  },
  {
    id: "FI-03",
    symbol: "BN",
    name: "BNA",
    category: "Financement",
    sector: "Banque",
    description: "Banque Nationale Agricole - Acteur clé pour le financement de l'agriculture durable.",
    activities: ["Agriculture durable", "Agro-industrie", "Financement rural", "Projets verts agricoles"],
    location: "Tunis",
    type: "finance"
  },
  {
    id: "FI-04",
    symbol: "BP",
    name: "Bank ABC / UIB / ATB",
    category: "Financement",
    sector: "Banques Privées",
    description: "Offres de 'Green Loans' (prêts verts) et financement de projets RSE pour les entreprises.",
    activities: ["Green loans", "Financement RSE", "Projets durables", "Accompagnement entreprises"],
    location: "Tunis",
    type: "finance"
  },
  {
    id: "FI-05",
    symbol: "ET",
    name: "Enda Tamweel",
    category: "Financement",
    sector: "Microfinance",
    description: "Micro-crédits pour les petits agriculteurs ou petits projets écologiques.",
    activities: ["Microcrédits", "Chauffe-eau solaire", "Petits projets", "Inclusion financière"],
    location: "Tunis",
    type: "finance"
  },
  
  // EXPERTS & R&D
  {
    id: "EX-01",
    symbol: "CR",
    name: "CRTEn",
    category: "Experts & R&D",
    sector: "Recherche",
    description: "Centre de Recherche spécialisé dans les technologies de l'énergie (thermique, photovoltaïque).",
    activities: ["R&D énergie", "Thermique solaire", "Photovoltaïque", "Formation chercheurs"],
    location: "Borj Cédria",
    type: "expert"
  },
  {
    id: "EX-02",
    symbol: "CT",
    name: "CITET",
    category: "Experts & R&D",
    sector: "Centre Technique",
    description: "Centre International des Technologies de l'Environnement de Tunis - Partenaire clé de GreenGate. Transfert de technologies environnementales, formation et assistance technique ISO 14001.",
    activities: ["Transfert techno", "Formation environnement", "ISO 14001", "Assistance technique", "Partenaire GreenGate"],
    location: "Tunis",
    type: "expert"
  },
  {
    id: "EX-03",
    symbol: "SC",
    name: "SCET Tunisie",
    category: "Experts & R&D",
    sector: "Bureau d'études",
    description: "Grand bureau d'ingénierie réalisant des études d'impact et des projets d'infrastructures durables.",
    activities: ["Études d'impact", "Ouvrages hydrauliques", "Infrastructures durables", "Ingénierie conseil"],
    location: "Tunis",
    type: "expert"
  },
  {
    id: "EX-04",
    symbol: "CX",
    name: "CETTEX",
    category: "Experts & R&D",
    sector: "Centre Technique",
    description: "Centre Technique du Textile, accompagnant le secteur vers le 'Textile Vert'.",
    activities: ["Textile vert", "Gestion chimiques", "Éco-conception", "Formation industrie"],
    location: "Tunis",
    type: "expert"
  },

  // NOUVEAUX ACTEURS (via GreenGate)
  {
    id: "ST-15",
    symbol: "Em",
    name: "Embalini",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Startup spécialisée dans les emballages écologiques et biodégradables, alternative aux plastiques à usage unique.",
    activities: ["Emballages éco", "Biodégradable", "Réduction plastique", "B2B vert"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "ST-16",
    symbol: "Hm",
    name: "Homrane Sustainable Living",
    category: "Startups GreenTech",
    sector: "Économie Circulaire",
    description: "Solutions de vie durable et consommation responsable pour les ménages tunisiens.",
    activities: ["Mode de vie durable", "Consommation responsable", "Produits écologiques", "Sensibilisation"],
    location: "Tunis",
    type: "startup"
  },
  {
    id: "AC-07",
    symbol: "GG",
    name: "GreenGate",
    category: "Accompagnement",
    sector: "Plateforme",
    description: "Plateforme digitale centralisant les acteurs de l'entrepreneuriat vert en Tunisie. Cartographie interactive, événements, podcasts et mise en réseau.",
    activities: ["Cartographie acteurs", "Mise en réseau", "Événements green", "Podcasts", "Appels à candidatures"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-08",
    symbol: "TV",
    name: "Tunisie Verte et Durable",
    category: "Accompagnement",
    sector: "Programme",
    description: "Programme national soutenu par l'UE et Expertise France pour la transition écologique en Tunisie.",
    activities: ["Transition écologique", "Financement UE", "Accompagnement projets", "Politique environnementale"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "AC-09",
    symbol: "EF",
    name: "Expertise France",
    category: "Accompagnement",
    sector: "Coopération",
    description: "Agence publique française de coopération technique, partenaire clé des programmes verts en Tunisie.",
    activities: ["Coopération technique", "Renforcement capacités", "Projets climat", "Assistance technique"],
    location: "Tunis",
    type: "support"
  },
  {
    id: "PU-07",
    symbol: "PS",
    name: "PSSEETAT",
    category: "Structures Publiques",
    sector: "Agriculture",
    description: "Projet financé par le Canada (Affaires mondiales) via UPA DI, en partenariat avec UTAP et UMNAGRI, soutenant la résilience climatique des femmes transformatrices agroalimentaires.",
    activities: ["Résilience climatique", "Femmes transformatrices", "Souveraineté alimentaire", "Coopération Canada"],
    location: "Tunis",
    type: "public"
  },
];

export const greenSectors = [
  { name: "Énergie", count: 4, color: "bg-yellow-500", icon: Zap },
  { name: "Économie Circulaire", count: 7, color: "bg-emerald-500", icon: Recycle },
  { name: "AgriTech", count: 3, color: "bg-green-600", icon: Tractor },
  { name: "Écotourisme", count: 1, color: "bg-cyan-500", icon: Palmtree },
  { name: "Eau", count: 1, color: "bg-blue-500", icon: Leaf },
];
