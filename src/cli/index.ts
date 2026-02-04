#!/usr/bin/env node
import { Command } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerDiscoverCommand } from "./commands/discover.js";
import { registerGenerateCommand } from "./commands/generate.js";
import { registerPlanCommand } from "./commands/plan.js";
import { registerAuditCommand } from "./commands/audit.js";
import { registerRunCommand } from "./commands/run.js";
import { registerStatusCommand } from "./commands/status.js";
import { registerRetrofitCommand } from "./commands/retrofit.js";
import { registerUpdateCommand } from "./commands/update.js";

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
registerAuditCommand(program);
registerRunCommand(program);
registerStatusCommand(program);
registerRetrofitCommand(program);
registerUpdateCommand(program);

program.parse();
