import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Plus, Trash2, Send, Loader2, CheckCircle2, XCircle,
  AlertTriangle, Wifi, WifiOff, Code, ChevronDown, ChevronUp,
  Clock, Shield, Database, CreditCard, Mail, Plug
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Integration = {
  id: string; project_id: string; service_name: string;
  integration_type: string; base_url: string | null;
  connection_status: string; criticality: string;
  last_tested_at: string | null; notes: string | null;
};

type ApiLog = {
  id: string; integration_id: string; method: string; url: string;
  request_headers: any; request_body: string | null;
  response_status: number | null; response_time_ms: number | null;
  response_body: string | null; created_at: string;
};

type ChecklistItem = {
  id: string; category: string; label: string;
  is_checked: boolean; checked_at: string | null;
};

type Props = { projectId: string };

const INTEGRATION_TYPES = [
  { value: "authentification", label: "Authentification", icon: Shield },
  { value: "paiement", label: "Paiement", icon: CreditCard },
  { value: "stockage", label: "Stockage", icon: Database },
  { value: "communication", label: "Communication", icon: Mail },
  { value: "api_metier", label: "API métier", icon: Plug },
  { value: "autre", label: "Autre", icon: Network },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  not_tested: { label: "Non testé", color: "text-muted-foreground", icon: Clock },
  connected: { label: "Connecté", color: "text-emerald-500", icon: Wifi },
  error: { label: "Erreur", color: "text-red-500", icon: WifiOff },
};

