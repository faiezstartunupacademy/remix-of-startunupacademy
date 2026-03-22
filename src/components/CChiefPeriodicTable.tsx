import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, X, Users, Target, TrendingUp, Lightbulb, 
  CheckCircle2, AlertTriangle, BookOpen, ArrowRight,
  Building2, Briefcase, DollarSign, Code, Heart, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  cSuiteRoles, 
  cSuiteCategories, 
  ceoMindsetInsights,
  boardRoles,
  type CSuiteRole, 
  type CSuiteCategory 
} from "@/data/cSuiteRolesData";

const categoryIcons: Record<string, React.ElementType> = {
  leadership: Building2,
  operations: Briefcase,
  growth: TrendingUp,
  product: Code,
  finance: DollarSign,
  people: Heart
};

const CChiefPeriodicTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<CSuiteRole | null>(null);
  const [activeTab, setActiveTab] = useState("table");

  const filteredRoles = useMemo(() => {
    return cSuiteRoles.filter(role => {
      const matchesSearch = searchQuery === "" || 
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || role.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryStyle = (categoryId: string) => {
    const cat = cSuiteCategories.find(c => c.id === categoryId);
    return cat || cSuiteCategories[0];
  };

  const RoleCard = ({ role }: { role: CSuiteRole }) => {
    const category = getCategoryStyle(role.category);
    const Icon = categoryIcons[role.category] || Building2;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedRole(role)}
        className="cursor-pointer"
      >
        <Card className={`relative overflow-hidden border-2 hover:border-primary transition-all duration-300 h-full`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <span className={`text-2xl font-black ${category.textColor}`}>
                {role.symbol}
              </span>
              <Icon className={`h-5 w-5 ${category.textColor} opacity-60`} />
            </div>
            <h3 className="font-bold text-sm mb-1 line-clamp-1">{role.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{role.fullName}</p>
            {role.fractionalOption && (
              <Badge variant="outline" className="mt-2 text-[10px]">
                Fractional ✓
              </Badge>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const RoleDetailModal = ({ role, onClose }: { role: CSuiteRole; onClose: () => void }) => {
    const category = getCategoryStyle(role.category);
    const Icon = categoryIcons[role.category] || Building2;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${category.color} p-6 text-white relative`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Icon className="h-10 w-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl font-black">{role.symbol}</span>
                  <Badge className="bg-white/20 text-white border-0">
                    {cSuiteCategories.find(c => c.id === role.category)?.name}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold">{role.name}</h2>
                <p className="text-white/80">{role.fullName}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="p-6 max-h-[60vh]">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-lg text-muted-foreground">{role.description}</p>
              </div>

              {/* Key Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Responsibilities */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Responsabilités
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {role.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Key Skills */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Compétences Clés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {role.keySkills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* KPIs */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      KPIs Clés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {role.kpis.map((kpi, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {kpi}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* When to Hire */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Quand recruter ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{role.whenToHire}</p>
                    {role.fractionalOption && (
                      <Badge className="mt-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        Option Fractional disponible
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Success & Challenges */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Signes de Succès
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {role.signsOfSuccess.map((sign, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Défis de Scaling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {role.scalingChallenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Collaboration */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Écosystème de Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reporte à: </span>
                      <Badge>{role.reportingTo}</Badge>
                    </div>
                    <div className="text-sm flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground">Collabore avec: </span>
                      {role.collaboratesWith.map((collab, i) => (
                        <Badge key={i} variant="outline">{collab}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Source */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Source: {role.source}</span>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Rôles C-Suite
          </TabsTrigger>
          <TabsTrigger value="mindset" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Mindset CEO
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Board
          </TabsTrigger>
        </TabsList>

        {/* C-Suite Periodic Table */}
        <TabsContent value="table" className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rôle (CEO, CFO, Marketing...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedCategory(null)}
              >
                Tous ({cSuiteRoles.length})
              </Badge>
              {cSuiteCategories.map((cat) => {
                const count = cSuiteRoles.filter(r => r.category === cat.id).length;
                return (
                  <Badge
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 ${selectedCategory === cat.id ? cat.bgColor : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name} ({count})
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cSuiteCategories.map((cat) => {
              const Icon = categoryIcons[cat.id] || Building2;
              return (
                <div
                  key={cat.id}
                  className={`flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-10 cursor-pointer transition-all hover:scale-105`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                >
                  <Icon className={`h-5 w-5 ${cat.textColor}`} />
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Periodic Table Grid */}
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredRoles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun rôle ne correspond à votre recherche.</p>
            </div>
          )}
        </TabsContent>

        {/* CEO Mindset Tab */}
        <TabsContent value="mindset" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Comprendre le Mindset d'un CEO de Startup</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Basé sur "Understanding Startup CEOs" de Dan Slagen - 12 insights clés pour travailler efficacement avec un CEO.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ceoMindsetInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <Badge 
                      variant="outline" 
                      className={`mb-3 text-xs ${
                        insight.category === 'mindset' ? 'border-indigo-500 text-indigo-500' :
                        insight.category === 'execution' ? 'border-orange-500 text-orange-500' :
                        insight.category === 'leadership' ? 'border-emerald-500 text-emerald-500' :
                        'border-rose-500 text-rose-500'
                      }`}
                    >
                      {insight.category}
                    </Badge>
                    <h4 className="font-bold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-primary font-medium">
                        💡 {insight.actionable}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Board Tab */}
        <TabsContent value="board" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Construire un Board Efficace</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Basé sur "Startup Boards" de Brad Feld & Matt Blumberg - Les fondamentaux d'un conseil d'administration performant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {boardRoles.map((role, index) => (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full border-2 ${
                  role.type === 'founder' ? 'border-indigo-300 dark:border-indigo-700' :
                  role.type === 'investor' ? 'border-emerald-300 dark:border-emerald-700' :
                  'border-amber-300 dark:border-amber-700'
                }`}>
                  <CardHeader>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit mb-2 ${
                      role.type === 'founder' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' :
                      role.type === 'investor' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {role.type === 'founder' ? '👤 Fondateur' :
                       role.type === 'investor' ? '💰 Investisseur' : '🎯 Indépendant'}
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Valeur ajoutée:</p>
                      <p className="text-sm">{role.value}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Quand ajouter:</p>
                      <Badge variant="outline">{role.whenToAdd}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Matt's Rule of 1s */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📐</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">La Règle des 1 de Matt Blumberg</h4>
                  <p className="text-white/80 mb-4">
                    Pour un board équilibré, suivez cette règle simple:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-white/70">Fondateur au board</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-white/70">Investisseur par tour majeur</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-white/70">Indépendant dès la Série A</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Detail Modal */}
      <AnimatePresence>
        {selectedRole && (
          <RoleDetailModal 
            role={selectedRole} 
            onClose={() => setSelectedRole(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CChiefPeriodicTable;
