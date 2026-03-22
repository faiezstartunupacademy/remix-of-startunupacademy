import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Loader2, Download, BookOpen, Mic, Sparkles,
  ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strategic-orchestrator`;

interface BusinessPlanGeneratorProps {
  projectName: string;
  sector: string | null;
  messages: { role: string; content: string; phase: number }[];
  startupStage: string;
}

const BusinessPlanGenerator = ({ projectName, sector, messages, startupStage }: BusinessPlanGeneratorProps) => {
  const { toast } = useToast();
  const [businessPlan, setBusinessPlan] = useState("");
  const [pitch, setPitch] = useState("");
  const [generatingBP, setGeneratingBP] = useState(false);
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const BP_SECTIONS = [
    { key: "executive", label: "Résumé Exécutif", icon: "📋", color: "from-blue-500/10 to-blue-600/10 border-blue-500/30" },
    { key: "company", label: "Présentation Entreprise", icon: "🏢", color: "from-indigo-500/10 to-indigo-600/10 border-indigo-500/30" },
    { key: "market", label: "Analyse de Marché", icon: "📊", color: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/30" },
    { key: "product", label: "Produit / Service", icon: "⚙️", color: "from-violet-500/10 to-violet-600/10 border-violet-500/30" },
    { key: "business-model", label: "Modèle Économique", icon: "💰", color: "from-amber-500/10 to-amber-600/10 border-amber-500/30" },
    { key: "marketing", label: "Stratégie Marketing", icon: "📢", color: "from-pink-500/10 to-pink-600/10 border-pink-500/30" },
    { key: "operations", label: "Plan Opérationnel", icon: "🔧", color: "from-teal-500/10 to-teal-600/10 border-teal-500/30" },
    { key: "compliance", label: "Conformité & Réglementaire", icon: "⚖️", color: "from-cyan-500/10 to-cyan-600/10 border-cyan-500/30" },
    { key: "risks", label: "Analyse des Risques", icon: "⚠️", color: "from-red-500/10 to-red-600/10 border-red-500/30" },
    { key: "financial", label: "Plan Financier", icon: "📈", color: "from-green-500/10 to-green-600/10 border-green-500/30" },
    { key: "roadmap", label: "Roadmap & Jalons", icon: "🗺️", color: "from-orange-500/10 to-orange-600/10 border-orange-500/30" },
  ];

  const streamGenerate = async (mode: "business-plan" | "pitch", setter: (v: string) => void, setLoading: (v: boolean) => void) => {
    setLoading(true);
    setter("");

    const summaryMessages = messages.map(m => ({
      role: m.role,
      content: `[Phase ${m.phase}] ${m.content}`
    }));

    summaryMessages.push({
      role: "user",
      content: mode === "business-plan"
        ? `Génère un BUSINESS PLAN COMPLET pour le projet "${projectName}" (secteur: ${sector || "non spécifié"}, profil: ${startupStage}). Utilise TOUTES les données des 7 phases pour produire un document de qualité investisseur.`
        : `Génère un PITCH DECK COMPLET pour le projet "${projectName}" (secteur: ${sector || "non spécifié"}, profil: ${startupStage}). Adapte au contexte d'implantation et à l'écosystème startup tunisien. Utilise les données des 7 phases.`
    });

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: summaryMessages, mode, startupStage }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur de génération");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullContent = "";

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
            if (content) {
              fullContent += content;
              setter(fullContent);
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
            if (content) { fullContent += content; setter(fullContent); }
          } catch {}
        }
      }

      toast({ title: mode === "business-plan" ? "✅ Business Plan généré" : "✅ Pitch Deck généré" });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (content: string, type: "business-plan" | "pitch") => {
    if (!content) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 15;
    const cw = pw - margin * 2;
    let y = 20;

    // Title page
    const isBusinessPlan = type === "business-plan";
    doc.setFillColor(isBusinessPlan ? 15 : 88, isBusinessPlan ? 23 : 28, isBusinessPlan ? 42 : 135);
    doc.rect(0, 0, pw, 90, "F");
    
    // Accent bar
    doc.setFillColor(isBusinessPlan ? 59 : 168, isBusinessPlan ? 130 : 85, isBusinessPlan ? 246 : 247);
    doc.rect(0, 85, pw, 5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(isBusinessPlan ? "BUSINESS PLAN" : "PITCH DECK", margin, 40);
    doc.setFontSize(18);
    doc.text(projectName, margin, 55);
    doc.setFontSize(11);
    if (sector) doc.text(`Secteur : ${sector}`, margin, 67);
    doc.text(`Profil : ${startupStage}`, margin, 75);
    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — StartUnUp Academy`, margin, 83);

    // Table of contents placeholder
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    y = 20;

    for (const line of content.split("\n")) {
      if (y > 270) { doc.addPage(); y = 20; }
      if (line.startsWith("# ")) {
        doc.setFontSize(20); doc.setFont("helvetica", "bold"); y += 8;
        const title = line.replace("# ", "").replace(/[📋📊⚙️💰📢🔧⚖️⚠️📈🗺️🎤🏢]/g, "").trim();
        doc.setTextColor(isBusinessPlan ? 59 : 88, isBusinessPlan ? 130 : 28, isBusinessPlan ? 246 : 135);
        doc.text(title, margin, y);
        doc.setTextColor(0, 0, 0);
        y += 4;
        doc.setDrawColor(isBusinessPlan ? 59 : 88, isBusinessPlan ? 130 : 28, isBusinessPlan ? 246 : 135);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pw - margin, y);
        y += 8;
      } else if (line.startsWith("## ")) {
        doc.setFontSize(15); doc.setFont("helvetica", "bold"); y += 5;
        doc.text(line.replace("## ", "").replace(/[📋📊⚙️💰📢🔧⚖️⚠️📈🗺️🎤🏢]/g, "").trim(), margin, y);
        y += 8;
      } else if (line.startsWith("### ")) {
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); y += 3;
        doc.text(line.replace("### ", ""), margin, y);
        y += 7;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const text = line.replace(/^[-*]\s/, "• ").replace(/\*\*/g, "");
        const s = doc.splitTextToSize(text, cw - 8);
        doc.text(s, margin + 5, y); y += s.length * 5;
      } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line.split("|").filter(c => c.trim() !== "");
        if (cells.some(c => c.trim().match(/^[-:]+$/))) continue;
        const cellW = cw / cells.length;
        cells.forEach((cell, i) => {
          doc.setFontSize(8); doc.setFont("helvetica", "normal");
          const x = margin + i * cellW;
          doc.setFillColor(245, 245, 250);
          doc.rect(x, y - 4, cellW, 8, "FD");
          doc.text(cell.trim().substring(0, 35), x + 2, y + 1);
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
      doc.text(`StartUnUp Academy — ${isBusinessPlan ? "Business Plan" : "Pitch Deck"} — Page ${i}/${total}`, margin, 290);
    }

    doc.save(`${type}-${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    toast({ title: "✅ PDF téléchargé" });
  };

  const downloadMarkdown = (content: string, type: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${projectName.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Markdown téléchargé" });
  };

  // Split content into sections for accordion display
  const splitSections = (content: string) => {
    const sections: { title: string; content: string }[] = [];
    const parts = content.split(/(?=^## )/m);
    for (const part of parts) {
      const titleMatch = part.match(/^## (.+)/);
      if (titleMatch) {
        sections.push({ title: titleMatch[1].trim(), content: part });
      } else if (part.trim()) {
        sections.push({ title: "Introduction", content: part });
      }
    }
    return sections;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <Badge className="mb-3 bg-gradient-to-r from-primary to-violet-500 text-primary-foreground border-0 text-sm px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Résultats des 7 Phases Stratégiques
        </Badge>
        <h2 className="text-2xl font-bold">Plan d'Affaires & Pitch</h2>
        <p className="text-muted-foreground mt-1 max-w-lg mx-auto">
          Structure internationale validée par les grands incubateurs, pépinières et universités
        </p>
      </div>

      {/* Generation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Business Plan Card */}
        <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Business Plan Complet</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">12 sections • Standard international</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Y Combinator", "MIT", "Stanford", "Startup Act"].map(ref => (
                <Badge key={ref} variant="outline" className="text-xs">{ref}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BP_SECTIONS.slice(0, 6).map(s => (
                <div key={s.key} className="flex items-center gap-1.5 text-muted-foreground">
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => streamGenerate("business-plan", setBusinessPlan, setGeneratingBP)}
              disabled={generatingBP || messages.length === 0}
              className="w-full gap-2"
            >
              {generatingBP ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Génération en cours...</>
              ) : businessPlan ? (
                <><Sparkles className="h-4 w-4" /> Régénérer le Business Plan</>
              ) : (
                <><BookOpen className="h-4 w-4" /> Générer le Business Plan</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pitch Card */}
        <Card className="group relative overflow-hidden border-2 hover:border-violet-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10">
                <Mic className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pitch Deck Startup</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">12 slides • Guy Kawasaki format</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Techstars", "500 Startups", "Flat6Labs", "Écosystème TN"].map(ref => (
                <Badge key={ref} variant="outline" className="text-xs">{ref}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["🎯 Problème", "💡 Solution", "📊 Marché", "💰 Business Model", "📈 Traction", "🎤 L'Ask"].map(s => (
                <div key={s} className="flex items-center gap-1.5 text-muted-foreground">
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => streamGenerate("pitch", setPitch, setGeneratingPitch)}
              disabled={generatingPitch || messages.length === 0}
              variant="secondary"
              className="w-full gap-2"
            >
              {generatingPitch ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Génération en cours...</>
              ) : pitch ? (
                <><Sparkles className="h-4 w-4" /> Régénérer le Pitch</>
              ) : (
                <><Mic className="h-4 w-4" /> Générer le Pitch Deck</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {messages.length === 0 && (
        <Card className="text-center py-8 border-dashed">
          <CardContent>
            <p className="text-muted-foreground">Complétez les 7 phases stratégiques pour pouvoir générer le Business Plan et le Pitch Deck.</p>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {(businessPlan || pitch) && (
        <Tabs defaultValue={businessPlan ? "bp" : "pitch"} className="mt-6">
          <TabsList className="w-full">
            {businessPlan && <TabsTrigger value="bp" className="gap-2 flex-1"><BookOpen className="h-4 w-4" /> Business Plan</TabsTrigger>}
            {pitch && <TabsTrigger value="pitch" className="gap-2 flex-1"><Mic className="h-4 w-4" /> Pitch Deck</TabsTrigger>}
          </TabsList>

          {businessPlan && (
            <TabsContent value="bp" className="space-y-4 mt-4">
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => downloadMarkdown(businessPlan, "business-plan")} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> .md
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadPDF(businessPlan, "business-plan")} className="gap-1.5 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <FileText className="h-3.5 w-3.5 text-red-600" /> PDF
                </Button>
              </div>

              {/* Accordion sections */}
              <div className="space-y-2">
                {splitSections(businessPlan).map((section, idx) => {
                  const sectionConfig = BP_SECTIONS.find(s => section.title.toLowerCase().includes(s.label.toLowerCase().split(" ")[0]));
                  const isExpanded = expandedSection === `bp-${idx}`;
                  return (
                    <Card key={idx} className={`overflow-hidden transition-all ${sectionConfig ? `border ${sectionConfig.color.split(" ").pop()}` : ""}`}>
                      <button
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedSection(isExpanded ? null : `bp-${idx}`)}
                      >
                        <div className="flex items-center gap-2">
                          {sectionConfig && <span className="text-lg">{sectionConfig.icon}</span>}
                          <span className="font-medium text-sm text-left">{section.title}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={`px-4 pb-4 ${sectionConfig ? `bg-gradient-to-br ${sectionConfig.color.split(" ").slice(0, 2).join(" ")}` : ""}`}>
                              <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_table]:border [&_th]:border [&_td]:border [&_table]:border-border">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>

              {/* Full view fallback */}
              {splitSections(businessPlan).length === 0 && (
                <ScrollArea className="h-[500px] border rounded-xl p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{businessPlan}</ReactMarkdown>
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          )}

          {pitch && (
            <TabsContent value="pitch" className="space-y-4 mt-4">
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => downloadMarkdown(pitch, "pitch-deck")} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> .md
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadPDF(pitch, "pitch")} className="gap-1.5 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <FileText className="h-3.5 w-3.5 text-red-600" /> PDF
                </Button>
              </div>
              <ScrollArea className="h-[600px] border rounded-xl p-6 bg-gradient-to-br from-card to-muted/20">
                <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_table]:border [&_th]:border [&_td]:border [&_table]:border-border">
                  <ReactMarkdown>{pitch}</ReactMarkdown>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default BusinessPlanGenerator;
