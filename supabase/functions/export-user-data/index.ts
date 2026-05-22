import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const uid = user.id;
    const tables = [
      "profiles", "user_consents", "user_roles",
      "incubation_projects", "incubation_milestones", "incubation_activities",
      "mvp_validator_projects", "marketplace_startups", "marketplace_bookmarks",
      "marketplace_comments", "marketplace_messages", "forum_threads", "forum_posts",
      "mentoring_sessions", "startup_documents", "formation_participants",
      "formation_completions", "formation_evaluations", "account_deletion_requests",
    ];

    const exportData: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      user: { id: uid, email: user.email, created_at: user.created_at },
    };

    for (const table of tables) {
      const userIdCol = table === "marketplace_startups" ? "created_by" : table === "marketplace_messages" ? "sender_id" : "user_id";
      const { data } = await supabase.from(table).select("*").eq(userIdCol, uid);
      exportData[table] = data || [];
    }

    await supabase.from("data_access_log").insert({
      user_id: uid, accessed_by: uid, access_type: "export", resource_type: "all_user_data",
      user_agent: req.headers.get("user-agent"),
    });

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Content-Disposition": `attachment; filename="mes-donnees-${uid}.json"` },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
