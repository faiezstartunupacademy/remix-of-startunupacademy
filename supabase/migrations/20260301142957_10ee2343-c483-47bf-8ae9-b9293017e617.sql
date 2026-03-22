
-- Add formation-specific fields to forum_threads for scheduling
ALTER TABLE public.forum_threads 
  ADD COLUMN IF NOT EXISTS scheduled_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS duration_text text,
  ADD COLUMN IF NOT EXISTS formation_plan text;
