CREATE TABLE public.user_role_types (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type public.user_role_type NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  activated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_type)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_role_types TO authenticated;
GRANT ALL ON public.user_role_types TO service_role;

ALTER TABLE public.user_role_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own role types"
  ON public.user_role_types FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all role types"
  ON public.user_role_types FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ensure only one primary per user
CREATE UNIQUE INDEX user_role_types_one_primary
  ON public.user_role_types (user_id) WHERE is_primary = true;

-- Seed from profiles.role_type
INSERT INTO public.user_role_types (user_id, role_type, is_primary)
SELECT user_id, role_type, true
FROM public.profiles
WHERE role_type IS NOT NULL
ON CONFLICT DO NOTHING;

-- Auto-create mentor record when mentor role added
CREATE OR REPLACE FUNCTION public.handle_mentor_role_added()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_email text;
  v_expertise text;
BEGIN
  IF NEW.role_type = 'mentor' THEN
    SELECT p.full_name, u.email, p.expertise_domain
      INTO v_name, v_email, v_expertise
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.user_id
    WHERE p.user_id = NEW.user_id;

    INSERT INTO public.mentors (user_id, full_name, email, expertise_domains, bio, is_active)
    VALUES (
      NEW.user_id,
      COALESCE(v_name, 'Mentor'),
      COALESCE(v_email, ''),
      ARRAY[COALESCE(v_expertise, 'Général')],
      'Mentor inscrit via Mission Control.',
      true
    )
    ON CONFLICT (user_id) DO UPDATE SET is_active = true, updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_handle_mentor_role_added
  AFTER INSERT ON public.user_role_types
  FOR EACH ROW EXECUTE FUNCTION public.handle_mentor_role_added();

-- Soft-disable mentor record when role removed
CREATE OR REPLACE FUNCTION public.handle_mentor_role_removed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role_type = 'mentor' THEN
    UPDATE public.mentors SET is_active = false, updated_at = now() WHERE user_id = OLD.user_id;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_handle_mentor_role_removed
  AFTER DELETE ON public.user_role_types
  FOR EACH ROW EXECUTE FUNCTION public.handle_mentor_role_removed();