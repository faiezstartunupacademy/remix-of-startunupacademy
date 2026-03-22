import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Activity, Layers, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useMarketplaceStartups } from "@/hooks/useMarketplace";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

const MarketplaceTrends = () => {
  const { t } = useTranslation();
  const { data: topStartups } = useMarketplaceStartups({ sort: "votes", limit: 50 });

  const sectorData = topStartups?.reduce((acc: Record<string, number>, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {}) || {};

  const stageData = topStartups?.reduce((acc: Record<string, number>, s) => {
    acc[s.stage] = (acc[s.stage] || 0) + 1;
    return acc;
  }, {}) || {};

  const categoryData = topStartups?.reduce((acc: Record<string, number>, s: any) => {
    const cat = s.category || "product";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};

  const sectorChartData = Object.entries(sectorData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const stageChartData = Object.entries(stageData).map(([name, value]) => ({ name, value }));
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const votesChartData = topStartups?.slice(0, 10).map(s => ({ name: s.name.slice(0, 15), votes: s.votes_count, views: s.views_count })) || [];

  const totalVotes = topStartups?.reduce((s, t) => s + t.votes_count, 0) || 0;
  const totalViews = topStartups?.reduce((s, t) => s + t.views_count, 0) || 0;
  const totalComments = topStartups?.reduce((s, t) => s + t.comments_count, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t("marketplace.trends")}</h2>
        <p className="text-muted-foreground">Chiffres clés et visualisations du marketplace</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: TrendingUp, label: "Startups", value: topStartups?.length || 0 },
          { icon: BarChart3, label: "Votes totaux", value: totalVotes },
          { icon: Activity, label: "Vues totales", value: totalViews },
          { icon: Layers, label: "Commentaires", value: totalComments },
          { icon: Tag, label: "Secteurs", value: Object.keys(sectorData).length },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <kpi.icon className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">{kpi.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trending Products */}
      {votesChartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>🔥 Top 10 — Startups Trending</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topStartups?.slice(0, 10).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <span className="text-lg font-bold text-muted-foreground w-8 text-center">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">{s.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.sector}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <Badge variant="outline">⬆ {s.votes_count}</Badge>
                    <Badge variant="secondary">{s.views_count} vues</Badge>
                    <Badge variant="outline">{s.comments_count} avis</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sector Distribution */}
        <Card>
          <CardHeader><CardTitle>Répartition par secteur</CardTitle></CardHeader>
          <CardContent>
            {sectorChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={sectorChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {sectorChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-12">Pas de données</p>}
          </CardContent>
        </Card>

        {/* By Stage */}
        <Card>
          <CardHeader><CardTitle>Répartition par phase</CardTitle></CardHeader>
          <CardContent>
            {stageChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" /><YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-12">Pas de données</p>}
          </CardContent>
        </Card>

        {/* By Category */}
        <Card>
          <CardHeader><CardTitle>Répartition par catégorie</CardTitle></CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-12">Pas de données</p>}
          </CardContent>
        </Card>

        {/* Votes Chart */}
        <Card>
          <CardHeader><CardTitle>Votes par startup</CardTitle></CardHeader>
          <CardContent>
            {votesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={votesChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-12">Pas de données</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketplaceTrends;
