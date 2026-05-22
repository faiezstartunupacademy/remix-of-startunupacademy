import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/legal/TrustBadge";

type Consent = {
  consent_type: string;
  granted: boolean;
  version: string;
  granted_at: string | null;
  withdrawn_at: string | null;
};

const LABELS: Record<string, { title: string; desc: string; required?: boolean }> = {
  terms: { title: "Conditions Générales d'Utilisation", desc: "Acceptation des CGU lors de l'inscription.", required: true },
  privacy: { title: "Politique de Confidentialité", desc: "Reconnaissance de la politique INPDP/RGPD.", required: true },
  data_processing: { title: "Traitement des données personnelles", desc: "Consentement explicite au traitement (INPDP art. 27).", required: true },
  cookies_essential: { title: "Cookies essentiels", desc: "Authentification, sécurité, langue.", required: true },
  cookies_analytics: { title: "Cookies analytiques", desc: "Mesure d'audience anonymisée." },
  cookies_marketing: { title: "Cookies marketing", desc: "Personnalisation des contenus." },
};

const MyConsentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [consents, setConsents] = useState<Consent[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      const { data } = await supabase
        .from("user_consents")
        .select("consent_type, granted, version, granted_at, withdrawn_at")
        .eq("user_id", user.id);
      setConsents(data || []);
      setLoading(false);
    })();
  }, [navigate]);

  const toggle = async (type: string, granted: boolean) => {
    if (!userId) return;
    const now = new Date().toISOString();
    const { error } = await supabase.from("user_consents").upsert(
      {
        user_id: userId,
        consent_type: type,
        granted,
        version: "1.0",
        granted_at: granted ? now : null,
        withdrawn_at: granted ? null : now,
        user_agent: navigator.userAgent,
      },
      { onConflict: "user_id,consent_type" },
    );
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setConsents((prev) => {
      const others = prev.filter((c) => c.consent_type !== type);
      return [...others, { consent_type: type, granted, version: "1.0", granted_at: granted ? now : null, withdrawn_at: granted ? null : now }];
    });
    toast({ title: granted ? "Consentement accordé" : "Consentement retiré" });
  };

  const getConsent = (type: string) => consents.find((c) => c.consent_type === type);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <ShieldCheck className="h-7 w-7 text-primary" />
              Mon consentement
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gérez vos préférences de confidentialité conformément à la loi tunisienne n°2004-63 et au RGPD.
            </p>
          </div>
          <TrustBadge variant="compact" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(LABELS).map(([key, meta]) => {
              const c = getConsent(key);
              const granted = c?.granted ?? meta.required ?? false;
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{meta.title}</h3>
                        {meta.required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{meta.desc}</p>
                      {c?.granted_at && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Accordé le {new Date(c.granted_at).toLocaleString("fr-FR")} — version {c.version}
                        </p>
                      )}
                      {c?.withdrawn_at && !c.granted && (
                        <p className="mt-2 text-xs text-destructive">
                          Retiré le {new Date(c.withdrawn_at).toLocaleString("fr-FR")}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={granted}
                      disabled={meta.required}
                      onCheckedChange={(v) => toggle(key, v)}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-6 border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Vos droits :</strong> vous pouvez à tout moment exercer vos droits d'accès,
            de rectification, d'effacement, de portabilité et d'opposition depuis la section{" "}
            <a href="/profil/donnees" className="underline text-primary">Mes données</a>.
            Pour toute question, contactez startunupacademy1@gmail.com.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MyConsentPage;
