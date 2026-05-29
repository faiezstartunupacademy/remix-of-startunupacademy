import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Star, Search, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";


const EXPERTISE = ["Finance","Tech","Marketing","Legal","Export","Agri","Health","Education","SaaS","FinTech"];
const LANGUAGES = ["fr","ar","en"];
const SECTORS = ["FinTech","HealthTech","AgriTech","EdTech","E-commerce","SaaS","CleanTech","Other"];

function flag(code: string) {
  if (!code) return "🏳️";
  const cp = code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)));
  return cp;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterExp, setFilterExp] = useState<string[]>([]);
  const [filterLang, setFilterLang] = useState<string[]>([]);
  const [filterSector, setFilterSector] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", bio: "", linkedin_url: "", country_code: "TN",
    years_experience: 0, hourly_rate: "", expertise_tags: [] as string[],
    languages: ["fr"] as string[], sectors: [] as string[],
  });

  async function loadMentors() {
    const { data } = await supabase.from("mentors").select("*").eq("is_active", true);
    setMentors(data || []);
    setLoading(false);
  }

  useEffect(() => { loadMentors(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Connectez-vous pour devenir mentor"); return; }
    if (!form.full_name.trim() || form.full_name.length > 120) { toast.error("Nom requis (max 120)"); return; }
    if (form.bio && form.bio.length > 1000) { toast.error("Bio trop longue (max 1000)"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("mentors").upsert({
      user_id: user.id,
      full_name: form.full_name.trim(),
      bio: form.bio.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      country_code: form.country_code.trim().toUpperCase() || "TN",
      years_experience: Number(form.years_experience) || 0,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      expertise_tags: form.expertise_tags,
      languages: form.languages,
      sectors: form.sectors,
      is_active: true,
    }, { onConflict: "user_id" });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profil mentor publié 🎉");
    setOpen(false);
    loadMentors();
  }


  const filtered = useMemo(() => mentors.filter(m => {
    if (search && !m.full_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterExp.length && !filterExp.some(t => m.expertise_tags?.includes(t))) return false;
    if (filterLang.length && !filterLang.some(l => m.languages?.includes(l))) return false;
    if (filterSector.length && !filterSector.some(s => m.sectors?.includes(s))) return false;
    return true;
  }), [mentors, search, filterExp, filterLang, filterSector, availableOnly]);

  function toggle(arr: string[], setter: any, v: string) {
    setter(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">👥 Annuaire des Mentors</h1>
            <p className="text-muted-foreground">Trouvez le mentor qui boostera votre startup</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" /> Devenir mentor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter / mettre à jour mon profil mentor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Nom complet *</label>
                    <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={120} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pays (code ISO)</label>
                    <Input value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value })} maxLength={2} placeholder="TN" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Années d'expérience</label>
                    <Input type="number" min={0} value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tarif horaire (TND, optionnel)</label>
                    <Input type="number" min={0} value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={1000} rows={4} placeholder="Parcours, valeurs ajoutées, types de startups accompagnées..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Expertises</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE.map(e => (
                      <Badge key={e} variant={form.expertise_tags.includes(e) ? "default" : "outline"} className="cursor-pointer"
                        onClick={() => setForm({ ...form, expertise_tags: form.expertise_tags.includes(e) ? form.expertise_tags.filter(x => x !== e) : [...form.expertise_tags, e] })}>{e}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Langues</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(l => (
                      <Badge key={l} variant={form.languages.includes(l) ? "default" : "outline"} className="cursor-pointer uppercase"
                        onClick={() => setForm({ ...form, languages: form.languages.includes(l) ? form.languages.filter(x => x !== l) : [...form.languages, l] })}>{l}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Secteurs</label>
                  <div className="flex flex-wrap gap-2">
                    {SECTORS.map(s => (
                      <Badge key={s} variant={form.sectors.includes(s) ? "default" : "outline"} className="cursor-pointer"
                        onClick={() => setForm({ ...form, sectors: form.sectors.includes(s) ? form.sectors.filter(x => x !== s) : [...form.sectors, s] })}>{s}</Badge>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? "Publication..." : "Publier"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>


        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar filters */}
          <aside className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom du mentor..." />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Expertise</label>
              <div className="space-y-1.5">
                {EXPERTISE.map(e => (
                  <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={filterExp.includes(e)} onCheckedChange={() => toggle(filterExp, setFilterExp, e)} />
                    {e}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Langue</label>
              <div className="space-y-1.5">
                {LANGUAGES.map(l => (
                  <label key={l} className="flex items-center gap-2 text-sm cursor-pointer uppercase">
                    <Checkbox checked={filterLang.includes(l)} onCheckedChange={() => toggle(filterLang, setFilterLang, l)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Secteur</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {SECTORS.map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={filterSector.includes(s)} onCheckedChange={() => toggle(filterSector, setFilterSector, s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={availableOnly} onCheckedChange={(c) => setAvailableOnly(!!c)} />
              Disponible cette semaine
            </label>
          </aside>

          {/* Grid */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} mentor(s)</p>
            {loading ? <p>Chargement…</p> : filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Aucun mentor ne correspond à votre recherche.</p>
                <p className="text-xs mt-2">Les profils mentor apparaîtront ici dès leur validation.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(m => (
                  <Card key={m.id} className="p-5 hover:shadow-lg transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                        {m.photo_url ? <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" /> : m.full_name.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold truncate">{m.full_name}</h3>
                          <span title={m.country_code}>{flag(m.country_code)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {m.avg_rating?.toFixed(1) || "—"} · {m.reviews_count || 0} avis
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3 min-h-[28px]">
                      {(m.expertise_tags || []).slice(0,3).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.bio || "Pas de bio"}</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/mentors/${m.id}`}><Calendar className="w-4 h-4 mr-1" /> Voir profil</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
