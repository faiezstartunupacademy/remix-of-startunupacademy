-- FIX 1: Secure function to get forum threads without trainer_email for non-admins
CREATE OR REPLACE FUNCTION public.get_safe_forum_threads()
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  user_id uuid,
  is_pinned boolean,
  replies_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  trainer_name text,
  trainer_email text,
  meet_link text,
  scheduled_date timestamptz,
  duration_text text,
  formation_plan text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ft.id, ft.title, ft.content, ft.category, ft.user_id,
    ft.is_pinned, ft.replies_count, ft.created_at, ft.updated_at,
    ft.trainer_name,
    CASE WHEN has_role(auth.uid(), 'admin') THEN ft.trainer_email ELSE NULL END,
    ft.meet_link, ft.scheduled_date, ft.duration_text, ft.formation_plan
  FROM forum_threads ft
  ORDER BY ft.is_pinned DESC, ft.updated_at DESC;
END;
$$;

-- FIX 2: Secure function to get quiz questions WITHOUT correct answers
CREATE OR REPLACE FUNCTION public.get_quiz_questions_safe(p_formation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_questions jsonb;
  safe_questions jsonb := '[]'::jsonb;
  q jsonb;
BEGIN
  SELECT questions INTO raw_questions
  FROM formation_quizzes
  WHERE formation_id = p_formation_id
  ORDER BY generated_at DESC
  LIMIT 1;

  IF raw_questions IS NULL THEN
    RETURN NULL;
  END IF;

  FOR q IN SELECT * FROM jsonb_array_elements(raw_questions)
  LOOP
    safe_questions := safe_questions || jsonb_build_object(
      'id', q->'id',
      'question', q->'question',
      'choices', q->'choices',
      'difficulty', q->'difficulty'
    );
  END LOOP;

  RETURN safe_questions;
END;
$$;

-- Function to validate quiz answers server-side
CREATE OR REPLACE FUNCTION public.validate_quiz_answers(p_formation_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_questions jsonb;
  q jsonb;
  result jsonb := '[]'::jsonb;
  total int := 0;
  correct_count int := 0;
  user_answer text;
BEGIN
  SELECT questions INTO raw_questions
  FROM formation_quizzes
  WHERE formation_id = p_formation_id
  ORDER BY generated_at DESC
  LIMIT 1;

  IF raw_questions IS NULL THEN
    RETURN jsonb_build_object('error', 'no_quiz_found');
  END IF;

  FOR q IN SELECT * FROM jsonb_array_elements(raw_questions)
  LOOP
    total := total + 1;
    user_answer := p_answers->>((q->>'id')::text);
    IF user_answer = q->>'correct' THEN
      correct_count := correct_count + 1;
    END IF;
    result := result || jsonb_build_object(
      'id', q->'id',
      'question', q->'question',
      'choices', q->'choices',
      'correct', q->'correct',
      'explanation', q->'explanation',
      'user_answer', user_answer,
      'is_correct', (user_answer = q->>'correct')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'score', correct_count,
    'total', total,
    'percentage', CASE WHEN total > 0 THEN round((correct_count::numeric / total) * 100) ELSE 0 END,
    'results', result
  );
END;
$$;

-- FIX 4: Restrict pitch_decks, kpis, votes, comment_votes to authenticated only
DROP POLICY IF EXISTS "Anyone can view pitch decks" ON public.marketplace_pitch_decks;
CREATE POLICY "Authenticated can view pitch decks"
  ON public.marketplace_pitch_decks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view kpis" ON public.marketplace_kpis;
CREATE POLICY "Authenticated can view kpis"
  ON public.marketplace_kpis FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view comment votes" ON public.marketplace_comment_votes;
CREATE POLICY "Authenticated can view comment votes"
  ON public.marketplace_comment_votes FOR SELECT TO authenticated USING (true);