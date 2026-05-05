/**
 * Enhanced Error Messages and Test Helpers for DiagnosticPanel
 *
 * Provides structured, actionable error messages with clear "what broke",
 * "why it broke", and "where to fix it" guidance for every test category.
 *
 * Import in DiagnosticPanel.tsx:
 *   import { ENHANCED_ERROR_MESSAGES, suggestFix } from './DiagnosticPanelEnhanced';
 */

// ── Core Navigation ────────────────────────────────────────────────────────────

export const ENHANCED_ERROR_MESSAGES = {

  // ── Core Navigation ──────────────────────────────────────────────────────────

  hexagonCount: {
    fail: (found: number, hexIds: string) => ({
      message: `✗ BROKEN: Only ${found}/13 hexagons rendered. Missing hexagons indicate template visibility issues or rendering errors.

WHERE TO FIX:
- Check /components/ProcessFlow.tsx for all 13 hex definitions in processSteps array
- Verify current template's visibleSteps includes all hexes (TemplateManager)
- Check browser console for React rendering errors`,
      expected: '13 hexagons: Enter, Colleagues, Luminaries, Cultural Voices, Panelist, Competitors, Social Listening, Consumers, Score Results, Findings, Knowledge Base, Share Your Wisdom, My Files',
      received: `${found} hexagons found: ${hexIds || 'none'}`,
    }),
    pass: (count: number) => `✓ All ${count} hexagons rendered correctly with proper data-hex-id attributes`,
  },

  hexagonColors: {
    fail: (missing: string[]) => ({
      message: `✗ BROKEN: ${missing.length} hexagon(s) missing SVG elements. This breaks the visual design.

WHY THIS HAPPENS:
- HexagonBreadcrumb component not rendering SVG properly
- stepColors not imported from cohive-theme.ts
- SVG element removed in HexagonBreadcrumb.tsx

WHERE TO FIX:
- Check /components/HexagonBreadcrumb.tsx SVG rendering
- Verify stepColors import from /styles/cohive-theme.ts`,
      expected: 'Each hexagon contains <svg> element with fill color from stepColors',
      received: `Missing SVG in ${missing.length} hexagon(s): ${missing.join(', ')}`,
    }),
    pass: () => '✓ All hexagons have SVG elements with proper color styling',
  },

  hexagonClickable: {
    fail: (nonClickable: string[]) => ({
      message: `✗ BROKEN: ${nonClickable.length} hexagon(s) not clickable. Navigation is broken for these hexes.

WHY THIS HAPPENS:
- Hexagons not wrapped in <button> elements
- onClick handlers missing or undefined

WHERE TO FIX:
- Check /components/ProcessFlow.tsx hex rendering
- Ensure each hexagon is wrapped: <button onClick={handleClick}><HexagonBreadcrumb /></button>`,
      expected: 'All hexagons wrapped in <button> elements with onClick handlers',
      received: `${nonClickable.length} non-clickable hexagons: ${nonClickable.join(', ')}`,
    }),
    pass: (count: number) => `✓ ${count} hexagons have click handlers for navigation`,
  },

  templateButton: {
    fail: () => ({
      message: `✗ BROKEN: "Manage Templates" button not found. Users cannot access template configuration.

WHY THIS HAPPENS:
- Button removed or commented out in ProcessWireframe.tsx
- Conditional rendering hiding the button
- Header not rendering properly

WHERE TO FIX:
- Check /components/ProcessWireframe.tsx header section
- Look for Settings icon button that opens TemplateManager
- Verify the button isn't hidden by conditional logic`,
      expected: '<button> with text "Manage Templates" in header',
      received: 'Button not found',
    }),
    pass: () => '✓ Template Settings button found in header navigation',
  },

  // ── Databricks Integration ────────────────────────────────────────────────────

  databricksAuth: {
    fail: () => ({
      message: `✗ NOT AUTHENTICATED: User is not authenticated with Databricks.

IMPACT:
- Cannot access real Knowledge Base
- Cannot save assessments to Databricks
- Using mock data instead of real data

WHERE TO CHECK:
- Look for 'databricks_authenticated' in localStorage
- Check if running in Figma Make (mock mode auto-enabled)
- Verify DatabricksAuthModal completed successfully`,
      expected: 'databricks_authenticated = "true" in localStorage',
      received: 'Not authenticated or mock mode active',
    }),
    warning: () => ({
      message: `⚠ WARNING: Not authenticated (may be in mock mode for Figma Make testing)`,
      expected: 'databricks_authenticated = "true"',
      received: 'null or false',
    }),
    pass: () => '✓ User authenticated with Databricks OAuth',
  },

  databricksToken: {
    fail: () => ({
      message: `✗ BROKEN: No access token in localStorage. API calls will fail.

WHY THIS HAPPENS:
- OAuth flow not completed
- Token expired and not refreshed
- Running in mock mode

WHERE TO FIX:
- Complete the Databricks OAuth authentication flow
- Check /utils/databricksAuth.ts token refresh logic
- Verify OAuth callback handler in OAuthCallback.tsx`,
      expected: 'databricks_access_token in localStorage',
      received: 'Token missing',
    }),
    pass: () => '✓ Access token stored and available',
  },

  databricksConfig: {
    fail: () => ({
      message: `⚠ No workspace configuration found.

WHY THIS HAPPENS:
- First run — configuration not yet fetched
- User not yet authenticated
- workspace-lookup API call failed

WHERE TO FIX:
- Complete OAuth flow to trigger workspace config fetch
- Check /api/databricks/workspace-lookup.js response
- Verify DATABRICKS_HOST env variable is set`,
      expected: 'databricks_config in localStorage with workspace info',
      received: 'null',
    }),
    pass: (name: string) => `✓ Workspace config loaded: ${name}`,
  },

  databricksSession: {
    fail: () => ({
      message: `✗ BROKEN: OAuth session (cohive_databricks_session) missing or expired.

WHERE TO FIX:
- Re-authenticate via the Databricks OAuth flow
- Check /utils/databricksAuth.ts getValidSession()
- Verify token expiry handling in the session manager`,
      expected: 'cohive_databricks_session in localStorage with valid expiry',
      received: 'Session missing or expired',
    }),
    pass: (email: string) => `✓ Valid session for ${email}`,
  },

  // ── Template System ────────────────────────────────────────────────────────────

  templatesStorage: {
    fail: () => ({
      message: `✗ BROKEN: No templates found in localStorage. Template system is not initialized.

WHY THIS HAPPENS:
- First-time user (no templates created yet)
- localStorage was cleared
- Default templates not loaded on first run

WHERE TO FIX:
- Check TemplateManager.tsx initialization code
- Verify default templates are created on first load
- Look for localStorage.setItem('cohive_templates', ...) in useEffect hooks`,
      expected: 'cohive_templates array with at least one default template',
      received: 'null — no templates in storage',
    }),
    pass: (count: number) => `✓ ${count} template(s) available in localStorage`,
  },

  templateRoles: {
    fail: (missing: number) => ({
      message: `✗ BROKEN: ${missing} template(s) missing required role property.

WHY THIS HAPPENS:
- Templates created before role system was added
- Migration not run on existing templates

WHERE TO FIX:
- Open TemplateManager.tsx and ensure all templates have a 'role' field
- Manually assign a role to existing templates via the Template Manager
- Check default template initialization includes role`,
      expected: 'All templates have role property (e.g. "marketing-manager")',
      received: `${missing} template(s) missing role`,
    }),
    pass: () => '✓ All templates have role assignments',
  },

  templateVisibility: {
    fail: () => ({
      message: `⚠ No templates have visibleSteps configured.

WHY THIS HAPPENS:
- Templates were created without visibility settings
- Default template doesn't set hex visibility

WHERE TO FIX:
- Open TemplateManager.tsx and add visibleSteps to template schema
- Ensure default templates include visibleSteps array
- Check ProcessWireframe.tsx for how visibleSteps controls hex display`,
      expected: 'Templates with visibleSteps array',
      received: 'No templates have visibleSteps',
    }),
    pass: (count: number) => `✓ ${count} template(s) have hex visibility configuration`,
  },

  // ── File Operations ────────────────────────────────────────────────────────────

  fileUpload: {
    fail: () => ({
      message: `✗ BROKEN: No file upload inputs found. Users cannot upload files.

WHY THIS HAPPENS:
- File upload component not rendering
- Conditional logic hiding upload inputs
- Wrong mode selected (upload only available in certain modes)

WHERE TO FIX:
- Check current Knowledge Base mode (upload in Synthesis/Workspace)
- Verify file input rendering in mode-specific components
- Check if user has permission to upload`,
      expected: 'At least 1 <input type="file"> element',
      received: '0 file inputs found',
    }),
    warning: () => ({
      message: `⚠ WARNING: No file inputs visible (may need to navigate to upload mode)`,
      expected: 'File input in Synthesis or Workspace mode',
      received: 'Not currently visible',
    }),
    pass: (count: number) => `✓ ${count} file upload input(s) available`,
  },

  researchFilesStorage: {
    fail: () => ({
      message: `⚠ No research files in localStorage (cohive_research_files).

WHY THIS HAPPENS:
- No files have been uploaded to the Knowledge Base yet
- Files exist in Databricks but not synced to localStorage

WHERE TO CHECK:
- Navigate to Knowledge Base > Synthesis mode to upload files
- Or connect to Databricks to sync files from the workspace`,
      expected: 'cohive_research_files array in localStorage',
      received: 'null',
    }),
    pass: (count: number) => `✓ ${count} research file(s) in localStorage`,
  },

  // ── AI Assessment Flow ─────────────────────────────────────────────────────────

  assessmentTypes: {
    fail: () => ({
      message: `✗ BROKEN: Assessment type buttons not found.

WHY THIS HAPPENS:
- CentralHexView not rendering assessment section
- Not on a persona hex (assessment only available on persona hexes)
- Component rendering error

WHERE TO FIX:
- Navigate to a persona hex (Colleagues, Luminaries, Consumers, etc.)
- Check /components/CentralHexView.tsx assessment button rendering
- Look for buttons with text "Assess", "Recommend", "Unified"`,
      expected: '3 assessment type buttons: Assess, Recommend, Unified',
      received: 'Buttons not found — may not be on persona hex',
    }),
    pass: (count: number) => `✓ ${count} assessment type buttons available`,
  },

  aiModelSelection: {
    fail: () => ({
      message: `⚠ No model template configured.

WHERE TO FIX:
- Open Model Template Manager (⚙ icon in header)
- Select a model endpoint for the current hex
- Check /components/ModelTemplateManager.tsx
- Verify cohive_model_templates is initialized in localStorage`,
      expected: 'cohive_model_templates with model IDs',
      received: 'null or unconfigured',
    }),
    pass: (model: string) => `✓ Model configured: ${model}`,
  },

  // ── Enter Hex ─────────────────────────────────────────────────────────────────

  enterBrand: {
    fail: () => ({
      message: `✗ BROKEN: Brand input field not found on Enter hex.

WHERE TO FIX:
- Check /components/CentralHexView.tsx for the Enter hex step content
- Verify input[placeholder*="Brand"] is rendered in step 1
- Check /data/stepContentData.ts for Enter hex question definitions`,
      expected: 'Brand name input field on Enter hex',
      received: 'Input not found',
    }),
    pass: () => '✓ Brand input field found and accessible',
  },

  enterProjectType: {
    fail: () => ({
      message: `✗ BROKEN: Project type selector not found.

WHERE TO FIX:
- Check /components/CentralHexView.tsx Enter hex rendering
- Look for select or [role="combobox"] for project type
- Verify systemProjectTypes are loaded from /data/systemProjectTypes.ts`,
      expected: 'Project type dropdown (select or combobox)',
      received: 'Selector not found',
    }),
    pass: () => '✓ Project type dropdown found',
  },

  // ── Knowledge Base ─────────────────────────────────────────────────────────────

  knowledgeBaseModes: {
    fail: (found: number) => ({
      message: `✗ BROKEN: Only ${found}/4 Knowledge Base modes found. Mode switching is incomplete.

EXPECTED MODES:
1. Synthesis — upload research, create insights
2. Personas — manage persona library
3. Read/Edit/Approve — file approval workflow
4. Workspace — admin-only Databricks operations

WHERE TO FIX:
- Check /components/ResearcherModes.tsx mode button rendering
- Verify role-based visibility (Workspace is admin-only)
- Look for mode state management and button onClick handlers`,
      expected: '4 mode buttons: Synthesis, Personas, Read/Edit/Approve, Workspace',
      received: `${found} mode buttons found`,
    }),
    pass: (count: number) => `✓ ${count} Knowledge Base modes available`,
  },

  kbWorkspaceAccess: {
    fail: (role: string) => ({
      message: `✗ BROKEN: Workspace mode visibility mismatch for role "${role}".

RULE: Workspace mode should ONLY be visible to administrators.

WHERE TO FIX:
- Check /components/ResearcherModes.tsx Workspace mode conditional rendering
- Verify the role check uses: role === 'administrator'
- Check ProcessWireframe.tsx for where userRole is determined`,
      expected: 'Workspace mode: admin-only',
      received: `Role: ${role} — visibility mismatch`,
    }),
    pass: (role: string, visible: boolean) =>
      `✓ Workspace mode correctly ${visible ? 'visible' : 'hidden'} for role "${role}"`,
  },

  kbFileTypeFilter: {
    fail: (mode: string) => ({
      message: `⚠ File type filter not testable in current mode.

CURRENT MODE: ${mode || 'unknown'}

WHERE TO FIX:
- Navigate to Knowledge Base > Read/Edit/Approve mode
- Then re-run Knowledge Base tests to verify filter buttons`,
      expected: 'Read/Edit/Approve mode active',
      received: `Current mode: ${mode}`,
    }),
    pass: (count: number) => `✓ ${count} file type filter(s) available`,
  },

  // ── Example Files (new feature) ────────────────────────────────────────────────

  exampleFilesCount: {
    fail: () => ({
      message: `⚠ No approved Example files found in Knowledge Base.

WHAT ARE EXAMPLE FILES?
Cross-brand quality/format reference documents used by AI to match output style.
They appear in the Enter hex for researcher roles.

HOW TO ADD EXAMPLE FILES:
1. Navigate to Knowledge Base
2. Open a research file and change its fileType to "Example"
   OR use "Upload as Example" button (researcher roles only)
3. The file is auto-processed and auto-approved

WHERE TO CHECK:
- cohive_research_files in localStorage
- Look for files where fileType === 'Example' AND isApproved === true
- Check /components/ResearcherModes.tsx handleUploadAsExample`,
      expected: 'At least 1 approved Example file in cohive_research_files',
      received: 'No Example files found',
    }),
    pass: (count: number) => `✓ ${count} approved Example file(s) in Knowledge Base`,
  },

  exampleFilesProcessed: {
    fail: (unprocessed: string[]) => ({
      message: `✗ BROKEN: ${unprocessed.length} Example file(s) not fully processed.

WHAT THIS MEANS:
Unprocessed Example files have no extracted text, so the AI cannot use them
as format references. They should have cleaningStatus === 'processed'.

WHY THIS HAPPENS:
- Processing model endpoint was not set when the file was uploaded
- Auto-process step in handleUploadAsExample or handleSaveKBChanges failed

WHERE TO FIX:
- Open the file in Knowledge Base > Read/Edit/Approve
- Manually trigger re-processing (select a model and click Process)
- Or re-upload via "Upload as Example" with a model endpoint configured
- Check /api/databricks/knowledge-base/process.js for errors`,
      expected: 'All Example files have cleaningStatus = "processed"',
      received: `Unprocessed: ${unprocessed.join(', ')}`,
    }),
    pass: (count: number) => `✓ All ${count} Example file(s) are processed and ready`,
  },

  exampleFilesRole: {
    fail: (role: string) => ({
      message: `⚠ Current role "${role}" cannot manage Example files.

ROLES THAT CAN MANAGE EXAMPLES:
- research-analyst
- research-leader
- data-scientist
- administrator

ROLES THAT CANNOT:
- marketing-manager
- product-manager

WHERE TO FIX:
- Switch to a researcher-level template to access Example file management
- Or use the administrator role
- Check ProcessWireframe.tsx canManageExamples constant`,
      expected: 'Role with canManageExamples=true',
      received: `Current role: ${role}`,
    }),
    pass: (role: string) => `✓ Role "${role}" can manage Example files`,
  },

  exampleFilesDocumentModel: {
    fail: (model: string) => ({
      message: `⚠ Current model "${model}" does not support document/multimodal input.

IMPACT:
Example files will be sent as extracted text only — the AI cannot see
the original PDF/DOCX/image layout. Use a document-capable model for
best results when formatting assessments to match an example.

DOCUMENT-CAPABLE MODELS:
- databricks-claude-sonnet-4-6 ✓
- databricks-claude-haiku-4-5 ✓
- databricks-gpt-5, gpt-5-1, gpt-5-2, gpt-5-mini ✓
- databricks-gemini-2-5-pro, gemini-2-5-flash, gemini-3-flash ✓

NON-DOCUMENT MODELS:
- databricks-llama-3-3-70b ✗
- databricks-qwen3-next-80b ✗
- databricks-gpt-5-nano ✗

WHERE TO FIX:
- Open Model Template Manager (⚙ icon)
- Switch to a document-capable model for this hex`,
      expected: 'Document-capable model (Claude/GPT/Gemini)',
      received: `Current model: ${model}`,
    }),
    pass: (model: string) => `✓ Model "${model}" supports document/multimodal input`,
  },

  exampleFilesEnterHex: {
    fail: () => ({
      message: `⚠ Example Files section not visible in Enter hex.

WHY THIS HAPPENS:
- No approved Example files exist yet (see exampleFilesCount test)
- User role does not have researcher permissions
- getExampleFiles() returning empty array in ProcessWireframe.tsx

WHERE TO FIX:
- Upload or designate at least one file as an Example (researcher role required)
- Navigate to Enter hex Step 3 / Define step to see Example file selector
- Check /components/ProcessWireframe.tsx getExampleFiles()`,
      expected: 'Example Files section visible in Enter hex for eligible roles',
      received: 'Section not visible',
    }),
    pass: (count: number) => `✓ ${count} Example file(s) visible in Enter hex selector`,
  },

  formatAsExampleButton: {
    fail: () => ({
      message: `⚠ "Format as Example" button not found.

WHY THIS HAPPENS:
- AssessmentModal not open (button only appears in assessment results)
- No assessment results to format yet
- Button hidden because no Example files exist

WHERE TO CHECK:
- Run an AI assessment on any persona hex
- After results appear, look for "Format as Example" in the AssessmentModal footer
- Verify /components/AssessmentModal.tsx includes the Format as Example button
- Check /api/databricks/ai/format-as-example.js is deployed`,
      expected: '"Format as Example" button in AssessmentModal footer',
      received: 'Button not found (normal if no assessment is open)',
    }),
    pass: () => '✓ "Format as Example" button found in assessment interface',
  },

  uploadAsExampleButton: {
    fail: () => ({
      message: `⚠ "Upload as Example" button not visible.

WHY THIS HAPPENS:
- User role does not have canManageExamples permission
  (requires: research-analyst, research-leader, data-scientist, administrator)
- Not in Knowledge Base hex
- ResearcherModes component not rendered

WHERE TO CHECK:
- Switch to a researcher role template
- Navigate to Knowledge Base hex
- Check /components/ResearcherModes.tsx handleUploadAsExample
- Verify canManageExamples prop is passed to ResearcherModes`,
      expected: '"Upload as Example" button in Knowledge Base (researcher roles)',
      received: 'Button not found (may be a non-researcher role)',
    }),
    pass: () => '✓ "Upload as Example" button found',
  },

} as const;

