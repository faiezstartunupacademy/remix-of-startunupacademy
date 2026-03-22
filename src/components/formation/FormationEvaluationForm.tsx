import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Loader2, ClipboardCheck, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Enrollment = {
  id: string;
  formation_id: string;
  formation_title: string;
  status: string;
};

const getAccessLevel = (score: number): string => {
  if (score >= 90) return "expert";
  if (score >= 75) return "advanced";
  if (score >= 60) return "intermediate";
  return "basic";
};

const getAccessBadge = (level: string) => {
  const map: Record<string, { label: string; className: string }> = {
    basic: { label: "Basique", className: "bg-muted text-muted-foreground" },
    intermediate: { label: "Intermédiaire", className: "bg-blue-500/10 text-blue-600" },
    advanced: { label: "Avancé", className: "bg-amber-500/10 text-amber-600" },
    expert: { label: "Expert", className: "bg-purple-500/10 text-purple-600" },
  };
  return map[level] || map.basic;
};

const CRITERIA = [
  { key: "content_quality", label: "Qualité du contenu", max: 20 },
  { key: "pedagogy", label: "Pédagogie du formateur", max: 20 },
  { key: "practical", label: "Cas pratiques & exercices", max: 20 },
  { key: "interaction", label: "Interactivité & engagement", max: 20 },
  { key: "applicability", label: "Applicabilité aux projets", max: 20 },
];

const FormationEvaluationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; level: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("formation_participants" as any)
        .select("id, formation_id, status")
        .eq("user_id", user.id)
        .in("status", ["in_progress", "completed"]);
      if (data && data.length > 0) {
        // Load formation titles
        const formationIds = (data as any[]).map((d: any) => d.formation_id);
        const { data: formations } = await supabase
          .from("formations" as any)
          .select("id, title")
          .in("id", formationIds);
        const titleMap = Object.fromEntries((formations || []).map((f: any) => [f.id, f.title]));
        setEnrollments((data as any[]).map((d: any) => ({
          id: d.id,
          formation_id: d.formation_id,
          formation_title: titleMap[d.formation_id] || "Formation",
          status: d.status,
        })));
      }
    };
    load();
  }, [user]);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const accessLevel = getAccessLevel(totalScore);
  const badge = getAccessBadge(accessLevel);

  const handleSubmit = async () => {
    if (!user || !selectedEnrollment) return;
    if (Object.keys(scores).length < CRITERIA.length) {
      toast({ title: "Évaluation incomplète", description: "Veuillez noter tous les critères.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Insert evaluation
    const { error: evalError } = await supabase.from("formation_evaluations" as any).insert({
      user_id: user.id,
      formation_id: selectedEnrollment.formation_id,
      participant_id: selectedEnrollment.id,
      score: totalScore,
      feedback: feedback.trim() || null,
      strengths: strengths.trim() || null,
      improvements: improvements.trim() || null,
    } as any);

    if (evalError) {
      toast({ title: "Erreur", description: evalError.message.includes("duplicate") ? "Vous avez déjà évalué cette formation." : evalError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    // Get formation domain
    const { data: formation } = await supabase
      .from("formations" as any)
      .select("domain")
      .eq("id", selectedEnrollment.formation_id)
      .single();

    // Create completion record
    await supabase.from("formation_completions" as any).insert({
      user_id: user.id,
      formation_id: selectedEnrollment.formation_id,
      domain: (formation as any)?.domain || "general",
      score: totalScore,
      access_level: accessLevel,
    } as any);

    // Update participant status
    await supabase.from("formation_participants" as any)
      .update({ status: "completed", completed_at: new Date().toISOString(), progress_percent: 100 } as any)
      .eq("id", selectedEnrollment.id);

    setResult({ score: totalScore, level: accessLevel });
    toast({ title: "🎓 Évaluation soumise", description: `Score: ${totalScore}/100 — Niveau: ${badge.label}` });
    setIsSubmitting(false);
  };

  if (result) {
    const b = getAccessBadge(result.level);
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Score: {result.score}/100</h3>
          <Badge className={`${b.className} text-lg px-4 py-1 mb-4`}>{b.label}</Badge>
          <p className="text-muted-foreground">
            {result.score >= 70
              ? "Félicitations ! Votre score vous donne accès au Pôle Stratégique."
              : "Votre score ne permet pas encore l'accès au Pôle Stratégique. Continuez votre formation !"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Évaluation de Formation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Évaluez votre formation pour obtenir votre certificat et débloquer l'accès au Pôle Stratégique.
            Score minimum requis : <strong>70/100</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {enrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune formation en cours à évaluer. Inscrivez-vous d'abord à une formation.</p>
          ) : (
            <>
              {/* Select formation */}
              <div className="space-y-2">
                <Label>Formation à évaluer</Label>
                <div className="grid gap-2">
                  {enrollments.map(e => (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEnrollment(e)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedEnrollment?.id === e.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="font-medium">{e.formation_title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedEnrollment && (
                <>
                  {/* Scoring criteria */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Critères d'évaluation</Label>
                    {CRITERIA.map(c => (
                      <div key={c.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{c.label}</span>
                          <span className="text-sm font-bold text-primary">{scores[c.key] || 0}/{c.max}</span>
                        </div>
                        <Slider
                          value={[scores[c.key] || 0]}
                          onValueChange={v => setScores(prev => ({ ...prev, [c.key]: v[0] }))}
                          max={c.max}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-bold">Score Total</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{totalScore}/100</span>
                        <Badge className={badge.className}>{badge.label}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Points forts</Label>
                    <Textarea placeholder="Ce qui était le plus utile..." value={strengths}
                      onChange={e => setStrengths(e.target.value)} rows={2} maxLength={500} />
                  </div>
                  <div className="space-y-2">
                    <Label>Axes d'amélioration</Label>
                    <Textarea placeholder="Ce qui pourrait être amélioré..." value={improvements}
                      onChange={e => setImprovements(e.target.value)} rows={2} maxLength={500} />
                  </div>
                  <div className="space-y-2">
                    <Label>Commentaire libre</Label>
                    <Textarea placeholder="Votre retour général..." value={feedback}
                      onChange={e => setFeedback(e.target.value)} rows={3} maxLength={1000} />
                  </div>

                  <Button onClick={handleSubmit} className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                    Soumettre l'évaluation
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FormationEvaluationForm;
