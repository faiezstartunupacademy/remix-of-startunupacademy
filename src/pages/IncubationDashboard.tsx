import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Brain, FlaskConical, CheckCircle2, TrendingUp, Folder, Calendar, ArrowRight, BookOpen, TestTube2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const STEP_NAMES = ["Disruption", "Réglementaire", "Running Lean", "MVP-Personas", "Risques", "Métriques", "Plan Tactique"];

const IncubationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, stepsCompleted: 0, testsExecuted: 0, avgScore: 0 });

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from("incubation_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(projectsData || []);

      // Fetch stats
      const { data: stepsData } = await supabase
        .from("incubation_steps")
        .select("status, ai_report_score")
        .eq("status", "completed");

      const { data: testsData } = await supabase
        .from("mvp_tests")
        .select("status")
        .eq("status", "completed");

      const completedSteps = stepsData?.length || 0;
      const completedTests = testsData?.length || 0;
      const scores = stepsData?.filter(s => s.ai_report_score).map(s => Number(s.ai_report_score)) || [];
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      setStats({
        total: projectsData?.length || 0,
        stepsCompleted: completedSteps,
        testsExecuted: completedTests,
        avgScore: avg,
      });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Connectez-vous pour accéder à l'incubation</h1>
          <p className="text-muted-foreground mb-6">L'espace d'incubation IA nécessite un compte.</p>
          <Button asChild><Link to="/auth">Se connecter</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: "Projets", value: stats.total, icon: Folder, color: "text-blue-500" },
    { label: "Étapes complétées", value: stats.stepsCompleted, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Tests exécutés", value: stats.testsExecuted, icon: FlaskConical, color: "text-orange-500" },
    { label: "Score moyen", value: stats.avgScore ? `${stats.avgScore}%` : "—", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Incubation IA
              </h1>
              <p className="text-muted-foreground mt-1">Pipeline stratégique en 7 étapes avec intelligence artificielle</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="gap-2 rounded-full">
                <Link to="/knowledge">
                  <BookOpen className="h-4 w-4" /> Base de connaissance
                </Link>
              </Button>
              <Button onClick={() => navigate("/pole-strategique/new")} className="gap-2 rounded-full shadow-lg">
                <Plus className="h-4 w-4" />
                Nouveau projet
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted">
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Projects list */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-6 w-3/4 mb-4" /><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-3 w-full" /></CardContent></Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Lancez votre premier projet d'incubation</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Parcourez 7 étapes stratégiques guidées par l'IA : de la disruption au plan tactique.
              </p>
              <Button onClick={() => navigate("/pole-strategique/new")} size="lg" className="gap-2 rounded-full shadow-lg">
                <Plus className="h-5 w-5" />
                Créer un projet
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/pole-strategique/${project.id}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer border-border/50 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description || "Aucune description"}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.sector && <Badge variant="secondary">{project.sector}</Badge>}
                          {project.stage && <Badge variant="outline">{project.stage}</Badge>}
                          <Badge className="bg-primary/10 text-primary border-0">
                            Étape {project.current_step}/7 — {STEP_NAMES[(project.current_step || 1) - 1]}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progression</span>
                            <span>{Math.round(project.overall_progress || 0)}%</span>
                          </div>
                          <Progress value={project.overall_progress || 0} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.created_at).toLocaleDateString("fr-FR")}
                          </p>
                          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/strategic-console/${project.id}`}>
                              <TestTube2 className="h-3 w-3" /> MVP Validator
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IncubationDashboard;
