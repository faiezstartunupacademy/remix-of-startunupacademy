import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Kanban, Search, TrendingUp, DollarSign, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppRow {
  id: string;
  status: string;
  amount_requested_tnd: number | null;
  amount_awarded_tnd: number | null;
  user_id: string;
  match_score: number | null;
  next_action: string | null;
  next_action_date: string | null;
  created_at: string;
  program?: { name: string; organization: string; type: string } | null;
  profile?: { full_name: string | null } | null;
}

const COLS = [
  { id: "shortlist", label: "Shortlist", color: "bg-slate-500" },
  { id: "preparing", label: "Préparation", color: "bg-blue-500" },
  { id: "submitted", label: "Soumis", color: "bg-amber-500" },
  { id: "interview", label: "Entretien", color: "bg-purple-500" },
  { id: "accepted", label: "Accepté", color: "bg-emerald-500" },
  { id: "rejected", label: "Refusé", color: "bg-rose-500" },
];

const ApplicationsPipeline = () => {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("funding_applications")
        .select(`*, program:program_id (name, organization, type)`)
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        setLoading(false); return;
      }
      const userIds = [...new Set((data || []).map((a: any) => a.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const map = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      setApps((data || []).map((a: any) => ({ ...a, profile: map.get(a.user_id) || null })));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => apps.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return a.program?.name?.toLowerCase().includes(s) || a.profile?.full_name?.toLowerCase().includes(s) || a.program?.organization?.toLowerCase().includes(s);
  }), [apps, search, statusFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const totalRequested = filtered.reduce((s, a) => s + (a.amount_requested_tnd || 0), 0);
    const totalAwarded = filtered.filter(a => a.status === "accepted").reduce((s, a) => s + (a.amount_awarded_tnd || a.amount_requested_tnd || 0), 0);
    const decided = filtered.filter(a => a.status === "accepted" || a.status === "rejected").length;
    const winRate = decided > 0 ? Math.round((filtered.filter(a => a.status === "accepted").length / decided) * 100) : 0;
    return { total, totalRequested, totalAwarded, winRate };
  }, [filtered]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Kanban, color: "text-primary" },
          { label: "Demandé (TND)", value: stats.totalRequested.toLocaleString(), icon: Target, color: "text-blue-500" },
          { label: "Obtenu (TND)", value: stats.totalAwarded.toLocaleString(), icon: DollarSign, color: "text-emerald-500" },
          { label: "Taux de succès", value: `${stats.winRate}%`, icon: TrendingUp, color: "text-amber-500" },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold mt-1">{s.value}</p></div>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><Kanban className="h-5 w-5 text-primary" /> Pipeline Candidatures</CardTitle>
              <CardDescription>Vue d'ensemble des candidatures de toutes les startups</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-56" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {COLS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {COLS.map((col) => {
              const items = filtered.filter(a => a.status === col.id);
              return (
                <div key={col.id} className="space-y-2">
                  <div className="flex items-center justify-between sticky top-0 bg-background py-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${col.color}`} />
                      <span className="font-medium text-sm">{col.label}</span>
                    </div>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[200px]">
                    {items.map((a) => (
                      <div key={a.id} className="p-3 border rounded-lg bg-card hover:shadow-md transition-shadow">
                        <p className="font-medium text-xs line-clamp-2">{a.program?.name || "—"}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{a.profile?.full_name || "Anonyme"}</p>
                        {a.amount_requested_tnd && <p className="text-[11px] text-primary font-semibold mt-1">{a.amount_requested_tnd.toLocaleString()} TND</p>}
                        {a.match_score != null && <Badge variant="outline" className="mt-1 text-[10px]">Match {a.match_score}%</Badge>}
                      </div>
                    ))}
                    {items.length === 0 && <p className="text-[10px] text-center text-muted-foreground py-4">Vide</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsPipeline;
