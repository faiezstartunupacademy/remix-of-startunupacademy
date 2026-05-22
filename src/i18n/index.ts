import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGS = ['fr', 'ar', 'en'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const stored = (typeof window !== 'undefined' && localStorage.getItem('lang')) as SupportedLang | null;
const initialLang: SupportedLang = stored && SUPPORTED_LANGS.includes(stored) ? stored : 'fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLang,
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  });

/** Apply <html dir> + <html lang> + body font class based on current language. */
export function applyDirection(lang: string) {
  if (typeof document === 'undefined') return;
  const isRTL = lang === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.documentElement.classList.toggle('font-arabic', isRTL);
}

// Initial direction on load
applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

/** Convert Western digits to Eastern Arabic numerals (١٢٣). */
const EASTERN = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export function toEasternDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => EASTERN[Number(d)]);
}

export default i18n;
