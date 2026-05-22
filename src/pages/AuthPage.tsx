import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoStartunup from "@/assets/logo_startunup_new.png";
import { z } from "zod";
import MfaVerification from "@/components/MfaVerification";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "@/components/legal/PasswordStrengthMeter";

const AuthPage = () => {
  const { t } = useTranslation();
  const emailSchema = z.string().trim().email({ message: t("auth.invalidEmail") }).max(255);
  const passwordSchema = z.string().min(10, { message: "Minimum 10 caractères" }).max(128).regex(/[A-Z]/, { message: "Au moins une majuscule requise" }).regex(/[0-9]/, { message: "Au moins un chiffre requis" }).regex(/[^A-Za-z0-9]/, { message: "Au moins un caractère spécial requis" });


  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataProcessing, setAcceptDataProcessing] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const routeAfterAuth = async (userId: string) => {
    const { data: prof } = await supabase.from("profiles").select("onboarding_completed, role_type").eq("user_id", userId).maybeSingle();
    if (!prof || !prof.onboarding_completed) navigate("/onboarding");
    else if (prof.role_type === "startuper") navigate("/mission-control");
    else navigate("/");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) routeAfterAuth(session.user.id);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) routeAfterAuth(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (isSignUp: boolean): boolean => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0]?.message;
    if (!showForgotPassword) {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0]?.message;
    }
    if (isSignUp && name.trim().length === 0) newErrors.name = t("auth.nameRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({ title: t("auth.loginError"), description: t("auth.wrongCredentials"), variant: "destructive" });
        } else if (error.message.includes("Email not confirmed")) {
          toast({ title: t("auth.emailNotConfirmed"), description: t("auth.emailNotConfirmedDesc"), variant: "destructive" });
        } else {
          toast({ title: t("common.error"), description: error.message, variant: "destructive" });
        }
      } else {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const verifiedFactor = factors?.totp?.find(f => f.status === "verified");
        if (verifiedFactor) {
          setMfaFactorId(verifiedFactor.id);
        } else {
          toast({ title: t("auth.welcome"), description: t("auth.loginSuccess") });
        }
      }
    } catch {
      toast({ title: t("common.error"), description: t("auth.unexpectedError"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    if (!acceptTerms || !acceptDataProcessing) {
      setConsentError("Vous devez accepter les CGU, la politique de confidentialité et le traitement de vos données pour créer un compte.");
      return;
    }
    setConsentError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name.trim() } },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast({ title: t("auth.accountExists"), description: t("auth.accountExistsDesc"), variant: "destructive" });
        } else {
          toast({ title: t("common.error"), description: error.message, variant: "destructive" });
        }
      } else {
        // Record explicit consents
        const userId = data.user?.id;
        if (userId) {
          const now = new Date().toISOString();
          const ua = navigator.userAgent;
          await supabase.from("user_consents").upsert(
            [
              { user_id: userId, consent_type: "terms", granted: true, version: "1.0", granted_at: now, user_agent: ua },
              { user_id: userId, consent_type: "privacy", granted: true, version: "1.0", granted_at: now, user_agent: ua },
              { user_id: userId, consent_type: "data_processing", granted: true, version: "1.0", granted_at: now, user_agent: ua },
            ],
            { onConflict: "user_id,consent_type" },
          );
        }
        toast({ title: t("auth.accountCreated"), description: t("auth.accountCreatedDesc") });
        setActiveTab("login");
      }
    } catch {
      toast({ title: t("common.error"), description: t("auth.unexpectedError"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) { setErrors({ email: emailResult.error.errors[0]?.message }); return; }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      setResetSent(true);
      toast({ title: t("auth.emailSent"), description: t("auth.emailSentDesc") });
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message || t("auth.unexpectedError"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } catch {
      toast({ title: t("common.error"), description: t("auth.unexpectedError"), variant: "destructive" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (mfaFactorId) {
    return (
      <MfaVerification factorId={mfaFactorId}
        onSuccess={() => { setMfaFactorId(null); navigate("/"); }}
        onCancel={async () => { await supabase.auth.signOut(); setMfaFactorId(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/30 to-primary/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div className="flex justify-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <img src={logoStartunup} alt="StarTunUp" className="h-16 w-auto" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">Star<span className="text-primary">TunUp</span> Academy</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-accent" />
                {t("auth.platformTitle")}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {showForgotPassword ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">{t("auth.forgotTitle")}</h3>
                {resetSent ? (
                  <div className="text-center space-y-3 py-4">
                    <Mail className="h-10 w-10 text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {t("auth.resetSent")} <strong>{email}</strong>. {t("auth.resetSentDesc")}
                    </p>
                    <Button variant="ghost" onClick={() => { setShowForgotPassword(false); setResetSent(false); }} className="text-sm">
                      {t("auth.backToLogin")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{t("auth.forgotDesc")}</p>
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">{t("auth.email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="reset-email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.sendLink")}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setShowForgotPassword(false)}>
                      {t("auth.backToLogin")}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("auth.loginTab")}</TabsTrigger>
                    <TabsTrigger value="signup">{t("auth.signupTab")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">{t("auth.email")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="login-email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">{t("auth.password")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      <div className="text-right">
                        <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary hover:underline">
                          {t("auth.forgotPassword")}
                        </button>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>{t("auth.signIn")}<ArrowRight className="ml-2 h-4 w-4" /></>)}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">{t("auth.fullName")}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-name" type="text" placeholder={t("auth.fullNamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                        </div>
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">{t("auth.email")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">{t("auth.password")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        <PasswordStrengthMeter password={password} className="mt-2" />
                      </div>

                      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            J'accepte les{" "}
                            <Link to="/legal/terms" target="_blank" className="underline text-primary">CGU</Link>{" "}
                            et la{" "}
                            <Link to="/legal/privacy" target="_blank" className="underline text-primary">Politique de confidentialité</Link>.
                          </span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <Checkbox checked={acceptDataProcessing} onCheckedChange={(v) => setAcceptDataProcessing(v === true)} className="mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            Je consens au traitement de mes données personnelles conformément à la loi tunisienne n°2004-63 (INPDP) et au RGPD.
                          </span>
                        </label>
                        {consentError && <p className="text-xs text-destructive">{consentError}</p>}
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms || !acceptDataProcessing}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>{t("auth.createAccount")}<ArrowRight className="ml-2 h-4 w-4" /></>)}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{t("common.or")}</span></div>
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      {t("auth.continueWithGoogle")}
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;