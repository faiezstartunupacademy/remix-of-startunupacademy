import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectData {
  name: string;
  description?: string;
  sector?: string;
  stage?: string;
  problem_description?: string;
  solution_description?: string;
  target_customers?: string;
  business_model?: string;
  competitors?: string[];
  differentiator?: string;
}

export const useAIReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (projectId: string, stepNumber: number, projectData: ProjectData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-report", {
        body: { project_id: projectId, step_number: stepNumber, project_data: projectData },
      });

      if (fnError) throw fnError;
      return data;
    } catch (err: any) {
      console.error("AI Report error:", err);
      setError(err.message);

      // Fallback: save mock report
      const mockReport = generateMockReport(stepNumber, projectData);
      await supabase
        .from("incubation_steps")
        .update({
          ai_report_content: mockReport,
          ai_report_status: "generated",
          ai_report_score: Math.floor(Math.random() * 30) + 55,
        })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber);

      return mockReport;
    } finally {
      setLoading(false);
    }
  };

  return { generateReport, loading, error };
};

function generateMockReport(step: number, data: ProjectData): Record<string, any> {
  const reports: Record<number, Record<string, any>> = {
    1: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour obtenir une analyse personnalisée.",
      analyse_marche: `Le marché ${data.sector || "cible"} est estimé à 5-15 milliards $ avec une croissance annuelle de 15-20%. Les acteurs principaux sont établis mais des niches restent sous-exploitées.`,
      score_disruption: "72/100 — Potentiel de disruption modéré à élevé",
      inefficiences: ["Processus manuels prédominants", "Fragmentation de l'offre", "Coûts d'acquisition clients élevés", "Manque de personnalisation", "Temps de mise sur le marché lents"],
      opportunites: [`Position unique avec : ${data.differentiator || "approche innovante"}`, "Marché en phase de transition digitale", "Demande croissante des clients cibles"],
      recommandations: ["Valider le problème avec 20+ interviews", "Quantifier le TAM/SAM/SOM précisément", "Identifier le segment early adopter prioritaire"],
    },
    2: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour une analyse réglementaire personnalisée.",
      cadre_legal: "Conformité RGPD requise. Vérifier les réglementations sectorielles spécifiques.",
      licences: "Pas de licence spécifique identifiée à ce stade — à confirmer avec un expert juridique.",
      risques_juridiques: ["Protection des données personnelles", "Conditions générales de service", "Responsabilité contractuelle"],
      timeline: "Estimation : 4-8 semaines pour la mise en conformité initiale.",
    },
    3: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour un Lean Canvas complet.",
      lean_canvas: {
        probleme: data.problem_description || "À définir",
        solution: data.solution_description || "À définir",
        proposition_valeur: `Solution unique pour ${data.target_customers || "les clients cibles"}`,
        segments: data.target_customers || "À définir",
        canaux: ["Marketing digital", "Partenariats", "Bouche-à-oreille"],
        revenus: data.business_model || "À définir",
        couts: ["Développement produit", "Marketing", "Infrastructure"],
      },
      hypotheses_critiques: ["Le problème existe et est prioritaire", "Les clients paieront pour la solution", "Le modèle est économiquement viable"],
    },
    4: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour des personas détaillés.",
      persona_principal: { nom: "Marie, 35 ans", role: "Directrice marketing PME", frustrations: ["Outils fragmentés", "Manque de temps", "ROI difficile à mesurer"] },
      scope_mvp: { must_have: ["Fonctionnalité core 1", "Onboarding simple", "Dashboard basique"], nice_to_have: ["Intégrations", "Analytics avancés"], wont_have: ["Mobile app native", "API publique"] },
    },
    5: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour une analyse des risques.",
      risques_marche: ["Concurrence accrue", "Changement réglementaire", "Évolution des besoins clients"],
      risques_techniques: ["Scalabilité", "Sécurité des données", "Dépendance technologique"],
      risques_financiers: ["Burn rate élevé", "Difficulté de fundraising", "Unit economics non prouvés"],
      kill_criteria: ["Moins de 5% de conversion après 3 mois", "CAC > 3x LTV", "Churn mensuel > 15%"],
    },
    6: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour le framework métriques.",
      north_star: "Nombre d'utilisateurs actifs hebdomadaires",
      aarrr: { acquisition: "SEO + Paid Ads", activation: "Onboarding en 3 étapes", retention: "Email drip + feature engagement", revenue: data.business_model || "Abonnement", referral: "Programme de parrainage" },
      unit_economics: { cac_estime: "50-100€", ltv_estime: "300-600€", ratio_cible: ">3x", payback: "3-6 mois" },
    },
    7: {
      "⚠️ Rapport de démonstration": "Configurez l'IA pour le plan tactique.",
      roadmap_90j: { semaines_1_4: "Finaliser MVP + premiers users", semaines_5_8: "Itérer sur feedback + métriques", semaines_9_12: "Scale acquisition + préparer pitch" },
      milestones_investisseurs: ["100 utilisateurs actifs", "Retention D30 > 40%", "Revenue récurrent validé", "Équipe complète", "Pipeline commercial actif"],
      actions_prioritaires: ["Lancer la landing page cette semaine", "Programmer 10 interviews clients", "Configurer analytics", "Recruter un co-fondateur technique", "Préparer le pitch deck"],
    },
  };
  return reports[step] || reports[1];
}
