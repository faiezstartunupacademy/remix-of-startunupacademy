import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, Award } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const SKILL_KEYS = ["technique", "business", "design", "marketing", "leadership", "communication", "analytics", "resilience"] as const;
const SKILL_LABELS: Record<string, string> = {
  technique: "Technique", business: "Business", design: "Design/UX",
  marketing: "Marketing", leadership: "Leadership", communication: "Communication",
  analytics: "Analytics", resilience: "Résilience"
};
const ROLES = ["CEO", "CTO", "CMO", "CFO", "CPO", "Developer", "Designer", "Growth Hacker", "Data Analyst", "Autre"];

type TeamMember = {
  id: string; project_id: string; name: string; role: string;
  skills: Record<string, number>; availability_percent: number; experience_years: number;
};

const MvpTeamEvaluation = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Developer", availability_percent: 100, experience_years: 0, skills: Object.fromEntries(SKILL_KEYS.map(k => [k, 50])) });

  useEffect(() => { loadMembers(); }, [projectId]);

  const loadMembers = async () => {
    const { data } = await supabase.from("mvp_team_members" as any).select("*").eq("project_id", projectId);
    if (data) setMembers(data as any[]);
  };

  const addMember = async () => {
    if (!form.name) return;
    const { error } = await supabase.from("mvp_team_members" as any).insert({ ...form, project_id: projectId } as any);
    if (!error) { loadMembers(); setShowForm(false); setForm({ name: "", role: "Developer", availability_percent: 100, experience_years: 0, skills: Object.fromEntries(SKILL_KEYS.map(k => [k, 50])) }); toast({ title: "Membre ajouté" }); }
  };

  const deleteMember = async (id: string) => {
    await supabase.from("mvp_team_members" as any).delete().eq("id", id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const teamRadarData = useMemo(() => {
    if (!members.length) return [];
    return SKILL_KEYS.map(key => {
      const avg = members.reduce((sum, m) => sum + ((m.skills as any)?.[key] || 0), 0) / members.length;
      return { skill: SKILL_LABELS[key], value: Math.round(avg), fullMark: 100 };
    });
  }, [members]);

  const adequacyScore = useMemo(() => {
    if (!members.length) return 0;
    const hasLeader = members.some(m => ["CEO", "CPO", "Leadership"].includes(m.role));
    const hasTech = members.some(m => ["CTO", "Developer"].includes(m.role));
    const hasBiz = members.some(m => ["CMO", "CFO", "Growth Hacker"].includes(m.role));
    const avgSkill = teamRadarData.reduce((s, d) => s + d.value, 0) / (teamRadarData.length || 1);
    const diversityScore = (hasLeader ? 25 : 0) + (hasTech ? 25 : 0) + (hasBiz ? 25 : 0);
    const avgAvail = members.reduce((s, m) => s + m.availability_percent, 0) / members.length;
    return Math.min(100, Math.round(diversityScore + avgSkill * 0.25 + (avgAvail / 100) * 25));
  }, [members, teamRadarData]);

  const scoreColor = adequacyScore >= 70 ? "text-emerald-500" : adequacyScore >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-6">
      {/* Score global */}
      {members.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center">
              <Award className={`h-10 w-10 mx-auto mb-2 ${scoreColor}`} />
              <p className={`text-4xl font-black ${scoreColor}`}>{adequacyScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">Score d'adéquation</p>
              <div className="mt-3 space-y-1 text-xs text-left">
                <div className="flex justify-between"><span>Membres</span><Badge variant="secondary">{members.length}</Badge></div>
                <div className="flex justify-between"><span>Exp. moy.</span><Badge variant="secondary">{Math.round(members.reduce((s,m)=>s+m.experience_years,0)/members.length)} ans</Badge></div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-0"><CardTitle className="text-sm">Radar Compétences Équipe</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={teamRadarData}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                  <Radar name="Équipe" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Members list */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Équipe ({members.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><Label>Nom</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div>
                <Label>Rôle</Label>
                <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Disponibilité %</Label><Input type="number" value={form.availability_percent} onChange={e => setForm(p => ({ ...p, availability_percent: Number(e.target.value) }))} /></div>
              <div><Label>Exp. (ans)</Label><Input type="number" value={form.experience_years} onChange={e => setForm(p => ({ ...p, experience_years: Number(e.target.value) }))} /></div>
            </div>
            <div>
              <Label className="mb-2 block">Compétences</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SKILL_KEYS.map(key => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs"><span>{SKILL_LABELS[key]}</span><span className="font-bold">{form.skills[key]}</span></div>
                    <Slider value={[form.skills[key]]} max={100} step={5} onValueChange={([v]) => setForm(p => ({ ...p, skills: { ...p.skills, [key]: v } }))} />
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={addMember}>Enregistrer</Button>
          </CardContent>
        </Card>
      )}

      {members.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {members.map(m => (
            <Card key={m.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{m.role}</Badge>
                      <Badge variant="outline">{m.availability_percent}% dispo</Badge>
                      <Badge variant="outline">{m.experience_years} ans</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMember(m.id)} className="text-destructive h-7 w-7"><Trash2 className="h-3 w-3" /></Button>
                </div>
                <div className="grid grid-cols-4 gap-1 mt-3">
                  {SKILL_KEYS.map(key => (
                    <div key={key} className="text-center">
                      <div className="text-[10px] text-muted-foreground">{SKILL_LABELS[key]}</div>
                      <div className="text-xs font-bold">{(m.skills as any)?.[key] || 0}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {members.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Ajoutez les membres de votre équipe pour évaluer l'adéquation.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MvpTeamEvaluation;
