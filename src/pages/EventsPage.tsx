import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, MapPin, Plus, Video, Users as UsersIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Event {
  id: string; user_id: string; title: string; description: string | null;
  event_date: string; end_date: string | null; location: string | null;
  event_type: string; meeting_url: string | null; capacity: number | null;
  rsvp_count: number; tags: string[] | null; cover_image: string | null;
  is_published: boolean;
  i_rsvped?: boolean;
}

const EVENT_TYPES = [
  { id: "online", label: "En ligne", icon: Video },
  { id: "onsite", label: "Présentiel", icon: MapPin },
  { id: "hybrid", label: "Hybride", icon: UsersIcon },
];

const EventsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", location: "", event_type: "online",
    meeting_url: "", capacity: "" as string | number,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("community_events").select("*").order("event_date", { ascending: true });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); setLoading(false); return; }
    let rsvps: string[] = [];
    if (user) {
      const { data: r } = await supabase.from("community_event_rsvps").select("event_id").eq("user_id", user.id);
      rsvps = (r || []).map((x: any) => x.event_id);
    }
    setEvents((data || []).map((e: any) => ({ ...e, i_rsvped: rsvps.includes(e.id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const submit = async () => {
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (!form.title || !form.event_date) return toast({ title: "Titre et date requis", variant: "destructive" });
    setSaving(true);
    const { error } = await supabase.from("community_events").insert({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      event_date: form.event_date,
      location: form.location || null,
      event_type: form.event_type,
      meeting_url: form.meeting_url || null,
      capacity: form.capacity ? Number(form.capacity) : null,
    });
    setSaving(false);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    toast({ title: "Événement créé 📅" });
    setOpen(false);
    setForm({ title: "", description: "", event_date: "", location: "", event_type: "online", meeting_url: "", capacity: "" });
    load();
  };

  const toggleRsvp = async (ev: Event) => {
    if (!user) return toast({ title: "Connexion requise", variant: "destructive" });
    if (ev.i_rsvped) {
      await supabase.from("community_event_rsvps").delete().eq("event_id", ev.id).eq("user_id", user.id);
    } else {
      if (ev.capacity && ev.rsvp_count >= ev.capacity) return toast({ title: "Complet", variant: "destructive" });
      await supabase.from("community_event_rsvps").insert({ event_id: ev.id, user_id: user.id });
    }
    load();
  };

  const now = Date.now();
  const filtered = events.filter(e => filter === "upcoming" ? new Date(e.event_date).getTime() >= now : new Date(e.event_date).getTime() < now);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Calendar className="h-7 w-7 text-primary" /> Événements</h1>
              <p className="text-muted-foreground">Pitch days, meetups, masterclasses et plus encore.</p>
            </div>
            {user && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Créer un événement</Button></DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Nouvel événement</DialogTitle></DialogHeader>
                  <div className="space-y-3 py-4">
                    <div><Label>Titre *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                    <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Date & heure *</Label><Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
                      <div><Label>Capacité</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
                    </div>
                    <div><Label>Type</Label>
                      <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Lieu</Label><Input placeholder="Tunis, Sousse..." value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                    <div><Label>Lien Meet/Zoom</Label><Input value={form.meeting_url} onChange={(e) => setForm({ ...form, meeting_url: e.target.value })} /></div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                    <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            <Button variant={filter === "upcoming" ? "default" : "outline"} onClick={() => setFilter("upcoming")}>À venir</Button>
            <Button variant={filter === "past" ? "default" : "outline"} onClick={() => setFilter("past")}>Passés</Button>
          </div>

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.length === 0 && <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">Aucun événement {filter === "upcoming" ? "à venir" : "passé"}.</CardContent></Card>}
              {filtered.map(ev => {
                const t = EVENT_TYPES.find(x => x.id === ev.event_type);
                const Icon = t?.icon || Calendar;
                const date = new Date(ev.event_date);
                const isFull = ev.capacity && ev.rsvp_count >= ev.capacity;
                return (
                  <Card key={ev.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ev.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Icon className="h-3 w-3" /> {t?.label} {ev.location && `• ${ev.location}`}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{ev.rsvp_count}{ev.capacity ? `/${ev.capacity}` : ""}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="font-semibold text-primary">{date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>
                        <div className="text-muted-foreground">{date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                      {ev.description && <p className="text-sm text-muted-foreground line-clamp-3">{ev.description}</p>}
                      <div className="flex gap-2">
                        <Button size="sm" variant={ev.i_rsvped ? "default" : "outline"} className="flex-1" onClick={() => toggleRsvp(ev)} disabled={!ev.i_rsvped && !!isFull}>
                          {ev.i_rsvped ? <><Check className="h-4 w-4 mr-1" /> Inscrit</> : isFull ? "Complet" : "Je participe"}
                        </Button>
                        {ev.meeting_url && ev.i_rsvped && <Button size="sm" variant="ghost" asChild><a href={ev.meeting_url} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4" /></a></Button>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
