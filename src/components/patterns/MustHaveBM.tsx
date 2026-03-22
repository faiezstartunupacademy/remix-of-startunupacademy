import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Grid3X3, 
  Leaf, 
  TrendingUp, 
  Filter,
  BookOpen,
  Target,
  Building2,
  ChevronDown,
  ChevronUp,
  Info,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BM_PATTERNS, SUSTAINABLE_PATTERNS, INVESTOR_METRICS } from "@/data/businessModelPatterns";

// Types
interface BMItem {
  id: string;
  symbol: string;
  name: string;
  description: string;
  context: string;
  usage: string;
  category: string;
  source: "navigator" | "sustainable" | "bmv";
}

// Transform data into unified format
const allBusinessModels: BMItem[] = [
  // Navigator patterns (60)
  ...BM_PATTERNS.map((p, i) => ({
    id: `nav-${i}`,
    symbol: p.symbol,
    name: p.name,
    description: p.idea,
    context: `Question BI: ${p.bi}`,
    usage: `KPI: ${p.kpi} | Data: ${p.data}`,
    category: getNavigatorCategory(p.name),
    source: "navigator" as const
  })),
  // Sustainable patterns (45)
  ...SUSTAINABLE_PATTERNS.map((p, i) => ({
    id: `sus-${i}`,
    symbol: p.symbol,
    name: p.nom,
    description: p.description,
    context: `Objectif durable: ${p.objectif_durable}`,
    usage: `Comment appliquer: ${p.comment_appliquer} | Exemples: ${p.exemples.join(", ")}`,
    category: p.groupe,
    source: "sustainable" as const
  })),
  // BMV metrics (investor metrics)
  ...INVESTOR_METRICS.map((m, i) => ({
    id: `bmv-${i}`,
    symbol: m.icon,
    name: m.name,
    description: m.description,
    context: `Importance: ${m.importance}`,
    usage: `Formule: ${m.formula}`,
    category: "Validation Metrics",
    source: "bmv" as const
  }))
];

function getNavigatorCategory(name: string): string {
  const categories: Record<string, string[]> = {
    "Revenue Models": ["Subscription", "Freemium", "Flatrate", "Pay Per Use", "Auction", "Revenue Sharing"],
    "Value Creation": ["Add-On", "Cross-Selling", "Mass Customization", "Experience Selling", "Solution Provider"],
    "Platform Models": ["Two-Sided Market", "Peer-to-Peer", "Digital Platform", "Crowdsourcing", "Crowdfunding"],
    "Customer Focus": ["Customer Loyalty", "Lock-In", "Long Tail", "Target the Poor", "Ultimate Luxury"],
    "Operations": ["Direct Selling", "E-Commerce", "Franchising", "Self-Service", "White Label"],
    "Innovation": ["Open Business Model", "Open Source", "Reverse Innovation", "AI-First", "Green"]
  };
  
  for (const [category, patterns] of Object.entries(categories)) {
    if (patterns.some(p => name.toLowerCase().includes(p.toLowerCase()))) {
      return category;
    }
  }
  return "Other Patterns";
}

const sourceConfig = {
  navigator: { 
    label: "Navigator", 
    color: "bg-blue-500", 
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Grid3X3,
    description: "60 patterns de Gassmann et al."
  },
  sustainable: { 
    label: "Sustainable", 
    color: "bg-emerald-500", 
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: Leaf,
    description: "45 patterns de Lüdeke-Freund"
  },
  bmv: { 
    label: "BMV", 
    color: "bg-amber-500", 
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: TrendingUp,
    description: "Métriques de validation Y Combinator"
  }
};

// Function to generate and download Excel file
const generateExcel = () => {
  // Create CSV content (Excel compatible)
  const headers = ["Source", "Symbole", "Nom", "Description", "Contexte", "Utilisation", "Catégorie"];
  
  const rows = allBusinessModels.map(bm => [
    bm.source === "navigator" ? "Navigator (Gassmann)" : 
    bm.source === "sustainable" ? "Sustainable (Lüdeke-Freund)" : "BMV (Y Combinator)",
    bm.symbol,
    bm.name,
    bm.description.replace(/"/g, '""'),
    bm.context.replace(/"/g, '""'),
    bm.usage.replace(/"/g, '""'),
    bm.category
  ]);
  
  // BOM for UTF-8 Excel compatibility
  const BOM = '\uFEFF';
  const csvContent = BOM + [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'Must_Have_Business_Models_114_Patterns.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const MustHaveBM = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "navigator" | "sustainable" | "bmv">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    return allBusinessModels.filter(bm => {
      const matchesSearch = searchQuery === "" || 
        bm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bm.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = sourceFilter === "all" || bm.source === sourceFilter;
      
      return matchesSearch && matchesSource;
    });
  }, [searchQuery, sourceFilter]);

  const stats = useMemo(() => ({
    navigator: allBusinessModels.filter(bm => bm.source === "navigator").length,
    sustainable: allBusinessModels.filter(bm => bm.source === "sustainable").length,
    bmv: allBusinessModels.filter(bm => bm.source === "bmv").length,
    total: allBusinessModels.length
  }), []);

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Must Have Business Models
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          Tableau récapitulatif de {stats.total} modèles d'affaires essentiels avec définition, contexte et utilisation
        </p>
        <Button 
          onClick={generateExcel}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Télécharger Excel (114 patterns)
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(sourceConfig) as [keyof typeof sourceConfig, typeof sourceConfig.navigator][]).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover:scale-[1.02] ${
                sourceFilter === key ? `${config.borderColor} border-2` : ""
              }`}
              onClick={() => setSourceFilter(sourceFilter === key ? "all" : key)}
            >
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-xl ${config.bgColor} mb-2`}>
                  <Icon className={`h-5 w-5 ${config.textColor}`} />
                </div>
                <div className="text-2xl font-bold">{stats[key]}</div>
                <div className="text-xs text-muted-foreground">{config.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un modèle d'affaires..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sourceFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSourceFilter("all")}
          >
            Tous ({stats.total})
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredModels.length} modèle{filteredModels.length > 1 ? "s" : ""} trouvé{filteredModels.length > 1 ? "s" : ""}
      </div>

      {/* Business Models Table */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {filteredModels.map((bm, index) => {
            const config = sourceConfig[bm.source];
            const Icon = config.icon;
            const isExpanded = expandedId === bm.id;
            
            return (
              <motion.div
                key={bm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${config.borderColor} border-l-4`}
                  onClick={() => setExpandedId(isExpanded ? null : bm.id)}
                >
                  <CardContent className="p-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Symbol */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center font-bold ${config.textColor}`}>
                          {bm.symbol}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{bm.name}</h3>
                            <Badge variant="outline" className={`text-xs ${config.textColor} ${config.borderColor}`}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {bm.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {bm.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Expand Button */}
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t space-y-3"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Target className={`h-4 w-4 ${config.textColor}`} />
                              <span className="font-medium text-sm">Contexte</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{bm.context}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className={`h-4 w-4 ${config.textColor}`} />
                              <span className="font-medium text-sm">Utilisation</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{bm.usage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Legend */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Sources des modèles</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {(Object.entries(sourceConfig) as [keyof typeof sourceConfig, typeof sourceConfig.navigator][]).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-start gap-2">
                  <div className={`p-1.5 rounded ${config.bgColor}`}>
                    <Icon className={`h-3 w-3 ${config.textColor}`} />
                  </div>
                  <div>
                    <span className="font-medium">{config.label}</span>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MustHaveBM;
