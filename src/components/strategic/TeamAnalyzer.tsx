import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Trash2, PieChart, Code, Briefcase, Palette,
  TrendingUp, Shield, Settings, ChevronDown, Info, DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SKILL_CATEGORIES = [
  { key: "tech", label: "Technique", icon: Code, color: "text-blue-500" },
  { key: "business", label: "Commercial", icon: Briefcase, color: "text-green-500" },
  { key: "design", label: "Design/UX", icon: Palette, color: "text-purple-500" },
  { key: "marketing", label: "Marketing", icon: TrendingUp, color: "text-amber-500" },
  { key: "legal", label: "Juridique", icon: Shield, color: "text-red-500" },
  { key: "ops", label: "Opérations", icon: Settings, color: "text-teal-500" },
];

const ROLES = [
  { value: "founder", label: "Fondateur", multiplier: 2.0, description: "Initiateur du projet, vision stratégique" },
  { value: "cofounder", label: "Co-fondateur", multiplier: 1.5, description: "Partenaire clé, engagement total" },
  { value: "advisor", label: "Advisor", multiplier: 0.3, description: "Conseil stratégique, réseau, mentoring" },
];

const REQUIREMENT_PRESETS: Record<string, Record<string, number>> = {
  saas: { tech: 9, business: 7, design: 6, marketing: 8, legal: 4, ops: 5 },
  marketplace: { tech: 7, business: 9, design: 7, marketing: 9, legal: 6, ops: 7 },
  deeptech: { tech: 10, business: 5, design: 3, marketing: 4, legal: 8, ops: 4 },
  ecommerce: { tech: 5, business: 8, design: 7, marketing: 10, legal: 5, ops: 7 },
  fintech: { tech: 9, business: 8, design: 6, marketing: 6, legal: 10, ops: 7 },
  healthtech: { tech: 8, business: 6, design: 5, marketing: 5, legal: 9, ops: 6 },
};

// Slicing Pie contribution types with monetary equivalents
const CONTRIBUTION_TYPES = [
  { key: "time", label: "Temps (h/semaine)", unit: "h", hourlyRate: 50 },
  { key: "cash", label: "Cash investi (€)", unit: "€", multiplier: 4 },
  { key: "equipment", label: "Équipement (€)", unit: "€", multiplier: 2 },
  { key: "ip", label: "Propriété Intellectuelle", unit: "score", multiplier: 3 },
  { key: "network", label: "Réseau & Relations", unit: "score", multiplier: 1.5 },
];

type TeamMember = {
  id: string;
  name: string;
  role: string;
  skills: Record<string, number>;
  commitment: number;
  contributions: Record<string, number>;
  equityOverride: number | null;
};

interface TeamAnalyzerProps {
  projectName: string;
}

