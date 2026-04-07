import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildFallbackVerdict(params: any) {
  const { test_name, test_objective, target_metrics, qualitative_result, quantitative_result, estimated_duration, adjusted_duration, sector } = params;

  const hasQuali = qualitative_result && qualitative_result.trim().length > 10;
  const hasQuanti = quantitative_result && quantitative_result.trim().length > 0;

  let verdict = "Partiel";
  let recommendation = "Retester avec modifications";

  if (hasQuali && hasQuanti) {
    verdict = "Succès";
    recommendation = "Continuer";
  } else if (!hasQuali && !hasQuanti) {
    verdict = "Échec";
    recommendation = "Pivoter";
  }

  const metricsInfo = target_metrics ? JSON.stringify(target_metrics) : "Non spécifiées";

  return {
    verdict: {
      interpretation: `**Analyse de secours (IA temporairement indisponible)**\n\nTest : **${test_name || "Non nommé"}**\nObjectif : ${test_objective || "Non précisé"}\nMétriques cibles : ${metricsInfo}\n\nRésultat qualitatif fourni : ${hasQuali ? "✅ Oui" : "❌ Non"}\nRésultat quantitatif fourni : ${hasQuanti ? "✅ Oui" : "❌ Non"}\n\n> ⚠️ Cette analyse est générée localement. Relancez l'analyse quand les crédits IA seront rechargés pour obtenir une évaluation experte complète.`,
      verdict,
      recommendation,
      duration_analysis: adjusted_duration
        ? `Durée estimée ajustée : ${adjusted_duration}. Vérifiez que le temps réel correspond à cette estimation pour garantir la fiabilité des données.`
        : "Durée non spécifiée — impossible d'évaluer la cohérence temporelle.",
      next_actions: [
        "Documenter les résultats obtenus dans un format structuré",
        "Comparer les métriques obtenues aux seuils cibles définis",
        "Préparer le protocole pour un éventuel re-test avec des ajustements",
      ],
      source: "fallback",
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const params = await req.json();
    const { test_name, test_objective, target_metrics, qualitative_result, quantitative_result, estimated_duration, adjusted_duration, sector, phase } = params;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      // No API key — return fallback
      return new Response(JSON.stringify(buildFallbackVerdict(params)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un mentor de startups expert. Analyse le résultat de ce test MVP et donne :
1) INTERPRÉTATION du résultat par rapport à la métrique cible
2) VERDICT (Succès/Partiel/Échec)
3) RECOMMANDATION (Continuer/Pivoter/Retester avec modifications)
4) ANALYSE DE LA DURÉE : évalue si le temps pris est cohérent avec la durée estimée ajustée au secteur.
5) PROCHAINES ACTIONS (3 actions concrètes)
Réponds en JSON avec les clés: interpretation, verdict, recommendation, duration_analysis, next_actions. En français.`;

    const userPrompt = `Test : ${test_name}
Objectif : ${test_objective}
Métrique cible : ${JSON.stringify(target_metrics)}
Résultat qualitatif : ${qualitative_result || "Non fourni"}
Résultat quantitatif : ${quantitative_result || "Non fourni"}
Durée estimée de base : ${estimated_duration || "Non spécifiée"}
Durée ajustée (secteur ${sector || "Générique"}, ${phase || "N/A"}) : ${adjusted_duration || "Non spécifiée"}
Secteur/Écosystème : ${sector || "Générique"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      // On 402 or 429 or any error, return fallback instead of crashing
      console.error(`AI gateway returned ${response.status}, using fallback`);
      return new Response(JSON.stringify(buildFallbackVerdict(params)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";

    let verdict: any;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      verdict = JSON.parse(jsonStr);
    } catch {
      verdict = {
        interpretation: content,
        verdict: "Partiel",
        recommendation: "Retester avec modifications",
        next_actions: ["Revoir les données collectées", "Ajuster le protocole", "Relancer le test"],
      };
    }

    return new Response(JSON.stringify({ verdict }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-test-result error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
