import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, MoreVertical, Loader2, Banknote, Trophy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const COLUMNS = [
  { id: "shortlist", label: "🎯 Shortlist", color: "from-slate-500/10" },
  { id: "preparing", label: "✍️ Préparation", color: "from-blue-500/10" },
  { id: "submitted", label: "📨 Soumis", color: "from-amber-500/10" },
  { id: "interview", label: "💬 Entretien", color: "from-purple-500/10" },
  { id: "accepted", label: "✅ Accepté", color: "from-green-500/10" },
  { id: "rejected", label: "❌ Refusé", color: "from-red-500/10" },
];

export default function FundingApplicationsPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newProgramId, setNewProgramId] = useState<string>("");
  const [newCustom, setNewCustom] = useState("");

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { navigate("/auth"); return; }
    setUserId(u.user.id);
    const [a, p] = await Promise.all([
      supabase.from("funding_applications").select("*, funding_programs(name,organization,type,max_amount_tnd)").eq("user_id", u.user.id).order("updated_at", { ascending: false }),
      supabase.from("funding_programs").select("id,name,organization").eq("is_active", true).order("name"),
    ]);
    setApps(a.data || []);
    setPrograms(p.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const byStatus = useMemo(() => {
    const m: Record<string, any[]> = {};
    COLUMNS.forEach(c => m[c.id] = []);
    apps.forEach(a => { (m[a.status] ||= []).push(a); });
    return m;
  }, [apps]);

  const stats = useMemo(() => ({
    total: apps.length,
    awarded: apps.filter(a => a.status === "accepted").reduce((s, a) => s + (Number(a.amount_awarded_tnd) || Number(a.funding_programs?.max_amount_tnd) || 0), 0),
    inFlight: apps.filter(a => ["preparing", "submitted", "interview"].includes(a.status)).length,
    winRate: (() => {
      const decided = apps.filter(a => ["accepted", "rejected"].includes(a.status)).length;
      const won = apps.filter(a => a.status === "accepted").length;
      return decided > 0 ? Math.round((won / decided) * 100) : 0;
    })(),
  }), [apps]);

  async function move(id: string, status: string) {
    const prev = apps.find(a => a.id === id);
    if (!prev || prev.status === status) return;
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
    const { error } = await supabase.from("funding_applications").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); load(); return; }
    await supabase.from("funding_application_events").insert({
      application_id: id, user_id: userId, event_type: "status_change",
      title: `Statut: ${prev.status} → ${status}`,
    });
    toast.success("Statut mis à jour");
  }

  async function remove(id: string) {
    setApps(apps.filter(a => a.id !== id));
    await supabase.from("funding_applications").delete().eq("id", id);
  }

  async function createApp() {
    if (!userId) return;
    if (!newProgramId && !newCustom.trim()) { toast.error("Sélectionnez un programme ou nommez-en un"); return; }
    const { error } = await supabase.from("funding_applications").insert({
      user_id: userId,
      program_id: newProgramId || null,
      custom_program_name: newProgramId ? null : newCustom.trim(),
      status: "shortlist",
    });
    if (error) { toast.error(error.message); return; }
    setNewOpen(false); setNewProgramId(""); setNewCustom("");
    toast.success("Candidature créée");
    load();
  }

  return (
    <>
      <Header />
      <div className="container py-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Link to="/financement" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Catalogue financement
            </Link>
            <h1 className="text-3xl font-bold mt-2">Mes Candidatures</h1>
            <p className="text-muted-foreground text-sm">Pipeline kanban — glisser-déposer pour mettre à jour</p>
          </div>
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle candidature</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle candidature</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Programme du catalogue</label>
                  <Select value={newProgramId} onValueChange={setNewProgramId}>
                    <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                    <SelectContent>
                      {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — {p.organization}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-center text-xs text-muted-foreground">— ou —</div>
                <div>
                  <label className="text-sm font-medium">Programme personnalisé</label>
                  <Input placeholder="Ex: Concours InnovaTN 2026" value={newCustom} onChange={e => setNewCustom(e.target.value)} />
                </div>
              </div>
              <DialogFooter><Button onClick={createApp}>Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4"><div className="text-xs text-muted-foreground">Pipeline</div><div className="text-2xl font-bold">{stats.total}</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground">En cours</div><div className="text-2xl font-bold text-amber-500">{stats.inFlight}</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className="h-3 w-3" /> Win rate</div><div className="text-2xl font-bold text-green-500">{stats.winRate}%</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground flex items-center gap-1"><Banknote className="h-3 w-3" /> Obtenu</div><div className="text-2xl font-bold">{stats.awarded > 0 ? `${(stats.awarded / 1000).toFixed(0)}K TND` : "—"}</div></Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
            {COLUMNS.map(col => (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => draggedId && move(draggedId, col.id)}
                className={`rounded-xl border bg-gradient-to-b ${col.color} to-transparent p-3 min-h-[400px] space-y-2`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="secondary" className="text-xs">{byStatus[col.id]?.length || 0}</Badge>
                </div>
                {byStatus[col.id]?.map(a => (
                  <motion.div key={a.id} layout draggable
                    onDragStart={() => setDraggedId(a.id)}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <Card className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{a.funding_programs?.name || a.custom_program_name}</div>
                          <div className="text-xs text-muted-foreground truncate">{a.funding_programs?.organization}</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {COLUMNS.filter(c => c.id !== a.status).map(c => (
                              <DropdownMenuItem key={c.id} onClick={() => move(a.id, c.id)}>Déplacer → {c.label}</DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => remove(a.id)} className="text-destructive">Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {a.next_action && (
                        <div className="mt-2 text-xs flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {a.next_action}
                        </div>
                      )}
                      {a.match_score && (
                        <Badge variant="outline" className="mt-2 text-[10px]">⚡ {a.match_score}% match</Badge>
                      )}
                    </Card>
                  </motion.div>
                ))}
                {byStatus[col.id]?.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Vide</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
