import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const SECTORS = ["SaaS", "DeepTech", "E-commerce", "EdTech", "FinTech", "HealthTech", "AgriTech", "CleanTech", "Marketplace", "Autre"];

const GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte",
  "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia",
  "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Médenine",
  "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

const SSOS = ["Flat6Labs", "Founder Institute", "Wiki Startup", "B@Labs", "BIAT Labs", "Cogite", "Impact Partner", "Autre", "Aucun"];

const PROGRAMS = ["Pré-incubation", "Incubation", "Accélération", "Post-accélération"];

type Props = {
  userId: string;
  onComplete: (project: any) => void;
};

const MvpOnboardingWizard = ({ userId, onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sector: "",
    scenario: "A",
    cofounders_count: 1,
    governorate: "",
    sso: "",
    incubation_program: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0 && form.description.trim().length > 0;
    if (step === 2) return form.sector.length > 0;
    if (step === 3) return true;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mvp_validator_projects" as any)
      .insert({
        user_id: userId,
        name: form.name.trim(),
        description: form.description.trim(),
        sector: form.sector,
        scenario: form.scenario,
        cofounders_count: form.cofounders_count,
        governorate: form.governorate || null,
        sso: form.sso || null,
        incubation_program: form.incubation_program || null,
        status: "active",
      } as any)
      .select()
      .single();
    setLoading(false);
    if (!error && data) onComplete(data as any);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Nouveau Projet MVP</CardTitle>
            <p className="text-sm text-muted-foreground">Étape {step} sur {totalSteps}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Identité du projet</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du projet *</Label>
                  <Input id="name" placeholder="Ex: FoodTech Platform" value={form.name} onChange={e => updateForm("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description courte * (max 280 caractères)</Label>
                  <Textarea id="desc" placeholder="Décrivez votre projet en une phrase..." value={form.description} onChange={e => updateForm("description", e.target.value.slice(0, 280))} maxLength={280} />
                  <p className="text-xs text-muted-foreground text-right">{form.description.length}/280</p>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Classification</h3>
                <div className="space-y-2">
                  <Label>Secteur d'activité *</Label>
                  <Select value={form.sector} onValueChange={v => updateForm("sector", v)}>
                    <SelectTrigger><SelectValue placeholder="Choisir un secteur" /></SelectTrigger>
                    <SelectContent>
                      {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Scénario</Label>
                  <RadioGroup value={form.scenario} onValueChange={v => updateForm("scenario", v)} className="space-y-2">
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="A" id="scenA" />
                      <Label htmlFor="scenA" className="cursor-pointer">
                        <span className="font-medium">💡 Scénario A — J'ai une idée seulement</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Stade d'idéation / découverte client</p>
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="B" id="scenB" />
                      <Label htmlFor="scenB" className="cursor-pointer">
                        <span className="font-medium">📋 Scénario B — Idée + Business Model validé</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Stade de validation client / construction MVP</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cofounders">Nombre de cofondateurs</Label>
                  <Input id="cofounders" type="number" min={1} max={10} value={form.cofounders_count} onChange={e => updateForm("cofounders_count", parseInt(e.target.value) || 1)} />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Écosystème</h3>
                <div className="space-y-2">
                  <Label>Gouvernorat</Label>
                  <Select value={form.governorate} onValueChange={v => updateForm("governorate", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {GOVERNORATES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Structure de Soutien (SSO)</Label>
                  <Select value={form.sso} onValueChange={v => updateForm("sso", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {SSOS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Programme d'incubation</Label>
                  <Select value={form.incubation_program} onValueChange={v => updateForm("incubation_program", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {PROGRAMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Récapitulatif</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Projet", value: form.name },
                    { label: "Secteur", value: form.sector },
                    { label: "Scénario", value: form.scenario === "A" ? "Idée seule" : "Idée + BM" },
                    { label: "Cofondateurs", value: form.cofounders_count },
                    { label: "Gouvernorat", value: form.governorate || "—" },
                    { label: "SSO", value: form.sso || "Aucun" },
                    { label: "Programme", value: form.incubation_program || "—" },
                  ].map(item => (
                    <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
                {form.description && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm">{form.description}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Précédent
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="gap-2">
              Suivant <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Rocket className="h-4 w-4" /> Créer le projet</>}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MvpOnboardingWizard;
