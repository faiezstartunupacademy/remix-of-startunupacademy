import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Plus, Send, Loader2, Pin, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  news: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  discussion: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  question: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  announcement: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const MarketplaceForum = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("discussion");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketplace_forum_posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setPosts(data as ForumPost[]);
    setLoading(false);
  };

  const handleNewPost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from("marketplace_forum_posts").insert({
      user_id: user.id, title: newTitle.trim(), content: newContent.trim(), category: newCategory,
    });
    setSubmitting(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Post publié !" }); setNewTitle(""); setNewContent(""); setShowNew(false); fetchPosts(); }
  };

  const openPost = async (post: ForumPost) => {
    setSelectedPost(post);
    const { data } = await supabase
      .from("marketplace_forum_replies")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    if (data) setReplies(data);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !user || !selectedPost) return;
    setSubmitting(true);
    const { error } = await supabase.from("marketplace_forum_replies").insert({
      post_id: selectedPost.id, user_id: user.id, content: replyContent.trim(),
    });
    setSubmitting(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else {
      setReplyContent("");
      const { data } = await supabase.from("marketplace_forum_replies").select("*").eq("post_id", selectedPost.id).order("created_at");
      if (data) setReplies(data);
    }
  };

  if (selectedPost) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedPost(null)}>← Retour au forum</Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedPost.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              <Badge variant="outline" className={categoryColors[selectedPost.category]}>{selectedPost.category}</Badge>
              <CardTitle className="text-xl">{selectedPost.title}</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{new Date(selectedPost.created_at).toLocaleDateString("fr-FR")}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{selectedPost.content}</p>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg">Réponses ({replies.length})</h3>
        {replies.map(r => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-3.5 w-3.5" /></div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("fr-FR")}</span>
              </div>
              <p className="text-sm">{r.content}</p>
            </CardContent>
          </Card>
        ))}

        {user && (
          <div className="flex gap-3">
            <Textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Répondre..." className="flex-1" rows={2} />
            <Button onClick={handleReply} disabled={submitting || !replyContent.trim()} className="self-end gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="h-6 w-6" /> Forum Marketplace</h2>
          <p className="text-muted-foreground text-sm">Dernières actualités et discussions de la communauté</p>
        </div>
        {user && (
          <Button onClick={() => setShowNew(!showNew)} className="gap-2">
            <Plus className="h-4 w-4" /> Nouveau post
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-4">
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titre du post" />
                <Textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Contenu..." rows={4} />
                <div className="flex items-center gap-3">
                  {["news", "discussion", "question", "announcement"].map(cat => (
                    <Badge
                      key={cat}
                      variant={newCategory === cat ? "default" : "outline"}
                      className={`cursor-pointer ${newCategory === cat ? "" : categoryColors[cat]}`}
                      onClick={() => setNewCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                  <div className="flex-1" />
                  <Button onClick={handleNewPost} disabled={submitting} className="gap-2">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Publier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun post pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/20" onClick={() => openPost(post)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {post.is_pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                      <Badge variant="outline" className={`text-xs ${categoryColors[post.category]}`}>{post.category}</Badge>
                      <span className="font-semibold truncate">{post.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span>{post.replies_count} réponses</span>
                    <span>{new Date(post.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceForum;
