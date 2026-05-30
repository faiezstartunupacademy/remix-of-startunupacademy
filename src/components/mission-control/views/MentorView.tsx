import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, Star, Users, ArrowRight, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MentorView = ({ userId }: { userId: string }) => {
  const [stats, setStats] = useState({ sessions: 0, pending: 0, rating: 0, reviews: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: mentor } = await supabase.from("mentors").select("id, avg_rating, reviews_count").eq("user_id", userId).maybeSingle();
      if (!mentor) return;
      const { data: sess } = await supabase.from("mentor_sessions")
        .select("*").eq("mentor_id", mentor.id).order("scheduled_at", { ascending: true });
      const list = sess || [];
      setStats({
        sessions: list.filter(s => s.status === "completed").length,
        pending: list.filter(s => s.status === "pending").length,
        rating: Number(mentor.avg_rating || 0),
        reviews: mentor.reviews_count || 0,
      });
      setUpcoming(list.filter(s => s.status === "confirmed" || s.status === "pending").slice(0, 5));
    })();
  }, [userId]);

  const kpis = [
    { label: "Sessions complétées", value: stats.sessions, icon: GraduationCap, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Demandes en attente", value: stats.pending, icon: MessageSquare, color: "text-amber-600 bg-amber-500/10" },
    { label: "Note moyenne", value: stats.rating ? stats.rating.toFixed(1) : "—", icon: Star, color: "text-yellow-600 bg-yellow-500/10" },
    { label: "Avis reçus", value: stats.reviews, icon: Users, color: "text-violet-600 bg-violet-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <Card key={k.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{k.label}</p>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${k.color}`}>
                <k.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Link to="/coach-dashboard" className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-violet-500/5 p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
            <div className="flex-1"><p className="font-semibold text-sm">Mes startups mentorées</p><p className="text-[11px] text-muted-foreground">Notes privées & progression</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </div>
        </Link>
        <Link to="/mentor-dashboard" className="group rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-amber-500/15 flex items-center justify-center"><Calendar className="h-5 w-5 text-amber-600" /></div>
            <div className="flex-1"><p className="font-semibold text-sm">Mon agenda</p><p className="text-[11px] text-muted-foreground">Disponibilités & sessions</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </div>
        </Link>
        <Link to="/mentors" className="group rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-emerald-500/15 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-emerald-600" /></div>
            <div className="flex-1"><p className="font-semibold text-sm">Ma fiche annuaire</p><p className="text-[11px] text-muted-foreground">Visibilité publique</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </div>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4 text-primary" /> Prochaines sessions</CardTitle>
          <CardDescription>Vos sessions confirmées ou en attente de validation</CardDescription>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">Aucune session planifiée pour l'instant.</p>
              <Button asChild size="sm" variant="outline"><Link to="/coach-dashboard">Ouvrir le tableau de bord coach</Link></Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {upcoming.map(s => (
                <li key={s.id} className="flex justify-between items-center text-sm p-2.5 rounded-md bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{s.topic || "Session"}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.status}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-medium">{new Date(s.scheduled_at).toLocaleDateString("fr-FR")}</p>
                    <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorView;
