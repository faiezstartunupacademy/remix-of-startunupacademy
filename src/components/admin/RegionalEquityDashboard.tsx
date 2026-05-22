import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TunisiaMap } from "@/components/maps/TunisiaMap";
import { TUNISIA_GOVERNORATES } from "@/data/tunisiaGovernorates";
import { MapPin, Users, FolderKanban, Rocket, Coins, TrendingDown } from "lucide-react";

type Row = {
  governorate: string;
  users_count: number;
  projects_count: number;
  startups_count: number;
  targeted_programs_count: number;
};

type Metric = "users_count" | "projects_count" | "startups_count" | "targeted_programs_count";

const METRIC_LABEL: Record<Metric, string> = {
  users_count: "Utilisateurs",
  projects_count: "Projets incubés",
  startups_count: "Startups marketplace",
  targeted_programs_count: "Programmes ciblés",
};

export const RegionalEquityDashboard = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [metric, setMetric] = useState<Metric>("users_count");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // @ts-expect-error view not in generated types
      const { data, error } = await supabase.from("regional_equity_stats").select("*");
      if (!error && data) setRows(data as Row[]);
      setLoading(false);
    })();
  }, []);

  const values = useMemo(() => Object.fromEntries(rows.map((r) => [r.governorate, r[metric]])), [rows, metric]);

  // Equity index: lower coefficient of variation = more equitable
  const equity = useMemo(() => {
    const arr = rows.map((r) => r[metric]);
    if (!arr.length) return { gini: 0, underserved: [] as string[] };
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    const underserved = rows
      .filter((r) => r[metric] < mean * 0.5)
      .map((r) => r.governorate)
      .slice(0, 8);
    return { gini: Math.min(1, cv / 2), underserved };
  }, [rows, metric]);

  const totals = useMemo(() => {
    const t = { users_count: 0, projects_count: 0, startups_count: 0, targeted_programs_count: 0 };
    rows.forEach((r) => {
      t.users_count += r.users_count;
      t.projects_count += r.projects_count;
      t.startups_count += r.startups_count;
      t.targeted_programs_count += r.targeted_programs_count;
    });
    return t;
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Users className="h-4 w-4" />} label="Utilisateurs" value={totals.users_count} />
        <StatCard icon={<FolderKanban className="h-4 w-4" />} label="Projets" value={totals.projects_count} />
        <StatCard icon={<Rocket className="h-4 w-4" />} label="Startups" value={totals.startups_count} />
        <StatCard icon={<Coins className="h-4 w-4" />} label="Programmes ciblés" value={totals.targeted_programs_count} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Carte d'équité régionale</CardTitle>
            <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
              <TabsList>
                <TabsTrigger value="users_count">Users</TabsTrigger>
                <TabsTrigger value="projects_count">Projets</TabsTrigger>
                <TabsTrigger value="startups_count">Startups</TabsTrigger>
                <TabsTrigger value="targeted_programs_count">Programmes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[520px] flex items-center justify-center text-muted-foreground">Chargement…</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <TunisiaMap values={values} label={METRIC_LABEL[metric]} />
              </div>
              <div className="space-y-3">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="text-xs text-muted-foreground">Indice d'inégalité (0 = parfait, 1 = très inégal)</div>
                    <div className="text-3xl font-bold mt-1">{equity.gini.toFixed(2)}</div>
                    <div className="text-xs mt-1 text-muted-foreground">{METRIC_LABEL[metric]}</div>
                  </CardContent>
                </Card>
                <Card className="border-destructive/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-destructive" /> Gouvernorats sous-desservis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {equity.underserved.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Bonne répartition 🎉</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {equity.underserved.map((g) => (
                          <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2">Cibles &lt; 50% de la moyenne — prioriser les programmes ici.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détail par gouvernorat</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr>
                <th className="py-2 pr-3">Gouvernorat</th>
                <th className="py-2 pr-3">Région</th>
                <th className="py-2 pr-3 text-right">Users</th>
                <th className="py-2 pr-3 text-right">Projets</th>
                <th className="py-2 pr-3 text-right">Startups</th>
                <th className="py-2 pr-3 text-right">Programmes</th>
              </tr>
            </thead>
            <tbody>
              {TUNISIA_GOVERNORATES.map((g) => {
                const r = rows.find((x) => x.governorate === g.name);
                return (
                  <tr key={g.name} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 pr-3 font-medium">{g.name}</td>
                    <td className="py-2 pr-3 text-muted-foreground text-xs">{g.region}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r?.users_count ?? 0}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r?.projects_count ?? 0}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r?.startups_count ?? 0}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r?.targeted_programs_count ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card>
    <CardContent className="pt-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">{icon}{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </CardContent>
  </Card>
);

export default RegionalEquityDashboard;
