#!/usr/bin/env node

const commander = require('commander');
const pkg = require('./package.json');

const initCommand = require('./commands/init');
const importCommand = require('./commands/import');

commander
  .version(pkg.version, '-v, --version')
  .command('init')
  .description('run setup command')
  .action(initCommand);

commander
  .command('import')
  .description('import data from sessionize')
  .option('-y, --yes', 'yes for all questions')
  .action(importCommand);

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
