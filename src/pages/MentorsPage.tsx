import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Star, Search, Calendar } from "lucide-react";
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

  useEffect(() => {
    supabase.from("mentors").select("*").eq("is_active", true).then(({ data }) => {
      setMentors(data || []);
      setLoading(false);
    });
  }, []);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">👥 Annuaire des Mentors</h1>
          <p className="text-muted-foreground">Trouvez le mentor qui boostera votre startup</p>
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
