
## Objectif

Corriger l'incohérence des stades entre le Pôle Stratégique et le MVP Validator, et propager le **stade produit** comme filtre de pertinence — tout en gardant les **6 stades capital** distincts pour les générateurs financiers (auto-suggérés, modifiables).

## Principe directeur

Deux dimensions complémentaires, jamais fusionnées :
- **Stade produit** (4) : `idee` → `prototype` → `mvp` → `traction` — maturité R&D
- **Stade capital** (6) : `student` → … → `accelerated` — maturité financière

Le stade produit est la source de vérité ; le stade capital est dérivé puis ajustable.

## Changements

### 1. Fix du `stageMap` cassé (Pôle Stratégique → MVP Validator)

`src/pages/StrategicConsolePage.tsx` (lignes ~188-194) référence des clés inexistantes (`ideation`, `product-market-fit`, `growth`, `scale`). Remplacer par les 4 vraies clés :

```text
idee       → scenario A (idée seule)
prototype  → scenario A
mvp        → scenario B (idée + BM validé)
traction   → scenario B
```

### 2. Propager le `stage` produit dans MVP Validator

- Ajouter colonne `product_stage` (text, nullable, check sur les 4 valeurs) à `mvp_validator_projects`.
- À l'import depuis le Pôle Stratégique, copier `incubation_projects.stage` → `mvp_validator_projects.product_stage`.
- Exposer le stade dans le contexte projet partagé aux composants enfants.

### 3. Filtrage automatique des tests MVP par stade produit

Dans `MvpTestsLibrary.tsx` + `utils/mvpTestFilter.ts` :

| Stade produit | Phase tests prioritaire |
|---|---|
| `idee` | Problem-Solution Fit |
| `prototype` | Problem-Solution Fit + début Product-Market Fit |
| `mvp` | Product-Market Fit |
| `traction` | Scale |

- Filtrer la bibliothèque pour ne montrer que les tests de la phase courante par défaut.
- Ajouter un toggle **"Voir tous les tests"** pour révéler les autres phases (pas de blocage dur).
- Conserver le filtrage existant par `scenario` (A/B) et `sector` ; le `stage` agit comme 3e filtre additionnel.

### 4. Auto-suggestion du stade capital pour BP/Invest

Dans `MvpValidatorPage.tsx` (et tout endroit qui passe `startupStage` aux générateurs BP/Invest) :

```text
idee/prototype  → pre-seed   (suggéré)
mvp             → seed        (suggéré)
traction        → serie-a    (suggéré)
```

- Le `StartupStageSelector` reste affiché, pré-rempli avec la suggestion, mais **modifiable** par l'utilisateur.
- Supprimer la conversion actuelle `scenario === "A" ? "pre-seed" : "seed"` qui ignore le stade produit réel.

### 5. Affichage du double badge dans le Pôle Stratégique

Sur la fiche projet (`StrategicConsolePage.tsx`) :
- Badge stade produit (existant) à conserver.
- Ajouter un sous-libellé discret : "Maturité capital suggérée : pre-seed" (lien vers le BP/Invest).

### 6. Documentation mémoire

Créer `mem://logic/stage-taxonomy-bridge` :
- Définit les 2 taxonomies et leur rôle respectif.
- Documente le mapping produit → capital (auto-suggéré, non strict).
- Documente le filtrage tests MVP par stade.

Mettre à jour `mem://logic/mvp-test-filtering` pour ajouter `product_stage` comme 3e critère.

## Détails techniques

**Migration SQL** (1 seule) :
```sql
ALTER TABLE public.mvp_validator_projects
  ADD COLUMN IF NOT EXISTS product_stage text
  CHECK (product_stage IN ('idee','prototype','mvp','traction'));
```

**Fichiers touchés** :
- `src/pages/StrategicConsolePage.tsx` — fix `stageMap`, badge capital suggéré, passage `product_stage` à l'import
- `src/pages/MvpValidatorPage.tsx` — auto-suggestion `startupStage` depuis `product_stage`
- `src/components/mvp-validator/MvpTestsLibrary.tsx` — filtre stage + toggle "Voir tous"
- `src/utils/mvpTestFilter.ts` — ajouter paramètre `productStage` et map phase→stage
- `src/components/strategic/StartupStageSelector.tsx` — accepter prop `suggestedFrom` pour afficher d'où vient la suggestion
- Migration DB + maj mémoires

**Hors scope** :
- Pas de refonte du `StartupStageSelector` 6-stades.
- Pas de migration de données rétroactive (les projets existants gardent `null` en `product_stage`, le filtre montre tous les tests par défaut).
- Pas de changement UX sur la fiche projet startupeur (Mission Control) — seulement consommation lecture.

## Validation

- Importer un projet `idee` → MVP Validator doit créer un scénario A et ne montrer que les tests Problem-Solution Fit.
- Importer un projet `traction` → scénario B, tests Scale, `startupStage` BP pré-rempli à `serie-a` (modifiable).
- Le badge "Maturité capital suggérée" doit apparaître dans le Pôle Stratégique.
