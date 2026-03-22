import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BIProps {
  projectId: string;
}

interface MetricsData {
  ltv: number;
  cac: number;
  mrr: number;
  churn_rate: number;
  nps: number;
  users_count: number;
  revenue: number;
  burn_rate: number;
}

interface TestData {
  total: number;
  completed: number;
  validated: number;
  validation_rate: number;
}

export const BusinessIntelligenceDashboard = ({ projectId }: BIProps) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [tests, setTests] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBIData();
  }, [projectId]);

  const loadBIData = async () => {
    setLoading(true);
    try {
      // Load latest metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("mvp_metrics")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (metricsError && metricsError.code !== "PGRST116") throw metricsError;

      // Load test results
      const { data: testsData, error: testsError } = await supabase
        .from("mvp_test_results")
        .select("status")
        .eq("project_id", projectId);

      if (testsError) throw testsError;

      setMetrics(metricsData || {
        ltv: 0,
        cac: 0,
        mrr: 0,
        churn_rate: 0,
        nps: 0,
        users_count: 0,
        revenue: 0,
        burn_rate: 0,
      });

      const total = testsData?.length || 0;
      const completed = testsData?.filter(t => t.status === "completed").length || 0;
      const validated = testsData?.filter(t => t.status === "validated").length || 0;

      setTests({
        total,
        completed,
        validated,
        validation_rate: total > 0 ? (validated / total) * 100 : 0,
      });
    } catch (error: any) {
      console.error("BI data error:", error);
      toast({ title: "Erreur", description: "Impossible de charger les données BI", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = () => {
    if (!metrics || !tests) return 0;
    
    const ltvCacRatio = metrics.cac > 0 ? metrics.ltv / metrics.cac : 0;
    const ltvScore = Math.min((ltvCacRatio / 3) * 100, 100);
    const churnScore = Math.max(100 - (metrics.churn_rate * 2), 0);
    const npsScore = ((metrics.nps + 100) / 200) * 100;
    const validationScore = tests.validation_rate;

    return Math.round((ltvScore + churnScore + npsScore + validationScore) / 4);
  };

  const healthScore = getHealthScore();
  const getHealthColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 75) return CheckCircle2;
    if (score >= 50) return AlertCircle;
    return TrendingDown;
  };

  const HealthIcon = getHealthIcon(healthScore);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Health Score */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  Business Intelligence
                </CardTitle>
                <CardDescription>Pilotage global de la performance startup</CardDescription>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <HealthIcon className="h-3 w-3" />
                  Score Santé
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métriques Clés</TabsTrigger>
          <TabsTrigger value="economics">Unit Economics</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="growth">Croissance</TabsTrigger>
        </TabsList>

        {/* Métriques Clés */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <MetricCard
              title="MRR"
              value={`${metrics?.mrr || 0}€`}
              icon={DollarSign}
              color="from-green-500/20 to-emerald-500/20"
              iconColor="text-green-500"
            />
            <MetricCard
              title="Utilisateurs"
              value={metrics?.users_count || 0}
              icon={Users}
              color="from-blue-500/20 to-cyan-500/20"
              iconColor="text-blue-500"
            />
            <MetricCard
              title="NPS"
              value={metrics?.nps || 0}
              icon={Target}
              color="from-purple-500/20 to-pink-500/20"
              iconColor="text-purple-500"
            />
            <MetricCard
              title="Churn Rate"
              value={`${metrics?.churn_rate || 0}%`}
              icon={TrendingDown}
              color="from-orange-500/20 to-red-500/20"
              iconColor="text-orange-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Répartition Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ProgressBar label="MRR" value={metrics?.mrr || 0} max={10000} color="bg-green-500" />
                <ProgressBar label="Revenue Total" value={metrics?.revenue || 0} max={50000} color="bg-blue-500" />
                <ProgressBar label="Burn Rate" value={metrics?.burn_rate || 0} max={15000} color="bg-red-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unit Economics */}
        <TabsContent value="economics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  LTV (Lifetime Value)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{metrics?.ltv || 0}€</div>
                <p className="text-xs text-muted-foreground mt-1">Valeur vie client</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  CAC (Customer Acquisition Cost)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{metrics?.cac || 0}€</div>
                <p className="text-xs text-muted-foreground mt-1">Coût acquisition</p>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${
              (metrics?.ltv || 0) / (metrics?.cac || 1) >= 3
                ? "from-green-500/10 to-emerald-500/10 border-green-500/20"
                : "from-orange-500/10 to-red-500/10 border-orange-500/20"
            }`}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Ratio LTV/CAC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${
                  (metrics?.ltv || 0) / (metrics?.cac || 1) >= 3 ? "text-green-500" : "text-orange-500"
                }`}>
                  {metrics?.cac ? ((metrics.ltv || 0) / metrics.cac).toFixed(2) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(metrics?.ltv || 0) / (metrics?.cac || 1) >= 3 ? "✓ Excellent" : "⚠ À améliorer"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Interprétation Unit Economics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p><strong>LTV/CAC ≥ 3 :</strong> Modèle économique sain et scalable</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <p><strong>Payback period :</strong> Viser récupération CAC en 12 mois maximum</p>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                <p><strong>Levier prioritaire :</strong> {
                  (metrics?.ltv || 0) / (metrics?.cac || 1) < 3
                    ? "Augmenter LTV (upsell, retention) ou réduire CAC"
                    : "Optimiser l'expérience client pour maintenir le ratio"
                }</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <MetricCard
              title="Tests Totaux"
              value={tests?.total || 0}
              icon={Activity}
              color="from-blue-500/20 to-cyan-500/20"
              iconColor="text-blue-500"
            />
            <MetricCard
              title="Tests Complétés"
              value={tests?.completed || 0}
              icon={CheckCircle2}
              color="from-green-500/20 to-emerald-500/20"
              iconColor="text-green-500"
            />
            <MetricCard
              title="Taux Validation"
              value={`${tests?.validation_rate.toFixed(1) || 0}%`}
              icon={Target}
              color="from-purple-500/20 to-pink-500/20"
              iconColor="text-purple-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progression Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ProgressBar
                  label="Tests Complétés"
                  value={tests?.completed || 0}
                  max={tests?.total || 1}
                  color="bg-green-500"
                  percentage
                />
                <ProgressBar
                  label="Tests Validés"
                  value={tests?.validated || 0}
                  max={tests?.total || 1}
                  color="bg-purple-500"
                  percentage
                />
              </div>
            </CardContent>
          </Card>

          <Card className={`${
            (tests?.validation_rate || 0) >= 60
              ? "bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/20"
              : "bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20"
          }`}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                {(tests?.validation_rate || 0) >= 60 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                Recommandation Stratégique
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {(tests?.validation_rate || 0) >= 60 ? (
                <p>✓ Taux de validation sain (&gt;60%). Continuez le scaling et l'amélioration continue.</p>
              ) : (
                <p>⚠ Taux de validation faible (&lt;60%). Envisagez un pivot ou une réitération des hypothèses fondamentales.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Croissance */}
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Indicateurs de Croissance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Signaux Positifs
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {(metrics?.ltv || 0) / (metrics?.cac || 1) >= 3 && (
                      <li>✓ Ratio LTV/CAC optimal (&gt;3)</li>
                    )}
                    {(metrics?.churn_rate || 0) < 5 && (
                      <li>✓ Churn faible (&lt;5%)</li>
                    )}
                    {(metrics?.nps || 0) > 30 && (
                      <li>✓ NPS positif (&gt;30)</li>
                    )}
                    {(tests?.validation_rate || 0) >= 60 && (
                      <li>✓ Validation forte (&gt;60%)</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Points d'Attention
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {(metrics?.ltv || 0) / (metrics?.cac || 1) < 3 && (
                      <li>⚠ Optimiser ratio LTV/CAC</li>
                    )}
                    {(metrics?.churn_rate || 0) >= 5 && (
                      <li>⚠ Réduire le churn</li>
                    )}
                    {(metrics?.nps || 0) <= 30 && (
                      <li>⚠ Améliorer satisfaction client</li>
                    )}
                    {(tests?.validation_rate || 0) < 60 && (
                      <li>⚠ Renforcer validation hypothèses</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, icon: Icon, color, iconColor }: any) => (
  <Card className={`bg-gradient-to-br ${color} border-${iconColor.replace("text-", "")}-500/20`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-xs font-medium flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${iconColor}`}>{value}</div>
    </CardContent>
  </Card>
);

const ProgressBar = ({ label, value, max, color, percentage }: any) => {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {percentage ? `${percent.toFixed(0)}%` : `${value}/${max}`}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
