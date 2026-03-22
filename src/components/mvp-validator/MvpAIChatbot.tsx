import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2, Download, Sparkles, X, Upload, FileText, Link2, Image, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  projectId: string;
  projectName: string;
  sector: string;
  scenario: string;
  description?: string;
  onClose?: () => void;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mvp-chatbot`;

const ANALYSIS_BLOCKS = [
  { key: "Classification Business Model", color: "from-blue-500/10 to-blue-600/10", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-700 dark:text-blue-300", icon: "📊" },
  { key: "Connexion Écosystème", color: "from-emerald-500/10 to-emerald-600/10", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", icon: "🌐" },
  { key: "Hypothèses", color: "from-amber-500/10 to-amber-600/10", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-700 dark:text-amber-300", icon: "🎯" },
  { key: "Fonctionnalités", color: "from-violet-500/10 to-violet-600/10", border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-700 dark:text-violet-300", icon: "⚙️" },
  { key: "Personas", color: "from-pink-500/10 to-pink-600/10", border: "border-pink-500/30", badge: "bg-pink-500/20 text-pink-700 dark:text-pink-300", icon: "👥" },
  { key: "Lean Canvas", color: "from-cyan-500/10 to-cyan-600/10", border: "border-cyan-500/30", badge: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300", icon: "📋" },
  { key: "Analyse des risques", color: "from-red-500/10 to-red-600/10", border: "border-red-500/30", badge: "bg-red-500/20 text-red-700 dark:text-red-300", icon: "⚠️" },
  { key: "Certifications", color: "from-indigo-500/10 to-indigo-600/10", border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300", icon: "🏅" },
  { key: "Brevets", color: "from-orange-500/10 to-orange-600/10", border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-700 dark:text-orange-300", icon: "📜" },
  { key: "Interconnexion", color: "from-teal-500/10 to-teal-600/10", border: "border-teal-500/30", badge: "bg-teal-500/20 text-teal-700 dark:text-teal-300", icon: "🔗" },
];

function getBlockStyle(text: string) {
  for (const block of ANALYSIS_BLOCKS) {
    if (text.toLowerCase().includes(block.key.toLowerCase())) return block;
  }
  return null;
}

function renderColoredMarkdown(content: string) {
  const sections = content.split(/(?=^#{1,3}\s)/m);
  return sections.map((section, idx) => {
    const block = getBlockStyle(section);
    if (block) {
      return (
        <div key={idx} className={`rounded-xl border ${block.border} bg-gradient-to-br ${block.color} p-4 mb-3`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{block.icon}</span>
            <Badge className={`${block.badge} border-0 text-xs`}>{block.key}</Badge>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{section}</ReactMarkdown>
          </div>
        </div>
      );
    }
    return (
      <div key={idx} className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{section}</ReactMarkdown>
      </div>
    );
  });
}

function extractSections(content: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const parts = content.split(/(?=^#{1,3}\s)/m);
  for (const part of parts) {
    const titleMatch = part.match(/^#{1,3}\s+(.*)/);
    const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "").trim() : "Section";
    if (part.trim().length > 20) {
      sections.push({ title, content: part.trim() });
    }
  }
  return sections;
}

const MvpAIChatbot = ({ projectId, projectName, sector, scenario, description, onClose }: Props) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; type: string } | null>(null);
  const [autoExtracted, setAutoExtracted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Parse AI report and auto-insert hypotheses, features, personas
  const extractAndInsertFromReport = useCallback(async (content: string) => {
    if (autoExtracted) return;
    
    const [hRes, fRes, pRes] = await Promise.all([
      supabase.from("mvp_hypotheses" as any).select("id").eq("project_id", projectId).limit(1),
      supabase.from("mvp_features" as any).select("id").eq("project_id", projectId).limit(1),
      supabase.from("mvp_personas" as any).select("id").eq("project_id", projectId).limit(1),
    ]);
    if ((hRes.data?.length || 0) > 0 || (fRes.data?.length || 0) > 0 || (pRes.data?.length || 0) > 0) {
      setAutoExtracted(true);
      return;
    }

    const hypotheses: { description: string; type: string; weight: number }[] = [];
    const features: { name: string; priority: string }[] = [];
    const personas: { name: string; description: string; is_early_adopter: boolean }[] = [];

    const hMatch = content.match(/#{1,3}\s*.*[Hh]ypothèse.*?\n([\s\S]*?)(?=\n#{1,3}\s|\n##|\n# |$)/);
    if (hMatch) {
      const lines = hMatch[1].split("\n").filter(l => l.match(/^[-*•]\s+/) || l.match(/^\d+[\.\)]\s+/));
      for (const line of lines.slice(0, 7)) {
        const cleaned = line.replace(/^[-*•\d\.\)]+\s*/, "").replace(/\*\*/g, "").trim();
        if (cleaned.length < 10) continue;
        const type = /technique|tech/i.test(cleaned) ? "risque_technique" 
          : /financ|argent|coût|budget/i.test(cleaned) ? "risque_financier"
          : /équipe|team|RH/i.test(cleaned) ? "risque_équipe"
          : "risque_marché";
        hypotheses.push({ description: cleaned.substring(0, 300), type, weight: 3 });
      }
    }

    const fMatch = content.match(/#{1,3}\s*.*[Ff]onctionnalit.*?\n([\s\S]*?)(?=\n#{1,3}\s|\n##|\n# |$)/);
    if (fMatch) {
      const lines = fMatch[1].split("\n").filter(l => l.match(/^[-*•]\s+/) || l.match(/^\d+[\.\)]\s+/));
      for (const line of lines.slice(0, 10)) {
        const cleaned = line.replace(/^[-*•\d\.\)]+\s*/, "").replace(/\*\*/g, "").trim();
        if (cleaned.length < 5) continue;
        const isNice = /nice|secondaire|optionnel|bonus|plus tard/i.test(cleaned);
        const name = cleaned.split(/[:\-–—]/)[0].trim().substring(0, 100);
        if (name.length >= 3) features.push({ name, priority: isNice ? "nice_to_have" : "core" });
      }
    }

    const pMatch = content.match(/#{1,3}\s*.*[Pp]ersona.*?\n([\s\S]*?)(?=\n#{1,3}\s|\n##|\n# |$)/);
    if (pMatch) {
      const lines = pMatch[1].split("\n").filter(l => l.match(/^[-*•]\s+/) || l.match(/^\d+[\.\)]\s+/));
      for (const line of lines.slice(0, 5)) {
        const cleaned = line.replace(/^[-*•\d\.\)]+\s*/, "").replace(/\*\*/g, "").trim();
        if (cleaned.length < 5) continue;
        const parts = cleaned.split(/[:\-–—]/);
        const name = parts[0].trim().substring(0, 80);
        const desc = parts.slice(1).join(" - ").trim().substring(0, 300) || cleaned.substring(0, 300);
        const isEarly = /early|premier|adopteur|innovateur|pionnier/i.test(cleaned);
        if (name.length >= 3) personas.push({ name, description: desc, is_early_adopter: isEarly });
      }
    }

    let insertedCount = 0;
    if (hypotheses.length > 0) {
      const { error } = await supabase.from("mvp_hypotheses" as any).insert(
        hypotheses.map(h => ({ project_id: projectId, ...h })) as any
      );
      if (!error) insertedCount += hypotheses.length;
    }
    if (features.length > 0) {
      const { error } = await supabase.from("mvp_features" as any).insert(
        features.map(f => ({ project_id: projectId, ...f })) as any
      );
      if (!error) insertedCount += features.length;
    }
    if (personas.length > 0) {
      const { error } = await supabase.from("mvp_personas" as any).insert(
        personas.map(p => ({ project_id: projectId, ...p, interviews_target: 30 })) as any
      );
      if (!error) insertedCount += personas.length;
    }

    if (insertedCount > 0) {
      toast({
        title: "✅ Données extraites automatiquement",
        description: `${hypotheses.length} hypothèses, ${features.length} fonctionnalités, ${personas.length} personas ajoutés à la Validation.`,
      });
    }
    setAutoExtracted(true);
  }, [projectId, autoExtracted, toast]);

  useEffect(() => {
    const initialPrompt = `Analyse cette idée de startup :
