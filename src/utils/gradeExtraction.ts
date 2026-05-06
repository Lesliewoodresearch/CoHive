/**
 * Grade hex scoring utilities — kept out of ProcessWireframe to manage file size.
 *
 * Exports:
 *   extractIdeasFromHexResults  — async AI call to pull idea candidates from hex output text
 *   buildGradeScoringPrompt     — pure function; builds the scoring prompt
 *   parseGradeResults           — splits AI response into scoreGrid + assessments blocks
 */

import { executeAIPrompt } from './databricksAI';
import { getPersonasForHex } from '../data/personas';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GradeSegment {
  id: string;
  name: string;
  populationEstimate?: number;
}

export interface GradeResults {
  scoreGrid: string;   // markdown table section
  assessments: string; // written assessment paragraphs (empty if numeric-only)
}

interface HexExecution {
  id: string;
  selectedFiles: string[];
  assessmentType: string[];
  assessment: string;
  timestamp: number;
}

// ── Idea extraction ───────────────────────────────────────────────────────────

/**
 * Calls a fast AI model to extract distinct ideas/strategies from all hex
 * output text in the current iteration (including stories).
 * Returns a clean string array, one idea per entry.
 */
export async function extractIdeasFromHexResults(
  hexExecutions: Record<string, HexExecution[]>,
  userEmail: string,
  userRole: string,
  modelEndpoint = 'databricks-claude-haiku-4-5',
): Promise<string[]> {
  // Collect all hex output text — all hexes including stories
  const sections: string[] = [];
  for (const [hexId, executions] of Object.entries(hexExecutions)) {
    if (!executions || executions.length === 0) continue;
    for (const exec of executions) {
      if (!exec.assessment?.trim()) continue;
      sections.push(`[${hexId}]\n${exec.assessment.trim()}`);
    }
  }

  if (sections.length === 0) return [];

  const combinedText = sections.join('\n\n---\n\n');

  const extractionPrompt = `Extract all distinct ideas, strategies, Big Ideas, creative concepts, and recommendations from these discussions.
Return a numbered list — one idea per line, no explanation.
Do not include process steps, questions, or methodology notes — only the actual ideas and recommendations.

DISCUSSIONS:
${combinedText}`;

  try {
    const result = await executeAIPrompt({
      prompt: extractionPrompt,
      modelEndpoint,
      maxTokens: 1000,
      temperature: 0.1,
      userEmail,
      userRole,
    });

    if (!result.success || !result.response) return [];

    // Parse numbered list: "1. Idea text" or "- Idea text"
    return result.response
      .split('\n')
      .map(line => line.replace(/^[\d]+\.\s*/, '').replace(/^[-•*]\s*/, '').replace(/\*\*/g, '').trim())
      .filter(line => {
        if (line.length <= 10) return false;
        if (line.endsWith(':')) return false;        // heading/label line
        if (line.startsWith('#')) return false;      // markdown header
        if (line === line.toUpperCase() && /[A-Z]{3}/.test(line)) return false; // ALL-CAPS label
        return true;
      });
  } catch {
    return [];
  }
}

// ── Segment lookup ────────────────────────────────────────────────────────────

/**
 * Given an array of selected persona IDs from the Grade hex segment picker,
 * returns GradeSegment objects with name and populationEstimate.
 */
