import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM_PROMPTS: Record<string, string> = {
  tam_sam_som: "Tu es un analyste marché senior. Estime TAM/SAM/SOM en TND pour la Tunisie. Réponds en markdown structuré avec hypothèses chiffrées et sources de raisonnement (top-down + bottom-up).",
  swot: "Tu es un consultant stratégie. Génère un SWOT actionnable (4 sections : Forces, Faiblesses, Opportunités, Menaces) à partir d'un Lean Canvas et de données marché. Chaque point doit être concret et exploitable.",
  competitor_benchmark: "Tu es un analyste compétitif. Benchmarke les concurrents fournis sur : positionnement, pricing, USP, faiblesses. Termine par 3 recommandations stratégiques différenciantes.",
  market_analysis: "Tu es un expert intelligence marché. Produis une analyse marché complète : tendances, segments clés, drivers, risques, fenêtre d'opportunité.",
  persona: "Tu es un UX strategist. Génère 2-3 personas utilisateurs détaillés (démographie, jobs-to-be-done, douleurs, motivations, canaux).",
};

function heuristicFallback(type: string, inputs: any): string {
  if (type === "tam_sam_som") {
    const { population = 12000000, pct_target = 5, arpu = 100, capture_pct = 2 } = inputs;
    const tam = population * (pct_target / 100) * arpu;
    const sam = tam * 0.3;
    const som = sam * (capture_pct / 100);
    return `## Estimation TAM / SAM / SOM (mode local)\n\n- **TAM** : ${tam.toLocaleString()} TND — ${population.toLocaleString()} hab × ${pct_target}% cible × ${arpu} TND/an\n- **SAM** : ${sam.toLocaleString()} TND — 30% du TAM accessible (canaux + géo)\n- **SOM** : ${som.toLocaleString()} TND — ${capture_pct}% du SAM capturable en 18-24 mois\n\n> Mode heuristique. Pour un rapport IA enrichi, réessaye plus tard.`;
  }
  if (type === "swot") {
    const { problem = "—", solution = "—", customer = "—", advantage = "—" } = inputs;
    return `## SWOT (mode local)\n\n### 💪 Forces\n- Solution claire : ${solution}\n- Avantage défendable : ${advantage}\n- Compréhension fine du problème\n\n### ⚠️ Faiblesses\n- Ressources limitées en early stage\n- Traction à construire\n- Marque inconnue\n\n### 🌱 Opportunités\n- Segment ${customer} mal servi en TN\n- Digitalisation en cours du secteur\n- Aides Startup Act\n\n### 🚨 Menaces\n- Acteurs internationaux entrants\n- Pouvoir d'achat limité\n- Réglementation évolutive`;
  }
  if (type === "competitor_benchmark") {
    const { competitors = [] } = inputs;
    const list = (competitors as any[]).map((c, i) => `### ${i + 1}. ${c.name || "Concurrent"}\n- Positionnement : ${c.positioning || "—"}\n- Pricing : ${c.pricing || "—"}\n- Force : ${c.strength || "—"}\n- Faiblesse : ${c.weakness || "—"}`).join("\n\n");
    return `## Benchmark concurrentiel (mode local)\n\n${list || "_Aucun concurrent renseigné_"}\n\n### Recommandations\n1. Trouver un positionnement différenciant non couvert\n2. Capitaliser sur les faiblesses identifiées\n3. Tester un pricing disruptif`;
  }
  return "## Rapport indisponible\nMode IA temporairement hors-ligne, réessayez plus tard.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { type, inputs } = await req.json();
    if (!type || !SYSTEM_PROMPTS[type]) {
      return new Response(JSON.stringify({ error: "Type invalide" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ result: heuristicFallback(type, inputs), source: "heuristic" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userPrompt = `Données fournies :\n\`\`\`json\n${JSON.stringify(inputs, null, 2)}\n\`\`\`\n\nGénère le rapport demandé en français, structuré en markdown.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[type] },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (resp.status === 402 || resp.status === 429 || !resp.ok) {
      return new Response(JSON.stringify({ result: heuristicFallback(type, inputs), source: "heuristic", warning: resp.status === 402 ? "Crédits IA épuisés" : resp.status === 429 ? "Trop de requêtes" : "IA indisponible" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const json = await resp.json();
    const content = json.choices?.[0]?.message?.content || heuristicFallback(type, inputs);
    return new Response(JSON.stringify({ result: content, source: "ai" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("market-intel-tools error", e);
    try {
      const body = await req.clone().json();
      return new Response(JSON.stringify({ result: heuristicFallback(body.type, body.inputs), source: "heuristic", warning: "Erreur IA" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch {
      return new Response(JSON.stringify({ error: "Erreur" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
});