- **Projet** : ${projectName}
- **Secteur** : ${sector}
- **Scénario** : ${scenario === "A" ? "Idée seulement (stade idéation)" : "Idée + Business Model validé"}
${description ? `- **Description** : ${description}` : ""}

Fais une analyse complète structurée avec ces sections NUMÉROTÉES :
1. **Classification Business Model** (3-5 patterns parmi les 105+)
2. **Connexion Écosystème** (SSO, incubateurs tunisiens)
3. **Hypothèses de démarrage** (5-7 hypothèses critiques)
4. **Fonctionnalités MVP** (core + nice-to-have)
5. **Personas de démarrage** (3-5 personas)
6. **Lean Canvas** complet
7. **Analyse des risques** (marché, technique, financier, équipe, réglementaire)
8. **Certifications, Brevets & Normes** (certifications requises, brevets potentiels, normes sectorielles, exigences techniques et commerciales pour l'implantation)
9. **Interconnexion des éléments** (matrice d'influences croisées entre tous les éléments : comment chaque composante impacte les autres, dépendances critiques, synergies et points de vigilance)`;
    
    sendMessage(initialPrompt);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Max 10 Mo", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setUploadedFile({ name: file.name, content: text.substring(0, 12000), type: file.type });
      toast({ title: `📎 ${file.name} chargé`, description: "Le fichier sera inclus dans votre prochaine question." });
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const sendMessage = async (text: string) => {
    let fullText = text;
    if (uploadedFile) {
      fullText += `\n\n---\n📎 Fichier joint : ${uploadedFile.name}\nContenu :\n${uploadedFile.content}`;
      setUploadedFile(null);
    }
    const userMsg: Msg = { role: "user", content: fullText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        toast({ title: "Erreur", description: errData.error || "Erreur de connexion IA", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.role === "assistant" ? { ...m, content: assistantSoFar } : m));
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Connexion IA échouée", variant: "destructive" });
    }
    if (assistantSoFar && !autoExtracted && messages.length <= 1) {
      extractAndInsertFromReport(assistantSoFar);
    }
    setIsLoading(false);
  };

  const downloadMarkdown = () => {
    const content = messages.filter(m => m.role === "assistant").map(m => m.content).join("\n\n---\n\n");
    const fullReport = `# Rapport Analyse IA Pré-Création — ${projectName}\n\nSecteur: ${sector} | Scénario: ${scenario}\nDate: ${new Date().toLocaleDateString("fr-FR")}\n\n---\n\n${content}`;
    const blob = new Blob([fullReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analyse-ia-${projectName.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Rapport Markdown téléchargé" });
  };

  const generateSectionPDF = (sectionTitle: string, sectionContent: string) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 15;
    const cw = pw - margin * 2;
    let y = 20;

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pw, 50, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(sectionTitle.substring(0, 60), margin, 25);
    doc.setFontSize(10);
    doc.text(`${projectName} — ${sector}`, margin, 35);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 43);

    doc.setTextColor(0, 0, 0);
    y = 60;

    for (const line of sectionContent.split("\n")) {
      if (y > 270) { doc.addPage(); y = 20; }
      if (line.startsWith("# ")) {
        doc.setFontSize(16); doc.setFont("helvetica", "bold"); y += 4;
        doc.text(line.replace("# ", ""), margin, y); y += 9;
      } else if (line.startsWith("## ")) {
        doc.setFontSize(13); doc.setFont("helvetica", "bold"); y += 3;
        doc.text(line.replace("## ", ""), margin, y); y += 8;
      } else if (line.startsWith("### ")) {
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); y += 2;
        doc.text(line.replace("### ", ""), margin, y); y += 7;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const t = line.replace(/^[-*]\s/, "• ").replace(/\*\*/g, "");
        const s = doc.splitTextToSize(t, cw - 5);
        doc.text(s, margin + 5, y); y += s.length * 5;
      } else if (line.trim()) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const cl = line.replace(/\*\*/g, "").replace(/\*/g, "");
        const s = doc.splitTextToSize(cl, cw);
        doc.text(s, margin, y); y += s.length * 5;
      } else { y += 3; }
    }

    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150, 150, 150);
      doc.text(`StartUnUp Academy — ${sectionTitle} — Page ${i}/${total}`, margin, 290);
    }

    const safeTitle = sectionTitle.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase().substring(0, 30);
    doc.save(`${safeTitle}-${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    toast({ title: "✅ PDF section téléchargé", description: sectionTitle });
  };

  const downloadPDF = () => {
    const content = messages.filter(m => m.role === "assistant").map(m => m.content).join("\n\n---\n\n");
    if (!content) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 15;
    const cw = pw - margin * 2;
    let y = 20;

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pw, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text("Analyse IA Pré-Création", margin, 35);
    doc.setFontSize(16);
    doc.text(projectName, margin, 50);
    doc.setFontSize(11);
    doc.text(`Secteur: ${sector} | Scénario: ${scenario === "A" ? "Idée" : "Idée + BM"}`, margin, 62);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 72);

    doc.addPage();
    doc.setTextColor(0, 0, 0);
    y = 20;

    for (const line of content.split("\n")) {
      if (y > 270) { doc.addPage(); y = 20; }
      if (line.startsWith("# ")) {
        doc.setFontSize(18); doc.setFont("helvetica", "bold"); y += 5;
        doc.text(line.replace("# ", ""), margin, y); y += 10;
      } else if (line.startsWith("## ")) {
        doc.setFontSize(14); doc.setFont("helvetica", "bold"); y += 4;
        doc.text(line.replace("## ", ""), margin, y); y += 8;
      } else if (line.startsWith("### ")) {
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); y += 3;
        doc.text(line.replace("### ", ""), margin, y); y += 7;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const t = line.replace(/^[-*]\s/, "• ").replace(/\*\*/g, "");
        const s = doc.splitTextToSize(t, cw - 5);
        doc.text(s, margin + 5, y); y += s.length * 5;
      } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line.split("|").filter(c => c.trim() !== "");
        if (cells.some(c => c.trim().match(/^[-:]+$/))) continue;
        const cellW = cw / cells.length;
        cells.forEach((cell, i) => {
          doc.setFontSize(8); doc.setFont("helvetica", "normal");
          const x = margin + i * cellW;
          doc.rect(x, y - 4, cellW, 8);
          doc.text(cell.trim().substring(0, 30), x + 2, y + 1);
        });
        y += 10;
      } else if (line.trim()) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const cl = line.replace(/\*\*/g, "").replace(/\*/g, "");
        const s = doc.splitTextToSize(cl, cw);
        doc.text(s, margin, y); y += s.length * 5;
      } else { y += 3; }
    }

    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150, 150, 150);
      doc.text(`StartUnUp Academy — Analyse IA Pré-Création — Page ${i}/${total}`, margin, 290);
    }

    doc.save(`analyse-ia-${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    toast({ title: "✅ PDF téléchargé" });
  };

  const hasAssistant = messages.some(m => m.role === "assistant");
  const lastAssistant = messages.filter(m => m.role === "assistant").pop();
  const sections = lastAssistant ? extractSections(lastAssistant.content) : [];

  return (
    <Card
      className={`flex flex-col h-[700px] border-2 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-primary/10"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Assistant IA — Analyse Pré-Création</CardTitle>
            <p className="text-xs text-muted-foreground">Certifications • Brevets • Normes • Interconnexions</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20"><Sparkles className="h-3 w-3 mr-1" />IA Avancée</Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          {hasAssistant && (
            <>
              <Button variant="outline" size="sm" onClick={downloadMarkdown} className="gap-1">
                <Download className="h-3 w-3" /> .md
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-1 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 hover:bg-red-100">
                <FileText className="h-3 w-3 text-red-600" /> PDF Complet
              </Button>
            </>
          )}
          {onClose && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pb-3">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="space-y-2">
                        {renderColoredMarkdown(msg.content)}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content.length > 300 ? msg.content.substring(0, 300) + "..." : msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyse en cours...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Section Export Buttons */}
        {sections.length > 1 && !isLoading && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2 font-medium">📄 Exporter une section en PDF :</p>
            <div className="flex flex-wrap gap-1.5">
              {sections.map((sec, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => generateSectionPDF(sec.title, sec.content)}
                >
                  <Download className="h-3 w-3" />
                  {sec.title.substring(0, 25)}{sec.title.length > 25 ? "…" : ""}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t space-y-2">
          {/* Drag & Drop Zone indicator */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-primary bg-primary/5 text-primary"
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium text-sm">Déposez votre fichier ici</span>
            </motion.div>
          )}
          
          {uploadedFile && (
            <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg text-sm border">
              {getFileIcon(uploadedFile.type)}
              <span className="flex-1 truncate font-medium">{uploadedFile.name}</span>
              <Badge variant="outline" className="text-xs">{(uploadedFile.content.length / 1024).toFixed(1)} Ko</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setUploadedFile(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept=".txt,.csv,.md,.json,.xml,.pdf,.doc,.docx,.xls,.xlsx,.pptx,.py,.js,.ts,.html,.css" className="hidden" onChange={handleFileUpload} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Joindre un fichier (glisser-déposer aussi supporté)"
              className="shrink-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Posez une question, demandez un approfondissement, ou glissez un fichier..."
              className="min-h-[44px] max-h-[100px] resize-none"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (input.trim() && !isLoading) sendMessage(input.trim()); } }}
            />
            <Button size="icon" onClick={() => input.trim() && !isLoading && sendMessage(input.trim())} disabled={!input.trim() || isLoading} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            📎 Glissez-déposez un fichier ou cliquez sur <Upload className="h-3 w-3 inline" /> pour joindre (.txt, .csv, .json, .md, .pdf, .docx...)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MvpAIChatbot;
