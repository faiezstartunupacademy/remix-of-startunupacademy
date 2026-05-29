import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { knowledgeBaseTests, type KnowledgeBaseTest } from "@/data/knowledgeBaseTests";
import { filterRelevantTests } from "@/utils/mvpTestFilter";

const PHASES = [
  { id: 1, name: "Disruption", objective: "Identifier la disruption et valider problème/cible.", color: [124, 58, 237] as [number, number, number] },
  { id: 2, name: "Réglementaire", objective: "Cartographier certifications, brevets, normes et exigences.", color: [37, 99, 235] as [number, number, number] },
  { id: 3, name: "Running Lean", objective: "Construire Lean Canvas et roadmap MVP.", color: [16, 185, 129] as [number, number, number] },
  { id: 4, name: "MVP ↔ Personas", objective: "Aligner MVP minimal et personas prioritaires.", color: [245, 158, 11] as [number, number, number] },
  { id: 5, name: "Risques", objective: "Identifier risques systémiques et plan de mitigation.", color: [239, 68, 68] as [number, number, number] },
  { id: 6, name: "Métriques", objective: "Définir KPIs et métriques combinées de pilotage.", color: [20, 184, 166] as [number, number, number] },
  { id: 7, name: "Plan Tactique", objective: "Plan d'implémentation 12 mois budget + jalons.", color: [79, 70, 229] as [number, number, number] },
];

interface Props {
  projectId: string;
  projectName: string;
  sector: string | null;
  description?: string | null;
  startupStage: string;
  hasIdea: boolean;
  messages: { role: string; content: string; phase: number }[];
  userId: string;
}

const extractBMPatterns = (messages: { content: string }[]) => {
  const patternRegex = /\b(Freemium|Subscription|Abonnement|Marketplace|Razor and Blade|Long Tail|Crowdfunding|Pay-per-Use|Licensing|Affiliation|White Label|Open Source|Data-Driven|Platform|Two-Sided|Aikido|Lock-In|Mass Customization|Direct Selling|Franchising|Bundling|Subscription SaaS|Commission)\b/gi;
  const found = new Set<string>();
  messages.forEach(m => { const matches = m.content.match(patternRegex); if (matches) matches.forEach(p => found.add(p)); });
  return Array.from(found);
};

