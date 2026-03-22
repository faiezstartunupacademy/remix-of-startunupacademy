import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface StartupSubmitFormProps {
  onClose: () => void;
}

const StartupSubmitForm = ({ onClose }: StartupSubmitFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", sector: "tech", stage: "early",
    location: "", website_url: "", program: "", governorate: "",
    mvp_url: "", video_url: "", founders_count: "1", keywords: "",
    alternatives: "", category: "product", pitch_deck_url: "",
  });

  useEffect(() => {
    supabase.from("marketplace_programs").select("name").order("name").then(({ data }) => {
      if (data) setPrograms(data.map((d: any) => d.name));
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.tagline) {
      toast({ title: t("common.error"), description: t("submitForm.nameTaglineRequired"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: t("auth.loginRequired"), variant: "destructive" }); setIsSubmitting(false); return; }

    const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);

    let autoApproved = false;
    const { data: projects } = await supabase.from("incubation_projects").select("id").eq("user_id", user.id).limit(10);
    if (projects?.length) {
      for (const proj of projects) {
        const { data: steps } = await supabase.from("incubation_steps").select("status").eq("project_id", proj.id);
        if (steps && steps.length >= 7 && steps.every(s => s.status === "completed")) { autoApproved = true; break; }
      }
    }

    const keywordsArr = form.keywords ? form.keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
    const alternativesArr = form.alternatives ? form.alternatives.split(",").map(a => a.trim()).filter(Boolean) : [];

    const { error } = await supabase.from("marketplace_startups").insert({
      name: form.name, tagline: form.tagline, description: form.description || null,
      sector: form.sector, stage: form.stage, location: form.location || null,
      website_url: form.website_url || null,
      program: form.program && form.program !== "none" ? form.program : null,
      governorate: form.governorate || null, slug, created_by: user.id,
      is_approved: autoApproved,
      mvp_url: form.mvp_url || null, video_url: form.video_url || null,
      founders_count: parseInt(form.founders_count) || 1,
      keywords: keywordsArr, alternatives: alternativesArr,
      category: form.category, pitch_deck_url: form.pitch_deck_url || null,
    } as any);

    setIsSubmitting(false);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
    else {
      toast({
        title: autoApproved ? t("submitForm.publishedAuto") : t("submitForm.submitted"),
        description: autoApproved ? t("submitForm.publishedAutoDesc") : t("submitForm.submittedDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups"] });
      onClose();
    }
  };

  const u = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3"><Rocket className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">{t("marketplace.submitStartup")}</h2></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("common.name")} *</Label><Input value={form.name} onChange={e => u("name", e.target.value)} placeholder={t("submitForm.namePlaceholder")} /></div>
            <div className="space-y-2"><Label>Tagline *</Label><Input value={form.tagline} onChange={e => u("tagline", e.target.value)} placeholder={t("submitForm.taglinePlaceholder")} /></div>
          </div>
          <div className="space-y-2"><Label>{t("common.description")}</Label><Textarea value={form.description} onChange={e => u("description", e.target.value)} rows={3} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("marketplace.sector")}</Label>
              <Select value={form.sector} onValueChange={v => u("sector", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["tech","fintech","healthtech","edtech","greentech","ecommerce","saas","marketplace","ai","iot"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("marketplace.phase")}</Label>
              <Select value={form.stage} onValueChange={v => u("stage", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="early">{t("marketplace.early")}</SelectItem>
                  <SelectItem value="growth">{t("marketplace.growth")}</SelectItem>
                  <SelectItem value="scale">{t("marketplace.scale")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("submitForm.category")}</Label>
              <Select value={form.category} onValueChange={v => u("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["product","service","platform","hardware","consulting"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("marketplace.program")}</Label>
              <Select value={form.program} onValueChange={v => u("program", v)}>
                <SelectTrigger><SelectValue placeholder={t("submitForm.select")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("common.noNone")}</SelectItem>
                  {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("marketplace.governorate")}</Label>
              <Select value={form.governorate} onValueChange={v => u("governorate", v)}>
                <SelectTrigger><SelectValue placeholder={t("submitForm.select")} /></SelectTrigger>
                <SelectContent>
                  {["Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja","Jendouba","Kef","Siliana","Sousse","Monastir","Mahdia","Sfax","Kairouan","Kasserine","Sidi Bouzid","Gabès","Médenine","Tataouine","Gafsa","Tozeur","Kébili"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("marketplace.location")}</Label><Input value={form.location} onChange={e => u("location", e.target.value)} placeholder="Tunis, Tunisie" /></div>
            <div className="space-y-2"><Label>{t("submitForm.website")}</Label><Input value={form.website_url} onChange={e => u("website_url", e.target.value)} placeholder="https://..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("submitForm.mvpLink")}</Label><Input value={form.mvp_url} onChange={e => u("mvp_url", e.target.value)} placeholder="https://mvp.example.com" /></div>
            <div className="space-y-2"><Label>{t("submitForm.videoLink")}</Label><Input value={form.video_url} onChange={e => u("video_url", e.target.value)} placeholder="URL YouTube" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("submitForm.pitchDeckUrl")}</Label><Input value={form.pitch_deck_url} onChange={e => u("pitch_deck_url", e.target.value)} placeholder="URL" /></div>
            <div className="space-y-2"><Label>{t("submitForm.foundersCount")}</Label><Input type="number" min="1" value={form.founders_count} onChange={e => u("founders_count", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("submitForm.keywords")}</Label><Input value={form.keywords} onChange={e => u("keywords", e.target.value)} placeholder="IA, SaaS, B2B" /></div>
            <div className="space-y-2"><Label>{t("submitForm.alternatives")}</Label><Input value={form.alternatives} onChange={e => u("alternatives", e.target.value)} placeholder="Slack, Teams" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              {t("common.submit")}
            </Button>
            <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">{t("submitForm.approvalNote")}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default StartupSubmitForm;
