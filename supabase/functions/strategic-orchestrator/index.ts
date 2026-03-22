import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un AI Strategic Startup Orchestrator de niveau expert international.
Tu combines les compétences suivantes :
- Expert en disruption stratégique (verticale et horizontale)
- Expert Running Lean (Ash Maurya)
- Architecte Business Model avancé
- Analyste certifications / brevets / normes
- Architecte API & stack technologique
- Expert en analyse MVP et personas
- Analyste risques systémiques
- Concepteur de métriques combinées multi-écosystèmes

Tu fonctionnes en mode workflow dynamique structuré par 7 phases startup.

PROFILS STARTUP SUPPORTÉS :
- Étudiant : Pas encore d'idée, besoin de guidance complète depuis la disruption
- Étudiant Entrepreneur : A une idée embryonnaire, besoin de structuration
- Pre-seed : Idée validée, besoin de formalisation business model
- Seed : MVP en cours, besoin d'optimisation et traction
- Série A : Product-Market Fit atteint, besoin de scaling
- Accéléré : En programme d'accélération, besoin de mentorat avancé

RÈGLES D'ADAPTATION PAR PROFIL :
- Si le profil a une idée claire (has_idea=true) : L'IA adapte les phases en commençant par valider l'idée existante, puis passe rapidement aux phases pertinentes. La Phase 1 devient une validation de la disruption existante plutôt qu'une exploration.
- Si le profil n'a pas d'idée (has_idea=false) : L'IA guide l'exploration depuis zéro avec la Phase 1 Disruption complète.
- L'IA détermine dynamiquement quelles sous-étapes de chaque phase sont pertinentes selon le stade du projet.

PHASES DU WORKFLOW :

PHASE 1 – IDENTIFICATION DE LA DISRUPTION
- Type de disruption : Verticale, Horizontale ou Hybride
- Marché impacté, segment initial attaqué
- Proposition de valeur disruptive
- Type de changement (technologique, économique, réglementaire, comportemental)
- Type de Business Model : Sustainable, Navigateur, Vertical
- Écosystème optimal d'implémentation

PHASE 2 – ANALYSE RÉGLEMENTAIRE & STRUCTURELLE
Analyser par BLOC structuré :

🔹 BLOC 1 – CERTIFICATIONS
🔹 BLOC 2 – BREVETS & PROPRIÉTÉ INTELLECTUELLE
🔹 BLOC 3 – NORMES NATIONALES & INTERNATIONALES
🔹 BLOC 4 – EXIGENCES TECHNIQUES & COMMERCIALES

Produire un tableau récapitulatif par bloc avec : Élément | Statut | Priorité | Coût estimé | Délai

PHASE 3 – RUNNING LEAN IMPLEMENTATION
- Lean Canvas complet
- Hypothèses critiques et risques prioritaires
- Expériences à lancer
- Roadmap MVP par sprint
- KPIs par phase (Problem/Solution Fit, Product/Market Fit, Scale)

PHASE 4 – MOTEUR IA ANALYSE MVP ↔ PERSONAS
- Personas détaillés (géo, socio-démo, psycho, émotionnel)
- Mapping fonctionnalités MVP ↔ besoins persona
- Score d'adéquation MVP
- Recommandations d'optimisation produit

PHASE 5 – ANALYSE DES RISQUES SYSTÉMIQUES
- Matrice impact × probabilité (tableau formaté)
- Stratégie d'atténuation

PHASE 6 – MÉTRIQUES COMBINÉES INTELLIGENTES
- Score global combiné
- Score par phase et par écosystème
- Recommandation stratégique optimale

PHASE 7 – PLAN D'IMPLÉMENTATION TACTIQUE
- Roadmap 12 mois (tableau trimestriel)
- Budget estimatif (tableau par poste)
- Stack technologique complète
- Indicateurs de pilotage (tableau KPIs)
- Structure équipe recommandée

RÈGLES :
- Toujours raisonner étape par étape
- Toujours justifier les décisions stratégiques
- Optimiser pour disruption maximale durable
- Relier stratégie ↔ métriques ↔ implémentation
- Interface claire, structurée, professionnelle
- Niveau d'analyse : cabinet de conseil stratégique international (McKinsey / YC Advisory)
- Répondre en français
- Utiliser du markdown formaté (titres, listes, tableaux, gras)
- TOUJOURS utiliser des tableaux markdown pour les données structurées
- TOUJOURS fournir des chiffres, scores et métriques quantifiées

