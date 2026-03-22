
-- Module 4: MVP Metrics table
CREATE TABLE public.mvp_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  cac NUMERIC DEFAULT 0,
  ltv NUMERIC DEFAULT 0,
  churn_rate NUMERIC DEFAULT 0,
  mrr NUMERIC DEFAULT 0,
  nps INTEGER DEFAULT 0,
  burn_rate NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  users_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mvp_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own metrics" ON public.mvp_metrics FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_metrics.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_metrics.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all metrics" ON public.mvp_metrics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Module 5: Team members table
CREATE TABLE public.mvp_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'developer',
  skills JSONB NOT NULL DEFAULT '{}',
  availability_percent INTEGER NOT NULL DEFAULT 100,
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mvp_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own team" ON public.mvp_team_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_team_members.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_team_members.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all teams" ON public.mvp_team_members FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
