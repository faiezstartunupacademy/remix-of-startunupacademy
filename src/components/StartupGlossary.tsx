import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Search, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Rocket, 
  Target,
  Building,
  PieChart,
  Lightbulb,
  ArrowUpRight,
  BarChart,
  Zap,
  Globe,
  ShoppingCart,
  Briefcase,
  Handshake,
  Calculator,
  Clock,
  Award,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { glossaryTerms, glossaryCategories } from "@/data/glossaryData";

// Map category to icon for display
const categoryIcons: Record<string, any> = {
  'Financement': DollarSign,
  'Phases': TrendingUp,
  'Concepts': Lightbulb,
  'Métriques': Calculator,
  'Produit': Rocket,
  'Croissance': Zap,
  'Général': Award,
  'Modèles': Globe,
};

const categories = glossaryCategories;

const StartupGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedTerm, setSelectedTerm] = useState<typeof glossaryTerms[0] | null>(null);

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || "bg-primary";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Glossaire des Startups
        </h2>
        <p className="text-muted-foreground">
          Le dictionnaire ultime pour maîtriser le jargon entrepreneurial
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un terme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <Badge
              key={cat.name}
              variant={selectedCategory === cat.name ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 transition-all ${
                selectedCategory === cat.name ? cat.color + " text-white border-0" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{glossaryTerms.length}</p>
          <p className="text-sm text-muted-foreground">Termes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{categories.length - 1}</p>
          <p className="text-sm text-muted-foreground">Catégories</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{filteredTerms.length}</p>
          <p className="text-sm text-muted-foreground">Résultats</p>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term, index) => (
          <motion.div
            key={term.term}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card 
              className="h-full cursor-pointer hover:shadow-lg transition-all group border-2 hover:border-primary/30"
              onClick={() => setSelectedTerm(term)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(term.category)}/10`}>
                    {(() => { const Icon = categoryIcons[term.category] || Lightbulb; return <Icon className={`h-5 w-5 ${getCategoryColor(term.category).replace('bg-', 'text-')}`} />; })()}
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {term.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {term.term}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {term.definition}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun terme trouvé pour "{searchTerm}"</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-xl ${getCategoryColor(selectedTerm.category)}/10`}>
                  {(() => { const Icon = categoryIcons[selectedTerm.category] || Lightbulb; return <Icon className={`h-8 w-8 ${getCategoryColor(selectedTerm.category).replace('bg-', 'text-')}`} />; })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedTerm.term}</h2>
                  <Badge className={`${getCategoryColor(selectedTerm.category)} text-white border-0`}>
                    {selectedTerm.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Définition</h3>
                  <p className="text-muted-foreground">{selectedTerm.definition}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2">Détails</h3>
                  <p className="text-muted-foreground">{selectedTerm.details}</p>
                </div>

                {selectedTerm.example && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Exemple</h3>
                    <p className="text-foreground italic">{selectedTerm.example}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTerm(null)}
                className="mt-6 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StartupGlossary;
