const chalk = require('chalk');
const cluster = require('cluster');

const _ = module.exports = {};

let logLevel = 'none';

_.setLogLevel = function(level) {
  logLevel = level;
}

_.debug = function(msg) {
  if (logLevel === 'debug') {
    process.stdout.write('\n' + chalk.gray('[DEBUG]') + ' ' + msg + '\n');
  }
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

_.startBuilding = function(cmlType) {
  if (cmlType) {
    _.notice(`${cmlType} Compiling....`)
  } else {
    if (cluster.isMaster) {
      _.notice('start Compiling...')
    }
  }
}


