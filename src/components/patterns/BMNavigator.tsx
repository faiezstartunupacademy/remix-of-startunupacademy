import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Target, Lightbulb, BarChart3, Database, X, Sparkles } from "lucide-react";
import { BM_PATTERNS, BMC_SECTIONS } from "@/data/businessModelPatterns";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const getPatternCategory = (number: number): string => {
  if (number <= 10) return 'bg-violet-500';
  if (number <= 20) return 'bg-emerald-500';
  if (number <= 30) return 'bg-sky-500';
  if (number <= 40) return 'bg-amber-500';
  if (number <= 50) return 'bg-pink-500';
  return 'bg-red-500';
};

const getPatternGradient = (number: number): string => {
  if (number <= 10) return 'from-violet-500/20 to-violet-600/10';
  if (number <= 20) return 'from-emerald-500/20 to-emerald-600/10';
  if (number <= 30) return 'from-sky-500/20 to-sky-600/10';
  if (number <= 40) return 'from-amber-500/20 to-amber-600/10';
  if (number <= 50) return 'from-pink-500/20 to-pink-600/10';
  return 'from-red-500/20 to-red-600/10';
};

export const BMNavigator = () => {
  const [selectedPattern, setSelectedPattern] = useState<typeof BM_PATTERNS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("patterns");
  const [hoveredPattern, setHoveredPattern] = useState<number | null>(null);

  const filteredPatterns = BM_PATTERNS.filter(pattern =>
    pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center space-y-4 py-12 px-6 rounded-3xl bg-gradient-to-br from-violet-500/10 via-background to-indigo-500/10 border border-violet-500/20 overflow-hidden"
      >
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-sm font-bold text-violet-600 dark:text-violet-400 mb-4"
          >
            <Grid3X3 className="h-4 w-4" />
            60 Business Model Patterns
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Business Model <span className="text-gradient bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">Navigator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Explorez les 60 patterns de business model identifiés par Gassmann et al. (2020).
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 p-1.5 bg-muted/50 rounded-full mb-8">
          <TabsTrigger value="patterns" className="gap-2 rounded-full data-[state=active]:shadow-lg h-11 font-bold">
            <Grid3X3 className="h-4 w-4" />
            60 Patterns
          </TabsTrigger>
          <TabsTrigger value="bmc4q" className="gap-2 rounded-full data-[state=active]:shadow-lg h-11 font-bold">
            <Target className="h-4 w-4" />
            BMC 4Q
          </TabsTrigger>
        </TabsList>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full border-2 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
            {[
              { range: "01-10", color: "bg-violet-500" },
              { range: "11-20", color: "bg-emerald-500" },
              { range: "21-30", color: "bg-sky-500" },
              { range: "31-40", color: "bg-amber-500" },
              { range: "41-50", color: "bg-pink-500" },
              { range: "51-60", color: "bg-red-500" }
            ].map((item, index) => (
              <motion.div 
                key={item.range} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border-2 border-border hover:border-primary/50 transition-all"
              >
                <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                <span className="text-muted-foreground">{item.range}</span>
              </motion.div>
            ))}
          </div>

          {/* Selected Pattern Detail */}
          <AnimatePresence>
            {selectedPattern && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative bg-gradient-to-br ${getPatternGradient(selectedPattern.number)} border-2 border-primary/30 rounded-3xl p-8 md:p-10 shadow-2xl`}
              >
                <motion.button
                  onClick={() => setSelectedPattern(null)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all hover:scale-110"
                  whileHover={{ rotate: 90 }}
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </motion.button>

                <div className="flex items-start gap-8">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`w-24 h-24 rounded-3xl ${getPatternCategory(selectedPattern.number)} flex items-center justify-center flex-shrink-0 shadow-2xl`}
                  >
                    <span className="text-4xl font-black text-white">{selectedPattern.symbol}</span>
                  </motion.div>
                  <div className="flex-grow space-y-5">
                    <div>
                      <span className="text-xs font-mono font-bold text-primary">#{selectedPattern.number}</span>
                      <h3 className="text-3xl font-black text-foreground">{selectedPattern.name}</h3>
                    </div>
                    <p className="text-xl text-primary font-bold italic">{selectedPattern.idea}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                      {[
                        { icon: <Lightbulb className="h-5 w-5 text-amber-500" />, label: "BI Question", value: selectedPattern.bi, color: "from-amber-500/20 to-amber-600/10" },
                        { icon: <BarChart3 className="h-5 w-5 text-emerald-500" />, label: "KPIs", value: selectedPattern.kpi, color: "from-emerald-500/20 to-emerald-600/10" },
                        { icon: <Database className="h-5 w-5 text-sky-500" />, label: "Data Sources", value: selectedPattern.data, color: "from-sky-500/20 to-sky-600/10" },
                      ].map((item, i) => (
                        <motion.div 
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                          className={`bg-gradient-to-br ${item.color} p-5 rounded-2xl border border-border/50`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {item.icon}
                            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">{item.label}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Periodic Table Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 p-6 bg-card/50 rounded-3xl border-2 border-border">
            {filteredPatterns.map((pattern, index) => (
              <motion.button
                key={pattern.number}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005, type: "spring", stiffness: 300 }}
                onClick={() => setSelectedPattern(pattern)}
                onMouseEnter={() => setHoveredPattern(pattern.number)}
                onMouseLeave={() => setHoveredPattern(null)}
                whileHover={{ 
                  scale: 1.15, 
                  zIndex: 20,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.9 }}
                className={`relative aspect-square p-2 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                  selectedPattern?.number === pattern.number 
                    ? 'ring-4 ring-primary/50 border-primary bg-primary/20 shadow-xl' 
                    : hoveredPattern === pattern.number
                      ? `border-transparent ${getPatternCategory(pattern.number)} shadow-lg`
                      : 'border-border/50 hover:border-transparent bg-background/50'
                }`}
              >
                <span className={`absolute top-1 left-1.5 text-[8px] font-mono font-bold transition-colors ${
                  hoveredPattern === pattern.number || selectedPattern?.number === pattern.number ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {pattern.number}
                </span>
                <div className={`absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full ${getPatternCategory(pattern.number)} ${
                  hoveredPattern === pattern.number ? 'ring-2 ring-white' : ''
                }`}></div>
                <span className={`text-lg font-black transition-all duration-300 ${
                  selectedPattern?.number === pattern.number || hoveredPattern === pattern.number 
                    ? 'text-white scale-110' 
                    : 'text-foreground'
                }`}>
                  {pattern.symbol}
                </span>
                <span className={`text-[7px] font-bold leading-tight line-clamp-2 mt-0.5 transition-colors ${
                  hoveredPattern === pattern.number || selectedPattern?.number === pattern.number ? 'text-white/90' : 'text-muted-foreground'
                }`}>
                  {pattern.name}
                </span>
              </motion.button>
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Grid3X3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Aucun pattern trouvé pour "{searchQuery}"</p>
            </motion.div>
          )}
        </TabsContent>

        {/* BMC 4Q Tab */}
        <TabsContent value="bmc4q" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black mb-3">Business Model Canvas : Approche 4Q</h3>
            <p className="text-muted-foreground text-lg">
              Modèle structuré autour des 4 questions fondamentales : Qui, Quoi, Comment, Combien.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BMC_SECTIONS.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-3xl border-2 border-border overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${section.color} p-5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-white">{section.label}</span>
                    <span className="text-white/80 text-sm font-bold bg-white/20 px-3 py-1 rounded-full">{section.description}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {section.blocks.map((block, i) => (
                    <motion.div 
                      key={block.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{block.icon}</span>
                        <span className="font-bold text-foreground">{block.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{block.prompt}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BMNavigator;