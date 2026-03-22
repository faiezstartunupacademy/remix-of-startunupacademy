import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { keywords, company, activity, sector } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = [
      keywords ? `Mots-clés: ${keywords}` : "",
      company ? `Entreprise/Société: ${company}` : "",
      activity ? `Activité/Secteur: ${activity}` : "",
      sector ? `Écosystème: ${sector}` : "",
    ].filter(Boolean).join("\n");

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
            content: `Tu es un expert en innovation disruptive (Clayton Christensen, disruption verticale et horizontale).
            
À partir des informations fournies par l'utilisateur (mots-clés, entreprise, activité), tu dois:

1. **Identifier les opportunités de disruption** (verticale: améliorer un segment sous-desservi, horizontale: créer un nouveau marché)
2. **Proposer 2-3 idées disruptives concrètes** avec nom, description, proposition de valeur
3. **Classifier chaque idée** dans un Business Model pattern parmi les 60 patterns de Gassmann (Add-On, Freemium, Subscription, Peer-to-Peer, Razor and Blade, Two-Sided Market, etc.)
4. **Évaluer le potentiel** de chaque idée (score /10)

Réponds en JSON avec cette structure exacte:
{
  "analysis": "Analyse rapide du contexte et des opportunités",
  "ideas": [
    {
      "name": "Nom de l'idée",
      "description": "Description en 2-3 phrases",
      "value_proposition": "Proposition de valeur unique",
      "disruption_type": "verticale" ou "horizontale",
      "bm_pattern": "Nom du pattern BM Gassmann",
      "bm_symbol": "Symbole du pattern (ex: Fm, Sb, P2)",
      "potential_score": 8,
      "target_market": "Marché cible"
    }
  ],
  "recommended_bm": "Le pattern BM le plus adapté globalement",
  "recommended_bm_symbol": "Symbole"
}`
          },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: content, ideas: [], recommended_bm: "", recommended_bm_symbol: "" };
    } catch {
      parsed = { analysis: content, ideas: [], recommended_bm: "", recommended_bm_symbol: "" };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("disruption-chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
