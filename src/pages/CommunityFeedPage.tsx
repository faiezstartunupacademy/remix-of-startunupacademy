import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Heart, MessageCircle, Send, Link2, Sparkles, Users, Flame, Clock, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const renderContent = (text: string) => {
  const parts = text.split(/(#[\p{L}0-9_]+)/giu);
  return parts.map((p, i) => p.startsWith("#")
    ? <span key={i} className="text-primary font-medium hover:underline cursor-pointer">{p}</span>
    : <span key={i}>{p}</span>);
};

interface Post {
  id: string; user_id: string; content: string; category: string;
  link_url: string | null; likes_count: number; comments_count: number; created_at: string;
  author?: { full_name: string | null } | null;
  liked?: boolean;
}
interface Comment { id: string; user_id: string; content: string; created_at: string; author?: { full_name: string | null } | null; }

const CATEGORIES = [
  { id: "general", label: "Général", icon: "💬" },
  { id: "win", label: "Win 🎉", icon: "🏆" },
  { id: "question", label: "Question", icon: "❓" },
  { id: "hiring", label: "Recrute", icon: "👥" },
  { id: "looking", label: "Cherche", icon: "🔍" },
  { id: "resource", label: "Ressource", icon: "📚" },
];

const CommunityFeedPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [linkUrl, setLinkUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); setLoading(false); return; }
    const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
    const [{ data: profs }, { data: myLikes }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name").in("user_id", userIds),
      user ? supabase.from("community_post_likes").select("post_id").eq("user_id", user.id) : Promise.resolve({ data: [] as any[] }),
    ]);
    const profMap = new Map((profs || []).map((p: any) => [p.user_id, p]));
    const likedSet = new Set((myLikes || []).map((l: any) => l.post_id));
    setPosts((data || []).map((p: any) => ({ ...p, author: profMap.get(p.user_id) || null, liked: likedSet.has(p.id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  useEffect(() => {
    const ch = supabase.channel("community-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_posts" }, () => load())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "community_posts" }, (payload: any) => {
        setPosts(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "community_posts" }, (payload: any) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const submit = async () => {
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (content.trim().length < 3) return toast({ title: "Message trop court", variant: "destructive" });
    if (content.length > 2000) return toast({ title: "Message trop long (max 2000)", variant: "destructive" });
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id, content: content.trim(), category, link_url: linkUrl.trim() || null,
    });
    setPosting(false);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setContent(""); setLinkUrl(""); setCategory("general");
    toast({ title: "Publié 🚀" });
  };

  const toggleLike = async (post: Post) => {
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (post.liked) {
      await supabase.from("community_post_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: false, likes_count: Math.max(0, p.likes_count - 1) } : p));
    } else {
      await supabase.from("community_post_likes").insert({ post_id: post.id, user_id: user.id });
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: true, likes_count: p.likes_count + 1 } : p));
    }
  };

  const openCommentsFor = async (postId: string) => {
    setOpenComments(postId);
    const { data } = await supabase.from("community_post_comments").select("*").eq("post_id", postId).order("created_at");
    const userIds = [...new Set((data || []).map((c: any) => c.user_id))];
    const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    const m = new Map((profs || []).map((p: any) => [p.user_id, p]));
    setComments((data || []).map((c: any) => ({ ...c, author: m.get(c.user_id) || null })));
  };

  const submitComment = async (postId: string) => {
    if (!user || newComment.trim().length < 2) return;
    const { error } = await supabase.from("community_post_comments").insert({ post_id: postId, user_id: user.id, content: newComment.trim() });
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setNewComment("");
    openCommentsFor(postId);
  };

  const filteredPosts = filter === "all" ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-7 w-7 text-primary" /> Communauté</h1>
            <p className="text-muted-foreground">Le feed des entrepreneurs tunisiens — partagez vos wins, demandez de l'aide, célébrez ensemble.</p>
          </div>

          {user && (
            <Card className="mb-6 border-primary/20">
              <CardContent className="pt-6 space-y-3">
                <Textarea placeholder="Quoi de neuf ? Partagez un win, une question, une ressource..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} maxLength={2000} />
                <Input placeholder="Lien (optionnel)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">{content.length}/2000</span>
                  <Button className="ml-auto" onClick={submit} disabled={posting || content.trim().length < 3}>
                    {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />} Publier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 flex-wrap mb-4">
            <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Tous</Button>
            {CATEGORIES.map(c => (
              <Button key={c.id} size="sm" variant={filter === c.id ? "default" : "outline"} onClick={() => setFilter(c.id)}>
                {c.icon} {c.label}
              </Button>
            ))}
          </div>

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <div className="space-y-4">
              {filteredPosts.length === 0 && (
                <Card><CardContent className="py-12 text-center text-muted-foreground"><Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />Soyez le premier à poster !</CardContent></Card>
              )}
              {filteredPosts.map((p) => {
                const cat = CATEGORIES.find(c => c.id === p.category);
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">{p.author?.full_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{p.author?.full_name || "Anonyme"}</span>
                              {cat && <Badge variant="secondary" className="text-[10px]">{cat.icon} {cat.label}</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: fr })}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="whitespace-pre-wrap text-sm">{p.content}</p>
                        {p.link_url && (
                          <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                            <Link2 className="h-3 w-3" /> {p.link_url.slice(0, 60)}...
                          </a>
                        )}
                        <div className="flex items-center gap-4 pt-2 border-t">
                          <Button variant="ghost" size="sm" onClick={() => toggleLike(p)} className={p.liked ? "text-rose-500" : ""}>
                            <Heart className={`h-4 w-4 mr-1 ${p.liked ? "fill-rose-500" : ""}`} /> {p.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openComments === p.id ? setOpenComments(null) : openCommentsFor(p.id)}>
                            <MessageCircle className="h-4 w-4 mr-1" /> {p.comments_count}
                          </Button>
                        </div>
                        {openComments === p.id && (
                          <div className="space-y-2 pt-2 border-t">
                            {comments.map(c => (
                              <div key={c.id} className="flex items-start gap-2 text-sm bg-muted/40 rounded-lg p-2">
                                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{c.author?.full_name?.charAt(0) || "?"}</AvatarFallback></Avatar>
                                <div className="flex-1"><span className="font-medium text-xs">{c.author?.full_name || "Anonyme"}</span>
                                  <p className="text-sm">{c.content}</p></div>
                              </div>
                            ))}
                            {user && (
                              <div className="flex gap-2">
                                <Input placeholder="Votre commentaire..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitComment(p.id)} />
                                <Button size="sm" onClick={() => submitComment(p.id)}><Send className="h-4 w-4" /></Button>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Button asChild variant="outline"><Link to="/evenements">📅 Voir les événements</Link></Button>
            <Button asChild variant="outline"><Link to="/cofounders">🤝 Trouver un co-fondateur</Link></Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityFeedPage;
