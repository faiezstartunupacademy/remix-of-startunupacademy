import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Save, Upload, ShieldCheck, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StartupActBadge from "@/components/legal/StartupActBadge";
import StartupActGuideModal from "@/components/legal/StartupActGuideModal";

type LegalForm = "personne_physique" | "suarl" | "sarl" | "sa" | "en_creation";

interface Row {
  id?: string;
  user_id: string;
  legal_form: LegalForm;
  rne_number: string | null;
  rne_date: string | null;
  tribunal_greffe: string | null;
  rne_registered: boolean;
  patente_obtained: boolean;
  bank_account_pro: boolean;
  startup_act_labeled: boolean;
  cnss_declared: boolean;
  startup_act_certificate_path: string | null;
  startup_act_application_date: string | null;
  startup_act_verified: boolean;
  startup_act_verified_at: string | null;
  admin_notes: string | null;
}

const CHECKLIST: Array<[keyof Row, string]> = [
  ["rne_registered", "Immatriculé au RNE"],
  ["patente_obtained", "Patente obtenue"],
  ["bank_account_pro", "Compte bancaire professionnel"],
  ["startup_act_labeled", "Labellisé Startup Act"],
  ["cnss_declared", "CNSS déclarée"],
];

const LegalCompliancePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("startup_legal_compliance" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setRow((data as unknown) as Row);
      } else {
        setRow({
          user_id: user.id,
          legal_form: "en_creation",
          rne_number: null,
          rne_date: null,
          tribunal_greffe: null,
          rne_registered: false,
          patente_obtained: false,
          bank_account_pro: false,
          startup_act_labeled: false,
          cnss_declared: false,
          startup_act_certificate_path: null,
          startup_act_application_date: null,
          startup_act_verified: false,
          startup_act_verified_at: null,
          admin_notes: null,
        });
      }
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  const set = <K extends keyof Row>(k: K, v: Row[K]) =>
    setRow((r) => (r ? { ...r, [k]: v } : r));

  const checked = row ? CHECKLIST.filter(([k]) => row[k]).length : 0;
  const pct = Math.round((checked / CHECKLIST.length) * 100);

  const handleSave = async () => {
    if (!row || !user) return;
    setSaving(true);
    const { id, startup_act_verified, startup_act_verified_at, admin_notes, ...rest } = row;
    const payload = { ...rest, user_id: user.id };
    const { error } = await (supabase.from("startup_legal_compliance" as any) as any).upsert(payload, {
      onConflict: "user_id",
    });
    setSaving(false);
    if (error) {
      toast.error("Erreur d'enregistrement : " + error.message);
    } else {
      toast.success("Enregistré ✓");
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 10 Mo)");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${user.id}/startup-act-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("startup-act-certificates")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      toast.error("Échec upload : " + upErr.message);
      return;
    }
    await (supabase.from("startup_legal_compliance" as any) as any).upsert(
      {
        user_id: user.id,
        startup_act_certificate_path: path,
        startup_act_application_date: new Date().toISOString().slice(0, 10),
        startup_act_labeled: true,
      },
      { onConflict: "user_id" }
    );
    setRow((r) =>
      r
        ? {
            ...r,
            startup_act_certificate_path: path,
            startup_act_application_date: new Date().toISOString().slice(0, 10),
            startup_act_labeled: true,
          }
        : r
    );
    setUploading(false);
    toast.success("Attestation reçue. Un admin la vérifie sous 72h.");
  };

  if (loading || !row) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 space-y-4">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" /> Ma Conformité Légale
            </h1>
            <p className="text-muted-foreground mt-1">
              Sécurise ton statut juridique et valorise ton label Startup Act auprès des investisseurs.
            </p>
          </div>
          <StartupActBadge verified={row.startup_act_verified} size="md" />
        </motion.div>

        {/* Forme juridique + RNE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Statut juridique
            </CardTitle>
            <CardDescription>
              Informations affichées sur ton profil public investisseur.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="legal_form">Forme juridique *</Label>
              <Select
                value={row.legal_form}
                onValueChange={(v: LegalForm) => set("legal_form", v)}
              >
                <SelectTrigger id="legal_form">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_creation">En cours de création</SelectItem>
                  <SelectItem value="personne_physique">Personne Physique</SelectItem>
                  <SelectItem value="suarl">SUARL</SelectItem>
                  <SelectItem value="sarl">SARL</SelectItem>
                  <SelectItem value="sa">SA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rne_number">Numéro RNE</Label>
              <Input
                id="rne_number"
                value={row.rne_number || ""}
                onChange={(e) => set("rne_number", e.target.value || null)}
                placeholder="Ex. B0123456789"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rne_date">Date d'immatriculation</Label>
              <Input
                id="rne_date"
                type="date"
                value={row.rne_date || ""}
                onChange={(e) => set("rne_date", e.target.value || null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tribunal_greffe">Greffe du Tribunal</Label>
              <Input
                id="tribunal_greffe"
                value={row.tribunal_greffe || ""}
                onChange={(e) => set("tribunal_greffe", e.target.value || null)}
                placeholder="Ex. Tribunal de Tunis"
              />
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist — Ma Conformité Légale</CardTitle>
            <CardDescription>
              Coche ce qui est déjà fait. Plus la maturité est élevée, plus tu rassures les investisseurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-medium mb-2">
                <span>Maturité légale</span>
                <span className="text-muted-foreground">
                  {checked}/{CHECKLIST.length} · {pct}%
                </span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
            <ul className="space-y-2">
              {CHECKLIST.map(([k, label]) => (
                <li key={k} className="flex items-center gap-3 rounded-md hover:bg-muted/40 p-2 transition-colors">
                  <Checkbox
                    id={String(k)}
                    checked={row[k] as boolean}
                    onCheckedChange={(v) => set(k, Boolean(v) as any)}
                  />
                  <Label htmlFor={String(k)} className="cursor-pointer flex-1 font-normal">
                    {label}
                  </Label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Startup Act */}
        <Card className="border-amber-300/40 dark:border-amber-700/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span aria-hidden>🏅</span> Label Startup Act
            </CardTitle>
            <CardDescription>
              Importe ton attestation pour activer le badge or sur ton profil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800/50 p-4 text-sm space-y-2">
              <div className="font-semibold text-amber-900 dark:text-amber-300">Avantages du label</div>
              <ul className="space-y-1 text-amber-800 dark:text-amber-200/80">
                <li>→ Exonération fiscale totale pendant 8 ans</li>
                <li>→ Compte en devises autorisé</li>
                <li>→ Couverture sociale des fondateurs par l'État</li>
              </ul>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline inline-flex items-center gap-1 pt-1"
              >
                Comment l'obtenir ? <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <input
                  id="cert-file"
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
                <Button asChild variant="outline" disabled={uploading}>
                  <label htmlFor="cert-file" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin me-2" />
                    ) : (
                      <Upload className="h-4 w-4 me-2" />
                    )}
                    {row.startup_act_certificate_path
                      ? "Remplacer l'attestation"
                      : "Uploader l'attestation (PDF/image)"}
                  </label>
                </Button>
              </div>
              {row.startup_act_certificate_path && !row.startup_act_verified && (
                <Badge variant="outline" className="gap-1 text-amber-700">
                  <Loader2 className="h-3 w-3 animate-spin" /> En attente de vérification admin
                </Badge>
              )}
              {row.startup_act_verified && (
                <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Attestation vérifiée ✓
                </Badge>
              )}
            </div>

            {row.admin_notes && (
              <div className="text-xs bg-muted rounded-md p-3 border">
                <span className="font-semibold">Note admin :</span> {row.admin_notes}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="sticky bottom-20 md:bottom-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg" className="shadow-lg">
            {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
            Enregistrer
          </Button>
        </div>
      </main>

      <StartupActGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
};

export default LegalCompliancePage;
