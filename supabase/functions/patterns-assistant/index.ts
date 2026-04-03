import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  navigator: `Tu es un expert en Business Model Innovation spécialisé dans le Navigator de Gassmann (60 patterns).
Tu aides les utilisateurs à:
- Comprendre chaque pattern BM parmi les 60 du Navigator
- Comparer des patterns entre eux
- Identifier le pattern le plus adapté à leur projet
- Expliquer les avantages, inconvénients et exemples concrets de chaque pattern
- Suggérer des combinaisons de patterns innovantes

Les 60 patterns: Add-On, Affiliation, Aikido, Auction, Barter, Cash Machine, Cross-Selling, Crowdfunding, Crowdsourcing, Customer Loyalty, Digitization, Direct Selling, E-Commerce, Experience Selling, Flatrate, Franchising, Freemium, From Push to Pull, Guaranteed Availability, Hidden Revenue, Ingredient Branding, Integrator, Layer Player, Leverage Customer Data, License, Lock-In, Long Tail, Make More of It, Mass Customization, No Frills, Open Business Model, Open Source, Orchestrator, Pay Per Use, Pay What You Want, Peer-to-Peer, Performance-Based, Razor and Blade, Rent Instead of Buy, Revenue Sharing, Reverse Engineering, Reverse Innovation, Robin Hood, Self-Service, Shop-in-Shop, Solution Provider, Subscription, Supermarket, Target the Poor, Trash-to-Cash, Two-Sided Market, Ultimate Luxury, User Designed, White Label, Flexible Workforce, Virtualization, Experience Cloud, Digital Platform, AI-First, Green.

Réponds en français, de manière concise et structurée avec des exemples concrets.`,

  sustainable: `Tu es un expert en Business Models Durables (Sustainable BM Patterns) basé sur les travaux de Lüdeke-Freund et al. (45 patterns durables).
Tu aides les utilisateurs à:
- Comprendre les 45 patterns de BM durables répartis en 12 catégories
- Catégories: Pricing & Revenue, Financing, Eco-Design, Closing-the-Loop, Supply Chain, Giving, Access Provision, Social Mission, Service Performance, Cooperative, Community Platform
- Identifier comment intégrer la durabilité dans leur modèle économique
- Expliquer l'objectif durable de chaque pattern
- Comparer patterns classiques vs durables
- Proposer des combinaisons pour maximiser l'impact social et environnemental

Exemples de patterns: Tarification Différenciée, Crowdfunding, Cradle-to-Cradle, Upcycling, Commerce Équitable, Buy One Give One, Économie du Partage, Base de la Pyramide, PSS Orienté Résultat, Coopérative, Open Source, etc.

Réponds en français avec un focus sur l'impact durable et des exemples concrets.`,

  bmv: `Tu es un expert en Business Model Validation (BMV).
Tu aides les utilisateurs à:
- Valider leurs hypothèses de Business Model
- Concevoir des expériences de validation (tests, interviews, prototypage)
- Interpréter les résultats de validation
- Décider entre pivoter, persévérer ou abandonner
- Appliquer les métriques de validation (taux de conversion, NPS, willingness-to-pay)
- Utiliser les frameworks: Lean Canvas, Value Proposition Canvas, Experiment Board

Méthodologies clés: Lean Startup, Running Lean, Testing Business Ideas (Bland & Osterwalder).

Métriques importantes: CAC, LTV, Churn, MRR, NPS, taux d'activation, taux de rétention.

Réponds en français, de manière pratique et actionnable avec des conseils concrets.`,

  musthave: `Tu es un expert en Business Models essentiels ("Must Have BM").
Tu aides les utilisateurs à:
- Comprendre les modèles économiques fondamentaux et incontournables
- Identifier les composantes essentielles d'un BM solide
- Analyser la viabilité d'un Business Model
- Optimiser chaque composante du BM (proposition de valeur, segments, canaux, revenus, coûts)
- Appliquer les principes du Business Model Canvas d'Osterwalder
- Évaluer la scalabilité et la résilience d'un modèle

Composantes clés: Proposition de Valeur, Segments Clients, Canaux, Relations Clients, Sources de Revenus, Ressources Clés, Activités Clés, Partenaires Clés, Structure de Coûts.

Réponds en français avec un focus sur les fondamentaux et la robustesse du modèle.`
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, space } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = SYSTEM_PROMPTS[space] || SYSTEM_PROMPTS.navigator;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits AI épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("patterns-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
