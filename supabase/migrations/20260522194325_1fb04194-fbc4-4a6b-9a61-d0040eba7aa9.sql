
-- 1) Restrict trainer_email column on forum_threads
REVOKE SELECT (trainer_email) ON public.forum_threads FROM anon, authenticated;

-- 2) Storage UPDATE policies
CREATE POLICY "Owners can update their incubation reports"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'incubation-reports' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'incubation-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can update their startup private files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'startup-private-files' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'startup-private-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3) Revoke EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_single_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_marketplace_comment_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_marketplace_vote_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_thread_replies_count() FROM PUBLIC, anon, authenticated;
