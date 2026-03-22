import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sources, analysisType } = await req.json();

    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: "Au moins une source de données est requise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service non configuré" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context from sources
    const contextSummary = sources
      .map((s: any, idx: number) => {
        return `**Source ${idx + 1}** (${s.type})\nURL: ${s.url}\nContenu:\n${s.content}\n`;
      })
      .join("\n---\n");

    let systemPrompt = "";
    let userPrompt = "";

    switch (analysisType) {
      case "hidden-truths":
        systemPrompt = `Tu es un expert en stratégie de marché formé chez Y Combinator. Ta spécialité est de révéler les vérités implicites que les acteurs qui réussissent comprennent mais que les clients ne verbalisent jamais explicitement.

Analyse les données brutes fournies et identifie :
1. Les comportements observables vs ce qu'ils révèlent vraiment
2. Les motivations profondes que les clients n'expriment pas directement
3. Les patterns que seuls les experts du secteur reconnaissent
4. Les règles non-écrites du marché

Réponds de manière structurée et actionnable.`;

        userPrompt = `Voici les données brutes du marché :\n\n${contextSummary}\n\nQuestion : Qu'est-ce que les acteurs qui réussissent dans ce marché comprennent, mais que les clients ne disent jamais explicitement ?`;
        break;

      case "assumptions":
        systemPrompt = `Tu es un expert en invalidation d'hypothèses stratégiques, formé chez Y Combinator. Ta mission est d'identifier les piliers sur lesquels repose un marché et leurs points de rupture potentiels.

Analyse les données et :
1. Identifie les 3 hypothèses fondamentales qui structurent ce marché
2. Pour chaque hypothèse, détermine précisément ce qui devrait se passer pour qu'elle devienne fausse
3. Évalue la probabilité et l'impact de ces scénarios de rupture

Sois précis, basé sur les données, et mets en évidence les opportunités cachées.`;

        userPrompt = `Voici les données du marché :\n\n${contextSummary}\n\nQuestions :\n1. Quelles sont les 3 hypothèses fondamentales sur lesquelles ce marché repose ?\n2. Que devrait-il se passer pour que chacune de ces hypothèses devienne fausse ?`;
        break;

      case "stress-test":
        systemPrompt = `Tu es un investisseur expérimenté de top-tier VC (Sequoia, a16z, Y Combinator). Ta mission est de stress-tester une idée avec les questions les plus destructives possibles, puis d'y répondre UNIQUEMENT en te basant sur les preuves disponibles.

Procédure :
1. Génère 5 questions qu'un investisseur expert poserait pour "tuer" cette idée
2. Pour chaque question, fournis une réponse basée STRICTEMENT sur les données fournies
3. Si les données sont insuffisantes, indique clairement "Données manquantes : [ce qui manque]"
4. Conclus avec un verdict : les preuves suffisent-elles pour défendre l'idée ?

Sois impitoyable mais factuel.`;

        userPrompt = `Voici les données collectées :\n\n${contextSummary}\n\nMission : Écris 5 questions qu'un investisseur expert utiliserait pour détruire cette idée, puis réponds-y en te basant UNIQUEMENT sur les preuves disponibles dans les données.`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Type d'analyse non reconnu" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log("Calling Lovable AI for analysis:", analysisType);

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
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'analyse IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Aucune analyse générée";

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in market-intelligence-chatbot:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
