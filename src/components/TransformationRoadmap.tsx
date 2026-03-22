import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp,
  Download, RotateCcw, Flag, Clock, Target, Milestone, ArrowRight,
  AlertCircle, CheckCircle2, Circle, PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  tasks: { id: string; title: string; completed: boolean }[];
}

const POLISM_CATEGORIES = [
  { id: "processes", name: "Processes", icon: "⚙️", color: "bg-blue-500" },
  { id: "organization", name: "Organization", icon: "👥", color: "bg-green-500" },
  { id: "locations", name: "Locations", icon: "📍", color: "bg-orange-500" },
  { id: "information", name: "Information", icon: "💻", color: "bg-pink-500" },
  { id: "suppliers", name: "Suppliers", icon: "🤝", color: "bg-teal-500" },
  { id: "management", name: "Management", icon: "📊", color: "bg-indigo-500" },
];

const STATUS_CONFIG = {
  not_started: { label: "Non démarré", color: "bg-gray-400", icon: Circle },
  in_progress: { label: "En cours", color: "bg-blue-500", icon: PlayCircle },
  completed: { label: "Terminé", color: "bg-green-500", icon: CheckCircle2 },
  blocked: { label: "Bloqué", color: "bg-red-500", icon: AlertCircle },
};

const TEMPLATE_MILESTONES: Omit<RoadmapMilestone, 'id'>[] = [
  {
    title: "Diagnostic AS-IS",
    description: "Cartographier le modèle opérationnel actuel avec le framework POLISM",
    category: "management",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Interviews parties prenantes clés", completed: false },
      { id: "2", title: "Cartographie des processus actuels", completed: false },
      { id: "3", title: "Analyse de l'organisation existante", completed: false },
      { id: "4", title: "Inventaire des systèmes IT", completed: false },
    ],
  },
  {
    title: "Design TO-BE",
    description: "Concevoir le modèle opérationnel cible aligné sur la stratégie",
    category: "management",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Workshop de vision avec le COMEX", completed: false },
      { id: "2", title: "Définition des processus cibles", completed: false },
      { id: "3", title: "Design de l'organisation cible", completed: false },
      { id: "4", title: "Architecture IT cible", completed: false },
    ],
  },
  {
    title: "Gap Analysis",
    description: "Identifier les écarts entre AS-IS et TO-BE et prioriser les chantiers",
    category: "management",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Analyse des écarts par dimension POLISM", completed: false },
      { id: "2", title: "Évaluation de l'effort de transformation", completed: false },
      { id: "3", title: "Priorisation des initiatives", completed: false },
    ],
  },
  {
    title: "Transformation Processus",
    description: "Redéfinir et optimiser les processus clés de création de valeur",
    category: "processes",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Redesign des processus prioritaires", completed: false },
      { id: "2", title: "Automatisation des tâches répétitives", completed: false },
      { id: "3", title: "Mise en place des KPIs processus", completed: false },
    ],
  },
  {
    title: "Réorganisation",
    description: "Déployer la nouvelle structure organisationnelle",
    category: "organization",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Communication du nouvel organigramme", completed: false },
      { id: "2", title: "Définition des rôles et responsabilités (RACI)", completed: false },
      { id: "3", title: "Plan de montée en compétences", completed: false },
    ],
  },
  {
    title: "Déploiement IT",
    description: "Implémenter les nouveaux systèmes et intégrations",
    category: "information",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Sélection et contractualisation des solutions", completed: false },
      { id: "2", title: "Implémentation et paramétrage", completed: false },
      { id: "3", title: "Migration des données", completed: false },
      { id: "4", title: "Formation des utilisateurs", completed: false },
    ],
  },
  {
    title: "Pilotage & Amélioration Continue",
    description: "Mettre en place les rituels de gouvernance et d'amélioration",
    category: "management",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [
      { id: "1", title: "Définition du Management Calendar", completed: false },
      { id: "2", title: "Mise en place des dashboards de pilotage", completed: false },
      { id: "3", title: "Lancement des routines d'amélioration continue", completed: false },
    ],
  },
];

