// Duration multipliers based on ecosystem/sector
// Some sectors require more time due to regulatory, technical or market complexity
const SECTOR_MULTIPLIERS: Record<string, number> = {
  "SaaS": 1.0,
  "Marketplace": 1.1,
  "E-commerce": 0.9,
  "FinTech": 1.4,
  "HealthTech": 1.5,
  "EdTech": 1.0,
  "FoodTech": 1.1,
  "GreenTech": 1.2,
  "DeepTech": 1.6,
  "Social Impact": 1.1,
};

// Phase multipliers - later phases tend to be more complex
const PHASE_MULTIPLIERS: Record<string, number> = {
  "Phase 1 — Tests Fondamentaux": 1.0,
  "Phase 2 — Tests de Solution": 1.1,
  "Phase 3 — Tests de Marché": 1.0,
  "Phase 4 — Tests de Pricing": 1.1,
  "Phase 5 — Tests de Rétention": 1.2,
  "Phase 6 — Tests d'Acquisition": 1.1,
  "Phase 7 — Tests Financiers": 1.3,
  "Phase 8 — Tests B2B Enterprise": 1.3,
  "Phase 9 — Tests Spécialisés": 1.2,
};

// Parse duration string like "2-3 semaines" or "3-5 jours" into { min, max, unit }
function parseDuration(duration: string): { min: number; max: number; unit: string } | null {
  const match = duration.match(/^(\d+)(?:-(\d+))?\s+(semaines?|jours?|mois)$/);
  if (!match) return null;
  return {
    min: parseInt(match[1]),
    max: match[2] ? parseInt(match[2]) : parseInt(match[1]),
    unit: match[3].replace(/s$/, ""), // normalize to singular
  };
}

function formatDuration(min: number, max: number, unit: string): string {
  const plural = (n: number, u: string) => n > 1 ? `${u}s` : u;
  if (min === max) return `${min} ${plural(min, unit)}`;
  return `${min}-${max} ${plural(max, unit)}`;
}

export function getAdjustedDuration(baseDuration: string, sector?: string, phase?: string): string {
  const parsed = parseDuration(baseDuration);
  if (!parsed) return baseDuration;

  const sectorMul = sector ? (SECTOR_MULTIPLIERS[sector] || 1.0) : 1.0;
  const phaseMul = phase ? (PHASE_MULTIPLIERS[phase] || 1.0) : 1.0;
  const totalMul = sectorMul * phaseMul;

  const newMin = Math.max(1, Math.round(parsed.min * totalMul));
  const newMax = Math.max(newMin, Math.round(parsed.max * totalMul));

  return formatDuration(newMin, newMax, parsed.unit);
}

export function getDurationContext(baseDuration: string, sector?: string): string {
  if (!sector) return "";
  const mul = SECTOR_MULTIPLIERS[sector] || 1.0;
  if (mul > 1.2) return `⚠️ Durée majorée (+${Math.round((mul - 1) * 100)}%) pour le secteur ${sector} (complexité réglementaire/technique)`;
  if (mul < 1.0) return `⏩ Durée réduite (-${Math.round((1 - mul) * 100)}%) pour le secteur ${sector}`;
  return "";
}

export function getSectorMultiplier(sector: string): number {
  return SECTOR_MULTIPLIERS[sector] || 1.0;
}

export function getPhaseMultiplier(phase: string): number {
  return PHASE_MULTIPLIERS[phase] || 1.0;
}

export { SECTOR_MULTIPLIERS, PHASE_MULTIPLIERS };
