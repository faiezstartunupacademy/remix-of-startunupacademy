import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Plus, ArrowLeft, MessageCircle, Clock, User, Hash, ChevronRight, Loader2, CalendarDays, BookOpen, Video, Mail, UserCircle, ExternalLink, GraduationCap, ClipboardCheck, UserPlus, CheckCircle, Star, Users, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

import FormationEvaluationSpace from "@/components/formation/FormationEvaluationSpace";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CATEGORIES = [
  { value: "general", label: "Général", icon: "💬" },
  { value: "formation", label: "Formation", icon: "📚" },
  { value: "strategique", label: "Pôle Stratégique", icon: "🧭" },
];

const FILTER_TABS = [
  { value: "all", label: "Toutes les discussions", icon: "🗂️" },
  { value: "formation", label: "Formations", icon: "📚" },
  { value: "strategique", label: "Pôle Stratégique", icon: "🧭" },
  { value: "general", label: "Général", icon: "💬" },
];

type Thread = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
  scheduled_date: string | null;
  duration_text: string | null;
  formation_plan: string | null;
  trainer_name: string | null;
  trainer_email: string | null;
  meet_link: string | null;
  min_participants?: number | null;
  max_participants?: number | null;
  objectives?: string | null;
  is_strategic?: boolean | null;
};

