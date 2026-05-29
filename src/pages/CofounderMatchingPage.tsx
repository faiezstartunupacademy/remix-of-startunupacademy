import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Handshake, Sparkles, Eye, EyeOff, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CofounderProfile {
  id: string; user_id: string; headline: string; bio: string | null;
  role_seeking: string; present_role: string | null; sector: string | null; location: string | null;
  skills_have: string[] | null; skills_need: string[] | null; commitment: string | null;
  has_idea: boolean | null; idea_summary: string | null; linkedin_url: string | null;
  anonymous_first_contact: boolean; is_active: boolean;
}

// Postes C-Suite & C-Chief — triés par criticité au stade early/scaling startup,
// puis par complémentarité fonctionnelle (Tech ↔ Business ↔ People ↔ Risk).
const ROLES = [
  // Cœur fondateur — indispensables
  "CEO — Chief Executive Officer",
  "CTO — Chief Technology Officer",
  "COO — Chief Operating Officer",
  "CFO — Chief Financial Officer",
  "CPO — Chief Product Officer",
  // Croissance & marché
  "CMO — Chief Marketing Officer",
  "CRO — Chief Revenue Officer",
  "CGO — Chief Growth Officer",
  "CBDO — Chief Business Development Officer",
  "CCO — Chief Commercial Officer",
  "CSO — Chief Sales Officer",
  // Tech, produit & data
  "CIO — Chief Information Officer",
  "CDO — Chief Data Officer",
  "CAIO — Chief AI Officer",
  "CDIO — Chief Digital & Innovation Officer",
  "CINO — Chief Innovation Officer",
  "CXO — Chief Experience Officer",
  "CDesO — Chief Design Officer",
  // People, culture & talents
  "CHRO — Chief Human Resources Officer",
  "CPeopleO — Chief People Officer",
  "CTalO — Chief Talent Officer",
  "CCultureO — Chief Culture Officer",
  "CDIO — Chief Diversity & Inclusion Officer",
  // Risque, conformité & juridique
  "CISO — Chief Information Security Officer",
  "CSO — Chief Security Officer",
  "CRO — Chief Risk Officer",
  "CCO — Chief Compliance Officer",
  "CLO — Chief Legal Officer / General Counsel",
  "CPO — Chief Privacy Officer",
  // Stratégie, impact & écosystème
  "CSO — Chief Strategy Officer",
  "CSusO — Chief Sustainability Officer",
  "CImpactO — Chief Impact Officer",
  "CPartO — Chief Partnerships Officer",
  "CEcoO — Chief Ecosystem Officer",
  "CCO — Chief Communications Officer",
  "CBO — Chief Brand Officer",
  // Opérations spécialisées
  "CCO — Chief Customer Officer",
  "CSCO — Chief Supply Chain Officer",
  "CMO — Chief Manufacturing Officer",
  "CKO — Chief Knowledge Officer",
  "CLO — Chief Learning Officer",
  // C-CHIEF (cadre STARTUNUP)
  "C-CHIEF — Chief Holistic Integrator of Entrepreneurial Forces",
  // Rôles opérationnels seniors (non-C-level)
  "VP Engineering",
  "VP Product",
  "VP Sales",
  "VP Marketing",
  "Head of Growth",
  "Head of Design",
  "Tech Lead",
  "Sales Lead",
  "Designer",
];
const COMMITMENTS = [{ id: "full_time", label: "Temps plein" }, { id: "part_time", label: "Temps partiel" }, { id: "side", label: "Side project" }];
const SECTORS = ["Fintech", "AgriTech", "HealthTech", "EdTech", "E-commerce", "SaaS", "GreenTech", "Mobilité", "Tourisme", "Autre"];

