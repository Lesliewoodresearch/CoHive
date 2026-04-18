/**
 * Launch (Enter) Hex Prompts
 *
 * Structured following the InterviewDialog pattern:
 *   Purpose → Style → Approach → Detailed Requirements
 *
 * The hex framing (Purpose/Style/Approach) is injected via getHexFraming('Launch').
 */

import { PromptTemplate, TextPart, DynamicPart } from '../core';
import { BaseParts } from '../base-parts';

export const LaunchPrompts = {

  /**
   * Execute — Initialise workflow
   */
  execute: new PromptTemplate({
    id: 'launch_execute',
    hexId: 'Launch',
    trigger: 'execute',
    parts: [
      new TextPart('header', {
        en: '=== LAUNCH — WORKFLOW INITIALISATION ==='
      }),

      new TextPart('purpose', {
        en: `**Session Purpose:**
You are initialising a CoHive analysis workflow — establishing the project foundation, sharpening the research questions, and ensuring the iteration is set up to produce useful strategic output.

The goal is to prevent wasted effort: validate that the right questions are being asked before any analysis begins, and identify what is missing that would limit the iteration's value.`
      }),

      new TextPart('style', {
        en: `**How You Approach This:**
- Be a rigorous project framer — challenge vague objectives and sharpen them into specific, researchable questions
- Surface assumptions the brief is making that should be tested, not taken for granted
- Identify what success looks like before analysis begins — not in general, but for this specific brand and project type
- Flag missing information that would compromise downstream analysis`
      }),

      BaseParts.projectContext,
      BaseParts.questionResponses,

      new TextPart('launch_approach', {
        en: `**Your Approach — Follow This Sequence:**
1. Validate the project setup — is the brand, project type, and objective clearly enough defined to produce useful analysis?
2. Identify the 3 key questions this iteration must answer to be strategically worthwhile
3. Assess what information would be needed to answer each question well — and flag what is missing
4. Recommend the most valuable workflow path through CoHive for this specific objective
5. Surface the 1-2 assumptions the brief is making that most need to be tested rather than assumed

Based on the project information provided:
- Validate the project setup and flag any critical gaps
- Identify key research questions the iteration should answer
- Suggest the most relevant hex sequence for this project type
- Highlight any missing context that would limit analysis quality`
      }),

      BaseParts.pythonContext,
      BaseParts.outputFormat
    ]
  }),

  /**
   * Save — Store launch configuration
   */
  save: new PromptTemplate({
    id: 'launch_save',
    hexId: 'Launch',
    trigger: 'save',
    parts: [
      new TextPart('header', {
        en: '=== SAVE LAUNCH CONFIGURATION ==='
      }),

      new TextPart('purpose', {
        en: `Generate a project initialisation document that establishes the foundation for this iteration and can be referenced throughout the workflow.`
      }),

      BaseParts.projectContext,
      BaseParts.questionResponses,

      new DynamicPart('save_instruction', (ctx) => {
        return `Generate a project summary document that captures:

Project Foundation:
- Project name: ${ctx.brand || 'Unnamed Project'} — ${ctx.projectType || 'Not specified'}
- Strategic objective: What this iteration is trying to achieve
- Key research questions: The 3 questions this iteration must answer
- Recommended workflow path: Which hexes to run and in what sequence

Setup Notes:
- Information available at launch
- Key assumptions being made
- Missing context that should be addressed
- Success criteria: how will the team know this iteration was worthwhile?

Format as a clear markdown document suitable for sharing with the project team.`;
      })
    ]
  }),

  /**
   * Download — Export launch data
   */
  download: new PromptTemplate({
    id: 'launch_download',
    hexId: 'Launch',
    trigger: 'download',
    parts: [
      new TextPart('header', {
        en: '=== EXPORT LAUNCH DATA ==='
      }),

      new DynamicPart('export_data', (ctx) => {
        return `Generate a complete downloadable export of this Launch configuration:

Project Details:
- Brand: ${ctx.brand || 'Not specified'}
- Project Type: ${ctx.projectType || 'Not specified'}
- User Role: ${ctx.userRole || 'Not specified'}

Setup:
- Key research questions established at launch
- Recommended workflow path
- Assumptions flagged for testing
- Success criteria

User Inputs:
${ctx.questionResponses?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'No responses recorded'}

Format as a structured JSON with all metadata and configuration captured.`;
      })
    ]
  })
};
