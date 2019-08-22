
exports.name = 'weex';
exports.usage = '[command] [options]';
exports.desc = 'tools for the weex project';

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
            'build',
            'proxy'
          ]
        }]
        inquirer.prompt(questions).then(answers => {
          handlerCmd(answers.type)
        })
      }

      function handlerCmd(cmd) {
        cml.media = cmd;
        utils.startReleaseOne(cmd, 'weex');

      }


    })
  commander.on('--help', function() {
    var cmd = `
  Commands:
    dev     develop the project for weex 
    build   build the project for weex 
  Examples:
    cml weex dev
    cml weex build
    `
    console.log(cmd)
  })

}

