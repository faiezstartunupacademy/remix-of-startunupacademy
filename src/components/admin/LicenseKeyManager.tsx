import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Key, Plus, Trash2, Copy, Search, Calendar, Users, Check,
  Loader2, RefreshCw, Clock, User, Tag, BarChart3, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LicenseKey {
  id: string;
  key_code: string;
  content_slug: string;
  content_name: string;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  created_at: string;
  formation_date: string | null;
  duration_hours: number | null;
  source_author: string | null;
  source_author_image: string | null;
  source_label: string | null;
}

const LicenseKeyManager = () => {
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [newKey, setNewKey] = useState({
    key_code: "",
    content_slug: "",
    content_name: "",
    max_uses: "",
    expires_at: "",
    formation_date: "",
    duration_hours: "",
    source_author: "",
    source_author_image: "",
    source_label: "",
  });

  useEffect(() => {
    fetchLicenseKeys().then(() => checkAndRenewExpiredKeys());
  }, []);

  const fetchLicenseKeys = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("license_keys")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setLicenseKeys((data as any[]) || []);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les clés", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomKeyCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) key += "-";
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const generateRandomKey = () => {
    setNewKey(prev => ({ ...prev, key_code: generateRandomKeyCode() }));
  };

  const checkAndRenewExpiredKeys = async () => {
    try {
      const { data: expiredKeys, error } = await supabase
        .from("license_keys")
        .select("*")
        .eq("is_active", true)
        .not("expires_at", "is", null)
        .lt("expires_at", new Date().toISOString());

      if (error || !expiredKeys || expiredKeys.length === 0) return;

      let renewedCount = 0;
      for (const oldKey of expiredKeys as LicenseKey[]) {
        // Deactivate old key
        await supabase.from("license_keys").update({ is_active: false }).eq("id", oldKey.id);

        // Calculate new expiration: same duration from now
        let newExpiresAt: string | null = null;
        if (oldKey.expires_at && oldKey.created_at) {
          const originalDuration = new Date(oldKey.expires_at).getTime() - new Date(oldKey.created_at).getTime();
          newExpiresAt = new Date(Date.now() + originalDuration).toISOString();
        }

        // Create renewed key
        const newKeyCode = generateRandomKeyCode();
        await supabase.from("license_keys").insert({
          key_code: newKeyCode,
          content_slug: oldKey.content_slug,
          content_name: oldKey.content_name,
          max_uses: oldKey.max_uses,
          current_uses: 0,
          expires_at: newExpiresAt,
          formation_date: oldKey.formation_date,
          duration_hours: oldKey.duration_hours,
          source_author: oldKey.source_author,
          source_author_image: oldKey.source_author_image,
          source_label: oldKey.source_label,
          is_active: true,
        } as any);

        renewedCount++;
      }

      if (renewedCount > 0) {
        toast({
          title: `${renewedCount} clé(s) renouvelée(s)`,
          description: "De nouvelles clés ont été générées automatiquement pour remplacer les clés expirées.",
        });
        fetchLicenseKeys();
      }
    } catch (err) {
      console.error("Auto-renewal error:", err);
    }
  };

  const handleCreateKey = async () => {
    if (!newKey.key_code || !newKey.content_slug || !newKey.content_name) {
      toast({ title: "Erreur", description: "Champs obligatoires manquants", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const { error } = await supabase.from("license_keys").insert({
        key_code: newKey.key_code.toUpperCase().replace(/-/g, ""),
        content_slug: newKey.content_slug,
        content_name: newKey.content_name,
        max_uses: newKey.max_uses ? parseInt(newKey.max_uses) : null,
        expires_at: newKey.expires_at || null,
        formation_date: newKey.formation_date || null,
        duration_hours: newKey.duration_hours ? parseInt(newKey.duration_hours) : 0,
        source_author: newKey.source_author || null,
        source_author_image: newKey.source_author_image || null,
        source_label: newKey.source_label || null,
      } as any);
      if (error) throw error;
      toast({ title: "Clé créée avec succès !" });
      setIsCreateDialogOpen(false);
      setNewKey({ key_code: "", content_slug: "", content_name: "", max_uses: "", expires_at: "", formation_date: "", duration_hours: "", source_author: "", source_author_image: "", source_label: "" });
      fetchLicenseKeys();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message?.includes("duplicate") ? "Clé existante" : error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("license_keys").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) {
      setLicenseKeys(prev => prev.map(k => k.id === id ? { ...k, is_active: !currentStatus } : k));
      toast({ title: currentStatus ? "Clé désactivée" : "Clé activée" });
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Supprimer cette clé ?")) return;
    const { error } = await supabase.from("license_keys").delete().eq("id", id);
    if (!error) {
      setLicenseKeys(prev => prev.filter(k => k.id !== id));
      toast({ title: "Clé supprimée" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !" });
  };

  const filteredKeys = licenseKeys.filter(k =>
    k.key_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.content_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.content_slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: licenseKeys.length,
    active: licenseKeys.filter(k => k.is_active).length,
    expired: licenseKeys.filter(k => k.expires_at && new Date(k.expires_at) < new Date()).length,
    totalUses: licenseKeys.reduce((acc, k) => acc + k.current_uses, 0),
    totalHours: licenseKeys.reduce((acc, k) => acc + (k.duration_hours || 0), 0),
    withSource: licenseKeys.filter(k => k.source_author).length,
  };

  const getUsagePercent = (k: LicenseKey) => {
    if (!k.max_uses) return 0;
    return Math.min(Math.round((k.current_uses / k.max_uses) * 100), 100);
  };

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Clés", value: stats.total, icon: Key, color: "text-primary" },
          { label: "Actives", value: stats.active, icon: Check, color: "text-emerald-500" },
          { label: "Expirées", value: stats.expired, icon: Calendar, color: "text-orange-500" },
          { label: "Utilisations", value: stats.totalUses, icon: Users, color: "text-blue-500" },
          { label: "Heures Formation", value: stats.totalHours, icon: Clock, color: "text-purple-500" },
          { label: "Avec Source", value: stats.withSource, icon: User, color: "text-teal-500" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="icon" onClick={fetchLicenseKeys}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 sm:flex-none"><Plus className="h-4 w-4 mr-2" /> Nouvelle Clé</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une clé de licence</DialogTitle>
                    <DialogDescription>Configurez une nouvelle clé d'accès pour une formation.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Clé de licence *</Label>
                      <div className="flex gap-2">
                        <Input value={newKey.key_code} onChange={e => setNewKey(p => ({ ...p, key_code: e.target.value.toUpperCase() }))} placeholder="XXXX-XXXX-XXXX-XXXX" className="font-mono" />
                        <Button type="button" variant="outline" onClick={generateRandomKey}><RefreshCw className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Slug du contenu *</Label>
                        <Input value={newKey.content_slug} onChange={e => setNewKey(p => ({ ...p, content_slug: e.target.value.toLowerCase() }))} placeholder="ex: lean-canvas" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom du contenu *</Label>
                        <Input value={newKey.content_name} onChange={e => setNewKey(p => ({ ...p, content_name: e.target.value }))} placeholder="ex: Lean Canvas" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date de la formation</Label>
                        <Input type="date" value={newKey.formation_date} onChange={e => setNewKey(p => ({ ...p, formation_date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée (heures)</Label>
                        <Input type="number" value={newKey.duration_hours} onChange={e => setNewKey(p => ({ ...p, duration_hours: e.target.value }))} placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Utilisations max</Label>
                        <Input type="number" value={newKey.max_uses} onChange={e => setNewKey(p => ({ ...p, max_uses: e.target.value }))} placeholder="Illimité" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date d'expiration</Label>
                        <Input type="date" value={newKey.expires_at} onChange={e => setNewKey(p => ({ ...p, expires_at: e.target.value }))} />
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2"><Tag className="h-4 w-4" /> Source / Attribution</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom de l'auteur</Label>
                          <Input value={newKey.source_author} onChange={e => setNewKey(p => ({ ...p, source_author: e.target.value }))} placeholder="Ex: Abdelrahman Sleem" />
                        </div>
                        <div className="space-y-2">
                          <Label>Label source</Label>
                          <Input value={newKey.source_label} onChange={e => setNewKey(p => ({ ...p, source_label: e.target.value }))} placeholder="Ex: STACK/" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL image auteur</Label>
                        <Input value={newKey.source_author_image} onChange={e => setNewKey(p => ({ ...p, source_author_image: e.target.value }))} placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateKey} disabled={isCreating}>
                      {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer la clé"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Keys List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> Clés de Licence</CardTitle>
          <CardDescription>Gérez les clés d'accès aux formations protégées — {filteredKeys.length} clés</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filteredKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{searchTerm ? "Aucune clé trouvée" : "Aucune clé créée"}</div>
          ) : (
            <div className="space-y-3">
              {filteredKeys.map(key => {
                const isExpired = key.expires_at && new Date(key.expires_at) < new Date();
                const isMaxed = key.max_uses !== null && key.current_uses >= (key.max_uses || 0);
                const daysLeft = getDaysUntilExpiry(key.expires_at);
                const usagePercent = getUsagePercent(key);
                const isExpanded = expandedKey === key.id;
                const isVisible = showKeys[key.id];

                return (
                  <Collapsible key={key.id} open={isExpanded} onOpenChange={() => setExpandedKey(isExpanded ? null : key.id)}>
                    <Card className={`transition-all ${!key.is_active ? 'opacity-60' : ''} ${isExpired ? 'border-orange-500/30' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Key Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{key.content_name}</h4>
                              {isExpired ? (
                                <Badge variant="outline" className="text-orange-500 border-orange-500/30 text-[10px]">Expirée</Badge>
                              ) : isMaxed ? (
                                <Badge variant="outline" className="text-red-500 border-red-500/30 text-[10px]">Limite</Badge>
                              ) : key.is_active ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px]">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px]">Désactivée</Badge>
                              )}
                              {key.source_label && (
                                <Badge variant="outline" className="text-[10px] gap-1">
                                  <Tag className="h-2.5 w-2.5" />{key.source_label}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={e => { e.stopPropagation(); setShowKeys(p => ({ ...p, [key.id]: !p[key.id] })); }}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </button>
                                <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                                  {isVisible ? key.key_code : '••••••••••'}
                                </code>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => { e.stopPropagation(); copyToClipboard(key.key_code); }}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">{key.content_slug}</span>
                            </div>
                          </div>

                          {/* Source Author */}
                          {key.source_author && (
                            <div className="hidden md:flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={key.source_author_image || undefined} />
                                <AvatarFallback className="text-[10px] bg-primary/10">{key.source_author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{key.source_author}</span>
                            </div>
                          )}

                          {/* Usage */}
                          <div className="hidden sm:block text-center min-w-[80px]">
                            <p className="text-sm font-mono font-bold">{key.current_uses}{key.max_uses !== null && `/${key.max_uses}`}</p>
                            <p className="text-[10px] text-muted-foreground">utilisations</p>
                            {key.max_uses && (
                              <Progress value={usagePercent} className="h-1 mt-1" />
                            )}
                          </div>

                          {/* Duration */}
                          {key.duration_hours ? (
                            <div className="hidden lg:block text-center min-w-[60px]">
                              <p className="text-sm font-bold">{key.duration_hours}h</p>
                              <p className="text-[10px] text-muted-foreground">durée</p>
                            </div>
                          ) : null}

                          {/* Expiry */}
                          <div className="hidden sm:block text-center min-w-[80px]">
                            {key.expires_at ? (
                              <>
                                <p className={`text-xs font-medium ${isExpired ? 'text-orange-500' : daysLeft !== null && daysLeft < 7 ? 'text-amber-500' : ''}`}>
                                  {new Date(key.expires_at).toLocaleDateString("fr-FR")}
                                </p>
                                {daysLeft !== null && !isExpired && (
                                  <p className="text-[10px] text-muted-foreground">{daysLeft}j restants</p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground">∞</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Switch checked={key.is_active} onCheckedChange={() => toggleKeyStatus(key.id, key.is_active)} />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={e => { e.stopPropagation(); deleteKey(key.id); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <BarChart3 className="h-3.5 w-3.5" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        {/* Expanded Details */}
                         <CollapsibleContent>
                          <div className="mt-4 pt-4 border-t border-border/50 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Créée le</p>
                              <p className="text-sm">{new Date(key.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date Formation</p>
                              <p className="text-sm">{key.formation_date ? new Date(key.formation_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Non définie"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Durée</p>
                              <p className="text-sm">{key.duration_hours ? `${key.duration_hours} heures` : "Non définie"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Taux d'utilisation</p>
                              <p className="text-sm">{key.max_uses ? `${usagePercent}% (${key.current_uses}/${key.max_uses})` : `${key.current_uses} utilisations (illimité)`}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Expiration</p>
                              <p className={`text-sm font-medium ${isExpired ? 'text-destructive' : daysLeft !== null && daysLeft < 7 ? 'text-amber-500' : ''}`}>
                                {key.expires_at
                                  ? `${new Date(key.expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}${daysLeft !== null ? (isExpired ? ' (expirée)' : ` (${daysLeft}j restants)`) : ''}`
                                  : "Pas d'expiration"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Renouvellement</p>
                              {isExpired ? (
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async (e) => {
                                  e.stopPropagation();
                                  await supabase.from("license_keys").update({ is_active: false }).eq("id", key.id);
                                  const originalDuration = key.expires_at && key.created_at
                                    ? new Date(key.expires_at).getTime() - new Date(key.created_at).getTime()
                                    : 30 * 24 * 60 * 60 * 1000;
                                  await supabase.from("license_keys").insert({
                                    key_code: generateRandomKeyCode(),
                                    content_slug: key.content_slug,
                                    content_name: key.content_name,
                                    max_uses: key.max_uses,
                                    current_uses: 0,
                                    expires_at: new Date(Date.now() + originalDuration).toISOString(),
                                    formation_date: key.formation_date,
                                    duration_hours: key.duration_hours,
                                    source_author: key.source_author,
                                    source_author_image: key.source_author_image,
                                    source_label: key.source_label,
                                    is_active: true,
                                  } as any);
                                  toast({ title: "Clé renouvelée", description: "Une nouvelle clé a été générée." });
                                  fetchLicenseKeys();
                                }}>
                                  <RefreshCw className="h-3 w-3 mr-1" /> Renouveler maintenant
                                </Button>
                              ) : (
                                <p className="text-sm text-muted-foreground">Automatique à l'expiration</p>
                              )}
                            </div>
                            {key.source_author && (
                              <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={key.source_author_image || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary">{key.source_author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">Source : {key.source_label && <span className="text-primary font-bold">{key.source_label}</span>} {key.source_author}</p>
                                  <p className="text-xs text-muted-foreground">Contenu original attribué à cet auteur</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseKeyManager;
