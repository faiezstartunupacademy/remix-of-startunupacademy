import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  FileText, 
  Shield, 
  Wallet, 
  Plane, 
  Clock, 
  Building2, 
  Award,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Globe,
  Layers,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Info,
  Search,
  X,
  Filter,
  MapPin,
  ExternalLink,
  Building,
  Landmark,
  GraduationCap,
  Handshake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Startup Act Periodic Table Elements
const startupActElements = [
  // Avantages Fiscaux
  {
    symbol: 'EX8',
    name: 'Exonération IS',
    category: 'fiscal',
    description: "Exonération totale de l'impôt sur les sociétés pendant 8 ans",
    details: "Les startups labellisées bénéficient d'une exonération complète de l'IS durant les 8 premières années d'activité.",
    icon: DollarSign
  },
  {
    symbol: 'EXI',
    name: 'Exonération IRPP',
    category: 'fiscal',
    description: "Exonération de l'IRPP pour les fondateurs",
    details: "Les revenus et dividendes des fondateurs sont exonérés d'IRPP pendant la période de labellisation.",
    icon: DollarSign
  },
  {
    symbol: 'TVA',
    name: 'Suspension TVA',
    category: 'fiscal',
    description: "Suspension de la TVA à l'importation",
    details: "Suspension de TVA sur l'importation d'équipements, matériels et services nécessaires.",
    icon: DollarSign
  },
  {
    symbol: 'CGI',
    name: 'Exonération CGI',
    category: 'fiscal',
    description: 'Exonération des plus-values',
    details: "Exonération de l'impôt sur les plus-values lors de la cession de parts pour les investisseurs.",
    icon: TrendingUp
  },
  // Financement
  {
    symbol: 'FIN',
    name: "Fonds d'Amorçage",
    category: 'financement',
    description: "Accès aux fonds d'amorçage publics",
    details: "Financement par des fonds publics dédiés aux startups en phase de démarrage (jusqu'à 200 000 TND).",
    icon: TrendingUp
  },
  {
    symbol: 'INV',
    name: 'Incitations Investisseurs',
    category: 'financement',
    description: 'Avantages pour les investisseurs',
    details: "Les investisseurs bénéficient d'une déduction fiscale de 35% du montant investi.",
    icon: TrendingUp
  },
  {
    symbol: 'CRD',
    name: 'Crédit Participatif',
    category: 'financement',
    description: 'Accès au financement participatif',
    details: "Possibilité de lever des fonds via des plateformes de crowdfunding réglementées.",
    icon: Users
  },
  {
    symbol: 'BSA',
    name: 'Bons de Souscription',
    category: 'financement',
    description: 'Émission de BSA simplifiée',
    details: "Mécanisme simplifié pour émettre des bons de souscription d'actions pour les investisseurs.",
    icon: Award
  },
  // Ressources Humaines
  {
    symbol: 'VIS',
    name: 'Visa Startup',
    category: 'rh',
    description: 'Facilitation des visas',
    details: "Procédure accélérée pour l'obtention de visas et permis de travail pour les talents étrangers.",
    icon: Globe
  },
  {
    symbol: 'SOC',
    name: 'Charges Sociales',
    category: 'rh',
    description: 'Réduction des charges',
    details: "Prise en charge partielle des charges sociales par l'État pendant 3 ans.",
    icon: Users
  },
  {
    symbol: 'STG',
    name: 'Stagiaires',
    category: 'rh',
    description: 'Programme de stage',
    details: "Facilités pour l'embauche de stagiaires avec prise en charge partielle des indemnités.",
    icon: Users
  },
  {
    symbol: 'TLT',
    name: 'Talents',
    category: 'rh',
    description: 'Attraction des talents',
    details: "Dispositifs pour attirer et retenir les meilleurs talents nationaux et internationaux.",
    icon: Award
  },
  // Administration
  {
    symbol: 'CRE',
    name: 'Création Rapide',
    category: 'admin',
    description: 'Constitution en 48h',
    details: "Procédure simplifiée permettant de créer une startup en ligne en 48h maximum.",
    icon: Briefcase
  },
  {
    symbol: 'LAB',
    name: 'Label Startup',
    category: 'admin',
    description: 'Obtention du label',
    details: "Label délivré par un comité permettant d'accéder à tous les avantages du Startup Act.",
    icon: Award
  },
  {
    symbol: 'GUC',
    name: 'Guichet Unique',
    category: 'admin',
    description: 'Guichet unique digital',
    details: "Plateforme centralisée pour toutes les démarches administratives des startups.",
    icon: Building
  },
  {
    symbol: 'FLE',
    name: 'Flexibilité',
    category: 'admin',
    description: 'Cadre juridique flexible',
    details: "Réglementation adaptée permettant plus de flexibilité dans la gestion de la startup.",
    icon: Building
  },
  // Accompagnement
  {
    symbol: 'INC',
    name: 'Incubateurs',
    category: 'accompagnement',
    description: 'Accès aux incubateurs',
    details: "Réseau d'incubateurs publics et privés offrant mentorat et ressources.",
    icon: Building
  },
  {
    symbol: 'FOR',
    name: 'Formation',
    category: 'accompagnement',
    description: 'Programmes de formation',
    details: "Formations spécialisées en entrepreneuriat, gestion et développement.",
    icon: Users
  },
  {
    symbol: 'NET',
    name: 'Networking',
    category: 'accompagnement',
    description: "Réseau d'entrepreneurs",
    details: "Accès à une communauté active d'entrepreneurs et d'événements sectoriels.",
    icon: Globe
  },
  {
    symbol: 'EXP',
    name: 'Export',
    category: 'accompagnement',
    description: "Aide à l'export",
    details: "Support pour l'internationalisation et l'accès aux marchés étrangers.",
    icon: Globe
  }
];

