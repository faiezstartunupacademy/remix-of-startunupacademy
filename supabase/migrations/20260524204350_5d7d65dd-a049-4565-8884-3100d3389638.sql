ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_goals JSONB DEFAULT '[]'::jsonb;