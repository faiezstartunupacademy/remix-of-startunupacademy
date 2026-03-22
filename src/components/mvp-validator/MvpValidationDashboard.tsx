import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Loader2, Plus, Trash2, Save, Target, Layers, Users,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle, MapPin, Brain, Heart, UserCircle, Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ValidationGauge from "./ValidationGauge";

type Hypothesis = {
  id: string; project_id: string; type: string; description: string;
  test_method: string | null; validation_status: string; confidence_score: number; weight: number;
};
type Feature = {
  id: string; project_id: string; name: string; priority: string;
  completion_percentage: number; tested: boolean; test_result: string;
};
type Persona = {
  id: string; project_id: string; name: string; description: string | null;
  is_early_adopter: boolean; interviews_done: number; interviews_target: number;
  conversion_rate: number; satisfaction_score: number;
  governorate: string | null; age_range: string | null;
  socio_profile: string | null; psycho_profile: string | null; emotional_profile: string | null;
};

type Props = { projectId: string };

const MvpValidationDashboard = ({ projectId }: Props) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState<"hypothesis" | "feature" | "persona" | null>(null);
  const { toast } = useToast();

  // Form states
  const [hForm, setHForm] = useState({ type: "risque_marché", description: "", test_method: "", weight: 3 });
  const [fForm, setFForm] = useState({ name: "", priority: "core" });
  const [pForm, setPForm] = useState({ name: "", description: "", is_early_adopter: false, interviews_target: 30, governorate: "Tunis", age_range: "25-35", socio_profile: "Salarié", psycho_profile: "Early Adopter", emotional_profile: "" });

  useEffect(() => { loadAll(); }, [projectId]);

  const loadAll = async () => {
    const [h, f, p] = await Promise.all([
      supabase.from("mvp_hypotheses" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_features" as any).select("*").eq("project_id", projectId),
      supabase.from("mvp_personas" as any).select("*").eq("project_id", projectId),
    ]);
    if (h.data) setHypotheses(h.data as any[]);
    if (f.data) setFeatures(f.data as any[]);
    if (p.data) setPersonas(p.data as any[]);
    setLoading(false);
  };

  // TVH = Σ(confidence × weight) / Σ(100 × weight) × 100
  const tvh = useMemo(() => {
    if (!hypotheses.length) return 0;
    const num = hypotheses.reduce((s, h) => s + h.confidence_score * h.weight, 0);
    const den = hypotheses.reduce((s, h) => s + 100 * h.weight, 0);
    return den > 0 ? Math.round((num / den) * 100) : 0;
  }, [hypotheses]);

  // TVF = (Σ completion_core × 0.7 + Σ completion_nice × 0.3) / (nb × 100) × 100
  const tvf = useMemo(() => {
    if (!features.length) return 0;
    const core = features.filter(f => f.priority === "core");
    const nice = features.filter(f => f.priority === "nice_to_have");
    const sumCore = core.reduce((s, f) => s + f.completion_percentage, 0);
    const sumNice = nice.reduce((s, f) => s + f.completion_percentage, 0);
    const num = sumCore * 0.7 + sumNice * 0.3;
    const den = features.length * 100;
    return den > 0 ? Math.round((num / den) * 100) : 0;
  }, [features]);

  // TVP = (done/target)×0.4 + conversion×0.35 + (satisfaction/10)×0.25
  const tvp = useMemo(() => {
    if (!personas.length) return 0;
    const avg = personas.reduce((s, p) => {
      const interviewScore = p.interviews_target > 0 ? (p.interviews_done / p.interviews_target) : 0;
      return s + (Math.min(interviewScore, 1) * 0.4 + (p.conversion_rate / 100) * 0.35 + (p.satisfaction_score / 10) * 0.25);
    }, 0) / personas.length;
    return Math.round(avg * 100);
  }, [personas]);

  const tvg = Math.round(tvh * 0.4 + tvf * 0.35 + tvp * 0.25);
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const hasCheckedRef = useRef(false);

  // Check if already published to marketplace
  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    const checkPublished = async () => {
      const { data } = await supabase
        .from("marketplace_startups")
        .select("id")
        .eq("description", `mvp_project:${projectId}`)
        .maybeSingle();
      if (data) setIsPublished(true);
    };
    checkPublished();
  }, [projectId]);

  // Auto-publish when TVG >= 70% and personas validated
  const publishToMarketplace = async () => {
    setIsPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get project details
      const { data: project } = await supabase
        .from("mvp_validator_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!project) throw new Error("Project not found");

      const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

      const { error } = await supabase.from("marketplace_startups").insert({
        name: project.name,
        slug,
        tagline: project.description?.substring(0, 100) || `${project.sector} startup`,
        description: `mvp_project:${projectId}`,
        sector: project.sector || "tech",
        stage: "early",
        location: project.governorate || "Tunis",
        governorate: project.governorate,
        program: project.incubation_program,
        created_by: user.id,
        is_approved: true, // Auto-approved since validated
      } as any);

      if (error) throw error;

      setIsPublished(true);
      toast({ title: t("mvp.publishedToMarketplace"), description: `TVG: ${tvg}%` });
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message, variant: "destructive" });
    }
    setIsPublishing(false);
  };

  const getColor = (v: number) => v <= 30 ? "text-red-500" : v <= 60 ? "text-amber-500" : "text-emerald-500";

  // CRUD helpers
  const addHypothesis = async () => {
    setSaving(true);
    await supabase.from("mvp_hypotheses" as any).insert({ project_id: projectId, ...hForm } as any);
    setHForm({ type: "risque_marché", description: "", test_method: "", weight: 3 });
    setShowAddDialog(null);
    await loadAll();
    setSaving(false);
    toast({ title: "Hypothèse ajoutée" });
  };

  const addFeature = async () => {
    setSaving(true);
    await supabase.from("mvp_features" as any).insert({ project_id: projectId, ...fForm } as any);
    setFForm({ name: "", priority: "core" });
    setShowAddDialog(null);
    await loadAll();
    setSaving(false);
    toast({ title: "Fonctionnalité ajoutée" });
  };

  const addPersona = async () => {
    setSaving(true);
    await supabase.from("mvp_personas" as any).insert({ project_id: projectId, ...pForm } as any);
    setPForm({ name: "", description: "", is_early_adopter: false, interviews_target: 30, governorate: "Tunis", age_range: "25-35", socio_profile: "Salarié", psycho_profile: "Early Adopter", emotional_profile: "" });
    setShowAddDialog(null);
    await loadAll();
    setSaving(false);
    toast({ title: "Persona ajouté" });
  };

  const updateHypothesis = async (id: string, updates: Partial<Hypothesis>) => {
    await supabase.from("mvp_hypotheses" as any).update(updates as any).eq("id", id);
    setHypotheses(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const updateFeature = async (id: string, updates: Partial<Feature>) => {
    await supabase.from("mvp_features" as any).update(updates as any).eq("id", id);
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    await supabase.from("mvp_personas" as any).update(updates as any).eq("id", id);
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteItem = async (table: string, id: string) => {
    await supabase.from(table as any).delete().eq("id", id);
    await loadAll();
    toast({ title: "Élément supprimé" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      {/* Global Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ValidationGauge label="TVH" sublabel={t("mvp.hypotheses")} value={tvh} icon={Target} />
        <ValidationGauge label="TVF" sublabel={t("mvp.features")} value={tvf} icon={Layers} />
        <ValidationGauge label="TVP" sublabel={t("mvp.personas")} value={tvp} icon={Users} />
        <ValidationGauge label="TVG" sublabel={t("mvp.global")} value={tvg} icon={TrendingUp} large />
      </div>

      {/* Auto-publish banner */}
      {tvg >= 70 && !isPublished && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">{t("mvp.tvgThreshold")}</p>
              <p className="text-sm text-muted-foreground">TVG = {tvg}%</p>
            </div>
          </div>
          <Button onClick={publishToMarketplace} disabled={isPublishing} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {t("marketplace.publishToMarketplace")}
          </Button>
        </motion.div>
      )}
      {isPublished && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{t("marketplace.autoPublished")}</span>
        </div>
      )}

      {/* Tabs for 3 axes */}
      <Tabs defaultValue="hypotheses">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="hypotheses" className="gap-2"><Target className="h-4 w-4" />Hypothèses ({hypotheses.length})</TabsTrigger>
          <TabsTrigger value="features" className="gap-2"><Layers className="h-4 w-4" />Fonctionnalités ({features.length})</TabsTrigger>
          <TabsTrigger value="personas" className="gap-2"><Users className="h-4 w-4" />Personas ({personas.length})</TabsTrigger>
        </TabsList>

        {/* HYPOTHESES */}
        <TabsContent value="hypotheses" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">TVH = Σ(confidence × poids) / Σ(100 × poids) × 100</p>
            <Button size="sm" onClick={() => setShowAddDialog("hypothesis")} className="gap-2"><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
          {hypotheses.length === 0 ? (
            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">Aucune hypothèse. Ajoutez-en pour commencer la validation.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {hypotheses.map(h => (
                <Card key={h.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-1">
                          <Badge variant={h.type === "risque_marché" ? "default" : h.type === "risque_technique" ? "secondary" : "outline"}>
                            {h.type.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline">Poids: {h.weight}</Badge>
                        </div>
                        <p className="text-sm">{h.description}</p>
                        {h.test_method && <p className="text-xs text-muted-foreground mt-1">Méthode: {h.test_method}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem("mvp_hypotheses", h.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Statut</Label>
                        <Select value={h.validation_status} onValueChange={v => updateHypothesis(h.id, { validation_status: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non_testé">Non testé</SelectItem>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="validé">Validé</SelectItem>
                            <SelectItem value="invalidé">Invalidé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Confiance ({h.confidence_score}%)</Label>
                        <Input type="range" min={0} max={100} value={h.confidence_score}
                          onChange={e => updateHypothesis(h.id, { confidence_score: parseInt(e.target.value) })}
                          className="h-8" />
                      </div>
                    </div>
                    <Progress value={h.confidence_score} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FEATURES */}
        <TabsContent value="features" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">TVF = (core×0.7 + nice×0.3) / (total×100) × 100</p>
            <Button size="sm" onClick={() => setShowAddDialog("feature")} className="gap-2"><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
          {features.length === 0 ? (
            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">Aucune fonctionnalité. Ajoutez les fonctionnalités de votre MVP.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {features.map(f => (
                <Card key={f.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex gap-2 items-center mb-1">
                          <span className="font-medium">{f.name}</span>
                          <Badge variant={f.priority === "core" ? "default" : "secondary"}>{f.priority === "core" ? "Core" : "Nice to have"}</Badge>
                          {f.tested && (
                            <Badge variant={f.test_result === "passed" ? "default" : f.test_result === "failed" ? "destructive" : "outline"} className="text-xs">
                              {f.test_result === "passed" ? "✅ Passé" : f.test_result === "failed" ? "❌ Échoué" : "⏳ En attente"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem("mvp_features", f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Complétion ({f.completion_percentage}%)</Label>
                        <Input type="range" min={0} max={100} value={f.completion_percentage}
                          onChange={e => updateFeature(f.id, { completion_percentage: parseInt(e.target.value) })}
                          className="h-8" />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Switch checked={f.tested} onCheckedChange={v => updateFeature(f.id, { tested: v })} />
                          <Label className="text-xs">Testé</Label>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Résultat test</Label>
                        <Select value={f.test_result} onValueChange={v => updateFeature(f.id, { test_result: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="passed">Passé</SelectItem>
                            <SelectItem value="failed">Échoué</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Progress value={f.completion_percentage} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PERSONAS */}
        <TabsContent value="personas" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">TVP = (interviews×0.4) + (conversion×0.35) + (satisfaction×0.25)</p>
            <Button size="sm" onClick={() => setShowAddDialog("persona")} className="gap-2"><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
          {personas.length === 0 ? (
            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">Aucun persona. Ajoutez vos personas cibles.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {personas.map(p => (
                <Card key={p.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex gap-2 items-center mb-2 flex-wrap">
                          <span className="font-semibold text-base">{p.name}</span>
                          {p.is_early_adopter && <Badge className="bg-amber-500 text-white">Early Adopter</Badge>}
                        </div>
                        {p.description && <p className="text-xs text-muted-foreground mb-3">{p.description}</p>}

                        {/* Profile Specifications */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          {p.governorate && (
                            <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5">
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Géographie</p>
                                <p className="text-xs font-medium">{p.governorate}{p.age_range ? ` • ${p.age_range} ans` : ""}</p>
                              </div>
                            </div>
                          )}
                          {p.socio_profile && (
                            <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5">
                              <UserCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sociodémo.</p>
                                <p className="text-xs font-medium">{p.socio_profile}</p>
                              </div>
                            </div>
                          )}
                          {p.psycho_profile && (
                            <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5">
                              <Brain className="h-3.5 w-3.5 text-primary shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Psycho.</p>
                                <p className="text-xs font-medium">{p.psycho_profile}</p>
                              </div>
                            </div>
                          )}
                          {p.emotional_profile && (
                            <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5">
                              <Heart className="h-3.5 w-3.5 text-destructive shrink-0" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Émotionnel</p>
                                <p className="text-xs font-medium">{p.emotional_profile}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem("mvp_personas", p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Interviews ({p.interviews_done}/{p.interviews_target})</Label>
                        <Input type="number" min={0} value={p.interviews_done} className="h-8 text-xs"
                          onChange={e => updatePersona(p.id, { interviews_done: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <Label className="text-xs">Cible interviews</Label>
                        <Input type="number" min={1} value={p.interviews_target} className="h-8 text-xs"
                          onChange={e => updatePersona(p.id, { interviews_target: parseInt(e.target.value) || 1 })} />
                      </div>
                      <div>
                        <Label className="text-xs">Conversion (%)</Label>
                        <Input type="number" min={0} max={100} step={0.1} value={p.conversion_rate} className="h-8 text-xs"
                          onChange={e => updatePersona(p.id, { conversion_rate: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <Label className="text-xs">Satisfaction (/10)</Label>
                        <Input type="number" min={0} max={10} step={0.1} value={p.satisfaction_score} className="h-8 text-xs"
                          onChange={e => updatePersona(p.id, { satisfaction_score: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <Progress value={p.interviews_target > 0 ? (p.interviews_done / p.interviews_target) * 100 : 0} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Dialogs */}
      <Dialog open={showAddDialog === "hypothesis"} onOpenChange={o => !o && setShowAddDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une hypothèse</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type de risque</Label>
              <Select value={hForm.type} onValueChange={v => setHForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="risque_marché">Risque Marché</SelectItem>
                  <SelectItem value="risque_technique">Risque Technique</SelectItem>
                  <SelectItem value="risque_financier">Risque Financier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={hForm.description} onChange={e => setHForm(p => ({ ...p, description: e.target.value }))} placeholder="Décrivez l'hypothèse à valider..." />
            </div>
            <div>
              <Label>Méthode de test</Label>
              <Input value={hForm.test_method} onChange={e => setHForm(p => ({ ...p, test_method: e.target.value }))} placeholder="Comment allez-vous tester cette hypothèse ?" />
            </div>
            <div>
              <Label>Importance (1-5)</Label>
              <Select value={hForm.weight.toString()} onValueChange={v => setHForm(p => ({ ...p, weight: parseInt(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(w => <SelectItem key={w} value={w.toString()}>{w} — {w <= 2 ? "Faible" : w <= 3 ? "Moyen" : "Critique"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addHypothesis} disabled={saving || !hForm.description} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog === "feature"} onOpenChange={o => !o && setShowAddDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une fonctionnalité</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={fForm.name} onChange={e => setFForm(p => ({ ...p, name: e.target.value }))} placeholder="Nom de la fonctionnalité" />
            </div>
            <div>
              <Label>Priorité</Label>
              <Select value={fForm.priority} onValueChange={v => setFForm(p => ({ ...p, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core (essentielle)</SelectItem>
                  <SelectItem value="nice_to_have">Nice to have</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addFeature} disabled={saving || !fForm.name} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog === "persona"} onOpenChange={o => !o && setShowAddDialog(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Ajouter un persona</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={pForm.name} onChange={e => setPForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Étudiant ingénieur Tunis" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={pForm.description} onChange={e => setPForm(p => ({ ...p, description: e.target.value }))} placeholder="Décrivez ce persona..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Gouvernorat</Label>
                <Select value={pForm.governorate} onValueChange={v => setPForm(p => ({ ...p, governorate: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tunis","Ariana","Ben Arous","Manouba","Sousse","Sfax","Nabeul","Monastir","Bizerte","Gabès","Kairouan","Médenine","Tozeur","Gafsa","Kasserine","Sidi Bouzid","Béja","Jendouba","Le Kef","Siliana","Mahdia","Kébili","Tataouine","Zaghouan"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tranche d'âge</Label>
                <Select value={pForm.age_range} onValueChange={v => setPForm(p => ({ ...p, age_range: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["18-25","25-35","35-45","45-55","55+"].map(a => <SelectItem key={a} value={a}>{a} ans</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><UserCircle className="h-3.5 w-3.5" />Profil sociodémographique</Label>
              <Select value={pForm.socio_profile} onValueChange={v => setPForm(p => ({ ...p, socio_profile: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Étudiant","Salarié","Entrepreneur","Freelance","Chercheur","Fonctionnaire","Sans emploi","Retraité","Artisan","Agriculteur"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Brain className="h-3.5 w-3.5" />Profil psychographique</Label>
              <Select value={pForm.psycho_profile} onValueChange={v => setPForm(p => ({ ...p, psycho_profile: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Innovateur","Early Adopter","Majorité précoce","Majorité tardive","Retardataire","Visionnaire","Pragmatique","Conservateur"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />Moteur émotionnel</Label>
              <Input value={pForm.emotional_profile} onChange={e => setPForm(p => ({ ...p, emotional_profile: e.target.value }))} placeholder="Ex: Frustré par le manque d'outils adaptés" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={pForm.is_early_adopter} onCheckedChange={v => setPForm(p => ({ ...p, is_early_adopter: v }))} />
              <Label>Early Adopter</Label>
            </div>
            <div>
              <Label>Cible d'interviews</Label>
              <Input type="number" min={1} value={pForm.interviews_target} onChange={e => setPForm(p => ({ ...p, interviews_target: parseInt(e.target.value) || 30 }))} />
            </div>
            <Button onClick={addPersona} disabled={saving || !pForm.name} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MvpValidationDashboard;
