
-- MVP Validator projects table
CREATE TABLE public.mvp_validator_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL DEFAULT 'SaaS',
  scenario TEXT NOT NULL DEFAULT 'A',
  cofounders_count INTEGER DEFAULT 1,
  governorate TEXT,
  sso TEXT,
  incubation_program TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mvp_validator_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mvp projects" ON public.mvp_validator_projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mvp projects" ON public.mvp_validator_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mvp projects" ON public.mvp_validator_projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mvp projects" ON public.mvp_validator_projects
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage mvp projects" ON public.mvp_validator_projects
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- MVP Tests Library (seed data)
CREATE TABLE public.mvp_tests_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  applicable_sectors TEXT[] DEFAULT '{}',
  applicable_scenarios TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mvp_tests_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mvp tests library" ON public.mvp_tests_library
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage mvp tests library" ON public.mvp_tests_library
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Test Results per project
CREATE TABLE public.mvp_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.mvp_validator_projects(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.mvp_tests_library(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  start_date DATE,
  end_date DATE,
  qualitative_result TEXT,
  quantitative_result NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mvp_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own test results" ON public.mvp_test_results
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mvp_validator_projects WHERE id = mvp_test_results.project_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.mvp_validator_projects WHERE id = mvp_test_results.project_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage all test results" ON public.mvp_test_results
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_mvp_validator_projects_updated_at
  BEFORE UPDATE ON public.mvp_validator_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mvp_test_results_updated_at
  BEFORE UPDATE ON public.mvp_test_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
