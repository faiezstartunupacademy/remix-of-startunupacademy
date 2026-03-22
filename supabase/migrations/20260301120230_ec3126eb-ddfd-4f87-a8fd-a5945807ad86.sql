-- Create storage bucket for incubation reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('incubation-reports', 'incubation-reports', false, 20971520, ARRAY['application/pdf']);

-- Allow authenticated users to upload their own reports
CREATE POLICY "Users can upload reports" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'incubation-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own reports
CREATE POLICY "Users can read own reports" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'incubation-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own reports
CREATE POLICY "Users can delete own reports" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'incubation-reports' AND (storage.foldername(name))[1] = auth.uid()::text);