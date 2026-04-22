# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build → dist/
```

There is no lint or test script configured. Type-check manually via the TypeScript compiler if needed.

## Architecture Overview

CoHive is a **React + TypeScript SPA** deployed on **Vercel** that provides a hexagonal-workflow AI assessment tool backed by **Databricks** (model serving + SQL warehouse + file storage).

### Frontend (`src/`)

**Entry and routing** — `src/App.tsx` guards the app behind a simple login check (`localStorage.cohive_logged_in`), then routes to `ProcessWireframe` for the main workflow or `OAuthCallback` for the Databricks OAuth return.

**Main workflow** — `src/components/ProcessWireframe.tsx` is the central orchestrator. It owns most of the application state: brands, project types, research files, templates, model selections, hex responses, and iteration gems. It launches the `AssessmentModal` when a user triggers an AI assessment.

**AI assessment execution** — `src/components/AssessmentModal.tsx` constructs the full AI prompt at runtime by combining:
1. The project-type prompt (from `src/data/systemProjectTypes.ts` or a user-defined config fetched from Databricks)
2. Hex context and questions (from `src/data/stepContentData.ts`)
3. User responses and selected research file content
4. Persona instructions

It calls `executeAIPrompt()` / `streamAIResponse()` from `src/utils/databricksAI.ts`, which POSTs to the backend API routes.

**Other key components:**
- `CentralHexView.tsx` — 3-step workflow within each hex (Explore → Define → Enter)
- `InterviewDialog.tsx` — multi-turn wisdom interview; system prompt is hardcoded in the component
- `ResearcherModes.tsx` — knowledge base management and synthesis; builds synthesis prompts inline
- `TemplateManager.tsx` — controls which hexes are visible per user role (stored in `localStorage.cohive_templates`)
- `ModelTemplateManager.tsx` — per-hex AI model selection (stored in `localStorage.cohive_model_templates`)

**Utilities:**
- `src/utils/databricksAuth.ts` — OAuth 2.0 session management; sessions stored in `localStorage.cohive_databricks_session`
- `src/utils/databricksAPI.ts` — all Databricks data operations (KB upload/list/download, summary generation, project-type configs)
- `src/utils/databricksAI.ts` — thin fetch wrappers over `/api/databricks/ai/*`; exports `executeAIPrompt()`, `streamAIResponse()`, and the `AIConversation` class for multi-turn flows
- `src/utils/mockMode.ts` — mock/Figma-Make mode flag

**Models layer (`src/models/`):**
- `registry.ts` — single source of truth for all available Databricks-served model IDs; add new models here
- `base.ts` — shared TypeScript interfaces (`Message`, `ModelInvokeParams`, `ModelInvokeResult`, etc.)
- `factory.ts` — returns a `DatabricksModel` instance given a model ID
- `databricks_model.ts` — the model class that calls Databricks serving endpoints

### Backend (`api/`)

Vercel serverless functions — each `.js` or `.ts` file under `api/` becomes an API route.

**Config** — `api/config.ts` exports `getDatabricksConfig()` and `getOAuthConfig()`. Every API handler that needs Databricks credentials should call `getDatabricksConfig()` at the top rather than reading `process.env` directly.

**Key routes:**
| Route | Purpose |
|---|---|
| `api/databricks/ai/prompt.js` | One-shot AI prompt execution |
| `api/databricks/ai/agent.js` | Agentic AI with KB/SQL tools |
| `api/databricks/ai/summarize.js` | File summarization |
| `api/databricks/assessment/run.js` | Full assessment run |
| `api/databricks/auth.js` | OAuth token exchange |
| `api/databricks/knowledge-base/process.js` | File processing with AI (metadata extraction prompt is hardcoded here) |
| `api/databricks/knowledge-base/upload.js` | Upload files to Databricks |
| `api/databricks/gems/save.js` | Save iteration gem results |
| `api/databricks/config/brands-projects.js` | Fetch brand/project config |
| `api/databricks/workspace-lookup.js` | Resolve workspace host |

### Prompt System

Prompts are distributed across multiple locations — see `src/PROMPT_SYSTEM_ARCHITECTURE.md` for the full flow diagram.

- **Assessment prompts** — built dynamically in `AssessmentModal.tsx`
- **Interview system prompt** — hardcoded in `InterviewDialog.tsx`
- **KB metadata-extraction prompt** — hardcoded in `api/databricks/knowledge-base/process.js`
- **Synthesis prompts** — built inline in `ResearcherModes.tsx`
- `src/data/prompts/` — a structured prompt template library that exists but is **not yet integrated** into the assessment flow

### Data Files

- `src/data/systemProjectTypes.ts` — 20+ built-in read-only project type prompts (Creative Messaging, War Games, Brand Essence, etc.)
- `src/data/stepContentData.ts` — questions and UI text for each hex
- `src/data/personas.ts` / `personaContentData.ts` — persona definitions used in assessments

## Environment Variables

Set in `.env` locally; in Vercel project settings for deployment.

**Server-side (API routes):**
```
DATABRICKS_HOST          # e.g. adb-1234567890.azuredatabricks.net
DATABRICKS_TOKEN         # PAT or service principal token
DATABRICKS_WAREHOUSE_ID  # SQL warehouse ID
CLIENT_NAME              # Display name e.g. "Nike"
CLIENT_SCHEMA            # Databricks schema (defaults to 'cohive')
DATABRICKS_CLIENT_ID     # OAuth app client ID
DATABRICKS_CLIENT_SECRET # OAuth app client secret
DATABRICKS_REDIRECT_URI  # OAuth redirect URI
```

**Client-side (`VITE_` prefix, exposed to browser):**
```
VITE_DATABRICKS_CLIENT_ID     # OAuth client ID (public)
VITE_DATABRICKS_REDIRECT_URI  # OAuth redirect URI (public)
```

## Path Alias

`@` resolves to `src/` (configured in `vite.config.ts`). Use `@/components/...`, `@/utils/...`, etc.

## Deployment

The app deploys to Vercel. `vercel.json` routes all requests to `/` (SPA), enables `api/**` as serverless functions, and sets `buildCommand: vite build` with `outputDirectory: dist`.
