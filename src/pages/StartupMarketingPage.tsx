import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, PlayCircle, BookOpen, Megaphone, Target, Rocket, TrendingUp, 
  Zap, Lightbulb, RefreshCw, PenTool, GraduationCap, Crown
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StartupMarketingPresentation from "@/components/StartupMarketingPresentation";
import TractionChannelsTable from "@/components/TractionChannelsTable";
import HookCanvasTool from "@/components/HookCanvasTool";
import LicorneOperatingPresentation from "@/components/LicorneOperatingPresentation";
import MarketingDiagnosticTool from "@/components/MarketingDiagnosticTool";
import PositioningTool from "@/components/PositioningTool";
import BullseyeSimulator from "@/components/BullseyeSimulator";
import { MARKETING_SLIDES } from "@/data/startupMarketingSlidesData";
import { LICORNE_OPERATING_SLIDES } from "@/data/licorneOperatingSlidesData";

const moduleDetails = [
  {
    id: "marketing-6.0",
    name: "Marketing 6.0",
    icon: Megaphone,
    color: "from-violet-500 to-purple-600",
    source: "Philip Kotler",
    description: "L'avenir immersif du marketing : Gen Z/Alpha, métaverse, XR, IA et expériences phygitales",
    slides: 15,
    topics: ["Évolution 1.0→6.0", "Natifs Phygitaux", "XR & Metaverse", "Marketing Multi-Sensoriel"],
  },
  {
    id: "positioning",
    name: "Positionnement",
    icon: Target,
    color: "from-orange-500 to-red-600",
    source: "April Dunford",
    description: "Le processus en 10 étapes pour un positionnement qui fait que les clients comprennent et adorent votre produit",
    slides: 15,
    topics: ["5 Composantes", "Alternatives Compétitives", "Valeur & Marché Cible", "Catégorie de Marché"],
  },
  {
    id: "plg",
    name: "Product-Led Growth",
    icon: Rocket,
    color: "from-blue-500 to-cyan-600",
    source: "Wes Bush",
    description: "Stratégie go-to-market où le produit est le principal vecteur d'acquisition et de rétention",
    slides: 15,
    topics: ["PLG vs Sales-Led", "Framework MOAT", "Time-to-Value", "Bowling Alley"],
  },
  {
    id: "traction",
    name: "Traction",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600",
    source: "Weinberg & Mares",
    description: "Les 19 canaux de traction et le framework Bullseye pour une croissance explosive",
    slides: 15,
    topics: ["19 Canaux", "Framework Bullseye", "Règle des 50%", "Viral Marketing"],
  },
  {
    id: "hook",
    name: "Le Modèle Hook",
    icon: Zap,
    color: "from-pink-500 to-rose-600",
    source: "Nir Eyal",
    description: "Le processus en 4 phases pour créer des produits qui forment des habitudes",
    slides: 15,
    topics: ["Déclencheurs", "Action (B=MAT)", "Récompenses Variables", "Investissement"],
  },
  {
    id: "inspired",
    name: "Product Management",
    icon: Lightbulb,
    color: "from-indigo-500 to-blue-600",
    source: "Marty Cagan (INSPIRED)",
    description: "Comment créer des produits que les clients adorent : discovery, prototypes et validation",
    slides: 15,
    topics: ["Valuable-Usable-Feasible", "Discovery vs Delivery", "Prototypes HiFi", "User Research"],
  },
  {
    id: "transformed",
    name: "Transformation Produit",
    icon: RefreshCw,
    color: "from-amber-500 to-orange-600",
    source: "Marty Cagan (TRANSFORMED)",
    description: "Comment transformer votre entreprise vers le Product Operating Model",
    slides: 15,
    topics: ["Product Operating Model", "Équipes Empowered", "Product Strategy", "Culture Produit"],
  },
  {
    id: "copywriting",
    name: "Copywriting",
    icon: PenTool,
    color: "from-teal-500 to-cyan-600",
    source: "Sélim Niederhoffer",
    description: "50 techniques pour écrire des textes qui vendent, augmentées par l'IA",
    slides: 15,
    topics: ["Super Structure", "Titres Qui Tuent", "Preuve Sociale", "Urgence & CTA"],
  },
];
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";

