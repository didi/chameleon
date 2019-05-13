'use strict';

const path = require('path');
const chalk = require('chalk');
const os = require('os');
const transformErrors = require('./core/transformErrors');
const formatErrors = require('./core/formatErrors');
const output = require('./output');
const utils = require('./utils');
const cluster = require('cluster');

const concat = utils.concat;
const uniqueBy = utils.uniqueBy;

const defaultTransformers = [
  require('./transformers/babelSyntax'),
  require('./transformers/moduleNotFound'),
  require('./transformers/esLintError'),
];

const defaultFormatters = [
  require('./formatters/moduleNotFound'),
  require('./formatters/eslintError'),
  require('./formatters/defaultError'),
];

class FriendlyErrorsWebpackPlugin {

  constructor(options) {
    options = options || {};
    this.compilationSuccessInfo = options.compilationSuccessInfo || {};
    this.onErrors = options.onErrors;
    this.shouldClearConsole = options.clearConsole == null ? true : Boolean(options.clearConsole);
    this.formatters = concat(defaultFormatters, options.additionalFormatters);
    this.transformers = concat(defaultTransformers, options.additionalTransformers);
    this.cmlType = options.cmlType || '';
    this.showWarning = options.showWarning || false;
  }

  apply(compiler) {

    const doneFn = stats => {
      this.clearConsole();

      const hasErrors = stats.hasErrors();
      let hasWarnings = stats.hasWarnings();
      if (!this.showWarning) {
        hasWarnings = false;
      }
      if (!hasErrors && !hasWarnings) {
        this.displaySuccess(stats);
        return;
      }

      if (hasErrors) {
        this.displayErrors(extractErrorsFromStats(stats, 'errors'), 'error');
        return;
      }

      if (hasWarnings) {
        this.displayErrors(extractErrorsFromStats(stats, 'warnings'), 'warning');
      }
    };

    const invalidFn = () => {
      this.clearConsole();
      cml.log.notice(this.cmlType + ' Compiling...')
    };

    let first = false;
    const beforeCompile = (compilation, callback) => {
      if (!first) {
        cml.log.notice(this.cmlType + ' Compiling...')

        first = true;
      }
      return callback();
    }

    if (compiler.hooks) {
      const plugin = { name: 'FriendlyErrorsWebpackPlugin' };

      compiler.hooks.done.tap(plugin, doneFn);
      compiler.hooks.invalid.tap(plugin, invalidFn);
      compiler.hooks.beforeCompile.tap(plugin, beforeCompile);
    } else {
      compiler.plugin('before-compile', beforeCompile);
      compiler.plugin('done', doneFn);
      compiler.plugin('invalid', invalidFn);
    }
  }

  clearConsole() {
    if (this.shouldClearConsole) {
      output.clearConsole();
    }
  }

  displaySuccess(stats) {
    const time = getCompileTime(stats);
    cml.log.notice(this.cmlType + ' Compiled successfully in ' + time + 'ms')
    // 工作进程编译完成通知主进程
    if (!cluster.isMaster) {
      process.send('COMPILED SUCCESS')
    } 

    if (this.compilationSuccessInfo.messages) {
      this.compilationSuccessInfo.messages.forEach(message => output.info(message));
    }
    if (this.compilationSuccessInfo.notes) {
      output.log();
      this.compilationSuccessInfo.notes.forEach(note => output.note(note));
    }
  }

  displayErrors(errors, severity) {
    const processedErrors = transformErrors(errors, this.transformers);

    const topErrors = getMaxSeverityErrors(processedErrors);
    const nbErrors = topErrors.length;

    const subtitle = severity === 'error' ?
      `Failed to compile with ${nbErrors} ${severity}s` :
      `Compiled with ${nbErrors} ${severity}s`;
    output.title(severity, severity.toUpperCase(), subtitle);

    if (this.onErrors) {
      this.onErrors(severity, topErrors);
    }

    formatErrors(topErrors, this.formatters, severity)
      .forEach(chunk => output.log(chunk));
  }
}

function extractErrorsFromStats(stats, type) {
  if (isMultiStats(stats)) {
    const errors = stats.stats
      .reduce((errors, stats) => errors.concat(extractErrorsFromStats(stats, type)), []);
    // Dedupe to avoid showing the same error many times when multiple
    // compilers depend on the same module.
    return uniqueBy(errors, error => error.message);
  }
  return stats.compilation[type];
}

function getCompileTime(stats) {
  if (isMultiStats(stats)) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats
      .reduce((time, stats) => Math.max(time, getCompileTime(stats)), 0);
  }
  return stats.endTime - stats.startTime;
}

function isMultiStats(stats) {
  return stats.stats;
}

function getMaxSeverityErrors(errors) {
  const maxSeverity = getMaxInt(errors, 'severity');
  return errors.filter(e => e.severity === maxSeverity);
}

function getMaxInt(collection, propertyName) {
  return collection.reduce((res, curr) => {
    return curr[propertyName] > res ? curr[propertyName] : res;
  }, 0)
}

module.exports = FriendlyErrorsWebpackPlugin;
