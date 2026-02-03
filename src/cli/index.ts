#!/usr/bin/env node
import { Command } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerDiscoverCommand } from "./commands/discover.js";
import { registerGenerateCommand } from "./commands/generate.js";
import { registerPlanCommand } from "./commands/plan.js";

const program = new Command();

program
  .name("framework")
  .description(
    "AI Development Framework CLI - Automates the development lifecycle from discovery to deployment",
  )
  .version("0.1.0");

registerInitCommand(program);
registerDiscoverCommand(program);
registerGenerateCommand(program);
registerPlanCommand(program);

program.parse();
