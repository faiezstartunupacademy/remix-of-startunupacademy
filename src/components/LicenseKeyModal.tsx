import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LicenseKeyModalProps {
  contentSlug: string;
  contentName: string;
  onSuccess: () => void;
}

const LICENSE_KEY_PATTERN = /^[A-Z0-9-]{5,50}$/;

const LicenseKeyModal = ({ contentSlug, contentName, onSuccess }: LicenseKeyModalProps) => {
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateLicenseKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const trimmedKey = licenseKey.trim().toUpperCase();
    
    if (!trimmedKey) {
      setError("Veuillez entrer une clé de licence");
      return;
    }

    if (!LICENSE_KEY_PATTERN.test(trimmedKey)) {
      setError("Format de clé invalide");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error: rpcError } = await supabase
        .rpc("validate_license_key", {
          _key_code: trimmedKey,
          _content_slug: contentSlug,
        });

      if (rpcError) {
        setError("Une erreur s'est produite. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }

      const result = data as { is_valid: boolean; reason: string };

      if (!result.is_valid) {
        const messages: Record<string, string> = {
          invalid_key: "Clé de licence invalide ou expirée",
          expired: "Cette clé de licence a expiré",
          max_uses_reached: "Cette clé de licence a atteint le nombre maximum d'utilisations",
          invalid_format: "Format de clé invalide",
        };
        setError(messages[result.reason] || "Clé de licence invalide");
        setIsLoading(false);
        return;
      }

      // Store validated license in localStorage
      const validatedLicenses = JSON.parse(localStorage.getItem("validated_licenses") || "{}");
      validatedLicenses[contentSlug] = {
        key: trimmedKey,
        validatedAt: new Date().toISOString(),
      };
      localStorage.setItem("validated_licenses", JSON.stringify(validatedLicenses));

      toast({
        title: "Accès autorisé !",
        description: `Bienvenue dans ${contentName}`,
      });

      onSuccess();
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/30 to-primary/20 rounded-full blur-3xl" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">Accès Protégé</CardTitle>
              <CardDescription className="mt-2">
                <span className="text-primary font-medium">{contentName}</span>
                <br />
                Entrez votre clé de licence pour accéder au contenu
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={validateLicenseKey} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Entrez votre clé de licence"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    className="pl-10 uppercase tracking-wider font-mono"
                    maxLength={50}
                    autoFocus
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Valider la clé
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Vous n'avez pas de clé ? Contactez votre formateur ou l'administrateur.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LicenseKeyModal;
