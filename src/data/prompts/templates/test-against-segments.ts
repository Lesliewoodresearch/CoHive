/**
 * Test Against Segments Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The base persona layer (anti-sycophancy, round structure, role clarity)
 * is injected at runtime by run.js via buildPersonaBaseLayer().
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('test').
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const TestAgainstSegmentsPrompts = {

  /**
   * Execute — Assess mode
   */
  executeAssess: new PromptTemplate({
    id: 'test_segments_execute_assess',
    hexId: 'Test Against Segments',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== TEST AGAINST SEGMENTS — ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are testing the brand's strategy, messaging, or ideas against a specific market segment — evaluating whether it holds up when applied to audiences beyond the core target.

The goal is to identify where strategies have genuine cross-segment appeal, where they need adaptation, and where they risk alienating specific groups entirely.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Speak from the specific characteristics and expectations of your assigned segment
- Be rigorous about what actually works for your segment vs what has been assumed to work
- No complimenting other segment representatives — the differences between your segments are the value
- Your segment's reality is not a niche consideration — it is a test of whether strategy actually scales`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('assessment_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;
        return `**Assessment Approach — Follow This Sequence:**
1. Define your segment precisely — what makes your audience distinct from the core target
2. Test the core strategy or content against your segment's actual needs and expectations
3. Identify where it lands well, where it misses, and where it could actively cause harm to segment relationship
4. Surface at least one assumption the strategy makes that fails for your segment specifically
5. Score the strategy's effectiveness for your segment 1-10 with explicit rationale

Assessment Instructions for ${personaCount} segment persona${personaCount !== 1 ? 's' : ''}:
- Test validity of the strategy or content across each assigned segment
- Evaluate cultural relevance and potential for unintended negative readings
- Assess social dynamics and how this would travel within each segment community
- Identify specific adaptations needed for each segment — not just "customise the messaging"`;
      }),

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
    id: 'test_segments_execute_recommend',
    hexId: 'Test Against Segments',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== TEST AGAINST SEGMENTS — RECOMMENDATIONS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are generating segment-specific recommendations — what the brand must do differently to connect with your segment, and what would be counterproductive to try.

The goal is actionable recommendations that respect your segment's specific context rather than applying a universal strategy that wasn't designed for you.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Recommendations must reflect your segment's actual standards and expectations — not a generalisation
- Be specific about what adaptation is required and what the benefit would be for your segment
- Name what the brand should stop doing for your segment, not just what to add
- Where segments require conflicting approaches, preserve those conflicts — they are real strategic decisions`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new TextPart('recommendation_approach', {
        en: `**Recommendation Approach — Follow This Sequence:**
1. Name the 2-3 most important changes that would make this resonate with your segment
2. For each: describe specifically what the adapted version would look and feel like
3. Identify what the brand must stop doing to avoid alienating your segment
4. Recommend the most important launch sequencing consideration for your segment
5. Name the segment-specific cultural, social, or contextual factor the brand is currently ignoring

Recommendation Focus Areas:
- Segment-specific strategy adaptations with concrete descriptions of what they look like
- Cultural and social customisation requirements — not just tone but substance
- Community dynamics and how this would travel within your segment
- Prioritisation and targeting approach for your segment
- What triggers and barriers are unique to your segment vs shared across segments`
      }),

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
    id: 'test_segments_execute_unified',
    hexId: 'Test Against Segments',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== TEST AGAINST SEGMENTS — UNIFIED ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are conducting a full segment test — assessing the strategy against your segment's reality and generating specific recommendations for how to adapt it to genuinely serve your community.

The value is the honest comparison between what the strategy assumes about all audiences and what different segments actually need.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Ground everything in your segment's specific context — who your community is and what matters to them
- Preserve the differences between segments — they reveal where a universal approach breaks down
- Name the moments where the current strategy would succeed or fail within your community
- Be direct about what would need to fundamentally change, not just what could be tweaked`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('unified_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;
        return `**Your Approach — Follow This Sequence:**

1. SEGMENT TESTING
   - Define your segment and evaluate the strategy or content against your community's standards
   - Score effectiveness for your segment 1-10 with specific evidence
   - Identify where the strategy lands well vs where it misses or creates risk
   ${personaCount > 1 ? `- Your test is one of ${personaCount} segment perspectives — represent your community honestly` : ''}

2. SEGMENT RECOMMENDATIONS
   - Name the adaptations required for your segment — be concrete, not directional
   - Prioritise by impact on your segment's relationship with the brand
   - Identify what must stay universal vs what must be segment-specific

3. SYNTHESIS (Round 2+ only)
   - Compare your segment's assessment with others — where do strategies converge vs require different approaches?
   - Identify the segments where adaptation is non-negotiable vs where a unified approach works
   - Name the single most important cross-segment insight that should inform the overall strategy`;
      }),

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
    id: 'test_segments_save',
    hexId: 'Test Against Segments',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE SEGMENT TESTING ANALYSIS ==='
      }),

      new TextPart('purpose', {
        en: `Generate a comprehensive Segment Testing Report from this session.

The report should reflect the genuine differences between segments surfaced in this session — not averaged findings but a clear map of where strategies hold across segments and where they require adaptation.`
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,
      BaseParts.chainContext,

      new TextPart('save_instructions', {
        en: `Report Structure:
- Executive Summary: Key cross-segment findings and most important strategic implications
- Segment Profiles and Test Results: Each segment's assessment, score, and specific feedback
- Cross-Segment Analysis: Where strategies hold universally vs where they diverge
- Adaptation Requirements: Specific changes needed by segment, prioritised by impact
- Cultural and Social Considerations: Community dynamics and risk factors by segment
- Prioritisation Framework: Which segments to lead with and how to sequence
- Implementation Roadmap: Segment-aware execution plan

Format as a structured markdown document suitable for marketing and planning teams.`
      })
    ]
  }),

  /**
   * Download
   */
  download: new PromptTemplate({
    id: 'test_segments_download',
    hexId: 'Test Against Segments',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT SEGMENT TESTING DATA ==='
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,
      BaseParts.chainContext,

      new DynamicPart('export_data', (ctx) => {
        return `Generate a complete downloadable export of this Segment Testing session:

Metadata:
- Date, project, brand, segments tested: ${ctx.selectedPersonas?.join(', ') || 'None'}
- KB files analysed: ${ctx.selectedFiles?.join(', ') || 'None'}

Content:
- Full segment assessments with scores and rationale
- Cross-segment comparison map
- Adaptation requirements by segment
- Cultural and social risk analysis
- Complete recommendation set

Format as structured JSON with all fields populated.`;
      })
    ]
  })
};
