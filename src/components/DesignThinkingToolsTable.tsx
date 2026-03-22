import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { designThinkingTools, toolCategories, DesignThinkingTool } from "@/data/designThinkingToolsData";

const DesignThinkingToolsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<DesignThinkingTool | null>(null);

  const filteredTools = designThinkingTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStyle = (categoryId: string) => {
    const cat = toolCategories.find(c => c.id === categoryId);
    return cat || { color: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-500/10' };
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un outil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          Tous ({designThinkingTools.length})
        </Badge>
        {toolCategories.map(cat => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === cat.id ? cat.color : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Periodic Table Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filteredTools.map((tool, index) => {
          const style = getCategoryStyle(tool.category);
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => setSelectedTool(tool)}
              className={`${style.bgLight} border ${style.textColor} p-2 rounded-lg cursor-pointer hover:scale-105 transition-transform text-center aspect-square flex flex-col items-center justify-center`}
            >
              <span className="text-lg font-bold">{tool.symbol}</span>
              <span className="text-[10px] leading-tight line-clamp-2">{tool.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Tool Detail Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-lg">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${getCategoryStyle(selectedTool.category).color} text-white flex items-center justify-center font-bold text-xl`}>
                    {selectedTool.symbol}
                  </div>
                  <div>
                    <DialogTitle>{selectedTool.name}</DialogTitle>
                    <Badge variant="outline" className="mt-1">{selectedTool.category}</Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-muted-foreground">{selectedTool.description}</p>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Page: {selectedTool.page} | Durée: {selectedTool.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(selectedTool.phases).filter(([_, v]) => v).map(([phase]) => (
                    <Badge key={phase} variant="secondary" className="text-xs">{phase}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignThinkingToolsTable;
