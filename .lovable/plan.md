# Plan — Roadmap Startup + Deal Room

Deux chantiers livrés en 1 migration unique, puis UI.

## Chantier A — Roadmap interactif 5 phases

### Base de données (1 table)
- `startup_journey_progress` : `user_id`, `phase_id` (1-5), `milestone_id` (text), `completed`, `completed_at`, `metadata jsonb`
  - Unique (user_id, phase_id, milestone_id)
  - RLS : user gère ses lignes, admin lit tout

### Frontend (`/roadmap`)
- `RoadmapPage.tsx` : timeline horizontale scrollable (overflow-x), 5 `PhaseCard` côte à côte
- Phases avec gradients sémantiques (purple→blue→green→orange→gold) définis dans `index.css`
- Chaque phase : icône emoji, titre, % progression (barre), liste milestones cochables, badge Locked/Unlocked
- Logique unlock : phase N+1 déverrouillée quand phase N à 100%
- `framer-motion` pour transitions cartes + `canvas-confetti` au passage 100% d'une phase
- Données milestones/outils définis en constante locale (FR), pas en base
- Liens "Tools" vers routes existantes (BMC builder, pitch deck, KPI tracker) ou placeholders

### Contenu phases
1. **Idéation** 💡 — validation problème, BMC, étude marché, concurrence
2. **Pré-incubation** 🛠️ — MVP, équipe, structure légale (SUARL/SA/Startup Act), interviews
3. **Incubation** 🚀 — PMF, premier CA, 8 mentor sessions, KPI dashboard, deck investisseur
4. **Accélération** ⚡ — scale équipe, Series A, export, partenariats CEPEX
5. **Alumni & Impact** 🌟 — contribution, mentoring junior, levée complétée

## Chantier B — Deal Room sécurisé

### Base de données
- Bucket Storage `deal-room-documents` (privé, signed URLs uniquement)
- Table `deal_room_documents` : `user_id`, `startup_id` (nullable), `category` (financials/legal/pitch/team/traction), `name`, `file_path`, `file_size`, `mime_type`, `visibility` (private/program/investor), `status` (draft/complete/verified), `expires_at`, `allow_download`, `watermark_enabled`, `nda_required`
- Table `deal_room_access_log` : `document_id`, `viewer_id`, `viewer_email`, `ip_address`, `user_agent`, `action` (view/download), `created_at`
- Table `deal_room_nda_acceptances` : `document_id`, `user_id`, `accepted_at`, `ip_address`
- Table `deal_room_share_links` : `document_id`, `token` (unique), `password_hash` (nullable), `expires_at`, `created_by`
- RLS strictes :
  - `deal_room_documents` SELECT : owner OR (visibility='investor' AND has_role('investor')) OR (visibility='program' AND has_role('admin'))
  - Log accès en INSERT-only pour utilisateurs ayant droit de vue
  - Storage policies : seul owner upload/delete, lecture via signed URL côté Edge Function

### Edge Functions
- `dealroom-signed-url` : vérifie droits, log accès, retourne signed URL (60s), applique watermark si PDF
- `dealroom-share-link` : valide token + password + expiry, log accès anonyme

### Frontend (`/deal-room`)
- `DealRoomPage.tsx` : layout Notion/Dropbox-like
  - Sidebar catégories (5 icônes)
  - Zone principale : drag-drop upload (`react-dropzone` déjà ou input natif), grille fichiers
  - Carte document : preview, badge statut, toggle visibilité (3 options), menu actions (partage, expiration, NDA, watermark, supprimer)
  - Modal "Qui a consulté" : table logs (viewer, action, date, IP)
  - Modal "Générer lien" : password optionnel, expiry, copie 2 clics
- Vue investor/program : filtrage automatique selon `has_role`, bouton download masqué si `allow_download=false`

## Ordre d'exécution
1. **Migration unique** (table roadmap + 4 tables deal room + bucket + RLS + policies storage)
2. **Edge functions** dealroom (signed URL + share link)
3. **UI Roadmap** (1 page + composants PhaseCard)
4. **UI Deal Room** (page + composants Upload/DocCard/AccessLog/ShareLink)
5. Ajout routes dans `App.tsx` + liens depuis Mission Control sidebar
6. Mise à jour `mem://index.md` (nouvelle feature)

## Décisions par défaut (sans questions bloquantes)
- Roadmap accessible à tous les utilisateurs connectés (pas seulement startupers)
- Deal Room réservé aux `role_type='startuper'` (rédaction) ; investisseurs/admins en lecture filtrée
- Watermark : overlay client-side sur preview PDF (pas de re-stamping serveur du PDF — performance) ; mention nom/email visible
- Confetti via `canvas-confetti` (lib légère ~2kB)
- Pas de notification email lors d'un accès (peut être ajouté plus tard)
