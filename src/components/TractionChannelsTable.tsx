import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, ExternalLink, BookOpen, Zap, Clock, DollarSign, 
  TrendingUp, Target, CheckCircle, Lightbulb, Building
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { tractionChannels, tractionCategories, TractionChannel } from "@/data/tractionChannelsData";

const TractionChannelsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<"all" | "early" | "growth">("all");
  const [selectedChannel, setSelectedChannel] = useState<TractionChannel | null>(null);

  const filteredChannels = tractionChannels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || channel.category === selectedCategory;
    const matchesStage = selectedStage === "all" || channel.startupStage === selectedStage || channel.startupStage === "all";
    return matchesSearch && matchesCategory && matchesStage;
  });

  const getCategoryStyle = (categoryId: string) => {
    const cat = tractionCategories.find(c => c.id === categoryId);
    return cat || { color: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-500/10', icon: '📋' };
  };

  const getCostLevel = (level: string) => {
    switch (level) {
      case "low": return { label: "Faible", value: 33, color: "text-green-600" };
      case "medium": return { label: "Moyen", value: 66, color: "text-yellow-600" };
      case "high": return { label: "Élevé", value: 100, color: "text-red-600" };
      default: return { label: "N/A", value: 0, color: "text-gray-600" };
    }
  };

  const getTimeToResults = (time: string) => {
    switch (time) {
      case "fast": return { label: "Rapide", value: 33, color: "text-green-600" };
      case "medium": return { label: "Moyen", value: 66, color: "text-yellow-600" };
      case "slow": return { label: "Long", value: 100, color: "text-red-600" };
      default: return { label: "N/A", value: 0, color: "text-gray-600" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tableau Périodique des Canaux de Traction</h2>
        <p className="text-muted-foreground">
          Les 19 canaux de traction du livre "Traction" de Gabriel Weinberg & Justin Mares
        </p>
      </div>

      {/* Search and Stage Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un canal de traction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedStage} onValueChange={(v) => setSelectedStage(v as typeof selectedStage)}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="early" className="text-green-600">Early Stage</TabsTrigger>
            <TabsTrigger value="growth" className="text-blue-600">Growth</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          Tous (19)
        </Badge>
        {tractionCategories.map(cat => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === cat.id ? cat.color + ' text-white' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            {cat.icon} {cat.name}
          </Badge>
        ))}
      </div>

      {/* Periodic Table Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {filteredChannels.map((channel, index) => {
          const style = getCategoryStyle(channel.category);
          const cost = getCostLevel(channel.costLevel);
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedChannel(channel)}
              className={`${style.bgLight} border-2 ${style.textColor} p-3 rounded-xl cursor-pointer hover:scale-105 hover:shadow-lg transition-all text-center aspect-square flex flex-col items-center justify-center relative group min-h-[100px]`}
            >
              <span className="absolute top-1 left-2 text-xs font-medium opacity-60">{channel.number}</span>
              <span className="text-xl md:text-2xl font-bold">{channel.symbol}</span>
              <span className="text-[9px] md:text-[10px] leading-tight line-clamp-2 mt-1">{channel.name}</span>
              <div className="absolute bottom-1 right-1 flex gap-0.5">
                {channel.costLevel === "low" && <DollarSign className="h-2.5 w-2.5 text-green-500" />}
                {channel.timeToResults === "fast" && <Zap className="h-2.5 w-2.5 text-yellow-500" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span>Coût faible</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-yellow-500" />
          <span>Résultats rapides</span>
        </div>
      </div>

      {/* Channel Detail Dialog */}
      <Dialog open={!!selectedChannel} onOpenChange={() => setSelectedChannel(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedChannel && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-20 h-20 rounded-xl ${getCategoryStyle(selectedChannel.category).color} text-white flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className="text-xs opacity-80">#{selectedChannel.number}</span>
                    <span className="text-2xl font-bold">{selectedChannel.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedChannel.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{selectedChannel.nameEn}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        {getCategoryStyle(selectedChannel.category).icon} {tractionCategories.find(c => c.id === selectedChannel.category)?.name}
                      </Badge>
                      <Badge className={selectedChannel.startupStage === 'early' ? 'bg-green-600' : selectedChannel.startupStage === 'growth' ? 'bg-blue-600' : 'bg-gray-600'}>
                        {selectedChannel.startupStage === 'early' ? 'Early Stage' : selectedChannel.startupStage === 'growth' ? 'Growth' : 'Toutes phases'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Description
                  </h4>
                  <p className="text-muted-foreground">{selectedChannel.description}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> Coût
                    </h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{getCostLevel(selectedChannel.costLevel).label}</span>
                        <span className={getCostLevel(selectedChannel.costLevel).color}>●</span>
                      </div>
                      <Progress value={getCostLevel(selectedChannel.costLevel).value} className="h-2" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Délai Résultats
                    </h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{getTimeToResults(selectedChannel.timeToResults).label}</span>
                        <span className={getTimeToResults(selectedChannel.timeToResults).color}>●</span>
                      </div>
                      <Progress value={100 - getTimeToResults(selectedChannel.timeToResults).value} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Exemples d'Utilisation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedChannel.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactics */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" /> Tactiques Clés
                  </h4>
                  <ul className="space-y-2">
                    {selectedChannel.tactics.map((tactic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics to Track */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Métriques à Suivre
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChannel.metrics.map((metric, i) => (
                      <Badge key={i} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>

                {/* Case Study */}
                {selectedChannel.caseStudy && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4 text-green-600" /> Cas d'Étude
                    </h4>
                    <p className="text-sm">
                      <span className="font-semibold text-green-600">{selectedChannel.caseStudy.company}</span>
                      {" — "}
                      <span className="text-muted-foreground">{selectedChannel.caseStudy.result}</span>
                    </p>
                  </div>
                )}

                {/* Source */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <ExternalLink className="h-4 w-4" />
                  <span>Source: "Traction" - Gabriel Weinberg & Justin Mares (2015)</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TractionChannelsTable;
