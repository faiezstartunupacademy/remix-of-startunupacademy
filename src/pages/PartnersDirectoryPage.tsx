import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Globe, Mail, ShieldCheck, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TUNISIA_GOVERNORATES } from "@/data/tunisiaGovernorates";

const TYPES = ["Accelerator","Incubator","Institution","Network","VC","Bank","Coworking","Other"];

export default function PartnersDirectoryPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [gov, setGov] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUserId(u.user?.id || null);
      const { data } = await (supabase as any).from("ecosystem_partners").select("*").eq("is_published", true).order("is_verified", { ascending: false });
      setPartners(data || []);
      if (u.user?.id) {
        const { data: f } = await (supabase as any).from("partner_followers").select("partner_id").eq("user_id", u.user.id);
        setFollowed(new Set((f || []).map((x: any) => x.partner_id)));
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => partners.filter(p => {
    if (type !== "all" && p.partner_type !== type) return false;
    if (gov !== "all" && p.governorate !== gov) return false;
    if (q) {
      const s = q.toLowerCase();
      if (!p.name.toLowerCase().includes(s) && !(p.description || "").toLowerCase().includes(s)) return false;
    }
    return true;
  }), [partners, q, type, gov]);

  const toggleFollow = async (id: string) => {
    if (!userId) return toast({ title: "Connectez-vous pour suivre", variant: "destructive" });
    if (followed.has(id)) {
      await (supabase as any).from("partner_followers").delete().eq("user_id", userId).eq("partner_id", id);
      const n = new Set(followed); n.delete(id); setFollowed(n);
    } else {
      await (supabase as any).from("partner_followers").insert({ user_id: userId, partner_id: id });
      setFollowed(new Set([...followed, id]));
      toast({ title: "Suivi activé", description: "Vous recevrez les nouvelles opportunités de ce partenaire." });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Écosystème Startup Tunisien</h1>
        <p className="text-muted-foreground">Annuaire des accélérateurs, incubateurs, institutions et réseaux qui propulsent les startups TN.</p>
      </header>

      <Card className="p-4 grid md:grid-cols-[1fr,180px,180px] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un partenaire…" className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={gov} onValueChange={setGov}>
          <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute la Tunisie</SelectItem>
            {TUNISIA_GOVERNORATES.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Chargement…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">Aucun partenaire trouvé. Les admins peuvent en ajouter depuis le dashboard.</Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">{p.name[0]}</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate flex items-center gap-1">
                      {p.name}
                      {p.is_verified && <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-label="Vérifié" />}
                    </h3>
                    <Badge variant="secondary" className="text-xs">{p.partner_type}</Badge>
                  </div>
                </div>
                <Button size="icon" variant={followed.has(p.id) ? "default" : "outline"} onClick={() => toggleFollow(p.id)} aria-label="Suivre">
                  <Heart className={`h-4 w-4 ${followed.has(p.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
              {p.description && <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {p.governorate && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.governorate}</span>}
                {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe className="h-3 w-3" />Site</a>}
                {p.contact_email && <a href={`mailto:${p.contact_email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" />Contact</a>}
              </div>
              {p.active_programs_count > 0 && (
                <Link to={`/funding?partner=${encodeURIComponent(p.name)}`} className="text-xs text-primary font-medium hover:underline">
                  {p.active_programs_count} programme{p.active_programs_count > 1 ? "s" : ""} actif{p.active_programs_count > 1 ? "s" : ""} →
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
