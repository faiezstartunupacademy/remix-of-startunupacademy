
-- ============================================
-- 1. PROFILE FIELDS for onboarding + role
-- ============================================
DO $$ BEGIN
  CREATE TYPE public.user_role_type AS ENUM ('startuper', 'mentor', 'investor', 'incubator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role_type public.user_role_type,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_step integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wilaya text,
  ADD COLUMN IF NOT EXISTS team_size integer,
  ADD COLUMN IF NOT EXISTS problem_statement text,
  ADD COLUMN IF NOT EXISTS startup_name text,
  ADD COLUMN IF NOT EXISTS startup_sector text,
  ADD COLUMN IF NOT EXISTS startup_stage text,
  ADD COLUMN IF NOT EXISTS expertise_domain text,
  ADD COLUMN IF NOT EXISTS investment_thesis text,
  ADD COLUMN IF NOT EXISTS program_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS bio text;

-- ============================================
-- 2. DATA ACCESS LOG (RGPD/INPDP art. 32-37)
-- ============================================
CREATE TABLE IF NOT EXISTS public.data_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  accessed_by uuid,
  access_type text NOT NULL,
  resource_type text,
  resource_id text,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own access log" ON public.data_access_log
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all access logs" ON public.data_access_log
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System and users can insert" ON public.data_access_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR auth.uid() = accessed_by);

CREATE INDEX IF NOT EXISTS idx_data_access_log_user ON public.data_access_log(user_id, created_at DESC);

-- ============================================
-- 3. ACCOUNT DELETION REQUESTS (30-day grace)
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  scheduled_deletion_at timestamptz NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  cancelled_at timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own deletion request" ON public.account_deletion_requests
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all deletion requests" ON public.account_deletion_requests
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 4. MENTORING SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.mentoring_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mentor_name text NOT NULL,
  mentor_email text,
  topic text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text NOT NULL DEFAULT 'scheduled',
  meet_link text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions" ON public.mentoring_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all sessions" ON public.mentoring_sessions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER mentoring_sessions_updated_at
  BEFORE UPDATE ON public.mentoring_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. STARTUP DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.startup_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  doc_type text NOT NULL,
  doc_name text NOT NULL,
  file_url text,
  file_size_bytes bigint,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.startup_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own docs" ON public.startup_documents
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all docs" ON public.startup_documents
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
