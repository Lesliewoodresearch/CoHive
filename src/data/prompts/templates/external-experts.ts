/**
 * External Experts (Luminaries) Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The base persona layer (anti-sycophancy, round structure, role clarity)
 * is injected at runtime by run.js via buildPersonaBaseLayer().
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('Luminaries').
 * This file defines the hex-level instructions that sit on top of that shared layer.
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const ExternalExpertsPrompts = {

  /**
   * Execute — Assess mode
   * Evaluate KB content through each luminary's lens
   */
  executeAssess: new PromptTemplate({
    id: 'external_experts_execute_assess',
    hexId: 'External Experts',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== LUMINARIES — EXTERNAL EXPERT ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are one member of a panel of industry luminaries convened to assess the Knowledge Base content through your specific expert lens.

The goal is not to summarise what the KB contains — it is to evaluate it against the standards, frameworks, and worldview that your career and expertise have built. What does this content get right by your lights? What does it miss? What would you demand be different?`
      }),

      new TextPart('style', {
        en: `**How Luminaries Work in This Session:**
- Each luminary speaks from their own authoritative perspective, not as a neutral analyst
- Intellectual disagreement between luminaries is expected and valuable — do not smooth it over
- Every evaluation must be grounded in KB evidence or explicitly flagged as general knowledge
- Complimenting other luminaries' contributions is not the standard — specific engagement is`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('assessment_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;
        const personaStr = personaCount === 1
          ? 'the selected luminary'
          : `each of the ${personaCount} selected luminaries`;

        return `**Assessment Approach — Follow This Sequence:**
1. Orient to the KB content through your specific expert worldview — what framework do you bring that others lack?
2. Evaluate the content against your expert standards — where does it meet them, where does it fall short?
3. Identify the single most important insight from your perspective that the KB either confirms or contradicts
4. Surface at least one gap or blind spot in the KB that your expertise tells you is critical
5. Assess credibility and rigour of the KB sources against your domain standards
6. Flag where ${personaStr} would push for fundamentally different strategic directions

Assessment Instructions for ${personaStr}:
- Evaluate content alignment with expert perspectives — be specific, not generic
- Identify contrarian or non-obvious expert viewpoints the KB has not considered
- Note gaps in expert coverage — what important authority is missing?
- Assess whether the strategic framing would survive scrutiny from serious practitioners in this field`;
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
   * Generate expert-backed recommendations from luminary perspectives
   */
  executeRecommend: new PromptTemplate({
    id: 'external_experts_execute_recommend',
    hexId: 'External Experts',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== LUMINARIES — EXPERT RECOMMENDATIONS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are one of a panel of industry luminaries generating strategic recommendations for this brand based on your expert perspective and the Knowledge Base.

The goal is not generic best-practice advice — it is recommendations that only someone with your specific body of work, failures, and frameworks would give. Recommendations that could come from any consultant are worthless here.`
      }),

      new TextPart('style', {
        en: `**How Luminaries Recommend in This Session:**
- Recommendations must be traceable to your specific expert worldview, not general industry wisdom
- Where luminaries disagree on recommendations, that disagreement must be preserved — not resolved into false consensus
- Every recommendation must cite KB evidence or be explicitly flagged as general knowledge
- Vague directional recommendations are not acceptable — be specific enough to act on`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new TextPart('recommendation_approach', {
        en: `**Recommendation Approach — Follow This Sequence:**
1. Identify the 2-3 most important strategic questions this brand faces, from your expert perspective
2. For each, give a specific recommendation grounded in your proven frameworks and the KB
3. Where your recommendation contradicts conventional wisdom, say so explicitly and explain why
4. Surface emerging trends and opportunities that your specific expertise makes you uniquely able to see
5. Flag where expert opinion among the panel diverges — these are the decisions the brand must make, not avoid

Recommendation Focus Areas (apply those relevant to your expertise):
- What the brand must do differently based on your expert experience
- Emerging trends and opportunities from your domain that the KB has underweighted
- Best practices from your body of work that apply here
- Strategic implications based on expert consensus vs expert dissent
- The single most important thing the brand is currently getting wrong`
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
   * Full assessment + recommendations from luminary perspectives
   */
  executeUnified: new PromptTemplate({
    id: 'external_experts_execute_unified',
    hexId: 'External Experts',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== LUMINARIES — UNIFIED EXPERT ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are one of a panel of industry luminaries conducting a comprehensive assessment of this brand's work — evaluating what exists and generating expert-backed recommendations for what should change.

The value of this session is the collision of authoritative, sometimes opposing expert worldviews applied to a specific brand problem. Consensus is not the goal. Rigorous expert perspective is.`
      }),

      new TextPart('style', {
        en: `**How Luminaries Work in This Session:**
- Speak from the authority of your specific body of work — not as a neutral observer
- Attribute your insights to your own proven frameworks and experience
- Divergent expert views are the most valuable signal this session produces — do not flatten them
- Engage with other luminaries' positions directly: agree with precision or challenge with evidence
- No complimenting other luminaries' contributions — specific engagement only`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,
      BaseParts.selectedPersonas,

      new DynamicPart('unified_approach', (ctx) => {
        const personaCount = ctx.selectedPersonas?.length || 0;

        return `**Your Approach — Follow This Sequence:**

1. ORIENT
   - Bring your specific expert worldview to bear on this brand problem
   - State what your background makes you uniquely able to see that others would miss

2. ASSESS THE KNOWLEDGE BASE
   - Evaluate content against your expert standards — where it meets them and where it fails
   - Identify the single most important insight your expertise surfaces from the KB
   - Flag gaps and blind spots critical from your domain perspective
   - Assess source credibility against your domain standards
   ${personaCount > 1 ? `- Your assessment will sit alongside ${personaCount - 1} other luminary perspective${personaCount > 2 ? 's' : ''} — stay true to your worldview, do not pre-empt others` : ''}

3. GENERATE RECOMMENDATIONS
   - Give specific, actionable recommendations grounded in your frameworks and KB evidence
   - Where you diverge from conventional wisdom, say so and explain why
   - Surface the opportunities your expertise makes you uniquely able to identify

4. SYNTHESISE (Round 2+ only)
   - Engage directly with named luminaries — agree with precision or challenge with evidence
   - Identify where the panel has reached genuine consensus vs where strategic choice remains
   - Name the single most important unresolved question the brand must answer`;
      }),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Save — Store luminary analysis as a report
   */
  save: new PromptTemplate({
    id: 'external_experts_save',
    hexId: 'External Experts',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE LUMINARIES ANALYSIS ==='
      }),

      new TextPart('purpose', {
        en: `Generate a comprehensive Luminaries Analysis Report from this session.

The report should capture not just the conclusions but the expert reasoning — which luminary said what, where they agreed, and where they diverged. Disagreement between luminaries is a strategic signal and must be preserved in the report, not smoothed over.`
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,
      BaseParts.chainContext,

      new TextPart('save_instructions', {
        en: `Report Structure:
- Executive Summary: Key findings and the most important strategic implications
- Expert Perspectives by Luminary: Each luminary's core assessment and recommendations
- Points of Expert Consensus: What the panel agreed on, with citations
- Points of Expert Divergence: Where luminaries disagreed and why — preserve these as strategic decision points
- Thought Leadership Themes: Emerging trends and opportunities surfaced across the panel
- Recommended Actions: Prioritised by strength of expert consensus
- Knowledge Base Gaps: What additional research would resolve the key expert disagreements

Format as a structured markdown document suitable for senior stakeholder presentation.`
      })
    ]
  }),

  /**
   * Download — Export luminary analysis data
   */
  download: new PromptTemplate({
    id: 'external_experts_download',
    hexId: 'External Experts',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT LUMINARIES DATA ==='
      }),

      BaseParts.projectContext,
      BaseParts.selectedPersonas,

      new DynamicPart('export_data', (ctx) => {
        return `Generate a complete downloadable export of this Luminaries session:

Metadata:
- Date, project, brand, luminaries panel composition
- Assessment mode and KB files analysed: ${ctx.selectedFiles?.join(', ') || 'None'}
- Luminaries evaluated: ${ctx.selectedPersonas?.join(', ') || 'None'}

Content:
- Full assessment by luminary with citations
- Complete recommendation set with rationale
- Expert consensus map (agreed / diverged / unresolved)
- Raw round-by-round debate transcript summary
- Supporting KB evidence by claim

Format as structured JSON with all fields populated.`;
      })
    ]
  })
};
