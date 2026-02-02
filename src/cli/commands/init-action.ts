/**
 * framework init - Core logic (separated for testability)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  PROJECT_DIRECTORIES,
  DOC_PLACEHOLDERS,
} from "../lib/project-structure.js";
import {
  generateClaudeMd,
  generateCursorRules,
  generateGitignore,
  generateReadme,
  generateDocsIndex,
  generateProjectState,
  type ProjectConfig,
} from "../lib/templates.js";
import { logger } from "../lib/logger.js";

export interface InitOptions {
  projectName: string;
  description: string;
  targetDir: string;
  skipGit: boolean;
}

export interface InitResult {
  projectPath: string;
  createdFiles: string[];
  errors: string[];
}

export async function initProject(options: InitOptions): Promise<InitResult> {
  const projectPath = path.resolve(options.targetDir, options.projectName);
  const createdFiles: string[] = [];
  const errors: string[] = [];

  const totalSteps = 6;

  // Check if directory already exists and is non-empty
  if (fs.existsSync(projectPath)) {
    const contents = fs.readdirSync(projectPath);
    if (contents.length > 0) {
      throw new Error(
        `Directory "${options.projectName}" already exists and is not empty. ` +
          `Choose a different name or remove the existing directory.`,
      );
    }
  }

  const config: ProjectConfig = {
    projectName: options.projectName,
    description: options.description,
  };

  // Step 1: Create directory structure
  logger.step(1, totalSteps, "Creating directory structure...");
  for (const dir of PROJECT_DIRECTORIES) {
    const dirPath = path.join(projectPath, dir);
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Step 2: Create CLAUDE.md and .cursorrules
  logger.step(2, totalSteps, "Generating CLAUDE.md and .cursorrules...");
  const claudeMdPath = path.join(projectPath, "CLAUDE.md");
  fs.writeFileSync(claudeMdPath, generateClaudeMd(config), "utf-8");
  createdFiles.push("CLAUDE.md");

  const cursorRulesPath = path.join(projectPath, ".cursorrules");
  fs.writeFileSync(cursorRulesPath, generateCursorRules(config), "utf-8");
  createdFiles.push(".cursorrules");

  // Step 3: Create document placeholders
  logger.step(3, totalSteps, "Creating document placeholders...");
  for (const doc of DOC_PLACEHOLDERS) {
    const docPath = path.join(projectPath, doc.path);
    const docDir = path.dirname(docPath);
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }
    fs.writeFileSync(docPath, "", "utf-8");
    createdFiles.push(doc.path);
  }

  // Step 4: Create docs/INDEX.md
  logger.step(4, totalSteps, "Generating docs/INDEX.md...");
  const indexPath = path.join(projectPath, "docs/INDEX.md");
  fs.writeFileSync(indexPath, generateDocsIndex(), "utf-8");
  createdFiles.push("docs/INDEX.md");

  // Step 5: Create root files
  logger.step(5, totalSteps, "Creating root files...");
  const gitignorePath = path.join(projectPath, ".gitignore");
  fs.writeFileSync(gitignorePath, generateGitignore(), "utf-8");
  createdFiles.push(".gitignore");

  const readmePath = path.join(projectPath, "README.md");
  fs.writeFileSync(readmePath, generateReadme(config), "utf-8");
  createdFiles.push("README.md");

  // Step 6: Create framework state
  logger.step(6, totalSteps, "Initializing framework state...");
  const statePath = path.join(projectPath, ".framework/project.json");
  fs.writeFileSync(statePath, generateProjectState(config), "utf-8");
  createdFiles.push(".framework/project.json");

  return { projectPath, createdFiles, errors };
}
