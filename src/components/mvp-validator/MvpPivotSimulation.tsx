import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shuffle, Plus, Trash2, Loader2, Target, Users, Layers,
  MapPin, BarChart3, TrendingDown, TrendingUp, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ValidationGauge from "./ValidationGauge";

type SimPersona = {
  id: string; name: string; geo: string; age_range: string;
  socio: string; psycho: string; emotional: string; weight: number;
};

type SimFeature = {
  id: string; name: string; priority: "core" | "nice_to_have";
};

type SimHypothesis = {
  id: string; description: string; type: string;
  scores: Record<string, Record<string, number>>; // personaId -> featureId -> score (0-100)
};

type Props = { projectId: string; sector: string };

const MvpPivotSimulation = ({ projectId, sector }: Props) => {
  const [personas, setPersonas] = useState<SimPersona[]>([]);
  const [features, setFeatures] = useState<SimFeature[]>([]);
  const [hypotheses, setHypotheses] = useState<SimHypothesis[]>([]);
  const [showAdd, setShowAdd] = useState<"persona" | "feature" | "hypothesis" | null>(null);
  const { toast } = useToast();

  // Forms
  const [pForm, setPForm] = useState({ name: "", geo: "Tunis", age_range: "18-25", socio: "Étudiant", psycho: "Innovateur", emotional: "Frustré par le status quo", weight: 1 });
  const [fForm, setFForm] = useState({ name: "", priority: "core" as const });
  const [hForm, setHForm] = useState({ description: "", type: "risque_marché" });

  const addPersona = () => {
    setPersonas(prev => [...prev, { id: crypto.randomUUID(), ...pForm }]);
    setPForm({ name: "", geo: "Tunis", age_range: "18-25", socio: "Étudiant", psycho: "Innovateur", emotional: "Frustré par le status quo", weight: 1 });
    setShowAdd(null);
    toast({ title: "Persona ajouté à la simulation" });
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, { id: crypto.randomUUID(), ...fForm }]);
    setFForm({ name: "", priority: "core" });
    setShowAdd(null);
  };

  const addHypothesis = () => {
    setHypotheses(prev => [...prev, { id: crypto.randomUUID(), ...hForm, scores: {} }]);
    setHForm({ description: "", type: "risque_marché" });
    setShowAdd(null);
  };

  const updateScore = (hId: string, pId: string, fId: string, score: number) => {
    setHypotheses(prev => prev.map(h => {
      if (h.id !== hId) return h;
      const newScores = { ...h.scores };
      if (!newScores[pId]) newScores[pId] = {};
      newScores[pId] = { ...newScores[pId], [fId]: score };
      return { ...h, scores: newScores };
    }));
  };

  // Calculate pivot scores
  const pivotScores = useMemo(() => {
    if (!personas.length || !features.length || !hypotheses.length) return null;

    // Per-persona score
    const personaScores: Record<string, number> = {};
    personas.forEach(p => {
      let totalScore = 0;
      let count = 0;
      hypotheses.forEach(h => {
        features.forEach(f => {
          const score = h.scores[p.id]?.[f.id] ?? 50;
          const fWeight = f.priority === "core" ? 2 : 1;
          totalScore += score * fWeight;
          count += fWeight;
        });
      });
      personaScores[p.id] = count > 0 ? Math.round(totalScore / count) : 0;
    });

    // Per-feature score
    const featureScores: Record<string, Record<string, number>> = {};
    features.forEach(f => {
      featureScores[f.id] = {};
      personas.forEach(p => {
        let total = 0;
        hypotheses.forEach(h => {
          total += h.scores[p.id]?.[f.id] ?? 50;
        });
        featureScores[f.id][p.id] = hypotheses.length > 0 ? Math.round(total / hypotheses.length) : 0;
      });
    });

    // Global pivot score
    let globalTotal = 0;
    let globalWeight = 0;
    personas.forEach(p => {
      globalTotal += personaScores[p.id] * p.weight;
      globalWeight += p.weight;
    });
    const globalScore = globalWeight > 0 ? Math.round(globalTotal / globalWeight) : 0;

    // Pivot needed if < 50
    const pivotNeeded = globalScore < 50;

    return { personaScores, featureScores, globalScore, pivotNeeded };
  }, [personas, features, hypotheses]);

  const canSimulate = personas.length > 0 && features.length > 0 && hypotheses.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shuffle className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Simulation Pivot Initial</h3>
        <Badge variant="secondary">Hypothèses × Fonctionnalités × Personas</Badge>
      </div>

      {/* Setup buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" onClick={() => setShowAdd("persona")} className="gap-2 h-auto py-3 flex-col">
          <Users className="h-5 w-5" />
          <span>Personas ({personas.length})</span>
        </Button>
        <Button variant="outline" onClick={() => setShowAdd("feature")} className="gap-2 h-auto py-3 flex-col">
          <Layers className="h-5 w-5" />
          <span>Fonctionnalités ({features.length})</span>
        </Button>
        <Button variant="outline" onClick={() => setShowAdd("hypothesis")} className="gap-2 h-auto py-3 flex-col">
          <Target className="h-5 w-5" />
          <span>Hypothèses ({hypotheses.length})</span>
        </Button>
      </div>

      {/* Results */}
      {canSimulate && pivotScores && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Global Pivot Score */}
          <Card className={`border-2 ${pivotScores.pivotNeeded ? "border-red-300 bg-red-50/50 dark:bg-red-950/10" : "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/10"}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    {pivotScores.pivotNeeded ? <TrendingDown className="h-5 w-5 text-red-500" /> : <TrendingUp className="h-5 w-5 text-emerald-500" />}
                    Score Pivot Global
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pivotScores.pivotNeeded
                      ? "⚠️ Pivot recommandé — les hypothèses ne sont pas suffisamment validées"
                      : "✅ Continuez — les signaux sont positifs"}
                  </p>
                </div>
                <div className={`text-4xl font-black ${pivotScores.globalScore <= 30 ? "text-red-500" : pivotScores.globalScore <= 60 ? "text-amber-500" : "text-emerald-500"}`}>
                  {pivotScores.globalScore}%
                </div>
              </div>
              <Progress value={pivotScores.globalScore} className="h-3 mt-4" />
            </CardContent>
          </Card>

          {/* Per-Persona Scores */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Score par Persona</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {personas.map(p => {
                const score = pivotScores.personaScores[p.id];
                return (
                  <Card key={p.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">{p.name}</span>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs"><MapPin className="h-3 w-3 mr-1" />{p.geo}</Badge>
                            <Badge variant="outline" className="text-xs">{p.age_range} ans</Badge>
                            <Badge variant="outline" className="text-xs">{p.socio}</Badge>
                          </div>
                        </div>
                        <span className={`text-xl font-bold ${score <= 30 ? "text-red-500" : score <= 60 ? "text-amber-500" : "text-emerald-500"}`}>{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Scoring Matrix */}
          <Card>
            <CardHeader><CardTitle className="text-base">Matrice de Scoring — Hypothèses × Fonctionnalités × Personas</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {hypotheses.map(h => (
                  <div key={h.id} className="mb-6">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Badge variant={h.type === "risque_marché" ? "default" : "secondary"} className="text-xs">{h.type.replace("_", " ")}</Badge>
                      {h.description}
                    </h5>
                    <div className="grid gap-2">
                      {personas.map(p => (
                        <div key={p.id} className="flex items-center gap-2 text-xs">
                          <span className="w-24 truncate font-medium">{p.name}</span>
                          {features.map(f => (
                            <div key={f.id} className="flex items-center gap-1">
                              <span className="w-20 truncate text-muted-foreground">{f.name}</span>
                              <Input type="range" min={0} max={100} className="w-20 h-6"
                                value={h.scores[p.id]?.[f.id] ?? 50}
                                onChange={e => updateScore(h.id, p.id, f.id, parseInt(e.target.value))} />
                              <span className="w-8 text-right">{h.scores[p.id]?.[f.id] ?? 50}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!canSimulate && (
        <Card className="text-center py-8">
          <CardContent>
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Ajoutez au moins 1 persona, 1 fonctionnalité et 1 hypothèse pour lancer la simulation.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Persona Dialog */}
      <Dialog open={showAdd === "persona"} onOpenChange={o => !o && setShowAdd(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter un Persona (Simulation)</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nom</Label><Input value={pForm.name} onChange={e => setPForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Étudiant ingénieur Tunis" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Gouvernorat</Label>
                <Select value={pForm.geo} onValueChange={v => setPForm(p => ({ ...p, geo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tunis","Ariana","Ben Arous","Sousse","Sfax","Nabeul","Monastir","Bizerte","Gabès","Kairouan"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Tranche d'âge</Label>
                <Select value={pForm.age_range} onValueChange={v => setPForm(p => ({ ...p, age_range: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["18-25","25-35","35-45","45-55","55+"].map(a => <SelectItem key={a} value={a}>{a} ans</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Profil sociodémographique</Label>
              <Select value={pForm.socio} onValueChange={v => setPForm(p => ({ ...p, socio: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Étudiant","Salarié","Entrepreneur","Freelance","Chercheur","Fonctionnaire","Sans emploi"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Profil psychographique</Label>
              <Select value={pForm.psycho} onValueChange={v => setPForm(p => ({ ...p, psycho: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Innovateur","Early Adopter","Majorité précoce","Majorité tardive","Retardataire"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Moteur émotionnel</Label>
              <Input value={pForm.emotional} onChange={e => setPForm(p => ({ ...p, emotional: e.target.value }))} placeholder="Ex: Frustré par le manque de..." />
            </div>
            <div><Label>Poids dans la simulation (1-5)</Label>
              <Select value={pForm.weight.toString()} onValueChange={v => setPForm(p => ({ ...p, weight: parseInt(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(w => <SelectItem key={w} value={w.toString()}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addPersona} disabled={!pForm.name} className="w-full">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Feature Dialog */}
      <Dialog open={showAdd === "feature"} onOpenChange={o => !o && setShowAdd(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une Fonctionnalité</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nom</Label><Input value={fForm.name} onChange={e => setFForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Inscription utilisateur" /></div>
            <div><Label>Priorité</Label>
              <Select value={fForm.priority} onValueChange={v => setFForm(p => ({ ...p, priority: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core (essentielle)</SelectItem>
                  <SelectItem value="nice_to_have">Nice to have</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addFeature} disabled={!fForm.name} className="w-full">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Hypothesis Dialog */}
      <Dialog open={showAdd === "hypothesis"} onOpenChange={o => !o && setShowAdd(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une Hypothèse</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Type</Label>
              <Select value={hForm.type} onValueChange={v => setHForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="risque_marché">Risque Marché</SelectItem>
                  <SelectItem value="risque_technique">Risque Technique</SelectItem>
                  <SelectItem value="risque_financier">Risque Financier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={hForm.description} onChange={e => setHForm(p => ({ ...p, description: e.target.value }))} placeholder="Ex: Les utilisateurs sont prêts à payer 30 DT/mois" /></div>
            <Button onClick={addHypothesis} disabled={!hForm.description} className="w-full">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MvpPivotSimulation;
