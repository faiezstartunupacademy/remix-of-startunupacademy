
-- Add startup stage and idea status to strategic_projects
ALTER TABLE public.strategic_projects 
  ADD COLUMN IF NOT EXISTS startup_stage text DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS has_idea boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS incubation_active boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone;

-- Create incubation milestones table
CREATE TABLE public.incubation_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.strategic_projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending',
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.incubation_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones" ON public.incubation_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON public.incubation_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones" ON public.incubation_milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones" ON public.incubation_milestones
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_incubation_milestones_project ON public.incubation_milestones(project_id);
CREATE INDEX idx_incubation_milestones_user ON public.incubation_milestones(user_id);
