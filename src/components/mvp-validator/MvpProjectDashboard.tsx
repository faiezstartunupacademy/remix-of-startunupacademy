import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, Play, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import StartupActMaturityDashboard from "./StartupActMaturityDashboard";

type Props = {
  project: {
    id: string;
    name: string;
    sector: string;
    scenario: string;
  };
};

const MvpProjectDashboard = ({ project }: Props) => {
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0, in_progress: 0, not_started: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [project.id]);

  const loadStats = async () => {
    // Get available tests for this project
    const { data: tests } = await supabase.from("mvp_tests_library" as any).select("id");
    const { data: results } = await supabase.from("mvp_test_results" as any).select("status").eq("project_id", project.id);

    const totalTests = tests?.length || 0;
    const resultsList = (results as any[]) || [];
    const passed = resultsList.filter(r => r.status === "passed").length;
    const failed = resultsList.filter(r => r.status === "failed").length;
    const in_progress = resultsList.filter(r => r.status === "in_progress").length;
    const not_started = totalTests - passed - failed - in_progress;

    setStats({ total: totalTests, passed, failed, in_progress, not_started });
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const completionRate = stats.total > 0 ? Math.round(((stats.passed + stats.failed) / stats.total) * 100) : 0;
  const successRate = (stats.passed + stats.failed) > 0 ? Math.round((stats.passed / (stats.passed + stats.failed)) * 100) : 0;

  const kpis = [
    { label: "Tests disponibles", value: stats.total, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Réussis", value: stats.passed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Échoués", value: stats.failed, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "En cours", value: stats.in_progress, icon: Play, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="pt-4 text-center">
                <div className={`p-2 rounded-full ${kpi.bg} w-fit mx-auto mb-2`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{completionRate}%</p>
            <Progress value={completionRate} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{stats.passed + stats.failed} / {stats.total} tests exécutés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold mb-2 ${successRate >= 60 ? "text-emerald-500" : successRate >= 30 ? "text-amber-500" : "text-red-500"}`}>
              {successRate}%
            </p>
            <Progress value={successRate} className={`h-3 ${successRate >= 60 ? "[&>div]:bg-emerald-500" : successRate >= 30 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"}`} />
            <p className="text-xs text-muted-foreground mt-2">{stats.passed} réussis sur {stats.passed + stats.failed} exécutés</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Résumé du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Secteur</p>
              <p className="font-medium">{project.sector}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Scénario</p>
              <p className="font-medium">{project.scenario === "A" ? "Idée seule" : "Idée + BM validé"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Startup Act Maturity Dashboard */}
      <StartupActMaturityDashboard
        projectId={project.id}
        sector={project.sector}
        scenario={project.scenario}
      />
    </div>
  );
};

export default MvpProjectDashboard;
