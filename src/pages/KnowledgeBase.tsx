import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Beaker, Clock, Wrench, X, ChevronDown, Filter, Target, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { knowledgeBaseTests, seedKnowledgeBase, KnowledgeBaseTest } from "@/data/knowledgeBaseTests";
import KnowledgeBaseDownloadButton from "@/components/strategic/KnowledgeBaseDownloadButton";
import { useToast } from "@/hooks/use-toast";
import { getAdjustedDuration, getDurationContext } from "@/utils/testDurationUtils";

const PHASES = [
  "Phase 1 — Tests Fondamentaux",
  "Phase 2 — Tests de Solution",
  "Phase 3 — Tests de Marché",
  "Phase 4 — Tests de Pricing",
  "Phase 5 — Tests de Rétention",
  "Phase 6 — Tests d'Acquisition",
  "Phase 7 — Tests Financiers",
  "Phase 8 — Tests B2B Enterprise",
  "Phase 9 — Tests Spécialisés",
];

const PHASE_ICONS: Record<string, string> = {
  "Phase 1 — Tests Fondamentaux": "🔬",
  "Phase 2 — Tests de Solution": "💡",
  "Phase 3 — Tests de Marché": "📊",
  "Phase 4 — Tests de Pricing": "💰",
  "Phase 5 — Tests de Rétention": "🔄",
  "Phase 6 — Tests d'Acquisition": "📈",
  "Phase 7 — Tests Financiers": "🏦",
  "Phase 8 — Tests B2B Enterprise": "🏢",
  "Phase 9 — Tests Spécialisés": "⚙️",
};

const ALL_SECTORS = ["SaaS", "Marketplace", "E-commerce", "FinTech", "HealthTech", "EdTech", "FoodTech", "GreenTech", "DeepTech", "Social Impact"];

