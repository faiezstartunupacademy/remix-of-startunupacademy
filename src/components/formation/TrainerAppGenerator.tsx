import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Video, FileText, CheckCircle, Loader2, Settings, Sparkles, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DOMAINS = [
  "Design Thinking", "Lean Startup", "Business Model", "Growth Hacking",
  "Marketing Digital", "FinTech", "AgriTech", "HealthTech", "EdTech",
  "GreenTech", "IA & Data", "Blockchain", "IoT", "Cybersécurité",
  "Leadership", "Finance", "Juridique", "Ressources Humaines",
];

const TrainerAppGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    domain: "",
    description: "",
    duration_hours: 10,
    modules_count: 5,
    max_participants: 30,
    is_distance: true,
    level: "debutant",
  });

  const modules = [
    { icon: Video, title: "Vidéos & Présentations", desc: "Hébergement de contenus vidéo avec player intégré" },
    { icon: FileText, title: "Supports & Documents", desc: "Upload de PDF, slides et ressources pédagogiques" },
    { icon: CheckCircle, title: "Quiz & Évaluations", desc: "Système de quiz interactifs avec scoring automatique" },
    { icon: Users, title: "Espace Participants", desc: "Suivi de progression et communication" },
    { icon: BarChart3, title: "Analytics", desc: "Tableau de bord de suivi des performances" },
    { icon: Sparkles, title: "Certificats", desc: "Génération automatique de certificats" },
  ];

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: "Connexion requise", variant: "destructive" });
      return;
    }
    if (!config.title.trim() || !config.domain) {
      toast({ title: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    
    // Create the formation in DB
    const { error } = await supabase.from("formations").insert({
      title: config.title.trim(),
      domain: config.domain,
      description: config.description.trim() || null,
      duration_hours: config.duration_hours,
      modules_count: config.modules_count,
      max_participants: config.max_participants,
      is_distance: config.is_distance,
      level: config.level,
      type: "external",
      trainer_id: null, // Will be linked later when trainer profile is approved
    } as any);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setIsGenerated(true);
      toast({ title: "✅ Formation créée !", description: "Votre espace de formation a été généré avec succès." });
    }
    setIsGenerating(false);
  };

  if (isGenerated) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-10 pb-10 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <Rocket className="h-20 w-20 text-primary mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold">Votre espace de formation est prêt !</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              <strong>{config.title}</strong> a été créé. Vous pouvez maintenant ajouter vos contenus 
              (vidéos, documents, quiz) et inviter vos participants.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {modules.map(m => (
                <Badge key={m.title} variant="outline" className="gap-1 py-1.5">
                  <m.icon className="h-3 w-3" />{m.title}
                </Badge>
              ))}
            </div>
            <Button className="mt-6" onClick={() => { setIsGenerated(false); setStep(1); setConfig({ title: "", domain: "", description: "", duration_hours: 10, modules_count: 5, max_participants: 30, is_distance: true, level: "debutant" }); }}>
              Créer une autre formation
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Générateur d'Espace de Formation
          </CardTitle>
          <CardDescription>Créez votre application de formation personnalisée en quelques étapes.</CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">1. Informations de base</h3>
              <div className="space-y-2">
                <Label>Titre de la formation *</Label>
                <Input placeholder="Ex: Introduction à l'IA pour entrepreneurs" value={config.title}
                  onChange={e => setConfig(c => ({ ...c, title: e.target.value }))} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Domaine *</Label>
                <Select value={config.domain} onValueChange={v => setConfig(c => ({ ...c, domain: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir un domaine" /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Décrivez le contenu et les objectifs..." value={config.description}
                  onChange={e => setConfig(c => ({ ...c, description: e.target.value }))} rows={3} maxLength={1000} />
              </div>
              <Button onClick={() => setStep(2)} disabled={!config.title.trim() || !config.domain} className="w-full">
                Suivant
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">2. Configuration</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durée (heures)</Label>
                  <Input type="number" min={1} max={200} value={config.duration_hours}
                    onChange={e => setConfig(c => ({ ...c, duration_hours: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Nombre de modules</Label>
                  <Input type="number" min={1} max={50} value={config.modules_count}
                    onChange={e => setConfig(c => ({ ...c, modules_count: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Max participants</Label>
                  <Input type="number" min={1} max={500} value={config.max_participants}
                    onChange={e => setConfig(c => ({ ...c, max_participants: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select value={config.level} onValueChange={v => setConfig(c => ({ ...c, level: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">Débutant</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="avance">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Retour</Button>
                <Button onClick={() => setStep(3)} className="flex-1">Suivant</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">3. Modules inclus</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {modules.map((m, i) => (
                  <motion.div key={m.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                      <m.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-1">
                <p><strong>Récapitulatif :</strong></p>
                <p>📚 {config.title} • {config.domain}</p>
                <p>⏱ {config.duration_hours}h • {config.modules_count} modules • Max {config.max_participants} participants</p>
                <p>📊 Niveau : {config.level}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Retour</Button>
                <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 gap-2">
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                  Générer l'application
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrainerAppGenerator;
