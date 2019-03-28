const chalk = require('chalk');

class Log {
  constructor(options = {}) {
    this.level = options.level || 2;
  }

  debug (msg) {
    if (this.level >=3 ) {
      process.stdout.write('\n' + chalk.gray('[DEBUG]') + ' ' + msg + '\n');
    }
  }

  notice (msg) {
    if (this.level >=2 ) {
      process.stdout.write('\n' + chalk.cyan('[INFO]') + ' ' + msg + '\n');
    }
  }

  warn (msg) {
    if (this.level >=1 ) {
      process.stdout.write('\n' + chalk.yellow('[WARNI]') + ' ' + msg + '\n');
    }
  }

  error(msg) {
    if (this.level >=0 ) {
      process.stdout.write('\n' + chalk.red('[ERROR]') + ' ' + msg + '\n');
    }
  }

}

module.exports = Log;


