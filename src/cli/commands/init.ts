/**
 * framework init - Project initialization command
 *
 * Reference: 00_MASTER_GUIDE.md, 09_TOOLCHAIN.md
 *
 * Creates a new project with:
 * - Directory structure (docs/, src/, public/, .framework/)
 * - CLAUDE.md and .cursorrules
 * - Document placeholders
 * - .gitignore
 * - README.md
 * - docs/INDEX.md
 * - .framework/project.json (state tracking)
 */
import { type Command } from "commander";
import { initProject, type InitOptions, type InitResult } from "./init-action.js";
import { logger } from "../lib/logger.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init [project-name]")
    .description("Initialize a new project with the AI Development Framework")
    .option("-d, --description <desc>", "Project description")
    .option("--skip-git", "Skip git initialization")
    .action(async (projectName: string | undefined, options: { description?: string; skipGit?: boolean }) => {
      const name = projectName ?? "my-project";
      const description = options.description ?? "";

      try {
        const result = await initProject({
          projectName: name,
          description,
          targetDir: process.cwd(),
          skipGit: options.skipGit ?? false,
        });

        printResult(result);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        process.exit(1);
      }
    });
}

function printResult(result: InitResult): void {
  logger.header("Project initialized successfully");
  logger.info("");
  logger.info(`  Project: ${result.projectPath}`);
  logger.info("");
  logger.tree([
    `${result.projectPath}/`,
    "├── CLAUDE.md",
    "├── .cursorrules",
    "├── .gitignore",
    "├── README.md",
    "├── docs/              <- Specifications (placeholders ready)",
    "│   └── INDEX.md",
    "├── src/               <- Source code",
    "├── public/            <- Static assets",
    "└── .framework/        <- Framework state",
  ]);
  logger.info("");
  logger.info(`  Files created: ${result.createdFiles.length}`);
  logger.info("");
  logger.header("Next steps:");
  logger.info("  1. cd " + result.projectPath);
  logger.info("  2. framework discover    <- Start the discovery flow");
  logger.info("  3. framework generate    <- Generate SSOT documents");
  logger.info("");
}
