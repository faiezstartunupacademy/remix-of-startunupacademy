import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Linkedin, FileText, Send, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DOMAINS = [
  "Design Thinking", "Lean Startup", "Business Model", "Growth Hacking",
  "Marketing Digital", "FinTech", "AgriTech", "HealthTech", "EdTech",
  "GreenTech", "IA & Data", "Blockchain", "IoT", "Cybersécurité",
  "Leadership", "Finance", "Juridique", "Ressources Humaines", "Autre"
];

const TrainerRegistrationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    expertise_domain: "",
    bio: "",
    linkedin_url: "",
    years_experience: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter pour soumettre votre candidature.", variant: "destructive" });
      return;
    }
    if (!form.full_name.trim() || !form.email.trim() || !form.expertise_domain) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("formation_trainers" as any).insert({
      user_id: user.id,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      expertise_domain: form.expertise_domain,
      bio: form.bio.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      years_experience: form.years_experience,
    } as any);

    if (error) {
      toast({ title: "Erreur", description: error.message.includes("duplicate") ? "Vous avez déjà soumis une candidature." : error.message, variant: "destructive" });
    } else {
      setIsSubmitted(true);
      toast({ title: "✅ Candidature envoyée", description: "Votre profil formateur est en attente de validation." });
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Candidature envoyée !</h3>
          <p className="text-muted-foreground">Votre profil formateur sera examiné par notre équipe. Vous recevrez une notification une fois validé.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Devenir Formateur STARTUNUP
          </CardTitle>
          <p className="text-sm text-muted-foreground">Partagez votre expertise avec notre communauté d'entrepreneurs.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="full_name" placeholder="Votre nom" value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="pl-10" required maxLength={100} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="votre@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="pl-10" required maxLength={255} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" placeholder="+216 XX XXX XXX" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="pl-10" maxLength={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Années d'expérience</Label>
                <Input id="experience" type="number" min={0} max={50} value={form.years_experience}
                  onChange={e => setForm(f => ({ ...f, years_experience: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Domaine *</Label>
              <Select value={form.expertise_domain} onValueChange={v => setForm(f => ({ ...f, expertise_domain: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionnez votre domaine" /></SelectTrigger>
                <SelectContent>
                  {DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Parcours</Label>
              <Textarea id="bio" placeholder="Décrivez votre parcours et ce que vous souhaitez enseigner..."
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} maxLength={1000} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="linkedin" placeholder="https://linkedin.com/in/votre-profil" value={form.linkedin_url}
                  onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} className="pl-10" maxLength={255} />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Soumettre ma candidature
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrainerRegistrationForm;
