/**
 * Documentation Loader
 *
 * Single source of truth for all CoHive feature documentation.
 * Used by the AI Help Widget to answer user questions accurately.
 *
 * Location: src/utils/documentationLoader.ts
 */

export const COHIVE_DOCUMENTATION = {

  // ══════════════════════════════════════════════════════════════════════════
  // WORKFLOW & NAVIGATION
  // ══════════════════════════════════════════════════════════════════════════

  workflowRules: `
# CoHive Workflow Overview

CoHive is a structured AI-powered analysis platform. Work flows through a sequence of hexagonal steps ("hexes"), each providing a different lens on your brand or project.

## Hex Sequence:
1. Enter (required first) — initialise your project
2. Research (Knowledge Base) — manage files and data
3. Luminaries — external expert perspectives
4. Panelist — consumer panel household insights
5. Consumers — buyer persona analysis
6. Competitors — competitive intelligence
7. Colleagues — internal stakeholder perspectives
8. Cultural — cultural voice analysis
9. Social Listening — social media analysis (coming soon)
10. Wisdom — contribute insights to the Knowledge Base
11. Grade (Test Against Segments) — score ideas against segments
12. Findings — save your work and generate summaries
13. Review (My Files) — review saved project files

## Rules:
- Enter is always first and must be completed before any other hex unlocks
- Findings is always last — it summarises everything
- All middle hexes are optional and can be run in any order, multiple times
- Results from earlier hexes carry forward as context into later ones
- You can navigate directly between hexes at any time

## Iteration Model:
- Each time you run a hex, it creates a new execution record
- Multiple executions per hex are tracked and kept in history
- Gems and Coal you save in any hex carry forward into subsequent hexes in the same iteration
- Save your iteration in the Findings hex to persist everything to Databricks
`,

  enterStep: `
# Enter Hex (Launch / Initialise Project)

The Enter hex must be completed before any other hex becomes available.

## Fields:
1. Brand — select from the dropdown or type a new brand name
2. Project Type — select from 20+ built-in types or custom types created by your Data Scientists
3. Filename — auto-generated as CoHive_Brand_ProjectType_Date_V1, editable
4. Ideas Source (non-War Games only) — choose:
   - "Get Inspired": AI generates new ideas from your Knowledge Base
   - "Load Current Ideas": Upload a file of existing ideas for the AI to assess or compare
5. Research Files — select approved KB files to use across all hexes in this iteration

## Important Notes:
- War Games mode skips the Ideas Source question entirely
- The filename increments automatically (V1, V2, V3) if you run multiple iterations on the same day
- Selected KB files are available to every hex in this iteration
- Both brand-specific and "Example" files can be selected; Example files are used as quality/format references only, not as evidence about your brand
- You can select multiple KB files — all are sent to the AI in every hex

## After Completing Enter:
- All other hexes unlock
- Your brand and project type appear as context throughout the workflow
`,

  warGames: `
# War Games Mode

War Games is a special project type for competitive simulation and scenario planning.

## Key Differences:
- Does NOT show the Ideas Source question (no Get Inspired / Load Ideas choice)
- Does NOT require Knowledge Base file selection in hex steps (though you can still use them)
- Shows "Skip to Assessment" option in competitor hex
- Competitor hex shows War Games-specific framing: scenario modelling, counter-strategies, offensive/defensive options

## How to Use:
1. In Enter, select "War Games" as your Project Type
2. Navigate to the Competitors hex
3. Select a competitor from the dropdown
4. Describe your scenario or strategic question
5. Execute to get war games analysis

## Best For:
- Competitive response planning ("What if Competitor X launches Y?")
- Defensive strategy development
- Market entry scenario planning
- Strategic what-if exercises
`,

  // ══════════════════════════════════════════════════════════════════════════
  // ASSESSMENT MODAL
  // ══════════════════════════════════════════════════════════════════════════

  assessmentModal: `
# Assessment Modal — How AI Analysis Works

When you click "Execute" in any hex, the Assessment Modal opens and runs your analysis.

## Settings Panel (appears before running):

### Knowledge Base Mode (KB Mode):
- KB Only (hard-forbidden): Every claim must cite a KB file. General knowledge strictly forbidden.
- KB Preferred (strong-preference): Strongly prefer KB files; general knowledge only when KB is completely silent on a point.
- KB + General (equal-weight, default): Both KB and general knowledge valid. All claims must be cited regardless of source.

### Information Scope:
- Brand: Brand-specific KB data only
- Category: Brand + category benchmarks
- General: Broad market knowledge + brand + category

## Request Mode (set in Enter hex, not the modal):
- Get Inspired: Personas generate new ideas from your KB
- Load Ideas: Personas assess or compare the ideas file you uploaded in Enter

## How the Analysis Runs:

### Round Structure:
1. Moderator Opening — frames the session, sets objectives and rules
2. Round 1 — all personas respond independently and simultaneously (no persona sees another's view yet)
3. Debate Rounds — personas reshuffled randomly, engage each other directly by name
4. Fact-Checker — audits all citations against your actual KB files
5. Moderator Synthesis — decisive final recommendations with citations
6. Neutral Summary — separate summariser generates a clean, neutral summary

Rounds continue until complete — there is no fixed limit on debate rounds.

### Anti-Sycophancy:
Personas are explicitly instructed not to compliment each other. Disagreement between personas is valuable and preserved — not smoothed over. The Moderator names tensions and resolves them decisively.

### What Each Persona Receives in Their Prompt:
- Their full identity and expert worldview
- The hex-specific Purpose, Style, and Approach framing
- KB Mode instructions with your specific file list
- Your full KB file content
- Project type prompt for your selected project type
- Prior Gems (directions you liked) as calibration
- Coal (directions to avoid) as explicit exclusions
- Prior hex results from this iteration (context continuity)
- Base layer rules: role clarity, round structure, anti-sycophancy

## Gems and Coal in the Modal:
- Highlight any text in the results → floating "Gem 💎" and "Coal 🪨" buttons appear
- Save as Gem: marks this direction as one to pursue in future prompts
- Save as Coal: marks this direction as one to actively avoid in future prompts
- Gem and coal counts shown in the modal header

## After the Assessment:
- Rounds tab: browse all rounds including Fact-Checker and Moderator Synthesis
- Summary tab: read the neutral summary
- "Accept & Close" passes results back to the hex page
`,

  assessmentTypes: `
# Assessment Types

Each hex offers three assessment modes. Choose in Step 2 of the hex before executing.

## Assess:
- Evaluates your KB content against the selected personas or context
- Critical analysis: what is working, what is not, what is missing
- Focus: "where are we now?"

## Recommend:
- Generates specific recommendations and action items
- Forward-looking: "what should we do?"
- Every recommendation must cite KB evidence or flag general knowledge

## Unified:
- Combines assessment and recommendations in one pass
- Most comprehensive — best for executive summaries and presentations
- Personas evaluate current state then immediately generate recommendations

## Multiple Selections:
You can select both Assess and Recommend. Unified replaces the need for both separately.
`,

  // ══════════════════════════════════════════════════════════════════════════
  // PERSONA HEXES
  // ══════════════════════════════════════════════════════════════════════════

  personaHexes: `
# Persona Hexes — Common Structure

Luminaries, Consumers, Panelist, Colleagues, Cultural, and Grade all follow a 2-step structure:

## Step 1: Select Personas
- Browse persona library organised by category
- Expand categories to see specific personas
- Select one or more — each responds from their distinct viewpoint

## Step 2: Choose Assessment Type
- Assess, Recommend, or Unified
- Click Execute to run

## After Running:
- Results appear in the execution history panel below
- Save a Gem: click "Highlight elements you like" (gem icon) to mark good directions
- Save Coal: click "Flag elements you want to avoid" (🪨 icon) to exclude bad directions
- Send Recommendations to Knowledge Base: saves a recommendation directly to your KB

## How Personas Respond:
- Round 1: All selected personas respond independently — no groupthink, no coordination
- Round 2+: Personas are reshuffled randomly, engage each other directly by name
- No sycophancy — personas challenge each other based on their actual worldviews
- The Moderator frames each round and closes with a decisive synthesis
`,

  luminariesHex: `
# Luminaries Hex (External Experts)

Luminaries are industry legends, thought leaders, and domain authorities.

## Available Luminaries:
Advertising legends: David Ogilvy, Bill Bernbach, Leo Burnett, Mary Wells Lawrence, Dan Wieden, Lee Clow, Jeff Goodby, Alex Bogusky, George Lois, Margaret Johnson, Rich Silverstein
Modern thinkers: Seth Godin, Byron Sharp, Rory Sutherland
Designers: Paula Scher
Business leaders: Steve Jobs, Estée Lauder, Mary Kay Ash, Oprah Winfrey
Creative directors: Dave Trott, John Hegarty, Greg Hahn, Tiffany Rolfe
Direct response: Claude Hopkins, Drayton Bird, Joseph Sugarman, Eugene Schwartz, Rosser Reeves, Russell Colley
Others: Don Draper, Willy Wonka, Tech CTO

## What Makes Luminaries Different:
- Each responds from their specific philosophy — Bill Bernbach challenges anything not grounded in human truth; Byron Sharp challenges anything that contradicts evidence-based marketing
- Disagreements between Luminaries are preserved as strategic signals, not resolved
- In debate rounds, they challenge each other directly by name using their own frameworks

## How to Use:
1. Select 2-5 Luminaries for productive debate
2. Choose Unified for the most complete output
3. Read the Moderator Synthesis for the decisive recommendation
`,

  consumersHex: `
# Consumers Hex (Buyer Personas)

Consumer personas represent specific buyer types with distinct purchase behaviours.

## Persona Categories:
B2C: Heavy Buyers, Medium Buyers, Light Buyers, Loyal Buyers, Brand Switchers (Triers), Non-Buyers
B2B: Department Buyers, Procurement, SMB decision makers
Alcohol/beverage specific: Heavy Alcohol Users, Light Alcohol Users, RTD buyers, Premium buyers, Social drinkers, Health-conscious drinkers

## How They Respond:
- Speak from lived purchase experience, not as analysts
- Give honest reactions: what would actually change their behaviour, what barriers exist
- In debate rounds, directly compare household and purchase realities

## Best Used For:
- Validating whether messaging resonates with real buyers
- Identifying purchase barriers the brand has not addressed
- Understanding which segments need different strategies
`,

  panelistHex: `
# Panelist Hex (Panel Homes)

Panelist personas represent specific household types, evaluating work through the lens of real domestic life.

## Focus:
- How products and brands fit into household routines
- Household decision-making dynamics (who decides, when, how)
- Usage occasions and domestic context
- Family dynamics affecting purchase and usage

## Available Personas:
- Millennial Parent household (more being added)

## How They Respond:
- Speak from their specific household context — not abstract consumer preferences
- Compare household realities directly in debate rounds
- Surface where brands assume a household context that does not match reality
`,

  colleaguesHex: `
# Colleagues Hex (Internal Stakeholders)

Colleague personas represent internal stakeholders evaluating strategy from their functional perspective.

## Available Colleagues:
C-Suite: CMO, CEO, CFO, CTO
Directors: Sales Director, Product Director, Operations Director
Managers: Brand Manager, Marketing Manager, Product Manager, Sales Manager, CS Manager, Sales Rep, Support Lead
Engineers: Engineer Lead, Engineer Architect, Product Owner

## What They Surface:
- Organisational feasibility: can we actually deliver this?
- Resource and budget realities
- Cross-functional dependencies
- What needs to be true internally for this strategy to succeed

## How They Respond:
- Speak from functional responsibility, not as neutral analysts
- Surface real constraints without diplomatic softening
- In debate rounds, expose cross-functional tensions that strategy must resolve
`,

  culturalHex: `
# Cultural Hex (Cultural Voices)

Cultural personas represent specific communities, generations, and value systems.

## Available Cultural Personas:
Generational: Gen Z Activist, Gen Z Creator, Gen Z Entrepreneur, Millennial Influencer, Millennial Professional
Values-based: Eco Advocate, Mindfulness Seeker
Lifestyle: Urban Artist, Suburban Family, Rural Community, Tech Innovator, Gamer

## What They Surface:
- Whether the brand's assumptions about culture hold for their community
- Potential misreadings or unintended signals in messaging
- What would need to change for genuine cultural resonance
- Dimensions the strategy has ignored

## How They Respond:
- Speak from their specific community position
- Are direct about what lands and what misfires
- Compare cultural readings directly in debate rounds
`,

  competitorsHex: `
# Competitors Hex (Competitive Analysis)

## Standard Mode (non-War Games):
1. Select a competitor from the dropdown
2. Choose an analysis type: Compare Assets, Strengths/Weaknesses, Propose Improvements, or Unified
3. Execute

## War Games Mode:
1. Select a competitor
2. Describe your scenario or strategic question
3. Execute to model competitive responses, defensive options, and offensive moves

## What the AI Produces:
- Where the brand is genuinely differentiated vs exposed
- Competitive moves competitors would most likely make
- Defensive positions worth holding
- Offensive moves the brand should make first
- KB evidence for every competitive claim

## Running Multiple Analyses:
Run the same hex multiple times with different competitors — all executions kept in history.
`,

  gradeHex: `
# Grade Hex (Test Against Segments)

Tests your strategy, ideas, or messaging against specific market segments.

## How It Works:
1. Select the segments to test against (cultural voices, consumer types, etc.)
2. Choose assessment type (Assess, Recommend, Unified)
3. Execute — each segment evaluates the work from their specific reality

## What It Surfaces:
- Where strategies have genuine cross-segment appeal
- Where adaptations are required for specific segments
- Where strategies risk alienating specific groups
- Segment-specific scores with explicit rationale

## Best Used For:
- Before launching campaigns to check for unintended readings
- Identifying which segments need different messaging
- Validating whether a universal strategy actually works universally
`,

  // ══════════════════════════════════════════════════════════════════════════
  // KNOWLEDGE BASE
  // ══════════════════════════════════════════════════════════════════════════

  knowledgeBaseAccess: `
# Knowledge Base Access Policy

## Who Can See Files:
- All authenticated users can VIEW all files (approved and pending)

## Who Can USE Files in Hexes:
- Research Analysts and Leaders: can use all files (approved and pending)
- Non-Researchers: can only use APPROVED files

## Who Can APPROVE Files:
- Research Leaders and Administrators only

## Who Can UPLOAD Files:
- All authenticated users (via Wisdom hex or Synthesis mode)

## File Types:
- Synthesis: strategic documents, research reports
- Wisdom: insights contributed by users
- Findings: saved iteration outputs
- Research: raw data files
- Persona: persona definition files
- Example: cross-brand reference files — used for quality/format guidance only, never cited as evidence about your brand
`,

  knowledgeBaseApproval: `
# Knowledge Base — Read/Edit/Approve Mode

This mode is where Research Leaders process and approve files.

## File Status Flow:
1. Uploaded → "uncleaned" (needs processing)
2. Processed → AI generates summary → "processed" (ready to approve)
3. Approved → available to all users in hex file selectors

## What You Can Do:

### Read:
- Click any file in the list to open a preview
- Read AI-generated content summary and full file content

### Edit (Research Leaders only):
- Edit filename, content summary, brand, project type, file type, tags, content date
- Mark as Example file (for cross-brand reference use)
- All edits save immediately and refresh the file list automatically

### Approve/Unapprove (Research Leaders only):
- Click "Approve File" in the preview panel or use the toggle in the file list
- Approved files immediately appear in hex file selectors for all users
- You can unapprove an approved file
- File list refreshes automatically after every approval or unapproval

### Process Files:
- Files must be processed before approval
- Select files with checkboxes → click "Process Selected"
- AI generates content summary and suggested tags

### Rename:
- Click the rename icon next to any filename
- File list refreshes automatically after rename

### Delete:
- Click "Reject/Delete" in the preview panel
- Both pending and approved files can be deleted
- File list refreshes automatically after deletion

## File Size Limit:
- Maximum upload: 37MB per file
- Files larger than 37MB are rejected immediately with a clear error message
- Supported formats: PDF, DOCX, XLSX, CSV, TXT, MD, images, audio, video, PPTX
`,

  researchModes: `
# Knowledge Base Hex — All Modes

## Synthesis Mode:
- Upload new files from your computer
- Import files from your Databricks workspace
- Set brand and project type during upload

## Personas Mode:
- Create and manage persona definition files
- Upload persona documents for specific hexes

## Read/Edit/Approve Mode:
- Process, edit, and approve pending KB files
- Full preview, editing, approval, and deletion
- All actions trigger immediate automatic refresh of the file list

## Workspace Mode (Data Scientists only):
- Browse the Databricks file system directly
- Advanced file operations

## Custom Prompt Mode (Data Scientists only):
- Create custom project types with tailored AI prompts
- Custom project types appear in the Enter hex dropdown for all users
- Must have unique names — cannot duplicate any of the 20 system project types
`,

  exampleFiles: `
# Example Files

Example files are a special file type used as quality and format references — not as evidence about your brand.

## What They Are:
- Cross-brand reference documents
- Show the expected quality, tone, and structure of good outputs
- Help the AI understand what "good" looks like for your project type

## How They Work in Assessments:
- The AI receives a clear notice: "Cross-brand reference — quality standard only. Do NOT cite as evidence about [your brand]."
- Never cited as [Source: filename] in assessment output
- Used only to calibrate quality and format

## How to Create an Example File:
- Upload any file in Synthesis mode
- In Read/Edit/Approve, open the file and tick "Mark as Example file"
- Or set file type to "Example" during upload

## In the Enter Hex:
- Example files appear in a separate amber-highlighted section below regular research files
- Clearly labelled with "✦ Example Files"
`,

  // ══════════════════════════════════════════════════════════════════════════
  // GEMS AND COAL
  // ══════════════════════════════════════════════════════════════════════════

  gemsAndCoal: `
# Gems and Coal — Directional Feedback System

Gems and Coal carry your preferences forward into all subsequent prompts within an iteration.

## Gems 💎 — Keep This Direction

A Gem marks text, ideas, or directions you want more of.

### How to Save a Gem:
- In the Assessment Modal: highlight any text → floating "Gem 💎" button → click to save
- On any hex page: click "Highlight elements you like" (gem hexagon icon) → type or paste → click "Save Gem"

### What Gems Do:
- Injected into every subsequent persona and moderator prompt as "PRIOR GEMS — EXAMPLES GOING IN THE RIGHT DIRECTION"
- Tell the AI: produce more outputs of this quality and in this direction
- Directional calibration — not hard constraints

## Coal 🪨 — Avoid This Direction

Coal marks text, directions, framings, or themes you want explicitly excluded.

### How to Save Coal:
- In the Assessment Modal: highlight any text → floating "Coal 🪨" button → click to save
- On any hex page: click "Flag elements you want to avoid" (🪨 icon) → type or paste → click "Save Coal"

### What Coal Does:
- Injected into every subsequent persona and moderator prompt as "COAL — DIRECTIONS AND THEMES TO ACTIVELY AVOID"
- The AI is explicitly told not to echo, build on, or move toward these directions
- Other personas are instructed to challenge any persona that moves into coal territory

## Iteration Scope:
- Gems and Coal accumulate across all hexes in the same iteration
- Cleared when you navigate back to Enter (starting a new iteration)
- Cleared when you Save Iteration in Findings

## Storage:
- Gems are saved to Databricks (gems table) and persist across sessions
- Coal is stored in-memory for the current iteration only (not persisted to Databricks)
`,

  // ══════════════════════════════════════════════════════════════════════════
  // WISDOM HEX
  // ══════════════════════════════════════════════════════════════════════════

  wisdomHex: `
# Wisdom Hex

The Wisdom hex lets users contribute insights and expertise to the shared Knowledge Base.

## Input Methods:

### Text:
- Type your insight into the textarea
- Click "Save to Knowledge Base"
- Microphone icon enables voice-to-text dictation

### Voice:
- Click "Start Recording", speak, click "Stop"
- Saves automatically as audio file to KB

### Photo:
- "Upload Photo" from your device, or "Capture with Camera" in the browser

### Video:
- "Upload Video" from your device, or "Record Video" in the browser

### File:
- Upload any document: PDF, Word, Excel, PowerPoint, Text, CSV
- Maximum 37MB per file
- Saved directly to KB — process and approve in Read/Edit/Approve before others can use it

### Interview:
- Click "Start Interview"
- AI interviewer asks targeted questions based on your brand and project context
- Conversation is transcribed automatically
- AI generates a structured summary at the end
- You can edit the summary before saving
- Both the full transcript and summary are saved to KB

## After Saving:
- Files appear in KB with status "uncleaned"
- A Research Leader must process and approve before the file appears in hex file selectors
- Files are tagged with insight type: Brand, Category, or General
`,

  // ══════════════════════════════════════════════════════════════════════════
  // FINDINGS HEX
  // ══════════════════════════════════════════════════════════════════════════

  findingsHex: `
# Findings Hex

The Findings hex saves your work and generates summaries.

## Save Iteration:
- Saves all hex responses and results from the current iteration to Databricks
- Follows the filename set in Enter (CoHive_Brand_ProjectType_Date_V1)
- File appears in My Files (Review) after saving
- Clears Gems and Coal for the next iteration
- Available only if at least one hex has been executed

## Summarise:
1. Select the iteration files to include
2. Choose output options: Executive Summary, all ideas as a list, ideas grid with scores, Include Gems, Include user notes as appendix
3. Choose output method:
   - Read: opens in an in-app markdown viewer
   - Save to Databricks Workspace: saves as .json to your workspace
   - Download to Computer: downloads as .json file

## Tips:
- Must be signed into Databricks to Save Iteration
- Summarise can combine multiple iteration files for cross-iteration views
- Save frequently — unsaved work is lost if the browser closes
`,

  // ══════════════════════════════════════════════════════════════════════════
  // USER ROLES
  // ══════════════════════════════════════════════════════════════════════════

  userRoles: `
# User Roles and Permissions

## Administrator / Research Leader:
- Full access to all features
- Can approve, reject, and delete KB files
- Can edit all file metadata
- Can use all files (approved and pending) in hexes

## Research Analyst:
- Can upload files to KB
- Can view and read all files
- Can use all files (approved and pending) in hexes
- Cannot approve or delete files

## Data Scientist:
- Access to Workspace mode (Databricks file browsing)
- Access to Custom Prompt mode (create custom project types)
- Can configure AI models per hex via Model Templates

## Non-Researcher (Marketing Manager, Product Manager, Executive, etc.):
- Can view all KB files
- Can only USE approved files in hexes
- Can run analyses and save findings
- Cannot upload (in some configurations), approve, or delete files
- Can contribute wisdom via the Wisdom hex

## Changing Your Role:
- Click "Manage Templates" in the left sidebar
- Select a different template to change your active role
`,

  // ══════════════════════════════════════════════════════════════════════════
  // PROJECT TYPES
  // ══════════════════════════════════════════════════════════════════════════

  projectTypes: `
# Project Types

CoHive has 20 built-in system project types with optimised AI prompts:

1. Creative Messaging — message clarity, brand voice, emotional impact
2. Product Launch — market readiness, positioning, launch timeline
3. War Games — competitive scenarios, counter-strategies, offensive/defensive options
4. Packaging — visual appeal, shelf presence, brand alignment, sustainability
5. Brand Strategy — positioning, differentiation, architecture, equity
6. Market Research — consumer insights, trends, segmentation, purchase drivers
7. Innovation Pipeline — opportunity spaces, unmet needs, concept testing
8. Big Idea — conceptual strength, originality, scalability, emotional connection
9. Unique Assets — distinctive brand elements, ownable assets, recognition
10. Customer Experience — journey mapping, friction points, omnichannel
11. How Do We Say and Do Things that Make Us Unique — brand expression, voice
12. Retail Strategy — channel strategy, in-store execution, shopper marketing
13. Content Strategy — content themes, audience needs, distribution channels
14. Crisis Management — risk identification, response protocols, reputation
15. Partnership Strategy — strategic fit, co-creation, brand alignment
16. Sustainability Initiative — environmental impact, ESG, circular economy
17. Rebranding — rationale, equity transfer, visual identity, implementation
18. Market Entry — attractiveness, barriers, entry mode, localisation
19. Customer Segmentation — criteria, segment size, profitability, personas
20. Brand Health Tracking — awareness, associations, equity trends, diagnostics

## Custom Project Types (Data Scientists only):
- Created via Knowledge Base → Custom Prompt mode
- Must have unique names — cannot duplicate any system type
- Available to all users once created
`,

  // ══════════════════════════════════════════════════════════════════════════
  // REVIEW HEX
  // ══════════════════════════════════════════════════════════════════════════

  reviewHex: `
# Review Hex (My Files)

Shows all project iteration files saved via the Findings hex.

## What You See:
- All files saved with "Save Iteration" in Findings
- Organised by brand and project type
- Filename, date, and version number

## Actions:
- Click any file to view its full contents
- Delete files you no longer need

## Tips:
- Files are named CoHive_Brand_ProjectType_Date_V# and persist across sessions
- Multiple iterations of the same project appear as V1, V2, V3, etc.
- These files can be re-selected in the Findings Summarise feature
`,

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL & TROUBLESHOOTING
  // ══════════════════════════════════════════════════════════════════════════

  databricksIntegration: `
# Databricks Integration

CoHive uses Databricks for all persistent storage and AI execution.

## Authentication:
- Sign in via OAuth button in the Enter hex or left sidebar
- Session persists until browser tab is closed
- Green "Connected to Databricks" banner confirms active connection

## Storage:
- KB files: Databricks Unity Catalog Volume
- File metadata: knowledge_base.cohive.file_metadata
- Gems: knowledge_base.cohive.gems
- Activity log: knowledge_base.cohive.activity_log

## AI Execution:
- All assessments run via Databricks Model Serving endpoints
- Configurable model per hex via Model Templates
- Every prompt is fully logged to activity_log with element-level attribution
- Prompts show which source file and function produced each element

## Mock Mode:
- Automatically activates in Figma Make preview environment
- Bypasses all Databricks calls and uses mock data for testing
`,

  troubleshootingAuth: `
# Authentication Troubleshooting

## "Please sign in to Databricks":
- Click the blue "Sign In to Databricks" button in the Enter hex
- Complete the OAuth popup window
- If popup is blocked, allow popups for this site in your browser settings
- Green "Connected to Databricks" banner confirms success

## "Session expired" or files stopped loading:
- Click "Log Out" in the left sidebar, then sign back in
- Clear browser cache if the problem persists

## "Cannot connect to Databricks":
- Check your network or VPN connection
- Verify you can open Databricks directly in another browser tab
- Contact your administrator if the problem continues
`,

  troubleshootingFiles: `
# File and Upload Troubleshooting

## "413 Payload Too Large" or file rejected:
- Your file exceeds the 37MB limit
- Split the document, compress it, or convert to a smaller format
- The check runs before upload — no data is wasted on a failed upload

## "Upload failed":
- Check your Databricks connection (green banner should be showing)
- Verify file format is supported: PDF, DOCX, XLSX, CSV, TXT, MD, PNG, JPG, MP3, MP4, WebM, PPTX
- Try a smaller test file

## "No files showing" / "0 files":
- Check you are signed into Databricks
- Non-researchers only see approved files — check if files need approval
- Click the Refresh button in Read/Edit/Approve mode

## "Cannot use this file in the hex":
- File must be approved before non-researchers can use it
- Only Research Leaders can approve files
- Ask your Research Leader to approve in Read/Edit/Approve mode

## "File content not displaying" in preview:
- File needs AI processing first
- Go to Read/Edit/Approve, find the file, and click "Process"
- After processing, the content summary appears and the file can be approved
`,

};

