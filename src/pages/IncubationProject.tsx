import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Check, AlertTriangle, Play, FileText, Download, RefreshCw, Loader2, ChevronDown, ChevronUp, ExternalLink, Trophy, PartyPopper, Rocket, TestTube2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAIReport } from "@/hooks/useAIReport";
import { toast } from "sonner";
import jsPDF from "jspdf";

const STEP_EMOJIS = ["🔥", "⚖️", "📐", "👥", "⚠️", "📈", "🎯"];
const STEP_NAMES = ["Disruption", "Réglementaire", "Running Lean", "MVP-Personas", "Risques", "Métriques", "Plan Tactique"];
const STEP_ICONS: Record<string, string> = {
  completed: "✅",
  active: "🔵",
  in_progress: "🔵",
  locked: "🔒",
  not_started: "⬜",
};

const statusColors: Record<string, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  skipped: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
};

type StoredPdf = {
  name: string;
  path: string;
  createdAt: string | null;
};

const IncubationProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { generateReport, loading: reportLoading } = useAIReport();
  const [project, setProject] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [testsByStep, setTestsByStep] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [generatingStep, setGeneratingStep] = useState<number | null>(null);
  const [transitionStep, setTransitionStep] = useState<number | null>(null);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  const [generatingFinalPDF, setGeneratingFinalPDF] = useState(false);
  const [storedPdfs, setStoredPdfs] = useState<StoredPdf[]>([]);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, stepsRes, testsRes] = await Promise.all([
        supabase.from("incubation_projects").select("*").eq("id", id!).single(),
        supabase.from("incubation_steps").select("*").eq("project_id", id!).order("step_number"),
        supabase.from("mvp_tests").select("*").eq("project_id", id!).order("test_number"),
      ]);

      if (projectRes.error) throw projectRes.error;
      setProject(projectRes.data);
      setSteps(stepsRes.data || []);

      const grouped: Record<string, any[]> = {};
      (testsRes.data || []).forEach(t => {
        if (!grouped[t.step_id]) grouped[t.step_id] = [];
        grouped[t.step_id].push(t);
      });
      setTestsByStep(grouped);

      if (projectRes.data?.user_id) {
        await loadStoredPdfs(projectRes.data.user_id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement du projet");
    } finally {
      setLoading(false);
    }
  };

  const loadStoredPdfs = async (projectUserId: string) => {
    if (!id || !projectUserId) return;

    const basePath = `${projectUserId}/${id}/generated`;
    const { data, error } = await supabase.storage
      .from("incubation-reports")
      .list(basePath, { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.error("Storage list error:", error);
      return;
    }

    const files = (data || [])
      .filter((file) => file.name.toLowerCase().endsWith(".pdf"))
      .map((file) => ({
        name: file.name,
        path: `${basePath}/${file.name}`,
        createdAt: file.created_at ?? null,
      }));

    setStoredPdfs(files);
  };

  const uploadGeneratedPdf = async (doc: jsPDF, fileName: string) => {
    if (!id || !project?.user_id) return;

    const normalizedName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const filePath = `${project.user_id}/${id}/generated/${normalizedName}`;
    const blob = doc.output("blob");

    const { error } = await supabase.storage
      .from("incubation-reports")
      .upload(filePath, blob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    await loadStoredPdfs(project.user_id);
  };

  const downloadStoredPdf = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from("incubation-reports").download(filePath);

    if (error || !data) {
      toast.error("Impossible de télécharger ce PDF archivé");
      return;
    }

    const blobUrl = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleGenerateReport = async (stepData: any) => {
    if (!project) return;
    setGeneratingStep(stepData.step_number);
    try {
      await generateReport(project.id, stepData.step_number, {
        name: project.name, description: project.description, sector: project.sector,
        stage: project.stage, problem_description: project.problem_description,
        solution_description: project.solution_description, target_customers: project.target_customers,
        business_model: project.business_model, competitors: project.competitors,
        differentiator: project.differentiator,
      });
      toast.success("Rapport généré avec succès !");
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setGeneratingStep(null);
    }
  };

  const handleTestStatusChange = async (testId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "completed") updates.executed_at = new Date().toISOString();
      await supabase.from("mvp_tests").update(updates).eq("id", testId);
      toast.success("Test mis à jour");
      
      // Check if all tests in this step are now completed
      await fetchData();
      
      // Find which step this test belongs to
      for (const [stepId, tests] of Object.entries(testsByStep)) {
        const testInStep = tests.find(t => t.id === testId);
        if (testInStep && newStatus === "completed") {
          const updatedTests = tests.map(t => t.id === testId ? { ...t, status: "completed" } : t);
          const allCompleted = updatedTests.every(t => t.status === "completed");
          const stepData = steps.find(s => s.id === stepId);
          
          if (allCompleted && stepData && stepData.status !== "completed") {
            toast.info(`🎯 Tous les tests de l'étape ${stepData.step_number} sont terminés ! Générez le rapport et validez la gate.`, { duration: 5000 });
          }
          break;
        }
      }
    } catch { toast.error("Erreur"); }
  };

  const handlePassGate = async (stepData: any) => {
    try {
      setTransitionStep(stepData.step_number);
      
      // 1. Generate and archive PDF report for this step
      await exportPDF(stepData, { download: false });

      // 2. Mark step as completed
      await supabase.from("incubation_steps").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        gate_status: "passed"
      }).eq("id", stepData.id);

      const isLastStep = stepData.step_number === 7;

      if (!isLastStep) {
        // 3. Unlock next step
        const nextStep = steps.find(s => s.step_number === stepData.step_number + 1);
        if (nextStep) {
          await supabase.from("incubation_steps").update({
            status: "active",
            started_at: new Date().toISOString()
          }).eq("id", nextStep.id);
        }

        const newProgress = Math.round(((stepData.step_number) / 7) * 100);
        await supabase.from("incubation_projects").update({
          current_step: stepData.step_number + 1,
          overall_progress: newProgress
        }).eq("id", project.id);

        toast.success(`🎉 Étape ${stepData.step_number} validée ! Passage à l'étape ${stepData.step_number + 1} — ${STEP_NAMES[stepData.step_number]}`, { duration: 5000 });

        await fetchData();

        // Smooth scroll to next step after a short delay
        setTimeout(() => {
          const nextStepData = steps.find(s => s.step_number === stepData.step_number + 1);
          if (nextStepData && stepRefs.current[nextStepData.id]) {
            stepRefs.current[nextStepData.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          setTransitionStep(null);
        }, 800);
      } else {
        // All 7 steps completed!
248:         await supabase.from("incubation_projects").update({
249:           current_step: 8,
250:           overall_progress: 100,
251:           status: "completed"
252:         }).eq("id", project.id);
253: 
254:         // Auto-add startup to marketplace
255:         try {
256:           const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
257:           const { data: { user } } = await supabase.auth.getUser();
258:           if (user) {
259:             const { data: existing } = await supabase
260:               .from("marketplace_startups")
261:               .select("id")
262:               .eq("slug", slug)
263:               .maybeSingle();
264:             
265:             if (!existing) {
266:               await supabase.from("marketplace_startups").insert({
267:                 name: project.name,
268:                 slug,
269:                 sector: project.sector || "Technologie",
270:                 stage: project.stage || "MVP",
271:                 tagline: project.description?.substring(0, 120) || "",
272:                 description: project.description || "",
273:                 created_by: user.id,
274:                 is_approved: false,
275:               });
276:               toast.info("🚀 Votre startup a été soumise au marketplace pour approbation !");
277:             }
278:           }
279:         } catch (e) {
280:           console.error("Auto marketplace submission error:", e);
281:         }
282: 
283:         await fetchData();
284: 
285:         // Final PDF is generated and archived before celebration + redirect
286:         await generateFinalPDF({ download: false });
287:         setShowFinalCelebration(true);
288:         toast.success("🏆 Félicitations ! Incubation terminée ! Rapport final généré et archivé. Redirection vers la Console Stratégique...", { duration: 6000 });
289: 
290:         setTimeout(() => {
291:           navigate(`/pole-strategique/${id}`);
292:         }, 5000);
293: 
294:         setTransitionStep(null);
      }
    } catch { 
      toast.error("Erreur lors de la validation"); 
      setTransitionStep(null);
    }
  };

  const generateFinalPDF = useCallback(async (options?: { download?: boolean }) => {
    if (!project || !steps.length) return;
    setGeneratingFinalPDF(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Cover page
      doc.setFillColor(88, 28, 135);
      doc.rect(0, 0, pageWidth, 297, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.text("RAPPORT FINAL", margin, 60);
      doc.text("D'INCUBATION", margin, 75);
      doc.setFontSize(20);
      doc.text(project.name, margin, 100);
      doc.setFontSize(14);
      if (project.sector) doc.text(`Secteur : ${project.sector}`, margin, 115);
      if (project.stage) doc.text(`Stade : ${project.stage}`, margin, 128);
      doc.setFontSize(12);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 150);
      doc.text("StartUnUp Academy — Plateforme d'Incubation IA", margin, 165);

      // Summary page
      doc.addPage();
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.text("📊 Résumé Exécutif", margin, 25);

      let y = 40;
      doc.setFontSize(12);
      doc.text(`Projet : ${project.name}`, margin, y); y += 8;
      doc.text(`Description : ${project.description || "N/A"}`, margin, y); y += 8;
      doc.text(`Progression : 100%`, margin, y); y += 8;
      doc.text(`Étapes complétées : 7/7`, margin, y); y += 15;

      // Scores summary
      doc.setFontSize(16);
      doc.text("🎯 Scores par étape", margin, y); y += 10;
      doc.setFontSize(11);

      steps.forEach((s, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const score = s.ai_report_score || "N/A";
        doc.setFont("helvetica", "bold");
        doc.text(`${STEP_EMOJIS[i]} Étape ${s.step_number} — ${STEP_NAMES[i]}`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(`Score : ${score}/100`, margin + 120, y);
        y += 7;

        const stepTests = testsByStep[s.id] || [];
        const completed = stepTests.filter(t => t.status === "completed").length;
        doc.text(`   Tests complétés : ${completed}/${stepTests.length}`, margin, y);
        y += 10;
      });

      // Detailed reports per step
      steps.forEach((s, i) => {
        doc.addPage();
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(`${STEP_EMOJIS[i]} Étape ${s.step_number} — ${s.name}`, margin, 25);

        let sy = 40;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const report = s.ai_report_content;
        if (report && typeof report === "object") {
          Object.entries(report).forEach(([key, value]) => {
            if (sy > 270) { doc.addPage(); sy = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(key.replace(/_/g, " ").toUpperCase(), margin, sy);
            sy += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
            const lines = doc.splitTextToSize(text, contentWidth);
            lines.forEach((line: string) => {
              if (sy > 280) { doc.addPage(); sy = 20; }
              doc.text(line, margin, sy);
              sy += 4.5;
            });
            sy += 5;
          });
        }
      });

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`StartUnUp Academy — Rapport Final d'Incubation — Page ${p}/${totalPages}`, margin, 290);
      }

      const fileName = `rapport-final-incubation-${project.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      await uploadGeneratedPdf(doc, fileName);

      if (options?.download !== false) {
        doc.save(fileName);
      }

      toast.success("📄 Rapport final PDF généré et archivé !");
    } catch (e) {
      toast.error("Erreur lors de la génération du rapport final");
      throw e;
    } finally {
      setGeneratingFinalPDF(false);
    }
  }, [project, steps, testsByStep]);

  const exportPDF = async (stepData: any, options?: { download?: boolean }) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Rapport — ${stepData.name}`, 20, 25);
    doc.setFontSize(12);
    doc.text(`Projet : ${project?.name}`, 20, 35);
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 20, 42);

    let y = 55;
    const report = stepData.ai_report_content;
    if (report && typeof report === "object") {
      Object.entries(report).forEach(([key, value]) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(key.replace(/_/g, " ").toUpperCase(), 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach((line: string) => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(line, 20, y);
          y += 5;
        });
        y += 5;
      });
    } else {
      doc.text("Aucun rapport disponible.", 20, y);
    }

    doc.setFontSize(8);
    doc.text("Généré par StartunupAcademy — Plateforme d'Incubation IA", 20, 290);

    const fileName = `rapport-${stepData.name.toLowerCase().replace(/\s+/g, "-")}-${project?.name?.toLowerCase().replace(/\s+/g, "-") || "projet"}.pdf`;
    await uploadGeneratedPdf(doc, fileName);

    if (options?.download !== false) {
      doc.save(fileName);
      toast.success("PDF téléchargé et archivé !");
      return;
    }

    toast.success("PDF archivé dans l'espace du projet !");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <main className="flex-1 container py-12">
          <Skeleton className="h-8 w-1/3 mb-4" /><Skeleton className="h-4 w-1/2 mb-8" />
          <div className="flex gap-4 justify-center mb-8">{[...Array(7)].map((_, i) => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}</div>
        </main>
      <Footer /></div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold">Projet introuvable</h1>
          <Button asChild className="mt-4"><Link to="/pole-strategique">Retour</Link></Button>
        </main>
      <Footer /></div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button variant="ghost" onClick={() => navigate("/pole-strategique")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour aux projets
        </Button>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">{project.name}</h1>
            {project.sector && <Badge variant="secondary">{project.sector}</Badge>}
           {project.stage && <Badge variant="outline">{project.stage}</Badge>}
          </div>
          {project.description && <p className="text-muted-foreground">{project.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Progression globale</span>
            <Progress value={project.overall_progress || 0} className="flex-1 max-w-xs h-2" />
            <span className="text-sm font-medium">{Math.round(project.overall_progress || 0)}%</span>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to={`/strategic-console/${project.id}`}>
                <Rocket className="h-4 w-4" /> Console Stratégique
              </Link>
            </Button>
            {project.overall_progress === 100 && (
              <Button size="sm" variant="default" className="gap-2" onClick={() => generateFinalPDF()} disabled={generatingFinalPDF}>
                {generatingFinalPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                📄 Rapport Final PDF
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-8 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📁 Espace PDF générés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storedPdfs.length > 0 ? (
              <div className="space-y-2">
                {storedPdfs.map((file) => (
                  <div key={file.path} className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.createdAt ? new Date(file.createdAt).toLocaleString("fr-FR") : "Date inconnue"}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => downloadStoredPdf(file.path, file.name)}>
                      <Download className="h-3.5 w-3.5" /> Ouvrir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun PDF archivé pour le moment. Les PDF générés après tests seront conservés ici automatiquement.</p>
            )}
          </CardContent>
        </Card>

        {/* Visual progress per step */}
        <Card className="mb-8 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📊 Progression par étape</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {steps.map((s, i) => {
                const stepTests = testsByStep[s.id] || [];
                const completed = stepTests.filter(t => t.status === "completed").length;
                const total = stepTests.length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : (s.status === "completed" ? 100 : 0);
                const isCompleted = s.status === "completed";
                const isActive = s.status === "active" || s.status === "in_progress";
                const isLocked = s.status === "locked";

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                      isLocked ? "opacity-40" : ""
                    }`}
                  >
                    <span className="text-lg mb-1">{STEP_EMOJIS[i]}</span>
                    <div className="w-full h-24 sm:h-28 bg-muted rounded-md relative overflow-hidden flex items-end">
                      <motion.div
                        className={`w-full rounded-md ${
                          isCompleted ? "bg-emerald-500" :
                          isActive ? "bg-primary" :
                          "bg-muted-foreground/30"
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 4)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {pct}%
                      </span>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-1 leading-tight">{STEP_NAMES[i]}</p>
                    <p className="text-[10px] font-medium">{completed}/{total}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stepper */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const isActive = s.status === "active" || s.status === "in_progress";
            const isCompleted = s.status === "completed";
            const isLocked = s.status === "locked";

            return (
              <div key={s.id} className="flex items-center gap-0">
                <motion.div
                  className={`relative flex flex-col items-center transition-all duration-300 ${
                    isLocked ? "opacity-40" : "cursor-pointer hover:scale-105"
                  }`}
                  whileHover={!isLocked ? { scale: 1.05 } : {}}
                  onClick={() => {
                    if (!isLocked && stepRefs.current[s.id]) {
                      stepRefs.current[s.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30" :
                    isActive ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse ring-4 ring-primary/20" :
                    "bg-muted border-border text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="h-6 w-6" /> :
                     isLocked ? <Lock className="h-5 w-5" /> :
                     <span>{STEP_EMOJIS[i]}</span>}
                  </div>
                  <span className={`text-xs mt-1 text-center max-w-[80px] font-semibold ${
                    isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-muted-foreground"
                  }`}>
                    {STEP_NAMES[i]}
                  </span>
                  {/* Prev/Next step bubble */}
                  {isActive && i > 0 && (
                    <button
                      className="absolute -left-3 top-3 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevStep = steps[i - 1];
                        if (prevStep && stepRefs.current[prevStep.id]) {
                          stepRefs.current[prevStep.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                  )}
                  {isActive && i < steps.length - 1 && (
                    <button
                      className="absolute -right-3 top-3 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStep = steps[i + 1];
                        if (nextStep && stepRefs.current[nextStep.id]) {
                          stepRefs.current[nextStep.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={`hidden md:block w-8 lg:w-12 h-0.5 mx-1 transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500" : "bg-border"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step details */}
        <Accordion type="multiple" className="space-y-4">
          {steps.filter(s => s.status !== "locked").map((stepData) => {
            const stepTests = testsByStep[stepData.id] || [];
            const completedTests = stepTests.filter(t => t.status === "completed").length;
            const hasTests = stepTests.length > 0;
            const progress = hasTests ? Math.round((completedTests / stepTests.length) * 100) : 100;
            const isGenerating = generatingStep === stepData.step_number;
            const hasReport = stepData.ai_report_content && Object.keys(stepData.ai_report_content).length > 0;
            const canPassGate = hasReport && (hasTests ? progress >= 60 : true);

            return (
              <AccordionItem key={stepData.id} value={stepData.id} className="border rounded-xl overflow-hidden">
                <div ref={el => { stepRefs.current[stepData.id] = el; }}>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl">{STEP_EMOJIS[stepData.step_number - 1]}</span>
                    <div>
                      <div className="font-bold">Étape {stepData.step_number} — {stepData.name}</div>
                      <p className="text-sm text-muted-foreground">{stepData.description}</p>
                    </div>
                    <Badge className={stepData.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}>
                      {stepData.status === "completed" ? "Complétée" : "Active"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Card A — Rapport IA */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Rapport IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {isGenerating ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyse en cours... L'IA examine votre projet
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ) : hasReport ? (
                          <div className="space-y-3">
                            {stepData.ai_report_score && (
                              <div className="text-center p-3 rounded-xl bg-muted/50">
                                <p className="text-xs text-muted-foreground">Score</p>
                                <motion.p className="text-3xl font-bold text-primary"
                                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                                  {stepData.ai_report_score}/100
                                </motion.p>
                              </div>
                            )}
                            <div className="max-h-60 overflow-y-auto text-sm space-y-2 pr-2">
                              {typeof stepData.ai_report_content === "object" && Object.entries(stepData.ai_report_content).map(([key, value]) => (
                                <div key={key} className="p-2 rounded-lg bg-muted/30">
                                  <p className="font-semibold text-xs text-primary mb-1">{key.replace(/_/g, " ").toUpperCase()}</p>
                                  <p className="text-xs text-foreground whitespace-pre-wrap">
                                    {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => exportPDF(stepData)} className="gap-1 text-xs">
                                <Download className="h-3 w-3" /> PDF
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleGenerateReport(stepData)} className="gap-1 text-xs">
                                <RefreshCw className="h-3 w-3" /> Régénérer
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => handleGenerateReport(stepData)} className="w-full gap-2" size="sm">
                            <Play className="h-4 w-4" /> Générer le rapport IA
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Card B — Tests MVP */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          🧪 Tests MVP ({completedTests}/{stepTests.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={progress} className="h-2" />
                        <p className="text-[10px] text-muted-foreground text-right">{completedTests}/{stepTests.length} tests • {stepTests.filter(t => t.status === "in_progress").length} en cours • {stepTests.filter(t => t.status === "not_started").length} restants</p>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {stepTests.map(test => (
                            <div key={test.id} className="p-2 rounded-lg bg-muted/30 flex items-start justify-between gap-2">
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/pole-strategique/${project.id}/test/${test.id}`} className="flex-1 min-w-0 hover:bg-accent/50 rounded-md p-1 -m-1 transition-colors cursor-pointer">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-muted-foreground">#{test.test_number}</span>
                                        <p className="text-xs font-medium truncate text-primary hover:underline">{test.name}</p>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground line-clamp-1">{test.objective}</p>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <p className="font-semibold text-xs mb-1">🧪 {test.name}</p>
                                    <p className="text-xs text-muted-foreground">{test.objective || "Test de validation MVP pour cette étape d'incubation."}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="flex items-center gap-1 shrink-0">
                                <Badge variant="outline" className={`text-[10px] ${statusColors[test.status] || ""}`}>
                                  {test.status === "completed" ? "✅" : test.status === "in_progress" ? "🔄" : "⬜"}
                                </Badge>
                                {test.status === "not_started" && (
                                  <Button size="sm" variant="ghost" className="h-6 px-1 text-[10px]" onClick={() => handleTestStatusChange(test.id, "in_progress")}>▶</Button>
                                )}
                                {test.status === "in_progress" && (
                                  <Button size="sm" variant="ghost" className="h-6 px-1 text-[10px]" onClick={() => handleTestStatusChange(test.id, "completed")}>✓</Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {stepTests.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aucun test associé</p>}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card C — Gate */}
                    <Card className={`border-2 ${
                      stepData.gate_status === "passed" ? "border-emerald-500/50 bg-emerald-500/5" :
                      progress >= 60 && hasReport ? "border-yellow-500/50 bg-yellow-500/5" :
                      "border-destructive/30 bg-destructive/5"
                    }`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {stepData.gate_status === "passed" ? "🟢" : progress >= 60 ? "🟡" : "🔴"} Gate GO/NO-GO
                        </CardTitle>
                      </CardHeader>
                       <CardContent className="space-y-3">
                        <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                          <p className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">📋 Critères de passage</p>
                          <p className="text-sm leading-relaxed">{stepData.gate_criteria}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className={`p-2 rounded-lg text-center ${hasReport ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30" : "bg-muted text-muted-foreground border border-border"}`}>
                              {hasReport ? "✅" : "❌"} Rapport IA
                            </div>
                            <div className={`p-2 rounded-lg text-center ${!hasTests || progress >= 60 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30" : "bg-muted text-muted-foreground border border-border"}`}>
                              {!hasTests || progress >= 60 ? "✅" : "❌"} Tests ≥60%
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tests complétés</span>
                            <span>{completedTests}/{stepTests.length}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        {stepData.status !== "completed" && (
                          <>
                            {!hasReport && (
                              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                                <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Rapport IA requis
                                </p>
                                <p className="text-amber-600 dark:text-amber-500">
                                  Vous devez d'abord générer le rapport IA pour cette étape. 
                                  Le rapport analyse votre projet et produit des recommandations spécifiques 
                                  à l'étape « {STEP_NAMES[stepData.step_number - 1]} ». 
                                  Cliquez sur « Générer le rapport IA » dans la carte de gauche.
                                </p>
                              </div>
                            )}
                            {hasReport && hasTests && progress < 60 && (
                              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                                <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Tests insuffisants ({progress}% / 60% minimum)
                                </p>
                                <p className="text-amber-600 dark:text-amber-500">
                                  Vous devez compléter au moins 60% des tests MVP associés à cette étape 
                                  avant de pouvoir valider la gate. Il vous reste {stepTests.length - completedTests} test(s) 
                                  à compléter. Marquez vos tests comme « complétés » dans la carte centrale 
                                  ou accédez aux détails via l'icône ↗.
                                </p>
                              </div>
                            )}
                            {hasReport && !hasTests && (
                              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                                <p className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                                  ℹ️ Aucun test requis pour cette étape
                                </p>
                                <p className="text-blue-600 dark:text-blue-500">
                                  L'étape « {STEP_NAMES[stepData.step_number - 1]} » ne comporte pas de tests MVP. 
                                  Le rapport IA est suffisant pour valider la gate.
                                </p>
                              </div>
                            )}
                            <Button
                              onClick={() => handlePassGate(stepData)}
                              disabled={!canPassGate}
                              className="w-full gap-2"
                              size="sm"
                            >
                              <Check className="h-4 w-4" />
                              {!hasReport ? "Rapport IA requis — Générez-le d'abord" : 
                               hasTests && progress < 60 ? `Encore ${stepTests.length - completedTests} test(s) à compléter` : 
                               `✅ Valider l'étape ${stepData.step_number} et passer à la suite`}
                            </Button>
                          </>
                        )}
                        {stepData.status === "completed" && (
                          <Badge className="w-full justify-center bg-emerald-500/10 text-emerald-600">✅ Étape validée</Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Transition overlay */}
        <AnimatePresence>
          {transitionStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center p-8 rounded-2xl bg-card border shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Passage à l'étape {transitionStep + 1}</h3>
                <p className="text-muted-foreground">{STEP_NAMES[transitionStep]} → Débloqué</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final celebration modal */}
        <AnimatePresence>
          {showFinalCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center p-10 rounded-3xl bg-card border-2 border-primary/30 shadow-2xl max-w-lg mx-4"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">🎉 Incubation Terminée !</h2>
                <p className="text-muted-foreground mb-6">
                  Toutes les 7 étapes ont été validées avec succès. Téléchargez votre rapport final puis accédez à votre Console Stratégique Unifiée.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={async () => {
                    await generateFinalPDF();
                    navigate(`/pole-strategique/${id}`);
                  }} disabled={generatingFinalPDF} className="gap-2">
                    {generatingFinalPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {generatingFinalPDF ? "Génération et redirection..." : "📄 Télécharger le Rapport Final PDF"}
                  </Button>
                  <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 text-white" onClick={() => navigate(`/pole-strategique/${id}`)}>
                    <Rocket className="h-4 w-4" /> Accéder à la Console Stratégique
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFinalCelebration(false)}>
                    Rester sur cette page
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default IncubationProject;
