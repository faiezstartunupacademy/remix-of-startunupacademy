import { motion } from "framer-motion";
import { useState } from "react";
import { useLicenseAccess } from "@/hooks/useLicenseAccess";
import LicenseKeyModal from "@/components/LicenseKeyModal";
import InlineLicenseGate from "@/components/InlineLicenseGate";
import { 
  ArrowLeft, 
  TrendingUp, 
  Leaf, 
  Cpu, 
  ShoppingBag, 
  Heart, 
  Building,
  Hourglass,
  Search,
  Factory,
  Rocket,
  Scale,
  Briefcase,
  Building2,
  Globe,
  Quote,
  Lightbulb,
  Target,
  Repeat,
  ChevronRight,
  BookOpen,
  Brain,
  Zap,
  Layers,
  PlayCircle,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StartupGlossary from "@/components/StartupGlossary";
import StartupMontage from "@/components/startup/StartupMontage";
import MomTest from "@/components/startup/MomTest";
import FondementsEntrepreneuriat from "@/components/startup/FondementsEntrepreneuriat";
import InnovationDisruptive from "@/components/startup/InnovationDisruptive";
import InnovationFrugale from "@/components/startup/InnovationFrugale";
import LeanStartup from "@/components/startup/LeanStartup";
import DesignThinkingPresentation from "@/components/DesignThinkingPresentation";
import { Beaker, MessageCircle, FlaskConical } from "lucide-react";
import StartupProgramPresentation from "@/components/ecosystem/StartupProgramPresentation";


// Fondements scientifiques data
const startupDefinition = {
  quote: "Une startup est une organisation temporaire conçue pour rechercher un business model répétable et scalable.",
  author: "Steve Blank",
  concepts: [
    {
      title: "Organisation Temporaire",
      description: "Elle n'a pas vocation à rester une startup. Son but est de devenir une entreprise établie."
    },
    {
      title: "Phase de Recherche",
      description: "Contrairement à une grande entreprise qui EXÉCUTE un modèle, la startup CHERCHE son modèle."
    }
  ]
};

const startupTypes = [
  {
    type: "LIFESTYLE",
    name: "Startups de style de vie",
    description: "Entrepreneurs qui vivent de leur passion. Ils travaillent pour eux-mêmes.",
    objective: "Maintenir un revenu suffisant pour soutenir un style de vie personnel.",
    example: "Un freelance digital nomad, un instructeur de surf.",
    icon: Briefcase,
    color: "bg-sky-500"
  },
  {
    type: "SMALL_BUSINESS",
    name: "Startups de petites entreprises",
    description: "Entreprises traditionnelles qui financent la famille. Elles ne visent pas une croissance exponentielle.",
    objective: "Rentabilité locale et immédiate pour nourrir la famille.",
    example: "Une épicerie, un salon de coiffure, une agence de conseil locale.",
    icon: Building,
    color: "bg-amber-500"
  },
  {
    type: "SCALABLE",
    name: "Startups évolutives",
    description: "Entreprises nées pour devenir grandes. Elles cherchent un business model répétable et scalable.",
    objective: "Croissance exponentielle et domination du marché (Licorne).",
    example: "Google, Uber, Facebook à leurs débuts.",
    icon: Rocket,
    color: "bg-rose-500"
  },
  {
    type: "BUYABLE",
    name: "Startups acquérables",
    description: "Entreprises créées spécifiquement pour être rachetées par de plus grands acteurs.",
    objective: "Être vendu (Exit) pour un montant important à une grande entreprise.",
    example: "Une application mobile de niche, une technologie web spécifique.",
    icon: Scale,
    color: "bg-emerald-500"
  },
  {
    type: "LARGE_COMPANY",
    name: "Startups d'innovation",
    description: "Grandes entreprises existantes qui doivent innover pour survivre face à la concurrence.",
    objective: "Innover ou mourir (Maintenir des parts de marché).",
    example: "Lancement d'un nouveau produit par Apple ou Samsung.",
    icon: Building2,
    color: "bg-indigo-500"
  },
  {
    type: "SOCIAL",
    name: "Startups sociales",
    description: "Entreprises motivées par une cause sociale ou environnementale plutôt que par le profit pur.",
    objective: "Impact positif sur le monde tout en étant économiquement viable.",
    example: "ONG, entreprises de commerce équitable.",
    icon: Globe,
    color: "bg-teal-500"
  }
];

const startupCharacteristics = [
  {
    name: "Phase Temporaire",
    description: "Représente la nature transitoire des startups, dont l'objectif est de viser la croissance.",
    icon: Hourglass,
    color: "bg-orange-500"
  },
  {
    name: "Recherche de Business Model",
    description: "Le défi principal : itérer pour créer un modèle commercial unique, rentable et viable.",
    icon: Search,
    color: "bg-blue-500"
  },
  {
    name: "Reproductibilité",
    description: "Nécessité d'un modèle évolutif pouvant être reproduit à l'identique sur différents marchés.",
    icon: Factory,
    color: "bg-purple-500"
  },
  {
    name: "Scalabilité",
    description: "Capacité à croître de manière exponentielle (revenus) tout en maintenant des coûts linéaires.",
    icon: Rocket,
    color: "bg-rose-500"
  }
];

const StartupsPage = () => {
  const { hasAccess: hasFondements2Access, isChecking: isCheckingF2, grantAccess: grantF2Access } = useLicenseAccess("fondements");
  const [activeTab, setActiveTab] = useState<'fondements1' | 'fondements2'>('fondements1');
  const [activePole1, setActivePole1] = useState<'entrepreneuriat' | 'startups'>('entrepreneuriat');
  const [activePole2, setActivePole2] = useState<'disruptive' | 'frugale' | 'leanstartup' | 'effectuation' | 'program'>('disruptive');
  const [activeFoundation, setActiveFoundation] = useState<'definitions' | 'types' | 'characteristics' | 'glossaire' | 'montage' | 'momtest'>('definitions');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 lg:py-24">
          <div className="container">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
                <Layers className="h-4 w-4" />
                <span>Espace Fondements</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Fondements de l'Entrepreneuriat et de l'Innovation
              </h1>
              <p className="text-lg text-white/70 mb-8">
                Deux espaces complémentaires: les bases scientifiques (Fondements 1) et 
                les théories de l'innovation (Fondements 2).
              </p>

            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            {/* Main Tabs: Fondements 1 & 2 */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'fondements1' | 'fondements2')} className="space-y-8">
              <TabsList className="w-full max-w-lg mx-auto grid grid-cols-2">
                <TabsTrigger value="fondements1" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Fondements 1
                </TabsTrigger>
                <TabsTrigger value="fondements2" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Fondements 2
                </TabsTrigger>
              </TabsList>

              {/* Fondements 1: Entrepreneuriat + Startups */}
              <TabsContent value="fondements1" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Fondements Entrepreneuriat & Startups</h2>
                  <p className="text-muted-foreground">
                    Neurobiologie de l'entrepreneur, définitions des startups, et outils de validation
                  </p>
                </div>

                {/* Sub-navigation */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setActivePole1('entrepreneuriat')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole1 === 'entrepreneuriat'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      <span>Fondements Entrepreneuriat</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActivePole1('startups')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole1 === 'startups'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      <span>Fondements Startups</span>
                    </div>
                  </button>
                </div>



                {/* Pole Entrepreneuriat */}
                {activePole1 === 'entrepreneuriat' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FondementsEntrepreneuriat />
                  </motion.div>
                )}

                {/* Pole Startups */}
                {activePole1 === 'startups' && (
                  <>
                    {/* Sub-navigation */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Badge
                        variant={activeFoundation === 'definitions' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('definitions')}
                      >
                        Définitions
                      </Badge>
                      <Badge
                        variant={activeFoundation === 'types' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('types')}
                      >
                        Types (Steve Blank)
                      </Badge>
                      <Badge
                        variant={activeFoundation === 'characteristics' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('characteristics')}
                      >
                        Caractéristiques
                      </Badge>
                      <Badge
                        variant={activeFoundation === 'montage' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('montage')}
                      >
                        <Beaker className="h-3 w-3 mr-1" />
                        Montage
                      </Badge>
                      <Badge
                        variant={activeFoundation === 'momtest' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('momtest')}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Mom Test
                      </Badge>
                      <Badge
                        variant={activeFoundation === 'glossaire' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                        onClick={() => setActiveFoundation('glossaire')}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Glossaire
                      </Badge>
                    </div>

                    {/* Definitions Section */}
                    {activeFoundation === 'definitions' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="text-center">
                          <h2 className="text-3xl font-bold text-foreground mb-2">
                            Qu'est-ce qu'une Startup ?
                          </h2>
                          <div className="w-16 h-1 bg-primary mx-auto" />
                        </div>

                        {/* Quote Card */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 max-w-3xl mx-auto">
                          <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                              <Quote className="h-10 w-10 text-primary opacity-50 flex-shrink-0" />
                              <div>
                                <p className="text-xl italic mb-4 leading-relaxed">
                                  "{startupDefinition.quote}"
                                </p>
                                <p className="text-primary font-semibold text-right">
                                  — {startupDefinition.author}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Key Concepts */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                          {startupDefinition.concepts.map((concept, index) => (
                            <motion.div
                              key={concept.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="h-full bg-muted/50 hover:bg-muted/80 transition-colors">
                                <CardContent className="p-6">
                                  <div className="flex items-center gap-3 mb-3">
                                    {index === 0 ? (
                                      <Hourglass className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Lightbulb className="h-5 w-5 text-primary" />
                                    )}
                                    <h4 className="font-bold text-lg">{concept.title}</h4>
                                  </div>
                                  <p className="text-muted-foreground">{concept.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Types Section */}
                    {activeFoundation === 'types' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="text-center">
                          <h2 className="text-3xl font-bold text-foreground mb-2">
                            Les 6 Types de Startups
                          </h2>
                          <p className="text-muted-foreground">Classification de Steve Blank</p>
                          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {startupTypes.map((startup, index) => (
                            <motion.div
                              key={startup.type}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="h-full hover:shadow-lg transition-all group">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${startup.color} text-white`}>
                                      <startup.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">{startup.name}</CardTitle>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <p className="text-muted-foreground text-sm">{startup.description}</p>
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-xs font-medium text-primary mb-1">Objectif</p>
                                    <p className="text-sm">{startup.objective}</p>
                                  </div>
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Exemple</p>
                                    <p className="text-sm italic">{startup.example}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Characteristics Section */}
                    {activeFoundation === 'characteristics' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="text-center">
                          <h2 className="text-3xl font-bold text-foreground mb-2">
                            Les 4 Caractéristiques Fondamentales
                          </h2>
                          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          {startupCharacteristics.map((char, index) => (
                            <motion.div
                              key={char.name}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="h-full hover:shadow-lg transition-all">
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-2xl ${char.color} text-white`}>
                                      <char.icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-xl mb-2">{char.name}</h4>
                                      <p className="text-muted-foreground">{char.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Montage Section */}
                    {activeFoundation === 'montage' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <StartupMontage />
                      </motion.div>
                    )}

                    {/* Mom Test Section */}
                    {activeFoundation === 'momtest' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <MomTest />
                      </motion.div>
                    )}

                    {/* Glossary Section */}
                    {activeFoundation === 'glossaire' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <StartupGlossary />
                      </motion.div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Fondements 2: Innovation Disruptive + Frugale + Effectuation + Startup Program */}
              <TabsContent value="fondements2" className="space-y-8">
                {!hasFondements2Access ? (
                  <LicenseKeyModal
                    contentSlug="fondements"
                    contentName="Fondements 2 — Théories de l'Innovation"
                    onSuccess={grantF2Access}
                  />
                ) : (
                <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Théories de l'Innovation</h2>
                  <p className="text-muted-foreground">
                    Innovation Disruptive (Christensen), Lean Startup (Ries), Innovation Frugale (Radjou), Effectuation (Sarasvathy)
                  </p>
                </div>

                {/* Sub-navigation */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setActivePole2('disruptive')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole2 === 'disruptive'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      <span>Innovation Disruptive</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActivePole2('leanstartup')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole2 === 'leanstartup'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5" />
                      <span>Lean Startup</span>
                      <Badge className="ml-1 bg-orange-400/30 text-orange-100 text-[10px]">55 slides</Badge>
                    </div>
                  </button>
                  <button
                    onClick={() => setActivePole2('frugale')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole2 === 'frugale'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      <span>Innovation Frugale</span>
                    </div>
                  </button>
                  <Link
                    to="/fondements/effectuation"
                    className="px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐦</span>
                      <span>Effectuation</span>
                      <Badge className="ml-1 bg-white/20 text-white text-[10px]">42 slides</Badge>
                    </div>
                  </Link>
                  <Link
                    to="/formation/disciplined-entrepreneurship"
                    className="px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      <span>Disciplined Entrepreneurship</span>
                      <Badge className="ml-1 bg-white/20 text-white text-[10px]">22 slides</Badge>
                    </div>
                  </Link>
                  <button
                    onClick={() => setActivePole2('program')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activePole2 === 'program'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>Startup Program</span>
                    </div>
                  </button>
                </div>

                {/* Innovation Disruptive */}
                {activePole2 === 'disruptive' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <InlineLicenseGate contentSlug="fondements-disruptive" contentName="Innovation Disruptive">
                      <InnovationDisruptive />
                    </InlineLicenseGate>
                  </motion.div>
                )}

                {/* Lean Startup */}
                {activePole2 === 'leanstartup' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <InlineLicenseGate contentSlug="fondements-leanstartup" contentName="Lean Startup">
                      <LeanStartup />
                    </InlineLicenseGate>
                  </motion.div>
                )}

                {/* Innovation Frugale */}
                {activePole2 === 'frugale' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <InlineLicenseGate contentSlug="fondements-frugale" contentName="Innovation Frugale">
                      <InnovationFrugale />
                    </InlineLicenseGate>
                  </motion.div>
                )}

                {/* Startup Program */}
                {activePole2 === 'program' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <InlineLicenseGate contentSlug="fondements-program" contentName="Startup Program">
                      <StartupProgramPresentation />
                    </InlineLicenseGate>
                  </motion.div>
                )}
                </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StartupsPage;