const difficultyConfig = {
  easy: { label: "Facile", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  medium: { label: "Moyen", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  hard: { label: "Avancé", color: "bg-rose-500/10 text-rose-600 border-rose-200" },
};

const stepLabels: Record<number, string> = {
  0: "Générique",
  1: "Disruption",
  2: "Réglementaire",
  3: "Running Lean",
  4: "MVP-Personas",
  5: "Risques",
  6: "Métriques",
  7: "Plan Tactique",
};

const KnowledgeBase = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<KnowledgeBaseTest | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    // Auto-seed on first visit
    seedKnowledgeBase().then(result => {
      if (result.success && result.message?.includes("Seeded")) {
        toast({ title: "Base de connaissances", description: result.message });
      }
    });
  }, []);

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const filteredTests = useMemo(() => {
    return knowledgeBaseTests.filter(test => {
      const matchesSearch = search === "" ||
        test.name.toLowerCase().includes(search.toLowerCase()) ||
        test.description.toLowerCase().includes(search.toLowerCase()) ||
        test.category.toLowerCase().includes(search.toLowerCase()) ||
        test.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchesSectors = selectedSectors.length === 0 ||
        selectedSectors.some(s => test.applicable_sectors.includes(s));

      return matchesSearch && matchesSectors;
    });
  }, [search, selectedSectors]);

  const testsByPhase = useMemo(() => {
    const grouped: Record<string, KnowledgeBaseTest[]> = {};
    PHASES.forEach(phase => {
      const tests = filteredTests.filter(t => t.phase === phase);
      if (tests.length > 0) grouped[phase] = tests.sort((a, b) => a.test_number - b.test_number);
    });
    return grouped;
  }, [filteredTests]);

  const handleSeed = async () => {
    setSeeding(true);
    const result = await seedKnowledgeBase();
    toast({
      title: result.success ? "Succès" : "Erreur",
      description: result.message || result.error,
      variant: result.success ? "default" : "destructive",
    });
    setSeeding(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Beaker className="h-4 w-4" />
            {knowledgeBaseTests.length} Tests MVP
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Base de <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Connaissances</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Catalogue complet des tests MVP organisés par phase d'incubation.
            Chaque test contient un protocole détaillé, des métriques cibles et des outils recommandés.
          </p>
          <KnowledgeBaseDownloadButton variant="default" size="default" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tests total", value: knowledgeBaseTests.length, icon: Beaker },
            { label: "Phases", value: PHASES.length, icon: Target },
            { label: "Secteurs", value: ALL_SECTORS.length, icon: Filter },
            { label: "Étapes incubation", value: "7", icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-4 pb-3">
                <stat.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un test par nom, catégorie, tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 h-12 text-base rounded-xl"
            />
            {search && (
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSearch("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_SECTORS.map(sector => (
              <Badge
                key={sector}
                variant={selectedSectors.includes(sector) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleSector(sector)}
              >
                {sector}
              </Badge>
            ))}
            {selectedSectors.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setSelectedSectors([])}>
                Tout effacer
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredTests.length} test{filteredTests.length > 1 ? "s" : ""} trouvé{filteredTests.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Accordion by Phase */}
        <Accordion type="multiple" defaultValue={Object.keys(testsByPhase).slice(0, 2)} className="space-y-3">
          {Object.entries(testsByPhase).map(([phase, tests]) => (
            <AccordionItem key={phase} value={phase} className="border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{PHASE_ICONS[phase] || "📋"}</span>
                  <div className="text-left">
                    <p className="font-bold text-base">{phase}</p>
                    <p className="text-xs text-muted-foreground font-normal">{tests.length} test{tests.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tests.map(test => (
                    <motion.div
                      key={test.test_number}
                      whileHover={{ scale: 1.01 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedTest(test)}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary/30">
                        <CardContent className="pt-4 pb-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">#{test.test_number}</span>
                              <p className="font-semibold text-sm leading-tight">{test.name}</p>
                            </div>
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${difficultyConfig[test.difficulty_level].color}`}>
                              {difficultyConfig[test.difficulty_level].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{test.objective}</p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px]">{test.category}</Badge>
                            {test.associated_step > 0 && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                É{test.associated_step}
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto">
                              <Clock className="h-3 w-3" />{test.estimated_duration}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {test.recommended_tools.slice(0, 3).map(tool => (
                              <span key={tool} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{tool}</span>
                            ))}
                            {test.recommended_tools.length > 3 && (
                              <span className="text-[10px] text-muted-foreground">+{test.recommended_tools.length - 3}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Aucun test trouvé</p>
            <p className="text-muted-foreground">Essayez de modifier votre recherche ou vos filtres.</p>
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          {selectedTest && (
            <ScrollArea className="max-h-[75vh] pr-4">
              <DialogHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-muted-foreground">Test #{selectedTest.test_number}</span>
                  <Badge variant="outline" className={difficultyConfig[selectedTest.difficulty_level].color}>
                    {difficultyConfig[selectedTest.difficulty_level].label}
                  </Badge>
                  {selectedTest.associated_step > 0 && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Étape {selectedTest.associated_step} — {stepLabels[selectedTest.associated_step]}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl">{selectedTest.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedTest.description}</p>
              </DialogHeader>

              <div className="space-y-5">
                {/* Objectif */}
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" /> Objectif
                  </h4>
                  <p className="text-sm bg-primary/5 p-3 rounded-lg">{selectedTest.objective}</p>
                </div>

                <Separator />

                {/* Protocole */}
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-primary" /> Protocole Détaillé
                  </h4>
                  <ol className="space-y-2">
                    {selectedTest.detailed_protocol.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                {/* Métriques */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">📊 Métriques Cibles</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
                    <p><strong>Métrique :</strong> {selectedTest.target_metrics.metric_name}</p>
                    <p className="text-emerald-600">✅ Succès : {selectedTest.target_metrics.success_threshold}</p>
                    <p className="text-rose-600">❌ Échec : {selectedTest.target_metrics.failure_threshold}</p>
                  </div>
                </div>

                <Separator />

                {/* Outils */}
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-primary" /> Outils Recommandés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTest.recommended_tools.map(tool => (
                      <Badge key={tool} variant="secondary">{tool}</Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Duration by sector */}
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" /> Durée estimée par écosystème
                  </h4>
                  <div className="mb-2">
                    <select
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      value={selectedSector}
                      onChange={e => setSelectedSector(e.target.value)}
                    >
                      <option value="">Durée de base (tous secteurs)</option>
                      {selectedTest.applicable_sectors.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {selectedSector
                          ? getAdjustedDuration(selectedTest.estimated_duration, selectedSector, selectedTest.phase)
                          : selectedTest.estimated_duration}
                      </span>
                      {selectedSector && (
                        <Badge variant="outline" className="text-[10px] ml-auto">{selectedSector}</Badge>
                      )}
                    </div>
                    {selectedSector && getDurationContext(selectedTest.estimated_duration, selectedSector) && (
                      <p className="text-xs text-muted-foreground">{getDurationContext(selectedTest.estimated_duration, selectedSector)}</p>
                    )}
                    {!selectedSector && (
                      <p className="text-xs text-muted-foreground">Sélectionnez un secteur pour voir la durée ajustée</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Catégorie</p>
                    <Badge variant="outline">{selectedTest.category}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Phase</p>
                    <Badge variant="outline">{selectedTest.phase}</Badge>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTest.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Secteurs */}
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Secteurs applicables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTest.applicable_sectors.map(sector => (
                      <Badge key={sector} variant="outline" className="text-[10px]">{sector}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default KnowledgeBase;
