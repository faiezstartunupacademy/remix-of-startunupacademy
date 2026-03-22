/**
 * Generates 8–12 deeply characterized personas based on project data.
 * Each persona includes demographic, psychographic, behavioral, and emotional attributes.
 */

type PersonaSeed = {
  project_id: string;
  name: string;
  description: string;
  is_early_adopter: boolean;
  interviews_done: number;
  interviews_target: number;
  conversion_rate: number;
  satisfaction_score: number;
  governorate: string | null;
  age_range: string;
  socio_profile: string;
  psycho_profile: string;
  emotional_profile: string;
};

interface ProjectContext {
  target_customers?: string;
  sector?: string;
  business_model?: string;
  problem_description?: string;
  solution_description?: string;
  differentiator?: string;
  stage?: string;
}

const GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Sfax", "Sousse",
  "Nabeul", "Monastir", "Bizerte", "Gabès", "Médenine", "Kairouan",
];

const PERSONA_ARCHETYPES = [
  {
    name: "L'Innovateur Technophile",
    ageRange: "22-30",
    socio: "Ingénieur / Développeur",
    psycho: "Visionnaire, adopteur précoce, tolérant aux bugs",
    emotional: "Excité par la nouveauté, frustré par la lenteur",
    earlyAdopter: true,
    interviewTarget: 25,
    description: "Premier à tester les nouvelles solutions, partage activement sur les réseaux. Prêt à payer un premium pour l'accès anticipé. Revenus moyens-élevés, très connecté.",
  },
  {
    name: "Le Décideur Corporate",
    ageRange: "35-50",
    socio: "Directeur / C-Level",
    psycho: "ROI-driven, averse au risque, besoin de preuves sociales",
    emotional: "Stressé par la performance, motivé par le statut",
    earlyAdopter: false,
    interviewTarget: 15,
    description: "Cherche des solutions éprouvées pour optimiser son département. Budget conséquent mais processus de décision long. Sensible aux études de cas et témoignages pairs.",
  },
  {
    name: "L'Entrepreneur Solo",
    ageRange: "28-40",
    socio: "Freelance / Fondateur bootstrappé",
    psycho: "Débrouillard, sensible au prix, orienté efficacité",
    emotional: "Anxieux sur la trésorerie, passionné par son projet",
    earlyAdopter: true,
    interviewTarget: 20,
    description: "Gère tout seul, cherche des outils all-in-one abordables. Temps limité, prend des décisions rapides. Actif dans les communautés entrepreneuriales locales.",
  },
  {
    name: "L'Étudiant Ambitieux",
    ageRange: "18-25",
    socio: "Étudiant universitaire / Stagiaire",
    psycho: "Curieux, influençable, sensible au gratuit/freemium",
    emotional: "Enthousiaste mais impatient, cherche la validation sociale",
    earlyAdopter: true,
    interviewTarget: 30,
    description: "Découvre l'écosystème startup, veut apprendre et expérimenter. Budget quasi-nul mais fort potentiel de bouche-à-oreille. Présent sur TikTok et Instagram.",
  },
  {
    name: "Le Manager Opérationnel",
    ageRange: "30-45",
    socio: "Chef de projet / Responsable d'équipe",
    psycho: "Pragmatique, orienté processus, cherche la fiabilité",
    emotional: "Sous pression des deadlines, satisfait par l'ordre et la clarté",
    earlyAdopter: false,
    interviewTarget: 18,
    description: "Responsable d'une équipe de 5-20 personnes. Cherche des outils qui réduisent la friction quotidienne. Décision d'achat influencée par la hiérarchie.",
  },
  {
    name: "La PME Traditionnelle",
    ageRange: "40-55",
    socio: "Gérant PME / Commerçant",
    psycho: "Conservateur, méfiant du digital, besoin d'accompagnement",
    emotional: "Nostalgique des méthodes anciennes, anxieux face au changement",
    earlyAdopter: false,
    interviewTarget: 12,
    description: "Entreprise familiale ou locale, 2-10 employés. Faible maturité digitale. A besoin d'un onboarding très guidé et d'un support humain. Potentiel de fidélisation élevé.",
  },
  {
    name: "L'Influenceur Sectoriel",
    ageRange: "28-45",
    socio: "Consultant / Formateur / Blogueur",
    psycho: "Expert reconnu, cherche à renforcer sa crédibilité",
    emotional: "Motivé par la reconnaissance, frustré par les outils médiocres",
    earlyAdopter: true,
    interviewTarget: 10,
    description: "Réseau large et influence significative dans le secteur. Peut devenir ambassadeur ou prescripteur. Exige une qualité irréprochable et des fonctionnalités avancées.",
  },
  {
    name: "Le Chercheur Académique",
    ageRange: "30-55",
    socio: "Professeur / Chercheur universitaire",
    psycho: "Analytique, méthodique, sceptique par nature",
    emotional: "Satisfait par la rigueur intellectuelle, impatient avec le marketing",
    earlyAdopter: false,
    interviewTarget: 10,
    description: "Intéressé par les méthodologies et les données probantes. Peut valider scientifiquement le produit. Faible budget personnel mais accès à des financements institutionnels.",
  },
  {
    name: "Le Parent Connecté",
    ageRange: "30-42",
    socio: "Cadre / Profession libérale avec enfants",
    psycho: "Multitâche, orienté gain de temps, fidèle aux marques de confiance",
    emotional: "Culpabilité du manque de temps, satisfait par les solutions simples",
    earlyAdopter: false,
    interviewTarget: 15,
    description: "Jongle entre vie pro et familiale. Prêt à payer pour gagner du temps. Recommande fortement les produits qui fonctionnent. Très sensible à la sécurité des données.",
  },
  {
    name: "L'Investisseur Stratégique",
    ageRange: "35-60",
    socio: "Business Angel / VC / Family Office",
    psycho: "Calculateur, orienté scalabilité et exit, réseau étendu",
    emotional: "Excité par le potentiel disruptif, méfiant des métriques vanité",
    earlyAdopter: false,
    interviewTarget: 8,
    description: "Ne sera pas utilisateur final mais évalue le potentiel marché. Ses questions révèlent les angles morts. Peut devenir mentor ou source de financement.",
  },
  {
    name: "Le Digital Native Créatif",
    ageRange: "20-30",
    socio: "Designer / Créateur de contenu / UX",
    psycho: "Esthète, exigeant sur l'UX, partage ses trouvailles",
    emotional: "Inspiré par le beau design, frustré par les interfaces datées",
    earlyAdopter: true,
    interviewTarget: 20,
    description: "Juge un produit en 10 secondes par son design. Fort pouvoir de recommandation visuelle (screenshots, vidéos). Sensible au branding et à la cohérence visuelle.",
  },
  {
    name: "L'Utilisateur à Mobilité Réduite",
    ageRange: "25-60",
    socio: "Divers — focus accessibilité",
    psycho: "Patient, reconnaissant des efforts d'inclusion, loyal",
    emotional: "Frustré par l'exclusion numérique, fidèle aux marques accessibles",
    earlyAdopter: false,
    interviewTarget: 10,
    description: "Représente 15% de la population. Teste l'accessibilité réelle du produit (lecteur d'écran, navigation clavier). Sa satisfaction révèle la qualité inclusive du MVP.",
  },
];

