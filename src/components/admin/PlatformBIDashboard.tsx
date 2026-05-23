import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { Loader2, Briefcase, Users, MapPin, Wallet, TrendingUp, Flame } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--destructive))", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function PlatformBIDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalStartups: 0,
    totalUsers: 0,
    totalFundingApps: 0,
    totalDeals: 0,
    bySector: [] as { name: string; value: number }[],
    byStage: [] as { name: string; value: number }[],
    byWilaya: [] as { name: string; value: number }[],
    heatmap: [] as { sector: string; goal: string; count: number }[],
    goalsList: [] as string[],
    sectorsList: [] as string[],
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: profiles }, { count: userCount }, { count: appCount }, { count: dealCount }] = await Promise.all([
      supabase.from("profiles").select("startup_sector, startup_stage, wilaya, startup_goals").not("startup_name", "is", null),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("funding_applications").select("*", { count: "exact", head: true }),
      supabase.from("deal_room_deals").select("*", { count: "exact", head: true }),
    ]);

    const sectorMap: Record<string, number> = {};
    const stageMap: Record<string, number> = {};
    const wilayaMap: Record<string, number> = {};
    const heatMap: Record<string, Record<string, number>> = {};
    const goalsSet = new Set<string>();
    const sectorsSet = new Set<string>();

    (profiles || []).forEach((p: any) => {
      if (p.startup_sector) { sectorMap[p.startup_sector] = (sectorMap[p.startup_sector] || 0) + 1; sectorsSet.add(p.startup_sector); }
      if (p.startup_stage) stageMap[p.startup_stage] = (stageMap[p.startup_stage] || 0) + 1;
      if (p.wilaya) wilayaMap[p.wilaya] = (wilayaMap[p.wilaya] || 0) + 1;
      const goals = Array.isArray(p.startup_goals) ? p.startup_goals : [];
      goals.forEach((g: string) => {
        goalsSet.add(g);
        if (p.startup_sector) {
          heatMap[p.startup_sector] = heatMap[p.startup_sector] || {};
          heatMap[p.startup_sector][g] = (heatMap[p.startup_sector][g] || 0) + 1;
        }
      });
    });

    const goalsList = Array.from(goalsSet);
    const sectorsList = Array.from(sectorsSet);
    const heatmap: any[] = [];
    sectorsList.forEach(s => goalsList.forEach(g => heatmap.push({ sector: s, goal: g, count: heatMap[s]?.[g] || 0 })));

    setData({
      totalStartups: (profiles || []).length,
      totalUsers: userCount || 0,
      totalFundingApps: appCount || 0,
      totalDeals: dealCount || 0,
      bySector: Object.entries(sectorMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      byStage: Object.entries(stageMap).map(([name, value]) => ({ name, value })),
      byWilaya: Object.entries(wilayaMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
      heatmap, goalsList, sectorsList,
    });
    setLoading(false);
  }

  if (loading) return <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>;

  const kpis = [
    { label: "Startups actives", value: data.totalStartups, icon: Briefcase, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Utilisateurs", value: data.totalUsers, icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { label: "Candidatures funding", value: data.totalFundingApps, icon: Wallet, color: "text-violet-600 bg-violet-500/10" },
    { label: "Deals en cours", value: data.totalDeals, icon: TrendingUp, color: "text-orange-600 bg-orange-500/10" },
  ];

  const maxHeat = Math.max(1, ...data.heatmap.map(h => h.count));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <Card key={k.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{k.label}</p>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${k.color}`}>
                <k.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Startups par secteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bySector} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Distribution des stades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.byStage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e: any) => `${e.name} (${e.value})`}>
                    {data.byStage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Top 10 gouvernorats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byWilaya}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Heatmap besoins × secteur</CardTitle>
            <CardDescription>Combien de startups demandent chaque type d'aide par secteur</CardDescription>
          </CardHeader>
          <CardContent>
            {data.sectorsList.length === 0 || data.goalsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Pas encore de données suffisantes.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left p-1.5 font-medium">Secteur</th>
                      {data.goalsList.map(g => <th key={g} className="p-1.5 font-medium text-center">{g}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.sectorsList.map(s => (
                      <tr key={s}>
                        <td className="p-1.5 font-medium border-t">{s}</td>
                        {data.goalsList.map(g => {
                          const c = data.heatmap.find(h => h.sector === s && h.goal === g)?.count || 0;
                          const intensity = c / maxHeat;
                          return (
                            <td key={g} className="p-1.5 text-center border-t" style={{ backgroundColor: c > 0 ? `hsl(var(--primary) / ${intensity * 0.7 + 0.1})` : "transparent", color: intensity > 0.5 ? "white" : undefined }}>
                              {c > 0 ? c : "·"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
