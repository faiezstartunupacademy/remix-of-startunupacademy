import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, FileText, GraduationCap, Building2, Wrench, BookOpen } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchContent, SearchResult } from "@/data/searchIndex";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  slide: <FileText className="h-4 w-4" />,
  formation: <GraduationCap className="h-4 w-4" />,
  ecosysteme: <Building2 className="h-4 w-4" />,
  outil: <Wrench className="h-4 w-4" />,
  glossaire: <BookOpen className="h-4 w-4" />,
  concept: <BookOpen className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  slide: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  formation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  ecosysteme: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  outil: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  glossaire: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  concept: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
};

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | undefined>();
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const r = searchContent(query, activeFilter);
    setResults(r);
  }, [query, activeFilter]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveFilter(undefined);
    }
  }, [open]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const handleSelect = useCallback((result: SearchResult) => {
    onOpenChange(false);
    navigate(result.href);
  }, [navigate, onOpenChange]);

  const filters = [
    { key: undefined, label: "Tout" },
    { key: "slide", label: "Slides" },
    { key: "formation", label: "Formations" },
    { key: "ecosysteme", label: "Écosystème" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center border-b px-4 gap-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Rechercher slides, formations, acteurs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 border-b overflow-x-auto">
          {filters.map(f => (
            <Badge
              key={f.label}
              variant={activeFilter === f.key ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setActiveFilter(f.key as string | undefined)}
            >
              {f.label}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[60vh]">
          {results.length === 0 && query.length > 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Aucun résultat pour "{query}"</p>
              <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Tapez pour rechercher dans toute la plateforme</p>
              <p className="text-sm mt-1">Slides, formations, concepts, acteurs de l'écosystème...</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3"
                  onClick={() => handleSelect(result)}
                >
                  <div className={`mt-0.5 p-1.5 rounded-md ${categoryColors[result.category] || ''}`}>
                    {categoryIcons[result.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-5">{result.categoryLabel}</Badge>
                      {result.formation && (
                        <span className="text-[10px] text-muted-foreground">{result.formation}</span>
                      )}
                      {result.module && (
                        <span className="text-[10px] text-muted-foreground">• {result.module}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{results.length} résultat{results.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <kbd className="h-5 px-1.5 rounded border bg-muted text-[10px]">↑↓</kbd>
            <span>naviguer</span>
            <kbd className="h-5 px-1.5 rounded border bg-muted text-[10px]">↵</kbd>
            <span>ouvrir</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
