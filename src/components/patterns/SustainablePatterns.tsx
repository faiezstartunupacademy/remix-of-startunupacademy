import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Target, X, Recycle, HandHeart, Users, Factory, Coins, Heart, Globe, Building2, Lightbulb, Sparkles, Download } from "lucide-react";
import { SUSTAINABLE_PATTERNS_DATA, SUSTAINABLE_CATEGORIES, getSustainableGroupColor } from "@/data/sustainablePatterns";
import { Input } from "@/components/ui/input";

const getGroupIcon = (groupe: string) => {
  switch (groupe) {
    case 'Pricing & Revenue': return <Coins className="h-4 w-4" />;
    case 'Financing': return <Coins className="h-4 w-4" />;
    case 'Eco-Design': return <Leaf className="h-4 w-4" />;
    case 'Closing-the-Loop': return <Recycle className="h-4 w-4" />;
    case 'Supply Chain': return <Factory className="h-4 w-4" />;
    case 'Giving': return <HandHeart className="h-4 w-4" />;
    case 'Access Provision': return <Users className="h-4 w-4" />;
    case 'Social Mission': return <Heart className="h-4 w-4" />;
    case 'Service Performance': return <Target className="h-4 w-4" />;
    case 'Cooperative': return <Building2 className="h-4 w-4" />;
    case 'Community Platform': return <Globe className="h-4 w-4" />;
    default: return <Lightbulb className="h-4 w-4" />;
  }
};

