
ALTER TABLE public.startup_journey_progress DROP CONSTRAINT IF EXISTS startup_journey_progress_phase_id_check;
ALTER TABLE public.startup_journey_progress ADD CONSTRAINT startup_journey_progress_phase_id_check CHECK (phase_id BETWEEN 1 AND 7);

-- Leaderboard opt-in FIRST
CREATE TABLE IF NOT EXISTS public.journey_leaderboard_optin (
  user_id UUID PRIMARY KEY,
  is_optin BOOLEAN NOT NULL DEFAULT false,
  display_name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journey_leaderboard_optin ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lb_own" ON public.journey_leaderboard_optin FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lb_public_read" ON public.journey_leaderboard_optin FOR SELECT TO authenticated
  USING (is_optin = true);

-- Badges
CREATE TABLE IF NOT EXISTS public.journey_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_code TEXT NOT NULL,
  phase_id INTEGER,
  label TEXT NOT NULL,
  icon TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_code)
);
ALTER TABLE public.journey_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_own" ON public.journey_badges FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "badges_admin" ON public.journey_badges FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "badges_leaderboard_read" ON public.journey_badges FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.journey_leaderboard_optin o WHERE o.user_id = journey_badges.user_id AND o.is_optin = true));

-- Streaks
CREATE TABLE IF NOT EXISTS public.journey_streaks (
  user_id UUID PRIMARY KEY,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journey_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_own" ON public.journey_streaks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks_leaderboard_read" ON public.journey_streaks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.journey_leaderboard_optin o WHERE o.user_id = journey_streaks.user_id AND o.is_optin = true));

-- Stage validations
CREATE TABLE IF NOT EXISTS public.journey_stage_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phase_id INTEGER NOT NULL CHECK (phase_id BETWEEN 1 AND 7),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  coach_id UUID,
  coach_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  self_assessment_score INTEGER CHECK (self_assessment_score BETWEEN 0 AND 100),
  evidence_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journey_stage_validations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jsv_own" ON public.journey_stage_validations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "jsv_coach_read" ON public.journey_stage_validations FOR SELECT TO authenticated
  USING (auth.uid() = coach_id OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "jsv_coach_update" ON public.journey_stage_validations FOR UPDATE TO authenticated
  USING (auth.uid() = coach_id OR has_role(auth.uid(),'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_jsv_user ON public.journey_stage_validations(user_id, phase_id);
CREATE INDEX IF NOT EXISTS idx_jsv_coach ON public.journey_stage_validations(coach_id, status);
