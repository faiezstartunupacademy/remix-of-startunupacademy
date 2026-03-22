import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Users, BarChart3 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from "recharts";

type Metric = {
  id: string;
  project_id: string;
  month: string;
  cac: number;
  ltv: number;
  churn_rate: number;
  mrr: number;
  nps: number;
  burn_rate: number;
  revenue: number;
  users_count: number;
};

const MvpMetricsDashboard = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    month: "", cac: 0, ltv: 0, churn_rate: 0, mrr: 0, nps: 0, burn_rate: 0, revenue: 0, users_count: 0
  });

  useEffect(() => { loadMetrics(); }, [projectId]);

  const loadMetrics = async () => {
    const { data } = await supabase
      .from("mvp_metrics" as any).select("*")
      .eq("project_id", projectId).order("month", { ascending: true });
    if (data) setMetrics(data as any[]);
  };

  const addMetric = async () => {
    if (!form.month) return;
    const { error } = await supabase.from("mvp_metrics" as any).insert({ ...form, project_id: projectId } as any);
    if (!error) { loadMetrics(); setShowForm(false); setForm({ month: "", cac: 0, ltv: 0, churn_rate: 0, mrr: 0, nps: 0, burn_rate: 0, revenue: 0, users_count: 0 }); toast({ title: "Métrique ajoutée" }); }
  };

  const deleteMetric = async (id: string) => {
    await supabase.from("mvp_metrics" as any).delete().eq("id", id);
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  const latest = metrics[metrics.length - 1];
  const prev = metrics[metrics.length - 2];
  const ltvCacRatio = latest && latest.cac > 0 ? (latest.ltv / latest.cac).toFixed(1) : "—";
  const runway = latest && latest.burn_rate > 0 ? Math.round(latest.revenue / latest.burn_rate * 12) : 0;

  const kpis = latest ? [
    { label: "CAC", value: `${latest.cac} TND`, icon: DollarSign, trend: prev ? latest.cac < prev.cac : false, color: "text-blue-500" },
    { label: "LTV", value: `${latest.ltv} TND`, icon: TrendingUp, trend: prev ? latest.ltv > prev.ltv : false, color: "text-emerald-500" },
    { label: "LTV/CAC", value: ltvCacRatio, icon: BarChart3, trend: Number(ltvCacRatio) >= 3, color: "text-violet-500" },
    { label: "MRR", value: `${latest.mrr} TND`, icon: DollarSign, trend: prev ? latest.mrr > prev.mrr : false, color: "text-amber-500" },
    { label: "Churn", value: `${latest.churn_rate}%`, icon: TrendingDown, trend: prev ? latest.churn_rate < prev.churn_rate : false, color: "text-red-500" },
    { label: "NPS", value: latest.nps, icon: Users, trend: latest.nps >= 50, color: "text-teal-500" },
    { label: "Burn Rate", value: `${latest.burn_rate} TND`, icon: DollarSign, trend: false, color: "text-orange-500" },
    { label: "Runway", value: `${runway} mois`, icon: TrendingUp, trend: runway >= 12, color: "text-indigo-500" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map(kpi => (
            <Card key={kpi.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <p className="text-lg font-bold">{kpi.value}</p>
                <Badge variant={kpi.trend ? "default" : "secondary"} className="text-[10px] mt-1">
                  {kpi.trend ? "✓ Bon" : "⚠ À surveiller"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      {metrics.length >= 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Revenus & MRR</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" opacity={0.3} />
                  <Line type="monotone" dataKey="mrr" name="MRR" stroke="hsl(var(--primary))" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">CAC vs LTV</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cac" name="CAC" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="ltv" name="LTV" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Churn & NPS</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="churn_rate" name="Churn %" fill="#fbbf24" fillOpacity={0.2} stroke="#f59e0b" />
                  <Line yAxisId="right" type="monotone" dataKey="nps" name="NPS" stroke="#8b5cf6" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Burn Rate & Utilisateurs</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="burn_rate" name="Burn Rate" fill="#f97316" opacity={0.5} />
                  <Line yAxisId="right" type="monotone" dataKey="users_count" name="Utilisateurs" stroke="#06b6d4" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add form */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Données mensuelles ({metrics.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter mois
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><Label>Mois</Label><Input placeholder="Jan 2026" value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))} /></div>
              <div><Label>CAC (TND)</Label><Input type="number" value={form.cac} onChange={e => setForm(p => ({ ...p, cac: Number(e.target.value) }))} /></div>
              <div><Label>LTV (TND)</Label><Input type="number" value={form.ltv} onChange={e => setForm(p => ({ ...p, ltv: Number(e.target.value) }))} /></div>
              <div><Label>Churn %</Label><Input type="number" value={form.churn_rate} onChange={e => setForm(p => ({ ...p, churn_rate: Number(e.target.value) }))} /></div>
              <div><Label>MRR (TND)</Label><Input type="number" value={form.mrr} onChange={e => setForm(p => ({ ...p, mrr: Number(e.target.value) }))} /></div>
              <div><Label>NPS</Label><Input type="number" value={form.nps} onChange={e => setForm(p => ({ ...p, nps: Number(e.target.value) }))} /></div>
              <div><Label>Burn Rate</Label><Input type="number" value={form.burn_rate} onChange={e => setForm(p => ({ ...p, burn_rate: Number(e.target.value) }))} /></div>
              <div><Label>Revenue</Label><Input type="number" value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: Number(e.target.value) }))} /></div>
              <div><Label>Utilisateurs</Label><Input type="number" value={form.users_count} onChange={e => setForm(p => ({ ...p, users_count: Number(e.target.value) }))} /></div>
            </div>
            <Button onClick={addMetric}>Enregistrer</Button>
          </CardContent>
        </Card>
      )}

      {/* Data table */}
      {metrics.length > 0 && (
        <Card>
          <CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  {["Mois","CAC","LTV","Churn%","MRR","NPS","Burn","Revenue","Users",""].map(h => <th key={h} className="p-2 text-left">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {metrics.map(m => (
                  <tr key={m.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{m.month}</td>
                    <td className="p-2">{m.cac}</td>
                    <td className="p-2">{m.ltv}</td>
                    <td className="p-2">{m.churn_rate}%</td>
                    <td className="p-2">{m.mrr}</td>
                    <td className="p-2">{m.nps}</td>
                    <td className="p-2">{m.burn_rate}</td>
                    <td className="p-2">{m.revenue}</td>
                    <td className="p-2">{m.users_count}</td>
                    <td className="p-2"><Button variant="ghost" size="icon" onClick={() => deleteMetric(m.id)} className="h-6 w-6"><Trash2 className="h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MvpMetricsDashboard;
