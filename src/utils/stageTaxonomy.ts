// Bridge between the two stage taxonomies used in the platform.
//
// 1. Product stage (4) - lives on `incubation_projects.stage`
//    and `mvp_validator_projects.product_stage`.
// 2. Capital stage (6) - used by Business Plan / Invest generators
//    via the `startupStage` prop.
//
// The product stage is the source of truth. The capital stage is auto-
// suggested from it but remains user-modifiable.

export type ProductStage = "idee" | "prototype" | "mvp" | "traction";
export type CapitalStage =
  | "student"
  | "student-entrepreneur"
  | "pre-seed"
  | "seed"
  | "serie-a"
  | "accelerated";

export const PRODUCT_STAGES: ProductStage[] = ["idee", "prototype", "mvp", "traction"];

/** Product stage -> MVP Validator scenario (A = idea only, B = idea + BM). */
export function productStageToScenario(stage?: string | null): "A" | "B" {
  switch (stage) {
    case "mvp":
    case "traction":
      return "B";
    case "idee":
    case "prototype":
    default:
      return "A";
  }
}

/** Product stage -> suggested capital stage for BP / Invest. */
export function productStageToCapitalStage(stage?: string | null): CapitalStage {
  switch (stage) {
    case "traction":
      return "serie-a";
    case "mvp":
      return "seed";
    case "prototype":
    case "idee":
    default:
      return "pre-seed";
  }
}

/** Product stage -> MVP test phase to prioritise / filter on. */
export function productStageToTestPhase(
  stage?: string | null
): "Problem-Solution Fit" | "Product-Market Fit" | "Scale" | null {
  switch (stage) {
    case "idee":
    case "prototype":
      return "Problem-Solution Fit";
    case "mvp":
      return "Product-Market Fit";
    case "traction":
      return "Scale";
    default:
      return null;
  }
}

export const PRODUCT_STAGE_LABEL: Record<ProductStage, string> = {
  idee: "Idée",
  prototype: "Prototype",
  mvp: "MVP",
  traction: "Traction",
};

export const CAPITAL_STAGE_LABEL: Record<CapitalStage, string> = {
  student: "Étudiant",
  "student-entrepreneur": "Étudiant Entrepreneur",
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "serie-a": "Série A",
  accelerated: "Accéléré",
};
