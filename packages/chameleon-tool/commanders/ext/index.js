let extCommandConfig = cml.config.get().extPlatform
let extCommand
if (extCommandConfig && typeof extCommandConfig === 'object') {
  extCommand = Object.keys(extCommandConfig)[0]
  exports.name = extCommand;
}

exports.usage = '[command] [options]';
exports.desc = 'tools for the weixin miniprogram project';

/* istanbul ignore next */
exports.register = function (commander) {
  commander
    .option('-r, --root [root]', 'specify project root')
    .option('-n, --nopreview ', "don't auto open preview")
    .action(function (...args) {
      cml.utils.checkProjectConfig();
      /* eslint-disable */
    cml.log.startBuilding();
    const inquirer = require('inquirer');
    const utils = require('../utils.js');
    /* eslint-disable */
    // 不能删除
    var options = args.pop(); // eslint-disable-line
    var cmd = args.shift();
    if (cmd) {
      handlerCmd(cmd);
    } else {
      let questions = [{
        type: 'list',
        name: 'type',
        message: 'Which do you want to do?',
        choices: [
          'dev',
          'build'
        ]
      }]
      inquirer.prompt(questions).then(answers => {
        handlerCmd(answers.type)
      })
    }

    function handlerCmd (cmd) {
      cml.media = cmd;
      utils.startReleaseOne(cmd, extCommand);
    }

  })

commander.on('--help', function() {
  var cmd = `
Commands:
  dev      develop the project for weixin miniprogram
  build    build the project for weixin miniprogram
Examples:
  cml ${extCommand} dev
  cml ${extCommand} build
  `
  console.log(cmd)
})

}

