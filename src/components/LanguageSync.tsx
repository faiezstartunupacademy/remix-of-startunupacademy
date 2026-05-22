import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Loads the user's saved language preference from their profile on auth,
 * and applies it via i18n (which in turn updates <html dir/lang>).
 * Renders nothing.
 */
const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("preferred_language")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const lang = (data as any)?.preferred_language;
      if (lang && lang !== i18n.language) {
        await i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, i18n]);

  return null;
};

export default LanguageSync;
