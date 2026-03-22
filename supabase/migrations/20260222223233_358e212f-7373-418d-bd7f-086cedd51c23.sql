
-- 1. Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can validate license keys" ON public.license_keys;

-- 2. Create a secure validation RPC instead of exposing the table
CREATE OR REPLACE FUNCTION public.validate_license_key(
  _key_code TEXT,
  _content_slug TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  _key RECORD;
BEGIN
  -- Input validation
  IF _key_code IS NULL OR length(trim(_key_code)) < 5 OR length(trim(_key_code)) > 50 THEN
    RETURN json_build_object('is_valid', false, 'reason', 'invalid_format');
  END IF;
  IF _content_slug IS NULL OR length(trim(_content_slug)) < 1 OR length(trim(_content_slug)) > 100 THEN
    RETURN json_build_object('is_valid', false, 'reason', 'invalid_format');
  END IF;

  SELECT * INTO _key
  FROM public.license_keys
  WHERE key_code = upper(trim(_key_code))
    AND content_slug = trim(_content_slug)
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('is_valid', false, 'reason', 'invalid_key');
  END IF;

  IF _key.expires_at IS NOT NULL AND _key.expires_at < NOW() THEN
    RETURN json_build_object('is_valid', false, 'reason', 'expired');
  END IF;

  IF _key.max_uses IS NOT NULL AND _key.current_uses >= _key.max_uses THEN
    RETURN json_build_object('is_valid', false, 'reason', 'max_uses_reached');
  END IF;

  RETURN json_build_object('is_valid', true, 'reason', 'valid');
END;
$$;

-- Grant execute to anonymous users (for license validation without auth)
GRANT EXECUTE ON FUNCTION public.validate_license_key(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_license_key(TEXT, TEXT) TO authenticated;

-- 3. Admin-only SELECT policy (admins can see all keys for management)
CREATE POLICY "Admins can view license keys"
ON public.license_keys FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Admin-only INSERT policy
CREATE POLICY "Admins can insert license keys"
ON public.license_keys FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Admin-only UPDATE policy
CREATE POLICY "Admins can update license keys"
ON public.license_keys FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Admin-only DELETE policy
CREATE POLICY "Admins can delete license keys"
ON public.license_keys FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Improve has_role with NULL checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _user_id IS NULL OR _role IS NULL THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
  END
$$;
