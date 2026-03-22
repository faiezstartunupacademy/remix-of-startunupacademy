
-- Lot 2: Add new columns to marketplace_startups for enriched profiles
ALTER TABLE public.marketplace_startups 
  ADD COLUMN IF NOT EXISTS mvp_url text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS founders_count integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS equity_split jsonb,
  ADD COLUMN IF NOT EXISTS alternatives text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'product',
  ADD COLUMN IF NOT EXISTS pitch_deck_url text;

-- Lot 4: Comment votes table
CREATE TABLE public.marketplace_comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.marketplace_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_helpful boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE public.marketplace_comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment votes" ON public.marketplace_comment_votes FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can vote on comments" ON public.marketplace_comment_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment votes" ON public.marketplace_comment_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own comment votes" ON public.marketplace_comment_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Lot 4: Marketplace forum posts
CREATE TABLE public.marketplace_forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'news',
  likes_count integer NOT NULL DEFAULT 0,
  replies_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace forum" ON public.marketplace_forum_posts FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can post" ON public.marketplace_forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.marketplace_forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own or admin" ON public.marketplace_forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Lot 4: Marketplace forum replies
CREATE TABLE public.marketplace_forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.marketplace_forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum replies" ON public.marketplace_forum_replies FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can reply" ON public.marketplace_forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.marketplace_forum_replies FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Lot 4: Private messages between startup and stakeholders
CREATE TABLE public.marketplace_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES public.marketplace_startups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Startup owner and sender can view messages" ON public.marketplace_messages FOR SELECT TO authenticated 
  USING (
    auth.uid() = sender_id 
    OR EXISTS (SELECT 1 FROM marketplace_startups s WHERE s.id = startup_id AND s.created_by = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Auth users can send messages" ON public.marketplace_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can delete own messages" ON public.marketplace_messages FOR DELETE TO authenticated USING (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_forum_posts;
