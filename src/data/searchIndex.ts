// Centralized search index for the entire platform
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'slide' | 'formation' | 'ecosysteme' | 'outil' | 'glossaire' | 'concept';
  categoryLabel: string;
  module?: string;
  formation?: string;
  href: string;
  keywords: string[];
}

// Slide-based imports
import { fondementsSlidesData, businessGrowthSlidesData, metricsSlidesData } from './designThinkingSlidesData';
import { studentStartupLabSlidesData } from './studentStartupLabSlidesData';
import { LEAN_CANVAS_SLIDES } from './leanCanvasSlidesData';
import { growthHackingSlides } from './growthHackingSlidesData';
import { MARKETING_SLIDES } from './startupMarketingSlidesData';
import { platformStrategySlidesData } from './platformStrategySlidesData';
import { ENTREPRENEURIAT_DURABLE_SLIDES } from './entrepreneuriatDurableSlidesData';
import { BMI_SLIDES } from './businessModelInnovationSlidesData';
import { LEAN_STARTUP_SLIDES } from './leanStartupSlidesData';
import { OMC_SLIDES } from './operatingModelCanvasSlidesData';
import { effectuationSlidesData } from './effectuationSlidesData';
import { BMC_SLIDES } from './bmcGuideSlidesData';
import { greenBMSlides } from './greenBMSlides';
import { montageModules } from './startupMontageSlidesData';
import { startupProgramSlidesData } from './startupProgramSlidesData';
import { LICORNE_OPERATING_SLIDES } from './licorneOperatingSlidesData';

// Tools & concepts imports
import { designThinkingTools } from './designThinkingToolsData';
import { leanCanvasTools } from './leanCanvasToolsData';
import { BM_PATTERNS } from './businessModelPatterns';
import { MENTAL_MODELS } from './mentalModelsData';
import { greenActors } from './greenEcosystemData';
import { glossaryTerms } from './glossaryData';

// Slide-based data sources (generic format: { title, subtitle?, content: string[], module?, keyPoints?, tools? })
const slideSources: { slides: any[]; formation: string; href: string }[] = [
  { slides: fondementsSlidesData, formation: 'Design Thinking - Fondements', href: '/formation/design-thinking' },
  { slides: businessGrowthSlidesData, formation: 'Design Thinking - Growth', href: '/formation/design-thinking' },
  { slides: metricsSlidesData, formation: 'Design Thinking - Metrics', href: '/formation/design-thinking' },
  { slides: studentStartupLabSlidesData, formation: 'Student Startup Lab', href: '/startups' },
  { slides: LEAN_CANVAS_SLIDES, formation: 'Lean Canvas', href: '/formation/lean-canvas' },
  { slides: growthHackingSlides, formation: 'Growth Hacking', href: '/formation/growth-hacking' },
  { slides: MARKETING_SLIDES, formation: 'Marketing Startups', href: '/formation/startup-marketing' },
  { slides: platformStrategySlidesData, formation: 'Platform Strategy', href: '/formation/platform-strategy' },
  { slides: ENTREPRENEURIAT_DURABLE_SLIDES, formation: 'Entrepreneuriat Durable', href: '/formation/business-model' },
  { slides: BMI_SLIDES, formation: 'Business Model Innovation', href: '/formation/business-model' },
  { slides: LEAN_STARTUP_SLIDES, formation: 'Lean Startup', href: '/startups' },
  { slides: OMC_SLIDES, formation: 'Operating Model Canvas', href: '/formation/operating-model' },
  { slides: effectuationSlidesData, formation: 'Effectuation', href: '/fondements/effectuation' },
  { slides: startupProgramSlidesData, formation: 'Startup Program Design', href: '/ecosysteme' },
];

// Slides with non-standard content format
const specialSlideSources = {
  bmcSlides: BMC_SLIDES,
  greenBM: greenBMSlides,
  licorne: LICORNE_OPERATING_SLIDES,
  montage: montageModules,
};

