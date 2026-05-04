
-- Trigger to prevent assigning the 'admin' role to anyone except the owner
CREATE OR REPLACE FUNCTION public.enforce_single_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_email CONSTANT text := 'faiez.ghorbel@gmail.com';
  target_email text;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT email INTO target_email FROM auth.users WHERE id = NEW.user_id;
    IF target_email IS DISTINCT FROM owner_email THEN
      RAISE EXCEPTION 'Le rôle admin est réservé au compte propriétaire (%).', owner_email;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_single_admin_trigger ON public.user_roles;
CREATE TRIGGER enforce_single_admin_trigger
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_single_admin();

-- Secure RPC to list users + roles + emails (admin only)
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE(user_id uuid, email text, full_name text, role app_role, created_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;
  RETURN QUERY
  SELECT
    p.user_id,
    u.email::text,
    p.full_name,
    COALESCE(ur.role, 'user'::app_role) AS role,
    p.created_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id;
END;
$$;
