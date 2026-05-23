
-- 1. Add new columns
ALTER TABLE public.ecosystem_partners
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS programs_offered TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS team_size_range TEXT;

-- 2. Drop old check, migrate, add new check
ALTER TABLE public.ecosystem_partners DROP CONSTRAINT IF EXISTS ecosystem_partners_partner_type_check;

UPDATE public.ecosystem_partners SET partner_type = CASE partner_type
  WHEN 'Accelerator' THEN 'Accélérateurs'
  WHEN 'Incubator' THEN 'Incubateurs'
  WHEN 'Institution' THEN 'Organismes Publics'
  WHEN 'Bank' THEN 'Organismes Publics'
  WHEN 'VC' THEN 'Venture Builders'
  WHEN 'Coworking' THEN 'Espaces de Coworking'
  WHEN 'Network' THEN 'Programmes d''Appui'
  WHEN 'Other' THEN 'Programmes d''Appui'
  ELSE partner_type
END
WHERE partner_type IN ('Accelerator','Incubator','Institution','Bank','VC','Coworking','Network','Other');

ALTER TABLE public.ecosystem_partners
  ADD CONSTRAINT ecosystem_partners_partner_type_check
  CHECK (partner_type IN (
    'Incubateurs','Accélérateurs','Venture Builders','FabLabs',
    'Espaces de Coworking','Organismes Publics','Programmes d''Appui'
  ));

-- 3. Seed 28 real Tunisian ecosystem actors (idempotent via slug)
INSERT INTO public.ecosystem_partners
  (name, slug, partner_type, description, website, contact_email, governorate, address,
   latitude, longitude, programs_offered, sectors, is_verified, is_published, founded_year)
