import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RoleType = "startuper" | "mentor" | "investor" | "incubator";

export const ROLE_LABELS: Record<RoleType, string> = {
  startuper: "Startuper",
  mentor: "Mentor",
  investor: "Investisseur",
  incubator: "Incubateur",
};

export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  startuper: "Pilotez votre projet : roadmap, formations, milestones, financement.",
  mentor: "Accompagnez des startups : sessions, agenda, revenus, avis.",
  investor: "Sourcing, pipeline deals, watchlist et NDAs.",
  incubator: "Cohortes, candidatures programmes et analytics.",
};

const LS_KEY = "mc_active_role";

interface RoleRow {
  role_type: RoleType;
  is_primary: boolean;
  activated_at: string;
}

export const useUserRoles = (userId: string | null) => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [activeRole, setActiveRoleState] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setRoles([]);
      setActiveRoleState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("user_role_types" as any)
      .select("role_type, is_primary, activated_at")
      .eq("user_id", userId);
    const list = ((data as any) || []) as RoleRow[];
    setRoles(list);
    const stored = typeof window !== "undefined" ? (localStorage.getItem(LS_KEY) as RoleType | null) : null;
    const fallback = list.find(r => r.is_primary)?.role_type || list[0]?.role_type || null;
    const chosen = stored && list.some(r => r.role_type === stored) ? stored : fallback;
    setActiveRoleState(chosen);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const setActiveRole = useCallback(async (role: RoleType) => {
    setActiveRoleState(role);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, role);
    if (userId) {
      await supabase.from("profiles").update({ role_type: role as any }).eq("user_id", userId);
    }
  }, [userId]);

  const addRole = useCallback(async (role: RoleType) => {
    if (!userId) return;
    const { error } = await supabase
      .from("user_role_types" as any)
      .insert({ user_id: userId, role_type: role, is_primary: roles.length === 0 });
    if (!error) await load();
    return error;
  }, [userId, roles.length, load]);

  const removeRole = useCallback(async (role: RoleType) => {
    if (!userId) return;
    const row = roles.find(r => r.role_type === role);
    if (row?.is_primary && roles.length > 1) {
      // promote another role to primary first
      const next = roles.find(r => r.role_type !== role);
      if (next) {
        await supabase.from("user_role_types" as any).update({ is_primary: true })
          .eq("user_id", userId).eq("role_type", next.role_type);
      }
    }
    await supabase.from("user_role_types" as any).delete()
      .eq("user_id", userId).eq("role_type", role);
    if (activeRole === role) {
      const fallback = roles.find(r => r.role_type !== role)?.role_type || null;
      if (fallback) await setActiveRole(fallback);
    }
    await load();
  }, [userId, roles, activeRole, setActiveRole, load]);

  const setPrimary = useCallback(async (role: RoleType) => {
    if (!userId) return;
    await supabase.from("user_role_types" as any).update({ is_primary: false }).eq("user_id", userId);
    await supabase.from("user_role_types" as any).update({ is_primary: true })
      .eq("user_id", userId).eq("role_type", role);
    await load();
  }, [userId, load]);

  return { roles, activeRole, setActiveRole, addRole, removeRole, setPrimary, loading, reload: load };
};
