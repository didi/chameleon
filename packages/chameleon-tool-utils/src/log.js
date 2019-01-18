const chalk = require('chalk');

const _ = module.exports = {};

_.debug = function(msg) {
  process.stdout.write('\n' + chalk.gray('[DEBUG]') + ' ' + msg + '\n');
}

_.notice = function(msg) {
  process.stdout.write('\n' + chalk.cyan('[INFO]') + ' ' + msg + '\n');
}

_.warn = function(msg) {
  process.stdout.write('\n' + chalk.yellow('[WARNI]') + ' ' + msg + '\n');
}

_.error = function(msg) {
  process.stdout.write('\n' + chalk.red('[ERROR]') + ' ' + msg + '\n');
}

