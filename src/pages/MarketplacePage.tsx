import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search, ChevronUp, MessageSquare, Eye, ArrowRight,
  Rocket, Globe, TrendingUp, Plus, Bookmark, MapPin, Star, Map, MessageCircle,
  Zap, Filter, Newspaper
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useMarketplaceStartups, useVote, useMarketplaceEcosystems } from "@/hooks/useMarketplace";
import MarketplaceEcosystems from "@/components/marketplace/MarketplaceEcosystems";
import MarketplaceTrends from "@/components/marketplace/MarketplaceTrends";
import MarketplaceAdmin from "@/components/marketplace/MarketplaceAdmin";
import MarketplaceForum from "@/components/marketplace/MarketplaceForum";
import StartupSubmitForm from "@/components/marketplace/StartupSubmitForm";
import StartupNewsTicker from "@/components/marketplace/StartupNewsTicker";
import StartupNewsManager from "@/components/marketplace/StartupNewsManager";

const TunisiaMap = lazy(() => import("@/components/marketplace/TunisiaMap"));

const stageColors: Record<string, string> = {
  early: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  growth: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  scale: "bg-violet-500/15 text-violet-600 border-violet-500/30",
};
const stageLabels: Record<string, string> = { early: "Early", growth: "Growth", scale: "Scale" };

const sectors = ["tech", "fintech", "healthtech", "edtech", "greentech", "ecommerce", "saas", "marketplace", "ai", "iot"];

