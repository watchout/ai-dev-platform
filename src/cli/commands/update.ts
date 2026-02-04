/**
 * framework update - Update framework docs from ai-dev-framework repository
 *
 * Fetches the latest framework specification documents from the SSOT
 * repository and updates the project's docs/standards/ directory.
 *
 * Usage:
 *   framework update [path]           Update framework docs
 *   framework update [path] --status  Show current framework version
 */
import * as path from "node:path";
import { type Command } from "commander";
import {
  fetchFrameworkDocs,
  loadFrameworkState,
  FRAMEWORK_REPO,
} from "../lib/framework-fetch.js";
import { logger } from "../lib/logger.js";

export function registerUpdateCommand(program: Command): void {
  program
    .command("update")
    .description(
      "Update framework docs from ai-dev-framework repository",
    )
    .argument(
      "[path]",
      "Path to project (default: current directory)",
    )
    .option("--status", "Show current framework version info")
    .action(
      async (
        targetPath: string | undefined,
        options: { status?: boolean },
      ) => {
        const projectDir = targetPath
          ? path.resolve(process.cwd(), targetPath)
          : process.cwd();

        try {
          // Show current status
          if (options.status) {
            const state = loadFrameworkState(projectDir);
            if (!state) {
              logger.info(
                "No framework state found. Run 'framework init' or 'framework update' first.",
              );
              return;
            }

            logger.header("  Framework Status");
            logger.info(`  Repository: ${state.repo}`);
            logger.info(`  Version:    ${state.version.slice(0, 8)}`);
            logger.info(`  Fetched:    ${state.fetchedAt}`);
            logger.info(`  Files:      ${state.files.length}`);
            return;
          }

          // Run update
          logger.info("");
          logger.info("━".repeat(38));
          logger.info("  FRAMEWORK UPDATE");
          logger.info("━".repeat(38));
          logger.info(`  Source: ${FRAMEWORK_REPO}`);
          logger.info(`  Target: ${projectDir}`);

          const existing = loadFrameworkState(projectDir);
          if (existing) {
            logger.info(
              `  Current version: ${existing.version.slice(0, 8)}`,
            );
          }

          logger.info("");
          logger.step(1, 2, "Fetching latest framework docs...");

          const result = await fetchFrameworkDocs(projectDir, {
            force: true,
          });

          if (result.errors.length > 0) {
            for (const err of result.errors) {
              logger.error(err);
            }
            process.exit(1);
          }

          logger.step(2, 2, "Update complete.");
          logger.info("");
          logger.success(
            `Updated ${result.copiedFiles.length} framework docs`,
          );
          logger.info(
            `  Version: ${result.version.slice(0, 8)}`,
          );
          logger.info("");
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error.message);
          }
          process.exit(1);
        }
      },
    );
}
