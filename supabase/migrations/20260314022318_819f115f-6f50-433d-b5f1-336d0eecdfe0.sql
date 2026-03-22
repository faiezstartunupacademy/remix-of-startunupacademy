
-- Add unique constraint on (user_id, startup_id) to enforce one vote per user per startup
-- First clean up any duplicates (keep latest)
DELETE FROM marketplace_votes a
USING marketplace_votes b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.startup_id = b.startup_id;

-- Add the unique constraint
ALTER TABLE marketplace_votes ADD CONSTRAINT marketplace_votes_user_startup_unique UNIQUE (user_id, startup_id);
