import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import Header from "@/components/Header";

const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [mentor, setMentor] = useState<any | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [slotForm, setSlotForm] = useState({ day_of_week: "1", start_time: "10:00", end_time: "11:00" });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { navigate("/auth"); return; }
      setUserId(data.user.id);
      const { data: m } = await supabase.from("mentors").select("*").eq("user_id", data.user.id).maybeSingle();
      setMentor(m);
      if (m) {
        const [{ data: s }, { data: a }] = await Promise.all([
          supabase.from("mentor_sessions").select("*").eq("mentor_id", m.id).order("scheduled_at", { ascending: false }),
          supabase.from("mentor_availability").select("*").eq("mentor_id", m.id),
        ]);
        setSessions(s || []);
        setAvailability(a || []);
      }
    });
  }, [navigate]);

  async function createProfile() {
    if (!userId) return;
    const fullName = (document.getElementById("mp-name") as HTMLInputElement)?.value || "";
    const bio = (document.getElementById("mp-bio") as HTMLTextAreaElement)?.value || "";
    if (!fullName) { toast.error("Nom requis"); return; }
    const { data, error } = await supabase.from("mentors").insert({
      user_id: userId, full_name: fullName, bio, country_code: "TN",
    }).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Profil mentor créé !");
    setMentor(data);
  }

  async function updateSessionStatus(s: any, status: string) {
    await supabase.from("mentor_sessions").update({ status }).eq("id", s.id);
    setSessions(sessions.map(x => x.id === s.id ? { ...x, status } : x));
    toast.success("Statut mis à jour");
  }

  async function addSlot() {
    if (!mentor) return;
    const { error, data } = await supabase.from("mentor_availability").insert({
      mentor_id: mentor.id,
      day_of_week: parseInt(slotForm.day_of_week),
      start_time: slotForm.start_time,
      end_time: slotForm.end_time,
      is_recurring: true,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setAvailability([...availability, data]);
    toast.success("Créneau ajouté");
  }

  async function deleteSlot(id: string) {
    await supabase.from("mentor_availability").delete().eq("id", id);
    setAvailability(availability.filter(a => a.id !== id));
  }

  async function submitReview() {
    if (!reviewing || !userId) return;
    const { error } = await supabase.from("mentor_reviews").insert({
      session_id: reviewing.id,
      reviewer_id: userId,
      reviewee_id: reviewing.startup_user_id,
      rating, feedback, reviewer_role: "mentor",
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Avis publié");
    setReviewing(null);
  }

  if (!mentor) return (
    <div className="min-h-screen"><Header />
      <div className="container py-8 max-w-xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-3">Devenir Mentor</h1>
          <p className="text-sm text-muted-foreground mb-4">Créez votre profil mentor pour commencer à accompagner des startups.</p>
          <div className="space-y-3">
            <div><Label>Nom complet</Label><Input id="mp-name" /></div>
            <div><Label>Bio</Label><Textarea id="mp-bio" rows={4} placeholder="Parcours, domaines d'expertise…" /></div>
            <Button onClick={createProfile}>Créer mon profil mentor</Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const upcoming = sessions.filter(s => new Date(s.scheduled_at) > new Date() && s.status !== "cancelled");
  const past = sessions.filter(s => new Date(s.scheduled_at) <= new Date() || s.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Mentor</h1>
            <p className="text-muted-foreground">{mentor.full_name} · ⭐ {mentor.avg_rating?.toFixed(1) || "—"} ({mentor.reviews_count} avis)</p>
          </div>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="history">Historique ({past.length})</TabsTrigger>
            <TabsTrigger value="availability">Mes disponibilités</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3">
            {upcoming.length === 0 ? <p className="text-muted-foreground">Aucune session à venir.</p> :
              upcoming.map(s => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{format(new Date(s.scheduled_at), "EEEE dd MMM yyyy 'à' HH:mm")}</p>
                      <p className="text-sm text-muted-foreground">{s.session_type} · {s.duration_minutes} min</p>
                      <p className="text-sm mt-2"><strong>Agenda :</strong> {s.agenda}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge>{s.status}</Badge>
                      {s.status === "pending" && <Button size="sm" onClick={() => updateSessionStatus(s, "confirmed")}>Confirmer</Button>}
                      {s.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => updateSessionStatus(s, "completed")}>Marquer complétée</Button>}
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s, "cancelled")}>Annuler</Button>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {past.map(s => (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{format(new Date(s.scheduled_at), "dd/MM/yyyy HH:mm")}</p>
                    <Badge variant="outline">{s.status}</Badge>
                    <Textarea className="mt-2 text-sm" placeholder="Notes de la session (privées)" defaultValue={s.mentor_notes || ""}
                      onBlur={(e) => supabase.from("mentor_sessions").update({ mentor_notes: e.target.value }).eq("id", s.id)} />
                  </div>
                  {s.status === "completed" && (
                    <Button size="sm" variant="outline" onClick={() => { setReviewing(s); setRating(5); setFeedback(""); }}><Star className="w-3 h-3 mr-1" /> Évaluer</Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Ajouter un créneau récurrent</h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>Jour</Label>
                  <Select value={slotForm.day_of_week} onValueChange={(v) => setSlotForm({ ...slotForm, day_of_week: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Début</Label><Input type="time" value={slotForm.start_time} onChange={(e) => setSlotForm({ ...slotForm, start_time: e.target.value })} /></div>
                <div><Label>Fin</Label><Input type="time" value={slotForm.end_time} onChange={(e) => setSlotForm({ ...slotForm, end_time: e.target.value })} /></div>
                <div className="flex items-end"><Button onClick={addSlot} className="w-full">Ajouter</Button></div>
              </div>
            </Card>
            <div className="space-y-2">
              {availability.map(a => (
                <Card key={a.id} className="p-3 flex items-center justify-between">
                  <span>{DAYS[a.day_of_week]} · {a.start_time.slice(0,5)} → {a.end_time.slice(0,5)}</span>
                  <Button size="sm" variant="ghost" onClick={() => deleteSlot(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Évaluer la startup</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Note</Label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)}><Star className={`w-7 h-7 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} /></button>
                ))}
              </div>
            </div>
            <div><Label>Commentaire</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} /></div>
          </div>
          <DialogFooter><Button onClick={submitReview}>Publier</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
