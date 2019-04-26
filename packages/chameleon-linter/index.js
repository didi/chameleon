const glob = require('glob');
const fileStruture = require('./file-structure');
const fileSpec = require('./file-spec');
const utils = require('./utils');
const config = require('./config');
const chalk = require('chalk');

// process.on('uncaughtException', function (err) {
//   console.log(err);
// });


// process.on('unhandledRejection', error => {
//   // Will print "unhandledRejection err is not defined"
//   console.log('unhandledRejection', error.message);
// });

/**
 * 获取cml文件列表
 *
 * @return {array} 文件列表
 */
const getCMLFileList = () => {
  return new Promise((resolve, reject) => {
    glob('src/**/*.cml', {}, function (er, files) {
      resolve(files);
    });
  });
};


/**
 * 获取interface文件列表
 *
 * @return {Array} 文件列表
 */
const getInterfaceList = () => {
  return new Promise((resolve, reject) => {
    glob('src/**/*.interface', {}, function (er, files) {
      resolve(files);
    });
  });
}

module.exports = async (currentWorkspace, needOutputWarnings = true) => {
  await config.init(currentWorkspace);

  if (!config.isChameleonProject()) {
    console.log(chalk.red('[ERROR] ') + 'The current project is not a chameleon project!');
    return;
  }

  let results = [];

  if (config.getRuleOption('core-files-check')) {
    // 1. 校验目录结构
    results.push(fileStruture());
  }

  // 2. 检查所有的cml文件
  if (config.getRuleOption('cml-files-check')) {
    let files = await getCMLFileList();
    for (let filepath of files) {
      let result = await fileSpec(filepath, 'cml');
      if (result && Object.keys(result).length) {
        results.push(result);
      }
    }
  }

  // 3. 检查所有的interface文件
  if (config.getRuleOption('interface-files-check')) {
    let interfaces = await getInterfaceList();
    for (let filepath of interfaces) {
      let result = await fileSpec(filepath, 'interface');
      if (result && Object.keys(result).length) {
        results.push(result);
      }
    }
  }

  // 4. 检查其他文件
  // todo

  // 5. 输出
  if (needOutputWarnings) {
    console.log(chalk.cyan('[INFO] ') + 'Syntax check results:');
    let hasOutput = false;
    results.forEach((result) => {
      if (utils.outputWarnings(result)) {
        hasOutput = true;
      }
    });
    if (!hasOutput) {
      console.log('Congratulations! Everything is OK!');
    }
  }
  return results;
};
