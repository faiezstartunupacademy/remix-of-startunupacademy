import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, description, problem, solution, sector } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Projet: ${name}
Description: ${description || "Non fournie"}
Problème: ${problem}
Solution: ${solution}
Secteur: ${sector || "Non précisé"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
}`
          },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Rechargez vos crédits dans Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
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

    if (!parsed) {
      return new Response(JSON.stringify({ error: "Impossible de classifier le BM" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-bm error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
