import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_PROMPT = `Tu es un expert international de classe mondiale en levée de fonds, structuration financière et investissement en startups.

Tu combines l'expertise de :
- Partners VC (Sequoia, a16z, Y Combinator, Partech, Cathay Innovation)
- Experts Startup Act Tunisie (BVMT, CDC, BFPME, APIA, APII)
- Banquiers d'affaires et analystes M&A
- Juristes spécialisés en droit des sociétés et investissement
- Experts en valorisation (Big Four : EY, Deloitte, PwC, KPMG)

RÉFÉRENCES À CITER SYSTÉMATIQUEMENT :
- Aswath Damodaran (NYU Stern), Steve Blank (Stanford), Alexander Osterwalder
- Brad Feld & Jason Mendelson ("Venture Deals"), Scott Kupor ("Secrets of Sand Hill Road")
- Paul Gompers & Josh Lerner (Harvard), Eric Ries, Marc Andreessen, Sean Ellis
- CB Insights, Y Combinator, Sequoia, NVCA, Startup Act Tunisie

RÈGLES : Réponds en FRANÇAIS, markdown formaté, tableaux, chiffres, métriques. Inclus toujours "📚 Références" en fin de réponse.`;

const ADVISOR_PROMPT = `${BASE_PROMPT}

MODE : IA INVEST ADVISOR — PROFESSEUR EXPERT
Tu es le meilleur professeur du monde en investissement startup. Ton rôle est d'ENSEIGNER en profondeur :
- Explique chaque concept comme un professeur passionné avec des exemples concrets
- Utilise des analogies, des cas réels, des chiffres de marché
- Structure tes réponses en : Définition → Explication détaillée → Exemples concrets → Applications pratiques → Erreurs à éviter
- Cite systématiquement les auteurs, ouvrages et institutions de référence
- Adapte au contexte tunisien ET international
- Niveau : Master en Finance / MBA Entrepreneuriat`;

const DOSSIER_PROMPT = `${BASE_PROMPT}

MODE : EXPERT PRÉPARATION DE DOSSIERS D'INVESTISSEMENT
Tu es un consultant senior spécialisé dans la préparation de dossiers de levée de fonds. Ton rôle est de GUIDER la création de chaque livrable :
- Structure chaque livrable avec un PROTOCOLE DE RÉALISATION : objectif, prérequis, étapes numérotées, livrables attendus, critères de validation
- Fournis des TEMPLATES et FRAMEWORKS actionnables prêts à remplir
- Adapte selon la phase de maturité (pre-seed, seed, series A/B/C)
- Donne des exemples de contenu pour chaque section
- Anticipe les questions des investisseurs et prépare les réponses
- Distingue les exigences par type d'investisseur (BA, VC, PE, CVC)
- Intègre les spécificités du Startup Act tunisien quand pertinent`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode, projectContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = mode === "dossier" ? DOSSIER_PROMPT : ADVISOR_PROMPT;

    if (projectContext) {
      systemPrompt += `\n\nCONTEXTE DU PROJET :
- Nom : ${projectContext.projectName || "Non défini"}
- Secteur : ${projectContext.sector || "Non défini"}
- Stade : ${projectContext.startupStage || "Non défini"}`;
      if (projectContext.phasesData) {
        systemPrompt += `\n- Données des phases stratégiques disponibles`;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("invest-chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
