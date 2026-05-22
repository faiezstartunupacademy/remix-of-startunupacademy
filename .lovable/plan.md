# Plan de mise en conformité INPDP (loi tunisienne 2004-63) & GDPR

Objectif : implémenter en une itération un socle complet de protection des données utilisateurs, conforme à la loi tunisienne n°2004-63 (INPDP) et au RGPD européen.

Le travail est volumineux. Je propose de le découper en **4 lots** livrés successivement (un lot = une réponse). Si vous validez ce plan, je commence par le **Lot 1 (Consentement + pages légales + badge)** qui est le plus visible utilisateur, puis j'enchaîne automatiquement les lots 2, 3, 4.

---

## Lot 1 — Consentement & transparence (visible utilisateur)

**Base de données**
- Table `user_consents` : `user_id`, `consent_type` (cookies_essential / cookies_analytics / cookies_marketing / data_processing / terms / privacy), `granted` (bool), `version`, `granted_at`, `withdrawn_at`, `ip_address`, `user_agent`. RLS : user voit/gère le sien, admins lisent tout.
- Table `legal_documents` : `slug` (terms / privacy / cookies), `locale` (fr/ar), `version`, `content` (markdown), `published_at`. Lecture publique, écriture admin.

**Frontend**
- `CookieConsentBanner.tsx` (bas d'écran, FR/AR via i18n) avec 4 boutons : Tout accepter / Tout refuser / Personnaliser / Politique. Modale granulaire (essentiel verrouillé, analytics, marketing). Stockage : `localStorage` + table `user_consents` si connecté.
- Pages `/legal/terms`, `/legal/privacy`, `/legal/cookies` (FR + AR), avec sélecteur de langue.
- `AuthPage.tsx` : ajouter case à cocher obligatoire « J'accepte les CGU et la Politique de confidentialité » + case explicite « Je consens au traitement de mes données personnelles » avant inscription.
- Section profil `MonConsentement.tsx` : tableau des consentements actifs, bouton retirer/réactiver.
- Badge `TrustBadge.tsx` « Données Protégées - Conforme INPDP 🇹🇳 » affiché dans `Footer.tsx`.

---

## Lot 2 — Centre des droits de données (RGPD art. 15-17, INPDP art. 32-37)

**Base de données**
- Table `data_access_log` : `user_id` (cible), `accessed_by` (acteur), `access_type` (view/export/admin_view), `resource_type`, `ip_address`, `created_at`. RLS : user voit les accès à ses données, admins voient tout. Purge auto >90j (trigger ou cron).
- Table `account_deletion_requests` : `user_id`, `requested_at`, `scheduled_deletion_at` (+30j), `cancelled_at`, `reason`. RLS user.
- Edge function `export-user-data` : agrège toutes les tables liées au `user_id` (profiles, incubation_projects, marketplace_*, forum_*, etc.), retourne un ZIP de JSON.
- Edge function `request-account-deletion` : crée la demande + email confirmation, soft-flag du compte.

**Frontend**
- Page `/profil/donnees` (`DataRightsCenter.tsx`) avec 4 sections :
  1. Télécharger mes données (bouton → appel edge function → download ZIP)
  2. Supprimer mon compte (modale double confirmation, mention délai 30j, possibilité d'annuler)
  3. Journal d'accès (90 derniers jours, qui/quand/quoi)
  4. Durées de conservation (tableau statique par type de donnée)

---

## Lot 3 — Durcissement sécurité

**Base de données**
- Table `login_attempts` : `email`, `ip_address`, `success` (bool), `attempted_at`. Index sur (email, attempted_at).
- Table `user_sessions_meta` : `user_id`, `session_id`, `ip_address`, `user_agent`, `location_country`, `last_active_at`, `created_at`. RLS user.
- Fonction RPC `check_login_rate_limit(_email, _ip)` : compte les échecs des 15 dernières minutes, retourne `{allowed, retry_after}`. Seuil : 5 tentatives.

**Frontend / Auth**
- `AuthPage.tsx` :
  - Indicateur de force du mot de passe (min 10 car., maj+min+chiffre+spécial) via `zxcvbn`-light maison.
  - Avant `signInWithPassword` : appel `check_login_rate_limit`. Sur échec : log dans `login_attempts`.
  - Email verification obligatoire (désactiver `auto_confirm`, gate l'app derrière `email_confirmed_at`).
- Composant `MfaSetup.tsx` (existe déjà — l'intégrer) : page `/profil/securite` avec :
  - Activation TOTP via `supabase.auth.mfa.enroll({factorType:'totp'})` + QR code.
  - Liste des sessions actives + bouton « Déconnecter cet appareil » et « Déconnecter tous les appareils » (`supabase.auth.signOut({scope:'others'})`).

---

## Lot 4 — Dashboard admin sécurité

**Frontend** (nouvel onglet « Sécurité » dans `AdminDashboard.tsx`)
- `SecurityDashboard.tsx` :
  - Utilisateurs actifs en temps réel (Realtime sur `user_sessions_meta`).
  - Tableau des tentatives échouées (24h / 7j) avec filtre IP/email.
  - Alertes activité suspecte : règle simple côté SQL (vue `suspicious_activity_v`) — même user >3 IPs distinctes en 1h, ou >10 échecs/15min/IP.
  - Bouton « Export INPDP » : génère un CSV récapitulatif (utilisateurs, consentements, demandes de suppression, journal d'accès) sur période choisie.

---

## Détails techniques transverses

- i18n : tous les textes FR + AR (mise à jour de `src/i18n/locales/fr.json` et `ar.json`).
- RLS stricte sur **toutes** les nouvelles tables. Pas de `auth.users` en FK directe (pattern existant respecté).
- Lovable AI non requise pour ces lots.
- Edge functions : `export-user-data`, `request-account-deletion`, `admin-export-inpdp`. Toutes avec validation Zod + CORS.
- Documents légaux : je fournirai des **gabarits** FR/AR conformes INPDP+RGPD ; vous devrez les faire valider juridiquement avant production (mention dans l'UI admin).
- Memory : je sauvegarderai les règles clés (INPDP compliance, 30j grace period, 5/15min rate limit, MFA TOTP) dans `mem://` pour les futures sessions.

---

## Question avant de démarrer

Je commence par le **Lot 1** dès validation. Confirmez-vous :
1. L'ordre Lot 1 → 2 → 3 → 4 ?
2. Les gabarits de CGU/Politique seront des **modèles à valider juridiquement** (je ne suis pas avocat) ?
3. OK pour rendre la vérification email **obligatoire** (impact : les comptes existants non vérifiés devront vérifier) ?