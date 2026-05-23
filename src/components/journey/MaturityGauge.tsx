import { motion } from "framer-motion";

interface Props {
  score: number;
  label?: string;
}

export default function MaturityGauge({ score, label = "Score de Maturité" }: Props) {
  const safe = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 70;
  const stroke = 14;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (safe / 100) * circ;
  const color = safe < 30 ? "#ef4444" : safe < 60 ? "#f59e0b" : safe < 85 ? "#10b981" : "#6366f1";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-44">
        <svg width={176} height={176} viewBox="0 0 176 176" className="-rotate-90">
          <circle cx={88} cy={88} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={88}
            cy={88}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color }}>{safe}<span className="text-xl">%</span></div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Maturité</div>
        </div>
      </div>
      <div className="text-sm font-medium text-center">{label}</div>
    </div>
  );
}
