import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ExternalLink, Plus, Sparkles, Calendar as CalIcon, Banknote, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TYPES = [
  { v: "grant", label: "Subvention", emoji: "🎁" },
  { v: "equity", label: "Equity / VC", emoji: "💰" },
  { v: "debt", label: "Crédit", emoji: "🏦" },
  { v: "incubator", label: "Incubateur", emoji: "🌱" },
  { v: "accelerator", label: "Accélérateur", emoji: "🚀" },
  { v: "competition", label: "Concours", emoji: "🏆" },
  { v: "label", label: "Label", emoji: "🏷️" },
];

const STAGES = ["ideation", "prototype", "mvp", "traction", "growth"];

function fmtTND(n: number | null | undefined) {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M TND`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K TND`;
  return `${n} TND`;
}

function computeMatchScore(program: any, profile: { stage?: string; sector?: string; wilaya?: string }) {
  if (!profile?.stage && !profile?.sector && !profile?.wilaya) return null;
  let score = 50;
  if (profile.stage && program.stages?.includes(profile.stage)) score += 25;
  if (profile.sector && (program.sectors?.length === 0 || program.sectors?.includes(profile.sector))) score += 15;
  // Regional targeting bonus
  if (profile.wilaya) {
    const targets: string[] | null = program.target_governorates || null;
    if (!targets || targets.length === 0) score += 2; // national programs
    else if (targets.includes(profile.wilaya)) score += 15 + (program.regional_priority ? 5 : 0);
    else score -= 10; // explicitly excludes user's region
  }
  if (program.is_active) score += 5;
  if (program.deadline) {
    const days = (new Date(program.deadline).getTime() - Date.now()) / 86400000;
    if (days > 0 && days < 60) score += 5;
  }
  return Math.max(0, Math.min(100, score));
}

export default function FundingPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterStage, setFilterStage] = useState<string[]>([]);
  const [tab, setTab] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ stage?: string; sector?: string; wilaya?: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUserId(u.user?.id || null);
      const { data } = await supabase.from("funding_programs").select("*").eq("is_active", true).order("name");
      setPrograms(data || []);

      if (u.user?.id) {
        const [{ data: proj }, { data: prof }] = await Promise.all([
          supabase.from("incubation_projects").select("stage,sector,governorate").eq("user_id", u.user.id).limit(1).maybeSingle(),
          supabase.from("profiles").select("wilaya").eq("user_id", u.user.id).maybeSingle(),
        ]);
        setProfile({
          stage: proj?.stage || undefined,
          sector: proj?.sector || undefined,
          wilaya: (proj as any)?.governorate || prof?.wilaya || undefined,
        });
      }
      setLoading(false);
    })();
  }, []);

  const scored = useMemo(() => programs.map(p => ({ ...p, _score: computeMatchScore(p, profile) })), [programs, profile]);

  const filtered = useMemo(() => {
    let out = scored;
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(p => p.name.toLowerCase().includes(q) || p.organization.toLowerCase().includes(q) || p.tags?.some((t: string) => t.includes(q)));
    }
    if (filterType.length) out = out.filter(p => filterType.includes(p.type));
    if (filterStage.length) out = out.filter(p => filterStage.some(s => p.stages?.includes(s)));
    if (tab === "matches") out = [...out].filter(p => (p._score ?? 0) >= 70).sort((a, b) => (b._score || 0) - (a._score || 0));
    else if (tab === "deadlines") out = out.filter(p => p.deadline && new Date(p.deadline) > new Date()).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    return out;
  }, [scored, search, filterType, filterStage, tab]);

  async function shortlist(p: any) {
    if (!userId) { toast.error("Connectez-vous pour suivre une opportunité"); return; }
    setSavingId(p.id);
    const { error } = await supabase.from("funding_applications").insert({
      user_id: userId, program_id: p.id, status: "shortlist", match_score: p._score || null,
    });
    setSavingId(null);
    if (error) toast.error(error.message);
    else toast.success(`${p.name} ajouté à vos candidatures`);
  }

  return (
    <>
      <Header />
      <div className="container py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Financement & Opportunités
              </h1>
              <p className="text-muted-foreground mt-2">
                Catalogue tunisien (Startup Act, Smart Capital, Flat6Labs, BIAT, AfricInvest…) + matching intelligent.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/candidatures"><TrendingUp className="h-4 w-4 mr-2" /> Mes candidatures</Link>
            </Button>
          </div>
        </motion.div>

        {(profile.stage || profile.wilaya) && (
          <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-3 flex-wrap">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm">
              Matching basé sur votre profil
              {profile.stage && <> — Stage: <Badge variant="outline">{profile.stage}</Badge></>}
              {profile.sector && <> · Secteur: <Badge variant="outline">{profile.sector}</Badge></>}
              {profile.wilaya && <> · Région: <Badge variant="outline">{profile.wilaya}</Badge></>}
            </p>
          </Card>
        )}

        <div className="grid lg:grid-cols-[260px,1fr] gap-6">
          <aside className="space-y-6">
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Type</h3>
              {TYPES.map(t => (
                <label key={t.v} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={filterType.includes(t.v)} onCheckedChange={(c) => setFilterType(c ? [...filterType, t.v] : filterType.filter(x => x !== t.v))} />
                  <span>{t.emoji} {t.label}</span>
                </label>
              ))}
            </Card>
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Stade</h3>
              {STAGES.map(s => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={filterStage.includes(s)} onCheckedChange={(c) => setFilterStage(c ? [...filterStage, s] : filterStage.filter(x => x !== s))} />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </Card>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Rechercher (Smart Capital, fintech, accélérateur…)" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">Tous ({programs.length})</TabsTrigger>
                <TabsTrigger value="matches">⚡ Best matches</TabsTrigger>
                <TabsTrigger value="deadlines">📅 Deadlines</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} className="mt-4 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                ) : filtered.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">Aucun programme ne correspond.</Card>
                ) : filtered.map((p, i) => {
                  const type = TYPES.find(t => t.v === p.type);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                      <Card className="p-5 hover:shadow-lg hover:border-primary/40 transition-all">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="text-3xl">{type?.emoji || "💼"}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-lg">{p.name}</h3>
                              <Badge variant="secondary">{type?.label}</Badge>
                              {p.country === "TN" && <span title="Tunisie">🇹🇳</span>}
                              {p._score !== null && p._score >= 70 && (
                                <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30">
                                  ⚡ {p._score}% match
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">{p.organization}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {p.stages?.slice(0, 4).map((s: string) => <Badge key={s} variant="outline" className="text-xs capitalize">{s}</Badge>)}
                              {p.equity_required && <Badge variant="outline" className="text-xs">Equity requis</Badge>}
                            </div>
                          </div>
                          <div className="md:text-right space-y-2 md:w-44">
                            <div className="flex items-center gap-1.5 text-sm font-semibold md:justify-end">
                              <Banknote className="h-4 w-4 text-primary" />
                              {fmtTND(p.min_amount_tnd)} → {fmtTND(p.max_amount_tnd)}
                            </div>
                            {p.deadline && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground md:justify-end">
                                <CalIcon className="h-3.5 w-3.5" />
                                {new Date(p.deadline).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                            {p.is_rolling && <Badge variant="outline" className="text-xs">Candidature continue</Badge>}
                            <div className="flex gap-2 md:justify-end pt-1">
                              {p.application_url && (
                                <Button asChild size="sm" variant="outline">
                                  <a href={p.application_url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                                </Button>
                              )}
                              <Button size="sm" onClick={() => shortlist(p)} disabled={savingId === p.id}>
                                {savingId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
                                Suivre
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
