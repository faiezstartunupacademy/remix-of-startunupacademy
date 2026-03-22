
-- Add vote_type column to marketplace_votes (1 = upvote, -1 = downvote)
ALTER TABLE public.marketplace_votes ADD COLUMN IF NOT EXISTS vote_type integer NOT NULL DEFAULT 1;

-- Drop old unique constraint and add new one with vote_type consideration
-- Allow one vote per user per startup per day (can change vote type)
ALTER TABLE public.marketplace_votes DROP CONSTRAINT IF EXISTS marketplace_votes_user_id_startup_id_vote_date_key;
ALTER TABLE public.marketplace_votes ADD CONSTRAINT marketplace_votes_user_startup_date_unique UNIQUE (user_id, startup_id, vote_date);

-- Add governorate column to marketplace_startups for map positioning
ALTER TABLE public.marketplace_startups ADD COLUMN IF NOT EXISTS governorate text;

-- Add program column to marketplace_startups
ALTER TABLE public.marketplace_startups ADD COLUMN IF NOT EXISTS program text;

-- Update trigger to handle vote_type for net vote count
CREATE OR REPLACE FUNCTION public.update_marketplace_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_startups SET votes_count = votes_count + NEW.vote_type WHERE id = NEW.startup_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_startups SET votes_count = votes_count - OLD.vote_type WHERE id = OLD.startup_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE marketplace_startups SET votes_count = votes_count - OLD.vote_type + NEW.vote_type WHERE id = NEW.startup_id;
  END IF;
  RETURN NULL;
END;
$function$;

-- Recreate trigger to include UPDATE
DROP TRIGGER IF EXISTS trg_marketplace_vote_count ON marketplace_votes;
CREATE TRIGGER trg_marketplace_vote_count
AFTER INSERT OR DELETE OR UPDATE ON marketplace_votes
FOR EACH ROW EXECUTE FUNCTION update_marketplace_vote_count();

-- Add sectors_covered and startup_count to ecosystems for richer display
ALTER TABLE public.marketplace_ecosystems ADD COLUMN IF NOT EXISTS startup_count integer DEFAULT 0;
ALTER TABLE public.marketplace_ecosystems ADD COLUMN IF NOT EXISTS actors text[] DEFAULT '{}';
ALTER TABLE public.marketplace_ecosystems ADD COLUMN IF NOT EXISTS indicators jsonb DEFAULT '{}';
