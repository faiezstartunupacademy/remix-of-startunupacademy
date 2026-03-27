import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send, Bot, Loader2, DollarSign, FileText, PieChart,
  BookOpen, Scale, Shield, TrendingUp, Users, Building2,
  CheckCircle2, Circle, Briefcase, Download, Upload, Paperclip,
  BarChart3, Globe, AlertTriangle, Landmark, Wallet, Sparkles,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

const INVEST_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invest-chatbot`;

const DELIVERABLES = [
  { id: "pitch-deck", label: "Pitch Deck (12 slides)", icon: FileText, category: "core" },
  { id: "teaser", label: "Teaser / One-Pager", icon: FileText, category: "core" },
  { id: "investment-memo", label: "Investment Memorandum", icon: BookOpen, category: "core" },
  { id: "business-plan", label: "Business Plan Financier", icon: BarChart3, category: "core" },
  { id: "valorisation", label: "Valorisation Multi-Méthodes", icon: DollarSign, category: "core" },
  { id: "montage-financier", label: "Montage Financier", icon: PieChart, category: "core" },
  { id: "cap-table", label: "Cap Table", icon: Users, category: "legal" },
  { id: "term-sheet", label: "Term Sheet / LOI", icon: Scale, category: "legal" },
  { id: "safe-contract", label: "Contrat SAFE", icon: Shield, category: "legal" },
  { id: "shareholder-agreement", label: "Pacte d'Actionnaires", icon: Shield, category: "legal" },
  { id: "data-room", label: "Data Room Structurée", icon: Building2, category: "operations" },
  { id: "financial-projections", label: "Projections Financières 3 ans", icon: TrendingUp, category: "operations" },
  { id: "kpi-dashboard", label: "Dashboard KPIs Investisseur", icon: BarChart3, category: "operations" },
  { id: "esg-report", label: "Reporting ESG", icon: Globe, category: "post-closing" },
];

const THEORY_TOPICS = [
  { id: "vc-structure", label: "Fonctionnement VC (LP, GP, véhicule)", icon: Landmark, prompt: "Explique-moi en détail comment fonctionne un fonds de Venture Capital : le rôle des LP (Limited Partners), des GP (General Partners), le véhicule d'investissement, le cycle d'investissement, et les mécanismes de carry et management fees. Cite les références académiques et les experts reconnus." },
  { id: "funding-cycle", label: "Cycle de financement (BA → IPO)", icon: TrendingUp, prompt: "Détaille le cycle complet de financement des startups : Business Angels, Pre-seed, Seed, Series A, B, C, Growth, Pre-IPO et IPO. Pour chaque stade, précise les montants typiques, la dilution moyenne, les métriques attendues et les investisseurs types. Inclus les références académiques." },
  { id: "pmf-importance", label: "Product/Market Fit & VC", icon: CheckCircle2, prompt: "Explique l'importance critique du Product/Market Fit pour les VCs. Comment le mesurer, quels signaux les investisseurs cherchent, et comment le démontrer dans un pitch deck. Cite les travaux de Marc Andreessen, Sean Ellis et les recherches académiques." },
  { id: "valuation-methods", label: "Méthodes de Valorisation", icon: DollarSign, prompt: "Présente les différentes méthodes de valorisation (DCF, VC Method, Comparables, Berkus, Scorecard, Risk Factor) et leur corrélation avec la phase de maturité de la startup. Quand utiliser quelle méthode ? Cite les travaux de Damodaran et les publications académiques." },
  { id: "cap-table-equity", label: "Cap Table & Sweat Equity", icon: PieChart, prompt: "Explique l'importance du Sweat Equity et de la Cap Table. Comment maintenir une cap table saine pour renforcer l'attractivité auprès des investisseurs. Comprendre la dilution du capital selon la phase de maturité. Cite les protocoles de Carta et les meilleures pratiques." },
  { id: "sensitivity", label: "Analyse de Sensibilité", icon: BarChart3, prompt: "Initie-moi à l'analyse de sensibilité dans le contexte d'une levée de fonds : décote, premium pratiquée par les investisseurs, critères objectifs et subjectifs qui influencent la valorisation. Cite les méthodologies des Big Four (EY, PwC, Deloitte, KPMG)." },
  { id: "legal-docs", label: "Documentation Juridique", icon: Scale, prompt: "Détaille la documentation juridique d'une opération de levée de fonds : contrats SAFE, pactes d'actionnaires, OCA, CCA, et les stratégies de négociation. Explique les term sheets, drag-along, tag-along, liquidation preference. Cite les travaux de Brad Feld et Jason Mendelson." },
  { id: "tunisia-regulation", label: "Cadre Réglementaire Tunisien", icon: Globe, prompt: "Explique le cadre réglementaire tunisien pour les investissements en startups : Startup Act, obligations BCT, administration fiscale, rapatriement des fonds, fiches d'investissement, processus et exigences pour l'investissement étranger. Cite les textes de loi et les institutions." },
  { id: "post-closing", label: "Post-Closing & Reporting", icon: Briefcase, prompt: "Détaille les exigences des VC après le closing : reporting extra-comptable, reporting ESG, rapports d'activité, états financiers trimestriels, KPIs, gouvernance et board meetings. Cite les best practices NVCA et les références académiques." },
  { id: "common-mistakes", label: "Erreurs à Éviter", icon: AlertTriangle, prompt: "Quelles sont les erreurs les plus courantes et critiques à éviter lors de la préparation des livrables d'une levée de fonds ? Donne des exemples concrets, des solutions et cite les études de cas documentées (CB Insights, Harvard Business Review)." },
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface InvestSpaceProps {
  projectId: string;
  projectName: string;
  sector: string | null;
  startupStage: string;
  messages: { role: string; content: string; phase: number }[];
}

const ChatPanel = ({
  messages: chatMessages,
  input,
  setInput,
  isStreaming,
  onSend,
  placeholder,
  emptyIcon,
  emptyTitle,
  emptyDesc,
}: {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  isStreaming: boolean;
  onSend: (content: string) => void;
  placeholder: string;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDesc: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="space-y-3">
      <div ref={scrollRef} className="bg-muted/10 rounded-2xl border min-h-[350px] max-h-[50vh] overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="p-4 rounded-2xl bg-amber-500/10 w-fit mx-auto mb-3">
              {emptyIcon}
            </div>
            <p className="font-medium text-sm">{emptyTitle}</p>
            <p className="text-xs mt-1 max-w-sm mx-auto">{emptyDesc}</p>
          </div>
        )}
        {chatMessages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border shadow-sm"}`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_table]:border [&_th]:border [&_td]:border [&_table]:border-border">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}
        {isStreaming && (
          <div className="flex gap-2 items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> L'expert analyse...
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend(input)}
          placeholder={placeholder}
          disabled={isStreaming}
          className="rounded-full h-11 shadow-sm text-sm"
        />
        <Button onClick={() => onSend(input)} disabled={isStreaming || !input.trim()} size="icon"
          className="rounded-full h-11 w-11 shrink-0 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const PITCH_TYPES = [
  { value: "investor", label: "Pitch Investisseur (Levée de fonds)" },
  { value: "commercial", label: "Pitch Commercial (Clients / Partenaires)" },
  { value: "competition", label: "Pitch Concours (Startup Weekend, etc.)" },
  { value: "accelerator", label: "Pitch Accélérateur (Y Combinator, Flat6Labs)" },
  { value: "elevator", label: "Elevator Pitch (1 minute)" },
];

