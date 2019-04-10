#! /usr/bin/env node

const commander = require('commander');
const cmlpackage = require('../package.json');
const argv = process.argv;
// const path = require('path');

module.exports.run = function () {

  var first = argv[2];
  if (first === '-v' || first === '--version' || first === '-V') {
    cml.log.notice(`current running chameleon(${cml.root})`)
    version();
  } else {
    // if (cml.config.get().commanderPlugins && cml.config.get().commanderPlugins.length > 0) {
    //   cml.config.get().commanderPlugins.forEach(item => {
    //     let CommanderPlugin = require(path.join(cml.projectRoot, 'node_modules', item)); // eslint-disable-line
    //     let commanderInstance = new CommanderPlugin();
    //     let subCommander = commander
    //       .command(commanderInstance.name)
    //       .option('-l, --log [debug]', 'logLevel')
    //       .usage(commanderInstance.usage)
    //       .description(commanderInstance.desc);
    //     commanderInstance.registerCommander({commander: subCommander})
    //   })
    // }



    //   扩展端
    // const extendPlatform = require('../commanders/extendPlatform.js');
    // if (cml.config.get().platformPlugin && cml.config.get().platformPlugin[first]) {
    //   extendPlatform({platform: first, media: argv[3]});
    // } 
    const extPlatform = require('../commanders/extPlatform.js');

    if (cml.config.get().extPlatform && ~Object.keys(cml.config.get().extPlatform).indexOf(first)) {
      extPlatform({type: first, media: argv[3]});
    } 
    
    else {
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
      commander.parse(argv);
    }
  }

  function version() {
    console.log(`${cmlpackage.name}@${cmlpackage.version}`)
  }
}
