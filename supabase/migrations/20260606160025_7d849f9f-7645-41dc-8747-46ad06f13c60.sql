ALTER TABLE public.mvp_validator_projects
  ADD COLUMN IF NOT EXISTS product_stage text
  CHECK (product_stage IN ('idee','prototype','mvp','traction'));