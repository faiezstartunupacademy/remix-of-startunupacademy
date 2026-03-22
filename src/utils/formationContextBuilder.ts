/**
 * Builds a condensed text summary from slide data arrays for use as AI context.
 * Keeps it under ~4000 chars to fit in system prompt.
 */
export function buildFormationContext(slides: any[]): string {
  const lines: string[] = [];

  for (const slide of slides) {
    const title = slide.title || slide.name || "";
    const module = slide.module || slide.category || "";
    const subtitle = slide.subtitle || "";
    const content = Array.isArray(slide.content)
      ? slide.content.join("; ")
      : typeof slide.content === "string"
      ? slide.content
      : "";
    const keyPoints = Array.isArray(slide.keyPoints)
      ? slide.keyPoints.join("; ")
      : "";

    let line = `[${module}] ${title}`;
    if (subtitle) line += ` — ${subtitle}`;
    if (content) line += `: ${content.slice(0, 200)}`;
    if (keyPoints) line += ` | Points: ${keyPoints.slice(0, 150)}`;
    lines.push(line);
  }

  const full = lines.join("\n");
  // Truncate if too long
  return full.length > 6000 ? full.slice(0, 6000) + "\n[...]" : full;
}