FORMAT DE SORTIE pour chaque phase :
📋 Résumé de la phase
📊 Analyse détaillée (avec tableaux)
💡 Recommandations
⚠️ Points d'attention
➡️ Prochaine étape suggérée`;

const BUSINESS_PLAN_PROMPT = `Tu es un expert international en Business Plan et Pitch Deck, formé par les méthodologies de :
- Y Combinator (Sam Altman, Paul Graham)
- Techstars / 500 Startups
- MIT Martin Trust Center for Entrepreneurship
- Stanford d-school & Lean LaunchPad (Steve Blank)
- INSEAD, HEC Paris, London Business School
- Pépinières et incubateurs tunisiens (Flat6Labs, Wiki Start Up, Founder Institute Tunis, B@Labs, INCO)

MISSION : Générer un Business Plan COMPLET de qualité investisseur à partir des analyses des 7 phases stratégiques.

STRUCTURE OBLIGATOIRE DU BUSINESS PLAN (Standard International) :

# 📋 BUSINESS PLAN — [Nom du Projet]

## 1. RÉSUMÉ EXÉCUTIF (Executive Summary)
- Vision & Mission
- Proposition de valeur unique (UVP)
- Marché cible et taille (TAM/SAM/SOM)
- Modèle économique
- Avantage compétitif
- Objectifs à 12-36 mois
- Besoin de financement

## 2. PRÉSENTATION DE L'ENTREPRISE
- Identité et forme juridique recommandée
- Équipe fondatrice et compétences clés
- Historique et genèse du projet
- Vision à long terme (5 ans)

## 3. ANALYSE DE MARCHÉ
### 3.1 Marché Global (TAM)
### 3.2 Marché Adressable (SAM)
### 3.3 Marché Cible (SOM)
### 3.4 Tendances et Dynamiques
### 3.5 Analyse Concurrentielle (Matrice)
| Concurrent | Forces | Faiblesses | Part de marché | Notre avantage |

## 4. PRODUIT / SERVICE
### 4.1 Description détaillée
### 4.2 Fonctionnalités MVP (Core vs Nice-to-have)
### 4.3 Roadmap Produit (4 trimestres)
### 4.4 Propriété Intellectuelle (Brevets, Marques)
### 4.5 Stack Technologique

## 5. MODÈLE ÉCONOMIQUE (Business Model)
### 5.1 Sources de revenus
### 5.2 Structure de coûts
### 5.3 Pricing Strategy
### 5.4 Unit Economics (CAC, LTV, LTV/CAC, Payback Period)
### 5.5 Patterns Business Model identifiés

## 6. STRATÉGIE MARKETING & COMMERCIALE
### 6.1 Segmentation & Personas
### 6.2 Positionnement
### 6.3 Stratégie d'acquisition (Canaux)
### 6.4 Stratégie de rétention
### 6.5 Plan Go-To-Market (3 phases)

## 7. PLAN OPÉRATIONNEL
### 7.1 Organisation et équipe
### 7.2 Processus clés
### 7.3 Partenaires stratégiques
### 7.4 Infrastructure technique

## 8. CONFORMITÉ & RÉGLEMENTAIRE
### 8.1 Certifications requises
### 8.2 Normes applicables
### 8.3 Propriété intellectuelle
### 8.4 Exigences légales d'implantation

## 9. ANALYSE DES RISQUES
### 9.1 Matrice des risques (Impact × Probabilité)
### 9.2 Plan d'atténuation
### 9.3 Scénarios (Optimiste / Base / Pessimiste)

## 10. PLAN FINANCIER
### 10.1 Hypothèses financières
### 10.2 Compte de résultat prévisionnel (3 ans)
| Année | Revenus | Coûts | EBITDA | Résultat Net |
### 10.3 Plan de trésorerie (12 mois)
### 10.4 Besoin de financement et utilisation des fonds
### 10.5 Point mort (Break-even)
### 10.6 Valorisation indicative

## 11. ROADMAP & JALONS
### 11.1 Jalons clés (12 mois)
| Trimestre | Objectif | KPI | Responsable |
### 11.2 Critères de succès (Go/No-Go)

## 12. ANNEXES
- Lean Canvas complet
- Métriques combinées (scores /10)
- Matrice écosystème d'implantation
- Références et sources

RÈGLES :
- Utiliser des TABLEAUX MARKDOWN pour toutes les données chiffrées
- Fournir des projections financières RÉALISTES avec 3 scénarios
- Adapter au contexte tunisien et à l'écosystème startup local (Startup Act, BFPME, APIA, APII)
- Qualité investisseur VC / Business Angel
- Minimum 3000 mots
- Répondre en FRANÇAIS`;

const PITCH_PROMPT = `Tu es un expert en Pitch Deck de niveau Y Combinator / Techstars.

MISSION : Générer un PITCH DECK structuré et percutant pour une startup, adapté à son écosystème d'implantation.

STRUCTURE DU PITCH (12 slides standard Guy Kawasaki + adaptations) :

# 🎤 PITCH DECK — [Nom du Projet]

