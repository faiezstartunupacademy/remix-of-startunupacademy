import { useProjectContext } from "@/hooks/useProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Target, Check, ChevronDown, Sparkles } from "lucide-react";
import { CAPITAL_STAGE_LABEL } from "@/utils/stageTaxonomy";

const SOURCE_LABEL: Record<string, string> = {
  incubation: "Incubation",
  mvp: "MVP Validator",
  strategic: "Pôle Stratégique",
};

export default function ProjectContextBadge({
  compact = false,
}: { compact?: boolean }) {
  const { loading, projects, active, setActiveId } = useProjectContext();

  if (loading || !active) return null;

  return (
    <Card
      className={`p-3 bg-primary/5 border-primary/20 flex flex-wrap items-center gap-2 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <Target className="h-4 w-4 text-primary shrink-0" />
      <span className="font-medium">Projet&nbsp;:</span>

      {projects.length > 1 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              {active.name}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2">
            <p className="text-xs text-muted-foreground px-2 py-1">
              Changer de projet actif
            </p>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {projects.map((p) => (
                <button
                  key={p.projectId + p.source}
                  onClick={() => setActiveId(p.projectId)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-sm flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {SOURCE_LABEL[p.source]} · {p.sector || "—"}
                    </div>
                  </div>
                  {p.projectId === active.projectId && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Badge variant="outline" className="font-medium">
          {active.name}
        </Badge>
      )}

      {active.sector && (
        <Badge variant="outline">Secteur&nbsp;: {active.sector}</Badge>
      )}
      <Badge variant="outline">
        Stade&nbsp;: {CAPITAL_STAGE_LABEL[active.capitalStage]}
      </Badge>
      {active.bmValidated && (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
          BM ✓
        </Badge>
      )}
      {active.governorate && (
        <Badge variant="outline">📍 {active.governorate}</Badge>
      )}
      <Badge variant="secondary" className="ml-auto text-[10px]">
        <Sparkles className="h-3 w-3 mr-1" /> Source&nbsp;:{" "}
        {SOURCE_LABEL[active.source]}
      </Badge>
    </Card>
  );
}
