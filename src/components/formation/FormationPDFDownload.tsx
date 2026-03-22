import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Globe, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface FormationPDFDownloadProps {
  formationName: string;
  /** Map of language code → PDF generation data (slides) */
  getContent: (lang: string) => { title: string; sections: { heading: string; bullets: string[] }[] };
}

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇹🇳" },
];

const FormationPDFDownload = ({ formationName, getContent }: FormationPDFDownloadProps) => {
  const { t } = useTranslation();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async (lang: string) => {
    setGenerating(true);
    try {
      const content = getContent(lang);
      const langLabel = LANGUAGES.find(l => l.code === lang)?.label || lang;

      // Build HTML content for PDF
      const htmlParts = content.sections.map(
        (section) =>
          `<div style="margin-bottom:24px;">
            <h2 style="font-size:18px;color:#4f46e5;margin-bottom:8px;border-bottom:2px solid #e5e7eb;padding-bottom:4px;">${section.heading}</h2>
            <ul style="padding-left:20px;line-height:1.8;">${section.bullets.map(b => `<li style="margin-bottom:4px;">${b}</li>`).join("")}</ul>
          </div>`
      ).join("");

      const fullHTML = `<!DOCTYPE html><html dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 28px; color: #1e1b4b; margin-bottom: 8px; }
          .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
          .badge { display: inline-block; background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 24px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
        </style>
      </head><body>
        <div class="badge">STARTUNUP Academy</div>
        <h1>${content.title}</h1>
        <p class="subtitle">${langLabel} — ${new Date().toLocaleDateString()}</p>
        ${htmlParts}
        <div class="footer">© ${new Date().getFullYear()} STARTUNUP Academy — Document généré automatiquement</div>
      </body></html>`;

      // Create a downloadable HTML file (works everywhere, no extra deps)
      const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formationName.replace(/\s+/g, "-").toLowerCase()}-${lang}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${t("formations.downloadSuccess")} (${langLabel})`);
    } catch (err) {
      toast.error(t("formations.downloadError"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full" disabled={generating}>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t("formations.downloadPDF")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => generatePDF(lang.code)} className="gap-3 cursor-pointer">
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
            <Globe className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FormationPDFDownload;
