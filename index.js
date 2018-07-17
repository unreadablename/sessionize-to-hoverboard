#!/usr/bin/env node

const commander = require('commander');
const pkg = require('./package.json');

const initCommand = require('./commands/init');
const previewCommand = require('./commands/preview');

commander
  .version(pkg.version, '-v, --version')
  .command('init')
  .description('run setup command')
  .action(initCommand);

commander
  .command('preview')
  .description('preview data from sessionize')
  .option('-y, --yes', 'yes for all questions')
  .action(previewCommand);

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
