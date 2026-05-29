import { useEffect, useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, GraduationCap, Send, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RequestRow = { id: string; status: string; admin_response: string | null };

const StrategicAccessGate = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);
  const [hasFormationAccess, setHasFormationAccess] = useState(false);
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [form, setForm] = useState({ startup_name: "", sector: "", motivation: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  const checkAccess = async () => {
    if (!user) return;
    setChecking(true);
    try {
      // 1) Approved trainer profile (granted by trigger when a session is validated)
      const { data: trainer } = await supabase
        .from("formation_trainers")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      let trainerOk = trainer?.status === "approved";

      // 2) At least one validated animated session
      if (!trainerOk) {
        const { data: sessions } = await supabase
          .from("trainer_animated_sessions" as any)
          .select("id")
          .eq("trainer_user_id", user.id)
          .eq("status", "validated")
          .limit(1);
        trainerOk = !!(sessions && (sessions as any[]).length > 0);
      }
      setHasFormationAccess(trainerOk);

      // 3) Latest access request
      const { data: reqData } = await supabase
        .from("strategic_access_requests" as any)
        .select("id, status, admin_response")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (reqData && (reqData as any[]).length > 0) setRequest((reqData as any)[0]);
      else setRequest(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { if (user && !authLoading) checkAccess(); }, [user, authLoading]);

  // Realtime: detect approval
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("strategic-gate-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "strategic_access_requests", filter: `user_id=eq.${user.id}` },
        () => checkAccess())
      .on("postgres_changes", { event: "*", schema: "public", table: "trainer_animated_sessions", filter: `trainer_user_id=eq.${user.id}` },
        () => checkAccess())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id]);

  const submitRequest = async () => {
    if (!user) return;
    if (!form.motivation.trim() || form.motivation.trim().length < 30) {
      toast({ title: "Motivation requise", description: "Décrivez votre projet en au moins 30 caractères.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const profile = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
      const { data, error } = await supabase.from("strategic_access_requests" as any).insert({
        user_id: user.id,
        user_name: profile.data?.full_name || user.email?.split("@")[0],
        user_email: user.email,
        startup_name: form.startup_name || null,
        sector: form.sector || null,
        motivation: form.motivation,
      } as any).select().single();
      if (error) throw error;
      setRequest({ id: (data as any).id, status: "pending", admin_response: null });

      const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
      if (admins) {
        await supabase.from("notifications" as any).insert(admins.map(a => ({
          user_id: a.user_id,
          type: "strategic_access_request",
          title: "🔔 Nouvelle demande d'accès Pôle Stratégique",
          message: `${profile.data?.full_name || user.email} demande l'accès${form.startup_name ? ` — ${form.startup_name}` : ""}`,
          link: "/admin",
        })));
      }
      toast({ title: "✅ Demande envoyée", description: "L'administrateur examinera votre demande." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const hasAccess = isAdmin || hasFormationAccess || request?.status === "approved";
  if (hasAccess) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 md:py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/30 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-3">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl">Accès au Pôle Stratégique restreint</CardTitle>
              <CardDescription className="text-base mt-2">
                Cet espace est réservé aux entrepreneurs ayant <strong>validé une formation animée</strong> ou
                obtenu une <strong>autorisation spéciale</strong> de l'administrateur.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold">Voie 1 — Formation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Programmez et faites valider une formation (15+ participants).
                    L'accès est octroyé automatiquement.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                    <Link to="/communaute/devenir-formateur">Devenir formateur</Link>
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Voie 2 — Demande spéciale</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Soumettez une demande motivée à l'administrateur ci-dessous.
                  </p>
                </div>
              </div>

              {request?.status === "pending" && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-700 dark:text-amber-400">Demande en cours d'examen</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Votre demande a bien été reçue. Vous serez notifié dès qu'elle sera traitée.
                    </p>
                  </div>
                </div>
              )}

              {request?.status === "rejected" && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-destructive">Demande refusée</p>
                      {request.admin_response && (
                        <p className="text-sm text-muted-foreground mt-1">{request.admin_response}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        Vous pouvez soumettre une nouvelle demande ci-dessous.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(!request || request.status === "rejected") && (
                <div className="space-y-3 rounded-xl border border-border/60 bg-background p-4">
                  <h3 className="font-semibold">Soumettre une demande d'accès</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Nom de la startup (optionnel)"
                      value={form.startup_name}
                      onChange={e => setForm({ ...form, startup_name: e.target.value })}
                    />
                    <Input
                      placeholder="Secteur (optionnel)"
                      value={form.sector}
                      onChange={e => setForm({ ...form, sector: e.target.value })}
                    />
                  </div>
                  <Textarea
                    placeholder="Décrivez votre projet et votre motivation (minimum 30 caractères)…"
                    rows={5}
                    value={form.motivation}
                    onChange={e => setForm({ ...form, motivation: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <Button onClick={submitRequest} disabled={submitting} className="gap-2">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Envoyer la demande
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center text-xs text-muted-foreground">
                <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Conformité INPDP & RGPD</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategicAccessGate;
