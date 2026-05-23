import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Trash2, Link2, Eye, Shield, Download, Lock, Copy } from "lucide-react";
import { format } from "date-fns";
import DealsPipeline from "@/components/deal-room/DealsPipeline";
import InvestorInterests from "@/components/deal-room/InvestorInterests";

const CATEGORIES = [
  { id: "financials", label: "📊 Financials", desc: "Business plan, projections, cap table" },
  { id: "legal", label: "⚖️ Legal", desc: "Statuts, Startup Act, brevets" },
  { id: "pitch", label: "🎯 Pitch", desc: "Deck, demo, one-pager" },
  { id: "team", label: "👥 Team", desc: "CVs, org chart" },
  { id: "traction", label: "📈 Traction", desc: "Métriques, LOI" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  complete: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  verified: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const VISIBILITY_LABEL: Record<string, string> = {
  private: "🔒 Privé",
  program: "🏛️ Programme",
  investor: "💼 Investisseur",
};

export default function DealRoomPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState("financials");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [accessLog, setAccessLog] = useState<any[]>([]);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareExpiry, setShareExpiry] = useState("");
  const [sharePassword, setSharePassword] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/auth"); return; }
      setUserId(data.user.id);
      load(data.user.id);
    });
  }, [navigate]);

  async function load(uid: string) {
    const { data } = await supabase
      .from("deal_room_documents")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setDocs(data || []);
    setLoading(false);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !userId) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${userId}/${activeCat}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("deal-room-documents")
        .upload(path, file, { contentType: file.type });
      if (upErr) { toast.error(`Échec upload ${file.name}`); continue; }
      const { error: dbErr } = await supabase.from("deal_room_documents").insert({
        user_id: userId,
        category: activeCat,
        name: file.name,
        file_path: path,
        file_size: file.size,
        mime_type: file.type,
      });
      if (dbErr) { toast.error("Erreur enregistrement"); }
    }
    setUploading(false);
    toast.success("Document(s) ajouté(s)");
    load(userId);
  }

  async function updateDoc(id: string, patch: any) {
    const { error } = await supabase.from("deal_room_documents").update(patch).eq("id", id);
    if (error) { toast.error("Erreur mise à jour"); return; }
    if (userId) load(userId);
  }

  async function deleteDoc(doc: any) {
    if (!confirm(`Supprimer ${doc.name} ?`)) return;
    await supabase.storage.from("deal-room-documents").remove([doc.file_path]);
    await supabase.from("deal_room_documents").delete().eq("id", doc.id);
    toast.success("Supprimé");
    if (userId) load(userId);
  }

  async function openDoc(doc: any) {
    const { data, error } = await supabase.storage
      .from("deal-room-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) { toast.error("Lien signé impossible"); return; }
    // Log own access
    if (userId) {
      await supabase.from("deal_room_access_log").insert({
        document_id: doc.id, viewer_id: userId, action: "view",
      });
    }
    window.open(data.signedUrl, "_blank");
  }

  async function viewAccessLog(doc: any) {
    setSelectedDoc(doc);
    const { data } = await supabase
      .from("deal_room_access_log")
      .select("*")
      .eq("document_id", doc.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setAccessLog(data || []);
    setShowAccessLog(true);
  }

  async function generateShareLink(doc: any) {
    if (!userId) return;
    const token = crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2, 10);
    const expires = shareExpiry ? new Date(shareExpiry).toISOString() : null;
    // Hash password client-side (light SHA-256, server-side validation would be better via edge fn)
    let passwordHash: string | null = null;
    if (sharePassword) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sharePassword));
      passwordHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    const { error } = await supabase.from("deal_room_share_links").insert({
      document_id: doc.id, token, password_hash: passwordHash, expires_at: expires, created_by: userId,
    });
    if (error) { toast.error("Erreur génération lien"); return; }
    const url = `${window.location.origin}/deal-room/share/${token}`;
    setShareLink(url);
  }

  const catDocs = docs.filter(d => d.category === activeCat);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Deal Room sécurisé
            </h1>
            <p className="text-sm text-muted-foreground">Gérez vos documents confidentiels — conforme INPDP 🇹🇳</p>
          </div>
          <Badge variant="outline" className="gap-1"><Lock className="w-3 h-3" /> Stockage chiffré · URLs signées</Badge>
        </div>
      </header>

      <Tabs defaultValue="documents" className="px-6 pt-4">
        <TabsList>
          <TabsTrigger value="documents">📁 Documents</TabsTrigger>
          <TabsTrigger value="pipeline">📊 Deals & Pipeline</TabsTrigger>
          <TabsTrigger value="investors">💼 Investisseurs</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          {userId && <DealsPipeline userId={userId} />}
        </TabsContent>

        <TabsContent value="investors" className="mt-4">
          {userId && <InvestorInterests userId={userId} />}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
      <div className="flex">
        <aside className="w-64 border-r border-border min-h-[calc(100vh-89px)] p-4 space-y-1">
          {CATEGORIES.map(c => {
            const count = docs.filter(d => d.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition ${activeCat === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{c.label}</span>
                  <Badge variant={activeCat === c.id ? "secondary" : "outline"} className="text-xs">{count}</Badge>
                </div>
                <div className={`text-xs mt-0.5 ${activeCat === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.desc}</div>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-6">
          {/* Upload zone */}
          <Card
            className="border-2 border-dashed p-8 mb-6 text-center cursor-pointer hover:border-primary transition"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium">{uploading ? "Upload en cours…" : "Glissez-déposez ou cliquez pour uploader"}</p>
            <p className="text-xs text-muted-foreground mt-1">Catégorie : {CATEGORIES.find(c => c.id === activeCat)?.label}</p>
            <input ref={fileRef} type="file" hidden multiple onChange={(e) => handleFiles(e.target.files)} />
          </Card>

          {/* Doc grid */}
          {loading ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : catDocs.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun document dans cette catégorie.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catDocs.map(doc => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText className="w-8 h-8 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <button onClick={() => openDoc(doc)} className="font-medium hover:underline text-left truncate block w-full">{doc.name}</button>
                        <p className="text-xs text-muted-foreground">{(doc.file_size / 1024).toFixed(0)} KB · {format(new Date(doc.created_at), "dd/MM/yyyy")}</p>
                      </div>
                    </div>
                    <Badge className={STATUS_COLORS[doc.status]}>{doc.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <Label className="text-xs">Visibilité</Label>
                      <Select value={doc.visibility} onValueChange={(v) => updateDoc(doc.id, { visibility: v })}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">{VISIBILITY_LABEL.private}</SelectItem>
                          <SelectItem value="program">{VISIBILITY_LABEL.program}</SelectItem>
                          <SelectItem value="investor">{VISIBILITY_LABEL.investor}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Statut</Label>
                      <Select value={doc.status} onValueChange={(v) => updateDoc(doc.id, { status: v })}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="complete">Complet</SelectItem>
                          <SelectItem value="verified">Vérifié</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`dl-${doc.id}`} className="text-xs">Téléchargement autorisé</Label>
                      <Switch id={`dl-${doc.id}`} checked={doc.allow_download} onCheckedChange={(c) => updateDoc(doc.id, { allow_download: c })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`nda-${doc.id}`} className="text-xs">NDA requis</Label>
                      <Switch id={`nda-${doc.id}`} checked={doc.nda_required} onCheckedChange={(c) => updateDoc(doc.id, { nda_required: c })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`wm-${doc.id}`} className="text-xs">Watermark</Label>
                      <Switch id={`wm-${doc.id}`} checked={doc.watermark_enabled} onCheckedChange={(c) => updateDoc(doc.id, { watermark_enabled: c })} />
                    </div>
                    <div>
                      <Label htmlFor={`exp-${doc.id}`} className="text-xs">Expire le</Label>
                      <Input id={`exp-${doc.id}`} type="date" className="h-8"
                        value={doc.expires_at ? doc.expires_at.slice(0, 10) : ""}
                        onChange={(e) => updateDoc(doc.id, { expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openDoc(doc)}><Eye className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="outline" onClick={() => viewAccessLog(doc)} title="Qui a consulté"><Shield className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedDoc(doc); setShareLink(null); setSharePassword(""); setShareExpiry(""); }}><Link2 className="w-3.5 h-3.5" /></Button>
                    {doc.allow_download && <Button size="sm" variant="outline" onClick={() => openDoc(doc)}><Download className="w-3.5 h-3.5" /></Button>}
                    <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => deleteDoc(doc)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
        </TabsContent>
      </Tabs>



      {/* Access log modal */}
      <Dialog open={showAccessLog} onOpenChange={setShowAccessLog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Qui a consulté mon dossier — {selectedDoc?.name}</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {accessLog.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun accès enregistré.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr><th className="py-2">Date</th><th>Viewer</th><th>Action</th><th>IP</th></tr>
                </thead>
                <tbody>
                  {accessLog.map(l => (
                    <tr key={l.id} className="border-t border-border">
                      <td className="py-2">{format(new Date(l.created_at), "dd/MM/yyyy HH:mm")}</td>
                      <td>{l.viewer_email || l.viewer_id?.slice(0, 8) || "Anonyme"}</td>
                      <td><Badge variant="outline">{l.action}</Badge></td>
                      <td className="text-xs">{l.ip_address || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share link modal */}
      <Dialog open={!!selectedDoc && !showAccessLog} onOpenChange={(o) => !o && setSelectedDoc(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Générer un lien de partage</DialogTitle></DialogHeader>
          {!shareLink ? (
            <div className="space-y-3">
              <div>
                <Label>Mot de passe (optionnel)</Label>
                <Input type="password" value={sharePassword} onChange={(e) => setSharePassword(e.target.value)} placeholder="Laisser vide pour sans mot de passe" />
              </div>
              <div>
                <Label>Expire le (optionnel)</Label>
                <Input type="date" value={shareExpiry} onChange={(e) => setShareExpiry(e.target.value)} />
              </div>
              <DialogFooter>
                <Button onClick={() => selectedDoc && generateShareLink(selectedDoc)}>Générer le lien</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Lien partageable (2 clics pour copier)</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly />
                <Button onClick={() => { navigator.clipboard.writeText(shareLink); toast.success("Copié !"); }}><Copy className="w-4 h-4" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">Tous les accès via ce lien seront tracés dans le journal d'audit.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