/**
 * Get all documentation as a single formatted string
 */
export function getAllDocumentation(): string {
  return Object.entries(COHIVE_DOCUMENTATION)
    .map(([, content]) => content.trim())
    .join('\n\n---\n\n');
}

/**
 * Get a specific documentation section
 */
export function getDocumentation(section: keyof typeof COHIVE_DOCUMENTATION): string {
  return COHIVE_DOCUMENTATION[section].trim();
}

/**
 * Get documentation relevant to a specific hex/page.
 */
export function getDocumentationForHex(hexId: string): string {
  const hexDocMap: Record<string, (keyof typeof COHIVE_DOCUMENTATION)[]> = {
    'Enter':       ['enterStep', 'warGames', 'workflowRules', 'knowledgeBaseAccess', 'exampleFiles'],
    'research':    ['researchModes', 'knowledgeBaseApproval', 'knowledgeBaseAccess', 'exampleFiles', 'userRoles'],
    'Wisdom':      ['wisdomHex'],
    'Findings':    ['findingsHex', 'gemsAndCoal'],
    'review':      ['reviewHex'],
    'Luminaries':  ['luminariesHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'Consumers':   ['consumersHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'panelist':    ['panelistHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'Colleagues':  ['colleaguesHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'cultural':    ['culturalHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'competitors': ['competitorsHex', 'warGames', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'Grade':       ['gradeHex', 'personaHexes', 'assessmentModal', 'assessmentTypes', 'gemsAndCoal'],
    'social':      ['assessmentTypes', 'assessmentModal'],
  };

  const relevantSections = hexDocMap[hexId] || ['workflowRules', 'assessmentTypes', 'assessmentModal'];

  return relevantSections
    .map(section => COHIVE_DOCUMENTATION[section as keyof typeof COHIVE_DOCUMENTATION]?.trim() || '')
    .filter(Boolean)
    .join('\n\n---\n\n');
}

/**
 * Search documentation for relevant content
 */
export function searchDocumentation(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const results: string[] = [];
  Object.entries(COHIVE_DOCUMENTATION).forEach(([, content]) => {
    if (content.toLowerCase().includes(lowerQuery)) {
      results.push(content.trim());
    }
  });
  return results;
}

/**
 * Get a list of all available documentation topics
 */
export function getDocumentationIndex(): string {
  return Object.keys(COHIVE_DOCUMENTATION)
    .map(key => `- ${key}`)
    .join('\n');
}