const TransformationRoadmap = () => {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [projectName, setProjectName] = useState("Transformation Operating Model");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState<Omit<RoadmapMilestone, 'id'>>({
    title: "",
    description: "",
    category: "processes",
    startDate: "",
    endDate: "",
    status: "not_started",
    tasks: [],
  });

  const loadTemplate = () => {
    const today = new Date();
    const templateWithDates = TEMPLATE_MILESTONES.map((m, idx) => {
      const start = new Date(today);
      start.setDate(start.getDate() + idx * 30);
      const end = new Date(start);
      end.setDate(end.getDate() + 28);
      return {
        ...m,
        id: crypto.randomUUID(),
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        tasks: m.tasks.map(t => ({ ...t, id: crypto.randomUUID() })),
      };
    });
    setMilestones(templateWithDates);
  };

  const addMilestone = () => {
    if (!newMilestone.title) return;
    setMilestones(prev => [...prev, { ...newMilestone, id: crypto.randomUUID() }]);
    setNewMilestone({
      title: "",
      description: "",
      category: "processes",
      startDate: "",
      endDate: "",
      status: "not_started",
      tasks: [],
    });
    setShowAddForm(false);
  };

  const updateMilestone = (id: string, updates: Partial<RoadmapMilestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const toggleTask = (milestoneId: string, taskId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id !== milestoneId) return m;
      return {
        ...m,
        tasks: m.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
      };
    }));
  };

  const addTask = (milestoneId: string, taskTitle: string) => {
    if (!taskTitle.trim()) return;
    setMilestones(prev => prev.map(m => {
      if (m.id !== milestoneId) return m;
      return {
        ...m,
        tasks: [...m.tasks, { id: crypto.randomUUID(), title: taskTitle, completed: false }],
      };
    }));
  };

  const deleteTask = (milestoneId: string, taskId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id !== milestoneId) return m;
      return { ...m, tasks: m.tasks.filter(t => t.id !== taskId) };
    }));
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / milestones.length) * 100);
  };

  const calculateMilestoneProgress = (milestone: RoadmapMilestone) => {
    if (milestone.tasks.length === 0) return milestone.status === 'completed' ? 100 : 0;
    const completed = milestone.tasks.filter(t => t.completed).length;
    return Math.round((completed / milestone.tasks.length) * 100);
  };

  const exportRoadmap = () => {
    const content = `
ROADMAP DE TRANSFORMATION - ${projectName}
${'='.repeat(50)}
Date d'export: ${new Date().toLocaleDateString('fr-FR')}
Progression globale: ${calculateProgress()}%

${milestones.map((m, idx) => {
  const cat = POLISM_CATEGORIES.find(c => c.id === m.category);
  return `
${idx + 1}. ${m.title}
   Catégorie: ${cat?.name || m.category}
   Période: ${m.startDate || 'N/A'} → ${m.endDate || 'N/A'}
   Statut: ${STATUS_CONFIG[m.status].label}
   Progression: ${calculateMilestoneProgress(m)}%
   
   Description: ${m.description}
   
   Tâches:
${m.tasks.map(t => `   ${t.completed ? '✓' : '○'} ${t.title}`).join('\n')}
`;
}).join('\n---\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-${projectName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetRoadmap = () => {
    setMilestones([]);
    setProjectName("Transformation Operating Model");
  };

  const getCategoryInfo = (categoryId: string) => {
    return POLISM_CATEGORIES.find(c => c.id === categoryId) || POLISM_CATEGORIES[0];
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Roadmap de Transformation</span>
        </div>
        <h2 className="text-3xl font-black mb-2">Planifiez votre transformation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Créez une feuille de route pour implémenter votre Operating Model avec des jalons, échéances et tâches.
        </p>
      </div>

      {/* Project Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Nom du projet..."
              />
              <p className="text-sm text-muted-foreground mt-1">
                {milestones.length} jalons • Progression: {calculateProgress()}%
              </p>
            </div>
            <div className="flex gap-2">
              {milestones.length === 0 ? (
                <Button onClick={loadTemplate}>
                  <Flag className="mr-2 h-4 w-4" />
                  Charger le template POLISM
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={exportRoadmap}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetRoadmap}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                </>
              )}
            </div>
          </div>
          {milestones.length > 0 && (
            <Progress value={calculateProgress()} className="h-2 mt-4" />
          )}
        </CardContent>
      </Card>

      {/* Timeline View */}
      {milestones.length > 0 && (
        <div className="space-y-4">
          {/* Category Legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {POLISM_CATEGORIES.map(cat => {
              const count = milestones.filter(m => m.category === cat.id).length;
              if (count === 0) return null;
              return (
                <Badge key={cat.id} variant="outline" className="gap-1">
                  <span>{cat.icon}</span>
                  {cat.name} ({count})
                </Badge>
              );
            })}
          </div>

          {/* Milestones */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const category = getCategoryInfo(milestone.category);
                const statusConfig = STATUS_CONFIG[milestone.status];
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedId === milestone.id;
                const progress = calculateMilestoneProgress(milestone);

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-16"
                  >
                    {/* Timeline node */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full ${category.color} border-4 border-background`} />
                    
                    <Card className={`${isExpanded ? 'ring-2 ring-primary' : ''}`}>
                      <CardHeader 
                        className="cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{category.icon}</div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {milestone.title}
                                <Badge className={`${statusConfig.color} text-white text-xs`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {milestone.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {milestone.startDate && milestone.endDate && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(milestone.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                {' → '}
                                {new Date(milestone.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </Badge>
                            )}
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progression</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <CardContent className="pt-0 space-y-4">
                              {/* Status & Dates */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Statut</label>
                                  <Select
                                    value={milestone.status}
                                    onValueChange={(val) => updateMilestone(milestone.id, { status: val as RoadmapMilestone['status'] })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                          <span className="flex items-center gap-2">
                                            <config.icon className="h-4 w-4" />
                                            {config.label}
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Date début</label>
                                  <Input
                                    type="date"
                                    value={milestone.startDate}
                                    onChange={(e) => updateMilestone(milestone.id, { startDate: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Date fin</label>
                                  <Input
                                    type="date"
                                    value={milestone.endDate}
                                    onChange={(e) => updateMilestone(milestone.id, { endDate: e.target.value })}
                                  />
                                </div>
                              </div>

                              {/* Tasks */}
                              <div>
                                <h4 className="font-semibold text-sm mb-3">Tâches ({milestone.tasks.filter(t => t.completed).length}/{milestone.tasks.length})</h4>
                                <div className="space-y-2">
                                  {milestone.tasks.map(task => (
                                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                      <button
                                        onClick={() => toggleTask(milestone.id, task.id)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                          task.completed 
                                            ? 'bg-primary border-primary text-primary-foreground' 
                                            : 'border-muted-foreground'
                                        }`}
                                      >
                                        {task.completed && <Check className="h-3 w-3" />}
                                      </button>
                                      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.title}
                                      </span>
                                      <button
                                        onClick={() => deleteTask(milestone.id, task.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <div className="flex gap-2 mt-2">
                                    <Input
                                      placeholder="Ajouter une tâche..."
                                      className="text-sm"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          addTask(milestone.id, e.currentTarget.value);
                                          e.currentTarget.value = '';
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteMilestone(milestone.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </Button>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un jalon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titre</label>
                    <Input
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Diagnostic AS-IS"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie POLISM</label>
                    <Select
                      value={newMilestone.category}
                      onValueChange={(val) => setNewMilestone(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POLISM_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              {cat.icon} {cat.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez l'objectif de ce jalon..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date début</label>
                    <Input
                      type="date"
                      value={newMilestone.startDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date fin</label>
                    <Input
                      type="date"
                      value={newMilestone.endDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                  <Button onClick={addMilestone}>
                    <Check className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!showAddForm && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un jalon
          </Button>
        </div>
      )}

      {/* Empty State */}
      {milestones.length === 0 && !showAddForm && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Milestone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Aucun jalon défini</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par charger le template POLISM ou créez vos propres jalons.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={loadTemplate}>
                <Flag className="mr-2 h-4 w-4" />
                Template POLISM
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer manuellement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransformationRoadmap;
