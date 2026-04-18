/**
 * System Project Types
 * 
 * Default project types with custom AI prompts shipped with CoHive.
 * These are read-only and automatically available to all users.
 * Users can create additional custom project types with unique names.
 * 
 * Location: /data/systemProjectTypes.ts
 */

export interface SystemProjectType {
  projectType: string;
  prompt: string;
  isSystem: true;
}

export const systemProjectTypes: SystemProjectType[] = [
  {
    projectType: 'Creative Messaging',
    prompt: `You are analyzing creative messaging campaigns. Focus on:
- Message clarity and resonance with target audience
- Target audience alignment and relevance
- Brand voice consistency and authenticity
- Emotional impact and memorability
- Call-to-action effectiveness and persuasiveness
- Differentiation from competitor messaging
- Cultural relevance and appropriateness`,
    isSystem: true,
  },
  {
    projectType: 'Product Launch',
    prompt: `You are evaluating product launch strategies. Consider:
- Market readiness and optimal timing
- Competitive positioning and unique value proposition
- Launch messaging and communication channels
- Success metrics and KPIs for measurement
- Risk mitigation strategies and contingency plans
- Target audience segmentation and prioritization
- Go-to-market timeline and phasing`,
    isSystem: true,
  },
  {
    projectType: 'War Games',
    prompt: `You are conducting competitive war games analysis. Analyze:
- Competitor strengths and weaknesses
- Market positioning opportunities and threats
- Strategic advantages and vulnerabilities
- Response scenarios and tactical options
- Resource allocation recommendations
- Defensive and offensive strategies
- Market share implications and projections`,
    isSystem: true,
  },
  {
    projectType: 'Packaging',
    prompt: `You are assessing packaging design and strategy. Evaluate:
- Visual appeal and shelf presence
- Functional design and usability
- Brand identity alignment and recognition
- Sustainability considerations and environmental impact
- Consumer perception and appeal
- Retail environment optimization
- Cost-effectiveness and scalability`,
    isSystem: true,
  },
  {
    projectType: 'Brand Strategy',
    prompt: `You are analyzing brand strategy initiatives. Focus on:
- Brand positioning and differentiation
- Target audience definition and insights
- Brand architecture and portfolio strategy
- Brand equity and value proposition
- Competitive landscape and white space opportunities
- Brand extensions and growth strategies
- Long-term brand vision and roadmap`,
    isSystem: true,
  },
  {
    projectType: 'Big Idea',
    prompt: `THE TASK: Generate and debate central brand ideas — the single unifying thought that defines how this brand shows up in the world.

WHAT A BIG IDEA IS:
A Big Idea is the central organising thought for a brand — not a campaign, not a tagline, not a product feature. It is the one idea that:
- Defines what the brand uniquely stands for in culture
- Is true to the brand's authentic positioning and KB evidence
- Can generate countless executions across channels, years, and contexts
- Is simple enough to say in one sentence, profound enough to sustain a brand for a decade
- Creates immediate recognition — people instantly understand why THIS brand and no other could own it

WHAT A BIG IDEA IS NOT:
- A campaign idea or seasonal activation
- A product benefit or functional claim
- A tagline (though a tagline may express it)
- A visual identity direction
- A mission statement or values list

HOW THIS SESSION WORKS:
Round 1 — Generation: Each persona proposes exactly 3 Big Idea candidates for ${brand}. Each idea must be named, described in 2–3 sentences, and grounded in KB evidence. Ideas should be genuinely distinct — not variations on a single theme.
Round 2+ — Debate and Convergence: Personas challenge, defend, and combine ideas from Round 1. The goal is to identify the 1–2 strongest Big Idea candidates with the most strategic consensus behind them. Score each idea 1–10 for: Brand Truth, Cultural Relevance, Longevity, and Distinctiveness.

CRITERIA FOR A STRONG BIG IDEA:
- Brand Truth: Is it authentic to what ${brand} actually is, based on KB evidence?
- Cultural Relevance: Does it connect to something real in culture or human experience?
- Longevity: Could this organise the brand for 5–10 years?
- Distinctiveness: Could ONLY ${brand} own this — or could any brand in the category claim it?
- Generativity: Does it immediately suggest many possible executions?`,
    isSystem: true,
  },
  {
    projectType: 'Unique Assets',
    prompt: `You are analyzing unique brand assets and distinctive elements. Consider:
- Visual and verbal brand identity distinctiveness
- Ownable assets and signature elements
- Consistency across brand touchpoints
- Recognition and recall strength
- Competitive differentiation value
- Asset equity and cultural relevance
- Protection and trademark considerations`,
    isSystem: true,
  },
  {
    projectType: 'How Do We Say and Do Things that Make Us Unique',
    prompt: `You are analyzing brand expression and unique communication approaches. Focus on:
- Distinctive brand voice and tone characteristics
- Unique brand behaviors and actions
- Signature brand experiences and rituals
- Ownable communication patterns and styles
- Brand personality manifestation across touchpoints
- Differentiation in customer interactions
- Consistency of unique expression system-wide`,
    isSystem: true,
  },
];

/**
 * Get all system project type names (for validation)
 */
export function getSystemProjectTypeNames(): string[] {
  return systemProjectTypes.map(pt => pt.projectType);
}

/**
 * Check if a project type name is a system type
 */
export function isSystemProjectType(projectTypeName: string): boolean {
  return systemProjectTypes.some(
    pt => pt.projectType.toLowerCase() === projectTypeName.toLowerCase()
  );
}

/**
 * Get prompt for a system project type
 */
export function getSystemProjectTypePrompt(projectTypeName: string): string | null {
  const found = systemProjectTypes.find(
    pt => pt.projectType.toLowerCase() === projectTypeName.toLowerCase()
  );
  return found ? found.prompt : null;
}
