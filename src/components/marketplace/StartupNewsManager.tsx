import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus, Loader2, Newspaper, Trash2, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface NewsItem {
  id: string;
  title: string;
  content: string | null;
  news_type: string;
  is_approved: boolean;
  created_at: string;
  startup_id: string | null;
  submitted_by: string;
  startup_name?: string;
}

const newsTypes = [
  { value: "announcement", label: "📢 Annonce" },
  { value: "funding", label: "💰 Levée de fonds" },
  { value: "launch", label: "🚀 Lancement" },
  { value: "milestone", label: "🏆 Milestone" },
  { value: "partnership", label: "🤝 Partenariat" },
  { value: "growth", label: "📈 Croissance" },
];

interface Props {
  mode: "admin" | "founder";
  startupId?: string;
}

const StartupNewsManager = ({ mode, startupId }: Props) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newsType, setNewsType] = useState("announcement");
  const [selectedStartup, setSelectedStartup] = useState(startupId || "");
  const [startups, setStartups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchNews();
    if (mode === "admin") fetchStartups();
  }, []);

  const fetchStartups = async () => {
    const { data } = await supabase
      .from("marketplace_startups")
      .select("id, name")
      .eq("is_approved", true)
      .order("name");
    if (data) setStartups(data as any);
  };

  const fetchNews = async () => {
    setIsLoading(true);
    let query = supabase
      .from("marketplace_news")
      .select("id, title, content, news_type, is_approved, created_at, startup_id, submitted_by")
      .order("created_at", { ascending: false });

    if (mode === "founder" && startupId) {
      query = query.eq("startup_id", startupId);
    }

    const { data } = await query as any;

    if (data?.length) {
      const startupIds = [...new Set(data.map((n: any) => n.startup_id).filter(Boolean))] as string[];
      let startupMap: Record<string, string> = {};
      if (startupIds.length) {
        const { data: sData } = await supabase.from("marketplace_startups").select("id, name").in("id", startupIds);
        if (sData) startupMap = Object.fromEntries(sData.map((s: any) => [s.id, s.name]));
      }
      setNews(data.map((n: any) => ({ ...n, startup_name: n.startup_id ? startupMap[n.startup_id] : undefined })));
    } else {
      setNews([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: t("common.error"), description: t("submitForm.nameTaglineRequired"), variant: "destructive" });
      return;
    }
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase.from("marketplace_news").insert({
      title: title.trim(),
      content: content.trim() || null,
      news_type: newsType,
      startup_id: selectedStartup || startupId || null,
      submitted_by: user.id,
      is_approved: mode === "admin",
    } as any);
    setIsSaving(false);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success"), description: mode === "admin" ? "Actualité publiée" : "Soumise pour approbation" });
      setTitle(""); setContent(""); setNewsType("announcement");
      fetchNews();
    }
  };

  const handleApprove = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("marketplace_news").update({ is_approved: true, approved_by: user.id, approved_at: new Date().toISOString() } as any).eq("id", id);
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else { toast({ title: t("common.success") }); fetchNews(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.delete") + " ?")) return;
    await supabase.from("marketplace_news").delete().eq("id", id);
    fetchNews();
    toast({ title: t("common.success") });
  };

  return (
    <div className="space-y-6">
      {/* Add news form */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {mode === "admin" ? "Publier une actualité" : "Proposer une actualité"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("common.name")} *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Levée de 500K€ réussie !" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newsType} onValueChange={setNewsType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {newsTypes.map(nt => <SelectItem key={nt.value} value={nt.value}>{nt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {mode === "admin" && (
            <div className="space-y-2">
              <Label>Startup associée</Label>
              <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                <SelectTrigger><SelectValue placeholder={t("submitForm.select")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Général —</SelectItem>
                  {startups.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>{t("common.description")}</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Détails de l'actualité..." rows={2} />
          </div>
          <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {mode === "admin" ? "Publier" : "Soumettre pour validation"}
          </Button>
        </CardContent>
      </Card>

      {/* News list */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : !news.length ? (
          <p className="text-center text-muted-foreground py-8">Aucune actualité</p>
        ) : (
          news.map(item => (
            <Card key={item.id} className={!item.is_approved ? "border-amber-500/30 bg-amber-500/5" : ""}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Newspaper className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{item.title}</span>
                      <Badge variant="outline" className="text-[10px]">{item.news_type}</Badge>
                      {item.startup_name && <Badge variant="secondary" className="text-[10px]">{item.startup_name}</Badge>}
                      {!item.is_approved && (
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 gap-1">
                          <Clock className="h-3 w-3" /> En attente
                        </Badge>
                      )}
                    </div>
                    {item.content && <p className="text-xs text-muted-foreground truncate mt-0.5">{item.content}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {mode === "admin" && !item.is_approved && (
                    <Button size="sm" variant="outline" className="gap-1 h-8" onClick={() => handleApprove(item.id)}>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Approuver
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StartupNewsManager;
