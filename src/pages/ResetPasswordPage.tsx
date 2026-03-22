import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoStartunup from "@/assets/logo_startunup_new.png";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      toast({ title: t("auth.invalidLink"), description: t("auth.invalidLinkDesc"), variant: "destructive" });
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError(t("auth.passwordMinLength")); return; }
    if (password !== confirmPassword) { setError(t("auth.passwordMismatch")); return; }
    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      toast({ title: t("auth.passwordUpdated"), description: t("auth.passwordUpdatedDesc") });
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err: any) {
      setError(err.message || t("auth.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <img src={logoStartunup} alt="StarTunUp" className="h-12 w-auto mx-auto" />
            <CardTitle className="text-xl">{t("auth.resetTitle")}</CardTitle>
            <CardDescription>{t("auth.resetDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <p className="font-medium">{t("auth.passwordUpdatedSuccess")}</p>
                <p className="text-sm text-muted-foreground">{t("auth.redirecting")}</p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("auth.newPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" placeholder="••••••••" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.updatePassword")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;