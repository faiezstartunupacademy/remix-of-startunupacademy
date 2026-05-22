import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, ScrollText, ShieldCheck, Loader2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type AccessLog = { id: string; access_type: string; resource_type: string | null; created_at: string };
type DeletionReq = { status: string; scheduled_deletion_at: string; reason: string | null };

const DataRightsCenter = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [deletionReq, setDeletionReq] = useState<DeletionReq | null>(null);
  const [delReason, setDelReason] = useState("");
  const [delDialogOpen, setDelDialogOpen] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: logsData }, { data: delData }] = await Promise.all([
      supabase.from("data_access_log").select("id, access_type, resource_type, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("account_deletion_requests").select("status, scheduled_deletion_at, reason").eq("user_id", user.id).maybeSingle(),
    ]);
    setLogs(logsData || []);
    setDeletionReq(delData && delData.status === "pending" ? delData : null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-user-data`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("Échec de l'export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `mes-donnees-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export réussi", description: "Vos données ont été téléchargées." });
      load();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  const handleRequestDeletion = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-account-deletion`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", reason: delReason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      toast({ title: "Demande enregistrée", description: "Votre compte sera supprimé dans 30 jours. Vous pouvez annuler à tout moment." });
      setDelDialogOpen(false); setDelReason("");
      load();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleCancelDeletion = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-account-deletion`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      toast({ title: "Demande annulée", description: "Votre compte est sauvegardé." });
      load();
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Mes droits & mes données</h1>
          </div>
          <p className="text-muted-foreground mb-8">Conforme RGPD (UE) & loi tunisienne n°2004-63 (INPDP). Vous gardez le contrôle total sur vos données personnelles.</p>

          {deletionReq && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demande de suppression en cours</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Votre compte sera supprimé le <strong>{new Date(deletionReq.scheduled_deletion_at).toLocaleDateString("fr-FR")}</strong>.</p>
                <Button size="sm" variant="outline" onClick={handleCancelDeletion} disabled={loading}>Annuler la demande</Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Export */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Download className="h-5 w-5 text-primary" /><CardTitle>Télécharger mes données</CardTitle></div>
                <CardDescription>Récupérez l'ensemble de vos données au format JSON (droit à la portabilité, RGPD art. 20).</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExport} disabled={exporting} className="w-full">
                  {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Download className="h-4 w-4 mr-2" /> Exporter mes données</>}
                </Button>
              </CardContent>
            </Card>

            {/* Suppression */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Trash2 className="h-5 w-5 text-destructive" /><CardTitle>Supprimer mon compte</CardTitle></div>
                <CardDescription>Délai de grâce de 30 jours. Vous pouvez annuler à tout moment avant la suppression effective.</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={delDialogOpen} onOpenChange={setDelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={!!deletionReq}>
                      <Trash2 className="h-4 w-4 mr-2" /> Demander la suppression
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la suppression de compte</DialogTitle>
                      <DialogDescription>Votre compte sera désactivé immédiatement et toutes vos données effacées définitivement dans 30 jours.</DialogDescription>
                    </DialogHeader>
                    <Textarea placeholder="Motif (facultatif, nous aide à nous améliorer)" value={delReason} onChange={(e) => setDelReason(e.target.value)} />
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setDelDialogOpen(false)}>Annuler</Button>
                      <Button variant="destructive" onClick={handleRequestDeletion} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Rétention */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent" /><CardTitle>Durée de conservation</CardTitle></div>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>• <strong>Données de profil</strong> : conservées tant que votre compte est actif.</p>
                <p>• <strong>Données de projet/incubation</strong> : conservées 5 ans après dernière activité (obligations comptables).</p>
                <p>• <strong>Journaux d'accès</strong> : conservés 1 an (sécurité).</p>
                <p>• <strong>Données de consentement</strong> : conservées 3 ans après retrait (preuve INPDP).</p>
              </CardContent>
            </Card>

            {/* Journal d'accès */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2"><ScrollText className="h-5 w-5 text-primary" /><CardTitle>Journal d'accès à mes données</CardTitle></div>
                <CardDescription>Les 50 derniers accès enregistrés.</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun accès enregistré.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {logs.map(l => (
                      <div key={l.id} className="flex items-center justify-between text-sm border-b border-border/40 pb-2">
                        <div>
                          <Badge variant="outline" className="mr-2">{l.access_type}</Badge>
                          <span className="text-muted-foreground">{l.resource_type || "—"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("fr-FR")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DataRightsCenter;
