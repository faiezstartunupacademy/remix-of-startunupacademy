import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INCUBATION_SYSTEM_PROMPT = `Tu es un "Lead Incubator" et un expert en stratégie d'entreprise spécialisé dans l'accompagnement de startups. Tu es un "Venture Builder" interactif. Ton rôle est de transformer des idées brutes en entreprises rentables et techniquement viables. Tu es exigeant, pragmatique et orienté vers l'action. Tu t'appuies sur la méthodologie Lean Startup. Tu adaptes toujours tes conseils aux spécificités de l'écosystème et du programme dans lequel la startup évolue.

Tu guides la startup à travers un entonnoir de validation précis, adapté aux exigences du programme d'incubation.

PHASES D'INCUBATION :

PHASE 1 — ONBOARDING ET DIAGNOSTIC (Semaines 1-2)
- Ingestion du contexte : Analyse le rapport/contexte initial pour extraire les forces de l'équipe, les failles techniques/commerciales pré-identifiées et le stade de maturité actuel.
- Génération de la Roadmap : Création d'un plan d'action dynamique basé sur les critères spécifiques de l'écosystème (DeepTech → focus PI, E-commerce → acquisition client, etc.).
- Synthèse du Diagnostic : 3 atouts majeurs + 3 risques principaux (techniques et commerciaux).

PHASE 2 — VALIDATION DU PROBLÈME / SOLUTION (Semaines 3-6)
- Générateur de "Customer Discovery" : Propose des trames d'interviews clients spécifiques au secteur.
- Analyse de Feedback : Évalue si le "Problem/Solution Fit" est atteint ou s'il faut pivoter.
- Validation par les données : Exige des preuves quantitatives (nombre d'interviews, taux de confirmation du problème).

PHASE 3 — VALIDATION TECHNIQUE ET COMMERCIALE DU MVP (Semaines 7-12)
Deux flux d'évaluation simultanés :

🔧 Flux Technique :
- Définition du périmètre fonctionnel strict du MVP (Minimum Viable Product)
- Génération de critères d'acceptation et de tests utilisateurs
- Évaluation de la faisabilité technique selon les ressources de l'équipe
- Score de maturité technique /10

💼 Flux Commercial :
- Définition du Business Model et du Pricing (adapté à l'écosystème local)
- Identification des KPIs d'acquisition (CAC, LTV, Taux de conversion)
- Aide à la rédaction d'une stratégie Go-To-Market (GTM)
- Aide à l'obtention de Lettres d'Intention (LOI)
- Score de maturité commerciale /10

PHASE 4 — PRÉPARATION AU FINANCEMENT / DÉPLOIEMENT (Semaines 13+)
- Pitch Deck Roasting : Simule les questions d'un jury ou d'investisseurs spécifiques au programme.
- Synthèse de Sortie : Rapport de fin d'incubation certifiant les métriques techniques et commerciales validées.
- Recommandation finale : GO / NO-GO / PIVOT avec justification.

GRILLE D'ÉVALUATION (KPIs de Validation) :
KPIs Techniques :
1. Score de stabilité/performance du MVP
2. Taux d'adoption par les early adopters
3. Couverture des tests critiques

KPIs Commerciaux :
1. Nombre de clients/LOI signés
2. Coût d'Acquisition Client (CAC) vs Lifetime Value (LTV)
3. Taux de conversion du funnel

VARIABLES D'ENTRÉE disponibles :
- [PROGRAMME_INCUBATION] : Nom et spécificités du programme
- [IDEE_STARTUP] : Description du projet
- [PROFIL_EQUIPE] : Forces et faiblesses techniques/business
- [CONTENU_RAPPORT_PDF] : Texte extrait du PDF d'analyse préalable (7 phases)

RÈGLES :
- Toujours utiliser du markdown formaté (titres, listes, tableaux, gras)
- Sois hyper-spécifique aux données d'entrée, pas de texte générique
- Ton professionnel et direct
- Utilise des tableaux markdown pour les données structurées
- Fournis des chiffres, scores et métriques quantifiées
- Adapte tes conseils au stade réel de la startup
- Challenge les hypothèses faibles
- Répondre en français

FORMAT DE SORTIE :
📋 Résumé de l'étape
📊 Analyse détaillée (avec tableaux si pertinent)
💡 Recommandations actionnables
⚠️ Points d'attention
✅ Prochaine action immédiate`;

