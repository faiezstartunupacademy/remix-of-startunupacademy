import { useState } from "react";
import { FileDown, Loader2, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type MvpProject = {
  id: string;
  name: string;
  description: string | null;
  sector: string;
  scenario: string;
  cofounders_count: number;
  governorate: string | null;
  sso: string | null;
  incubation_program: string | null;
  status: string;
  created_at: string;
};

interface Props {
  project: MvpProject;
}

const MvpReportPDF = ({ project }: Props) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<"pre-label" | "label">("pre-label");

  const fetchAllData = async () => {
    const [hypotheses, features, personas, metrics, team, testResults] = await Promise.all([
      supabase.from("mvp_hypotheses" as any).select("*").eq("project_id", project.id),
      supabase.from("mvp_features" as any).select("*").eq("project_id", project.id),
      supabase.from("mvp_personas" as any).select("*").eq("project_id", project.id),
      supabase.from("mvp_metrics" as any).select("*").eq("project_id", project.id).order("month"),
      supabase.from("mvp_team_members" as any).select("*").eq("project_id", project.id),
      supabase.from("mvp_test_results" as any).select("*").eq("project_id", project.id),
    ]);
    return {
      hypotheses: (hypotheses.data || []) as any[],
      features: (features.data || []) as any[],
      personas: (personas.data || []) as any[],
      metrics: (metrics.data || []) as any[],
      team: (team.data || []) as any[],
      testResults: (testResults.data || []) as any[],
    };
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const data = await fetchAllData();
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = doc.internal.pageSize.getWidth();
      const margin = 15;
      const cw = pw - margin * 2;
      let y = 20;

      const isLabel = reportType === "label";
      const headerColor = isLabel ? [34, 197, 94] : [37, 99, 235]; // green vs blue

      // --- COVER PAGE ---
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(0, 0, pw, 90, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text(isLabel ? "Dossier de Labellisation" : "Rapport Pré-Labellisation", margin, 30);
      doc.setFontSize(12);
      doc.text("Startup Act — Comité de Labellisation", margin, 40);
      doc.setFontSize(20);
      doc.text(project.name, margin, 55);
      doc.setFontSize(11);
      doc.text(`Secteur: ${project.sector} | Scénario: ${project.scenario === "A" ? "Idée" : "Idée + BM validé"}`, margin, 67);
      if (project.governorate) doc.text(`Gouvernorat: ${project.governorate}`, margin, 75);
      if (project.sso) doc.text(`SSO: ${project.sso}`, margin, 83);
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pw - 60, 88);

      // --- TABLE OF CONTENTS ---
      doc.addPage();
      doc.setTextColor(0); doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.text("Table des Matières", margin, 25); y = 40;
      const sections = [
        "1. Résumé Exécutif",
        "2. Fiche Projet",
        "3. Hypothèses de Validation",
        "4. Fonctionnalités MVP",
        "5. Personas & Segments",
        "6. Résultats des Tests",
        "7. Métriques de Performance",
        "8. Évaluation Équipe",
        ...(isLabel ? ["9. Analyse de Maturité", "10. Recommandations Finales"] : ["9. Prochaines Étapes"]),
      ];
      doc.setFontSize(12); doc.setFont("helvetica", "normal");
      sections.forEach(s => { doc.text(s, margin, y); y += 8; });

      // --- SECTION 1: RÉSUMÉ ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("1. Résumé Exécutif", margin, y); y += 12;
      doc.setTextColor(0); doc.setFontSize(10); doc.setFont("helvetica", "normal");

      const validatedH = data.hypotheses.filter((h: any) => h.validation_status === "validé").length;
      const totalH = data.hypotheses.length;
      const testedF = data.features.filter((f: any) => f.tested).length;
      const totalF = data.features.length;
      const completedTests = data.testResults.filter((t: any) => t.status === "completed").length;
      const validationScore = totalH > 0 ? Math.round((validatedH / totalH) * 100) : 0;

      const summary = [
        `• Projet : ${project.name} (${project.sector})`,
        `• ${totalH} hypothèses définies, ${validatedH} validées (${validationScore}%)`,
        `• ${totalF} fonctionnalités, ${testedF} testées`,
        `• ${completedTests}/${data.testResults.length} tests complétés`,
        `• ${data.personas.length} personas identifiés`,
        `• ${data.team.length} membres d'équipe`,
        `• ${data.metrics.length} mois de données métriques`,
      ];
      summary.forEach(line => {
        const s = doc.splitTextToSize(line, cw);
        doc.text(s, margin, y); y += s.length * 5 + 1;
      });

      // Score global
      y += 5;
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.roundedRect(margin, y, cw, 18, 3, 3, "F");
      doc.setTextColor(255);
      doc.text(`Score de Validation Global : ${validationScore}%`, margin + 5, y + 12);
      doc.setTextColor(0); y += 25;

      // --- SECTION 2: FICHE PROJET ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("2. Fiche Projet", margin, y); y += 12;
      doc.setTextColor(0);

      const projectData = [
        ["Nom", project.name],
        ["Description", project.description || "—"],
        ["Secteur", project.sector],
        ["Scénario", project.scenario === "A" ? "Idée seule" : "Idée + BM validé"],
        ["Cofondateurs", String(project.cofounders_count)],
        ["Gouvernorat", project.governorate || "—"],
        ["SSO", project.sso || "Aucun"],
        ["Programme", project.incubation_program || "—"],
        ["Statut", project.status],
        ["Date de création", new Date(project.created_at).toLocaleDateString("fr-FR")],
      ];
      autoTable(doc, {
        startY: y, head: [["Champ", "Valeur"]], body: projectData,
        theme: "striped", headStyles: { fillColor: headerColor as any },
        margin: { left: margin, right: margin },
      });
      y = (doc as any).lastAutoTable.finalY + 10;

      // --- SECTION 3: HYPOTHÈSES ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("3. Hypothèses de Validation", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.hypotheses.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Hypothèse", "Type", "Statut", "Confiance", "Poids"]],
          body: data.hypotheses.map((h: any) => [
            h.description?.substring(0, 50) || "", h.type || "", h.validation_status || "",
            `${h.confidence_score}%`, String(h.weight),
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
          columnStyles: { 0: { cellWidth: 60 } },
        });
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucune hypothèse définie.", margin, y);
      }

      // --- SECTION 4: FONCTIONNALITÉS ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("4. Fonctionnalités MVP", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.features.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Fonctionnalité", "Priorité", "Avancement", "Testée", "Résultat"]],
          body: data.features.map((f: any) => [
            f.name, f.priority, `${f.completion_percentage}%`,
            f.tested ? "✅" : "❌", f.test_result || "—",
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
        });
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucune fonctionnalité définie.", margin, y);
      }

      // --- SECTION 5: PERSONAS ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("5. Personas & Segments", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.personas.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Persona", "Early Adopter", "Interviews", "Satisfaction", "Conversion"]],
          body: data.personas.map((p: any) => [
            p.name, p.is_early_adopter ? "✅" : "❌",
            `${p.interviews_done}/${p.interviews_target}`,
            `${p.satisfaction_score}/10`, `${p.conversion_rate}%`,
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
        });
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucun persona défini.", margin, y);
      }

      // --- SECTION 6: TESTS ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("6. Résultats des Tests", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.testResults.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Test ID", "Statut", "Résultat Quanti.", "Résultat Quali."]],
          body: data.testResults.map((t: any) => [
            t.test_id?.substring(0, 8) || "—", t.status,
            t.quantitative_result != null ? String(t.quantitative_result) : "—",
            t.qualitative_result?.substring(0, 40) || "—",
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
        });
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucun résultat de test.", margin, y);
      }

      // --- SECTION 7: MÉTRIQUES ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("7. Métriques de Performance", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.metrics.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Mois", "Revenue", "MRR", "CAC", "LTV", "Churn", "NPS", "Burn Rate", "Users"]],
          body: data.metrics.map((m: any) => [
            m.month, `${m.revenue || 0} TND`, `${m.mrr || 0}`, `${m.cac || 0}`,
            `${m.ltv || 0}`, `${m.churn_rate || 0}%`, String(m.nps || 0),
            `${m.burn_rate || 0}`, String(m.users_count || 0),
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any, fontSize: 7 },
          margin: { left: margin, right: margin }, styles: { fontSize: 7 },
        });

        // LTV/CAC ratio
        y = (doc as any).lastAutoTable.finalY + 10;
        const lastMetric = data.metrics[data.metrics.length - 1] as any;
        if (lastMetric?.cac && lastMetric?.ltv && lastMetric.cac > 0) {
          const ratio = (lastMetric.ltv / lastMetric.cac).toFixed(2);
          doc.setFontSize(12); doc.setFont("helvetica", "bold");
          doc.text(`Ratio LTV/CAC : ${ratio}x`, margin, y);
          y += 6;
          doc.setFontSize(9); doc.setFont("helvetica", "normal");
          doc.text(parseFloat(ratio) >= 3 ? "✅ Ratio sain (≥3x)" : "⚠️ Ratio à améliorer (<3x)", margin, y);
          y += 8;
        }

        // --- CHARTS PAGE ---
        doc.addPage(); y = 20;
        doc.setFontSize(16); doc.setFont("helvetica", "bold");
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.text("7.1 Graphiques de Performance", margin, y); y += 14;
        doc.setTextColor(0);

        const metrics = data.metrics as any[];
        const chartLeft = margin;
        const chartW = cw;
        const chartH = 45;
        const barGap = 2;

        // Helper: draw a bar chart
        const drawBarChart = (
          title: string, values: number[], labels: string[],
          color: number[], startY: number
        ) => {
          doc.setFontSize(10); doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          doc.text(title, chartLeft, startY);
          const cy = startY + 4;
          const maxVal = Math.max(...values, 1);
          const barW = Math.min((chartW - (values.length - 1) * barGap) / values.length, 20);
          const totalBarsW = values.length * barW + (values.length - 1) * barGap;
          const offsetX = chartLeft + (chartW - totalBarsW) / 2;

          // Axis
          doc.setDrawColor(200); doc.setLineWidth(0.3);
          doc.line(chartLeft, cy + chartH, chartLeft + chartW, cy + chartH);

          values.forEach((v, i) => {
            const barH = (v / maxVal) * (chartH - 5);
            const x = offsetX + i * (barW + barGap);
            const by = cy + chartH - barH;
            doc.setFillColor(color[0], color[1], color[2]);
            doc.roundedRect(x, by, barW, barH, 1, 1, "F");
            // Value label
            doc.setFontSize(6); doc.setFont("helvetica", "bold");
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(String(Math.round(v)), x + barW / 2, by - 2, { align: "center" });
            // Month label
            doc.setFontSize(5); doc.setTextColor(100);
            doc.text(labels[i]?.substring(0, 7) || "", x + barW / 2, cy + chartH + 4, { align: "center" });
          });
          return cy + chartH + 10;
        };

        // Helper: draw a line/sparkline chart
        const drawLineChart = (
          title: string, series: { values: number[]; color: number[]; label: string }[],
          labels: string[], startY: number
        ) => {
          doc.setFontSize(10); doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          doc.text(title, chartLeft, startY);
          const cy = startY + 4;
          const allVals = series.flatMap(s => s.values);
          const maxVal = Math.max(...allVals, 1);
          const minVal = Math.min(...allVals, 0);
          const range = maxVal - minVal || 1;

          // Grid
          doc.setDrawColor(230); doc.setLineWidth(0.2);
          for (let g = 0; g <= 4; g++) {
            const gy = cy + (chartH / 4) * g;
            doc.line(chartLeft, gy, chartLeft + chartW, gy);
            doc.setFontSize(5); doc.setTextColor(150);
            const gv = maxVal - (range / 4) * g;
            doc.text(String(Math.round(gv)), chartLeft - 1, gy + 1, { align: "right" });
          }

          // X labels
          const pts = labels.length;
          labels.forEach((l, i) => {
            const x = chartLeft + (i / Math.max(pts - 1, 1)) * chartW;
            doc.setFontSize(5); doc.setTextColor(100);
            doc.text(l?.substring(0, 7) || "", x, cy + chartH + 4, { align: "center" });
          });

          // Lines
          series.forEach(s => {
            doc.setDrawColor(s.color[0], s.color[1], s.color[2]);
            doc.setLineWidth(0.8);
            for (let i = 1; i < s.values.length; i++) {
              const x1 = chartLeft + ((i - 1) / Math.max(pts - 1, 1)) * chartW;
              const x2 = chartLeft + (i / Math.max(pts - 1, 1)) * chartW;
              const y1 = cy + chartH - ((s.values[i - 1] - minVal) / range) * (chartH - 2);
              const y2 = cy + chartH - ((s.values[i] - minVal) / range) * (chartH - 2);
              doc.line(x1, y1, x2, y2);
            }
            // Dots
            doc.setFillColor(s.color[0], s.color[1], s.color[2]);
            s.values.forEach((v, i) => {
              const x = chartLeft + (i / Math.max(pts - 1, 1)) * chartW;
              const yy = cy + chartH - ((v - minVal) / range) * (chartH - 2);
              doc.circle(x, yy, 1, "F");
            });
          });

          // Legend
          let lx = chartLeft;
          series.forEach(s => {
            doc.setFillColor(s.color[0], s.color[1], s.color[2]);
            doc.rect(lx, cy + chartH + 7, 4, 2, "F");
            doc.setFontSize(6); doc.setTextColor(80);
            doc.text(s.label, lx + 5, cy + chartH + 9);
            lx += doc.getTextWidth(s.label) + 12;
          });

          return cy + chartH + 14;
        };

        const months = metrics.map(m => m.month);

        // Chart 1: Revenue & MRR (bar chart)
        y = drawBarChart(
          "Revenue (TND)", metrics.map(m => Number(m.revenue) || 0), months,
          [37, 99, 235], y
        );

        // Chart 2: MRR trend (line)
        y = drawLineChart("MRR & LTV Évolution", [
          { values: metrics.map(m => Number(m.mrr) || 0), color: [34, 197, 94], label: "MRR" },
          { values: metrics.map(m => Number(m.ltv) || 0), color: [168, 85, 247], label: "LTV" },
        ], months, y);

        // Chart 3: CAC & Burn Rate
        if (y > 200) { doc.addPage(); y = 20; }
        y = drawBarChart(
          "CAC (TND)", metrics.map(m => Number(m.cac) || 0), months,
          [239, 68, 68], y
        );

        // Chart 4: Churn & NPS line
        y = drawLineChart("Churn Rate (%) & NPS", [
          { values: metrics.map(m => Number(m.churn_rate) || 0), color: [239, 68, 68], label: "Churn %" },
          { values: metrics.map(m => Number(m.nps) || 0), color: [34, 197, 94], label: "NPS" },
        ], months, y);

        // Chart 5: Users growth
        if (y > 200) { doc.addPage(); y = 20; }
        y = drawLineChart("Croissance Utilisateurs", [
          { values: metrics.map(m => Number(m.users_count) || 0), color: [37, 99, 235], label: "Users" },
          { values: metrics.map(m => Number(m.burn_rate) || 0), color: [239, 68, 68], label: "Burn Rate" },
        ], months, y);

      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucune donnée de métriques.", margin, y);
      }

      // --- SECTION 8: ÉQUIPE ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.text("8. Évaluation Équipe", margin, y); y += 12;
      doc.setTextColor(0);

      if (data.team.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [["Nom", "Rôle", "Expérience", "Disponibilité"]],
          body: data.team.map((t: any) => [
            t.name, t.role, `${t.experience_years || 0} ans`, `${t.availability_percent}%`,
          ]),
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 15;

        // --- RADAR CHART: Team Skills ---
        const skillKeys = ["technique", "business", "design", "marketing", "leadership", "data", "finance", "operations"];
        const skillLabels = ["Technique", "Business", "Design", "Marketing", "Leadership", "Data", "Finance", "Opérations"];
        const avgSkills = skillKeys.map(k => {
          const vals = data.team.map((t: any) => {
            const s = typeof t.skills === "object" && t.skills ? t.skills : {};
            return Number(s[k]) || 0;
          });
          return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
        });
        const maxSkill = Math.max(...avgSkills, 10);

        // Check if we need a new page
        if (y > 160) { doc.addPage(); y = 20; }

        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(0);
        doc.text("8.1 Radar des Compétences Équipe", margin, y); y += 8;

        const cx = pw / 2;
        const cy = y + 55;
        const radius = 45;
        const n = skillKeys.length;
        const angleStep = (2 * Math.PI) / n;

        // Draw concentric rings
        for (let ring = 1; ring <= 4; ring++) {
          const r = (radius / 4) * ring;
          doc.setDrawColor(220); doc.setLineWidth(0.2);
          const pts: [number, number][] = [];
          for (let i = 0; i < n; i++) {
            const angle = -Math.PI / 2 + i * angleStep;
            pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
          }
          for (let i = 0; i < n; i++) {
            doc.line(pts[i][0], pts[i][1], pts[(i + 1) % n][0], pts[(i + 1) % n][1]);
          }
        }

        // Draw axes and labels
        for (let i = 0; i < n; i++) {
          const angle = -Math.PI / 2 + i * angleStep;
          const ex = cx + radius * Math.cos(angle);
          const ey = cy + radius * Math.sin(angle);
          doc.setDrawColor(200); doc.setLineWidth(0.3);
          doc.line(cx, cy, ex, ey);

          // Label
          const lx = cx + (radius + 8) * Math.cos(angle);
          const ly = cy + (radius + 8) * Math.sin(angle);
          doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(60);
          const align = Math.cos(angle) < -0.1 ? "right" : Math.cos(angle) > 0.1 ? "left" : "center";
          doc.text(`${skillLabels[i]} (${avgSkills[i].toFixed(1)})`, lx, ly + 1, { align: align as any });
        }

        // Draw data polygon (filled)
        const dataPoints: [number, number][] = avgSkills.map((v, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const r = (v / maxSkill) * radius;
          return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
        });

        // Fill
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setGState(new (doc as any).GState({ opacity: 0.2 }));
        // Draw filled polygon manually using triangles from center
        for (let i = 0; i < n; i++) {
          const p1 = dataPoints[i];
          const p2 = dataPoints[(i + 1) % n];
          doc.triangle(cx, cy, p1[0], p1[1], p2[0], p2[1], "F");
        }
        doc.setGState(new (doc as any).GState({ opacity: 1 }));

        // Outline
        doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setLineWidth(1);
        for (let i = 0; i < n; i++) {
          doc.line(dataPoints[i][0], dataPoints[i][1], dataPoints[(i + 1) % n][0], dataPoints[(i + 1) % n][1]);
        }

        // Dots
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        dataPoints.forEach(p => doc.circle(p[0], p[1], 1.5, "F"));

        // Adequacy score
        const avgAll = avgSkills.reduce((a, b) => a + b, 0) / avgSkills.length;
        const covered = avgSkills.filter(v => v > 0).length;
        const score = Math.round((covered / n) * 60 + (avgAll / maxSkill) * 40);

        y = cy + radius + 18;
        doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(0);
        doc.text(`Score d'adéquation équipe : ${score}/100`, margin, y);
        y += 5;
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
        doc.text(`Couverture : ${covered}/${n} compétences | Moyenne : ${avgAll.toFixed(1)}/10`, margin, y);
        y += 10;
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Aucun membre d'équipe défini.", margin, y);
      }

      // --- SECTION 9 (LABEL): MATURITÉ or PROCHAINES ÉTAPES ---
      doc.addPage(); y = 20;
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);

      if (isLabel) {
        doc.text("9. Analyse de Maturité — Labellisation", margin, y); y += 12;
        doc.setTextColor(0); doc.setFontSize(10); doc.setFont("helvetica", "normal");

        const criteria = [
          ["Innovation technologique", validationScore > 60 ? "✅ Satisfaisant" : "⚠️ À renforcer"],
          ["Viabilité économique", data.metrics.length > 0 ? "✅ Données disponibles" : "❌ Insuffisant"],
          ["Équipe fondatrice", data.team.length >= 2 ? "✅ Équipe constituée" : "⚠️ Renforcer l'équipe"],
          ["Validation marché", validatedH > 0 ? "✅ Hypothèses validées" : "❌ Aucune validation"],
          ["Potentiel de croissance", data.metrics.some((m: any) => m.mrr > 0) ? "✅ Revenus détectés" : "⚠️ Pré-revenu"],
          ["Propriété intellectuelle", "À vérifier manuellement"],
          ["Conformité réglementaire", "À vérifier manuellement"],
        ];
        autoTable(doc, {
          startY: y,
          head: [["Critère Startup Act", "Évaluation"]],
          body: criteria,
          theme: "striped", headStyles: { fillColor: headerColor as any },
          margin: { left: margin, right: margin },
        });

        y = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(18); doc.setFont("helvetica", "bold");
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.text("10. Recommandations Finales", margin, y); y += 12;
        doc.setTextColor(0); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const recs = [
          "• Compléter la validation de toutes les hypothèses critiques avant soumission",
          "• Documenter les brevets et certifications obtenus ou en cours",
          "• Présenter au moins 3 mois de données métriques cohérentes",
          "• S'assurer de la conformité avec les exigences du Startup Act tunisien",
          "• Préparer un pitch deck aligné avec les données de ce rapport",
        ];
        recs.forEach(r => { doc.text(r, margin, y); y += 6; });
      } else {
        doc.text("9. Prochaines Étapes", margin, y); y += 12;
        doc.setTextColor(0); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const steps = [
          "• Valider les hypothèses de marché restantes via des interviews clients",
          "• Lancer les tests MVP prioritaires identifiés",
          "• Compléter l'équipe avec les compétences manquantes",
          "• Collecter les premières métriques (CAC, LTV, NPS)",
          "• Préparer le dossier de labellisation Startup Act",
          "• Identifier les certifications et normes applicables au secteur",
        ];
        steps.forEach(s => { doc.text(s, margin, y); y += 6; });
      }

      // --- FOOTERS ---
      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        doc.text(`StartUnUp Academy — ${isLabel ? "Dossier Labellisation" : "Rapport Pré-Label"} — Page ${i}/${total}`, margin, 290);
      }

      doc.save(`${isLabel ? "labellisation" : "pre-label"}-${project.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      toast({ title: "✅ Rapport PDF généré", description: `${isLabel ? "Dossier de labellisation" : "Rapport pré-label"} téléchargé.` });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-primary" />
          Module 6 — Rapports PDF Startup Act
        </CardTitle>
        <CardDescription>
          Génération de rapports structurés pour les comités de labellisation.
          Inclut validation, métriques, équipe et analyse de maturité.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={reportType} onValueChange={v => setReportType(v as any)}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="pre-label" className="gap-2">
              📋 Pré-Labellisation
            </TabsTrigger>
            <TabsTrigger value="label" className="gap-2">
              🏅 Labellisation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pre-label" className="mt-4">
            <div className="rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 p-6 space-y-3">
              <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300">Rapport Pré-Labellisation</h3>
              <p className="text-sm text-muted-foreground">
                Rapport préparatoire incluant l'état d'avancement du projet, les hypothèses validées,
                les tests réalisés et les prochaines étapes avant soumission au comité.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Fiche projet</Badge>
                <Badge variant="outline">Hypothèses</Badge>
                <Badge variant="outline">Fonctionnalités</Badge>
                <Badge variant="outline">Personas</Badge>
                <Badge variant="outline">Tests</Badge>
                <Badge variant="outline">Métriques</Badge>
                <Badge variant="outline">Équipe</Badge>
                <Badge variant="outline">Prochaines étapes</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="label" className="mt-4">
            <div className="rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 p-6 space-y-3">
              <h3 className="font-semibold text-lg text-emerald-700 dark:text-emerald-300">Dossier de Labellisation</h3>
              <p className="text-sm text-muted-foreground">
                Dossier complet pour soumission au comité de labellisation Startup Act.
                Inclut l'analyse de maturité selon les critères officiels et les recommandations.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Fiche projet</Badge>
                <Badge variant="outline">Hypothèses</Badge>
                <Badge variant="outline">Fonctionnalités</Badge>
                <Badge variant="outline">Personas</Badge>
                <Badge variant="outline">Tests</Badge>
                <Badge variant="outline">Métriques</Badge>
                <Badge variant="outline">Équipe</Badge>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300">Analyse maturité</Badge>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300">Recommandations</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={generatePDF}
          disabled={generating}
          size="lg"
          className="w-full gap-2"
        >
          {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileDown className="h-5 w-5" />}
          {generating
            ? "Génération en cours..."
            : `Générer le ${reportType === "label" ? "Dossier de Labellisation" : "Rapport Pré-Label"} PDF`
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default MvpReportPDF;
