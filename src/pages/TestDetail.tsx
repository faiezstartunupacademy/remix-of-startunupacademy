import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Brain, HelpCircle, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAdjustedDuration, getDurationContext } from "@/utils/testDurationUtils";

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600",
  medium: "bg-yellow-500/10 text-yellow-600",
  hard: "bg-destructive/10 text-destructive",
};

const TestDetail = () => {
  const { projectId, testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [kbTest, setKbTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [globalProgress, setGlobalProgress] = useState({ completed: 0, total: 0, stepName: "" });
  const [projectSector, setProjectSector] = useState<string>("");
  const [form, setForm] = useState({
    qualitative_result: "", quantitative_result: "", quantitative_unit: "",
    status: "not_started", executed_at: "",
  });

  useEffect(() => { fetchTest(); }, [testId]);

  const fetchTest = async () => {
    try {
      const { data, error } = await supabase.from("mvp_tests").select("*").eq("id", testId!).single();
      if (error) throw error;
      setTest(data);
      setForm({
        qualitative_result: data.qualitative_result || "",
        quantitative_result: data.quantitative_result?.toString() || "",
        quantitative_unit: data.quantitative_unit || "",
        status: data.status || "not_started",
        executed_at: data.executed_at ? data.executed_at.split("T")[0] : "",
      });

      // Fetch knowledge base test for protocol
      const { data: kb } = await supabase
        .from("knowledge_base_tests")
        .select("*")
        .eq("test_number", data.test_number)
        .maybeSingle();
      setKbTest(kb);

      // Fetch global progress for this project
      const { data: allTests } = await supabase
        .from("mvp_tests")
        .select("status, step_id")
        .eq("project_id", data.project_id);
      const { data: stepData } = await supabase
        .from("incubation_steps")
        .select("name")
        .eq("id", data.step_id)
        .maybeSingle();
      
      // Fetch project sector for duration adjustment
      const { data: projectData } = await supabase
        .from("incubation_projects")
        .select("sector")
        .eq("id", data.project_id)
        .maybeSingle();
      if (projectData?.sector) setProjectSector(projectData.sector);

      const total = allTests?.length || 0;
      const completed = allTests?.filter(t => t.status === "completed").length || 0;
      setGlobalProgress({ completed, total, stepName: stepData?.name || "" });
    } catch (err) {
      console.error(err);
      toast.error("Test introuvable");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {
        qualitative_result: form.qualitative_result,
        quantitative_result: form.quantitative_result ? parseFloat(form.quantitative_result) : null,
        quantitative_unit: form.quantitative_unit,
        status: form.status,
        executed_at: form.executed_at ? new Date(form.executed_at).toISOString() : null,
      };
      const { error } = await supabase.from("mvp_tests").update(updates).eq("id", testId!);
      if (error) throw error;
      toast.success("Test sauvegardé !");
    } catch { toast.error("Erreur de sauvegarde"); }
    finally { setSaving(false); }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-test-result", {
        body: {
          test_name: test.name,
          test_objective: test.objective,
          target_metrics: test.target_metrics,
          qualitative_result: form.qualitative_result,
          quantitative_result: form.quantitative_result,
          estimated_duration: kbTest?.estimated_duration || "",
          adjusted_duration: kbTest?.estimated_duration && projectSector
            ? getAdjustedDuration(kbTest.estimated_duration, projectSector, kbTest.phase)
            : kbTest?.estimated_duration || "",
          sector: projectSector || "Générique",
          phase: kbTest?.phase || "",
        },
      });
      if (error) throw error;

      const verdict = data?.verdict || data;
      await supabase.from("mvp_tests").update({ ai_verdict: verdict }).eq("id", testId!);
      setTest((prev: any) => ({ ...prev, ai_verdict: verdict }));
      toast.success("Analyse IA terminée !");
    } catch (err) {
      console.error(err);
      // Fallback mock
      const mockVerdict = {
        interpretation: "Résultat analysé par rapport à la métrique cible. Les données indiquent une tendance positive.",
        verdict: "Partiel",
        recommendation: "Continuer avec ajustements mineurs",
        next_actions: ["Élargir l'échantillon de test", "Affiner la métrique de succès", "Retester dans 2 semaines"],
        is_demo: true,
      };
      await supabase.from("mvp_tests").update({ ai_verdict: mockVerdict }).eq("id", testId!);
      setTest((prev: any) => ({ ...prev, ai_verdict: mockVerdict }));
      toast.info("Rapport de démonstration généré");
    } finally { setAnalyzing(false); }
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container py-12"><Skeleton className="h-8 w-1/3 mb-4" /><Skeleton className="h-4 w-2/3 mb-8" /><Skeleton className="h-40 w-full" /></main><Footer /></div>;
  }

  if (!test) {
    return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container py-20 text-center"><h1 className="text-2xl font-bold">Test introuvable</h1></main><Footer /></div>;
  }

  const protocol = kbTest?.detailed_protocol || test.protocol || [];
  const metrics = kbTest?.target_metrics || test.target_metrics;
  const verdict = test.ai_verdict as any;
  const verdictColor = verdict?.verdict === "Succès" ? "border-emerald-500 bg-emerald-500/5" :
    verdict?.verdict === "Échec" ? "border-destructive bg-destructive/5" : "border-yellow-500 bg-yellow-500/5";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(`/pole-strategique/${projectId}`)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour au projet
        </Button>

        {/* Global progress bar */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">
                    Progression globale — <span className="text-primary">{globalProgress.stepName}</span>
                  </p>
                  <span className="text-sm font-bold text-primary">
                    {globalProgress.completed}/{globalProgress.total} tests
                  </span>
                </div>
                <Progress
                  value={globalProgress.total > 0 ? (globalProgress.completed / globalProgress.total) * 100 : 0}
                  className="h-3"
                />
              </div>
              <Link to={`/pole-strategique/${projectId}`}>
                <Button size="sm" variant="outline" className="gap-2 shrink-0">
                  <BarChart3 className="h-4 w-4" /> Dashboard projet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="outline" className="font-mono">#{test.test_number}</Badge>
          <h1 className="text-2xl font-bold">{test.name}</h1>
          {kbTest?.difficulty_level && <Badge className={difficultyColors[kbTest.difficulty_level]}>{kbTest.difficulty_level}</Badge>}
          {kbTest?.estimated_duration && (
            <Badge variant="secondary">
              ⏱ {projectSector ? getAdjustedDuration(kbTest.estimated_duration, projectSector, kbTest.phase) : kbTest.estimated_duration}
              {projectSector && <span className="ml-1 opacity-70">({projectSector})</span>}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">🎯 Objectif</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{test.objective}</p></CardContent>
            </Card>

            {Array.isArray(protocol) && protocol.length > 0 && (
              <Card><CardHeader className="pb-2"><CardTitle className="text-base">📋 Protocole détaillé</CardTitle></CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {protocol.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {kbTest?.recommended_tools && (
              <Card><CardHeader className="pb-2"><CardTitle className="text-base">🛠 Outils recommandés</CardTitle></CardHeader>
                <CardContent><div className="flex flex-wrap gap-2">{kbTest.recommended_tools.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}</div></CardContent>
              </Card>
            )}

            {metrics && (
              <Card><CardHeader className="pb-2"><CardTitle className="text-base">📊 Métriques cibles</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <div className="grid grid-cols-3 gap-px bg-border text-xs font-medium">
                      <div className="bg-muted p-2">Métrique</div>
                      <div className="bg-muted p-2 text-emerald-600">Succès</div>
                      <div className="bg-muted p-2 text-destructive">Échec</div>
                    </div>
                    <div className="grid grid-cols-3 gap-px bg-border text-xs">
                      <div className="bg-background p-2">{metrics.metric_name}</div>
                      <div className="bg-background p-2 text-emerald-600">{metrics.success_threshold}</div>
                      <div className="bg-background p-2 text-destructive">{metrics.failure_threshold}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column — Results */}
          <div className="space-y-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">📝 Résultats</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Statut</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Non démarré</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Complété</SelectItem>
                      <SelectItem value="failed">Échoué</SelectItem>
                      <SelectItem value="skipped">Ignoré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date d'exécution</Label><Input type="date" value={form.executed_at} onChange={e => setForm(p => ({ ...p, executed_at: e.target.value }))} /></div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Label>Résultat qualitatif</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent className="max-w-xs"><p>Décrivez vos observations terrain : retours utilisateurs, comportements observés, citations, points de friction. C'est le contexte qui permet à l'IA de nuancer son verdict.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea value={form.qualitative_result} onChange={e => setForm(p => ({ ...p, qualitative_result: e.target.value }))} placeholder="Ex: Sur 10 utilisateurs interviewés, 7 ont mentionné que le processus d'inscription est trop long. 3 ont abandonné à l'étape 3. Les retours positifs portent sur la clarté de la proposition de valeur." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Label>Résultat quantitatif</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                          <TooltipContent className="max-w-xs"><p>Le chiffre mesurable lié à la métrique cible de ce test. Il sera comparé aux seuils de succès/échec définis dans les métriques cibles.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input type="number" value={form.quantitative_result} onChange={e => setForm(p => ({ ...p, quantitative_result: e.target.value }))} placeholder="Ex: 35 (taux de conversion), 120 (inscrits), 4.2 (note)" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Label>Unité de mesure</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                          <TooltipContent className="max-w-xs"><p>L'unité associée à votre chiffre : %, €, utilisateurs, jours, /5 (note sur 5), NPS, etc.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input value={form.quantitative_unit} onChange={e => setForm(p => ({ ...p, quantitative_unit: e.target.value }))} placeholder="Ex: %, €, users, jours, /5, NPS" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* AI Verdict */}
            <Card className={verdict ? `border-2 ${verdictColor}` : ""}>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> Verdict IA</CardTitle></CardHeader>
              <CardContent>
                {verdict ? (
                  <div className="space-y-3">
                    {verdict.is_demo && (
                      <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-400">
                        ⚠️ Rapport de démonstration
                      </div>
                    )}
                    <div><p className="text-xs font-semibold text-muted-foreground">Interprétation</p><p className="text-sm">{verdict.interpretation}</p></div>
                    <div className="flex gap-2">
                      <Badge className={verdict.verdict === "Succès" ? "bg-emerald-500" : verdict.verdict === "Échec" ? "bg-destructive" : "bg-yellow-500"}>{verdict.verdict}</Badge>
                      <Badge variant="outline">{verdict.recommendation}</Badge>
                    </div>
                    {verdict.duration_analysis && (
                      <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">⏱ Analyse de la durée</p>
                        <p className="text-xs">{verdict.duration_analysis}</p>
                      </div>
                    )}
                    {verdict.next_actions && (
                      <div><p className="text-xs font-semibold text-muted-foreground mb-1">Prochaines actions</p>
                        <ul className="text-xs space-y-1">{verdict.next_actions.map((a: string, i: number) => <li key={i}>• {a}</li>)}</ul>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={analyzing} className="gap-1">
                      <Brain className="h-3 w-3" /> Ré-analyser
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAnalyze} disabled={analyzing || !form.qualitative_result} className="w-full gap-2" variant="outline">
                    {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                    {analyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestDetail;