const MarketplacePage = () => {
  const { t } = useTranslation();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [sector, setSector] = useState("all");
  const [sort, setSort] = useState("votes");
  const [activeTab, setActiveTab] = useState("discover");
  const [showSubmit, setShowSubmit] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const voteMutation = useVote();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: startups, isLoading } = useMarketplaceStartups({ search: debouncedSearch, stage, sector, sort });
  const { data: ecosystems } = useMarketplaceEcosystems();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;
  const totalStartups = startups?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* News Ticker */}
        <StartupNewsTicker />

        {/* Hero - more compact and bold */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--startunup-navy))] via-[hsl(215,60%,15%)] to-[hsl(215,70%,10%)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-[100px]" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </div>
          <div className="container relative z-10 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/20">
                  <Rocket className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-primary-foreground/80 text-sm font-semibold tracking-wide uppercase">Startup Marketplace</h2>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] h-5 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {totalStartups} startups
                  </Badge>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 leading-tight">{t("marketplace.title")}</h1>
              <p className="text-base text-primary-foreground/50 leading-relaxed max-w-2xl mb-6">{t("marketplace.subtitle")}</p>

              {/* Search bar */}
              <div className="flex gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary-foreground/30" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t("marketplace.search")}
                    className="pl-11 h-12 rounded-xl bg-white/8 border-white/10 text-primary-foreground placeholder:text-primary-foreground/30 backdrop-blur-sm focus:bg-white/12 transition-colors"
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-12 px-4 rounded-xl border-white/10 text-primary-foreground/60 hover:bg-white/10 hover:text-primary-foreground"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                      {["all", "early", "growth", "scale"].map(s => (
                        <button
                          key={s}
                          onClick={() => setStage(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            stage === s
                              ? "bg-primary text-primary-foreground"
                              : "bg-white/5 text-primary-foreground/50 hover:bg-white/10 hover:text-primary-foreground/80"
                          }`}
                        >
                          {s === "all" ? "Toutes phases" : stageLabels[s]}
                        </button>
                      ))}
                      <div className="w-px h-6 bg-white/10 self-center mx-1" />
                      {sectors.slice(0, 6).map(s => (
                        <button
                          key={s}
                          onClick={() => setSector(sector === s ? "all" : s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            sector === s
                              ? "bg-accent text-accent-foreground"
                              : "bg-white/5 text-primary-foreground/50 hover:bg-white/10 hover:text-primary-foreground/80"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 pb-20">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="discover" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><Rocket className="h-4 w-4" /><span className="hidden sm:inline">Startups</span></TabsTrigger>
                  <TabsTrigger value="map" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><Map className="h-4 w-4" /><span className="hidden sm:inline">{t("marketplace.map")}</span></TabsTrigger>
                  <TabsTrigger value="ecosystems" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><Globe className="h-4 w-4" /><span className="hidden sm:inline">{t("marketplace.ecosystems")}</span></TabsTrigger>
                  <TabsTrigger value="trends" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><TrendingUp className="h-4 w-4" /><span className="hidden sm:inline">{t("marketplace.trends")}</span></TabsTrigger>
                  <TabsTrigger value="forum" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">Forum</span></TabsTrigger>
                  <TabsTrigger value="news" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><Newspaper className="h-4 w-4" /><span className="hidden sm:inline">Actus</span></TabsTrigger>
                  {isAdmin && <TabsTrigger value="admin" className="gap-1.5 rounded-lg data-[state=active]:shadow-sm"><Star className="h-4 w-4" /><span className="hidden sm:inline">Admin</span></TabsTrigger>}
                </TabsList>

                {activeTab === "discover" && (
                  <div className="flex items-center gap-2">
                    <Select value={sort} onValueChange={setSort}>
                      <SelectTrigger className="w-[140px] h-9 rounded-lg text-sm"><SelectValue placeholder="Trier" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="votes">{t("marketplace.mostVoted")}</SelectItem>
                        <SelectItem value="newest">{t("marketplace.newest")}</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowSubmit(true)} className="gap-2 h-9 rounded-lg"><Plus className="h-4 w-4" /> {t("marketplace.submitStartup")}</Button>
                  </div>
                )}
              </div>

              {/* Discover */}
              <TabsContent value="discover" className="space-y-4">
                {isLoading ? (
                  <div className="grid gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
                ) : !startups?.length ? (
                  <div className="text-center py-20"><Rocket className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" /><h3 className="text-xl font-semibold text-muted-foreground">{t("marketplace.noResults")}</h3></div>
                ) : (
                  <div className="grid gap-2.5">
                    <AnimatePresence>
                      {startups.map((startup, index) => {
                        const s = startup as any;
                        return (
                          <motion.div key={startup.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                            <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20 border-border/50 overflow-hidden">
                              <CardContent className="p-0">
                                <div className="flex items-stretch">
                                  {/* Vote column */}
                                  <div className="flex flex-col items-center justify-center gap-0 px-3 py-3 bg-muted/30 border-r border-border/50 min-w-[56px]">
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => voteMutation.mutate(startup.id)}
                                      className="p-1 rounded-md hover:bg-primary/10 transition-colors"
                                    >
                                      <ChevronUp className="h-5 w-5 text-primary" />
                                    </motion.button>
                                    <span className="text-sm font-bold text-foreground">{startup.votes_count}</span>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 flex items-center gap-3 p-3 sm:p-4 min-w-0">
                                    {/* Logo */}
                                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-lg font-bold shrink-0 border border-border/50">
                                      {startup.logo_url
                                        ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full rounded-lg object-cover" />
                                        : <span className="text-primary/70">{startup.name.charAt(0)}</span>
                                      }
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <Link to={`/marketplace/${startup.slug}`} className="font-semibold text-sm hover:text-primary transition-colors">{startup.name}</Link>
                                        <Badge variant="outline" className={`${stageColors[startup.stage] || ""} text-[10px] h-4 px-1.5`}>{stageLabels[startup.stage] || startup.stage}</Badge>
                                        {s.category && s.category !== "product" && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{s.category}</Badge>}
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{startup.tagline}</p>
                                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> {startup.comments_count}</span>
                                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {startup.views_count}</span>
                                        {startup.sector && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{startup.sector}</Badge>}
                                        {startup.location && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {startup.location}</span>}
                                        {s.program && <Badge variant="outline" className="text-[10px] h-4 px-1.5">📋 {s.program}</Badge>}
                                      </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="hidden sm:block shrink-0">
                                      <Link to={`/marketplace/${startup.slug}`}>
                                        <Button variant="ghost" size="sm" className="gap-1 text-xs h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                          {t("common.discover")} <ArrowRight className="h-3 w-3" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{t("marketplace.map")}</h2>
                  <Suspense fallback={<Skeleton className="h-[500px] rounded-2xl" />}>
                    <TunisiaMap startups={startups || []} />
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent value="ecosystems"><MarketplaceEcosystems /></TabsContent>
              <TabsContent value="trends"><MarketplaceTrends /></TabsContent>
              <TabsContent value="forum"><MarketplaceForum /></TabsContent>

              <TabsContent value="news">
                <StartupNewsManager mode={isAdmin ? "admin" : "founder"} />
              </TabsContent>

              <TabsContent value="bookmarks">
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t("marketplace.followed")}</h3>
                  <p className="text-sm text-muted-foreground">{t("marketplace.bookmarksDesc")}</p>
                </div>
              </TabsContent>

              {isAdmin && <TabsContent value="admin"><MarketplaceAdmin /></TabsContent>}
            </Tabs>
          </div>
        </section>

        {showSubmit && <StartupSubmitForm onClose={() => setShowSubmit(false)} />}
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
