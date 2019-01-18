const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('./config');

/**
 * 文件列表
 *
 * @type {Array}
 */
const fileList = [
  'chameleon.config.js',
  'src/app/app.cml',
  'src/router.config.json'
];

/**
 * 校验文件是否存在
 *
 * @return {Object}         校验结果
 */
const checkFilesExist = () => {
  let currentWorkspace = config.getCurrentWorkspace();

  let messages = [];
  let result = {core: {messages}};

  fileList.forEach(filepath => {
    let fileExist = fs.existsSync(path.resolve(currentWorkspace, filepath));

    if (!fileExist) {
      messages.push(chalk.red('[error]') + ' file: ' + filepath + ' is not exist!');
    }
  });
  return result;
};

module.exports = checkFilesExist;
