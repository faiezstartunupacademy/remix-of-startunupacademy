import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, GraduationCap, Building2, Filter, ArrowLeft, Wrench, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchContent, getSearchIndex, SearchResult } from "@/data/searchIndex";

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState<string | undefined>(searchParams.get("cat") || undefined);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  const categoryConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    slide: { icon: <FileText className="h-4 w-4" />, label: t("search.slides"), color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    formation: { icon: <GraduationCap className="h-4 w-4" />, label: t("search.formations"), color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    ecosysteme: { icon: <Building2 className="h-4 w-4" />, label: t("search.ecosystem"), color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    outil: { icon: <Wrench className="h-4 w-4" />, label: t("search.tools"), color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    glossaire: { icon: <BookOpen className="h-4 w-4" />, label: t("search.glossary"), color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    concept: { icon: <Lightbulb className="h-4 w-4" />, label: t("search.concepts"), color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  };

  useEffect(() => { setResults(searchContent(query, activeFilter)); }, [query, activeFilter]);
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (activeFilter) params.cat = activeFilter;
    setSearchParams(params, { replace: true });
  }, [query, activeFilter, setSearchParams]);

  const index = getSearchIndex();
  const filters = [
    { key: undefined, label: t("search.all"), count: index.length },
    { key: "slide", label: t("search.slides"), count: index.filter(r => r.category === 'slide').length },
    { key: "formation", label: t("search.formations"), count: index.filter(r => r.category === 'formation').length },
    { key: "outil", label: t("search.tools"), count: index.filter(r => r.category === 'outil').length },
    { key: "concept", label: t("search.concepts"), count: index.filter(r => r.category === 'concept').length },
    { key: "glossaire", label: t("search.glossary"), count: index.filter(r => r.category === 'glossaire').length },
    { key: "ecosysteme", label: t("search.ecosystem"), count: index.filter(r => r.category === 'ecosysteme').length },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b">
          <div className="container max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="h-4 w-4" />{t("common.backToHome")}</Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold mb-6">{t("search.title")}</h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder={t("search.placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="pl-12 h-14 text-lg rounded-2xl border-2 focus-visible:ring-primary" autoFocus />
              </div>
            </motion.div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {filters.map(f => (
                <Badge key={f.label} variant={activeFilter === f.key ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3" onClick={() => setActiveFilter(f.key as string | undefined)}>
                  <Filter className="h-3 w-3 mr-1" />{f.label} ({f.count})
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-3xl">
            {query && <p className="text-sm text-muted-foreground mb-6">{results.length} {t("search.resultsFor")} "{query}"</p>}
            {results.length === 0 && query ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium mb-2">{t("search.noResults")}</h3>
                <p className="text-muted-foreground">{t("search.noResultsDesc")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => {
                  const config = categoryConfig[result.category];
                  return (
                    <motion.div key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                      <Card className="hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(result.href)}>
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className={`p-2 rounded-lg shrink-0 ${config?.color || 'bg-muted'}`}>{config?.icon || <FileText className="h-4 w-4" />}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium group-hover:text-primary transition-colors">{result.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">{result.categoryLabel}</Badge>
                              {result.formation && <span className="text-xs text-muted-foreground">{result.formation}</span>}
                              {result.module && <span className="text-xs text-muted-foreground">• {result.module}</span>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
            {!query && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium mb-2">{t("search.explorePlatform")}</h3>
                <p className="text-muted-foreground mb-6">{t("search.exploreDesc", { count: index.length })}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Lean Canvas', 'Growth Hacking', 'MVP', 'Design Thinking', 'Effectuation', 'Métriques', 'Startup Act'].map(term => (
                    <Badge key={term} variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setQuery(term)}>{term}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
