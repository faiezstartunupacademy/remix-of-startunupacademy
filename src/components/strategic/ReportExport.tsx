import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strategic-orchestrator`;

interface ReportExportProps {
  projectName: string;
  sector: string | null;
  messages: { role: string; content: string; phase: number }[];
  startupStage: string;
}

const ReportExport = ({ projectName, sector, messages, startupStage }: ReportExportProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Ask AI to generate a consolidated report
      const summaryMessages = messages.map(m => ({ role: m.role, content: `[Phase ${m.phase}] ${m.content}` }));
      summaryMessages.push({
        role: "user",
        content: "Génère maintenant un RAPPORT STRATÉGIQUE COMPLET consolidé de ce projet. Inclus : résumé exécutif, analyse par phase avec tableaux de données, scores chiffrés, matrice de risques, métriques combinées, plan tactique 12 mois, budget estimatif et recommandations finales. Format structuré avec sections numérotées."
      });

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: summaryMessages, mode: "export" }),
      });

      if (!resp.ok || !resp.body) throw new Error("Erreur lors de la génération");

      // Collect full response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullContent += content;
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      if (!fullContent) throw new Error("Rapport vide");

      // Generate PDF
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // Title page
      doc.setFillColor(88, 28, 135); // purple-900
      doc.rect(0, 0, pageWidth, 80, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("Rapport Stratégique", margin, 35);
      doc.setFontSize(18);
      doc.text(projectName, margin, 50);
      doc.setFontSize(12);
      if (sector) doc.text(`Secteur : ${sector}`, margin, 62);
      doc.text(`Profil : ${startupStage}`, margin, 72);

      // Date
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, pageWidth - 20);

      // Content pages
      doc.addPage();
      doc.setTextColor(0, 0, 0);
      y = 20;

      const lines = fullContent.split("\n");
      for (const line of lines) {
        if (y > 270) { doc.addPage(); y = 20; }

        // Parse markdown tables
        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          const cells = line.split("|").filter(c => c.trim() !== "");
          if (cells.some(c => c.trim().match(/^[-:]+$/))) continue; // separator row
          
          // Check if this is a header row (first table row)
          const isHeader = !line.includes("---");
          if (isHeader && cells.length > 1) {
            // Simple table rendering
            const cellWidth = contentWidth / cells.length;
            cells.forEach((cell, i) => {
              doc.setFontSize(8);
              doc.setFont("helvetica", "normal");
              const x = margin + i * cellWidth;
              doc.rect(x, y - 4, cellWidth, 8);
              doc.text(cell.trim().substring(0, 30), x + 2, y + 1);
            });
            y += 10;
          }
          continue;
        }

        if (line.startsWith("# ")) {
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          y += 5;
          doc.text(line.replace("# ", ""), margin, y);
          y += 10;
        } else if (line.startsWith("## ")) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          y += 4;
          doc.text(line.replace("## ", ""), margin, y);
          y += 8;
        } else if (line.startsWith("### ")) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          y += 3;
          doc.text(line.replace("### ", ""), margin, y);
          y += 7;
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const text = line.replace(/^[-*]\s/, "• ").replace(/\*\*/g, "");
          const splitText = doc.splitTextToSize(text, contentWidth - 5);
          doc.text(splitText, margin + 5, y);
          y += splitText.length * 5;
        } else if (line.trim()) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const cleanLine = line.replace(/\*\*/g, "").replace(/\*/g, "");
          const splitText = doc.splitTextToSize(cleanLine, contentWidth);
          doc.text(splitText, margin, y);
          y += splitText.length * 5;
        } else {
          y += 3;
        }
      }

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`StartUnUp Academy — Rapport Stratégique — Page ${i}/${totalPages}`, margin, 290);
      }

      doc.save(`rapport-strategique-${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      toast({ title: "✅ Rapport exporté", description: "Le PDF a été téléchargé avec succès." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateReport}
      disabled={generating}
      variant="outline"
      className="gap-2"
    >
      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {generating ? "Génération du rapport..." : "Exporter le Rapport PDF"}
    </Button>
  );
};

export default ReportExport;