const matchScore = (me: CofounderProfile, other: CofounderProfile): number => {
  let score = 0;
  // skills complementarity
  const myHave = new Set((me.skills_have || []).map(s => s.toLowerCase()));
  const myNeed = new Set((me.skills_need || []).map(s => s.toLowerCase()));
  const otherHave = new Set((other.skills_have || []).map(s => s.toLowerCase()));
  const otherNeed = new Set((other.skills_need || []).map(s => s.toLowerCase()));
  const heGivesMeWhatINeed = [...myNeed].filter(s => otherHave.has(s)).length;
  const iGiveHimWhatHeNeeds = [...myHave].filter(s => otherNeed.has(s)).length;
  score += heGivesMeWhatINeed * 18;
  score += iGiveHimWhatHeNeeds * 18;
  // sector
  if (me.sector && other.sector && me.sector === other.sector) score += 20;
  // role complementarity
  if (me.role_seeking && other.present_role && me.role_seeking.toLowerCase() === other.present_role.toLowerCase()) score += 15;
  if (other.role_seeking && me.present_role && other.role_seeking.toLowerCase() === me.present_role.toLowerCase()) score += 15;
  // commitment
  if (me.commitment === other.commitment) score += 10;
  // location
  if (me.location && other.location && me.location.toLowerCase() === other.location.toLowerCase()) score += 10;
  return Math.min(100, Math.round(score));
};

const CofounderMatchingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<CofounderProfile[]>([]);
  const [me, setMe] = useState<CofounderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilesByUser, setProfilesByUser] = useState<Map<string, { full_name: string | null }>>(new Map());
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<CofounderProfile>>({
    headline: "", bio: "", role_seeking: ROLES[0], present_role: ROLES[0], sector: "", location: "",
    skills_have: [], skills_need: [], commitment: "full_time", anonymous_first_contact: true, is_active: true,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cofounder_profiles").select("*").eq("is_active", true);
    if (error) { toast({ title: "Erreur", description: error.message }); setLoading(false); return; }
    setProfiles(data || []);
    if (user) {
      const mine = (data || []).find((p: any) => p.user_id === user.id);
      if (mine) {
        setMe(mine);
        setForm({ ...mine });
      }
    }
    const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
    const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    setProfilesByUser(new Map((profs || []).map((p: any) => [p.user_id, p])));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const ranked = useMemo(() => {
    const others = profiles.filter(p => p.user_id !== user?.id);
    if (!me) return others.map(p => ({ ...p, score: 0 }));
    return others.map(p => ({ ...p, score: matchScore(me, p) })).sort((a, b) => b.score - a.score);
  }, [profiles, me, user?.id]);

  const submit = async () => {
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (!form.headline || !form.role_seeking) return toast({ title: "Titre et rôle recherché requis", variant: "destructive" });
    setSaving(true);
    const payload = {
      ...form,
      user_id: user.id,
      skills_have: typeof form.skills_have === "string" ? (form.skills_have as any).split(",").map((s: string) => s.trim()).filter(Boolean) : form.skills_have,
      skills_need: typeof form.skills_need === "string" ? (form.skills_need as any).split(",").map((s: string) => s.trim()).filter(Boolean) : form.skills_need,
    } as any;
    const { error } = me
      ? await supabase.from("cofounder_profiles").update(payload).eq("id", me.id)
      : await supabase.from("cofounder_profiles").insert(payload);
    setSaving(false);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    toast({ title: "Profil enregistré 🤝" });
    setOpen(false);
    load();
  };

  const contact = (p: CofounderProfile & { score?: number }) => {
    const name = profilesByUser.get(p.user_id)?.full_name || "Anonyme";
    const display = p.anonymous_first_contact ? "Profil anonyme — premier contact discret" : name;
    toast({ title: `Demande de contact envoyée à ${display}`, description: "Vous pourrez échanger via la messagerie une fois la demande acceptée." });
    // Could insert into a contact_requests table here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Handshake className="h-7 w-7 text-primary" /> Co-fondateur Matching</h1>
              <p className="text-muted-foreground">Trouvez votre binôme — algorithme basé sur compétences complémentaires + secteur.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button>{me ? "Modifier mon profil" : "Créer mon profil"}</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{me ? "Modifier" : "Créer"} mon profil co-fondateur</DialogTitle></DialogHeader>
                <div className="space-y-3 py-4">
                  <div><Label>Titre court *</Label><Input value={form.headline || ""} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Tech founder cherchant CMO en HealthTech" /></div>
                  <div><Label>Bio</Label><Textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Mon rôle actuel</Label>
                      <Select value={form.present_role || ""} onValueChange={(v) => setForm({ ...form, present_role: v })}>
                        <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Je cherche *</Label>
                      <Select value={form.role_seeking || ROLES[1]} onValueChange={(v) => setForm({ ...form, role_seeking: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Secteur</Label>
                      <Select value={form.sector || ""} onValueChange={(v) => setForm({ ...form, sector: v })}>
                        <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Localisation</Label><Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Tunis" /></div>
                  </div>
                  <div><Label>Mes skills (virgules)</Label><Input value={form.skills_have as any || ""} onChange={(e) => setForm({ ...form, skills_have: e.target.value as any })} placeholder="React, Backend, AWS" /></div>
                  <div><Label>Skills recherchés (virgules)</Label><Input value={form.skills_need as any || ""} onChange={(e) => setForm({ ...form, skills_need: e.target.value as any })} placeholder="Sales, Growth, Branding" /></div>
                  <div><Label>Engagement</Label>
                    <Select value={form.commitment || "full_time"} onValueChange={(v) => setForm({ ...form, commitment: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{COMMITMENTS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>LinkedIn</Label><Input value={form.linkedin_url || ""} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-2"><EyeOff className="h-4 w-4" /><Label className="cursor-pointer">Premier contact anonyme</Label></div>
                    <Switch checked={!!form.anonymous_first_contact} onCheckedChange={(v) => setForm({ ...form, anonymous_first_contact: v })} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <Label className="cursor-pointer">Profil actif (visible)</Label>
                    <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!me && user && (
            <Card className="mb-6 border-primary/40 bg-primary/5">
              <CardContent className="pt-6">
                <p className="text-sm">✨ Créez votre profil pour activer le matching personnalisé et apparaître dans le réseau.</p>
              </CardContent>
            </Card>
          )}

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <div className="grid md:grid-cols-2 gap-4">
              {ranked.length === 0 && <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">Aucun profil correspondant pour l'instant.</CardContent></Card>}
              {ranked.map(p => {
                const name = profilesByUser.get(p.user_id)?.full_name || "Membre";
                const display = p.anonymous_first_contact ? `${name.charAt(0)}.` : name;
                return (
                  <Card key={p.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar><AvatarFallback className="bg-primary/10 text-primary">{display.charAt(0)}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-base">{display}</CardTitle>
                            {p.anonymous_first_contact && <Badge variant="outline" className="text-[10px]"><EyeOff className="h-3 w-3 mr-1" /> Anonyme</Badge>}
                            {me && p.score! > 0 && <Badge className="bg-emerald-500">Match {p.score}%</Badge>}
                          </div>
                          <CardDescription className="text-xs mt-1">{p.headline}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1 text-xs">
                        <Badge variant="secondary">Cherche : {p.role_seeking}</Badge>
                        {p.present_role && <Badge variant="outline">Est : {p.present_role}</Badge>}
                        {p.sector && <Badge variant="outline">{p.sector}</Badge>}
                        {p.location && <Badge variant="outline"><MapPin className="h-3 w-3 mr-1" /> {p.location}</Badge>}
                      </div>
                      {p.skills_have && p.skills_have.length > 0 && (
                        <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Apporte</p>
                          <div className="flex flex-wrap gap-1">{p.skills_have.slice(0, 6).map((s, i) => <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>)}</div>
                        </div>
                      )}
                      {p.skills_need && p.skills_need.length > 0 && (
                        <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Cherche</p>
                          <div className="flex flex-wrap gap-1">{p.skills_need.slice(0, 6).map((s, i) => <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
                        </div>
                      )}
                      {p.bio && <p className="text-xs text-muted-foreground line-clamp-2">{p.bio}</p>}
                      <Button size="sm" className="w-full" onClick={() => contact(p)} disabled={p.user_id === user?.id}>
                        <Send className="h-3 w-3 mr-2" /> Demander à connecter
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CofounderMatchingPage;
