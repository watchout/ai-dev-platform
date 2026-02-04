/**
 * Retrofit model - Types and utilities for retrofitting existing projects
 *
 * Enables existing repositories to be analyzed and migrated
 * under framework management with proper SSOT structure.
 */
import * as fs from "node:fs";
import * as path from "node:path";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type RetrofitPhase =
  | "scan"
  | "analyze"
  | "gap"
  | "generate"
  | "migrate";

export type TechCategory =
  | "framework"
  | "language"
  | "database"
  | "hosting"
  | "testing"
  | "styling"
  | "auth"
  | "other";

export interface DetectedTech {
  name: string;
  category: TechCategory;
  version?: string;
  source: string;
}

export interface FileStats {
  totalFiles: number;
  totalLines: number;
  byExtension: Record<string, number>;
}

export interface DirectoryAnalysis {
  hasSrc: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  hasPublic: boolean;
  hasFramework: boolean;
  hasClaudeMd: boolean;
  hasPackageJson: boolean;
  topLevelDirs: string[];
  srcSubdirs: string[];
}

export interface ExistingDoc {
  path: string;
  name: string;
  sizeBytes: number;
  category: string;
}

export interface SSOTGap {
  ssoId: string;
  name: string;
  path: string;
  status: "missing" | "exists" | "partial";
  recommendation: string;
}

export interface RetrofitReport {
  projectDir: string;
  projectName: string;
  scannedAt: string;
  directory: DirectoryAnalysis;
  techStack: DetectedTech[];
  fileStats: FileStats;
  existingDocs: ExistingDoc[];
  gaps: SSOTGap[];
  readiness: RetrofitReadiness;
}

export interface RetrofitReadiness {
  score: number;
  maxScore: number;
  details: ReadinessCheck[];
}

export interface ReadinessCheck {
  name: string;
  passed: boolean;
  points: number;
  detail?: string;
}

// ─────────────────────────────────────────────
// Expected SSOT documents
// ─────────────────────────────────────────────

export interface ExpectedDoc {
  ssoId: string;
  name: string;
  path: string;
  required: boolean;
}

export const EXPECTED_SSOT_DOCS: ExpectedDoc[] = [
  // Requirements
  { ssoId: "SSOT-0", name: "PRD", path: "docs/requirements/SSOT-0_PRD.md", required: true },
  { ssoId: "SSOT-1", name: "Feature Catalog", path: "docs/requirements/SSOT-1_FEATURE_CATALOG.md", required: true },
  // Core design
  { ssoId: "SSOT-2", name: "UI/State", path: "docs/design/core/SSOT-2_UI_STATE.md", required: true },
  { ssoId: "SSOT-3", name: "API Contract", path: "docs/design/core/SSOT-3_API_CONTRACT.md", required: true },
  { ssoId: "SSOT-4", name: "Data Model", path: "docs/design/core/SSOT-4_DATA_MODEL.md", required: true },
  { ssoId: "SSOT-5", name: "Cross-Cutting", path: "docs/design/core/SSOT-5_CROSS_CUTTING.md", required: true },
  // Standards
  { ssoId: "STD-TECH", name: "Tech Stack", path: "docs/standards/TECH_STACK.md", required: true },
  { ssoId: "STD-CODE", name: "Coding Standards", path: "docs/standards/CODING_STANDARDS.md", required: false },
  { ssoId: "STD-GIT", name: "Git Workflow", path: "docs/standards/GIT_WORKFLOW.md", required: false },
  { ssoId: "STD-TEST", name: "Testing Standards", path: "docs/standards/TESTING_STANDARDS.md", required: false },
  // Idea (optional for retrofit)
  { ssoId: "IDEA", name: "Idea Canvas", path: "docs/idea/IDEA_CANVAS.md", required: false },
  // Operations
  { ssoId: "OPS-ENV", name: "Environments", path: "docs/operations/ENVIRONMENTS.md", required: false },
  { ssoId: "OPS-DEPLOY", name: "Deployment", path: "docs/operations/DEPLOYMENT.md", required: false },
];

// ─────────────────────────────────────────────
// Tech detection patterns
// ─────────────────────────────────────────────

export interface TechPattern {
  name: string;
  category: TechCategory;
  packageNames: string[];
  filePatterns?: string[];
}

