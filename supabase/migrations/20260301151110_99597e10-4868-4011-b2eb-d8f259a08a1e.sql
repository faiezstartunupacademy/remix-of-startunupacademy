
-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Formation quizzes (AI-generated QCM)
CREATE TABLE public.formation_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_quiz_formation FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE
);

ALTER TABLE public.formation_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quizzes" ON public.formation_quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage quizzes" ON public.formation_quizzes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  formation_id UUID NOT NULL,
  quiz_id UUID NOT NULL,
  selected_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 10,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES public.formation_quizzes(id) ON DELETE CASCADE
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage attempts" ON public.quiz_attempts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Case study submissions
CREATE TABLE public.case_study_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  formation_id UUID NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  avg_score NUMERIC(4,1),
  reviews_count INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.case_study_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.case_study_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON public.case_study_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view pending submissions for review" ON public.case_study_submissions FOR SELECT TO authenticated USING (status = 'pending_review' AND auth.uid() != user_id);
CREATE POLICY "Admins can manage submissions" ON public.case_study_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Peer reviews
CREATE TABLE public.peer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_review_submission FOREIGN KEY (submission_id) REFERENCES public.case_study_submissions(id) ON DELETE CASCADE
);

ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reviews" ON public.peer_reviews FOR SELECT TO authenticated USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can insert reviews" ON public.peer_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Admins can manage reviews" ON public.peer_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
