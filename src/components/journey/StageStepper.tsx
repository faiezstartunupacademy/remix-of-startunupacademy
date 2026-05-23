import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import type { JourneyStage } from "@/data/journeyStages";

interface Props {
  stages: JourneyStage[];
  activeStage: number;
  stageProgress: (id: number) => number;
  stageUnlocked: (id: number) => boolean;
  onSelect: (id: number) => void;
}

export default function StageStepper({ stages, activeStage, stageProgress, stageUnlocked, onSelect }: Props) {
  return (
    <div className="relative">
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max px-1">
          {stages.map((s, idx) => {
            const progress = stageProgress(s.id);
            const isDone = progress === 100;
            const isActive = activeStage === s.id;
            const unlocked = stageUnlocked(s.id);

            return (
              <div key={s.id} className="flex items-center">
                <motion.button
                  whileHover={{ scale: unlocked ? 1.05 : 1 }}
                  whileTap={{ scale: unlocked ? 0.95 : 1 }}
                  onClick={() => onSelect(s.id)}
                  className={`relative flex flex-col items-center gap-1.5 w-24 text-center transition-opacity ${
                    !unlocked ? "opacity-50" : ""
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ring-4 transition-all ${
                      isActive ? "ring-primary scale-110" : isDone ? "ring-emerald-500/60" : "ring-transparent"
                    } bg-gradient-to-br ${s.gradient} text-white relative`}
                  >
                    {!unlocked && <Lock className="absolute w-4 h-4 right-0 top-0 bg-background text-foreground rounded-full p-0.5" />}
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : <span>{s.emoji}</span>}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-medium text-muted-foreground">Étape {s.id}</div>
                    <div className={`text-xs font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">{progress}%</div>
                  </div>
                </motion.button>
                {idx < stages.length - 1 && (
                  <div className="h-1 w-6 sm:w-10 rounded-full bg-muted relative -mt-8 mx-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                      style={{ width: `${stageProgress(s.id)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
