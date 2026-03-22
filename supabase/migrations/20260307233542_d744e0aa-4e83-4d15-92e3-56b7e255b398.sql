
-- Add protocol columns to mvp_tests_library
ALTER TABLE public.mvp_tests_library 
  ADD COLUMN IF NOT EXISTS protocol_steps JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS techniques TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS required_tools TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS estimated_duration TEXT,
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'moyen',
  ADD COLUMN IF NOT EXISTS form_fields JSONB DEFAULT '[]'::jsonb;

-- Update existing tests with protocols
UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Identifier 30 prospects","description":"Utilisez LinkedIn, réseaux personnels, groupes Facebook pour lister 30 contacts dans votre cible"},{"step":2,"title":"Préparer le guide d''interview","description":"Créez 10-15 questions ouvertes sur le problème (pas la solution). Ex: Comment gérez-vous X aujourd''hui ?"},{"step":3,"title":"Conduire les interviews","description":"30-45 min par interview. Enregistrez (avec accord). Ne pitchez pas votre solution."},{"step":4,"title":"Analyser les patterns","description":"Regroupez les réponses en thèmes. Identifiez les problèmes récurrents et leur intensité."}]',
  techniques = ARRAY['Interview semi-structurée','Jobs-to-be-Done','Mom Test'],
  required_tools = ARRAY['Guide interview','Enregistreur','Spreadsheet analyse'],
  estimated_duration = '2-3 semaines',
  difficulty = 'facile',
  form_fields = '[{"name":"nb_interviews","label":"Nombre d''interviews réalisées","type":"number"},{"name":"top_problems","label":"Top 3 problèmes identifiés","type":"textarea"},{"name":"willingness_to_pay","label":"Disposition à payer observée","type":"select","options":["Forte","Moyenne","Faible","Aucune"]}]'
WHERE name = 'Interview Problème';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Choisir l''outil de survey","description":"Google Forms, Typeform ou SurveyMonkey"},{"step":2,"title":"Rédiger le questionnaire","description":"15-20 questions max. Mix Likert + choix multiples + 2-3 ouvertes"},{"step":3,"title":"Distribuer le survey","description":"Réseaux sociaux, email, groupes cibles. Objectif: 100+ réponses"},{"step":4,"title":"Analyser les résultats","description":"Statistiques descriptives, corrélations, segmentation"}]',
  techniques = ARRAY['Questionnaire Likert','Net Promoter Score','Segmentation'],
  required_tools = ARRAY['Google Forms/Typeform','Google Sheets','Réseaux sociaux'],
  estimated_duration = '1-2 semaines',
  difficulty = 'facile',
  form_fields = '[{"name":"nb_responses","label":"Nombre de réponses","type":"number"},{"name":"completion_rate","label":"Taux de complétion (%)","type":"number"},{"name":"key_insight","label":"Insight clé","type":"textarea"}]'
WHERE name = 'Survey en ligne';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Définir le service à simuler","description":"Identifiez la proposition de valeur core à tester manuellement"},{"step":2,"title":"Recruter 5-10 clients pilotes","description":"Trouvez des early adopters prêts à tester le service manuel"},{"step":3,"title":"Délivrer le service manuellement","description":"Exécutez chaque étape à la main comme si le produit existait"},{"step":4,"title":"Mesurer satisfaction et friction","description":"Feedback qualitatif après chaque interaction, NPS"}]',
  techniques = ARRAY['Service Blueprint','Customer Journey Mapping','Wizard of Oz light'],
  required_tools = ARRAY['Email/WhatsApp','Spreadsheet CRM','Calendrier'],
  estimated_duration = '2-4 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"nb_clients","label":"Nombre de clients servis","type":"number"},{"name":"satisfaction_avg","label":"Satisfaction moyenne (/10)","type":"number"},{"name":"friction_points","label":"Points de friction identifiés","type":"textarea"}]'
WHERE name = 'MVP Concierge';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Créer l''interface frontend","description":"UI qui donne l''impression d''automatisation (chatbot, app, dashboard)"},{"step":2,"title":"Configurer le back-office manuel","description":"Vous traitez les demandes manuellement derrière l''interface"},{"step":3,"title":"Tester avec 10-20 utilisateurs","description":"Observez leur comportement, mesurez le temps de réponse perçu"},{"step":4,"title":"Évaluer la faisabilité technique","description":"Identifiez ce qui peut être automatisé vs ce qui reste manuel"}]',
  techniques = ARRAY['Prototypage rapide','Fake door test','Manual backend'],
  required_tools = ARRAY['Figma/Bubble','Zapier/Make','Slack/Email'],
  estimated_duration = '2-3 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"nb_users","label":"Nombre d''utilisateurs testés","type":"number"},{"name":"perceived_quality","label":"Qualité perçue (/10)","type":"number"},{"name":"automation_potential","label":"Potentiel d''automatisation (%)","type":"number"}]'
