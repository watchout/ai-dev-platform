/**
 * framework audit - Quality audit command
 *
 * Reference: 13_SSOT_AUDIT.md, 16_PROMPT_AUDIT.md, 17_CODE_AUDIT.md
 *
 * Runs quality audits on SSOT documents, prompts, and code:
 * - SSOT audit: 10 categories, 95+ to pass
 * - Prompt audit: 8 categories, 100 mandatory
 * - Code audit: 8 categories, 100 mandatory
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { type Command } from "commander";
import {
  runAudit,
  createAuditTerminalIO,
} from "../lib/audit-engine.js";
import {
  type AuditMode,
  loadAuditReports,
  generateAuditMarkdown,
} from "../lib/audit-model.js";
import { loadProjectProfile, isAuditEnabled } from "../lib/profile-model.js";
import { logger } from "../lib/logger.js";

export function registerAuditCommand(program: Command): void {
  program
    .command("audit")
    .description(
      "Run quality audits (ssot, prompt, code)",
    )
    .argument("<mode>", "Audit mode: ssot | prompt | code")
    .argument("[target]", "Path to file to audit")
    .option("--output <path>", "Write report to markdown file")
    .option("--id <id>", "Target identifier (default: filename)")
    .option("--status", "Show recent audit results")
    .action(
      async (
        mode: string,
        target: string | undefined,
        options: {
          output?: string;
          id?: string;
          status?: boolean;
        },
      ) => {
        const projectDir = process.cwd();

        try {
          if (options.status) {
            const auditMode = ["ssot", "prompt", "code"].includes(mode)
              ? (mode as AuditMode)
              : undefined;
            printAuditStatus(projectDir, auditMode);
            return;
          }

          // Validate mode
          if (!["ssot", "prompt", "code"].includes(mode)) {
            logger.error(
              `Invalid audit mode: ${mode}. Use: ssot, prompt, or code`,
            );
            process.exit(1);
          }

          // Check if audit mode is enabled for this project type
          const profile = loadProjectProfile(projectDir);
          if (profile && !isAuditEnabled(profile, mode)) {
            logger.error(
              `Audit mode "${mode}" is not enabled for project type "${profile.id}". ` +
                `Enabled modes: ${profile.enabledAudit.join(", ")}`,
            );
            process.exit(1);
          }

          // Validate target
          if (!target) {
            logger.error(
              "Target file required. Usage: framework audit <mode> <target>",
            );
            process.exit(1);
          }

          const targetPath = path.resolve(projectDir, target);
          if (!fs.existsSync(targetPath)) {
            logger.error(`Target not found: ${target}`);
            process.exit(1);
          }

          const io = createAuditTerminalIO();
          const result = await runAudit({
            projectDir,
            io,
            mode: mode as AuditMode,
            targetPath: target,
            targetId: options.id,
          });

          if (result.errors.length > 0) {
            for (const err of result.errors) {
              logger.error(err);
            }
            process.exit(1);
          }

          // Output markdown if requested
          if (options.output) {
            const markdown = generateAuditMarkdown(result.report);
            const outputPath = path.resolve(
              projectDir,
              options.output,
            );
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, markdown, "utf-8");
            logger.success(`Report written to ${options.output}`);
          }

          logger.info("");
          if (result.report.verdict === "pass") {
            logger.success("Audit passed!");
          } else if (result.report.verdict === "conditional") {
            logger.warn(
              "Conditional pass - fix findings and re-audit",
            );
          } else {
            logger.error(
              "Audit failed - address findings before proceeding",
            );
          }
          logger.info("");

          if (result.report.verdict !== "pass") {
            process.exit(1);
          }
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error.message);
          }
          process.exit(1);
        }
      },
    );
}

function printAuditStatus(
  projectDir: string,
  mode?: AuditMode,
): void {
  const reports = loadAuditReports(projectDir, mode);

  if (reports.length === 0) {
    logger.info(
      "No audit reports found. Run 'framework audit <mode> <target>' to audit.",
    );
    return;
  }

  logger.header("Recent Audit Results");
  logger.info("");

  for (const report of reports.slice(0, 10)) {
    const verdictLabel =
      report.verdict === "pass"
        ? "PASS"
        : report.verdict === "conditional"
          ? "COND"
          : "FAIL";
    logger.info(
      `  [${report.mode.toUpperCase()}] ${report.target.name} - ${report.totalScore}/100 ${verdictLabel} (${report.target.auditDate})`,
    );
  }

  logger.info("");
}