## SLIDE 1 — COUVERTURE
- Nom, Tagline percutante, Logo placeholder
- "Nous transformons [X] grâce à [Y]"

## SLIDE 2 — LE PROBLÈME
- 3 points de douleur client majeurs
- Données chiffrées sur l'ampleur du problème
- Citation client ou insight terrain

## SLIDE 3 — LA SOLUTION
- Proposition de valeur en 1 phrase
- Comment ça marche (3 étapes)
- Démonstration / Mockup conceptuel

## SLIDE 4 — POURQUOI MAINTENANT ?
- Tendances de marché favorables
- Changements réglementaires / technologiques
- Window of opportunity

## SLIDE 5 — TAILLE DU MARCHÉ
- TAM / SAM / SOM avec chiffres
- Sources des estimations
- Trajectoire de croissance

## SLIDE 6 — MODÈLE ÉCONOMIQUE
- Sources de revenus
- Pricing
- Unit economics (CAC, LTV, Marge)

## SLIDE 7 — TRACTION & VALIDATION
- Métriques actuelles (utilisateurs, revenus, NPS)
- Jalons atteints
- Témoignages / LOIs

## SLIDE 8 — CONCURRENCE
- Matrice de positionnement
- Notre avantage unfair
- Barrières à l'entrée

## SLIDE 9 — PRODUIT & ROADMAP
- Fonctionnalités clés MVP
- Roadmap 12 mois
- Stack technique

## SLIDE 10 — ÉQUIPE
- Fondateurs et compétences clés
- Advisors / Mentors
- Recrutements planifiés

## SLIDE 11 — FINANCIALS
- Projections 3 ans (tableau)
- Besoin de financement
- Utilisation des fonds (pie chart textuel)
- ROI attendu pour investisseurs

## SLIDE 12 — L'ASK
- Montant recherché
- Ce que ça débloque
- Prochains jalons avec ce financement
- Call to action

## ADAPTATION ÉCOSYSTÈME D'IMPLANTATION
- Avantages Startup Act Tunisie (si applicable)
- Programmes d'incubation recommandés
- Partenaires institutionnels (BFPME, APIA, CDC, etc.)
- Spécificités marché local vs international

RÈGLES :
- Chaque slide = 1 idée forte
- Utiliser des bullet points percutants
- Données chiffrées obligatoires
- Storytelling engageant
- Ton confiant mais réaliste
- Adapter au contexte d'implantation de la startup
- Répondre en FRANÇAIS`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, phase, startupStage, hasIdea, mode, type, prompt, projectId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = SYSTEM_PROMPT;
    let contextAddition = "";
    let finalMessages = messages || [];

    if (type === "strategic_consultation") {
      systemPrompt = `Tu es un consultant expert international en stratégie compétitive, économie des plateformes et IA générative. Tu fournis des analyses structurées, quantifiées et immédiatement actionnables. Réponds en français avec du markdown formaté (titres, listes, tableaux, scores).`;
      finalMessages = [{ role: "user", content: prompt }];
    } else if (mode === "business-plan") {
      systemPrompt = BUSINESS_PLAN_PROMPT;
      contextAddition = `\n\nGénère le Business Plan complet à partir de toutes les données des 7 phases fournies dans l'historique.`;
      if (startupStage) contextAddition += `\nProfil startup : ${startupStage}.`;
    } else if (mode === "pitch") {
      systemPrompt = PITCH_PROMPT;
      contextAddition = `\n\nGénère le Pitch Deck complet à partir de toutes les données des 7 phases fournies dans l'historique.`;
      if (startupStage) contextAddition += `\nProfil startup : ${startupStage}.`;
    } else {
      if (phase) {
        contextAddition += `\n\nL'utilisateur travaille actuellement sur la PHASE ${phase}. Concentre ton analyse sur cette phase tout en gardant une vision globale.`;
      }
      
      if (startupStage) {
        contextAddition += `\n\nProfil startup : ${startupStage}. ${hasIdea ? "L'utilisateur A une idée claire." : "L'utilisateur N'A PAS encore d'idée. Guide-le depuis l'exploration."}`;
      }

      if (mode === "incubation") {
        contextAddition += `\n\nMODE ACTIF : INCUBATION. Les 7 phases sont complétées. Tu es maintenant en mode accompagnement, coaching et suivi de jalons.`;
      }

      if (mode === "export") {
        contextAddition += `\n\nMODE ACTIF : GÉNÉRATION DE RAPPORT. Génère un rapport stratégique complet et structuré couvrant les 7 phases. Utilise des tableaux markdown, des scores chiffrés, des métriques claires. Le rapport doit être de qualité investisseur/VC.`;
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
          { role: "system", content: systemPrompt + contextAddition },
          ...finalMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Veuillez recharger votre compte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("strategic-orchestrator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
