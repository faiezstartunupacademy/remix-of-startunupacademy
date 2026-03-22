
-- Table des formations (catalogue)
CREATE TABLE public.formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  domain text NOT NULL DEFAULT 'general',
  type text NOT NULL DEFAULT 'startunup' CHECK (type IN ('startunup', 'external')),
  duration_hours integer DEFAULT 0,
  modules_count integer DEFAULT 0,
  level text DEFAULT 'debutant' CHECK (level IN ('debutant', 'intermediaire', 'avance', 'expert')),
  is_active boolean NOT NULL DEFAULT true,
  is_distance boolean NOT NULL DEFAULT true,
  trainer_id uuid,
  max_participants integer DEFAULT 30,
  slug text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table des formateurs (inscription)
CREATE TABLE public.formation_trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  expertise_domain text NOT NULL,
  bio text,
  linkedin_url text,
  years_experience integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table des participants (inscription aux formations)
CREATE TABLE public.formation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id uuid REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  startup_stage text DEFAULT 'student',
  status text NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  progress_percent integer DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, formation_id)
);

-- Table des évaluations
CREATE TABLE public.formation_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id uuid REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
  participant_id uuid REFERENCES public.formation_participants(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback text,
  strengths text,
  improvements text,
  certificate_generated boolean DEFAULT false,
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, formation_id)
);

-- Table des complétions (pour le gate du Pôle Stratégique)
CREATE TABLE public.formation_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id uuid REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
  domain text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  certificate_url text,
  access_level text NOT NULL DEFAULT 'basic' CHECK (access_level IN ('basic', 'intermediate', 'advanced', 'expert')),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, formation_id)
);

-- Lien formations -> trainers
ALTER TABLE public.formations ADD CONSTRAINT fk_formations_trainer FOREIGN KEY (trainer_id) REFERENCES public.formation_trainers(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_completions ENABLE ROW LEVEL SECURITY;

-- Formations: public read, admin write
CREATE POLICY "Anyone can view active formations" ON public.formations FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage formations" ON public.formations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trainers: own data + admin
CREATE POLICY "Users can insert own trainer profile" ON public.formation_trainers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own trainer profile" ON public.formation_trainers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own trainer profile" ON public.formation_trainers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage trainers" ON public.formation_trainers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Participants: own data + admin
CREATE POLICY "Users can enroll themselves" ON public.formation_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own enrollments" ON public.formation_participants FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollment" ON public.formation_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage participants" ON public.formation_participants FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Evaluations: own data + admin
CREATE POLICY "Users can insert own evaluation" ON public.formation_evaluations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own evaluations" ON public.formation_evaluations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage evaluations" ON public.formation_evaluations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Completions: own data + admin
CREATE POLICY "Users can view own completions" ON public.formation_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert completions" ON public.formation_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage completions" ON public.formation_completions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for formations
CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON public.formations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON public.formation_trainers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
