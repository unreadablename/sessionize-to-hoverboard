#!/usr/bin/env node

const commander = require('commander');
const pkg = require('./package.json');

const initCommand = require('./commands/init');

commander
  .version(pkg.version, '-v, --version')
  .command('init')
  .description('run setup command')
  .action(initCommand);

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
