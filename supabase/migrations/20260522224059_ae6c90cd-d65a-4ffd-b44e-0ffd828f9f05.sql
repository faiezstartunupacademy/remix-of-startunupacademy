CREATE TABLE IF NOT EXISTS public.ecosystem_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  partner_type text NOT NULL CHECK (partner_type IN ('Accelerator','Incubator','Institution','Network','VC','Bank','Coworking','Other')),
  description text,
  logo_url text,
  website text,
  contact_email text,
  contact_phone text,
  governorate text,
  sectors text[] DEFAULT '{}',
  active_programs_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_published boolean DEFAULT true,
  claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ep_type ON public.ecosystem_partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_ep_gov ON public.ecosystem_partners(governorate);
CREATE INDEX IF NOT EXISTS idx_ep_claimed ON public.ecosystem_partners(claimed_by);

ALTER TABLE public.ecosystem_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ep_public_read" ON public.ecosystem_partners
  FOR SELECT USING (is_published = true OR has_role(auth.uid(),'admin'));

CREATE POLICY "ep_admin_all" ON public.ecosystem_partners
  FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE POLICY "ep_owner_update" ON public.ecosystem_partners
  FOR UPDATE USING (claimed_by = auth.uid());

-- Guard: only admin can flip is_verified
CREATE OR REPLACE FUNCTION public.guard_partner_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT has_role(auth.uid(),'admin') THEN
    NEW.is_verified := COALESCE(OLD.is_verified, false);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_partner_verification
BEFORE UPDATE ON public.ecosystem_partners
FOR EACH ROW EXECUTE FUNCTION public.guard_partner_verification();

-- Followers
CREATE TABLE IF NOT EXISTS public.partner_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.ecosystem_partners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

ALTER TABLE public.partner_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pf_own_read" ON public.partner_followers FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(),'admin'));
CREATE POLICY "pf_own_insert" ON public.partner_followers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "pf_own_delete" ON public.partner_followers FOR DELETE USING (user_id = auth.uid());