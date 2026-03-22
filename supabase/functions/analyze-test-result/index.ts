import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { test_name, test_objective, target_metrics, qualitative_result, quantitative_result, estimated_duration, adjusted_duration, sector, phase } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `Tu es un mentor de startups expert. Analyse le résultat de ce test MVP et donne :
1) INTERPRÉTATION du résultat par rapport à la métrique cible
2) VERDICT (Succès/Partiel/Échec)
3) RECOMMANDATION (Continuer/Pivoter/Retester avec modifications)
4) ANALYSE DE LA DURÉE : évalue si le temps pris est cohérent avec la durée estimée ajustée au secteur. Indique si le test a été réalisé trop rapidement (risque de données insuffisantes) ou trop lentement (risque de perte de momentum).
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
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
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
