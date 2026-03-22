
CREATE TABLE public.dataroom_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  project_type text NOT NULL DEFAULT 'mvp',
  deliverable_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (project_id, deliverable_id, user_id)
);

ALTER TABLE public.dataroom_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deliverables"
  ON public.dataroom_deliverables FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deliverables"
  ON public.dataroom_deliverables FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deliverables"
  ON public.dataroom_deliverables FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deliverables"
  ON public.dataroom_deliverables FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all deliverables"
  ON public.dataroom_deliverables FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
