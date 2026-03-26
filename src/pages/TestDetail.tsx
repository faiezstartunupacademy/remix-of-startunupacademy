import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, Loader2, Brain, HelpCircle, BarChart3, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
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

const UNIT_OPTIONS = [
  { value: "%", label: "% (Pourcentage)" },
  { value: "€", label: "€ (Euro)" },
  { value: "$", label: "$ (Dollar)" },
  { value: "TND", label: "TND (Dinar)" },
  { value: "users", label: "Utilisateurs" },
  { value: "jours", label: "Jours" },
  { value: "heures", label: "Heures" },
  { value: "/5", label: "/5 (Note sur 5)" },
  { value: "/10", label: "/10 (Note sur 10)" },
  { value: "NPS", label: "NPS" },
  { value: "conversions", label: "Conversions" },
  { value: "clics", label: "Clics" },
  { value: "inscriptions", label: "Inscriptions" },
  { value: "ventes", label: "Ventes" },
  { value: "réponses", label: "Réponses" },
];

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
  const [siblingTests, setSiblingTests] = useState<any[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    qualitative_result: "", quantitative_result: "", quantitative_unit: "",
    status: "not_started", executed_at: "",
  });

  useEffect(() => { fetchTest(); }, [testId]);

  const fetchTest = async () => {
    setLoading(true);
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

      const { data: kb } = await supabase
        .from("knowledge_base_tests")
        .select("*")
        .eq("test_number", data.test_number)
        .maybeSingle();
      setKbTest(kb);

      // Fetch all sibling tests in same step
      const { data: siblings } = await supabase
        .from("mvp_tests")
        .select("id, name, test_number, status, step_id")
        .eq("step_id", data.step_id)
        .eq("project_id", data.project_id)
        .order("test_number");
      setSiblingTests(siblings || []);

      const { data: allTests } = await supabase
        .from("mvp_tests")
        .select("status, step_id")
        .eq("project_id", data.project_id);
      const { data: stepData } = await supabase
        .from("incubation_steps")
        .select("name")
        .eq("id", data.step_id)
        .maybeSingle();

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
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
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

  const currentIndex = siblingTests.findIndex(t => t.id === testId);
  const prevTest = currentIndex > 0 ? siblingTests[currentIndex - 1] : null;
  const nextTest = currentIndex < siblingTests.length - 1 ? siblingTests[currentIndex + 1] : null;

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
        {/* Save success banner */}
        {showSaveSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">✅ Test sauvegardé avec succès !</span>
          </div>
        )}

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

        {/* Test header - displayed at top */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="font-mono text-base px-3 py-1">#{test.test_number}</Badge>
              <h1 className="text-2xl font-bold">{test.name}</h1>
              {kbTest?.difficulty_level && <Badge className={difficultyColors[kbTest.difficulty_level]}>{kbTest.difficulty_level}</Badge>}
              {kbTest?.estimated_duration && (
                <Badge variant="secondary">
                  ⏱ {projectSector ? getAdjustedDuration(kbTest.estimated_duration, projectSector, kbTest.phase) : kbTest.estimated_duration}
                  {projectSector && <span className="ml-1 opacity-70">({projectSector})</span>}
                </Badge>
              )}
            </div>
            {/* Sibling test list - clickable names */}
            {siblingTests.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {siblingTests.map((s) => (
                  <Link key={s.id} to={`/pole-strategique/${projectId}/test/${s.id}`}>
                    <Badge
                      variant={s.id === testId ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        s.id === testId ? "ring-2 ring-primary/30" : 
                        s.status === "completed" ? "border-emerald-500/50 text-emerald-600" : ""
                      }`}
                    >
                      {s.status === "completed" && "✅ "}#{s.test_number} {s.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            {/* Prev/Next step nav */}
            <div className="mt-3 flex items-center justify-between">
              {prevTest ? (
                <Link to={`/pole-strategique/${projectId}/test/${prevTest.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <ChevronLeft className="h-3.5 w-3.5" /> 
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">← Test précédent: #{prevTest.test_number}</span>
                  </Button>
                </Link>
              ) : <span />}
              {nextTest ? (
                <Link to={`/pole-strategique/${projectId}/test/${nextTest.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Test suivant: #{nextTest.test_number} →</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : <span />}
            </div>
          </CardContent>
        </Card>

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
                <div>
                  <Label>Statut <span className="text-destructive">*</span></Label>
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
                <div>
                  <Label>Date d'exécution <span className="text-destructive">*</span></Label>
                  <Input type="date" value={form.executed_at} onChange={e => setForm(p => ({ ...p, executed_at: e.target.value }))} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Label>Résultat qualitatif <span className="text-destructive">*</span></Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent className="max-w-xs"><p>Décrivez vos observations terrain : retours utilisateurs, comportements observés, citations, points de friction.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea value={form.qualitative_result} onChange={e => setForm(p => ({ ...p, qualitative_result: e.target.value }))} placeholder="Ex: Sur 10 utilisateurs interviewés, 7 ont mentionné que le processus d'inscription est trop long..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Label>Résultat quantitatif <span className="text-destructive">*</span></Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                          <TooltipContent className="max-w-xs"><p>Le chiffre mesurable lié à la métrique cible de ce test.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input type="number" value={form.quantitative_result} onChange={e => setForm(p => ({ ...p, quantitative_result: e.target.value }))} placeholder="Ex: 35, 120, 4.2" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Label>Unité de mesure <span className="text-destructive">*</span></Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                          <TooltipContent className="max-w-xs"><p>L'unité associée à votre chiffre : %, €, utilisateurs, jours, etc.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={form.quantitative_unit} onValueChange={v => setForm(p => ({ ...p, quantitative_unit: v }))}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner l'unité" /></SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map(u => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder
                </Button>

                {/* Next / Previous test buttons */}
                <div className="flex gap-2">
                  {prevTest && (
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => navigate(`/pole-strategique/${projectId}/test/${prevTest.id}`)}>
                      <ChevronLeft className="h-4 w-4" /> Test précédent
                    </Button>
                  )}
                  {nextTest && (
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => navigate(`/pole-strategique/${projectId}/test/${nextTest.id}`)}>
                      Test suivant <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
