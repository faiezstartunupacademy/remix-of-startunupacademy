import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calculator, 
  TrendingUp, 
  Users, 
  RefreshCw, 
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Info,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  X,
  Activity,
  Megaphone,
  PieChart,
  LayoutGrid,
  List
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { growthMetrics, categories as categoriesData, type GrowthMetric } from "@/data/growthMetricsData";

// Map icon names to components
const iconMap: Record<string, any> = {
  BookOpen, Users, Activity, RefreshCw, DollarSign, Zap, Megaphone, TrendingUp, PieChart
};

const categories = categoriesData.map(cat => ({
  ...cat,
  icon: iconMap[cat.icon] || BookOpen
}));

const GrowthMetricsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedMetric, setSelectedMetric] = useState<GrowthMetric | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "periodic">("periodic");

  const filteredMetrics = useMemo(() => {
    return growthMetrics.filter(metric => {
      const matchesSearch = 
        metric.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.nameFr.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "Toutes" || metric.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryStyles = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat || categories[0];
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return <Info className="h-4 w-4" />;
    const Icon = cat.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header éducatif */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Les Métriques Essentielles</h2>
                <p className="text-white/60">Classification complète pour piloter ta croissance</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{growthMetrics.length} métriques</div>
                  <div className="text-white/60 text-xs">Expliquées simplement</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{categories.length - 1} catégories</div>
                  <div className="text-white/60 text-xs">Du CAC à l'EBITDA</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <Target className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Conseils pratiques</div>
                  <div className="text-white/60 text-xs">Tips pour chaque métrique</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une métrique (ex: CAC, LTV, Churn...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "periodic" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("periodic")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau Périodique</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Vue Détaillée</span>
            </Button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === "Toutes" 
              ? growthMetrics.length 
              : growthMetrics.filter(m => m.category === cat.id).length;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Periodic Table View - Compact Grid */}
      {viewMode === "periodic" && (
        <div className="space-y-6">
          {/* Category Legend */}
          <div className="flex flex-wrap justify-center gap-3 p-4 bg-muted/30 rounded-xl">
            {categories.slice(1).map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${cat.accentBg}`} />
                  <Icon className={`h-4 w-4 ${cat.textColor}`} />
                  <span className={`text-xs font-medium ${cat.textColor}`}>{cat.label}</span>
                </div>
              );
            })}
          </div>

          {/* Periodic Table Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-11 gap-2 sm:gap-3">
            {filteredMetrics.map((metric, index) => {
              const catStyles = getCategoryStyles(metric.category);
              return (
                <motion.div
                  key={metric.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    aspect-square cursor-pointer transition-all duration-200
                    hover:scale-110 hover:z-10 hover:shadow-xl group
                    rounded-lg border-2 ${catStyles.borderColor} ${catStyles.bgColor}
                    flex flex-col items-center justify-center p-1 sm:p-2
                    relative overflow-hidden
                  `}
                  onClick={() => setSelectedMetric(metric)}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity ${catStyles.accentBg} blur-xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Symbol/Code */}
                    <span className={`font-mono font-bold text-lg sm:text-xl lg:text-2xl ${catStyles.textColor}`}>
                      {metric.code}
                    </span>
                    
                    {/* Name (truncated) */}
                    <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight px-1">
                      {metric.nameFr.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>

                  {/* Category indicator dot */}
                  <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${catStyles.accentBg}`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Grid View */}
      {viewMode === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMetrics.map((metric, index) => (
            <motion.div
              key={metric.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              {(() => {
                const catStyles = getCategoryStyles(metric.category);
                return (
                  <Card 
                    className={`h-full cursor-pointer transition-all hover:shadow-lg group border-2 ${catStyles.borderColor} ${catStyles.bgColor}`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <CardContent className="pt-5 pb-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${catStyles.accentBg} flex items-center justify-center`}>
                            <span className="font-mono font-bold text-white text-lg">{metric.code}</span>
                          </div>
                          <div>
                            <h3 className={`font-semibold text-sm ${catStyles.textColor} transition-colors line-clamp-1`}>
                              {metric.nameFr}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{metric.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Interpretation */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {metric.interpretation}
                      </p>

                      {/* Formula preview */}
                      <div className="bg-background/50 rounded-lg p-3 mb-3">
                        <div className="text-xs text-muted-foreground mb-1">Formule</div>
                        <code className={`text-sm font-medium line-clamp-1 ${catStyles.textColor}`}>{metric.formula}</code>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge className={`text-[10px] gap-1 ${catStyles.bgColor} ${catStyles.textColor} ${catStyles.borderColor}`}>
                          {getCategoryIcon(metric.category)}
                          {metric.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-[10px] ${
                            metric.benchmarkStatus === 'good' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30' 
                              : metric.benchmarkStatus === 'mid'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-400/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-400/30'
                          }`}
                        >
                          {metric.benchmark}
                        </Badge>
                      </div>

                      {/* Hover indicator */}
                      <div className={`flex items-center gap-1 mt-3 text-xs ${catStyles.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span>Voir détails</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune métrique trouvée</h3>
          <p className="text-muted-foreground">Essaie avec d'autres termes de recherche</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              {(() => {
                const catStyles = getCategoryStyles(selectedMetric.category);
                return (
                  <div className={`sticky top-0 border-b p-6 flex items-start justify-between ${catStyles.bgColor} ${catStyles.borderColor}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${catStyles.accentBg} flex items-center justify-center`}>
                        <span className="font-mono font-bold text-white text-2xl">{selectedMetric.code}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedMetric.nameFr}</h2>
                        <p className="text-muted-foreground">{selectedMetric.name}</p>
                        <Badge className={`mt-1 gap-1 ${catStyles.bgColor} ${catStyles.textColor} ${catStyles.borderColor}`}>
                          {getCategoryIcon(selectedMetric.category)}
                          {selectedMetric.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMetric(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                );
              })()}

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* What is it */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    C'est quoi ?
                  </h3>
                  <p className="text-muted-foreground">{selectedMetric.interpretation}</p>
                </div>

                {/* Formula */}
                <div className="bg-muted/50 rounded-xl p-5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    Comment calculer ?
                  </h3>
                  <div className="bg-background rounded-lg p-4 mb-3">
                    <code className="text-lg font-bold text-primary">{selectedMetric.formula}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Exemple :</span> {selectedMetric.formulaExplained}
                  </p>
                </div>

                {/* Concrete Example */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Exemple concret
                  </h3>
                  <p className="text-muted-foreground">{selectedMetric.example}</p>
                </div>

                {/* Benchmark */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Benchmark : Est-ce que tu es bon ?
                  </h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    selectedMetric.benchmarkStatus === 'good' 
                      ? 'bg-primary/10 text-primary' 
                      : selectedMetric.benchmarkStatus === 'mid'
                      ? 'bg-accent/10 text-accent-foreground'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">{selectedMetric.benchmark}</span>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    💡 Conseil Pro
                  </h3>
                  <p className="text-muted-foreground">{selectedMetric.tip}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrowthMetricsTable;
