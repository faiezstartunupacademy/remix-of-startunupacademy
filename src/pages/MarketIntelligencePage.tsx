import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Target, AlertTriangle, TrendingUp, FileText, Sparkles, Plus, X, BarChart3, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { BusinessIntelligenceDashboard } from "@/components/strategic/BusinessIntelligenceDashboard";
import MarketToolsPanel from "@/components/market-intel/MarketToolsPanel";
import { Wrench } from "lucide-react";

type DataSource = {
  id: string;
  type: "competitor" | "earnings" | "reviews" | "reddit" | "other";
  url: string;
  content: string;
};

type MvpProject = { id: string; name: string };

const MarketIntelligencePage = () => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<"collect" | "insights" | "assumptions" | "stress-test">("collect");
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [newSource, setNewSource] = useState({ type: "competitor" as const, url: "", content: "" });
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mainTab, setMainTab] = useState<"market" | "bi">("market");
  const [biProjectId, setBiProjectId] = useState("");
  const [mvpProjects, setMvpProjects] = useState<MvpProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Auto-load user's MVP projects
  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoadingProjects(false); return; }
        const { data } = await supabase
          .from("mvp_validator_projects")
          .select("id, name")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) {
          setMvpProjects(data as MvpProject[]);
          if (data.length > 0) setBiProjectId((data as MvpProject[])[0].id);
        }
      } catch (e) {
        console.error("Error loading MVP projects:", e);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, []);

  const addDataSource = () => {
    if (!newSource.url || !newSource.content) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    setDataSources([...dataSources, { ...newSource, id: Date.now().toString() }]);
    setNewSource({ type: "competitor", url: "", content: "" });
    toast({ title: "Source ajoutée", description: "La source de données a été ajoutée avec succès" });
  };

  const removeSource = (id: string) => {
    setDataSources(dataSources.filter(s => s.id !== id));
  };

  const runAnalysis = async (analysisType: string) => {
    if (dataSources.length === 0) {
      toast({ title: "Aucune donnée", description: "Veuillez ajouter au moins une source de données", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-intelligence-chatbot", {
        body: { sources: dataSources, analysisType },
      });
      if (error) throw error;
      setAnalysisResult(data.analysis);
      toast({ title: "Analyse terminée", description: "L'analyse a été générée avec succès" });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Erreur", description: "Erreur lors de l'analyse", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const phases = [
    { id: "collect", title: "Collecte de Données Brutes", description: "Sites concurrents, appels de résultats, avis clients, discussions Reddit", icon: FileText, color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-500" },
    { id: "insights", title: "Vérités Cachées du Marché", description: "Ce que les acteurs réussis comprennent mais que les clients ne disent pas", icon: Sparkles, color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-500" },
    { id: "assumptions", title: "Test des Hypothèses", description: "Les 3 hypothèses clés et leurs points de rupture", icon: Target, color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
    { id: "stress-test", title: "Stress-Test Investisseur", description: "5 questions destructives avec réponses basées sur les preuves", icon: AlertTriangle, color: "from-red-500/20 to-rose-500/20", iconColor: "text-red-500" },
  ];

  const sourceTypes = [
    { value: "competitor", label: "Site Concurrent", icon: TrendingUp },
    { value: "earnings", label: "Appel de Résultats", icon: FileText },
    { value: "reviews", label: "Avis Clients", icon: Search },
    { value: "reddit", label: "Discussions Reddit", icon: Sparkles },
    { value: "other", label: "Autre", icon: Plus },
  ];

  // Color-coded analysis result rendering
  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const sections = analysisResult.split(/(?=^#{1,3}\s)/m);

    const sectionColors = [
      { bg: "bg-blue-500/5", border: "border-blue-500/20", accent: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
      { bg: "bg-emerald-500/5", border: "border-emerald-500/20", accent: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
      { bg: "bg-purple-500/5", border: "border-purple-500/20", accent: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
      { bg: "bg-amber-500/5", border: "border-amber-500/20", accent: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
      { bg: "bg-rose-500/5", border: "border-rose-500/20", accent: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
      { bg: "bg-cyan-500/5", border: "border-cyan-500/20", accent: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500" },
    ];

    if (sections.length <= 1) {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border-t pt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Résultat de l'analyse
          </h4>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none dark:prose-invert max-h-96 overflow-y-auto">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border-t pt-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Résultat de l'analyse
        </h4>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {sections.filter(s => s.trim()).map((section, idx) => {
            const color = sectionColors[idx % sectionColors.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className={`${color.bg} ${color.border} border`}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-1 self-stretch rounded-full ${color.dot} shrink-0`} />
                      <div className={`prose prose-sm max-w-none dark:prose-invert flex-1 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>h1]:font-bold [&>h2]:font-semibold [&>h3]:font-semibold [&>h1]:${color.accent} [&>h2]:${color.accent} [&>h3]:${color.accent}`}>
                        <ReactMarkdown>{section.trim()}</ReactMarkdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-violet-500 to-purple-500">Méthodologie Y Combinator</Badge>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Market Intelligence Lab
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transformez des données brutes en stratégie de marché niveau expert en 3 heures
            </p>
          </div>

          {/* Main Tab Switch: Market Intelligence vs BI */}
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)} className="mb-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
              <TabsTrigger value="market" className="gap-2">
                <Target className="h-4 w-4" /> Market Intelligence
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-2">
                <Wrench className="h-4 w-4" /> Outils Lab
              </TabsTrigger>
              <TabsTrigger value="bi" className="gap-2">
                <BarChart3 className="h-4 w-4" /> Business Intelligence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="mt-6">
              <MarketToolsPanel />
            </TabsContent>

            <TabsContent value="market" className="mt-6">
              {/* Phase Navigation */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {phases.map((phase, idx) => (
                  <motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card
                      className={`cursor-pointer transition-all border-2 ${currentPhase === phase.id ? "border-primary shadow-lg" : "border-border hover:border-primary/50"} bg-gradient-to-br ${phase.color}`}
                      onClick={() => setCurrentPhase(phase.id as any)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <phase.icon className={`h-5 w-5 ${phase.iconColor}`} />
                          <Badge variant="outline">{idx + 1}</Badge>
                        </div>
                        <CardTitle className="text-sm">{phase.title}</CardTitle>
                        <CardDescription className="text-xs">{phase.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Panel - Data Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Sources de Données</CardTitle>
                    <CardDescription>Ajoutez vos matériaux bruts : sites, transcriptions, avis, discussions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Type de source</label>
                        <div className="grid grid-cols-2 gap-2">
                          {sourceTypes.map((type) => (
                            <Button
                              key={type.value}
                              variant={newSource.type === type.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewSource({ ...newSource, type: type.value as any })}
                              className="justify-start gap-2"
                            >
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">URL / Référence</label>
                        <Input value={newSource.url} onChange={(e) => setNewSource({ ...newSource, url: e.target.value })} placeholder="https://..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Contenu / Notes</label>
                        <Textarea value={newSource.content} onChange={(e) => setNewSource({ ...newSource, content: e.target.value })} placeholder="Collez le texte, les insights clés, ou vos notes..." rows={4} />
                      </div>
                      <Button onClick={addDataSource} className="w-full gap-2"><Plus className="h-4 w-4" /> Ajouter la source</Button>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-3">Sources collectées ({dataSources.length})</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {dataSources.map((source) => (
                          <div key={source.id} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <Badge variant="outline" className="mb-1">{sourceTypes.find((t) => t.value === source.type)?.label}</Badge>
                              <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                              <p className="text-xs mt-1 line-clamp-2">{source.content}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeSource(source.id)}><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                        {dataSources.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune source ajoutée</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Panel - Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Analyse Intelligente</CardTitle>
                    <CardDescription>Posez les bonnes questions pour révéler les insights cachés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={currentPhase} onValueChange={(v) => setCurrentPhase(v as any)} className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="collect">1</TabsTrigger>
                        <TabsTrigger value="insights">2</TabsTrigger>
                        <TabsTrigger value="assumptions">3</TabsTrigger>
                        <TabsTrigger value="stress-test">4</TabsTrigger>
                      </TabsList>

                      <TabsContent value="collect" className="space-y-3">
                        <p className="text-sm text-muted-foreground">Collectez d'abord vos données brutes. Une fois prêt, passez à l'analyse.</p>
                      </TabsContent>

                      <TabsContent value="insights" className="space-y-3">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-3">
                          <p className="text-sm font-medium mb-2">Question stratégique :</p>
                          <p className="text-sm italic">"Qu'est-ce que les acteurs qui réussissent dans ce marché comprennent, mais que les clients ne disent jamais explicitement ?"</p>
                        </div>
                        <Button onClick={() => runAnalysis("hidden-truths")} disabled={isAnalyzing} className="w-full gap-2">
                          <Sparkles className="h-4 w-4" /> {isAnalyzing ? "Analyse en cours..." : "Révéler les vérités cachées"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="assumptions" className="space-y-3">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-3">
                          <p className="text-sm font-medium mb-2">Questions stratégiques :</p>
                          <ol className="text-sm space-y-1 list-decimal list-inside italic">
                            <li>Quelles sont les 3 hypothèses fondamentales de ce marché ?</li>
                            <li>Que devrait-il se passer pour que ces hypothèses deviennent fausses ?</li>
                          </ol>
                        </div>
                        <Button onClick={() => runAnalysis("assumptions")} disabled={isAnalyzing} className="w-full gap-2">
                          <Target className="h-4 w-4" /> {isAnalyzing ? "Analyse en cours..." : "Analyser les hypothèses"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="stress-test" className="space-y-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-3">
                          <p className="text-sm font-medium mb-2">Stress-test investisseur :</p>
                          <p className="text-sm italic">"Écris 5 questions qu'un investisseur expert utiliserait pour détruire cette idée... puis réponds-y en te basant UNIQUEMENT sur les preuves."</p>
                        </div>
                        <Button onClick={() => runAnalysis("stress-test")} disabled={isAnalyzing} className="w-full gap-2" variant="destructive">
                          <AlertTriangle className="h-4 w-4" /> {isAnalyzing ? "Analyse en cours..." : "Lancer le stress-test"}
                        </Button>
                      </TabsContent>
                    </Tabs>

                    {renderAnalysisResult()}
                  </CardContent>
                </Card>
              </div>

              {/* Methodology */}
              <Card className="mt-8 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-violet-500" /> Méthodologie Y Combinator</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>Cette approche, utilisée par les fondateurs les plus performants de Y Combinator, transforme des données brutes en stratégie experte en 3 heures au lieu de plusieurs mois.</p>
                  <p className="font-medium">Au lieu de demander à l'IA "analyse mon marché"...</p>
                  <ol>
                    <li><strong>Alimentez l'IA avec des matériaux réels</strong> : sites concurrents, transcriptions d'appels de résultats, avis authentiques, discussions Reddit</li>
                    <li><strong>Posez des questions stratégiques profondes</strong> : révélez ce que les experts comprennent mais que personne ne dit</li>
                    <li><strong>Testez les hypothèses fondamentales</strong> : identifiez les piliers du marché et leurs points de rupture</li>
                    <li><strong>Stress-testez avec des yeux d'investisseur</strong> : 5 questions destructives pour valider la résilience de votre idée</li>
                  </ol>
                  <p className="text-sm text-muted-foreground italic">Résultat : Une stratégie de marché qui semble être le fruit d'années d'expérience sectorielle.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bi" className="mt-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" /> Business Intelligence
                  </CardTitle>
                  <CardDescription>Sélectionnez votre projet MVP pour afficher le tableau de bord BI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 max-w-lg items-center">
                    {loadingProjects ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Chargement des projets...
                      </div>
                    ) : mvpProjects.length > 0 ? (
                      <Select value={biProjectId} onValueChange={setBiProjectId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sélectionnez un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {mvpProjects.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Aucun projet MVP trouvé. Créez-en un depuis le Pôle Stratégique.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {biProjectId ? (
                <BusinessIntelligenceDashboard projectId={biProjectId} />
              ) : (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun projet sélectionné</h3>
                    <p className="text-sm text-muted-foreground">Sélectionnez un projet MVP pour afficher les métriques Business Intelligence.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketIntelligencePage;
