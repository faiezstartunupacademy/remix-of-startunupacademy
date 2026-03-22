import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Send, Star, Loader2, Users, CheckCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Submission = {
  id: string;
  user_id: string;
  content: string;
  status: string;
  avg_score: number | null;
  reviews_count: number;
  submitted_at: string;
};

type Props = {
  formationId: string;
  formationTitle: string;
  onCaseStudyCompleted?: () => void;
};

const PeerReviewCaseStudy = ({ formationId, formationTitle, onCaseStudyCompleted }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"submit" | "review">("submit");
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [pendingReviews, setPendingReviews] = useState<Submission[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewScore, setReviewScore] = useState(70);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, formationId]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    // Load own submission
    const { data: sub } = await supabase
      .from("case_study_submissions" as any)
      .select("*")
      .eq("user_id", user.id)
      .eq("formation_id", formationId)
      .maybeSingle();
    if (sub) setMySubmission(sub as any);

    // Load pending submissions to review (not own)
    const { data: pending } = await supabase
      .from("case_study_submissions" as any)
      .select("*")
      .eq("formation_id", formationId)
      .eq("status", "pending_review")
      .neq("user_id", user.id)
      .limit(10);
    if (pending) setPendingReviews(pending as any);

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || content.trim().length < 100) {
      toast({ title: "Contenu trop court", description: "Minimum 100 caractères requis.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("case_study_submissions" as any).insert({
      user_id: user.id,
      formation_id: formationId,
      content: content.trim(),
    } as any);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Étude de cas soumise", description: "En attente de correction par les pairs." });
      loadData();
    }
    setSubmitting(false);
  };

  const handleReview = async (submissionId: string) => {
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.from("peer_reviews" as any).insert({
      reviewer_id: user.id,
      submission_id: submissionId,
      score: reviewScore,
      feedback: reviewFeedback.trim() || null,
    } as any);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Correction envoyée", description: `Score attribué: ${reviewScore}/100` });
      setReviewingId(null);
      setReviewScore(70);
      setReviewFeedback("");
      loadData();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={tab === "submit" ? "default" : "outline"} onClick={() => setTab("submit")} className="gap-2">
          <FileText className="h-4 w-4" /> Mon étude de cas
        </Button>
        <Button variant={tab === "review" ? "default" : "outline"} onClick={() => setTab("review")} className="gap-2">
          <Users className="h-4 w-4" /> Corriger ({pendingReviews.length})
        </Button>
      </div>

      {tab === "submit" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Étude de Cas — {formationTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Rédigez une étude de cas appliquant les concepts de la formation. 
              Votre travail sera évalué par vos pairs (minimum 2 corrections).
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {mySubmission ? (
              <div className="space-y-4">
                <Badge className={
                  mySubmission.status === "completed" ? "bg-emerald-500/10 text-emerald-600" :
                  "bg-amber-500/10 text-amber-600"
                }>
                  {mySubmission.status === "completed" ? "✅ Validé" : `⏳ En attente (${mySubmission.reviews_count} correction(s))`}
                </Badge>
                {mySubmission.avg_score && (
                  <p className="text-lg font-bold">Score moyen: {mySubmission.avg_score}/100</p>
                )}
                <div className="p-4 rounded-lg bg-muted text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {mySubmission.content}
                </div>
                {mySubmission.status === "completed" && onCaseStudyCompleted && (
                  <Button onClick={onCaseStudyCompleted} className="gap-2">
                    <CheckCircle className="h-4 w-4" /> Continuer vers le badge
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Décrivez votre étude de cas en appliquant les concepts appris dans la formation..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={10}
                  maxLength={5000}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{content.length}/5000 caractères</span>
                  <span>Min. 100 caractères</span>
                </div>
                <Button onClick={handleSubmit} disabled={submitting || content.trim().length < 100} className="w-full gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Soumettre l'étude de cas
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "review" && (
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Aucune étude de cas à corriger pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map(sub => (
              <Card key={sub.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Soumis le {new Date(sub.submitted_at).toLocaleDateString("fr-FR")}
                    </Badge>
                    <Badge className="bg-amber-500/10 text-amber-600">{sub.reviews_count} correction(s)</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {sub.content}
                  </div>

                  {reviewingId === sub.id ? (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Score</Label>
                          <span className="font-bold text-primary">{reviewScore}/100</span>
                        </div>
                        <Slider value={[reviewScore]} onValueChange={v => setReviewScore(v[0])} max={100} step={5} />
                      </div>
                      <div className="space-y-2">
                        <Label>Feedback</Label>
                        <Textarea placeholder="Vos commentaires constructifs..." value={reviewFeedback}
                          onChange={e => setReviewFeedback(e.target.value)} rows={3} maxLength={1000} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setReviewingId(null)}>Annuler</Button>
                        <Button onClick={() => handleReview(sub.id)} disabled={submitting} className="gap-2">
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                          Envoyer la correction
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setReviewingId(sub.id)} className="w-full gap-2">
                      <Eye className="h-4 w-4" /> Corriger cette étude de cas
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PeerReviewCaseStudy;
