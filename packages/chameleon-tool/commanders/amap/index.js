
exports.name = 'amap';
exports.usage = '[command] [options]';
exports.desc = 'tools for the amap miniprogram project';

exports.register = function (commander) {
  commander
    .option('-r, --root [root]', 'specify project root')
    .action(function (...args) {
      cml.utils.checkProjectConfig();
      /* eslint-disable */
      //提高cml -h命令速度 
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
        utils.startReleaseOne(cmd, 'amap');
      }

    })

  commander.on('--help', function() {
    var cmd = `
  Commands:
    dev      develop the project for amap miniprogram
    build    build the project for amap miniprogram
  Examples:
    cml amap dev
    cml amap build
    `
    console.log(cmd)
  })

}

