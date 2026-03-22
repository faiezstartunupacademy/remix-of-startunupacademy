import { useState, useEffect } from "react";
import { Loader2, Rocket, Search, GraduationCap, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectRow {
  id: string;
  name: string;
  sector: string | null;
  startup_stage: string | null;
  has_idea: boolean | null;
  current_phase: number;
  incubation_active: boolean | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_name?: string;
  message_count?: number;
}

const AdminProjectsList = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // Fetch all projects (admin RLS allows this via service role or admin policy)
      const { data: projectsData, error: pErr } = await supabase
        .from("strategic_projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (pErr) throw pErr;

      // Fetch profiles to map user names
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Sans nom"]));

      // Fetch message counts per project
      const { data: messages } = await supabase
        .from("strategic_messages")
        .select("project_id");

      const countMap = new Map<string, number>();
      (messages || []).forEach(m => {
        countMap.set(m.project_id, (countMap.get(m.project_id) || 0) + 1);
      });

      const enriched: ProjectRow[] = (projectsData || []).map(p => ({
        ...p,
        startup_stage: p.startup_stage || "student",
        has_idea: p.has_idea ?? false,
        incubation_active: p.incubation_active ?? false,
        user_name: profileMap.get(p.user_id) || p.user_id.slice(0, 8),
        message_count: countMap.get(p.id) || 0,
      }));

      setProjects(enriched);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    incubation: projects.filter(p => p.incubation_active).length,
    completed: projects.filter(p => p.completed_at).length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Projets Stratégiques
            </CardTitle>
            <CardDescription>
              {stats.total} projets — {stats.incubation} en incubation — {stats.completed} achevés
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <span className="font-medium">{p.name}</span>
                          {p.sector && <p className="text-xs text-muted-foreground">{p.sector}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.user_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {p.startup_stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5, 6, 7].map(ph => (
                            <div key={ph} className={`h-1.5 w-3 rounded-full ${ph <= p.current_phase ? "bg-primary" : "bg-muted"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{p.current_phase}/7</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MessageSquare className="h-3 w-3" />
                          {p.message_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.incubation_active ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">🎓 Incubation</Badge>
                        ) : p.completed_at ? (
                          <Badge variant="secondary" className="text-xs">✅ Achevé</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">En cours</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProjectsList;