/**
 * Selects and customizes 8-12 personas based on the project's sector, stage, and target market.
 */
export function generatePersonas(projectId: string, project: ProjectContext): PersonaSeed[] {
  const sector = (project.sector || "").toLowerCase();
  const stage = (project.stage || "").toLowerCase();
  const hasB2B = (project.target_customers || "").toLowerCase().includes("entreprise") ||
    (project.business_model || "").toLowerCase().includes("b2b") ||
    (project.business_model || "").toLowerCase().includes("saas");
  const hasB2C = (project.target_customers || "").toLowerCase().includes("consommateur") ||
    (project.business_model || "").toLowerCase().includes("b2c") ||
    (project.business_model || "").toLowerCase().includes("marketplace");

  // Score each archetype for relevance
  const scored = PERSONA_ARCHETYPES.map((arch, idx) => {
    let score = 5; // base score

    // B2B projects: boost corporate/manager/investor personas
    if (hasB2B && ["Le Décideur Corporate", "Le Manager Opérationnel", "L'Investisseur Stratégique"].includes(arch.name)) score += 3;
    // B2C projects: boost consumer-oriented personas
    if (hasB2C && ["L'Étudiant Ambitieux", "Le Parent Connecté", "Le Digital Native Créatif"].includes(arch.name)) score += 3;

    // Tech sector boosts
    if (["tech", "fintech", "healthtech", "edtech", "saas"].some(s => sector.includes(s))) {
      if (["L'Innovateur Technophile", "Le Digital Native Créatif"].includes(arch.name)) score += 2;
    }

    // Education/formation sector
    if (["education", "formation", "edtech"].some(s => sector.includes(s))) {
      if (["L'Étudiant Ambitieux", "Le Chercheur Académique"].includes(arch.name)) score += 3;
    }

    // Early stage: more early adopters
    if (["ideation", "mvp"].includes(stage) && arch.earlyAdopter) score += 2;

    // Always include primary target persona
    if (idx === 0) score += 1;

    return { ...arch, score, idx };
  });

  // Sort by relevance, take top 8-12
  scored.sort((a, b) => b.score - a.score);
  
  // Determine count: 8 base + extras based on data richness
  let count = 8;
  if (project.target_customers) count += 1;
  if (project.business_model) count += 1;
  if (project.differentiator) count += 1;
  if (project.problem_description && project.solution_description) count += 1;
  count = Math.min(count, 12);

  const selected = scored.slice(0, count);

  // Build the primary persona from actual project data
  const personas: PersonaSeed[] = [];

  if (project.target_customers) {
    personas.push({
      project_id: projectId,
      name: `🎯 Persona Cible Principal`,
      description: `Client cible identifié : ${project.target_customers}. ${project.problem_description ? `Souffre du problème : "${project.problem_description.substring(0, 120)}".` : ""} ${project.solution_description ? `Recherche : "${project.solution_description.substring(0, 100)}".` : ""}`,
      is_early_adopter: true,
      interviews_done: 0,
      interviews_target: 25,
      conversion_rate: 0,
      satisfaction_score: 0,
      governorate: "Tunis",
      age_range: "25-40",
      socio_profile: "Client cible direct — segment prioritaire",
      psycho_profile: "Douleur active, recherche active de solution, prêt à tester",
      emotional_profile: "Frustré par le statu quo, optimiste sur les nouvelles solutions",
    });
  }

  // Add the archetype personas (skip duplicates with primary)
  const governorateIdx = { current: 0 };
  for (const arch of selected) {
    if (personas.length >= count) break;

    // Skip if too similar to primary
    if (project.target_customers && arch.name === "L'Innovateur Technophile" && personas.length === 1) continue;

    const gov = GOVERNORATES[governorateIdx.current % GOVERNORATES.length];
    governorateIdx.current++;

    personas.push({
      project_id: projectId,
      name: arch.name,
      description: arch.description,
      is_early_adopter: arch.earlyAdopter,
      interviews_done: 0,
      interviews_target: arch.interviewTarget,
      conversion_rate: 0,
      satisfaction_score: 0,
      governorate: gov,
      age_range: arch.ageRange,
      socio_profile: arch.socio,
      psycho_profile: arch.psycho,
      emotional_profile: arch.emotional,
    });
  }

  // Ensure we hit minimum 8
  while (personas.length < 8) {
    personas.push({
      project_id: projectId,
      name: `Persona supplémentaire ${personas.length + 1}`,
      description: "Segment de marché à explorer et caractériser via des interviews terrain.",
      is_early_adopter: false,
      interviews_done: 0,
      interviews_target: 10,
      conversion_rate: 0,
      satisfaction_score: 0,
      governorate: GOVERNORATES[personas.length % GOVERNORATES.length],
      age_range: "25-50",
      socio_profile: "À définir après interviews",
      psycho_profile: "À définir après interviews",
      emotional_profile: "À définir après interviews",
    });
  }

  return personas;
}
