import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, MapPin, Globe, ShieldCheck, Search, MapIcon, Grid3x3, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TUNISIA_GOVERNORATES } from "@/data/tunisiaGovernorates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EcosystemActorsMap, { ACTOR_CATEGORY_COLORS, type EcosystemActor } from "@/components/ecosystem/EcosystemActorsMap";
import ActorDetailModal from "@/components/ecosystem/ActorDetailModal";

const CATEGORIES = [
  "Incubateurs",
  "Accélérateurs",
  "Venture Builders",
  "FabLabs",
  "Espaces de Coworking",
  "Organismes Publics",
  "Programmes d'Appui",
];

type Actor = EcosystemActor & {
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  sectors?: string[] | null;
  founded_year?: number | null;
  team_size_range?: string | null;
  active_programs_count?: number | null;
};

export default function PartnersDirectoryPage() {
  const location = useLocation();
  const partnersOnlyDefault = location.pathname === "/partenaires";
  const [actors, setActors] = useState<Actor[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [gov, setGov] = useState<string>("all");
  const [program, setProgram] = useState<string>("all");
  const [partnersOnly, setPartnersOnly] = useState(partnersOnlyDefault);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Actor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUserId(u.user?.id || null);
      const { data } = await (supabase as any)
        .from("ecosystem_partners")
        .select("*")
        .eq("is_published", true)
        .order("is_verified", { ascending: false })
        .order("name");
      // Dedupe by name+type
      const seen = new Set<string>();
      const deduped: Actor[] = [];
      (data || []).forEach((a: Actor) => {
        const k = `${a.name.toLowerCase().trim()}::${a.partner_type}`;
        if (!seen.has(k)) {
          seen.add(k);
          deduped.push(a);
        }
      });
      setActors(deduped);
      if (u.user?.id) {
        const { data: f } = await (supabase as any).from("partner_followers").select("partner_id").eq("user_id", u.user.id);
        setFollowed(new Set((f || []).map((x: any) => x.partner_id)));
      }
      setLoading(false);
    })();
  }, []);

  const programOptions = useMemo(() => {
    const set = new Set<string>();
    actors.forEach((a) => (a.programs_offered || []).forEach((p) => set.add(p)));
    return Array.from(set).sort();
  }, [actors]);

  const filtered = useMemo(
    () =>
      actors.filter((a) => {
        if (partnersOnly && !a.is_verified) return false;
        if (category !== "all" && a.partner_type !== category) return false;
        if (gov !== "all" && a.governorate !== gov) return false;
        if (program !== "all" && !(a.programs_offered || []).includes(program)) return false;
        if (q) {
          const s = q.toLowerCase();
          if (
            !a.name.toLowerCase().includes(s) &&
            !(a.description || "").toLowerCase().includes(s) &&
            !(a.programs_offered || []).some((p) => p.toLowerCase().includes(s))
          )
            return false;
        }
        return true;
      }),
    [actors, q, category, gov, program, partnersOnly]
  );

  const countsByCategory = useMemo(() => {
    const c: Record<string, number> = {};
    actors.forEach((a) => {
      if (!partnersOnly || a.is_verified) c[a.partner_type] = (c[a.partner_type] || 0) + 1;
    });
    return c;
  }, [actors, partnersOnly]);

  const toggleFollow = useCallback(
    async (id: string) => {
      if (!userId) {
        toast({ title: "Connectez-vous pour suivre", variant: "destructive" });
        return;
      }
      if (followed.has(id)) {
        await (supabase as any).from("partner_followers").delete().eq("user_id", userId).eq("partner_id", id);
        const n = new Set(followed);
        n.delete(id);
        setFollowed(n);
      } else {
        await (supabase as any).from("partner_followers").insert({ user_id: userId, partner_id: id });
        setFollowed(new Set([...followed, id]));
        toast({ title: "Suivi activé", description: "Vous recevrez les nouvelles opportunités." });
      }
    },
    [userId, followed, toast]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Espace Écosystème</h1>
          <p className="text-muted-foreground max-w-3xl">
            Explorez les acteurs qui propulsent les startups en Tunisie : incubateurs, accélérateurs, venture builders, FabLabs, espaces de coworking,
            organismes publics et programmes d'appui.
          </p>
        </header>

        {/* Mode tabs */}
        <Tabs value={partnersOnly ? "partners" : "all"} onValueChange={(v) => setPartnersOnly(v === "partners")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">Tous les acteurs ({actors.length})</TabsTrigger>
            <TabsTrigger value="partners" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Annuaire des Partenaires ({actors.filter((a) => a.is_verified).length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" />
          <TabsContent value="partners" />
        </Tabs>

        {/* Filters */}
        <Card className="p-4 grid md:grid-cols-[1fr,180px,180px,180px,120px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un acteur, programme…" className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {CATEGORIES.map((t) => (
                <SelectItem key={t} value={t}>{t}{countsByCategory[t] ? ` (${countsByCategory[t]})` : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gov} onValueChange={setGov}>
            <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute la Tunisie</SelectItem>
              {TUNISIA_GOVERNORATES.map((g) => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger><SelectValue placeholder="Programme" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous programmes</SelectItem>
              {programOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex rounded-md border bg-background overflow-hidden">
            <button onClick={() => setView("grid")} className={`flex-1 flex items-center justify-center gap-1 text-xs ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} aria-label="Vue grille"><Grid3x3 className="h-4 w-4" /></button>
            <button onClick={() => setView("map")} className={`flex-1 flex items-center justify-center gap-1 text-xs ${view === "map" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} aria-label="Vue carte"><MapIcon className="h-4 w-4" /></button>
          </div>
        </Card>

        {/* Legend */}
        {view === "map" && (
          <div className="flex flex-wrap gap-3 text-xs">
            {CATEGORIES.map((c) => (
              <div key={c} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: ACTOR_CATEGORY_COLORS[c] }} />
                <span className="text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Chargement…</p>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Aucun acteur ne correspond à ces filtres.
          </Card>
        ) : view === "map" ? (
          <EcosystemActorsMap actors={filtered} onSelect={(a) => setSelected(a as Actor)} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => {
              const color = ACTOR_CATEGORY_COLORS[a.partner_type] || "#6366f1";
              return (
                <Card
                  key={a.id}
                  className="p-5 space-y-3 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer relative"
                  onClick={() => setSelected(a)}
                >
                  <span className="absolute top-0 left-0 h-1 w-full rounded-t-lg" style={{ background: color }} />
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {a.logo_url ? (
                        <img src={a.logo_url} alt={a.name} className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shrink-0" style={{ background: color }}>{a.name[0]}</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate flex items-center gap-1">
                          {a.name}
                          {a.is_verified && <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-label="Partenaire officiel" />}
                        </h3>
                        <Badge variant="secondary" className="text-[10px] mt-0.5" style={{ background: `${color}20`, color }}>{a.partner_type}</Badge>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant={followed.has(a.id) ? "default" : "outline"}
                      onClick={(e) => { e.stopPropagation(); toggleFollow(a.id); }}
                      aria-label="Suivre"
                      className="h-8 w-8 shrink-0"
                    >
                      <Heart className={`h-3.5 w-3.5 ${followed.has(a.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  {a.description && <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
                  {a.programs_offered && a.programs_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {a.programs_offered.slice(0, 3).map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
                      {a.programs_offered.length > 3 && <span className="text-[10px] text-muted-foreground self-center">+{a.programs_offered.length - 3}</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    {a.governorate && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.governorate}</span>}
                    {a.website && (
                      <a href={a.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-primary">
                        <Globe className="h-3 w-3" />Site
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />

      <ActorDetailModal
        actor={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        isFollowing={selected ? followed.has(selected.id) : false}
        onToggleFollow={selected ? () => toggleFollow(selected.id) : undefined}
      />
    </div>
  );
}
