import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, TrendingUp, Eye, FileText, ArrowRight, Building2 } from "lucide-react";

const InvestorView = () => {
  const shortcuts = [
    { url: "/communaute/invest", icon: Briefcase, title: "Espace investisseurs", desc: "Pipeline & opportunités", color: "border-primary/30 from-primary/10 to-violet-500/5 bg-primary/15 text-primary" },
    { url: "/marketplace", icon: Building2, title: "Marketplace startups", desc: "Sourcing & due diligence", color: "border-emerald-500/30 from-emerald-500/10 to-teal-500/5 bg-emerald-500/15 text-emerald-600" },
    { url: "/deal-room", icon: FileText, title: "Deal Room", desc: "Documents & NDAs", color: "border-amber-500/30 from-amber-500/10 to-orange-500/5 bg-amber-500/15 text-amber-600" },
    { url: "/financement", icon: TrendingUp, title: "Programmes financement", desc: "Veille appels & co-investissement", color: "border-rose-500/30 from-rose-500/10 to-fuchsia-500/5 bg-rose-500/15 text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Mode Investisseur</CardTitle>
          <CardDescription>Accès rapide à votre pipeline et aux startups en levée.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {shortcuts.map(s => {
          const [borderCls, gradFrom, gradTo, iconBg, iconColor] = s.color.split(" ");
          return (
            <Link key={s.url} to={s.url} className={`group rounded-xl border-2 ${borderCls} bg-gradient-to-br ${gradFrom} ${gradTo} p-4 hover:shadow-md transition`}>
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-lg ${iconBg} flex items-center justify-center`}><s.icon className={`h-5 w-5 ${iconColor}`} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition" />
              </div>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Conseils pour investisseurs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Complétez votre thèse d'investissement dans le profil pour recevoir des opportunités ciblées.</p>
          <p>• Signez un NDA depuis la Deal Room avant d'accéder aux documents de due diligence.</p>
          <p>• Suivez les cohortes d'incubation depuis la Marketplace pour identifier les pépites validées.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorView;
