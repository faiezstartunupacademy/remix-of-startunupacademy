ALTER TABLE public.funding_programs
  ADD COLUMN IF NOT EXISTS target_governorates text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS regional_priority boolean DEFAULT false;

ALTER TABLE public.incubation_projects
  ADD COLUMN IF NOT EXISTS governorate text;

CREATE INDEX IF NOT EXISTS idx_funding_programs_target_gov ON public.funding_programs USING GIN(target_governorates);
CREATE INDEX IF NOT EXISTS idx_incubation_projects_gov ON public.incubation_projects(governorate);
CREATE INDEX IF NOT EXISTS idx_profiles_wilaya ON public.profiles(wilaya);

CREATE OR REPLACE VIEW public.regional_equity_stats AS
SELECT
  gov.name AS governorate,
  COALESCE((SELECT COUNT(*) FROM public.profiles p WHERE p.wilaya = gov.name), 0) AS users_count,
  COALESCE((SELECT COUNT(*) FROM public.incubation_projects ip WHERE ip.governorate = gov.name), 0) AS projects_count,
  COALESCE((SELECT COUNT(*) FROM public.marketplace_startups m WHERE m.governorate = gov.name), 0) AS startups_count,
  COALESCE((SELECT COUNT(*) FROM public.funding_programs f WHERE gov.name = ANY(f.target_governorates)), 0) AS targeted_programs_count
FROM (VALUES
  ('Tunis'),('Ariana'),('Ben Arous'),('Manouba'),
  ('Nabeul'),('Zaghouan'),('Bizerte'),
  ('Béja'),('Jendouba'),('Kef'),('Siliana'),
  ('Sousse'),('Monastir'),('Mahdia'),('Sfax'),
  ('Kairouan'),('Kasserine'),('Sidi Bouzid'),
  ('Gabès'),('Médenine'),('Tataouine'),
  ('Gafsa'),('Tozeur'),('Kébili')
) AS gov(name);

GRANT SELECT ON public.regional_equity_stats TO authenticated;