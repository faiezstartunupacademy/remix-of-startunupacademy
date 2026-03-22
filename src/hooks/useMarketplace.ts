import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMarketplaceStartups = (filters?: {
  search?: string;
  stage?: string;
  sector?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["marketplace-startups", filters],
    queryFn: async () => {
      let query = supabase
        .from("marketplace_startups")
        .select("*")
        .eq("is_approved", true);

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%,sector.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }
      if (filters?.stage && filters.stage !== "all") {
        query = query.eq("stage", filters.stage);
      }
      if (filters?.sector && filters.sector !== "all") {
        query = query.eq("sector", filters.sector);
      }

      switch (filters?.sort) {
        case "newest": query = query.order("created_at", { ascending: false }); break;
        case "trending": query = query.order("views_count", { ascending: false }); break;
        default: query = query.order("votes_count", { ascending: false }); break;
      }

      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useStartupDetail = (slug: string) => {
  return useQuery({
    queryKey: ["marketplace-startup", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_startups")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useStartupFounders = (startupId: string) => {
  return useQuery({
    queryKey: ["marketplace-founders", startupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_founders")
        .select("*")
        .eq("startup_id", startupId);
      if (error) throw error;
      return data;
    },
    enabled: !!startupId,
  });
};

export const useStartupFunding = (startupId: string) => {
  return useQuery({
    queryKey: ["marketplace-funding", startupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_funding_rounds")
        .select("*")
        .eq("startup_id", startupId)
        .order("round_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!startupId,
  });
};

export const useStartupKpis = (startupId: string) => {
  return useQuery({
    queryKey: ["marketplace-kpis", startupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_kpis")
        .select("*")
        .eq("startup_id", startupId)
        .order("recorded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!startupId,
  });
};

export const useStartupComments = (startupId: string) => {
  return useQuery({
    queryKey: ["marketplace-comments", startupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_comments")
        .select("*")
        .eq("startup_id", startupId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!startupId,
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login required");

      // Check existing vote
      const { data: existing } = await supabase
        .from("marketplace_votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("startup_id", startupId)
        .maybeSingle();

      if (existing) {
        // Toggle off - remove vote
        const { error } = await supabase.from("marketplace_votes").delete().eq("id", existing.id);
        if (error) throw error;
        return "removed";
      } else {
        // New vote
        const { error } = await supabase
          .from("marketplace_votes")
          .insert({ user_id: user.id, startup_id: startupId, vote_type: 1 });
        if (error) throw error;
        return "voted";
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-startups"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-startup"] });
      const messages: Record<string, string> = {
        voted: "Vote enregistré !",
        removed: "Vote retiré !",
      };
      toast({ title: messages[result] });
    },
    onError: (err: Error) => {
      if (err.message === "Login required") {
        toast({ title: "Connexion requise", description: "Connectez-vous pour voter.", variant: "destructive" });
      }
    },
  });
};

// Keep old hook for backward compat
export const useUpvote = () => {
  const voteMutation = useVote();
  return {
    ...voteMutation,
    mutate: (startupId: string) => voteMutation.mutate(startupId),
  };
};

export const useMarketplaceEcosystems = () => {
  return useQuery({
    queryKey: ["marketplace-ecosystems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_ecosystems")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useUserBookmarks = () => {
  return useQuery({
    queryKey: ["marketplace-bookmarks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("marketplace_bookmarks")
        .select("*, marketplace_startups(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login required");

      const { data: existing } = await supabase
        .from("marketplace_bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("startup_id", startupId)
        .maybeSingle();

      if (existing) {
        await supabase.from("marketplace_bookmarks").delete().eq("id", existing.id);
        return "removed";
      } else {
        await supabase.from("marketplace_bookmarks").insert({ user_id: user.id, startup_id: startupId });
        return "added";
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-bookmarks"] });
      toast({ title: result === "added" ? "Startup sauvegardée" : "Retirée des favoris" });
    },
  });
};

export const useAllStartupsAdmin = () => {
  return useQuery({
    queryKey: ["marketplace-startups-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_startups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
