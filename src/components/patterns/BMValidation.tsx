import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, DollarSign, Users, Clock, BarChart3, Zap, Calculator, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { INVESTOR_METRICS, NINE_BUSINESS_MODELS } from "@/data/businessModelPatterns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const BMValidation = () => {
  const [activeTab, setActiveTab] = useState("metrics");
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  // Calculator state
  const [calcValues, setCalcValues] = useState({
    mrr: "",
    customers: "",
    cac: "",
    churn: "",
    arpu: ""
  });

  const calculateLTV = (): string => {
    const arpu = parseFloat(calcValues.arpu) || 0;
    const churn = parseFloat(calcValues.churn) || 0;
    if (churn === 0) return "0";
    return (arpu / (churn / 100)).toFixed(0);
  };

  const calculateLTVCAC = (): string => {
    const ltv = parseFloat(calculateLTV()) || 0;
    const cac = parseFloat(calcValues.cac) || 0;
    if (cac === 0) return "0";
    return (ltv / cac).toFixed(1);
  };

  const getMetricIcon = (id: string) => {
    switch(id) {
      case "mrr": return <TrendingUp className="h-5 w-5" />;
      case "cac": return <Target className="h-5 w-5" />;
      case "ltv": return <DollarSign className="h-5 w-5" />;
      case "ltvcac": return <BarChart3 className="h-5 w-5" />;
      case "churn": return <Users className="h-5 w-5" />;
      case "nrr": return <Zap className="h-5 w-5" />;
      case "payback": return <Clock className="h-5 w-5" />;
      case "burn": return <TrendingUp className="h-5 w-5" />;
      case "runway": return <Clock className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center space-y-4 py-8 px-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10 border border-amber-500/20"
      >
        <div className="absolute top-4 right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-600 dark:text-amber-400">
          <TrendingUp className="h-4 w-4" />
          Business Model Validation
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Métriques <span className="text-gradient">Investisseurs</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Métriques clés que les investisseurs veulent voir dans votre business model
        </p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          Source: Anu Hariharan (Y Combinator) - SInC IIT Delhi
          <a href="https://www.youtube.com/watch?v=yZmjefvXefg" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline inline-flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Voir la vidéo
          </a>
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="metrics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Target className="h-4 w-4" />
            9 Business Models
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            Calculateur
          </TabsTrigger>
        </TabsList>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INVESTOR_METRICS.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg hover:border-amber-500/50 ${
                    expandedMetric === metric.id ? 'border-amber-500 bg-amber-500/5' : ''
                  }`}
                  onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {getMetricIcon(metric.id)}
                        </div>
                        <div>
                          <span className="text-2xl">{metric.icon}</span>
                          <h4 className="font-bold text-foreground">{metric.name}</h4>
                        </div>
                      </div>
                      {expandedMetric === metric.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                    
                    {expandedMetric === metric.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 pt-3 border-t border-border"
                      >
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Formule</span>
                          <p className="text-sm font-mono text-primary mt-1">{metric.formula}</p>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium italic">
                          💡 {metric.importance}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* 9 Business Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NINE_BUSINESS_MODELS.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg hover:border-violet-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{model.icon}</span>
                      <h4 className="font-bold text-lg text-foreground">{model.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase">Métriques Clés</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {model.keyMetrics.map((m, i) => (
                            <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase">Exemples</span>
                        <p className="text-xs text-foreground/70 mt-1">{model.examples.join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Calculateur de Métriques SaaS</h3>
                  <p className="text-sm text-muted-foreground">Entrez vos données pour calculer vos métriques clés</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MRR (€)</label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={calcValues.mrr}
                      onChange={(e) => setCalcValues({...calcValues, mrr: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre de clients</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={calcValues.customers}
                      onChange={(e) => setCalcValues({...calcValues, customers: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CAC (€)</label>
                    <Input
                      type="number"
                      placeholder="200"
                      value={calcValues.cac}
                      onChange={(e) => setCalcValues({...calcValues, cac: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Churn mensuel (%)</label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={calcValues.churn}
                      onChange={(e) => setCalcValues({...calcValues, churn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">ARPU mensuel (€)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={calcValues.arpu}
                      onChange={(e) => setCalcValues({...calcValues, arpu: e.target.value})}
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">LTV</p>
                    <p className="text-3xl font-bold text-foreground">{calculateLTV()}€</p>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime Value</p>
                  </div>
                  <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">LTV/CAC</p>
                    <p className="text-3xl font-bold text-foreground">{calculateLTVCAC()}x</p>
                    <p className="text-xs text-muted-foreground mt-1">Objectif: &gt; 3x</p>
                  </div>
                  <div className="text-center p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
                    <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase mb-1">ARR</p>
                    <p className="text-3xl font-bold text-foreground">
                      {((parseFloat(calcValues.mrr) || 0) * 12 / 1000).toFixed(0)}k€
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Revenus annuels</p>
                  </div>
                </div>

                {/* Recommendations */}
                {parseFloat(calculateLTVCAC()) > 0 && (
                  <div className={`p-4 rounded-xl border ${
                    parseFloat(calculateLTVCAC()) >= 3 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <p className="text-sm font-medium">
                      {parseFloat(calculateLTVCAC()) >= 3 
                        ? "✅ Excellent! Votre ratio LTV/CAC est sain. Vous pouvez investir plus en acquisition."
                        : "⚠️ Attention: Votre ratio LTV/CAC est inférieur à 3x. Travaillez sur la rétention ou réduisez le CAC."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BMValidation;
