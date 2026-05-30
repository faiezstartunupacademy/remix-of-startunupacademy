# Mission Control multi-rôles

## Objectif
Permettre à un utilisateur de cumuler plusieurs rôles (`startuper`, `mentor`, `investor`, `incubator`) et de basculer entre eux dans Mission Control via un sélecteur, avec mémorisation du dernier rôle utilisé.

---

## 1. Base de données

Nouvelle table `user_role_types` :
- `user_id` (uuid, FK profiles)
- `role_type` (enum `user_role_type` existant)
- `is_primary` (bool, un seul TRUE par user)
- `activated_at` (timestamptz)
- PK composite `(user_id, role_type)`

RLS : l'utilisateur lit/écrit ses propres lignes ; admin lit tout.

GRANTS : `SELECT/INSERT/UPDATE/DELETE` à `authenticated`, `ALL` à `service_role`.

**Migration de données** : copier `profiles.role_type` actuel comme ligne `is_primary=true` pour chaque profil existant. `profiles.role_type` reste comme rôle actif courant (synchronisé côté client).

Trigger : à l'ajout d'une ligne avec `role_type='mentor'`, créer automatiquement la fiche dans `mentors` (réutilise la logique existante de `MentorsPage`).

---

## 2. Hook & contexte

`src/hooks/useUserRoles.ts` :
- Charge tous les rôles de l'utilisateur connecté.
- Expose `roles`, `activeRole`, `setActiveRole(role)`, `addRole(role)`, `removeRole(role)`.
- `activeRole` lu depuis `localStorage` (clé `mc_active_role`), fallback sur le rôle `is_primary`.
- Met à jour `profiles.role_type` quand l'utilisateur change de rôle actif.

---

## 3. Mission Control — refonte

`src/pages/MissionControl.tsx` :
- Header : sélecteur de casquette (dropdown shadcn) affichant les rôles actifs de l'utilisateur, badge sur le rôle primaire, lien "Ajouter un rôle" vers `/profil/roles`.
- Strip KPI transverse en permanence (notifications, conformité, badges) — affiché quel que soit le rôle.
- Body : rendu conditionnel selon `activeRole` :
  - `startuper` → vue actuelle (KPIs projet, modules, actions recommandées)
  - `mentor` → embed du contenu de `MentorDashboard`
  - `investor` → embed des sections clés de `InvestPage` (pipeline, watchlist)
  - `incubator` → embed des analytics cohorte + candidatures

Extraire chaque vue en composant `src/components/mission-control/views/{Startuper,Mentor,Investor,Incubator}View.tsx` pour réutilisation et garder MissionControl léger.

Les routes existantes (`/mentor-dashboard`, `/coach-dashboard`, `InvestPage`) restent comme deep-links.

---

## 4. Page de gestion des rôles

Nouvelle page `/profil/roles` (`src/pages/UserRolesPage.tsx`) :
- Liste les 4 rôles disponibles avec description courte de ce qu'ils débloquent.
- Toggle actif/inactif pour chaque rôle (libre, sans validation admin).
- Marquer un rôle comme primaire.
- Avertissement contextuel : retirer le rôle `mentor` désactive la fiche annuaire (soft-delete, pas suppression).

Lien depuis : menu profil header, et depuis le switcher de Mission Control.

---

## 5. Onboarding

`OnboardingPage` reste inchangé pour la première inscription (un seul rôle choisi = primaire). L'utilisateur ajoute ensuite d'autres rôles via `/profil/roles`.

---

## Détails techniques

- Routing : aucune nouvelle route protégée — la sélection de rôle est cliente.
- i18n : ajouter clés FR/AR pour le switcher, la page roles, les labels de chaque vue.
- Mobile : sélecteur de rôle dans le drawer / bottom-sheet sur petits écrans.
- Notifications : aucune modification, déjà transverses.

## Fichiers impactés

**Créés**
- `src/hooks/useUserRoles.ts`
- `src/pages/UserRolesPage.tsx`
- `src/components/mission-control/RoleSwitcher.tsx`
- `src/components/mission-control/views/StartuperView.tsx`
- `src/components/mission-control/views/MentorView.tsx`
- `src/components/mission-control/views/InvestorView.tsx`
- `src/components/mission-control/views/IncubatorView.tsx`

**Modifiés**
- `src/pages/MissionControl.tsx` (refonte légère en hub multi-vues)
- `src/App.tsx` (route `/profil/roles`)
- `src/components/Header.tsx` (lien profil → /profil/roles)
- `src/i18n/locales/{fr,ar}.json`

**Migration SQL**
- Création `user_role_types` + GRANTs + RLS + trigger mentor + seed depuis `profiles.role_type`.
