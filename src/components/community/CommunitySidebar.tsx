import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, CalendarDays, Hash, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Contributor { user_id: string; full_name: string | null; posts: number; }
interface EventLite { id: string; title: string; event_date: string; rsvp_count: number; }

const extractHashtags = (text: string) => (text.match(/#[\p{L}0-9_]+/giu) || []).map(t => t.toLowerCase());

const CommunitySidebar = () => {
  const [top, setTop] = useState<Contributor[]>([]);
  const [events, setEvents] = useState<EventLite[]>([]);
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 86400_000).toISOString();
      const [{ data: posts }, { data: evs }] = await Promise.all([
        supabase.from("community_posts").select("user_id, content, created_at").gte("created_at", since).limit(500),
        supabase.from("community_events").select("id, title, event_date, rsvp_count").gte("event_date", new Date().toISOString()).order("event_date").limit(5),
      ]);
      // leaderboard
      const counts = new Map<string, number>();
      const tagCounts = new Map<string, number>();
      (posts || []).forEach((p: any) => {
        counts.set(p.user_id, (counts.get(p.user_id) || 0) + 1);
        extractHashtags(p.content || "").forEach(t => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));
      });
      const topIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", topIds.map(t => t[0]));
      const m = new Map((profs || []).map((p: any) => [p.user_id, p.full_name]));
      setTop(topIds.map(([id, n]) => ({ user_id: id, full_name: m.get(id) || "Anonyme", posts: n })));
      setTags([...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag, count]) => ({ tag, count })));
      setEvents(evs || []);
    })();
  }, []);

  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Top contributeurs (30j)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {top.length === 0 && <p className="text-xs text-muted-foreground">Aucun contributeur ce mois.</p>}
          {top.map((c, i) => (
            <div key={c.user_id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
              <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{c.full_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback></Avatar>
              <span className="text-sm flex-1 truncate">{c.full_name}</span>
              <Badge variant="secondary" className="text-[10px]">{c.posts}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Tendances</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {tags.length === 0 && <p className="text-xs text-muted-foreground">Aucun hashtag pour l'instant.</p>}
          {tags.map(t => <Badge key={t.tag} variant="outline" className="text-xs">{t.tag} <span className="ml-1 opacity-60">{t.count}</span></Badge>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-500" /> Prochains événements</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {events.length === 0 && <p className="text-xs text-muted-foreground">Aucun événement prévu.</p>}
          {events.map(e => (
            <Link to="/evenements" key={e.id} className="block p-2 rounded-lg hover:bg-muted/50 transition">
              <p className="text-sm font-medium truncate">{e.title}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(e.event_date), { addSuffix: true, locale: fr })} · {e.rsvp_count} inscrits</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4 text-center space-y-2">
          <Sparkles className="h-6 w-6 mx-auto text-primary" />
          <p className="text-sm font-medium">Cherche un cofondateur ?</p>
          <Link to="/cofounders" className="text-xs text-primary hover:underline">Explorer les profils →</Link>
        </CardContent>
      </Card>
    </aside>
  );
};

export default CommunitySidebar;