const InvestSpace = ({ projectId, projectName, sector, startupStage, messages: phaseMessages }: InvestSpaceProps) => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [completedDeliverables, setCompletedDeliverables] = useState<Set<string>>(new Set());
  const [isLoadingDeliverables, setIsLoadingDeliverables] = useState(true);
  const [pitchType, setPitchType] = useState("investor");
  const [generatingDoc, setGeneratingDoc] = useState<string | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  // Load persisted deliverables from DB
  useEffect(() => {
    const loadDeliverables = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoadingDeliverables(false); return; }

        const { data, error } = await supabase
          .from('dataroom_deliverables' as any)
          .select('deliverable_id')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .eq('completed', true);

        if (error) {
          console.error('Error loading deliverables:', error);
        } else if (data) {
          setCompletedDeliverables(new Set((data as any[]).map((d: any) => d.deliverable_id)));
        }
      } catch (e) {
        console.error('Error loading deliverables:', e);
      } finally {
        setIsLoadingDeliverables(false);
      }
    };
    loadDeliverables();
  }, [projectId]);

  const toggleDeliverable = useCallback(async (deliverableId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erreur", description: "Vous devez être connecté", variant: "destructive" });
      return;
    }

    const isCurrentlyCompleted = completedDeliverables.has(deliverableId);

    // Optimistic update
    setCompletedDeliverables(prev => {
      const next = new Set(prev);
      if (isCurrentlyCompleted) next.delete(deliverableId); else next.add(deliverableId);
      return next;
    });

    try {
      if (isCurrentlyCompleted) {
        // Remove from DB
        const { error } = await supabase
          .from('dataroom_deliverables' as any)
          .delete()
          .eq('project_id', projectId)
          .eq('deliverable_id', deliverableId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        // Upsert to DB
        const { error } = await supabase
          .from('dataroom_deliverables' as any)
          .upsert({
            project_id: projectId,
            project_type: 'mvp',
            deliverable_id: deliverableId,
            completed: true,
            completed_at: new Date().toISOString(),
            user_id: user.id,
          } as any, { onConflict: 'project_id,deliverable_id,user_id' });
        if (error) throw error;
      }
    } catch (e: any) {
      // Revert on error
      setCompletedDeliverables(prev => {
        const next = new Set(prev);
        if (isCurrentlyCompleted) next.add(deliverableId); else next.delete(deliverableId);
        return next;
      });
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    }
  }, [completedDeliverables, projectId, toast]);

  const deliverableProgress = DELIVERABLES.length > 0
    ? Math.round((completedDeliverables.size / DELIVERABLES.length) * 100)
    : 0;

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: content.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const allMessages = chatMessages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch(INVEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          projectContext: { projectName, sector, startupStage, phasesData: phaseMessages.length > 0 },
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur IA");
      }
      if (!resp.body) throw new Error("Pas de stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
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
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantContent += c;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId)
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: "Erreur", description: "Connexion requise", variant: "destructive" }); return; }

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "Fichier trop volumineux", description: `${file.name} dépasse 10 Mo`, variant: "destructive" });
        continue;
      }
      const path = `${user.id}/${projectId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("incubation-reports").upload(path, file);
      if (error) {
        toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      } else {
        const { data: urlData } = supabase.storage.from("incubation-reports").getPublicUrl(path);
        setUploadedFiles(prev => [...prev, { name: file.name, url: urlData.publicUrl }]);
        toast({ title: "✅ Fichier uploadé", description: file.name });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-generate pitch deck or business plan
  const generateDocument = async (docType: "pitch-deck" | "business-plan") => {
    setGeneratingDoc(docType);
    const selectedPitch = PITCH_TYPES.find(p => p.value === pitchType);

    const contextMessages = phaseMessages.map(m => ({
      role: m.role,
      content: `[Phase ${m.phase}] ${m.content}`
    }));

    const prompt = docType === "pitch-deck"
      ? `Génère un PITCH DECK COMPLET et professionnel pour "${projectName}".
