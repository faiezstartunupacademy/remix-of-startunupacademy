-- Create table for license keys
CREATE TABLE public.license_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_code TEXT NOT NULL UNIQUE,
  content_slug TEXT NOT NULL,
  content_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

-- Public can check if a key exists (for validation)
CREATE POLICY "Anyone can validate license keys"
ON public.license_keys
FOR SELECT
USING (is_active = true);

-- Insert the test license key for C-Chief
INSERT INTO public.license_keys (key_code, content_slug, content_name)
VALUES ('FAIEZDJAGORA2018', 'c-chief', 'C-Chief Leadership');