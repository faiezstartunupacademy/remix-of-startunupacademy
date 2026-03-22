import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Rocket, Search, GraduationCap, MessageSquare, Folder, Eye, Brain, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StrategicProject {
  id: string; name: string; sector: string | null; startup_stage: string | null;
  has_idea: boolean | null; current_phase: number; incubation_active: boolean | null;
  completed_at: string | null; created_at: string; updated_at: string; user_id: string;
  user_name?: string; message_count?: number;
}

interface IncubationProjectRow {
  id: string; name: string; description: string | null; sector: string | null;
  stage: string | null; current_step: number | null; overall_progress: number | null;
  status: string | null; created_at: string; user_id: string; user_name?: string;
  business_model: string | null;
}

const AdminProjectsList = () => {
  const { toast } = useToast();
  const [strategicProjects, setStrategicProjects] = useState<StrategicProject[]>([]);
  const [incubationProjects, setIncubationProjects] = useState<IncubationProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [accessRequests, setAccessRequests] = useState<any[]>([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [{ data: stratData }, { data: incData }, { data: profiles }, { data: messages }, { data: requests }] = await Promise.all([
        supabase.from("strategic_projects").select("*").order("updated_at", { ascending: false }),
        supabase.from("incubation_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, full_name"),
        supabase.from("strategic_messages").select("project_id"),
        supabase.from("strategic_access_requests" as any).select("user_id, status, user_name"),
      ]);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Sans nom"]));
      const countMap = new Map<string, number>();
      (messages || []).forEach(m => countMap.set(m.project_id, (countMap.get(m.project_id) || 0) + 1));

      setStrategicProjects((stratData || []).map(p => ({
        ...p, startup_stage: p.startup_stage || "student", has_idea: p.has_idea ?? false,
        incubation_active: p.incubation_active ?? false,
        user_name: profileMap.get(p.user_id) || p.user_id.slice(0, 8),
        message_count: countMap.get(p.id) || 0,
      })));

      setIncubationProjects((incData || []).map(p => ({
        ...p, user_name: profileMap.get(p.user_id) || p.user_id.slice(0, 8),
      })));

      setAccessRequests(requests || []);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredStrategic = strategicProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredIncubation = incubationProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const approvedUsers = accessRequests.filter((r: any) => r.status === "approved").length;
  const trainersCount = new Set(strategicProjects.map(p => p.user_id)).size;

  const stats = {
    totalStrategic: strategicProjects.length,
    totalIncubation: incubationProjects.length,
    approvedUsers,
    uniqueUsers: trainersCount,
  };

  if (loading) {
    return <Card><CardContent className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <Rocket className="h-5 w-5 mx-auto text-primary mb-1" />
          <p className="text-2xl font-bold">{stats.totalStrategic}</p>
          <p className="text-xs text-muted-foreground">Projets Stratégiques</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Brain className="h-5 w-5 mx-auto text-orange-500 mb-1" />
          <p className="text-2xl font-bold">{stats.totalIncubation}</p>
          <p className="text-xs text-muted-foreground">Projets Incubation</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <GraduationCap className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
          <p className="text-2xl font-bold">{stats.approvedUsers}</p>
          <p className="text-xs text-muted-foreground">Accès autorisés</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Folder className="h-5 w-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
          <p className="text-xs text-muted-foreground">Utilisateurs actifs</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Tous les Projets
              </CardTitle>
              <CardDescription>
                {stats.totalStrategic} stratégiques · {stats.totalIncubation} incubation · {stats.approvedUsers} accès autorisés par admin
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strategic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="strategic" className="gap-1.5"><Rocket className="h-3.5 w-3.5" /> Stratégiques ({filteredStrategic.length})</TabsTrigger>
              <TabsTrigger value="incubation" className="gap-1.5"><Brain className="h-3.5 w-3.5" /> Incubation ({filteredIncubation.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="strategic">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projet</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Stade</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStrategic.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun projet trouvé</TableCell></TableRow>
                    ) : filteredStrategic.map(p => (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <span className="font-medium">{p.name}</span>
                          {p.sector && <p className="text-xs text-muted-foreground">{p.sector}</p>}
                        </TableCell>
                        <TableCell className="text-sm">{p.user_name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs"><GraduationCap className="h-3 w-3 mr-1" />{p.startup_stage}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5,6,7].map(ph => (
                              <div key={ph} className={`h-1.5 w-3 rounded-full ${ph <= p.current_phase ? "bg-primary" : "bg-muted"}`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{p.current_phase}/7</span>
                        </TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><MessageSquare className="h-3 w-3" />{p.message_count}</div></TableCell>
                        <TableCell>
                          {p.incubation_active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">🎓 Incubation</Badge>
                          ) : p.completed_at ? (
                            <Badge variant="secondary" className="text-xs">✅ Achevé</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">En cours</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="incubation">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projet</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Étape</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncubation.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun projet trouvé</TableCell></TableRow>
                    ) : filteredIncubation.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <span className="font-medium">{p.name}</span>
                          {p.business_model && <p className="text-xs text-muted-foreground">BM: {p.business_model}</p>}
                        </TableCell>
                        <TableCell className="text-sm">{p.user_name}</TableCell>
                        <TableCell>{p.sector ? <Badge variant="secondary" className="text-xs">{p.sector}</Badge> : "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5,6,7].map(s => (
                              <div key={s} className={`h-1.5 w-3 rounded-full ${s <= (p.current_step || 1) ? "bg-primary" : "bg-muted"}`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{p.current_step || 1}/7</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${p.overall_progress || 0}%` }} />
                            </div>
                            <span className="text-xs font-medium">{Math.round(p.overall_progress || 0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs">
                            {p.status === "active" ? "Actif" : p.status || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                            <Link to={`/strategic-console/${p.id}`}>
                              <Eye className="h-3 w-3" /> Voir
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjectsList;
