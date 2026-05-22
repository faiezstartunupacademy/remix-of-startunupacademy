import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, Users, Activity, Heart, Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface Project {
  id: string; name: string; sector: string | null; stage: string | null;
  current_step: number | null; overall_progress: number | null; status: string | null;
  has_users: boolean | null; user_count: number | null; has_revenue: boolean | null; revenue_amount: number | null;
  user_id: string; created_at: string;
}

const computeHealth = (p: Project): number => {
  let score = 0;
  score += Math.min(40, (p.overall_progress || 0) * 0.4);
  score += Math.min(20, (p.current_step || 0) * 3);
  if (p.has_users) score += 15;
  if (p.has_revenue) score += 15;
  if (p.user_count && p.user_count > 50) score += 5;
  if (p.revenue_amount && p.revenue_amount > 0) score += 5;
  return Math.round(Math.min(100, score));
};

const CohortAnalytics = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("incubation_projects").select("*").order("created_at", { ascending: false });
      if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
      else setProjects(data as Project[]);
      setLoading(false);
    })();
  }, []);

  const analytics = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === "active").length;
    const withRevenue = projects.filter(p => p.has_revenue).length;
    const withUsers = projects.filter(p => p.has_users).length;
    const avgProgress = total ? Math.round(projects.reduce((s, p) => s + (p.overall_progress || 0), 0) / total) : 0;
    const avgHealth = total ? Math.round(projects.reduce((s, p) => s + computeHealth(p), 0) / total) : 0;

    const sectors: Record<string, number> = {};
    projects.forEach(p => { const k = p.sector || "Non défini"; sectors[k] = (sectors[k] || 0) + 1; });
    const stages: Record<string, number> = {};
    projects.forEach(p => { const k = p.stage || "Non défini"; stages[k] = (stages[k] || 0) + 1; });
    const stepDistribution: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) stepDistribution[i] = projects.filter(p => p.current_step === i).length;

    const healthBuckets = { excellent: 0, good: 0, warning: 0, critical: 0 };
    projects.forEach(p => {
      const h = computeHealth(p);
      if (h >= 75) healthBuckets.excellent++;
      else if (h >= 50) healthBuckets.good++;
      else if (h >= 25) healthBuckets.warning++;
      else healthBuckets.critical++;
    });

    return { total, active, withRevenue, withUsers, avgProgress, avgHealth, sectors, stages, stepDistribution, healthBuckets };
  }, [projects]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Rapport Cohorte — Incubation", 14, 20);
    doc.setFontSize(10); doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 14, 28);
    let y = 40;
    doc.setFontSize(14); doc.text("Synthèse", 14, y); y += 8;
    doc.setFontSize(10);
    [
      `Total projets: ${analytics.total}`,
      `Projets actifs: ${analytics.active}`,
      `Avec utilisateurs: ${analytics.withUsers}`,
      `Avec revenu: ${analytics.withRevenue}`,
      `Progression moyenne: ${analytics.avgProgress}%`,
      `Health score moyen: ${analytics.avgHealth}/100`,
    ].forEach(line => { doc.text(line, 14, y); y += 6; });
    y += 6;
    doc.setFontSize(14); doc.text("Répartition par secteur", 14, y); y += 8;
    doc.setFontSize(10);
    Object.entries(analytics.sectors).forEach(([k, v]) => { doc.text(`• ${k}: ${v}`, 14, y); y += 6; });
    y += 4;
    doc.setFontSize(14); doc.text("Répartition par étape (1-7)", 14, y); y += 8;
    doc.setFontSize(10);
    Object.entries(analytics.stepDistribution).forEach(([k, v]) => { doc.text(`Étape ${k}: ${v} projet(s)`, 14, y); y += 6; });
    y += 4;
    doc.setFontSize(14); doc.text("Santé des projets", 14, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Excellent (75+): ${analytics.healthBuckets.excellent}`, 14, y); y += 6;
    doc.text(`Bon (50-74): ${analytics.healthBuckets.good}`, 14, y); y += 6;
    doc.text(`Attention (25-49): ${analytics.healthBuckets.warning}`, 14, y); y += 6;
    doc.text(`Critique (<25): ${analytics.healthBuckets.critical}`, 14, y);
    doc.save(`cohorte-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: "Rapport exporté" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const Bar = ({ label, count, max }: { label: string; count: number; max: number }) => (
    <div>
      <div className="flex justify-between text-sm mb-1"><span>{label}</span><span className="font-semibold">{count}</span></div>
      <Progress value={max ? (count / max) * 100 : 0} className="h-2" />
    </div>
  );

  const maxSector = Math.max(...Object.values(analytics.sectors), 1);
  const maxStage = Math.max(...Object.values(analytics.stepDistribution), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Analytics Cohorte</h2>
          <p className="text-sm text-muted-foreground">Vue d'ensemble des startups incubées</p>
        </div>
        <Button onClick={exportPDF}><Download className="h-4 w-4 mr-2" /> Exporter PDF</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Projets totaux", value: analytics.total, icon: Users, color: "text-primary" },
          { label: "Actifs", value: analytics.active, icon: Activity, color: "text-emerald-500" },
          { label: "Progression moy.", value: `${analytics.avgProgress}%`, icon: TrendingUp, color: "text-blue-500" },
          { label: "Santé moyenne", value: `${analytics.avgHealth}/100`, icon: Heart, color: "text-rose-500" },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
              <s.icon className={`h-7 w-7 ${s.color}`} />
            </div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Répartition par secteur</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(analytics.sectors).sort((a, b) => b[1] - a[1]).map(([k, v]) => <Bar key={k} label={k} count={v} max={maxSector} />)}
            {Object.keys(analytics.sectors).length === 0 && <p className="text-sm text-muted-foreground">Aucune donnée</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Distribution par étape</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(analytics.stepDistribution).map(([k, v]) => <Bar key={k} label={`Étape ${k}`} count={v} max={maxStage} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Santé des projets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { k: "excellent", label: "Excellent (75+)", color: "bg-emerald-500", v: analytics.healthBuckets.excellent },
              { k: "good", label: "Bon (50-74)", color: "bg-blue-500", v: analytics.healthBuckets.good },
              { k: "warning", label: "Attention (25-49)", color: "bg-amber-500", v: analytics.healthBuckets.warning },
              { k: "critical", label: "Critique (<25)", color: "bg-rose-500", v: analytics.healthBuckets.critical },
            ].map(b => (
              <div key={b.k} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${b.color}`} /><span className="text-sm">{b.label}</span></div>
                <Badge variant="secondary">{b.v}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Engagement</CardTitle><CardDescription>Traction des projets</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Avec utilisateurs</span><span className="font-semibold">{analytics.withUsers}/{analytics.total}</span></div>
              <Progress value={analytics.total ? (analytics.withUsers / analytics.total) * 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Avec revenu</span><span className="font-semibold">{analytics.withRevenue}/{analytics.total}</span></div>
              <Progress value={analytics.total ? (analytics.withRevenue / analytics.total) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CohortAnalytics;
