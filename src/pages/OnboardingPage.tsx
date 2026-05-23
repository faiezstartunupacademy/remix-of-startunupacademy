import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Rocket, GraduationCap, Briefcase, Building2, ArrowRight, ArrowLeft, Loader2,
  CheckCircle2, Sparkles, Target, Banknote, Users, BookOpen, Globe, Network,
  Compass, BarChart3, Lightbulb, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Role = "startuper" | "mentor" | "investor" | "incubator";

const ROLES: Array<{ id: Role; icon: any; emoji: string; title: string; subtitle: string; gradient: string }> = [
  { id: "startuper", icon: Rocket, emoji: "🚀", title: "Startup Founder", subtitle: "J'ai une idée ou une startup en démarrage", gradient: "from-blue-500 via-indigo-500 to-purple-600" },
  { id: "mentor", icon: GraduationCap, emoji: "🎓", title: "Coach / Mentor", subtitle: "J'accompagne les startups", gradient: "from-emerald-500 via-teal-500 to-cyan-600" },
  { id: "investor", icon: Briefcase, emoji: "💼", title: "Investisseur", subtitle: "Je cherche des deals à fort potentiel", gradient: "from-amber-500 via-orange-500 to-red-500" },
  { id: "incubator", icon: Building2, emoji: "🏛️", title: "Acteur Écosystème", subtitle: "Incubateur, accélérateur, programme", gradient: "from-pink-500 via-rose-500 to-fuchsia-600" },
];

const SECTORS = ["AgriTech", "HealthTech", "EdTech", "FinTech", "GreenTech", "E-commerce", "Tourism Tech", "DeepTech", "SaaS", "Autre"];
const STAGES = ["Idée", "MVP", "Lancée"];
const WILAYAS = ["Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"];

const GOALS = [
  { id: "funding", label: "Financement", icon: Banknote, desc: "Lever des fonds, subventions, bourses" },
  { id: "mentoring", label: "Mentoring", icon: GraduationCap, desc: "Être accompagné(e) par des experts" },
  { id: "networking", label: "Networking", icon: Users, desc: "Rencontrer fondateurs & partenaires" },
  { id: "training", label: "Formation", icon: BookOpen, desc: "Monter en compétence" },
  { id: "market_access", label: "Accès au marché", icon: Globe, desc: "Trouver clients & distribution" },
] as const;

const STRATEGIC_MODULES = [
  { id: "lean_canvas", label: "Lean Canvas Lab", icon: Lightbulb, url: "/lean-canvas-lab" },
  { id: "business_model", label: "Business Model Patterns", icon: BarChart3, url: "/formation/business-model" },
  { id: "mvp_validator", label: "MVP Validator", icon: Target, url: "/pole-strategique" },
  { id: "design_thinking", label: "Design Thinking", icon: Sparkles, url: "/formation/design-thinking" },
  { id: "growth_hacking", label: "Growth Hacking", icon: Compass, url: "/formation/growth-hacking" },
  { id: "market_intelligence", label: "Market Intelligence", icon: Network, url: "/market-intelligence" },
  { id: "business_plan", label: "Business Plan Generator", icon: FileText, url: "/pole-strategique" },
  { id: "incubation", label: "Incubation Space", icon: Building2, url: "/pole-strategique" },
] as const;

