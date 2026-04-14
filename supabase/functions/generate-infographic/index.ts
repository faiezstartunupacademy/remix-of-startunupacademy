import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type VisualType = "infographic" | "mindmap";

const FALLBACK_MESSAGES: Record<string, string> = {
  credits_exhausted:
    "Crédits IA insuffisants. Une version de secours a été générée localement. Rechargez vos crédits dans Settings → Workspace → Usage pour retrouver la génération IA complète.",
  rate_limited:
    "La génération IA est temporairement limitée. Une version de secours a été générée localement.",
  ai_unavailable:
    "Le service IA est momentanément indisponible. Une version de secours a été générée localement.",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeKeyPoints(keyPoints: unknown) {
  if (!Array.isArray(keyPoints)) return [] as string[];

  return keyPoints
    .map((point) => (typeof point === "string" ? point.replace(/\s+/g, " ").trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function renderLines(lines: string[], x: number, y: number, lineHeight: number, options?: {
  anchor?: "start" | "middle" | "end";
  fill?: string;
  fontSize?: number;
  fontWeight?: number | string;
}) {
  const anchor = options?.anchor ?? "start";
  const fill = options?.fill ?? "#16324f";
  const fontSize = options?.fontSize ?? 26;
  const fontWeight = options?.fontWeight ?? 500;

  return lines
    .map(
      (line, index) => `<text x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" font-family="Inter, Arial, sans-serif">${escapeXml(line)}</text>`,
    )
    .join("");
}

function toDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildInfographicSvg(formationName: string, keyPoints: string[]) {
  const safePoints = keyPoints.length > 0
    ? keyPoints
    : [
        "Vue d'ensemble de la formation",
        "Concepts clés à retenir",
        "Applications concrètes",
        "Prochaines actions recommandées",
      ];

  const cards = safePoints.slice(0, 8).map((point, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = column === 0 ? 70 : 635;
    const y = 280 + row * 280;
    const lines = wrapText(point, 28).slice(0, 4);

    return `
      <g>
        <rect x="${x}" y="${y}" rx="28" ry="28" width="495" height="220" fill="rgba(255,255,255,0.92)" stroke="#8ab6c9" stroke-width="2" />
        <circle cx="${x + 48}" cy="${y + 48}" r="26" fill="#0f766e" />
        <text x="${x + 48}" y="${y + 56}" text-anchor="middle" fill="#ffffff" font-size="26" font-weight="700" font-family="Inter, Arial, sans-serif">${index + 1}</text>
        ${renderLines(lines, x + 95, y + 70, 34, { fontSize: 26, fontWeight: 600 })}
      </g>
    `;
  }).join("");

  const titleLines = wrapText(formationName, 24).slice(0, 2);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#effcf9" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1600" fill="url(#bg)" />
      <circle cx="150" cy="150" r="120" fill="rgba(15,118,110,0.08)" />
      <circle cx="1040" cy="180" r="160" fill="rgba(14,116,144,0.10)" />
      <rect x="60" y="60" width="1080" height="1480" rx="44" fill="rgba(255,255,255,0.52)" stroke="rgba(15,118,110,0.15)" />
      <text x="110" y="132" fill="#0f172a" font-size="30" font-weight="700" font-family="Inter, Arial, sans-serif">STARTUNUP Academy</text>
      ${renderLines(titleLines, 110, 210, 58, { fontSize: 48, fontWeight: 800 })}
      <text x="110" y="320" fill="#155e75" font-size="28" font-weight="500" font-family="Inter, Arial, sans-serif">Synthèse visuelle générée localement</text>
      ${cards}
      <text x="110" y="1500" fill="#155e75" font-size="24" font-weight="500" font-family="Inter, Arial, sans-serif">Version de secours — rechargez vos crédits IA pour une génération illustrée avancée.</text>
    </svg>
  `;
}

function buildMindmapSvg(formationName: string, keyPoints: string[]) {
  const safePoints = keyPoints.length > 0
    ? keyPoints
    : [
        "Concept principal",
        "Bloc stratégique",
        "Test terrain",
        "Action prioritaire",
      ];

  const nodes = [
    { x: 700, y: 135 },
    { x: 1085, y: 245 },
    { x: 1180, y: 500 },
    { x: 1085, y: 755 },
    { x: 700, y: 865 },
    { x: 315, y: 755 },
    { x: 220, y: 500 },
    { x: 315, y: 245 },
  ];

  const titleLines = wrapText(formationName, 16).slice(0, 3);
  const pointGroups = safePoints.slice(0, 8).map((point, index) => {
    const node = nodes[index];
    const lines = wrapText(point, 22).slice(0, 4);

    return `
      <g>
        <line x1="700" y1="500" x2="${node.x}" y2="${node.y}" stroke="#0f766e" stroke-width="4" stroke-linecap="round" opacity="0.55" />
        <rect x="${node.x - 130}" y="${node.y - 70}" rx="30" ry="30" width="260" height="140" fill="rgba(255,255,255,0.96)" stroke="#8ab6c9" stroke-width="2" />
        ${renderLines(lines, node.x, node.y - 18, 30, { anchor: "middle", fontSize: 22, fontWeight: 600 })}
      </g>
    `;
  }).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1000" viewBox="0 0 1400 1000">
      <defs>
        <linearGradient id="mindmapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f0fdfa" />
          <stop offset="100%" stop-color="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="1400" height="1000" fill="url(#mindmapBg)" />
      <circle cx="160" cy="160" r="120" fill="rgba(15,118,110,0.08)" />
      <circle cx="1235" cy="160" r="120" fill="rgba(14,116,144,0.10)" />
      <text x="80" y="90" fill="#0f172a" font-size="30" font-weight="700" font-family="Inter, Arial, sans-serif">STARTUNUP Academy</text>
      <circle cx="700" cy="500" r="170" fill="#0f766e" />
      <circle cx="700" cy="500" r="155" fill="rgba(255,255,255,0.16)" />
      ${renderLines(titleLines, 700, 470, 42, { anchor: "middle", fill: "#ffffff", fontSize: 34, fontWeight: 700 })}
      ${pointGroups}
      <text x="700" y="955" text-anchor="middle" fill="#155e75" font-size="24" font-weight="500" font-family="Inter, Arial, sans-serif">Version de secours — rechargez vos crédits IA pour une carte mentale enrichie.</text>
    </svg>
  `;
}

function buildFallbackVisual(formationName: string, keyPoints: string[], type: VisualType, reason: keyof typeof FALLBACK_MESSAGES | string) {
  const message = FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.ai_unavailable;
  const svg = type === "mindmap"
    ? buildMindmapSvg(formationName, keyPoints)
    : buildInfographicSvg(formationName, keyPoints);

  return {
    text: message,
    message,
    images: [toDataUrl(svg)],
    fallback: true,
    source: "fallback" as const,
    reason,
    error: reason === "credits_exhausted" ? "Crédits IA insuffisants." : undefined,
  };
}

function extractTextContent(content: unknown) {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formationName, keyPoints, type } = await req.json();
    const visualType: VisualType = type === "mindmap" ? "mindmap" : "infographic";
    const safeFormationName = typeof formationName === "string" && formationName.trim().length > 0
      ? formationName.trim()
      : "Formation STARTUNUP";
    const safeKeyPoints = normalizeKeyPoints(keyPoints);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify(buildFallbackVisual(safeFormationName, safeKeyPoints, visualType, "ai_unavailable")), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let prompt = "";

    if (visualType === "infographic") {
      prompt = `Create a beautiful, professional infographic summary for the training course "${safeFormationName}". 
      
The infographic should include these key points arranged in a visually appealing layout:
${safeKeyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Design guidelines:
- Use a modern, clean design with a professional color palette (deep blues, teals, and gold accents)
- Include icons or visual symbols for each key point
- Add the title "${safeFormationName}" prominently at the top
- Include "STARTUNUP Academy" branding at the bottom
- Use a vertical layout suitable for download
- Make text large and readable
- Use visual hierarchy with numbered sections
- Add connecting lines or flow arrows between related concepts
- Professional quality suitable for printing`;
    } else if (visualType === "mindmap") {
      prompt = `Create a highly detailed, scientific-quality mind map diagram for "${safeFormationName}".

The mind map should connect these key concepts and formations:
${safeKeyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Design guidelines:
- Central node with "${safeFormationName}" as the main topic
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
      const t = await response.text();
      console.error("AI image generation error:", response.status, t);
      const reason = response.status === 402
        ? "credits_exhausted"
        : response.status === 429
          ? "rate_limited"
          : "ai_unavailable";
      return new Response(JSON.stringify(buildFallbackVisual(safeFormationName, safeKeyPoints, visualType, reason)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const textContent = extractTextContent(data.choices?.[0]?.message?.content);
    const images = data.choices?.[0]?.message?.images || [];

    if (!Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify(buildFallbackVisual(safeFormationName, safeKeyPoints, visualType, "ai_unavailable")), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      text: textContent,
      images: images.map((img: any) => img.image_url?.url || ""),
      fallback: false,
      source: "ai",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-infographic error:", e);
    return new Response(JSON.stringify(buildFallbackVisual("Formation STARTUNUP", [], "infographic", "ai_unavailable")), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
