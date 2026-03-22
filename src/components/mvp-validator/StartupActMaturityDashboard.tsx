import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Shield, Users, Lightbulb, BarChart3, Scale, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  projectId: string;
  sector: string;
  scenario: string;
};

type MaturityCriteria = {
  key: string;
  label: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  color: string;
  bgColor: string;
  details: string[];
};

const StartupActMaturityDashboard = ({ projectId, sector, scenario }: Props) => {
  const [loading, setLoading] = useState(true);
  const [criteria, setCriteria] = useState<MaturityCriteria[]>([]);
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    computeMaturity();
  }, [projectId]);

  const computeMaturity = async () => {
    const [hypotheses, features, personas, metrics, team, testResults] = await Promise.all([
      supabase.from("mvp_hypotheses").select("*").eq("project_id", projectId),
      supabase.from("mvp_features").select("*").eq("project_id", projectId),
      supabase.from("mvp_personas").select("*").eq("project_id", projectId),
      supabase.from("mvp_metrics").select("*").eq("project_id", projectId).order("month"),
      supabase.from("mvp_team_members").select("*").eq("project_id", projectId),
      supabase.from("mvp_test_results").select("*").eq("project_id", projectId),
    ]);

    const h = (hypotheses.data || []) as any[];
    const f = (features.data || []) as any[];
    const p = (personas.data || []) as any[];
    const m = (metrics.data || []) as any[];
    const t = (team.data || []) as any[];
    const tr = (testResults.data || []) as any[];

    // 1. Innovation Score (0-100)
    const validatedHypotheses = h.filter(x => x.validation_status === "validé").length;
    const totalHypotheses = h.length || 1;
    const hypothesisScore = Math.min((validatedHypotheses / totalHypotheses) * 100, 100);
    const featuresTested = f.filter(x => x.tested).length;
    const featuresTotal = f.length || 1;
    const featureScore = Math.min((featuresTested / featuresTotal) * 100, 100);
    const innovationScore = Math.round((hypothesisScore * 0.6 + featureScore * 0.4));
    const innovationDetails: string[] = [];
    if (validatedHypotheses > 0) innovationDetails.push(`${validatedHypotheses}/${h.length} hypothèses validées`);
    if (featuresTested > 0) innovationDetails.push(`${featuresTested}/${f.length} features testées`);
    if (innovationDetails.length === 0) innovationDetails.push("Aucune hypothèse ou feature testée");

    // 2. Market Validation Score (0-100)
    const interviewsDone = p.reduce((sum: number, x: any) => sum + (x.interviews_done || 0), 0);
    const interviewsTarget = p.reduce((sum: number, x: any) => sum + (x.interviews_target || 30), 0) || 1;
    const interviewScore = Math.min((interviewsDone / interviewsTarget) * 100, 100);
    const earlyAdopters = p.filter((x: any) => x.is_early_adopter).length;
    const avgSatisfaction = p.length > 0 ? p.reduce((sum: number, x: any) => sum + (x.satisfaction_score || 0), 0) / p.length : 0;
    const marketScore = Math.round(interviewScore * 0.4 + Math.min(avgSatisfaction * 10, 100) * 0.3 + Math.min(earlyAdopters * 25, 100) * 0.3);
    const marketDetails: string[] = [];
    if (interviewsDone > 0) marketDetails.push(`${interviewsDone} entretiens réalisés`);
    if (earlyAdopters > 0) marketDetails.push(`${earlyAdopters} early adopters identifiés`);
    if (avgSatisfaction > 0) marketDetails.push(`Satisfaction: ${avgSatisfaction.toFixed(1)}/10`);
    if (marketDetails.length === 0) marketDetails.push("Aucune validation marché");

    // 3. Viability Score (0-100)
    const lastMetric = m.length > 0 ? m[m.length - 1] : null;
    const hasRevenue = lastMetric && Number(lastMetric.revenue) > 0;
    const hasMrr = lastMetric && Number(lastMetric.mrr) > 0;
    const ltv = lastMetric ? Number(lastMetric.ltv) : 0;
    const cac = lastMetric ? Number(lastMetric.cac) : 0;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    const churnRate = lastMetric ? Number(lastMetric.churn_rate) : 100;
    let viabilityScore = 0;
    if (hasRevenue) viabilityScore += 25;
    if (hasMrr) viabilityScore += 20;
    if (ltvCacRatio >= 3) viabilityScore += 30;
    else if (ltvCacRatio >= 1) viabilityScore += 15;
    if (churnRate < 5) viabilityScore += 25;
    else if (churnRate < 10) viabilityScore += 15;
    else if (churnRate < 20) viabilityScore += 5;
    viabilityScore = Math.min(viabilityScore, 100);
    const viabilityDetails: string[] = [];
    if (hasRevenue) viabilityDetails.push(`Revenu: ${Number(lastMetric.revenue).toLocaleString()} TND`);
    if (ltvCacRatio > 0) viabilityDetails.push(`LTV/CAC: ${ltvCacRatio.toFixed(1)}x`);
    if (lastMetric) viabilityDetails.push(`Churn: ${churnRate}%`);
    if (viabilityDetails.length === 0) viabilityDetails.push("Aucune donnée financière");

    // 4. Team Score (0-100)
    const teamSize = t.length;
    const skillCategories = ["technique", "business", "design", "marketing", "leadership", "data", "finance", "operations"];
    const coveredSkills = new Set<string>();
    t.forEach((member: any) => {
      const skills = typeof member.skills === "object" && member.skills !== null ? member.skills : {};
      Object.entries(skills).forEach(([key, val]) => {
        if (Number(val) > 0) coveredSkills.add(key.toLowerCase());
      });
    });
    const skillCoverage = coveredSkills.size / skillCategories.length;
    const avgExperience = t.length > 0 ? t.reduce((sum: number, x: any) => sum + (x.experience_years || 0), 0) / t.length : 0;
    let teamScore = 0;
    if (teamSize >= 2) teamScore += 20;
    if (teamSize >= 3) teamScore += 10;
    teamScore += Math.round(skillCoverage * 40);
    teamScore += Math.min(Math.round(avgExperience * 5), 30);
    teamScore = Math.min(teamScore, 100);
    const teamDetails: string[] = [];
    teamDetails.push(`${teamSize} membre(s)`);
    teamDetails.push(`${coveredSkills.size}/${skillCategories.length} compétences couvertes`);
    if (avgExperience > 0) teamDetails.push(`${avgExperience.toFixed(1)} ans exp. moyenne`);

    // 5. Tests Execution Score (0-100)
    const testsPassed = tr.filter((x: any) => x.status === "passed").length;
    const testsFailed = tr.filter((x: any) => x.status === "failed").length;
    const testsExecuted = testsPassed + testsFailed;
    const testsTotal = tr.length || 1;
    const executionRate = (testsExecuted / testsTotal) * 100;
    const successRate = testsExecuted > 0 ? (testsPassed / testsExecuted) * 100 : 0;
    const testsScore = Math.round(executionRate * 0.4 + successRate * 0.6);
    const testsDetails: string[] = [];
    testsDetails.push(`${testsExecuted}/${tr.length} tests exécutés`);
    if (testsPassed > 0) testsDetails.push(`${testsPassed} réussis`);
    if (testsFailed > 0) testsDetails.push(`${testsFailed} échoués`);
    if (testsDetails.length === 1) testsDetails.push("Aucun test exécuté");

    // 6. Legal/Compliance Readiness (based on scenario + completeness)
    const isLabelScenario = scenario === "B";
    let legalScore = isLabelScenario ? 30 : 10;
    if (validatedHypotheses >= 3) legalScore += 20;
    if (teamSize >= 2) legalScore += 15;
    if (hasRevenue) legalScore += 20;
    if (testsExecuted >= 5) legalScore += 15;
    legalScore = Math.min(legalScore, 100);
    const legalDetails: string[] = [];
    legalDetails.push(isLabelScenario ? "Scénario BM validé" : "Scénario idée seule");
    if (legalScore >= 70) legalDetails.push("Éligible pré-labellisation");
    else legalDetails.push("Compléter les critères requis");

    const allCriteria: MaturityCriteria[] = [
      { key: "innovation", label: "Innovation", icon: Lightbulb, score: innovationScore, maxScore: 100, color: "text-amber-500", bgColor: "bg-amber-500", details: innovationDetails },
      { key: "market", label: "Validation Marché", icon: TrendingUp, score: marketScore, maxScore: 100, color: "text-blue-500", bgColor: "bg-blue-500", details: marketDetails },
      { key: "viability", label: "Viabilité Financière", icon: BarChart3, score: viabilityScore, maxScore: 100, color: "text-emerald-500", bgColor: "bg-emerald-500", details: viabilityDetails },
      { key: "team", label: "Équipe", icon: Users, score: teamScore, maxScore: 100, color: "text-violet-500", bgColor: "bg-violet-500", details: teamDetails },
      { key: "tests", label: "Tests & Exécution", icon: Shield, score: testsScore, maxScore: 100, color: "text-cyan-500", bgColor: "bg-cyan-500", details: testsDetails },
      { key: "legal", label: "Conformité Startup Act", icon: Scale, score: legalScore, maxScore: 100, color: "text-rose-500", bgColor: "bg-rose-500", details: legalDetails },
    ];

    const global = Math.round(allCriteria.reduce((s, c) => s + c.score, 0) / allCriteria.length);
    setCriteria(allCriteria);
    setGlobalScore(global);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const getMaturityLevel = (score: number) => {
    if (score >= 80) return { label: "Mature", color: "bg-emerald-500 text-white" };
    if (score >= 60) return { label: "Avancé", color: "bg-blue-500 text-white" };
    if (score >= 40) return { label: "Intermédiaire", color: "bg-amber-500 text-white" };
    if (score >= 20) return { label: "Débutant", color: "bg-orange-500 text-white" };
    return { label: "Initial", color: "bg-red-500 text-white" };
  };

  const maturity = getMaturityLevel(globalScore);

  return (
    <div className="space-y-6">
      {/* Global Score */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Circular Score */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={globalScore >= 60 ? "hsl(142, 76%, 36%)" : globalScore >= 40 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)"}
                  strokeWidth="10"
                  strokeDasharray={`${(globalScore / 100) * 327} 327`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{globalScore}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <Award className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Score de Maturité Startup Act</h3>
              </div>
              <Badge className={maturity.color + " text-sm px-3 py-1 mb-3"}>{maturity.label}</Badge>
              <p className="text-sm text-muted-foreground">
                {globalScore >= 70
                  ? "Votre projet est bien positionné pour une demande de labellisation Startup Act."
                  : globalScore >= 40
                    ? "Des améliorations sont nécessaires avant de soumettre une demande de labellisation."
                    : "Le projet est en phase initiale. Concentrez-vous sur la validation des hypothèses et les tests."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((c) => {
          const Icon = c.icon;
          const level = getMaturityLevel(c.score);
          return (
            <Card key={c.key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${c.bgColor}/10`}>
                      <Icon className={`h-4 w-4 ${c.color}`} />
                    </div>
                    <CardTitle className="text-sm">{c.label}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">{level.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-2xl font-bold ${c.color}`}>{c.score}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">/100</span>
                </div>
                <Progress
                  value={c.score}
                  className={`h-2 mb-3 [&>div]:${c.bgColor}`}
                />
                <div className="space-y-1">
                  {c.details.map((d, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.bgColor} inline-block`} />
                      {d}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Radar Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Radar de Maturité
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm">
            {/* Background rings */}
            {[20, 40, 60, 80, 100].map((ring) => (
              <polygon
                key={ring}
                points={criteria.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / criteria.length - Math.PI / 2;
                  const r = (ring / 100) * 120;
                  return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                }).join(" ")}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity={0.5}
              />
            ))}
            {/* Axis lines */}
            {criteria.map((_, i) => {
              const angle = (Math.PI * 2 * i) / criteria.length - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1="150" y1="150"
                  x2={150 + 120 * Math.cos(angle)}
                  y2={150 + 120 * Math.sin(angle)}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity={0.3}
                />
              );
            })}
            {/* Data polygon */}
            <polygon
              points={criteria.map((c, i) => {
                const angle = (Math.PI * 2 * i) / criteria.length - Math.PI / 2;
                const r = (c.score / 100) * 120;
                return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
              }).join(" ")}
              fill="hsl(var(--primary) / 0.15)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            {/* Data points & labels */}
            {criteria.map((c, i) => {
              const angle = (Math.PI * 2 * i) / criteria.length - Math.PI / 2;
              const r = (c.score / 100) * 120;
              const labelR = 135;
              return (
                <g key={i}>
                  <circle
                    cx={150 + r * Math.cos(angle)}
                    cy={150 + r * Math.sin(angle)}
                    r="4" fill="hsl(var(--primary))"
                  />
                  <text
                    x={150 + labelR * Math.cos(angle)}
                    y={150 + labelR * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-[9px] font-medium"
                  >
                    {c.label}
                  </text>
                  <text
                    x={150 + (labelR + 12) * Math.cos(angle)}
                    y={150 + (labelR + 12) * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[8px]"
                  >
                    {c.score}%
                  </text>
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupActMaturityDashboard;
