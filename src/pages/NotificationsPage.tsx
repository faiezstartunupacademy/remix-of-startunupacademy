import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Trash2, BellOff, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Notification = {
  id: string; type: string; title: string; message: string;
  is_read: boolean; link: string | null; created_at: string;
};

const typeIcon = (t: string) => ({
  mentor_booking: "📅", mentor_confirmed: "✅", mentor_cancelled: "❌", mentor_completed: "⭐",
  post_comment: "💬", funding_status: "💰", badge_earned: "🏆",
  trainer_approved: "🎓", formation_scheduled: "📅", strategic_access: "🚀",
} as Record<string, string>)[t] || "📢";

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    load();
    const ch = supabase
      .channel(`notif-page-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, navigate]);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("notifications" as any).select("*")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    if (data) setItems(data as any);
  }

  async function markAllRead() {
    if (!user) return;
    await supabase.from("notifications" as any).update({ is_read: true } as any).eq("user_id", user.id).eq("is_read", false);
    setItems(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  async function remove(id: string) {
    await supabase.from("notifications" as any).delete().eq("id", id);
    setItems(prev => prev.filter(n => n.id !== id));
  }

  async function markRead(id: string) {
    await supabase.from("notifications" as any).update({ is_read: true } as any).eq("id", id);
  }

  const filtered = items.filter(n => filter === "all" || !n.is_read);
  const unread = items.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unread} non lues · temps réel activé</p>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check className="w-4 h-4 mr-1" /> Tout marquer lu
            </Button>
          )}
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">Toutes ({items.length})</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unread})</TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-muted-foreground">
            <BellOff className="w-10 h-10 mx-auto mb-3 opacity-50" />
            Aucune notification {filter === "unread" ? "non lue" : ""}.
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => (
              <Card key={n.id} className={!n.is_read ? "border-l-4 border-l-primary" : ""}>
                <CardContent className="p-4 flex gap-3">
                  <span className="text-2xl">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    {n.link ? (
                      <Link to={n.link} onClick={() => markRead(n.id)} className="font-semibold hover:text-primary">{n.title}</Link>
                    ) : (
                      <p className="font-semibold">{n.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(n.id)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
