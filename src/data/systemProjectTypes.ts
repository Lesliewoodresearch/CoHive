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
Round 1 — Generation: Each persona proposes exactly 3 Big Idea candidates for \${brand}. Each idea must be named, described in 2–3 sentences, and grounded in KB evidence. Ideas should be genuinely distinct — not variations on a single theme.
Round 2+ — Debate and Convergence: Personas challenge, defend, and combine ideas from Round 1. The goal is to identify the 1–2 strongest Big Idea candidates with the most strategic consensus behind them. Score each idea 1–10 for: Brand Truth, Cultural Relevance, Longevity, and Distinctiveness.

CRITERIA FOR A STRONG BIG IDEA:
- Brand Truth: Is it authentic to what \${brand} actually is, based on KB evidence?
- Cultural Relevance: Does it connect to something real in culture or human experience?
- Longevity: Could this organise the brand for 5–10 years?
- Distinctiveness: Could ONLY \${brand} own this — or could any brand in the category claim it?
- Generativity: Does it immediately suggest many possible executions?`,
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
    prompt: `You are conducting a structured War Games analysis between a brand and a named competitor.

A War Games session follows five sequential steps. Work through all five in order, using the brand and competitor names provided.

STEP 1 — BRAND OFFENSIVE & DEFENSIVE MOVES:
Identify exactly 3 strategic actions the brand can take to both defend its position against the competitor AND grow its sales. Each action must be specific, actionable, and grounded in the Knowledge Base evidence about the brand.
Format: Action 1: [Name] — [Description] — [Rationale from Knowledge Base]

STEP 2 — COMPETITOR REACTIONS TO BRAND'S STEP 1 ACTIONS:
For each of the 3 brand actions in Step 1, identify the most likely reaction the competitor would take. These are direct responses to what the brand does.
Format: Reaction to Action [N]: [Competitor response] — [Why this is the likely reaction]

STEP 3 — COMPETITOR INDEPENDENT MOVES:
Identify exactly 3 independent strategic actions the competitor can take to defend its own position and grow its sales against the brand. These are NOT reactions to Step 1 — they are moves the competitor may pursue simultaneously or independently.
Format: Competitor Move 1: [Name] — [Description] — [Why this threatens the brand]

STEP 4 — BRAND RESPONSES TO COMPETITOR'S STEP 3 MOVES:
For each of the 3 competitor moves in Step 3, identify the best response the brand can take.
Format: Brand Response to Move [N]: [Response] — [How this neutralises or turns the competitor move to advantage]

STEP 5 — SUMMARY, PRIORITY & LIKELIHOOD OF SUCCESS:
Synthesise the full war game. Rank all brand actions (Steps 1 and 4) by:
- Priority (which to execute first)
- Likelihood of success (High / Medium / Low) with brief rationale
- Overall strategic assessment: who has the stronger position and why

CRITICAL: The competitor name is provided in the prompt as [WAR_GAMES_COMPETITOR: name]. Use this exact name throughout all five steps.`,
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