WHERE name = 'Magicien d''Oz';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Créer la landing page","description":"Headline percutant, proposition de valeur, CTA clair (inscription email ou pré-commande)"},{"step":2,"title":"Configurer analytics","description":"Google Analytics, heatmaps (Hotjar), pixel Facebook/Google"},{"step":3,"title":"Lancer les campagnes d''acquisition","description":"Facebook Ads, Google Ads, SEO, posts organiques. Budget: 100-500 DT"},{"step":4,"title":"Mesurer et optimiser","description":"Taux de conversion, coût par lead, A/B test headlines"}]',
  techniques = ARRAY['A/B Testing','Copywriting persuasif','Growth hacking'],
  required_tools = ARRAY['Carrd/Webflow/WordPress','Google Analytics','Mailchimp'],
  estimated_duration = '1-2 semaines',
  difficulty = 'facile',
  form_fields = '[{"name":"visitors","label":"Nombre de visiteurs","type":"number"},{"name":"signups","label":"Nombre d''inscriptions","type":"number"},{"name":"conversion_rate","label":"Taux de conversion (%)","type":"number"},{"name":"cpa","label":"Coût par acquisition (DT)","type":"number"}]'
WHERE name = 'Landing Page + CTA';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Identifier la fonctionnalité core","description":"Quelle est LA fonctionnalité qui résout le problème principal ?"},{"step":2,"title":"Développer le MVP minimal","description":"Pas de features secondaires. Focus sur l''expérience core."},{"step":3,"title":"Recruter 20-50 beta testeurs","description":"Early adopters identifiés lors des interviews"},{"step":4,"title":"Itérer sur les retours","description":"Sprints courts (1 semaine), prioriser les bugs critiques et UX"}]',
  techniques = ARRAY['Lean Development','User Story Mapping','Sprint Design'],
  required_tools = ARRAY['Framework dev','GitHub','Notion/Trello'],
  estimated_duration = '4-6 semaines',
  difficulty = 'difficile',
  form_fields = '[{"name":"feature_name","label":"Fonctionnalité core","type":"text"},{"name":"active_users","label":"Utilisateurs actifs","type":"number"},{"name":"retention_d7","label":"Rétention J7 (%)","type":"number"},{"name":"nps","label":"NPS","type":"number"}]'
WHERE name = 'Single-Feature MVP';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Préparer la version beta","description":"Feature-complete pour le use case principal, mais pas polish"},{"step":2,"title":"Sélectionner les beta testeurs","description":"50-100 early adopters, diversifiés dans votre cible"},{"step":3,"title":"Programme beta structuré","description":"Onboarding, canal feedback dédié, check-ins hebdomadaires"},{"step":4,"title":"Analyser les métriques","description":"Activation, rétention, NPS, feature usage"}]',
  techniques = ARRAY['Beta testing programme','Feature flags','Cohort analysis'],
  required_tools = ARRAY['TestFlight/Beta channel','Intercom/Crisp','Analytics'],
  estimated_duration = '4-8 semaines',
  difficulty = 'difficile',
  form_fields = '[{"name":"beta_users","label":"Nombre de beta testeurs","type":"number"},{"name":"weekly_active","label":"Utilisateurs actifs hebdo","type":"number"},{"name":"nps_score","label":"NPS Score","type":"number"},{"name":"bugs_reported","label":"Bugs reportés","type":"number"}]'
WHERE name = 'MVP Beta fermée';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Créer les ads et landing pages","description":"3-5 variantes de publicités + pages d''atterrissage correspondantes"},{"step":2,"title":"Configurer les campagnes","description":"Facebook Ads + Google Ads. Budget test: 200-1000 DT"},{"step":3,"title":"Lancer sur 7-14 jours","description":"Ciblage précis, A/B test des créatives"},{"step":4,"title":"Analyser le ROI","description":"CPA, CTR, taux de conversion, ROAS"}]',
  techniques = ARRAY['Facebook Ads','Google Ads','A/B testing créatives'],
  required_tools = ARRAY['Facebook Business Manager','Google Ads','Landing page builder'],
  estimated_duration = '2-3 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"ad_spend","label":"Budget dépensé (DT)","type":"number"},{"name":"impressions","label":"Impressions","type":"number"},{"name":"clicks","label":"Clics","type":"number"},{"name":"conversions","label":"Conversions","type":"number"},{"name":"cpa","label":"CPA (DT)","type":"number"}]'