// ── Fix Suggestion Map ─────────────────────────────────────────────────────────

export function suggestFix(testId: string, _context?: unknown): string {
  const fixes: Record<string, string> = {
    'nav-hex-count': `
1. Open /components/ProcessFlow.tsx
2. Check processSteps array has all 13 hex definitions
3. Verify current template's visibleSteps includes all hexes
4. Check browser console for React component errors`,

    'nav-hex-colors': `
1. Open /components/HexagonBreadcrumb.tsx
2. Verify SVG element renders with fill={color}
3. Check stepColors import from /styles/cohive-theme.ts
4. Ensure color prop is passed to HexagonBreadcrumb`,

    'nav-template-btn': `
1. Open /components/ProcessWireframe.tsx header section
2. Look for Settings icon button that opens TemplateManager
3. Verify button is not hidden by conditional logic
4. Check for <Settings /> icon import from lucide-react`,

    'db-oauth': `
1. Click the Databricks connect button in the app header
2. Complete the OAuth authentication flow in the popup window
3. Verify VITE_DATABRICKS_CLIENT_ID and VITE_DATABRICKS_REDIRECT_URI env vars
4. Check /utils/databricksAuth.ts for session storage logic`,

    'db-token': `
1. Complete Databricks OAuth authentication
2. Check if token is stored in cohive_databricks_session (not databricks_access_token)
3. See /utils/databricksAuth.ts getValidSession()`,

    'template-storage': `
1. Open /components/TemplateManager.tsx
2. Check useEffect hook for default template initialization
3. Verify localStorage.setItem('cohive_templates', ...) is called
4. Create at least one template manually to initialize the system`,

    'template-roles': `
1. Open TemplateManager and edit each template
2. Ensure every template has a role field set
3. Check /components/TemplateManager.tsx template schema`,

    'template-visibility': `
1. Open /components/TemplateManager.tsx
2. Verify visibleSteps array is included in template object
3. Check ProcessWireframe.tsx for how visibleSteps controls hex display`,

    'files-upload': `
1. Navigate to Knowledge Base > Synthesis or Workspace mode
2. Check if user role allows file uploads
3. Verify <input type="file" /> element is in current mode
4. Check conditional rendering logic for upload inputs`,

    'kb-modes': `
1. Open /components/ResearcherModes.tsx mode button rendering section
2. Verify all 4 modes are defined in state
3. For Workspace mode: ensure user role is 'administrator'`,

    'kb-workspace-access': `
1. Check /components/ResearcherModes.tsx Workspace button conditional
2. Verify condition: userRole === 'administrator' || canManageExamples
3. Check current template's role in cohive_templates localStorage`,

    'ai-assessment-types': `
1. Navigate to a persona hex (Colleagues, Luminaries, Consumers, etc.)
2. Go to Step 2 (Define) or Step 3 (Enter) of the hex
3. Check /components/CentralHexView.tsx for Assess/Recommend/Unified buttons`,

    'example-files-count': `
1. Navigate to Knowledge Base hex
2. Use "Upload as Example" button (researcher role required)
   OR open any file → Change fileType to "Example" → Save
3. The file auto-processes and auto-approves
4. Check /components/ResearcherModes.tsx handleUploadAsExample
5. Verify cohive_research_files in localStorage has fileType:"Example" entries`,

    'example-files-processed': `
1. Navigate to Knowledge Base > Read/Edit/Approve mode
2. Find the Example file(s) with cleaningStatus !== 'processed'
3. Select a processing model and click "Process"
4. Or re-upload via "Upload as Example" — auto-process runs automatically
5. Check /api/databricks/knowledge-base/process.js for API errors`,

    'example-files-role': `
1. Open Template Manager in the app header
2. Switch to a researcher-level template:
   - research-analyst, research-leader, data-scientist, or administrator
3. Reload the page after switching templates`,

    'example-files-document-model': `
1. Open Model Template Manager (⚙ icon in header)
2. Select a document-capable model:
   - Claude: databricks-claude-sonnet-4-6 or claude-haiku-4-5
   - GPT: databricks-gpt-5, gpt-5-1, gpt-5-2, or gpt-5-mini
   - Gemini: databricks-gemini-2-5-pro, gemini-2-5-flash, or gemini-3-flash
3. Avoid Llama, Qwen, or gpt-5-nano for Example file use`,

    'example-files-enter-hex': `
1. Ensure you have at least one approved Example file (see example-files-count fix)
2. Navigate to Enter hex
3. Check that the Example file selector appears in the hex definition area
4. Verify /components/ProcessWireframe.tsx getExampleFiles() returns files
5. Check that the Enter hex renders the ExampleFile selector section`,

    'format-as-example-btn': `
1. Navigate to a persona hex (Colleagues, Luminaries, etc.)
2. Run an AI assessment (click Execute)
3. Wait for assessment results to appear
4. Look for "Format as Example" button in AssessmentModal footer
5. Verify /api/databricks/ai/format-as-example.js is deployed to Vercel`,
  };

  return fixes[testId] || 'No specific fix guidance available. Check browser console and component rendering.';
}

// ── Helper Utilities ───────────────────────────────────────────────────────────

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n\nStack trace:\n${error.stack || 'No stack trace available'}`;
  }
  return String(error);
}

/** Returns true if the model ID is in the document-capable set. */
export function isDocumentCapableModel(modelId: string): boolean {
  const DOCUMENT_CAPABLE = new Set([
    'databricks-claude-sonnet-4-6',
    'databricks-claude-haiku-4-5',
    'databricks-gpt-5-2',
    'databricks-gpt-5-1',
    'databricks-gpt-5',
    'databricks-gpt-5-mini',
    'databricks-gemini-3-1-pro',
    'databricks-gemini-2-5-pro',
    'databricks-gemini-3-flash',
    'databricks-gemini-2-5-flash',
  ]);
  return DOCUMENT_CAPABLE.has(modelId);
}

/** Returns true if the given role can manage Example files. */
export function canRoleManageExamples(role: string): boolean {
  return ['research-analyst', 'research-leader', 'data-scientist', 'administrator'].includes(role);
}
