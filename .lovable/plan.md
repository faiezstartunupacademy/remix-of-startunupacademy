## Objectif

Clarifier et renforcer le flux d'inscription / 1ère connexion Google pour qu'un utilisateur :
1. Choisisse **un seul rôle principal** lors de l'onboarding (mono-rôle obligatoire).
2. Découvre **après** comment cumuler d'autres casquettes via `/profil/roles` et le switcher Mission Control.

L'architecture multi-rôles (`user_role_types`, `useUserRoles`, RoleSwitcher, page `/profil/roles`) existe déjà. Ce plan ne crée **aucune nouvelle table** — il renforce l'UX d'onboarding et la pédagogie autour du cumul.

---

## 1. Onboarding mono-rôle (email + Google identiques)

`src/pages/OnboardingPage.tsx` (existant) :
- Vérifier que la page est bien déclenchée pour les comptes Google sans `profiles.role_type` (sinon, ajouter redirection depuis `useAuth` ou un guard dans `App.tsx`).
- Garder l'écran actuel de sélection unique de rôle (radios : Startuper / Mentor / Investisseur / Incubateur).
- Au submit :
  - `profiles.role_type` ← rôle choisi.
  - `user_role_types` ← INSERT avec `is_primary = true` (s'il n'existe pas déjà — la migration le crée pour les comptes pré-existants, mais pas pour les nouveaux signups).
  - `localStorage['mc_active_role']` ← rôle choisi.
- Ajouter en bas de l'écran une **note pédagogique** : « Vous pourrez activer d'autres casquettes (mentor, investisseur, incubateur) à tout moment depuis votre profil. »

## 2. Hook côté création de compte

`src/hooks/handle_new_user` côté DB : le trigger existant ne crée que `profiles` + `user_roles`. Ajouter dans la même fonction (ou dans le submit de l'OnboardingPage) la création de la ligne `user_role_types` correspondante quand `role_type` est défini, avec `is_primary = true`.

→ Décision : faire ça **dans OnboardingPage** (pas dans le trigger), car le rôle n'est pas connu au moment du signup auth — il est choisi après. Donc OnboardingPage devient l'endroit unique qui synchronise `profiles.role_type` + `user_role_types`.

## 3. Google 1ère connexion = même onboarding

- Après `lovable.auth.signInWithOAuth("google", …)`, le callback ramène sur `/` ou `/mission-control`.
- Ajouter un guard dans `App.tsx` (ou dans `MissionControl.tsx`) : si l'utilisateur est authentifié et que `profiles.role_type IS NULL`, rediriger vers `/onboarding`.
- Ainsi l'expérience email vs Google est identique : compte créé → onboarding → choix mono-rôle → Mission Control.

## 4. Pédagogie post-onboarding pour le cumul de rôles

Ajouter 2 nudges discrets pour que l'utilisateur découvre la fonctionnalité multi-rôles :

**a. Tooltip "Did you know" dans le RoleSwitcher (1ère visite)**
- À l'ouverture de Mission Control si `user_role_types.count = 1`, afficher une bulle d'info (Popover shadcn) à côté du RoleSwitcher : « Vous portez plusieurs casquettes ? Ajoutez-les depuis Gérer mes rôles. »
- Dismissible, mémorisé via `localStorage['mc_multirole_hint_seen']`.

**b. Carte "Vos autres casquettes" dans le profil**
- Sur la page Profil (ou en bas de Mission Control si pas de page profil dédiée), petite carte listant les 3 rôles non activés avec un CTA « Activer » → redirige vers `/profil/roles`.

## 5. Page `/profil/roles` (existante) — renforcement copy

- Ajouter un bandeau en haut : « Comment fonctionnent les rôles ? » expliquant en 3 lignes que :
  - Le rôle principal détermine la vue par défaut de Mission Control.
  - Vous pouvez basculer entre vos rôles à tout moment via le sélecteur en haut.
  - Activer/désactiver un rôle ne supprime jamais vos données.

---

## Fichiers impactés

**Modifiés**
- `src/pages/OnboardingPage.tsx` — synchroniser `user_role_types` au submit + note pédagogique.
- `src/App.tsx` ou `src/hooks/useAuth.ts` — guard `role_type IS NULL` → `/onboarding` (couvre Google).
- `src/pages/MissionControl.tsx` — Popover de découverte multi-rôles si 1 seul rôle actif.
- `src/pages/UserRolesPage.tsx` — bandeau pédagogique en tête de page.

**Aucune migration SQL** — la table `user_role_types` et ses triggers existent déjà.

---

## Réponse à votre question (pour mémoire)

- **Inscription / 1ère connexion Google** : 1 seul rôle est choisi pendant l'onboarding → devient le rôle **principal**.
- **Cumul** : se fait **après**, librement, depuis le switcher Mission Control → « Gérer mes rôles » → `/profil/roles`. Activer le rôle Mentor crée automatiquement la fiche annuaire (trigger DB existant).
- **Pas de validation admin** requise pour ajouter un rôle (libre).
