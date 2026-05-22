import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, ExternalLink, Loader2, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Row {
  id: string;
  user_id: string;
  legal_form: string;
  rne_number: string | null;
  startup_act_certificate_path: string | null;
  startup_act_application_date: string | null;
  startup_act_labeled: boolean;
  startup_act_verified: boolean;
  startup_act_verified_at: string | null;
  admin_notes: string | null;
  profile_name?: string;
  profile_email?: string;
}

/**
 * Admin panel: review Startup Act certificates and stamp them as "Vérifié ✓".
 * Shows queue of compliance records with an uploaded certificate awaiting verification.
 */
const LegalVerificationPanel = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState<Row | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("startup_legal_compliance" as any)
      .select("*")
      .order("startup_act_verified", { ascending: true })
      .order("startup_act_application_date", { ascending: false, nullsFirst: false });
    const list = ((data as unknown) as Row[]) || [];
    // Hydrate profile name/email
    const ids = list.map((r) => r.user_id);
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id,full_name")
        .in("user_id", ids);
      const map = new Map((profs || []).map((p: any) => [p.user_id, p.full_name]));
      for (const r of list) r.profile_name = map.get(r.user_id) || "(sans nom)";
    }
    setRows(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openReview = async (r: Row) => {
    setReviewing(r);
    setReviewNote(r.admin_notes || "");
    setCertUrl(null);
    if (r.startup_act_certificate_path) {
      const { data } = await supabase.storage
        .from("startup-act-certificates")
        .createSignedUrl(r.startup_act_certificate_path, 60 * 10);
      setCertUrl(data?.signedUrl || null);
    }
  };

  const verify = async (approve: boolean) => {
    if (!reviewing) return;
    setBusy(true);
    const { error } = await (supabase.from("startup_legal_compliance" as any) as any)
      .update({
        startup_act_verified: approve,
        startup_act_verified_at: approve ? new Date().toISOString() : null,
        admin_notes: reviewNote || null,
      })
      .eq("id", reviewing.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(approve ? "Attestation vérifiée ✓" : "Vérification annulée");
    setReviewing(null);
    load();
  };

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (r.profile_name || "").toLowerCase().includes(s) ||
      (r.rne_number || "").toLowerCase().includes(s)
    );
  });

  const pending = filtered.filter(
    (r) => r.startup_act_certificate_path && !r.startup_act_verified
  );
  const verified = filtered.filter((r) => r.startup_act_verified);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Vérification Startup Act
          </h2>
          <p className="text-sm text-muted-foreground">
            Valide les attestations uploadées par les fondateurs pour activer le badge or.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou RNE…"
            className="ps-9"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <>
          <Section
            title={`À vérifier (${pending.length})`}
            empty="Aucune attestation en attente 🎉"
            rows={pending}
            onReview={openReview}
            highlight
          />
          <Section
            title={`Déjà vérifiées (${verified.length})`}
            empty="Aucune startup labellisée pour l'instant."
            rows={verified}
            onReview={openReview}
          />
        </>
      )}

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vérification — {reviewing?.profile_name}</DialogTitle>
          </DialogHeader>
          {reviewing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">RNE :</span>{" "}
                  <span className="font-mono">{reviewing.rne_number || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Forme :</span> {reviewing.legal_form}
                </div>
                <div>
                  <span className="text-muted-foreground">Date dépôt :</span>{" "}
                  {reviewing.startup_act_application_date || "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Statut actuel :</span>{" "}
                  {reviewing.startup_act_verified ? (
                    <Badge className="bg-emerald-600">Vérifié</Badge>
                  ) : (
                    <Badge variant="outline">Non vérifié</Badge>
                  )}
                </div>
              </div>

              {certUrl ? (
                <div className="rounded-lg overflow-hidden border bg-muted">
                  <iframe
                    src={certUrl}
                    title="Attestation Startup Act"
                    className="w-full h-[500px]"
                  />
                  <a
                    href={certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary p-2 hover:underline"
                  >
                    Ouvrir dans un nouvel onglet <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                  Aucun certificat uploadé.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Note admin (visible par le fondateur)</label>
                <Textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Ex. Attestation conforme — Commission du 12/03/2026."
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => verify(false)}
              disabled={busy || !reviewing}
            >
              <XCircle className="h-4 w-4 me-2" /> Refuser / Retirer
            </Button>
            <Button
              onClick={() => verify(true)}
              disabled={busy || !reviewing?.startup_act_certificate_path}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 me-2" />
              )}
              Vérifier ✓
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({
  title,
  empty,
  rows,
  onReview,
  highlight,
}: {
  title: string;
  empty: string;
  rows: Row[];
  onReview: (r: Row) => void;
  highlight?: boolean;
}) => (
  <Card className={highlight ? "border-amber-300/60" : undefined}>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate flex items-center gap-2">
                  {r.profile_name}
                  {r.startup_act_verified && (
                    <Badge className="bg-emerald-600">Vérifié ✓</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{r.legal_form}</span>
                  {r.rne_number && (
                    <>
                      <span>·</span>
                      <span className="font-mono">RNE {r.rne_number}</span>
                    </>
                  )}
                  {r.startup_act_application_date && (
                    <>
                      <span>·</span>
                      <span>Dépôt {r.startup_act_application_date}</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onReview(r)}>
                <FileText className="h-3.5 w-3.5 me-1" /> Examiner
              </Button>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default LegalVerificationPanel;
