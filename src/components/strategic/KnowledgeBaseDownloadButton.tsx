import { useState } from "react";
import { BookDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { knowledgeBaseTests } from "@/data/knowledgeBaseTests";

interface Props {
  variant?: "outline" | "default" | "secondary";
  size?: "sm" | "default";
  className?: string;
}

const KnowledgeBaseDownloadButton = ({ variant = "outline", size = "sm", className }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();

      // Cover
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 55, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("BASE DE CONNAISSANCE", pageW / 2, 24, { align: "center" });
      doc.setFontSize(13);
      doc.text("Tests MVP — STARTUNUP", pageW / 2, 34, { align: "center" });
      doc.setFontSize(9);
      doc.text(`${knowledgeBaseTests.length} tests · Généré le ${new Date().toLocaleDateString("fr-FR")}`, pageW / 2, 46, { align: "center" });

      // Group by associated_step
      const byStep = new Map<number, typeof knowledgeBaseTests>();
      knowledgeBaseTests.forEach(t => {
        if (!byStep.has(t.associated_step)) byStep.set(t.associated_step, []);
        byStep.get(t.associated_step)!.push(t);
      });

      const stepNames: Record<number, string> = {
        1: "Disruption", 2: "Réglementaire", 3: "Running Lean",
        4: "MVP ↔ Personas", 5: "Risques", 6: "Métriques", 7: "Plan Tactique",
      };

      let y = 70;
      Array.from(byStep.keys()).sort((a, b) => a - b).forEach(step => {
        const tests = byStep.get(step)!;
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFillColor(79, 70, 229);
        doc.rect(14, y, pageW - 28, 9, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(`Étape ${step} — ${stepNames[step] || ""} (${tests.length} tests)`, 17, y + 6);
        y += 12;

        autoTable(doc, {
          startY: y,
          head: [["#", "Test", "Catégorie", "Objectif", "Durée", "Difficulté", "Seuil OK / KO"]],
          body: tests.map(t => [
            `T${t.test_number}`,
            t.name,
            t.category,
            t.objective,
            t.estimated_duration,
            t.difficulty_level,
            `OK ${t.target_metrics.success_threshold} / KO ${t.target_metrics.failure_threshold}`,
          ]),
          styles: { fontSize: 7.5, cellPadding: 1.5, valign: "top" },
          headStyles: { fillColor: [79, 70, 229], fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 12 },
            1: { cellWidth: 30 },
            2: { cellWidth: 22 },
            3: { cellWidth: 55 },
            4: { cellWidth: 20 },
            5: { cellWidth: 18 },
            6: { cellWidth: 30 },
          },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 6;
      });

      // Detailed section: protocols
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(15);
      doc.text("Protocoles détaillés", 14, 20);
      let dy = 30;

      knowledgeBaseTests.forEach(t => {
        if (dy > 260) { doc.addPage(); dy = 20; }
        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229);
        doc.text(`T${t.test_number} — ${t.name}`, 14, dy); dy += 5;
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const desc = doc.splitTextToSize(t.description, pageW - 28);
        doc.text(desc, 14, dy); dy += desc.length * 4 + 2;

        const protocolLines: string[] = [];
        t.detailed_protocol.forEach((step, i) => {
          protocolLines.push(...doc.splitTextToSize(`${i + 1}. ${step}`, pageW - 32));
        });
        if (dy + protocolLines.length * 4 > 285) { doc.addPage(); dy = 20; }
        doc.setTextColor(40, 40, 40);
        doc.text(protocolLines, 18, dy);
        dy += protocolLines.length * 4 + 2;

        doc.setTextColor(100, 100, 100);
        doc.text(`Outils : ${t.recommended_tools.join(", ")}`, 14, dy); dy += 4;
        doc.text(`Tags : ${t.tags.join(", ")}`, 14, dy); dy += 7;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`STARTUNUP — Base de connaissance Tests MVP — Page ${i}/${totalPages}`, pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
      }

      doc.save(`base-connaissance-tests-mvp-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast({ title: "Téléchargement lancé", description: `${knowledgeBaseTests.length} tests exportés en PDF.` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erreur", description: e.message || "Impossible de générer le PDF.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} variant={variant} size={size} className={`gap-1.5 ${className || ""}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookDown className="h-4 w-4" />}
      Base de connaissance MVP
    </Button>
  );
};

export default KnowledgeBaseDownloadButton;
