CREATE TABLE public.marketplace_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programs" ON public.marketplace_programs FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage programs" ON public.marketplace_programs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));