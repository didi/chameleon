

exports.name = 'server';
exports.usage = '[command] [options]';
exports.desc = 'tools for the dev server';

exports.register = function (commander) {
  commander
    .action(function (...args) {

      /* eslint-disable  */    
      const tpl = require('chameleon-templates');
      const inquirer = require('inquirer');
      const fse = require('fs-extra');
      /* eslint-disable  */  

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
            'init',
            'open'
          ]
        }]
        inquirer.prompt(questions).then(answers => {
          handlerCmd(answers.type)
        })
      }

      function handlerCmd(cmd) {
        switch (cmd) {
          case 'open':
            cml.utils.open(cml.utils.getDevServerPath());
            break;
          case 'init':
            fse.copySync(tpl.serverTpl, cml.utils.getDevServerPath());
            cml.log.notice(`already init php server to ${cml.utils.getDevServerPath()}`)
            cml.log.notice(`you can use 'chameleon server open' to open the server workspace`)
            break;
          case 'clean':
            fse.emptyDirSync(cml.utils.getDevServerPath());
            cml.log.notice(`clean success!`)
            break;
          default:
            break;

        }
      }
    })
  commander.on('--help', function() {
    var cmd = `
  Commands:
    open   open the php server directory
    init   initialize the php server framework
    clean  clean server files
  Examples:
    cml server open
    cml server init
    cml server clean
    `
    console.log(cmd)
  })

}