const startupActCategories: Record<string, { name: string; color: string; bgColor: string }> = {
  fiscal: { name: 'Avantages Fiscaux', color: 'bg-blue-500', bgColor: 'bg-blue-500/10' },
  financement: { name: 'Financement', color: 'bg-green-500', bgColor: 'bg-green-500/10' },
  rh: { name: 'Ressources Humaines', color: 'bg-purple-500', bgColor: 'bg-purple-500/10' },
  admin: { name: 'Administration', color: 'bg-orange-500', bgColor: 'bg-orange-500/10' },
  accompagnement: { name: 'Accompagnement', color: 'bg-pink-500', bgColor: 'bg-pink-500/10' }
};

// Ecosystem Data
const ecosystemData = {
  institutions_publiques: [
    {
      nom: "Startup Tunisia",
      type: "Programme national",
      tutelle: "Ministère de l'Économie",
      site_web: "https://startup.gov.tn",
      description: "Programme national de soutien aux startups depuis 2018",
      services: ["Labellisation startups", "Coordination SSO", "Subventions"]
    },
    {
      nom: "Smart Capital",
      type: "Entité publique",
      description: "Entité en charge de l'implémentation du programme Startup Tunisia",
      services: ["Gestion Startup Act", "Label Startup", "Fonds de fonds Anava"]
    },
    {
      nom: "ANAVA - Fonds de Fonds",
      type: "Fonds d'investissement public",
      description: "Fonds de fonds structuré pour financer les startups tunisiennes (100M€ cible)",
      services: ["Financement fonds VC", "Co-investissement", "Garanties"]
    },
    {
      nom: "Centre d'Affaires de Sfax (CAS)",
      type: "Établissement public",
      localisation: "Sfax",
      site_web: "https://cas.tn",
      description: "15000 entrepreneurs accompagnés par an, 600 formations annuelles",
      services: ["Accompagnement", "Hébergement", "Formation"]
    },
    {
      nom: "Ministère de l'Emploi",
      type: "Ministère",
      site_web: "https://www.emploi.gov.tn",
      description: "Programmes CREE, MORAINE, CEFE, GERME",
      services: ["Espaces Entreprendre", "Bourses d'accompagnement", "Formation"]
    },
    {
      nom: "Banque Tunisienne de Solidarité (BTS)",
      type: "Banque publique",
      description: "Financement des micro-projets et jeunes entrepreneurs",
      services: ["Microcrédits", "Prêts d'honneur", "Accompagnement"]
    }
  ],
  programmes_formation: [
    {
      nom: "Programme CREE",
      type: "Formation",
      duree: "2 jours",
      description: "Découverte des compétences entrepreneuriales",
      services: ["Formation initiale", "Coaching", "Évaluation"]
    },
    {
      nom: "Programme MORAINE",
      type: "Formation",
      duree: "3 jours",
      description: "Recherche Active des Idées Nouvelles",
      services: ["Idéation", "Validation", "Business model"]
    },
    {
      nom: "Programme CEFE",
      type: "Formation",
      duree: "20 jours",
      description: "Création d'Entreprises et Formation d'Entrepreneurs (200 TND bourse)",
      services: ["Business plan", "Formation intensive", "Mentoring"]
    },
    {
      nom: "Programme GERME",
      type: "Accompagnement",
      description: "Gestion d'entreprise post-financement",
      services: ["Suivi", "Conseil", "Développement"]
    }
  ],
  technopoles: [
    {
      nom: "Elgazala Technopark",
      localisation: "Tunis (Ariana)",
      type: "Technopole",
      specialisation: "Technologies de l'information",
      description: "Centre névralgique de l'innovation technologique",
      services: ["Hébergement", "Incubation", "R&D", "Formation TIC"]
    },
    {
      nom: "Technopole de Sfax",
      localisation: "Sfax",
      type: "Technopole",
      description: "Pôle d'innovation et de recherche technologique",
      services: ["Hébergement", "Incubation", "Laboratoires"]
    },
    {
      nom: "Novation City",
      localisation: "Sousse",
      type: "Technopole",
      specialisation: "Mécatronique",
      description: "Développement écosystème mécatronique",
      services: ["Incubation industrielle", "R&D", "Prototypage"]
    },
    {
      nom: "Pôle de Compétitivité de Gafsa",
      localisation: "Gafsa",
      type: "Pôle régional",
      description: "Développement tissu industriel régional sud-ouest",
      services: ["Accompagnement régional", "Formation", "Networking"]
    }
  ],
  sso_partners: [
    {
      nom: "Betacube",
      type: "Venture Builder",
      specialisation: ["Fintech", "Mobilité"],
      description: "Co-création de startups tech",
      services: ["Venture building", "Équipe technique", "Investissement"]
    },
    {
      nom: "Flat6Labs",
      type: "Accélérateur",
      description: "Accélérateur MENA, gère Anava Seed Fund",
      services: ["Financement", "Mentorat", "Demo Day", "Réseau MENA"]
    },
    {
      nom: "WikiStartup",
      type: "Incubateur privé",
      description: "Premier incubateur/accélérateur privé en Tunisie (2011)",
      services: ["Accompagnement", "Accès financement", "Business Planning"]
    },
    {
      nom: "CoStarT",
      type: "Incubateur technologique",
      localisation: "Technopole de Sfax",
      specialisation: ["IT", "Numérique"],
      description: "Programmes d'accompagnement personnalisés",
      services: ["Incubation tech", "Valorisation recherche", "Mentoring"]
    },
    {
      nom: "Lab'ess",
      type: "Incubateur ESS",
      description: "Laboratoire de l'Économie Sociale et Solidaire",
      services: ["Incubation ESS", "Prêt d'honneur", "Formation Impact"]
    },
    {
      nom: "Carthage Business Angels",
      type: "Business Angels",
      description: "Soutien à toute la chaîne de création de valeur",
      services: ["Investissement", "Idéation", "Incubation", "Accélération"]
    },
    {
      nom: "Connect'Innov",
      type: "Incubateur HealthTech",
      specialisation: ["HealthTech", "MedTech", "BioTech"],
      description: "Innovation santé",
      services: ["Accompagnement", "Valorisation", "Mentoring"]
    },
    {
      nom: "MakerLab",
      type: "TechSpace",
      description: "Promotion technologie auprès des jeunes",
      services: ["Formation", "Prototypage", "Accompagnement startups"]
    },
    {
      nom: "CEED Tunisie",
      type: "ONG",
      description: "Réseau CEED International, marchés émergents",
      services: ["Formation", "Coaching", "Networking international"]
    },
    {
      nom: "RedStart Tunisie",
      type: "Accélérateur",
      description: "Coopération Europe-Afrique pour PME innovantes",
      services: ["Accélération", "Marché international", "Conseil"]
    },
    {
      nom: "1Kub",
      type: "Incubateur inclusif",
      description: "Entrepreneuriat féminin et régions",
      services: ["Incubation", "Accès financement", "Formation"]
    },
    {
      nom: "Minassa (INCO)",
      type: "Incubateur culturel",
      description: "Industries créatives et culturelles",
      services: ["Incubation", "Formation arts", "Financement culture"]
    },
    {
      nom: "Yunus Social Business",
      type: "Incubateur social",
      description: "Réseau Yunus, impact social et création d'emplois",
      services: ["Incubation sociale", "Formation impact", "Réseau international"]
    },
    {
      nom: "Westerwelle Startup Haus",
      type: "Hub entrepreneurial",
      localisation: "Centre-ville Tunis",
      description: "Ressources locales et internationales",
      services: ["Coworking", "Programmes internationaux", "Mentoring"]
    },
    {
      nom: "Réseau Entreprendre Tunisie",
      type: "Association",
      description: "Par des entrepreneurs, pour des entrepreneurs",
      services: ["Prêt d'honneur", "Mentorat", "Réseau"]
    }
  ],
  statistiques: {
    startups_labellisees: 1500,
    objectif_2026: 2000,
    incubateurs_accelerateurs: 85,
    coworking_spaces: 140,
    fonds_anava_cible: "150 millions euros",
    fonds_approuves: 12,
    montant_engage: "85 millions euros",
    montant_investi: "45 millions euros"
  }
};

