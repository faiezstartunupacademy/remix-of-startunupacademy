import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TestTube2, Play, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Test = {
  id: string;
  phase: string;
  name: string;
  description: string | null;
  applicable_sectors: string[];
  applicable_scenarios: string[];
};

type TestResult = {
  id: string;
  test_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  qualitative_result: string | null;
  quantitative_result: number | null;
};

type Props = {
  project: {
    id: string;
    sector: string;
    scenario: string;
  };
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  not_started: { label: "Non commencé", icon: Clock, color: "text-muted-foreground" },
  in_progress: { label: "En cours", icon: Play, color: "text-blue-500" },
  passed: { label: "Réussi", icon: CheckCircle2, color: "text-emerald-500" },
  failed: { label: "Échoué", icon: XCircle, color: "text-red-500" },
};

const MvpTestsLibrary = ({ project }: Props) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [resultForm, setResultForm] = useState({ status: "not_started", start_date: "", end_date: "", qualitative_result: "", quantitative_result: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, [project.id]);

  const loadData = async () => {
    const [{ data: testsData }, { data: resultsData }] = await Promise.all([
      supabase.from("mvp_tests_library" as any).select("*"),
      supabase.from("mvp_test_results" as any).select("*").eq("project_id", project.id),
    ]);
    if (testsData) {
      const filtered = (testsData as any[]).filter(t =>
        t.applicable_sectors.includes(project.sector) &&
        t.applicable_scenarios.includes(project.scenario)
      );
      setTests(filtered);
    }
    if (resultsData) setResults(resultsData as any[]);
    setLoading(false);
  };

  const openTest = (test: Test) => {
    const existing = results.find(r => r.test_id === test.id);
    setResultForm({
      status: existing?.status || "not_started",
      start_date: existing?.start_date || "",
      end_date: existing?.end_date || "",
      qualitative_result: existing?.qualitative_result || "",
      quantitative_result: existing?.quantitative_result?.toString() || "",
    });
    setSelectedTest(test);
  };

  const saveResult = async () => {
    if (!selectedTest) return;
    setSaving(true);
    const existing = results.find(r => r.test_id === selectedTest.id);
    const payload = {
      project_id: project.id,
      test_id: selectedTest.id,
      status: resultForm.status,
      start_date: resultForm.start_date || null,
      end_date: resultForm.end_date || null,
      qualitative_result: resultForm.qualitative_result || null,
      quantitative_result: resultForm.quantitative_result ? parseFloat(resultForm.quantitative_result) : null,
    };

    if (existing) {
      await supabase.from("mvp_test_results" as any).update(payload as any).eq("id", existing.id);
    } else {
      await supabase.from("mvp_test_results" as any).insert(payload as any);
    }
    await loadData();
    setSaving(false);
    setSelectedTest(null);
    toast({ title: "Résultat sauvegardé !" });
  };

  const getTestResult = (testId: string) => results.find(r => r.test_id === testId);

  const phases = [...new Set(tests.map(t => t.phase))];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TestTube2 className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Tests MVP disponibles</h3>
        <Badge variant="secondary">{tests.length} tests</Badge>
      </div>

      {tests.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">Aucun test disponible pour ce secteur/scénario.</p>
          </CardContent>
        </Card>
      ) : (
        phases.map(phase => (
          <div key={phase} className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Badge className={phase === "Problem-Solution Fit" ? "bg-amber-500" : phase === "Product-Market Fit" ? "bg-blue-500" : "bg-emerald-500"}>
                {phase}
              </Badge>
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {tests.filter(t => t.phase === phase).map(test => {
                const result = getTestResult(test.id);
                const config = STATUS_CONFIG[result?.status || "not_started"];
                const Icon = config.icon;
                return (
                  <motion.div key={test.id} whileHover={{ scale: 1.01 }}>
                    <Card className={`cursor-pointer hover:border-primary/50 transition-all ${result?.status === "passed" ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : result?.status === "failed" ? "border-red-300 bg-red-50/50 dark:bg-red-950/20" : ""}`} onClick={() => openTest(test)}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium">{test.name}</h5>
                            <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                          </div>
                          <Icon className={`h-5 w-5 shrink-0 ml-2 ${config.color}`} />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">{config.label}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Test Result Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedTest?.description}</p>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={resultForm.status} onValueChange={v => setResultForm(prev => ({ ...prev, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Non commencé</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="passed">Réussi</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" value={resultForm.start_date} onChange={e => setResultForm(prev => ({ ...prev, start_date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="date" value={resultForm.end_date} onChange={e => setResultForm(prev => ({ ...prev, end_date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Résultat qualitatif</Label>
              <Textarea placeholder="Décrivez vos observations..." value={resultForm.qualitative_result} onChange={e => setResultForm(prev => ({ ...prev, qualitative_result: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Résultat quantitatif</Label>
              <Input type="number" placeholder="Ex: 85 (taux de conversion %)" value={resultForm.quantitative_result} onChange={e => setResultForm(prev => ({ ...prev, quantitative_result: e.target.value }))} />
            </div>
            <Button onClick={saveResult} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sauvegarder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MvpTestsLibrary;
