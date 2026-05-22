import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ShieldCheck, Trash2, Edit, ShieldOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TUNISIA_GOVERNORATES } from "@/data/tunisiaGovernorates";

const TYPES = ["Accelerator","Incubator","Institution","Network","VC","Bank","Coworking","Other"];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function PartnersAdminManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("ecosystem_partners").select("*").order("created_at", { ascending: false });
    setRows(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name || !editing.partner_type) return toast({ title: "Nom et type requis", variant: "destructive" });
    const payload = { ...editing, slug: editing.slug || slugify(editing.name) };
    const { error } = editing.id
      ? await (supabase as any).from("ecosystem_partners").update(payload).eq("id", editing.id)
      : await (supabase as any).from("ecosystem_partners").insert(payload);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    toast({ title: editing.id ? "Mis à jour" : "Créé" });
    setOpen(false); setEditing({}); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    await (supabase as any).from("ecosystem_partners").delete().eq("id", id);
    load();
  };

  const toggleVerified = async (p: any) => {
    await (supabase as any).from("ecosystem_partners").update({ is_verified: !p.is_verified }).eq("id", p.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Partenaires écosystème</h2>
          <p className="text-sm text-muted-foreground">Gérer l'annuaire et vérifier les profils</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEditing({})}><Plus className="h-4 w-4 mr-2" />Ajouter</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing.id ? "Modifier" : "Nouveau partenaire"}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2"><Label>Nom</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Type</Label>
                <Select value={editing.partner_type || ""} onValueChange={(v) => setEditing({ ...editing, partner_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Gouvernorat</Label>
                <Select value={editing.governorate || ""} onValueChange={(v) => setEditing({ ...editing, governorate: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{TUNISIA_GOVERNORATES.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><Label>Site web</Label><Input value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} placeholder="https://" /></div>
              <div><Label>Logo URL</Label><Input value={editing.logo_url || ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} /></div>
              <div><Label>Email contact</Label><Input value={editing.contact_email || ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={editing.contact_phone || ""} onChange={(e) => setEditing({ ...editing, contact_phone: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={!!editing.is_verified} onCheckedChange={(v) => setEditing({ ...editing, is_verified: v })} /><Label>Vérifié</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_published !== false} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /><Label>Publié</Label></div>
            </div>
            <Button onClick={save}>Enregistrer</Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="grid md:grid-cols-2 gap-3">
          {rows.map(p => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {p.name}
                  {p.is_verified && <ShieldCheck className="h-4 w-4 text-primary" />}
                  {!p.is_published && <Badge variant="outline" className="text-xs">Brouillon</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{p.partner_type}</Badge>
                  {p.governorate && <Badge variant="outline">{p.governorate}</Badge>}
                  {p.claimed_by && <Badge variant="outline">Revendiqué</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}><Edit className="h-3.5 w-3.5 mr-1" />Éditer</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleVerified(p)}>
                    {p.is_verified ? <><ShieldOff className="h-3.5 w-3.5 mr-1" />Retirer</> : <><ShieldCheck className="h-3.5 w-3.5 mr-1" />Vérifier</>}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
