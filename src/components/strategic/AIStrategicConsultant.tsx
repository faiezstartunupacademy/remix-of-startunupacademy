import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Download, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ConsultantProps {
  projectId?: string;
  autoFillData?: {
    name?: string;
    sector?: string;
    description?: string;
    stage?: string;
    problem_description?: string;
    solution_description?: string;
  };
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strategic-orchestrator`;

export const AIStrategicConsultant = ({ projectId, autoFillData }: ConsultantProps) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("Limitée");
  const [dailyHours, setDailyHours] = useState("2-4");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (autoFillData) {
      const autoSkills = [
        autoFillData.sector && `Expertise ${autoFillData.sector}`,
        autoFillData.solution_description && "Innovation produit",
        autoFillData.stage === "idea" && "Idéation stratégique",
        autoFillData.stage === "mvp" && "Développement MVP",
      ].filter(Boolean).join(", ");
      if (autoSkills) setSkills(autoSkills);
    }
  }, [autoFillData]);

  const runStrategicAnalysis = async () => {
    if (!skills.trim()) {
      toast({ title: "Erreur", description: "Veuillez renseigner vos compétences", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    const contextData = autoFillData ? `
Contexte du projet:
- Nom: ${autoFillData.name || "Non renseigné"}
- Secteur: ${autoFillData.sector || "Non renseigné"}
- Description: ${autoFillData.description || "Non renseigné"}
- Stade: ${autoFillData.stage || "Non renseigné"}
- Problème identifié: ${autoFillData.problem_description || "Non renseigné"}
- Solution proposée: ${autoFillData.solution_description || "Non renseigné"}
` : "";

    const strategicPrompt = `**Rôle (Role):**

Agis en tant que consultant expert en Stratégie Compétitive (Competitive Strategy) et Économie des Plateformes (Platform Economics), avec une expertise appliquée en conception de projets numériques scalables basés sur l'Intelligence Artificielle.

**Objectif (Objective):**

Fournir une consultation stratégique pour concevoir un projet (Side Business) caractérisé par la Durabilité Opérationnelle (Operational Sustainability) et la capacité de croissance sans dépendance intensive en effort manuel.

**Données d'entrée (Inputs):**

${contextData}

• Avantage Compétitif (Competitive Advantage): 
Compétences: ${skills}

• Ressources Disponibles (Resource-Based View – RBV):
  - Budget: ${budget}
  - Temps de concentration quotidien: ${dailyHours} heures

**Analyses Requises (Analysis & Output):**

**1. Analyse des Lacunes de Marché (Gap Analysis):**
• Identifie une lacune réelle, mal desservie ou non desservie du marché
• Explique comment exploiter mes compétences avec l'IA Générative pour combler cette lacune avec une Scalabilité élevée

**2. Ingénierie de la Valeur (Value Engineering):**
• Propose un modèle d'affaires atteignant:
  - Réduction du Coût d'Acquisition Client (Low CAC)
  - Maximisation de la Valeur Vie Client (High LTV)
• Détaille mécanismes de tarification, rétention clients et sources de valeur long terme

**3. Stratégie Océan Bleu (Blue Ocean Strategy):**
• Conçois une idée/proposition de valeur échappant à la concurrence directe sur les prix
• Focus sur l'Innovation de Valeur via redéfinition du problème, client ou méthode de solution

**4. Feuille de Route MVP (MVP Roadmap):**
• Définis composants MVP essentiels selon Lean Thinking
• Propose indicateurs clés (KPIs) à mesurer pendant les 30 premiers jours:
  - Taux d'engagement
  - Coût de test
  - Taux de conversion
  - Signaux de Problem-Solution Fit

**Contraintes et Méthodologie:**
• Applique le Principe de Pareto (80/20) en priorisant activités à impact/rentabilité maximale
• Évite solutions théoriques génériques, fournis recommandations immédiatement applicables
• Utilise des TABLEAUX MARKDOWN pour les données chiffrées
• Fournis des scores quantifiés /10 pour chaque dimension

**Format de Sortie:**
• Analyse structurée avec titres clairs
• Langage stratégique précis
• Recommandations pratiques testables en 30 jours`;

    try {
      abortRef.current = new AbortController();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: "strategic_consultation",
          prompt: strategicPrompt,
          projectId,
        }),
        signal: abortRef.current.signal,
      });

      if (resp.status === 429) {
        toast({ title: "Trop de requêtes", description: "Réessayez dans quelques instants.", variant: "destructive" });
        setIsAnalyzing(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Crédits IA épuisés", description: "Veuillez recharger votre compte.", variant: "destructive" });
        setIsAnalyzing(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Erreur du service IA");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";
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
              fullText += content;
              setAnalysis(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      toast({ title: "✓ Analyse stratégique complétée", description: "Consultez les recommandations ci-dessous" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Strategic analysis error:", error);
      toast({ title: "Erreur", description: error.message || "Erreur lors de l'analyse", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportAnalysis = () => {
    const blob = new Blob([analysis], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consultation-strategique-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Badge className="mb-3 bg-gradient-to-r from-purple-600 to-blue-600">
          Consultation Stratégique IA
        </Badge>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Consultant Stratégique IA
        </h2>
        <p className="text-muted-foreground">
          Analyse experte en stratégie compétitive, économie de plateformes et IA générative
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Vos Paramètres Stratégiques
            </CardTitle>
            <CardDescription>Renseignez vos compétences et ressources disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {autoFillData && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Données pré-remplies depuis votre projet
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  {autoFillData.name && <li>• Projet : {autoFillData.name}</li>}
                  {autoFillData.sector && <li>• Secteur : {autoFillData.sector}</li>}
                  {autoFillData.stage && <li>• Stade : {autoFillData.stage}</li>}
                  {autoFillData.problem_description && <li>• Problème : {autoFillData.problem_description.slice(0, 80)}...</li>}
                </ul>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Compétences Clés (Competitive Advantage)</label>
              <Textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Ex: Développement web, Marketing digital, Design UX, Data Science..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Budget Disponible</label>
              <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex: Limitée, 5000€, Bootstrap" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Temps Quotidien (heures)</label>
              <Input value={dailyHours} onChange={(e) => setDailyHours(e.target.value)} placeholder="Ex: 2-4, 6-8" />
            </div>

            <Button
              onClick={runStrategicAnalysis}
              disabled={isAnalyzing}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isAnalyzing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyse en cours (streaming)...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Lancer l'Analyse Stratégique</>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: "Gap Analysis", icon: TrendingUp, color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20" },
                { label: "Value Engineering", icon: BarChart3, color: "from-purple-500/10 to-pink-500/10 border-purple-500/20" },
                { label: "Blue Ocean", icon: Zap, color: "from-green-500/10 to-emerald-500/10 border-green-500/20" },
                { label: "MVP Roadmap", icon: Target, color: "from-orange-500/10 to-red-500/10 border-orange-500/20" },
              ].map(({ label, icon: Icon, color }) => (
                <Card key={label} className={`bg-gradient-to-br ${color}`}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-xs flex items-center gap-1">
                      <Icon className="h-3 w-3" /> {label}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" /> Analyse & Recommandations
              </CardTitle>
              {analysis && (
                <Button variant="outline" size="sm" onClick={exportAnalysis} className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              )}
            </div>
            <CardDescription>Stratégie compétitive basée sur vos paramètres</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/30 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Remplissez vos paramètres et lancez l'analyse pour obtenir une consultation stratégique personnalisée</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 border-purple-500/20">
        <CardHeader><CardTitle className="text-sm">Méthodologie Appliquée</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-xs">
            <div>
              <h4 className="font-semibold mb-1 text-purple-600">Principe de Pareto (80/20)</h4>
              <p className="text-muted-foreground">Focus sur les 20% d'activités générant 80% des résultats</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-blue-600">Lean Thinking</h4>
              <p className="text-muted-foreground">Élimination des gaspillages, MVP optimal</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-cyan-600">Resource-Based View</h4>
              <p className="text-muted-foreground">Exploitation maximale de vos ressources uniques</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-green-600">Value Innovation</h4>
              <p className="text-muted-foreground">Création d'océans bleus sans concurrence directe</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
