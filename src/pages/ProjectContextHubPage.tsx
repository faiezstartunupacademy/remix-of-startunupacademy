import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, LineChart, Wallet, FileText, Briefcase, CheckCircle2, Circle, Sparkles, Target } from "lucide-react";
import ProjectContextBadge from "@/components/shared/ProjectContextBadge";
import { useProjectContext } from "@/hooks/useProjectContext";
import { supabase } from "@/integrations/supabase/client";
import { CAPITAL_STAGE_LABEL } from "@/utils/stageTaxonomy";

interface PropagationStat {
  marketReports: number;
  fundingMatched: boolean;
  applicationsTagged: number;
  applicationsTotal: number;
  dealRoomDocs: number;
  dealRoomDeals: number;
}

const ProjectContextHubPage = () => {
  const { loading, active, projects } = useProjectContext();
  const [stats, setStats] = useState<PropagationStat | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [mi, apps, docs, deals] = await Promise.all([
        supabase.from("market_intelligence_reports").select("id, sector").eq("user_id", u.user.id),
        supabase.from("funding_applications").select("id, stage_at_submission").eq("user_id", u.user.id),
        supabase.from("deal_room_documents").select("id").eq("user_id", u.user.id),
        supabase.from("deal_room_deals").select("id").eq("user_id", u.user.id),
      ]);
      const tagged = (apps.data || []).filter((a: any) => a.stage_at_submission).length;
      const sectorMatch = active?.sector
        ? (mi.data || []).filter((r: any) => (r.sector || "").toLowerCase() === active.sector!.toLowerCase()).length
        : (mi.data || []).length;
      setStats({
        marketReports: sectorMatch,
        fundingMatched: !!(active?.capitalStage || active?.sector),
        applicationsTagged: tagged,
        applicationsTotal: apps.data?.length || 0,
        dealRoomDocs: docs.data?.length || 0,
        dealRoomDeals: deals.data?.length || 0,
      });
    })();
  }, [active?.projectId, active?.sector, active?.capitalStage]);

  const modules = [
    {
      key: "market",
      title: "Market Intelligence",
      url: "/market-intelligence",
      icon: LineChart,
      color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
      iconColor: "text-orange-600",
      propagation: active?.sector ? "Secteur pré-rempli dans TAM/SAM, SWOT et Benchmark" : "Aucun secteur détecté",
      ok: !!active?.sector,
      kpi: stats ? `${stats.marketReports} rapport(s) lié(s) au secteur` : "—",
    },
    {
      key: "funding",
      title: "Financement",
      url: "/financement",
      icon: Wallet,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      iconColor: "text-emerald-600",
      propagation:
        active && (active.bmValidated || (active.mvpScore ?? 0) >= 60)
          ? "Bonus matching +10 pts (BM ou MVP validé)"
          : "Matching basé sur stade & secteur",
      ok: !!stats?.fundingMatched,
      kpi: active ? `Stade actif : ${CAPITAL_STAGE_LABEL[active.capitalStage]}` : "—",
    },
    {
      key: "applications",
      title: "Mes Candidatures",
      url: "/candidatures",
      icon: FileText,
      color: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/30",
      iconColor: "text-violet-600",
      propagation: "Stade enregistré comme snapshot à chaque dépôt",
      ok: (stats?.applicationsTagged || 0) > 0,
      kpi: stats
        ? `${stats.applicationsTagged}/${stats.applicationsTotal} candidatures avec stade`
        : "—",
    },
    {
      key: "dealroom",
      title: "Deal Room",
      url: "/deal-room",
      icon: Briefcase,
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
      iconColor: "text-rose-600",
      propagation: "Documents Market Intel suggérés et attachables",
      ok: (stats?.dealRoomDocs || 0) > 0,
      kpi: stats ? `${stats.dealRoomDocs} doc(s) · ${stats.dealRoomDeals} deal(s)` : "—",
    },
  ];

  const score = stats
    ? Math.round(
        ((active?.sector ? 1 : 0) +
          (stats.fundingMatched ? 1 : 0) +
          (stats.applicationsTagged > 0 ? 1 : 0) +
          (stats.dealRoomDocs > 0 ? 1 : 0)) *
          25
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-primary" />
              Mission Control · Contexte Projet
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Visualisez le contexte unifié (Pôle Stratégique · MVP Validator · Incubation) propagé
              vers vos 4 modules market.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/mission-control">Retour cockpit</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-muted-foreground animate-pulse">Chargement…</div>
        ) : !active ? (
          <Card className="p-6">
            <CardTitle className="text-lg mb-2">Aucun projet actif</CardTitle>
            <CardDescription>
              Créez un projet depuis le Pôle Stratégique, MVP Validator ou Incubation pour activer
              la propagation contextuelle.
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Button asChild>
                <Link to="/pole-strategique">Démarrer un projet</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <ProjectContextBadge />
            </div>

            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Progression de la propagation contextuelle
                  </span>
                  <Badge className="text-base px-3 py-1">{score}%</Badge>
                </CardTitle>
                <CardDescription>
                  Pourcentage des 4 modules market alimentés par le contexte du projet actif.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={score} className="h-3" />
                <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <span>{projects.length} projet(s) détecté(s)</span>
                  <span>·</span>
                  <span>Source active : {active.source}</span>
                  {active.bmValidated && <><span>·</span><span className="text-emerald-600">BM validé</span></>}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {modules.map((m) => (
                <Card
                  key={m.key}
                  className={`bg-gradient-to-br ${m.color} hover:shadow-md transition`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <m.icon className={`h-5 w-5 ${m.iconColor}`} />
                        {m.title}
                      </span>
                      {m.ok ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">{m.propagation}</div>
                    <div className="text-xs text-muted-foreground font-medium">{m.kpi}</div>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to={m.url}>
                        Ouvrir
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Comment ça marche</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Le <strong>badge unifié</strong> agrège vos projets Pôle Stratégique, MVP Validator et Incubation.</p>
                <p>• Le <strong>projet actif</strong> alimente automatiquement les filtres et pré-remplissages des 4 modules market.</p>
                <p>• Vous pouvez changer de projet actif via le sélecteur du badge — la propagation se met à jour partout.</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectContextHubPage;
