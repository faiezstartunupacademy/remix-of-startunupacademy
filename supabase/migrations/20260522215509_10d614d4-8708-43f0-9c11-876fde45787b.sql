
-- Funding programs catalog (Smart Capital, PNSI, Flat6Labs, Startup Act, etc.)
CREATE TABLE public.funding_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization text NOT NULL,
  type text NOT NULL, -- grant, equity, debt, incubator, accelerator, competition, label
  country text NOT NULL DEFAULT 'TN',
  sectors text[] DEFAULT '{}',
  stages text[] DEFAULT '{}', -- ideation, prototype, mvp, traction, growth
  min_amount_tnd numeric,
  max_amount_tnd numeric,
  equity_required boolean DEFAULT false,
  duration_months integer,
  description text,
  eligibility text,
  benefits text,
  application_url text,
  contact_email text,
  logo_url text,
  deadline timestamptz,
  is_rolling boolean DEFAULT false,
  is_active boolean DEFAULT true,
  difficulty text DEFAULT 'medium', -- easy, medium, hard
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funding_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone auth can view active programs"
ON public.funding_programs FOR SELECT TO authenticated
USING (is_active = true);

CREATE POLICY "Admins manage funding programs"
ON public.funding_programs FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_funding_programs_updated
BEFORE UPDATE ON public.funding_programs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Applications (kanban tracker per user)
CREATE TABLE public.funding_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_id uuid,
  program_id uuid REFERENCES public.funding_programs(id) ON DELETE SET NULL,
  custom_program_name text, -- if not in catalog
  status text NOT NULL DEFAULT 'shortlist', -- shortlist, preparing, submitted, interview, accepted, rejected, withdrawn
  priority text DEFAULT 'medium',
  amount_requested_tnd numeric,
  amount_awarded_tnd numeric,
  submission_date date,
  decision_date date,
  next_action text,
  next_action_date date,
  notes text,
  documents_ready boolean DEFAULT false,
  match_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own applications"
ON public.funding_applications FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all applications"
ON public.funding_applications FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_funding_applications_updated
BEFORE UPDATE ON public.funding_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_funding_apps_user ON public.funding_applications(user_id, status);

-- Events (journal d'activité par candidature)
CREATE TABLE public.funding_application_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.funding_applications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  event_type text NOT NULL, -- status_change, note, document_uploaded, meeting, email
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funding_application_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own app events"
ON public.funding_application_events FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
