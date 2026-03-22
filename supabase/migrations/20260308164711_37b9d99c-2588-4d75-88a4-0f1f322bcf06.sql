
-- Table: tech_integrations - Inventaire des intégrations du MVP
CREATE TABLE public.tech_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  integration_type TEXT NOT NULL DEFAULT 'api_metier',
  base_url TEXT,
  connection_status TEXT NOT NULL DEFAULT 'not_tested',
  criticality TEXT NOT NULL DEFAULT 'important',
  last_tested_at TIMESTAMPTZ,
  notes TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tech_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own integrations" ON public.tech_integrations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = tech_integrations.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = tech_integrations.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all integrations" ON public.tech_integrations
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Table: api_test_logs - Historique des tests API
CREATE TABLE public.api_test_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.tech_integrations(id) ON DELETE CASCADE,
  method TEXT NOT NULL DEFAULT 'GET',
  url TEXT NOT NULL,
  request_headers JSONB DEFAULT '{}',
  request_body TEXT,
  response_status INTEGER,
  response_time_ms INTEGER,
  response_body TEXT,
  tested_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.api_test_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own api logs" ON public.api_test_logs
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tech_integrations ti
    JOIN mvp_validator_projects p ON p.id = ti.project_id
    WHERE ti.id = api_test_logs.integration_id AND p.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM tech_integrations ti
    JOIN mvp_validator_projects p ON p.id = ti.project_id
    WHERE ti.id = api_test_logs.integration_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all api logs" ON public.api_test_logs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Table: tech_checklist_items - Checklists d'intégration
CREATE TABLE public.tech_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  checked_by UUID,
  checked_at TIMESTAMPTZ,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tech_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checklist items" ON public.tech_checklist_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = tech_checklist_items.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = tech_checklist_items.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all checklist items" ON public.tech_checklist_items
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
