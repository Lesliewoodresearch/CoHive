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
    projectType: 'Market Research',
    prompt: `You are evaluating market research findings. Consider:
- Consumer insights and behavioral patterns
- Market trends and emerging opportunities
- Segmentation and targeting strategies
- Competitive intelligence and benchmarking
- Purchase drivers and barriers
- Channel preferences and shopping behaviors
- Pricing sensitivity and value perception`,
    isSystem: true,
  },
  {
    projectType: 'Innovation Pipeline',
    prompt: `You are assessing innovation and new product development. Analyze:
- Innovation opportunity spaces and white space
- Consumer unmet needs and pain points
- Technology and trend convergence
- Prototype performance and concept testing results
- Feasibility and time-to-market considerations
- Innovation portfolio balance and prioritization
- Scale potential and commercialization strategy`,
    isSystem: true,
  },
  {
    projectType: 'Big Idea',
    prompt: `You are evaluating big ideas and core creative concepts. Focus on:
- Conceptual strength and originality
- Strategic alignment with brand positioning
- Cultural relevance and resonance
- Scalability across channels and touchpoints
- Memorability and distinctiveness
- Emotional connection and impact
- Long-term brand building potential`,
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
    projectType: 'Customer Experience',
    prompt: `You are assessing customer experience strategies. Evaluate:
- Customer journey mapping and touchpoints
- Pain points and friction areas
- Moments of truth and opportunities to delight
- Omnichannel consistency and integration
- Service design and operational excellence
- Personalization and relevance
- Customer feedback and satisfaction metrics`,
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
    projectType: 'Retail Strategy',
    prompt: `You are analyzing retail and distribution strategies. Focus on:
- Channel strategy and distribution mix
- Retail partner selection and relationships
- In-store execution and merchandising
- Shopper marketing and activation
- Trade terms and promotional strategy
- Retail media and co-marketing opportunities
- Point-of-sale optimization`,
    isSystem: true,
  },
  {
    projectType: 'Content Strategy',
    prompt: `You are evaluating content marketing strategies. Consider:
- Content themes and narrative architecture
- Audience needs and information seeking behaviors
- Content formats and distribution channels
- Editorial calendar and production workflow
- Influencer and partnership strategies
- Content performance and engagement metrics
- SEO optimization and discoverability`,
    isSystem: true,
  },
  {
    projectType: 'Crisis Management',
    prompt: `You are assessing crisis management and response strategies. Analyze:
- Risk identification and scenario planning
- Response protocols and decision frameworks
- Communication strategies and messaging
- Stakeholder management and prioritization
- Media relations and narrative control
- Recovery and reputation repair tactics
- Prevention and monitoring systems`,
    isSystem: true,
  },
  {
    projectType: 'Partnership Strategy',
    prompt: `You are evaluating partnership and collaboration strategies. Focus on:
- Strategic fit and value alignment
- Partnership structure and governance
- Co-creation and innovation opportunities
- Brand alignment and audience overlap
- Financial terms and value exchange
- Risk mitigation and exit strategies
- Integration and activation planning`,
    isSystem: true,
  },
  {
    projectType: 'Sustainability Initiative',
    prompt: `You are analyzing sustainability and ESG initiatives. Consider:
- Environmental impact and carbon footprint
- Sustainable sourcing and supply chain
- Circular economy and waste reduction
- Social responsibility and community impact
- Governance and ethical standards
- Consumer communication and transparency
- Business case and ROI considerations`,
    isSystem: true,
  },
  {
    projectType: 'Rebranding',
    prompt: `You are assessing rebranding and brand refresh initiatives. Evaluate:
- Rationale and strategic necessity
- Brand equity transfer and risk mitigation
- Visual identity and design system
- Naming and nomenclature strategy
- Stakeholder communication and change management
- Implementation timeline and phasing
- Success metrics and tracking framework`,
    isSystem: true,
  },
  {
    projectType: 'Market Entry',
    prompt: `You are evaluating market entry and expansion strategies. Analyze:
- Market attractiveness and opportunity sizing
- Competitive landscape and barriers to entry
- Entry mode and partnership strategy
- Localization and adaptation requirements
- Regulatory and compliance considerations
- Resource requirements and investment
- Risk assessment and mitigation plans`,
    isSystem: true,
  },
  {
    projectType: 'Customer Segmentation',
    prompt: `You are analyzing customer segmentation strategies. Focus on:
- Segmentation criteria and methodology
- Segment size and growth potential
- Behavioral and attitudinal differentiation
- Needs-based clustering and targeting
- Segment profitability and lifetime value
- Persona development and activation
- Measurement and validation approach`,
    isSystem: true,
  },
  {
    projectType: 'Brand Health Tracking',
    prompt: `You are evaluating brand health and performance tracking. Consider:
- Brand awareness and consideration metrics
- Brand associations and perceptions
- Competitive positioning and share of voice
- Purchase intent and loyalty indicators
- Brand equity trends and drivers
- Segmentation and cohort analysis
- Diagnostic insights and action planning`,
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
