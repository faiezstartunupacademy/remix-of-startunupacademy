import { motion } from "framer-motion";
import { GraduationCap, Lightbulb, Sprout, Rocket, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const STAGES = [
  { value: "student", label: "Étudiant", icon: GraduationCap, description: "Pas encore d'idée, exploration complète", color: "text-blue-500" },
  { value: "student-entrepreneur", label: "Étudiant Entrepreneur", icon: Lightbulb, description: "Idée embryonnaire, besoin de structuration", color: "text-amber-500" },
  { value: "pre-seed", label: "Pre-Seed", icon: Sprout, description: "Idée en cours de validation", color: "text-green-500" },
  { value: "seed", label: "Seed", icon: Rocket, description: "MVP en cours, optimisation et traction", color: "text-purple-500" },
  { value: "serie-a", label: "Série A", icon: TrendingUp, description: "Product-Market Fit, besoin de scaling", color: "text-rose-500" },
  { value: "accelerated", label: "Accéléré", icon: Award, description: "En programme d'accélération, mentorat avancé", color: "text-indigo-500" },
];

// Stages that can start without an idea (early stages)
const EARLY_STAGES = ["student", "student-entrepreneur", "pre-seed"];

interface StartupStageSelectorProps {
  stage: string;
  hasIdea: boolean;
  onStageChange: (stage: string) => void;
  onHasIdeaChange: (hasIdea: boolean) => void;
}

const StartupStageSelector = ({ stage, hasIdea, onStageChange, onHasIdeaChange }: StartupStageSelectorProps) => {
  const selectedStage = STAGES.find(s => s.value === stage);
  const isEarlyStage = EARLY_STAGES.includes(stage);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            🎯 Profil & Stade de la Startup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Stade actuel</Label>
            <Select value={stage} onValueChange={onStageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner votre stade" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(s => {
                  const Icon = s.icon;
                  return (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${s.color}`} />
                        <span>{s.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Show "has idea" only for early stages */}
          {isEarlyStage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Avez-vous une idée ?</Label>
              <div className="flex items-center gap-3 h-10">
                <Switch checked={hasIdea} onCheckedChange={onHasIdeaChange} />
                <span className="text-sm text-muted-foreground">
                  {hasIdea ? "Oui, j'ai une idée claire" : "Non, je cherche encore"}
                </span>
              </div>
            </div>
          )}

          {selectedStage && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {selectedStage.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{selectedStage.description}</span>
              {isEarlyStage && (
                <Badge variant={hasIdea ? "default" : "secondary"} className="text-xs ml-auto">
                  {hasIdea ? "💡 Avec idée → Validation" : "🔍 Sans idée → Exploration"}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EARLY_STAGES };
export default StartupStageSelector;
