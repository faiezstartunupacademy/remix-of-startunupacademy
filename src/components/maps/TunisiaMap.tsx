import { useMemo, useState } from "react";
import { TUNISIA_GOVERNORATES } from "@/data/tunisiaGovernorates";

interface Props {
  /** key = governorate name, value = numeric metric (e.g. users) */
  values?: Record<string, number>;
  /** highlight a single governorate (e.g. user's) */
  highlight?: string | null;
  onSelect?: (name: string) => void;
  label?: string;
  height?: number;
}

/**
 * Stylized bubble map of the 24 Tunisian governorates.
 * Not a precise geographic map — uses approximate normalized coords
 * over a simplified country outline. Good enough for an equity dashboard.
 */
export const TunisiaMap = ({ values = {}, highlight, onSelect, label = "Activité", height = 520 }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = useMemo(() => Math.max(1, ...Object.values(values)), [values]);

  const colorFor = (v: number) => {
    if (v <= 0) return "hsl(var(--muted))";
    const t = Math.min(1, v / max);
    // blend from muted to primary via opacity on primary
    return `hsl(var(--primary) / ${0.15 + t * 0.85})`;
  };

  const radiusFor = (v: number) => 1.6 + Math.sqrt(v) * 1.4;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Simplified Tunisia silhouette (approximate) */}
        <path
          d="M44 4 L52 6 L56 12 L54 18 L60 22 L58 30 L62 36 L62 44 L58 50 L62 56 L60 64 L55 72 L52 82 L48 92 L42 88 L40 78 L42 70 L36 64 L40 58 L34 56 L28 58 L26 52 L30 46 L36 44 L32 36 L34 28 L30 22 L34 16 L38 12 Z"
          fill="hsl(var(--muted) / 0.4)"
          stroke="hsl(var(--border))"
          strokeWidth="0.3"
        />

        {TUNISIA_GOVERNORATES.map((g) => {
          const v = values[g.name] ?? 0;
          const isHigh = highlight === g.name;
          const isHov = hovered === g.name;
          return (
            <g key={g.name} className="cursor-pointer" onMouseEnter={() => setHovered(g.name)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect?.(g.name)}>
              <circle
                cx={g.cx}
                cy={g.cy}
                r={radiusFor(v)}
                fill={colorFor(v)}
                stroke={isHigh ? "hsl(var(--primary))" : isHov ? "hsl(var(--foreground))" : "hsl(var(--border))"}
                strokeWidth={isHigh ? 0.8 : 0.3}
              />
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="absolute top-2 right-2 bg-card border rounded-md px-3 py-2 text-xs shadow-md">
          <div className="font-semibold">{hovered}</div>
          <div className="text-muted-foreground">
            {label}: <span className="font-mono">{values[hovered] ?? 0}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs bg-card/80 backdrop-blur rounded-md px-2 py-1 border">
        <span className="text-muted-foreground">0</span>
        <div className="w-24 h-2 rounded" style={{ background: "linear-gradient(to right, hsl(var(--muted)), hsl(var(--primary)))" }} />
        <span className="text-muted-foreground">{max}</span>
      </div>
    </div>
  );
};

export default TunisiaMap;
