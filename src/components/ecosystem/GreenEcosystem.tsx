import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, X, Download, Leaf, Zap, Recycle, Tractor, Palmtree, Building2, Landmark, GraduationCap, Banknote, Factory, FlaskConical, MapPin, Briefcase, ExternalLink, Globe, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { greenActors, greenCategories, greenSectors, greenGateInfo, greenPartners, GreenActor } from "@/data/greenEcosystemData";
import { exportEcosystemToPDF } from "@/utils/exportUtils";

const typeColors: Record<string, string> = {
  startup: "bg-emerald-500",
  public: "bg-blue-600",
  enterprise: "bg-slate-600",
  support: "bg-amber-500",
  finance: "bg-purple-500",
  expert: "bg-rose-500",
};

const typeIcons: Record<string, any> = {
  startup: Leaf,
  public: Landmark,
  enterprise: Factory,
  support: GraduationCap,
  finance: Banknote,
  expert: FlaskConical,
};

const GreenEcosystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActor, setSelectedActor] = useState<GreenActor | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredActors = useMemo(() => {
    return greenActors.filter((actor) => {
      const matchesSearch =
        actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actor.sector.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === "all" || 
        actor.category.toLowerCase().includes(activeCategory.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleExport = () => {
    exportEcosystemToPDF(greenActors, "Écosystème Green Tunisien", "ecosysteme-green-tunisie.pdf");
  };

  return (
    <div className="space-y-6">
      {/* GreenGate Reference Banner */}
      <Card className="bg-gradient-to-r from-emerald-600/15 to-teal-500/15 border-emerald-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Powered by GreenGate
                  <a href={greenGateInfo.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">{greenGateInfo.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500/20">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Handshake className="h-3 w-3" /> Parties prenantes
            </p>
            <div className="flex flex-wrap gap-2">
              {greenPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-background/60 text-xs hover:bg-emerald-500/10 transition-colors border border-border/50"
                  title={partner.description}
                >
                  {partner.name}
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with stats */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Écosystème Green Tunisien</h3>
              <p className="text-sm text-muted-foreground">Cartographie des acteurs de l'entrepreneuriat vert</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{greenActors.filter(a => a.type === 'startup').length}</p>
              <p className="text-xs text-muted-foreground">Startups GreenTech</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{greenActors.filter(a => a.type === 'public').length}</p>
              <p className="text-xs text-muted-foreground">Structures Publiques</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{greenActors.filter(a => a.type === 'finance').length}</p>
              <p className="text-xs text-muted-foreground">Acteurs Financement</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{greenActors.length}</p>
              <p className="text-xs text-muted-foreground">Total Acteurs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un acteur green..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter PDF
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeCategory === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveCategory("all")}
        >
          Tous ({greenActors.length})
        </Badge>
        {greenCategories.map((cat) => {
          const count = greenActors.filter(a => a.category === cat.name).length;
          return (
            <Badge
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className="cursor-pointer gap-1"
              onClick={() => setActiveCategory(cat.id === activeCategory ? "all" : cat.id)}
            >
              {cat.name} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Sectors Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {greenSectors.map((sector) => {
          const SectorIcon = sector.icon;
          return (
            <Card key={sector.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${sector.color}/20`}>
                  <SectorIcon className={`h-5 w-5 ${sector.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{sector.name}</p>
                  <p className="text-xs text-muted-foreground">{sector.count} startups</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actors Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredActors.map((actor, index) => {
          const TypeIcon = typeIcons[actor.type];
          return (
            <motion.div
              key={actor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedActor(actor)}
              className="cursor-pointer"
            >
              <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-emerald-500/30 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${typeColors[actor.type]} flex items-center justify-center text-white font-bold text-lg`}>
                      {actor.symbol}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {actor.sector}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {actor.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {actor.location}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun acteur trouvé</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedActor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActor(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${typeColors[selectedActor.type]} flex items-center justify-center text-white font-bold text-2xl`}>
                      {selectedActor.symbol}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedActor.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{selectedActor.category}</Badge>
                        <Badge variant="outline">{selectedActor.sector}</Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedActor(null)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-muted-foreground mb-4">{selectedActor.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Activités
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActor.activities.map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedActor.location}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GreenEcosystem;