// ----------- Zod schema -----------
const schema = z.object({
  role: z.enum(["startuper", "mentor", "investor", "incubator"], { errorMap: () => ({ message: "Choisissez un profil" }) }),
  // startup
  startup_name: z.string().trim().max(150).optional().or(z.literal("")),
  startup_sector: z.string().optional().or(z.literal("")),
  startup_stage: z.string().optional().or(z.literal("")),
  wilaya: z.string().optional().or(z.literal("")),
  team_size: z.coerce.number().min(1).max(500).optional(),
  problem_statement: z.string().trim().max(2000).optional().or(z.literal("")),
  // mentor / investor / incubator
  expertise_domain: z.string().trim().max(200).optional().or(z.literal("")),
  investment_thesis: z.string().trim().max(2000).optional().or(z.literal("")),
  program_name: z.string().trim().max(200).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  // goals + modules
  goals: z.array(z.string()).default([]),
  modules: z.array(z.string()).default([]),
}).superRefine((v, ctx) => {
  if (v.role === "startuper") {
    if (!v.startup_name) ctx.addIssue({ code: "custom", path: ["startup_name"], message: "Nom requis" });
    if (!v.startup_sector) ctx.addIssue({ code: "custom", path: ["startup_sector"], message: "Secteur requis" });
    if (!v.startup_stage) ctx.addIssue({ code: "custom", path: ["startup_stage"], message: "Stade requis" });
    if (!v.wilaya) ctx.addIssue({ code: "custom", path: ["wilaya"], message: "Wilaya requise" });
    if (!v.problem_statement) ctx.addIssue({ code: "custom", path: ["problem_statement"], message: "Décrivez le problème" });
  } else if (v.role === "mentor") {
    if (!v.expertise_domain) ctx.addIssue({ code: "custom", path: ["expertise_domain"], message: "Domaine requis" });
    if (!v.bio) ctx.addIssue({ code: "custom", path: ["bio"], message: "Bio requise" });
  } else if (v.role === "investor") {
    if (!v.investment_thesis) ctx.addIssue({ code: "custom", path: ["investment_thesis"], message: "Thèse requise" });
  } else if (v.role === "incubator") {
    if (!v.program_name) ctx.addIssue({ code: "custom", path: ["program_name"], message: "Programme requis" });
  }
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { id: 1, title: "Profil", desc: "Qui êtes-vous ?" },
  { id: 2, title: "Activité", desc: "Votre projet" },
  { id: 3, title: "Objectifs", desc: "Vos besoins" },
  { id: 4, title: "Modules", desc: "Pôle Stratégique" },
  { id: 5, title: "Confirmation", desc: "C'est parti" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editMode = params.get("edit") === "1";
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [bootLoading, setBootLoading] = useState(true);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    mode: "onTouched",
    defaultValues: {
      role: undefined as any,
      startup_name: "", startup_sector: "", startup_stage: "", wilaya: "",
      team_size: 1, problem_statement: "",
      expertise_domain: "", investment_thesis: "", program_name: "", bio: "",
      goals: [], modules: [],
    },
  });
  const { watch, setValue, trigger, getValues, handleSubmit, formState: { errors } } = methods;
  const role = watch("role");
  const goals = watch("goals");
  const modules = watch("modules");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (prof) {
        const p: any = prof;
        // Pre-fill if returning user
        if (p.role_type) setValue("role", p.role_type as Role);
        ["startup_name", "startup_sector", "startup_stage", "wilaya", "problem_statement",
         "expertise_domain", "investment_thesis", "program_name", "bio"].forEach(k => {
          if (p[k]) setValue(k as any, p[k]);
        });
        if (p.team_size) setValue("team_size", p.team_size);
        if (Array.isArray(p.onboarding_goals)) setValue("goals", p.onboarding_goals);
        if (Array.isArray(p.connected_modules)) setValue("modules", p.connected_modules);
        if (p.onboarding_completed && !editMode) {
          navigate("/mission-control");
          return;
        }
      }
      setBootLoading(false);
    })();
  }, [navigate, setValue, editMode]);

  const progress = (step / STEPS.length) * 100;

  const validateStep = async (): Promise<boolean> => {
    if (step === 1) return await trigger(["role"]);
    if (step === 2) {
      if (role === "startuper") return await trigger(["startup_name", "startup_sector", "startup_stage", "wilaya", "problem_statement"]);
      if (role === "mentor") return await trigger(["expertise_domain", "bio"]);
      if (role === "investor") return await trigger(["investment_thesis"]);
      if (role === "incubator") return await trigger(["program_name"]);
      return true;
    }
    return true;
  };

  const next = async () => {
    if (!(await validateStep())) return;
    setStep(s => Math.min(STEPS.length, s + 1));
  };
  const prev = () => setStep(s => Math.max(1, s - 1));

  const onSubmit = async () => {
    if (!userId) return;
    const v = getValues();
    setLoading(true);
    const patch: any = {
      role_type: v.role,
      onboarding_completed: true,
      onboarding_step: STEPS.length,
      mission_control_activated: true,
      onboarding_goals: v.goals,
      connected_modules: v.modules,
    };
    if (v.role === "startuper") {
      Object.assign(patch, {
        startup_name: v.startup_name, startup_sector: v.startup_sector, startup_stage: v.startup_stage,
        wilaya: v.wilaya, team_size: v.team_size, problem_statement: v.problem_statement,
      });
    } else if (v.role === "mentor") {
      Object.assign(patch, { expertise_domain: v.expertise_domain, bio: v.bio, wilaya: v.wilaya });
    } else if (v.role === "investor") {
      Object.assign(patch, { investment_thesis: v.investment_thesis, bio: v.bio });
    } else if (v.role === "incubator") {
      Object.assign(patch, { program_name: v.program_name, wilaya: v.wilaya, bio: v.bio });
    }
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", userId);
    setLoading(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "🚀 Mission Control activé", description: "Votre cockpit est prêt." });
    navigate("/mission-control");
  };

  if (bootLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-5xl">
          {/* Stepper */}
          <div className="mb-6 backdrop-blur-md bg-background/80 rounded-2xl p-4 border border-border/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Étape {step} / {STEPS.length} — {STEPS[step - 1].desc}</span>
              <span className="text-sm text-primary font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <ol className="grid grid-cols-5 gap-1 text-[10px] sm:text-xs">
              {STEPS.map(s => (
                <li key={s.id} className={`text-center px-1 py-1 rounded ${s.id === step ? "bg-primary text-primary-foreground font-semibold" : s.id < step ? "text-primary" : "text-muted-foreground"}`}>
                  <span className="hidden sm:inline">{s.id}. </span>{s.title}
                </li>
              ))}
            </ol>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 — Profile type */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">Qui êtes-vous ?</h1>
                  <p className="text-muted-foreground text-base md:text-lg">Choisissez votre profil pour personnaliser votre Mission Control.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROLES.map((r, i) => {
                    const Icon = r.icon;
                    const selected = role === r.id;
                    return (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.02 }}>
                        <Card onClick={() => setValue("role", r.id, { shouldValidate: true })}
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
                {errors.role && <p className="text-destructive text-sm mt-3 text-center">{errors.role.message}</p>}
              </motion.div>
            )}

            {/* STEP 2 — Conditional details */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className="backdrop-blur-xl bg-background/95">
                  <CardContent className="p-6 md:p-8 space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Parlez-nous de votre activité</h2>
                      <p className="text-muted-foreground text-sm">Ces informations personnalisent votre cockpit.</p>
                    </div>

                    {role === "startuper" && <StartupFields />}
                    {role === "mentor" && <MentorFields />}
                    {role === "investor" && <InvestorFields />}
                    {role === "incubator" && <IncubatorFields />}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3 — Goals */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className="backdrop-blur-xl bg-background/95">
                  <CardContent className="p-6 md:p-8 space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Vos objectifs & besoins</h2>
                      <p className="text-muted-foreground text-sm">Sélectionnez tout ce qui s'applique. Nous adapterons votre tableau de bord.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {GOALS.map(g => {
                        const Icon = g.icon;
                        const checked = goals.includes(g.id);
                        return (
                          <label key={g.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => {
                                const next = v ? [...goals, g.id] : goals.filter(x => x !== g.id);
                                setValue("goals", next, { shouldValidate: true });
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="font-semibold">{g.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{g.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 4 — Strategic modules */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className="backdrop-blur-xl bg-background/95">
                  <CardContent className="p-6 md:p-8 space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" /> Connectez votre Pôle Stratégique
                      </h2>
                      <p className="text-muted-foreground text-sm">Activez les modules à brancher directement à votre Mission Control.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {STRATEGIC_MODULES.map(m => {
                        const Icon = m.icon;
                        const checked = modules.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => {
                              const next = checked ? modules.filter(x => x !== m.id) : [...modules, m.id];
                              setValue("modules", next, { shouldValidate: true });
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${checked ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`}
                          >
                            <Icon className={`h-5 w-5 mb-2 ${checked ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="text-sm font-medium leading-snug">{m.label}</div>
                            {checked && <CheckCircle2 className="h-4 w-4 text-primary mt-2" />}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">Vous pourrez ajuster ces modules à tout moment depuis votre Mission Control.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 5 — Summary */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className="backdrop-blur-xl bg-background/95">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-1">Récapitulatif</h2>
                      <p className="text-muted-foreground text-sm">Vérifiez avant d'activer votre Mission Control.</p>
                    </div>

                    <SummarySection title="Profil">
                      <Badge variant="secondary">{ROLES.find(r => r.id === role)?.title}</Badge>
                    </SummarySection>

                    <SummarySection title="Activité">
                      <ActivitySummary />
                    </SummarySection>

                    <SummarySection title="Objectifs">
                      <div className="flex flex-wrap gap-2">
                        {goals.length === 0 ? <span className="text-sm text-muted-foreground">Aucun</span> :
                          goals.map(g => <Badge key={g} variant="outline">{GOALS.find(x => x.id === g)?.label}</Badge>)}
                      </div>
                    </SummarySection>

                    <SummarySection title="Modules Pôle Stratégique">
                      <div className="flex flex-wrap gap-2">
                        {modules.length === 0 ? <span className="text-sm text-muted-foreground">Aucun</span> :
                          modules.map(m => <Badge key={m} className="bg-primary/15 text-primary border-primary/30">{STRATEGIC_MODULES.find(x => x.id === m)?.label}</Badge>)}
                      </div>
                    </SummarySection>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between mt-6 backdrop-blur-md bg-background/80 rounded-2xl p-3 border border-border/40">
            <Button variant="ghost" onClick={prev} disabled={step === 1} className="gap-2"><ArrowLeft className="h-4 w-4" /> Retour</Button>
            {step < STEPS.length ? (
              <Button onClick={next} className="gap-2" disabled={step === 1 && !role}>Continuer <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={handleSubmit(onSubmit)} disabled={loading} className="gap-2 bg-gradient-to-r from-primary to-accent">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Activer Mission Control <Sparkles className="h-4 w-4" /></>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

// ---- field components ----
const FieldError = ({ name }: { name: string }) => {
  const { formState: { errors } } = useFormContext<FormValues>();
  const err: any = (errors as any)[name];
  return err?.message ? <p className="text-xs text-destructive mt-1">{err.message}</p> : null;
};

const StartupFields = () => {
  const { register, control } = useFormContext<FormValues>();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-2">
        <Label>Nom de la startup *</Label>
        <Input {...register("startup_name")} placeholder="Ex: AgriBoost" />
        <FieldError name="startup_name" />
      </div>
      <div className="space-y-2">
        <Label>Secteur *</Label>
        <Controller control={control} name="startup_sector" render={({ field }) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        )} />
        <FieldError name="startup_sector" />
      </div>
      <div className="space-y-2">
        <Label>Stade *</Label>
        <Controller control={control} name="startup_stage" render={({ field }) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        )} />
        <FieldError name="startup_stage" />
      </div>
      <div className="space-y-2">
        <Label>Wilaya *</Label>
        <Controller control={control} name="wilaya" render={({ field }) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
          </Select>
        )} />
        <FieldError name="wilaya" />
      </div>
      <div className="space-y-2">
        <Label>Taille de l'équipe</Label>
        <Input type="number" min={1} max={500} {...register("team_size", { valueAsNumber: true })} />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label>Problème à résoudre *</Label>
        <Textarea rows={3} {...register("problem_statement")} placeholder="Quel problème votre startup résout-elle ?" />
        <FieldError name="problem_statement" />
      </div>
    </div>
  );
};

const MentorFields = () => {
  const { register, control } = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Domaine d'expertise *</Label>
        <Input {...register("expertise_domain")} placeholder="Ex: Marketing digital, FinTech, Lean..." />
        <FieldError name="expertise_domain" />
      </div>
      <div className="space-y-2">
        <Label>Wilaya</Label>
        <Controller control={control} name="wilaya" render={({ field }) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </div>
      <div className="space-y-2">
        <Label>Bio courte *</Label>
        <Textarea rows={3} {...register("bio")} placeholder="Présentez votre parcours en quelques lignes" />
        <FieldError name="bio" />
      </div>
    </div>
  );
};

const InvestorFields = () => {
  const { register } = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Thèse d'investissement *</Label>
        <Textarea rows={3} {...register("investment_thesis")} placeholder="Secteurs ciblés, ticket moyen, stade préféré..." />
        <FieldError name="investment_thesis" />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea rows={2} {...register("bio")} />
      </div>
    </div>
  );
};

const IncubatorFields = () => {
  const { register, control } = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom du programme *</Label>
        <Input {...register("program_name")} placeholder="Ex: Flat6Labs Tunis" />
        <FieldError name="program_name" />
      </div>
      <div className="space-y-2">
        <Label>Wilaya</Label>
        <Controller control={control} name="wilaya" render={({ field }) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={3} {...register("bio")} />
      </div>
    </div>
  );
};

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 rounded-lg border bg-muted/30">
    <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{title}</h4>
    {children}
  </div>
);

const ActivitySummary = () => {
  const { watch } = useFormContext<FormValues>();
  const v = watch();
  if (v.role === "startuper") return <p className="text-sm">{v.startup_name} · {v.startup_sector} · {v.startup_stage} · {v.wilaya}</p>;
  if (v.role === "mentor") return <p className="text-sm">{v.expertise_domain} — {v.bio?.slice(0, 80)}…</p>;
  if (v.role === "investor") return <p className="text-sm line-clamp-2">{v.investment_thesis}</p>;
  if (v.role === "incubator") return <p className="text-sm">{v.program_name} · {v.wilaya}</p>;
  return <span className="text-sm text-muted-foreground">—</span>;
};

export default OnboardingPage;
