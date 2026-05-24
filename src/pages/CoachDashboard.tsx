import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Users, Calendar, TrendingUp, StickyNote, Search, ExternalLink } from "lucide-react";

type Session = {
  id: string;
  startup_user_id: string;
  scheduled_at: string;
  status: string;
  session_type: string;
  duration_minutes: number;
  agenda: string;
  mentor_notes: string | null;
  meet_link: string | null;
};

type StartupBucket = {
  user_id: string;
  full_name: string;
  total: number;
  completed: number;
  upcoming: Session | null;
  last: Session | null;
  sessions: Session[];
};

export default function CoachDashboard() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<any | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [privateNote, setPrivateNote] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { navigate("/auth"); return; }
      const { data: m } = await supabase.from("mentors").select("*").eq("user_id", u.user.id).maybeSingle();
      if (!m) { navigate("/mentor-dashboard"); return; }
      setMentor(m);
      const { data: s } = await supabase
        .from("mentor_sessions")
        .select("*")
        .eq("mentor_id", m.id)
        .order("scheduled_at", { ascending: false });
      const sess = (s || []) as Session[];
      setSessions(sess);
      const ids = Array.from(new Set(sess.map(x => x.startup_user_id)));
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
        const map: Record<string, string> = {};
        profs?.forEach((p: any) => { map[p.user_id] = p.full_name || "Startup"; });
        setProfiles(map);
      }
    })();
  }, [navigate]);

  const buckets: StartupBucket[] = useMemo(() => {
    const now = Date.now();
    const grouped: Record<string, Session[]> = {};
    sessions.forEach(s => { (grouped[s.startup_user_id] ||= []).push(s); });
    return Object.entries(grouped).map(([uid, list]) => {
      const sorted = [...list].sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at));
      const upcoming = sorted.find(s => +new Date(s.scheduled_at) > now && s.status !== "cancelled") || null;
      const past = [...sorted].reverse().find(s => +new Date(s.scheduled_at) <= now) || null;
      return {
        user_id: uid,
        full_name: profiles[uid] || "Startup",
        total: list.length,
        completed: list.filter(s => s.status === "completed").length,
        upcoming, last: past, sessions: sorted,
      };
    }).sort((a, b) => b.total - a.total);
  }, [sessions, profiles]);

  const filtered = buckets.filter(b => b.full_name.toLowerCase().includes(search.toLowerCase()));
  const activeBucket = buckets.find(b => b.user_id === selected) || null;

  const kpis = {
    startups: buckets.length,
    upcoming: sessions.filter(s => +new Date(s.scheduled_at) > Date.now() && s.status !== "cancelled").length,
    completed: sessions.filter(s => s.status === "completed").length,
    completionRate: sessions.length ? Math.round((sessions.filter(s => s.status === "completed").length / sessions.length) * 100) : 0,
  };

  async function saveNote(sessionId: string, value: string) {
    await supabase.from("mentor_sessions").update({ mentor_notes: value }).eq("id", sessionId);
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, mentor_notes: value } : s));
    toast.success("Notes enregistrées");
  }

  if (!mentor) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Coach</h1>
            <p className="text-muted-foreground">Vue d'ensemble des startups que vous accompagnez</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/mentor-dashboard")}>Gérer sessions & dispos</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Users className="w-5 h-5" />} label="Startups mentorées" value={kpis.startups} />
          <KpiCard icon={<Calendar className="w-5 h-5" />} label="Sessions à venir" value={kpis.upcoming} />
          <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Sessions complétées" value={kpis.completed} />
          <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Taux complétion" value={`${kpis.completionRate}%`} />
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mes startups</CardTitle>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input placeholder="Rechercher…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[520px] overflow-y-auto">
              {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucune startup pour le moment.</p>}
              {filtered.map(b => (
                <button
                  key={b.user_id}
                  onClick={() => { setSelected(b.user_id); setPrivateNote(""); }}
                  className={`w-full text-left p-3 rounded-lg border transition ${selected === b.user_id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9"><AvatarFallback>{b.full_name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{b.full_name}</p>
                      <p className="text-xs text-muted-foreground">{b.completed}/{b.total} sessions</p>
                    </div>
                    {b.upcoming && <Badge variant="secondary" className="text-xs">Bientôt</Badge>}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            {!activeBucket ? (
              <CardContent className="py-20 text-center text-muted-foreground">
                Sélectionnez une startup pour voir le détail.
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle>{activeBucket.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {activeBucket.total} sessions · {activeBucket.completed} complétées
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => window.open(`/feed?u=${activeBucket.user_id}`, "_blank")}>
                      Voir profil <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="sessions">
                    <TabsList>
                      <TabsTrigger value="sessions">Sessions ({activeBucket.sessions.length})</TabsTrigger>
                      <TabsTrigger value="notes"><StickyNote className="w-3 h-3 mr-1" />Notes privées</TabsTrigger>
                      <TabsTrigger value="progress">Progression</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sessions" className="space-y-3 mt-4">
                      {activeBucket.upcoming && (
                        <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                          <p className="text-xs uppercase font-semibold text-primary mb-1">Prochaine session</p>
                          <p className="font-medium">{format(new Date(activeBucket.upcoming.scheduled_at), "EEEE dd MMM 'à' HH:mm", { locale: fr })}</p>
                          <p className="text-sm text-muted-foreground mt-1">{activeBucket.upcoming.agenda}</p>
                          {activeBucket.upcoming.meet_link && (
                            <a href={activeBucket.upcoming.meet_link} target="_blank" rel="noreferrer" className="text-sm text-primary underline mt-2 inline-block">Lien visio</a>
                          )}
                        </div>
                      )}
                      {activeBucket.sessions.map(s => (
                        <div key={s.id} className="p-3 rounded-lg border flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{format(new Date(s.scheduled_at), "dd/MM/yyyy HH:mm")}</p>
                            <p className="text-xs text-muted-foreground">{s.session_type} · {s.duration_minutes}min</p>
                            <p className="text-sm mt-1">{s.agenda}</p>
                          </div>
                          <Badge variant={s.status === "completed" ? "default" : s.status === "cancelled" ? "destructive" : "secondary"}>{s.status}</Badge>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-3 mt-4">
                      <p className="text-xs text-muted-foreground">Notes attachées à chaque session — visibles uniquement par vous.</p>
                      {activeBucket.sessions.filter(s => s.status === "completed" || s.mentor_notes).map(s => (
                        <div key={s.id} className="border rounded-lg p-3">
                          <p className="text-xs font-medium mb-2">{format(new Date(s.scheduled_at), "dd MMM yyyy", { locale: fr })}</p>
                          <Textarea
                            rows={3}
                            defaultValue={s.mentor_notes || ""}
                            placeholder="Vos notes privées…"
                            onBlur={(e) => { if (e.target.value !== (s.mentor_notes || "")) saveNote(s.id, e.target.value); }}
                          />
                        </div>
                      ))}
                      {activeBucket.sessions.filter(s => s.status === "completed" || s.mentor_notes).length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune session complétée à annoter.</p>
                      )}
                    </TabsContent>

                    <TabsContent value="progress" className="mt-4 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <Stat label="Sessions" value={activeBucket.total} />
                        <Stat label="Complétées" value={activeBucket.completed} />
                        <Stat label="Régularité" value={`${activeBucket.total ? Math.round((activeBucket.completed / activeBucket.total) * 100) : 0}%`} />
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Dernière interaction</p>
                        <p className="text-sm text-muted-foreground">
                          {activeBucket.last ? format(new Date(activeBucket.last.scheduled_at), "dd MMM yyyy", { locale: fr }) : "—"}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}<span>{label}</span></div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="border rounded-lg p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
