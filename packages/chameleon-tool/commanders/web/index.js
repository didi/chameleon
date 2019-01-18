

exports.name = 'web';
exports.usage = '[command] [options]';
exports.desc = 'tools for the web project';


exports.register = function (commander) {
  commander
    .option('-r, --root [root]', 'specify project root')
    .action(function (...args) {
      /* eslint-disable */
      cml.log.startBuilding();
      const inquirer = require('inquirer');
      const utils = require('../utils.js');
      /* eslint-disable */
      cml.utils.checkProjectConfig();
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

      function handlerCmd(cmd) {
        cml.media = cmd;
        utils.startReleaseOne(cmd, 'web');
      }


    })
  commander.on('--help', function() {
    var cmd = `
  Commands:
    dev     develop the project for web
    build   build the project for web
  Examples:
    cml web dev
    cml web build
    `
    console.log(cmd)
  })


}
