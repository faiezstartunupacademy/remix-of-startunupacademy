
-- ROADMAP
CREATE TABLE IF NOT EXISTS public.startup_journey_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  phase_id integer NOT NULL CHECK (phase_id BETWEEN 1 AND 5),
  milestone_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, phase_id, milestone_id)
);
ALTER TABLE public.startup_journey_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own roadmap" ON public.startup_journey_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all roadmap" ON public.startup_journey_progress
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_roadmap_updated_at BEFORE UPDATE ON public.startup_journey_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- DEAL ROOM DOCUMENTS
CREATE TABLE IF NOT EXISTS public.deal_room_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_id uuid,
  category text NOT NULL CHECK (category IN ('financials','legal','pitch','team','traction')),
  name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','program','investor')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete','verified')),
  expires_at timestamptz,
  allow_download boolean NOT NULL DEFAULT false,
  watermark_enabled boolean NOT NULL DEFAULT true,
  nda_required boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deal_room_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage own docs" ON public.deal_room_documents
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all docs" ON public.deal_room_documents
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Investors view investor docs" ON public.deal_room_documents
  FOR SELECT TO authenticated USING (
    visibility = 'investor' AND has_role(auth.uid(),'investor'::app_role)
    AND (expires_at IS NULL OR expires_at > now())
  );
CREATE TRIGGER trg_deal_docs_updated_at BEFORE UPDATE ON public.deal_room_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ACCESS LOG
CREATE TABLE IF NOT EXISTS public.deal_room_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.deal_room_documents(id) ON DELETE CASCADE,
  viewer_id uuid,
  viewer_email text,
  ip_address text,
  user_agent text,
  action text NOT NULL DEFAULT 'view' CHECK (action IN ('view','download','share')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deal_room_access_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner view own doc logs" ON public.deal_room_access_log
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.deal_room_documents d WHERE d.id = document_id AND d.user_id = auth.uid())
  );
CREATE POLICY "Admins view all doc logs" ON public.deal_room_access_log
  FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Authenticated can insert logs" ON public.deal_room_access_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = viewer_id OR viewer_id IS NULL);

-- NDA
CREATE TABLE IF NOT EXISTS public.deal_room_nda_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.deal_room_documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  ip_address text,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, user_id)
);
ALTER TABLE public.deal_room_nda_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own NDA" ON public.deal_room_nda_acceptances
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner sees NDAs on own docs" ON public.deal_room_nda_acceptances
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.deal_room_documents d WHERE d.id = document_id AND d.user_id = auth.uid())
  );

-- SHARE LINKS
CREATE TABLE IF NOT EXISTS public.deal_room_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.deal_room_documents(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  password_hash text,
  expires_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked boolean NOT NULL DEFAULT false
);
ALTER TABLE public.deal_room_share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages share links" ON public.deal_room_share_links
  FOR ALL TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins view share links" ON public.deal_room_share_links
  FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

-- STORAGE BUCKET (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('deal-room-documents','deal-room-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Deal room owner uploads"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'deal-room-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Deal room owner reads"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'deal-room-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(),'admin'::app_role)));
CREATE POLICY "Deal room owner deletes"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'deal-room-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Deal room owner updates"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'deal-room-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
