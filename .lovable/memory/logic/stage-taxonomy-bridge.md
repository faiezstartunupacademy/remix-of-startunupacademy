---
name: Stage Taxonomy Bridge (Product vs Capital)
description: Two coexisting stage systems — product (4) and capital (6) — and how they connect across Pôle Stratégique, MVP Validator, BP and Invest
type: feature
---

The platform uses TWO complementary stage taxonomies, never fused:

**1. Product stage (4)** — `incubation_projects.stage` + `mvp_validator_projects.product_stage`
- `idee` → conceptualisation, pas de produit
- `prototype` → maquette / preuve de concept
- `mvp` → premier produit testable
- `traction` → métriques d'usage / revenus

**2. Capital stage (6)** — used by BP/Invest generators via `startupStage` prop
- `student` → `student-entrepreneur` → `pre-seed` → `seed` → `serie-a` → `accelerated`

## Bridge (auto-suggested, user-modifiable)
- `idee` / `prototype` → `pre-seed`
- `mvp` → `seed`
- `traction` → `serie-a`

Implemented in `src/utils/stageTaxonomy.ts` via `productStageToCapitalStage()`.
The `StartupStageSelector` (6 stages) pre-fills with the suggestion but the user can override.

## Product stage → MVP scenario
`productStageToScenario()`: `idee`/`prototype` → A (idée seule), `mvp`/`traction` → B (idée + BM).
Used by `StrategicConsolePage.createMvpFromIncubation` to seed the MVP Validator project.

## Product stage → MVP test phase (auto-filter)
`productStageToTestPhase()`:
- `idee`/`prototype` → "Problem-Solution Fit"
- `mvp` → "Product-Market Fit"
- `traction` → "Scale"

`MvpTestsLibraryV2` filters the library to the current phase by default; user has a "Voir tous les tests" toggle.

## DB column
`mvp_validator_projects.product_stage` text CHECK in ('idee','prototype','mvp','traction'), nullable. Populated on import from Pôle Stratégique.
