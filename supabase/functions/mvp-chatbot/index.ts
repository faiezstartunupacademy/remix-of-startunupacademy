import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un expert en stratégie startup et business models, spécialisé dans l'écosystème tunisien (Startup Act, SSO, incubateurs).

Tu connais parfaitement les 60 Business Model Patterns de Gassmann et les 45 Sustainable Business Model Patterns de Lüdeke-Freund (soit 105+ patterns au total).

Ton rôle est d'analyser l'idée de startup du porteur et de fournir :

1. **Classification Business Model** : Identifie les 3-5 patterns de BM les plus adaptés parmi les 105+ patterns. Explique pourquoi chacun est pertinent.

2. **Connexion Écosystème** : Recommande les SSO (Flat6Labs, Founder Institute, Wiki Startup, B@Labs, BIAT Labs, Cogite, Impact Partner), programmes d'incubation et structures adaptés en Tunisie.

3. **Hypothèses de démarrage** : Liste les 5-7 hypothèses critiques à valider (risque marché, technique, financier) avec leur niveau d'importance.

4. **Fonctionnalités de démarrage** : Propose les fonctionnalités MVP core et nice-to-have avec priorité.

5. **Personas de démarrage** : Identifie 3-5 personas cibles avec profil démographique, besoins, et si ce sont des early adopters.

6. **Lean Canvas** : Génère un Lean Canvas complet (Problème, Segments clients, Proposition de valeur unique, Solution, Canaux, Sources de revenus, Structure de coûts, Métriques clés, Avantage injuste).

7. **Analyse des risques** : Évalue les risques (marché, technique, financier, équipe, réglementaire) avec score de sévérité et probabilité.

8. **Certifications, Brevets & Normes** : Identifie les certifications requises (ISO, CE, normes sectorielles), les brevets potentiels à déposer, les normes techniques et commerciales obligatoires, et les exigences réglementaires d'implantation du projet. Objectif : réduire les incertitudes juridiques et techniques.

9. **Interconnexion des éléments** : Crée une matrice d'influences croisées entre TOUS les éléments de l'analyse (BM ↔ Risques, Personas ↔ Fonctionnalités, Certifications ↔ Hypothèses, etc.). Pour chaque relation : type d'influence (positive/négative/neutre), intensité (forte/moyenne/faible), et recommandation d'action. Identifie les dépendances critiques, synergies et points de vigilance.

Réponds TOUJOURS en français. Structure ta réponse avec des titres markdown clairs et NUMÉROTÉS (## 1. , ## 2. , etc.).
Adapte tes recommandations au secteur spécifique et au contexte tunisien.
Sois concret, actionnable et pragmatique.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mvp-chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
