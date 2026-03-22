import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, Clock, MessageSquare, Send, Loader2, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AccessRequest = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  startup_name: string | null;
  sector: string | null;
  motivation: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
};

type DiscussionMessage = {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  is_admin: boolean;
  created_at: string;
};

const StrategicAccessManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<Record<string, DiscussionMessage[]>>({});
  const [newMessage, setNewMessage] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel("access-requests-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "strategic_access_requests" },
        () => fetchRequests()
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "strategic_discussions" },
        (payload) => {
          const msg = payload.new as DiscussionMessage;
          setDiscussions(prev => ({
            ...prev,
            [msg.request_id]: [...(prev[msg.request_id] || []), msg]
          }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [discussions, expandedId]);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("strategic_access_requests" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data as any);
    setLoading(false);
  };

  const loadDiscussions = async (requestId: string) => {
    const { data } = await supabase
      .from("strategic_discussions" as any)
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });
    if (data) setDiscussions(prev => ({ ...prev, [requestId]: data as any }));
  };

  const handleExpand = (requestId: string) => {
    if (expandedId === requestId) {
      setExpandedId(null);
    } else {
      setExpandedId(requestId);
      loadDiscussions(requestId);
    }
  };

  const handleApprove = async (request: AccessRequest) => {
    setProcessing(request.id);
    try {
      await supabase
        .from("strategic_access_requests" as any)
        .update({
          status: "approved",
          admin_response: adminResponse || "Accès approuvé",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq("id", request.id);

      // Send notification to user
      await supabase.from("notifications" as any).insert({
        user_id: request.user_id,
        type: "strategic_access",
        title: "✅ Accès au Pôle Stratégique approuvé",
        message: adminResponse || "Votre demande d'accès au Pôle Stratégique a été approuvée. Vous pouvez maintenant créer vos projets.",
        link: "/pole-strategique",
      });

      toast({ title: "✅ Demande approuvée", description: `Accès accordé à ${request.user_name || request.user_email}` });
      setAdminResponse("");
      fetchRequests();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: AccessRequest) => {
    if (!adminResponse.trim()) {
      toast({ title: "Motivation requise", description: "Veuillez indiquer la raison du refus", variant: "destructive" });
      return;
    }
    setProcessing(request.id);
    try {
      await supabase
        .from("strategic_access_requests" as any)
        .update({
          status: "rejected",
          admin_response: adminResponse,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq("id", request.id);

      await supabase.from("notifications" as any).insert({
        user_id: request.user_id,
        type: "strategic_access",
        title: "❌ Demande d'accès refusée",
        message: `Votre demande d'accès au Pôle Stratégique a été refusée. Raison : ${adminResponse}`,
        link: "/pole-strategique",
      });

      toast({ title: "Demande refusée" });
      setAdminResponse("");
      fetchRequests();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const sendMessage = async (requestId: string) => {
    if (!newMessage.trim() || !user) return;
    await supabase.from("strategic_discussions" as any).insert({
      request_id: requestId,
      sender_id: user.id,
      content: newMessage.trim(),
      is_admin: true,
    } as any);

    // Notify the user
    const request = requests.find(r => r.id === requestId);
    if (request) {
      await supabase.from("notifications" as any).insert({
        user_id: request.user_id,
        type: "strategic_discussion",
        title: "💬 Nouveau message de l'admin",
        message: newMessage.trim().substring(0, 100),
        link: "/pole-strategique",
      });
    }

    setNewMessage("");
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: "En attente", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
    approved: { label: "Approuvé", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: Check },
    rejected: { label: "Refusé", color: "bg-destructive/10 text-destructive border-destructive/20", icon: X },
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Demandes d'accès au Pôle Stratégique
              </CardTitle>
              <CardDescription>
                {pendingCount > 0 ? `${pendingCount} demande(s) en attente` : "Aucune demande en attente"}
              </CardDescription>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500 text-white animate-pulse">{pendingCount} en attente</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune demande d'accès pour le moment.</p>
          ) : (
            requests.map(request => {
              const config = statusConfig[request.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const isExpanded = expandedId === request.id;
              const msgs = discussions[request.id] || [];

              return (
                <motion.div key={request.id} layout className="border rounded-xl overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleExpand(request.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{request.user_name || "Utilisateur"}</span>
                          {request.user_email && <span className="text-xs text-muted-foreground">{request.user_email}</span>}
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {request.startup_name && <Badge variant="secondary" className="text-xs">{request.startup_name}</Badge>}
                          {request.sector && <Badge variant="outline" className="text-xs">{request.sector}</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />{config.label}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                      >
                        <div className="p-4 space-y-4">
                          {/* Motivation */}
                          {request.motivation && (
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Motivation</p>
                              <p className="text-sm">{request.motivation}</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground">
                            Demandé le {new Date(request.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>

                          {/* Discussion */}
                          <div className="border rounded-lg">
                            <div className="p-3 border-b bg-muted/20">
                              <p className="text-sm font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Discussion
                              </p>
                            </div>
                            <ScrollArea className="max-h-60 p-3">
                              {msgs.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4">Aucun message</p>
                              ) : (
                                <div className="space-y-2">
                                  {msgs.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                                        msg.is_admin
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted"
                                      }`}>
                                        <p className="text-[10px] font-medium mb-0.5 opacity-70">
                                          {msg.is_admin ? "Admin" : request.user_name || "Utilisateur"}
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
                                placeholder="Répondre..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendMessage(request.id)}
                                className="h-9 text-sm"
                              />
                              <Button size="sm" className="h-9 px-3" onClick={() => sendMessage(request.id)}>
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Admin actions for pending requests */}
                          {request.status === "pending" && (
                            <div className="space-y-3 pt-2">
                              <Textarea
                                placeholder="Réponse / motif (obligatoire pour le refus)..."
                                value={adminResponse}
                                onChange={e => setAdminResponse(e.target.value)}
                                className="min-h-[60px] text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApprove(request)}
                                  disabled={processing === request.id}
                                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                >
                                  {processing === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                  Approuver l'accès
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(request)}
                                  disabled={processing === request.id}
                                  className="gap-2"
                                >
                                  <X className="h-4 w-4" /> Refuser
                                </Button>
                              </div>
                            </div>
                          )}

                          {request.status !== "pending" && request.admin_response && (
                            <div className={`p-3 rounded-lg ${request.status === "approved" ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                              <p className="text-xs font-semibold mb-1">Réponse admin</p>
                              <p className="text-sm">{request.admin_response}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicAccessManager;
