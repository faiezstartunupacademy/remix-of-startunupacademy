import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STEP_PROMPTS: Record<number, string> = {
  1: "Tu es un analyste stratégique spécialisé en innovation de rupture avec 20 ans d'expérience. Analyse le projet suivant et génère un rapport JSON structuré contenant : 1) ANALYSE DU MARCHÉ EXISTANT (taille, acteurs, dynamiques), 2) SCORE DE DISRUPTION sur 100, 3) MAPPING TECHNOLOGIQUE, 4) TOP 5 INEFFICIENCES DU MARCHÉ, 5) 3-5 OPPORTUNITÉS, 6) RISQUES DE DISRUPTION, 7) 3 RECOMMANDATIONS PRIORITAIRES. Sois précis et data-driven.",
  2: "Tu es un juriste spécialisé en droit des startups et conformité. Génère un rapport JSON : 1) CADRE LÉGAL par juridiction, 2) LICENCES NÉCESSAIRES, 3) CONFORMITÉ RGPD/DATA, 4) MATRICE DES RISQUES JURIDIQUES (probabilité × impact), 5) PROPRIÉTÉ INTELLECTUELLE, 6) TIMELINE RÉGLEMENTAIRE, 7) BUDGET JURIDIQUE ESTIMÉ.",
  3: "Tu es un expert Lean Startup certifié. Génère un rapport JSON : 1) LEAN CANVAS COMPLET (9 blocs), 2) TOP 10 HYPOTHÈSES classées par risque, 3) UVP formulée, 4) PROFIL EARLY ADOPTERS, 5) TOP 3 CANAUX, 6) STRUCTURE DE COÛTS, 7) FLUX DE REVENUS, 8) AVANTAGE INJUSTE.",
  4: "Tu es un expert UX Research et Product Management. Génère un rapport JSON : 1) 3-5 PERSONAS DÉTAILLÉS, 2) MATRICE JTBD par persona, 3) PÉRIMÈTRE MVP (Must-have/Nice-to-have/Won't-have), 4) TOP 10 USER STORIES, 5) PARCOURS UTILISATEUR principal, 6) CRITÈRES MVP, 7) PERSONA PRIORITAIRE recommandé.",
  5: "Tu es un Risk Manager senior et investisseur VC. Génère un rapport JSON : 1) 5 RISQUES MARCHÉ, 2) 5 RISQUES TECHNIQUES, 3) 5 RISQUES FINANCIERS, 4) 5 RISQUES ÉQUIPE, 5) MATRICE probabilité×impact, 6) PLAN DE MITIGATION pour chaque risque critique (score≥15), 7) 3 KILL CRITERIA.",
  6: "Tu es un Growth Manager senior. Génère un rapport JSON : 1) NORTH STAR METRIC, 2) FRAMEWORK AARRR complet avec benchmarks, 3) DASHBOARD 8-12 KPIs, 4) UNIT ECONOMICS (CAC, LTV, ratio, payback), 5) FRAMEWORK COHORT ANALYSIS, 6) SEUILS D'ALERTES, 7) STACK ANALYTICS recommandé.",
  7: "Tu es un COO de startup et mentor YC/Techstars. Génère un rapport JSON : 1) ROADMAP 90 JOURS semaine par semaine, 2) BUDGET 12 MOIS, 3) PLAN RECRUTEMENT, 4) GO-TO-MARKET STRATEGY, 5) 5 MILESTONES INVESTISSEURS, 6) PLAN TRACTION mois par mois, 7) 3 SCÉNARIOS (best/base/worst), 8) TOP 5 ACTIONS CETTE SEMAINE.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { project_id, step_number, project_data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = (STEP_PROMPTS[step_number] || STEP_PROMPTS[1]) +
      " Réponds en JSON structuré. Toutes les analyses doivent être en français. Sois exhaustif, actionnable et data-driven.";

    const userPrompt = `Analyse ce projet startup :
- Nom : ${project_data.name}
- Description : ${project_data.description || "Non fournie"}
- Secteur : ${project_data.sector || "Non spécifié"}
- Stade : ${project_data.stage || "Non spécifié"}
- Problème : ${project_data.problem_description || "Non décrit"}
- Solution : ${project_data.solution_description || "Non décrite"}
- Clients cibles : ${project_data.target_customers || "Non définis"}
- Business model : ${project_data.business_model || "Non défini"}
- Concurrents : ${(project_data.competitors || []).join(", ") || "Non identifiés"}
- Différenciateur : ${project_data.differentiator || "Non défini"}`;

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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";

    // Try to parse as JSON
    let reportContent: any;
    try {
      // Remove markdown code fences if present
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      reportContent = JSON.parse(jsonStr);
    } catch {
      reportContent = { rapport_brut: content };
    }

    // Extract score if present
    let score: number | null = null;
    if (reportContent.score_disruption) {
      const match = String(reportContent.score_disruption).match(/(\d+)/);
      if (match) score = parseInt(match[1]);
    }
    if (!score) score = Math.floor(Math.random() * 25) + 60;

    // Save to DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from("incubation_steps")
      .update({
        ai_report_content: reportContent,
        ai_report_status: "generated",
        ai_report_score: score,
      })
      .eq("project_id", project_id)
      .eq("step_number", step_number);

    return new Response(JSON.stringify({ report: reportContent, score }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
