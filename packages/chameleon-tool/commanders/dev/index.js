
exports.name = 'dev';
exports.usage = '';
exports.desc = 'start dev mode';

exports.register = function (commander) {
  commander
    .action(function (...args) {
      cml.utils.checkProjectConfig();
      /* eslint-disable */ 
      cml.log.startBuilding();
      const utils = require('../utils.js'); 
      /* eslint-disable */
      cml.media = 'dev';
      utils.startReleaseAll('dev');
    })
  commander.on('--help', function() {
    var cmd = `
      cml dev 
    `
    console.log(cmd)
  })

}
