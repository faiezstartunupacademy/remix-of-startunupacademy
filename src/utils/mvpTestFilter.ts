import { KnowledgeBaseTest } from "@/data/knowledgeBaseTests";

// Maps BM patterns to relevant test categories/tags
const BM_TEST_RELEVANCE: Record<string, string[]> = {
  // Revenue/pricing models
  "Abonnement SaaS": ["rétention", "churn", "pricing", "activation", "onboarding", "NPS", "MRR", "LTV", "récurrence"],
  "Subscription": ["rétention", "churn", "pricing", "activation", "onboarding", "NPS", "MRR", "LTV", "récurrence"],
  "Commission marketplace": ["liquidité", "marketplace", "réseau", "offre", "demande", "matching", "commission", "deux faces"],
  "Freemium": ["conversion", "activation", "gratuit", "premium", "upgrade", "paywall", "engagement"],
  "Vente directe": ["vente", "commercial", "pipeline", "closing", "prospection", "canal"],
  "Publicité": ["audience", "trafic", "engagement", "CPM", "impression", "média"],
  "Licence": ["propriété intellectuelle", "contrat", "B2B", "enterprise", "déploiement"],
  // Gassmann pattern symbols
  "Fm": ["conversion", "activation", "gratuit", "premium", "freemium"],
  "Sb": ["rétention", "churn", "MRR", "abonnement", "récurrence"],
  "P2": ["marketplace", "réseau", "matching", "liquidité"],
  "Tm": ["marketplace", "réseau", "deux faces", "plateforme"],
  "Ra": ["consommable", "device", "écosystème", "attachement"],
  "Dp": ["plateforme", "API", "écosystème", "développeur"],
  "Ai": ["IA", "algorithme", "données", "prédiction", "automatisation"],
  "Gn": ["impact", "durabilité", "ESG", "environnement", "carbone"],
};

// Sectors that make certain test categories less relevant
const SECTOR_EXCLUSIONS: Record<string, string[]> = {
  "SaaS": ["physique", "logistique", "retail", "magasin"],
  "E-commerce": ["API", "développeur", "open source"],
  "HealthTech": [],
  "FinTech": ["physique", "logistique"],
  "DeepTech": ["viral", "influenceur"],
  "Social Impact": [],
  "GreenTech": [],
  "EdTech": ["logistique", "physique"],
  "FoodTech": ["API", "développeur"],
};

/**
 * Filters MVP tests based on idea context, BM pattern, and sector.
 * Returns only tests that are relevant to the project.
 */
export function filterRelevantTests(
  allTests: KnowledgeBaseTest[],
  context: {
    sector?: string;
    businessModel?: string;
    bmSymbol?: string;
    problemDescription?: string;
    solutionDescription?: string;
  }
): KnowledgeBaseTest[] {
  const { sector, businessModel, bmSymbol, problemDescription, solutionDescription } = context;

  // Combine all context text for keyword matching
  const contextText = [problemDescription, solutionDescription, businessModel, sector]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Get relevant keywords from BM pattern
  const bmKeywords: string[] = [];
  if (businessModel && BM_TEST_RELEVANCE[businessModel]) {
    bmKeywords.push(...BM_TEST_RELEVANCE[businessModel]);
  }
  if (bmSymbol && BM_TEST_RELEVANCE[bmSymbol]) {
    bmKeywords.push(...BM_TEST_RELEVANCE[bmSymbol]);
  }

  // Get exclusion keywords from sector
  const exclusionKeywords = sector ? (SECTOR_EXCLUSIONS[sector] || []) : [];

  return allTests.filter(test => {
    // 1. Check sector applicability
    if (test.applicable_sectors && test.applicable_sectors.length > 0 && sector) {
      const sectorMatch = test.applicable_sectors.some(s => 
        s.toLowerCase() === sector.toLowerCase() || s === "ALL" || test.applicable_sectors.length === 10
      );
      // Don't hard-exclude, but deprioritize (we still include if other criteria match)
    }

    // 2. Check if test is excluded by sector context
    const testText = `${test.name} ${test.description} ${test.objective} ${test.tags?.join(" ")}`.toLowerCase();
    const isExcluded = exclusionKeywords.some(kw => testText.includes(kw.toLowerCase()));
    if (isExcluded) return false;

    // 3. Always include fundamental tests (first 5 per step)
    if (test.test_number <= 5 || test.difficulty_level === "easy") return true;

    // 4. Check BM relevance - if we have BM keywords, prefer tests that match
    if (bmKeywords.length > 0) {
      const hasBMRelevance = bmKeywords.some(kw => testText.includes(kw.toLowerCase()));
      if (hasBMRelevance) return true;
    }

    // 5. Check context relevance
    if (contextText) {
      const testKeywords = test.tags || [];
      const hasContextRelevance = testKeywords.some(tag => contextText.includes(tag.toLowerCase()));
      if (hasContextRelevance) return true;
    }

    // 6. Include medium difficulty tests by default, exclude hard ones without relevance
    if (test.difficulty_level === "hard" && bmKeywords.length > 0) return false;

    return true;
  });
}

/**
 * Returns a relevance score for a test given the project context
 */
export function getTestRelevanceScore(
  test: KnowledgeBaseTest,
  context: { sector?: string; businessModel?: string; bmSymbol?: string }
): number {
  let score = 50; // Base score

  const testText = `${test.name} ${test.description} ${test.objective} ${test.tags?.join(" ")}`.toLowerCase();

  // BM pattern match bonus
  const bmKeywords = [
    ...(context.businessModel && BM_TEST_RELEVANCE[context.businessModel] || []),
    ...(context.bmSymbol && BM_TEST_RELEVANCE[context.bmSymbol] || []),
  ];
  const bmMatches = bmKeywords.filter(kw => testText.includes(kw.toLowerCase())).length;
  score += bmMatches * 15;

  // Fundamental tests get priority
  if (test.difficulty_level === "easy") score += 20;

  // Sector match
  if (context.sector && test.applicable_sectors?.some(s => s.toLowerCase() === context.sector?.toLowerCase())) {
    score += 10;
  }

  return Math.min(score, 100);
}
