#!/usr/bin/env node
// --inspect-brk
const program = require('commander');
const packageJson = require('../package.json');
const main = require('../index');

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});

program
  .version(packageJson.version)
  .parse(process.argv);
let currentWorkspace = process.cwd();
global.workspace = currentWorkspace;

process.on('unhandledRejection', error => {
  console.log(error);
});
main(currentWorkspace, true);

