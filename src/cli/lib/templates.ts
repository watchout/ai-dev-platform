/**
 * Template generators for project initialization files.
 * Based on: 09_TOOLCHAIN.md, templates/project/CLAUDE.md, templates/project/.cursorrules
 */

import type { ProfileType } from "./profile-model.js";

export interface ProjectConfig {
  projectName: string;
  description: string;
  profileType?: ProfileType;
}

export function generateClaudeMd(config: ProjectConfig): string {
  const today = new Date().toISOString().split("T")[0];

  return `# CLAUDE.md - Project Instructions (for Claude Code)

> Claude Code reads this file automatically.
> All specifications are in docs/.

---

## AI Interruption Protocol (Highest Priority Rule)

Stop immediately and ask the user in these cases:

1. A specification decision is needed but not in SSOT
2. SSOT wording is ambiguous with multiple interpretations
3. Multiple valid technical approaches exist
4. Contradiction between SSOT and existing implementation
5. Coding standards do not cover the current case
6. Impact scope of a change is unclear
7. A business decision is required

"Guessing" and "just use a placeholder" are PROHIBITED.

## Project Overview

| Item | Value |
|------|-------|
| Product | ${config.projectName} |
| Description | ${config.description} |
| Created | ${today} |
| Tech Stack | Next.js 15 / React 19 / TypeScript / Vitest / Vercel |

---

## Specification Reference

### Before implementation, always check (in order):

\`\`\`
1. Feature specs       -> docs/design/features/
2. Core definitions    -> docs/design/core/
   - UI/State          -> docs/design/core/SSOT-2_UI_STATE.md
   - API rules         -> docs/design/core/SSOT-3_API_CONTRACT.md
   - Data model        -> docs/design/core/SSOT-4_DATA_MODEL.md
   - Cross-cutting     -> docs/design/core/SSOT-5_CROSS_CUTTING.md
3. Dev standards       -> docs/standards/
4. PRD                 -> docs/requirements/SSOT-0_PRD.md
\`\`\`

## Directory Structure

\`\`\`
src/
├── app/              <- App Router pages
├── components/       <- UI components
├── lib/              <- Utilities
├── hooks/            <- React hooks
├── types/            <- TypeScript types
├── services/         <- Business logic
└── __tests__/        <- Tests

docs/
├── idea/             <- Idea validation
├── requirements/     <- PRD, Feature Catalog
├── design/           <- Core + Features + ADR
├── standards/        <- Dev standards
├── operations/       <- Operations
├── marketing/        <- Marketing
├── growth/           <- Growth
└── management/       <- Project management
\`\`\`

## Coding Standards

- Components: PascalCase (\`LoginForm.tsx\`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (except components)
- Max ~200 lines per file
- No \`any\` type
- No \`console.log\` in production code
- No hardcoded environment variables

## Prohibited

- Do NOT implement features not in specs
- Do NOT modify core definitions without ADR
- Do NOT submit PRs without tests
- Do NOT swallow errors
`;
}

export function generateCursorRules(config: ProjectConfig): string {
  return `# .cursorrules - Cursor IDE Instructions

## Project: ${config.projectName}

${config.description}

## Highest Priority Rule

When specification is unclear or missing, STOP and ask. Do not guess.

## Before Coding

1. Read the relevant feature spec in docs/design/features/
2. Check core definitions in docs/design/core/
3. Follow coding standards in docs/standards/

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5.7
- Vitest for testing
- Vercel for hosting

## Code Style

- PascalCase for components
- camelCase for functions/variables
- UPPER_SNAKE_CASE for constants
- kebab-case for non-component files
- ~200 lines max per file
- No \`any\`, no \`console.log\` in production

## Specification Locations

- PRD: docs/requirements/SSOT-0_PRD.md
- Features: docs/requirements/SSOT-1_FEATURE_CATALOG.md
- UI/State: docs/design/core/SSOT-2_UI_STATE.md
- API: docs/design/core/SSOT-3_API_CONTRACT.md
- Data: docs/design/core/SSOT-4_DATA_MODEL.md
- Cross-cutting: docs/design/core/SSOT-5_CROSS_CUTTING.md
`;
}

