
## Objectif

Briser les silos entre les 2 modules amont (**Pôle Stratégique**, **MVP Validator**) et les 5 modules aval (**Market Intelligence**, **Marketplace**, **Deal Room**, **Financement**, **Mes Candidatures**) — sans casser l'autonomie de chaque page.

Approche : **hub de contexte projet léger** + **liens croisés ciblés** + **pré-remplissage automatique**.

---

## Diagnostic des liens manquants

```text
                   AMONT                            AVAL (5 modules)
        ┌──────────────────────┐         ┌─────────────────────────────────┐
        │ Pôle Stratégique     │ ──X──►  │ 1. Market Intel  (✓ partiel)    │
        │ (BM validé, stage,   │ ──X──►  │ 2. Marketplace   (auto incub.7) │
        │  secteur)            │ ──X──►  │ 3. Deal Room     (silo)         │
        │                      │ ──X──►  │ 4. Financement   (incub seul)   │
        │ MVP Validator        │ ──X──►  │ 5. Candidatures  (silo)         │
        │ (MVP score, traction)│         └─────────────────────────────────┘
        └──────────────────────┘
```

Aujourd'hui : `FundingPage` lit `incubation_projects` mais ignore `strategic_projects` et `mvp_validator_projects`. Deal Room et Candidatures ne consomment rien. Market Intel ne reçoit pas le secteur/stade automatiquement.

---

## Plan (5 livrables)

### 1. Hub "Contexte Projet" — `useProjectContext()`

Hook React unifié qui agrège, pour l'utilisateur courant, un objet :

```ts
{ projectId, name, sector, productStage, capitalStage,
  bmValidated, mvpScore, governorate, source: 'incubation'|'mvp'|'strategic' }
```

- Lit en parallèle `incubation_projects`, `mvp_validator_projects`, `strategic_projects`.
- Priorité : projet le plus récent ; sélecteur si plusieurs.
- Utilise `productStageToCapitalStage()` (déjà créé dans `stageTaxonomy.ts`).
- Cache via React Query.

### 2. Market Intelligence — pré-remplissage auto

`MarketIntelligencePage` consomme `useProjectContext()` pour :
- Préremplir le champ **secteur** dans TAM/SAM/SOM, SWOT, Benchmark.
- Afficher en haut un bandeau "Projet actif : *X* — secteur *Y* — stade *Z*".
- Bouton "Joindre ce rapport à mon projet" (déjà partiellement présent via `linked_strategic_action`, à généraliser).

### 3. Financement — matching multi-source

`FundingPage.computeMatchScore` étendu :
- Lit aussi `mvp_validator_projects.product_stage` (mappé en capital stage) et `strategic_projects`.
- Bonus +10 si **MVP validé** (score ≥ 60) pour programmes seed/série A.
- Bonus +10 si **BM validé** (Pôle phase 3+) pour programmes pre-seed/incubation.
- Bandeau "Profil détecté depuis : *MVP Validator / Pôle / Incubation*".

### 4. Marketplace & Deal Room — actions croisées

**Marketplace** (`StartupSubmitForm`) :
- Bouton "Pré-remplir depuis mon projet" qui injecte nom, secteur, stade, tagline, description, gouvernorat depuis le contexte.
- Auto-import existant (étape 7 incubation) conservé.

**Deal Room** (`DealRoomPage`) :
- Section "Documents suggérés" qui liste les artefacts générés en amont : rapports Market Intel archivés, Pitch Deck (Pôle), Business Plan (Pôle), rapport MVP (PDF), rapports incubation. Bouton "Joindre au Deal Room" (copie référence dans `deal_room_documents`).
- Verrou doux : badge "MVP non validé" (warning, pas blocage) si `mvpScore < seuil`.

### 5. Mes Candidatures — suivi enrichi

`FundingApplicationsPage` :
- Affiche, pour chaque candidature, le **stade du projet au moment du dépôt** (snapshot stocké).
- Filtre "Programmes éligibles à mon stade actuel" qui réutilise la logique de matching.
- Lien retour "Voir programmes pour mon stade" → `/financement?stage=auto`.

---

## Composant UI partagé : `<ProjectContextBadge />`

Petit badge réutilisable affiché en haut des 5 modules market :

```text
[🎯 Projet : NomX] [Secteur : SaaS] [Stade : MVP/Seed] [BM ✓] [MVP 72%]
```

Cliquable → ouvre un popover avec sélecteur si plusieurs projets.

---

## Détails techniques

**Fichiers à créer**
- `src/hooks/useProjectContext.ts`
- `src/components/shared/ProjectContextBadge.tsx`

**Fichiers à modifier**
- `src/pages/MarketIntelligencePage.tsx` — bandeau + préremplissage
- `src/components/market-intel/MarketToolsPanel.tsx` — accepter props `defaultSector`
- `src/pages/FundingPage.tsx` — élargir la lecture (mvp + strategic), bonus matching
- `src/pages/FundingApplicationsPage.tsx` — snapshot stage, filtre stade
- `src/components/marketplace/StartupSubmitForm.tsx` — bouton pré-remplir
- `src/pages/DealRoomPage.tsx` — section "Documents suggérés"

**Base de données (1 migration légère)**
- Ajout colonne `stage_at_submission TEXT` sur `funding_applications` (snapshot du stade lors du dépôt).
- Pas de nouvelle table : on agrège côté client via le hook.

**Pas de breaking change** : tous les modules continuent à fonctionner sans projet actif (le badge disparaît, les filtres deviennent neutres).

---

## Ce qui n'est PAS dans ce plan

- Pas de gating dur entre modules (vous avez préféré l'approche A souple, pas l'option C).
- Pas de hub central type "Mission Control v3" — réservé à un éventuel chantier B futur.
- Pas de refonte visuelle des 5 pages — uniquement ajout d'un badge + d'une logique.

---

## Critères d'acceptation

1. Sur un projet MVP avec `product_stage = mvp`, ouvrir `/financement` → la liste est triée par pertinence avec le badge "Profil détecté depuis MVP Validator".
2. Sur `/market-intelligence`, le champ secteur du TAM/SAM/SOM est pré-rempli avec le secteur du projet actif.
3. Sur `/marketplace/submit`, un bouton "Pré-remplir depuis mon projet" remplit instantanément 6+ champs.
4. Sur `/deal-room`, une section liste les rapports/PDFs déjà générés en amont, prêts à joindre.
5. Sur `/candidatures`, chaque ligne affiche le stade snapshotté + un filtre "éligibles à mon stade actuel" fonctionne.