const StartupMarketingPage = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showLicornePresentation, setShowLicornePresentation] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const formationContext = useMemo(() => buildFormationContext(MARKETING_SLIDES), []);

  if (showPresentation) {
    return <StartupMarketingPresentation onClose={() => setShowPresentation(false)} />;
  }

  if (showLicornePresentation) {
    return <LicorneOperatingPresentation onClose={() => setShowLicornePresentation(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Megaphone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Formation Marketing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Marketing des <span className="text-primary">Startups</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Une formation complète basée sur 8 ouvrages de référence : du Marketing 6.0 au Copywriting, 
            en passant par le Product-Led Growth et la création d'habitudes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <BookOpen className="mr-2 h-4 w-4" />
              {MARKETING_SLIDES.length + LICORNE_OPERATING_SLIDES.length} Slides Interactives
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <GraduationCap className="mr-2 h-4 w-4" />
              9 Modules Thématiques
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="shadow-glow" onClick={() => setShowPresentation(true)}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Formation Marketing
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-violet-500/50 hover:bg-violet-500/10" onClick={() => setShowLicornePresentation(true)}>
              <Crown className="mr-2 h-5 w-5 text-violet-500" />
              Operating Model Licornes ({LICORNE_OPERATING_SLIDES.length} slides)
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="modules" className="w-full">
          <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-xl py-4 border-b mb-8">
            <TabsList className="flex flex-wrap justify-center gap-1 h-auto p-1">
              <TabsTrigger value="modules" className="text-xs">
                <GraduationCap className="mr-1 h-3 w-3" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="traction" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3" />
                Canaux
              </TabsTrigger>
              <TabsTrigger value="bullseye" className="text-xs">
                <Target className="mr-1 h-3 w-3" />
                Bullseye
              </TabsTrigger>
              <TabsTrigger value="positioning" className="text-xs">
                <Target className="mr-1 h-3 w-3" />
                Positionnement
              </TabsTrigger>
              <TabsTrigger value="diagnostic" className="text-xs">
                <Lightbulb className="mr-1 h-3 w-3" />
                Diagnostic
              </TabsTrigger>
              <TabsTrigger value="hook" className="text-xs">
                <Zap className="mr-1 h-3 w-3" />
                Hook
              </TabsTrigger>
              <TabsTrigger value="sources" className="text-xs">
                <BookOpen className="mr-1 h-3 w-3" />
                Sources
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moduleDetails.map((mod, idx) => {
                const ModIcon = mod.icon;
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <ModIcon className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="outline">{mod.slides} slides</Badge>
                        </div>
                        <CardTitle className="mt-4">{mod.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Source: {mod.source}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{mod.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {mod.topics.map((topic, topicIdx) => (
                            <Badge key={topicIdx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => setShowPresentation(true)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Commencer ce module
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="traction">
            <TractionChannelsTable />
          </TabsContent>

          <TabsContent value="bullseye">
            <BullseyeSimulator />
          </TabsContent>

          <TabsContent value="positioning">
            <PositioningTool />
          </TabsContent>

          <TabsContent value="diagnostic">
            <MarketingDiagnosticTool />
          </TabsContent>

          <TabsContent value="hook">
            <HookCanvasTool />
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Marketing 6.0", author: "Philip Kotler, Hermawan Kartajaya, Iwan Setiawan", year: "2024", focus: "Immersive Marketing" },
                { title: "Obviously Awesome", author: "April Dunford", year: "2019", focus: "Product Positioning" },
                { title: "Product-Led Growth", author: "Wes Bush", year: "2019", focus: "PLG Strategy" },
                { title: "Traction", author: "Gabriel Weinberg & Justin Mares", year: "2015", focus: "Customer Growth" },
                { title: "Hooked", author: "Nir Eyal", year: "2014", focus: "Habit-Forming Products" },
                { title: "INSPIRED", author: "Marty Cagan", year: "2017", focus: "Product Management" },
                { title: "TRANSFORMED", author: "Marty Cagan", year: "2024", focus: "Product Operating Model" },
                { title: "Le Guide du Copywriting", author: "Sélim Niederhoffer", year: "2025", focus: "Copywriting & IA" },
              ].map((book, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="text-4xl mb-3">📚</div>
                      <h3 className="font-semibold text-sm">{book.title}</h3>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{book.year}</Badge>
                        <Badge variant="secondary" className="text-xs">{book.focus}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <FormationChatbot formationName="Startup Marketing" formationContext={formationContext} />
    </div>
  );
};

export default StartupMarketingPage;
