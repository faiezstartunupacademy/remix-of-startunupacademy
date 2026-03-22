import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  label: string;
  sublabel: string;
  value: number;
  icon: LucideIcon;
  large?: boolean;
};

const ValidationGauge = ({ label, sublabel, value, icon: Icon, large }: Props) => {
  const size = large ? 120 : 90;
  const stroke = large ? 10 : 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color = value <= 30
    ? "hsl(0, 72%, 51%)"     // red
    : value <= 60
    ? "hsl(38, 92%, 50%)"    // amber
    : "hsl(152, 69%, 41%)";  // emerald

  const bgColor = value <= 30
    ? "hsl(0, 72%, 91%)"
    : value <= 60
    ? "hsl(38, 92%, 90%)"
    : "hsl(152, 69%, 88%)";

  return (
    <Card className={large ? "border-2 border-primary/30 bg-primary/5" : ""}>
      <CardContent className="flex flex-col items-center justify-center py-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={radius} fill="none"
              stroke={bgColor} strokeWidth={stroke} />
            <circle cx={size/2} cy={size/2} r={radius} fill="none"
              stroke={color} strokeWidth={stroke}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-black ${large ? "text-2xl" : "text-lg"}`} style={{ color }}>{value}%</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <Icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className={`font-bold ${large ? "text-base" : "text-sm"}`}>{label}</p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationGauge;