// Formations
const formations: SearchResult[] = [
  { id: 'f-dt', title: 'Design Thinking', description: 'Approche centrée utilisateur pour l\'innovation', category: 'formation', categoryLabel: 'Formation', href: '/formation/design-thinking', keywords: ['design thinking', 'empathie', 'prototypage', 'innovation'] },
  { id: 'f-lc', title: 'Lean Canvas', description: 'Méthodologie Running Lean pour startups', category: 'formation', categoryLabel: 'Formation', href: '/formation/lean-canvas', keywords: ['lean canvas', 'ash maurya', 'running lean'] },
  { id: 'f-gh', title: 'Growth Hacking', description: '8 semaines pour doubler vos prospects', category: 'formation', categoryLabel: 'Formation', href: '/formation/growth-hacking', keywords: ['growth hacking', 'traction', 'bullseye'] },
  { id: 'f-bm', title: 'Business Model', description: 'Patterns et modèles économiques durables', category: 'formation', categoryLabel: 'Formation', href: '/formation/business-model', keywords: ['business model', 'bmc', 'canvas'] },
  { id: 'f-sm', title: 'Marketing Startups', description: 'Positionnement, PLG, Traction & Copywriting', category: 'formation', categoryLabel: 'Formation', href: '/formation/startup-marketing', keywords: ['marketing', 'startup', 'positionnement', 'copywriting'] },
  { id: 'f-om', title: 'Operating Model', description: 'Framework POLISM pour l\'excellence opérationnelle', category: 'formation', categoryLabel: 'Formation', href: '/formation/operating-model', keywords: ['operating model', 'polism', 'opérationnel'] },
  { id: 'f-ps', title: 'Platform Strategy', description: 'Économie des plateformes et effets de réseau', category: 'formation', categoryLabel: 'Formation', href: '/formation/platform-strategy', keywords: ['plateforme', 'réseau', 'écosystème'] },
  { id: 'f-mm', title: 'Mental Models', description: 'Super Thinking: modèles mentaux', category: 'formation', categoryLabel: 'Formation', href: '/formation/mental-models', keywords: ['mental models', 'super thinking', 'modèles mentaux'] },
  { id: 'f-cr', title: 'Croissance & Métriques', description: '86 métriques, KPIs et calculateurs', category: 'formation', categoryLabel: 'Formation', href: '/formation/croissance', keywords: ['métriques', 'kpi', 'croissance', 'cac', 'ltv'] },
  { id: 'f-bc', title: 'BMC vs Lean Canvas', description: 'Analyse comparative des deux méthodologies', category: 'formation', categoryLabel: 'Formation', href: '/formation/bm-comparison', keywords: ['bmc', 'lean canvas', 'comparaison'] },
  { id: 'f-cc', title: 'C-CHIEF Leadership', description: 'Tableau périodique des rôles C-Suite', category: 'formation', categoryLabel: 'Formation', href: '/c-chief', keywords: ['c-suite', 'leadership', 'ceo', 'cto', 'cfo'] },
  { id: 'f-sl', title: 'Student Startup Lab', description: 'Discipline Entrepreneuriale', category: 'formation', categoryLabel: 'Formation', href: '/startups', keywords: ['startup lab', 'entrepreneuriat', 'étudiants'] },
  { id: 'f-ef', title: 'Effectuation', description: 'Saras Sarasvathy - Entrepreneuriat', category: 'formation', categoryLabel: 'Formation', href: '/fondements/effectuation', keywords: ['effectuation', 'sarasvathy', 'bird in hand'] },
  { id: 'f-mt', title: 'Montage des Startups', description: 'De l\'idée au lancement', category: 'formation', categoryLabel: 'Formation', href: '/formation/startup-montage', keywords: ['montage', 'startup', 'lancement'] },
  { id: 'f-lo', title: 'Operating Model des Licornes', description: 'Marketing des licornes françaises', category: 'formation', categoryLabel: 'Formation', href: '/formation/operating-model', keywords: ['licorne', 'marketing', 'alan', 'payfit', 'contentsquare'] },
  { id: 'f-gbm', title: 'Entrepreneuriat Vert', description: 'Innovation durable et business models verts', category: 'formation', categoryLabel: 'Formation', href: '/formation/business-model', keywords: ['vert', 'durable', 'green', 'environnement', 'ecologie'] },
  { id: 'f-bmc', title: 'Guide BMC Pratique', description: 'Business Model Canvas - Sophie Racquez', category: 'formation', categoryLabel: 'Formation', href: '/formation/business-model', keywords: ['bmc', 'business model canvas', 'racquez'] },
  { id: 'f-sp', title: 'Startup Program Design', description: 'Concevoir des accélérateurs et incubateurs', category: 'formation', categoryLabel: 'Formation', href: '/ecosysteme', keywords: ['accélérateur', 'incubateur', 'programme', 'startup'] },
];