WHERE name = 'Smoke Test (Publicité)';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Définir les spécifications techniques","description":"Architecture, stack technologique, contraintes réglementaires"},{"step":2,"title":"Développer le prototype","description":"Version fonctionnelle avec les features essentielles"},{"step":3,"title":"Tests techniques rigoureux","description":"Performance, sécurité, fiabilité, edge cases"},{"step":4,"title":"Validation avec experts du domaine","description":"Feedback médical/scientifique/technique selon le secteur"}]',
  techniques = ARRAY['Agile/Scrum','Test-Driven Development','Peer review technique'],
  required_tools = ARRAY['IDE/DevTools','CI/CD Pipeline','Environnement de test'],
  estimated_duration = '8-12 semaines',
  difficulty = 'difficile',
  form_fields = '[{"name":"tech_readiness","label":"Niveau de maturité technique (1-9 TRL)","type":"number"},{"name":"tests_passed","label":"Tests techniques passés (%)","type":"number"},{"name":"expert_validation","label":"Validation expert obtenue","type":"select","options":["Oui","En cours","Non"]}]'
WHERE name = 'Prototype fonctionnel';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Créer l''offre de pré-vente","description":"Page produit avec prix, bénéfices, date de livraison estimée"},{"step":2,"title":"Définir les incentives","description":"Early bird pricing, édition limitée, bonus exclusifs"},{"step":3,"title":"Lancer la campagne","description":"Email, social media, communauté. Objectif: X pré-commandes"},{"step":4,"title":"Mesurer la demande réelle","description":"Taux de conversion, panier moyen, abandon"}]',
  techniques = ARRAY['Pre-order campaign','Scarcity marketing','Social proof'],
  required_tools = ARRAY['Stripe/PayPal','Landing page','Email marketing'],
  estimated_duration = '2-4 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"preorders","label":"Nombre de pré-commandes","type":"number"},{"name":"revenue","label":"Revenu généré (DT)","type":"number"},{"name":"refund_rate","label":"Taux de remboursement (%)","type":"number"}]'
WHERE name = 'Pre-selling';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Définir les objectifs de croissance","description":"Métrique North Star, objectifs SMART pour 2 semaines"},{"step":2,"title":"Brainstorm 20+ idées de growth","description":"AARRR framework, analyser les canaux existants"},{"step":3,"title":"Prioriser avec ICE scoring","description":"Impact × Confiance × Facilité pour chaque idée"},{"step":4,"title":"Exécuter 3-5 expériences","description":"Sprint rapide, mesurer chaque expérience, documenter"}]',
  techniques = ARRAY['AARRR Pirate Metrics','ICE Scoring','Viral loops'],
  required_tools = ARRAY['Analytics','A/B testing tool','Automation (Zapier)'],
  estimated_duration = '2 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"experiments_run","label":"Expériences lancées","type":"number"},{"name":"best_channel","label":"Meilleur canal identifié","type":"text"},{"name":"growth_rate","label":"Taux de croissance (%)","type":"number"}]'
WHERE name = 'Growth Hacking Sprint';

UPDATE public.mvp_tests_library SET 
  protocol_steps = '[{"step":1,"title":"Identifier les éléments à tester","description":"Headlines, CTA, pricing, onboarding flow, features"},{"step":2,"title":"Créer les variantes","description":"Version A (contrôle) vs Version B (test). Un seul changement à la fois"},{"step":3,"title":"Configurer le test","description":"Split traffic 50/50, durée minimum 2 semaines, taille échantillon suffisante"},{"step":4,"title":"Analyser la significativité","description":"Test statistique (p < 0.05), calculer le lift et l''intervalle de confiance"}]',
  techniques = ARRAY['Split testing','Statistical significance','Bayesian testing'],
  required_tools = ARRAY['Google Optimize/VWO','Analytics','Calculateur stats'],
  estimated_duration = '2-4 semaines',
  difficulty = 'moyen',
  form_fields = '[{"name":"element_tested","label":"Élément testé","type":"text"},{"name":"variant_a_conversion","label":"Conversion variante A (%)","type":"number"},{"name":"variant_b_conversion","label":"Conversion variante B (%)","type":"number"},{"name":"statistical_significance","label":"Significativité statistique","type":"select","options":["Oui (p<0.05)","Non","Insuffisant"]}]'
WHERE name = 'A/B Testing';