export const TECH_PATTERNS: TechPattern[] = [
  // Frameworks
  { name: "Next.js", category: "framework", packageNames: ["next"] },
  { name: "React", category: "framework", packageNames: ["react"] },
  { name: "Vue", category: "framework", packageNames: ["vue"] },
  { name: "Express", category: "framework", packageNames: ["express"] },
  { name: "Fastify", category: "framework", packageNames: ["fastify"] },
  { name: "Hono", category: "framework", packageNames: ["hono"] },
  // Languages
  { name: "TypeScript", category: "language", packageNames: ["typescript"], filePatterns: ["tsconfig.json"] },
  // Database
  { name: "Supabase", category: "database", packageNames: ["@supabase/supabase-js"] },
  { name: "Prisma", category: "database", packageNames: ["prisma", "@prisma/client"] },
  { name: "Drizzle", category: "database", packageNames: ["drizzle-orm"] },
  // Testing
  { name: "Vitest", category: "testing", packageNames: ["vitest"] },
  { name: "Jest", category: "testing", packageNames: ["jest"] },
  { name: "Playwright", category: "testing", packageNames: ["@playwright/test"] },
  // Styling
  { name: "Tailwind CSS", category: "styling", packageNames: ["tailwindcss"] },
  { name: "shadcn/ui", category: "styling", packageNames: ["@radix-ui/react-slot"], filePatterns: ["components.json"] },
  // Auth
  { name: "NextAuth", category: "auth", packageNames: ["next-auth"] },
  { name: "Clerk", category: "auth", packageNames: ["@clerk/nextjs"] },
  // Hosting
  { name: "Vercel", category: "hosting", packageNames: ["vercel"], filePatterns: ["vercel.json"] },
];

// ─────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────

/**
 * Detect tech stack from package.json dependencies
 */
export function detectTechFromPackageJson(
  packageJson: Record<string, unknown>,
): DetectedTech[] {
  const detected: DetectedTech[] = [];
  const deps = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };

  for (const pattern of TECH_PATTERNS) {
    for (const pkgName of pattern.packageNames) {
      if (deps[pkgName]) {
        detected.push({
          name: pattern.name,
          category: pattern.category,
          version: deps[pkgName],
          source: `package.json (${pkgName})`,
        });
        break;
      }
    }
  }

  return detected;
}

/**
 * Detect tech from file existence
 */
export function detectTechFromFiles(
  existingFiles: string[],
): DetectedTech[] {
  const detected: DetectedTech[] = [];

  for (const pattern of TECH_PATTERNS) {
    if (!pattern.filePatterns) continue;
    for (const filePattern of pattern.filePatterns) {
      if (existingFiles.some((f) => f.endsWith(filePattern))) {
        const alreadyDetected = detected.some(
          (d) => d.name === pattern.name,
        );
        if (!alreadyDetected) {
          detected.push({
            name: pattern.name,
            category: pattern.category,
            source: `file: ${filePattern}`,
          });
        }
      }
    }
  }

  return detected;
}

/**
 * Analyze directory structure
 */
export function analyzeDirectory(
  projectDir: string,
): DirectoryAnalysis {
  const entries = fs.existsSync(projectDir)
    ? fs.readdirSync(projectDir, { withFileTypes: true })
    : [];

  const topLevelDirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules")
    .map((e) => e.name);

  const srcPath = path.join(projectDir, "src");
  const srcSubdirs = fs.existsSync(srcPath)
    ? fs.readdirSync(srcPath, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];

  return {
    hasSrc: topLevelDirs.includes("src"),
    hasDocs: topLevelDirs.includes("docs"),
    hasTests: topLevelDirs.includes("tests") || topLevelDirs.includes("__tests__"),
    hasPublic: topLevelDirs.includes("public"),
    hasFramework: fs.existsSync(path.join(projectDir, ".framework")),
    hasClaudeMd: fs.existsSync(path.join(projectDir, "CLAUDE.md")),
    hasPackageJson: fs.existsSync(path.join(projectDir, "package.json")),
    topLevelDirs,
    srcSubdirs,
  };
}

/**
 * Count files and lines by extension
 */
export function countFiles(
  projectDir: string,
  extensions: string[],
): FileStats {
  const byExtension: Record<string, number> = {};
  let totalFiles = 0;
  let totalLines = 0;

  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(entry.name);
        if (extensions.length === 0 || extensions.includes(ext)) {
          totalFiles++;
          byExtension[ext] = (byExtension[ext] ?? 0) + 1;
          try {
            const content = fs.readFileSync(fullPath, "utf-8");
            totalLines += content.split("\n").length;
          } catch {
            // Skip unreadable files
          }
        }
      }
    }
  }

  walk(projectDir);
  return { totalFiles, totalLines, byExtension };
}