// Ecosystem actors
const ecosystemActors: SearchResult[] = [
  { id: 'e-1', title: 'Expensya', description: 'FinTech - Gestion des notes de frais', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['expensya', 'fintech', 'notes de frais'] },
  { id: 'e-2', title: 'InstaDeep', description: 'IA et Deep Learning', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['instadeep', 'ia', 'deep learning', 'biontech'] },
  { id: 'e-3', title: 'Djagora', description: 'Foundation & Écosystème Startup', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['djagora', 'foundation', 'écosystème'] },
  { id: 'e-4', title: 'Smart Capital', description: 'Fonds d\'investissement startup', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['smart capital', 'investissement', 'fonds'] },
  { id: 'e-5', title: 'Startup Act Tunisie', description: 'Loi n° 2018-20 pour les startups', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['startup act', 'loi', 'tunisie', 'label'] },
  { id: 'e-6', title: 'APII', description: 'Agence de Promotion de l\'Industrie et de l\'Innovation', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['apii', 'agence', 'industrie', 'innovation'] },
  { id: 'e-7', title: 'Gomycode', description: 'EdTech - Formation en développement', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['gomycode', 'edtech', 'formation', 'développement'] },
  { id: 'e-8', title: 'Wattnow', description: 'CleanTech - Gestion énergétique', category: 'ecosysteme', categoryLabel: 'Écosystème', href: '/ecosysteme', keywords: ['wattnow', 'cleantech', 'énergie'] },
];

// Helper: safely extract array of strings from any content field
function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
  if (typeof val === 'string') return [val];
  if (val && typeof val === 'object') {
    // Handle BMC-style content objects with keyPoints, definition, etc.
    const obj = val as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof obj.definition === 'string') parts.push(obj.definition);
    if (Array.isArray(obj.keyPoints)) parts.push(...obj.keyPoints.filter((v): v is string => typeof v === 'string'));
    if (Array.isArray(obj.tips)) parts.push(...obj.tips.filter((v): v is string => typeof v === 'string'));
    if (typeof obj.quote === 'string') parts.push(obj.quote);
    return parts;
  }
  return [];
}

// Build the full search index
let _searchIndex: SearchResult[] | null = null;

