import { useRef } from "react";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoStartunup from "@/assets/logo_startunup_new.png";

type Props = {
  fullName: string;
  formationTitle: string;
  quizScore: number;
  caseStudyScore: number;
  date: string;
};

const FormationBadge = ({ fullName, formationTitle, quizScore, caseStudyScore, date }: Props) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const totalScore = Math.round((quizScore + caseStudyScore) / 2);

  const getLevel = (s: number) => {
    if (s >= 90) return { label: "Expert", color: "from-purple-600 to-indigo-600" };
    if (s >= 75) return { label: "Avancé", color: "from-amber-500 to-orange-500" };
    if (s >= 60) return { label: "Intermédiaire", color: "from-blue-500 to-cyan-500" };
    return { label: "Basique", color: "from-gray-500 to-gray-600" };
  };

  const level = getLevel(totalScore);

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [180, 120] });

      // Background
      doc.setFillColor(15, 15, 30);
      doc.rect(0, 0, 180, 120, "F");

      // Border
      doc.setDrawColor(124, 58, 237);
      doc.setLineWidth(1.5);
      doc.roundedRect(5, 5, 170, 110, 4, 4);

      // Header
      doc.setFontSize(10);
      doc.setTextColor(124, 58, 237);
      doc.text("STARTUNUP ACADEMY", 90, 18, { align: "center" });

      // Title
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("BADGE DE FORMATION", 90, 30, { align: "center" });

      // Name
      doc.setFontSize(14);
      doc.setTextColor(200, 180, 255);
      doc.text(fullName, 90, 45, { align: "center" });

      // Formation
      doc.setFontSize(11);
      doc.setTextColor(180, 180, 200);
      doc.text(formationTitle, 90, 55, { align: "center" });

      // Scores
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 170);
      doc.text(`QCM: ${quizScore}% | Étude de cas: ${caseStudyScore}%`, 90, 68, { align: "center" });

      // Total score
      doc.setFontSize(24);
      doc.setTextColor(124, 58, 237);
      doc.text(`${totalScore}/100`, 90, 82, { align: "center" });

      // Level badge
      doc.setFontSize(12);
      doc.setTextColor(255, 215, 0);
      doc.text(`Niveau: ${level.label}`, 90, 92, { align: "center" });

      // Date
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 140);
      doc.text(`Délivré le ${new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, 90, 105, { align: "center" });

      doc.save(`badge-${formationTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
    }
  };

  return (
    <Card className="max-w-xl mx-auto overflow-hidden">
      <div ref={badgeRef} className="bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-[hsl(var(--accent)/0.1)] p-8">
        <div className="text-center space-y-4">
          {/* Logo */}
          <img src={logoStartunup} alt="STARTUNUP" className="h-12 mx-auto" />

          {/* Award icon */}
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center`}>
            <Award className="h-10 w-10 text-white" />
          </div>

          {/* Name */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Badge de Formation</p>
            <h2 className="text-2xl font-bold">{fullName}</h2>
          </div>

          {/* Formation */}
          <p className="text-lg font-medium text-primary">{formationTitle}</p>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">QCM</p>
              <p className="text-lg font-bold">{quizScore}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Étude de cas</p>
              <p className="text-lg font-bold">{caseStudyScore}%</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <p className="text-xs text-primary">Score final</p>
              <p className="text-lg font-bold text-primary">{totalScore}%</p>
            </div>
          </div>

          {/* Level */}
          <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${level.color} text-white font-bold`}>
            Niveau {level.label}
          </div>

          {/* Date */}
          <p className="text-xs text-muted-foreground">
            Délivré le {new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
      <CardContent className="pt-4 pb-4">
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" /> Télécharger le badge (PDF)
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormationBadge;