VALUES
  ('Flat6Labs Tunis', 'flat6labs-tunis', 'Accélérateurs',
   'Programme d''accélération seed offrant financement, mentoring et accès à un réseau international pour startups early-stage.',
   'https://www.flat6labs.com/tunis/', 'tunis@flat6labs.com', 'Tunis', 'Lac 2, Tunis',
   36.8418, 10.2702, ARRAY['Seed Program','Mentorship','Investment Readiness'], ARRAY['Tech','Fintech','SaaS'], true, true, 2016),
  ('The Dot', 'the-dot', 'Espaces de Coworking',
   'Hub d''innovation et espace de coworking à Sousse réunissant startups, freelances et corporates.',
   'https://thedot.tn', 'hello@thedot.tn', 'Sousse', 'Sousse Ville', 35.8254, 10.6369,
   ARRAY['Coworking','Events','Startup Bootcamp'], ARRAY['Tech','Creative'], true, true, 2018),
  ('Wiki Start Up', 'wiki-start-up', 'Incubateurs',
   'Premier opérateur privé d''incubation et de financement amorçage en Tunisie.',
   'https://wikistartup.tn', 'contact@wikistartup.tn', 'Ariana', 'Technopole El Ghazala',
   36.8923, 10.1869, ARRAY['Pre-Seed Fund','Incubation 12 mois','BPI Fund'], ARRAY['Tech','Industry'], true, true, 2013),
  ('Cogite Coworking', 'cogite-coworking', 'Espaces de Coworking',
   'Réseau de coworkings premium à Tunis, Sousse et Sfax orientés communauté entrepreneuriale.',
   'https://cogite.tn', 'hello@cogite.tn', 'Tunis', 'Berges du Lac, Tunis', 36.8425, 10.2641,
   ARRAY['Coworking','Meetings','Community Events'], ARRAY['All'], true, true, 2013),
  ('BFPME', 'bfpme', 'Organismes Publics',
   'Banque de Financement des Petites et Moyennes Entreprises — financement bancaire dédié PME.',
   'https://www.bfpme.com.tn', 'contact@bfpme.com.tn', 'Tunis', 'Avenue Mohamed V, Tunis',
   36.8088, 10.1797, ARRAY['Crédit PME','Cofinancement','Garanties'], ARRAY['All'], true, true, 2005),
  ('Smart Capital', 'smart-capital', 'Organismes Publics',
   'Gestionnaire du Startup Tunisia Fund et de Anava (fonds de fonds) — opérateur officiel du Startup Act.',
   'https://www.smartcapital.tn', 'contact@smartcapital.tn', 'Tunis', 'Lac 1, Tunis',
   36.8345, 10.2402, ARRAY['Startup Act','Anava Fund','Innovi'], ARRAY['Tech','Deep Tech'], true, true, 2019),
  ('SICAR Amen', 'sicar-amen', 'Organismes Publics',
   'Société d''Investissement à Capital Risque adossée à Amen Bank — financement equity PME et startups.',
   'https://www.amenbank.com.tn', 'contact@amencapital.com.tn', 'Tunis', 'Avenue Mohamed V, Tunis',
   36.8125, 10.1762, ARRAY['Capital Risque','Capital Développement'], ARRAY['All'], true, true, 1995),
  ('B@Labs (Biat Labs)', 'biat-labs', 'Accélérateurs',
   'Programme d''accélération fintech corporate de la BIAT pour startups en croissance.',
   'https://www.biatlabs.com', 'contact@biatlabs.com', 'Tunis', 'Centre Urbain Nord, Tunis',
   36.8443, 10.1953, ARRAY['Fintech Accelerator','Open Innovation'], ARRAY['Fintech'], true, true, 2018),
  ('IntilaQ', 'intilaq', 'Incubateurs',
   'Hub d''innovation dédié aux TIC offrant incubation, espace et accompagnement personnalisé.',
   'https://intilaq.tn', 'contact@intilaq.tn', 'Ariana', 'Technopole El Ghazala',
   36.8932, 10.1854, ARRAY['Incubation','Mentoring','Bootcamps'], ARRAY['ICT','Tech'], true, true, 2015),
  ('Tunisia Africa Business Council', 'tabc', 'Programmes d''Appui',
   'Conseil business reliant startups tunisiennes au marché africain.',
   'https://www.tabc.com.tn', 'contact@tabc.com.tn', 'Tunis', 'Les Berges du Lac, Tunis',
   36.8395, 10.2618, ARRAY['Africa Soft Landing','Trade Missions'], ARRAY['Export','Africa'], true, true, 2015),
  ('Hexabyte FabLab', 'hexabyte-fablab', 'FabLabs',
   'FabLab équipé pour prototypage rapide : impression 3D, découpe laser, électronique.',
   'https://fablab.tn', 'fablab@hexabyte.tn', 'Tunis', 'Avenue Habib Bourguiba, Tunis',
   36.8002, 10.1815, ARRAY['Prototypage 3D','Formations Maker'], ARRAY['Hardware','IoT'], true, true, 2015),
  ('FabLab Solidaire ATUGE', 'fablab-atuge', 'FabLabs',
   'FabLab associatif ouvert aux étudiants entrepreneurs.',
   'https://atuge.org', 'fablab@atuge.org', 'Tunis', 'El Manar, Tunis',
   36.8501, 10.1854, ARRAY['Maker Space','Workshops'], ARRAY['Hardware','Edu'], true, true, 2017),
  ('APII', 'apii', 'Organismes Publics',
   'Agence de Promotion de l''Industrie et de l''Innovation.',
   'https://www.tunisieindustrie.nat.tn', 'contact@apii.tn', 'Tunis', 'Avenue de la République',
   36.8009, 10.1825, ARRAY['Création d''entreprise','Aides à l''investissement'], ARRAY['Industry'], true, true, 1972),
  ('CEPEX', 'cepex', 'Organismes Publics',
   'Centre de Promotion des Exportations — accompagnement export pour startups.',
   'https://www.cepex.nat.tn', 'cepex@cepex.nat.tn', 'Tunis', 'Centre Urbain Nord, Tunis',
   36.8455, 10.1948, ARRAY['Programme FAMEX','Coaching Export'], ARRAY['Export'], true, true, 1973),
  ('Startup Tunisia (Smart Capital)', 'startup-tunisia', 'Programmes d''Appui',
   'Portail officiel du label Startup Act et de l''écosystème startup tunisien.',
   'https://startup.gov.tn', 'contact@startup.gov.tn', 'Tunis', 'Lac 1, Tunis',
   36.8345, 10.2402, ARRAY['Label Startup','Bourses fondateurs'], ARRAY['All'], true, true, 2019),
  ('Founder Institute Tunis', 'founder-institute-tunis', 'Programmes d''Appui',
   'Programme international d''accompagnement pré-incubation pour entrepreneurs.',
   'https://fi.co/s/tunis', 'tunis@fi.co', 'Tunis', 'Tunis', 36.8065, 10.1815,
   ARRAY['Pre-Seed Program','Global Network'], ARRAY['Tech'], true, true, 2018),
  ('TechWomen Tunisia', 'techwomen-tunisia', 'Programmes d''Appui',
   'Programme dédié à l''autonomisation des femmes dans la tech.',
   'https://techwomen.tn', 'contact@techwomen.tn', 'Tunis', 'Tunis', 36.8065, 10.1815,
   ARRAY['Mentoring Femmes','Bootcamps'], ARRAY['Tech','Gender'], true, true, 2017),
  ('Impact Partner', 'impact-partner', 'Venture Builders',
   'Venture builder spécialisé impact et économie circulaire.',
   'https://impactpartner.tn', 'hello@impactpartner.tn', 'Tunis', 'Lac 2, Tunis',
   36.8418, 10.2702, ARRAY['Venture Building','Studio Impact'], ARRAY['Impact','GreenTech'], true, true, 2020),
  ('Expertise France Innov''i', 'innovi', 'Programmes d''Appui',
   'Programme UE/Expertise France d''appui à l''écosystème innovation tunisien.',
   'https://www.expertisefrance.fr', 'innovi.tunisie@expertisefrance.fr', 'Tunis', 'Lac 1, Tunis',
   36.8350, 10.2410, ARRAY['Subventions','Bootcamps','Études'], ARRAY['Tech','Impact'], true, true, 2019),
  ('GIZ Tunisie', 'giz-tunisie', 'Programmes d''Appui',
   'Coopération allemande — programmes de soutien aux startups et à l''emploi.',
   'https://www.giz.de/en/worldwide/319.html', 'giz-tunesien@giz.de', 'Tunis', 'Berges du Lac, Tunis',
   36.8412, 10.2680, ARRAY['Job Booster','Coaching Startups'], ARRAY['Emploi','GreenTech'], true, true, 1975),
  ('CONECT', 'conect', 'Programmes d''Appui',
   'Confédération des Entreprises Citoyennes de Tunisie — réseau d''appui au secteur privé.',
   'https://www.conect.org.tn', 'contact@conect.org.tn', 'Tunis', 'Lac 2, Tunis',
   36.8420, 10.2710, ARRAY['Networking','Plaidoyer','Mentorat'], ARRAY['All'], true, true, 2011),
  ('UTICA', 'utica', 'Programmes d''Appui',
   'Union Tunisienne de l''Industrie, du Commerce et de l''Artisanat.',
   'https://www.utica.org.tn', 'contact@utica.org.tn', 'Tunis', 'Avenue Mohamed V, Tunis',
   36.8092, 10.1798, ARRAY['Représentation','Formations'], ARRAY['All'], true, true, 1947),
  ('LINKS — Sfax Coworking', 'links-sfax', 'Espaces de Coworking',
   'Espace de coworking et d''innovation à Sfax pour entrepreneurs et freelances.',
   'https://links.tn', 'hello@links.tn', 'Sfax', 'Avenue Habib Bourguiba, Sfax',
   34.7406, 10.7603, ARRAY['Coworking','Events Tech'], ARRAY['Tech'], true, true, 2019),
  ('B-Hive', 'b-hive', 'Espaces de Coworking',
   'Espace de coworking à Sousse, communauté tech vibrante.',
   'https://b-hive.tn', 'hello@b-hive.tn', 'Sousse', 'Sahloul, Sousse',
   35.8330, 10.6017, ARRAY['Coworking','Meetups'], ARRAY['Tech'], true, true, 2017),
  ('Sfax FabLab — ENIS', 'sfax-fablab-enis', 'FabLabs',
   'FabLab universitaire de l''ENIS Sfax — prototypage et électronique.',
   'https://enis.rnu.tn', 'fablab@enis.tn', 'Sfax', 'Route Soukra, Sfax',
   34.7242, 10.7340, ARRAY['Prototypage','Formations'], ARRAY['Hardware','Industry'], true, true, 2016),
  ('Maghreb Startup Initiative', 'maghreb-startup-initiative', 'Accélérateurs',
   'Compétition et programme d''accélération pan-maghrébin.',
   'https://maghrebstartupinitiative.com', 'contact@msi.tn', 'Tunis', 'Tunis', 36.8065, 10.1815,
   ARRAY['Compétition Startup','Boot Camp'], ARRAY['Tech','Africa'], true, true, 2011),
  ('Sawari Ventures', 'sawari-ventures', 'Venture Builders',
   'Fonds de capital-risque pan-régional actif en Tunisie sur les startups tech à fort potentiel.',
   'https://sawariventures.com', 'tunis@sawariventures.com', 'Tunis', 'Lac 2, Tunis',
   36.8430, 10.2705, ARRAY['Series A','Growth Capital'], ARRAY['Tech'], true, true, 2010),
  ('216 Capital', '216-capital', 'Venture Builders',
   'Fonds VC tunisien early-stage investissant dans la tech locale et régionale.',
   'https://216capital.com', 'hello@216capital.com', 'Tunis', 'Lac 2, Tunis',
   36.8421, 10.2698, ARRAY['Seed','Series A','Acceleration'], ARRAY['Tech','Fintech'], true, true, 2021)
ON CONFLICT (slug) DO UPDATE SET
  partner_type = EXCLUDED.partner_type,
  description = EXCLUDED.description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  address = EXCLUDED.address,
  programs_offered = EXCLUDED.programs_offered,
  sectors = EXCLUDED.sectors,
  governorate = EXCLUDED.governorate,
  website = EXCLUDED.website,
  is_verified = EXCLUDED.is_verified,
  is_published = EXCLUDED.is_published,
  founded_year = EXCLUDED.founded_year,
  updated_at = now();
