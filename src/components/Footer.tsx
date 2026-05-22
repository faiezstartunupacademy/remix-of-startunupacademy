import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Linkedin, Twitter, Youtube, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoStartunup from "@/assets/logo_startunup_new.png";
import TrustBadge from "@/components/legal/TrustBadge";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={logoStartunup} alt="StarTunUp Academy" className="h-16 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Youtube className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Formation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.formation")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/formation/design-thinking" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50" />Design Thinking</Link></li>
              <li><Link to="/formation/lean-canvas" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50" />Lean Canvas</Link></li>
              <li><Link to="/formation/growth-hacking" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50" />Growth Hacking</Link></li>
              <li><Link to="/formation/business-model" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50" />Business Model</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.resources")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/ecosysteme" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50" />{t("footer.ecosystem")}</Link></li>
              <li><Link to="/startups" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50" />{t("footer.startups")}</Link></li>
              <li><Link to="/marketplace" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50" />Marketplace</Link></li>
              <li><Link to="/a-propos" className="hover:text-primary transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50" />{t("footer.about")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.contact")}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /><span>Tunis, Tunisie</span></li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary flex-shrink-0" /><a href="mailto:startunupacademy1@gmail.com" className="hover:text-primary transition-colors">startunupacademy1@gmail.com</a></li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary flex-shrink-0" /><span>+216 XX XXX XXX</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t("footer.rights")}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/mentions-legales" className="hover:text-primary transition-colors">{t("footer.legal")}</Link>
              <Link to="/confidentialite" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {t("footer.designedBy")} <span className="font-semibold text-primary">Faiez GHORBEL</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("footer.expertTitle")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
