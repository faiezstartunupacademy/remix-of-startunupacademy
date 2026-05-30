import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, Users, BarChart3, FileText, ArrowRight, GraduationCap } from "lucide-react";

const IncubatorView = () => {
  const shortcuts = [
    { url: "/admin", icon: BarChart3, title: "Analytics cohorte", desc: "BI plateforme & indicateurs" },
    { url: "/candidatures", icon: FileText, title: "Candidatures programmes", desc: "Pipeline & sélection" },
    { url: "/financement", icon: GraduationCap, title: "Catalogue programmes", desc: "Gestion des appels" },
    { url: "/annuaire", icon: Users, title: "Annuaire écosystème", desc: "Partenaires & acteurs" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-violet-600" /> Mode Incubateur</CardTitle>
          <CardDescription>Pilotez votre cohorte, vos programmes et votre pipeline de candidatures.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {shortcuts.map(s => (
          <Link key={s.url} to={s.url} className="group rounded-xl border-2 border-primary/20 bg-card p-4 hover:border-primary hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition" />
            </div>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bonnes pratiques</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Publiez vos appels à candidatures via le catalogue de programmes pour toucher les startups éligibles.</p>
          <p>• Suivez vos KPI cohorte (taux de complétion, levée, emploi) depuis l'onglet BI admin.</p>
          <p>• Mettez à jour votre fiche dans l'annuaire de l'écosystème pour rester visible.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncubatorView;
