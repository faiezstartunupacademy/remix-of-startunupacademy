import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  startupId: string;
  startupName: string;
  isOwner: boolean;
}

const StartupPrivateChat = ({ startupId, startupName, isOwner }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const channel = supabase
      .channel(`msgs-${startupId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "marketplace_messages", filter: `startup_id=eq.${startupId}` }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [startupId, user]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("marketplace_messages")
      .select("*")
      .eq("startup_id", startupId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  };

  const handleSend = async () => {
    if (!content.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("marketplace_messages").insert({
      startup_id: startupId, sender_id: user.id, content: content.trim(),
    });
    setSending(false);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setContent("");
  };

  if (!user) return <p className="text-muted-foreground text-center py-4">Connectez-vous pour accéder à la discussion privée.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Discussion privée — {startupName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={scrollRef} className="h-64 overflow-y-auto space-y-3 border border-border rounded-lg p-4 bg-muted/20">
          {messages.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Aucun message</p>}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${m.sender_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p>{m.content}</p>
                <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString("fr-FR")}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Écrire un message..." className="flex-1" rows={2} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
          <Button onClick={handleSend} disabled={sending || !content.trim()} className="self-end gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupPrivateChat;
