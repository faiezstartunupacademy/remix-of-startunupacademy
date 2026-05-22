-- Table principale
CREATE TABLE IF NOT EXISTS public.startup_legal_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  startup_id UUID,

  -- Forme juridique
  legal_form TEXT NOT NULL DEFAULT 'en_creation',

  -- Immatriculation
  rne_number TEXT,
  rne_date DATE,
  tribunal_greffe TEXT,

  -- Checklist
  rne_registered BOOLEAN NOT NULL DEFAULT false,
  patente_obtained BOOLEAN NOT NULL DEFAULT false,
  bank_account_pro BOOLEAN NOT NULL DEFAULT false,
  startup_act_labeled BOOLEAN NOT NULL DEFAULT false,
  cnss_declared BOOLEAN NOT NULL DEFAULT false,

  -- Startup Act
  startup_act_certificate_path TEXT,
  startup_act_application_date DATE,
  startup_act_verified BOOLEAN NOT NULL DEFAULT false,
  startup_act_verified_by UUID,
  startup_act_verified_at TIMESTAMP WITH TIME ZONE,

  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT slc_legal_form_check CHECK (
    legal_form IN ('personne_physique','suarl','sarl','sa','en_creation')
  )
);

CREATE INDEX IF NOT EXISTS idx_slc_user_id ON public.startup_legal_compliance(user_id);
CREATE INDEX IF NOT EXISTS idx_slc_startup_id ON public.startup_legal_compliance(startup_id);
CREATE INDEX IF NOT EXISTS idx_slc_startup_act_verified ON public.startup_legal_compliance(startup_act_verified);

ALTER TABLE public.startup_legal_compliance ENABLE ROW LEVEL SECURITY;

-- Owner: full control on own row (but admin verification fields will be overwritten by admin trigger guard below)
CREATE POLICY "Owner manages own legal compliance"
  ON public.startup_legal_compliance
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Any authenticated user can view (investor-facing profile view shows the legal trust block)
CREATE POLICY "Authenticated can view legal compliance"
  ON public.startup_legal_compliance
  FOR SELECT
  TO authenticated
  USING (true);

-- Admins manage everything
CREATE POLICY "Admins manage all legal compliance"
  ON public.startup_legal_compliance
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger: prevent non-admin from changing verification fields
CREATE OR REPLACE FUNCTION public.guard_legal_compliance_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    -- Force verification fields to keep their previous value
    NEW.startup_act_verified := COALESCE(OLD.startup_act_verified, false);
    NEW.startup_act_verified_by := OLD.startup_act_verified_by;
    NEW.startup_act_verified_at := OLD.startup_act_verified_at;
    NEW.admin_notes := OLD.admin_notes;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_slc_guard_verification ON public.startup_legal_compliance;
CREATE TRIGGER trg_slc_guard_verification
BEFORE UPDATE ON public.startup_legal_compliance
FOR EACH ROW
EXECUTE FUNCTION public.guard_legal_compliance_verification();

-- Storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('startup-act-certificates', 'startup-act-certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: user can upload/read their own folder; admins read all
CREATE POLICY "Users upload own startup act certificate"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'startup-act-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users read own startup act certificate"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'startup-act-certificates'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users update own startup act certificate"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'startup-act-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own startup act certificate"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'startup-act-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);