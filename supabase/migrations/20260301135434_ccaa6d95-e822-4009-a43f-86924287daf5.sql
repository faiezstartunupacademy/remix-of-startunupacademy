
-- Forum threads table
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_pinned boolean NOT NULL DEFAULT false,
  replies_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Forum posts (replies to threads)
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Forum real-time chat messages
CREATE TABLE public.forum_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'general',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_chat_messages ENABLE ROW LEVEL SECURITY;

-- Forum threads policies: anyone authenticated can read, users can manage their own
CREATE POLICY "Anyone can view threads" ON public.forum_threads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create threads" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threads" ON public.forum_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own threads" ON public.forum_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage threads" ON public.forum_threads FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Forum posts policies
CREATE POLICY "Anyone can view posts" ON public.forum_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Anyone can view chat" ON public.forum_chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can send chat" ON public.forum_chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_chat_messages;

-- Trigger to update replies_count
CREATE OR REPLACE FUNCTION public.update_thread_replies_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_threads SET replies_count = replies_count + 1, updated_at = now() WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_threads SET replies_count = replies_count - 1, updated_at = now() WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_forum_post_change
AFTER INSERT OR DELETE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.update_thread_replies_count();
