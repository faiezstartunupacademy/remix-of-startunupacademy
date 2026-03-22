import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ChevronUp, MessageSquare, Eye, ExternalLink, Share2,
  Bookmark, Calendar, MapPin, Users, DollarSign, Send, Loader2, Building2, Briefcase,
  Video, Tag, Link2, FileText, ThumbsUp, ThumbsDown, Reply, QrCode, Facebook, Twitter, Linkedin, Shield
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  useStartupDetail, useStartupFounders, useStartupFunding,
  useStartupKpis, useStartupComments, useVote, useToggleBookmark
} from "@/hooks/useMarketplace";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StartupPrivateChat from "@/components/marketplace/StartupPrivateChat";

const stageColors: Record<string, string> = {
  early: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  growth: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  scale: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};
const stageLabels: Record<string, string> = { early: "Early-Stage", growth: "Growth-Stage", scale: "Scale-Stage" };

const StartupDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const voteMutation = useVote();
  const bookmarkMutation = useToggleBookmark();

  const { data: startup, isLoading } = useStartupDetail(slug || "");
  const { data: founders } = useStartupFounders(startup?.id || "");
  const { data: funding } = useStartupFunding(startup?.id || "");
  const { data: kpis } = useStartupKpis(startup?.id || "");
  const { data: comments } = useStartupComments(startup?.id || "");

  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentVotes, setCommentVotes] = useState<Record<string, { helpful: number; not_helpful: number }>>({});

  // Fetch comment votes
  useEffect(() => {
    if (!comments?.length) return;
    const ids = comments.map(c => c.id);
    supabase.from("marketplace_comment_votes").select("comment_id, is_helpful").in("comment_id", ids).then(({ data }) => {
      if (!data) return;
      const map: Record<string, { helpful: number; not_helpful: number }> = {};
      data.forEach((v: any) => {
        if (!map[v.comment_id]) map[v.comment_id] = { helpful: 0, not_helpful: 0 };
        v.is_helpful ? map[v.comment_id].helpful++ : map[v.comment_id].not_helpful++;
      });
      setCommentVotes(map);
    });
  }, [comments]);

  if (!user) { navigate("/auth"); return null; }

  const handleComment = async () => {
    if (!comment.trim() || !startup) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("marketplace_comments").insert({
      user_id: user.id, startup_id: startup.id, content: comment.trim(),
      parent_comment_id: replyTo || null,
    });
    setIsSubmitting(false);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
    else { setComment(""); setReplyTo(null); queryClient.invalidateQueries({ queryKey: ["marketplace-comments", startup.id] }); toast({ title: t("common.success") }); }
  };

  const handleVoteComment = async (commentId: string, isHelpful: boolean) => {
    const { data: existing } = await supabase.from("marketplace_comment_votes").select("id").eq("comment_id", commentId).eq("user_id", user.id).maybeSingle();
    if (existing) {
      await supabase.from("marketplace_comment_votes").delete().eq("id", (existing as any).id);
    }
    await supabase.from("marketplace_comment_votes").insert({ comment_id: commentId, user_id: user.id, is_helpful: isHelpful });
    // Refresh
    queryClient.invalidateQueries({ queryKey: ["marketplace-comments", startup?.id] });
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast({ title: "Lien copié !" }); };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = startup ? `Découvrez ${startup.name} — ${startup.tagline}` : "";

  const fundingChartData = funding?.map(f => ({ round: f.round_type, amount: Number(f.amount) })) || [];
  const totalRaised = funding?.reduce((s, f) => s + Number(f.amount), 0) || 0;

  const topLevelComments = comments?.filter(c => !c.parent_comment_id) || [];
  const getReplies = (parentId: string) => comments?.filter(c => c.parent_comment_id === parentId) || [];

  // Cast for new fields
  const s = startup as any;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container py-12 space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-96 rounded-2xl" /></main><Footer /></div>
  );

  if (!startup) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Startup introuvable</h2><Link to="/marketplace"><Button>Retour au marketplace</Button></Link></div></main><Footer /></div>
  );

  const renderComment = (c: any, depth = 0) => {
    const replies = getReplies(c.id);
    const cv = commentVotes[c.id] || { helpful: 0, not_helpful: 0 };
    return (
      <div key={c.id} style={{ marginLeft: depth * 24 }}>
        <Card className={depth > 0 ? "border-l-2 border-l-primary/30" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">U</div>
              <span className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
            <p className="text-sm mb-3">{c.content}</p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={() => handleVoteComment(c.id, true)}>
                <ThumbsUp className="h-3.5 w-3.5" /> {cv.helpful}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={() => handleVoteComment(c.id, false)}>
                <ThumbsDown className="h-3.5 w-3.5" /> {cv.not_helpful}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={() => setReplyTo(c.id)}>
                <Reply className="h-3.5 w-3.5" /> {t("startupDetail.reply")}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={() => {
                navigator.clipboard.writeText(`${shareUrl}#comment-${c.id}`);
                toast({ title: t("common.success") });
              }}>
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {replies.map(r => renderComment(r, depth + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-12 lg:py-16">
          <div className="container">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" /> Retour Marketplace
            </Link>
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl border border-white/20 shrink-0">
                {startup.logo_url ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full rounded-2xl object-cover" /> : startup.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{startup.name}</h1>
                  <Badge variant="outline" className={`${stageColors[startup.stage]} border`}>{stageLabels[startup.stage]}</Badge>
                  {s.category && <Badge variant="secondary">{s.category}</Badge>}
                </div>
                <p className="text-lg text-white/60 mb-4">{startup.tagline}</p>
                <div className="flex items-center gap-4 text-sm text-white/50 flex-wrap">
                  {startup.sector && <Badge variant="secondary">{startup.sector}</Badge>}
                  {startup.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {startup.location}</span>}
                  {s.governorate && <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {s.governorate}</span>}
                  {s.program && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {s.program}</span>}
                  {startup.founded_date && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(startup.founded_date).getFullYear()}</span>}
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {startup.views_count}</span>
                  {s.founders_count > 0 && <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {s.founders_count} fondateur(s)</span>}
                </div>
                {/* Keywords */}
                {s.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {s.keywords.map((kw: string) => <Badge key={kw} variant="outline" className="text-xs text-white/70 border-white/20">{kw}</Badge>)}
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => voteMutation.mutate(startup.id)} className="p-1 rounded-lg hover:bg-emerald-500/20"><ChevronUp className="h-7 w-7 text-emerald-400" /></motion.button>
                  <span className="text-xl font-bold text-white">{startup.votes_count}</span>
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/20 text-white hover:bg-white/10" onClick={() => bookmarkMutation.mutate(startup.id)}><Bookmark className="h-5 w-5" /></Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/20 text-white hover:bg-white/10" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
                {user && startup.created_by === user.id && (
                  <Button className="h-12 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate(`/startup-space/${startup.id}`)}>
                    <Shield className="h-4 w-4" /> Espace Privé
                  </Button>
                )}
                {startup.website_url && (
                  <Button asChild className="h-12 rounded-xl gap-2"><a href={startup.website_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> {t("startupDetail.siteWeb")}</a></Button>
                )}
              </div>
            </div>
            {/* Social share buttons + QR Code */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-white/40 text-sm">{t("startupDetail.share")}</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"><Facebook className="h-4 w-4" /></a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"><Twitter className="h-4 w-4" /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"><Linkedin className="h-4 w-4" /></a>
              <div className="ml-2 border-l border-white/20 pl-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&format=png&data=${encodeURIComponent(shareUrl)}`}
                  alt={`QR ${startup.name}`}
                  className="w-12 h-12 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                  title="Scanner pour partager"
                  onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(shareUrl)}`, '_blank')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 pb-20">
          <div className="container">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-6">
                <TabsTrigger value="about">{t("startupDetail.about")}</TabsTrigger>
                <TabsTrigger value="media">{t("startupDetail.media")}</TabsTrigger>
                <TabsTrigger value="funding">{t("startupDetail.fundingRounds")}</TabsTrigger>
                <TabsTrigger value="kpis">KPIs</TabsTrigger>
                <TabsTrigger value="comments">{t("startupDetail.reviews")} ({comments?.length || 0})</TabsTrigger>
                <TabsTrigger value="chat">{t("startupDetail.discussion")}</TabsTrigger>
              </TabsList>

              {/* About */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t("startupDetail.description")}</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{startup.description || t("startupDetail.noDescription")}</p>
                  </CardContent>
                </Card>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card><CardContent className="p-4 text-center"><Building2 className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">{t("marketplace.governorate")}</p><p className="font-semibold text-sm">{s.governorate || "—"}</p></CardContent></Card>
                  <Card><CardContent className="p-4 text-center"><Briefcase className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">{t("marketplace.program")}</p><p className="font-semibold text-sm">{s.program || "—"}</p></CardContent></Card>
                  <Card><CardContent className="p-4 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">{t("marketplace.founders")}</p><p className="font-semibold text-sm">{s.founders_count || 1}</p></CardContent></Card>
                  <Card><CardContent className="p-4 text-center"><DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">{t("marketplace.totalRaised")}</p><p className="font-semibold text-sm">{totalRaised > 0 ? `$${totalRaised.toLocaleString()}` : "—"}</p></CardContent></Card>
                </div>

                {/* Equity Split */}
                {s.equity_split && Object.keys(s.equity_split).length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>{t("startupDetail.equitySplit")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(s.equity_split).map(([name, pct]: [string, any]) => (
                          <Badge key={name} variant="outline" className="text-sm px-3 py-1">{name}: {pct}%</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Alternatives */}
                {s.alternatives?.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>{t("startupDetail.alternativesCompetitors")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {s.alternatives.map((alt: string) => <Badge key={alt} variant="secondary">{alt}</Badge>)}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {founders && founders.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> {t("marketplace.founders")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {founders.map(f => (
                          <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                              {f.avatar_url ? <img src={f.avatar_url} className="w-full h-full rounded-full object-cover" /> : f.name.charAt(0)}
                            </div>
                            <div><p className="font-semibold text-sm">{f.name}</p><p className="text-xs text-muted-foreground">{f.role_title}</p></div>
                            {f.linkedin_url && <a href={f.linkedin_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4" /></a>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {s.mvp_url && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5" /> {t("startupDetail.mvpLink")}</CardTitle></CardHeader>
                      <CardContent>
                        <a href={s.mvp_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{s.mvp_url}</a>
                      </CardContent>
                    </Card>
                  )}
                  {s.video_url && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> {t("startupDetail.presentationVideo")}</CardTitle></CardHeader>
                      <CardContent>
                        {s.video_url.includes("youtube") || s.video_url.includes("youtu.be") ? (
                          <iframe src={s.video_url.replace("watch?v=", "embed/")} className="w-full aspect-video rounded-lg" allowFullScreen />
                        ) : (
                          <video src={s.video_url} controls className="w-full rounded-lg" />
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {s.pitch_deck_url && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Pitch Deck</CardTitle></CardHeader>
                      <CardContent>
                        <a href={s.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <FileText className="h-4 w-4" /> {t("startupDetail.viewPitchDeck")}
                        </a>
                      </CardContent>
                    </Card>
                  )}
                  {/* QR Code */}
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" /> QR Code</CardTitle></CardHeader>
                    <CardContent className="flex justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </CardContent>
                  </Card>
                </div>
                {!s.mvp_url && !s.video_url && !s.pitch_deck_url && (
                  <div className="text-center py-12"><Video className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">{t("startupDetail.noMedia")}</p></div>
                )}
              </TabsContent>

              {/* Funding */}
              <TabsContent value="funding" className="space-y-6">
                {fundingChartData.length > 0 ? (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={fundingChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="round" /><YAxis />
                            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <div className="space-y-3">
                      {funding?.map(f => (
                        <Card key={f.id}><CardContent className="p-4 flex items-center justify-between">
                          <div><Badge variant="outline">{f.round_type}</Badge><span className="ml-3 font-bold text-lg">${Number(f.amount).toLocaleString()}</span></div>
                          <div className="text-sm text-muted-foreground">{f.round_date && new Date(f.round_date).toLocaleDateString("fr-FR")}{f.investors?.length ? ` — ${f.investors.join(", ")}` : ""}</div>
                        </CardContent></Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12"><DollarSign className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">{t("startupDetail.noFunding")}</p></div>
                )}
              </TabsContent>

              {/* KPIs */}
              <TabsContent value="kpis">
                {kpis?.length ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map(kpi => (
                      <Card key={kpi.id}><CardContent className="p-6 text-center"><p className="text-2xl font-bold">{kpi.metric_value}</p><p className="text-sm text-muted-foreground mt-1">{kpi.metric_name}</p></CardContent></Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12"><p className="text-muted-foreground">{t("startupDetail.noKpis")}</p></div>
                )}
              </TabsContent>

              {/* Comments */}
              <TabsContent value="comments" className="space-y-4">
                <div className="space-y-2">
                  {replyTo && <div className="flex items-center gap-2"><Badge variant="outline">{t("startupDetail.replyToComment")}</Badge><Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>{t("common.cancel")}</Button></div>}
                  <div className="flex gap-3">
                    <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={replyTo ? t("startupDetail.replyPlaceholder") : t("startupDetail.commentPlaceholder")} className="flex-1" rows={2} />
                    <Button onClick={handleComment} disabled={isSubmitting || !comment.trim()} className="gap-2 self-end">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {topLevelComments.map(c => renderComment(c))}
                </div>
                {!comments?.length && <p className="text-center text-muted-foreground py-8">{t("startupDetail.noComments")}</p>}
              </TabsContent>

              {/* Private Chat */}
              <TabsContent value="chat">
                <StartupPrivateChat
                  startupId={startup.id}
                  startupName={startup.name}
                  isOwner={startup.created_by === user.id}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StartupDetailPage;
