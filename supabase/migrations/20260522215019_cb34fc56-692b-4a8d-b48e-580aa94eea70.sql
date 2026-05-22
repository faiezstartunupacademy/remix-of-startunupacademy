
-- Mentors profile
CREATE TABLE IF NOT EXISTS public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  photo_url text,
  bio text,
  linkedin_url text,
  country_code text DEFAULT 'TN',
  expertise_tags text[] DEFAULT '{}'::text[],
  languages text[] DEFAULT '{fr}'::text[],
  sectors text[] DEFAULT '{}'::text[],
  companies text[] DEFAULT '{}'::text[],
  years_experience integer DEFAULT 0,
  hourly_rate numeric,
  is_active boolean NOT NULL DEFAULT true,
  avg_rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active mentors" ON public.mentors
  FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Mentors manage own profile" ON public.mentors
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all mentors" ON public.mentors
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_mentors_updated_at BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mentor availability (recurring weekly slots OR specific dates)
CREATE TABLE IF NOT EXISTS public.mentor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date date,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability" ON public.mentor_availability
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mentor manages own availability" ON public.mentor_availability
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_id AND m.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_id AND m.user_id = auth.uid())
  );
CREATE POLICY "Admins manage availability" ON public.mentor_availability
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- Sessions
CREATE TABLE IF NOT EXISTS public.mentor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  startup_user_id uuid NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('discovery_30','deep_60','recurring')),
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  agenda text NOT NULL,
  meet_link text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  startup_notes text,
  mentor_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Startup views own sessions" ON public.mentor_sessions
  FOR SELECT TO authenticated USING (auth.uid() = startup_user_id);
CREATE POLICY "Mentor views own sessions" ON public.mentor_sessions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_id AND m.user_id = auth.uid())
  );
CREATE POLICY "Startup creates booking" ON public.mentor_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = startup_user_id);
CREATE POLICY "Startup updates own session" ON public.mentor_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = startup_user_id);
CREATE POLICY "Mentor updates own session" ON public.mentor_sessions
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_id AND m.user_id = auth.uid())
  );
CREATE POLICY "Admins manage all sessions" ON public.mentor_sessions
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_mentor_sessions_updated_at BEFORE UPDATE ON public.mentor_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews (bidirectional)
CREATE TABLE IF NOT EXISTS public.mentor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.mentor_sessions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback text,
  reviewer_role text NOT NULL CHECK (reviewer_role IN ('mentor','startup')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, reviewer_id)
);
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read reviews" ON public.mentor_reviews
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own review" ON public.mentor_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Admins manage reviews" ON public.mentor_reviews
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- Trigger to recompute mentor avg_rating
CREATE OR REPLACE FUNCTION public.recompute_mentor_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  m_id uuid;
BEGIN
  SELECT m.id INTO m_id FROM mentors m
  JOIN mentor_sessions s ON s.mentor_id = m.id
  WHERE s.id = COALESCE(NEW.session_id, OLD.session_id);
  IF m_id IS NULL THEN RETURN NULL; END IF;
  UPDATE mentors SET
    avg_rating = COALESCE((
      SELECT AVG(r.rating)::numeric(3,2) FROM mentor_reviews r
      JOIN mentor_sessions s ON s.id = r.session_id
      WHERE s.mentor_id = m_id AND r.reviewer_role = 'startup'
    ), 0),
    reviews_count = (
      SELECT COUNT(*) FROM mentor_reviews r
      JOIN mentor_sessions s ON s.id = r.session_id
      WHERE s.mentor_id = m_id AND r.reviewer_role = 'startup'
    )
  WHERE id = m_id;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_recompute_mentor_rating
AFTER INSERT OR UPDATE OR DELETE ON public.mentor_reviews
FOR EACH ROW EXECUTE FUNCTION public.recompute_mentor_rating();
