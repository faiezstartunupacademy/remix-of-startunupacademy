import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Loader2, Rocket, Search, GraduationCap, MessageSquare, Folder, Eye, Brain,
  ShieldBan, ShieldCheck, ChevronDown, ChevronUp, Users, Clock, Check, X, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface StrategicProject {
  id: string; name: string; sector: string | null; startup_stage: string | null;
  has_idea: boolean | null; current_phase: number; incubation_active: boolean | null;
  completed_at: string | null; created_at: string; updated_at: string; user_id: string;
  description: string | null; is_blocked: boolean; blocked_reason: string | null;
  user_name?: string; message_count?: number;
}

interface IncubationProjectRow {
  id: string; name: string; description: string | null; sector: string | null;
  stage: string | null; current_step: number | null; overall_progress: number | null;
  status: string | null; created_at: string; user_id: string; user_name?: string;
  business_model: string | null; is_blocked: boolean; blocked_reason: string | null;
  problem_description: string | null; solution_description: string | null;
  target_customers: string | null; differentiator: string | null;
}

interface AccessRequest {
  id: string; user_id: string; user_name: string | null; user_email: string | null;
  startup_name: string | null; sector: string | null; motivation: string | null;
  status: string; admin_response: string | null; created_at: string;
}

const AdminProjectsList = () => {
  const { toast } = useToast();
  const [strategicProjects, setStrategicProjects] = useState<StrategicProject[]>([]);
  const [incubationProjects, setIncubationProjects] = useState<IncubationProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [expandedStrategic, setExpandedStrategic] = useState<string | null>(null);
  const [expandedIncubation, setExpandedIncubation] = useState<string | null>(null);
  const [blockReasons, setBlockReasons] = useState<Record<string, string>>({});
  const [blockingId, setBlockingId] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [{ data: stratData }, { data: incData }, { data: profiles }, { data: messages }, { data: requests }] = await Promise.all([
        supabase.from("strategic_projects").select("*").order("updated_at", { ascending: false }),
        supabase.from("incubation_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, full_name"),
        supabase.from("strategic_messages").select("project_id"),
        supabase.from("strategic_access_requests" as any).select("*").order("created_at", { ascending: false }),
      ]);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Sans nom"]));
      const countMap = new Map<string, number>();
      (messages || []).forEach(m => countMap.set(m.project_id, (countMap.get(m.project_id) || 0) + 1));

      setStrategicProjects((stratData || []).map(p => ({
        ...p, startup_stage: p.startup_stage || "student", has_idea: p.has_idea ?? false,
        incubation_active: p.incubation_active ?? false,
        is_blocked: (p as any).is_blocked ?? false,
        blocked_reason: (p as any).blocked_reason ?? null,
        user_name: profileMap.get(p.user_id) || p.user_id.slice(0, 8),
        message_count: countMap.get(p.id) || 0,
      })));

      setIncubationProjects((incData || []).map(p => ({
        ...p,
        is_blocked: (p as any).is_blocked ?? false,
        blocked_reason: (p as any).blocked_reason ?? null,
        user_name: profileMap.get(p.user_id) || p.user_id.slice(0, 8),
      })));

      setAccessRequests((requests || []) as any);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const setBlockReasonForProject = (projectId: string, reason: string) => {
    setBlockReasons(prev => ({ ...prev, [projectId]: reason }));
  };

  const toggleBlockStrategic = async (project: StrategicProject) => {
    const newBlocked = !project.is_blocked;
    const reason = blockReasons[project.id] || "";
    if (newBlocked && !reason.trim()) {
      toast({ title: "Motif requis", description: "Veuillez indiquer la raison du blocage", variant: "destructive" });
      return;
    }
    setBlockingId(project.id);
    try {
      await supabase.from("strategic_projects").update({
        is_blocked: newBlocked,
        blocked_reason: newBlocked ? reason : null,
      } as any).eq("id", project.id);
      toast({ title: newBlocked ? "🚫 Projet bloqué" : "✅ Projet débloqué" });
      setBlockReasonForProject(project.id, "");
      fetchAll();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setBlockingId(null);
    }
  };

  const toggleBlockIncubation = async (project: IncubationProjectRow) => {
    const newBlocked = !project.is_blocked;
    const reason = blockReasons[project.id] || "";
    if (newBlocked && !reason.trim()) {
      toast({ title: "Motif requis", description: "Veuillez indiquer la raison du blocage", variant: "destructive" });
      return;
    }
    setBlockingId(project.id);
    try {
      await supabase.from("incubation_projects").update({
        is_blocked: newBlocked,
        blocked_reason: newBlocked ? reason : null,
      } as any).eq("id", project.id);
      toast({ title: newBlocked ? "🚫 Projet bloqué" : "✅ Projet débloqué" });
      setBlockReasonForProject(project.id, "");
      fetchAll();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setBlockingId(null);
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

  const approvedRequests = accessRequests.filter(r => r.status === "approved");
  const pendingRequests = accessRequests.filter(r => r.status === "pending");
  const rejectedRequests = accessRequests.filter(r => r.status === "rejected");
  const trainersCount = new Set(strategicProjects.map(p => p.user_id)).size;
  const blockedCount = strategicProjects.filter(p => p.is_blocked).length + incubationProjects.filter(p => p.is_blocked).length;

  const stats = {
    totalStrategic: strategicProjects.length,
    totalIncubation: incubationProjects.length,
    approvedUsers: approvedRequests.length,
    uniqueUsers: trainersCount,
    blockedCount,
  };

  if (loading) {
    return <Card><CardContent className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
        <Card><CardContent className="p-4 text-center">
          <ShieldBan className="h-5 w-5 mx-auto text-destructive mb-1" />
          <p className="text-2xl font-bold">{stats.blockedCount}</p>
          <p className="text-xs text-muted-foreground">Projets bloqués</p>
        </CardContent></Card>
      </div>

      {/* Access Requests Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Détails des Accès Autorisés ({approvedRequests.length})
          </CardTitle>
          <CardDescription>
            {approvedRequests.length} approuvés · {pendingRequests.length} en attente · {rejectedRequests.length} refusés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucune demande d'accès</p>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Startup</TableHead>
                    <TableHead>Secteur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Réponse Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessRequests.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.user_name || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{req.user_email || "—"}</TableCell>
                      <TableCell>{req.startup_name ? <Badge variant="secondary" className="text-xs">{req.startup_name}</Badge> : "—"}</TableCell>
                      <TableCell>{req.sector ? <Badge variant="outline" className="text-xs">{req.sector}</Badge> : "—"}</TableCell>
                      <TableCell>
                        <Badge className={
                          req.status === "approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
                          req.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-200" :
                          "bg-destructive/10 text-destructive border-destructive/20"
                        }>
                          {req.status === "approved" ? <><Check className="h-3 w-3 mr-1" />Approuvé</> :
                           req.status === "pending" ? <><Clock className="h-3 w-3 mr-1" />En attente</> :
                           <><X className="h-3 w-3 mr-1" />Refusé</>}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{req.admin_response || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Tous les Projets
              </CardTitle>
              <CardDescription>
                {stats.totalStrategic} stratégiques · {stats.totalIncubation} incubation · {stats.blockedCount} bloqués
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
              <div className="space-y-2">
                {filteredStrategic.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Aucun projet trouvé</p>
                ) : filteredStrategic.map(p => (
                  <div key={p.id} className={`border rounded-xl overflow-hidden ${p.is_blocked ? "border-destructive/40 bg-destructive/5" : ""}`}>
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                      onClick={() => setExpandedStrategic(expandedStrategic === p.id ? null : p.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{p.name}</span>
                          {p.is_blocked && <Badge variant="destructive" className="text-xs gap-1"><ShieldBan className="h-3 w-3" />Bloqué</Badge>}
                          {p.incubation_active && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">🎓 Incubation</Badge>}
                          {p.completed_at && <Badge variant="secondary" className="text-xs">✅ Achevé</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{p.user_name}</span>
                          {p.sector && <span>· {p.sector}</span>}
                          <span>· Phase {p.current_phase}/7</span>
                          <span>· <MessageSquare className="h-3 w-3 inline" /> {p.message_count}</span>
                          <span>· {new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs"><GraduationCap className="h-3 w-3 mr-1" />{p.startup_stage}</Badge>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5,6,7].map(ph => (
                            <div key={ph} className={`h-1.5 w-3 rounded-full ${ph <= p.current_phase ? "bg-primary" : "bg-muted"}`} />
                          ))}
                        </div>
                        {expandedStrategic === p.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedStrategic === p.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t"
                        >
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Utilisateur</p>
                                <p className="font-medium">{p.user_name}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Stade</p>
                                <p className="font-medium">{p.startup_stage}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">A une idée</p>
                                <p className="font-medium">{p.has_idea ? "Oui" : "Non"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Secteur</p>
                                <p className="font-medium">{p.sector || "Non défini"}</p>
                              </div>
                            </div>
                            {p.description && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-sm">{p.description}</p>
                              </div>
                            )}
                            {p.is_blocked && p.blocked_reason && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Motif du blocage</p>
                                <p className="text-sm">{p.blocked_reason}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                              {!p.is_blocked && (
                                <div className="flex-1 flex gap-2 items-center">
                                  <Input
                                    placeholder="Motif du blocage..."
                                    value={blocking === p.id ? blockReason : ""}
                                    onChange={e => { setBlocking(p.id); setBlockReason(e.target.value); }}
                                    className="h-9 text-sm max-w-xs"
                                    onFocus={() => setBlocking(p.id)}
                                  />
                                  <Button
                                    variant="destructive" size="sm"
                                    onClick={() => toggleBlockStrategic(p)}
                                    disabled={blocking === p.id && !blockReason.trim()}
                                    className="gap-1"
                                  >
                                    <ShieldBan className="h-3.5 w-3.5" /> Bloquer
                                  </Button>
                                </div>
                              )}
                              {p.is_blocked && (
                                <Button
                                  size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => toggleBlockStrategic(p)}
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" /> Débloquer
                                </Button>
                              )}
                              <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                                <Link to={`/strategic-console/${p.id}`}>
                                  <Eye className="h-3 w-3" /> Voir le projet
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="incubation">
              <div className="space-y-2">
                {filteredIncubation.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Aucun projet trouvé</p>
                ) : filteredIncubation.map(p => (
                  <div key={p.id} className={`border rounded-xl overflow-hidden ${p.is_blocked ? "border-destructive/40 bg-destructive/5" : ""}`}>
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                      onClick={() => setExpandedIncubation(expandedIncubation === p.id ? null : p.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{p.name}</span>
                          {p.is_blocked && <Badge variant="destructive" className="text-xs gap-1"><ShieldBan className="h-3 w-3" />Bloqué</Badge>}
                          <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs">
                            {p.status === "active" ? "Actif" : p.status || "—"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{p.user_name}</span>
                          {p.sector && <span>· {p.sector}</span>}
                          <span>· Étape {p.current_step || 1}/7</span>
                          <span>· {Math.round(p.overall_progress || 0)}%</span>
                          <span>· {new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${p.overall_progress || 0}%` }} />
                          </div>
                          <span className="text-xs font-medium">{Math.round(p.overall_progress || 0)}%</span>
                        </div>
                        {expandedIncubation === p.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedIncubation === p.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t"
                        >
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Utilisateur</p>
                                <p className="font-medium">{p.user_name}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Secteur</p>
                                <p className="font-medium">{p.sector || "Non défini"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Stade</p>
                                <p className="font-medium">{p.stage || "Non défini"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Business Model</p>
                                <p className="font-medium">{p.business_model || "Non défini"}</p>
                              </div>
                            </div>
                            {p.description && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-sm">{p.description}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {p.problem_description && (
                                <div className="p-3 rounded-lg bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-1">Problème</p>
                                  <p className="text-sm">{p.problem_description}</p>
                                </div>
                              )}
                              {p.solution_description && (
                                <div className="p-3 rounded-lg bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-1">Solution</p>
                                  <p className="text-sm">{p.solution_description}</p>
                                </div>
                              )}
                              {p.target_customers && (
                                <div className="p-3 rounded-lg bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-1">Clients cibles</p>
                                  <p className="text-sm">{p.target_customers}</p>
                                </div>
                              )}
                              {p.differentiator && (
                                <div className="p-3 rounded-lg bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-1">Différenciateur</p>
                                  <p className="text-sm">{p.differentiator}</p>
                                </div>
                              )}
                            </div>
                            {p.is_blocked && p.blocked_reason && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Motif du blocage</p>
                                <p className="text-sm">{p.blocked_reason}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                              {!p.is_blocked && (
                                <div className="flex-1 flex gap-2 items-center">
                                  <Input
                                    placeholder="Motif du blocage..."
                                    value={blocking === p.id ? blockReason : ""}
                                    onChange={e => { setBlocking(p.id); setBlockReason(e.target.value); }}
                                    className="h-9 text-sm max-w-xs"
                                    onFocus={() => setBlocking(p.id)}
                                  />
                                  <Button
                                    variant="destructive" size="sm"
                                    onClick={() => toggleBlockIncubation(p)}
                                    disabled={blocking === p.id && !blockReason.trim()}
                                    className="gap-1"
                                  >
                                    <ShieldBan className="h-3.5 w-3.5" /> Bloquer
                                  </Button>
                                </div>
                              )}
                              {p.is_blocked && (
                                <Button
                                  size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => toggleBlockIncubation(p)}
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" /> Débloquer
                                </Button>
                              )}
                              <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                                <Link to={`/incubation/${p.id}`}>
                                  <Eye className="h-3 w-3" /> Voir le projet
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjectsList;