export const SustainablePatterns = () => {
  const [selectedPattern, setSelectedPattern] = useState<typeof SUSTAINABLE_PATTERNS_DATA[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredPattern, setHoveredPattern] = useState<number | null>(null);

  const filteredPatterns = SUSTAINABLE_PATTERNS_DATA.filter(pattern => {
    const matchesSearch = pattern.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || pattern.groupe === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center space-y-4 py-12 px-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 border border-emerald-500/20 overflow-hidden"
      >
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4"
          >
            <Recycle className="h-4 w-4" />
            45 Patterns de Business Models Durables
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Sustainable <span className="text-gradient bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Growth Patterns</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Taxonomie de Lüdeke-Freund et al. — Performance économique conciliée avec un impact environnemental et social positif
          </p>
          <motion.a
            href="/sustainable-growth-patterns.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="h-5 w-5" />
            Télécharger le PDF (45 patterns + métriques)
          </motion.a>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher un pattern durable..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-full border-2 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUSTAINABLE_CATEGORIES.map((cat, index) => (
          <motion.button
            key={cat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => {
              setActiveFilter(cat.key);
              setSelectedPattern(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              activeFilter === cat.key
                ? `${cat.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-background ring-current`
                : 'bg-card border-2 border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/5'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
            {cat.label}
            <span className="opacity-70">({cat.count})</span>
          </motion.button>
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
            className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/30 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <motion.button
              onClick={() => setSelectedPattern(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all hover:scale-110"
              whileHover={{ rotate: 90 }}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`w-28 h-28 rounded-3xl ${getSustainableGroupColor(selectedPattern.groupe)} flex items-center justify-center flex-shrink-0 shadow-2xl`}
              >
                <span className="text-4xl font-black text-white">{selectedPattern.symbol}</span>
              </motion.div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-sm font-mono text-primary font-bold">#{selectedPattern.id}</span>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white ${getSustainableGroupColor(selectedPattern.groupe)}`}>
                    {getGroupIcon(selectedPattern.groupe)}
                    {selectedPattern.groupe}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4">{selectedPattern.nom}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{selectedPattern.description}</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Objectif Durable</span>
              </div>
              <p className="text-foreground leading-relaxed text-lg">{selectedPattern.objectif_durable}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Periodic Table Grid */}
      <div className="bg-card/50 rounded-3xl border-2 border-border p-4 md:p-8">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-9 gap-2 md:gap-3">
          {filteredPatterns.map((pattern, index) => (
            <motion.button
              key={pattern.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.008, type: "spring", stiffness: 300 }}
              onClick={() => setSelectedPattern(pattern)}
              onMouseEnter={() => setHoveredPattern(pattern.id)}
              onMouseLeave={() => setHoveredPattern(null)}
              whileHover={{ 
                scale: 1.15, 
                zIndex: 20,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.9 }}
              className={`relative aspect-square p-1.5 md:p-2 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                selectedPattern?.id === pattern.id 
                  ? 'ring-4 ring-primary/50 border-primary bg-primary/20 shadow-xl' 
                  : hoveredPattern === pattern.id
                    ? `border-transparent ${getSustainableGroupColor(pattern.groupe)} shadow-lg`
                    : 'border-border/50 hover:border-transparent bg-background/80'
              }`}
            >
              {/* Number badge */}
              <span className={`absolute top-0.5 left-1 text-[7px] md:text-[8px] font-mono font-bold transition-colors ${
                hoveredPattern === pattern.id || selectedPattern?.id === pattern.id ? 'text-white' : 'text-muted-foreground'
              }`}>
                {pattern.id}
              </span>
              
              {/* Category color indicator */}
              <div className={`absolute top-0.5 right-1 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${getSustainableGroupColor(pattern.groupe)} ${
                hoveredPattern === pattern.id ? 'ring-2 ring-white' : ''
              }`}></div>
              
              {/* Symbol */}
              <span className={`text-sm md:text-xl font-black transition-all duration-300 ${
                selectedPattern?.id === pattern.id || hoveredPattern === pattern.id 
                  ? 'text-white scale-110' 
                  : 'text-foreground'
              }`}>
                {pattern.symbol}
              </span>
              
              {/* Name */}
              <span className={`text-[5px] md:text-[7px] font-bold leading-tight line-clamp-2 mt-0.5 px-0.5 transition-colors ${
                hoveredPattern === pattern.id || selectedPattern?.id === pattern.id ? 'text-white/90' : 'text-muted-foreground'
              }`}>
                {pattern.nom}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {filteredPatterns.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <Leaf className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Aucun pattern trouvé pour cette recherche</p>
        </motion.div>
      )}

      {/* Legend & Key Concepts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-emerald-500/10 p-6 rounded-2xl border-2 border-emerald-500/20"
        >
          <h3 className="text-emerald-600 dark:text-emerald-400 font-black text-lg mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Recycle className="h-5 w-5" />
            </div>
            Qu'est-ce qu'un Pattern Durable ?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Un pattern de business model durable est une solution répétable aux défis environnementaux, 
            sociaux et économiques. Il permet de créer, délivrer et capturer de la valeur tout en générant 
            un impact positif sur la société et l'environnement.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-accent/10 p-6 rounded-2xl border-2 border-accent/20"
        >
          <h3 className="text-accent-foreground font-black text-lg mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Target className="h-5 w-5" />
            </div>
            Triple Bottom Line
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Ces patterns visent la création de valeur sur trois dimensions : 
            <strong className="text-primary"> Économique</strong> (profit viable), 
            <strong className="text-emerald-600 dark:text-emerald-400"> Environnementale</strong> (impact planète positif) et 
            <strong className="text-rose-600 dark:text-rose-400"> Sociale</strong> (bénéfice pour les personnes).
          </p>
        </motion.div>
      </div>

      {/* Categories Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-muted/30 p-6 rounded-2xl border-2 border-border"
      >
        <h4 className="font-black text-foreground mb-5 text-center text-lg">Légende des Catégories</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SUSTAINABLE_CATEGORIES.filter(cat => cat.key !== 'all').map(cat => (
            <motion.div 
              key={cat.key} 
              className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`w-4 h-4 rounded-lg ${cat.color} shadow-sm`}></span>
              <span className="text-sm font-medium text-foreground">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SustainablePatterns;