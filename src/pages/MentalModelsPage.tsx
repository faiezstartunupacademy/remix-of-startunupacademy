import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Search, Target, Network, Clock, Users, ChevronRight,
  Lightbulb, BookOpen, Quote, ArrowLeft, Filter, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormationChatbot from "@/components/formation/FormationChatbot";
import { buildFormationContext } from "@/utils/formationContextBuilder";
import { 
  MENTAL_MODELS, 
  MENTAL_MODEL_CATEGORIES,
  MENTAL_MODEL_SLIDES,
  type MentalModel 
} from "@/data/mentalModelsData";

const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, typeof Brain> = {
    decision: Target,
    thinking: Brain,
    systems: Network,
    strategy: Sparkles,
    productivity: Clock,
    leadership: Users
  };
  return icons[categoryId] || Brain;
};

const MentalModelsPage = () => {
  const formationContext = useMemo(() => buildFormationContext(MENTAL_MODEL_SLIDES), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredModels = MENTAL_MODELS.filter(model => {
    const matchesSearch = searchQuery === "" ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedModels = MENTAL_MODEL_CATEGORIES.map(cat => ({
    ...cat,
    models: filteredModels.filter(m => m.category === cat.id)
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-background">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-4 bg-purple-500/20 text-purple-600 border-purple-500/30">
                <Brain className="h-3 w-3 mr-1" />
                Super Thinking
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Modèles Mentaux
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Les outils de réflexion utilisés par les meilleurs penseurs du monde.
                Basé sur "Super Thinking" de Gabriel Weinberg & Lauren McCann.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  {MENTAL_MODELS.length} modèles
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  {MENTAL_MODEL_CATEGORIES.length} catégories
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-12">
          <Tabs defaultValue="explorer" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="explorer" className="gap-2">
                <Search className="h-4 w-4" />
                Explorer
              </TabsTrigger>
              <TabsTrigger value="introduction" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Introduction
              </TabsTrigger>
            </TabsList>

            <TabsContent value="introduction" className="space-y-8">
              {/* Introduction Slides */}
              <Card className="overflow-hidden">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-purple-500/10">
                          <Brain className="h-8 w-8 text-purple-500" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Slide {currentSlide + 1} / {MENTAL_MODEL_SLIDES.length}
                          </Badge>
                          <h2 className="text-2xl font-bold">
                            {MENTAL_MODEL_SLIDES[currentSlide].title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-lg text-muted-foreground mb-6">
                        {MENTAL_MODEL_SLIDES[currentSlide].content}
                      </p>

                      <ul className="space-y-3 mb-6">
                        {MENTAL_MODEL_SLIDES[currentSlide].keyPoints.map((point, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <ChevronRight className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                        <div className="flex items-start gap-3">
                          <Quote className="h-5 w-5 text-purple-500 flex-shrink-0" />
                          <p className="italic text-muted-foreground">
                            {MENTAL_MODEL_SLIDES[currentSlide].quote}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      disabled={currentSlide === 0}
                      onClick={() => setCurrentSlide(s => s - 1)}
                    >
                      Précédent
                    </Button>
                    <div className="flex gap-2">
                      {MENTAL_MODEL_SLIDES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentSlide ? "bg-purple-500 w-4" : "bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      disabled={currentSlide === MENTAL_MODEL_SLIDES.length - 1}
                      onClick={() => setCurrentSlide(s => s + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explorer" className="space-y-8">
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un modèle mental..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tous
                  </Button>
                  {MENTAL_MODEL_CATEGORIES.map((cat) => {
                    const Icon = getCategoryIcon(cat.id);
                    return (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(
                          selectedCategory === cat.id ? null : cat.id
                        )}
                        className="gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {cat.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Model Detail */}
              {selectedModel && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${
                            MENTAL_MODEL_CATEGORIES.find(c => c.id === selectedModel.category)?.color
                          }/20`}>
                            <Brain className="h-6 w-6 text-purple-500" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{selectedModel.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {MENTAL_MODEL_CATEGORIES.find(c => c.id === selectedModel.category)?.name}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedModel(null)}>
                          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          Définition
                        </h4>
                        <p className="text-muted-foreground">{selectedModel.definition}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Exemple
                        </h4>
                        <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {selectedModel.example}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-500" />
                          Application
                        </h4>
                        <p className="text-muted-foreground">{selectedModel.application}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Models Grid by Category */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-8">
                  {groupedModels.filter(g => g.models.length > 0).map((group) => {
                    const Icon = getCategoryIcon(group.id);
                    return (
                      <div key={group.id}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${group.color}/20`}>
                            <Icon className={`h-5 w-5`} style={{ color: group.color.replace('bg-', '').replace('-500', '') }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {group.models.length} modèles
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.models.map((model) => (
                            <motion.div
                              key={model.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                className="cursor-pointer hover:shadow-lg transition-all h-full"
                                onClick={() => setSelectedModel(model)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${group.color}/10 flex-shrink-0`}>
                                      <Brain className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm mb-1 truncate">
                                        {model.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {model.definition}
                                      </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <FormationChatbot formationName="Mental Models" formationContext={formationContext} />
    </div>
  );
};

export default MentalModelsPage;
