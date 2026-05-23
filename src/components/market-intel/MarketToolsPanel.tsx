import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Loader2, Target, Swords, Layers, History, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const STAGES = ["Idéation", "Validation", "MVP", "Go-to-Market", "Croissance", "Scaling", "Exit/Impact"];

type Report = {
  id: string;
  title: string;
  report_type: string;
  result_markdown: string | null;
  source: string;
  linked_strategic_action: string | null;
  created_at: string;
};

export default function MarketToolsPanel({ sector }: { sector?: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tam");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [source, setSource] = useState<"ai" | "heuristic" | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [linkStage, setLinkStage] = useState<string>("");

  // TAM/SAM/SOM inputs
  const [tam, setTam] = useState({ population: 12000000, pct_target: 5, arpu: 100, capture_pct: 2, sector_note: "" });
  const [tamCalc, setTamCalc] = useState<{ tam: number; sam: number; som: number }>({ tam: 0, sam: 0, som: 0 });

  // SWOT inputs
  const [swot, setSwot] = useState({ problem: "", solution: "", customer: "", advantage: "", market_context: "" });

  // Competitor benchmark
  const [competitors, setCompetitors] = useState<Array<{ name: string; positioning: string; pricing: string; strength: string; weakness: string }>>([
    { name: "", positioning: "", pricing: "", strength: "", weakness: "" },
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { setUserId(data.user.id); loadReports(data.user.id); }
    });
  }, []);

  useEffect(() => {
    const t = tam.population * (tam.pct_target / 100) * tam.arpu;
    const s = t * 0.3;
    const o = s * (tam.capture_pct / 100);
    setTamCalc({ tam: t, sam: s, som: o });
  }, [tam]);

  async function loadReports(uid: string) {
    const { data } = await supabase
      .from("market_intelligence_reports")
      .select("id,title,report_type,result_markdown,source,linked_strategic_action,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    setReports((data as Report[]) || []);
  }

  async function runReport(type: string, inputs: any, title: string) {
    setLoading(true);
    setResult("");
    setSource(null);
    try {
      const { data, error } = await supabase.functions.invoke("market-intel-tools", { body: { type, inputs } });
      if (error) throw error;
      setResult(data.result);
      setSource(data.source);
      if (data.warning) toast.warning(data.warning);
      if (userId) {
        await supabase.from("market_intelligence_reports").insert({
          user_id: userId, title, report_type: type, sector: sector || null,
          inputs, result_markdown: data.result, source: data.source,
          linked_strategic_action: linkStage || null,
        });
        loadReports(userId);
        toast.success("Rapport généré et archivé");
      }
    } catch (e: any) {
      toast.error(e?.message || "Erreur de génération");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReport(id: string) {
    if (!confirm("Supprimer ce rapport ?")) return;
    await supabase.from("market_intelligence_reports").delete().eq("id", id);
    if (userId) loadReports(userId);
  }

  const chartData = [
    { name: "TAM", value: tamCalc.tam, fill: "hsl(var(--primary))" },
    { name: "SAM", value: tamCalc.sam, fill: "hsl(var(--accent))" },
    { name: "SOM", value: tamCalc.som, fill: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tam"><Target className="w-4 h-4 mr-1.5" /> TAM/SAM/SOM</TabsTrigger>
          <TabsTrigger value="swot"><Layers className="w-4 h-4 mr-1.5" /> SWOT Auto</TabsTrigger>
          <TabsTrigger value="competitors"><Swords className="w-4 h-4 mr-1.5" /> Benchmark</TabsTrigger>
          <TabsTrigger value="history"><History className="w-4 h-4 mr-1.5" /> Historique ({reports.length})</TabsTrigger>
        </TabsList>

        {/* TAM/SAM/SOM */}
        <TabsContent value="tam" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculateur TAM / SAM / SOM</CardTitle>
              <CardDescription>Estimation top-down du marché adressable en Tunisie + enrichissement IA.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label>Population cible (hab.)</Label>
                  <Input type="number" value={tam.population} onChange={(e) => setTam({ ...tam, population: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>% de la population concernée</Label>
                  <Input type="number" step="0.1" value={tam.pct_target} onChange={(e) => setTam({ ...tam, pct_target: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>ARPU annuel (TND / client)</Label>
                  <Input type="number" value={tam.arpu} onChange={(e) => setTam({ ...tam, arpu: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>% du SAM capturable en 24 mois</Label>
                  <Input type="number" step="0.1" value={tam.capture_pct} onChange={(e) => setTam({ ...tam, capture_pct: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Notes secteur (optionnel)</Label>
                  <Textarea rows={2} value={tam.sector_note} onChange={(e) => setTam({ ...tam, sector_note: e.target.value })} placeholder="Hypothèses, sources, contraintes…" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[{ k: "tam", l: "TAM" }, { k: "sam", l: "SAM" }, { k: "som", l: "SOM" }].map(({ k, l }) => (
                    <Card key={k} className="p-3 text-center">
                      <div className="text-xs text-muted-foreground">{l}</div>
                      <div className="text-lg font-bold">{Math.round((tamCalc as any)[k]).toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">TND/an</div>
                    </Card>
                  ))}
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} TND`} />
                      <Bar dataKey="value">
                        {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <LinkToStage value={linkStage} onChange={setLinkStage} />
                <Button onClick={() => runReport("tam_sam_som", { ...tam, ...tamCalc, sector }, `TAM/SAM/SOM — ${sector || "Marché"}`)} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />} Générer rapport IA enrichi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SWOT */}
        <TabsContent value="swot" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SWOT auto-généré</CardTitle>
              <CardDescription>À partir de votre Lean Canvas et du contexte marché.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3">
              <div><Label>Problème</Label><Textarea rows={2} value={swot.problem} onChange={(e) => setSwot({ ...swot, problem: e.target.value })} /></div>
              <div><Label>Solution</Label><Textarea rows={2} value={swot.solution} onChange={(e) => setSwot({ ...swot, solution: e.target.value })} /></div>
              <div><Label>Client cible</Label><Textarea rows={2} value={swot.customer} onChange={(e) => setSwot({ ...swot, customer: e.target.value })} /></div>
              <div><Label>Avantage défendable</Label><Textarea rows={2} value={swot.advantage} onChange={(e) => setSwot({ ...swot, advantage: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Contexte marché</Label><Textarea rows={2} value={swot.market_context} onChange={(e) => setSwot({ ...swot, market_context: e.target.value })} placeholder="Tendances, concurrents, réglementation…" /></div>
              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1"><LinkToStage value={linkStage} onChange={setLinkStage} /></div>
                <Button onClick={() => runReport("swot", { ...swot, sector }, `SWOT — ${swot.solution || "Projet"}`)} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />} Générer SWOT
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors */}
        <TabsContent value="competitors" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Benchmark concurrentiel</CardTitle>
                <CardDescription>Comparez jusqu'à 5 concurrents et obtenez des recommandations.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => competitors.length < 5 && setCompetitors([...competitors, { name: "", positioning: "", pricing: "", strength: "", weakness: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {competitors.map((c, idx) => (
                <Card key={idx} className="p-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Concurrent #{idx + 1}</span>
                    {competitors.length > 1 && <Button size="sm" variant="ghost" onClick={() => setCompetitors(competitors.filter((_, i) => i !== idx))}><Trash2 className="w-3.5 h-3.5" /></Button>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <Input placeholder="Nom" value={c.name} onChange={(e) => { const n = [...competitors]; n[idx].name = e.target.value; setCompetitors(n); }} />
                    <Input placeholder="Positionnement" value={c.positioning} onChange={(e) => { const n = [...competitors]; n[idx].positioning = e.target.value; setCompetitors(n); }} />
                    <Input placeholder="Pricing" value={c.pricing} onChange={(e) => { const n = [...competitors]; n[idx].pricing = e.target.value; setCompetitors(n); }} />
                    <Input placeholder="Force" value={c.strength} onChange={(e) => { const n = [...competitors]; n[idx].strength = e.target.value; setCompetitors(n); }} />
                    <Input placeholder="Faiblesse" className="md:col-span-2" value={c.weakness} onChange={(e) => { const n = [...competitors]; n[idx].weakness = e.target.value; setCompetitors(n); }} />
                  </div>
                </Card>
              ))}
              <div className="flex items-end gap-2">
                <div className="flex-1"><LinkToStage value={linkStage} onChange={setLinkStage} /></div>
                <Button onClick={() => runReport("competitor_benchmark", { competitors, sector }, `Benchmark — ${competitors[0]?.name || "Concurrents"}`)} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />} Analyser
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-3 mt-4">
          {reports.length === 0 ? (
            <Card className="p-12 text-center">
              <History className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Aucun rapport archivé.</p>
            </Card>
          ) : reports.map(r => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{r.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Badge variant="outline" className="text-[10px]">{r.report_type}</Badge>
                    <Badge variant="outline" className="text-[10px]">{r.source === "ai" ? "IA" : "Local"}</Badge>
                    {r.linked_strategic_action && <Badge className="text-[10px] bg-primary/15 text-primary">→ {r.linked_strategic_action}</Badge>}
                    <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => { setResult(r.result_markdown || ""); setSource(r.source as any); }}>Voir</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteReport(r.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-primary" /> Rapport généré
              {source && <Badge variant="outline" className="text-xs">{source === "ai" ? "IA" : "Local"}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LinkToStage({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">Lier à une étape du Pôle Stratégique (optionnel)</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">— Aucun lien —</option>
        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}