/**
 * Find existing documentation files
 */
export function findExistingDocs(
  projectDir: string,
): ExistingDoc[] {
  const docs: ExistingDoc[] = [];

  function walk(dir: string, category: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, entry.name);
      } else if (entry.name.endsWith(".md")) {
        const stat = fs.statSync(fullPath);
        docs.push({
          path: path.relative(projectDir, fullPath),
          name: entry.name,
          sizeBytes: stat.size,
          category,
        });
      }
    }
  }

  // Check docs/ directory
  walk(path.join(projectDir, "docs"), "docs");

  // Check root-level markdown files
  const rootEntries = fs.readdirSync(projectDir, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const fullPath = path.join(projectDir, entry.name);
      const stat = fs.statSync(fullPath);
      docs.push({
        path: entry.name,
        name: entry.name,
        sizeBytes: stat.size,
        category: "root",
      });
    }
  }

  return docs;
}

/**
 * Identify SSOT gaps by comparing expected docs vs existing
 */
export function identifyGaps(
  projectDir: string,
  existingDocs: ExistingDoc[],
): SSOTGap[] {
  const gaps: SSOTGap[] = [];
  const existingPaths = new Set(existingDocs.map((d) => d.path));

  for (const expected of EXPECTED_SSOT_DOCS) {
    const fullPath = path.join(projectDir, expected.path);
    const exists = fs.existsSync(fullPath);

    if (!exists) {
      gaps.push({
        ssoId: expected.ssoId,
        name: expected.name,
        path: expected.path,
        status: "missing",
        recommendation: expected.required
          ? `Required: Generate ${expected.name} from codebase analysis`
          : `Optional: Generate ${expected.name} when ready`,
      });
    } else {
      // Check if it's a stub (very small file)
      const stat = fs.statSync(fullPath);
      if (stat.size < 100) {
        gaps.push({
          ssoId: expected.ssoId,
          name: expected.name,
          path: expected.path,
          status: "partial",
          recommendation: `Stub only: Flesh out ${expected.name} with actual content`,
        });
      } else {
        gaps.push({
          ssoId: expected.ssoId,
          name: expected.name,
          path: expected.path,
          status: "exists",
          recommendation: "Audit with 'framework audit ssot' to verify quality",
        });
      }
    }
  }

  return gaps;
}

/**
 * Calculate retrofit readiness score
 */
export function calculateReadiness(
  directory: DirectoryAnalysis,
  techStack: DetectedTech[],
  gaps: SSOTGap[],
): RetrofitReadiness {
  const checks: ReadinessCheck[] = [];

  // 1. Has package.json (10pts)
  checks.push({
    name: "package.json exists",
    passed: directory.hasPackageJson,
    points: 10,
    detail: directory.hasPackageJson ? undefined : "No package.json found",
  });

  // 2. Has src/ directory (10pts)
  checks.push({
    name: "src/ directory exists",
    passed: directory.hasSrc,
    points: 10,
    detail: directory.hasSrc ? undefined : "No src/ directory",
  });

  // 3. Framework detected (10pts)
  const hasFramework = techStack.some((t) => t.category === "framework");
  checks.push({
    name: "Framework detected",
    passed: hasFramework,
    points: 10,
    detail: hasFramework
      ? techStack.filter((t) => t.category === "framework").map((t) => t.name).join(", ")
      : "No framework detected",
  });

  // 4. TypeScript (10pts)
  const hasTs = techStack.some((t) => t.name === "TypeScript");
  checks.push({
    name: "TypeScript configured",
    passed: hasTs,
    points: 10,
    detail: hasTs ? undefined : "TypeScript not detected",
  });

  // 5. Testing framework (10pts)
  const hasTesting = techStack.some((t) => t.category === "testing");
  checks.push({
    name: "Testing framework configured",
    passed: hasTesting,
    points: 10,
    detail: hasTesting
      ? techStack.filter((t) => t.category === "testing").map((t) => t.name).join(", ")
      : "No testing framework detected",
  });

  // 6. Has docs/ (10pts)
  checks.push({
    name: "docs/ directory exists",
    passed: directory.hasDocs,
    points: 10,
    detail: directory.hasDocs ? undefined : "No docs/ directory - will be created",
  });

  // 7. Required SSOTs exist (20pts)
  const requiredGaps = gaps.filter(
    (g) => EXPECTED_SSOT_DOCS.find((e) => e.ssoId === g.ssoId)?.required,
  );
  const requiredExisting = requiredGaps.filter((g) => g.status === "exists");
  const requiredScore = requiredGaps.length > 0
    ? Math.round((requiredExisting.length / requiredGaps.length) * 20)
    : 0;
  checks.push({
    name: "Required SSOT documents",
    passed: requiredScore === 20,
    points: requiredScore,
    detail: `${requiredExisting.length}/${requiredGaps.length} required SSOTs exist`,
  });

  // 8. Not already under framework management (10pts)
  checks.push({
    name: "Not already managed",
    passed: !directory.hasFramework,
    points: 10,
    detail: directory.hasFramework
      ? "Already has .framework/ directory"
      : undefined,
  });

  // 9. Has CLAUDE.md (10pts)
  checks.push({
    name: "CLAUDE.md exists",
    passed: directory.hasClaudeMd,
    points: 10,
    detail: directory.hasClaudeMd ? undefined : "Will be generated",
  });

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);
  const maxScore = checks.reduce((sum, c) => sum + c.points, 0);

  return { score, maxScore, details: checks };
}

