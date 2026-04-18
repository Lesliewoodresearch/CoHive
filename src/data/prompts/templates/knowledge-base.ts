/**
 * Knowledge Base Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('Knowledge Base').
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const KnowledgeBasePrompts = {

  /**
   * Execute — New Synthesis mode
   */
  executeNewSynthesis: new PromptTemplate({
    id: 'knowledge_base_execute_synthesis',
    hexId: 'Knowledge Base',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== KNOWLEDGE BASE — NEW SYNTHESIS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are creating a new synthesis from selected projects, hexes, and execution history — finding the signal across multiple prior analyses.

The goal is not to summarise each source in sequence but to identify the patterns, themes, and tensions that only become visible when you look across all the selected work together.`
      }),

      new TextPart('style', {
        en: `**How You Approach Synthesis:**
- Find the through-line across sources, not just the summary of each
- Distinguish between what the body of work clearly establishes, what it suggests, and what it contradicts itself on
- Knowledge gaps are as strategically important as knowledge — name them explicitly
- Confidence levels matter: state how strongly each finding is supported across the selected scope`
      }),

      BaseParts.projectContext,
      BaseParts.synthesisContext,

      new TextPart('synthesis_approach', {
        en: `**Synthesis Approach — Follow This Sequence:**
1. Inventory what is actually in the selected scope — what was studied, by whom, and when
2. Identify the 3-5 themes that recur consistently across multiple sources
3. Find the contradictions — where sources point in different directions
4. Synthesise the key finding that the accumulated body of work establishes most strongly
5. Name the most important gap — the strategic question the body of work cannot answer
6. Generate meta-insights: what does the pattern of research itself tell you about how this brand thinks about its problems?`
      }),

      BaseParts.questionResponses,
      BaseParts.researcherInstructions,
      BaseParts.nonResearcherInstructions,
      BaseParts.pythonContext,

      new TextPart('output_format_synthesis', {
        en: `Output Format:
{
  "synthesis_summary": "High-level synthesis of the body of work — what it establishes, what it questions",
  "key_themes": ["Theme 1 — with evidence across sources", "Theme 2", ...],
  "cross_cutting_insights": ["Insight that only emerges when looking across all sources", ...],
  "patterns": {
    "consistent": ["Finding supported by multiple sources", ...],
    "contradictory": ["Finding where sources disagree — name the tension", ...]
  },
  "recommendations": ["Recommendation traceable to synthesised evidence", ...],
  "knowledge_gaps": ["Strategic question the body of work cannot answer", ...],
  "confidence": "high|medium|low",
  "meta_insights": ["What the pattern of research reveals about how this brand thinks", ...]
}`
      })
    ]
  }),

  /**
   * Execute — Assess mode
   */
  executeAssess: new PromptTemplate({
    id: 'knowledge_base_execute_assess',
    hexId: 'Knowledge Base',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== KNOWLEDGE BASE — ASSESSMENT ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are assessing the selected Knowledge Base files — evaluating the quality, completeness, and strategic relevance of the research available.

The goal is an honest audit: what this KB actually provides, what it does well, and what strategic questions it cannot answer.`
      }),

      new TextPart('style', {
        en: `**How You Approach This:**
- Be rigorous about research quality — not every KB file is equally reliable or relevant
- Distinguish between what the KB clearly establishes and what it merely suggests
- Name the gaps as clearly as the findings — absence of evidence is strategically important
- Assess whether the research was designed to answer the right questions for this project`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new TextPart('assessment_approach', {
        en: `**Assessment Approach — Follow This Sequence:**
1. Evaluate the quality and rigour of each source — methodology, recency, relevance
2. Identify the highest-value content for this specific project
3. Assess whether the KB as a whole is sufficient to answer the strategic questions this project requires
4. Surface the most important insight the KB clearly establishes
5. Name the most important gap — what the strategy needs that the KB doesn't provide
6. Recommend whether additional research is needed and what form it should take`
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
    id: 'knowledge_base_execute_recommend',
    hexId: 'Knowledge Base',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== KNOWLEDGE BASE — RECOMMENDATIONS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are generating strategic recommendations from the Knowledge Base — turning what is known into what should be done.

The goal is recommendations that are traceable to specific evidence, not general best practice that could apply to any brand.`
      }),

      new TextPart('style', {
        en: `**How You Approach This:**
- Every recommendation must cite the KB evidence that supports it
- Where the KB is silent on a recommendation's foundation, say so explicitly
- Prioritise ruthlessly — not everything the KB suggests is equally important
- Identify where additional research is needed before a recommendation can be made confidently`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new TextPart('recommendation_approach', {
        en: `**Recommendation Approach — Follow This Sequence:**
1. Identify the strategic insights most strongly supported across the KB
2. For each, generate a specific, actionable recommendation with KB citation
3. Prioritise by strategic impact and strength of KB evidence
4. Flag where you are recommending beyond what the KB can directly support
5. Identify the research gaps that must be filled before the highest-stakes decisions can be made confidently
6. Name the single most important action the KB evidence demands

Recommendation Focus Areas:
- Strategic actions directly traceable to KB findings
- Research gaps that require new knowledge to fill
- KB enhancement opportunities — what additional content would most improve future analyses
- Methodology improvements for future research
- Quick wins: high-confidence recommendations with strong KB support`
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
    id: 'knowledge_base_execute_unified',
    hexId: 'Knowledge Base',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== KNOWLEDGE BASE — UNIFIED ANALYSIS ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are conducting a full Knowledge Base analysis — assessing what is known and generating recommendations grounded in that evidence.

The value is the honest connection between what the research actually shows and what the brand should therefore do — not what the brand wants the research to say.`
      }),

      new TextPart('style', {
        en: `**How You Approach This:**
- Treat the KB as evidence, not authority — evaluate its quality before drawing conclusions
- Be precise about the strength of each finding — well-established, suggestive, or absent
- Recommendations must be proportional to the strength of the KB evidence behind them
- Name the limitations as prominently as the findings`
      }),

      BaseParts.projectContext,
      BaseParts.selectedFiles,

      new TextPart('unified_approach', {
        en: `**Your Approach — Follow This Sequence:**

1. CONTENT ASSESSMENT
   - Evaluate quality, completeness, and relevance of the KB content
   - Extract the highest-value insights with explicit confidence levels
   - Identify what the KB establishes vs what it merely suggests vs what it cannot address

2. STRATEGIC RECOMMENDATIONS
   - Generate actionable recommendations traceable to KB evidence
   - Prioritise by strategic impact and confidence level
   - Flag where gaps in the KB limit confidence in the recommendations

3. SYNTHESIS
   - Integrate findings into a coherent strategic narrative
   - Prioritise by business impact, not research interest
   - Close with the single most important thing the KB evidence demands the brand do`
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
    id: 'knowledge_base_save',
    hexId: 'Knowledge Base',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE KNOWLEDGE BASE ANALYSIS ==='
      }),

      BaseParts.projectContext,
      BaseParts.chainContext,

      new DynamicPart('save_context', (ctx) => {
        if (ctx.synthesisSelections) {
          return `**Cross-Source Synthesis Report** — synthesising across selected projects, hexes, and executions`;
        }
        return `**Knowledge Base Analysis Report** — assessment of selected KB content`;
      }),

      new TextPart('save_instructions', {
        en: `Report Structure:
- Executive Summary: Most important findings and what they demand strategically
- Knowledge Assessment: Quality and relevance evaluation of sources
- Key Findings: With confidence levels and KB citations
- Strategic Recommendations: Prioritised by impact and evidence strength
- Knowledge Gaps: What is missing and what decisions it blocks
- Research Agenda: What additional work would most improve the KB's strategic value

Format as a structured markdown document.`
      })
    ]
  }),

  /**
   * Download
   */
  download: new PromptTemplate({
    id: 'knowledge_base_download',
    hexId: 'Knowledge Base',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT KNOWLEDGE BASE DATA ==='
      }),

      BaseParts.projectContext,
      BaseParts.chainContext,

      new DynamicPart('export_data', (ctx) => {
        const isSynthesis = !!ctx.synthesisSelections;
        return `Generate a complete downloadable export of this Knowledge Base session:

Metadata:
- Date, project, brand
- ${isSynthesis ? 'Synthesis scope: projects, hexes, and executions selected' : 'KB files analysed'}
- Analysis type: ${isSynthesis ? 'Cross-source synthesis' : 'KB assessment'}

Content:
- ${isSynthesis ? 'Full synthesis with cross-source patterns and meta-insights' : 'Full KB assessment with quality evaluation'}
- Complete recommendation set with KB citations and confidence levels
- Knowledge gap analysis
- Research agenda

Format as structured JSON with all fields populated.`;
      })
    ]
  })
};
