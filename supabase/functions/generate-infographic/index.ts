import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formationName, keyPoints, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let prompt = "";

    if (type === "infographic") {
      prompt = `Create a beautiful, professional infographic summary for the training course "${formationName}". 
      
The infographic should include these key points arranged in a visually appealing layout:
${keyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Design guidelines:
- Use a modern, clean design with a professional color palette (deep blues, teals, and gold accents)
- Include icons or visual symbols for each key point
- Add the title "${formationName}" prominently at the top
- Include "STARTUNUP Academy" branding at the bottom
- Use a vertical layout suitable for download
- Make text large and readable
- Use visual hierarchy with numbered sections
- Add connecting lines or flow arrows between related concepts
- Professional quality suitable for printing`;
    } else if (type === "mindmap") {
      prompt = `Create a highly detailed, scientific-quality mind map diagram for "${formationName}".

The mind map should connect these key concepts and formations:
${keyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Design guidelines:
- Central node with "${formationName}" as the main topic
- Branch out with clear hierarchical structure  
- Use color-coded branches for different concept categories
- Include connection lines between related concepts across branches
- Add brief explanations for each node
- Use a clean, academic/scientific visual style
- Professional typography
- Include "STARTUNUP Academy" watermark
- White/light background for clarity
- Make it look like a professional academic reference chart
- Show methodology connections between different concepts`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI image generation error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur de génération d'image" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || "";
    const images = data.choices?.[0]?.message?.images || [];

    return new Response(JSON.stringify({ 
      text: textContent,
      images: images.map((img: any) => img.image_url?.url || ""),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-infographic error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
