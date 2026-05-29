import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, AlertTriangle, CalendarDays, Users, Link2, Loader2, Plus, CheckCircle2, Clock, XCircle, FileText, ArrowLeft, CalendarRange, Sparkles, Video } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import TrainerRegistrationForm from "@/components/formation/TrainerRegistrationForm";


const THEMES = [
  "Design Thinking", "Lean Startup", "Business Model", "Growth Hacking",
  "Marketing Digital", "Finance & Levée", "Pitch & Storytelling",
  "Product Management", "UX/UI Design", "FinTech", "AgriTech", "HealthTech",
  "EdTech", "GreenTech", "IA & Data", "Cybersécurité", "Leadership",
  "Juridique Startup", "Ressources Humaines", "Autre",
];

interface AnimatedSession {
  id: string;
  theme: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  duration_hours: number | null;
  participants_count: number;
  resources_url: string | null;
  status: "planned" | "completed" | "validated" | "rejected";
  admin_notes: string | null;
  validated_at: string | null;
}

const statusMap = {
  planned:   { label: "Planifiée",  color: "bg-sky-500/10 text-sky-600 border-sky-500/30",        icon: Clock },
  completed: { label: "Terminée",   color: "bg-amber-500/10 text-amber-600 border-amber-500/30",   icon: CalendarDays },
  validated: { label: "Validée ✓",  color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 },
  rejected:  { label: "Refusée",    color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

const DevenirFormateurPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<AnimatedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    theme: "", title: "", description: "", scheduled_date: "",
    duration_hours: 2, participants_count: 0, resources_url: "",
  });

  const loadSessions = async () => {
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("trainer_animated_sessions" as any)
      .select("*").eq("trainer_user_id", user.id).order("scheduled_date", { ascending: false });
    if (!error) setSessions((data || []) as any);
    setLoading(false);
  };

  useEffect(() => { loadSessions(); }, [user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (!accepted) return toast({ title: "Acceptation requise", description: "Veuillez confirmer votre responsabilité éditoriale.", variant: "destructive" });
    if (!form.theme || !form.title || !form.scheduled_date) {
      return toast({ title: "Champs obligatoires manquants", variant: "destructive" });
    }
    setSubmitting(true);
    const { error } = await supabase.from("trainer_animated_sessions" as any).insert({
      trainer_user_id: user.id,
      theme: form.theme, title: form.title.trim(),
      description: form.description.trim() || null,
      scheduled_date: form.scheduled_date,
      duration_hours: form.duration_hours,
      participants_count: form.participants_count,
      resources_url: form.resources_url.trim() || null,
      status: new Date(form.scheduled_date) <= new Date() ? "completed" : "planned",
    } as any);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Formation déclarée", description: "En attente de validation par un administrateur." });
      setForm({ theme: "", title: "", description: "", scheduled_date: "", duration_hours: 2, participants_count: 0, resources_url: "" });
      setAccepted(false);
      loadSessions();
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10 max-w-6xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
          <Link to="/communaute"><ArrowLeft className="h-4 w-4" /> Retour Communauté</Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-amber-500 bg-clip-text text-transparent mb-3">
            Devenir Formateur STARTUNUP
          </h1>
          <p className="text-lg text-muted-foreground">
            Partagez votre expertise, animez une formation et débloquez l'accès complet au Pôle Stratégique.
          </p>
        </motion.div>

        {/* Rules block */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Règles d'éligibilité</CardTitle>
            <CardDescription>Pour débloquer l'accès au Pôle Stratégique en tant que formateur.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3"><Users className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /><div><b>Minimum 15 participants</b> par formation animée. Une formation avec moins de 15 inscrits ne peut pas être validée.</div></div>
            <div className="flex gap-3"><CalendarDays className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /><div><b>Délai de 15 jours</b> obligatoire entre deux formations sur la même thématique par le même formateur.</div></div>
            <div className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><div>Chaque formation contient un <b>système d'évaluation</b> automatique (quiz + feedback). Une formation validée = accès Pôle Stratégique.</div></div>
            <div className="flex gap-3"><AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" /><div>Un <b>simple participant</b> n'obtient pas l'accès stratégique. Seul l'animateur d'une formation validée en bénéficie.</div></div>
            <div className="flex gap-3"><FileText className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" /><div>L'ajout de <b>ressources et supports est optionnel</b>.</div></div>
            <div className="flex gap-3"><ShieldCheck className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" /><div>Le formateur <b>assume la pleine responsabilité éditoriale</b> du contenu enseigné.</div></div>
          </CardContent>
        </Card>

        <Tabs defaultValue="declare" className="space-y-6">
          <TabsList className="grid w-full md:w-[640px] grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="declare">Déclarer</TabsTrigger>
            <TabsTrigger value="sessions">Mes sessions ({sessions.length})</TabsTrigger>
            <TabsTrigger value="forum" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Forum</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="declare">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Nouvelle formation animée</CardTitle>
                <CardDescription>Déclarez une formation que vous avez animée ou planifiée. Elle sera examinée par un administrateur.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Thématique *</Label>
                      <select required value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Sélectionnez…</option>
                        {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date de la formation *</Label>
                      <Input type="date" required value={form.scheduled_date}
                        onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Titre de la formation *</Label>
                    <Input required maxLength={150} value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Ex : Maîtriser le Lean Canvas en 4 heures" />
                  </div>

                  <div className="space-y-2">
                    <Label>Description / objectifs</Label>
                    <Textarea rows={3} maxLength={800} value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Objectifs pédagogiques, public visé, format…" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Durée (heures)</Label>
                      <Input type="number" min={1} max={40} value={form.duration_hours}
                        onChange={e => setForm(f => ({ ...f, duration_hours: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre de participants *</Label>
                      <Input type="number" min={0} max={500} value={form.participants_count}
                        onChange={e => setForm(f => ({ ...f, participants_count: parseInt(e.target.value) || 0 }))}
                        placeholder="≥ 15 requis pour validation" />
                      {form.participants_count > 0 && form.participants_count < 15 && (
                        <p className="text-xs text-amber-600">⚠ Au moins 15 participants requis pour valider la formation.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Ressources (URL, optionnel)</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="url" value={form.resources_url} className="pl-10"
                          onChange={e => setForm(f => ({ ...f, resources_url: e.target.value }))}
                          placeholder="https://…" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted/40 border">
                    <Checkbox id="accept" checked={accepted} onCheckedChange={v => setAccepted(!!v)} className="mt-0.5" />
                    <Label htmlFor="accept" className="text-sm leading-relaxed cursor-pointer">
                      Je confirme assumer l'<b>entière responsabilité éditoriale</b> du contenu présenté, certifie l'exactitude des informations déclarées (date, participants) et accepte les règles d'éligibilité STARTUNUP.
                    </Label>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full gap-2">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Déclarer cette formation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : sessions.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">
                <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                Aucune formation déclarée pour le moment.
              </CardContent></Card>
            ) : (
              <div className="space-y-3">
                {sessions.map(s => {
                  const sm = statusMap[s.status];
                  return (
                    <Card key={s.id}>
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold">{s.title}</h3>
                              <Badge variant="outline" className="text-xs">{s.theme}</Badge>
                              <Badge className={`text-xs ${sm.color}`} variant="outline">
                                <sm.icon className="h-3 w-3 mr-1" /> {sm.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(s.scheduled_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                              · {s.duration_hours}h · {s.participants_count} participant·e·s
                            </p>
                            {s.description && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{s.description}</p>}
                            {s.admin_notes && (
                              <div className="mt-2 p-2 bg-muted/40 rounded text-xs">
                                <b>Note admin :</b> {s.admin_notes}
                              </div>
                            )}
                          </div>
                          {s.resources_url && (
                            <Button size="sm" variant="outline" asChild className="gap-1">
                              <a href={s.resources_url} target="_blank" rel="noreferrer"><Link2 className="h-3 w-3" /> Ressources</a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="forum">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Forum & Communauté</CardTitle>
                  <CardDescription>Discussions, formations programmées et collaboration en temps réel avec la communauté STARTUNUP.</CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild className="gap-1.5 shrink-0">
                  <a href="/communaute/forum" target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /> Ouvrir en plein écran</a>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  src="/communaute/forum"
                  title="Forum & Communauté STARTUNUP"
                  className="w-full rounded-b-lg border-t"
                  style={{ height: "78vh", minHeight: 600 }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <TrainerRegistrationForm />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default DevenirFormateurPage;
