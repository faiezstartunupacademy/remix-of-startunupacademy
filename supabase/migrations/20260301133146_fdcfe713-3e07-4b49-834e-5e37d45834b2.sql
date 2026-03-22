
-- Fix all RLS policies: drop RESTRICTIVE ones and recreate as PERMISSIVE

-- ===================== formations =====================
DROP POLICY IF EXISTS "Admins can manage formations" ON public.formations;
DROP POLICY IF EXISTS "Anyone can view active formations" ON public.formations;

CREATE POLICY "Admins can manage formations" ON public.formations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active formations" ON public.formations FOR SELECT USING (is_active = true);

-- ===================== formation_trainers =====================
DROP POLICY IF EXISTS "Admins can manage trainers" ON public.formation_trainers;
DROP POLICY IF EXISTS "Users can insert own trainer profile" ON public.formation_trainers;
DROP POLICY IF EXISTS "Users can update own trainer profile" ON public.formation_trainers;
DROP POLICY IF EXISTS "Users can view own trainer profile" ON public.formation_trainers;

CREATE POLICY "Admins can manage trainers" ON public.formation_trainers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own trainer profile" ON public.formation_trainers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trainer profile" ON public.formation_trainers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own trainer profile" ON public.formation_trainers FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===================== formation_participants =====================
DROP POLICY IF EXISTS "Admins can manage participants" ON public.formation_participants;
DROP POLICY IF EXISTS "Users can enroll themselves" ON public.formation_participants;
DROP POLICY IF EXISTS "Users can update own enrollment" ON public.formation_participants;
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.formation_participants;

CREATE POLICY "Admins can manage participants" ON public.formation_participants FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can enroll themselves" ON public.formation_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollment" ON public.formation_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own enrollments" ON public.formation_participants FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===================== formation_evaluations =====================
DROP POLICY IF EXISTS "Admins can manage evaluations" ON public.formation_evaluations;
DROP POLICY IF EXISTS "Users can insert own evaluation" ON public.formation_evaluations;
DROP POLICY IF EXISTS "Users can view own evaluations" ON public.formation_evaluations;

CREATE POLICY "Admins can manage evaluations" ON public.formation_evaluations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own evaluation" ON public.formation_evaluations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own evaluations" ON public.formation_evaluations FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===================== formation_completions =====================
DROP POLICY IF EXISTS "Admins can manage completions" ON public.formation_completions;
DROP POLICY IF EXISTS "System can insert completions" ON public.formation_completions;
DROP POLICY IF EXISTS "Users can view own completions" ON public.formation_completions;

CREATE POLICY "Admins can manage completions" ON public.formation_completions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert completions" ON public.formation_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own completions" ON public.formation_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
