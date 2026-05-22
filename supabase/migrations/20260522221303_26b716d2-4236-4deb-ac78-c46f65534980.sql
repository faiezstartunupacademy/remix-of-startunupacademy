
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  image_url text,
  link_url text,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view posts" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE INDEX idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE TRIGGER trg_community_posts_updated BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View likes" ON public.community_post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own like" ON public.community_post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own like" ON public.community_post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_community_likes_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_community_likes_count AFTER INSERT OR DELETE ON public.community_post_likes
FOR EACH ROW EXECUTE FUNCTION public.update_community_likes_count();

CREATE TABLE public.community_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View comments" ON public.community_post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own comment" ON public.community_post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own comment" ON public.community_post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Delete own comment" ON public.community_post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_community_comments_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_community_comments_count AFTER INSERT OR DELETE ON public.community_post_comments
FOR EACH ROW EXECUTE FUNCTION public.update_community_comments_count();

CREATE TABLE public.community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  event_type text NOT NULL DEFAULT 'online',
  meeting_url text,
  capacity integer,
  rsvp_count integer NOT NULL DEFAULT 0,
  cover_image text,
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View published events" ON public.community_events FOR SELECT TO authenticated USING (is_published = true OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create events" ON public.community_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own events" ON public.community_events FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own events" ON public.community_events FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE INDEX idx_community_events_date ON public.community_events(event_date);
CREATE TRIGGER trg_community_events_updated BEFORE UPDATE ON public.community_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.community_event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'going',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE public.community_event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View RSVPs" ON public.community_event_rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own RSVP" ON public.community_event_rsvps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own RSVP" ON public.community_event_rsvps FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Delete own RSVP" ON public.community_event_rsvps FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_event_rsvp_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_events SET rsvp_count = GREATEST(0, rsvp_count - 1) WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_event_rsvp_count AFTER INSERT OR DELETE ON public.community_event_rsvps
FOR EACH ROW EXECUTE FUNCTION public.update_event_rsvp_count();

CREATE TABLE public.cofounder_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  headline text NOT NULL,
  bio text,
  role_seeking text NOT NULL,
  present_role text,
  sector text,
  location text,
  skills_have text[] DEFAULT '{}',
  skills_need text[] DEFAULT '{}',
  commitment text DEFAULT 'full_time',
  has_idea boolean DEFAULT false,
  idea_summary text,
  linkedin_url text,
  anonymous_first_contact boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cofounder_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View active profiles" ON public.cofounder_profiles FOR SELECT TO authenticated USING (is_active = true OR user_id = auth.uid());
CREATE POLICY "Users manage own cofounder profile" ON public.cofounder_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_cofounder_profiles_updated BEFORE UPDATE ON public.cofounder_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.marketplace_startups ADD COLUMN IF NOT EXISTS looking_for text[] DEFAULT '{}';

ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_post_likes;
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_post_comments REPLICA IDENTITY FULL;
ALTER TABLE public.community_post_likes REPLICA IDENTITY FULL;
