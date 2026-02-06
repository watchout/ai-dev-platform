# AI Development Platform

CLI tool + Dashboard for the AI Development Framework. Automates the entire development lifecycle from discovery to deployment.

## Components

- **CLI**: `framework init / run / status` commands
- **Dashboard**: Next.js on Vercel (progress, scores, alerts)
- **Integrations**: GitHub Projects, Discord

## Project Structure

```
ai-dev-platform/
├── src/
│   ├── cli/              ← CLI tool (framework init/run/status)
│   ├── dashboard/        ← Next.js Dashboard app
│   │   ├── app/          ← App Router pages
│   │   ├── components/   ← UI components
│   │   └── lib/          ← Utilities
│   ├── lib/              ← Shared libraries
│   ├── types/            ← TypeScript type definitions
│   └── integrations/     ← GitHub Projects, Discord connectors
├── docs/
│   ├── idea/             ← Idea validation
│   ├── requirements/     ← Requirements (PRD, Feature Catalog)
│   ├── design/           ← Design (Core, Features, ADR)
│   ├── standards/        ← Development standards & framework docs
│   ├── operations/       ← Operations (deploy, monitoring)
│   ├── marketing/        ← Marketing documents
│   ├── growth/           ← Growth strategy
│   └── management/       ← Project management
├── public/               ← Static assets
├── CLAUDE.md             ← Claude Code instructions
├── .cursorrules          ← Cursor IDE instructions
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

## Development

- **Claude Code**: Large feature implementation, batch processing
- **Cursor**: Daily coding, debugging

See `CLAUDE.md` / `.cursorrules` for detailed instructions.

## Documentation

All specifications are in `docs/`. See [docs/INDEX.md](docs/INDEX.md) for the full document inventory.

The AI Development Framework standards are in `docs/standards/`.

## Status

Project initialization in progress.
