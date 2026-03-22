
ALTER TABLE public.mvp_personas
  ADD COLUMN IF NOT EXISTS governorate text DEFAULT 'Tunis',
  ADD COLUMN IF NOT EXISTS age_range text DEFAULT '25-35',
  ADD COLUMN IF NOT EXISTS socio_profile text DEFAULT 'Salarié',
  ADD COLUMN IF NOT EXISTS psycho_profile text DEFAULT 'Early Adopter',
  ADD COLUMN IF NOT EXISTS emotional_profile text DEFAULT 'Frustré par le status quo';
