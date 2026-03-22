
-- Create startup news/announcements table
CREATE TABLE public.marketplace_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES marketplace_startups(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  news_type text NOT NULL DEFAULT 'announcement',
  is_approved boolean NOT NULL DEFAULT false,
  submitted_by uuid NOT NULL,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_news ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved news
CREATE POLICY "Anyone can view approved news"
  ON public.marketplace_news FOR SELECT
  TO public
  USING (is_approved = true);

-- Admins can view all news
CREATE POLICY "Admins can manage all news"
  ON public.marketplace_news FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can submit news (insert)
CREATE POLICY "Users can submit news"
  ON public.marketplace_news FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Users can view own pending news
CREATE POLICY "Users can view own news"
  ON public.marketplace_news FOR SELECT
  TO authenticated
  USING (auth.uid() = submitted_by);