/**
 * Save retrofit report to .framework/
 */
export function saveRetrofitReport(
  projectDir: string,
  report: RetrofitReport,
): string {
  const frameworkDir = path.join(projectDir, ".framework");
  if (!fs.existsSync(frameworkDir)) {
    fs.mkdirSync(frameworkDir, { recursive: true });
  }

  const filename = "retrofit-report.json";
  const filePath = path.join(frameworkDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf-8");
  return filename;
}

/**
 * Load retrofit report
 */
export function loadRetrofitReport(
  projectDir: string,
): RetrofitReport | null {
  const filePath = path.join(projectDir, ".framework", "retrofit-report.json");
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as RetrofitReport;
}

/**
 * Generate SSOT stub content for a missing document
 */
export function generateSSOTStub(
  expected: ExpectedDoc,
  techStack: DetectedTech[],
  projectName: string,
): string {
  const date = new Date().toISOString().split("T")[0];
  const techList = techStack.map((t) => t.name).join(", ");

  switch (expected.ssoId) {
    case "SSOT-0":
      return generatePRDStub(projectName, techList, date);
    case "SSOT-1":
      return generateFeatureCatalogStub(projectName, date);
    case "SSOT-2":
      return generateUIStateStub(projectName, date);
    case "SSOT-3":
      return generateAPIContractStub(projectName, date);
    case "SSOT-4":
      return generateDataModelStub(projectName, date);
    case "SSOT-5":
      return generateCrossCuttingStub(projectName, date);
    case "STD-TECH":
      return generateTechStackDoc(techStack, projectName, date);
    default:
      return `# ${expected.name}\n\n> Generated by framework retrofit on ${date}\n> Project: ${projectName}\n\n---\n\n## TODO\n\nFill in this document based on existing implementation.\n`;
  }
}

// ─────────────────────────────────────────────
// SSOT stub generators
// ─────────────────────────────────────────────

function generatePRDStub(
  projectName: string,
  techList: string,
  date: string,
): string {
  return `# SSOT-0: PRD - ${projectName}

> Generated by framework retrofit on ${date}
> Status: Draft - Review and complete all sections

---

## §1 Product Overview

| Item | Value |
|------|-------|
| Product Name | ${projectName} |
| Tech Stack | ${techList} |
| Status | Retrofitted from existing codebase |

## §2 Problem Statement

> TODO: Describe the problem this product solves

## §3 Target Users

> TODO: Define target user personas

## §4 Solution Overview

> TODO: Describe how the product solves the problem

## §5 Functional Requirements

> TODO: List functional requirements extracted from existing code
> Use format: FR-001, FR-002, ...

## §6 Non-Functional Requirements

> TODO: Define performance, security, scalability requirements

## §7 Success Metrics

> TODO: Define measurable success criteria

## §8 Scope

> TODO: Define what is in/out of scope

## §9 Milestones

> TODO: Define project milestones

## §10 Risks

> TODO: Identify project risks

## §11 Dependencies

> TODO: List external dependencies

## §12 Glossary

> TODO: Define domain-specific terms
`;
}

function generateFeatureCatalogStub(
  projectName: string,
  date: string,
): string {
  return `# SSOT-1: Feature Catalog - ${projectName}

> Generated by framework retrofit on ${date}
> Status: Draft - Extract features from existing codebase

---

## Feature List

| ID | Feature | Priority | Status | SSOT |
|----|---------|----------|--------|------|
| FEAT-001 | TODO | P0 | Existing | - |

> TODO: Analyze existing routes, components, and API endpoints
> to build a complete feature catalog.
`;
}

function generateUIStateStub(
  projectName: string,
  date: string,
): string {
  return `# SSOT-2: UI/State Transitions - ${projectName}

> Generated by framework retrofit on ${date}

---

## Screens

> TODO: Document existing screens/pages from the codebase

## State Transitions

> TODO: Map state transitions from existing UI logic
`;
}

function generateAPIContractStub(
  projectName: string,
  date: string,
): string {
  return `# SSOT-3: API Contract - ${projectName}

> Generated by framework retrofit on ${date}

---

## API Endpoints

> TODO: Extract API endpoints from existing route handlers

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/... | TODO | TODO |
`;
}

function generateDataModelStub(
  projectName: string,
  date: string,
): string {
  return `# SSOT-4: Data Model - ${projectName}

> Generated by framework retrofit on ${date}

---

## Tables / Collections

> TODO: Extract data model from existing schema/migrations

## Relationships

> TODO: Document entity relationships
`;
}

function generateCrossCuttingStub(
  projectName: string,
  date: string,
): string {
  return `# SSOT-5: Cross-Cutting Concerns - ${projectName}

> Generated by framework retrofit on ${date}

---

## Authentication

> TODO: Document existing auth implementation

## Error Handling

> TODO: Document error handling patterns

## Logging

> TODO: Document logging strategy
`;
}

function generateTechStackDoc(
  techStack: DetectedTech[],
  projectName: string,
  date: string,
): string {
  const grouped: Record<string, DetectedTech[]> = {};
  for (const tech of techStack) {
    const cat = tech.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(tech);
  }

  let content = `# Tech Stack - ${projectName}

> Auto-detected by framework retrofit on ${date}

---

## Detected Technologies

| Category | Technology | Version | Source |
|----------|-----------|---------|--------|
`;

  for (const tech of techStack) {
    content += `| ${tech.category} | ${tech.name} | ${tech.version ?? "-"} | ${tech.source} |\n`;
  }

  content += `
---

## Notes

> This document was auto-generated from package.json analysis.
> Review and add any technologies not detected automatically.
`;

  return content;
}

/**
 * Generate retrofit markdown report
 */
export function generateRetrofitMarkdown(
  report: RetrofitReport,
): string {
  const missingCount = report.gaps.filter((g) => g.status === "missing").length;
  const partialCount = report.gaps.filter((g) => g.status === "partial").length;
  const existsCount = report.gaps.filter((g) => g.status === "exists").length;

  let md = `# Retrofit Report - ${report.projectName}

> Scanned: ${report.scannedAt}

---

## Readiness Score

**${report.readiness.score}/${report.readiness.maxScore}**

| Check | Status | Points |
|-------|--------|--------|
`;

  for (const check of report.readiness.details) {
    const status = check.passed ? "PASS" : "FAIL";
    const detail = check.detail ? ` (${check.detail})` : "";
    md += `| ${check.name}${detail} | ${status} | ${check.passed ? check.points : 0}/${check.points} |\n`;
  }

  md += `
---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
`;

  for (const tech of report.techStack) {
    md += `| ${tech.category} | ${tech.name} | ${tech.version ?? "-"} |\n`;
  }

  md += `
---

## File Statistics

| Metric | Value |
|--------|-------|
| Total Files | ${report.fileStats.totalFiles} |
| Total Lines | ${report.fileStats.totalLines} |
`;

  for (const [ext, count] of Object.entries(report.fileStats.byExtension)) {
    md += `| ${ext} files | ${count} |\n`;
  }

  md += `
---

## SSOT Gap Analysis

**${existsCount} exists / ${partialCount} partial / ${missingCount} missing**

| SSOT | Name | Status | Recommendation |
|------|------|--------|----------------|
`;

  for (const gap of report.gaps) {
    const statusIcon = gap.status === "exists" ? "EXISTS" : gap.status === "partial" ? "PARTIAL" : "MISSING";
    md += `| ${gap.ssoId} | ${gap.name} | ${statusIcon} | ${gap.recommendation} |\n`;
  }

  md += `
---

## Next Steps

1. Review and complete generated SSOT stubs
2. Run \`framework audit ssot <path>\` on each document
3. Use \`framework status\` to track progress
`;

  return md;
}
