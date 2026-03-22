
-- Table for private documents uploaded by startup founders
CREATE TABLE public.startup_private_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.marketplace_startups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text DEFAULT 'document',
  file_size bigint DEFAULT 0,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.startup_private_documents ENABLE ROW LEVEL SECURITY;

-- Only owner and admin can see private docs
CREATE POLICY "Owner can manage own docs" ON public.startup_private_documents
  FOR ALL TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM marketplace_startups s WHERE s.id = startup_private_documents.startup_id AND s.created_by = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM marketplace_startups s WHERE s.id = startup_private_documents.startup_id AND s.created_by = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );

-- Storage bucket for private startup files
INSERT INTO storage.buckets (id, name, public) VALUES ('startup-private-files', 'startup-private-files', false);

-- Storage RLS: owner and admin only
CREATE POLICY "Startup owner can upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'startup-private-files' AND (storage.foldername(name))[1] IN (
    SELECT s.id::text FROM marketplace_startups s WHERE s.created_by = auth.uid()
  ));

CREATE POLICY "Startup owner can read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'startup-private-files' AND (
    (storage.foldername(name))[1] IN (SELECT s.id::text FROM marketplace_startups s WHERE s.created_by = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  ));

CREATE POLICY "Startup owner can delete files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'startup-private-files' AND (
    (storage.foldername(name))[1] IN (SELECT s.id::text FROM marketplace_startups s WHERE s.created_by = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  ));
