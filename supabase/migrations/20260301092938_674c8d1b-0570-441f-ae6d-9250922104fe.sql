
-- Table for strategic projects
CREATE TABLE public.strategic_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT,
  description TEXT,
  current_phase INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for chat messages within a project
CREATE TABLE public.strategic_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.strategic_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  phase INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategic_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for strategic_projects
CREATE POLICY "Users can view their own projects" ON public.strategic_projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.strategic_projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.strategic_projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.strategic_projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for strategic_messages
CREATE POLICY "Users can view their own messages" ON public.strategic_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON public.strategic_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_strategic_projects_updated_at
  BEFORE UPDATE ON public.strategic_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_strategic_projects_user_id ON public.strategic_projects(user_id);
CREATE INDEX idx_strategic_messages_project_id ON public.strategic_messages(project_id);
