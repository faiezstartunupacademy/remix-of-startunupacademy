import { useEffect, useState } from "react";
import { Building2, ShieldCheck, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StartupActBadge from "./StartupActBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  userId: string;
  /** Compact = startup detail header. Full = profile page. */
  variant?: "compact" | "full";
}

const FORM_LABELS: Record<string, string> = {
  personne_physique: "Personne Physique",
  suarl: "SUARL",
  sarl: "SARL",
  sa: "SA",
  en_creation: "En cours de création",
};

const CHECKLIST_LABELS: Array<[keyof Row, string]> = [
  ["rne_registered", "Immatriculé au RNE"],
  ["patente_obtained", "Patente obtenue"],
  ["bank_account_pro", "Compte bancaire professionnel"],
  ["startup_act_labeled", "Labellisé Startup Act"],
  ["cnss_declared", "CNSS déclarée"],
];

type Row = {
  legal_form: string;
  rne_number: string | null;
  rne_date: string | null;
  tribunal_greffe: string | null;
  rne_registered: boolean;
  patente_obtained: boolean;
  bank_account_pro: boolean;
  startup_act_labeled: boolean;
  cnss_declared: boolean;
  startup_act_verified: boolean;
};

const LegalStatusCard = ({ userId, variant = "full" }: Props) => {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("startup_legal_compliance" as any)
        .select(
          "legal_form,rne_number,rne_date,tribunal_greffe,rne_registered,patente_obtained,bank_account_pro,startup_act_labeled,cnss_declared,startup_act_verified"
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled) {
        setRow((data as Row) || null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }

  const data = row || {
    legal_form: "en_creation",
    rne_number: null,
    rne_date: null,
    tribunal_greffe: null,
    rne_registered: false,
    patente_obtained: false,
    bank_account_pro: false,
    startup_act_labeled: false,
    cnss_declared: false,
    startup_act_verified: false,
  };

  const checked = CHECKLIST_LABELS.filter(([k]) => data[k]).length;
  const total = CHECKLIST_LABELS.length;
  const pct = Math.round((checked / total) * 100);

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Building2 className="h-3 w-3" />
          {FORM_LABELS[data.legal_form] || data.legal_form}
        </Badge>
        {data.rne_number && (
          <Badge variant="outline" className="gap-1 font-mono text-[10px]">
            RNE {data.rne_number}
          </Badge>
        )}
        <StartupActBadge verified={data.startup_act_verified} size="sm" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Statut juridique & Conformité
          </span>
          <StartupActBadge verified={data.startup_act_verified} size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Forme + RNE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Forme juridique</div>
              <div className="font-medium">{FORM_LABELS[data.legal_form]}</div>
            </div>
          </div>
          {data.rne_number && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">N° RNE</div>
                <div className="font-mono font-medium">{data.rne_number}</div>
              </div>
            </div>
          )}
          {data.rne_date && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Date immatriculation</div>
                <div className="font-medium">
                  {new Date(data.rne_date).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          )}
          {data.tribunal_greffe && (
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Greffe du Tribunal</div>
                <div className="font-medium">{data.tribunal_greffe}</div>
              </div>
            </div>
          )}
        </div>

        {/* Maturité légale */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm font-medium mb-2">
            <span>Maturité légale</span>
            <span className="text-muted-foreground">{checked}/{total} · {pct}%</span>
          </div>
          <Progress value={pct} className="h-2 mb-3" />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {CHECKLIST_LABELS.map(([k, label]) => (
              <li key={k} className="flex items-center gap-2">
                <span className={data[k] ? "text-emerald-600" : "text-muted-foreground/40"}>
                  {data[k] ? "✅" : "⬜"}
                </span>
                <span className={data[k] ? "font-medium" : "text-muted-foreground"}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalStatusCard;
