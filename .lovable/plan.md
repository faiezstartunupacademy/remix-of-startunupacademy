## Plan — 3 chantiers à enchaîner

### Chantier A — Lot 2 RGPD/INPDP (Centre des droits)
**DB**: 
- `data_access_log` (user_id, accessed_by, access_type, resource_type, ip, ua, created_at) + RLS (user voit le sien, admin voit tout)
- `account_deletion_requests` (user_id, reason, status, requested_at, scheduled_deletion_at +30j, confirmed_at)
- Trigger `log_data_access()` optionnel sur tables sensibles

**Edge functions**:
- `export-user-data` → agrège profiles, incubation_projects, mvp_validator_projects, marketplace_*, consentements → renvoie ZIP JSON
- `request-account-deletion` → crée demande, envoie mail confirmation, soft-flag profile

**Frontend**: `/profil/donnees` (DataRightsCenter.tsx) avec 4 sections : télécharger mes données, supprimer mon compte (modal confirmation), journal d'accès (90j), info rétention.

---

### Chantier B — Onboarding rôle-based
**DB**:
- Ajouter à `profiles`: `role_type` ('startuper'|'mentor'|'investor'|'incubator'), `onboarding_completed` bool, `onboarding_step` int, `wilaya`, `team_size`, `problem_statement`, `startup_name`, `startup_sector`, `startup_stage`, `expertise_domain`, `investment_thesis`, `program_name`
- Trigger handle_new_user déjà existant — pas de modif

**Frontend**:
- `RoleSelectionScreen.tsx` — 4 cartes animées (Framer Motion), gradients, hover scale
- `OnboardingWizard.tsx` orchestrateur avec progress bar
- `StartuperProfileForm.tsx` (nom, secteur dropdown 7 secteurs prio, stage, 24 wilayas, team size, problème)
- `MentorProfileForm.tsx`, `InvestorProfileForm.tsx`, `IncubatorProfileForm.tsx` (versions simples)
- Route `/onboarding` — redirect après signup si `onboarding_completed=false`
- Google OAuth via `lovable.auth.signInWithOAuth("google")` ajouté à AuthPage

---

### Chantier C — Mission Control Dashboard
**Route**: `/mission-control` (réservé `role_type='startuper'`)

**Composants**:
- `MissionControl.tsx` — layout sidebar + main (utilise shadcn sidebar)
- `MissionControlSidebar.tsx` — 8 liens icônes (Parcours, Dossier, Programmes, Équipe, Mentorat, Financement, Alumni, Paramètres)
- `HealthScoreGauge.tsx` — Recharts RadialBarChart 0-100, calcul côté client à partir de :
  - profil complet, programmes, sessions mentorat, milestones, docs
- `NextStepCard.tsx` — CTA prochaine action (heuristique selon health score)
- `ProgramProgressTimeline.tsx` — barre + milestones
- `UpcomingSessionsWidget.tsx` — calendrier sessions (table à créer : `mentoring_sessions`)
- `NotificationsFeed.tsx` — réutilise NotificationBell data
- `RecommendedResources.tsx` — selon `startup_stage`

**Tables nouvelles** (minimales) :
- `mentoring_sessions` (user_id, mentor_name, scheduled_at, status, meet_link)
- `startup_documents` (user_id, doc_type, file_url, uploaded_at)

Health score = somme pondérée des 5 critères, calculé à la volée via queries Supabase.

Animations Framer Motion : entrée des cartes en stagger, gauge animée.

---

### Ordre d'exécution
1. **Migration unique** regroupant : data_access_log + account_deletion_requests + profile fields + mentoring_sessions + startup_documents (RLS strict partout)
2. Edge functions Lot 2
3. UI Lot 2 (`/profil/donnees`)
4. Onboarding wizard + Google OAuth
5. Mission Control dashboard + sidebar

### Points à confirmer avant de coder
- OK pour migration unique (vs 3 séparées) ?
- Mission Control : OK de créer `mentoring_sessions` et `startup_documents` vides (l'utilisateur les remplira) ?
- Onboarding : si user existant déjà inscrit (sans `role_type`), on le force à passer par `/onboarding` au prochain login ?
- Google OAuth : j'utilise la solution managée Lovable Cloud (par défaut, aucune config requise) ?
