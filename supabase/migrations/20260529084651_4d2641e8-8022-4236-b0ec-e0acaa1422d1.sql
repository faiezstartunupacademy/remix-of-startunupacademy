
CREATE TABLE IF NOT EXISTS public.trainer_animated_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_user_id uuid NOT NULL,
  theme text NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_date date NOT NULL,
  duration_hours integer DEFAULT 2,
  participants_count integer NOT NULL DEFAULT 0,
  resources_url text,
  evaluation_avg numeric(3,2),
  status text NOT NULL DEFAULT 'planned',
  admin_notes text,
  validated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT trainer_animated_sessions_status_check CHECK (status IN ('planned','completed','validated','rejected'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainer_animated_sessions TO authenticated;
GRANT ALL ON public.trainer_animated_sessions TO service_role;

ALTER TABLE public.trainer_animated_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers view own sessions" ON public.trainer_animated_sessions
  FOR SELECT TO authenticated USING (auth.uid() = trainer_user_id OR has_role(auth.uid(),'admin'));

CREATE POLICY "Trainers insert own sessions" ON public.trainer_animated_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = trainer_user_id);

CREATE POLICY "Trainers update own planned sessions" ON public.trainer_animated_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = trainer_user_id AND status IN ('planned','completed'));

CREATE POLICY "Admins manage all sessions" ON public.trainer_animated_sessions
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TRIGGER trainer_animated_sessions_updated_at
  BEFORE UPDATE ON public.trainer_animated_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enforce: same trainer cannot animate same theme within 15 days
CREATE OR REPLACE FUNCTION public.enforce_trainer_theme_cooldown()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.trainer_animated_sessions
    WHERE trainer_user_id = NEW.trainer_user_id
      AND lower(trim(theme)) = lower(trim(NEW.theme))
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status <> 'rejected'
      AND ABS(EXTRACT(EPOCH FROM (NEW.scheduled_date::timestamp - scheduled_date::timestamp)) / 86400) < 15
  ) THEN
    RAISE EXCEPTION 'Vous ne pouvez pas animer deux formations sur la même thématique (%) dans un intervalle de 15 jours.', NEW.theme;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_trainer_theme_cooldown
  BEFORE INSERT OR UPDATE OF theme, scheduled_date ON public.trainer_animated_sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_trainer_theme_cooldown();

-- When validated by admin with >=15 participants: auto-approve trainer profile (grants strategic access)
CREATE OR REPLACE FUNCTION public.grant_strategic_access_on_validation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text;
  v_name text;
BEGIN
  IF NEW.status = 'validated' AND (OLD.status IS DISTINCT FROM 'validated') THEN
    IF NEW.participants_count < 15 THEN
      RAISE EXCEPTION 'Une formation doit avoir au moins 15 participants pour être validée.';
    END IF;
    NEW.validated_at := now();

    SELECT email, COALESCE(raw_user_meta_data->>'full_name', email)
      INTO v_email, v_name
    FROM auth.users WHERE id = NEW.trainer_user_id;

    INSERT INTO public.formation_trainers (user_id, full_name, email, expertise_domain, status, bio)
    VALUES (NEW.trainer_user_id, COALESCE(v_name,'Formateur'), COALESCE(v_email,''), NEW.theme, 'approved',
            'Accès stratégique octroyé suite à la validation d''une formation animée.')
    ON CONFLICT (user_id) DO UPDATE SET status = 'approved', expertise_domain = EXCLUDED.expertise_domain, updated_at = now();

    PERFORM create_notification(NEW.trainer_user_id, 'strategic_access',
      '🎉 Accès Pôle Stratégique octroyé',
      'Votre formation « ' || NEW.title || ' » a été validée. Vous bénéficiez maintenant de l''accès complet au Pôle Stratégique.',
      '/pole-strategique');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_grant_strategic_access
  BEFORE UPDATE OF status ON public.trainer_animated_sessions
  FOR EACH ROW EXECUTE FUNCTION public.grant_strategic_access_on_validation();

-- Ensure unique constraint on formation_trainers.user_id for ON CONFLICT
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'formation_trainers_user_id_key'
  ) THEN
    ALTER TABLE public.formation_trainers ADD CONSTRAINT formation_trainers_user_id_key UNIQUE (user_id);
  END IF;
END $$;
