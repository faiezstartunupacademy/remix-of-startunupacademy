import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoStartunup from "@/assets/logo_startunup_new.png";

interface MfaVerificationProps {
  factorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaVerification = ({ factorId, onSuccess, onCancel }: MfaVerificationProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      });
      if (verifyError) {
        toast({ title: "Code invalide", description: "Le code saisi est incorrect. Réessayez.", variant: "destructive" });
        setCode("");
      } else {
        toast({ title: "Vérification réussie !", description: "Bienvenue sur STARTUNUP Academy." });
        onSuccess();
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Erreur de vérification", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div className="flex justify-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <img src={logoStartunup} alt="StarTunUp" className="h-16 w-auto" />
            </motion.div>
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Vérification en deux étapes</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 mt-2">
                <Smartphone className="h-4 w-4" />
                Entrez le code à 6 chiffres de votre application d'authentification
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full" onClick={handleVerify} disabled={isLoading || code.length !== 6}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Vérifier
            </Button>
            <Button variant="ghost" className="w-full text-sm" onClick={onCancel}>
              Annuler et se déconnecter
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MfaVerification;
