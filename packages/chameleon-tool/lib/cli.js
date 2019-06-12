#! /usr/bin/env node

var commander = require('commander');
var cmlpackage = require('../package.json');

var argv = process.argv;

module.exports.run = function () {

  var first = argv[2];
  if (first === '-v' || first === '--version' || first === '-V') {
    cml.log.notice(`current running chameleon(${cml.root})`)
    version();
  } else {
    commander.usage('[command] [options]')
    commander.version(`${cmlpackage.name}@${cmlpackage.version}`)
    let cmdList = ['init', 'dev', 'build', 'server', 'web', 'weex', 'wx', 'baidu', 'alipay', 'qq'];
    cmdList = cmdList.map(key => {
      return {
        key: 'key',
        cmd: require(`../commanders/${key}/index.js`) // eslint-disable-line 
      }
    })

    cmdList.forEach(item => {
      let cmd = item.cmd;
      cmd.register(
        commander
          .command(cmd.name)
          .option('-l, --log [debug]', 'logLevel')
          .usage(cmd.usage)
          .description(cmd.desc)
      );
    })
    commander.parse(argv);
  }

  function version() {
    console.log(`${cmlpackage.name}@${cmlpackage.version}`)
  }
}
