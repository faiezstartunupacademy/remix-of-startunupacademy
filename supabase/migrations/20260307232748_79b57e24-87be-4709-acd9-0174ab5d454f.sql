
-- Table hypotheses
CREATE TABLE public.mvp_hypotheses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'risque_marché',
  description TEXT NOT NULL,
  test_method TEXT,
  validation_status TEXT NOT NULL DEFAULT 'non_testé',
  confidence_score INTEGER NOT NULL DEFAULT 0,
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table features
CREATE TABLE public.mvp_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'core',
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  tested BOOLEAN NOT NULL DEFAULT false,
  test_result TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table personas
CREATE TABLE public.mvp_personas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_early_adopter BOOLEAN NOT NULL DEFAULT false,
  interviews_done INTEGER NOT NULL DEFAULT 0,
  interviews_target INTEGER NOT NULL DEFAULT 30,
  conversion_rate NUMERIC NOT NULL DEFAULT 0,
  satisfaction_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.mvp_hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvp_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvp_personas ENABLE ROW LEVEL SECURITY;

-- Hypotheses policies
CREATE POLICY "Users can manage own hypotheses" ON public.mvp_hypotheses FOR ALL
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_hypotheses.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_hypotheses.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all hypotheses" ON public.mvp_hypotheses FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Features policies
CREATE POLICY "Users can manage own features" ON public.mvp_features FOR ALL
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_features.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_features.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all features" ON public.mvp_features FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Personas policies
CREATE POLICY "Users can manage own personas" ON public.mvp_personas FOR ALL
  USING (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_personas.project_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM mvp_validator_projects WHERE id = mvp_personas.project_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage all personas" ON public.mvp_personas FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