type Post = {
  id: string;
  thread_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type ChatMessage = {
  id: string;
  user_id: string;
  channel: string;
  content: string;
  created_at: string;
};

const ForumPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatChannel, setChatChannel] = useState("general");
  const [newPost, setNewPost] = useState("");
  const [newChat, setNewChat] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "", category: "general" });
  const [formationDate, setFormationDate] = useState<Date>();
  const [formationDuration, setFormationDuration] = useState("");
  const [formationPlan, setFormationPlan] = useState("");
  const [formationObjectives, setFormationObjectives] = useState("");
  const [formationMinParticipants, setFormationMinParticipants] = useState<string>("");
  const [formationMaxParticipants, setFormationMaxParticipants] = useState<string>("");
  const [formationIsStrategic, setFormationIsStrategic] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("accueil");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Participation modal state
  const [participationThread, setParticipationThread] = useState<Thread | null>(null);
  const [partForm, setPartForm] = useState({ full_name: "", email: "" });
  const [partSubmitting, setPartSubmitting] = useState(false);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});

  // Build dynamic chat channels from formation threads
  const formationThreads = threads.filter(t => t.category === "formation" && t.scheduled_date);
  const chatChannels = [
    { value: "general", label: "# général" },
    ...formationThreads.map(t => ({ value: `formation-${t.id}`, label: `# ${t.title.substring(0, 30)}` })),
  ];

  // Load threads
  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      const { data } = await supabase.rpc("get_safe_forum_threads" as any);
      let filtered = (data as Thread[]) || [];
      if (filterCategory !== "all") filtered = filtered.filter(t => t.category === filterCategory);
      if (filtered.length) {
        setThreads(filtered);
        // Load participant counts for formation threads
        const formationIds = (data as Thread[]).filter(t => t.category === "formation" && t.scheduled_date).map(t => t.id);
        if (formationIds.length > 0) {
          const { data: posts } = await supabase
            .from("forum_posts")
            .select("thread_id")
            .in("thread_id", formationIds)
            .like("content", "%Participation confirmée%");
          if (posts) {
            const counts: Record<string, number> = {};
            posts.forEach(p => { counts[p.thread_id] = (counts[p.thread_id] || 0) + 1; });
            setParticipantCounts(counts);
          }
        }
      }
      setLoading(false);
    };
    loadThreads();
  }, [user, filterCategory]);

  // Pre-fill participation form with user info
  useEffect(() => {
    if (user) {
      setPartForm({
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Load posts for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    const loadPosts = async () => {
      const { data } = await supabase.from("forum_posts").select("*").eq("thread_id", selectedThread.id).order("created_at", { ascending: true });
      if (data) setPosts(data);
    };
    loadPosts();
  }, [selectedThread]);

  // Real-time chat
  useEffect(() => {
    if (!user) return;
    const loadChat = async () => {
      const { data } = await supabase.from("forum_chat_messages").select("*").eq("channel", chatChannel).order("created_at", { ascending: true }).limit(100);
      if (data) setChatMessages(data);
    };
    loadChat();
    const channel = supabase
      .channel(`chat-${chatChannel}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "forum_chat_messages", filter: `channel=eq.${chatChannel}` },
        (payload) => { setChatMessages(prev => [...prev, payload.new as ChatMessage]); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, chatChannel]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const generateMeetLink = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const seg = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
  };

  const handleCreateThread = async () => {
    if (!user || !newThread.title.trim() || !newThread.content.trim()) return;
    const insertData: any = {
      user_id: user.id, title: newThread.title.trim(), content: newThread.content.trim(), category: newThread.category,
    };
    if (newThread.category === "formation") {
      if (!trainerName.trim() || !trainerEmail.trim()) {
        toast({ title: "Champs requis", description: "Le nom et l'email du formateur sont obligatoires.", variant: "destructive" });
        return;
      }
      insertData.trainer_name = trainerName.trim();
      insertData.trainer_email = trainerEmail.trim();
      if (formationDate) insertData.scheduled_date = formationDate.toISOString();
      if (formationDuration.trim()) insertData.duration_text = formationDuration.trim();
      if (formationPlan.trim()) insertData.formation_plan = formationPlan.trim();
      if (formationObjectives.trim()) insertData.objectives = formationObjectives.trim();
      if (formationMinParticipants) insertData.min_participants = parseInt(formationMinParticipants) || null;
      if (formationMaxParticipants) insertData.max_participants = parseInt(formationMaxParticipants) || null;
      insertData.is_strategic = formationIsStrategic;
      insertData.meet_link = meetLink.trim() || generateMeetLink();
    } else if (newThread.category === "strategique") {
      insertData.is_strategic = true;
    }
    const { data: threadData, error } = await supabase.from("forum_threads").insert(insertData).select("id, title, category").single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      // Notify admins when a formation is scheduled
      if (newThread.category === "formation" && threadData) {
        const { data: adminRoles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
        if (adminRoles && adminRoles.length > 0) {
          const notifications = adminRoles.map((ar) => ({
            user_id: ar.user_id,
            title: "📚 Nouvelle formation programmée",
            message: `Formation "${newThread.title.trim()}" programmée par ${trainerName.trim()}${formationDate ? ` le ${format(formationDate, "dd/MM/yyyy", { locale: fr })}` : ""}.`,
            type: "formation",
            link: "/communaute/forum",
          }));
          await supabase.from("notifications").insert(notifications);
        }
      }

      toast({ title: newThread.category === "formation" ? "Formation programmée avec lien Meet !" : "Discussion créée !" });
      setNewThread({ title: "", content: "", category: "general" });
      setFormationDate(undefined);
      setFormationDuration("");
      setFormationPlan("");
      setFormationObjectives("");
      setFormationMinParticipants("");
      setFormationMaxParticipants("");
      setFormationIsStrategic(false);
      setTrainerName("");
      setTrainerEmail("");
      setMeetLink("");
      setIsCreating(false);
      const { data } = await supabase.rpc("get_safe_forum_threads" as any);
      if (data) setThreads(data as Thread[]);
    }
  };

  const handlePostReply = async () => {
    if (!user || !selectedThread || !newPost.trim()) return;
    const { error } = await supabase.from("forum_posts").insert({ thread_id: selectedThread.id, user_id: user.id, content: newPost.trim() });
    if (!error) {
      setNewPost("");
      const { data } = await supabase.from("forum_posts").select("*").eq("thread_id", selectedThread.id).order("created_at", { ascending: true });
      if (data) setPosts(data);
    }
  };

  const handleSendChat = async () => {
    if (!user || !newChat.trim()) return;
    const { error } = await supabase.from("forum_chat_messages").insert({ user_id: user.id, channel: chatChannel, content: newChat.trim() });
    if (!error) setNewChat("");
  };

  const handleConfirmParticipation = async () => {
    if (!participationThread) return;
    if (!partForm.full_name.trim() || !partForm.email.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir votre nom et email.", variant: "destructive" });
      return;
    }

    setPartSubmitting(true);

    if (user) {
      // Logged-in: save to formation_participants via a forum post as confirmation
      const { error } = await supabase.from("forum_posts").insert({
        thread_id: participationThread.id,
        user_id: user.id,
        content: `✅ **Participation confirmée** — ${partForm.full_name.trim()} (${partForm.email.trim()})`,
      });
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Participation confirmée !", description: `Vous êtes inscrit à "${participationThread.title}".` });
        // Update participant count
        setParticipantCounts(prev => ({ ...prev, [participationThread.id]: (prev[participationThread.id] || 0) + 1 }));
        setParticipationThread(null);
        // Refresh posts if currently viewing this thread
        if (selectedThread?.id === participationThread.id) {
          const { data } = await supabase.from("forum_posts").select("*").eq("thread_id", selectedThread.id).order("created_at", { ascending: true });
          if (data) setPosts(data);
        }
      }
    } else {
      // Visitor: just show confirmation (no DB write without auth)
      toast({ title: "✅ Merci !", description: `Votre intérêt pour "${participationThread.title}" a été noté. Connectez-vous pour confirmer officiellement.` });
      setParticipationThread(null);
    }
    setPartSubmitting(false);
  };

  const exportParticipantsCSV = async (thread: Thread) => {
    const { data: posts } = await supabase
      .from("forum_posts")
      .select("content, created_at")
      .eq("thread_id", thread.id)
      .like("content", "%Participation confirmée%")
      .order("created_at", { ascending: true });

    if (!posts || posts.length === 0) {
      toast({ title: "Aucun participant", description: "Aucune inscription trouvée pour cette formation.", variant: "destructive" });
      return;
    }

    const rows = posts.map(p => {
      const match = p.content.match(/— (.+?) \((.+?)\)/);
      return {
        nom: match?.[1] || "N/A",
        email: match?.[2] || "N/A",
        date_inscription: new Date(p.created_at).toLocaleDateString("fr-FR"),
      };
    });

    const header = "Nom,Email,Date d'inscription";
    const csv = [header, ...rows.map(r => `"${r.nom}","${r.email}","${r.date_inscription}"`)].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${thread.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Export CSV téléchargé" });
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const formatUserId = (id: string) => id.substring(0, 8);

  const scheduledDates = formationThreads.map(t => new Date(t.scheduled_date!));

  const selectedDateFormations = calendarDate
    ? formationThreads.filter(t => {
        const d = new Date(t.scheduled_date!);
        return d.toDateString() === calendarDate.toDateString();
      })
    : [];

  const upcomingFormations = formationThreads
    .filter(t => new Date(t.scheduled_date!) >= new Date())
    .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime());

  // Participation confirmation button component
  const ParticipationButton = ({ thread, size = "sm" }: { thread: Thread; size?: "sm" | "default" }) => {
    const count = participantCounts[thread.id] || 0;
    return (
      <div className="flex items-center gap-2">
        {count > 0 && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Users className="h-3 w-3" />
            {count} inscrit{count > 1 ? "s" : ""}
          </Badge>
        )}
        <Button
          variant="default"
          size={size}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={(e) => { e.stopPropagation(); setParticipationThread(thread); }}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Participer
        </Button>
      </div>
    );
  };

  // Evaluation button component
  const EvalButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <Star className="h-3.5 w-3.5" />
      Évaluer
    </Button>
  );

  // Calendar widget for homepage
  const CalendarWidget = () => (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Calendrier des formations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={calendarDate}
          onSelect={setCalendarDate}
          className="p-3 pointer-events-auto mx-auto"
          modifiers={{ scheduled: scheduledDates }}
          modifiersClassNames={{ scheduled: "bg-primary/20 text-primary font-bold rounded-full" }}
        />
        {calendarDate && selectedDateFormations.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-xs font-semibold text-primary">{format(calendarDate, "dd MMMM yyyy", { locale: fr })}</p>
            {selectedDateFormations.map(f => (
              <div key={f.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-xs">{f.title}</p>
                  {f.trainer_name && <p className="text-[10px] text-muted-foreground">{f.trainer_name}</p>}
                </div>
                <ParticipationButton thread={f} size="sm" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Not logged in: show public view with calendar and upcoming formations
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageSquare className="h-4 w-4" />
              Espace Communautaire
            </div>
            <h1 className="text-3xl font-bold mb-2">Forum Communautaire STARTUNUP</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Découvrez les formations programmées et rejoignez notre communauté d'entrepreneurs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-[1fr_320px] gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Prochaines formations
              </h2>
              {upcomingFormations.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Aucune formation programmée pour le moment.</p>
              ) : (
                upcomingFormations.slice(0, 6).map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="hover:border-primary/30 transition-all">
                      <CardContent className="pt-4 pb-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-sm truncate">{f.title}</h3>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {format(new Date(f.scheduled_date!), "dd MMM", { locale: fr })}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {f.trainer_name && <span className="flex items-center gap-1"><UserCircle className="h-3 w-3" />{f.trainer_name}</span>}
                            {f.duration_text && <span>⏱ {f.duration_text}</span>}
                          </div>
                        </div>
                        <ParticipationButton thread={f} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
              <div className="text-center pt-4">
                <Button asChild className="gap-2">
                  <Link to="/auth"><User className="h-4 w-4" />Se connecter pour participer</Link>
                </Button>
              </div>
            </div>
            <CalendarWidget />
          </div>
        </main>
        <Footer />

        {/* Participation dialog for visitors */}
        <Dialog open={!!participationThread} onOpenChange={(open) => !open && setParticipationThread(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-600" />
                Confirmer votre participation
              </DialogTitle>
            </DialogHeader>
            {participationThread && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="font-semibold text-sm">{participationThread.title}</p>
                  {participationThread.scheduled_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📅 {format(new Date(participationThread.scheduled_date), "EEEE dd MMMM yyyy", { locale: fr })}
                    </p>
                  )}
                  {participationThread.trainer_name && <p className="text-xs text-muted-foreground">👤 {participationThread.trainer_name}</p>}
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Nom complet *</Label>
                    <Input placeholder="Votre nom" value={partForm.full_name} onChange={e => setPartForm(f => ({ ...f, full_name: e.target.value }))} maxLength={100} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="votre@email.com" value={partForm.email} onChange={e => setPartForm(f => ({ ...f, email: e.target.value }))} maxLength={255} />
                  </div>
                </div>
                <Button onClick={handleConfirmParticipation} disabled={partSubmitting} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                  {partSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Confirmer ma participation
                </Button>
                {!user && (
                  <p className="text-xs text-center text-muted-foreground">
                    <Link to="/auth" className="text-primary underline">Connectez-vous</Link> pour une inscription officielle.
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild><Link to="/communaute"><ArrowLeft className="h-5 w-5" /></Link></Button>
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Forum Communautaire</h1>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Formations, discussions et collaboration en temps réel</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-12">
            <TabsTrigger value="accueil" className="gap-2 text-xs sm:text-sm">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </TabsTrigger>
            <TabsTrigger value="threads" className="gap-2 text-xs sm:text-sm">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Discussions</span>
            </TabsTrigger>
            <TabsTrigger value="salon" className="gap-2 text-xs sm:text-sm">
              <Hash className="h-4 w-4" />
              <span className="hidden sm:inline">Salon</span>
            </TabsTrigger>
          </TabsList>

          {/* ACCUEIL TAB - Calendar + Upcoming formations */}
          <TabsContent value="accueil" className="space-y-6">
            <div className="grid md:grid-cols-[1fr_340px] gap-8">
              {/* Main content: upcoming formations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Formations programmées
                  </h2>
                  <Badge variant="outline" className="text-xs">{upcomingFormations.length} à venir</Badge>
                </div>

                {upcomingFormations.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Aucune formation programmée pour le moment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {upcomingFormations.map((f, i) => (
                      <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card className="hover:shadow-md transition-all hover:border-primary/30">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="font-semibold text-sm">{f.title}</h3>
                                  <EvalButton onClick={() => setActiveTab("evaluation")} />
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                    <CalendarDays className="h-3 w-3 mr-1" />
                                    {format(new Date(f.scheduled_date!), "dd MMM yyyy", { locale: fr })}
                                  </Badge>
                                  {f.meet_link && (
                                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                                      <Video className="h-3 w-3 mr-1" />Meet
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{f.content}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                  {f.trainer_name && <span className="flex items-center gap-1"><UserCircle className="h-3 w-3" />{f.trainer_name}</span>}
                                  {f.duration_text && <span>⏱ {f.duration_text}</span>}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <ParticipationButton thread={f} />
                                  <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={(e) => { e.stopPropagation(); exportParticipantsCSV(f); }}>
                                    <Download className="h-3.5 w-3.5" />CSV
                                  </Button>
                                  {f.meet_link && (
                                    <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50 text-xs" asChild>
                                      <a href={f.meet_link} target="_blank" rel="noopener noreferrer">
                                        <Video className="h-3.5 w-3.5" />Meet
                                      </a>
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => { setSelectedThread(f); setActiveTab("threads"); }}>
                                    <MessageCircle className="h-3.5 w-3.5" />Discussion
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Past formations */}
                {formationThreads.filter(t => new Date(t.scheduled_date!) < new Date()).length > 0 && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Formations passées</h3>
                    <div className="space-y-2">
                      {formationThreads
                        .filter(t => new Date(t.scheduled_date!) < new Date())
                        .sort((a, b) => new Date(b.scheduled_date!).getTime() - new Date(a.scheduled_date!).getTime())
                        .slice(0, 5)
                        .map(f => (
                          <div key={f.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="text-xs font-bold text-muted-foreground min-w-[50px]">{format(new Date(f.scheduled_date!), "dd MMM", { locale: fr })}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{f.title}</p>
                            </div>
                            <EvalButton onClick={() => setActiveTab("evaluation")} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Calendar */}
              <CalendarWidget />
            </div>
          </TabsContent>

          {/* FORMATIONS PROGRAMMEES - moved into accueil tab's dialog */}
          <TabsContent value="formateur-legacy" className="hidden">
            {/* Removed - Devenez Formateur space */}
          </TabsContent>

          {/* Formations management dialog for accueil tab */}
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Programmer une formation</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de la formation</Label>
                  <Input placeholder="Nom de la formation" value={newThread.title} onChange={e => setNewThread(p => ({ ...p, title: e.target.value }))} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Décrivez la formation..." value={newThread.content} onChange={e => setNewThread(p => ({ ...p, content: e.target.value }))} rows={3} maxLength={5000} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><UserCircle className="h-3.5 w-3.5" />Nom du formateur *</Label>
                    <Input placeholder="Nom complet" value={trainerName} onChange={e => setTrainerName(e.target.value)} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email du formateur *</Label>
                    <Input type="email" placeholder="email@example.com" value={trainerEmail} onChange={e => setTrainerEmail(e.target.value)} maxLength={200} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date et heure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formationDate && "text-muted-foreground")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {formationDate ? format(formationDate, "PPP", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={formationDate} onSelect={setFormationDate} initialFocus className="p-3 pointer-events-auto" disabled={(date) => date < new Date()} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Durée</Label>
                  <Input placeholder="Ex: 2 heures, 3 jours..." value={formationDuration} onChange={e => setFormationDuration(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Plan de la formation</Label>
                  <Textarea placeholder="Module 1: Introduction&#10;Module 2: ..." value={formationPlan} onChange={e => setFormationPlan(e.target.value)} rows={4} maxLength={5000} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" />Lien Meet / Zoom (optionnel)</Label>
                  <Input placeholder="https://meet.google.com/... (auto-généré si vide)" value={meetLink} onChange={e => setMeetLink(e.target.value)} />
                  <p className="text-[11px] text-muted-foreground">Si vide, un lien Google Meet sera généré automatiquement.</p>
                </div>
                <Button onClick={handleCreateThread} disabled={!newThread.title.trim() || !newThread.content.trim()} className="w-full">
                  Programmer la formation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* THREADS TAB */}
          <TabsContent value="threads" className="space-y-6">
            {selectedThread ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button variant="ghost" className="mb-4 gap-2" onClick={() => { setSelectedThread(null); setPosts([]); }}>
                  <ArrowLeft className="h-4 w-4" /> Retour
                </Button>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">{CATEGORIES.find(c => c.value === selectedThread.category)?.icon} {selectedThread.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(selectedThread.created_at)}</span>
                      {selectedThread.scheduled_date && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {format(new Date(selectedThread.scheduled_date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                        </Badge>
                      )}
                      {selectedThread.duration_text && (
                        <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{selectedThread.duration_text}</Badge>
                      )}
                    </div>
                    <CardTitle className="flex items-center gap-3 flex-wrap">
                      {selectedThread.title}
                      {selectedThread.category === "formation" && <EvalButton onClick={() => setActiveTab("evaluation")} />}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{selectedThread.content}</p>

                    {selectedThread.trainer_name && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <UserCircle className="h-4 w-4" />{selectedThread.trainer_name}
                        </span>
                        {selectedThread.trainer_email && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-4 w-4" />{selectedThread.trainer_email}
                          </span>
                        )}
                      </div>
                    )}

                    {selectedThread.meet_link && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50" asChild>
                          <a href={selectedThread.meet_link} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4" />Rejoindre la session Meet
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                        {selectedThread.category === "formation" && selectedThread.scheduled_date && (
                          <ParticipationButton thread={selectedThread} />
                        )}
                      </div>
                    )}

                    {!selectedThread.meet_link && selectedThread.category === "formation" && selectedThread.scheduled_date && (
                      <div className="mt-3">
                        <ParticipationButton thread={selectedThread} />
                      </div>
                    )}

                    {selectedThread.formation_plan && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4" />Plan de la formation</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedThread.formation_plan}</p>
                      </div>
                    )}

                    {selectedThread.category === "formation" && (
                      <div className="mt-3">
                        <Button variant="ghost" size="sm" className="gap-2 text-primary" onClick={() => { setChatChannel(`formation-${selectedThread.id}`); setActiveTab("salon"); }}>
                          <Hash className="h-4 w-4" />Ouvrir le salon de cette formation
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-t pt-4 space-y-3">
                      {posts.map(p => (
                        <div key={p.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">@{formatUserId(p.user_id)}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(p.created_at)}</span>
                            </div>
                            <p className="text-sm">{p.content}</p>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune réponse. Soyez le premier !</p>}
                    </div>
                    <div className="flex gap-2">
                      <Textarea placeholder="Votre réponse..." value={newPost} onChange={e => setNewPost(e.target.value)} className="flex-1" rows={2} maxLength={2000} />
                      <Button onClick={handlePostReply} disabled={!newPost.trim()} size="icon" className="shrink-0 self-end"><Send className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                      <Button className="gap-2"><Plus className="h-4 w-4" />Nouvelle discussion</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>Créer une discussion</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Catégorie</Label>
                          <Select value={newThread.category} onValueChange={v => setNewThread(p => ({ ...p, category: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Titre</Label>
                          <Input placeholder={newThread.category === "formation" ? "Nom de la formation" : "Sujet de la discussion"} value={newThread.title} onChange={e => setNewThread(p => ({ ...p, title: e.target.value }))} maxLength={200} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="Décrivez votre sujet..." value={newThread.content} onChange={e => setNewThread(p => ({ ...p, content: e.target.value }))} rows={3} maxLength={5000} />
                        </div>

                        {newThread.category === "formation" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 border-t pt-4">
                            <p className="text-sm font-semibold text-primary flex items-center gap-2"><BookOpen className="h-4 w-4" />Détails de la formation</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1.5"><UserCircle className="h-3.5 w-3.5" />Nom du formateur *</Label>
                                <Input placeholder="Nom complet" value={trainerName} onChange={e => setTrainerName(e.target.value)} maxLength={100} />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email du formateur *</Label>
                                <Input type="email" placeholder="email@example.com" value={trainerEmail} onChange={e => setTrainerEmail(e.target.value)} maxLength={200} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Date et heure</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formationDate && "text-muted-foreground")}>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {formationDate ? format(formationDate, "PPP", { locale: fr }) : "Choisir une date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={formationDate} onSelect={setFormationDate} initialFocus className="p-3 pointer-events-auto" disabled={(date) => date < new Date()} />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-2">
                              <Label>Durée</Label>
                              <Input placeholder="Ex: 2 heures, 3 jours..." value={formationDuration} onChange={e => setFormationDuration(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Plan de la formation</Label>
                              <Textarea placeholder="Module 1: Introduction&#10;Module 2: ..." value={formationPlan} onChange={e => setFormationPlan(e.target.value)} rows={4} maxLength={5000} />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" />Lien Meet / Zoom (optionnel)</Label>
                              <Input placeholder="https://meet.google.com/... (auto-généré si vide)" value={meetLink} onChange={e => setMeetLink(e.target.value)} />
                              <p className="text-[11px] text-muted-foreground">Si vide, un lien Google Meet sera généré automatiquement.</p>
                            </div>
                          </motion.div>
                        )}

                        <Button onClick={handleCreateThread} disabled={!newThread.title.trim() || !newThread.content.trim()} className="w-full">
                          {newThread.category === "formation" ? "Programmer la formation" : "Publier"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : threads.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Aucune discussion. Lancez la première !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {threads.map((t, i) => (
                      <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30" onClick={() => setSelectedThread(t)}>
                          <CardContent className="pt-4 pb-4 flex items-center gap-4">
                            <div className="text-2xl">{CATEGORIES.find(c => c.value === t.category)?.icon || "💬"}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {t.is_pinned && <Badge variant="destructive" className="text-[10px] px-1.5">📌</Badge>}
                                <h3 className="font-semibold text-sm truncate">{t.title}</h3>
                                {t.category === "formation" && <EvalButton onClick={() => setActiveTab("evaluation")} />}
                                {t.category === "formation" && t.scheduled_date && (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                    <CalendarDays className="h-3 w-3 mr-1" />
                                    {format(new Date(t.scheduled_date), "dd MMM", { locale: fr })}
                                  </Badge>
                                )}
                                {t.meet_link && (
                                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                                    <Video className="h-3 w-3 mr-1" />Meet
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">{t.content}</p>
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                {t.trainer_name && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><UserCircle className="h-3 w-3" />{t.trainer_name}</span>
                                )}
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(t.created_at)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3" />{t.replies_count} réponses</span>
                                {t.duration_text && <span className="text-xs text-muted-foreground">⏱ {t.duration_text}</span>}
                              </div>
                            </div>
                            {t.category === "formation" && t.scheduled_date && (
                              <>
                                <ParticipationButton thread={t} />
                                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); exportParticipantsCSV(t); }}>
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* EVALUATION TAB */}
          <TabsContent value="evaluation" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-4">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Évaluation & Badge</h2>
              <p className="text-sm text-muted-foreground">
                Validez <strong>10 QCM</strong> (sur 15 générés par IA) + une <strong>étude de cas</strong> corrigée par les pairs pour obtenir votre badge STARTUNUP.
              </p>
            </motion.div>
            <FormationEvaluationSpace />
          </TabsContent>

          {/* SALON TAB (was Chat) */}
          <TabsContent value="salon" className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {chatChannels.map(ch => (
                <Button key={ch.value} variant={chatChannel === ch.value ? "default" : "outline"} size="sm" onClick={() => setChatChannel(ch.value)} className="whitespace-nowrap">
                  {ch.label}
                </Button>
              ))}
            </div>
            <Card className="h-[500px] flex flex-col">
              <CardContent className="flex-1 overflow-auto pt-4 space-y-2">
                {chatMessages.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Aucun message. Commencez la conversation !</p>}
                {chatMessages.map(m => (
                  <div key={m.id} className={`flex gap-2 ${m.user_id === user.id ? "justify-end" : ""}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.user_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.user_id !== user.id && <p className="text-[10px] font-medium opacity-70 mb-0.5">@{formatUserId(m.user_id)}</p>}
                      <p>{m.content}</p>
                      <p className="text-[10px] opacity-60 mt-0.5">{new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </CardContent>
              <div className="p-4 border-t flex gap-2">
                <Input placeholder="Votre message..." value={newChat} onChange={e => setNewChat(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }} maxLength={1000} />
                <Button onClick={handleSendChat} disabled={!newChat.trim()} size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Participation confirmation dialog */}
      <Dialog open={!!participationThread} onOpenChange={(open) => !open && setParticipationThread(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600" />
              Confirmer votre participation
            </DialogTitle>
          </DialogHeader>
          {participationThread && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="font-semibold text-sm">{participationThread.title}</p>
                {participationThread.scheduled_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    📅 {format(new Date(participationThread.scheduled_date), "EEEE dd MMMM yyyy", { locale: fr })}
                  </p>
                )}
                {participationThread.trainer_name && <p className="text-xs text-muted-foreground">👤 {participationThread.trainer_name}</p>}
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nom complet *</Label>
                  <Input placeholder="Votre nom" value={partForm.full_name} onChange={e => setPartForm(f => ({ ...f, full_name: e.target.value }))} maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="votre@email.com" value={partForm.email} onChange={e => setPartForm(f => ({ ...f, email: e.target.value }))} maxLength={255} />
                </div>
              </div>
              <Button onClick={handleConfirmParticipation} disabled={partSubmitting} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                {partSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Confirmer ma participation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForumPage;
