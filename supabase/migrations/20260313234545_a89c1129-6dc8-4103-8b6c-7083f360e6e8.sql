
-- Strategic access requests table
CREATE TABLE public.strategic_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_name TEXT,
  user_email TEXT,
  startup_name TEXT,
  sector TEXT,
  motivation TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_response TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.strategic_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.strategic_access_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.strategic_access_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" ON public.strategic_access_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Strategic discussions table (between startup user and admin)
CREATE TABLE public.strategic_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.strategic_access_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.strategic_discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own discussions" ON public.strategic_discussions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.strategic_access_requests r
      WHERE r.id = strategic_discussions.request_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own discussions" ON public.strategic_discussions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.strategic_access_requests r
      WHERE r.id = strategic_discussions.request_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all discussions" ON public.strategic_discussions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for discussions
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategic_discussions;