export function getSearchIndex(): SearchResult[] {
  if (_searchIndex) return _searchIndex;

  const results: SearchResult[] = [...formations, ...ecosystemActors];

  // Index standard slides
  for (const source of slideSources) {
    for (const slide of source.slides) {
      results.push({
        id: `s-${source.formation}-${slide.id}`,
        title: slide.title,
        description: slide.subtitle || toStringArray(slide.content)[0] || '',
        category: 'slide',
        categoryLabel: 'Slide',
        module: slide.module,
        formation: source.formation,
        href: source.href,
        keywords: [
          slide.title?.toLowerCase(),
          slide.subtitle?.toLowerCase(),
          ...toStringArray(slide.content).map((c: string) => c.toLowerCase()),
          ...(Array.isArray(slide.keyPoints) ? slide.keyPoints : []).map((k: string) => k.toLowerCase()),
          ...(Array.isArray(slide.tools) ? slide.tools : []).map((t: string) => t.toLowerCase()),
          source.formation.toLowerCase(),
          slide.module?.toLowerCase(),
        ].filter(Boolean),
      });
    }
  }

  // Index BMC slides (content is an object)
  for (const slide of specialSlideSources.bmcSlides) {
    results.push({
      id: `s-bmc-${slide.id}`,
      title: slide.title,
      description: slide.content?.definition || '',
      category: 'slide',
      categoryLabel: 'Slide',
      module: slide.module,
      formation: 'Guide BMC Pratique',
      href: '/formation/business-model',
      keywords: [
        slide.title?.toLowerCase(),
        slide.module?.toLowerCase(),
        ...toStringArray(slide.content).map(c => c.toLowerCase()),
        'bmc', 'business model canvas',
      ].filter(Boolean),
    });
  }

  // Index Green BM slides (content is a string)
  for (const slide of specialSlideSources.greenBM) {
    results.push({
      id: `s-green-${slide.id}`,
      title: slide.title,
      description: typeof slide.content === 'string' ? slide.content.slice(0, 120) : '',
      category: 'slide',
      categoryLabel: 'Slide',
      module: slide.module,
      formation: 'Entrepreneuriat Vert',
      href: '/formation/business-model',
      keywords: [
        slide.title?.toLowerCase(),
        slide.module?.toLowerCase(),
        ...(typeof slide.content === 'string' ? [slide.content.toLowerCase()] : []),
        ...(Array.isArray(slide.keyPoints) ? slide.keyPoints.map((k: string) => k.toLowerCase()) : []),
        'vert', 'durable', 'green',
      ].filter(Boolean),
    });
  }

  // Index Licorne Operating slides (content is a string)
  for (const slide of specialSlideSources.licorne) {
    results.push({
      id: `s-licorne-${slide.id}`,
      title: slide.title,
      description: slide.subtitle || '',
      category: 'slide',
      categoryLabel: 'Slide',
      module: slide.category,
      formation: 'Operating Model Licornes',
      href: '/formation/operating-model',
      keywords: [
        slide.title?.toLowerCase(),
        slide.subtitle?.toLowerCase(),
        ...(typeof slide.content === 'string' ? [slide.content.toLowerCase()] : []),
        ...(Array.isArray(slide.keyPoints) ? slide.keyPoints.map((k: string) => k.toLowerCase()) : []),
        'licorne', 'marketing',
      ].filter(Boolean),
    });
  }

  // Index Montage modules and their slides
  for (const mod of specialSlideSources.montage) {
    for (const slide of mod.slides) {
      results.push({
        id: `s-montage-${slide.id}`,
        title: slide.title,
        description: typeof slide.content === 'string' ? slide.content.slice(0, 120) : '',
        category: 'slide',
        categoryLabel: 'Slide',
        module: mod.title,
        formation: 'Montage des Startups',
        href: '/formation/startup-montage',
        keywords: [
          slide.title?.toLowerCase(),
          mod.title?.toLowerCase(),
          ...(typeof slide.content === 'string' ? [slide.content.toLowerCase()] : []),
          ...(Array.isArray(slide.bulletPoints) ? slide.bulletPoints.map((b: string) => b.toLowerCase()) : []),
          'montage', 'startup',
        ].filter(Boolean),
      });
    }
  }

  // Index Design Thinking tools (48 tools)
  for (const tool of designThinkingTools) {
    results.push({
      id: `t-dt-${tool.id}`,
      title: tool.name,
      description: tool.description,
      category: 'outil',
      categoryLabel: 'Outil DT',
      module: tool.category,
      formation: 'Design Thinking',
      href: '/formation/design-thinking',
      keywords: [
        tool.name.toLowerCase(),
        tool.symbol.toLowerCase(),
        tool.description.toLowerCase(),
        tool.category,
        'design thinking', 'outil',
      ].filter(Boolean),
    });
  }

  // Index Lean Canvas tools
  for (const tool of leanCanvasTools) {
    results.push({
      id: `t-lc-${tool.id}`,
      title: tool.name,
      description: tool.description,
      category: 'outil',
      categoryLabel: 'Outil LC',
      module: tool.category,
      formation: 'Lean Canvas',
      href: '/formation/lean-canvas',
      keywords: [
        tool.name.toLowerCase(),
        tool.symbol.toLowerCase(),
        tool.description.toLowerCase(),
        tool.category,
        tool.axis.toLowerCase(),
        'lean canvas', 'outil',
      ].filter(Boolean),
    });
  }

  // Index Business Model Patterns (60 patterns)
  for (const pattern of BM_PATTERNS) {
    results.push({
      id: `c-bm-${pattern.number}`,
      title: pattern.name,
      description: pattern.idea,
      category: 'concept',
      categoryLabel: 'Pattern BM',
      formation: 'Business Model',
      href: '/formation/business-model',
      keywords: [
        pattern.name.toLowerCase(),
        pattern.symbol.toLowerCase(),
        pattern.idea.toLowerCase(),
        'business model', 'pattern',
      ].filter(Boolean),
    });
  }

  // Index Mental Models
  for (const model of MENTAL_MODELS) {
    results.push({
      id: `c-mm-${model.id}`,
      title: model.name,
      description: model.definition,
      category: 'concept',
      categoryLabel: 'Mental Model',
      module: model.category,
      formation: 'Mental Models',
      href: '/formation/mental-models',
      keywords: [
        model.name.toLowerCase(),
        model.definition.toLowerCase(),
        model.example.toLowerCase(),
        model.category,
        'mental model', 'super thinking',
      ].filter(Boolean),
    });
  }

  // Index Green Ecosystem actors
  for (const actor of greenActors) {
    results.push({
      id: `e-green-${actor.id}`,
      title: actor.name,
      description: actor.description,
      category: 'ecosysteme',
      categoryLabel: 'Écosystème Vert',
      module: actor.sector,
      href: '/ecosysteme',
      keywords: [
        actor.name.toLowerCase(),
        actor.description.toLowerCase(),
        actor.sector.toLowerCase(),
        actor.category,
        actor.location.toLowerCase(),
        'green', 'vert', 'écosystème',
      ].filter(Boolean),
    });
  }

  // Index Glossary terms
  for (const term of glossaryTerms) {
    results.push({
      id: `g-${term.term.toLowerCase().replace(/\s+/g, '-')}`,
      title: term.term,
      description: term.definition,
      category: 'glossaire',
      categoryLabel: 'Glossaire',
      module: term.category,
      href: '/startups',
      keywords: [
        term.term.toLowerCase(),
        term.definition.toLowerCase(),
        term.category.toLowerCase(),
        term.details.toLowerCase(),
        term.example.toLowerCase(),
        'glossaire',
      ].filter(Boolean),
    });
  }

  _searchIndex = results;
  return results;
}

export function searchContent(query: string, category?: string): SearchResult[] {
  const index = getSearchIndex();
  const q = query.toLowerCase().trim();
  if (!q) return category ? index.filter(r => r.category === category) : [];

  const terms = q.split(/\s+/);
  
  let results = index.filter(item => {
    const searchable = [
      item.title.toLowerCase(),
      item.description.toLowerCase(),
      item.module?.toLowerCase() || '',
      item.formation?.toLowerCase() || '',
      ...item.keywords,
    ].join(' ');
    
    return terms.every(term => searchable.includes(term));
  });

  if (category) {
    results = results.filter(r => r.category === category);
  }

  // Score and sort: exact title match first
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
    const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
    return aTitle - bTitle;
  });

  return results.slice(0, 50);
}
