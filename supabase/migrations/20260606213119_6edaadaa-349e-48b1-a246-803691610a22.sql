
CREATE OR REPLACE FUNCTION public.unaccent_safe(_txt text)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  RETURN translate(COALESCE(_txt,''),
    'àáâãäåçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
    'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY');
END $$;

CREATE OR REPLACE FUNCTION public.slugify(_txt text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(public.unaccent_safe(_txt)), '[^a-z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.sync_strategic_to_marketplace()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_slug text;
  final_slug text;
  i int := 0;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM public.marketplace_startups
    WHERE created_by = NEW.user_id AND lower(name) = lower(NEW.name) LIMIT 1;

  IF existing_id IS NOT NULL THEN
    UPDATE public.marketplace_startups SET
      sector = COALESCE(NEW.sector, sector),
      description = COALESCE(NEW.description, description),
      updated_at = now()
    WHERE id = existing_id;
    RETURN NEW;
  END IF;

  base_slug := COALESCE(NULLIF(public.slugify(NEW.name), ''), 'startup');
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.marketplace_startups WHERE slug = final_slug) LOOP
    i := i + 1;
    final_slug := base_slug || '-' || i::text;
  END LOOP;

  INSERT INTO public.marketplace_startups (
    name, slug, tagline, description, sector, stage, is_approved, created_by, category
  ) VALUES (
    NEW.name, final_slug,
    COALESCE(left(NEW.description, 140), 'Startup issue du Pôle Stratégique'),
    NEW.description,
    COALESCE(NEW.sector, 'tech'),
    COALESCE(NEW.startup_stage, 'early'),
    false, NEW.user_id, 'product'
  );

  INSERT INTO public.notifications (user_id, type, title, message, link)
  SELECT ur.user_id, 'marketplace_pending',
    '🆕 Nouvelle startup à valider',
    'La startup « ' || NEW.name || ' » (Pôle Stratégique) attend votre validation pour le marketplace.',
    '/admin'
  FROM public.user_roles ur WHERE ur.role = 'admin';

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_sync_strategic_to_marketplace ON public.strategic_projects;
CREATE TRIGGER trg_sync_strategic_to_marketplace
AFTER INSERT OR UPDATE OF name, sector, description ON public.strategic_projects
FOR EACH ROW EXECUTE FUNCTION public.sync_strategic_to_marketplace();

-- Backfill
WITH candidates AS (
  SELECT sp.*,
    public.slugify(sp.name) AS base,
    row_number() OVER (PARTITION BY public.slugify(sp.name) ORDER BY sp.created_at) AS rn
  FROM public.strategic_projects sp
  WHERE NOT EXISTS (
    SELECT 1 FROM public.marketplace_startups ms
    WHERE ms.created_by = sp.user_id AND lower(ms.name) = lower(sp.name)
  )
)
INSERT INTO public.marketplace_startups (name, slug, tagline, description, sector, stage, is_approved, created_by, category)
SELECT
  name,
  COALESCE(NULLIF(base,''),'startup') || CASE WHEN rn > 1 THEN '-' || rn::text ELSE '' END,
  COALESCE(left(description, 140), 'Startup issue du Pôle Stratégique'),
  description,
  COALESCE(sector, 'tech'),
  COALESCE(startup_stage, 'early'),
  false, user_id, 'product'
FROM candidates c
WHERE NOT EXISTS (
  SELECT 1 FROM public.marketplace_startups ms
  WHERE ms.slug = COALESCE(NULLIF(c.base,''),'startup') || CASE WHEN c.rn > 1 THEN '-' || c.rn::text ELSE '' END
);
