import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ClassificationResult = {
  primary: {
    number: number;
    symbol: string;
    name: string;
    confidence: number;
    reasoning: string;
    characteristics: string[];
    incubation_alignment: Record<string, string>;
  };
  alternatives: { number: number; symbol: string; name: string; reasoning: string }[];
  key_metrics: { name: string; description: string; target: string; decision_rule: string }[];
  go_nogo_rules: string[];
  source?: "ai" | "fallback";
  notice?: string;
};

type PatternDefinition = {
  number: number;
  symbol: string;
  name: string;
  keywords: string[];
  sectorBoosts: string[];
  rationale: string;
  alternativeHint: string;
  characteristics: string[];
  incubation_alignment: Record<string, string>;
  key_metrics: { name: string; description: string; target: string; decision_rule: string }[];
  go_nogo_rules: string[];
};

const FALLBACK_PATTERNS: PatternDefinition[] = [
  {
    number: 47,
    symbol: "Sb",
    name: "Subscription",
    keywords: ["abonnement", "subscription", "mensuel", "annuel", "récurrent", "recurring", "saas", "membership"],
    sectorBoosts: ["saas", "edtech", "healthtech"],
    rationale: "le projet semble mieux monétisable via des revenus récurrents et une relation continue avec l'utilisateur final.",
    alternativeHint: "si vous validez une forte récurrence d'usage et un bénéfice continu dans le temps.",
    characteristics: ["Revenus récurrents", "Relation long terme", "Prévisibilité du cash-flow"],
    incubation_alignment: {
      disruption: "Le modèle par abonnement transforme un achat ponctuel en engagement continu.",
      lean_canvas: "Le Lean Canvas doit tester la willingness-to-pay récurrente et le churn attendu.",
      mvp_focus: "Le MVP doit prouver l'activation, la rétention et le renouvellement.",
      metrics_focus: "MRR, churn et LTV/CAC deviennent les métriques pivots.",
    },
    key_metrics: [
      { name: "MRR", description: "Revenu mensuel récurrent", target: "> 5k€ en 6 mois", decision_rule: "Si le MRR stagne 2 mois, revoir pricing ou segment." },
      { name: "Churn", description: "Attrition mensuelle", target: "< 5%", decision_rule: "Si le churn > 10%, retravailler la valeur perçue." },
      { name: "LTV/CAC", description: "Valeur vie client / coût acquisition", target: "> 3x", decision_rule: "Si le ratio < 1, ralentir l'acquisition." },
    ],
    go_nogo_rules: [
      "GO si les utilisateurs renouvellent après la période d'essai.",
      "NO-GO si le churn reste élevé malgré des itérations produit.",
      "PIVOT si la fréquence d'usage ne justifie pas un abonnement.",
    ],
  },
  {
    number: 17,
    symbol: "Fm",
    name: "Freemium",
    keywords: ["freemium", "gratuit", "free", "premium", "essai gratuit", "trial"],
    sectorBoosts: ["saas", "edtech"],
    rationale: "une entrée gratuite suivie d'upsells premium paraît adaptée pour réduire la friction d'adoption.",
    alternativeHint: "si l'acquisition gratuite est forte mais que la conversion premium reste à démontrer.",
    characteristics: ["Acquisition à faible friction", "Upsell premium", "Effet d'échantillonnage"],
    incubation_alignment: {
      disruption: "Le gratuit permet d'accélérer la diffusion initiale du produit.",
      lean_canvas: "Tester les features déclencheuses de conversion premium.",
      mvp_focus: "Mesurer activation, usage gratuit et conversion payante.",
      metrics_focus: "Activation rate, conversion free-to-paid, retention premium.",
    },
    key_metrics: [
      { name: "Free-to-paid", description: "Conversion gratuit vers premium", target: "> 3%", decision_rule: "Si < 1%, revoir la séparation free/premium." },
      { name: "Activation", description: "Temps jusqu'à la première valeur", target: "< 10 min", decision_rule: "Si trop long, simplifier l'onboarding." },
      { name: "Premium retention", description: "Rétention payante", target: "> 70% à 3 mois", decision_rule: "Si faible, le premium n'apporte pas assez de valeur." },
    ],
    go_nogo_rules: [
      "GO si la version gratuite génère du volume qualifié.",
      "NO-GO si le coût de support des gratuits dépasse la valeur créée.",
      "PIVOT si les utilisateurs refusent systématiquement l'offre premium.",
    ],
  },
  {
    number: 51,
    symbol: "Tm",
    name: "Two-Sided Market",
    keywords: ["marketplace", "place de marché", "mise en relation", "commission", "vendeur", "acheteur", "prestataire", "matching"],
    sectorBoosts: ["marketplace"],
    rationale: "la valeur semble provenir de la mise en relation entre deux groupes d'utilisateurs distincts.",
    alternativeHint: "si vous devez orchestrer l'offre et la demande avec une commission ou des frais de plateforme.",
    characteristics: ["Effets de réseau", "Double acquisition", "Monétisation par commission ou abonnement"],
    incubation_alignment: {
      disruption: "La plateforme capture la valeur de la coordination entre acteurs.",
      lean_canvas: "Tester séparément l'offre, la demande et la liquidité du marché.",
      mvp_focus: "Valider la première transaction et la répétition des échanges.",
      metrics_focus: "GMV, take rate et liquidity rate sont essentiels.",
    },
    key_metrics: [
      { name: "GMV", description: "Valeur brute des transactions", target: "Croissance mensuelle continue", decision_rule: "Si le GMV n'augmente pas, revoir la liquidité." },
      { name: "Take rate", description: "Part captée par la plateforme", target: "> 10%", decision_rule: "Si trop faible, le modèle économique est fragile." },
      { name: "Liquidity", description: "Taux de matching réussi", target: "> 30%", decision_rule: "Si faible, densifier un côté du marché." },
    ],
    go_nogo_rules: [
      "GO si les deux côtés reviennent naturellement sur la plateforme.",
      "NO-GO si l'acquisition d'un côté reste structurellement trop chère.",
      "PIVOT si la valeur est surtout unilatérale et non bilatérale.",
    ],
  },
  {
    number: 13,
    symbol: "Eb",
    name: "E-Commerce",
    keywords: ["e-commerce", "commerce", "vente en ligne", "boutique", "catalogue", "panier", "livraison", "produit"],
    sectorBoosts: ["e-commerce", "foodtech", "retail"],
    rationale: "la proposition de valeur s'oriente vers la vente directe de produits via un canal numérique.",
    alternativeHint: "si votre priorité est l'optimisation du tunnel d'achat et du panier moyen.",
    characteristics: ["Vente directe", "Optimisation conversion", "Pilotage logistique"],
    incubation_alignment: {
      disruption: "Le digital réduit les frictions de distribution et étend la portée commerciale.",
      lean_canvas: "Tester les segments, l'offre produit et le pricing.",
      mvp_focus: "Valider le funnel visite > panier > achat > réachat.",
      metrics_focus: "Conversion, panier moyen et taux de réachat priment.",
    },
    key_metrics: [
      { name: "Conversion", description: "Visiteurs vers acheteurs", target: "> 2%", decision_rule: "Si faible, revoir offre, UX ou confiance." },
      { name: "AOV", description: "Panier moyen", target: "En hausse continue", decision_rule: "Si bas, travailler bundles et upsells." },
      { name: "Repeat purchase", description: "Taux de réachat", target: "> 25%", decision_rule: "Si faible, renforcer rétention et satisfaction." },
    ],
    go_nogo_rules: [
      "GO si le coût d'acquisition reste compatible avec la marge.",
      "NO-GO si la logistique détruit la rentabilité unitaire.",
      "PIVOT si la demande confirme le besoin mais pas le canal direct.",
    ],
  },
  {
    number: 46,
    symbol: "Sl",
    name: "Solution Provider",
    keywords: ["solution", "service", "accompagnement", "programme", "diagnostic", "contenu", "personnalisé", "formation", "plateforme"],
    sectorBoosts: ["healthtech", "edtech", "social impact", "fintech"],
    rationale: "le projet résout un problème précis avec une offre structurée, personnalisée et orientée résultats.",
    alternativeHint: "si vos clients paient pour une solution complète plutôt qu'un simple outil.",
    characteristics: ["Résolution d'un problème critique", "Valeur perçue élevée", "Personnalisation forte"],
    incubation_alignment: {
      disruption: "La différenciation vient de la profondeur de la solution plus que du canal.",
      lean_canvas: "Le terrain doit confirmer le problème prioritaire et le niveau d'urgence.",
      mvp_focus: "Le MVP doit démontrer un gain clair sur un cas d'usage prioritaire.",
      metrics_focus: "Activation, satisfaction et preuve d'impact deviennent centraux.",
    },
    key_metrics: [
      { name: "Activation", description: "Utilisateurs atteignant une première valeur claire", target: "> 60%", decision_rule: "Si faible, mieux cadrer le cas d'usage initial." },
      { name: "NPS / satisfaction", description: "Qualité perçue de la solution", target: "> 40", decision_rule: "Si bas, la promesse n'est pas tenue." },
      { name: "Pilot-to-paid", description: "Passage du test à l'usage payé", target: "> 25%", decision_rule: "Si faible, clarifier ROI et cible." },
    ],
    go_nogo_rules: [
      "GO si les premiers utilisateurs décrivent un gain tangible et répétable.",
      "NO-GO si le problème est jugé secondaire par la cible.",
      "PIVOT si la valeur existe mais sur un autre segment ou usage.",
    ],
  },
  {
    number: 34,
    symbol: "Pt",
    name: "Pay Per Use",
    keywords: ["par usage", "à l'usage", "à la demande", "on-demand", "par transaction", "consommation", "crédit", "token"],
    sectorBoosts: ["fintech", "deeptech"],
    rationale: "la valeur semble mieux capturée au moment de la consommation effective qu'en forfait fixe.",
    alternativeHint: "si l'usage est variable et que la facturation à la consommation est plus naturelle.",
    characteristics: ["Facturation variable", "Alignement usage/prix", "Faible friction d'entrée"],
    incubation_alignment: {
      disruption: "Le pricing suit la valeur réellement consommée par le client.",
      lean_canvas: "Tester la perception de justice tarifaire et la fréquence d'usage.",
      mvp_focus: "Mesurer l'intensité d'usage et le revenu par transaction.",
      metrics_focus: "Usage frequency, revenue per use et marge unitaire pilotent les décisions.",
    },
    key_metrics: [
      { name: "Revenue per use", description: "Revenu moyen par usage", target: "Marge positive", decision_rule: "Si négatif, revoir le pricing." },
      { name: "Usage frequency", description: "Fréquence de consommation", target: "En hausse continue", decision_rule: "Si irrégulière, renforcer les déclencheurs d'usage." },
      { name: "Gross margin", description: "Marge par transaction", target: "> 40%", decision_rule: "Si trop basse, industrialiser ou repositionner." },
    ],
    go_nogo_rules: [
      "GO si les clients comprennent et acceptent la logique à l'usage.",
      "NO-GO si le pricing devient difficile à anticiper pour le client.",
      "PIVOT si un abonnement crée plus de confiance et de rétention.",
    ],
  },
  {
    number: 25,
    symbol: "Ls",
    name: "License",
    keywords: ["licence", "license", "royalty", "white label", "contenu", "ip", "propriété intellectuelle"],
    sectorBoosts: ["edtech", "media", "healthtech"],
    rationale: "la propriété intellectuelle ou le contenu réutilisable peuvent devenir le cœur de la monétisation.",
    alternativeHint: "si vous voulez distribuer votre solution via des partenaires ou des établissements.",
    characteristics: ["Effet de levier IP", "Distribution indirecte", "Revenus de redevance"],
    incubation_alignment: {
      disruption: "La valeur réside dans l'actif intellectuel plus que dans l'opérationnel.",
      lean_canvas: "Tester les canaux partenaires et la volonté de licence.",
      mvp_focus: "Valider un premier usage institutionnel ou B2B sous licence.",
      metrics_focus: "Nombre de licences, renouvellement et revenu par partenaire sont clés.",
    },
    key_metrics: [
      { name: "Active licenses", description: "Nombre de licences actives", target: "Croissance régulière", decision_rule: "Si stagne, revoir le canal partenaire." },
      { name: "Renewal rate", description: "Taux de renouvellement", target: "> 80%", decision_rule: "Si bas, la valeur n'est pas suffisamment démontrée." },
      { name: "Royalty revenue", description: "Revenus de redevance", target: "En hausse trimestrielle", decision_rule: "Si faible, revoir la structure de licence." },
    ],
    go_nogo_rules: [
      "GO si les partenaires voient un intérêt clair à distribuer ou intégrer la solution.",
      "NO-GO si la propriété intellectuelle n'est pas différenciante.",
      "PIVOT si la vente directe crée plus de traction que la licence.",
    ],
  },
  {
    number: 59,
    symbol: "Ai",
    name: "AI-First",
    keywords: ["ia", "ai", "génératif", "generative", "copilote", "assistant intelligent", "automatisation"],
    sectorBoosts: ["deeptech", "healthtech", "edtech"],
    rationale: "l'intelligence artificielle semble constituer la proposition de valeur centrale et différenciante.",
    alternativeHint: "si la performance du produit dépend directement de la qualité d'un moteur IA.",
    characteristics: ["Automatisation intelligente", "Scalabilité cognitive", "Différenciation algorithmique"],
    incubation_alignment: {
      disruption: "L'IA change la manière de produire ou personnaliser la valeur.",
      lean_canvas: "Tester la précision, l'utilité et la confiance utilisateur dès le départ.",
      mvp_focus: "Valider la qualité perçue des sorties IA sur un usage précis.",
      metrics_focus: "Task success rate, adoption et rétention pilotent la suite.",
    },
    key_metrics: [
      { name: "Task success", description: "Tâches réussies grâce à l'IA", target: "> 80%", decision_rule: "Si faible, réduire le périmètre initial." },
      { name: "Automation rate", description: "Part du workflow automatisée", target: "En hausse continue", decision_rule: "Si faible, l'IA n'apporte pas assez de gain." },
      { name: "Retention", description: "Rétention des utilisateurs IA", target: "> 35% à 8 semaines", decision_rule: "Si bas, la valeur n'est pas durable." },
    ],
    go_nogo_rules: [
      "GO si l'IA produit un gain net clair pour l'utilisateur.",
      "NO-GO si le coût d'inférence dépasse la valeur captée.",
      "PIVOT si l'IA doit devenir une brique et non le cœur du modèle.",
    ],
  },
  {
    number: 60,
    symbol: "Gn",
    name: "Green",
    keywords: ["green", "durable", "durabilité", "recyclage", "co2", "carbone", "impact", "énergie", "climat"],
    sectorBoosts: ["greentech", "social impact"],
    rationale: "l'impact environnemental ou sociétal semble constituer une composante structurante de la valeur proposée.",
    alternativeHint: "si la réduction d'impact ou la conformité ESG est au cœur de la proposition de valeur.",
    characteristics: ["Impact mesurable", "Différenciation durable", "Création de valeur responsable"],
    incubation_alignment: {
      disruption: "Le modèle capte une valeur économique liée à un impact positif démontrable.",
      lean_canvas: "Tester la volonté de payer pour l'impact et la preuve de résultat.",
      mvp_focus: "Le MVP doit démontrer un indicateur d'impact crédible.",
      metrics_focus: "Impact, marge et adoption doivent progresser ensemble.",
    },
    key_metrics: [
      { name: "Impact metric", description: "Indicateur d'impact principal", target: "Progression démontrable", decision_rule: "Si non mesurable, clarifier la thèse d'impact." },
      { name: "Gross margin", description: "Marge brute", target: "> 35%", decision_rule: "Si trop faible, l'impact ne suffit pas économiquement." },
      { name: "Repeat customers", description: "Clients récurrents", target: "> 30%", decision_rule: "Si faible, renforcer la valeur opérationnelle au-delà de l'impact." },
    ],
    go_nogo_rules: [
      "GO si l'impact et la traction économique progressent ensemble.",
      "NO-GO si l'impact est flou ou non vérifiable.",
      "PIVOT si la proposition d'impact existe mais pas le mécanisme de captation de valeur.",
    ],
  },
];

