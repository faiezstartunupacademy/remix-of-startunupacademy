import { SlideData } from "@/components/formation/EnhancedSlidePresentation";

/**
 * Maps complex slide content objects to the flat SlideData format
 * used by EnhancedSlidePresentation
 */
export function mapComplexSlide(slide: {
  id: number;
  title: string;
  subtitle?: string;
  module?: string;
  category?: string;
  type: string;
  content: any;
  color?: string;
  image?: string;
  icon?: string;
  source?: string;
  keyPoints?: string[];
  exercise?: string;
  quote?: { text: string; author: string };
}): SlideData {
  const content: string[] = [];
  const keyPoints: string[] = [];
  const tools: string[] = [];
  const examples: string[] = [];
  const tips: string[] = [];
  let quote: { text: string; author: string } | undefined;

  const c = slide.content;

  if (typeof c === "string") {
    content.push(c);
  } else if (Array.isArray(c)) {
    content.push(...c);
  } else if (c && typeof c === "object") {
    if (c.definition) content.push(c.definition);
    if (c.keyPoints) keyPoints.push(...c.keyPoints);
    if (c.tools) tools.push(...c.tools);
    if (c.metrics) keyPoints.push(...c.metrics);
    if (c.tips) tips.push(...c.tips);

    if (c.steps) {
      c.steps.forEach((s: any) => {
        content.push(`**${s.step}** — ${s.description}`);
      });
    }

    if (c.table) {
      const headers = c.table.headers?.join(" | ") || "";
      if (headers) content.push(`| ${headers} |`);
      c.table.rows?.forEach((row: string[]) => {
        content.push(`| ${row.join(" | ")} |`);
      });
    }

    if (c.caseStudy) {
      const cs = c.caseStudy;
      examples.push(
        `**${cs.name || cs.company || "Cas"}**: ${cs.context || cs.challenge || ""} → ${cs.lesson || cs.result || cs.solution || ""}`
      );
    }

    if (c.framework) {
      content.push(`**${c.framework.name || c.framework.title || "Framework"}**`);
      const elements = c.framework.elements || [];
      elements.forEach((el: any) => {
        keyPoints.push(`${el.name || el.label}: ${el.description}`);
      });
    }

    if (c.quote) {
      if (typeof c.quote === "string") {
        quote = { text: c.quote, author: "" };
      } else {
        quote = { text: c.quote.text, author: c.quote.author || "" };
      }
    }

    if (c.comparison) {
      if (Array.isArray(c.comparison)) {
        c.comparison.forEach((item: any) => {
          content.push(`Avant: ${item.before} → Après: ${item.after} (Pivot: ${item.pivot})`);
        });
      } else {
        if (c.comparison.left) content.push(`Avant: ${c.comparison.left.join(", ")}`);
        if (c.comparison.right) content.push(`Après: ${c.comparison.right.join(", ")}`);
      }
    }

    if (c.examples) {
      c.examples.forEach((ex: any) => {
        examples.push(`**${ex.name}**: ${ex.tactic || ""} → ${ex.result || ""}`);
      });
    }

    if (c.videoRef) {
      content.push(`🎥 ${c.videoRef.title} (${c.videoRef.source})`);
    }

    if (c.pivotType) {
      content.push(`**${c.pivotType.name}**: ${c.pivotType.description}`);
      if (c.pivotType.example) examples.push(c.pivotType.example);
    }
  }

  // Handle top-level fields
  if (slide.keyPoints && keyPoints.length === 0) {
    keyPoints.push(...slide.keyPoints);
  }
  if (slide.exercise) {
    content.push(`📝 Exercice: ${slide.exercise}`);
  }
  if (slide.quote && !quote) {
    quote = slide.quote;
  }

  // Map type names
  const typeMap: Record<string, string> = {
    intro: "intro",
    concept: "concept",
    framework: "framework",
    "case-study": "case-study",
    cas: "case-study",
    tool: "content",
    tools: "content",
    outil: "content",
    processus: "content",
    méthode: "content",
    tactic: "content",
    exercise: "exercise",
    exercice: "exercise",
    recap: "summary",
    summary: "summary",
    content: "content",
    example: "case-study",
    quote: "content",
    video: "content",
  };

  return {
    id: slide.id,
    module: slide.module || slide.category || "Module",
    title: slide.title,
    subtitle: slide.subtitle,
    content: content.length > 0 ? content : [""],
    keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
    tools: tools.length > 0 ? tools : undefined,
    examples: examples.length > 0 ? examples : undefined,
    tips: tips.length > 0 ? tips : undefined,
    quote,
    type: typeMap[slide.type] || "content",
    image: slide.image,
  };
}
