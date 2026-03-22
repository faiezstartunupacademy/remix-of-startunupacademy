import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, Zap, Users, ArrowRight, Shield, BookOpen, Sparkles, Award, CalendarDays, CheckCircle2, FlaskConical, TrendingUp, DollarSign, Clock, Send, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type TrainerBadge = { full_name: string; expertise_domain: string; created_at: string; status: string; };

const CommunityPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trainerBadge, setTrainerBadge] = useState<TrainerBadge | null>(null);
  const [hasTrainerAccess, setHasTrainerAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Access request state
  const [accessRequest, setAccessRequest] = useState<{ id: string; status: string; admin_response?: string } | null>(null);
  const [requestForm, setRequestForm] = useState({ startup_name: "", sector: "", motivation: "" });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [accessDiscussions, setAccessDiscussions] = useState<any[]>([]);
  const [discussionInput, setDiscussionInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const checkAccess = async () => {
      const { data: trainer } = await supabase.from("formation_trainers").select("full_name, expertise_domain, created_at, status").eq("user_id", user.id).eq("status", "approved").maybeSingle();
      if (trainer) { setTrainerBadge(trainer); setHasTrainerAccess(true); }
      if (!trainer) {
        const { data: completion } = await supabase.from("formation_completions").select("domain, completed_at, score").eq("user_id", user.id).gte("score", 70).order("completed_at", { ascending: false }).limit(1).maybeSingle();
        if (completion) { setTrainerBadge({ full_name: user.email?.split("@")[0] || "Formateur", expertise_domain: completion.domain, created_at: completion.completed_at, status: "approved" }); setHasTrainerAccess(true); }
      }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (role) setHasTrainerAccess(true);

      // Check existing access request
      const { data: reqData } = await supabase
        .from("strategic_access_requests" as any)
        .select("id, status, admin_response")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (reqData && (reqData as any[]).length > 0) {
        setAccessRequest(reqData[0] as any);
      }

      setLoading(false);
    };
    checkAccess();
  }, [user]);

  // Load discussions for access request
  useEffect(() => {
    if (!accessRequest?.id || accessRequest.status === "approved") return;
    const loadDiscussions = async () => {
      const { data } = await supabase
        .from("strategic_discussions" as any)
        .select("*")
        .eq("request_id", accessRequest.id)
        .order("created_at", { ascending: true });
      if (data) setAccessDiscussions(data as any);
    };
    loadDiscussions();

    const channel = supabase
      .channel("community-access-discussions")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "strategic_discussions", filter: `request_id=eq.${accessRequest.id}` },
        (payload) => setAccessDiscussions(prev => [...prev, payload.new as any])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "strategic_access_requests", filter: `id=eq.${accessRequest.id}` },
        (payload) => {
          const updated = payload.new as any;
          setAccessRequest({ id: updated.id, status: updated.status, admin_response: updated.admin_response });
          if (updated.status === "approved") setHasTrainerAccess(true);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [accessRequest?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [accessDiscussions]);

  const submitAccessRequest = async () => {
    if (!user) return;
    if (!requestForm.motivation.trim()) {
      toast({ title: "Motivation requise", description: "Veuillez expliquer votre motivation", variant: "destructive" });
      return;
    }
    setSubmittingRequest(true);
    try {
      const profile = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
      const { data, error } = await supabase.from("strategic_access_requests" as any).insert({
        user_id: user.id,
        user_name: profile.data?.full_name || user.email?.split("@")[0],
        user_email: user.email,
        startup_name: requestForm.startup_name || null,
        sector: requestForm.sector || null,
        motivation: requestForm.motivation || null,
      } as any).select().single();
      if (error) throw error;
      setAccessRequest({ id: (data as any).id, status: "pending" });
      setShowRequestForm(false);

      // Notify admins
      const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
      if (admins) {
        const notifications = admins.map(a => ({
          user_id: a.user_id,
          type: "strategic_access_request",
          title: "🔔 Nouvelle demande d'accès",
          message: `${profile.data?.full_name || user.email} demande l'accès au Pôle Stratégique${requestForm.startup_name ? ` — ${requestForm.startup_name}` : ""}`,
          link: "/admin",
        }));
        await supabase.from("notifications" as any).insert(notifications);
      }

      toast({ title: "✅ Demande envoyée", description: "L'administrateur examinera votre demande." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const sendDiscussionMessage = async () => {
    if (!discussionInput.trim() || !user || !accessRequest) return;
    await supabase.from("strategic_discussions" as any).insert({
      request_id: accessRequest.id,
      sender_id: user.id,
      content: discussionInput.trim(),
      is_admin: false,
    } as any);
    setDiscussionInput("");
  };

  const spaces = [
    { title: t("community.forum"), description: t("community.forumDesc"), icon: MessageSquare, href: "/communaute/forum", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-500", borderColor: "border-emerald-500/30", features: ["Discussions", "Formations", "Calendrier", "Chat"], badge: t("community.openToAll"), badgeVariant: "default" as const, accessible: true },
    { title: t("community.strategicPole"), description: t("community.strategicPoleDesc"), icon: Zap, href: "/pole-strategique", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500", borderColor: "border-violet-500/30", features: ["7 phases + MVP", "Consultant IA", "Invest", "BI"], badge: hasTrainerAccess ? t("community.accessUnlocked") : t("community.badgeRequired"), badgeVariant: hasTrainerAccess ? ("default" as const) : ("secondary" as const), accessible: hasTrainerAccess },
    { title: t("community.leanCanvasLab"), description: t("community.leanCanvasLabDesc"), icon: FlaskConical, href: "/lean-canvas-lab", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-500", borderColor: "border-emerald-500/30", features: ["6 phases", "25 outils", "Coach IA", "MVP"], badge: hasTrainerAccess ? t("community.accessUnlocked") : t("community.badgeRequired"), badgeVariant: hasTrainerAccess ? ("default" as const) : ("secondary" as const), accessible: hasTrainerAccess },
    { title: t("community.marketIntelligence"), description: t("community.marketIntelligenceDesc"), icon: TrendingUp, href: "/market-intelligence", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500", borderColor: "border-violet-500/30", features: ["Insights", "Hypothèses", "Stress-test", "Marché"], badge: hasTrainerAccess ? t("community.accessUnlocked") : t("community.badgeRequired"), badgeVariant: hasTrainerAccess ? ("default" as const) : ("secondary" as const), accessible: hasTrainerAccess },
    { title: t("community.investSpace"), description: t("community.investSpaceDesc"), icon: DollarSign, href: "/communaute/invest", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500", borderColor: "border-amber-500/30", features: ["IA Advisor", "Dossiers", "MVP Investor", "Livrables"], badge: hasTrainerAccess ? t("community.accessUnlocked") : t("community.badgeRequired"), badgeVariant: hasTrainerAccess ? ("default" as const) : ("secondary" as const), accessible: hasTrainerAccess },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{t("community.title")}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{t("community.desc")}</p>
          {!user && <Button asChild className="mt-6 gap-2"><Link to="/auth"><Shield className="h-4 w-4" />{t("community.loginToParticipate")}</Link></Button>}
        </motion.div>

        {user && trainerBadge && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="max-w-3xl mx-auto mb-8">
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-purple-500/5 to-amber-500/5 overflow-hidden">
              <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary via-purple-500 to-amber-500 flex items-center justify-center"><Award className="h-10 w-10 text-white" /></div>
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{t("community.badgeLabel")}</p>
                  <h3 className="text-lg font-bold">{trainerBadge.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{t("community.trainer")} · {trainerBadge.expertise_domain}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("community.since")} {new Date(trainerBadge.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-sm px-4 py-1.5"><CheckCircle2 className="h-4 w-4 mr-1.5" /> {t("community.strategicAccess")}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Access Request Section */}
        {user && !hasTrainerAccess && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-3xl mx-auto mb-10 space-y-4">
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6 flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">{t("community.howToAccess")}</h3>
                  <p className="text-sm text-muted-foreground">{t("community.howToAccessDesc")}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button asChild variant="outline" size="sm" className="gap-2"><Link to="/formations"><BookOpen className="h-4 w-4" />{t("community.becomeTrainer")}</Link></Button>
                    {!accessRequest && (
                      <Button variant="default" size="sm" className="gap-2" onClick={() => setShowRequestForm(!showRequestForm)}>
                        <Shield className="h-4 w-4" /> Demander l'accès
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Request Status */}
            {accessRequest && (
              <Card className={`border-2 ${
                accessRequest.status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                accessRequest.status === "approved" ? "border-emerald-500/30 bg-emerald-500/5" :
                "border-destructive/30 bg-destructive/5"
              }`}>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {accessRequest.status === "pending" && <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
                      {accessRequest.status === "approved" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {accessRequest.status === "rejected" && <X className="h-5 w-5 text-destructive" />}
                      <h3 className="font-semibold text-sm">
                        {accessRequest.status === "pending" && "Demande en cours d'examen"}
                        {accessRequest.status === "approved" && "Accès approuvé !"}
                        {accessRequest.status === "rejected" && "Demande refusée"}
                      </h3>
                    </div>
                    <Badge variant={
                      accessRequest.status === "pending" ? "secondary" :
                      accessRequest.status === "approved" ? "default" : "destructive"
                    }>
                      {accessRequest.status === "pending" ? "En attente" :
                       accessRequest.status === "approved" ? "Approuvé" : "Refusé"}
                    </Badge>
                  </div>

                  {accessRequest.admin_response && (
                    <div className={`p-3 rounded-lg text-sm ${
                      accessRequest.status === "approved" ? "bg-emerald-500/10" : "bg-destructive/10"
                    }`}>
                      <p className="text-xs font-semibold mb-1">Réponse de l'administrateur</p>
                      <p>{accessRequest.admin_response}</p>
                    </div>
                  )}

                  {/* Discussion thread */}
                  {accessRequest.status === "pending" && (
                    <div className="border rounded-lg">
                      <div className="p-3 border-b bg-muted/20">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> Discussion avec l'administrateur
                        </p>
                      </div>
                      <ScrollArea className="max-h-48 p-3">
                        {accessDiscussions.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">L'administrateur peut vous contacter ici pour des questions complémentaires.</p>
                        ) : (
                          <div className="space-y-2">
                            {accessDiscussions.map((msg: any) => (
                              <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                                  msg.is_admin ? "bg-muted" : "bg-primary text-primary-foreground"
                                }`}>
                                  <p className="text-[10px] font-medium mb-0.5 opacity-70">
                                    {msg.is_admin ? "Admin" : "Vous"}
                                  </p>
                                  {msg.content}
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                        )}
                      </ScrollArea>
                      <div className="p-2 border-t flex gap-2">
                        <Input
                          placeholder="Envoyer un message..."
                          value={discussionInput}
                          onChange={e => setDiscussionInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendDiscussionMessage()}
                          className="h-9 text-sm"
                        />
                        <Button size="sm" className="h-9 px-3" onClick={sendDiscussionMessage} disabled={!discussionInput.trim()}>
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Request Form */}
            <AnimatePresence>
              {showRequestForm && !accessRequest && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" /> Demande d'accès au Pôle Stratégique
                      </CardTitle>
                      <CardDescription>
                        Votre demande sera examinée par l'administrateur. Vous pouvez échanger avec lui pour fournir plus de détails.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Nom de la startup (optionnel)</label>
                        <Input
                          value={requestForm.startup_name}
                          onChange={e => setRequestForm(prev => ({ ...prev, startup_name: e.target.value }))}
                          placeholder="Ma Startup"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Secteur d'activité (optionnel)</label>
                        <Input
                          value={requestForm.sector}
                          onChange={e => setRequestForm(prev => ({ ...prev, sector: e.target.value }))}
                          placeholder="FinTech, EdTech, AgriTech..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Motivation *</label>
                        <Textarea
                          value={requestForm.motivation}
                          onChange={e => setRequestForm(prev => ({ ...prev, motivation: e.target.value }))}
                          placeholder="Expliquez pourquoi vous souhaitez accéder au Pôle Stratégique..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={submitAccessRequest} disabled={submittingRequest} className="gap-2">
                          {submittingRequest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Soumettre la demande
                        </Button>
                        <Button variant="ghost" onClick={() => setShowRequestForm(false)}>Annuler</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {spaces.map((space, i) => (
            <motion.div key={space.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
              <Card className={`h-full transition-all duration-300 border-2 ${space.borderColor} bg-gradient-to-br ${space.color} ${space.accessible ? "hover:shadow-xl" : "opacity-75"}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <space.icon className={`h-10 w-10 ${space.iconColor}`} />
                    <Badge variant={space.badgeVariant}>{space.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{space.title}</CardTitle>
                  <CardDescription className="text-sm">{space.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">{space.features.map(f => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}</div>
                  {space.accessible ? (
                    <Button asChild className="w-full gap-2"><Link to={space.href}>{t("community.access")} <ArrowRight className="h-4 w-4" /></Link></Button>
                  ) : (
                    <Button disabled className="w-full gap-2">{t("community.badgeRequired")}</Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
