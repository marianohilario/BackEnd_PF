import { Command } from 'commander';

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("--mode <mode>", "Modo de trabajo", "DEVELOPMENT");

program.parse();

export default program;