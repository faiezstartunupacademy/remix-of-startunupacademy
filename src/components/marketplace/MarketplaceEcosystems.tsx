import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, ExternalLink, Building2, Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMarketplaceEcosystems } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const MarketplaceEcosystems = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: ecosystems, isLoading } = useMarketplaceEcosystems();

  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", location: "", website: "", sectors: "" });

  const handleAdd = async () => {
    if (!form.name || !form.slug) {
      toast({ title: "Erreur", description: "Le nom et le slug sont requis.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from("marketplace_ecosystems").insert({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      website_url: form.website.trim() || null,
      sectors_covered: form.sectors ? form.sectors.split(",").map(s => s.trim()).filter(Boolean) : [],
    });
    setIsSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Écosystème ajouté !" });
      queryClient.invalidateQueries({ queryKey: ["marketplace-ecosystems"] });
      setForm({ name: "", slug: "", description: "", location: "", website: "", sectors: "" });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'écosystème "${name}" ?`)) return;
    const { error } = await supabase.from("marketplace_ecosystems").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Écosystème supprimé" });
      queryClient.invalidateQueries({ queryKey: ["marketplace-ecosystems"] });
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("marketplace.ecosystems")}</h2>
          <p className="text-muted-foreground">{t("marketplace.ecosystemsDesc")}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"} className="gap-2">
            <Plus className="h-4 w-4" /> {showForm ? "Annuler" : "Ajouter"}
          </Button>
        )}
      </div>

      {isAdmin && showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Nouvel écosystème</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }); }} placeholder="Station F" />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="station-f" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description de l'écosystème..." rows={3} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Paris, France" />
                </div>
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secteurs (séparés par virgule)</Label>
                <Input value={form.sectors} onChange={e => setForm({ ...form, sectors: e.target.value })} placeholder="tech, fintech, healthtech" />
              </div>
              <Button onClick={handleAdd} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ajouter l'écosystème
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!ecosystems?.length ? (
        <div className="text-center py-20">
          <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Aucun écosystème pour le moment</h3>
          <p className="text-sm text-muted-foreground mt-2">Les écosystèmes seront ajoutés par l'administrateur.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystems.map((eco, index) => (
            <motion.div key={eco.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 relative group">
                {isAdmin && (
                  <Button
                    variant="ghost" size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => handleDelete(eco.id, eco.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {eco.logo_url ? (
                        <img src={eco.logo_url} alt={eco.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{eco.name}</h3>
                      {eco.location && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {eco.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{eco.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {eco.sectors_covered?.slice(0, 4).map((sector: string) => (
                      <Badge key={sector} variant="secondary" className="text-xs">{sector}</Badge>
                    ))}
                  </div>
                  {eco.website_url && (
                    <Button variant="outline" size="sm" className="gap-2 w-full" asChild>
                      <a href={eco.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Visiter
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceEcosystems;
