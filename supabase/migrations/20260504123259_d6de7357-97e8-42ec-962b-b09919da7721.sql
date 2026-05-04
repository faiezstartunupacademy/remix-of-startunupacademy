-- Allow both owner emails to hold the admin role
CREATE OR REPLACE FUNCTION public.enforce_single_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  allowed_emails CONSTANT text[] := ARRAY['faiez.ghorbel@gmail.com', 'faiezghorbel6@gmail.com'];
  target_email text;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT email INTO target_email FROM auth.users WHERE id = NEW.user_id;
    IF NOT (target_email = ANY(allowed_emails)) THEN
      RAISE EXCEPTION 'Le rôle admin est réservé aux comptes propriétaires (%).', array_to_string(allowed_emails, ', ');
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;