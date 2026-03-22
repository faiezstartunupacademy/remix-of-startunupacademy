import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, BarChart3, Grid3X3, Layers, Calculator, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrowthMetricsTable from "@/components/startup/GrowthMetricsTable";
import MetricsCombinations from "@/components/startup/MetricsCombinations";
import AdvancedMetricsCalculator from "@/components/startup/AdvancedMetricsCalculator";
import MetricsHeatmap from "@/components/startup/MetricsHeatmap";
import KPIsVsMetrics from "@/components/startup/KPIsVsMetrics";
import DownloadAllCards from "@/components/DownloadAllCards";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { growthMetrics } from "@/data/growthMetricsData";

const CroissancePage = () => {
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4" />
                <span>Métriques & Croissance</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Maîtrisez les Métriques de Croissance Startup
              </h1>
              <p className="text-lg text-white/70 mb-8">
                86 métriques essentielles, combinaisons stratégiques, heatmap des corrélations 
                et calculateurs avancés pour piloter votre croissance.
              </p>

              <div className="flex flex-wrap gap-4">
                <DownloadAllCards variant="outline" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <Tabs defaultValue="kpis" className="space-y-6">
              <div className="flex justify-center">
                <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                  <TabsTrigger value="kpis" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="hidden sm:inline">KPIs</span>
                  </TabsTrigger>
                  <TabsTrigger value="metriques" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Métriques</span>
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Heatmap</span>
                  </TabsTrigger>
                  <TabsTrigger value="combinaisons" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Combos</span>
                  </TabsTrigger>
                  <TabsTrigger value="calculateur" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="hidden sm:inline">Calculateur</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="kpis">
                <KPIsVsMetrics />
              </TabsContent>

              <TabsContent value="metriques">
                <GrowthMetricsTable />
              </TabsContent>

              <TabsContent value="heatmap">
                <MetricsHeatmap />
              </TabsContent>

              <TabsContent value="combinaisons">
                <MetricsCombinations />
              </TabsContent>
              
              <TabsContent value="calculateur">
                <AdvancedMetricsCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <FormationChatbot formationName="Croissance & Métriques" formationContext={buildFormationContext(growthMetrics)} />
    </div>
  );
};

export default CroissancePage;