const eligibilityCriteria = [
  "Entreprise de moins de 8 ans d'existence",
  "Effectif ne dépassant pas 100 employés",
  "Capital détenu majoritairement par des personnes physiques",
  "Modèle économique fortement innovant",
  "Fort potentiel de croissance et de scalabilité",
  "Siège social et activité principale en Tunisie"
];

const labelingProcess = [
  {
    step: 1,
    title: "Préparation du dossier",
    description: "Rassemblement des documents : business plan, pitch deck, statuts, preuves d'innovation",
    duration: "1-2 semaines"
  },
  {
    step: 2,
    title: "Soumission en ligne",
    description: "Dépôt du dossier sur la plateforme Smart Capital",
    duration: "1 jour"
  },
  {
    step: 3,
    title: "Évaluation technique",
    description: "Analyse du caractère innovant et du potentiel de croissance par le comité",
    duration: "2-4 semaines"
  },
  {
    step: 4,
    title: "Passage devant le comité",
    description: "Présentation et défense du projet devant le comité de labellisation",
    duration: "1 jour"
  },
  {
    step: 5,
    title: "Obtention du label",
    description: "Délivrance du certificat de labellisation et activation des avantages",
    duration: "1-2 semaines"
  }
];

const faqItems = [
  {
    question: "Qu'est-ce que le Startup Act tunisien ?",
    answer: "Le Startup Act est une loi promulguée en 2018 (Loi n°2018-20) qui crée un cadre juridique favorable aux startups innovantes en Tunisie. Elle offre des avantages fiscaux, sociaux et administratifs pour encourager l'entrepreneuriat innovant."
  },
  {
    question: "Qui gère le programme Startup Act ?",
    answer: "Smart Capital est l'organisme public responsable de la gestion du Startup Act, de la labellisation des startups et de la mise en œuvre des programmes d'accompagnement associés."
  },
  {
    question: "Combien de temps dure le label Startup ?",
    answer: "Le label Startup est valable pour une durée de 8 ans maximum à partir de la date de création de l'entreprise. Il peut être renouvelé sous certaines conditions."
  },
  {
    question: "Peut-on cumuler les avantages du Startup Act avec d'autres incitations ?",
    answer: "Oui, les avantages du Startup Act peuvent être cumulés avec d'autres programmes d'incitation existants, notamment ceux liés à l'investissement ou à l'export."
  },
  {
    question: "Qu'est-ce que le 'congé création' ?",
    answer: "Le congé création permet aux salariés du secteur public ou privé de prendre un congé d'un an (renouvelable une fois) pour créer leur startup, tout en gardant leur poste et leur couverture sociale."
  },
  {
    question: "Quels sont les documents requis pour la labellisation ?",
    answer: "Les documents principaux sont : business plan détaillé, pitch deck, statuts de la société, preuves du caractère innovant (brevets, R&D), CV des fondateurs, et états financiers si applicable."
  }
];