const ProjectAnalysisCard = ({ projectId, projectName, sector, description, startupStage, hasIdea, messages, userId }: Props) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      // Fetch founder/team
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", userId).maybeSingle();
      const { data: team } = await supabase.from("project_team_members" as any).select("name, role, email").eq("project_id", projectId);

      const bmPatterns = extractBMPatterns(messages);
      const relevantTests = filterRelevantTests(knowledgeBaseTests, {
        sector: sector || undefined,
        businessModel: bmPatterns[0],
      });

      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      let y = 20;

      // ─── Cover ───
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 50, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("CARTE D'ANALYSE PROJET", pageW / 2, 22, { align: "center" });
      doc.setFontSize(11);
      doc.text("Pôle Stratégique — STARTUNUP", pageW / 2, 32, { align: "center" });
      doc.setFontSize(9);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pageW / 2, 42, { align: "center" });

      y = 60;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.text(projectName, 14, y); y += 8;

      // ─── 1. Fiche Projet ───
      doc.setFontSize(13);
      doc.setTextColor(79, 70, 229);
      doc.text("1. Fiche projet", 14, y); y += 2;
      autoTable(doc, {
        startY: y + 2,
        head: [["Champ", "Valeur"]],
        body: [
          ["Nom", projectName],
          ["Secteur", sector || "—"],
          ["Stade", startupStage],
          ["Statut", hasIdea ? "Idée définie" : "Exploration"],
          ["Description", description || "—"],
        ],
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 8;

      // ─── 2. Fondateur / équipe ───
      doc.setFontSize(13);
      doc.setTextColor(79, 70, 229);
      doc.text("2. Fondateur & équipe", 14, y);
      const teamRows: string[][] = [];
      if (profile) teamRows.push([profile.full_name || "—", "Fondateur", "—"]);
      ((team as any[]) || []).forEach(m => teamRows.push([m.name || "—", m.role || "—", m.email || "—"]));
      if (teamRows.length === 0) teamRows.push(["—", "—", "—"]);
      autoTable(doc, {
        startY: y + 4,
        head: [["Membre", "Rôle", "Contact"]],
        body: teamRows,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 8;

      // ─── 3. Patterns BM ───
      doc.setFontSize(13);
      doc.setTextColor(79, 70, 229);
      doc.text("3. Patterns du Business Model", 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [["#", "Pattern détecté"]],
        body: bmPatterns.length ? bmPatterns.map((p, i) => [String(i + 1), p]) : [["—", "Aucun pattern explicite détecté dans les discussions — à compléter dans la Phase 3."]],
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [236, 72, 153] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;

      // ─── 4. Chronologie 7 phases + Tests MVP ───
      doc.addPage(); y = 20;
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text("4. Chronologie détaillée des 7 phases & tests MVP", 14, y); y += 6;

      PHASES.forEach(phase => {
        const phaseTests = relevantTests.filter(t => t.associated_step === phase.id);
        if (y > 240) { doc.addPage(); y = 20; }

        // Phase header band
        doc.setFillColor(...phase.color);
        doc.rect(14, y, pageW - 28, 9, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(`Phase ${phase.id} — ${phase.name}`, 17, y + 6);
        y += 11;

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.text(`Objectif : ${phase.objective}`, 14, y); y += 4;

        if (phaseTests.length === 0) {
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text("Aucun test spécifique filtré pour cette phase.", 14, y + 2); y += 8;
        } else {
          autoTable(doc, {
            startY: y,
            head: [["#", "Test MVP", "Objectif", "Durée", "Règle de décision", "→ Suivant"]],
            body: phaseTests.map((t: KnowledgeBaseTest, idx) => {
              const next = phaseTests[idx + 1];
              const nextLabel = next
                ? `T${next.test_number}`
                : phase.id < 7 ? `Phase ${phase.id + 1}` : "✓ Fin";
              return [
                `T${t.test_number}`,
                t.name,
                t.objective,
                t.estimated_duration,
                `OK ${t.target_metrics.success_threshold} / KO ${t.target_metrics.failure_threshold}`,
                nextLabel,
              ];
            }),
            styles: { fontSize: 7.5, cellPadding: 1.5, valign: "top" },
            headStyles: { fillColor: phase.color, fontSize: 8 },
            columnStyles: {
              0: { cellWidth: 12 },
              1: { cellWidth: 30 },
              2: { cellWidth: 50 },
              3: { cellWidth: 18 },
              4: { cellWidth: 45 },
              5: { cellWidth: 22 },
            },
            margin: { left: 14, right: 14 },
          });
          y = (doc as any).lastAutoTable.finalY + 6;
        }

        // Phase link arrow
        if (phase.id < 7 && y < 260) {
          doc.setTextColor(120, 120, 120);
          doc.setFontSize(8);
          doc.text(`↓ Transition : valider les seuils de la Phase ${phase.id} avant Phase ${phase.id + 1}`, 14, y);
          y += 6;
        }
      });

      // ─── 5. Schéma Roadmap récap ───
      doc.addPage();
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text("5. Roadmap récapitulative du projet", 14, 20);

      const startX = 14;
      const startY = 35;
      const boxW = (pageW - 28) / 7 - 2;
      const boxH = 28;

      PHASES.forEach((p, i) => {
        const x = startX + i * (boxW + 2);
        doc.setFillColor(...p.color);
        doc.roundedRect(x, startY, boxW, boxH, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(`P${p.id}`, x + boxW / 2, startY + 8, { align: "center" });
        doc.setFontSize(7);
        const lines = doc.splitTextToSize(p.name, boxW - 2);
        doc.text(lines, x + boxW / 2, startY + 14, { align: "center" });
        const count = relevantTests.filter(t => t.associated_step === p.id).length;
        doc.setFontSize(6.5);
        doc.text(`${count} test${count > 1 ? "s" : ""}`, x + boxW / 2, startY + 24, { align: "center" });

        if (i < PHASES.length - 1) {
          doc.setDrawColor(120, 120, 120);
          doc.setLineWidth(0.5);
          doc.line(x + boxW, startY + boxH / 2, x + boxW + 2, startY + boxH / 2);
        }
      });

      // Legend / cycle
      let ly = startY + boxH + 15;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text("Logique d'enchaînement", 14, ly); ly += 6;
      doc.setFontSize(9);
      const legend = [
        "• Chaque phase doit atteindre ses seuils de succès avant de passer à la suivante.",
        "• Les tests MVP d'une phase alimentent les hypothèses de la phase suivante.",
        "• Phase 1 → 2 : la disruption validée définit le périmètre réglementaire.",
        "• Phase 3 → 4 : le Lean Canvas pilote le choix MVP et les personas prioritaires.",
        "• Phase 5 → 6 : les risques identifiés deviennent des métriques de surveillance.",
        "• Phase 7 : consolidation budget + jalons 12 mois et passerelle Incubation.",
      ];
      legend.forEach(line => { doc.text(line, 14, ly); ly += 5; });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`STARTUNUP — Carte d'analyse — ${projectName} — Page ${i}/${totalPages}`, pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
      }

      const filename = `carte-analyse-${projectName.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

      // Archive in storage if available
      try {
        const blob = doc.output("blob");
        await supabase.storage.from("incubation-reports").upload(
          `${userId}/${projectId}/${filename}`,
          blob,
          { upsert: true, contentType: "application/pdf" }
        );
      } catch { /* archival is best-effort */ }

      toast({ title: "Carte d'analyse générée", description: "Le PDF a été téléchargé et archivé." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erreur", description: e.message || "Impossible de générer la carte d'analyse.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button onClick={generate} disabled={generating} variant="outline" size="sm" className="gap-1.5 border-violet-300 text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/30">
      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      Carte d'analyse
    </Button>
  );
};

export default ProjectAnalysisCard;