Contexte :
- Secteur : ${sector || "non spécifié"}
- Stade : ${startupStage}
- Type de pitch : ${selectedPitch?.label || "Investisseur"}
- Écosystème : Tunisie (Startup Act)

Adapte le contenu, le ton et la structure au type de pitch "${selectedPitch?.label}".
Pour un pitch investisseur : focus métriques, traction, valorisation.
Pour un pitch commercial : focus proposition de valeur, ROI client, cas d'usage.
Pour un pitch concours : focus innovation, impact, équipe.
Pour un pitch accélérateur : focus scalabilité, marché, product-market fit.
Pour un elevator pitch : résumé percutant en 1 minute.

Utilise TOUTES les données des phases stratégiques disponibles.
Structure avec des slides numérotées (## Slide 1, ## Slide 2, etc.).`
      : `Génère un BUSINESS PLAN COMPLET de qualité investisseur pour "${projectName}".
Contexte :
- Secteur : ${sector || "non spécifié"}
- Stade : ${startupStage}
- Écosystème : Tunisie (Startup Act, cadre réglementaire BCT)
- Type de présentation visé : ${selectedPitch?.label || "Investisseur"}

Inclus les sections : Résumé Exécutif, Présentation Entreprise, Analyse de Marché, Produit/Service, Modèle Économique, Stratégie Marketing, Plan Opérationnel, Conformité & Réglementaire, Analyse des Risques, Plan Financier (projections 3 ans), Roadmap & Jalons.

Utilise TOUTES les données des phases stratégiques disponibles.`;

    contextMessages.push({ role: "user", content: prompt });

    try {
      const resp = await fetch(INVEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: contextMessages,
          projectContext: { projectName, sector, startupStage, phasesData: true },
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Erreur de génération");

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
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) { fullContent += c; setGeneratedDocs(prev => ({ ...prev, [docType]: fullContent })); }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
      toast({ title: `✅ ${docType === "pitch-deck" ? "Pitch Deck" : "Business Plan"} généré` });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingDoc(null);
    }
  };

  const downloadGeneratedPDF = (content: string, type: string) => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const margin = 15;
    const cw = pw - margin * 2;
    let y = 25;
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text(type === "pitch-deck" ? "PITCH DECK" : "BUSINESS PLAN", margin, y); y += 8;
    doc.setFontSize(14); doc.text(projectName, margin, y); y += 6;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`${sector || "N/A"} | ${startupStage} | ${new Date().toLocaleDateString("fr-FR")}`, margin, y); y += 12;

    for (const line of content.split("\n")) {
      if (y > 270) { doc.addPage(); y = 20; }
      if (line.startsWith("## ")) {
        doc.setFontSize(14); doc.setFont("helvetica", "bold"); y += 4;
        doc.text(line.replace("## ", ""), margin, y); y += 8;
      } else if (line.startsWith("### ")) {
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text(line.replace("### ", ""), margin, y); y += 6;
      } else if (line.trim()) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const s = doc.splitTextToSize(line.replace(/\*\*/g, ""), cw);
        doc.text(s, margin, y); y += s.length * 5;
      } else { y += 3; }
    }
    doc.save(`${type}-${projectName.replace(/\s+/g, "-")}.pdf`);
    toast({ title: "✅ PDF téléchargé" });
  };

  const coreDeliverables = DELIVERABLES.filter(d => d.category === "core");
  const legalDeliverables = DELIVERABLES.filter(d => d.category === "legal");
  const opsDeliverables = DELIVERABLES.filter(d => d.category === "operations");
  const postDeliverables = DELIVERABLES.filter(d => d.category === "post-closing");

  const exportDataRoomPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkPage = (needed: number) => { if (y + needed > 270) addPage(); };

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Data Room - Rapport Invest", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Projet: ${projectName} | Secteur: ${sector || "N/A"} | Stade: ${startupStage}`, margin, y);
    y += 5;
    doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, margin, y);
    y += 10;

    // Data Room Progress
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Progression Data Room", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${completedDeliverables.size}/${DELIVERABLES.length} livrables complétés (${deliverableProgress}%)`, margin, y);
    y += 10;

    // Deliverables checklist
    const sections = [
      { title: "Livrables Core", items: coreDeliverables },
      { title: "Documentation Juridique", items: legalDeliverables },
      { title: "Opérations & Finance", items: opsDeliverables },
      { title: "Post-Closing", items: postDeliverables },
    ];

    for (const section of sections) {
      checkPage(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      for (const d of section.items) {
        checkPage(6);
        const status = completedDeliverables.has(d.id) ? "[✓]" : "[ ]";
        doc.text(`${status} ${d.label}`, margin + 4, y);
        y += 5;
      }
      y += 4;
    }

    // Chat results
    const assistantMessages = chatMessages.filter(m => m.role === "assistant");
    if (assistantMessages.length > 0) {
      checkPage(20);
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Résultats Chatbot Expert", margin, y);
      y += 10;

      for (let i = 0; i < chatMessages.length; i++) {
        const msg = chatMessages[i];
        checkPage(15);

        doc.setFontSize(9);
        if (msg.role === "user") {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 100, 180);
          const userLines = doc.splitTextToSize(`Question: ${msg.content}`, maxWidth);
          for (const line of userLines) {
            checkPage(5);
            doc.text(line, margin, y);
            y += 4.5;
          }
          y += 2;
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 30, 30);
          // Strip markdown for PDF
          const cleanText = msg.content
            .replace(/#{1,6}\s/g, "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/`{1,3}/g, "")
            .replace(/\|/g, " | ")
            .replace(/---+/g, "");
          const lines = doc.splitTextToSize(cleanText, maxWidth);
          for (const line of lines) {
            checkPage(5);
            doc.text(line, margin, y);
            y += 4;
          }
          y += 6;
        }
        doc.setTextColor(0, 0, 0);
      }
    }

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text(`StartUnUp - Espace Invest | Page ${p}/${totalPages}`, margin, 287);
      doc.setTextColor(0);
    }

    doc.save(`DataRoom_${projectName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: "✅ PDF exporté", description: "Le rapport Data Room a été téléchargé." });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center py-4">
        <Badge className="mb-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-sm px-4 py-1.5">
          <Wallet className="h-3.5 w-3.5 mr-1.5" />
          Espace Invest
        </Badge>
        <h2 className="text-2xl font-bold">Levée de Fonds & Investissement</h2>
        <p className="text-muted-foreground mt-1 max-w-lg mx-auto text-sm">
          Chatbot expert en structuration financière, valorisation et documentation investisseur
        </p>
      </div>

      <Tabs defaultValue="chatbot" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chatbot" className="gap-1.5">
            <Bot className="h-4 w-4" /> Expert
          </TabsTrigger>
          <TabsTrigger value="generator" className="gap-1.5">
            <Sparkles className="h-4 w-4" /> Générateur
          </TabsTrigger>
          <TabsTrigger value="theory" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Théorie
          </TabsTrigger>
          <TabsTrigger value="dataroom" className="gap-1.5">
            <Building2 className="h-4 w-4" /> Data Room
          </TabsTrigger>
        </TabsList>

        {/* ─── Chatbot Tab ─── */}
        <TabsContent value="chatbot" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Préparer mon Pitch Deck", prompt: `Je prépare une levée de fonds pour "${projectName}" (secteur: ${sector || "non défini"}, stade: ${startupStage}). Guide-moi pour structurer un Pitch Deck percutant. Cite les références académiques et les protocoles des meilleurs incubateurs.` },
              { label: "Valoriser ma startup", prompt: `Quelle(s) méthode(s) de valorisation recommandes-tu pour "${projectName}" au stade ${startupStage} ? Fais une estimation et explique ta méthodologie. Cite les travaux de Damodaran, les publications de NVCA et les études académiques.` },
              { label: "Structurer ma Data Room", prompt: `Comment structurer une Data Room professionnelle pour "${projectName}" ? Liste les documents nécessaires par catégorie. Cite les protocoles Sequoia et Y Combinator.` },
              { label: "Investment Memo", prompt: `Aide-moi à rédiger un Investment Memorandum pour "${projectName}". Structure-le avec : company overview, équipe, value proposition, business model, technologie, marché, risques, projections financières, roadmap et investment thesis. Cite les frameworks utilisés par a16z et Partech.` },
            ].map(q => (
              <Button key={q.label} variant="outline" size="sm" className="text-xs rounded-full"
                onClick={() => sendMessage(q.prompt)} disabled={isStreaming}>
                {q.label}
              </Button>
            ))}
          </div>

          <ChatPanel
            messages={chatMessages} input={input} setInput={setInput}
            isStreaming={isStreaming} onSend={sendMessage}
            placeholder="Posez votre question sur la levée de fonds, valorisation, cap table..."
            emptyIcon={<Wallet className="h-10 w-10 text-amber-500 opacity-50" />}
            emptyTitle="Expert Investissement & Levée de Fonds"
            emptyDesc="Posez vos questions sur la valorisation, le pitch deck, la cap table, la documentation juridique, le cadre réglementaire tunisien..."
          />
        </TabsContent>

        {/* ─── Generator Tab ─── */}
        <TabsContent value="generator" className="space-y-4 mt-4">
          <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-sm">Génération automatique de documents</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Les documents sont générés automatiquement à partir des données de votre projet (phases stratégiques, secteur, stade, business model) et adaptés au type de pitch sélectionné.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de Pitch / Contexte</label>
                <Select value={pitchType} onValueChange={setPitchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PITCH_TYPES.map(pt => (
                      <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Pitch Deck Generator */}
            <Card className="group hover:border-amber-500/50 transition-all border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pitch Deck</CardTitle>
                    <p className="text-xs text-muted-foreground">12 slides • Adapté au contexte</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {[sector || "Secteur", startupStage, PITCH_TYPES.find(p => p.value === pitchType)?.label.split("(")[0].trim() || ""].filter(Boolean).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Button
                  onClick={() => generateDocument("pitch-deck")}
                  disabled={generatingDoc !== null}
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {generatingDoc === "pitch-deck" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Génération...</>
                  ) : generatedDocs["pitch-deck"] ? (
                    <><Sparkles className="h-4 w-4" /> Régénérer</>
                  ) : (
                    <><FileText className="h-4 w-4" /> Générer le Pitch Deck</>
                  )}
                </Button>
                {generatedDocs["pitch-deck"] && (
                  <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => downloadGeneratedPDF(generatedDocs["pitch-deck"], "pitch-deck")}>
                    <Download className="h-3.5 w-3.5" /> Télécharger PDF
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Business Plan Generator */}
            <Card className="group hover:border-emerald-500/50 transition-all border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Business Plan</CardTitle>
                    <p className="text-xs text-muted-foreground">12 sections • Standard international</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {["Startup Act", sector || "Secteur", startupStage].filter(Boolean).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Button
                  onClick={() => generateDocument("business-plan")}
                  disabled={generatingDoc !== null}
                  className="w-full gap-2"
                >
                  {generatingDoc === "business-plan" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Génération...</>
                  ) : generatedDocs["business-plan"] ? (
                    <><Sparkles className="h-4 w-4" /> Régénérer</>
                  ) : (
                    <><BookOpen className="h-4 w-4" /> Générer le Business Plan</>
                  )}
                </Button>
                {generatedDocs["business-plan"] && (
                  <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => downloadGeneratedPDF(generatedDocs["business-plan"], "business-plan")}>
                    <Download className="h-3.5 w-3.5" /> Télécharger PDF
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className={`text-center py-6 ${phaseMessages.length === 0 ? "border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/10" : "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10"}`}>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${phaseMessages.length === 0 ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                  {phaseMessages.length === 0 ? <AlertTriangle className="h-7 w-7 text-amber-500" /> : <CheckCircle2 className="h-7 w-7 text-emerald-500" />}
                </div>
              </div>
              <div>
                <p className="font-semibold text-base mb-3">
                  {phaseMessages.length === 0 ? "💡 Comment ça marche ?" : "✅ Données disponibles pour la génération"}
                </p>
                <div className="text-sm text-muted-foreground max-w-2xl mx-auto text-left space-y-3">
                  <p className="leading-relaxed">
                    Les <strong>7 phases stratégiques</strong> constituent le parcours complet d'incubation IA de votre projet. 
                    Chaque phase analyse un aspect critique de votre startup :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>🔥</span> <strong>Phase 1</strong> — Identification de la disruption (type, marché, proposition de valeur)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>⚖️</span> <strong>Phase 2</strong> — Analyse réglementaire (certifications, brevets, normes)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>📐</span> <strong>Phase 3</strong> — Running Lean (Lean Canvas, hypothèses, roadmap MVP)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>👥</span> <strong>Phase 4</strong> — MVP ↔ Personas (mapping besoins, score d'adéquation)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>⚠️</span> <strong>Phase 5</strong> — Risques systémiques (matrice impact × probabilité)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>📈</span> <strong>Phase 6</strong> — Métriques combinées (scores globaux, KPIs)
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>🎯</span> <strong>Phase 7</strong> — Plan tactique (roadmap 12 mois, budget, stack, équipe)
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                    <p className="font-semibold text-primary mb-1">📋 Processus de génération</p>
                    <p>
                      {phaseMessages.length === 0 
                        ? "Pour enrichir vos documents, complétez les étapes d'incubation dans votre espace projet. Chaque rapport IA généré alimente le contenu du Pitch Deck et du Business Plan. Vous pouvez toutefois générer une version préliminaire dès maintenant basée sur les informations de votre projet."
                        : `${phaseMessages.length} message(s) de phases disponibles. Les documents seront générés à partir de ces données et des informations de votre projet. Plus vous complétez de phases, plus les documents seront riches et détaillés.`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated content preview */}
          {(generatedDocs["pitch-deck"] || generatedDocs["business-plan"]) && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4" /> Aperçu du document généré</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{generatedDocs["pitch-deck"] || generatedDocs["business-plan"] || ""}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── Theory Tab ─── */}
        <TabsContent value="theory" className="space-y-4 mt-4">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">
                <strong>📚 Formation théorique</strong> — Cliquez sur un sujet pour obtenir une analyse détaillée avec références académiques et protocoles d'experts.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-2 md:grid-cols-2">
            {THEORY_TOPICS.map(topic => {
              const Icon = topic.icon;
              return (
                <Button key={topic.id} variant="outline"
                  className="h-auto py-3 px-4 justify-start gap-3 text-left hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all"
                  onClick={() => sendMessage(topic.prompt)} disabled={isStreaming}>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">{topic.label}</span>
                </Button>
              );
            })}
          </div>

          <ChatPanel
            messages={chatMessages} input={input} setInput={setInput}
            isStreaming={isStreaming} onSend={sendMessage}
            placeholder="Approfondissez un concept théorique..."
            emptyIcon={<BookOpen className="h-10 w-10 text-amber-500 opacity-50" />}
            emptyTitle="Formation Théorique Interactive"
            emptyDesc="Sélectionnez un sujet ci-dessus ou posez votre question. Les réponses incluent des références académiques et des protocoles d'experts reconnus."
          />
        </TabsContent>

        {/* ─── Data Room Tab ─── */}
        <TabsContent value="dataroom" className="space-y-4 mt-4">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-sm">Data Room — Progression</h3>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  {isLoadingDeliverables ? "..." : `${completedDeliverables.size}/${DELIVERABLES.length}`}
                </Badge>
              </div>
              <Progress value={deliverableProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {deliverableProgress < 30 ? "🔴 Data Room insuffisante — Préparez vos livrables core en priorité"
                  : deliverableProgress < 70 ? "🟡 Data Room en cours — Continuez à compléter les livrables"
                  : deliverableProgress < 100 ? "🟢 Data Room presque complète — Finalisez les derniers éléments"
                  : "✅ Data Room complète — Prête pour les investisseurs !"}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              { title: "📋 Livrables Core", items: coreDeliverables, color: "border-blue-200 dark:border-blue-800" },
              { title: "⚖️ Documentation Juridique", items: legalDeliverables, color: "border-violet-200 dark:border-violet-800" },
              { title: "📊 Opérations & Finance", items: opsDeliverables, color: "border-emerald-200 dark:border-emerald-800" },
              { title: "📈 Post-Closing", items: postDeliverables, color: "border-teal-200 dark:border-teal-800" },
            ].map(section => (
              <Card key={section.title} className={section.color}>
                <CardHeader className="pb-1 pt-3">
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 pb-3">
                  {section.items.map(d => {
                    const Icon = d.icon;
                    const done = completedDeliverables.has(d.id);
                    return (
                      <div key={d.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-sm ${done ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800" : "bg-muted/30 hover:bg-muted/50 border border-transparent"}`}
                        onClick={() => toggleDeliverable(d.id)}>
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${done ? "text-emerald-600" : "text-muted-foreground"}`} />
                        <span className={`text-xs flex-1 ${done ? "line-through text-muted-foreground" : ""}`}>{d.label}</span>
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-1.5"
                          onClick={e => {
                            e.stopPropagation();
                            sendMessage(`Aide-moi à préparer le livrable "${d.label}" pour le projet "${projectName}" (${sector || "secteur non défini"}, stade: ${startupStage}). Donne-moi un protocole de réalisation complet avec template, étapes détaillées, références académiques et bonnes pratiques des experts (Y Combinator, Sequoia, Partech). Cite les sources.`);
                          }}>
                          <Bot className="h-3 w-3 mr-0.5" /> Guide
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* File Upload */}
          <Card className="border-dashed border-2 border-amber-300 dark:border-amber-700">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-sm">Documents uploadés</h3>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-3.5 w-3.5" /> Ajouter un fichier
                </Button>
                <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg" onChange={handleFileUpload} />
              </div>
              {uploadedFiles.length > 0 ? (
                <div className="space-y-1.5">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">Aucun fichier uploadé. Ajoutez vos livrables (PDF, DOCX, XLSX, PPTX).</p>
              )}
            </CardContent>
          </Card>

          {/* Export PDF button */}
          {chatMessages.length > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => exportDataRoomPDF()}
            >
              <Download className="h-4 w-4" />
              Exporter Data Room + Résultats Chatbot (PDF)
            </Button>
          )}

          <ChatPanel
            messages={chatMessages} input={input} setInput={setInput}
            isStreaming={isStreaming} onSend={sendMessage}
            placeholder="Posez une question sur un livrable ou demandez un template..."
            emptyIcon={<Building2 className="h-10 w-10 text-amber-500 opacity-50" />}
            emptyTitle="Assistant Data Room"
            emptyDesc="Cliquez sur 'Guide' à côté d'un livrable ou posez votre question pour obtenir un protocole de réalisation avec références académiques."
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default InvestSpace;
