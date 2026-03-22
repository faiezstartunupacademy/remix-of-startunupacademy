
-- Marketplace Startups
CREATE TABLE public.marketplace_startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text,
  description text,
  logo_url text,
  website_url text,
  sector text NOT NULL DEFAULT 'tech',
  stage text NOT NULL DEFAULT 'early',
  location text,
  founded_date date,
  is_approved boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  votes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Founders
CREATE TABLE public.marketplace_founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role_title text,
  avatar_url text,
  linkedin_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Funding Rounds
CREATE TABLE public.marketplace_funding_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  round_type text NOT NULL DEFAULT 'seed',
  round_date date,
  investors text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- KPIs
CREATE TABLE public.marketplace_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  metric_name text NOT NULL,
  metric_value text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

-- Votes (1 per user per startup per day)
CREATE TABLE public.marketplace_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  vote_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, startup_id, vote_date)
);

-- Comments (threaded)
CREATE TABLE public.marketplace_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES public.marketplace_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ecosystems
CREATE TABLE public.marketplace_ecosystems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  location text,
  website_url text,
  sectors_covered text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ecosystem <-> Startup join table
CREATE TABLE public.marketplace_ecosystem_startups (
  ecosystem_id uuid REFERENCES public.marketplace_ecosystems(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ecosystem_id, startup_id)
);

-- Bookmarks
CREATE TABLE public.marketplace_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, startup_id)
);

-- Pitch Decks
CREATE TABLE public.marketplace_pitch_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_name text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.marketplace_startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_ecosystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_ecosystem_startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_pitch_decks ENABLE ROW LEVEL SECURITY;

-- RLS: Startups - public read approved, auth write
CREATE POLICY "Anyone can view approved startups" ON public.marketplace_startups FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can view all startups" ON public.marketplace_startups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Auth users can insert startups" ON public.marketplace_startups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own startups" ON public.marketplace_startups FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Admins can update any startup" ON public.marketplace_startups FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete startups" ON public.marketplace_startups FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Founders - public read, owner write
CREATE POLICY "Anyone can view founders" ON public.marketplace_founders FOR SELECT USING (true);
CREATE POLICY "Startup owner can manage founders" ON public.marketplace_founders FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.marketplace_startups s WHERE s.id = startup_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- RLS: Funding rounds - public read, owner write
CREATE POLICY "Anyone can view funding rounds" ON public.marketplace_funding_rounds FOR SELECT USING (true);
CREATE POLICY "Startup owner can manage funding" ON public.marketplace_funding_rounds FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.marketplace_startups s WHERE s.id = startup_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- RLS: KPIs - public read, owner write
CREATE POLICY "Anyone can view kpis" ON public.marketplace_kpis FOR SELECT USING (true);
CREATE POLICY "Startup owner can manage kpis" ON public.marketplace_kpis FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.marketplace_startups s WHERE s.id = startup_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- RLS: Votes
CREATE POLICY "Anyone can view votes" ON public.marketplace_votes FOR SELECT USING (true);
CREATE POLICY "Auth users can vote" ON public.marketplace_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.marketplace_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS: Comments
CREATE POLICY "Anyone can view comments" ON public.marketplace_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment" ON public.marketplace_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.marketplace_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.marketplace_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS: Ecosystems - public read, admin write
CREATE POLICY "Anyone can view ecosystems" ON public.marketplace_ecosystems FOR SELECT USING (true);
CREATE POLICY "Admins can manage ecosystems" ON public.marketplace_ecosystems FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Ecosystem startups - public read, admin write
CREATE POLICY "Anyone can view ecosystem startups" ON public.marketplace_ecosystem_startups FOR SELECT USING (true);
CREATE POLICY "Admins can manage ecosystem startups" ON public.marketplace_ecosystem_startups FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Bookmarks - owner only
CREATE POLICY "Users can view own bookmarks" ON public.marketplace_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.marketplace_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.marketplace_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS: Pitch decks - public read, owner write
CREATE POLICY "Anyone can view pitch decks" ON public.marketplace_pitch_decks FOR SELECT USING (true);
CREATE POLICY "Startup owner can manage decks" ON public.marketplace_pitch_decks FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.marketplace_startups s WHERE s.id = startup_id AND (s.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Indexes for performance
CREATE INDEX idx_marketplace_startups_sector ON public.marketplace_startups(sector);
CREATE INDEX idx_marketplace_startups_stage ON public.marketplace_startups(stage);
CREATE INDEX idx_marketplace_startups_approved ON public.marketplace_startups(is_approved);
CREATE INDEX idx_marketplace_startups_created_at ON public.marketplace_startups(created_at DESC);
CREATE INDEX idx_marketplace_startups_votes ON public.marketplace_startups(votes_count DESC);
CREATE INDEX idx_marketplace_votes_startup ON public.marketplace_votes(startup_id);
CREATE INDEX idx_marketplace_comments_startup ON public.marketplace_comments(startup_id);
CREATE INDEX idx_marketplace_bookmarks_user ON public.marketplace_bookmarks(user_id);

-- Function to update vote count
CREATE OR REPLACE FUNCTION public.update_marketplace_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_startups SET votes_count = votes_count + 1 WHERE id = NEW.startup_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_startups SET votes_count = votes_count - 1 WHERE id = OLD.startup_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_vote_count
AFTER INSERT OR DELETE ON public.marketplace_votes
FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_vote_count();

-- Function to update comment count
CREATE OR REPLACE FUNCTION public.update_marketplace_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_startups SET comments_count = comments_count + 1 WHERE id = NEW.startup_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_startups SET comments_count = comments_count - 1 WHERE id = OLD.startup_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_comment_count
AFTER INSERT OR DELETE ON public.marketplace_comments
FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_comment_count();

-- Enable realtime for votes and comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_comments;