const StartupActSection = () => {
  const [selectedElement, setSelectedElement] = useState<typeof startupActElements[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredElements = useMemo(() => {
    return startupActElements.filter(element => {
      const matchesSearch = searchQuery === "" ||
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || element.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const allEcosystemItems = useMemo(() => {
    const items: { nom: string; type: string; description: string; services?: string[]; localisation?: string; category: string }[] = [];
    
    ecosystemData.institutions_publiques.forEach(item => {
      items.push({ ...item, category: 'Institution publique' });
    });
    ecosystemData.programmes_formation.forEach(item => {
      items.push({ ...item, category: 'Programme de formation' });
    });
    ecosystemData.technopoles.forEach(item => {
      items.push({ ...item, category: 'Technopole' });
    });
    ecosystemData.sso_partners.forEach(item => {
      items.push({ ...item, category: 'SSO Partner' });
    });
    
    return items;
  }, []);

  const filteredEcosystemItems = useMemo(() => {
    if (searchQuery === "") return allEcosystemItems;
    return allEcosystemItems.filter(item =>
      item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, allEcosystemItems]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Institution publique': return Landmark;
      case 'Programme de formation': return GraduationCap;
      case 'Technopole': return Building2;
      case 'SSO Partner': return Handshake;
      default: return Building;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Institution publique': return 'bg-red-500';
      case 'Programme de formation': return 'bg-indigo-500';
      case 'Technopole': return 'bg-teal-500';
      case 'SSO Partner': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans le Startup Act et l'écosystème..."
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

      <Tabs defaultValue="avantages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="avantages">Avantages</TabsTrigger>
          <TabsTrigger value="ecosysteme">Écosystème</TabsTrigger>
          <TabsTrigger value="processus">Processus</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Avantages Tab - Periodic Table */}
        <TabsContent value="avantages" className="space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-0">
              Loi n°2018-20
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tableau Périodique du Startup Act
            </h2>
            <p className="text-muted-foreground">
              Cliquez sur un élément pour découvrir les détails de chaque avantage
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{ecosystemData.statistiques.startups_labellisees}+</div>
                <div className="text-sm text-muted-foreground mt-1">Startups labellisées</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{ecosystemData.statistiques.incubateurs_accelerateurs}+</div>
                <div className="text-sm text-muted-foreground mt-1">Incubateurs/Accélérateurs</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600">{ecosystemData.statistiques.coworking_spaces}+</div>
                <div className="text-sm text-muted-foreground mt-1">Espaces Coworking</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">8 ans</div>
                <div className="text-sm text-muted-foreground mt-1">Durée max du label</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(startupActCategories).map(([key, cat]) => (
              <Badge
                key={key}
                variant="outline"
                className={`cursor-pointer ${
                  selectedCategory === key ? `${cat.color} text-white border-0` : ""
                }`}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              >
                <div className={`w-3 h-3 ${cat.color} rounded mr-2`} />
                {cat.name}
              </Badge>
            ))}
          </div>

          {/* Periodic Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredElements.map((element, index) => {
              const Icon = element.icon;
              const category = startupActCategories[element.category];
              return (
                <motion.button
                  key={element.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedElement(element)}
                  className={`${category.color} hover:opacity-90 transition-all rounded-lg p-4 text-white shadow-lg cursor-pointer text-left`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs opacity-75">{index + 1}</span>
                    <Icon size={18} />
                  </div>
                  <div className="text-2xl font-bold mb-1">{element.symbol}</div>
                  <div className="text-xs font-medium truncate">{element.name}</div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Element Detail */}
          <AnimatePresence>
            {selectedElement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`${startupActCategories[selectedElement.category].color} p-6 text-white`}>
                      <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <selectedElement.icon size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-1">{selectedElement.name}</h3>
                          <Badge className="bg-white/20 text-white border-0">
                            {startupActCategories[selectedElement.category].name}
                          </Badge>
                        </div>
                        <button
                          onClick={() => setSelectedElement(null)}
                          className="text-white/70 hover:text-white text-2xl font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedElement.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Détails</h4>
                        <p className="text-muted-foreground">{selectedElement.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Footer */}
          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">À propos du Startup Act</h4>
                  <p className="text-sm text-muted-foreground">
                    Le Startup Act tunisien est une loi pionnière en Afrique et dans le monde arabe, 
                    visant à créer un écosystème favorable aux startups innovantes. Pour bénéficier 
                    de ces avantages, une startup doit obtenir le label "Startup" délivré par un comité 
                    dédié. Le label est valable 8 ans et peut être renouvelé sous conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ecosystem Tab */}
        <TabsContent value="ecosysteme" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Écosystème Entrepreneurial Tunisien
            </h2>
            <p className="text-muted-foreground">
              {filteredEcosystemItems.length} acteurs identifiés
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Institution publique', 'Programme de formation', 'Technopole', 'SSO Partner'].map((cat) => {
              const Icon = getCategoryIcon(cat);
              return (
                <Badge
                  key={cat}
                  variant="outline"
                  className={`cursor-pointer ${getCategoryColor(cat)} text-white border-0`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {cat} ({allEcosystemItems.filter(i => i.category === cat).length})
                </Badge>
              );
            })}
          </div>

          {/* Ecosystem Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEcosystemItems.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <motion.div
                  key={item.nom}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${getCategoryColor(item.category)} p-2 rounded-lg text-white flex-shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{item.nom}</h4>
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {item.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {item.description}
                          </p>
                          {item.localisation && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {item.localisation}
                            </div>
                          )}
                          {item.services && item.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.services.slice(0, 3).map((service) => (
                                <Badge key={service} variant="secondary" className="text-[9px]">
                                  {service}
                                </Badge>
                              ))}
                              {item.services.length > 3 && (
                                <Badge variant="secondary" className="text-[9px]">
                                  +{item.services.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredEcosystemItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun résultat trouvé pour "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>

        {/* Processus Tab */}
        <TabsContent value="processus" className="space-y-8">
          {/* Eligibility Criteria */}
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Critères d'éligibilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {eligibilityCriteria.map((criteria, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{criteria}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Labeling Process */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Processus de labellisation
            </h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              <div className="space-y-6">
                {labelingProcess.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative md:pl-20"
                  >
                    <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full bg-primary text-primary-foreground items-center justify-center text-xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <Card className="hover:shadow-elevated transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2 md:hidden">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{step.title}</h4>
                            <p className="text-muted-foreground mt-1">{step.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs hidden md:flex">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Prêt à obtenir le label Startup ?</h3>
              <p className="opacity-90 mb-6 max-w-xl mx-auto">
                Rejoignez les {ecosystemData.statistiques.startups_labellisees}+ startups tunisiennes qui bénéficient déjà des avantages du Startup Act.
              </p>
              <a 
                href="https://www.smartcapital.tn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Visiter Smart Capital
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Questions Fréquentes
            </h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir sur le Startup Act
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartupActSection;
