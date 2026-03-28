import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Plus, Globe, Loader2, Award, Trash2, Edit, Rocket, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAllStartupsAdmin, useMarketplaceEcosystems } from "@/hooks/useMarketplace";
import { useQueryClient } from "@tanstack/react-query";

const MarketplaceAdmin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: startups, isLoading } = useAllStartupsAdmin();
  const { data: ecosystems } = useMarketplaceEcosystems();
  const [adminTab, setAdminTab] = useState("startups");

  // Ecosystem form
  const [ecoName, setEcoName] = useState("");
  const [ecoSlug, setEcoSlug] = useState("");
  const [ecoDesc, setEcoDesc] = useState("");
  const [ecoLocation, setEcoLocation] = useState("");
  const [ecoWebsite, setEcoWebsite] = useState("");
  const [ecoSectors, setEcoSectors] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Programme form
  const [programName, setProgramName] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [programs, setPrograms] = useState<{id: string; name: string; description: string | null}[]>([]);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  // Add startup form
  const [showAddStartup, setShowAddStartup] = useState(false);
  const [newStartup, setNewStartup] = useState({ name: "", tagline: "", sector: "tech", stage: "early", location: "", description: "" });
  const [isSavingStartup, setIsSavingStartup] = useState(false);

  useEffect(() => { fetchPrograms(); }, []);

  const fetchPrograms = async () => {
    const { data } = await supabase.from("marketplace_programs").select("id, name, description").order("created_at", { ascending: false });
    if (data) setPrograms(data as any);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("marketplace_startups").update({ is_approved: true }).eq("id", id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("marketplace.approved") + " !" });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups-admin"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups"] });
    }
  };

  const handleDeleteStartup = async (id: string, name: string) => {
    if (!confirm(`${t("common.delete")} "${name}" ?`)) return;
    const { error } = await supabase.from("marketplace_startups").delete().eq("id", id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success") });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups-admin"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups"] });
    }
  };

  const handleDeleteEcosystem = async (id: string, name: string) => {
    if (!confirm(`${t("common.delete")} "${name}" ?`)) return;
    const { error } = await supabase.from("marketplace_ecosystems").delete().eq("id", id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success") });
      queryClient.invalidateQueries({ queryKey: ["marketplace-ecosystems"] });
    }
  };

  const handleAddEcosystem = async () => {
    if (!ecoName || !ecoSlug) {
      toast({ title: t("common.error"), description: t("submitForm.nameTaglineRequired"), variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from("marketplace_ecosystems").insert({
      name: ecoName, slug: ecoSlug, description: ecoDesc || null,
      location: ecoLocation || null, website_url: ecoWebsite || null,
      sectors_covered: ecoSectors ? ecoSectors.split(",").map(s => s.trim()) : [],
    });
    setIsSaving(false);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success") });
      queryClient.invalidateQueries({ queryKey: ["marketplace-ecosystems"] });
      setEcoName(""); setEcoSlug(""); setEcoDesc(""); setEcoLocation(""); setEcoWebsite(""); setEcoSectors("");
    }
  };

  const handleAddStartup = async () => {
    if (!newStartup.name || !newStartup.tagline) {
      toast({ title: t("common.error"), description: t("submitForm.nameTaglineRequired"), variant: "destructive" });
      return;
    }
    setIsSavingStartup(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsSavingStartup(false); return; }
    const slug = newStartup.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);
    const { error } = await supabase.from("marketplace_startups").insert({
      name: newStartup.name, tagline: newStartup.tagline, description: newStartup.description || null,
      sector: newStartup.sector, stage: newStartup.stage, location: newStartup.location || null,
      slug, created_by: user.id, is_approved: true,
    });
    setIsSavingStartup(false);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success") });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups-admin"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups"] });
      setNewStartup({ name: "", tagline: "", sector: "tech", stage: "early", location: "", description: "" });
      setShowAddStartup(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("marketplace.admin")}</h2>
      </div>

      <Tabs value={adminTab} onValueChange={setAdminTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="startups">Startups ({startups?.length || 0})</TabsTrigger>
          <TabsTrigger value="ecosystems">Écosystèmes ({ecosystems?.length || 0})</TabsTrigger>
          <TabsTrigger value="add-ecosystem">{t("marketplace.addEcosystem")}</TabsTrigger>
          <TabsTrigger value="programs" className="gap-1"><Award className="h-3 w-3" /> Programmes ({programs.length})</TabsTrigger>
        </TabsList>

        {/* Startups Tab */}
        <TabsContent value="startups" className="space-y-3 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddStartup(!showAddStartup)} className="gap-2" size="sm">
              <Plus className="h-4 w-4" /> Ajouter une startup
            </Button>
          </div>

          {showAddStartup && (
            <Card className="border-primary/30">
              <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5" /> Ajouter une startup (admin)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={newStartup.name} onChange={e => setNewStartup({...newStartup, name: e.target.value})} placeholder="Nom de la startup" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline *</Label>
                    <Input value={newStartup.tagline} onChange={e => setNewStartup({...newStartup, tagline: e.target.value})} placeholder="Description courte" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newStartup.description} onChange={e => setNewStartup({...newStartup, description: e.target.value})} rows={3} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Secteur</Label>
                    <Select value={newStartup.sector} onValueChange={v => setNewStartup({...newStartup, sector: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["tech","fintech","healthtech","edtech","greentech","ecommerce","saas","marketplace","ai","iot"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phase</Label>
                    <Select value={newStartup.stage} onValueChange={v => setNewStartup({...newStartup, stage: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early">Early</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Localisation</Label>
                    <Input value={newStartup.location} onChange={e => setNewStartup({...newStartup, location: e.target.value})} placeholder="Tunis" />
                  </div>
                </div>
                <Button onClick={handleAddStartup} disabled={isSavingStartup} className="gap-2">
                  {isSavingStartup ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Ajouter et approuver
                </Button>
              </CardContent>
            </Card>
          )}

          {startups?.map((startup) => (
            <Card key={startup.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{startup.name}</h4>
                  <p className="text-sm text-muted-foreground">{startup.tagline} — {startup.sector}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={startup.is_approved ? "default" : "secondary"}>
                    {startup.is_approved ? t("marketplace.approved") : t("marketplace.pending")}
                  </Badge>
                  {!startup.is_approved && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleApprove(startup.id)}>
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> {t("marketplace.approve")}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteStartup(startup.id, startup.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!startups?.length && <p className="text-center text-muted-foreground py-8">Aucune startup soumise</p>}
        </TabsContent>

        {/* Ecosystems Tab */}
        <TabsContent value="ecosystems" className="space-y-3 mt-4">
          {ecosystems?.map(eco => (
            <Card key={eco.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{eco.name}</h4>
                  <p className="text-sm text-muted-foreground">{eco.location} — {eco.sectors_covered?.join(", ")}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteEcosystem(eco.id, eco.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {!ecosystems?.length && <p className="text-center text-muted-foreground py-8">Aucun écosystème</p>}
        </TabsContent>

        {/* Add Ecosystem Tab */}
        <TabsContent value="add-ecosystem" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> {t("marketplace.addEcosystem")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input value={ecoName} onChange={e => { setEcoName(e.target.value); setEcoSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} placeholder="Station F" />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={ecoSlug} onChange={e => setEcoSlug(e.target.value)} placeholder="station-f" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={ecoDesc} onChange={e => setEcoDesc(e.target.value)} placeholder="Description de l'écosystème..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input value={ecoLocation} onChange={e => setEcoLocation(e.target.value)} placeholder="Paris, France" />
                </div>
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input value={ecoWebsite} onChange={e => setEcoWebsite(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secteurs (séparés par virgule)</Label>
                <Input value={ecoSectors} onChange={e => setEcoSectors(e.target.value)} placeholder="tech, fintech, healthtech" />
              </div>
              <Button onClick={handleAddEcosystem} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ajouter l'écosystème
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
         <TabsContent value="programs" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> {t("marketplace.managePrograms")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>{t("common.name")} *</Label>
                  <Input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="Ex: Startup Tunisia, IntilaQ..." />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>{t("common.description")}</Label>
                  <Input value={programDesc} onChange={e => setProgramDesc(e.target.value)} placeholder={t("submitForm.taglinePlaceholder")} />
                </div>
                <Button
                  onClick={async () => {
                    if (!programName.trim()) { toast({ title: t("common.error"), description: t("submitForm.nameTaglineRequired"), variant: "destructive" }); return; }
                    setIsSavingProgram(true);
                    if (editingProgramId) {
                      const { error } = await supabase.from("marketplace_programs").update({ name: programName.trim(), description: programDesc.trim() || null }).eq("id", editingProgramId);
                      setIsSavingProgram(false);
                      if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
                      else { toast({ title: t("common.success") }); setProgramName(""); setProgramDesc(""); setEditingProgramId(null); fetchPrograms(); }
                    } else {
                      const { error } = await supabase.from("marketplace_programs").insert({ name: programName.trim(), description: programDesc.trim() || null });
                      setIsSavingProgram(false);
                      if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
                      else { toast({ title: t("common.success") }); setProgramName(""); setProgramDesc(""); fetchPrograms(); }
                    }
                  }}
                  disabled={isSavingProgram}
                  className="gap-2"
                >
                  {isSavingProgram ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProgramId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingProgramId ? t("common.save") : t("common.add")}
                </Button>
                {editingProgramId && (
                  <Button variant="outline" onClick={() => { setEditingProgramId(null); setProgramName(""); setProgramDesc(""); }}>
                    {t("common.cancel")}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {programs.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-medium">{p.name}</span>
                        {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => { setEditingProgramId(p.id); setProgramName(p.name); setProgramDesc(p.description || ""); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          if (!confirm(`${t("common.delete")} "${p.name}" ?`)) return;
                          await supabase.from("marketplace_programs").delete().eq("id", p.id);
                          fetchPrograms();
                          toast({ title: t("common.success") });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {!programs.length && <p className="text-center text-muted-foreground py-6">{t("marketplace.noPrograms")}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceAdmin;
