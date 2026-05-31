import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Bot, Send, Loader2, BookOpen, Wallet,
  DollarSign, TrendingUp, PieChart, Scale, Globe,
  Briefcase, Landmark, Users, BarChart3, Shield,
  FileText, Target, Rocket, Zap, GraduationCap,
  FolderOpen, Link2, CheckCircle2, Download, Upload,
  Eye, Layers, Brain, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const INVEST_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invest-chatbot`;

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

// ── IA Invest Advisor topics ──
const ADVISOR_TOPICS = [
  { label: "Fonctionnement d'un VC", icon: Landmark, prompt: "Explique-moi en profondeur comment fonctionne un fonds de Venture Capital : LP, GP, véhicule, carry, management fees, cycle d'investissement. Donne des exemples concrets et cite les références académiques." },
  { label: "Cycle de financement (BA → IPO)", icon: TrendingUp, prompt: "Détaille le cycle complet de financement des startups de la phase pré-seed jusqu'à l'IPO. Montants typiques, dilution, métriques par stade, investisseurs types. Exemples réels." },
  { label: "Product/Market Fit pour les VC", icon: Target, prompt: "Explique l'importance critique du Product/Market Fit pour les VCs. Comment le mesurer (Sean Ellis test, NPS, retention), le démontrer dans un pitch. Cite Marc Andreessen, Sean Ellis." },
  { label: "Méthodes de Valorisation", icon: DollarSign, prompt: "Présente toutes les méthodes de valorisation (DCF, VC Method, Comparables, Berkus, Scorecard, Risk Factor) avec exemples chiffrés. Cite Damodaran." },
  { label: "Cap Table & Equity", icon: PieChart, prompt: "Explique le Sweat Equity, la Cap Table saine, la dilution par phase, ESOP, vesting. Comment maintenir l'attractivité investisseurs. Cite Carta, NVCA." },
  { label: "Documentation Juridique", icon: Scale, prompt: "Détaille tous les documents juridiques : SAFE, pacte d'actionnaires, OCA, CCA, term sheets, drag-along, tag-along, liquidation preference, ratchet. Cite Brad Feld." },
  { label: "Analyse de Sensibilité", icon: BarChart3, prompt: "Initie-moi à l'analyse de sensibilité : décote/premium investisseurs, critères objectifs et subjectifs de valorisation. Méthodologies Big Four." },
  { label: "Cadre Réglementaire Tunisien", icon: Globe, prompt: "Explique le cadre réglementaire tunisien : Startup Act, BCT, BVMT, administration fiscale, rapatriement des fonds. " },
  { label: "Post-Closing & Reporting", icon: Briefcase, prompt: "Exigences VC après closing : reporting extra-comptable, ESG, KPIs, gouvernance. Best practices NVCA." },
  { label: "Erreurs Critiques à Éviter", icon: Shield, prompt: "Les erreurs les plus critiques lors d'une levée de fonds avec exemples concrets, solutions et études de cas (CB Insights, HBR)." },
  { label: "Sources de Financement", icon: Wallet, prompt: "Panorama complet des sources de financement : VC, PE, CVC, BA, Crowdfunding, blended finance." },
  { label: "Instruments Financiers", icon: BookOpen, prompt: "Explique les instruments financiers : equity, quasi equity, venture debt, SAFE, mezzanine. Quand utiliser chacun ?" },
];

// ── Dossier Prep prompts ──
const DOSSIER_PROMPTS = [
  { label: "Structurer mon Pitch Deck", prompt: "Guide-moi étape par étape pour structurer un Pitch Deck de 12 slides percutant." },
  { label: "Rédiger l'Investment Memorandum", prompt: "Aide-moi à rédiger un Investment Memorandum complet." },
  { label: "Préparer le Business Plan", prompt: "Guide-moi pour préparer un Business Plan Financier crédible." },
  { label: "Valorisation Multi-Méthodes", prompt: "Aide-moi à valoriser ma startup avec plusieurs méthodes (DCF, VC Method, Comparables, Berkus)." },
  { label: "Montage Financier & Cap Table", prompt: "Guide-moi pour structurer le montage financier de ma levée." },
  { label: "Term Sheet & SAFE", prompt: "Aide-moi à préparer et comprendre un term sheet et un contrat SAFE." },
  { label: "Data Room Structurée", prompt: "Guide-moi pour organiser une Data Room professionnelle." },
  { label: "Projections Financières 3 ans", prompt: "Aide-moi à construire des projections financières crédibles sur 3 ans." },
];

const DELIVERABLES_LIST = [
  { id: "pitch-deck", label: "Pitch Deck (12 slides)", icon: FileText },
  { id: "teaser", label: "Teaser / One-Pager", icon: FileText },
  { id: "investment-memo", label: "Investment Memorandum", icon: BookOpen },
  { id: "business-plan", label: "Business Plan Financier", icon: BarChart3 },
  { id: "valorisation", label: "Valorisation Multi-Méthodes", icon: DollarSign },
  { id: "montage-financier", label: "Montage Financier", icon: PieChart },
  { id: "cap-table", label: "Cap Table", icon: Users },
  { id: "term-sheet", label: "Term Sheet / LOI", icon: Scale },
  { id: "safe-contract", label: "Contrat SAFE", icon: Shield },
  { id: "shareholder-agreement", label: "Pacte d'Actionnaires", icon: Shield },
  { id: "data-room", label: "Data Room Structurée", icon: FolderOpen },
  { id: "financial-projections", label: "Projections Financières 3 ans", icon: TrendingUp },
];

const InvestPage = () => {
  const { toast } = useToast();
  const [advisorMessages, setAdvisorMessages] = useState<ChatMessage[]>([]);
  const [dossierMessages, setDossierMessages] = useState<ChatMessage[]>([]);
  const [advisorInput, setAdvisorInput] = useState("");
  const [dossierInput, setDossierInput] = useState("");
  const [isAdvisorStreaming, setIsAdvisorStreaming] = useState(false);
  const [isDossierStreaming, setIsDossierStreaming] = useState(false);
  const advisorScrollRef = useRef<HTMLDivElement>(null);
  const dossierScrollRef = useRef<HTMLDivElement>(null);
  const [uploadedFileContent, setUploadedFileContent] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [importedResultsText, setImportedResultsText] = useState("");

  useEffect(() => {
    if (advisorScrollRef.current) advisorScrollRef.current.scrollTop = advisorScrollRef.current.scrollHeight;
  }, [advisorMessages]);

  useEffect(() => {
    if (dossierScrollRef.current) dossierScrollRef.current.scrollTop = dossierScrollRef.current.scrollHeight;
  }, [dossierMessages]);

  const streamChat = async (
    content: string,
    messages: ChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setStreaming: React.Dispatch<React.SetStateAction<boolean>>,
    mode: "advisor" | "dossier"
  ) => {
    if (!content.trim() || (mode === "advisor" ? isAdvisorStreaming : isDossierStreaming)) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: content.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const allMessages = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch(INVEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, mode, projectContext: null }),
      });

      if (resp.status === 429) { toast({ title: "Limite atteinte", description: "Trop de requêtes.", variant: "destructive" }); return; }
      if (resp.status === 402) { toast({ title: "Crédits épuisés", description: "Rechargez vos crédits IA.", variant: "destructive" }); return; }
      if (!resp.ok) throw new Error("Erreur IA");
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
              setMessages(prev => {
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
      setStreaming(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setUploadedFileContent(text.substring(0, 8000)); // limit context
      toast({ title: "📄 Fichier chargé", description: `${file.name} prêt pour analyse.` });
    };
    reader.readAsText(file);
  };

  const analyzeUploadedFile = () => {
    if (!uploadedFileContent) return;
    const prompt = `Analyse le fichier "${uploadFileName}" suivant et donne un diagnostic complet pour la préparation d'investissement :\n\n---\n${uploadedFileContent}\n---\n\nDonne : 1) Points forts, 2) Points faibles, 3) Recommandations prioritaires, 4) Score de readiness investisseur /100.`;
    streamChat(prompt, advisorMessages, setAdvisorMessages, setAdvisorInput, setIsAdvisorStreaming, "advisor");
  };

  const importResultsForAnalysis = () => {
    if (!importedResultsText.trim()) {
      toast({ title: "Contenu vide", description: "Collez vos résultats de tests avant d'importer.", variant: "destructive" });
      return;
    }
    const prompt = `Voici les résultats consolidés de tous les tests de validation de notre startup. Analyse-les en profondeur et prépare un tableau de bord stratégique pour guider la préparation des dossiers d'investissement :\n\n---\n${importedResultsText}\n---\n\nStructure ta réponse en : 1) Synthèse exécutive, 2) Forces/Faiblesses par axe (Marché, Produit, Équipe, Finance), 3) Readiness Score global, 4) Recommandations par livrable d'investissement, 5) Red flags pour les investisseurs.`;
    streamChat(prompt, advisorMessages, setAdvisorMessages, setAdvisorInput, setIsAdvisorStreaming, "advisor");
    setImportedResultsText("");
  };

  const downloadChatPDF = (messages: ChatMessage[], title: string) => {
    if (messages.length === 0) {
      toast({ title: "Aucun contenu", description: "Lancez une conversation avant de télécharger.", variant: "destructive" });
      return;
    }
    const content = messages.map(m => {
      const role = m.role === "user" ? "👤 Vous" : "🤖 IA Expert";
      return `${role}\n${"─".repeat(40)}\n${m.content}\n`;
    }).join("\n\n");
    const header = `${"═".repeat(50)}\n${title.toUpperCase()}\nSTARTUNUP — Espace Invest\nDate : ${new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}\n${"═".repeat(50)}\n\n`;
    const blob = new Blob([header + content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Téléchargement lancé ✅" });
  };

  const ChatArea = ({
    scrollRef, messages, input, setInput, isStreaming, onSend, emptyIcon, emptyTitle, emptyDesc, placeholder, downloadTitle
  }: {
    scrollRef: React.RefObject<HTMLDivElement>; messages: ChatMessage[]; input: string; setInput: (v: string) => void;
    isStreaming: boolean; onSend: (c: string) => void; emptyIcon: React.ReactNode; emptyTitle: string; emptyDesc: string; placeholder: string; downloadTitle: string;
  }) => (
    <div className="space-y-3">
      <div ref={scrollRef} className="bg-muted/10 rounded-2xl border min-h-[400px] max-h-[55vh] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-3">{emptyIcon}</div>
            <p className="font-medium text-sm">{emptyTitle}</p>
            <p className="text-xs mt-1 max-w-sm mx-auto">{emptyDesc}</p>
          </div>
        )}
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border shadow-sm"}`}>
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
      <div className="flex gap-2 items-end">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend(input);
            }
          }}
          placeholder={placeholder} disabled={isStreaming}
          rows={1}
          className="rounded-2xl min-h-[44px] max-h-[160px] resize-none shadow-sm text-sm py-3 px-4"
          style={{ height: 'auto', overflow: 'hidden' }}
          ref={(el) => {
            if (el) {
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 160) + 'px';
            }
          }}
        />
        <Button onClick={() => onSend(input)} disabled={isStreaming || !input.trim()} size="icon"
          className="rounded-full h-11 w-11 shrink-0 shadow-lg">
          <Send className="h-4 w-4" />
        </Button>
        {messages.length > 0 && (
          <Button onClick={() => downloadChatPDF(messages, downloadTitle)} variant="outline" size="icon"
            className="rounded-full h-11 w-11 shrink-0" title="Télécharger">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Link to="/communaute" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour à la Communauté
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 mb-8">
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 text-sm px-4 py-1.5">
              <Wallet className="h-3.5 w-3.5 mr-1.5" /> Espace Invest Unifié
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Conseil, Coaching & Aide à la Décision</h1>
            <p className="text-muted-foreground">
              Plateforme unifiée : IA Advisor, Préparation Dossiers, Analyse de Résultats et Liaison Stratégique — 
              tout interconnecté pour accélérer votre levée de fonds.
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="advisor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="advisor" className="gap-2 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4" /> <span className="hidden sm:inline">IA Invest Advisor</span><span className="sm:hidden">Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="dossier" className="gap-2 text-xs sm:text-sm">
              <FolderOpen className="h-4 w-4" /> <span className="hidden sm:inline">Préparation Dossiers</span><span className="sm:hidden">Dossiers</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" /> <span className="hidden sm:inline">Tableau de Bord</span><span className="sm:hidden">Résultats</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="gap-2 text-xs sm:text-sm">
              <Link2 className="h-4 w-4" /> <span className="hidden sm:inline">Liaison Stratégique</span><span className="sm:hidden">Liaison</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── IA INVEST ADVISOR + FILE UPLOAD ─── */}
          <TabsContent value="advisor" className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>🎓 IA Invest Advisor</strong> — Professeur expert en investissement + analyse de fichiers. 
                  Uploadez vos documents pour un diagnostic investisseur.
                </p>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept=".txt,.csv,.md,.json" className="hidden" onChange={handleFileUpload} />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-primary/50 hover:bg-primary/5 transition-colors">
                      <Upload className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Upload fichier</span>
                    </div>
                  </label>
                  {uploadFileName && (
                    <>
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="h-3 w-3" /> {uploadFileName}
                      </Badge>
                      <Button size="sm" onClick={analyzeUploadedFile} disabled={isAdvisorStreaming} className="gap-1.5">
                        <Brain className="h-3.5 w-3.5" /> Analyser
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ADVISOR_TOPICS.map(topic => {
                const Icon = topic.icon;
                return (
                  <Button key={topic.label} variant="outline" size="sm"
                    className="h-auto py-3 px-4 justify-start gap-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={() => streamChat(topic.prompt, advisorMessages, setAdvisorMessages, setAdvisorInput, setIsAdvisorStreaming, "advisor")}
                    disabled={isAdvisorStreaming}>
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium">{topic.label}</span>
                  </Button>
                );
              })}
            </div>

            <ChatArea
              scrollRef={advisorScrollRef} messages={advisorMessages} input={advisorInput} setInput={setAdvisorInput}
              isStreaming={isAdvisorStreaming}
              onSend={c => streamChat(c, advisorMessages, setAdvisorMessages, setAdvisorInput, setIsAdvisorStreaming, "advisor")}
              emptyIcon={<GraduationCap className="h-10 w-10 text-primary opacity-50" />}
              emptyTitle="IA Invest Advisor"
              emptyDesc="Posez vos questions ou uploadez un fichier pour un diagnostic investisseur."
              placeholder="Posez votre question sur l'investissement..."
              downloadTitle="IA Invest Advisor"
            />
          </TabsContent>

          {/* ─── PRÉPARATION DOSSIERS ─── */}
          <TabsContent value="dossier" className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>📋 Préparation de Dossiers</strong> — Expert IA spécialisé par type de livrable et tour de financement.
                </p>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-2">
              {DOSSIER_PROMPTS.map(item => (
                <Button key={item.label} variant="outline" size="sm"
                  className="h-auto py-3 px-4 justify-start gap-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => streamChat(item.prompt, dossierMessages, setDossierMessages, setDossierInput, setIsDossierStreaming, "dossier")}
                  disabled={isDossierStreaming}>
                  <FolderOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              ))}
            </div>

            {/* Deliverables Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" /> Livrables d'Investissement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DELIVERABLES_LIST.map(d => {
                    const Icon = d.icon;
                    return (
                      <div key={d.id} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <ChatArea
              scrollRef={dossierScrollRef} messages={dossierMessages} input={dossierInput} setInput={setDossierInput}
              isStreaming={isDossierStreaming}
              onSend={c => streamChat(c, dossierMessages, setDossierMessages, setDossierInput, setIsDossierStreaming, "dossier")}
              emptyIcon={<FolderOpen className="h-10 w-10 text-primary opacity-50" />}
              emptyTitle="Expert Préparation de Dossiers"
              emptyDesc="L'IA guide la création de chaque document d'investissement."
              placeholder="Décrivez votre besoin pour la préparation de dossier..."
              downloadTitle="Préparation Dossiers Investissement"
            />
          </TabsContent>

          {/* ─── TABLEAU DE BORD — Import Résultats ─── */}
          <TabsContent value="results" className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>📊 Tableau de Bord Investisseur</strong> — Importez les résultats de tous vos tests (V1 TEST, MVP Validator, 
                  Incubation IA) pour une analyse consolidée et des recommandations d'investissement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" /> Importer les résultats de tests
                </CardTitle>
                <CardDescription>
                  Collez vos résultats (TVH, TVF, TVP, scores d'incubation, métriques MVP) pour une analyse IA approfondie.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={importedResultsText}
                  onChange={e => setImportedResultsText(e.target.value)}
                  placeholder={`Exemple :\nTVH: 65% | TVF: 48% | TVP: 52% | TVG: 56%\nIncubation: Étape 1 (82/100), Étape 2 (71/100)...\nMétriques: MRR 2500€, CAC 45€, Churn 8%\nTests: Landing page 12% conversion, Smoke test 85 signups...`}
                  className="min-h-[150px] text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={importResultsForAnalysis} disabled={isAdvisorStreaming || !importedResultsText.trim()} className="gap-2">
                    <Brain className="h-4 w-4" /> Analyser avec l'IA
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const sampleData = `TVH: 65% | TVF: 48% | TVP: 52% | TVG: 56%\nIncubation IA: Découverte (82/100), Réglementaire (71/100), Lean Canvas (68/100), Personas (74/100), Risques (59/100), Métriques (63/100), Plan Tactique (77/100)\nMétriques: MRR 2500€, CAC 45€, LTV 380€, Churn 8%\nTests réalisés: Landing page (12% conversion), Smoke test (85 signups), Interview clients (22/30), A/B test pricing (+18% conversion)`;
                    setImportedResultsText(sampleData);
                  }}>
                    Exemple de données
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick metrics summary */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Pôle Stratégique", desc: "7 phases d'incubation IA", icon: Zap, href: "/pole-strategique" },
                { label: "V1 TEST", desc: "TVH, TVF, TVP validés", icon: Rocket, href: "/pole-strategique" },
                { label: "Lean Canvas Lab", desc: "6 phases + 25 outils", icon: Target, href: "/communaute/lean-canvas-lab" },
                { label: "Market Intelligence", desc: "TAM/SAM/SOM, concurrence", icon: TrendingUp, href: "/market-intelligence" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4 text-center">
                      <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                      <Button asChild size="sm" variant="outline" className="mt-2 gap-1.5 w-full">
                        <Link to={item.href}>Importer <Download className="h-3 w-3" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Show analysis results in the advisor chat */}
            {advisorMessages.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" /> Dernière analyse IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                    {advisorMessages.filter(m => m.role === "assistant").slice(-1).map(m => (
                      <div key={m.id} className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── LIAISON STRATÉGIQUE ─── */}
          <TabsContent value="connections" className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>🔗 Liaison Stratégique</strong> — Tous les espaces interconnectés pour alimenter vos livrables d'investissement.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Pôle Stratégique", desc: "7 phases d'incubation + Consultant IA", href: "/pole-strategique", icon: Zap, data: "Phases, rapports IA, milestones" },
                { title: "MVP Validator + V1 TEST", desc: "Tests, métriques, hypothèses, personas", href: "/pole-strategique", icon: Rocket, data: "TVH, TVF, TVP, V1 TEST, KPIs" },
                { title: "Lean Canvas Lab", desc: "Protocole 6 phases + 25 outils", href: "/communaute/lean-canvas-lab", icon: Target, data: "Canvas, pivots, validation" },
                { title: "Market Intelligence", desc: "Méthodologie YC + Stress-test VC", href: "/market-intelligence", icon: TrendingUp, data: "TAM/SAM/SOM, concurrence, insights" },
              ].map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div key={link.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className="h-5 w-5 text-primary" /> {link.title}
                        </CardTitle>
                        <CardDescription className="text-xs">{link.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge variant="outline" className="text-xs">{link.data}</Badge>
                        <Button asChild size="sm" className="gap-2 w-full">
                          <Link to={link.href}>Accéder <Target className="h-3.5 w-3.5" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* How it works */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="py-6">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" /> Flux de travail unifié
                </h4>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Complétez les <strong>7 phases d'incubation</strong> dans le Pôle Stratégique</li>
                  <li>Lancez le <strong>V1 TEST</strong> pour valider hypothèses × fonctionnalités × personas</li>
                  <li>Enrichissez avec <strong>Lean Canvas Lab</strong> et <strong>Market Intelligence</strong></li>
                  <li>Importez tous les résultats dans l'onglet <strong>Tableau de Bord</strong></li>
                  <li>L'IA analyse et prépare un <strong>diagnostic investisseur complet</strong></li>
                  <li>Utilisez <strong>Préparation Dossiers</strong> pour affiner chaque livrable</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default InvestPage;
