import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserCheck, Code2, Calendar, RotateCcw, Eye, ListChecks,
  Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight,
  Target, Clock, Zap, Award, BarChart3, AlertTriangle, CheckCircle2,
  Loader2, Network, TestTube2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

// ─── Types ───────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  role: "product_owner" | "scrum_master" | "developer";
  skills: string[];
  availability: number; // percentage
}

interface Resource {
  id: string;
  name: string;
  type: "humaine" | "technique" | "financière" | "externe";
  description: string;
  allocated: boolean;
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: "must" | "should" | "could" | "wont";
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  sprintId: string | null;
  resources: Resource[];
  competencies: { name: string; level: number }[];
  linkedTestIds: string[];
  linkedTechTestIds: string[];
  completionPercent: number;
}

interface Sprint {
  id: string;
  number: number;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "review" | "retrospective" | "done";
  velocity: number;
}

interface ScrumEvent {
  id: string;
  type: "planning" | "daily" | "review" | "retrospective";
  sprintId: string;
  date: string;
  notes: string;
  decisions: string[];
  actionItems: string[];
}

interface ScrumBoardProps {
  projectId: string;
  projectName: string;
  sector: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const ROLE_CONFIG = {
  product_owner: { label: "Product Owner", icon: UserCheck, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", description: "Maximise la valeur du produit, gère le backlog" },
  scrum_master: { label: "Scrum Master", icon: Users, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", description: "Facilite le processus Scrum, élimine les obstacles" },
  developer: { label: "Développeur", icon: Code2, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", description: "Construit les incréments du produit" },
};

const PRIORITY_CONFIG = {
  must: { label: "Must Have", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  should: { label: "Should Have", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  could: { label: "Could Have", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  wont: { label: "Won't Have", color: "bg-muted text-muted-foreground" },
};

const STATUS_COLUMNS = [
  { key: "backlog", label: "Backlog", icon: ListChecks },
  { key: "todo", label: "À Faire", icon: Target },
  { key: "in_progress", label: "En Cours", icon: Zap },
  { key: "review", label: "Review", icon: Eye },
  { key: "done", label: "Terminé", icon: CheckCircle2 },
];

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

const COMPETENCY_LIST = [
  "Frontend (React/TS)", "Backend (Node/Python)", "UI/UX Design", "Base de données",
  "DevOps/CI-CD", "Tests automatisés", "Marketing digital", "Analyse de données",
  "Sécurité", "Architecture logicielle", "Mobile (React Native)", "IA/ML",
  "Gestion de projet", "Communication", "Négociation", "Recherche utilisateur",
];

// ─── Component ───────────────────────────────────────────────────────

const ScrumBoard = ({ projectId, projectName, sector }: ScrumBoardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("board");

  // State
  const [team, setTeam] = useState<TeamMember[]>([
    { id: "po-1", name: "", role: "product_owner", skills: ["Gestion de projet", "Communication"], availability: 100 },
    { id: "sm-1", name: "", role: "scrum_master", skills: ["Facilitation", "Coaching"], availability: 100 },
  ]);
  const [backlog, setBacklog] = useState<UserStory[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [events, setEvents] = useState<ScrumEvent[]>([]);
  const [editingStory, setEditingStory] = useState<string | null>(null);
  const [newStoryDraft, setNewStoryDraft] = useState({ title: "", description: "", points: 3, priority: "should" as const });

  // ─── Team ─────────────────────────────────────────────────────────

  const addTeamMember = (role: TeamMember["role"]) => {
    setTeam(prev => [...prev, {
      id: `${role}-${Date.now()}`,
      name: "",
      role,
      skills: [],
      availability: 100,
    }]);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  // ─── User Stories ─────────────────────────────────────────────────

  const addUserStory = () => {
    if (!newStoryDraft.title.trim()) return;
    const story: UserStory = {
      id: `us-${Date.now()}`,
      title: newStoryDraft.title,
      description: newStoryDraft.description,
      acceptanceCriteria: [],
      storyPoints: newStoryDraft.points,
      priority: newStoryDraft.priority,
      status: "backlog",
      sprintId: null,
      resources: [],
      competencies: [],
      linkedTestIds: [],
      linkedTechTestIds: [],
      completionPercent: 0,
    };
    setBacklog(prev => [...prev, story]);
    setNewStoryDraft({ title: "", description: "", points: 3, priority: "should" });
    toast({ title: "User Story ajoutée au backlog" });
  };

  const updateStory = (id: string, updates: Partial<UserStory>) => {
    setBacklog(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStory = (id: string) => {
    setBacklog(prev => prev.filter(s => s.id !== id));
  };

  const moveStory = (id: string, newStatus: UserStory["status"]) => {
    updateStory(id, {
      status: newStatus,
      completionPercent: newStatus === "done" ? 100 : newStatus === "review" ? 80 : newStatus === "in_progress" ? 40 : newStatus === "todo" ? 10 : 0,
    });
  };

  // ─── Sprints ──────────────────────────────────────────────────────

  const createSprint = () => {
    const num = sprints.length + 1;
    const start = new Date();
    const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    setSprints(prev => [...prev, {
      id: `sprint-${Date.now()}`,
      number: num,
      goal: "",
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      status: "planning",
      velocity: 0,
    }]);
  };

  const updateSprint = (id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // ─── Events ───────────────────────────────────────────────────────

  const addEvent = (sprintId: string, type: ScrumEvent["type"]) => {
    setEvents(prev => [...prev, {
      id: `event-${Date.now()}`,
      type,
      sprintId,
      date: new Date().toISOString().split("T")[0],
      notes: "",
      decisions: [],
      actionItems: [],
    }]);
  };

  // ─── Computed ─────────────────────────────────────────────────────

  const totalPoints = backlog.reduce((sum, s) => sum + s.storyPoints, 0);
  const donePoints = backlog.filter(s => s.status === "done").reduce((sum, s) => sum + s.storyPoints, 0);
  const velocity = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  const burndown = STATUS_COLUMNS.map(col => ({
    status: col.label,
    count: backlog.filter(s => s.status === col.key).length,
    points: backlog.filter(s => s.status === col.key).reduce((sum, s) => sum + s.storyPoints, 0),
  }));

  // ─── Resource helpers ─────────────────────────────────────────────

  const addResource = (storyId: string) => {
    updateStory(storyId, {
      resources: [...(backlog.find(s => s.id === storyId)?.resources || []), {
        id: `res-${Date.now()}`,
        name: "",
        type: "humaine",
        description: "",
        allocated: false,
      }],
    });
  };

  const addCompetency = (storyId: string, name: string) => {
    const story = backlog.find(s => s.id === storyId);
    if (!story || story.competencies.find(c => c.name === name)) return;
    updateStory(storyId, {
      competencies: [...story.competencies, { name, level: 50 }],
    });
  };

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "User Stories", value: backlog.length, icon: ListChecks, color: "text-blue-500" },
          { label: "Story Points", value: totalPoints, icon: Target, color: "text-amber-500" },
          { label: "Points Terminés", value: donePoints, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Sprints", value: sprints.length, icon: RotateCcw, color: "text-purple-500" },
          { label: "Vélocité", value: `${velocity}%`, icon: Zap, color: "text-rose-500" },
        ].map(stat => (
          <Card key={stat.label} className="p-3">
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="board" className="gap-1"><ListChecks className="h-3.5 w-3.5" />Board</TabsTrigger>
          <TabsTrigger value="backlog" className="gap-1"><Target className="h-3.5 w-3.5" />Backlog</TabsTrigger>
          <TabsTrigger value="team" className="gap-1"><Users className="h-3.5 w-3.5" />Équipe</TabsTrigger>
          <TabsTrigger value="sprints" className="gap-1"><RotateCcw className="h-3.5 w-3.5" />Sprints</TabsTrigger>
          <TabsTrigger value="events" className="gap-1"><Calendar className="h-3.5 w-3.5" />Events</TabsTrigger>
        </TabsList>

        {/* ─── Kanban Board ─────────────────────────────────────── */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {STATUS_COLUMNS.map(col => (
              <div key={col.key} className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <col.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{col.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {backlog.filter(s => s.status === col.key).length}
                  </Badge>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {backlog.filter(s => s.status === col.key).map(story => (
                    <motion.div key={story.id} layout>
                      <Card className="p-3 cursor-pointer hover:border-primary/50 transition-all text-sm">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-medium text-xs leading-tight">{story.title}</p>
                          <Badge className={`text-[10px] px-1 ${PRIORITY_CONFIG[story.priority].color}`}>
                            {story.storyPoints}pt
                          </Badge>
                        </div>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${PRIORITY_CONFIG[story.priority].color}`}>
                            {PRIORITY_CONFIG[story.priority].label}
                          </Badge>
                          {story.linkedTestIds.length > 0 && (
                            <Badge variant="outline" className="text-[10px] gap-0.5">
                              <TestTube2 className="h-2.5 w-2.5" />{story.linkedTestIds.length}
                            </Badge>
                          )}
                          {story.linkedTechTestIds.length > 0 && (
                            <Badge variant="outline" className="text-[10px] gap-0.5">
                              <Network className="h-2.5 w-2.5" />{story.linkedTechTestIds.length}
                            </Badge>
                          )}
                        </div>
                        <Progress value={story.completionPercent} className="h-1 mt-2" />
                        {/* Move buttons */}
                        <div className="flex gap-1 mt-2">
                          {STATUS_COLUMNS.filter(c => c.key !== col.key).slice(0, 2).map(target => (
                            <Button key={target.key} variant="ghost" size="sm" className="h-5 text-[10px] px-1"
                              onClick={() => moveStory(story.id, target.key as UserStory["status"])}>
                              → {target.label}
                            </Button>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── Backlog ──────────────────────────────────────────── */}
        <TabsContent value="backlog">
          <div className="space-y-4">
            {/* Add new story */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> Nouvelle User Story</h4>
              <div className="grid md:grid-cols-4 gap-3">
                <Input placeholder="En tant que... je veux... pour..." value={newStoryDraft.title}
                  onChange={e => setNewStoryDraft(p => ({ ...p, title: e.target.value }))} className="md:col-span-2" />
                <Select value={String(newStoryDraft.points)} onValueChange={v => setNewStoryDraft(p => ({ ...p, points: Number(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Points" /></SelectTrigger>
                  <SelectContent>
                    {FIBONACCI.map(p => <SelectItem key={p} value={String(p)}>{p} pts</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={newStoryDraft.priority} onValueChange={(v: any) => setNewStoryDraft(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Description détaillée..." className="mt-2" value={newStoryDraft.description}
                onChange={e => setNewStoryDraft(p => ({ ...p, description: e.target.value }))} />
              <Button onClick={addUserStory} className="mt-2 gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
            </Card>

            {/* Burndown summary */}
            <div className="grid grid-cols-5 gap-2">
              {burndown.map(b => (
                <div key={b.status} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">{b.status}</p>
                  <p className="text-lg font-bold">{b.count}</p>
                  <p className="text-xs text-muted-foreground">{b.points} pts</p>
                </div>
              ))}
            </div>

            {/* Story list with details */}
            <Accordion type="multiple" className="space-y-2">
              {backlog.map(story => (
                <AccordionItem key={story.id} value={story.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <Badge className={`text-xs ${PRIORITY_CONFIG[story.priority].color}`}>
                        {story.storyPoints} pts
                      </Badge>
                      <span className="font-medium text-sm">{story.title}</span>
                      <Badge variant="outline" className="ml-auto text-xs">{story.status}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    {story.description && <p className="text-sm text-muted-foreground">{story.description}</p>}

                    {/* Resources */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold flex items-center gap-1"><Award className="h-4 w-4 text-primary" /> Ressources</h5>
                        <Button variant="outline" size="sm" onClick={() => addResource(story.id)} className="h-7 text-xs gap-1">
                          <Plus className="h-3 w-3" /> Ajouter
                        </Button>
                      </div>
                      {story.resources.map((res, i) => (
                        <div key={res.id} className="grid grid-cols-4 gap-2 mb-2">
                          <Input placeholder="Nom" value={res.name} className="h-8 text-xs"
                            onChange={e => {
                              const updated = [...story.resources];
                              updated[i] = { ...res, name: e.target.value };
                              updateStory(story.id, { resources: updated });
                            }} />
                          <Select value={res.type} onValueChange={v => {
                            const updated = [...story.resources];
                            updated[i] = { ...res, type: v as Resource["type"] };
                            updateStory(story.id, { resources: updated });
                          }}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="humaine">Humaine</SelectItem>
                              <SelectItem value="technique">Technique</SelectItem>
                              <SelectItem value="financière">Financière</SelectItem>
                              <SelectItem value="externe">Externe</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Description" value={res.description} className="h-8 text-xs"
                            onChange={e => {
                              const updated = [...story.resources];
                              updated[i] = { ...res, description: e.target.value };
                              updateStory(story.id, { resources: updated });
                            }} />
                          <Button variant="ghost" size="sm" className="h-8 text-destructive"
                            onClick={() => updateStory(story.id, { resources: story.resources.filter((_, j) => j !== i) })}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Competencies */}
                    <div>
                      <h5 className="text-sm font-semibold flex items-center gap-1 mb-2"><BarChart3 className="h-4 w-4 text-primary" /> Compétences requises</h5>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {COMPETENCY_LIST.filter(c => !story.competencies.find(sc => sc.name === c)).map(c => (
                          <Badge key={c} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10"
                            onClick={() => addCompetency(story.id, c)}>
                            + {c}
                          </Badge>
                        ))}
                      </div>
                      {story.competencies.map((comp, i) => (
                        <div key={comp.name} className="flex items-center gap-2 mb-1">
                          <span className="text-xs w-40 truncate">{comp.name}</span>
                          <Progress value={comp.level} className="h-2 flex-1" />
                          <Input type="number" min={0} max={100} value={comp.level} className="h-7 w-16 text-xs"
                            onChange={e => {
                              const updated = [...story.competencies];
                              updated[i] = { ...comp, level: Number(e.target.value) };
                              updateStory(story.id, { competencies: updated });
                            }} />
                          <span className="text-xs text-muted-foreground w-8">{comp.level}%</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive"
                            onClick={() => updateStory(story.id, { competencies: story.competencies.filter((_, j) => j !== i) })}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Link to tests */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold flex items-center gap-1 mb-1">
                          <TestTube2 className="h-4 w-4 text-amber-500" /> Tests Commerciaux liés
                        </h5>
                        <Input placeholder="IDs des tests (séparés par ,)" className="h-8 text-xs"
                          value={story.linkedTestIds.join(",")}
                          onChange={e => updateStory(story.id, { linkedTestIds: e.target.value.split(",").filter(Boolean) })} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold flex items-center gap-1 mb-1">
                          <Network className="h-4 w-4 text-blue-500" /> Tests Techniques liés
                        </h5>
                        <Input placeholder="IDs des tests (séparés par ,)" className="h-8 text-xs"
                          value={story.linkedTechTestIds.join(",")}
                          onChange={e => updateStory(story.id, { linkedTechTestIds: e.target.value.split(",").filter(Boolean) })} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Select value={story.status} onValueChange={v => moveStory(story.id, v as UserStory["status"])}>
                        <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_COLUMNS.map(c => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="destructive" size="sm" className="h-8 text-xs gap-1" onClick={() => removeStory(story.id)}>
                        <Trash2 className="h-3 w-3" /> Supprimer
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* ─── Team ─────────────────────────────────────────────── */}
        <TabsContent value="team">
          <div className="space-y-4">
            {(["product_owner", "scrum_master", "developer"] as const).map(role => {
              const config = ROLE_CONFIG[role];
              const members = team.filter(m => m.role === role);
              return (
                <Card key={role}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <config.icon className="h-5 w-5" />
                        <CardTitle className="text-base">{config.label}</CardTitle>
                        <Badge variant="secondary">{members.length}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => addTeamMember(role)} className="gap-1">
                        <Plus className="h-3 w-3" /> Ajouter
                      </Button>
                    </div>
                    <CardDescription className="text-xs">{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                          <config.icon className="h-4 w-4" />
                        </div>
                        <Input placeholder="Nom du membre" value={member.name} className="h-8 flex-1"
                          onChange={e => updateMember(member.id, { name: e.target.value })} />
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Dispo:</span>
                          <Input type="number" min={0} max={100} value={member.availability} className="h-8 w-16 text-xs"
                            onChange={e => updateMember(member.id, { availability: Number(e.target.value) })} />
                          <span className="text-xs">%</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeMember(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── Sprints ──────────────────────────────────────────── */}
        <TabsContent value="sprints">
          <div className="space-y-4">
            <Button onClick={createSprint} className="gap-2"><Plus className="h-4 w-4" /> Nouveau Sprint</Button>
            {sprints.map(sprint => (
              <Card key={sprint.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Sprint {sprint.number}</CardTitle>
                    <Select value={sprint.status} onValueChange={v => updateSprint(sprint.id, { status: v as Sprint["status"] })}>
                      <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="retrospective">Retrospective</SelectItem>
                        <SelectItem value="done">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Objectif du sprint" value={sprint.goal}
                    onChange={e => updateSprint(sprint.id, { goal: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Début</label>
                      <Input type="date" value={sprint.startDate}
                        onChange={e => updateSprint(sprint.id, { startDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Fin</label>
                      <Input type="date" value={sprint.endDate}
                        onChange={e => updateSprint(sprint.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold mb-2">Stories assignées à ce sprint</h5>
                    <div className="space-y-1">
                      {backlog.filter(s => s.sprintId === sprint.id).map(story => (
                        <div key={story.id} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                          <Badge className={`text-[10px] ${PRIORITY_CONFIG[story.priority].color}`}>{story.storyPoints}pt</Badge>
                          <span>{story.title}</span>
                          <Badge variant="outline" className="text-[10px] ml-auto">{story.status}</Badge>
                        </div>
                      ))}
                      {backlog.filter(s => s.sprintId === sprint.id).length === 0 && (
                        <p className="text-xs text-muted-foreground">Aucune story assignée. Assignez depuis le backlog.</p>
                      )}
                    </div>
                  </div>
                  {/* Assign stories */}
                  <Select onValueChange={v => updateStory(v, { sprintId: sprint.id })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Assigner une story..." /></SelectTrigger>
                    <SelectContent>
                      {backlog.filter(s => !s.sprintId).map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.title} ({s.storyPoints}pt)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── Scrum Events ─────────────────────────────────────── */}
        <TabsContent value="events">
          <div className="space-y-4">
            {sprints.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Créez d'abord un Sprint pour planifier les événements Scrum.</p>
              </Card>
            ) : (
              sprints.map(sprint => (
                <Card key={sprint.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Sprint {sprint.number} — Événements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {(["planning", "daily", "review", "retrospective"] as const).map(type => (
                        <Button key={type} variant="outline" size="sm" className="gap-1 capitalize"
                          onClick={() => addEvent(sprint.id, type)}>
                          <Plus className="h-3 w-3" /> {type === "planning" ? "Sprint Planning" : type === "daily" ? "Daily Scrum" : type === "review" ? "Sprint Review" : "Rétrospective"}
                        </Button>
                      ))}
                    </div>
                    {events.filter(e => e.sprintId === sprint.id).map(event => (
                      <div key={event.id} className="p-3 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {event.type === "planning" ? "📋 Planning" : event.type === "daily" ? "☀️ Daily" : event.type === "review" ? "👁️ Review" : "🔄 Rétro"}
                          </Badge>
                          <Input type="date" value={event.date} className="h-7 w-36 text-xs"
                            onChange={e => setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, date: e.target.value } : ev))} />
                        </div>
                        <Textarea placeholder="Notes et décisions..." className="text-xs" value={event.notes}
                          onChange={e => setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, notes: e.target.value } : ev))} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScrumBoard;
