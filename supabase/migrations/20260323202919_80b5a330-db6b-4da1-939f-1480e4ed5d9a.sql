
ALTER TABLE public.strategic_projects ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;
ALTER TABLE public.strategic_projects ADD COLUMN IF NOT EXISTS blocked_reason text;

ALTER TABLE public.incubation_projects ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;
ALTER TABLE public.incubation_projects ADD COLUMN IF NOT EXISTS blocked_reason text;
