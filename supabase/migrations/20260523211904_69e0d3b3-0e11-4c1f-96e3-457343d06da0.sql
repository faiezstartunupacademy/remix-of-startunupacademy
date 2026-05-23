
CREATE TABLE public.market_intelligence_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('tam_sam_som','swot','competitor_benchmark','market_analysis','persona')),
  sector text,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_markdown text,
  result_data jsonb,
  score numeric,
  source text NOT NULL DEFAULT 'ai' CHECK (source IN ('ai','heuristic')),
  linked_strategic_action text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.market_intelligence_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reports" ON public.market_intelligence_reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all reports" ON public.market_intelligence_reports
  FOR SELECT USING (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_mi_reports_updated BEFORE UPDATE ON public.market_intelligence_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_mi_reports_user ON public.market_intelligence_reports(user_id);
CREATE INDEX idx_mi_reports_type ON public.market_intelligence_reports(report_type);
