import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PIPELINE_STAGES = [
  { id: "sourcing", label: "Sourcing", color: "bg-slate-500/10 border-slate-500/30" },
  { id: "contacted", label: "Contactés", color: "bg-blue-500/10 border-blue-500/30" },
  { id: "meeting", label: "Réunions", color: "bg-indigo-500/10 border-indigo-500/30" },
  { id: "due_diligence", label: "Due Diligence", color: "bg-amber-500/10 border-amber-500/30" },
  { id: "term_sheet", label: "Term Sheet", color: "bg-purple-500/10 border-purple-500/30" },
  { id: "closed_won", label: "Closed Won", color: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-rose-500/10 border-rose-500/30" },
];

const ROUND_TYPES = ["Pre-seed", "Seed", "Series A", "Series B", "Bridge", "Grant"];

interface Deal {
  id: string;
  title: string;
  description: string | null;
  round_type: string;
  amount_target_tnd: number;
  amount_raised_tnd: number;
  equity_offered: number | null;
  valuation_tnd: number | null;
  pipeline_stage: string;
  nda_required: boolean;
  status: string;
  deck_url: string | null;
  deadline: string | null;
  is_public: boolean;
}

export default function DealsPipeline({ userId }: { userId: string }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Deal> | null>(null);

  useEffect(() => { load(); }, [userId]);

  async function load() {
    const { data } = await supabase
      .from("deal_room_deals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setDeals((data as Deal[]) || []);
    setLoading(false);
  }

  async function save() {
    if (!editing?.title) { toast.error("Titre requis"); return; }
    const payload = { ...editing, user_id: userId };
    const { error } = editing.id
      ? await supabase.from("deal_room_deals").update(payload).eq("id", editing.id)
      : await supabase.from("deal_room_deals").insert(payload as any);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Deal mis à jour" : "Deal créé");
    setEditing(null);
    load();
  }

  async function moveToStage(dealId: string, stage: string) {
    const { error } = await supabase.from("deal_room_deals").update({ pipeline_stage: stage }).eq("id", dealId);
    if (error) { toast.error("Erreur"); return; }
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, pipeline_stage: stage } : d));
  }

  const totalRaised = deals.reduce((s, d) => s + Number(d.amount_raised_tnd || 0), 0);
  const totalTarget = deals.reduce((s, d) => s + Number(d.amount_target_tnd || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-4 text-sm">
          <Card className="px-4 py-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Levé / Cible</div>
              <div className="font-bold">{totalRaised.toLocaleString()} / {totalTarget.toLocaleString()} TND</div>
            </div>
          </Card>
          <Card className="px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Deals actifs</div>
              <div className="font-bold">{deals.filter(d => d.status === "open").length}</div>
            </div>
          </Card>
        </div>
        <Button onClick={() => setEditing({ round_type: "Seed", pipeline_stage: "sourcing", nda_required: true, status: "open", amount_target_tnd: 0, amount_raised_tnd: 0 })}>
          <Plus className="w-4 h-4 mr-1" /> Nouveau deal
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-4">
            {PIPELINE_STAGES.map(stage => {
              const stageDeals = deals.filter(d => d.pipeline_stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className={`w-72 shrink-0 rounded-lg border-2 ${stage.color} p-3 transition`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragging) { moveToStage(dragging, stage.id); setDragging(null); } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">{stage.label}</h3>
                    <Badge variant="secondary" className="text-xs">{stageDeals.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map(d => (
                      <Card
                        key={d.id}
                        draggable
                        onDragStart={() => setDragging(d.id)}
                        onDragEnd={() => setDragging(null)}
                        onClick={() => setEditing(d)}
                        className="p-3 cursor-move hover:shadow-md transition bg-background"
                      >
                        <div className="font-medium text-sm truncate">{d.title}</div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] h-5">{d.round_type}</Badge>
                          {d.nda_required && <Badge variant="outline" className="text-[10px] h-5">NDA</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {Number(d.amount_raised_tnd).toLocaleString()} / {Number(d.amount_target_tnd).toLocaleString()} TND
                        </div>
                        {d.amount_target_tnd > 0 && (
                          <div className="h-1 bg-muted rounded mt-1.5 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (Number(d.amount_raised_tnd) / Number(d.amount_target_tnd)) * 100)}%` }} />
                          </div>
                        )}
                        {d.deadline && (
                          <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {format(new Date(d.deadline), "dd/MM/yyyy")}
                          </div>
                        )}
                      </Card>
                    ))}
                    {stageDeals.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">Vide</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Modifier le deal" : "Nouveau deal"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Titre *</Label>
                <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Ex: Levée Seed Q2 2026" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={2} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type de round</Label>
                  <Select value={editing.round_type} onValueChange={(v) => setEditing({ ...editing, round_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ROUND_TYPES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Étape pipeline</Label>
                  <Select value={editing.pipeline_stage} onValueChange={(v) => setEditing({ ...editing, pipeline_stage: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PIPELINE_STAGES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cible (TND)</Label>
                  <Input type="number" value={editing.amount_target_tnd || 0} onChange={(e) => setEditing({ ...editing, amount_target_tnd: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Levé (TND)</Label>
                  <Input type="number" value={editing.amount_raised_tnd || 0} onChange={(e) => setEditing({ ...editing, amount_raised_tnd: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Equity offert (%)</Label>
                  <Input type="number" step="0.1" value={editing.equity_offered ?? ""} onChange={(e) => setEditing({ ...editing, equity_offered: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div>
                  <Label>Valorisation (TND)</Label>
                  <Input type="number" value={editing.valuation_tnd ?? ""} onChange={(e) => setEditing({ ...editing, valuation_tnd: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" value={editing.deadline || ""} onChange={(e) => setEditing({ ...editing, deadline: e.target.value || null })} />
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Ouvert</SelectItem>
                      <SelectItem value="paused">En pause</SelectItem>
                      <SelectItem value="closed">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Deck URL</Label>
                <Input value={editing.deck_url || ""} onChange={(e) => setEditing({ ...editing, deck_url: e.target.value })} placeholder="https://…" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.nda_required ?? true} onChange={(e) => setEditing({ ...editing, nda_required: e.target.checked })} />
                  NDA requis pour accéder aux documents
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_public ?? false} onChange={(e) => setEditing({ ...editing, is_public: e.target.checked })} />
                  Visible des investisseurs
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
                <Button onClick={save}>Enregistrer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
