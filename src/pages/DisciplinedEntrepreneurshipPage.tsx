import { useState, useMemo } from "react";
import { ArrowLeft, BookOpen, FileDown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DisciplinedEntrepreneurshipPresentation from "@/components/DisciplinedEntrepreneurshipPresentation";
import { DISCIPLINED_ENTREPRENEURSHIP_SLIDES } from "@/data/disciplinedEntrepreneurshipSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";
import { useToast } from "@/hooks/use-toast";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import jsPDF from "jspdf";

const DisciplinedEntrepreneurshipPage = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();
  const formationContext = useMemo(() => buildFormationContext(DISCIPLINED_ENTREPRENEURSHIP_SLIDES), []);

  const exportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // Title page
      doc.setFillColor(88, 28, 135);
      doc.rect(0, 0, pageWidth, 85, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.text("Disciplined Entrepreneurship", margin, 30);
      doc.setFontSize(18);
      doc.text("Startup Tactics — 15 Tactiques", margin, 45);
      doc.setFontSize(12);
      doc.text("Bill Aulet & Paul Cheek — MIT", margin, 60);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 75);

      // Content
      const slides = DISCIPLINED_ENTREPRENEURSHIP_SLIDES.map(s => mapComplexSlide(s));

      for (const slide of slides) {
        doc.addPage();
        y = 20;

        // Slide header
        doc.setFillColor(88, 28, 135);
        doc.rect(0, 0, pageWidth, 30, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const titleText = `Slide ${slide.id} — ${slide.title}`;
        const titleLines = doc.splitTextToSize(titleText, contentWidth);
        doc.text(titleLines, margin, 15);
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        if (slide.module) doc.text(slide.module, margin, 25);

        y = 38;
        doc.setTextColor(0, 0, 0);

        // Subtitle
        if (slide.subtitle) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          const subLines = doc.splitTextToSize(slide.subtitle, contentWidth);
          doc.text(subLines, margin, y);
          y += subLines.length * 5 + 4;
        }

        // Content
        if (slide.content) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          for (const line of slide.content) {
            if (y > 270) { doc.addPage(); y = 20; }
            const cleanLine = line.replace(/\*\*/g, "");
            const splitText = doc.splitTextToSize(cleanLine, contentWidth);
            doc.text(splitText, margin, y);
            y += splitText.length * 5 + 2;
          }
        }

        // Key points
        if (slide.keyPoints && slide.keyPoints.length > 0) {
          y += 3;
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Points clés :", margin, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          for (const kp of slide.keyPoints) {
            if (y > 270) { doc.addPage(); y = 20; }
            const cleanKp = `• ${kp.replace(/\*\*/g, "")}`;
            const splitKp = doc.splitTextToSize(cleanKp, contentWidth - 5);
            doc.text(splitKp, margin + 3, y);
            y += splitKp.length * 5 + 1;
          }
        }

        // Tips
        if (slide.tips && slide.tips.length > 0) {
          y += 3;
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("💡 Tips animateur :", margin, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          for (const tip of slide.tips) {
            if (y > 270) { doc.addPage(); y = 20; }
            const splitTip = doc.splitTextToSize(`→ ${tip}`, contentWidth - 5);
            doc.text(splitTip, margin + 3, y);
            y += splitTip.length * 5 + 1;
          }
        }

        // Examples
        if (slide.examples && slide.examples.length > 0) {
          y += 3;
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("📋 Études de cas :", margin, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          for (const ex of slide.examples) {
            if (y > 270) { doc.addPage(); y = 20; }
            const cleanEx = ex.replace(/\*\*/g, "");
            const splitEx = doc.splitTextToSize(cleanEx, contentWidth - 5);
            doc.text(splitEx, margin + 3, y);
            y += splitEx.length * 5 + 1;
          }
        }

        // Quote
        if (slide.quote) {
          y += 5;
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          const quoteText = `"${slide.quote.text}" — ${slide.quote.author}`;
          const splitQ = doc.splitTextToSize(quoteText, contentWidth - 10);
          doc.text(splitQ, margin + 5, y);
        }
      }

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`StartUnUp Academy — Disciplined Entrepreneurship Tactics — Page ${i}/${totalPages}`, margin, 290);
      }

      doc.save("disciplined-entrepreneurship-startup-tactics.pdf");
      toast({ title: "✅ PDF exporté", description: "Le rapport a été téléchargé avec succès." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  if (showPresentation) {
    return <DisciplinedEntrepreneurshipPresentation onClose={() => setShowPresentation(false)} />;
  }

  const modules = [
    { phase: "Phase 1 : Découverte", tactics: ["#1 Get Started", "#2 Segmentation", "#3 End-User Profile"], color: "from-blue-500 to-cyan-500" },
    { phase: "Phase 2 : Validation", tactics: ["#4 Calculer TAM", "#5 Value Proposition", "#6 Persona Deep Dive"], color: "from-emerald-500 to-teal-500" },
    { phase: "Phase 3 : Exécution", tactics: ["#7 Cycle de Vie Client", "#8 Quantifier VP", "#9 Core / Moat"], color: "from-orange-500 to-amber-500" },
    { phase: "Phase 4 : Monétisation", tactics: ["#10 Business Model", "#11 Pricing"], color: "from-purple-500 to-pink-500" },
    { phase: "Phase 5 : Produit", tactics: ["#12 MVP Design", "#13 Test Hypothèses"], color: "from-red-500 to-rose-500" },
    { phase: "Phase 6 : Croissance", tactics: ["#14 Acquisition Client", "#15 Plan de Croissance"], color: "from-indigo-500 to-violet-500" },
  ];

  return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="gradient-hero py-20 relative overflow-hidden">
            <div className="container relative z-10">
              <Link to="/formations" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors text-sm">
                <ArrowLeft className="h-4 w-4" /> Retour aux formations
              </Link>
              <div className="max-w-3xl">
                <Badge className="bg-white/10 text-white border-white/20 mb-4">MIT — Bill Aulet & Paul Cheek</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Disciplined Entrepreneurship</h1>
                <p className="text-xl text-white/80 mb-6">15 Tactiques pour transformer une idée en entreprise rentable — Séance pratique orientée action, processus et métriques.</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => setShowPresentation(true)} className="gap-2 bg-white text-purple-900 hover:bg-white/90">
                    <BookOpen className="h-5 w-5" /> Lancer la Présentation
                  </Button>
                  <Button size="lg" variant="outline" onClick={exportPDF} disabled={exporting} className="gap-2 border-white/30 text-white hover:bg-white/10">
                    {exporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileDown className="h-5 w-5" />}
                    {exporting ? "Export en cours..." : "Exporter PDF Complet"}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 container">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Structure de la formation — 6 Phases, 15 Tactiques</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${mod.color} mb-4`} />
                  <h3 className="font-bold text-lg text-foreground mb-3">{mod.phase}</h3>
                  <ul className="space-y-2">
                    {mod.tactics.map((t, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
        <FormationChatbot formationName="Disciplined Entrepreneurship" formationContext={formationContext} />
      </div>
  );
};

export default DisciplinedEntrepreneurshipPage;
