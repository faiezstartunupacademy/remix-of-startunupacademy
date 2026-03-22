import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, GraduationCap, CheckCircle, Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const STAGES = [
  { value: "student", label: "Étudiant" },
  { value: "student-entrepreneur", label: "Étudiant-Entrepreneur" },
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "serie-a", label: "Série A+" },
];

type Formation = {
  id: string;
  title: string;
  domain: string;
  duration_hours: number;
  level: string;
  type: string;
};

const ParticipantRegistrationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    startup_stage: "student",
    formation_id: "",
  });

  useEffect(() => {
    const loadFormations = async () => {
      const { data } = await supabase.from("formations" as any).select("id, title, domain, duration_hours, level, type").eq("is_active", true);
      if (data) setFormations(data as any);
    };
    loadFormations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter.", variant: "destructive" });
      return;
    }
    if (!form.full_name.trim() || !form.email.trim() || !form.formation_id) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("formation_participants" as any).insert({
      user_id: user.id,
      formation_id: form.formation_id,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      startup_stage: form.startup_stage,
    } as any);

    if (error) {
      toast({ title: "Erreur", description: error.message.includes("duplicate") ? "Vous êtes déjà inscrit à cette formation." : error.message, variant: "destructive" });
    } else {
      setIsSubmitted(true);
      toast({ title: "✅ Inscription confirmée", description: "Vous êtes inscrit à la formation." });
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Inscription confirmée !</h3>
          <p className="text-muted-foreground">Vous recevrez les détails de la formation par email.</p>
          <Button className="mt-4" onClick={() => setIsSubmitted(false)}>S'inscrire à une autre formation</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Inscription Participant
          </CardTitle>
          <p className="text-sm text-muted-foreground">Inscrivez-vous à une formation pour développer vos compétences entrepreneuriales.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p_name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="p_name" placeholder="Votre nom" value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="pl-10" required maxLength={100} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p_email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="p_email" type="email" placeholder="votre@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="pl-10" required maxLength={255} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stade *</Label>
              <Select value={form.startup_stage} onValueChange={v => setForm(f => ({ ...f, startup_stage: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formation *</Label>
              {formations.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Aucune formation disponible pour le moment.</p>
              ) : (
                <div className="grid gap-2 max-h-64 overflow-auto">
                  {formations.map(f => (
                    <div
                      key={f.id}
                      onClick={() => setForm(prev => ({ ...prev, formation_id: f.id }))}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        form.formation_id === f.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{f.title}</span>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">{f.domain}</Badge>
                          <Badge variant="secondary" className="text-xs">{f.duration_hours}h</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting || !form.formation_id}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
              Confirmer l'inscription
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParticipantRegistrationForm;
