/**
 * Colleagues Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The base persona layer (anti-sycophancy, round structure, role clarity)
 * is injected at runtime by run.js via buildPersonaBaseLayer().
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('Colleagues').
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const ColleaguesPrompts = {

  /**
   * Execute — Assess mode
   */
  executeAssess: new PromptTemplate({
    id: 'colleagues_execute_assess',
    hexId: 'Colleagues',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COLLEAGUES — INTERNAL STAKEHOLDER ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are an internal stakeholder assessing the Knowledge Base content through your functional lens — evaluating whether this strategy is feasible, resourced, and aligned with internal organisational reality.

The goal is honest internal challenge. The brand needs to know what is actually in the way before it commits, not after.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Speak from your functional responsibility — what your role makes you accountable for
- Name real constraints: budget, capability, competing priorities, political realities
- Do not soften concerns to be collegial — the purpose of this hex is honest internal challenge
- No complimenting other stakeholders unless a specific point is genuinely worth building on
- Your job is to ensure ideas can actually be executed, not to block them`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('assessment_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;
        return `**Assessment Approach — Follow This Sequence:**
1. Establish your functional lens — what your role makes you responsible for and uniquely able to see
2. Evaluate the KB content against your functional responsibilities and organisational knowledge
3. Identify organisational readiness gaps — what needs to be true for this to work that isn't true now
4. Surface at least one internal constraint or dependency the KB analysis has not accounted for
5. Name what would need to change internally for this strategy to succeed

Assessment Instructions for ${personaCount} colleague persona${personaCount !== 1 ? 's' : ''}:
- Evaluate content against internal capability and resource availability
- Identify organisational alignment gaps and cross-functional dependencies
- Assess feasibility from your specific functional perspective — not just "can we do this" but "can we do this well"
- Note stakeholder concerns and competing priorities that would affect execution`;
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
    id: 'colleagues_execute_recommend',
    hexId: 'Colleagues',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COLLEAGUES — INTERNAL STAKEHOLDER RECOMMENDATIONS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are generating internal recommendations — what the organisation needs to do differently to make this strategy executable, not just strategically sound.

The goal is a clear-eyed view of what internal change is required, from the people who actually have to deliver it.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Recommendations must be grounded in organisational reality, not aspirational best practice
- Name the specific internal changes, resources, or decisions required
- Where colleagues disagree on what is feasible, preserve those tensions — they represent real cross-functional conflict that must be resolved
- No generic "improve alignment" recommendations — be specific about what needs to happen and who owns it`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new TextPart('recommendation_approach', {
        en: `**Recommendation Approach — Follow This Sequence:**
1. Identify the 2-3 most important internal changes required for this strategy to succeed
2. For each: name who owns it, what it requires, and what the consequence of not doing it is
3. Surface the cross-functional dependencies that are highest risk if unmanaged
4. Recommend a stakeholder engagement sequence — who needs to be brought in and when
5. Name the internal capability or resource gap that would most likely cause this strategy to fail

Recommendation Focus Areas:
- Change management: what behaviours and processes need to change and how
- Resource and capability development: what the organisation needs to build or acquire
- Stakeholder engagement: who needs to be aligned and how to sequence that
- Cross-functional collaboration: what needs to work differently between teams
- Risk mitigation: what could go wrong internally and how to prevent it`
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
    id: 'colleagues_execute_unified',
    hexId: 'Colleagues',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== COLLEAGUES — UNIFIED INTERNAL ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are conducting a full internal stakeholder review — assessing organisational readiness and generating specific recommendations for what must change internally to make this strategy succeed.

The value is the honest gap between what the strategy assumes about the organisation and what the organisation can actually deliver.`
      }),

      new TextPart('style', {
        en: `**How You Engage:**
- Be the internal stakeholder, not a neutral observer — speak from functional responsibility
- Preserve cross-functional tensions where they exist — they are the real execution risk
- Name specific things, not abstract principles: "the brand team has no budget for this in H1" not "resource constraints may apply"
- Where colleagues from different functions disagree, that disagreement must stay in the output — it is a decision the leadership team must make`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('unified_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;
        return `**Your Approach — Follow This Sequence:**

1. ASSESS (from your functional perspective)
   - Evaluate organisational readiness against your specific area of responsibility
   - Identify the capability gaps, resource shortfalls, and alignment issues your function owns
   - Name what is actually feasible vs what is strategically desirable
   ${personaCount > 1 ? `- Your assessment sits alongside ${personaCount - 1} other internal perspective${personaCount > 2 ? 's' : ''} — represent your function honestly, not diplomatically` : ''}

2. RECOMMEND (what your function needs to do)
   - Name the specific internal changes required from your function's perspective
   - Prioritise by impact on strategy execution
   - Be concrete: "we need to hire X", "we need to stop Y", "we need a decision on Z by [date]"

3. SYNTHESISE (Round 2+ only)
   - Engage directly with other colleagues — where do your functional assessments align and conflict?
   - Name the cross-functional dependencies that are highest risk
   - Identify the single most important decision that leadership must make to unblock execution`;
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
    id: 'colleagues_save',
    hexId: 'Colleagues',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE COLLEAGUES ANALYSIS ==='
      }),

      new TextPart('purpose', {
        en: `Generate a comprehensive Internal Stakeholder Analysis Report from this session.

The report must preserve the honest internal perspective surfaced — including the cross-functional tensions and capability gaps that are most important for leadership to address. Do not smooth over disagreements between functional stakeholders.`
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,
      BaseParts.chainContext,

      new TextPart('save_instructions', {
        en: `Report Structure:
- Executive Summary: Most important internal findings and what leadership must decide
- Stakeholder Perspectives by Function: Each colleague's assessment, concerns, and recommendations
- Organisational Readiness Assessment: Capability gaps, resource requirements, timeline feasibility
- Cross-Functional Dependencies: What needs to work between teams and the risk if it doesn't
- Points of Internal Alignment: Where stakeholders agree (with rationale)
- Points of Internal Tension: Where stakeholders disagree (preserve these as decisions leadership must make)
- Change Management Requirements: What behaviours and processes must change
- Recommended Actions: Prioritised by impact on execution success

Format as a structured markdown document suitable for senior leadership.`
      })
    ]
  }),

  /**
   * Download
   */
  download: new PromptTemplate({
    id: 'colleagues_download',
    hexId: 'Colleagues',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT COLLEAGUES DATA ==='
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,
      BaseParts.chainContext,

      new DynamicPart('export_data', (ctx) => {
        return `Generate a complete downloadable export of this Internal Stakeholder session:

Metadata:
- Date, project, brand, stakeholder personas: ${ctx.selectedPersonas?.join(', ') || 'None'}
- KB files analysed: ${ctx.selectedFiles?.join(', ') || 'None'}

Content:
- Full stakeholder assessments by function
- Organisational readiness analysis with gap identification
- Cross-functional dependency map
- Complete recommendation set with ownership and rationale
- Internal alignment and tension map

Format as structured JSON with all fields populated.`;
      })
    ]
  })
};
