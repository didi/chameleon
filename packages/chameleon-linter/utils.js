const fs = require('fs');
const chalk = require('chalk');
const groupBy = require('lodash.groupby');
const filter = require('lodash.filter');
const map = require('lodash.map');
const cliUtils = require('chameleon-tool-utils');
const config = require('./config');

let isCmlComponent = (templatePath, usingPath) => {
  let currentWorkspace = config.getCurrentWorkspace();
  let interfaceInfo = cliUtils.findInterfaceFile(currentWorkspace, templatePath, usingPath);
  let componentInfo = cliUtils.lintHandleComponentUrl(currentWorkspace, templatePath, usingPath);
  return !!interfaceInfo.filePath || (componentInfo && componentInfo.isCml);
}

/**
 * 转换成驼峰写法
 *
 * @param  {string} variable 变量名称
 * @return {string}          变量驼峰命名
 */
let toCamelCase = variable => variable.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

/**
 *
 * @param {String} str target string
 */
const toDash = (str) => {
  return str.replace(/([A-Z])/g, (match, caps) => {
    return '-' + caps.toLowerCase();
  });
};

/**
 * 获取全部的部分
 *
 * @param  {string} content   内容
 * @param  {string} platform  平台
 * @return {Array}            数组
 */
let getCmlFileParts = (filepath, platform) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let parts = cliUtils.splitParts({content});
  let result = {};

  map(parts, (values, key) => {
    switch (key) {
      case 'script':
        if (values.length) {
          values.forEach(value => {
            // interface | json
            if (value.attrs && value.cmlType) {
              result[value.cmlType] = value;
              result[value.cmlType].type = value.cmlType;
            }
            else {
              result[key] = value;
            }
          });
        }
        break;
      default:
        if (values.length) {
          result[key] = values[0];
        }
        break;
    }

    map(result, (value, type) => {
      let params = {};

      map(result[type].attrs, (attr, key) => {
        params[toCamelCase(key)] = attr;
      });

      Object.assign(result[type], {
        params: params,
        line: result[type].startLine,
        file: filepath,
        platformType: platform,
        rawContent: result[type].tagContent
      });
    });
  });

  return result;
};

/**
 * 获取所有的片段
 *
 * @param  {string} filepath 文件路径
 * @return {Objhect}         文件片段表
 */
let getCmlParts = filepath => {
  let parts = {};
  let platforms = config.getPlatforms();
  let platform;

  let result = new RegExp('([^/]*?)\.(' + platforms.join('|') + ')\.cml$', 'g').exec(filepath);
  if (result) {
    let interfaceFile = filepath.replace(new RegExp('\.(' + platforms.join('|') + ')\.cml$', 'ig'), '.interface');
    platform = result[2];
    if (fs.existsSync(interfaceFile)) {
      Object.assign(parts, getCmlFileParts(interfaceFile));
    }
  }
  Object.assign(parts, getCmlFileParts(filepath, platform));
  return parts;
};


let getInterfaceParts = filepath => {
  let content = fs.readFileSync(filepath, 'utf8');
  let result = {};
  let parts = cliUtils.splitParts({content});

  if (parts.script) {
    parts.script.forEach(item => {
      result[item.cmlType] = item;

      Object.assign(result[item.cmlType], {
        params: {},
        line: item.startLine,
        file: filepath,
        rawContent: item.tagContent,
        platformType: item.cmlType
      });
    });
  }

  return result;
}


/**
 * 输出出错信息
 *
 * @param  {Object} result    出错信息对象
 * @param  {string} filepath  文件路径
 */
let outputWarnings = (result) => {
  let flag = false;
  result = filter(Object.values(result), (item) => {
    if (!item.messages || (item.messages && item.messages.length == 0)) {
      return false;
    }
    flag = true;
    return true;
  });

  result = groupBy(result, 'file');
  for (let key of Object.keys(result)) {
    if (key !== 'undefined') {
      console.log(chalk.yellow('[file]') + ': ' + key);
    }
    result[key]
      .sort((a, b) => {
        return a.start - b.start;
      })
      .forEach((item) => {
        if (item.type) {
          console.log(chalk.red(item.type + (item.platform ? (' [' + item.platform + ']') : '') + ' errors:'));
        }

        item.messages
          .sort((preMsg, nextMsg) => {
            return preMsg.line - nextMsg.line;
          })
          .forEach((message) => {
            if (message.line !== undefined && item.start !== undefined && message.column !== undefined) {
              console.log('[' + chalk.cyan(message.line + item.start - 1) + ' (line), ' + chalk.cyan(message.column) + ' (column)]' + ' ' + message.msg);
            }
            else {
              console.log(message);
            }
          });
      });
    // 保留！！！需要输出一个空行
    console.log('');
  }
  return flag;
};

module.exports = {
  getCmlParts,
  getInterfaceParts,
  outputWarnings,
  toDash,
  isCmlComponent
};
