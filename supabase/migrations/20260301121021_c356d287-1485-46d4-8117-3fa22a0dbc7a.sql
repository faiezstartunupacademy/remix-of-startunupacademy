CREATE POLICY "Admins can view all milestones"
ON public.incubation_milestones
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));