import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  Award,
  Lightbulb,
  Target,
  Brain,
  MessageSquare,
  Presentation,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MontageActivity } from "@/data/startupMontageSlidesData";

interface StartupMontageActivityProps {
  activity: MontageActivity;
  onComplete: () => void;
  moduleColor: string;
}

const StartupMontageActivity = ({ activity, onComplete, moduleColor }: StartupMontageActivityProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'brainstorm': return <Brain className="h-5 w-5" />;
      case 'canvas': return <FileText className="h-5 w-5" />;
      case 'debate': return <MessageSquare className="h-5 w-5" />;
      case 'pitch': return <Presentation className="h-5 w-5" />;
      case 'quiz': return <Target className="h-5 w-5" />;
      case 'simulation': return <Play className="h-5 w-5" />;
      case 'reflection': return <Lightbulb className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'brainstorm': return 'Brainstorming';
      case 'canvas': return 'Canvas';
      case 'debate': return 'Débat';
      case 'pitch': return 'Pitch';
      case 'quiz': return 'Quiz';
      case 'simulation': return 'Simulation';
      case 'reflection': return 'Réflexion';
      default: return type;
    }
  };

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const allStepsCompleted = completedSteps.length === activity.instructions.length;

  return (
    <Card className="border border-border/50 shadow-sm overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${moduleColor} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getActivityIcon(activity.type)}
            <div>
              <Badge variant="secondary" className="mb-1.5 bg-white/15 text-white/80 border-0 text-xs">
                {getActivityTypeLabel(activity.type)}
              </Badge>
              <CardTitle className="text-lg">{activity.title}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>{activity.duration}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed p-4 bg-muted/30 rounded-xl">
          {activity.description}
        </p>

        {!isStarted ? (
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4 text-primary" />
                Ce que vous allez faire
              </h4>
              <ul className="space-y-2">
                {activity.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 font-medium">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Livrables attendus
              </h4>
              <div className="flex flex-wrap gap-2">
                {activity.deliverables.map((deliverable, index) => (
                  <Badge key={index} variant="outline" className="py-1.5 text-xs rounded-lg">
                    {deliverable}
                  </Badge>
                ))}
              </div>
            </div>

            {activity.evaluation && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  Critères d'évaluation
                </h4>
                <ul className="space-y-1.5">
                  {activity.evaluation.map((criterion, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={() => setIsStarted(true)} 
              className={`w-full bg-gradient-to-r ${moduleColor} hover:opacity-90 rounded-xl`}
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Commencer l'activité
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
              <span className="text-sm font-medium text-foreground">Progression</span>
              <span className="text-primary font-bold text-sm">
                {completedSteps.length} / {activity.instructions.length}
              </span>
            </div>

            <div className="space-y-2">
              {activity.instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    completedSteps.includes(index)
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedSteps.includes(index)}
                      onCheckedChange={() => toggleStep(index)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className={`text-xs font-semibold ${
                        completedSteps.includes(index) ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                      }`}>
                        Étape {index + 1}
                      </span>
                      <p className={`text-sm mt-0.5 leading-relaxed ${
                        completedSteps.includes(index) ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}>
                        {instruction}
                      </p>
                    </div>
                    {completedSteps.includes(index) && (
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-4">
              <h4 className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-400">
                📝 Livrables
              </h4>
              <ul className="space-y-1">
                {activity.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200/80">
                    <ChevronRight className="h-3.5 w-3.5" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={onComplete}
              disabled={!allStepsCompleted}
              className={`w-full rounded-xl ${allStepsCompleted ? `bg-gradient-to-r ${moduleColor}` : ''}`}
              size="lg"
            >
              {allStepsCompleted ? (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Valider et passer au module suivant
                </>
              ) : (
                <span className="text-sm">
                  Complétez toutes les étapes ({activity.instructions.length - completedSteps.length} restantes)
                </span>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StartupMontageActivity;
