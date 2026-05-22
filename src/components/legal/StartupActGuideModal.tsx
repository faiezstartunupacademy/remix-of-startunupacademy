import { Link } from "react-router-dom";
import { ExternalLink, FileCheck, Upload, Users, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    n: 1,
    icon: ExternalLink,
    title: "Déposer sur startup.gov.tn",
    desc: "Créer ton compte sur le portail officiel et déposer le dossier de candidature en ligne (statuts, business plan, équipe…).",
    link: { href: "https://startup.gov.tn", label: "startup.gov.tn" },
  },
  {
    n: 2,
    icon: Users,
    title: "Passer devant la Commission Nationale",
    desc: "Audition devant le Collège du Label. Préparer un pitch clair sur l'innovation, le potentiel de croissance et l'impact.",
  },
  {
    n: 3,
    icon: FileCheck,
    title: "Obtenir l'attestation",
    desc: "Si l'avis est favorable, le ministère délivre l'attestation Startup Act (valable 8 ans, renouvelable).",
  },
  {
    n: 4,
    icon: Upload,
    title: "Uploader l'attestation ici pour activer le badge",
    desc: "Importer ton attestation depuis ta fiche Conformité légale. Un admin la vérifie sous 72h et le badge or s'affiche sur ton profil.",
  },
];

const StartupActGuideModal = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <span aria-hidden>🏅</span> Obtenir le label Startup Act
        </DialogTitle>
        <DialogDescription>
          Le Startup Act tunisien (loi 2018-20) offre 3 avantages majeurs aux startups labellisées :
          <strong className="block mt-2 text-foreground">
            exonération fiscale 8 ans · compte en devises · couverture sociale étatique des fondateurs.
          </strong>
        </DialogDescription>
      </DialogHeader>

      <ol className="space-y-4 my-4">
        {steps.map(({ n, icon: Icon, title, desc, link }) => (
          <li
            key={n}
            className="flex gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 font-bold grid place-items-center shadow-md">
              {n}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold flex items-center gap-2">
                <Icon className="h-4 w-4 text-amber-600" aria-hidden />
                {title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              {link && (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3 text-xs">
        <strong className="text-amber-900 dark:text-amber-300">À noter :</strong>{" "}
        <span className="text-amber-800 dark:text-amber-200/80">
          Le label est gratuit. La Commission se réunit en moyenne tous les 2 mois.
          Critères clés : innovation, scalabilité, équipe, &lt; 8 ans d'existence.
        </span>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Plus tard
        </Button>
        <Button asChild onClick={() => onOpenChange(false)}>
          <Link to="/profil/conformite">
            Aller à ma fiche Conformité
            <ArrowRight className="h-4 w-4 ms-1" />
          </Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default StartupActGuideModal;
