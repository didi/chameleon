const envinfo = require('envinfo');

exports.name = 'info';
exports.usage = '[command] [options]';
exports.desc = 'Shows information about the local environment';

/* istanbul ignore next */
exports.register = function (commander) {
  commander
    .action(function (...args) {
      envinfo.run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
          npmGlobalPackages: ['chameleon-tool'],
          npmPackages: [
            'chameleon-tool'
          ]
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true
        }
      ).then(console.log)

    })
}

