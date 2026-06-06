import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  productStageToCapitalStage,
  type CapitalStage,
} from "@/utils/stageTaxonomy";

export type ProjectSource = "incubation" | "mvp" | "strategic";

export interface ProjectContext {
  projectId: string;
  source: ProjectSource;
  name: string;
  sector?: string | null;
  /** Product stage taxonomy ("idee" | "prototype" | "mvp" | "traction") OR
   *  legacy incubation stage ("ideation" | "prototype" | "mvp" | "traction" | "growth"). */
  productStage?: string | null;
  capitalStage: CapitalStage;
  governorate?: string | null;
  bmValidated: boolean;
  mvpScore?: number | null;
  updatedAt: string;
}

interface State {
  loading: boolean;
  projects: ProjectContext[];
  active: ProjectContext | null;
  setActiveId: (id: string) => void;
  refresh: () => Promise<void>;
}

function normalizeIncubationStage(s?: string | null): string | null {
  if (!s) return null;
  // legacy "ideation" -> "idee"
  if (s === "ideation") return "idee";
  if (s === "growth") return "traction";
  return s;
}

let cached: ProjectContext[] | null = null;
let cachedUser: string | null = null;

export function useProjectContext(): State {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectContext[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("activeProjectId")
      : null
  );

  async function load() {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    if (cached && cachedUser === u.user.id) {
      setProjects(cached);
      setLoading(false);
      return;
    }
    const [{ data: inc }, { data: mvp }, { data: strat }] = await Promise.all([
      supabase
        .from("incubation_projects")
        .select("id,name,sector,stage,governorate,updated_at,current_step,overall_progress")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("mvp_validator_projects")
        .select("id,name,sector,product_stage,governorate,updated_at,scenario")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("strategic_projects")
        .select("id,name,sector,startup_stage,current_phase,updated_at,completed_at")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false }),
    ]);

    const list: ProjectContext[] = [];

    (inc || []).forEach((p: any) => {
      const ps = normalizeIncubationStage(p.stage);
      list.push({
        projectId: p.id,
        source: "incubation",
        name: p.name,
        sector: p.sector,
        productStage: ps,
        capitalStage: productStageToCapitalStage(ps),
        governorate: p.governorate,
        bmValidated: (p.current_step || 0) >= 3,
        mvpScore: null,
        updatedAt: p.updated_at,
      });
    });
    (mvp || []).forEach((p: any) => {
      list.push({
        projectId: p.id,
        source: "mvp",
        name: p.name,
        sector: p.sector,
        productStage: p.product_stage,
        capitalStage: productStageToCapitalStage(p.product_stage),
        governorate: p.governorate,
        bmValidated: p.scenario === "B",
        mvpScore: null,
        updatedAt: p.updated_at,
      });
    });
    (strat || []).forEach((p: any) => {
      list.push({
        projectId: p.id,
        source: "strategic",
        name: p.name,
        sector: p.sector,
        productStage: null,
        capitalStage: (p.startup_stage as CapitalStage) || "pre-seed",
        governorate: null,
        bmValidated: (p.current_phase || 0) >= 3 || !!p.completed_at,
        mvpScore: null,
        updatedAt: p.updated_at,
      });
    });

    list.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    cached = list;
    cachedUser = u.user.id;
    setProjects(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const active =
    projects.find((p) => p.projectId === activeId) || projects[0] || null;

  function setActiveId(id: string) {
    setActiveIdState(id);
    try {
      localStorage.setItem("activeProjectId", id);
    } catch {}
  }

  return {
    loading,
    projects,
    active,
    setActiveId,
    refresh: async () => {
      cached = null;
      await load();
    },
  };
}