export function generateGitignore(): string {
  return `# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/

# Build
dist/

# Testing
coverage/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Framework state (logs only - state is gitignored)
.framework/logs/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;
}

export function generateReadme(config: ProjectConfig): string {
  return `# ${config.projectName}

> ${config.description}

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Documentation

All specifications are in \`docs/\`. See [docs/INDEX.md](docs/INDEX.md) for the full inventory.

| Directory | Content |
|-----------|---------|
| \`docs/idea/\` | Idea validation |
| \`docs/requirements/\` | Requirements (PRD, Feature Catalog) |
| \`docs/design/\` | Design (Core, Features, ADR) |
| \`docs/standards/\` | Development standards |
| \`docs/operations/\` | Operations |
| \`docs/marketing/\` | Marketing |

## Development

- **Claude Code**: Large feature implementation, batch processing
- **Cursor**: Daily coding, debugging

See \`CLAUDE.md\` / \`.cursorrules\` for detailed instructions.
`;
}

export function generateDocsIndex(): string {
  return `# Document Index

## Specifications

### Idea Validation (docs/idea/)
| Document | Status | Description |
|----------|--------|-------------|
| IDEA_CANVAS.md | Pending | Idea Canvas |
| USER_PERSONA.md | Pending | User Persona |
| COMPETITOR_ANALYSIS.md | Pending | Competitor Analysis |
| VALUE_PROPOSITION.md | Pending | Value Proposition |

### Requirements (docs/requirements/)
| Document | Status | Description |
|----------|--------|-------------|
| SSOT-0_PRD.md | Pending | Product Requirements |
| SSOT-1_FEATURE_CATALOG.md | Pending | Feature Catalog |

### Design (docs/design/)
| Document | Status | Description |
|----------|--------|-------------|
| core/SSOT-2_UI_STATE.md | Pending | UI/State Transitions |
| core/SSOT-3_API_CONTRACT.md | Pending | API Contract |
| core/SSOT-4_DATA_MODEL.md | Pending | Data Model |
| core/SSOT-5_CROSS_CUTTING.md | Pending | Cross-Cutting Concerns |

### Development Standards (docs/standards/)
| Document | Status | Description |
|----------|--------|-------------|
| TECH_STACK.md | Pending | Tech Stack |
| CODING_STANDARDS.md | Pending | Coding Standards |
| GIT_WORKFLOW.md | Pending | Git Workflow |
| TESTING_STANDARDS.md | Pending | Testing Standards |

### Operations (docs/operations/)
| Document | Status | Description |
|----------|--------|-------------|
| ENVIRONMENTS.md | Pending | Environment Config |
| DEPLOYMENT.md | Pending | Deployment |
| MONITORING.md | Pending | Monitoring |
| INCIDENT_RESPONSE.md | Pending | Incident Response |

### Marketing (docs/marketing/)
| Document | Status | Description |
|----------|--------|-------------|
| LP_SPEC.md | Pending | Landing Page Spec |
| SNS_STRATEGY.md | Pending | SNS Strategy |
| EMAIL_SEQUENCE.md | Pending | Email Sequence |
| LAUNCH_PLAN.md | Pending | Launch Plan |
| PRICING_STRATEGY.md | Pending | Pricing Strategy |

### Growth (docs/growth/)
| Document | Status | Description |
|----------|--------|-------------|
| GROWTH_STRATEGY.md | Pending | Growth Strategy |
| METRICS_DEFINITION.md | Pending | Metrics Definition |

### Project Management (docs/management/)
| Document | Status | Description |
|----------|--------|-------------|
| PROJECT_PLAN.md | Pending | Project Plan |
| RISKS.md | Pending | Risk Management |
| CHANGES.md | Pending | Change Management |
`;
}

export function generateProjectState(config: ProjectConfig): string {
  const now = new Date().toISOString();

  return JSON.stringify(
    {
      name: config.projectName,
      version: "0.1.0",
      profileType: config.profileType ?? "app",
      createdAt: now,
      updatedAt: now,
      phase: -1,
      status: "initialized",
      techStack: {
        framework: "next.js",
        language: "typescript",
        ui: "react",
        testing: "vitest",
        hosting: "vercel",
      },
      config: {
        aiProvider: "anthropic",
        aiModel: "claude-sonnet-4-20250514",
        autoCommit: false,
        escalationMode: "strict",
      },
    },
    null,
    2,
  );
}
