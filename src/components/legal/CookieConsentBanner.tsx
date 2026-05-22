import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "startunup_cookie_consent_v1";
const VERSION = "1.0";

export type CookiePreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const getStored = (): CookiePreferences | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persistConsent = async (prefs: CookiePreferences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  // Persist server-side if logged in (best-effort)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const types: Array<{ consent_type: string; granted: boolean }> = [
      { consent_type: "cookies_essential", granted: true },
      { consent_type: "cookies_analytics", granted: prefs.analytics },
      { consent_type: "cookies_marketing", granted: prefs.marketing },
    ];
    for (const t of types) {
      await supabase.from("user_consents").upsert(
        {
          user_id: user.id,
          consent_type: t.consent_type,
          granted: t.granted,
          version: VERSION,
          granted_at: t.granted ? new Date().toISOString() : null,
          withdrawn_at: t.granted ? null : new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
        { onConflict: "user_id,consent_type" },
      );
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn("Consent persist error", e);
  }
};

const CookieConsentBanner = () => {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const isAr = i18n.language === "ar";

  useEffect(() => {
    const existing = getStored();
    if (!existing) setShow(true);
  }, []);

  const acceptAll = async () => {
    const prefs: CookiePreferences = { essential: true, analytics: true, marketing: true, decidedAt: new Date().toISOString() };
    await persistConsent(prefs);
    setShow(false);
    setOpenSettings(false);
  };

  const rejectAll = async () => {
    const prefs: CookiePreferences = { essential: true, analytics: false, marketing: false, decidedAt: new Date().toISOString() };
    await persistConsent(prefs);
    setShow(false);
    setOpenSettings(false);
  };

  const saveCustom = async () => {
    const prefs: CookiePreferences = { essential: true, analytics, marketing, decidedAt: new Date().toISOString() };
    await persistConsent(prefs);
    setShow(false);
    setOpenSettings(false);
  };

  if (!show) return null;

  const texts = isAr
    ? {
        title: "نحن نحترم خصوصيتك",
        body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. وفقًا للقانون التونسي رقم 2004-63 (INPDP) واللائحة العامة لحماية البيانات.",
        accept: "قبول الكل",
        reject: "رفض الكل",
        customize: "تخصيص",
        policy: "سياسة الخصوصية",
        settingsTitle: "تفضيلات ملفات تعريف الارتباط",
        essential: "أساسية (مطلوبة)",
        essentialDesc: "ضرورية لعمل الموقع والمصادقة.",
        analytics: "تحليلات",
        analyticsDesc: "تساعدنا على فهم استخدام المنصة.",
        marketing: "تسويق",
        marketingDesc: "محتوى مخصص وعروض.",
        save: "حفظ التفضيلات",
      }
    : {
        title: "Nous respectons votre vie privée",
        body: "Nous utilisons des cookies pour améliorer votre expérience. Conforme à la loi tunisienne n°2004-63 (INPDP) et au RGPD.",
        accept: "Tout accepter",
        reject: "Tout refuser",
        customize: "Personnaliser",
        policy: "Politique de confidentialité",
        settingsTitle: "Préférences de cookies",
        essential: "Essentiels (requis)",
        essentialDesc: "Nécessaires au fonctionnement du site et à l'authentification.",
        analytics: "Analytiques",
        analyticsDesc: "Nous aident à comprendre l'utilisation de la plateforme.",
        marketing: "Marketing",
        marketingDesc: "Contenus personnalisés et offres ciblées.",
        save: "Enregistrer les préférences",
      };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 22 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">{texts.title}</h3>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {texts.body}{" "}
                  <Link to="/legal/privacy" className="underline hover:text-primary">
                    {texts.policy}
                  </Link>
                  .
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={acceptAll}>
                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                    {texts.accept}
                  </Button>
                  <Button size="sm" variant="outline" onClick={rejectAll}>
                    {texts.reject}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setOpenSettings(true)}>
                    <Settings2 className="mr-1.5 h-4 w-4" />
                    {texts.customize}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{texts.settingsTitle}</DialogTitle>
            <DialogDescription>{texts.body}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{texts.essential}</p>
                <p className="text-xs text-muted-foreground">{texts.essentialDesc}</p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{texts.analytics}</p>
                <p className="text-xs text-muted-foreground">{texts.analyticsDesc}</p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{texts.marketing}</p>
                <p className="text-xs text-muted-foreground">{texts.marketingDesc}</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={rejectAll}>{texts.reject}</Button>
            <Button onClick={saveCustom}>{texts.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
