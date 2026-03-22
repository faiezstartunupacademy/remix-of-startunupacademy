import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, BookOpen, ExternalLink, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BMCvsLeanCanvas from "@/components/formation/BMCvsLeanCanvas";
import FormationChatbot from "@/components/formation/FormationChatbot";

const BMComparisonPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 lg:py-24">
          <div className="container">
            <Link
              to="/formations"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux formations
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6">
                <Scale className="h-4 w-4" />
                <span>Analyse Comparative Expert</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Business Model : BMC vs Lean Canvas
              </h1>
              <p className="text-lg text-white/70 mb-8">
                Une analyse approfondie par un expert en stratégie d'entreprise. 
                Comprenez les différences fondamentales, choisissez l'outil adapté à votre contexte, 
                et accédez aux formations complètes.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                  <p className="text-2xl font-bold text-white">9</p>
                  <p className="text-xs text-white/70">Blocs par Canvas</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-white/70">Blocs Différents</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-white/70">Blocs Communs</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="comparison" className="space-y-8">
              <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3">
                <TabsTrigger value="comparison" className="gap-2">
                  <Scale className="h-4 w-4" /> Comparaison
                </TabsTrigger>
                <TabsTrigger value="bmc" className="gap-2">
                  <BookOpen className="h-4 w-4" /> Formation BMC
                </TabsTrigger>
                <TabsTrigger value="lean" className="gap-2">
                  <BookOpen className="h-4 w-4" /> Formation Lean
                </TabsTrigger>
              </TabsList>

              {/* Comparison Tab */}
              <TabsContent value="comparison">
                <BMCvsLeanCanvas />
              </TabsContent>

              {/* BMC Formation Tab */}
              <TabsContent value="bmc" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Badge className="mb-4 bg-primary">Formation Complète</Badge>
                  <h2 className="text-3xl font-bold mb-4">Business Model Canvas</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Maîtrisez les 9 blocs du BMC avec notre formation complète basée sur 
                    les travaux d'Alexander Osterwalder et nos experts en stratégie d'entreprise.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* BMC Guide */}
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="p-4 rounded-xl bg-primary/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">BMC Guide Pratique</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        91 slides interactives couvrant les 9 modules essentiels du Business Model Canvas.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">91 slides</Badge>
                        <Badge variant="outline">9 modules</Badge>
                      </div>
                      <Button className="w-full gap-2" asChild>
                        <Link to="/formation/business-model">
                          <PlayCircle className="h-4 w-4" />
                          Accéder à la formation
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* BM Innovation */}
                  <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="p-4 rounded-xl bg-accent/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">BM Innovation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        78 slides basées sur HBR Must Reads et le 4V Framework de Chander Velu.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">78 slides</Badge>
                        <Badge variant="outline">10 modules</Badge>
                      </div>
                      <Button variant="outline" className="w-full gap-2" asChild>
                        <Link to="/formation/business-model">
                          <PlayCircle className="h-4 w-4" />
                          Accéder à la formation
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Green BM */}
                  <Card className="border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="p-4 rounded-xl bg-emerald-500/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Entrepreneuriat Vert</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        70 slides sur le Green Business Canvas, l'ESG et les modèles circulaires.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">70 slides</Badge>
                        <Badge variant="outline">11 modules</Badge>
                      </div>
                      <Button variant="outline" className="w-full gap-2" asChild>
                        <Link to="/formation/business-model">
                          <PlayCircle className="h-4 w-4" />
                          Accéder à la formation
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Lean Canvas Formation Tab */}
              <TabsContent value="lean" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Badge className="mb-4 bg-amber-500">Formation Complète</Badge>
                  <h2 className="text-3xl font-bold mb-4">Lean Canvas</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    La méthode complète d'Ash Maurya : Running Lean (validation) et Scaling Lean (croissance).
                    De l'idée au Product/Market Fit et au-delà.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Running Lean */}
                  <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="p-4 rounded-xl bg-blue-500/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📘</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Running Lean</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        De l'idée au Product/Market Fit. Design, Validation et premiers clients satisfaits.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">60 slides</Badge>
                          <span className="text-muted-foreground">Lean Canvas, Interviews Client</span>
                        </div>
                      </div>
                      <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to="/formation/lean-canvas">
                          <PlayCircle className="h-4 w-4" />
                          Démarrer Running Lean
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Scaling Lean */}
                  <Card className="border-2 border-indigo-500/20 hover:border-indigo-500/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="p-4 rounded-xl bg-indigo-500/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📙</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Scaling Lean</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Maîtriser les indicateurs de croissance, le Customer Factory Blueprint et l'optimisation.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">38 slides</Badge>
                          <span className="text-muted-foreground">Traction, Métriques, Contraintes</span>
                        </div>
                      </div>
                      <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" asChild>
                        <Link to="/formation/lean-canvas">
                          <PlayCircle className="h-4 w-4" />
                          Démarrer Scaling Lean
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Tools */}
                <div className="text-center mt-8">
                  <Card className="max-w-2xl mx-auto p-6 bg-muted/30">
                    <h4 className="font-bold mb-2">Boîte à Outils Lean</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      26 outils interactifs incluant Customer Forces Canvas, Customer Factory Blueprint, 
                      et le Calculateur de Métriques Avancées.
                    </p>
                    <Button variant="outline" className="gap-2" asChild>
                      <Link to="/formation/lean-canvas">
                        <ExternalLink className="h-4 w-4" />
                        Explorer les 26 outils
                      </Link>
                    </Button>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="BMC vs Lean Canvas" formationContext="Comparaison entre Business Model Canvas et Lean Canvas. Analyse des forces, faiblesses, cas d'usage, et guide de choix entre les deux frameworks." />
    </div>
  );
};

export default BMComparisonPage;
