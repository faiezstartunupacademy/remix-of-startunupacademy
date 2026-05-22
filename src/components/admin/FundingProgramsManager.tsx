import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
  organization: string;
  type: string;
  sectors: string[] | null;
  stages: string[] | null;
  target_governorates?: string[] | null;
  regional_priority?: boolean | null;
  min_amount_tnd: number | null;
  max_amount_tnd: number | null;
  equity_required: boolean | null;
  description: string | null;
  eligibility: string | null;
  benefits: string | null;
  application_url: string | null;
  contact_email: string | null;
  is_active: boolean | null;
  difficulty: string | null;
  is_rolling: boolean | null;
}

const empty: Partial<Program> = {
  name: "", organization: "", type: "grant", sectors: [], stages: [],
  equity_required: false, is_active: true, is_rolling: true, difficulty: "medium",
};

const FundingProgramsManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Program>>(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("funding_programs").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setPrograms(data as Program[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name || !editing.organization) {
      toast({ title: "Champs requis", description: "Nom et organisation obligatoires", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...editing,
      sectors: typeof editing.sectors === "string" ? (editing.sectors as any).split(",").map((s: string) => s.trim()).filter(Boolean) : editing.sectors,
      stages: typeof editing.stages === "string" ? (editing.stages as any).split(",").map((s: string) => s.trim()).filter(Boolean) : editing.stages,
      target_governorates: typeof editing.target_governorates === "string"
        ? (editing.target_governorates as any).split(",").map((s: string) => s.trim()).filter(Boolean)
        : editing.target_governorates,
    } as any;
    const { error } = editing.id
      ? await supabase.from("funding_programs").update(payload).eq("id", editing.id)
      : await supabase.from("funding_programs").insert(payload);
    setSaving(false);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    toast({ title: editing.id ? "Programme mis à jour" : "Programme créé" });
    setOpen(false); setEditing(empty); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce programme ?")) return;
    const { error } = await supabase.from("funding_programs").delete().eq("id", id);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    toast({ title: "Programme supprimé" });
    load();
  };

  const startEdit = (p: Program) => {
    setEditing({ ...p, sectors: (p.sectors || []).join(", ") as any, stages: (p.stages || []).join(", ") as any, target_governorates: (p.target_governorates || []).join(", ") as any });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Programmes de Financement</CardTitle>
            <CardDescription>{programs.length} programme(s) dans le catalogue</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(empty); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-2" /> Nouveau programme</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing.id ? "Modifier" : "Créer"} un programme</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2"><Label>Nom *</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Organisation *</Label><Input value={editing.organization || ""} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} /></div>
                <div><Label>Type</Label>
                  <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grant">Subvention</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="debt">Prêt</SelectItem>
                      <SelectItem value="accelerator">Accélérateur</SelectItem>
                      <SelectItem value="incubator">Incubateur</SelectItem>
                      <SelectItem value="competition">Concours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Montant min (TND)</Label><Input type="number" value={editing.min_amount_tnd || ""} onChange={(e) => setEditing({ ...editing, min_amount_tnd: Number(e.target.value) })} /></div>
                <div><Label>Montant max (TND)</Label><Input type="number" value={editing.max_amount_tnd || ""} onChange={(e) => setEditing({ ...editing, max_amount_tnd: Number(e.target.value) })} /></div>
                <div className="col-span-2"><Label>Secteurs (virgules)</Label><Input value={editing.sectors as any || ""} onChange={(e) => setEditing({ ...editing, sectors: e.target.value as any })} placeholder="Fintech, AgriTech, HealthTech" /></div>
                <div className="col-span-2"><Label>Stages (virgules)</Label><Input value={editing.stages as any || ""} onChange={(e) => setEditing({ ...editing, stages: e.target.value as any })} placeholder="ideation, mvp, growth" /></div>
                <div className="col-span-2"><Label>Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
                <div className="col-span-2"><Label>Éligibilité</Label><Textarea value={editing.eligibility || ""} onChange={(e) => setEditing({ ...editing, eligibility: e.target.value })} /></div>
                <div className="col-span-2"><Label>Bénéfices</Label><Textarea value={editing.benefits || ""} onChange={(e) => setEditing({ ...editing, benefits: e.target.value })} /></div>
                <div><Label>URL candidature</Label><Input value={editing.application_url || ""} onChange={(e) => setEditing({ ...editing, application_url: e.target.value })} /></div>
                <div><Label>Email contact</Label><Input value={editing.contact_email || ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} /></div>
                <div><Label>Difficulté</Label>
                  <Select value={editing.difficulty || "medium"} onValueChange={(v) => setEditing({ ...editing, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 mt-6"><Switch checked={!!editing.equity_required} onCheckedChange={(v) => setEditing({ ...editing, equity_required: v })} /><Label>Equity requis</Label></div>
                <div className="flex items-center gap-2"><Switch checked={!!editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Actif</Label></div>
                <div className="flex items-center gap-2"><Switch checked={!!editing.is_rolling} onCheckedChange={(v) => setEditing({ ...editing, is_rolling: v })} /><Label>Candidatures continues</Label></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
          <div className="grid gap-3">
            {programs.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-muted/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold truncate">{p.name}</h4>
                    <Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Actif" : "Inactif"}</Badge>
                    <Badge variant="outline">{p.type}</Badge>
                    {p.equity_required && <Badge variant="outline" className="text-amber-600">Equity</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{p.organization}</p>
                  {(p.min_amount_tnd || p.max_amount_tnd) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.min_amount_tnd?.toLocaleString()} - {p.max_amount_tnd?.toLocaleString()} TND
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
            {programs.length === 0 && <p className="text-center py-8 text-muted-foreground">Aucun programme</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FundingProgramsManager;