const TeamAnalyzer = ({ projectName }: TeamAnalyzerProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [requirements, setRequirements] = useState<Record<string, number>>(
    Object.fromEntries(SKILL_CATEGORIES.map(s => [s.key, 5]))
  );
  const [presetType, setPresetType] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("founder");

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers(prev => [...prev, {
      id: crypto.randomUUID(),
      name: newName.trim(),
      role: newRole,
      skills: Object.fromEntries(SKILL_CATEGORIES.map(s => [s.key, 3])),
      commitment: 100,
      contributions: { time: 40, cash: 0, equipment: 0, ip: 0, network: 0 },
      equityOverride: null,
    }]);
    setNewName("");
    setShowAddMember(false);
  };

  const removeMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  const updateSkill = (memberId: string, skill: string, value: number) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, skills: { ...m.skills, [skill]: value } } : m
    ));
  };

  const updateCommitment = (memberId: string, value: number) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, commitment: value } : m));
  };

  const updateContribution = (memberId: string, key: string, value: number) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, contributions: { ...m.contributions, [key]: value } } : m
    ));
  };

  const applyPreset = (type: string) => {
    setPresetType(type);
    if (REQUIREMENT_PRESETS[type]) setRequirements(REQUIREMENT_PRESETS[type]);
  };

  // Compute team aggregate skills
  const teamSkills: Record<string, number> = {};
  SKILL_CATEGORIES.forEach(s => {
    const maxSkill = members.length > 0
      ? Math.max(...members.map(m => m.skills[s.key] * (m.commitment / 100)))
      : 0;
    teamSkills[s.key] = Math.round(maxSkill * 10) / 10;
  });

  // Compute gaps
  const gaps = SKILL_CATEGORIES.map(s => ({
    skill: s.key,
    label: s.label,
    required: requirements[s.key],
    current: teamSkills[s.key],
    gap: Math.max(0, requirements[s.key] - teamSkills[s.key]),
  }));

  const totalGap = gaps.reduce((sum, g) => sum + g.gap, 0);
  const maxPossibleGap = gaps.reduce((sum, g) => sum + g.required, 0);
  const coverageScore = maxPossibleGap > 0 ? Math.round(((maxPossibleGap - totalGap) / maxPossibleGap) * 100) : 0;

  // Slicing Pie equity calculation
  const computeSlicingPie = () => {
    if (members.length === 0) return { equity: {}, slices: {} };

    const slices: Record<string, { total: number; breakdown: Record<string, number> }> = {};
    let grandTotal = 0;

    members.forEach(m => {
      const roleData = ROLES.find(r => r.value === m.role)!;
      const breakdown: Record<string, number> = {};

      // Time contribution (hours * hourly rate * commitment)
      const timeSlice = (m.contributions.time || 0) * 50 * (m.commitment / 100) * roleData.multiplier;
      breakdown.time = timeSlice;

      // Cash (x4 multiplier in Slicing Pie)
      const cashSlice = (m.contributions.cash || 0) * 4;
      breakdown.cash = cashSlice;

      // Equipment (x2)
      const equipSlice = (m.contributions.equipment || 0) * 2;
      breakdown.equipment = equipSlice;

      // IP (score * 1000 * multiplier)
      const ipSlice = (m.contributions.ip || 0) * 1000 * 3;
      breakdown.ip = ipSlice;

      // Network (score * 500 * multiplier)
      const networkSlice = (m.contributions.network || 0) * 500 * 1.5;
      breakdown.network = networkSlice;

      // Skill bonus
      const skillBonus = Object.values(m.skills).reduce((a, b) => a + b, 0) * 100 * roleData.multiplier;
      breakdown.skills = skillBonus;

      const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
      slices[m.id] = { total, breakdown };
      grandTotal += total;
    });

    const equity: Record<string, number> = {};
    members.forEach(m => {
      equity[m.id] = m.equityOverride !== null
        ? m.equityOverride
        : grandTotal > 0 ? Math.round((slices[m.id].total / grandTotal) * 1000) / 10 : 0;
    });

    return { equity, slices };
  };

  const { equity, slices } = computeSlicingPie();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Analyseur d'Équipe & Répartition — {projectName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Méthode Slicing Pie — Répartition dynamique basée sur les contributions réelles de chaque membre.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Requirement Presets */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">📋 Exigences du projet (par type de startup)</h4>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(REQUIREMENT_PRESETS).map(type => (
                <Button key={type} variant={presetType === type ? "default" : "outline"} size="sm"
                  onClick={() => applyPreset(type)} className="capitalize">
                  {type}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SKILL_CATEGORIES.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.key} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                      {s.label}: {requirements[s.key]}/10
                    </div>
                    <Slider value={[requirements[s.key]]} onValueChange={([v]) => setRequirements(prev => ({ ...prev, [s.key]: v }))}
                      max={10} min={1} step={1} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">👥 Membres de l'équipe ({members.length})</h4>
              <Button size="sm" variant="outline" onClick={() => setShowAddMember(!showAddMember)} className="gap-1">
                <Plus className="h-3 w-3" /> Ajouter un membre
              </Button>
            </div>

            <AnimatePresence>
              {showAddMember && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 p-4 rounded-lg border bg-muted/20">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs font-medium mb-1 block">Nom du membre</label>
                      <Input placeholder="Nom complet" value={newName} onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addMember()} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Rôle</label>
                      <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ROLES.map(r => (
                            <SelectItem key={r.value} value={r.value}>
                              <div className="flex flex-col">
                                <span>{r.label}</span>
                                <span className="text-xs text-muted-foreground">{r.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" onClick={addMember} disabled={!newName.trim()}>Ajouter</Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ROLES.map(r => (
                      <Badge key={r.value} variant="outline" className="text-xs">
                        {r.label} — Multiplicateur ×{r.multiplier}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Ajoutez les fondateurs, co-fondateurs et advisors pour analyser les compétences et répartir l'equity.
              </p>
            ) : (
              <div className="space-y-3">
                {members.map(member => {
                  const roleData = ROLES.find(r => r.value === member.role)!;
                  return (
                    <Collapsible key={member.id}>
                      <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{member.name}</span>
                                <Badge variant="outline" className="text-xs">{roleData.label}</Badge>
                                <Badge className="text-xs bg-primary/10 text-primary">{equity[member.id]}%</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>×{roleData.multiplier}</span>
                              <span>|</span>
                              <span>{member.commitment}% temps</span>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                              onClick={e => { e.stopPropagation(); removeMember(member.id); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-3 pb-3 space-y-4 border-t pt-3">
                            {/* Engagement */}
                            <div className="space-y-1">
                              <span className="text-xs font-medium">⏱ Engagement temps ({member.commitment}%)</span>
                              <Slider value={[member.commitment]} onValueChange={([v]) => updateCommitment(member.id, v)}
                                max={100} min={10} step={10} />
                            </div>

                            {/* Contributions (Slicing Pie) */}
                            <div className="space-y-2">
                              <span className="text-xs font-semibold flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> Contributions (Slicing Pie)
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {CONTRIBUTION_TYPES.map(ct => (
                                  <div key={ct.key} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span>{ct.label}</span>
                                      <span className="text-muted-foreground">{member.contributions[ct.key] || 0} {ct.unit}</span>
                                    </div>
                                    <Slider
                                      value={[member.contributions[ct.key] || 0]}
                                      onValueChange={([v]) => updateContribution(member.id, ct.key, v)}
                                      max={ct.key === "time" ? 60 : ct.key === "cash" || ct.key === "equipment" ? 50000 : 10}
                                      min={0}
                                      step={ct.key === "cash" || ct.key === "equipment" ? 500 : 1}
                                      className="h-1.5"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                              <span className="text-xs font-semibold">🎯 Compétences</span>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {SKILL_CATEGORIES.map(s => {
                                  const Icon = s.icon;
                                  return (
                                    <div key={s.key} className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs">
                                        <Icon className={`h-3 w-3 ${s.color}`} />
                                        {s.label}: {member.skills[s.key]}/10
                                      </div>
                                      <Slider value={[member.skills[s.key]]} onValueChange={([v]) => updateSkill(member.id, s.key, v)}
                                        max={10} min={0} step={1} className="h-1.5" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Slice breakdown */}
                            {slices[member.id] && (
                              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-1">
                                <span className="font-semibold">📊 Détail des slices</span>
                                <div className="grid grid-cols-2 gap-1 mt-1">
                                  {Object.entries(slices[member.id].breakdown).map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                      <span className="capitalize text-muted-foreground">{k === "skills" ? "Compétences" : CONTRIBUTION_TYPES.find(c => c.key === k)?.label || k}</span>
                                      <span className="font-mono">{Math.round(v).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between col-span-2 border-t pt-1 font-semibold">
                                    <span>Total Slices</span>
                                    <span className="font-mono">{Math.round(slices[member.id].total).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {members.length > 0 && (
        <>
          {/* Gap Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">📊 Analyse des Gaps (Exigences vs Compétences)</CardTitle>
                <Badge variant={coverageScore >= 70 ? "default" : "destructive"}>
                  Couverture: {coverageScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compétence</TableHead>
                    <TableHead className="text-center">Exigé</TableHead>
                    <TableHead className="text-center">Équipe</TableHead>
                    <TableHead className="text-center">Gap</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gaps.map(g => {
                    const cat = SKILL_CATEGORIES.find(s => s.key === g.skill)!;
                    const Icon = cat.icon;
                    return (
                      <TableRow key={g.skill}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-4 w-4 ${cat.color}`} />
                            {g.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{g.required}/10</TableCell>
                        <TableCell className="text-center">{g.current}/10</TableCell>
                        <TableCell className="text-center font-bold">{g.gap > 0 ? `-${g.gap}` : "✓"}</TableCell>
                        <TableCell>
                          {g.gap === 0 ? (
                            <Badge className="bg-green-500/10 text-green-600 text-xs">Couvert</Badge>
                          ) : g.gap <= 2 ? (
                            <Badge className="bg-amber-500/10 text-amber-600 text-xs">Partiel</Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-600 text-xs">Critique</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {totalGap > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm">
                  ⚠️ <strong>Recommandation</strong> : Recrutez un profil avec des compétences en{" "}
                  {gaps.filter(g => g.gap >= 3).map(g => g.label.toLowerCase()).join(", ") || "amélioration générale"}.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Slicing Pie Equity Split */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Répartition de l'Equity — Méthode Slicing Pie
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Formule : Slice = (Temps × Taux horaire × Engagement × Mult. Rôle) + (Cash × 4) + (Équipement × 2) + (PI × 3000) + (Réseau × 750) + (Compétences × 100 × Mult. Rôle)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Slices</TableHead>
                    <TableHead className="text-center">Equity %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(m => {
                    const roleData = ROLES.find(r => r.value === m.role)!;
                    return (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{roleData.label}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {slices[m.id] ? Math.round(slices[m.id].total).toLocaleString() : 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-primary text-lg">{equity[m.id]}%</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Visual bars */}
              <div className="space-y-2">
                {members.map(m => (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{m.name}</span>
                      <span className="font-bold text-primary">{equity[m.id]}%</span>
                    </div>
                    <Progress value={equity[m.id]} className="h-3" />
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground space-y-1">
                <p>💡 <strong>Méthode Slicing Pie (Mike Moyer)</strong> : La répartition est dynamique et évolue avec les contributions réelles.</p>
                <p>• <strong>Fondateur</strong> : Multiplicateur ×2.0 — Vision, risque initial maximum</p>
                <p>• <strong>Co-fondateur</strong> : Multiplicateur ×1.5 — Engagement total, compétences complémentaires</p>
                <p>• <strong>Advisor</strong> : Multiplicateur ×0.3 — Temps limité, réseau et expertise stratégique</p>
                <p className="mt-1">⚖️ Les parts finales doivent être validées par un pacte d'associés.</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default TeamAnalyzer;
