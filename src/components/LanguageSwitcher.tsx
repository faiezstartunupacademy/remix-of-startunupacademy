import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const current = i18n.language.startsWith("ar") ? "ar" : "fr";

  const setLang = async (lang: "fr" | "ar") => {
    if (lang === current) return;
    await i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    if (user) {
      // Persist preference silently — non-blocking
      supabase
        .from("profiles")
        .update({ preferred_language: lang })
        .eq("user_id", user.id)
        .then(() => {});
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-background/60 backdrop-blur p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={cn(
          "px-2.5 h-7 rounded-full transition-colors",
          current === "fr"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={current === "fr"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={cn(
          "px-2.5 h-7 rounded-full transition-colors font-arabic text-sm",
          current === "ar"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={current === "ar"}
      >
        عر
      </button>
    </div>
  );
};

export default LanguageSwitcher;