export function resolveGradeSegments(selectedPersonaIds: string[]): GradeSegment[] {
  const config = getPersonasForHex('Grade');
  if (!config) return selectedPersonaIds.map(id => ({ id, name: id }));

  const lookup = new Map<string, { name: string; populationEstimate?: number }>();
  for (const level1 of config.options) {
    for (const level2 of level1.subcategories ?? []) {
      for (const role of level2.roles ?? []) {
        lookup.set(role.id, { name: role.name, populationEstimate: role.populationEstimate });
      }
    }
    for (const role of level1.roles ?? []) {
      lookup.set(role.id, { name: role.name, populationEstimate: role.populationEstimate });
    }
  }

  return selectedPersonaIds.map(id => {
    const found = lookup.get(id);
    return { id, name: found?.name ?? id, populationEstimate: found?.populationEstimate };
  });
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/**
 * Builds the scoring prompt. Pure function — no side effects.
 * `scale` is one of the testingScale radio values from CentralHexView.
 */
export function buildGradeScoringPrompt(
  ideas: string[],
  segments: GradeSegment[],
  scale: string,
  brand: string,
  projectType: string,
): string {
  const scaleLabel = scale.startsWith('scale-1-5')
    ? '1 to 5 (1 = would not respond, 5 = would respond very strongly)'
    : scale.startsWith('scale-1-10')
    ? '1 to 10 (1 = would not respond, 10 = would respond very strongly)'
    : null;

  const includeWritten = scale.includes('written') && !scale.includes('no-written');

  const segmentLines = segments
    .map(s => `- ${s.name}${s.populationEstimate != null ? ` (${s.populationEstimate}% of US market)` : ''}`)
    .join('\n');

  const ideaLines = ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n');

  const scaleInstruction = scaleLabel
    ? `Rate each idea on a scale of ${scaleLabel}.`
    : `Do not assign a numeric score — provide written assessments only.`;

  const outputInstructions = scaleLabel
    ? `
OUTPUT FORMAT — follow exactly:

SCORE GRID:
Produce a markdown table. Ideas are rows, segments are columns.
Each cell contains only the numeric score.
Use the exact idea text (truncated to ~40 chars if needed) as row headers.
Include segment population % in column headers where provided.

WRITTEN ASSESSMENTS:
${includeWritten
      ? 'For each idea × segment combination, write one paragraph explaining why that segment would or would not respond to the idea. Label each paragraph as "Idea [N] × [Segment Name]:".'
      : 'No written assessments requested — omit this section entirely.'}`
    : `
OUTPUT FORMAT:
For each idea × segment combination, write one paragraph explaining why that segment would or would not respond. Label each paragraph as "Idea [N] × [Segment Name]:".
Do not produce a score grid.`;

  return `You are a market research scoring tool.
Brand: ${brand}${projectType ? `\nProject type: ${projectType}` : ''}

Your task: evaluate how each target consumer segment would respond to each idea as a way to market ${brand}.

${scaleInstruction}

IDEAS TO EVALUATE:
${ideaLines}

TARGET SEGMENTS:
${segmentLines}

${outputInstructions}`;
}

// ── Result parser ─────────────────────────────────────────────────────────────

/**
 * Splits the raw AI scoring response into two labeled blocks for separate
 * storage in the iteration file.
 */
export function parseGradeResults(rawResponse: string): GradeResults {
  const gridMarker = /SCORE\s*GRID\s*:/i;
  const assessmentMarker = /WRITTEN\s*ASSESSMENTS?\s*:/i;

  const gridMatch = rawResponse.search(gridMarker);
  const assessmentMatch = rawResponse.search(assessmentMarker);

  if (gridMatch === -1 && assessmentMatch === -1) {
    // No markers — treat entire response as assessments
    return { scoreGrid: '', assessments: rawResponse.trim() };
  }

  if (gridMatch !== -1 && assessmentMatch === -1) {
    // Only a grid (numeric-only mode)
    const gridText = rawResponse.slice(gridMatch).replace(gridMarker, '').trim();
    return { scoreGrid: gridText, assessments: '' };
  }

  if (gridMatch === -1 && assessmentMatch !== -1) {
    // Only written assessments (no-scale mode)
    const assessText = rawResponse.slice(assessmentMatch).replace(assessmentMarker, '').trim();
    return { scoreGrid: '', assessments: assessText };
  }

  // Both sections present
  const gridText = rawResponse
    .slice(gridMatch, assessmentMatch)
    .replace(gridMarker, '')
    .trim();
  const assessText = rawResponse
    .slice(assessmentMatch)
    .replace(assessmentMarker, '')
    .trim();

  return { scoreGrid: gridText, assessments: assessText };
}

// ── Iteration file formatter ──────────────────────────────────────────────────

/**
 * Formats grade results into two clearly labeled blocks for the iteration .txt.
 * Each block can be independently included in Findings output.
 */
export function formatGradeForIteration(results: GradeResults): string {
  const parts: string[] = [];

  if (results.scoreGrid) {
    parts.push(`[Grade: Score Grid]\n${results.scoreGrid}`);
  }

  if (results.assessments) {
    parts.push(`[Grade: Written Assessments]\n${results.assessments}`);
  }

  return parts.join('\n\n');
}
