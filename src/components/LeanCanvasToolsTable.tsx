import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, ExternalLink, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leanCanvasTools, leanCanvasToolCategories, LeanCanvasTool } from "@/data/leanCanvasToolsData";

import leanCanvasTemplate from "@/assets/lean-canvas/lean-canvas-template.jpg";
import customerFactoryBlueprint from "@/assets/lean-canvas/customer-factory-blueprint.jpg";
import customerForcesCanvas from "@/assets/lean-canvas/customer-forces-canvas.jpg";
import customerTimeline from "@/assets/lean-canvas/customer-timeline.jpg";

const imageMap: Record<string, string> = {
  "lean-canvas-template": leanCanvasTemplate,
  "customer-factory-blueprint": customerFactoryBlueprint,
  "customer-forces-canvas": customerForcesCanvas,
  "customer-timeline": customerTimeline
};

const LeanCanvasToolsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAxis, setSelectedAxis] = useState<"all" | "Running Lean" | "Scaling Lean">("all");
  const [selectedTool, setSelectedTool] = useState<LeanCanvasTool | null>(null);

  const filteredTools = leanCanvasTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesAxis = selectedAxis === "all" || tool.axis === selectedAxis || tool.axis === "Both";
    return matchesSearch && matchesCategory && matchesAxis;
  });

  const getCategoryStyle = (categoryId: string) => {
    const cat = leanCanvasToolCategories.find(c => c.id === categoryId);
    return cat || { color: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-500/10', icon: '📋' };
  };

  return (
    <div className="space-y-6">
      {/* Search and Axis Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un outil Lean..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedAxis} onValueChange={(v) => setSelectedAxis(v as typeof selectedAxis)}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="Running Lean" className="text-blue-600">Running</TabsTrigger>
            <TabsTrigger value="Scaling Lean" className="text-indigo-600">Scaling</TabsTrigger>
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
          Tous ({leanCanvasTools.length})
        </Badge>
        {leanCanvasToolCategories.map(cat => (
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
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredTools.map((tool, index) => {
          const style = getCategoryStyle(tool.category);
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedTool(tool)}
              className={`${style.bgLight} border-2 ${style.textColor} p-3 rounded-xl cursor-pointer hover:scale-105 hover:shadow-lg transition-all text-center aspect-square flex flex-col items-center justify-center relative group`}
            >
              <span className="text-2xl font-bold">{tool.symbol}</span>
              <span className="text-[10px] leading-tight line-clamp-2 mt-1">{tool.name}</span>
              {tool.templateUrl && (
                <Download className="absolute top-1 right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <Badge 
                variant="outline" 
                className={`absolute bottom-1 text-[8px] px-1 py-0 ${tool.axis === 'Running Lean' ? 'border-blue-400 text-blue-600' : tool.axis === 'Scaling Lean' ? 'border-indigo-400 text-indigo-600' : 'border-gray-400'}`}
              >
                {tool.axis === 'Both' ? 'R+S' : tool.axis === 'Running Lean' ? 'R' : 'S'}
              </Badge>
            </motion.div>
          );
        })}
      </div>

      {/* Tool Detail Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl ${getCategoryStyle(selectedTool.category).color} text-white flex items-center justify-center font-bold text-2xl flex-shrink-0`}>
                    {selectedTool.symbol}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedTool.name}</DialogTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{getCategoryStyle(selectedTool.category).icon} {selectedTool.category}</Badge>
                      <Badge className={selectedTool.axis === 'Running Lean' ? 'bg-blue-600' : selectedTool.axis === 'Scaling Lean' ? 'bg-indigo-600' : 'bg-gray-600'}>
                        {selectedTool.axis}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Template Image if available */}
                {selectedTool.templateUrl && imageMap[selectedTool.templateUrl] && (
                  <div className="rounded-xl overflow-hidden border bg-white">
                    <img 
                      src={imageMap[selectedTool.templateUrl]} 
                      alt={selectedTool.name} 
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Description
                  </h4>
                  <p className="text-muted-foreground">{selectedTool.description}</p>
                </div>

                {/* Usage */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold mb-2">💡 Quand l'utiliser ?</h4>
                  <p className="text-sm text-muted-foreground">{selectedTool.usage}</p>
                </div>

                {/* Key Elements */}
                {selectedTool.keyElements && (
                  <div>
                    <h4 className="font-semibold mb-2">📋 Éléments clés</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTool.keyElements.map((el, i) => (
                        <Badge key={i} variant="secondary">{el}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <span>Source: {selectedTool.source}</span>
                </div>

                {/* Download Button */}
                {selectedTool.templateUrl && imageMap[selectedTool.templateUrl] && (
                  <Button className="w-full gap-2" asChild>
                    <a href={imageMap[selectedTool.templateUrl]} download={`${selectedTool.id}-template.jpg`}>
                      <Download className="h-4 w-4" />
                      Télécharger le template
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeanCanvasToolsTable;
