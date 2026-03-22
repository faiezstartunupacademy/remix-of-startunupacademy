import { supabase } from "@/integrations/supabase/client";

export interface KnowledgeBaseTest {
  test_number: number;
  name: string;
  phase: string;
  category: string;
  description: string;
  objective: string;
  detailed_protocol: string[];
  target_metrics: { metric_name: string; success_threshold: string; failure_threshold: string };
  recommended_tools: string[];
  tags: string[];
  applicable_sectors: string[];
  difficulty_level: "easy" | "medium" | "hard";
  estimated_duration: string;
  associated_step: number;
}

const ALL_SECTORS = ["SaaS", "Marketplace", "E-commerce", "FinTech", "HealthTech", "EdTech", "FoodTech", "GreenTech", "DeepTech", "Social Impact"];

export const knowledgeBaseTests: KnowledgeBaseTest[] = [
  // ═══════════════════════════════════════════════════
  // ÉTAPE 1 — DISRUPTION (associated_step: 1)
  // ═══════════════════════════════════════════════════
  {
    test_number: 1,
    name: "Problem Interview",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Entretien structuré pour valider que le problème identifié existe réellement auprès de la cible",
    objective: "Confirmer que le problème disruptif existe et est ressenti par au moins 60% des personnes interrogées",
    detailed_protocol: [
      "Identifiez 15-20 personnes correspondant à votre cible",
      "Préparez un guide d'entretien de 10-15 questions ouvertes",
      "Ne mentionnez JAMAIS votre solution pendant l'interview",
      "Posez des questions sur les frustrations actuelles et les alternatives utilisées",
      "Enregistrez chaque entretien (avec consentement)",
      "Analysez les patterns récurrents après chaque série de 5 interviews",
      "Compilez les résultats dans un tableau de synthèse"
    ],
    target_metrics: { metric_name: "Taux de confirmation du problème", success_threshold: "≥60%", failure_threshold: "<40%" },
    recommended_tools: ["Calendly", "Zoom", "Notion", "Typeform"],
    tags: ["validation", "qualitatif", "problem-fit"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-3 semaines",
    associated_step: 1
  },
  {
    test_number: 7,
    name: "TAM/SAM/SOM Analysis",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Viabilité",
    description: "Estimation quantitative du marché total, adressable et atteignable pour dimensionner l'opportunité",
    objective: "Valider que le SOM justifie un investissement (>1M€ sur 3 ans)",
    detailed_protocol: [
      "Identifiez les sources de données fiables (INSEE, Statista, rapports sectoriels)",
      "Calculez le TAM : taille totale du marché mondial pour votre catégorie",
      "Estimez le SAM : segment géographique et démographique que vous pouvez cibler",
      "Déterminez le SOM : part réaliste capturable dans les 2-3 premières années",
      "Croisez avec une approche bottom-up (nombre de clients × panier moyen)",
      "Documentez vos hypothèses et sources dans un tableur structuré",
      "Présentez les résultats avec des fourchettes (scénario optimiste/pessimiste)"
    ],
    target_metrics: { metric_name: "SOM estimé à 3 ans", success_threshold: "≥1M€", failure_threshold: "<200K€" },
    recommended_tools: ["Statista", "Google Sheets", "Crunchbase", "SimilarWeb"],
    tags: ["marché", "quantitatif", "sizing"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 1
  },
  {
    test_number: 8,
    name: "Google Trends Analysis",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Analyse des tendances de recherche pour valider l'intérêt croissant pour le problème ou la solution",
    objective: "Confirmer une tendance de recherche stable ou croissante sur 12-24 mois",
    detailed_protocol: [
      "Identifiez 5-10 mots-clés liés à votre problème et solution",
      "Analysez les tendances sur Google Trends sur 5 ans",
      "Comparez avec les mots-clés des concurrents directs",
      "Identifiez la saisonnalité et les pics d'intérêt",
      "Analysez les requêtes associées et montantes",
      "Croisez avec les données de volume de recherche (Google Keyword Planner)",
      "Documentez les insights dans un rapport de tendances"
    ],
    target_metrics: { metric_name: "Tendance de recherche", success_threshold: "Stable ou croissante sur 12 mois", failure_threshold: "Décroissante >20%" },
    recommended_tools: ["Google Trends", "Google Keyword Planner", "Ubersuggest", "SEMrush"],
    tags: ["tendances", "quantitatif", "marché"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-3 jours",
    associated_step: 1
  },
  {
    test_number: 9,
    name: "Competitive Landscape Mapping",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Viabilité",
    description: "Cartographie exhaustive des concurrents directs et indirects pour identifier les espaces stratégiques",
    objective: "Identifier au moins 2 différenciateurs clairs par rapport aux solutions existantes",
    detailed_protocol: [
      "Listez tous les concurrents directs (même solution, même cible)",
      "Listez les concurrents indirects (solution alternative au même problème)",
      "Analysez le positionnement prix/valeur de chaque concurrent",
      "Évaluez les forces et faiblesses de chaque acteur (fonctionnalités, UX, prix)",
      "Créez une matrice de positionnement sur 2 axes stratégiques",
      "Identifiez les espaces vides (opportunités de différenciation)",
      "Documentez les barrières à l'entrée et les avantages concurrentiels durables"
    ],
    target_metrics: { metric_name: "Nombre de différenciateurs identifiés", success_threshold: "≥2 différenciateurs clairs", failure_threshold: "0 différenciateur" },
    recommended_tools: ["Crunchbase", "G2", "Capterra", "SimilarWeb", "Miro"],
    tags: ["concurrence", "stratégie", "positionnement"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1 semaine",
    associated_step: 1
  },
  {
    test_number: 10,
    name: "Blue Ocean Canvas",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Viabilité",
    description: "Application du framework Blue Ocean Strategy pour identifier une proposition de valeur disruptive",
    objective: "Définir au moins 3 facteurs à éliminer/réduire et 3 à augmenter/créer vs le marché",
    detailed_protocol: [
      "Identifiez les 6-8 facteurs clés de concurrence dans votre industrie",
      "Évaluez chaque concurrent sur ces facteurs (score 1-5)",
      "Tracez la courbe de valeur actuelle du marché",
      "Appliquez le framework ERRC : Éliminer, Réduire, Renforcer, Créer",
      "Proposez au moins 2 nouveaux facteurs que personne n'offre",
      "Tracez votre courbe de valeur cible (elle doit diverger du marché)",
      "Validez avec 5 clients potentiels que les nouveaux facteurs sont désirables"
    ],
    target_metrics: { metric_name: "Divergence de la courbe de valeur", success_threshold: "≥3 facteurs ERRC actionnables", failure_threshold: "Courbe similaire aux concurrents" },
    recommended_tools: ["Miro", "Canvanizer", "Google Sheets", "Figma"],
    tags: ["stratégie", "innovation", "blue-ocean"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "1-2 semaines",
    associated_step: 1
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 2 — RÉGLEMENTAIRE (associated_step: 2)
  // ═══════════════════════════════════════════════════
  {
    test_number: 111,
    name: "Procurement & Compliance Test",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Faisabilité",
    description: "Vérification de la conformité aux exigences d'achat et de compliance des grandes entreprises",
    objective: "Valider que le produit répond aux exigences procurement d'au moins 2 entreprises cibles",
    detailed_protocol: [
      "Identifiez les 3 plus grandes entreprises cibles dans votre segment",
      "Demandez leurs cahiers des charges procurement et compliance",
      "Évaluez votre conformité RGPD, SOC2, ISO 27001 selon les exigences",
      "Identifiez les certifications manquantes et leur coût/délai d'obtention",
      "Préparez un dossier de conformité préliminaire",
      "Testez le processus d'onboarding vendor avec un prospect pilote",
      "Documentez les gaps et créez un plan de remédiation priorisé"
    ],
    target_metrics: { metric_name: "Score de conformité procurement", success_threshold: "≥70% des critères satisfaits", failure_threshold: "<40% des critères" },
    recommended_tools: ["Vanta", "Drata", "OneTrust", "Google Docs"],
    tags: ["compliance", "B2B", "enterprise", "procurement"],
    applicable_sectors: ["SaaS", "FinTech", "HealthTech", "DeepTech"],
    difficulty_level: "hard",
    estimated_duration: "3-4 semaines",
    associated_step: 2
  },
  {
    test_number: 116,
    name: "Regulatory Pre-Assessment",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Faisabilité",
    description: "Évaluation préliminaire du cadre réglementaire applicable et des contraintes légales",
    objective: "Identifier tous les cadres réglementaires applicables et évaluer le coût de mise en conformité",
    detailed_protocol: [
      "Identifiez le ou les secteurs réglementés concernés par votre activité",
      "Listez les textes de loi et réglementations applicables (local, national, EU)",
      "Évaluez les licences et autorisations nécessaires pour opérer",
      "Estimez le coût et le délai d'obtention de chaque autorisation",
      "Consultez un expert juridique spécialisé dans votre secteur",
      "Identifiez les risques de non-conformité et leurs sanctions",
      "Créez une feuille de route réglementaire avec jalons et budget"
    ],
    target_metrics: { metric_name: "Couverture réglementaire", success_threshold: "100% des cadres identifiés avec plan", failure_threshold: "Cadres réglementaires non identifiés" },
    recommended_tools: ["LegalStart", "Captain Contrat", "EUR-Lex", "Notion"],
    tags: ["réglementaire", "compliance", "legal"],
    applicable_sectors: ["FinTech", "HealthTech", "FoodTech", "DeepTech", "GreenTech"],
    difficulty_level: "hard",
    estimated_duration: "2-4 semaines",
    associated_step: 2
  },
  {
    test_number: 136,
    name: "Regulatory Risk Test",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Faisabilité",
    description: "Simulation des scénarios de changement réglementaire et impact sur le business model",
    objective: "Évaluer la résilience du modèle face à 3 scénarios réglementaires plausibles",
    detailed_protocol: [
      "Identifiez les 3 évolutions réglementaires les plus probables dans votre secteur",
      "Pour chaque scénario, évaluez l'impact sur votre modèle économique (revenus, coûts, opérations)",
      "Estimez la probabilité de chaque scénario sur 1, 3 et 5 ans",
      "Définissez les actions préventives et correctives pour chaque scénario",
      "Calculez le coût d'adaptation pour chaque scénario",
      "Identifiez les opportunités que chaque changement pourrait créer",
      "Documentez un plan de contingence réglementaire"
    ],
    target_metrics: { metric_name: "Score de résilience réglementaire", success_threshold: "Survie dans ≥2/3 scénarios", failure_threshold: "Business model non viable dans >1 scénario" },
    recommended_tools: ["Notion", "Google Docs", "Miro"],
    tags: ["risque", "réglementaire", "scénario"],
    applicable_sectors: ["FinTech", "HealthTech", "FoodTech", "DeepTech", "GreenTech"],
    difficulty_level: "hard",
    estimated_duration: "1-2 semaines",
    associated_step: 2
  },
  {
    test_number: 139,
    name: "Expert Legal Interview",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Faisabilité",
    description: "Entretien approfondi avec un expert juridique sectoriel pour valider la viabilité légale du projet",
    objective: "Obtenir un avis juridique qualifié confirmant la faisabilité légale et identifiant les risques",
    detailed_protocol: [
      "Identifiez 2-3 avocats ou experts spécialisés dans votre secteur",
      "Préparez un dossier synthétique de votre projet (modèle, données, flux)",
      "Soumettez les questions clés : responsabilité, PI, données personnelles, licences",
      "Conduisez un entretien structuré de 60-90 minutes",
      "Demandez un avis écrit sur les risques identifiés et recommandations",
      "Évaluez le budget juridique nécessaire pour les 12 premiers mois",
      "Intégrez les recommandations dans votre plan de développement"
    ],
    target_metrics: { metric_name: "Faisabilité légale confirmée", success_threshold: "Avis favorable avec risques gérables", failure_threshold: "Blocage juridique identifié" },
    recommended_tools: ["Captain Contrat", "LegalStart", "Calendly", "Notion"],
    tags: ["legal", "expert", "validation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 2
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 3 — RUNNING LEAN (associated_step: 3)
  // ═══════════════════════════════════════════════════
  {
    test_number: 2,
    name: "Customer Discovery Interview",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Série d'entretiens structurés pour comprendre les segments clients, leurs besoins et comportements d'achat",
    objective: "Identifier et valider au moins 2 segments clients distincts avec des besoins mesurables",
    detailed_protocol: [
      "Définissez 3-4 hypothèses de segments clients",
      "Recrutez 5-8 personnes par segment via LinkedIn, réseaux, forums",
      "Préparez un guide d'entretien focalisé sur les comportements (pas les opinions)",
      "Posez des questions sur le dernier épisode où ils ont vécu le problème",
      "Quantifiez l'impact du problème (temps perdu, argent, frustration 1-10)",
      "Identifiez les solutions actuellement utilisées et leur satisfaction",
      "Synthétisez les personas validés avec données comportementales réelles"
    ],
    target_metrics: { metric_name: "Segments validés", success_threshold: "≥2 segments avec besoins confirmés", failure_threshold: "<1 segment clair" },
    recommended_tools: ["Calendly", "Zoom", "Notion", "Miro"],
    tags: ["discovery", "qualitatif", "segments"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-3 semaines",
    associated_step: 3
  },
  {
    test_number: 5,
    name: "Test des 5 Pourquoi",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Technique d'analyse causale pour remonter à la racine du problème en posant 5 fois 'pourquoi'",
    objective: "Identifier la cause racine du problème et valider qu'on ne traite pas un symptôme",
    detailed_protocol: [
      "Formulez le problème observé de manière factuelle",
      "Posez 'Pourquoi ?' et documentez la réponse",
      "Répétez 5 fois en creusant chaque réponse",
      "Faites l'exercice avec 5-10 clients/utilisateurs différents",
      "Identifiez les patterns communs dans les causes racines",
      "Vérifiez que votre solution adresse la cause racine et non le symptôme",
      "Documentez l'arbre causal complet"
    ],
    target_metrics: { metric_name: "Cause racine identifiée", success_threshold: "Cause racine commune chez ≥60% des interrogés", failure_threshold: "Causes divergentes, pas de pattern" },
    recommended_tools: ["Miro", "Notion", "Post-it", "Whimsical"],
    tags: ["analyse", "qualitatif", "cause-racine"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "3-5 jours",
    associated_step: 3
  },
  {
    test_number: 6,
    name: "Empathy Map Canvas",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Cartographie empathique du client pour comprendre ce qu'il pense, ressent, voit, entend, dit et fait",
    objective: "Créer une empathy map détaillée pour chaque segment client validé",
    detailed_protocol: [
      "Sélectionnez le segment client prioritaire",
      "Rassemblez les données des interviews précédentes",
      "Remplissez les 6 cadrans : Pense & Ressent, Voit, Entend, Dit & Fait, Douleurs, Gains",
      "Utilisez des citations directes des interviews (pas d'interprétation)",
      "Identifiez les contradictions entre ce que le client dit et fait",
      "Validez la map avec 2-3 clients du segment",
      "Utilisez la map pour affiner votre proposition de valeur"
    ],
    target_metrics: { metric_name: "Complétude de l'empathy map", success_threshold: "6/6 cadrans remplis avec données réelles", failure_threshold: "<4 cadrans avec données" },
    recommended_tools: ["Miro", "Figma", "Canvanizer", "Notion"],
    tags: ["empathie", "persona", "qualitatif"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-3 jours",
    associated_step: 3
  },
  {
    test_number: 11,
    name: "Solution Interview",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Entretien structuré pour présenter et valider la solution proposée auprès des prospects qualifiés",
    objective: "Obtenir un taux d'intérêt ≥50% avec au moins 3 signaux d'engagement concrets",
    detailed_protocol: [
      "Sélectionnez 10-15 prospects qui ont confirmé le problème en Phase 1",
      "Préparez une présentation claire de votre solution (démo, maquette, pitch)",
      "Présentez le problème d'abord, obtenez la confirmation, puis la solution",
      "Mesurez les réactions : enthousiasme, questions, objections",
      "Demandez un engagement concret : pré-inscription, LOI, test beta",
      "Identifiez les fonctionnalités 'must-have' vs 'nice-to-have'",
      "Documentez le willingness-to-pay et le modèle de pricing préféré"
    ],
    target_metrics: { metric_name: "Taux d'intérêt qualifié", success_threshold: "≥50% d'engagement concret", failure_threshold: "<30% d'intérêt" },
    recommended_tools: ["Figma", "InVision", "Calendly", "Loom"],
    tags: ["solution", "qualitatif", "validation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-3 semaines",
    associated_step: 3
  },
  {
    test_number: 17,
    name: "Value Proposition Canvas",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Mapping structuré entre les jobs-to-be-done du client et les gains/pains de votre proposition de valeur",
    objective: "Aligner la proposition de valeur sur au moins 3 pains majeurs validés",
    detailed_protocol: [
      "Listez les 'Customer Jobs' : fonctionnels, sociaux, émotionnels",
      "Identifiez les 'Pains' classés par intensité (1-5)",
      "Identifiez les 'Gains' classés par désirabilité (1-5)",
      "Mappez vos 'Pain Relievers' sur chaque pain identifié",
      "Mappez vos 'Gain Creators' sur chaque gain",
      "Évaluez le FIT : chaque pain majeur a-t-il un reliever ?",
      "Validez avec 5 clients que le mapping correspond à leur réalité"
    ],
    target_metrics: { metric_name: "Score de FIT", success_threshold: "≥3 pains majeurs adressés", failure_threshold: "<2 pains couverts" },
    recommended_tools: ["Strategyzer", "Miro", "Canvanizer", "Notion"],
    tags: ["value-prop", "stratégie", "fit"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-5 jours",
    associated_step: 3
  },
  {
    test_number: 18,
    name: "Feature Prioritization MoSCoW",
    phase: "Phase 2 — Tests de Solution",
    category: "Faisabilité",
    description: "Priorisation des fonctionnalités du MVP avec la méthode MoSCoW (Must/Should/Could/Won't)",
    objective: "Définir le périmètre MVP avec ≤5 fonctionnalités Must-Have validées par les utilisateurs",
    detailed_protocol: [
      "Listez toutes les fonctionnalités envisagées (backlog complet)",
      "Classez chaque fonctionnalité en Must/Should/Could/Won't avec l'équipe",
      "Validez les 'Must' avec 5-10 utilisateurs cibles (sont-ils vraiment essentiels ?)",
      "Estimez l'effort de développement pour chaque Must-Have",
      "Vérifiez que les Must-Have tiennent dans le budget/délai MVP",
      "Créez la roadmap MVP avec les Must-Have uniquement",
      "Documentez les critères d'acceptation de chaque fonctionnalité Must"
    ],
    target_metrics: { metric_name: "Nombre de Must-Have", success_threshold: "3-5 fonctionnalités Must validées", failure_threshold: ">8 Must-Have (scope trop large)" },
    recommended_tools: ["Notion", "Trello", "Jira", "Miro"],
    tags: ["priorisation", "MVP", "fonctionnalités"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-3 jours",
    associated_step: 3
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 4 — MVP-PERSONAS (associated_step: 4)
  // ═══════════════════════════════════════════════════
  {
    test_number: 12,
    name: "Wizard of Oz MVP",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Simulation manuelle de la solution automatisée pour tester la désirabilité sans développement",
    objective: "Valider que les utilisateurs utilisent et valorisent la solution même simulée manuellement",
    detailed_protocol: [
      "Identifiez le flux utilisateur principal de votre solution",
      "Créez une interface front-end qui semble automatisée",
      "Exécutez manuellement chaque action 'en coulisses' (emails, calculs, etc.)",
      "Recrutez 10-20 testeurs qui ne savent pas que c'est manuel",
      "Mesurez l'utilisation réelle : fréquence, durée, actions complétées",
      "Recueillez le feedback : satisfaction, willingness-to-pay",
      "Documentez les cas d'usage réels vs ceux que vous aviez anticipés"
    ],
    target_metrics: { metric_name: "Taux d'utilisation répétée", success_threshold: "≥40% de réutilisation", failure_threshold: "<20% de réutilisation" },
    recommended_tools: ["Typeform", "Zapier", "Airtable", "Gmail"],
    tags: ["MVP", "simulation", "désirabilité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 4
  },
  {
    test_number: 13,
    name: "Concierge MVP",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Livraison manuelle et personnalisée du service à un petit nombre de clients pour valider la valeur",
    objective: "Démontrer que le service délivre de la valeur mesurable à ≥5 clients pilotes",
    detailed_protocol: [
      "Sélectionnez 5-10 clients pilotes représentatifs de votre cible",
      "Délivrez le service manuellement et de façon personnalisée",
      "Documentez chaque interaction et le temps passé par client",
      "Mesurez les résultats obtenus pour chaque client (ROI, gain de temps, etc.)",
      "Collectez le feedback structuré après chaque livraison",
      "Identifiez les étapes automatisables et celles nécessitant l'humain",
      "Calculez le coût réel de livraison vs le prix que le client paierait"
    ],
    target_metrics: { metric_name: "Satisfaction client pilote", success_threshold: "≥80% de satisfaction (4+/5)", failure_threshold: "<60% de satisfaction" },
    recommended_tools: ["WhatsApp", "Google Sheets", "Calendly", "Notion"],
    tags: ["MVP", "service", "concierge"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-6 semaines",
    associated_step: 4
  },
  {
    test_number: 14,
    name: "Paper Prototype Test",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Test d'utilisabilité avec des maquettes papier ou basse fidélité pour valider l'interface et les flux",
    objective: "Valider que ≥70% des testeurs complètent le parcours principal sans aide",
    detailed_protocol: [
      "Dessinez les écrans principaux sur papier ou outil lo-fi (Balsamiq)",
      "Définissez 3 scénarios de test représentatifs",
      "Recrutez 5-8 testeurs correspondant à votre persona",
      "Guidez chaque testeur à travers les scénarios en observant leurs réactions",
      "Notez chaque hésitation, erreur, question et commentaire",
      "Identifiez les points de friction majeurs dans le parcours",
      "Itérez sur les maquettes après chaque série de 3 tests"
    ],
    target_metrics: { metric_name: "Taux de complétion du parcours", success_threshold: "≥70% sans aide", failure_threshold: "<50% de complétion" },
    recommended_tools: ["Balsamiq", "Figma", "Marvel", "Papier & stylo"],
    tags: ["prototype", "UX", "test-utilisateur"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 4
  },
  {
    test_number: 15,
    name: "Storyboard Test",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Narration visuelle du parcours utilisateur pour tester la compréhension et l'adhésion émotionnelle",
    objective: "Valider que ≥60% des testeurs s'identifient au scénario et voient la valeur ajoutée",
    detailed_protocol: [
      "Créez un storyboard de 6-8 cases montrant le parcours utilisateur",
      "Incluez : le contexte, le problème, la découverte de la solution, l'utilisation, le résultat",
      "Montrez le storyboard à 10-15 personnes de votre cible",
      "Posez des questions : 'Vous reconnaissez-vous ?', 'Est-ce que cela résoudrait votre problème ?'",
      "Mesurez le taux d'identification et la compréhension du bénéfice",
      "Identifiez les cases qui génèrent confusion ou désintérêt",
      "Itérez sur la narration en fonction des retours"
    ],
    target_metrics: { metric_name: "Taux d'identification", success_threshold: "≥60% s'identifient au scénario", failure_threshold: "<40% d'identification" },
    recommended_tools: ["Canva", "Figma", "Storyboard That", "Miro"],
    tags: ["narration", "UX", "empathie"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "3-5 jours",
    associated_step: 4
  },
  {
    test_number: 19,
    name: "Kano Model Analysis",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Classification des fonctionnalités en catégories Kano pour identifier les 'delighters' et les 'must-be'",
    objective: "Classer ≥10 fonctionnalités et identifier au moins 2 delighters potentiels",
    detailed_protocol: [
      "Listez 10-15 fonctionnalités potentielles de votre produit",
      "Pour chaque fonctionnalité, posez la question fonctionnelle ET dysfonctionnelle",
      "Administrez le questionnaire à 20-30 utilisateurs cibles",
      "Classez chaque fonctionnalité : Must-be, One-dimensional, Attractive, Indifferent, Reverse",
      "Priorisez : Must-be d'abord, puis One-dimensional, puis Attractive (delighters)",
      "Identifiez les fonctionnalités Reverse (à ne PAS inclure)",
      "Créez la roadmap produit basée sur la classification Kano"
    ],
    target_metrics: { metric_name: "Nombre de delighters identifiés", success_threshold: "≥2 fonctionnalités Attractive", failure_threshold: "Aucune fonctionnalité Attractive" },
    recommended_tools: ["Typeform", "SurveyMonkey", "Google Sheets", "Notion"],
    tags: ["fonctionnalités", "priorisation", "Kano"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 4
  },
  {
    test_number: 20,
    name: "MaxDiff Analysis",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Analyse des préférences par comparaisons forcées pour hiérarchiser les fonctionnalités ou bénéfices",
    objective: "Obtenir un classement statistiquement significatif des préférences utilisateurs",
    detailed_protocol: [
      "Sélectionnez 8-12 attributs/fonctionnalités à comparer",
      "Créez des ensembles de 4-5 attributs (chaque attribut apparaît dans ≥3 ensembles)",
      "Pour chaque ensemble, demandez : 'Le plus important' et 'Le moins important'",
      "Administrez à ≥30 répondants pour la significativité statistique",
      "Analysez avec un modèle logit pour obtenir les scores d'utilité",
      "Identifiez les 3 attributs les plus valorisés et les 3 les moins",
      "Utilisez les résultats pour prioriser le développement produit"
    ],
    target_metrics: { metric_name: "Significativité statistique", success_threshold: "≥30 répondants avec classement clair", failure_threshold: "<15 répondants ou résultats non significatifs" },
    recommended_tools: ["Sawtooth Software", "Conjointly", "SurveyMonkey", "Google Forms"],
    tags: ["quantitatif", "préférences", "statistique"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "1-2 semaines",
    associated_step: 4
  },
  {
    test_number: 22,
    name: "Smoke Test Landing Page",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Page d'atterrissage factice pour mesurer l'intérêt réel via les inscriptions et clics",
    objective: "Obtenir un taux de conversion ≥5% sur la landing page en 1-2 semaines",
    detailed_protocol: [
      "Créez une landing page avec proposition de valeur claire et CTA",
      "Incluez : headline accrocheur, 3 bénéfices, preuve sociale, CTA unique",
      "Configurez le tracking : GA4, Hotjar, pixel de conversion",
      "Lancez une campagne publicitaire ciblée (100-300€ budget)",
      "Mesurez : visiteurs, taux de conversion, coût par lead",
      "Analysez les heatmaps et recordings pour identifier les frictions",
      "Itérez sur le message et le design en A/B test"
    ],
    target_metrics: { metric_name: "Taux de conversion landing page", success_threshold: "≥5% de conversion", failure_threshold: "<2% de conversion" },
    recommended_tools: ["Carrd", "Unbounce", "Google Ads", "Hotjar"],
    tags: ["landing-page", "conversion", "smoke-test"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 4
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 5 — RISQUES (associated_step: 5)
  // ═══════════════════════════════════════════════════
  {
    test_number: 114,
    name: "Technical Feasibility Prototype",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Faisabilité",
    description: "Prototype technique pour valider la faisabilité des composants critiques de la solution",
    objective: "Démontrer la faisabilité technique des 3 composants les plus risqués",
    detailed_protocol: [
      "Identifiez les 3-5 composants techniques les plus risqués ou innovants",
      "Pour chaque composant, définissez les critères de succès (performance, précision, coût)",
      "Développez un prototype minimal testant chaque composant isolément",
      "Mesurez les performances réelles vs les exigences définies",
      "Identifiez les contraintes techniques non anticipées",
      "Évaluez les alternatives si un composant échoue",
      "Documentez les résultats et les architectures validées"
    ],
    target_metrics: { metric_name: "Composants techniques validés", success_threshold: "≥3/3 composants critiques validés", failure_threshold: "<2 composants validés" },
    recommended_tools: ["GitHub", "AWS", "Docker", "Postman"],
    tags: ["technique", "prototype", "faisabilité"],
    applicable_sectors: ["SaaS", "DeepTech", "FinTech", "HealthTech"],
    difficulty_level: "hard",
    estimated_duration: "2-4 semaines",
    associated_step: 5
  },
  {
    test_number: 115,
    name: "BOM Cost Test (Bill of Materials)",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Analyse détaillée du coût des composants et matériaux pour valider la marge produit",
    objective: "Confirmer une marge brute ≥50% (SaaS) ou ≥30% (hardware) sur le produit final",
    detailed_protocol: [
      "Listez tous les composants/services nécessaires à la production",
      "Obtenez des devis de 2-3 fournisseurs pour chaque composant",
      "Calculez le coût unitaire à différents volumes (1, 100, 1000, 10000 unités)",
      "Incluez les coûts cachés : packaging, shipping, support, maintenance",
      "Calculez la marge brute pour chaque scénario de pricing",
      "Identifiez les composants les plus coûteux et les alternatives possibles",
      "Documentez l'évolution du coût avec les économies d'échelle"
    ],
    target_metrics: { metric_name: "Marge brute estimée", success_threshold: "≥50% SaaS / ≥30% hardware", failure_threshold: "<30% SaaS / <15% hardware" },
    recommended_tools: ["Google Sheets", "Excel", "Alibaba", "Made-in-China"],
    tags: ["coût", "marge", "BOM"],
    applicable_sectors: ["E-commerce", "DeepTech", "FoodTech", "GreenTech", "HealthTech"],
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 5
  },
  {
    test_number: 134,
    name: "Stress Test",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Faisabilité",
    description: "Test de charge et de résistance pour évaluer les limites du système sous pression",
    objective: "Identifier le point de rupture et valider que le système supporte 3x la charge prévue",
    detailed_protocol: [
      "Définissez les métriques de performance (temps de réponse, throughput, erreurs)",
      "Créez des scénarios de charge : nominale, pic, stress, endurance",
      "Configurez les outils de test de charge avec des profils utilisateurs réalistes",
      "Exécutez les tests progressivement : 1x, 2x, 3x, 5x la charge nominale",
      "Mesurez les temps de réponse, taux d'erreur et utilisation des ressources",
      "Identifiez les goulots d'étranglement (CPU, mémoire, BDD, réseau)",
      "Documentez les limites et le plan de scaling"
    ],
    target_metrics: { metric_name: "Capacité de charge", success_threshold: "Supporte 3x la charge nominale", failure_threshold: "Dégradation à 1.5x la charge" },
    recommended_tools: ["k6", "JMeter", "Locust", "Grafana"],
    tags: ["performance", "technique", "scalabilité"],
    applicable_sectors: ["SaaS", "Marketplace", "FinTech", "E-commerce"],
    difficulty_level: "hard",
    estimated_duration: "1-2 semaines",
    associated_step: 5
  },
  {
    test_number: 135,
    name: "Competitor Response Simulation",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Viabilité",
    description: "Simulation des réactions concurrentielles probables et préparation des contre-mesures",
    objective: "Anticiper et préparer des réponses à au moins 3 scénarios concurrentiels",
    detailed_protocol: [
      "Identifiez les 3-5 réactions les plus probables de vos concurrents",
      "Pour chaque réaction : baisse de prix, copie de fonctionnalités, acquisition, partenariats",
      "Évaluez la probabilité et l'impact de chaque scénario",
      "Définissez votre stratégie de réponse pour chaque scénario",
      "Identifiez vos avantages concurrentiels durables (moats)",
      "Estimez le coût et le délai de chaque contre-mesure",
      "Créez un playbook de réponse concurrentielle"
    ],
    target_metrics: { metric_name: "Nombre de scénarios préparés", success_threshold: "≥3 scénarios avec contre-mesures", failure_threshold: "<2 scénarios préparés" },
    recommended_tools: ["Miro", "Notion", "Google Docs"],
    tags: ["concurrence", "stratégie", "scénario"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1 semaine",
    associated_step: 5
  },
  {
    test_number: 137,
    name: "Single Point of Failure Analysis",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Faisabilité",
    description: "Identification et mitigation des points uniques de défaillance dans l'architecture technique et business",
    objective: "Éliminer ou mitiger tous les SPOF critiques identifiés",
    detailed_protocol: [
      "Cartographiez tous les composants critiques : technique, humain, fournisseur, réglementaire",
      "Pour chaque composant, posez la question : 'Si ceci échoue, l'entreprise survit-elle ?'",
      "Identifiez les SPOF : fournisseur unique, technologie propriétaire, personne clé",
      "Classez les SPOF par probabilité d'occurrence et impact",
      "Définissez un plan de mitigation pour chaque SPOF critique",
      "Implémentez la redondance pour les SPOF les plus critiques",
      "Testez les plans de fallback avec des exercices de simulation"
    ],
    target_metrics: { metric_name: "SPOF critiques mitigés", success_threshold: "100% des SPOF critiques mitigés", failure_threshold: "SPOF critique sans plan B" },
    recommended_tools: ["Miro", "Notion", "Lucidchart", "Google Docs"],
    tags: ["risque", "architecture", "résilience"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-5 jours",
    associated_step: 5
  },
  {
    test_number: 138,
    name: "Customer Concentration Risk",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Viabilité",
    description: "Évaluation du risque de dépendance excessive à un petit nombre de clients",
    objective: "S'assurer qu'aucun client ne représente plus de 20% du chiffre d'affaires prévu",
    detailed_protocol: [
      "Analysez la répartition prévue du CA par client (ou segment)",
      "Calculez l'indice de concentration (Herfindahl-Hirschman)",
      "Identifiez les clients qui représenteraient >15% du CA",
      "Évaluez le risque de perte pour chaque client concentré",
      "Définissez une stratégie de diversification du portefeuille",
      "Fixez des objectifs de concentration max par client et segment",
      "Planifiez l'acquisition de nouveaux segments pour diluer le risque"
    ],
    target_metrics: { metric_name: "Concentration max par client", success_threshold: "Aucun client >20% du CA", failure_threshold: "1 client >40% du CA" },
    recommended_tools: ["Google Sheets", "Excel", "CRM"],
    tags: ["risque", "concentration", "diversification"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-5 jours",
    associated_step: 5
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 6 — MÉTRIQUES (associated_step: 6)
  // ═══════════════════════════════════════════════════
  {
    test_number: 27,
    name: "Google Ads Keyword Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Campagne Google Ads ciblée pour mesurer la demande réelle via les recherches actives",
    objective: "Atteindre un CTR ≥3% et un CPC <2€ sur les mots-clés principaux",
    detailed_protocol: [
      "Identifiez 10-20 mots-clés liés à votre problème et solution",
      "Créez 3-5 variantes d'annonces par groupe de mots-clés",
      "Configurez le tracking de conversion (landing page, inscription)",
      "Lancez avec un budget de 150-300€ sur 7-14 jours",
      "Analysez quotidiennement : CTR, CPC, taux de conversion, coût par lead",
      "Optimisez : pausez les mots-clés non performants, augmentez les budgets performants",
      "Documentez les insights : quels messages et mots-clés résonnent le mieux"
    ],
    target_metrics: { metric_name: "CTR Google Ads", success_threshold: "≥3% CTR", failure_threshold: "<1% CTR" },
    recommended_tools: ["Google Ads", "Google Analytics", "Unbounce", "Google Keyword Planner"],
    tags: ["acquisition", "Google", "PPC"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2 semaines",
    associated_step: 6
  },
  {
    test_number: 28,
    name: "Facebook/Meta Ads Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Campagne Facebook/Instagram pour tester les messages et visuels auprès d'audiences ciblées",
    objective: "Obtenir un CPA <10€ et identifier l'audience et le message les plus performants",
    detailed_protocol: [
      "Définissez 3-4 audiences ciblées (intérêts, comportements, lookalike)",
      "Créez 3-5 variations de créatives (visuels + textes)",
      "Configurez le pixel Facebook et les événements de conversion",
      "Lancez avec 200-400€ de budget sur 10-14 jours",
      "Testez en A/B : audiences × créatives",
      "Analysez : CPA, CPM, CTR, taux de conversion, ROAS",
      "Identifiez la combinaison gagnante audience + message + visuel"
    ],
    target_metrics: { metric_name: "Coût par acquisition (CPA)", success_threshold: "CPA <10€", failure_threshold: "CPA >30€" },
    recommended_tools: ["Meta Ads Manager", "Canva", "Google Analytics", "Hotjar"],
    tags: ["acquisition", "social-ads", "créatives"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2 semaines",
    associated_step: 6
  },
  {
    test_number: 38,
    name: "Van Westendorp Pricing Sensitivity",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Méthode Van Westendorp pour déterminer le prix optimal via 4 questions de sensibilité",
    objective: "Identifier la fourchette de prix acceptable et le point de prix optimal",
    detailed_protocol: [
      "Préparez les 4 questions VW : trop cher, cher mais acceptable, bon marché, trop bon marché",
      "Administrez à 30-50 répondants de votre cible",
      "Tracez les courbes cumulatives pour les 4 réponses",
      "Identifiez le PMC (Point of Marginal Cheapness) et le PME (Point of Marginal Expensiveness)",
      "Le prix optimal est à l'intersection des courbes 'trop cher' et 'trop bon marché'",
      "La fourchette acceptable est entre le PMC et le PME",
      "Croisez avec les prix des concurrents et votre structure de coûts"
    ],
    target_metrics: { metric_name: "Prix optimal identifié", success_threshold: "Fourchette acceptable avec marge >50%", failure_threshold: "Prix acceptable < coût de revient" },
    recommended_tools: ["Typeform", "Google Forms", "Excel", "R/Python"],
    tags: ["pricing", "quantitatif", "sensibilité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 6
  },
  {
    test_number: 44,
    name: "Crowdfunding Campaign Test",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Lancement d'une campagne de crowdfunding pour valider la demande et le pricing avec de l'argent réel",
    objective: "Atteindre l'objectif de financement (ou 50% minimum) avec ≥100 backers",
    detailed_protocol: [
      "Choisissez la plateforme adaptée (Kickstarter, Ulule, KissKissBankBank)",
      "Préparez la page : vidéo de 2-3min, story, récompenses, timeline",
      "Définissez un objectif réaliste basé sur votre base de prospects",
      "Préparez la stratégie de lancement : early birds, médias, communauté",
      "Lancez et communiquez activement pendant toute la durée",
      "Analysez les pics de contribution et les canaux d'acquisition",
      "Documentez les learnings sur le pricing et le messaging"
    ],
    target_metrics: { metric_name: "Taux de financement", success_threshold: "≥100% de l'objectif", failure_threshold: "<30% de l'objectif" },
    recommended_tools: ["Kickstarter", "Ulule", "Mailchimp", "Canva"],
    tags: ["crowdfunding", "validation", "financement"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "4-6 semaines",
    associated_step: 6
  },
  {
    test_number: 45,
    name: "Pre-order Test",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Ouverture des pré-commandes pour mesurer la demande réelle avec engagement financier",
    objective: "Obtenir ≥50 pré-commandes confirmées avant le lancement produit",
    detailed_protocol: [
      "Créez une page de pré-commande avec description détaillée du produit",
      "Proposez une incitation early-adopter (remise, accès prioritaire, bonus)",
      "Configurez le paiement (avec ou sans prélèvement immédiat)",
      "Lancez auprès de votre liste de prospects et via les canaux validés",
      "Mesurez : nombre de pré-commandes, taux de conversion, panier moyen",
      "Analysez les objections des non-acheteurs (enquête de sortie)",
      "Utilisez les pré-commandes pour affiner les prévisions de production"
    ],
    target_metrics: { metric_name: "Nombre de pré-commandes", success_threshold: "≥50 pré-commandes", failure_threshold: "<15 pré-commandes" },
    recommended_tools: ["Stripe", "Gumroad", "Shopify", "Carrd"],
    tags: ["pré-commande", "validation", "revenue"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },
  {
    test_number: 59,
    name: "Cohort Analysis",
    phase: "Phase 5 — Tests de Rétention",
    category: "Viabilité",
    description: "Analyse par cohortes pour mesurer la rétention et identifier les patterns de désengagement",
    objective: "Identifier le taux de rétention par cohorte et le point de churn critique",
    detailed_protocol: [
      "Définissez les cohortes : par semaine/mois d'inscription, par canal d'acquisition",
      "Mesurez l'activité de chaque cohorte sur 4-12 semaines",
      "Calculez le taux de rétention semaine par semaine (W1, W2, W4, W8, W12)",
      "Identifiez le 'churn cliff' : la semaine où le churn s'accélère",
      "Comparez les cohortes pour identifier les facteurs de meilleure rétention",
      "Corrélation avec les actions d'onboarding et d'engagement",
      "Créez un tableau de bord de suivi des cohortes"
    ],
    target_metrics: { metric_name: "Rétention W8", success_threshold: "≥20% de rétention à W8", failure_threshold: "<10% de rétention à W8" },
    recommended_tools: ["Mixpanel", "Amplitude", "Google Analytics", "Google Sheets"],
    tags: ["rétention", "cohorte", "analytique"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-3 mois (données nécessaires)",
    associated_step: 6
  },
  {
    test_number: 60,
    name: "Sean Ellis PMF Survey",
    phase: "Phase 5 — Tests de Rétention",
    category: "Désirabilité",
    description: "Enquête Product-Market Fit de Sean Ellis : 'Seriez-vous très déçu si ce produit n'existait plus ?'",
    objective: "Atteindre ≥40% de réponses 'Très déçu' (seuil PMF)",
    detailed_protocol: [
      "Envoyez le sondage aux utilisateurs ayant utilisé le produit ≥2 fois",
      "Question principale : 'Comment vous sentiriez-vous si vous ne pouviez plus utiliser [produit] ?'",
      "Options : Très déçu / Un peu déçu / Pas déçu / Je ne l'utilise plus",
      "Questions complémentaires : bénéfice principal, alternatives, persona",
      "Visez ≥40 répondants pour la significativité",
      "Analysez le segment des 'Très déçus' : qui sont-ils ? pourquoi ?",
      "Si <40% : itérez sur le produit en ciblant les 'Très déçus' en priorité"
    ],
    target_metrics: { metric_name: "Taux de 'Très déçu'", success_threshold: "≥40%", failure_threshold: "<25%" },
    recommended_tools: ["Typeform", "Google Forms", "PMF Survey (Sean Ellis)", "Notion"],
    tags: ["PMF", "rétention", "enquête"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 6
  },
  {
    test_number: 61,
    name: "NPS (Net Promoter Score)",
    phase: "Phase 5 — Tests de Rétention",
    category: "Désirabilité",
    description: "Mesure du NPS pour évaluer la satisfaction globale et le potentiel de recommandation",
    objective: "Atteindre un NPS ≥30 (bon) ou ≥50 (excellent)",
    detailed_protocol: [
      "Question : 'De 0 à 10, recommanderiez-vous [produit] à un collègue/ami ?'",
      "Classez : Promoteurs (9-10), Passifs (7-8), Détracteurs (0-6)",
      "NPS = % Promoteurs - % Détracteurs",
      "Question ouverte : 'Pourquoi cette note ?'",
      "Administrez à tous les utilisateurs actifs (≥30 répondants)",
      "Analysez les verbatims par catégorie (Promoteurs vs Détracteurs)",
      "Créez un plan d'action pour convertir les Passifs en Promoteurs"
    ],
    target_metrics: { metric_name: "NPS", success_threshold: "NPS ≥30", failure_threshold: "NPS <0" },
    recommended_tools: ["Typeform", "Delighted", "Hotjar", "Google Forms"],
    tags: ["satisfaction", "NPS", "recommandation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 6
  },
  {
    test_number: 62,
    name: "DAU/MAU Ratio (Stickiness)",
    phase: "Phase 5 — Tests de Rétention",
    category: "Désirabilité",
    description: "Ratio d'utilisateurs actifs quotidiens vs mensuels pour mesurer l'engagement et la 'stickiness'",
    objective: "Atteindre un ratio DAU/MAU ≥20% (engagement élevé)",
    detailed_protocol: [
      "Définissez ce qu'est un 'utilisateur actif' (login, action clé, etc.)",
      "Instrumentez le tracking des sessions et actions clés",
      "Mesurez le DAU (Daily Active Users) et MAU (Monthly Active Users) sur 30 jours",
      "Calculez le ratio DAU/MAU (= stickiness)",
      "Benchmarkez vs votre industrie (SaaS: 13%, Social: 30%, Gaming: 20%)",
      "Analysez les facteurs d'utilisation quotidienne vs occasionnelle",
      "Identifiez les 'hooks' qui ramènent les utilisateurs chaque jour"
    ],
    target_metrics: { metric_name: "Ratio DAU/MAU", success_threshold: "≥20%", failure_threshold: "<10%" },
    recommended_tools: ["Mixpanel", "Amplitude", "Google Analytics", "PostHog"],
    tags: ["engagement", "stickiness", "DAU/MAU"],
    applicable_sectors: ["SaaS", "Marketplace", "EdTech", "Social Impact"],
    difficulty_level: "medium",
    estimated_duration: "1 mois (données nécessaires)",
    associated_step: 6
  },
  {
    test_number: 64,
    name: "Time-to-Value Measurement",
    phase: "Phase 5 — Tests de Rétention",
    category: "Désirabilité",
    description: "Mesure du temps nécessaire pour qu'un nouvel utilisateur atteigne son premier moment 'Aha!'",
    objective: "Réduire le Time-to-Value à <5 minutes pour les produits simples, <24h pour les complexes",
    detailed_protocol: [
      "Identifiez le 'moment Aha!' de votre produit (première valeur ressentie)",
      "Instrumentez le tracking du parcours d'onboarding",
      "Mesurez le temps entre l'inscription et le premier moment de valeur",
      "Segmentez par canal d'acquisition et persona",
      "Identifiez les étapes qui rallongent le temps (frictions)",
      "Testez des raccourcis : templates, données d'exemple, onboarding guidé",
      "Mesurez la corrélation entre TTV et rétention à 30 jours"
    ],
    target_metrics: { metric_name: "Time-to-Value médian", success_threshold: "<5min (simple) / <24h (complexe)", failure_threshold: ">30min (simple) / >7j (complexe)" },
    recommended_tools: ["Mixpanel", "Amplitude", "Pendo", "UserGuiding"],
    tags: ["onboarding", "TTV", "activation"],
    applicable_sectors: ["SaaS", "Marketplace", "EdTech", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },
  {
    test_number: 65,
    name: "Activation Rate Optimization",
    phase: "Phase 5 — Tests de Rétention",
    category: "Désirabilité",
    description: "Mesure et optimisation du taux d'activation (% d'inscrits qui atteignent le moment Aha!)",
    objective: "Atteindre un taux d'activation ≥25% dans les 7 premiers jours",
    detailed_protocol: [
      "Définissez l'événement d'activation (action clé = valeur reçue)",
      "Mesurez le taux d'activation actuel sur les dernières cohortes",
      "Mappez l'entonnoir d'inscription → activation étape par étape",
      "Identifiez les étapes avec le plus grand drop-off",
      "Créez des hypothèses d'amélioration pour chaque point de friction",
      "A/B testez les améliorations d'onboarding",
      "Mesurez l'impact sur le taux d'activation et la rétention"
    ],
    target_metrics: { metric_name: "Taux d'activation J7", success_threshold: "≥25%", failure_threshold: "<10%" },
    recommended_tools: ["Mixpanel", "Amplitude", "Intercom", "Chameleon"],
    tags: ["activation", "onboarding", "conversion"],
    applicable_sectors: ["SaaS", "Marketplace", "EdTech", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },
  {
    test_number: 68,
    name: "Channel Bullseye Framework",
    phase: "Phase 6 — Tests d'Acquisition",
    category: "Viabilité",
    description: "Application du framework Bullseye pour identifier les 3 canaux d'acquisition les plus performants",
    objective: "Identifier et valider les 3 canaux d'acquisition les plus rentables",
    detailed_protocol: [
      "Listez les 19 canaux de traction du framework Bullseye",
      "Brainstormez des idées de test pour chaque canal (ring extérieur)",
      "Sélectionnez 5-6 canaux prometteurs à tester (ring du milieu)",
      "Lancez des micro-tests (budget 50-100€, durée 1 semaine) par canal",
      "Mesurez : CPA, volume, qualité des leads, time-to-result",
      "Identifiez les 3 canaux gagnants (ring du centre)",
      "Investissez massivement dans le canal #1 et testez le scaling"
    ],
    target_metrics: { metric_name: "Nombre de canaux validés", success_threshold: "≥3 canaux avec CPA rentable", failure_threshold: "<1 canal performant" },
    recommended_tools: ["Google Ads", "Meta Ads", "LinkedIn", "Product Hunt", "Reddit"],
    tags: ["acquisition", "traction", "bullseye"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-4 semaines",
    associated_step: 6
  },
  {
    test_number: 72,
    name: "Referral Program Test",
    phase: "Phase 6 — Tests d'Acquisition",
    category: "Viabilité",
    description: "Test d'un programme de parrainage pour évaluer le potentiel de croissance virale",
    objective: "Atteindre un viral coefficient ≥0.3 (chaque utilisateur amène 0.3 nouveau)",
    detailed_protocol: [
      "Concevez le mécanisme de parrainage (incentive pour le parrain et le filleul)",
      "Testez 2-3 types d'incentives : crédits, fonctionnalités, réductions",
      "Intégrez le programme dans le produit (bouton de partage, lien unique)",
      "Lancez avec vos utilisateurs les plus engagés (Promoteurs NPS)",
      "Mesurez : taux de partage, taux de conversion des invités, viral coefficient",
      "Optimisez le message de partage et le parcours du filleul",
      "Calculez le CAC viral vs les autres canaux"
    ],
    target_metrics: { metric_name: "Viral coefficient", success_threshold: "≥0.3", failure_threshold: "<0.1" },
    recommended_tools: ["ReferralCandy", "Viral Loops", "GrowSurf", "Custom"],
    tags: ["viralité", "referral", "acquisition"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },
  {
    test_number: 77,
    name: "Onboarding Flow Optimization",
    phase: "Phase 6 — Tests d'Acquisition",
    category: "Désirabilité",
    description: "Optimisation du parcours d'onboarding pour maximiser l'activation et la rétention",
    objective: "Augmenter le taux de complétion de l'onboarding de ≥20%",
    detailed_protocol: [
      "Mappez le parcours d'onboarding actuel étape par étape",
      "Identifiez les drop-offs majeurs avec analytics et recordings",
      "Réduisez le nombre d'étapes au minimum nécessaire",
      "Ajoutez des éléments de gamification : progress bar, quick wins",
      "A/B testez les modifications sur de nouvelles cohortes",
      "Mesurez l'impact sur le taux de complétion et la rétention J7",
      "Itérez en continu sur les points de friction restants"
    ],
    target_metrics: { metric_name: "Taux de complétion onboarding", success_threshold: "Augmentation ≥20% vs baseline", failure_threshold: "Pas d'amélioration significative" },
    recommended_tools: ["UserGuiding", "Chameleon", "Pendo", "Hotjar"],
    tags: ["onboarding", "UX", "activation"],
    applicable_sectors: ["SaaS", "Marketplace", "EdTech", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },
  {
    test_number: 81,
    name: "Unit Economics Analysis",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Calcul détaillé des unit economics (CAC, LTV, ratio LTV/CAC, payback period)",
    objective: "Atteindre un ratio LTV/CAC ≥3 et un payback period <12 mois",
    detailed_protocol: [
      "Calculez le CAC par canal d'acquisition (coûts marketing / nouveaux clients)",
      "Calculez le LTV : ARPU × durée de vie moyenne × marge brute",
      "Calculez le ratio LTV/CAC (objectif: ≥3)",
      "Calculez le Payback Period : CAC / ARPU mensuel (objectif: <12 mois)",
      "Segmentez les unit economics par cohorte et canal",
      "Identifiez les leviers d'amélioration : augmenter LTV ou réduire CAC",
      "Projetez l'évolution des unit economics avec le scaling"
    ],
    target_metrics: { metric_name: "Ratio LTV/CAC", success_threshold: "≥3", failure_threshold: "<1.5" },
    recommended_tools: ["Google Sheets", "ChartMogul", "ProfitWell", "Baremetrics"],
    tags: ["unit-economics", "LTV", "CAC", "financier"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1 semaine",
    associated_step: 6
  },
  {
    test_number: 87,
    name: "Growth Loop Identification",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Identification et validation des boucles de croissance auto-alimentées (growth loops)",
    objective: "Identifier et activer au moins 1 growth loop fonctionnel",
    detailed_protocol: [
      "Cartographiez tous les flux d'utilisateurs dans votre produit",
      "Identifiez les boucles potentielles : virale, contenu UGC, data network effects",
      "Pour chaque boucle, mesurez le temps de cycle et le taux de conversion",
      "Testez l'amplification de la boucle la plus prometteuse",
      "Mesurez l'accélération : le cycle se raccourcit-il ? le volume augmente-t-il ?",
      "Optimisez chaque étape de la boucle pour réduire les frictions",
      "Documentez les conditions nécessaires pour que la boucle s'auto-alimente"
    ],
    target_metrics: { metric_name: "Growth loop actif", success_threshold: "≥1 boucle auto-alimentée validée", failure_threshold: "Aucune boucle identifiée" },
    recommended_tools: ["Miro", "Mixpanel", "Amplitude", "Notion"],
    tags: ["growth", "boucle", "viralité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "2-4 semaines",
    associated_step: 6
  },

  // ═══════════════════════════════════════════════════
  // ÉTAPE 7 — PLAN TACTIQUE (associated_step: 7)
  // ═══════════════════════════════════════════════════
  {
    test_number: 76,
    name: "Full Funnel A/B Testing",
    phase: "Phase 6 — Tests d'Acquisition",
    category: "Viabilité",
    description: "Tests A/B sur l'ensemble du funnel d'acquisition pour optimiser le taux de conversion global",
    objective: "Améliorer le taux de conversion global du funnel de ≥15%",
    detailed_protocol: [
      "Cartographiez votre funnel complet : Awareness → Interest → Desire → Action",
      "Identifiez les étapes avec les taux de conversion les plus faibles",
      "Créez des hypothèses d'amélioration pour chaque étape critique",
      "Lancez des A/B tests avec un échantillon statistiquement significatif",
      "Testez une variable à la fois : titre, CTA, prix, visuel, layout",
      "Mesurez l'impact sur le funnel complet (pas seulement l'étape testée)",
      "Documentez les winning variants et déployez-les"
    ],
    target_metrics: { metric_name: "Amélioration du taux de conversion", success_threshold: "≥15% d'amélioration globale", failure_threshold: "Pas d'amélioration significative" },
    recommended_tools: ["Google Optimize", "VWO", "Optimizely", "Hotjar"],
    tags: ["A/B-test", "conversion", "funnel"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 82,
    name: "Payback Period Optimization",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Optimisation du délai de récupération du coût d'acquisition client",
    objective: "Réduire le payback period à <12 mois (SaaS) ou <3 mois (e-commerce)",
    detailed_protocol: [
      "Calculez le payback period actuel : CAC / ARPU mensuel",
      "Identifiez les leviers : augmenter l'ARPU ou réduire le CAC",
      "Testez des stratégies d'upsell dès l'onboarding",
      "Optimisez les plans de pricing pour accélérer le revenu initial",
      "Réduisez le CAC par canal via l'optimisation des campagnes",
      "Mesurez l'impact de chaque levier sur le payback period",
      "Fixez un objectif de payback period et suivez-le mensuellement"
    ],
    target_metrics: { metric_name: "Payback period", success_threshold: "<12 mois (SaaS) / <3 mois (e-com)", failure_threshold: ">18 mois" },
    recommended_tools: ["Google Sheets", "ChartMogul", "ProfitWell"],
    tags: ["financier", "payback", "optimisation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 7
  },
  {
    test_number: 85,
    name: "Expansion Revenue Test",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Test de stratégies d'expansion revenue (upsell, cross-sell, add-ons) sur la base existante",
    objective: "Générer ≥20% de revenu additionnel par expansion sur la base existante",
    detailed_protocol: [
      "Identifiez les opportunités d'upsell (plan supérieur, volume, fonctionnalités premium)",
      "Identifiez les opportunités de cross-sell (produits complémentaires)",
      "Segmentez les clients par propension à l'expansion (usage, taille, engagement)",
      "Lancez des campagnes ciblées d'upsell/cross-sell",
      "Mesurez le taux de conversion et le revenu additionnel généré",
      "Calculez le ratio Net Revenue Retention (objectif: >110%)",
      "Optimisez le timing et le messaging des offres d'expansion"
    ],
    target_metrics: { metric_name: "Net Revenue Retention", success_threshold: ">110%", failure_threshold: "<100% (contraction)" },
    recommended_tools: ["Stripe", "ChartMogul", "Intercom", "HubSpot"],
    tags: ["expansion", "upsell", "NRR"],
    applicable_sectors: ["SaaS", "Marketplace", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 91,
    name: "Segment Expansion Test",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Validation de l'expansion vers de nouveaux segments de marché avec le produit existant",
    objective: "Valider la viabilité d'au moins 1 nouveau segment avec PMF initial",
    detailed_protocol: [
      "Identifiez 2-3 segments adjacents potentiels",
      "Conduisez 5-10 Problem Interviews dans chaque nouveau segment",
      "Évaluez le fit produit-segment : adaptations nécessaires vs valeur perçue",
      "Lancez un test d'acquisition ciblé sur le segment le plus prometteur",
      "Mesurez les métriques clés : CPA, activation, rétention",
      "Comparez les unit economics avec le segment principal",
      "Décidez GO/NO-GO pour l'expansion complète"
    ],
    target_metrics: { metric_name: "PMF dans le nouveau segment", success_threshold: "≥30% 'Très déçu' (Sean Ellis)", failure_threshold: "<15% 'Très déçu'" },
    recommended_tools: ["Typeform", "Google Ads", "LinkedIn Ads", "Mixpanel"],
    tags: ["expansion", "segments", "croissance"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 92,
    name: "SaaS — MRR Growth Rate Test",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Mesure et optimisation du taux de croissance du MRR (Monthly Recurring Revenue)",
    objective: "Atteindre un taux de croissance MRR ≥15% mensuel (early stage)",
    detailed_protocol: [
      "Calculez le MRR total et décomposez-le : New MRR, Expansion, Churn, Contraction",
      "Identifiez la contribution de chaque composante à la croissance",
      "Fixez des objectifs mensuels pour chaque composante",
      "Optimisez l'acquisition : augmentez le New MRR via les canaux validés",
      "Réduisez le Churn : identifiez les signaux prédictifs et intervenez tôt",
      "Maximisez l'Expansion : upsell systématique aux clients à fort usage",
      "Créez un tableau de bord MRR avec projections"
    ],
    target_metrics: { metric_name: "Croissance MRR mensuelle", success_threshold: "≥15% mensuel", failure_threshold: "<5% mensuel" },
    recommended_tools: ["ChartMogul", "Stripe", "ProfitWell", "Baremetrics"],
    tags: ["SaaS", "MRR", "croissance", "revenue"],
    applicable_sectors: ["SaaS"],
    difficulty_level: "medium",
    estimated_duration: "Mensuel (suivi continu)",
    associated_step: 7
  },
  {
    test_number: 93,
    name: "SaaS — Churn Rate Analysis",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Analyse détaillée du churn pour identifier les causes et réduire l'attrition",
    objective: "Réduire le churn rate mensuel à <5% (early) ou <2% (growth)",
    detailed_protocol: [
      "Calculez le churn rate : logo churn ET revenue churn",
      "Segmentez le churn par cohorte, plan, taille, canal d'acquisition",
      "Interviewez 10+ clients churned pour comprendre les raisons",
      "Identifiez les signaux prédictifs de churn (baisse d'usage, tickets, etc.)",
      "Créez un système d'alertes précoces (health score client)",
      "Testez des interventions de rétention : email, appel, offre spéciale",
      "Mesurez l'impact des interventions sur le taux de churn"
    ],
    target_metrics: { metric_name: "Churn rate mensuel", success_threshold: "<5% (early) / <2% (growth)", failure_threshold: ">10% mensuel" },
    recommended_tools: ["ChartMogul", "Intercom", "Gainsight", "Totango"],
    tags: ["SaaS", "churn", "rétention"],
    applicable_sectors: ["SaaS"],
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 94,
    name: "SaaS — Feature Adoption Tracking",
    phase: "Phase 7 — Tests Financiers",
    category: "Désirabilité",
    description: "Suivi de l'adoption des fonctionnalités pour identifier celles qui drivent la rétention et l'expansion",
    objective: "Identifier les 3 fonctionnalités les plus corrélées à la rétention",
    detailed_protocol: [
      "Listez toutes les fonctionnalités principales du produit",
      "Instrumentez le tracking d'utilisation de chaque fonctionnalité",
      "Mesurez le taux d'adoption de chaque fonctionnalité",
      "Corrélation : quelles fonctionnalités prédisent la rétention à 90j ?",
      "Identifiez les 'power features' et les fonctionnalités sous-utilisées",
      "Poussez l'adoption des power features via l'onboarding et les nudges",
      "Évaluez la suppression des fonctionnalités non adoptées"
    ],
    target_metrics: { metric_name: "Feature adoption rate (core)", success_threshold: "≥60% pour les fonctionnalités core", failure_threshold: "<30% pour les fonctionnalités core" },
    recommended_tools: ["Pendo", "Amplitude", "Mixpanel", "PostHog"],
    tags: ["SaaS", "adoption", "fonctionnalités"],
    applicable_sectors: ["SaaS"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 7
  },
  {
    test_number: 95,
    name: "SaaS — Annual Contract Value Test",
    phase: "Phase 7 — Tests Financiers",
    category: "Viabilité",
    description: "Test de migration des clients vers des contrats annuels pour améliorer le cashflow et réduire le churn",
    objective: "Convertir ≥30% des clients mensuels en contrats annuels",
    detailed_protocol: [
      "Définissez la remise annuelle attractive (généralement 15-20%)",
      "Identifiez les clients éligibles (≥3 mois d'ancienneté, bon usage)",
      "Créez une campagne de migration avec messaging de valeur",
      "A/B testez les incentives : remise, fonctionnalités bonus, support premium",
      "Mesurez le taux de conversion vers l'annuel",
      "Calculez l'impact sur le cashflow et le churn annualisé",
      "Optimisez l'offre et automatisez les rappels à l'approche du renouvellement"
    ],
    target_metrics: { metric_name: "Taux de migration annuel", success_threshold: "≥30% de conversion", failure_threshold: "<10% de conversion" },
    recommended_tools: ["Stripe", "ChartMogul", "Intercom", "HubSpot"],
    tags: ["SaaS", "contrat-annuel", "cashflow"],
    applicable_sectors: ["SaaS"],
    difficulty_level: "medium",
    estimated_duration: "4-6 semaines",
    associated_step: 7
  },
  {
    test_number: 98,
    name: "Marketplace — Liquidity Test",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Test de la liquidité de la marketplace : match rate entre offre et demande",
    objective: "Atteindre un taux de matching ≥30% (transactions/listings)",
    detailed_protocol: [
      "Définissez la métrique de liquidité : transactions réussies / listings actifs",
      "Mesurez séparément l'offre (listings, vendeurs) et la demande (recherches, acheteurs)",
      "Identifiez le ratio optimal offre/demande pour votre catégorie",
      "Testez des stratégies de bootstrap : contraindre géographiquement, subventionner un côté",
      "Mesurez le temps moyen entre listing et première transaction",
      "Identifiez les catégories/zones avec la meilleure et la pire liquidité",
      "Optimisez l'algorithme de matching et les recommandations"
    ],
    target_metrics: { metric_name: "Taux de matching", success_threshold: "≥30%", failure_threshold: "<10%" },
    recommended_tools: ["Google Analytics", "Mixpanel", "Custom dashboard", "SQL"],
    tags: ["marketplace", "liquidité", "matching"],
    applicable_sectors: ["Marketplace"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 99,
    name: "Marketplace — Trust & Safety Test",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Désirabilité",
    description: "Évaluation et renforcement des mécanismes de confiance et sécurité de la marketplace",
    objective: "Atteindre un taux de résolution des litiges ≥90% et un taux de fraude <1%",
    detailed_protocol: [
      "Auditez les mécanismes de confiance existants : avis, vérification, garanties",
      "Mesurez le taux de litiges, fraudes et plaintes",
      "Identifiez les sources principales de méfiance (enquête utilisateurs)",
      "Implémentez des mécanismes de confiance : escrow, assurance, vérification ID",
      "Testez l'impact de chaque mécanisme sur le taux de conversion",
      "Créez un processus de résolution des litiges efficace",
      "Mesurez l'amélioration du taux de confiance et de la rétention"
    ],
    target_metrics: { metric_name: "Taux de résolution des litiges", success_threshold: "≥90%", failure_threshold: "<70%" },
    recommended_tools: ["Stripe Connect", "Mangopay", "Trustpilot", "Zendesk"],
    tags: ["marketplace", "confiance", "sécurité"],
    applicable_sectors: ["Marketplace"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 100,
    name: "Marketplace — Take Rate Optimization",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Optimisation du taux de commission de la marketplace pour maximiser le revenu sans perdre les vendeurs",
    objective: "Trouver le take rate optimal qui maximise le revenu total",
    detailed_protocol: [
      "Benchmarkez les take rates de marketplaces comparables",
      "Testez 2-3 niveaux de commission différents (A/B test ou par cohorte)",
      "Mesurez l'impact sur : volume de transactions, nombre de vendeurs, revenu total",
      "Évaluez l'élasticité : comment le volume réagit aux variations de prix",
      "Testez des modèles alternatifs : fixe, %, freemium, abonnement",
      "Identifiez le point d'équilibre entre revenu par transaction et volume",
      "Documentez le modèle de pricing optimal avec projections"
    ],
    target_metrics: { metric_name: "Take rate optimal", success_threshold: "Take rate qui maximise le revenu total", failure_threshold: "Take rate qui fait fuir les vendeurs" },
    recommended_tools: ["Stripe", "Google Sheets", "Mixpanel"],
    tags: ["marketplace", "pricing", "commission"],
    applicable_sectors: ["Marketplace"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 103,
    name: "E-commerce — Cart Abandonment Analysis",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Analyse et réduction du taux d'abandon de panier pour maximiser les conversions",
    objective: "Réduire le taux d'abandon de panier de ≥15% vs baseline",
    detailed_protocol: [
      "Mesurez le taux d'abandon actuel et identifiez l'étape de drop-off",
      "Analysez les raisons d'abandon : enquête de sortie, session recordings",
      "Implémentez des emails de relance panier abandonné (séquence de 3)",
      "Simplifiez le checkout : réduisez les champs, ajoutez le guest checkout",
      "Ajoutez des éléments de confiance : avis, garantie, sécurité paiement",
      "A/B testez les modifications du checkout",
      "Mesurez l'impact sur le taux de conversion et le revenu"
    ],
    target_metrics: { metric_name: "Réduction abandon panier", success_threshold: "≥15% de réduction", failure_threshold: "Pas d'amélioration" },
    recommended_tools: ["Hotjar", "Google Analytics", "Klaviyo", "Shopify"],
    tags: ["e-commerce", "conversion", "panier"],
    applicable_sectors: ["E-commerce"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 7
  },
  {
    test_number: 106,
    name: "E-commerce — AOV Optimization",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Stratégies pour augmenter le panier moyen (Average Order Value) : bundles, upsell, seuils",
    objective: "Augmenter l'AOV de ≥20% via des stratégies de bundling et upsell",
    detailed_protocol: [
      "Calculez l'AOV actuel et sa distribution",
      "Identifiez les produits fréquemment achetés ensemble (market basket analysis)",
      "Créez des bundles et offres complémentaires",
      "Testez un seuil de livraison gratuite (juste au-dessus de l'AOV moyen)",
      "Implémentez des recommandations produit personnalisées",
      "A/B testez les stratégies d'upsell au checkout",
      "Mesurez l'impact sur l'AOV, le taux de conversion et le revenu total"
    ],
    target_metrics: { metric_name: "Augmentation AOV", success_threshold: "≥20% d'augmentation", failure_threshold: "<5% d'amélioration" },
    recommended_tools: ["Shopify", "Google Analytics", "Nosto", "Algolia"],
    tags: ["e-commerce", "AOV", "upsell"],
    applicable_sectors: ["E-commerce"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 7
  },
  {
    test_number: 107,
    name: "E-commerce — Return Rate Analysis",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Analyse et réduction du taux de retour pour améliorer la marge nette",
    objective: "Réduire le taux de retour à <10% (objectif <5% pour les produits non-mode)",
    detailed_protocol: [
      "Mesurez le taux de retour par catégorie, canal et raison",
      "Identifiez les produits avec les taux de retour les plus élevés",
      "Améliorez les descriptions produits : photos réalistes, guides de taille, vidéos",
      "Testez un questionnaire pré-achat pour réduire les erreurs",
      "Analysez les commentaires des clients retournant des produits",
      "Implémentez un chatbot d'aide au choix pour les catégories à fort retour",
      "Mesurez l'impact sur le taux de retour et la satisfaction client"
    ],
    target_metrics: { metric_name: "Taux de retour", success_threshold: "<10% global", failure_threshold: ">20%" },
    recommended_tools: ["Shopify", "Returnly", "Loop Returns", "Google Analytics"],
    tags: ["e-commerce", "retours", "qualité"],
    applicable_sectors: ["E-commerce"],
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 108,
    name: "B2B — Sales Cycle Analysis",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Analyse et optimisation du cycle de vente B2B pour accélérer le closing",
    objective: "Réduire le cycle de vente de ≥20% vs baseline",
    detailed_protocol: [
      "Cartographiez le cycle de vente complet : prospection → qualification → démo → proposition → closing",
      "Mesurez la durée et le taux de conversion de chaque étape",
      "Identifiez les étapes goulots d'étranglement (délai ou drop-off)",
      "Optimisez : préparez les objections, automatisez les relances, simplifiez les propositions",
      "Testez des techniques d'accélération : urgence, pilote gratuit, champion interne",
      "Mesurez l'impact sur le cycle de vente et le taux de closing",
      "Documentez le playbook de vente optimisé"
    ],
    target_metrics: { metric_name: "Durée du cycle de vente", success_threshold: "Réduction ≥20%", failure_threshold: "Pas d'amélioration" },
    recommended_tools: ["HubSpot", "Salesforce", "Pipedrive", "Gong"],
    tags: ["B2B", "vente", "cycle"],
    applicable_sectors: ["SaaS", "DeepTech", "FinTech"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 109,
    name: "B2B — Pilot Program Design",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Viabilité",
    description: "Conception et exécution d'un programme pilote structuré pour convertir les prospects enterprise",
    objective: "Convertir ≥50% des pilotes en contrats payants",
    detailed_protocol: [
      "Définissez les critères de sélection des clients pilotes (taille, secteur, maturité)",
      "Concevez le programme : durée (30-90j), périmètre, métriques de succès",
      "Préparez un 'success plan' personnalisé pour chaque pilote",
      "Assignez un CSM dédié pour l'accompagnement",
      "Collectez des métriques de valeur quantifiables (ROI, gain de temps, etc.)",
      "Organisez un review à mi-parcours et un bilan final",
      "Préparez la proposition commerciale basée sur les résultats du pilote"
    ],
    target_metrics: { metric_name: "Taux de conversion pilote → contrat", success_threshold: "≥50%", failure_threshold: "<25%" },
    recommended_tools: ["HubSpot", "Notion", "Loom", "Google Docs"],
    tags: ["B2B", "pilote", "enterprise"],
    applicable_sectors: ["SaaS", "DeepTech", "FinTech", "HealthTech"],
    difficulty_level: "hard",
    estimated_duration: "2-3 mois",
    associated_step: 7
  },
  {
    test_number: 110,
    name: "B2B — Champion Identification Test",
    phase: "Phase 8 — Tests B2B Enterprise",
    category: "Désirabilité",
    description: "Identification et activation des champions internes dans les organisations cibles",
    objective: "Identifier et activer ≥1 champion par deal enterprise en cours",
    detailed_protocol: [
      "Définissez le profil du champion idéal : rôle, influence, motivation",
      "Identifiez les utilisateurs les plus engagés dans chaque organisation prospect",
      "Évaluez leur influence réelle : peuvent-ils débloquer des budgets ?",
      "Armez le champion : ROI business case, comparaison concurrence, témoignages",
      "Créez un programme de champion : accès early, formation, reconnaissance",
      "Mesurez l'impact des champions sur le cycle de vente et le closing",
      "Documentez les patterns de champion réussis pour les répliquer"
    ],
    target_metrics: { metric_name: "Champions actifs par deal", success_threshold: "≥1 champion identifié et actif", failure_threshold: "Aucun champion dans les deals" },
    recommended_tools: ["LinkedIn", "Gong", "Salesforce", "Notion"],
    tags: ["B2B", "champion", "vente-enterprise"],
    applicable_sectors: ["SaaS", "DeepTech", "FinTech"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 118,
    name: "Impact — Theory of Change Test",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Viabilité",
    description: "Validation de la théorie du changement pour les startups à impact social ou environnemental",
    objective: "Valider que les activités mènent aux résultats d'impact mesurables prévus",
    detailed_protocol: [
      "Formalisez votre Theory of Change : Inputs → Activities → Outputs → Outcomes → Impact",
      "Identifiez les hypothèses critiques à chaque étape de la chaîne causale",
      "Définissez des indicateurs mesurables pour chaque niveau",
      "Collectez les premières données d'impact (même à petite échelle)",
      "Validez la chaîne causale : vos activités produisent-elles les outputs attendus ?",
      "Évaluez l'attribution : l'impact est-il dû à votre intervention ?",
      "Documentez les preuves d'impact pour les investisseurs et partenaires"
    ],
    target_metrics: { metric_name: "Chaîne causale validée", success_threshold: "≥3/5 étapes validées par données", failure_threshold: "<2 étapes validées" },
    recommended_tools: ["IRIS+", "SROI Calculator", "Notion", "Google Sheets"],
    tags: ["impact", "ToC", "social"],
    applicable_sectors: ["Social Impact", "GreenTech", "EdTech", "HealthTech"],
    difficulty_level: "hard",
    estimated_duration: "4-8 semaines",
    associated_step: 7
  },
  {
    test_number: 119,
    name: "Impact — Beneficiary Feedback Loop",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Désirabilité",
    description: "Mise en place d'une boucle de feedback systématique avec les bénéficiaires de l'impact",
    objective: "Collecter du feedback structuré de ≥30 bénéficiaires et intégrer les insights",
    detailed_protocol: [
      "Identifiez vos bénéficiaires directs et indirects",
      "Créez un mécanisme de feedback adapté (enquête, interview, focus group)",
      "Collectez du feedback sur : la pertinence, l'accessibilité, l'impact perçu",
      "Analysez les résultats par segment de bénéficiaires",
      "Identifiez les améliorations prioritaires selon les bénéficiaires",
      "Intégrez les insights dans le cycle de développement produit",
      "Mesurez l'amélioration de la satisfaction des bénéficiaires au fil du temps"
    ],
    target_metrics: { metric_name: "Satisfaction bénéficiaires", success_threshold: "≥70% de satisfaction", failure_threshold: "<50% de satisfaction" },
    recommended_tools: ["Typeform", "KoboToolbox", "SurveyCTO", "Google Forms"],
    tags: ["impact", "feedback", "bénéficiaires"],
    applicable_sectors: ["Social Impact", "GreenTech", "EdTech", "HealthTech"],
    difficulty_level: "medium",
    estimated_duration: "2-4 semaines",
    associated_step: 7
  },
  {
    test_number: 120,
    name: "Impact — SDG Alignment Scorecard",
    phase: "Phase 9 — Tests Spécialisés",
    category: "Viabilité",
    description: "Évaluation de l'alignement du projet avec les Objectifs de Développement Durable (ODD/SDGs)",
    objective: "Démontrer un alignement mesurable avec au moins 2 SDGs pertinents",
    detailed_protocol: [
      "Identifiez les SDGs pertinents pour votre activité (1-3 SDGs principaux)",
      "Pour chaque SDG, identifiez les cibles et indicateurs ONU applicables",
      "Mesurez votre contribution actuelle à chaque indicateur",
      "Définissez des objectifs d'impact chiffrés sur 1, 3 et 5 ans",
      "Créez un tableau de bord d'impact aligné SDG",
      "Documentez les preuves d'impact pour chaque SDG",
      "Utilisez le scorecard pour la communication investisseurs et partenaires"
    ],
    target_metrics: { metric_name: "Alignement SDG démontré", success_threshold: "≥2 SDGs avec données d'impact", failure_threshold: "Aucun SDG avec preuves mesurables" },
    recommended_tools: ["SDG Compass", "IRIS+", "B Impact Assessment", "Google Sheets"],
    tags: ["impact", "SDG", "ODD"],
    applicable_sectors: ["Social Impact", "GreenTech", "EdTech", "HealthTech"],
    difficulty_level: "medium",
    estimated_duration: "2-3 semaines",
    associated_step: 7
  },

  // ═══════════════════════════════════════════════════
  // TESTS GÉNÉRIQUES (associated_step: 0)
  // Phases restantes pour compléter les 138 tests
  // ═══════════════════════════════════════════════════
  {
    test_number: 3,
    name: "Survey Quantitatif",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Enquête quantitative à grande échelle pour valider les hypothèses issues des interviews qualitatives",
    objective: "Collecter ≥100 réponses exploitables pour valider statistiquement les hypothèses",
    detailed_protocol: [
      "Transformez vos hypothèses qualitatives en questions fermées mesurables",
      "Créez un questionnaire de 10-15 questions maximum (durée <5 min)",
      "Incluez des questions de segmentation (âge, rôle, secteur)",
      "Diffusez via les canaux pertinents : email, réseaux sociaux, forums",
      "Visez ≥100 répondants pour la significativité statistique",
      "Analysez les résultats par segment avec des tests statistiques simples",
      "Croisez les résultats avec les insights qualitatifs"
    ],
    target_metrics: { metric_name: "Nombre de répondants", success_threshold: "≥100 réponses exploitables", failure_threshold: "<30 réponses" },
    recommended_tools: ["Typeform", "Google Forms", "SurveyMonkey", "Tally"],
    tags: ["quantitatif", "enquête", "validation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 4,
    name: "Observation Ethnographique",
    phase: "Phase 1 — Tests Fondamentaux",
    category: "Désirabilité",
    description: "Observation directe des utilisateurs dans leur environnement naturel pour comprendre les comportements réels",
    objective: "Identifier ≥3 comportements non déclarés en interview qui impactent le problème",
    detailed_protocol: [
      "Identifiez 3-5 contextes d'observation (lieu de travail, domicile, etc.)",
      "Obtenez les autorisations nécessaires et le consentement",
      "Observez pendant 30-60min sans intervenir ni questionner",
      "Documentez : actions, hésitations, workarounds, outils utilisés",
      "Notez les écarts entre ce que les gens disent et font",
      "Photographiez ou filmez (avec consentement) les éléments clés",
      "Synthétisez les insights en 'jobs-to-be-done' non déclarés"
    ],
    target_metrics: { metric_name: "Comportements non déclarés identifiés", success_threshold: "≥3 insights nouveaux", failure_threshold: "<1 insight nouveau" },
    recommended_tools: ["Appareil photo", "Carnet de notes", "Dovetail", "Notion"],
    tags: ["ethnographique", "qualitatif", "observation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 16,
    name: "Clickable Prototype Test",
    phase: "Phase 2 — Tests de Solution",
    category: "Désirabilité",
    description: "Test d'utilisabilité avec un prototype interactif haute fidélité pour valider l'expérience utilisateur",
    objective: "Obtenir un SUS (System Usability Scale) ≥68 (au-dessus de la moyenne)",
    detailed_protocol: [
      "Créez un prototype clickable haute fidélité (Figma, InVision)",
      "Définissez 5-7 tâches clés que l'utilisateur doit accomplir",
      "Recrutez 5-8 testeurs représentatifs",
      "Conduisez des tests en think-aloud protocol (l'utilisateur verbalise ses pensées)",
      "Mesurez : taux de réussite par tâche, temps de complétion, erreurs",
      "Administrez le questionnaire SUS en fin de test",
      "Priorisez les corrections UX par impact × fréquence"
    ],
    target_metrics: { metric_name: "Score SUS", success_threshold: "≥68 (au-dessus de la moyenne)", failure_threshold: "<50 (en dessous de la moyenne)" },
    recommended_tools: ["Figma", "Maze", "UserTesting", "Lookback"],
    tags: ["prototype", "UX", "usabilité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 21,
    name: "Fake Door Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Bouton ou page factice pour mesurer l'intérêt pour une fonctionnalité avant de la développer",
    objective: "Mesurer un taux de clic ≥5% sur la fonctionnalité factice",
    detailed_protocol: [
      "Identifiez la fonctionnalité à tester",
      "Ajoutez un bouton/lien visible dans le produit existant",
      "Au clic, affichez un message : 'Bientôt disponible ! Intéressé ? Inscrivez-vous'",
      "Mesurez le taux de clic par rapport aux impressions",
      "Collectez les emails des intéressés pour le beta testing",
      "Analysez le profil des cliqueurs vs non-cliqueurs",
      "Décidez du GO/NO-GO basé sur le taux d'intérêt"
    ],
    target_metrics: { metric_name: "Taux de clic fake door", success_threshold: "≥5%", failure_threshold: "<2%" },
    recommended_tools: ["Google Analytics", "Optimizely", "PostHog", "Custom"],
    tags: ["fake-door", "validation", "fonctionnalité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 0
  },
  {
    test_number: 23,
    name: "Explainer Video Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Vidéo explicative pour tester la compréhension et l'intérêt pour la solution",
    objective: "Obtenir un taux de visionnage complet ≥30% et un CTR ≥5% sur le CTA",
    detailed_protocol: [
      "Créez une vidéo de 60-90 secondes expliquant le problème et la solution",
      "Structure : accroche (5s), problème (15s), solution (30s), bénéfices (15s), CTA (5s)",
      "Diffusez sur votre landing page et les réseaux sociaux",
      "Mesurez : taux de visionnage, durée moyenne, point de drop-off",
      "Mesurez le CTR sur le CTA à la fin de la vidéo",
      "A/B testez différentes accroches et messages",
      "Utilisez les insights pour affiner le messaging"
    ],
    target_metrics: { metric_name: "Taux de visionnage complet", success_threshold: "≥30% de visionnage complet", failure_threshold: "<15% de visionnage complet" },
    recommended_tools: ["Loom", "Canva", "InVideo", "Wistia"],
    tags: ["vidéo", "messaging", "conversion"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "3-5 jours",
    associated_step: 0
  },
  {
    test_number: 24,
    name: "Social Media Listening",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Analyse des conversations sur les réseaux sociaux pour comprendre les besoins et tendances du marché",
    objective: "Identifier ≥5 insights actionnables sur les besoins non satisfaits du marché",
    detailed_protocol: [
      "Configurez des alertes sur les mots-clés liés à votre problème/secteur",
      "Analysez les groupes Facebook, subreddits, forums spécialisés",
      "Identifiez les plaintes récurrentes et les besoins exprimés",
      "Analysez le sentiment global : positif, négatif, neutre",
      "Identifiez les influenceurs et leaders d'opinion dans votre niche",
      "Documentez les verbatims les plus représentatifs",
      "Utilisez les insights pour affiner votre positionnement et messaging"
    ],
    target_metrics: { metric_name: "Insights actionnables", success_threshold: "≥5 insights validés", failure_threshold: "<2 insights pertinents" },
    recommended_tools: ["Brand24", "Mention", "Reddit", "Twitter/X"],
    tags: ["social-listening", "marché", "insights"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 25,
    name: "Forum & Community Validation",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Présentation du concept dans des communautés en ligne pour obtenir du feedback direct",
    objective: "Obtenir ≥20 réactions qualifiées et ≥5 demandes de test/inscription",
    detailed_protocol: [
      "Identifiez 3-5 communautés pertinentes (Reddit, ProductHunt, forums spécialisés)",
      "Rédigez un post présentant le problème (pas la solution) et demandez du feedback",
      "Répondez activement à chaque commentaire pendant 48-72h",
      "Publiez ensuite un post présentant votre approche de solution",
      "Mesurez : upvotes, commentaires, DMs, inscriptions à la beta",
      "Analysez la qualité du feedback : constructif, enthousiaste, sceptique",
      "Identifiez les early adopters les plus motivés"
    ],
    target_metrics: { metric_name: "Engagement communautaire", success_threshold: "≥20 réactions qualifiées", failure_threshold: "<5 réactions" },
    recommended_tools: ["Reddit", "ProductHunt", "Indie Hackers", "Discord"],
    tags: ["communauté", "validation", "feedback"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 0
  },
  {
    test_number: 26,
    name: "Email Campaign Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Campagne email ciblée pour tester le messaging et mesurer l'intérêt avec des métriques d'engagement",
    objective: "Atteindre un taux d'ouverture ≥25% et un taux de clic ≥5%",
    detailed_protocol: [
      "Constituez une liste de 100-500 prospects qualifiés",
      "Créez 3 variantes d'email avec des angles différents (problème, bénéfice, urgence)",
      "Personnalisez avec le nom, l'entreprise et un hook contextuel",
      "Envoyez les variantes en A/B test (33% chacune)",
      "Mesurez : taux d'ouverture, taux de clic, réponses, inscriptions",
      "Analysez quel angle génère le plus d'engagement",
      "Utilisez les learnings pour toute la communication marketing"
    ],
    target_metrics: { metric_name: "Taux d'ouverture email", success_threshold: "≥25% ouverture, ≥5% clic", failure_threshold: "<15% ouverture" },
    recommended_tools: ["Mailchimp", "Lemlist", "Brevo", "Google Sheets"],
    tags: ["email", "outreach", "messaging"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1 semaine",
    associated_step: 0
  },
  {
    test_number: 29,
    name: "LinkedIn Organic Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Publication de contenu sur LinkedIn pour tester le messaging et bâtir une audience qualifiée",
    objective: "Atteindre ≥1000 impressions et ≥50 engagements qualifiés en 2 semaines",
    detailed_protocol: [
      "Publiez 5-7 posts liés à votre problème/solution sur 2 semaines",
      "Testez différents formats : texte, carrousel, vidéo, sondage",
      "Variez les angles : histoire personnelle, data, question, controverse",
      "Engagez avec chaque commentaire et DM dans l'heure",
      "Mesurez : impressions, engagements, profil views, DMs, connexions",
      "Identifiez les sujets et formats qui résonnent le plus",
      "Convertissez les engagés en beta testeurs ou inscrits"
    ],
    target_metrics: { metric_name: "Engagements qualifiés", success_threshold: "≥50 engagements en 2 semaines", failure_threshold: "<15 engagements" },
    recommended_tools: ["LinkedIn", "Shield", "Canva", "Buffer"],
    tags: ["LinkedIn", "organique", "contenu"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2 semaines",
    associated_step: 0
  },
  {
    test_number: 30,
    name: "Product Hunt Launch Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Lancement sur Product Hunt pour tester l'intérêt de la communauté tech et obtenir des early adopters",
    objective: "Atteindre le top 5 du jour avec ≥100 upvotes et ≥50 signups",
    detailed_protocol: [
      "Préparez votre page Product Hunt : tagline, description, assets visuels",
      "Construisez une communauté de supporters 2-3 semaines avant le launch",
      "Choisissez le jour de lancement (mardi-jeudi, évitez les gros lancements)",
      "Lancez à 00:01 PST et communiquez massivement dans les premières heures",
      "Répondez à CHAQUE commentaire dans l'heure",
      "Mesurez : upvotes, commentaires, signups, conversion, trafic",
      "Utilisez les early adopters PH pour valider le product-market fit"
    ],
    target_metrics: { metric_name: "Classement Product Hunt", success_threshold: "Top 5 du jour, ≥100 upvotes", failure_threshold: "Hors top 20" },
    recommended_tools: ["Product Hunt", "Twitter/X", "Canva", "Loom"],
    tags: ["launch", "ProductHunt", "early-adopters"],
    applicable_sectors: ["SaaS", "Marketplace", "EdTech", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "3-4 semaines (préparation + lancement)",
    associated_step: 0
  },
  {
    test_number: 31,
    name: "Content Marketing Validation",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Publication de contenu éducatif pour valider l'intérêt du marché et construire une audience",
    objective: "Atteindre ≥500 lecteurs qualifiés et ≥20 inscriptions via le contenu",
    detailed_protocol: [
      "Identifiez 5-10 sujets liés à votre problème/solution",
      "Publiez 3-5 articles de blog ou threads détaillés",
      "Optimisez pour le SEO : mots-clés, structure, meta descriptions",
      "Distribuez via les canaux pertinents (newsletter, LinkedIn, communautés)",
      "Incluez un CTA vers votre landing page ou waitlist",
      "Mesurez : trafic, temps de lecture, taux de conversion, partages",
      "Identifiez les sujets qui attirent le plus de prospects qualifiés"
    ],
    target_metrics: { metric_name: "Lecteurs qualifiés", success_threshold: "≥500 lecteurs, ≥20 inscriptions", failure_threshold: "<100 lecteurs" },
    recommended_tools: ["WordPress", "Medium", "Substack", "Google Analytics"],
    tags: ["contenu", "SEO", "marketing"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "2-4 semaines",
    associated_step: 0
  },
  {
    test_number: 32,
    name: "Webinar/Workshop Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Organisation d'un webinaire ou workshop gratuit pour valider l'intérêt et convertir des prospects",
    objective: "Attirer ≥30 inscrits avec un taux de participation ≥40% et ≥5 demandes de démo",
    detailed_protocol: [
      "Choisissez un sujet éducatif lié au problème que vous résolvez",
      "Créez une page d'inscription avec proposition de valeur claire",
      "Promouvez via email, LinkedIn, partenariats 2-3 semaines avant",
      "Délivrez un contenu de haute valeur (pas un pitch produit)",
      "Incluez une démo subtile de votre solution dans le contenu",
      "Proposez un CTA en fin de webinaire : démo, essai gratuit, consultation",
      "Mesurez : inscrits, participants, engagement, conversions post-event"
    ],
    target_metrics: { metric_name: "Taux de participation", success_threshold: "≥40% des inscrits présents", failure_threshold: "<20% de participation" },
    recommended_tools: ["Zoom", "Eventbrite", "Calendly", "Mailchimp"],
    tags: ["webinaire", "éducation", "lead-gen"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "2-3 semaines",
    associated_step: 0
  },
  {
    test_number: 33,
    name: "Partnership Validation",
    phase: "Phase 3 — Tests de Marché",
    category: "Viabilité",
    description: "Validation de partenariats stratégiques pour accélérer la distribution et la crédibilité",
    objective: "Obtenir au moins 1 LOI (Letter of Intent) de partenariat avec un acteur établi",
    detailed_protocol: [
      "Identifiez 5-10 partenaires potentiels (distribution, technologie, contenu)",
      "Évaluez la valeur mutuelle : qu'apportez-vous ? que recevez-vous ?",
      "Contactez les décideurs via introductions warm (LinkedIn, réseau)",
      "Présentez une proposition win-win avec des termes clairs",
      "Négociez un pilote de partenariat à faible engagement",
      "Mesurez la valeur générée par le partenariat pilote",
      "Documentez les résultats pour justifier un partenariat formel"
    ],
    target_metrics: { metric_name: "LOI de partenariat", success_threshold: "≥1 LOI signée", failure_threshold: "0 réponse positive" },
    recommended_tools: ["LinkedIn", "Calendly", "DocuSign", "Google Docs"],
    tags: ["partenariat", "distribution", "stratégie"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "3-6 semaines",
    associated_step: 0
  },
  {
    test_number: 34,
    name: "Cold Outreach Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Campagne de prospection à froid pour tester le messaging et mesurer le taux de réponse",
    objective: "Atteindre un taux de réponse ≥10% et un taux de meeting ≥3%",
    detailed_protocol: [
      "Constituez une liste de 200-500 prospects ciblés",
      "Créez une séquence de 3-5 emails/messages personnalisés",
      "Personnalisez chaque message : nom, entreprise, problème spécifique",
      "Testez 3 variantes de l'accroche initiale",
      "Envoyez 50 prospects par variante pour le A/B test",
      "Mesurez : taux d'ouverture, réponse, meeting booké, conversion",
      "Itérez sur le messaging gagnant et scalez"
    ],
    target_metrics: { metric_name: "Taux de réponse cold outreach", success_threshold: "≥10% de réponse", failure_threshold: "<3% de réponse" },
    recommended_tools: ["Lemlist", "Apollo.io", "LinkedIn Sales Navigator", "Calendly"],
    tags: ["outreach", "prospection", "B2B"],
    applicable_sectors: ["SaaS", "FinTech", "DeepTech", "HealthTech"],
    difficulty_level: "medium",
    estimated_duration: "2-3 semaines",
    associated_step: 0
  },
  {
    test_number: 35,
    name: "Waitlist & Coming Soon Page",
    phase: "Phase 3 — Tests de Marché",
    category: "Désirabilité",
    description: "Page 'Coming Soon' avec waitlist pour mesurer l'intérêt avant le développement",
    objective: "Collecter ≥200 emails qualifiés en 2-4 semaines",
    detailed_protocol: [
      "Créez une page teaser avec proposition de valeur et visuel accrocheur",
      "Ajoutez un formulaire d'inscription email avec incentive (accès early, remise)",
      "Optionnel : système de referral pour amplifier (chaque inscrit gagne en invitant)",
      "Lancez des campagnes d'acquisition vers la page (ads, social, PR)",
      "Mesurez : visites, inscriptions, taux de conversion, source de trafic",
      "Engagez la waitlist avec des updates régulières (build in public)",
      "Analysez la qualité des inscrits : correspondent-ils à votre persona ?"
    ],
    target_metrics: { metric_name: "Inscriptions waitlist", success_threshold: "≥200 emails en 2-4 semaines", failure_threshold: "<50 emails" },
    recommended_tools: ["Carrd", "LaunchRock", "Viral Loops", "Mailchimp"],
    tags: ["waitlist", "pré-lancement", "validation"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 36,
    name: "LOI (Letter of Intent) Test",
    phase: "Phase 3 — Tests de Marché",
    category: "Viabilité",
    description: "Collecte de lettres d'intention d'achat pour démontrer l'engagement des prospects B2B",
    objective: "Obtenir ≥3 LOI signées avec un montant total significatif",
    detailed_protocol: [
      "Identifiez 10-15 prospects qualifiés qui ont exprimé un intérêt fort",
      "Préparez un document LOI simple : description du produit, prix indicatif, conditions",
      "Rencontrez chaque prospect et présentez la LOI comme engagement non-contraignant",
      "Négociez les termes : volume, prix, délai de livraison",
      "Collectez les LOI signées et documentez les conditions",
      "Utilisez les LOI pour les levées de fonds et la priorisation produit",
      "Convertissez les LOI en premiers clients dès le lancement"
    ],
    target_metrics: { metric_name: "LOI signées", success_threshold: "≥3 LOI signées", failure_threshold: "<1 LOI" },
    recommended_tools: ["DocuSign", "Google Docs", "PandaDoc", "Calendly"],
    tags: ["LOI", "B2B", "engagement"],
    applicable_sectors: ["SaaS", "DeepTech", "FinTech", "HealthTech"],
    difficulty_level: "hard",
    estimated_duration: "3-6 semaines",
    associated_step: 0
  },
  {
    test_number: 37,
    name: "Competitive Pricing Analysis",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Analyse comparative des prix des concurrents pour positionner votre pricing",
    objective: "Définir un positionnement prix clair et justifié par rapport à la concurrence",
    detailed_protocol: [
      "Listez tous les concurrents directs et leurs plans de pricing",
      "Documentez : prix, fonctionnalités par plan, modèle (mensuel/annuel/usage)",
      "Identifiez le positionnement prix de chaque concurrent (premium, milieu, budget)",
      "Calculez le rapport valeur/prix pour chaque concurrent",
      "Déterminez votre positionnement cible et la justification",
      "Testez la sensibilité prix avec les prospects (questions directes)",
      "Documentez la stratégie de pricing avec les benchmarks"
    ],
    target_metrics: { metric_name: "Positionnement prix défini", success_threshold: "Positionnement clair avec justification", failure_threshold: "Pas de différenciation prix" },
    recommended_tools: ["Google Sheets", "Capterra", "G2", "PricingPage.co"],
    tags: ["pricing", "concurrence", "benchmark"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "easy",
    estimated_duration: "3-5 jours",
    associated_step: 0
  },
  {
    test_number: 39,
    name: "Conjoint Analysis",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Analyse conjointe pour mesurer la valeur relative de chaque fonctionnalité et optimiser le packaging",
    objective: "Déterminer la valeur perçue de chaque fonctionnalité pour optimiser les plans",
    detailed_protocol: [
      "Identifiez 4-6 attributs clés : fonctionnalités, prix, support, limites",
      "Définissez 2-3 niveaux pour chaque attribut",
      "Créez des profils de produit combinant différents niveaux",
      "Demandez aux répondants de choisir entre les profils (≥30 répondants)",
      "Analysez avec un modèle de choix discret (HB ou MNL)",
      "Identifiez les attributs à forte valeur et ceux qui sont indifférents",
      "Optimisez le packaging des plans basé sur les part-worths"
    ],
    target_metrics: { metric_name: "Valeur des attributs identifiée", success_threshold: "Hiérarchie claire des attributs", failure_threshold: "Résultats non significatifs" },
    recommended_tools: ["Conjointly", "Sawtooth Software", "Google Forms", "R"],
    tags: ["pricing", "conjoint", "statistique"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "2-3 semaines",
    associated_step: 0
  },
  {
    test_number: 40,
    name: "Freemium Conversion Test",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Test du modèle freemium pour mesurer le taux de conversion gratuit → payant",
    objective: "Atteindre un taux de conversion freemium → payant ≥2-5%",
    detailed_protocol: [
      "Définissez les limites du plan gratuit (fonctionnalités, volume, durée)",
      "Assurez-vous que le plan gratuit délivre de la valeur (pas un simple teasing)",
      "Implémentez des 'upgrade moments' naturels dans le parcours utilisateur",
      "Lancez le freemium avec un tracking détaillé du funnel",
      "Mesurez : signups gratuits, activation, upgrade, temps avant conversion",
      "Identifiez les triggers qui déclenchent l'upgrade (limite atteinte, besoin avancé)",
      "Optimisez la frontière gratuit/payant pour maximiser la conversion"
    ],
    target_metrics: { metric_name: "Taux de conversion freemium", success_threshold: "≥2% (B2C) / ≥5% (B2B)", failure_threshold: "<1% de conversion" },
    recommended_tools: ["Stripe", "Mixpanel", "Amplitude", "PostHog"],
    tags: ["freemium", "pricing", "conversion"],
    applicable_sectors: ["SaaS", "EdTech", "Marketplace"],
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 0
  },
  {
    test_number: 41,
    name: "Price Elasticity A/B Test",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "A/B test sur le prix pour mesurer l'élasticité de la demande et trouver le prix optimal",
    objective: "Identifier le prix qui maximise le revenu total (prix × volume)",
    detailed_protocol: [
      "Définissez 2-3 niveaux de prix à tester (ex: -20%, base, +20%)",
      "Assignez aléatoirement les visiteurs aux différents prix",
      "Assurez-vous d'un échantillon suffisant (≥100 conversions par variante)",
      "Mesurez le taux de conversion et le revenu par visiteur pour chaque prix",
      "Calculez l'élasticité-prix : % changement demande / % changement prix",
      "Identifiez le prix qui maximise le revenu total",
      "Documentez les implications pour la stratégie de pricing long terme"
    ],
    target_metrics: { metric_name: "Prix optimal identifié", success_threshold: "Revenu maximisé avec ≥95% de confiance", failure_threshold: "Échantillon insuffisant" },
    recommended_tools: ["Stripe", "Google Optimize", "VWO", "Google Sheets"],
    tags: ["pricing", "A/B-test", "élasticité"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "hard",
    estimated_duration: "4-6 semaines",
    associated_step: 0
  },
  {
    test_number: 42,
    name: "Willingness to Pay Interview",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Entretiens ciblés pour comprendre la logique de willingness-to-pay des prospects",
    objective: "Comprendre les facteurs de décision prix et la fourchette de WTP chez ≥10 prospects",
    detailed_protocol: [
      "Sélectionnez 10-15 prospects qui ont confirmé l'intérêt pour la solution",
      "Présentez la solution et ses bénéfices concrets (ROI, gain de temps)",
      "Posez la question : 'Combien payez-vous actuellement pour résoudre ce problème ?'",
      "Puis : 'Quel budget seriez-vous prêt à allouer pour notre solution ?'",
      "Explorez les critères de décision : ROI attendu, budget disponible, processus d'achat",
      "Identifiez les ancres de prix (références dans l'esprit du prospect)",
      "Synthétisez la fourchette de WTP et les facteurs de décision"
    ],
    target_metrics: { metric_name: "Fourchette WTP identifiée", success_threshold: "Fourchette claire chez ≥60% des interrogés", failure_threshold: "Réponses trop divergentes" },
    recommended_tools: ["Zoom", "Calendly", "Notion", "Google Sheets"],
    tags: ["pricing", "qualitatif", "WTP"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "1-2 semaines",
    associated_step: 0
  },
  {
    test_number: 43,
    name: "Trial to Paid Conversion",
    phase: "Phase 4 — Tests de Pricing",
    category: "Viabilité",
    description: "Optimisation du taux de conversion des essais gratuits en abonnements payants",
    objective: "Atteindre un taux de conversion trial → paid ≥15% (B2B SaaS) ou ≥5% (B2C)",
    detailed_protocol: [
      "Définissez la durée et les conditions du trial (7j, 14j, 30j)",
      "Instrumentez le parcours trial : onboarding, engagement, moments clés",
      "Envoyez des communications ciblées pendant le trial (J1, J3, J7, J-3 avant fin)",
      "Identifiez les 'magic moments' qui prédisent la conversion",
      "Testez : durée du trial, limitations, engagement proactif",
      "Mesurez le taux de conversion par cohorte et canal d'acquisition",
      "Optimisez l'expérience trial pour maximiser les magic moments"
    ],
    target_metrics: { metric_name: "Taux de conversion trial", success_threshold: "≥15% (B2B) / ≥5% (B2C)", failure_threshold: "<5% (B2B) / <2% (B2C)" },
    recommended_tools: ["Stripe", "Intercom", "Mixpanel", "Customer.io"],
    tags: ["trial", "conversion", "SaaS"],
    applicable_sectors: ["SaaS", "EdTech", "FinTech"],
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 0
  },
  {
    test_number: 46,
    name: "Beta Program Structured",
    phase: "Phase 4 — Tests de Pricing",
    category: "Désirabilité",
    description: "Programme de beta testing structuré avec des métriques de succès définies",
    objective: "Collecter du feedback actionnable de ≥20 beta testeurs sur les fonctionnalités core",
    detailed_protocol: [
      "Sélectionnez 20-50 beta testeurs représentatifs de vos personas",
      "Définissez le scope : fonctionnalités à tester, scénarios, limites",
      "Créez un programme structuré : objectifs hebdomadaires, feedback forms, office hours",
      "Onboardez chaque testeur individuellement avec des objectifs clairs",
      "Collectez du feedback systématique : NPS hebdomadaire, bugs, suggestions",
      "Organisez des sessions de feedback collectif (2-3 pendant le programme)",
      "Priorisez les améliorations basées sur la fréquence et l'impact du feedback"
    ],
    target_metrics: { metric_name: "Taux d'engagement beta", success_threshold: "≥60% des testeurs actifs", failure_threshold: "<30% de testeurs actifs" },
    recommended_tools: ["TestFlight", "BetaList", "Canny", "Notion"],
    tags: ["beta", "testing", "feedback"],
    applicable_sectors: ALL_SECTORS,
    difficulty_level: "medium",
    estimated_duration: "4-8 semaines",
    associated_step: 0
  },
  // Tests 47-58 : Tests de rétention supplémentaires
  {
    test_number: 47, name: "Feature Flag Rollout Test", phase: "Phase 5 — Tests de Rétention", category: "Faisabilité",
    description: "Déploiement progressif de nouvelles fonctionnalités via feature flags pour mesurer l'impact",
    objective: "Valider que la nouvelle fonctionnalité améliore les métriques clés sans régression",
    detailed_protocol: ["Implémentez un système de feature flags (LaunchDarkly, PostHog)", "Déployez à 10% des utilisateurs d'abord", "Mesurez l'impact sur les métriques clés : engagement, rétention, conversion", "Si positif, augmentez progressivement à 25%, 50%, 100%", "Surveillez les métriques de qualité : taux d'erreur, temps de chargement", "Documentez les résultats de chaque palier", "Rollback immédiat si régression détectée"],
    target_metrics: { metric_name: "Impact sur métrique clé", success_threshold: "Amélioration ≥5% sans régression", failure_threshold: "Régression ou pas d'impact" },
    recommended_tools: ["LaunchDarkly", "PostHog", "Statsig", "Flagsmith"],
    tags: ["feature-flag", "déploiement", "expérimentation"], applicable_sectors: ["SaaS", "Marketplace", "FinTech"], difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 48, name: "In-App Survey Test", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Micro-enquêtes contextuelles dans l'application pour collecter du feedback en temps réel",
    objective: "Collecter du feedback in-app de ≥100 utilisateurs avec un taux de réponse ≥15%",
    detailed_protocol: ["Identifiez les moments clés pour poser des questions (après action, après X jours)", "Créez des micro-enquêtes de 1-3 questions maximum", "Ciblez les bonnes audiences (nouveaux, power users, inactifs)", "Déployez avec un outil non-intrusif (modal discret, bannière)", "Analysez les réponses par segment et parcours utilisateur", "Corrélation avec les actions dans le produit", "Utilisez les insights pour prioriser la roadmap"],
    target_metrics: { metric_name: "Taux de réponse in-app", success_threshold: "≥15% de taux de réponse", failure_threshold: "<5% de réponse" },
    recommended_tools: ["Hotjar", "Pendo", "Chameleon", "Typeform Embed"],
    tags: ["feedback", "in-app", "enquête"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1 semaine", associated_step: 0
  },
  {
    test_number: 49, name: "User Journey Mapping", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Cartographie détaillée du parcours utilisateur réel pour identifier les moments de friction et de valeur",
    objective: "Identifier ≥3 points de friction majeurs et ≥2 moments de valeur à amplifier",
    detailed_protocol: ["Collectez les données d'usage : analytics, recordings, heatmaps", "Identifiez les parcours principaux (happy path et chemins alternatifs)", "Cartographiez chaque étape : action, émotion, point de contact", "Identifiez les moments de friction (abandons, erreurs, confusion)", "Identifiez les moments de valeur (engagement, satisfaction, partage)", "Priorisez : réduire les frictions ET amplifier les moments de valeur", "Créez une roadmap d'amélioration UX basée sur la carte"],
    target_metrics: { metric_name: "Points de friction identifiés", success_threshold: "≥3 frictions et ≥2 moments de valeur", failure_threshold: "Parcours non documenté" },
    recommended_tools: ["Miro", "Hotjar", "FullStory", "Mixpanel"],
    tags: ["UX", "parcours", "cartographie"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 50, name: "Session Recording Analysis", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Analyse des enregistrements de sessions utilisateurs pour comprendre les comportements réels",
    objective: "Analyser ≥30 sessions et identifier ≥5 patterns de comportement actionnables",
    detailed_protocol: ["Configurez l'enregistrement des sessions (avec consentement RGPD)", "Sélectionnez un échantillon de 30-50 sessions par segment", "Analysez les sessions des churners vs des power users", "Notez : clics perdus, rage clicks, scrolls hésitants, abandons", "Identifiez les patterns récurrents de confusion ou frustration", "Corrélez avec les données analytics quantitatives", "Priorisez les corrections UX par impact × fréquence"],
    target_metrics: { metric_name: "Patterns actionnables identifiés", success_threshold: "≥5 patterns avec actions définies", failure_threshold: "<2 patterns identifiés" },
    recommended_tools: ["Hotjar", "FullStory", "LogRocket", "PostHog"],
    tags: ["UX", "analytics", "sessions"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "3-5 jours", associated_step: 0
  },
  {
    test_number: 51, name: "Heatmap Analysis", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Analyse des heatmaps de clics, scrolls et mouvements pour optimiser les pages clés",
    objective: "Identifier ≥3 optimisations UX majeures basées sur les données de heatmap",
    detailed_protocol: ["Configurez les heatmaps sur les pages critiques (landing, pricing, onboarding)", "Collectez des données sur ≥500 sessions par page", "Analysez les click maps : où cliquent les utilisateurs ?", "Analysez les scroll maps : jusqu'où scrollent-ils ?", "Identifiez les éléments ignorés et les clics sur des éléments non-cliquables", "Priorisez les modifications : placement CTA, contenu above-the-fold", "A/B testez les modifications basées sur les insights"],
    target_metrics: { metric_name: "Optimisations identifiées", success_threshold: "≥3 optimisations avec impact mesurable", failure_threshold: "Pas d'insight actionnable" },
    recommended_tools: ["Hotjar", "Crazy Egg", "Microsoft Clarity", "PostHog"],
    tags: ["heatmap", "UX", "optimisation"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1 semaine", associated_step: 0
  },
  {
    test_number: 52, name: "Exit Intent Survey", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Enquête de sortie déclenchée quand l'utilisateur s'apprête à quitter le site ou annuler",
    objective: "Identifier les 3 raisons principales de départ pour réduire le churn",
    detailed_protocol: ["Configurez un popup exit-intent sur les pages de pricing et d'annulation", "Question : 'Qu'est-ce qui vous empêche de continuer ?' avec options prédéfinies", "Incluez une question ouverte pour les détails", "Collectez ≥50 réponses pour la significativité", "Classez les raisons par fréquence et impact", "Créez des contre-mesures pour les 3 raisons principales", "Testez les contre-mesures et mesurez l'impact sur le churn"],
    target_metrics: { metric_name: "Raisons de départ identifiées", success_threshold: "≥3 raisons avec fréquence >10%", failure_threshold: "Réponses trop dispersées" },
    recommended_tools: ["Hotjar", "OptinMonster", "Typeform", "Chameleon"],
    tags: ["churn", "feedback", "exit-intent"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 53, name: "Customer Health Score", phase: "Phase 5 — Tests de Rétention", category: "Viabilité",
    description: "Création d'un score de santé client pour prédire le churn et déclencher des interventions",
    objective: "Créer un health score prédictif avec ≥70% de précision sur le churn",
    detailed_protocol: ["Identifiez les signaux d'usage corrélés au churn (fréquence, profondeur, récence)", "Collectez les données historiques des clients churned vs retenus", "Attribuez des poids à chaque signal pour construire le score", "Testez le score sur des données historiques (backtesting)", "Définissez les seuils : vert (sain), jaune (à risque), rouge (en danger)", "Automatisez les alertes et interventions par seuil", "Itérez le modèle avec les nouvelles données de churn"],
    target_metrics: { metric_name: "Précision du health score", success_threshold: "≥70% de précision prédictive", failure_threshold: "<50% de précision" },
    recommended_tools: ["Mixpanel", "Gainsight", "Totango", "Google Sheets"],
    tags: ["health-score", "churn", "prédictif"], applicable_sectors: ["SaaS", "Marketplace", "FinTech"], difficulty_level: "hard", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 54, name: "Re-engagement Campaign", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Campagne de réactivation des utilisateurs inactifs pour réduire le churn passif",
    objective: "Réactiver ≥10% des utilisateurs inactifs avec la campagne",
    detailed_protocol: ["Définissez 'inactif' : pas de login depuis X jours (7, 14, 30)", "Segmentez les inactifs par ancienneté, engagement passé, plan", "Créez une séquence de 3-5 emails de réactivation progressifs", "Messages : rappel de valeur, nouveautés, offre spéciale, dernier rappel", "Testez différents canaux : email, push, SMS, in-app", "Mesurez le taux de réactivation par segment et canal", "Automatisez les campagnes avec des triggers temporels"],
    target_metrics: { metric_name: "Taux de réactivation", success_threshold: "≥10% de réactivation", failure_threshold: "<3% de réactivation" },
    recommended_tools: ["Customer.io", "Intercom", "Braze", "Mailchimp"],
    tags: ["réactivation", "churn", "email"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-3 semaines", associated_step: 0
  },
  {
    test_number: 55, name: "Power User Analysis", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Analyse approfondie des power users pour comprendre ce qui drive l'engagement maximal",
    objective: "Identifier ≥3 comportements clés qui différencient les power users des utilisateurs moyens",
    detailed_protocol: ["Définissez les critères de 'power user' (fréquence, actions, durée)", "Identifiez le top 10% de vos utilisateurs par engagement", "Analysez leurs comportements : fonctionnalités utilisées, fréquence, parcours", "Comparez avec les utilisateurs moyens et les churners", "Identifiez les 'magic actions' qui corrèlent avec le statut power user", "Testez si guider les nouveaux utilisateurs vers ces actions améliore la rétention", "Documentez les personas power user pour le marketing et le produit"],
    target_metrics: { metric_name: "Comportements clés identifiés", success_threshold: "≥3 différenciateurs validés", failure_threshold: "<1 différenciateur clair" },
    recommended_tools: ["Amplitude", "Mixpanel", "PostHog", "SQL"],
    tags: ["power-user", "engagement", "analyse"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 56, name: "CSAT (Customer Satisfaction Score)", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Mesure de la satisfaction client post-interaction pour les points de contact clés",
    objective: "Atteindre un CSAT ≥80% sur les interactions clés",
    detailed_protocol: ["Identifiez les points de contact clés : onboarding, support, achat, usage", "Déclenchez un sondage CSAT 1-2 min après chaque interaction clé", "Question : 'Êtes-vous satisfait(e) ?' (1-5 étoiles ou emoji)", "Question ouverte : 'Comment améliorer votre expérience ?'", "Collectez ≥50 réponses par point de contact", "Analysez les scores par point de contact et segment", "Priorisez les améliorations sur les points de contact à faible CSAT"],
    target_metrics: { metric_name: "CSAT", success_threshold: "≥80% (4-5/5)", failure_threshold: "<60%" },
    recommended_tools: ["Delighted", "Nicereply", "Zendesk", "Intercom"],
    tags: ["satisfaction", "CSAT", "qualité"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1 semaine", associated_step: 0
  },
  {
    test_number: 57, name: "CES (Customer Effort Score)", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Mesure de l'effort perçu par le client pour accomplir une tâche (prédicteur fort du churn)",
    objective: "Atteindre un CES ≤2 sur l'échelle 1-7 (faible effort)",
    detailed_protocol: ["Identifiez les tâches clés mesurables : inscription, achat, résolution support", "Déclenchez la question CES après la complétion de chaque tâche", "Question : 'L'entreprise m'a facilité la résolution de mon problème' (1-7)", "Collectez ≥50 réponses par tâche", "Identifiez les tâches à fort effort (CES >4)", "Simplifiez les processus pour les tâches à fort effort", "Re-mesurez après les améliorations"],
    target_metrics: { metric_name: "CES moyen", success_threshold: "CES ≤2 (faible effort)", failure_threshold: "CES >4 (effort élevé)" },
    recommended_tools: ["Nicereply", "Typeform", "Zendesk", "Intercom"],
    tags: ["effort", "CES", "UX"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 58, name: "Churn Exit Interview", phase: "Phase 5 — Tests de Rétention", category: "Viabilité",
    description: "Entretien structuré avec les clients qui annulent pour comprendre les causes profondes du churn",
    objective: "Interviewer ≥10 churners et identifier les 3 causes principales d'annulation",
    detailed_protocol: ["Configurez un formulaire de raison de départ à l'annulation (5-7 options)", "Proposez un entretien de 15min en échange d'un mois gratuit ou cadeau", "Questions : moment de décision, alternatives, ce qui aurait pu les retenir", "Posez la question : 'Si nous corrigions X, reviendriez-vous ?'", "Documentez les verbatims et classez les raisons par fréquence", "Identifiez les causes structurelles vs les causes ponctuelles", "Créez un plan d'action pour les 3 causes principales"],
    target_metrics: { metric_name: "Causes de churn identifiées", success_threshold: "≥3 causes structurelles avec plan", failure_threshold: "Causes non identifiées" },
    recommended_tools: ["Calendly", "Zoom", "Typeform", "Notion"],
    tags: ["churn", "interview", "feedback"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  // Tests 63, 66, 67 : Rétention avancée
  {
    test_number: 63, name: "Feature Usage Correlation", phase: "Phase 5 — Tests de Rétention", category: "Viabilité",
    description: "Corrélation entre l'utilisation des fonctionnalités et la rétention long terme",
    objective: "Identifier les 3 fonctionnalités les plus corrélées à la rétention à 90 jours",
    detailed_protocol: ["Listez toutes les fonctionnalités trackées dans votre analytics", "Pour chaque fonctionnalité, segmentez les utilisateurs : utilisateurs vs non-utilisateurs", "Comparez la rétention à 30, 60, 90 jours entre les deux groupes", "Calculez la corrélation (r) entre l'usage et la rétention", "Identifiez les 3 fonctionnalités avec la corrélation la plus forte", "Testez l'hypothèse : guider vers ces fonctionnalités améliore-t-il la rétention ?", "Intégrez ces fonctionnalités dans le parcours d'onboarding"],
    target_metrics: { metric_name: "Corrélation fonctionnalité-rétention", success_threshold: "≥3 corrélations significatives (r>0.3)", failure_threshold: "Aucune corrélation significative" },
    recommended_tools: ["Amplitude", "Mixpanel", "PostHog", "Google Sheets"],
    tags: ["rétention", "corrélation", "fonctionnalités"], applicable_sectors: ["SaaS", "Marketplace", "EdTech"], difficulty_level: "hard", estimated_duration: "2-3 semaines", associated_step: 0
  },
  {
    test_number: 66, name: "Habit Loop Design Test", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Conception et test de boucles d'habitude (cue → routine → reward) pour fidéliser les utilisateurs",
    objective: "Augmenter la fréquence d'utilisation de ≥30% via des boucles d'habitude",
    detailed_protocol: ["Identifiez le 'trigger' interne ou externe qui doit déclencher l'usage", "Concevez la 'routine' : l'action que l'utilisateur doit faire", "Définissez la 'reward' : le renforcement positif (variable de préférence)", "Implémentez les 3 composantes dans le produit", "Ajoutez des notifications/rappels pour renforcer le trigger externe", "Mesurez la fréquence d'utilisation avant/après", "Itérez sur le type de reward (social, gratification, progrès)"],
    target_metrics: { metric_name: "Augmentation fréquence d'usage", success_threshold: "≥30% d'augmentation", failure_threshold: "Pas d'amélioration significative" },
    recommended_tools: ["Intercom", "OneSignal", "Braze", "Mixpanel"],
    tags: ["habitude", "engagement", "hook"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "4-6 semaines", associated_step: 0
  },
  {
    test_number: 67, name: "Notification Optimization Test", phase: "Phase 5 — Tests de Rétention", category: "Désirabilité",
    description: "Optimisation des notifications (email, push, in-app) pour maximiser l'engagement sans fatigue",
    objective: "Augmenter le taux de réengagement via notifications de ≥20% sans augmenter les unsubscribes",
    detailed_protocol: ["Auditez les notifications actuelles : types, fréquence, taux d'engagement", "Identifiez les notifications à fort et faible engagement", "Testez la personnalisation : contenu, timing, canal", "A/B testez la fréquence : plus vs moins de notifications", "Surveillez les métriques négatives : unsubscribe, spam report", "Implémentez des préférences de notification pour les utilisateurs", "Optimisez le mix canal : email vs push vs in-app selon le contexte"],
    target_metrics: { metric_name: "Taux de réengagement via notifications", success_threshold: "≥20% d'augmentation sans hausse unsubscribe", failure_threshold: "Hausse des unsubscribes >5%" },
    recommended_tools: ["OneSignal", "Braze", "Customer.io", "PostHog"],
    tags: ["notifications", "engagement", "optimisation"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  // Tests 69-71, 73-75, 78-80 : Acquisition avancée
  {
    test_number: 69, name: "SEO Content Strategy Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Test de stratégie SEO avec création de contenu ciblé pour attirer du trafic organique qualifié",
    objective: "Atteindre ≥500 visiteurs organiques mensuels en 3 mois",
    detailed_protocol: ["Identifiez 20-30 mots-clés long-tail avec du volume et une faible concurrence", "Créez un plan de contenu avec 1-2 articles par semaine", "Optimisez chaque article : title tag, meta, H1, liens internes, schema", "Construisez des backlinks via guest posting et partenariats", "Surveillez les positions et le trafic via Google Search Console", "Analysez les mots-clés qui convertissent (pas seulement le trafic)", "Ajustez la stratégie tous les mois en fonction des résultats"],
    target_metrics: { metric_name: "Trafic organique mensuel", success_threshold: "≥500 visiteurs/mois en 3 mois", failure_threshold: "<100 visiteurs/mois" },
    recommended_tools: ["Ahrefs", "SEMrush", "Google Search Console", "WordPress"],
    tags: ["SEO", "contenu", "organique"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "3-6 mois", associated_step: 0
  },
  {
    test_number: 70, name: "Influencer/KOL Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Test de collaboration avec des influenceurs/KOL pour évaluer le potentiel d'acquisition",
    objective: "Obtenir un ROI ≥2x sur la collaboration influenceur",
    detailed_protocol: ["Identifiez 10-20 micro-influenceurs (1K-50K followers) dans votre niche", "Évaluez leur engagement rate réel (pas seulement les followers)", "Négociez un test avec 2-3 influenceurs (produit gratuit, commission, flat fee)", "Définissez des métriques trackables : code promo, lien UTM, landing page dédiée", "Lancez la collaboration et mesurez les résultats sur 2-4 semaines", "Calculez le ROI : revenu généré vs coût de la collaboration", "Scalez avec les influenceurs les plus performants"],
    target_metrics: { metric_name: "ROI influenceur", success_threshold: "ROI ≥2x", failure_threshold: "ROI <1x" },
    recommended_tools: ["Influence.co", "HypeAuditor", "Grin", "Google Analytics"],
    tags: ["influenceur", "acquisition", "KOL"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "3-6 semaines", associated_step: 0
  },
  {
    test_number: 71, name: "PR & Media Outreach Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Campagne de relations presse pour obtenir une couverture média et valider l'intérêt éditorial",
    objective: "Obtenir ≥3 mentions dans des médias pertinents pour votre audience",
    detailed_protocol: ["Identifiez 20-30 journalistes/bloggers couvrant votre secteur", "Créez un kit presse : communiqué, visuels, données clés, fondateur dispo", "Personnalisez chaque pitch selon l'angle éditorial du journaliste", "Envoyez les pitchs et relancez après 3-5 jours", "Proposez une exclusivité au média le plus important", "Mesurez : nombre de publications, trafic généré, backlinks, signups", "Documentez les contacts pour les futurs lancements"],
    target_metrics: { metric_name: "Mentions médias", success_threshold: "≥3 mentions dans des médias pertinents", failure_threshold: "0 mention obtenue" },
    recommended_tools: ["Muck Rack", "Cision", "HARO", "Notion"],
    tags: ["PR", "médias", "presse"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "3-6 semaines", associated_step: 0
  },
  {
    test_number: 73, name: "Community-Led Growth Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Construction d'une communauté engagée comme canal d'acquisition et de rétention",
    objective: "Construire une communauté de ≥100 membres actifs contribuant régulièrement",
    detailed_protocol: ["Choisissez la plateforme : Discord, Slack, Circle, groupe LinkedIn/Facebook", "Définissez la proposition de valeur de la communauté (pas juste votre produit)", "Créez du contenu exclusif et des événements récurrents", "Recrutez les 20 premiers membres parmi vos early adopters les plus engagés", "Animez quotidiennement : questions, challenges, partages d'expertise", "Mesurez : membres actifs, messages/semaine, conversions, referrals", "Identifiez les ambassadeurs naturels et créez un programme dédié"],
    target_metrics: { metric_name: "Membres actifs communauté", success_threshold: "≥100 membres actifs (1+ action/semaine)", failure_threshold: "<20 membres actifs" },
    recommended_tools: ["Discord", "Circle", "Orbit", "Notion"],
    tags: ["communauté", "CLG", "engagement"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-3 mois", associated_step: 0
  },
  {
    test_number: 74, name: "PLG (Product-Led Growth) Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Test de croissance produit-led : le produit lui-même drive l'acquisition et l'expansion",
    objective: "Atteindre ≥30% des nouvelles inscriptions via le produit (pas le marketing)",
    detailed_protocol: ["Identifiez les mécanismes PLG possibles : invitations, sharing, embeds, exports", "Implémentez 1-2 mécanismes dans le produit (ex: 'Créé avec [produit]')", "Facilitez le partage : 1-click, templates partageables, collaboration", "Mesurez les inscriptions par source : produit vs marketing vs organique", "Optimisez les points de partage naturels dans le parcours utilisateur", "Testez des incentives de partage (fonctionnalités, stockage, remise)", "Calculez le viral coefficient et le cycle time"],
    target_metrics: { metric_name: "% inscriptions via produit", success_threshold: "≥30% des inscriptions via PLG", failure_threshold: "<10% via produit" },
    recommended_tools: ["Mixpanel", "PostHog", "Custom analytics"],
    tags: ["PLG", "produit", "viralité"], applicable_sectors: ["SaaS", "EdTech", "Marketplace"], difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 75, name: "Paid Social Scaling Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Test de scaling des campagnes social ads pour valider la capacité à acquérir à grande échelle",
    objective: "Maintenir un CPA stable (<+20%) en doublant le budget publicitaire",
    detailed_protocol: ["Identifiez les campagnes les plus performantes (CPA, ROAS, qualité)", "Augmentez le budget de 20-30% par semaine (pas de 100% d'un coup)", "Diversifiez les audiences : lookalike, intérêts, retargeting", "Créez de nouvelles créatives régulièrement (fatigue publicitaire)", "Surveillez le CPA quotidiennement : si >+20%, réduire le budget", "Testez de nouveaux canaux : TikTok, YouTube, Pinterest", "Documentez la courbe de scaling : budget vs CPA vs volume"],
    target_metrics: { metric_name: "Stabilité CPA au scaling", success_threshold: "CPA <+20% en doublant le budget", failure_threshold: "CPA >+50% avec le scaling" },
    recommended_tools: ["Meta Ads Manager", "TikTok Ads", "Google Ads", "Triple Whale"],
    tags: ["scaling", "paid-social", "acquisition"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 78, name: "Conversion Rate Optimization Audit", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Audit complet du taux de conversion avec identification et test des optimisations prioritaires",
    objective: "Augmenter le taux de conversion global de ≥20% en 4-8 semaines",
    detailed_protocol: ["Auditez le funnel complet : trafic → inscription → activation → conversion → revenu", "Identifiez les étapes avec les taux de conversion les plus faibles", "Analysez les données quanti (analytics) et quali (recordings, heatmaps)", "Priorisez les optimisations par impact estimé × effort", "Lancez des A/B tests sur les 3 optimisations prioritaires", "Mesurez l'impact cumulé sur le taux de conversion global", "Documentez les learnings pour les futures optimisations"],
    target_metrics: { metric_name: "Amélioration taux de conversion", success_threshold: "≥20% d'amélioration", failure_threshold: "Pas d'amélioration" },
    recommended_tools: ["Google Analytics", "VWO", "Hotjar", "Google Optimize"],
    tags: ["CRO", "conversion", "optimisation"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 79, name: "Landing Page Variant Test", phase: "Phase 6 — Tests d'Acquisition", category: "Désirabilité",
    description: "A/B test de variantes de landing page pour maximiser le taux de conversion",
    objective: "Identifier la variante de landing page avec le meilleur taux de conversion",
    detailed_protocol: ["Créez 3-5 variantes de votre landing page (headline, layout, CTA, social proof)", "Définissez la métrique principale : inscription, démo, achat", "Répartissez le trafic équitablement entre les variantes", "Collectez ≥100 conversions par variante pour la significativité", "Analysez : taux de conversion, temps sur page, scroll depth", "Identifiez les éléments gagnants (headline, visuel, CTA, proof)", "Combinez les meilleurs éléments dans une version optimale"],
    target_metrics: { metric_name: "Meilleur taux de conversion", success_threshold: "Variante gagnante avec ≥30% d'amélioration", failure_threshold: "Pas de différence significative" },
    recommended_tools: ["Unbounce", "Google Optimize", "VWO", "Hotjar"],
    tags: ["landing-page", "A/B-test", "conversion"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 80, name: "Retargeting Funnel Test", phase: "Phase 6 — Tests d'Acquisition", category: "Viabilité",
    description: "Mise en place et optimisation d'un funnel de retargeting pour convertir les visiteurs non-convertis",
    objective: "Atteindre un taux de conversion retargeting ≥3% et un ROAS ≥3x",
    detailed_protocol: ["Installez les pixels de retargeting (Meta, Google, LinkedIn)", "Segmentez les audiences : visiteurs, inscrits non-activés, panier abandonné", "Créez des séquences de retargeting adaptées à chaque segment", "Testez différents formats : testimonials, démo, remise, urgence", "Mesurez le ROAS et le CPA par segment et créative", "Optimisez : excluez les convertis, ajustez la fréquence", "Calculez la contribution du retargeting au funnel global"],
    target_metrics: { metric_name: "ROAS retargeting", success_threshold: "ROAS ≥3x", failure_threshold: "ROAS <1.5x" },
    recommended_tools: ["Meta Ads", "Google Ads", "AdRoll", "Google Analytics"],
    tags: ["retargeting", "conversion", "paid"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  // Tests financiers supplémentaires
  {
    test_number: 83, name: "Break-Even Analysis", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "Calcul du point mort (break-even) en nombre de clients et en délai",
    objective: "Atteindre le break-even en <18 mois avec des hypothèses réalistes",
    detailed_protocol: ["Calculez vos coûts fixes mensuels (salaires, hébergement, bureau, etc.)", "Calculez votre marge brute par client (ARPU - coûts variables)", "Point mort en clients = Coûts fixes / Marge brute par client", "Projetez la trajectoire d'acquisition : combien de clients par mois ?", "Calculez le délai pour atteindre le break-even en clients", "Testez la sensibilité : +20% coûts, -20% revenus", "Documentez 3 scénarios : optimiste, réaliste, pessimiste"],
    target_metrics: { metric_name: "Délai break-even", success_threshold: "<18 mois (scénario réaliste)", failure_threshold: ">36 mois" },
    recommended_tools: ["Google Sheets", "Excel", "Causal", "LivePlan"],
    tags: ["break-even", "financier", "projection"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "3-5 jours", associated_step: 0
  },
  {
    test_number: 84, name: "Burn Rate & Runway Calculation", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "Calcul précis du burn rate et du runway pour planifier les besoins de financement",
    objective: "Maintenir un runway ≥6 mois et planifier la prochaine levée en conséquence",
    detailed_protocol: ["Calculez le burn rate net mensuel (dépenses - revenus)", "Projetez l'évolution du burn rate sur les 12 prochains mois", "Calculez le runway : trésorerie actuelle / burn rate net", "Identifiez les leviers de réduction du burn rate si nécessaire", "Planifiez la prochaine levée 6 mois avant la fin du runway", "Créez un tableau de bord financier avec suivi mensuel", "Définissez les milestones à atteindre avant la prochaine levée"],
    target_metrics: { metric_name: "Runway restant", success_threshold: "≥6 mois de runway", failure_threshold: "<3 mois de runway" },
    recommended_tools: ["Google Sheets", "Pennylane", "Qonto", "Notion"],
    tags: ["burn-rate", "runway", "trésorerie"], applicable_sectors: ALL_SECTORS, difficulty_level: "easy", estimated_duration: "1-2 jours", associated_step: 0
  },
  {
    test_number: 86, name: "Revenue Attribution Test", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "Attribution multi-touch des revenus pour comprendre la contribution réelle de chaque canal",
    objective: "Attribuer ≥80% du revenu à des canaux identifiés avec un modèle multi-touch",
    detailed_protocol: ["Implémentez un tracking UTM systématique sur tous les canaux", "Configurez un modèle d'attribution multi-touch (linear, time-decay, data-driven)", "Collectez les données sur ≥3 mois pour la significativité", "Analysez la contribution de chaque canal au revenu total", "Identifiez les canaux sous/sur-investis vs leur contribution", "Réallouez le budget marketing en conséquence", "Comparez les résultats du nouveau mix après 1 mois"],
    target_metrics: { metric_name: "Revenus attribués", success_threshold: "≥80% du revenu attribué", failure_threshold: "<50% du revenu attribué" },
    recommended_tools: ["Google Analytics", "HubSpot", "Segment", "Triple Whale"],
    tags: ["attribution", "revenus", "marketing"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "3-6 mois", associated_step: 0
  },
  {
    test_number: 88, name: "Pricing Page A/B Test", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "A/B test de la page de pricing pour optimiser la conversion et l'ARPU",
    objective: "Augmenter le taux de conversion de la page pricing de ≥15%",
    detailed_protocol: ["Analysez le comportement actuel sur la page pricing (heatmap, recordings)", "Créez 2-3 variantes : nombre de plans, framing, ancrage, CTA", "Testez les éléments : mise en avant du plan recommandé, comparaison, FAQ", "Répartissez le trafic équitablement avec ≥500 visiteurs par variante", "Mesurez : taux de conversion, plan choisi, ARPU", "Identifiez la combinaison optimale", "Déployez et itérez trimestriellement"],
    target_metrics: { metric_name: "Taux de conversion pricing page", success_threshold: "≥15% d'amélioration", failure_threshold: "Pas d'amélioration significative" },
    recommended_tools: ["Google Optimize", "VWO", "Hotjar", "Stripe"],
    tags: ["pricing", "A/B-test", "conversion"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 89, name: "Financial Model Stress Test", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "Test de résistance du modèle financier avec des scénarios pessimistes pour valider la robustesse",
    objective: "Valider la viabilité du modèle financier dans au moins 2/3 scénarios stress",
    detailed_protocol: ["Construisez un modèle financier sur 3 ans avec hypothèses réalistes", "Définissez 3 scénarios : optimiste (+30%), réaliste (base), pessimiste (-30%)", "Pour le scénario pessimiste : +50% CAC, -30% conversion, +20% churn", "Calculez le P&L, cash-flow et runway pour chaque scénario", "Identifiez le scénario minimum viable (survie)", "Définissez les triggers pour passer en 'mode survie' (cost-cutting)", "Présentez les 3 scénarios aux investisseurs/advisors pour feedback"],
    target_metrics: { metric_name: "Viabilité sous stress", success_threshold: "Viable dans ≥2/3 scénarios", failure_threshold: "Non viable même en optimiste" },
    recommended_tools: ["Google Sheets", "Causal", "LivePlan", "Excel"],
    tags: ["stress-test", "financier", "modélisation"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 90, name: "Investor Pitch Dry Run", phase: "Phase 7 — Tests Financiers", category: "Viabilité",
    description: "Simulation de pitch investisseur pour tester le deck, le messaging et anticiper les questions",
    objective: "Obtenir un score ≥7/10 de la part de ≥3 mentors/experts après le dry run",
    detailed_protocol: ["Préparez votre pitch deck (10-12 slides max)", "Répétez le pitch en 5 minutes chrono", "Organisez 3-5 dry runs avec des mentors, advisors ou investisseurs angels", "Demandez du feedback structuré : clarté, conviction, data, Q&A", "Enregistrez chaque dry run pour auto-évaluation", "Itérez sur le deck et le delivery après chaque session", "Préparez les réponses aux 20 questions les plus fréquentes des VCs"],
    target_metrics: { metric_name: "Score des dry runs", success_threshold: "≥7/10 de moyenne", failure_threshold: "<5/10 de moyenne" },
    recommended_tools: ["Pitch", "Google Slides", "Loom", "Notion"],
    tags: ["pitch", "investisseur", "fundraising"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-3 semaines", associated_step: 0
  },
  // Tests spécialisés restants
  {
    test_number: 96, name: "SaaS — API Adoption Test", phase: "Phase 7 — Tests Financiers", category: "Faisabilité",
    description: "Mesure de l'adoption de l'API par les développeurs et partenaires pour valider l'extensibilité",
    objective: "Atteindre ≥10 intégrations actives via l'API dans les 3 premiers mois",
    detailed_protocol: ["Publiez une documentation API complète et claire (OpenAPI/Swagger)", "Créez un sandbox/playground pour les développeurs", "Lancez un programme developer beta avec 20-30 développeurs ciblés", "Mesurez : registrations API, appels actifs, intégrations complétées", "Organisez des office hours et un support dédié développeurs", "Collectez du feedback sur la DX (Developer Experience)", "Identifiez les cas d'usage les plus populaires pour prioriser"],
    target_metrics: { metric_name: "Intégrations API actives", success_threshold: "≥10 intégrations actives", failure_threshold: "<3 intégrations" },
    recommended_tools: ["Swagger", "Postman", "ReadMe.io", "Discord"],
    tags: ["API", "développeurs", "intégration"], applicable_sectors: ["SaaS", "FinTech"], difficulty_level: "hard", estimated_duration: "2-3 mois", associated_step: 0
  },
  {
    test_number: 97, name: "SaaS — Multi-tenant Scalability Test", phase: "Phase 7 — Tests Financiers", category: "Faisabilité",
    description: "Test de l'architecture multi-tenant pour valider la scalabilité et l'isolation des données",
    objective: "Valider le fonctionnement correct avec ≥100 tenants simultanés sans dégradation",
    detailed_protocol: ["Créez 100+ tenants de test avec des données réalistes", "Testez l'isolation des données : un tenant ne peut pas voir les données des autres", "Mesurez les performances : temps de réponse par tenant sous charge", "Testez les opérations critiques : backup, restore, migration", "Évaluez la gestion des ressources : un tenant gourmand n'impacte pas les autres", "Testez les flux d'onboarding et d'offboarding de tenants", "Documentez l'architecture et les limites identifiées"],
    target_metrics: { metric_name: "Tenants supportés sans dégradation", success_threshold: "≥100 tenants avec <10% dégradation", failure_threshold: "Dégradation à <20 tenants" },
    recommended_tools: ["k6", "JMeter", "DataDog", "AWS/GCP"],
    tags: ["multi-tenant", "scalabilité", "architecture"], applicable_sectors: ["SaaS"], difficulty_level: "hard", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 101, name: "Marketplace — Chicken-and-Egg Bootstrap Test", phase: "Phase 8 — Tests B2B Enterprise", category: "Viabilité",
    description: "Test de stratégie pour résoudre le problème 'poule et œuf' des marketplaces à deux côtés",
    objective: "Atteindre une masse critique sur un côté de la marketplace",
    detailed_protocol: ["Choisissez quel côté bootstrapper d'abord (généralement l'offre)", "Testez 3 stratégies : seeding (contenu), single-player mode, subvention d'un côté", "Commencez géographiquement ou par niche (contraindre pour concentrer)", "Offrez de la valeur au premier côté même sans l'autre (ex: outils gratuits)", "Mesurez l'attraction du deuxième côté une fois la masse critique atteinte", "Identifiez le ratio offre/demande optimal pour votre catégorie", "Documentez la stratégie de bootstrap pour les nouvelles géographies/catégories"],
    target_metrics: { metric_name: "Masse critique atteinte", success_threshold: "Ratio offre/demande dans la fourchette optimale", failure_threshold: "Un côté ne vient pas malgré l'autre" },
    recommended_tools: ["Custom analytics", "Google Sheets", "Mixpanel"],
    tags: ["marketplace", "bootstrap", "deux-côtés"], applicable_sectors: ["Marketplace"], difficulty_level: "hard", estimated_duration: "4-12 semaines", associated_step: 0
  },
  {
    test_number: 102, name: "Marketplace — Network Effects Measurement", phase: "Phase 8 — Tests B2B Enterprise", category: "Viabilité",
    description: "Mesure des effets de réseau pour valider l'existence de rendements croissants",
    objective: "Démontrer que chaque nouvel utilisateur augmente la valeur pour les existants",
    detailed_protocol: ["Définissez les métriques de valeur par utilisateur (matchs, temps, satisfaction)", "Mesurez ces métriques à différents niveaux de densité du réseau", "Tracez la courbe valeur = f(nombre d'utilisateurs)", "Identifiez le point d'inflexion où les effets de réseau s'accélèrent", "Testez si la rétention augmente avec la densité du réseau", "Évaluez les effets de réseau locaux vs globaux", "Documentez les preuves pour les investisseurs"],
    target_metrics: { metric_name: "Corrélation densité-valeur", success_threshold: "Corrélation positive significative", failure_threshold: "Pas de corrélation ou négative" },
    recommended_tools: ["SQL", "Python", "Mixpanel", "Google Sheets"],
    tags: ["network-effects", "marketplace", "croissance"], applicable_sectors: ["Marketplace", "SaaS"], difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 104, name: "E-commerce — Repeat Purchase Rate", phase: "Phase 8 — Tests B2B Enterprise", category: "Viabilité",
    description: "Mesure et optimisation du taux de réachat pour valider la fidélité client",
    objective: "Atteindre un taux de réachat ≥20% dans les 90 jours",
    detailed_protocol: ["Mesurez le taux de réachat actuel par cohorte (30j, 60j, 90j)", "Segmentez par catégorie, canal d'acquisition et panier moyen", "Identifiez les facteurs de réachat : emails, programme fidélité, qualité produit", "Testez des stratégies de rétention : emails post-achat, recommandations, remises", "Implémentez un programme de fidélité si pertinent", "Mesurez l'amélioration du taux de réachat après chaque initiative", "Calculez le LTV réel basé sur le taux de réachat"],
    target_metrics: { metric_name: "Taux de réachat à 90j", success_threshold: "≥20%", failure_threshold: "<8%" },
    recommended_tools: ["Shopify", "Klaviyo", "Smile.io", "Google Analytics"],
    tags: ["e-commerce", "réachat", "fidélité"], applicable_sectors: ["E-commerce"], difficulty_level: "medium", estimated_duration: "3-6 mois (données nécessaires)", associated_step: 0
  },
  {
    test_number: 105, name: "E-commerce — Fulfillment & Delivery Test", phase: "Phase 8 — Tests B2B Enterprise", category: "Faisabilité",
    description: "Test de la chaîne logistique et de la livraison pour valider la fiabilité et la satisfaction",
    objective: "Atteindre un taux de livraison à temps ≥95% et un CSAT delivery ≥4/5",
    detailed_protocol: ["Cartographiez la chaîne logistique : stockage, picking, packing, shipping, livraison", "Testez avec 50-100 commandes réelles la chaîne complète", "Mesurez : temps de traitement, délai de livraison, taux d'erreur, casse", "Collectez le feedback client sur la livraison (CSAT, NPS)", "Identifiez les goulots d'étranglement et les points de défaillance", "Testez 2-3 transporteurs et comparez qualité/prix", "Optimisez et documentez les SOP (Standard Operating Procedures)"],
    target_metrics: { metric_name: "Taux de livraison à temps", success_threshold: "≥95% à temps, CSAT ≥4/5", failure_threshold: "<85% à temps" },
    recommended_tools: ["ShipStation", "Sendcloud", "Boxtal", "Google Sheets"],
    tags: ["logistique", "livraison", "e-commerce"], applicable_sectors: ["E-commerce", "FoodTech"], difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 112, name: "Enterprise Security Audit", phase: "Phase 8 — Tests B2B Enterprise", category: "Faisabilité",
    description: "Audit de sécurité pour répondre aux exigences des clients enterprise (SOC2, RGPD, pentest)",
    objective: "Passer un audit de sécurité préliminaire sans vulnérabilité critique",
    detailed_protocol: ["Réalisez un scan de vulnérabilité automatisé (OWASP ZAP, Snyk)", "Identifiez les failles critiques et prioritaires", "Corrigez les failles critiques immédiatement", "Documentez la politique de sécurité : accès, données, encryption", "Préparez un questionnaire de sécurité pré-rempli (SIG, CAIQ)", "Testez la résistance : injection SQL, XSS, CSRF", "Planifiez un pentest professionnel avant le premier client enterprise"],
    target_metrics: { metric_name: "Score audit sécurité", success_threshold: "0 vulnérabilité critique, <3 moyennes", failure_threshold: "Vulnérabilités critiques non résolues" },
    recommended_tools: ["Vanta", "Snyk", "OWASP ZAP", "Burp Suite"],
    tags: ["sécurité", "enterprise", "audit"], applicable_sectors: ["SaaS", "FinTech", "HealthTech"], difficulty_level: "hard", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 113, name: "Enterprise Integration Test", phase: "Phase 8 — Tests B2B Enterprise", category: "Faisabilité",
    description: "Test d'intégration avec les systèmes enterprise existants (ERP, CRM, SSO, HRIS)",
    objective: "Valider l'intégration fonctionnelle avec ≥2 systèmes enterprise courants",
    detailed_protocol: ["Identifiez les intégrations les plus demandées par les prospects enterprise", "Priorisez : SSO (SAML/OIDC), CRM (Salesforce/HubSpot), ERP", "Développez les connecteurs prioritaires", "Testez avec des données réelles ou sandbox des prospects", "Documentez le processus d'intégration step-by-step", "Mesurez le temps d'intégration et les ressources nécessaires", "Créez un catalogue d'intégrations pour le commercial"],
    target_metrics: { metric_name: "Intégrations enterprise validées", success_threshold: "≥2 intégrations fonctionnelles", failure_threshold: "0 intégration opérationnelle" },
    recommended_tools: ["Workato", "Tray.io", "Custom API", "Postman"],
    tags: ["intégration", "enterprise", "API"], applicable_sectors: ["SaaS", "FinTech", "HealthTech"], difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 117, name: "IP Strategy Assessment", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Évaluation de la stratégie de propriété intellectuelle pour protéger l'avantage concurrentiel",
    objective: "Définir et initier une stratégie PI couvrant les actifs clés de l'entreprise",
    detailed_protocol: ["Listez tous les actifs de PI : marque, code source, algorithmes, design, données", "Évaluez la brevetabilité des innovations techniques clés", "Vérifiez la disponibilité de la marque (INPI, EUIPO, USPTO)", "Identifiez les risques de contrefaçon (freedom-to-operate)", "Déposez les protections prioritaires : marque, copyright, brevet provisoire", "Estimez le budget PI sur 2 ans", "Créez une politique PI interne (clauses employés, NDA, open source)"],
    target_metrics: { metric_name: "Actifs PI protégés", success_threshold: "Marque + 1 autre protection déposée", failure_threshold: "Aucune protection PI" },
    recommended_tools: ["INPI", "EUIPO", "LegalStart", "Google Patents"],
    tags: ["PI", "brevet", "marque"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  // Tests restants pour atteindre 138
  {
    test_number: 121, name: "Data Privacy Compliance Test", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Test de conformité RGPD/données personnelles pour valider le traitement des données utilisateurs",
    objective: "Atteindre la conformité RGPD sur les 6 principes fondamentaux",
    detailed_protocol: ["Cartographiez tous les flux de données personnelles", "Identifiez les bases légales de traitement pour chaque flux", "Vérifiez le consentement : formulaires, opt-in, gestion des préférences", "Testez les droits utilisateurs : accès, rectification, suppression, portabilité", "Vérifiez la sécurité des données : encryption, access control, logs", "Documentez le registre de traitements (obligatoire RGPD)", "Nommez un DPO si nécessaire et créez la politique de confidentialité"],
    target_metrics: { metric_name: "Score conformité RGPD", success_threshold: "6/6 principes conformes", failure_threshold: "<4 principes conformes" },
    recommended_tools: ["OneTrust", "Cookiebot", "Axeptio", "CNIL tools"],
    tags: ["RGPD", "données", "conformité"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 122, name: "Accessibility (WCAG) Test", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Test d'accessibilité web selon les normes WCAG 2.1 pour garantir l'inclusivité",
    objective: "Atteindre le niveau WCAG 2.1 AA sur les parcours principaux",
    detailed_protocol: ["Lancez un audit automatisé avec axe ou Lighthouse", "Testez avec un lecteur d'écran (NVDA, VoiceOver) les parcours principaux", "Vérifiez les contrastes de couleur (ratio minimum 4.5:1)", "Testez la navigation au clavier seul", "Vérifiez les textes alternatifs pour les images", "Testez avec les zooms texte (200%, 400%)", "Documentez les corrections nécessaires et priorisez"],
    target_metrics: { metric_name: "Score WCAG 2.1 AA", success_threshold: "≥90% des critères AA respectés", failure_threshold: "<70% des critères AA" },
    recommended_tools: ["axe DevTools", "Lighthouse", "WAVE", "NVDA"],
    tags: ["accessibilité", "WCAG", "inclusivité"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 123, name: "Internationalization Readiness Test", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Évaluation de la préparation à l'internationalisation : technique, réglementaire et commerciale",
    objective: "Valider la faisabilité de l'expansion dans au moins 1 nouveau marché",
    detailed_protocol: ["Évaluez la readiness technique : i18n, multi-devise, multi-timezone, RTL", "Identifiez les exigences réglementaires du marché cible", "Estimez les coûts d'adaptation : traduction, localisation, conformité", "Testez la demande sur le marché cible (ads test, cold outreach)", "Identifiez les partenaires locaux potentiels (distribution, juridique)", "Créez un business case pour l'expansion avec P&L projeté", "Définissez les critères GO/NO-GO pour le lancement international"],
    target_metrics: { metric_name: "Score de readiness international", success_threshold: "≥70% de readiness (technique + business)", failure_threshold: "<40% de readiness" },
    recommended_tools: ["i18next", "Crowdin", "Google Ads", "Notion"],
    tags: ["international", "expansion", "localisation"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 124, name: "Team Skill Gap Analysis", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Analyse des compétences de l'équipe pour identifier les lacunes critiques et planifier les recrutements",
    objective: "Identifier et planifier le comblement de ≥3 skill gaps critiques",
    detailed_protocol: ["Listez les compétences nécessaires pour les 12 prochains mois (technique, business, opérations)", "Évaluez les compétences actuelles de chaque membre de l'équipe (1-5)", "Identifiez les gaps : compétences nécessaires non couvertes", "Classez les gaps par criticité et urgence", "Définissez la stratégie : recrutement, formation, freelance, advisor", "Créez un plan de recrutement avec timeline et budget", "Identifiez les options à court terme (freelance, mentor) pour les gaps urgents"],
    target_metrics: { metric_name: "Skill gaps critiques couverts", success_threshold: "Plan pour ≥80% des gaps critiques", failure_threshold: "Gaps critiques non identifiés" },
    recommended_tools: ["Notion", "Google Sheets", "LinkedIn", "Welcome to the Jungle"],
    tags: ["équipe", "compétences", "recrutement"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "3-5 jours", associated_step: 0
  },
  {
    test_number: 125, name: "Customer Acquisition Cost by Channel", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Calcul détaillé du CAC par canal pour optimiser l'allocation du budget marketing",
    objective: "Calculer le CAC pour ≥3 canaux et identifier le plus efficace",
    detailed_protocol: ["Listez tous les canaux d'acquisition actifs et leur budget mensuel", "Configurez le tracking de conversion par canal (UTM, attribution)", "Mesurez le nombre de clients acquis par canal sur 1-3 mois", "Calculez le CAC par canal : budget total canal / clients acquis", "Incluez les coûts cachés : outils, temps équipe, créatives", "Comparez le CAC par canal avec le LTV segmenté", "Réallouez le budget vers les canaux à meilleur ROI"],
    target_metrics: { metric_name: "CAC par canal calculé", success_threshold: "≥3 canaux avec CAC < 1/3 du LTV", failure_threshold: "CAC non mesurable par canal" },
    recommended_tools: ["Google Analytics", "HubSpot", "Google Sheets", "Segment"],
    tags: ["CAC", "acquisition", "canal"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 126, name: "Competitor Feature Parity Test", phase: "Phase 9 — Tests Spécialisés", category: "Désirabilité",
    description: "Analyse de la parité fonctionnelle avec les concurrents pour identifier les lacunes et avantages",
    objective: "Documenter les gaps et avantages fonctionnels vs les 3 concurrents principaux",
    detailed_protocol: ["Listez les fonctionnalités clés des 3 concurrents principaux", "Créez une matrice de comparaison fonctionnalité par fonctionnalité", "Évaluez chaque fonctionnalité : absente, basique, avancée, supérieure", "Identifiez vos lacunes critiques (fonctionnalités must-have manquantes)", "Identifiez vos avantages (fonctionnalités uniques ou supérieures)", "Validez l'importance de chaque gap avec les utilisateurs", "Priorisez les développements pour combler les gaps critiques"],
    target_metrics: { metric_name: "Gaps critiques identifiés", success_threshold: "Matrice complète avec plan pour les gaps", failure_threshold: "Gaps critiques sans plan" },
    recommended_tools: ["G2", "Capterra", "Notion", "Google Sheets"],
    tags: ["concurrence", "fonctionnalités", "benchmark"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 127, name: "Customer Lifetime Value Deep Dive", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Analyse approfondie du LTV par segment pour identifier les clients les plus profitables",
    objective: "Calculer le LTV par segment et identifier les segments 2x plus profitables que la moyenne",
    detailed_protocol: ["Segmentez vos clients par : canal d'acquisition, plan, secteur, taille", "Calculez le LTV pour chaque segment : ARPU × durée × marge", "Identifiez les segments avec le LTV le plus élevé", "Analysez ce qui différencie les clients à haut LTV", "Ajustez votre ciblage pour attirer plus de clients à haut LTV", "Créez des stratégies de rétention spécifiques pour les high-LTV", "Projetez l'impact d'un shift vers les segments à haut LTV"],
    target_metrics: { metric_name: "Écart LTV entre segments", success_threshold: "Segment identifié avec LTV ≥2x la moyenne", failure_threshold: "LTV homogène, pas de segmentation" },
    recommended_tools: ["ChartMogul", "Google Sheets", "ProfitWell", "SQL"],
    tags: ["LTV", "segmentation", "profitabilité"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 128, name: "Sales Pipeline Velocity Test", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Mesure et optimisation de la vélocité du pipeline commercial (deals × win rate × ACV / cycle)",
    objective: "Augmenter la pipeline velocity de ≥25% en optimisant ses 4 composantes",
    detailed_protocol: ["Calculez la pipeline velocity actuelle : (Nb deals × Win rate × ACV) / Cycle", "Analysez chaque composante : laquelle a le plus de potentiel d'amélioration ?", "Testez des actions pour chaque composante : plus de deals, meilleur win rate, etc.", "Mesurez l'impact de chaque action sur la vélocité globale", "Implémentez les améliorations avec le meilleur ROI", "Créez un tableau de bord de suivi de la pipeline velocity", "Fixez des objectifs trimestriels de vélocité"],
    target_metrics: { metric_name: "Pipeline velocity", success_threshold: "Augmentation ≥25%", failure_threshold: "Pas d'amélioration" },
    recommended_tools: ["HubSpot", "Salesforce", "Pipedrive", "Google Sheets"],
    tags: ["pipeline", "vente", "vélocité"], applicable_sectors: ["SaaS", "FinTech", "DeepTech"], difficulty_level: "hard", estimated_duration: "4-8 semaines", associated_step: 0
  },
  {
    test_number: 129, name: "Competitive Win/Loss Analysis", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Analyse systématique des deals gagnés et perdus pour comprendre les facteurs de décision",
    objective: "Analyser ≥20 deals et identifier les 3 facteurs principaux de win/loss",
    detailed_protocol: ["Collectez les données de ≥20 deals récents (10 gagnés, 10 perdus)", "Interviewez les prospects/clients sur leur processus de décision", "Identifiez les facteurs décisifs : prix, fonctionnalités, relation, timing", "Analysez les patterns : contre quel concurrent perd-on le plus ?", "Identifiez les objections récurrentes et les contre-arguments efficaces", "Créez un playbook avec les stratégies gagnantes", "Partagez les insights avec l'équipe commerciale et produit"],
    target_metrics: { metric_name: "Facteurs win/loss identifiés", success_threshold: "≥3 facteurs avec actions correctives", failure_threshold: "Facteurs non identifiés" },
    recommended_tools: ["Gong", "Chorus", "HubSpot", "Notion"],
    tags: ["win-loss", "vente", "compétition"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 130, name: "Customer Onboarding Success Test", phase: "Phase 9 — Tests Spécialisés", category: "Désirabilité",
    description: "Mesure et optimisation du succès de l'onboarding pour maximiser l'activation et la rétention",
    objective: "Atteindre un taux de complétion d'onboarding ≥80% avec activation ≥50%",
    detailed_protocol: ["Définissez les étapes de l'onboarding et les critères de succès", "Instrumentez chaque étape avec du tracking (complétion, durée, abandon)", "Mesurez le taux de complétion actuel de l'onboarding", "Identifiez les étapes avec le plus grand drop-off", "Simplifiez : réduisez le nombre d'étapes au minimum viable", "Ajoutez des éléments d'engagement : progress bar, quick wins, aide contextuelle", "A/B testez les améliorations et mesurez l'impact sur l'activation"],
    target_metrics: { metric_name: "Taux complétion onboarding", success_threshold: "≥80% complétion, ≥50% activation", failure_threshold: "<50% complétion" },
    recommended_tools: ["UserGuiding", "Pendo", "Chameleon", "Intercom"],
    tags: ["onboarding", "activation", "succès"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-4 semaines", associated_step: 0
  },
  {
    test_number: 131, name: "Support Scalability Test", phase: "Phase 9 — Tests Spécialisés", category: "Faisabilité",
    description: "Évaluation de la scalabilité du support client avec la croissance de la base utilisateurs",
    objective: "Démontrer que le support peut gérer 3x le volume actuel sans dégradation",
    detailed_protocol: ["Mesurez les métriques support actuelles : volume, temps de réponse, résolution, CSAT", "Identifiez les types de tickets les plus fréquents (top 10)", "Automatisez les réponses aux questions récurrentes (FAQ, chatbot, documentation)", "Testez la charge : que se passe-t-il avec 2x, 3x le volume de tickets ?", "Évaluez les coûts de support par client à différentes échelles", "Créez des playbooks pour les cas fréquents", "Planifiez les besoins en recrutement support en fonction de la croissance"],
    target_metrics: { metric_name: "Scalabilité support", success_threshold: "Gestion de 3x le volume avec CSAT stable", failure_threshold: "Dégradation CSAT à 1.5x le volume" },
    recommended_tools: ["Zendesk", "Intercom", "Freshdesk", "Notion"],
    tags: ["support", "scalabilité", "service"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "2-3 semaines", associated_step: 0
  },
  {
    test_number: 132, name: "Unit Economics by Cohort", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Analyse des unit economics par cohorte pour valider l'amélioration dans le temps",
    objective: "Démontrer une amélioration des unit economics sur les 3 dernières cohortes",
    detailed_protocol: ["Segmentez les clients par cohorte mensuelle d'acquisition", "Calculez le CAC, LTV, ratio LTV/CAC et payback pour chaque cohorte", "Comparez l'évolution : les cohortes récentes ont-elles de meilleurs unit economics ?", "Identifiez les facteurs d'amélioration (ou de dégradation)", "Projetez l'évolution sur les 6 prochains mois", "Identifiez les actions qui améliorent les unit economics par cohorte", "Présentez la tendance positive aux investisseurs"],
    target_metrics: { metric_name: "Tendance unit economics", success_threshold: "Amélioration sur les 3 dernières cohortes", failure_threshold: "Dégradation sur les cohortes récentes" },
    recommended_tools: ["ChartMogul", "Google Sheets", "ProfitWell", "SQL"],
    tags: ["unit-economics", "cohorte", "tendance"], applicable_sectors: ALL_SECTORS, difficulty_level: "hard", estimated_duration: "1-2 semaines", associated_step: 0
  },
  {
    test_number: 133, name: "Operational Efficiency Benchmark", phase: "Phase 9 — Tests Spécialisés", category: "Viabilité",
    description: "Benchmark de l'efficacité opérationnelle vs les standards de l'industrie",
    objective: "Se situer dans le top quartile de l'industrie sur ≥3 métriques opérationnelles",
    detailed_protocol: ["Identifiez les métriques opérationnelles clés de votre industrie", "Collectez les benchmarks : Open Startups, SaaS Benchmarks, rapports VC", "Mesurez vos propres métriques : CAC ratio, magic number, burn multiple", "Comparez position par position vs les benchmarks", "Identifiez les métriques où vous êtes en dessous du median", "Définissez des plans d'amélioration pour les métriques faibles", "Suivez l'évolution trimestriellement"],
    target_metrics: { metric_name: "Position vs benchmark", success_threshold: "Top quartile sur ≥3 métriques", failure_threshold: "Bottom quartile sur >2 métriques" },
    recommended_tools: ["SaaS Benchmarks", "OpenView", "Google Sheets", "ChartMogul"],
    tags: ["benchmark", "efficacité", "opérations"], applicable_sectors: ALL_SECTORS, difficulty_level: "medium", estimated_duration: "1 semaine", associated_step: 0
  },
];

export async function seedKnowledgeBase() {
  // Check if table is already populated
  const { count, error: countError } = await supabase
    .from("knowledge_base_tests")
    .select("id", { count: "exact", head: true });

  if (countError) {
    console.error("Error checking knowledge base:", countError);
    return { success: false, error: countError.message };
  }

  if (count && count > 0) {
    console.log(`Knowledge base already has ${count} tests, skipping seed.`);
    return { success: true, message: `Already seeded with ${count} tests` };
  }

  // Insert in batches of 20
  const batchSize = 20;
  let inserted = 0;

  for (let i = 0; i < knowledgeBaseTests.length; i += batchSize) {
    const batch = knowledgeBaseTests.slice(i, i + batchSize).map(test => ({
      test_number: test.test_number,
      name: test.name,
      phase: test.phase,
      category: test.category,
      description: test.description,
      objective: test.objective,
      detailed_protocol: test.detailed_protocol as any,
      target_metrics: test.target_metrics as any,
      recommended_tools: test.recommended_tools,
      tags: test.tags,
      applicable_sectors: test.applicable_sectors,
      difficulty_level: test.difficulty_level,
      estimated_duration: test.estimated_duration,
      associated_step: test.associated_step,
    }));

    const { error } = await supabase
      .from("knowledge_base_tests")
      .insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / batchSize}:`, error);
      return { success: false, error: error.message, inserted };
    }
    inserted += batch.length;
  }

  return { success: true, message: `Seeded ${inserted} tests` };
}
