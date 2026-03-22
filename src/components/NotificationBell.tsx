import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => setNotifications(prev => [payload.new as Notification, ...prev])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data as any);
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications" as any).update({ is_read: true } as any).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications" as any).update({ is_read: true } as any).in("id", unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) return null;

  const typeIcon = (type: string) => {
    switch (type) {
      case "trainer_approved": return "🎓";
      case "formation_scheduled": return "📅";
      case "badge_earned": return "🏆";
      case "evaluation": return "✅";
      case "strategic_access": return "🚀";
      default: return "📢";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full h-11 w-11 hover:bg-primary/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-[10px] text-white font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check className="h-3 w-3" /> Tout marquer lu
            </button>
          )}
        </div>
        <ScrollArea className="max-h-72">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Aucune notification</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => { markRead(n.id); if (n.link) setOpen(false); }}
                className={`flex gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
              >
                <span className="text-lg shrink-0">{typeIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  {n.link ? (
                    <Link to={n.link} className="font-medium text-sm hover:text-primary">{n.title}</Link>
                  ) : (
                    <p className="font-medium text-sm">{n.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
