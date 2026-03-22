-- Allow admins to view all strategic projects
CREATE POLICY "Admins can view all projects"
ON public.strategic_projects
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all strategic messages
CREATE POLICY "Admins can view all messages"
ON public.strategic_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
