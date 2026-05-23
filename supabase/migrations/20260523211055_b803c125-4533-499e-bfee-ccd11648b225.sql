
-- Deals
CREATE TABLE public.deal_room_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  round_type text NOT NULL DEFAULT 'Seed' CHECK (round_type IN ('Pre-seed','Seed','Series A','Series B','Bridge','Grant')),
  amount_target_tnd numeric NOT NULL DEFAULT 0,
  amount_raised_tnd numeric NOT NULL DEFAULT 0,
  equity_offered numeric,
  valuation_tnd numeric,
  pipeline_stage text NOT NULL DEFAULT 'sourcing' CHECK (pipeline_stage IN ('sourcing','contacted','meeting','due_diligence','term_sheet','closed_won','closed_lost')),
  nda_required boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','paused','closed')),
  deck_url text,
  deadline date,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deal_room_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders manage own deals" ON public.deal_room_deals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public deals visible to authenticated" ON public.deal_room_deals
  FOR SELECT TO authenticated USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Admins view all deals" ON public.deal_room_deals
  FOR SELECT USING (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_deal_room_deals_updated BEFORE UPDATE ON public.deal_room_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_deals_user ON public.deal_room_deals(user_id);
CREATE INDEX idx_deals_pipeline ON public.deal_room_deals(pipeline_stage);

-- Investor interests
CREATE TABLE public.deal_room_investor_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deal_room_deals(id) ON DELETE CASCADE,
  investor_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'interested' CHECK (status IN ('interested','in_dd','committed','passed')),
  ticket_size_tnd numeric,
  notes text,
  nda_signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (deal_id, investor_user_id)
);
ALTER TABLE public.deal_room_investor_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investor manages own interest" ON public.deal_room_investor_interests
  FOR ALL USING (auth.uid() = investor_user_id) WITH CHECK (auth.uid() = investor_user_id);
CREATE POLICY "Founder views interests in own deals" ON public.deal_room_investor_interests
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.deal_room_deals d WHERE d.id = deal_id AND d.user_id = auth.uid()));
CREATE POLICY "Founder updates interest status in own deals" ON public.deal_room_investor_interests
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.deal_room_deals d WHERE d.id = deal_id AND d.user_id = auth.uid()));

CREATE TRIGGER trg_interests_updated BEFORE UPDATE ON public.deal_room_investor_interests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Attach docs to deals
ALTER TABLE public.deal_room_documents ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.deal_room_deals(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_docs_deal ON public.deal_room_documents(deal_id);

-- Investor can view a deal's docs only if NDA signed (or NDA not required)
CREATE POLICY "Investor views deal docs after NDA" ON public.deal_room_documents
  FOR SELECT USING (
    deal_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.deal_room_deals d
      LEFT JOIN public.deal_room_investor_interests i ON i.deal_id = d.id AND i.investor_user_id = auth.uid()
      WHERE d.id = deal_room_documents.deal_id
        AND (d.nda_required = false OR i.nda_signed_at IS NOT NULL)
    )
  );