const CRITICALITY_MAP: Record<string, { label: string; color: string }> = {
  bloquant: { label: "Bloquant", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
  important: { label: "Important", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  nice_to_have: { label: "Nice-to-have", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
};

const DEFAULT_CHECKLIST: Record<string, string[]> = {
  "Authentification": [
    "Inscription par email fonctionne",
    "Login/logout complet sans erreur",
    "Token JWT valide et rafraîchi correctement",
    "Gestion session expirée (redirect login)",
    "Mots de passe hashés (jamais en clair)",
  ],
  "Base de données": [
    "CRUD complet sur toutes les tables principales",
    "Row Level Security (RLS) bloque les accès non autorisés",
    "Requêtes retournent les données correctes",
    "Gestion des contraintes (unicité, foreign keys)",
  ],
  "Paiement": [
    "Flux paiement complet en mode sandbox/test",
    "Webhook de confirmation reçu et traité",
    "Gestion des erreurs paiement (carte refusée, timeout)",
    "Montants corrects en devise locale (TND)",
  ],
  "Services tiers": [
    "Envoi email fonctionne (vérifier délivrabilité)",
    "Envoi SMS fonctionne (numéros +216)",
    "Upload fichiers fonctionne (Storage)",
    "APIs tierces répondent dans les délais acceptables (< 2s)",
  ],
};

const TechIntegrationLab = ({ projectId }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInteg, setNewInteg] = useState({ service_name: "", integration_type: "api_metier", base_url: "", criticality: "important", notes: "" });
  const [saving, setSaving] = useState(false);

  // API Tester state
  const [selectedInteg, setSelectedInteg] = useState<Integration | null>(null);
  const [apiForm, setApiForm] = useState({ method: "GET", url: "", headers: "", body: "" });
  const [apiResponse, setApiResponse] = useState<{ status: number; time: number; body: string } | null>(null);
  const [apiTesting, setApiTesting] = useState(false);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Authentification");

  useEffect(() => { loadData(); }, [projectId]);

  const loadData = async () => {
    const [{ data: integsData }, { data: checkData }] = await Promise.all([
      supabase.from("tech_integrations" as any).select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      supabase.from("tech_checklist_items" as any).select("*").eq("project_id", projectId),
    ]);
    if (integsData) setIntegrations(integsData as any[]);
    if (checkData) setChecklist(checkData as any[]);
    setLoading(false);
  };

  const initChecklist = async () => {
    if (!user) return;
    const items: any[] = [];
    Object.entries(DEFAULT_CHECKLIST).forEach(([category, labels]) => {
      labels.forEach(label => {
        if (!checklist.find(c => c.category === category && c.label === label)) {
          items.push({ project_id: projectId, category, label, is_checked: false, user_id: user.id });
        }
      });
    });
    if (items.length > 0) {
      await supabase.from("tech_checklist_items" as any).insert(items as any);
      await loadData();
      toast({ title: `${items.length} items de checklist ajoutés` });
    }
  };

  const addIntegration = async () => {
    if (!user || !newInteg.service_name.trim()) return;
    setSaving(true);
    await supabase.from("tech_integrations" as any).insert({
      project_id: projectId, user_id: user.id,
      service_name: newInteg.service_name.trim(),
      integration_type: newInteg.integration_type,
      base_url: newInteg.base_url.trim() || null,
      criticality: newInteg.criticality,
      notes: newInteg.notes.trim() || null,
    } as any);
    setNewInteg({ service_name: "", integration_type: "api_metier", base_url: "", criticality: "important", notes: "" });
    setShowAddDialog(false);
    setSaving(false);
    await loadData();
    toast({ title: "Intégration ajoutée !" });
  };

  const deleteIntegration = async (id: string) => {
    await supabase.from("tech_integrations" as any).delete().eq("id", id);
    setIntegrations(prev => prev.filter(i => i.id !== id));
    toast({ title: "Intégration supprimée" });
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("tech_integrations" as any).update({ connection_status: status, last_tested_at: new Date().toISOString() } as any).eq("id", id);
    await loadData();
  };

  const sendApiRequest = async () => {
    if (!selectedInteg || !apiForm.url.trim()) return;
    setApiTesting(true);
    setApiResponse(null);
    const start = Date.now();
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiForm.headers.trim()) {
        try {
          const parsed = JSON.parse(apiForm.headers);
          Object.assign(headers, parsed);
        } catch { /* ignore parse errors */ }
      }
      const opts: RequestInit = { method: apiForm.method, headers };
      if (apiForm.method !== "GET" && apiForm.body.trim()) opts.body = apiForm.body;
      
      const res = await fetch(apiForm.url, opts);
      const time = Date.now() - start;
      let body = "";
      try { body = await res.text(); } catch { body = "[Impossible de lire la réponse]"; }
      
      setApiResponse({ status: res.status, time, body });

      // Save log
      if (user) {
        await supabase.from("api_test_logs" as any).insert({
          integration_id: selectedInteg.id,
          method: apiForm.method, url: apiForm.url,
          request_headers: headers,
          request_body: apiForm.body || null,
          response_status: res.status, response_time_ms: time,
          response_body: body.substring(0, 5000),
          tested_by: user.id,
        } as any);
      }

      // Update integration status
      await updateStatus(selectedInteg.id, res.ok ? "connected" : "error");
    } catch (err: any) {
      const time = Date.now() - start;
      setApiResponse({ status: 0, time, body: `Erreur: ${err.message}` });
      await updateStatus(selectedInteg.id, "error");
    }
    setApiTesting(false);
  };

  const loadApiLogs = async (integId: string) => {
    const { data } = await supabase.from("api_test_logs" as any).select("*").eq("integration_id", integId).order("created_at", { ascending: false }).limit(10);
    if (data) setApiLogs(data as any[]);
  };

  const toggleCheckItem = async (item: ChecklistItem) => {
    const newChecked = !item.is_checked;
    await supabase.from("tech_checklist_items" as any).update({
      is_checked: newChecked,
      checked_by: newChecked ? user?.id : null,
      checked_at: newChecked ? new Date().toISOString() : null,
    } as any).eq("id", item.id);
    setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, is_checked: newChecked, checked_at: newChecked ? new Date().toISOString() : null } : c));
  };

  const getTypeIcon = (type: string) => {
    const found = INTEGRATION_TYPES.find(t => t.value === type);
    return found ? found.icon : Network;
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const checklistCategories = [...new Set(checklist.map(c => c.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Tests d'Intégration</h3>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory" className="gap-2"><Plug className="h-4 w-4" />Inventaire</TabsTrigger>
          <TabsTrigger value="api-tester" className="gap-2"><Code className="h-4 w-4" />Testeur API</TabsTrigger>
          <TabsTrigger value="checklist" className="gap-2"><CheckCircle2 className="h-4 w-4" />Checklist</TabsTrigger>
        </TabsList>

        {/* ===== INVENTORY TAB ===== */}
        <TabsContent value="inventory">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{integrations.length} intégrations répertoriées</p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2"><Plus className="h-4 w-4" />Ajouter</Button>
            </div>

            {integrations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Network className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground mb-3">Aucune intégration répertoriée</p>
                  <Button onClick={() => setShowAddDialog(true)} variant="outline" className="gap-2"><Plus className="h-4 w-4" />Ajouter une intégration</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {integrations.map(integ => {
                  const TypeIcon = getTypeIcon(integ.integration_type);
                  const status = STATUS_MAP[integ.connection_status] || STATUS_MAP.not_tested;
                  const StatusIcon = status.icon;
                  const crit = CRITICALITY_MAP[integ.criticality] || CRITICALITY_MAP.important;
                  return (
                    <motion.div key={integ.id} whileHover={{ scale: 1.01 }}>
                      <Card className={`transition-all ${integ.connection_status === "connected" ? "border-emerald-300 dark:border-emerald-800" : integ.connection_status === "error" ? "border-red-300 dark:border-red-800" : ""}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10"><TypeIcon className="h-5 w-5 text-primary" /></div>
                              <div>
                                <h5 className="font-semibold">{integ.service_name}</h5>
                                {integ.base_url && <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{integ.base_url}</p>}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteIntegration(integ.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2 flex-wrap mt-3">
                            <Badge variant="outline" className="gap-1 text-xs"><StatusIcon className={`h-3 w-3 ${status.color}`} />{status.label}</Badge>
                            <Badge className={`text-xs ${crit.color}`}>{crit.label}</Badge>
                            <Badge variant="secondary" className="text-xs">{INTEGRATION_TYPES.find(t => t.value === integ.integration_type)?.label}</Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => updateStatus(integ.id, "connected")} className="text-xs gap-1">
                              <Wifi className="h-3 w-3" />Connecté
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(integ.id, "error")} className="text-xs gap-1">
                              <WifiOff className="h-3 w-3" />Erreur
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { setSelectedInteg(integ); setApiForm(f => ({ ...f, url: integ.base_url || "" })); loadApiLogs(integ.id); }} className="text-xs gap-1">
                              <Code className="h-3 w-3" />Tester
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ===== API TESTER TAB ===== */}
        <TabsContent value="api-tester">
          <div className="space-y-4">
            {integrations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Code className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">Ajoutez d'abord une intégration dans l'inventaire</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Sélectionner une intégration</Label>
                  <Select value={selectedInteg?.id || ""} onValueChange={v => {
                    const found = integrations.find(i => i.id === v);
                    if (found) { setSelectedInteg(found); setApiForm(f => ({ ...f, url: found.base_url || "" })); loadApiLogs(found.id); }
                  }}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {integrations.map(i => <SelectItem key={i.id} value={i.id}>{i.service_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {selectedInteg && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Code className="h-4 w-4" />Mini Client API — {selectedInteg.service_name}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={apiForm.method} onValueChange={v => setApiForm(f => ({ ...f, method: v }))}>
                          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["GET", "POST", "PUT", "DELETE", "PATCH"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input className="font-mono text-sm" placeholder="https://api.example.com/endpoint" value={apiForm.url} onChange={e => setApiForm(f => ({ ...f, url: e.target.value }))} />
                        <Button onClick={sendApiRequest} disabled={apiTesting || !apiForm.url.trim()} className="gap-2">
                          {apiTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Envoyer
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Headers (JSON)</Label>
                          <Textarea className="font-mono text-xs h-20" placeholder='{"Authorization": "Bearer ..."}' value={apiForm.headers} onChange={e => setApiForm(f => ({ ...f, headers: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Body (JSON)</Label>
                          <Textarea className="font-mono text-xs h-20" placeholder='{"key": "value"}' value={apiForm.body} onChange={e => setApiForm(f => ({ ...f, body: e.target.value }))} />
                        </div>
                      </div>

                      {apiResponse && (
                        <div className="rounded-lg bg-slate-950 p-4 space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge className={apiResponse.status >= 200 && apiResponse.status < 300 ? "bg-emerald-500" : apiResponse.status >= 400 ? "bg-red-500" : "bg-amber-500"}>
                              {apiResponse.status || "ERR"}
                            </Badge>
                            <span className="text-xs text-slate-400">{apiResponse.time}ms</span>
                          </div>
                          <pre className="text-xs text-slate-300 overflow-auto max-h-64 whitespace-pre-wrap">
                            {(() => {
                              try { return JSON.stringify(JSON.parse(apiResponse.body), null, 2); } catch { return apiResponse.body; }
                            })()}
                          </pre>
                        </div>
                      )}

                      {/* API Logs */}
                      {apiLogs.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Historique récent</h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {apiLogs.map(log => (
                              <div key={log.id} className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded">
                                <Badge variant="outline" className="text-[10px]">{log.method}</Badge>
                                <span className={`font-mono ${log.response_status && log.response_status < 300 ? "text-emerald-500" : "text-red-500"}`}>{log.response_status || "ERR"}</span>
                                <span className="text-muted-foreground">{log.response_time_ms}ms</span>
                                <span className="text-muted-foreground truncate flex-1">{log.url}</span>
                                <span className="text-muted-foreground">{new Date(log.created_at).toLocaleTimeString("fr-FR")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* ===== CHECKLIST TAB ===== */}
        <TabsContent value="checklist">
          <div className="space-y-4">
            {checklist.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground mb-4">Initialisez la checklist d'intégration prédéfinie</p>
                  <Button onClick={initChecklist} className="gap-2"><Plus className="h-4 w-4" />Initialiser la checklist</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {Object.keys(DEFAULT_CHECKLIST).map(category => {
                  const items = checklist.filter(c => c.category === category);
                  if (items.length === 0) return null;
                  const checked = items.filter(i => i.is_checked).length;
                  const isExpanded = expandedCategory === category;
                  const CategoryIcon = category === "Authentification" ? Shield : category === "Base de données" ? Database : category === "Paiement" ? CreditCard : Mail;
                  return (
                    <Collapsible key={category} open={isExpanded} onOpenChange={() => setExpandedCategory(isExpanded ? null : category)}>
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:border-primary/30 transition-all">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CategoryIcon className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{category}</span>
                                <Badge variant={checked === items.length ? "default" : "secondary"} className={checked === items.length ? "bg-emerald-500" : ""}>
                                  {checked}/{items.length}
                                </Badge>
                              </div>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-primary/20 pl-4">
                          {items.map(item => (
                            <motion.div
                              key={item.id}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${item.is_checked ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-muted/30"}`}
                              animate={item.is_checked ? { scale: [1, 1.02, 1] } : {}}
                            >
                              <Checkbox checked={item.is_checked} onCheckedChange={() => toggleCheckItem(item)} />
                              <span className={`text-sm flex-1 ${item.is_checked ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
                              {item.is_checked && item.checked_at && (
                                <span className="text-[10px] text-muted-foreground">{new Date(item.checked_at).toLocaleDateString("fr-FR")}</span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Integration Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle intégration</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du service *</Label>
              <Input placeholder="Ex: Supabase Auth, Stripe, API SMS..." value={newInteg.service_name} onChange={e => setNewInteg(p => ({ ...p, service_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newInteg.integration_type} onValueChange={v => setNewInteg(p => ({ ...p, integration_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INTEGRATION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Criticité</Label>
                <Select value={newInteg.criticality} onValueChange={v => setNewInteg(p => ({ ...p, criticality: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bloquant">🔴 Bloquant</SelectItem>
                    <SelectItem value="important">🟡 Important</SelectItem>
                    <SelectItem value="nice_to_have">🔵 Nice-to-have</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL endpoint de base</Label>
              <Input className="font-mono text-sm" placeholder="https://api.example.com" value={newInteg.base_url} onChange={e => setNewInteg(p => ({ ...p, base_url: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Informations additionnelles..." value={newInteg.notes} onChange={e => setNewInteg(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <Button onClick={addIntegration} disabled={saving || !newInteg.service_name.trim()} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechIntegrationLab;
