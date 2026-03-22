
-- 1. incubation_projects
CREATE TABLE public.incubation_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  stage TEXT,
  problem_description TEXT,
  solution_description TEXT,
  target_customers TEXT,
  business_model TEXT,
  competitors TEXT[],
  differentiator TEXT,
  has_users BOOLEAN DEFAULT FALSE,
  user_count INTEGER DEFAULT 0,
  has_revenue BOOLEAN DEFAULT FALSE,
  revenue_amount DECIMAL DEFAULT 0,
  current_step INTEGER DEFAULT 1,
  overall_progress DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. incubation_steps
CREATE TABLE public.incubation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.incubation_projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'locked',
  ai_report_status TEXT DEFAULT 'not_started',
  ai_report_content JSONB,
  ai_report_score DECIMAL,
  gate_status TEXT DEFAULT 'not_ready',
  gate_criteria TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, step_number),
  CONSTRAINT step_number_range CHECK (step_number >= 1 AND step_number <= 7)
);

-- 3. mvp_tests
CREATE TABLE public.mvp_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES public.incubation_steps(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.incubation_projects(id) ON DELETE CASCADE,
  test_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  objective TEXT NOT NULL,
  protocol JSONB,
  target_metrics JSONB,
  recommended_tools TEXT[],
  status TEXT DEFAULT 'not_started',
  qualitative_result TEXT,
  quantitative_result DECIMAL,
  quantitative_unit TEXT,
  attachments TEXT[],
  executed_at TIMESTAMPTZ,
  ai_verdict JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. incubation_reports
CREATE TABLE public.incubation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.incubation_projects(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.incubation_steps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_score DECIMAL,
  test_data JSONB,
  status TEXT DEFAULT 'draft',
  exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. knowledge_base_tests
CREATE TABLE public.knowledge_base_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_number INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phase TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  detailed_protocol JSONB,
  target_metrics JSONB,
  recommended_tools TEXT[],
  tags TEXT[],
  applicable_sectors TEXT[],
  difficulty_level TEXT,
  estimated_duration TEXT,
  associated_step INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. incubation_activities
CREATE TABLE public.incubation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES public.incubation_projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.incubation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvp_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_activities ENABLE ROW LEVEL SECURITY;

-- RLS: incubation_projects
CREATE POLICY "Users can view own projects" ON public.incubation_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.incubation_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.incubation_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.incubation_projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage incubation projects" ON public.incubation_projects FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: incubation_steps (via project owner)
CREATE POLICY "Users can view own steps" ON public.incubation_steps FOR SELECT USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own steps" ON public.incubation_steps FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own steps" ON public.incubation_steps FOR UPDATE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own steps" ON public.incubation_steps FOR DELETE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage incubation steps" ON public.incubation_steps FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: mvp_tests (via project owner)
CREATE POLICY "Users can view own tests" ON public.mvp_tests FOR SELECT USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own tests" ON public.mvp_tests FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own tests" ON public.mvp_tests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own tests" ON public.mvp_tests FOR DELETE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage mvp tests" ON public.mvp_tests FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: incubation_reports (via project owner)
CREATE POLICY "Users can view own reports" ON public.incubation_reports FOR SELECT USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own reports" ON public.incubation_reports FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own reports" ON public.incubation_reports FOR UPDATE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own reports" ON public.incubation_reports FOR DELETE USING (EXISTS (SELECT 1 FROM public.incubation_projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage incubation reports" ON public.incubation_reports FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: knowledge_base_tests (read-only for all authenticated)
CREATE POLICY "Authenticated can view knowledge base" ON public.knowledge_base_tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base_tests FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: incubation_activities
CREATE POLICY "Users can view own activities" ON public.incubation_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.incubation_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage activities" ON public.incubation_activities FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER update_incubation_projects_updated_at BEFORE UPDATE ON public.incubation_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incubation_steps_updated_at BEFORE UPDATE ON public.incubation_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mvp_tests_updated_at BEFORE UPDATE ON public.mvp_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incubation_reports_updated_at BEFORE UPDATE ON public.incubation_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
