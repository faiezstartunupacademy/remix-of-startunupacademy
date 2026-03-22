import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Copy, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MfaSetup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    if (data?.totp && data.totp.length > 0) {
      const verified = data.totp.find(f => f.status === "verified");
      setIsEnrolled(!!verified);
    }
  };

  const startEnrollment = async () => {
    setIsLoading(true);
    try {
      // Unenroll any unverified factors first
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors?.totp) {
        for (const f of factors.totp.filter(t => t.status !== "verified")) {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "STARTUNUP 2FA" });
      if (error) throw error;
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEnrollment = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      });
      if (error) {
        toast({ title: "Code invalide", description: "Vérifiez votre application et réessayez.", variant: "destructive" });
        setCode("");
      } else {
        toast({ title: "2FA activée !", description: "La vérification en deux étapes est maintenant active." });
        setIsEnrolled(true);
        setIsOpen(false);
        setQrCode("");
        setSecret("");
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const disableMfa = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      if (data?.totp) {
        for (const f of data.totp) {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
      }
      setIsEnrolled(false);
      toast({ title: "2FA désactivée", description: "La vérification en deux étapes a été désactivée." });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isEnrolled ? "outline" : "default"} className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          {isEnrolled ? "2FA activée ✓" : "Activer la 2FA"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Vérification en deux étapes
          </DialogTitle>
          <DialogDescription>
            {isEnrolled
              ? "La 2FA est actuellement activée. Vous pouvez la désactiver ci-dessous."
              : "Sécurisez votre compte avec une application d'authentification (Google Authenticator, Authy, etc.)."
            }
          </DialogDescription>
        </DialogHeader>

        {isEnrolled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                La vérification en deux étapes est active
              </span>
            </div>
            <Button variant="destructive" className="w-full gap-2" onClick={disableMfa} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              Désactiver la 2FA
            </Button>
          </div>
        ) : !qrCode ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous aurez besoin d'une application d'authentification comme <strong>Google Authenticator</strong> ou <strong>Authy</strong>.
            </p>
            <Button className="w-full gap-2" onClick={startEnrollment} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Commencer la configuration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Scannez ce QR code avec votre application d'authentification :
            </p>
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-xs break-all">{secret}</code>
              <Button variant="outline" size="icon" onClick={copySecret}>
                {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Entrez le code à 6 chiffres généré :
            </p>
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
            <Button className="w-full" onClick={verifyEnrollment} disabled={isLoading || code.length !== 6}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Activer la 2FA
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MfaSetup;
