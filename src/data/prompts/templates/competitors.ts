/**
 * Competitors Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The base persona layer (anti-sycophancy, round structure, role clarity)
 * is injected at runtime by run.js via buildPersonaBaseLayer().
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('competitors').
 * Supports both Standard and War Games project types via ConditionalPart.
 */

import { PromptTemplate, TextPart, DynamicPart, ConditionalPart } from '../core';
import { BaseParts } from '../base-parts';

export const CompetitorsPrompts = {

  /**
   * Execute — Standard competitive analysis
   */
  execute: new PromptTemplate({
    id: 'competitors_execute',
    hexId: 'Competitors',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COMPETITORS — COMPETITIVE ANALYSIS ==='
      }),

      new ConditionalPart(
        'war_games_purpose',
        ctx => ctx.projectType === 'War Games',
        new TextPart('war_games_purpose_text', {
          en: `**Session Purpose — War Games Mode:**
You are war-gaming competitive scenarios for this brand — modelling what competitors would actually do, identifying strategic vulnerabilities, and generating offensive and defensive options.

The goal is not an academic competitive audit but a realistic simulation of competitive dynamics: what moves are available, what the costs and benefits are, and what the brand should do before competitors force its hand.`
        }),
        new TextPart('standard_purpose_text', {
          en: `**Session Purpose — Competitive Analysis:**
You are conducting a rigorous competitive assessment — evaluating the brand's positioning, identifying where it is genuinely differentiated and where it is exposed, and recommending how to strengthen its competitive position.

The goal is an honest view of competitive reality, not confirmation of the brand's preferred narrative about itself.`
        })
      ),

      new ConditionalPart(
        'war_games_style',
        ctx => ctx.projectType === 'War Games',
        new TextPart('war_games_style_text', {
          en: `**How You Engage — War Games:**
- Think like the adversary, not the brand — model what competitors would actually do, not what the brand hopes they would do
- Be precise about competitive moves: timing, resources required, likely outcomes
- Challenge optimistic assumptions about competitive moats with specific counter-evidence
- No complimenting other analysts — challenge each other's scenario assumptions`
        }),
        new TextPart('standard_style_text', {
          en: `**How You Engage — Standard Analysis:**
- Be analytically rigorous about competitive positioning — avoid confirming the brand's self-perception
- Name specific competitive threats, not generic ones
- Challenge claims about differentiation with evidence of what competitors are actually doing
- No complimenting other analysts unless a specific point is worth extending`
        })
      ),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new DynamicPart('competitor_context', (ctx) => {
        const parts: string[] = [];
        if (ctx.selectedCompetitor) parts.push(`Competitor: ${ctx.selectedCompetitor}`);
        if (ctx.competitorAnalysisType && ctx.projectType !== 'War Games') {
          parts.push(`Analysis Type: ${ctx.competitorAnalysisType}`);
        }
        return parts.join('\n');
      }),

      new ConditionalPart(
        'war_games_approach',
        ctx => ctx.projectType === 'War Games',
        new TextPart('war_games_approach_text', {
          en: `**War Games Approach — Follow This Sequence:**
1. Map the competitive scenario: what position each player holds and what moves are available
2. Model the most likely competitive responses to the brand's stated strategy — be adversarial, not diplomatic
3. Identify the 2-3 moves that would hurt the brand most if a competitor made them
4. Evaluate the brand's defensive options and their realistic costs
5. Generate offensive scenarios where the brand can move first before competitors respond
6. In debate rounds: challenge each other's scenario assumptions with competitive evidence from the KB`
        }),
        new TextPart('standard_approach_text', {
          en: `**Competitive Analysis Approach — Follow This Sequence:**
1. Map the competitive landscape as it actually exists — not as the brand's strategy assumes it does
2. Identify where the brand is genuinely differentiated vs where it is imitable or exposed
3. Model likely competitive responses to the brand's strategy with KB evidence
4. Surface at least one competitive threat the current strategy has underestimated
5. Identify the 1-2 competitive moves that would most damage the brand's position
6. In debate rounds: challenge each other's competitive assessments with specific market evidence`
        })
      ),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Execute — Assess mode
   */
  executeAssess: new PromptTemplate({
    id: 'competitors_execute_assess',
    hexId: 'Competitors',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COMPETITORS — COMPETITIVE ASSESSMENT ==='
      }),

      new ConditionalPart(
        'mode_purpose',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_purpose', {
          en: `**Session Purpose — War Games Assessment:**
Assess the current competitive scenario: who holds what position, what moves are available, and where the brand is most exposed.`
        }),
        new TextPart('std_purpose', {
          en: `**Session Purpose — Competitive Assessment:**
Evaluate the brand's competitive position rigorously — where it stands relative to competitors and where it is genuinely at risk.`
        })
      ),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new DynamicPart('competitor_context', (ctx) => {
        const parts: string[] = [];
        if (ctx.selectedCompetitor) parts.push(`Competitor: ${ctx.selectedCompetitor}`);
        if (ctx.competitorAnalysisType && ctx.projectType !== 'War Games') {
          parts.push(`Analysis Type: ${ctx.competitorAnalysisType}`);
        }
        return parts.join('\n');
      }),

      new ConditionalPart(
        'mode_instructions',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_instructions', {
          en: `**War Games Assessment Instructions:**
- Assess current competitive positioning and scenario dynamics
- Identify strategic vulnerabilities and strengths with KB evidence
- Map available moves for each competitor
- Flag the highest-risk competitive scenario for the brand`
        }),
        new TextPart('std_instructions', {
          en: `**Competitive Assessment Instructions:**
- Evaluate competitive positioning and market share dynamics
- Assess competitive strengths and weaknesses with KB evidence
- Identify threats and opportunities the brand has not adequately addressed
- Benchmark the brand's position against industry standards`
        })
      ),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Execute — Recommend mode
   */
  executeRecommend: new PromptTemplate({
    id: 'competitors_execute_recommend',
    hexId: 'Competitors',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COMPETITORS — COMPETITIVE RECOMMENDATIONS ==='
      }),

      new ConditionalPart(
        'mode_purpose',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_purpose', {
          en: `**Session Purpose — War Games Recommendations:**
Generate specific strategic options — offensive moves the brand can make, defensive positions it should hold, and scenarios it should be prepared to respond to.`
        }),
        new TextPart('std_purpose', {
          en: `**Session Purpose — Competitive Recommendations:**
Generate specific recommendations for strengthening the brand's competitive position — grounded in evidence of what competitors are actually doing and where the brand has genuine advantages to build on.`
        })
      ),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new DynamicPart('competitor_context', (ctx) => {
        return ctx.selectedCompetitor ? `Competitor: ${ctx.selectedCompetitor}` : '';
      }),

      new ConditionalPart(
        'mode_recommendations',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_recommendations', {
          en: `**War Games Recommendation Focus:**
- Counter-strategy options with realistic risk/reward analysis
- Offensive moves the brand should make before competitors do
- Defensive positions the brand must hold and the cost of holding them
- Contingency strategies for the 2-3 most likely competitive scenarios
- Specific triggers that should prompt the brand to change strategy`
        }),
        new TextPart('std_recommendations', {
          en: `**Competitive Recommendation Focus:**
- Positioning and differentiation strategies grounded in genuine competitive advantage
- Market response recommendations for the most likely competitive moves
- Partnership or alliance opportunities that would strengthen competitive position
- Areas where the brand should stop competing and redirect resources
- Timeline and sequencing for competitive strategy execution`
        })
      ),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Execute — Unified mode
   */
  executeUnified: new PromptTemplate({
    id: 'competitors_execute_unified',
    hexId: 'Competitors',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COMPETITORS — UNIFIED COMPETITIVE ANALYSIS ==='
      }),

      new ConditionalPart(
        'mode_purpose',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_purpose', {
          en: `**Session Purpose — War Games Unified:**
Conduct a full war games analysis — assessing the competitive scenario and generating a complete set of strategic options the brand can act on.`
        }),
        new TextPart('std_purpose', {
          en: `**Session Purpose — Unified Competitive Analysis:**
Conduct a full competitive review — assessing the brand's position and generating specific recommendations for how to compete more effectively.`
        })
      ),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new DynamicPart('competitor_context', (ctx) => {
        const parts: string[] = [];
        if (ctx.selectedCompetitor) parts.push(`Competitor: ${ctx.selectedCompetitor}`);
        if (ctx.competitorAnalysisType && ctx.projectType !== 'War Games') {
          parts.push(`Analysis Type: ${ctx.competitorAnalysisType}`);
        }
        return parts.join('\n');
      }),

      new ConditionalPart(
        'unified_instructions',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_unified', {
          en: `**War Games Unified Approach:**
1. SCENARIO ASSESSMENT: Map current positions, available moves, and the brand's most significant vulnerabilities
2. STRATEGIC OPTIONS: Generate offensive, defensive, and contingency strategies with realistic costs and outcomes
3. SYNTHESIS: Prioritise options by strategic impact and feasibility, name the single most important decision`
        }),
        new TextPart('std_unified', {
          en: `**Competitive Analysis Unified Approach:**
1. COMPETITIVE ASSESSMENT: Evaluate market positioning, strengths/weaknesses, and threat landscape with KB evidence
2. STRATEGIC RECOMMENDATIONS: Generate positioning, differentiation, and response strategies grounded in competitive reality
3. SYNTHESIS: Prioritise by competitive impact, name the single most important competitive move the brand must make`
        })
      ),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Save
   */
  save: new PromptTemplate({
    id: 'competitors_save',
    hexId: 'Competitors',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE COMPETITIVE ANALYSIS ==='
      }),

      BaseParts.projectContext,
      BaseParts.chainContext,

      new ConditionalPart(
        'save_format',
        ctx => ctx.projectType === 'War Games',
        new TextPart('wg_save', {
          en: `Generate a War Games Competitive Analysis Report:
- Executive Summary: Key strategic scenarios and recommended responses
- Competitive Scenario Map: Current positions and available moves
- Threat Assessment: Highest-risk competitive scenarios with KB evidence
- Strategic Options: Offensive, defensive, and contingency strategies with rationale
- Risk Analysis: Costs and probabilities for each scenario
- Decision Framework: What triggers should prompt strategy changes
- Recommended Actions: Prioritised by strategic impact

Format as a structured markdown document suitable for senior leadership.`
        }),
        new TextPart('std_save', {
          en: `Generate a Competitive Analysis Report:
- Executive Summary: Most important competitive findings and strategic implications
- Competitive Landscape: Market positioning, share dynamics, and key players
- Brand Competitive Position: Genuine strengths, real vulnerabilities, and differentiation assessment
- Competitive Threat Analysis: Specific threats ranked by likelihood and impact
- Strategic Recommendations: Prioritised by competitive impact with KB citations
- Execution Roadmap: Sequenced actions with timelines

Format as a structured markdown document suitable for strategy teams.`
        })
      )
    ]
  }),

  /**
   * Download
   */
  download: new PromptTemplate({
    id: 'competitors_download',
    hexId: 'Competitors',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT COMPETITIVE ANALYSIS DATA ==='
      }),

      BaseParts.projectContext,

      new DynamicPart('export_data', (ctx) => {
        const isWarGames = ctx.projectType === 'War Games';
        return `Generate a complete downloadable export of this Competitive Analysis session:

Metadata:
- Date, project, brand, competitor: ${ctx.selectedCompetitor || 'Not specified'}
- Analysis type: ${isWarGames ? 'War Games' : ctx.competitorAnalysisType || 'Standard'}
- KB files analysed: ${ctx.selectedFiles?.join(', ') || 'None'}

Content:
- ${isWarGames ? 'War Games scenario analysis and strategic options' : 'Full competitive landscape assessment'}
- Complete recommendation set with rationale and KB citations
- Competitive position analysis
- Risk assessment

Format as structured JSON with all fields populated.`;
      })
    ]
  })
};
