#! /usr/bin/env node

const commander = require('commander');
const cmlpackage = require('../package.json');
const argv = process.argv;
const path = require('path');
module.exports.run = function () {

  var first = argv[2];
  if (first === '-v' || first === '--version' || first === '-V') {
    cml.log.notice(`current running chameleon(${cml.root})`)
    version();
  } else {
    commander.usage('[command] [options]')
    commander.version(`${cmlpackage.name}@${cmlpackage.version}`)
    let cmdList = ['init', 'dev', 'build', 'server', 'web', 'weex', 'wx', 'baidu', 'alipay'];
    cmdList = cmdList.map(key => ({
      key,
        cmd: require(`../commanders/${key}/index.js`) // eslint-disable-line 
    }))

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

    if (cml.config.get().commanderPlugins && cml.config.get().commanderPlugins.length > 0) {
      cml.config.get().commanderPlugins.forEach(item => {
        let CommanderPlugin = require(path.join(cml.projectRoot, 'node_modules', item)); // eslint-disable-line
        let commanderInstance = new CommanderPlugin();
        let subCommander = commander
          .command(commanderInstance.name)
          .option('-l, --log [debug]', 'logLevel')
          .usage(commanderInstance.usage)
          .description(commanderInstance.desc);
        commanderInstance.registerCommander({commander: subCommander})
      })
    }
    commander.parse(argv);
  }

  function version() {
    console.log(`${cmlpackage.name}@${cmlpackage.version}`)
  }
}
