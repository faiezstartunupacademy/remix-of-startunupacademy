import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Lock, ArrowRight, Loader2, AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLicenseAccess } from "@/hooks/useLicenseAccess";
import { useAuth } from "@/hooks/useAuth";

interface InlineLicenseGateProps {
  contentSlug: string;
  contentName: string;
  children: React.ReactNode;
}

const LICENSE_KEY_PATTERN = /^[A-Z0-9-]{5,50}$/;

const InlineLicenseGate = ({ contentSlug, contentName, children }: InlineLicenseGateProps) => {
  const { hasAccess, isChecking, grantAccess } = useLicenseAccess(contentSlug);
  const { user } = useAuth();
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  const validateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedKey = licenseKey.trim().toUpperCase();
    if (!trimmedKey || !LICENSE_KEY_PATTERN.test(trimmedKey)) {
      setError("Format de clé invalide");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc("validate_license_key", {
        _key_code: trimmedKey,
        _content_slug: contentSlug,
      });
      if (rpcError) { setError("Erreur. Réessayez."); setIsLoading(false); return; }
      const result = data as { is_valid: boolean; reason: string };
      if (!result.is_valid) {
        const messages: Record<string, string> = {
          invalid_key: "Clé invalide",
          expired: "Clé expirée",
          max_uses_reached: "Utilisations max atteintes",
          invalid_format: "Format invalide",
        };
        setError(messages[result.reason] || "Clé invalide");
        setIsLoading(false);
        return;
      }
      const validatedLicenses = JSON.parse(localStorage.getItem("validated_licenses") || "{}");
      validatedLicenses[contentSlug] = { key: trimmedKey, validatedAt: new Date().toISOString() };
      localStorage.setItem("validated_licenses", JSON.stringify(validatedLicenses));
      toast({ title: "Accès autorisé !", description: `Bienvenue dans ${contentName}` });
      grantAccess();
    } catch {
      setError("Erreur. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const notifyAdmin = async () => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter pour envoyer une demande.", variant: "destructive" });
      return;
    }
    setIsNotifying(true);
    try {
      // Find all admin user IDs
      const { data: admins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.user_id,
          title: "Demande de clé d'accès",
          message: `L'utilisateur ${user.email} demande une clé d'accès pour "${contentName}" (${contentSlug}).`,
          type: "access_request",
          link: "/admin",
        }));

        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notifications);

        if (insertError) throw insertError;
      }

      setNotified(true);
      toast({ title: "Demande envoyée ✓", description: "L'administrateur a été notifié de votre demande." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer la notification. Réessayez.", variant: "destructive" });
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm border-border/50 shadow-lg">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Accès Protégé</h3>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">{contentName}</span>
              <br />Entrez votre clé d'accès
            </p>
          </div>
          <form onSubmit={validateKey} className="space-y-3">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Clé d'accès"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                className="pl-10 uppercase tracking-wider font-mono text-sm"
                maxLength={50}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Valider <ArrowRight className="ml-2 h-3.5 w-3.5" /></>}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Contactez votre formateur pour obtenir une clé.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={notifyAdmin}
            disabled={isNotifying || notified}
          >
            {isNotifying ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            {notified ? "Demande envoyée ✓" : "Demander l'accès à l'admin"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InlineLicenseGate;
