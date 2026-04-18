/**
 * Action (Findings) Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('Action').
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const ActionPrompts = {

  /**
   * Execute — Generate findings and action plan
   */
  execute: new PromptTemplate({
    id: 'action_execute',
    hexId: 'Action',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== ACTION — FINDINGS & STRATEGIC ACTION PLAN ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
This is the final Action phase of the CoHive workflow. You are synthesising everything the iteration has produced into a clear, decisive findings report and strategic action plan.

The goal is not another layer of analysis — it is decisions. The brand needs clear priorities, owned actions, and a path forward grounded in the full body of evidence from this iteration.`
      }),

      new TextPart('style', {
        en: `**How You Approach This:**
- Be decisive: this hex exists to produce clarity, not preserve nuance
- Synthesise across hexes, not just summarise them — find the through-line that connects the iteration's findings
- Where hexes produced conflicting signals, name the tension and recommend a resolution — do not leave it unresolved
- Prioritise ruthlessly: not everything can be equally important, and pretending otherwise is not helpful
- Every recommendation must be traceable to evidence from the iteration`
      }),

      BaseParts.projectContext,

      new DynamicPart('workflow_summary', (ctx) => {
        const hexes = ctx.allHexResponses ? Object.keys(ctx.allHexResponses) : [];
        if (hexes.length === 0) {
          return `Note: No prior hex analyses are available. Generate findings based on the context and chain results provided.`;
        }
        return `Hexes completed in this iteration: ${hexes.join(', ')}

Synthesise the insights from all completed analyses — find the through-line, resolve the tensions, and produce a decisive action plan.`;
      }),

      BaseParts.chainContext,
      BaseParts.questionResponses,

      new TextPart('action_approach', {
        en: `**Your Approach — Follow This Sequence:**

1. SYNTHESISE
   - Identify the 3-5 findings that the iteration establishes most clearly across hexes
   - Name the most important tensions or contradictions between hex outputs — and resolve them
   - Assess overall confidence levels: what is well-established vs what remains uncertain
   - Find the single most important strategic insight that only becomes visible when looking across all hexes

2. STRATEGIC RECOMMENDATIONS
   - Prioritise recommendations by impact and confidence — not by hex order
   - Make each recommendation specific enough to act on: "do X because Y, measured by Z"
   - Define success metrics and KPIs for each priority
   - Identify the risks of inaction — what is the cost of not acting on these findings?

3. EXECUTIVE SUMMARY
   - 3-5 strategic priorities, no more
   - Expected outcomes and business impact
   - Resource requirements and major dependencies
   - The single most important thing the brand must do first

4. ACTION PLAN
   - Immediate (next 30 days): decisions and actions that should not wait
   - Short-term (3-6 months): initiatives that need to be started now
   - Strategic (6-12 months): moves that require longer-term planning and commitment`
      }),

      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,

      new TextPart('output_format_action', {
        en: `Output Format:
{
  "executive_summary": "Concise overview: what this iteration established and what it demands",
  "key_findings": [
    {
      "finding": "Specific finding statement",
      "source_hexes": ["Hex1", "Hex2"],
      "confidence": "high|medium|low",
      "business_impact": "high|medium|low",
      "evidence": "Brief citation of supporting evidence"
    }
  ],
  "strategic_priorities": [
    {
      "priority": "Specific, actionable priority statement",
      "rationale": "Why this matters — grounded in iteration evidence",
      "expected_outcome": "What success looks like, specifically",
      "timeline": "Immediate / Short-term / Strategic",
      "resources_required": "What this needs to happen",
      "success_metric": "How you will know this worked"
    }
  ],
  "action_plan": {
    "immediate": ["Action 1 — owner, deadline", "Action 2"],
    "short_term": ["Initiative 1 — outcome, timeline", "Initiative 2"],
    "strategic": ["Strategy 1 — vision, commitment required", "Strategy 2"]
  },
  "tensions_resolved": ["Tension between Hex A and Hex B — resolution and rationale"],
  "risks_of_inaction": ["Risk 1 if brand does not act", "Risk 2"],
  "knowledge_gaps": ["Gap that limits confidence in recommendation X", ...]
}`
      })
    ]
  }),

  /**
   * Save — Generate full findings report
   */
  save: new PromptTemplate({
    id: 'action_save',
    hexId: 'Action',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE FINDINGS REPORT ==='
      }),

      new TextPart('purpose', {
        en: `Generate a comprehensive CoHive Findings Report from this iteration.

The report should be a standalone document that a senior stakeholder can read and act on without access to the underlying hex analyses. It must be decisive — clear on what was found, what it means, and what should happen next.`
      }),

      BaseParts.projectContext,
      BaseParts.chainContext,

      new DynamicPart('workflow_context', (ctx) => {
        const hexes = ctx.allHexResponses ? Object.keys(ctx.allHexResponses) : [];
        return `Iteration Summary:
Hexes completed: ${hexes.length > 0 ? hexes.join(', ') : 'Not specified'}`;
      }),

      new TextPart('save_instructions', {
        en: `Report Structure:
- Executive Summary: Top 3-5 strategic priorities and expected impact
- Project Overview: Brand, project type, iteration scope, and methodology
- Key Findings by Theme: Cross-hex synthesis organised by strategic theme, not by hex
- Tensions and Resolutions: Where hexes conflicted and how to resolve the conflict
- Strategic Recommendations: Prioritised by impact with evidence citations
- Action Plan: Immediate / Short-term / Strategic with owners and timelines
- Success Metrics and KPIs: How to measure progress on each priority
- Risks of Inaction: What happens if the brand doesn't act on these findings
- Knowledge Gaps: What remains unknown and what decisions it blocks

Format as a professional markdown document suitable for stakeholder presentation and executive briefing.`
      })
    ]
  }),

  /**
   * Download — Export complete iteration data
   */
  download: new PromptTemplate({
    id: 'action_download',
    hexId: 'Action',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT COMPLETE ITERATION DATA ==='
      }),

      BaseParts.projectContext,

      new DynamicPart('complete_export', (ctx) => {
        return `Generate a complete downloadable export of this CoHive iteration:

Metadata:
- Brand: ${ctx.brand || 'Not specified'}
- Project Type: ${ctx.projectType || 'Not specified'}
- User Role: ${ctx.userRole || 'Not specified'}
- Hexes completed: ${ctx.allHexResponses ? Object.keys(ctx.allHexResponses).join(', ') : 'Not specified'}

Content:
- All hex analyses and outputs
- Complete response and response history
- KB files analysed across all hexes
- Execution timestamps and versions
- Gems saved during the iteration
- Final findings and strategic recommendations
- Complete action plan

Format as comprehensive JSON:
{
  "metadata": { brand, projectType, userRole, completedHexes, timestamp },
  "hex_outputs": { [hexId]: { summary, keyInsights, recommendations } },
  "findings": { executiveSummary, strategicPriorities, actionPlan, successMetrics },
  "gems": [ { gemText, hexId, fileName } ],
  "knowledge_gaps": [],
  "raw_data": { responses, hexExecutions }
}`;
      })
    ]
  }),

  /**
   * Recommend — Suggest additional analyses
   */
  recommend: new PromptTemplate({
    id: 'action_recommend',
    hexId: 'Action',
    trigger: 'recommend',
    parts: [
      new TextPart('header', {
        en: '=== RECOMMEND ADDITIONAL ANALYSES ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
Based on the findings from this iteration, recommend the additional analyses that would most increase strategic confidence or fill the most important knowledge gaps.

The goal is a prioritised research agenda — not everything that could be done, but what should be done next given what this iteration has revealed.`
      }),

      BaseParts.projectContext,
      BaseParts.chainContext,

      new DynamicPart('completed_hexes', (ctx) => {
        const completed = ctx.allHexResponses ? Object.keys(ctx.allHexResponses) : [];
        const allHexes = ['Launch', 'Luminaries', 'panelist', 'Consumers', 'competitors', 'Colleagues', 'cultural', 'test', 'Grade'];
        const notCompleted = allHexes.filter(h => !completed.includes(h));
        return `Workflow Status:
Completed: ${completed.join(', ') || 'Launch only'}
Not yet run: ${notCompleted.join(', ') || 'None'}`;
      }),

      new TextPart('recommend_approach', {
        en: `**Recommendation Approach — Follow This Sequence:**
1. Identify the most important knowledge gap from this iteration — what strategic decision cannot be made confidently?
2. Recommend the hex or analysis type that would best fill that gap
3. Suggest specific personas, competitors, or segments that would add the most value
4. Identify KB files that should be reviewed or added to improve future iterations
5. Propose any synthesis opportunities across existing analyses
6. Prioritise recommendations by the strategic value of the knowledge they would produce

Focus on:
- Hexes that would resolve the highest-impact uncertainties from this iteration
- Specific personas or perspectives that were missing from this iteration
- Knowledge base content that would substantially improve confidence in the key recommendations
- Synthesis opportunities that would surface insights not visible in individual hex outputs`
      }),

      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  })
};
