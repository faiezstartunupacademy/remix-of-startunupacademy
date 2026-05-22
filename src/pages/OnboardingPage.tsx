import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Rocket, GraduationCap, Briefcase, Building2, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Role = "startuper" | "mentor" | "investor" | "incubator";

const ROLES: Array<{ id: Role; icon: any; emoji: string; title: string; subtitle: string; gradient: string }> = [
  { id: "startuper", icon: Rocket, emoji: "🚀", title: "Je suis Startuper", subtitle: "J'ai une idée ou une startup en démarrage", gradient: "from-blue-500 via-indigo-500 to-purple-600" },
  { id: "mentor", icon: GraduationCap, emoji: "🎓", title: "Je suis Mentor / Expert", subtitle: "Je veux accompagner les startups", gradient: "from-emerald-500 via-teal-500 to-cyan-600" },
  { id: "investor", icon: Briefcase, emoji: "💼", title: "Je suis Investisseur", subtitle: "Je cherche des deals à fort potentiel", gradient: "from-amber-500 via-orange-500 to-red-500" },
  { id: "incubator", icon: Building2, emoji: "🏛️", title: "Je suis Incubateur / Programme", subtitle: "Je gère un programme d'incubation", gradient: "from-pink-500 via-rose-500 to-fuchsia-600" },
];

const SECTORS = ["AgriTech", "HealthTech", "EdTech", "FinTech", "GreenTech", "E-commerce", "Tourism Tech", "DeepTech", "SaaS", "Autre"];
const STAGES = ["Idée", "MVP", "Lancée"];
const WILAYAS = ["Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    startup_name: "", startup_sector: "", startup_stage: "", wilaya: "", team_size: 1, problem_statement: "",
    expertise_domain: "", investment_thesis: "", program_name: "", bio: "", phone: "",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);
      const { data: prof } = await supabase.from("profiles").select("onboarding_completed, role_type").eq("user_id", user.id).maybeSingle();
      if (prof?.onboarding_completed) navigate("/mission-control");
    })();
  }, [navigate]);

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const totalSteps = 2;
  const progress = role ? 100 : 50;

  const handleSubmit = async () => {
    if (!userId || !role) return;
    setLoading(true);
    const patch: any = { role_type: role, onboarding_completed: true, onboarding_step: 2 };
    if (role === "startuper") {
      Object.assign(patch, {
        startup_name: form.startup_name, startup_sector: form.startup_sector, startup_stage: form.startup_stage,
        wilaya: form.wilaya, team_size: form.team_size, problem_statement: form.problem_statement,
      });
    } else if (role === "mentor") {
      Object.assign(patch, { expertise_domain: form.expertise_domain, bio: form.bio, wilaya: form.wilaya });
    } else if (role === "investor") {
      Object.assign(patch, { investment_thesis: form.investment_thesis, bio: form.bio });
    } else if (role === "incubator") {
      Object.assign(patch, { program_name: form.program_name, wilaya: form.wilaya, bio: form.bio });
    }
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", userId);
    setLoading(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Bienvenue 🎉", description: "Votre profil est prêt." });
    if (role === "startuper") navigate("/mission-control");
    else navigate("/");
  };

  const canSubmit = () => {
    if (!role) return false;
    if (role === "startuper") return form.startup_name && form.startup_sector && form.startup_stage && form.wilaya && form.problem_statement;
    if (role === "mentor") return form.expertise_domain && form.bio;
    if (role === "investor") return form.investment_thesis;
    if (role === "incubator") return form.program_name;
    return false;
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl" />
      <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="mb-6 backdrop-blur-md bg-background/80 rounded-2xl p-4 border border-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Étape {step} sur {totalSteps}</span>
            <span className="text-sm text-primary font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="text-center mb-10">
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                  Qui êtes-vous ?
                </motion.h1>
                <p className="text-muted-foreground text-lg">Choisissez votre profil pour personnaliser votre expérience.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROLES.map((r, i) => {
                  const Icon = r.icon;
                  const selected = role === r.id;
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}>
                      <Card onClick={() => setRole(r.id)}
                        className={`cursor-pointer overflow-hidden relative border-2 transition-all ${selected ? "border-primary shadow-2xl ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 hover:opacity-10 transition-opacity`} />
                        <CardContent className="p-6 relative">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${r.gradient} text-white shadow-lg`}>
                              <Icon className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{r.emoji}</span>
                                <h3 className="text-lg font-bold">{r.title}</h3>
                                {selected && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{r.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <Button size="lg" disabled={!role} onClick={() => setStep(2)} className="gap-2">
                  Continuer <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Card className="backdrop-blur-xl bg-background/95">
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Complétez votre profil</h2>
                    <p className="text-muted-foreground text-sm">Ces informations nous aident à personnaliser votre tableau de bord.</p>
                  </div>

                  {role === "startuper" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Nom de la startup *</Label>
                        <Input value={form.startup_name} onChange={e => update("startup_name", e.target.value)} placeholder="Ex: AgriBoost" />
                      </div>
                      <div className="space-y-2">
                        <Label>Secteur *</Label>
                        <Select value={form.startup_sector} onValueChange={v => update("startup_sector", v)}>
                          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                          <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Stade *</Label>
                        <Select value={form.startup_stage} onValueChange={v => update("startup_stage", v)}>
                          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                          <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Wilaya (Gouvernorat) *</Label>
                        <Select value={form.wilaya} onValueChange={v => update("wilaya", v)}>
                          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                          <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Taille de l'équipe</Label>
                        <Input type="number" min={1} max={100} value={form.team_size} onChange={e => update("team_size", parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Mon problème à résoudre *</Label>
                        <Textarea rows={3} value={form.problem_statement} onChange={e => update("problem_statement", e.target.value)} placeholder="Quel problème votre startup résout-elle ?" />
                      </div>
                    </div>
                  )}

                  {role === "mentor" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Domaine d'expertise *</Label>
                        <Input value={form.expertise_domain} onChange={e => update("expertise_domain", e.target.value)} placeholder="Ex: Marketing digital, FinTech, Lean..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Wilaya</Label>
                        <Select value={form.wilaya} onValueChange={v => update("wilaya", v)}>
                          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                          <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Bio courte *</Label>
                        <Textarea rows={3} value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Présentez votre parcours en quelques lignes" />
                      </div>
                    </div>
                  )}

                  {role === "investor" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Thèse d'investissement *</Label>
                        <Textarea rows={3} value={form.investment_thesis} onChange={e => update("investment_thesis", e.target.value)} placeholder="Secteurs ciblés, ticket moyen, stade préféré..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea rows={2} value={form.bio} onChange={e => update("bio", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {role === "incubator" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nom du programme / structure *</Label>
                        <Input value={form.program_name} onChange={e => update("program_name", e.target.value)} placeholder="Ex: Flat6Labs Tunis" />
                      </div>
                      <div className="space-y-2">
                        <Label>Wilaya</Label>
                        <Select value={form.wilaya} onValueChange={v => update("wilaya", v)}>
                          <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                          <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={3} value={form.bio} onChange={e => update("bio", e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="ghost" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Retour</Button>
                    <Button onClick={handleSubmit} disabled={!canSubmit() || loading} className="gap-2 bg-gradient-to-r from-primary to-accent">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Terminer <CheckCircle2 className="h-4 w-4" /></>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
