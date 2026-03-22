import { motion } from "framer-motion";
import { ArrowLeft, Users, BookOpen, Award, Lightbulb, ClipboardCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CChiefPeriodicTable from "@/components/CChiefPeriodicTable";
import ExecutiveTeamDiagnostic from "@/components/ExecutiveTeamDiagnostic";
import FractionalExecutives from "@/components/FractionalExecutives";
import LicenseKeyModal from "@/components/LicenseKeyModal";
import { useLicenseAccess } from "@/hooks/useLicenseAccess";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { cSuiteRoles } from "@/data/cSuiteRolesData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const CONTENT_SLUG = "c-chief";
const CONTENT_NAME = "C-Chief Leadership";

const CChiefPage = () => {
  const { hasAccess, isChecking, grantAccess } = useLicenseAccess(CONTENT_SLUG);

  // Show loading state while checking license
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show license key modal if no access
  if (!hasAccess) {
    return (
      <LicenseKeyModal
        contentSlug={CONTENT_SLUG}
        contentName={CONTENT_NAME}
        onSuccess={grantAccess}
      />
    );
  }
  const sources = [
    {
      title: "Startup CEO",
      author: "Matt Blumberg",
      year: 2020,
      description: "Guide complet pour scaler votre entreprise"
    },
    {
      title: "Startup CxO",
      author: "Matt Blumberg & Peter Birkeland",
      year: 2023,
      description: "Field guide pour les fonctions executives"
    },
    {
      title: "Startup Boards",
      author: "Brad Feld & Matt Blumberg",
      year: 2022,
      description: "Construire un board efficace"
    },
    {
      title: "Understanding Startup CEOs",
      author: "Dan Slagen",
      year: 2020,
      description: "Mindset pour travailler avec un CEO"
    }
  ];

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
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20">
                <Users className="h-4 w-4" />
                <span>Leadership & Gouvernance</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                C-CHIEF <span className="text-primary">Academy</span>
              </h1>
              <p className="text-xl text-white/80 mb-4">
                Tableau Périodique des Rôles C-Suite
              </p>
              <p className="text-lg text-white/60 mb-8 max-w-2xl">
                Explorez les 14 rôles executives clés d'une startup en croissance.
                Comprenez leurs responsabilités, compétences, KPIs et quand les recruter.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "14", label: "Rôles C-Suite", icon: Users },
                  { value: "6", label: "Catégories", icon: Award },
                  { value: "8", label: "Mindset Insights", icon: Lightbulb },
                  { value: "4", label: "Livres Sources", icon: BookOpen }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <stat.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="explorer" className="space-y-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="explorer" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Explorer les rôles
                </TabsTrigger>
                <TabsTrigger value="fractional" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fractional
                </TabsTrigger>
                <TabsTrigger value="diagnostic" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Diagnostic
                </TabsTrigger>
              </TabsList>

              <TabsContent value="explorer">
                <CChiefPeriodicTable />
              </TabsContent>

              <TabsContent value="fractional">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Executives Fractional
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Quand et comment recruter des executives à temps partiel selon le stade de votre startup.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FractionalExecutives />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagnostic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      Diagnostic d'Équipe Executive
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Répondez à 8 questions pour identifier les rôles C-Suite à recruter en priorité selon votre stade.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ExecutiveTeamDiagnostic />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Sources */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Sources & Références</h2>
              <p className="text-muted-foreground">
                Ce contenu est basé sur les ouvrages de référence du leadership startup
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sources.map((source, index) => (
                <motion.div
                  key={source.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-bold">{source.title}</h3>
                          <p className="text-sm text-muted-foreground">{source.author}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-3">{source.year}</Badge>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Ce que vous apprendrez
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Les 14 rôles C-Suite et leurs responsabilités spécifiques",
                        "Quand recruter chaque type d'executive selon la maturité",
                        "Les KPIs clés à suivre pour chaque fonction",
                        "Comment construire un board efficace",
                        "Le mindset d'un CEO de startup"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Concepts Clés
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Leadership Authentique",
                        "Fractional Executives",
                        "Board Composition",
                        "CEO-to-CEO Advice",
                        "Scaling Challenges",
                        "Executive KPIs",
                        "Matt's Rule of 1s",
                        "GSD Mindset"
                      ].map((concept, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="C-CHIEF Leadership" formationContext={buildFormationContext(cSuiteRoles)} />
    </div>
  );
};

export default CChiefPage;
