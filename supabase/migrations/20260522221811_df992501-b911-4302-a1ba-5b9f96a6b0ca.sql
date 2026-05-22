CREATE OR REPLACE FUNCTION public.enforce_single_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT email INTO v_email FROM auth.users WHERE id = NEW.user_id;
    IF v_email NOT IN ('faiez.ghorbel@gmail.com', 'faiezghorbel6@gmail.com', 'isgisyouki@gmail.com') THEN
      RAISE EXCEPTION 'Le rôle admin est réservé aux comptes propriétaires (faiez.ghorbel@gmail.com, faiezghorbel6@gmail.com, isgisyouki@gmail.com).';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

INSERT INTO public.user_roles (user_id, role)
VALUES ('1c100db6-c5cb-45eb-ac86-bfb3e336a7d4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;