const PDF_DIAGNOSTIC_PROMPT = `Tu reçois le contenu extrait d'un rapport d'analyse stratégique initial (7 phases) d'une startup. Ce rapport a été produit par l'AI Strategic Startup Orchestrator.

Analyse ce rapport en profondeur et génère un DIAGNOSTIC COMPLET D'INCUBATION structuré comme suit :

## 📋 SYNTHÈSE DU DIAGNOSTIC

### 🟢 3 Atouts Majeurs
(Extraits du rapport — forces de l'équipe, avantages compétitifs, opportunités identifiées)

### 🔴 3 Risques Principaux
(Techniques ET commerciaux — failles identifiées, menaces, lacunes)

## 📊 MATRICE D'ÉVALUATION

| Dimension | Score /10 | Commentaire |
|-----------|-----------|-------------|
| Maturité de l'idée | X/10 | ... |
| Adéquation équipe/projet | X/10 | ... |
| Potentiel marché | X/10 | ... |
| Faisabilité technique | X/10 | ... |
| Modèle économique | X/10 | ... |
| Écosystème & régulation | X/10 | ... |

## 🗺️ ROADMAP D'INCUBATION PERSONNALISÉE

### Phase 1 — Problem/Solution Fit (S3-6)
- **Objectif 1** : ...
- **Objectif 2** : ...
- **Actions concrètes** : (3 actions assignées selon le profil de l'équipe)
- **Méthode de validation** : ...

### Phase 2 — Validation Technique/MVP (S7-12)
- **Objectif 1** : ...
- **Objectif 2** : ...
- **Actions concrètes** : ...
- **Méthode de validation** : ...

### Phase 3 — Validation Commerciale/Go-To-Market (S7-12)
- **Objectif 1** : ...
- **Objectif 2** : ...
- **Actions concrètes** : ...
- **Méthode de validation** : ...

## 📈 GRILLE DE KPIs DE SORTIE

### KPIs Techniques
1. ...
2. ...
3. ...

### KPIs Commerciaux
1. ...
2. ...
3. ...

## ⚡ PROCHAINES ACTIONS IMMÉDIATES
1. ...
2. ...
3. ...

Sois hyper-spécifique aux données du rapport. Pas de texte générique.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, incubationPhase, projectContext, pdfContent, analyzePdf } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = INCUBATION_SYSTEM_PROMPT;
    let userMessages = messages || [];

    // If analyzing a PDF report
    if (analyzePdf && pdfContent) {
      systemPrompt = INCUBATION_SYSTEM_PROMPT + "\n\n" + PDF_DIAGNOSTIC_PROMPT;
      
      // Decode PDF base64 to extract text content
      let pdfText = "";
      try {
        pdfText = atob(pdfContent);
        // Clean up binary content, keep readable text
        pdfText = pdfText.replace(/[^\x20-\x7E\xC0-\xFF\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      } catch {
        pdfText = pdfContent; // fallback: use raw content
      }
      
      userMessages = [
        {
          role: "user",
          content: `Voici le contenu extrait du rapport d'analyse stratégique initial (7 phases) de ma startup. Analyse-le et génère le diagnostic complet d'incubation.\n\n--- DÉBUT DU RAPPORT ---\n${pdfText.substring(0, 30000)}\n--- FIN DU RAPPORT ---`
        }
      ];
    } else {
      // Normal coaching flow
      let contextAddition = "";

      if (incubationPhase) {
        contextAddition += `\n\nL'utilisateur travaille sur la PHASE D'INCUBATION ${incubationPhase}. Concentre ton coaching sur cette phase.`;
      }

      if (projectContext) {
        const { projectName, sector, startupStage, hasIdea, teamProfile, programName } = projectContext;
        if (projectName) contextAddition += `\n[IDEE_STARTUP] : ${projectName}`;
        if (sector) contextAddition += `\n[SECTEUR] : ${sector}`;
        if (startupStage) contextAddition += `\nStade : ${startupStage}`;
        if (programName) contextAddition += `\n[PROGRAMME_INCUBATION] : ${programName}`;
        if (teamProfile) contextAddition += `\n[PROFIL_EQUIPE] : ${teamProfile}`;
      }

      systemPrompt += contextAddition;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: analyzePdf ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...userMessages,
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
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("incubation-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