const DEFAULT_PATTERN = FALLBACK_PATTERNS.find((pattern) => pattern.name === "Solution Provider") ?? FALLBACK_PATTERNS[0];

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function scorePattern(text: string, sectorText: string, pattern: PatternDefinition) {
  let score = 0;

  for (const keyword of pattern.keywords) {
    if (text.includes(keyword)) score += 12;
  }

  for (const sectorBoost of pattern.sectorBoosts) {
    if (sectorText.includes(sectorBoost)) score += 18;
  }

  return score;
}

function buildFallbackClassification(
  payload: { name: string; description: string; problem: string; solution: string; sector: string },
  reason: string,
): ClassificationResult {
  const fullText = [payload.name, payload.description, payload.problem, payload.solution, payload.sector]
    .map(normalize)
    .join(" ");
  const sectorText = normalize(payload.sector);

  const ranked = FALLBACK_PATTERNS
    .map((pattern) => ({ pattern, score: scorePattern(fullText, sectorText, pattern) }))
    .sort((a, b) => b.score - a.score);

  const primaryEntry = ranked[0] && ranked[0].score > 0 ? ranked[0] : { pattern: DEFAULT_PATTERN, score: 0 };
  const alternatives = ranked
    .filter(({ pattern }) => pattern.number !== primaryEntry.pattern.number)
    .slice(0, 2)
    .map(({ pattern }) => ({
      number: pattern.number,
      symbol: pattern.symbol,
      name: pattern.name,
      reasoning: `Pattern alternatif pertinent ${pattern.alternativeHint}`,
    }));

  const confidence = Math.max(48, Math.min(78, 52 + primaryEntry.score));
  const notice =
    reason === "credits_exhausted"
      ? "Classification automatique de secours utilisée car les crédits IA sont temporairement épuisés."
      : reason === "rate_limited"
        ? "Classification automatique de secours utilisée car le service IA est momentanément saturé."
        : "Classification automatique de secours utilisée car le service IA n'a pas pu répondre correctement.";

  return {
    source: "fallback",
    notice,
    primary: {
      number: primaryEntry.pattern.number,
      symbol: primaryEntry.pattern.symbol,
      name: primaryEntry.pattern.name,
      confidence,
      reasoning: `Analyse heuristique basée sur le secteur et les mots-clés détectés : ${primaryEntry.pattern.rationale}`,
      characteristics: primaryEntry.pattern.characteristics,
      incubation_alignment: primaryEntry.pattern.incubation_alignment,
    },
    alternatives,
    key_metrics: primaryEntry.pattern.key_metrics,
    go_nogo_rules: primaryEntry.pattern.go_nogo_rules,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const payload = {
      name: typeof body?.name === "string" ? body.name.trim() : "",
      description: typeof body?.description === "string" ? body.description.trim() : "",
      problem: typeof body?.problem === "string" ? body.problem.trim() : "",
      solution: typeof body?.solution === "string" ? body.solution.trim() : "",
      sector: typeof body?.sector === "string" ? body.sector.trim() : "",
    };

    if (!payload.name && !payload.description && !payload.problem && !payload.solution) {
      return new Response(JSON.stringify({ error: "Informations projet insuffisantes pour classifier le business model." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify(buildFallbackClassification(payload, "ai_unavailable")), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Projet: ${payload.name}
Description: ${payload.description || "Non fournie"}
Problème: ${payload.problem || "Non fourni"}
Solution: ${payload.solution || "Non fournie"}
Secteur: ${payload.sector || "Non précisé"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en Business Model Innovation (Gassmann Navigator, 60 patterns).

À partir des informations d'un projet startup, tu dois:
1. Identifier le pattern BM le plus adapté parmi les 60 patterns de Gassmann
2. Donner un score de confiance (0-100)
3. Expliquer pourquoi ce pattern est adapté au projet
4. Lister les caractéristiques clés du BM et comment elles s'alignent avec le processus d'incubation
5. Proposer 2 patterns alternatifs
6. Définir les métriques principales et règles de décision pour ce BM

Voici les 60 patterns disponibles (numéro|symbole|nom):
1|Ad|Add-On, 2|Af|Affiliation, 3|Ai|Aikido, 4|Au|Auction, 5|Br|Barter, 6|Cb|Cash Machine, 7|Cr|Cross-Selling, 8|Cw|Crowdfunding, 9|Cs|Crowdsourcing, 10|Cm|Customer Loyalty, 11|Di|Digitization, 12|Ds|Direct Selling, 13|Eb|E-Commerce, 14|Ex|Experience Selling, 15|Fl|Flatrate, 16|Fr|Franchising, 17|Fm|Freemium, 18|Fr|From Push to Pull, 19|Gu|Guaranteed Availability, 20|Hb|Hidden Revenue, 21|Ig|Ingredient Branding, 22|In|Integrator, 23|Ip|Layer Player, 24|Lc|Leverage Customer Data, 25|Ls|License, 26|Lk|Lock-In, 27|Lt|Long Tail, 28|Mk|Make More of It, 29|Mc|Mass Customization, 30|Nr|No Frills, 31|Ob|Open Business Model, 32|Os|Open Source, 33|Or|Orchestrator, 34|Pt|Pay Per Use, 35|Pw|Pay What You Want, 36|P2|Peer-to-Peer, 37|Pm|Performance-Based, 38|Ra|Razor and Blade, 39|Rn|Rent Instead of Buy, 40|Rv|Revenue Sharing, 41|Re|Reverse Engineering, 42|Ri|Reverse Innovation, 43|Rm|Robin Hood, 44|Se|Self-Service, 45|Sp|Shop-in-Shop, 46|Sl|Solution Provider, 47|Sb|Subscription, 48|Sm|Supermarket, 49|Tg|Target the Poor, 50|Tr|Trash-to-Cash, 51|Tm|Two-Sided Market, 52|Ub|Ultimate Luxury, 53|Ud|User Designed, 54|Wl|White Label, 55|Fl|Flexible Workforce, 56|Vi|Virtualization, 57|Ec|Experience Cloud, 58|Dp|Digital Platform, 59|Ai|AI-First, 60|Gn|Green

Le processus d'incubation comporte 7 étapes:
1. Disruption: Analyse marché, opportunités de rupture
2. Réglementaire: Cadre légal, conformité
3. Running Lean: Lean Canvas, hypothèses terrain
4. MVP-Personas: Personas, périmètre MVP
5. Risques: Identification et mitigation
6. Métriques: AARRR, unit economics
7. Plan Tactique: Roadmap 90 jours

Réponds UNIQUEMENT en JSON valide avec cette structure:
{
  "primary": {
    "number": 47,
    "symbol": "Sb",
    "name": "Subscription",
    "confidence": 85,
    "reasoning": "Ce pattern correspond car...",
    "characteristics": ["Revenus récurrents prévisibles", "Relation long-terme client"],
    "incubation_alignment": {
      "disruption": "L'abonnement disruppe le modèle d'achat unique...",
      "lean_canvas": "Revenue streams = MRR, Key metrics = Churn...",
      "mvp_focus": "Tester la willingness-to-subscribe avant le produit complet",
      "metrics_focus": "MRR, Churn, LTV/CAC comme métriques pivots"
    }
  },
  "alternatives": [
    { "number": 17, "symbol": "Fm", "name": "Freemium", "reasoning": "..." },
    { "number": 34, "symbol": "Pt", "name": "Pay Per Use", "reasoning": "..." }
  ],
  "key_metrics": [
    { "name": "MRR", "description": "Monthly Recurring Revenue", "target": ">5000€ en 6 mois", "decision_rule": "Si MRR < 1000€ après 3 mois → pivoter pricing ou segment" },
    { "name": "Churn Rate", "description": "Taux d'attrition mensuel", "target": "<5%", "decision_rule": "Si churn > 10% → problème de product-market fit" },
    { "name": "LTV/CAC", "description": "Ratio valeur client / coût acquisition", "target": ">3x", "decision_rule": "Si LTV/CAC < 1 → stop acquisition, optimiser rétention" }
  ],
  "go_nogo_rules": [
    "GO si 60%+ des early adopters renouvellent après la période d'essai",
    "NO-GO si le churn dépasse 15% sur 2 mois consécutifs",
    "PIVOT si le pricing moyen est <50% du prix cible initial"
  ]
}`,
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const reason = response.status === 402 ? "credits_exhausted" : response.status === 429 ? "rate_limited" : "ai_unavailable";
      return new Response(JSON.stringify(buildFallbackClassification(payload, reason)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed?.primary) {
      return new Response(JSON.stringify(buildFallbackClassification(payload, "ai_unavailable")), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ...parsed, source: "ai" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-bm error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});