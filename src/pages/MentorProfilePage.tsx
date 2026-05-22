import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Linkedin, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfWeek } from "date-fns";
import Header from "@/components/Header";

const SESSION_TYPES = [
  { id: "discovery_30", label: "Discovery (30 min)", duration: 30 },
  { id: "deep_60", label: "Deep-dive (1h)", duration: 60 },
  { id: "recurring", label: "Mentorat mensuel récurrent", duration: 60 },
];

export default function MentorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<any | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ sessionType: "discovery_30", date: "", time: "10:00", agenda: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    if (!id) return;
    Promise.all([
      supabase.from("mentors").select("*").eq("id", id).maybeSingle(),
      supabase.from("mentor_availability").select("*").eq("mentor_id", id),
      supabase.from("mentor_reviews").select("*, mentor_sessions!inner(mentor_id)").eq("mentor_sessions.mentor_id", id).eq("reviewer_role", "startup").order("created_at", { ascending: false }).limit(10),
    ]).then(([m, a, r]) => {
      setMentor(m.data);
      setAvailability(a.data || []);
      setReviews(r.data || []);
    });
  }, [id]);

  // Generate next 14 days slots from availability
  const weekDays = Array.from({ length: 14 }, (_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));
  function slotsForDay(date: Date) {
    const dow = date.getDay();
    return availability.filter(a => (a.is_recurring && a.day_of_week === dow) || (a.specific_date === format(date, "yyyy-MM-dd")));
  }

  async function submitBooking() {
    if (!userId || !mentor) { toast.error("Connexion requise"); return; }
    if (!form.date || !form.agenda.trim()) { toast.error("Date et agenda requis"); return; }
    const scheduled = new Date(`${form.date}T${form.time}:00`).toISOString();
    const type = SESSION_TYPES.find(t => t.id === form.sessionType)!;
    const { error } = await supabase.from("mentor_sessions").insert({
      mentor_id: mentor.id,
      startup_user_id: userId,
      session_type: form.sessionType,
      scheduled_at: scheduled,
      duration_minutes: type.duration,
      agenda: form.agenda,
      status: "pending",
    });
    if (error) { toast.error("Échec de la réservation"); return; }
    toast.success("Demande envoyée — le mentor recevra une notification");
    setBookingOpen(false);
  }

  if (!mentor) return (
    <div className="min-h-screen"><Header /><div className="container py-8">Chargement…</div></div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-5xl">
        <Button variant="ghost" size="sm" asChild className="mb-4"><Link to="/mentors"><ArrowLeft className="w-4 h-4 mr-1" /> Tous les mentors</Link></Button>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
              {mentor.photo_url ? <img src={mentor.photo_url} alt={mentor.full_name} className="w-full h-full object-cover" /> : mentor.full_name.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{mentor.full_name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {mentor.avg_rating?.toFixed(1) || "—"} ({mentor.reviews_count || 0})</span>
                {mentor.years_experience > 0 && <span>{mentor.years_experience} ans d'expérience</span>}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(mentor.expertise_tags || []).map((t: string) => <Badge key={t}>{t}</Badge>)}
              </div>
              <p className="text-sm mt-4 whitespace-pre-wrap">{mentor.bio}</p>
              <div className="flex gap-3 mt-4">
                {mentor.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 mr-1" /> LinkedIn</a>
                  </Button>
                )}
                <Button onClick={() => setBookingOpen(true)}><Calendar className="w-4 h-4 mr-1" /> Réserver une session</Button>
              </div>
            </div>
          </div>
        </Card>

        {mentor.companies?.length > 0 && (
          <Card className="p-5 mb-6">
            <h2 className="font-semibold mb-2">Entreprises fondées / accompagnées</h2>
            <div className="flex flex-wrap gap-2">{mentor.companies.map((c: string) => <Badge key={c} variant="outline">{c}</Badge>)}</div>
          </Card>
        )}

        <Card className="p-5 mb-6">
          <h2 className="font-semibold mb-3">Créneaux disponibles (14 prochains jours)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {weekDays.map((d, i) => {
              const slots = slotsForDay(d);
              return (
                <div key={i} className="border border-border rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground">{format(d, "EEE dd/MM")}</div>
                  {slots.length === 0 ? <div className="text-xs mt-1 text-muted-foreground">—</div> :
                    slots.slice(0,3).map((s, k) => (
                      <button key={k} onClick={() => { setForm({ ...form, date: format(d, "yyyy-MM-dd"), time: s.start_time.slice(0,5) }); setBookingOpen(true); }}
                        className="block w-full text-xs mt-1 px-1 py-0.5 rounded bg-primary/10 hover:bg-primary/20">
                        {s.start_time.slice(0,5)}
                      </button>
                    ))
                  }
                </div>
              );
            })}
          </div>
          {availability.length === 0 && <p className="text-xs text-muted-foreground mt-2">Le mentor n'a pas encore défini de disponibilités — la réservation reste possible avec une demande personnalisée.</p>}
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-3">Avis ({reviews.length})</h2>
          {reviews.length === 0 ? <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p> : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="border-l-2 border-primary pl-3">
                  <div className="flex items-center gap-1 text-amber-400">{Array.from({length: r.rating}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div>
                  <p className="text-sm mt-1">{r.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Réserver une session avec {mentor.full_name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type de session</Label>
              <Select value={form.sessionType} onValueChange={(v) => setForm({ ...form, sessionType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SESSION_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Heure</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
            </div>
            <div>
              <Label>Agenda / Questions <span className="text-destructive">*</span></Label>
              <Textarea required value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} placeholder="Décrivez précisément ce que vous voulez aborder…" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingOpen(false)}>Annuler</Button>
            <Button onClick={submitBooking}>Confirmer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
