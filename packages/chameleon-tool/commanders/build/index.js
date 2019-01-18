

exports.name = 'build';
exports.usage = '';
exports.desc = 'start build mode';

exports.register = function (commander) {
  commander
    .action(function (...args) {
      cml.utils.checkProjectConfig();

      /* eslint-disable */ 
      cml.log.startBuilding();
      const utils = require('../utils.js'); 
      /* eslint-disable */
      cml.media = 'build';
      utils.startReleaseAll('build');

    })
  commander.on('--help', function() {
    var cmd = `
      cml build 
    `
    console.log(cmd)
  })

}
