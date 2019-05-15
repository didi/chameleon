const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const groupBy = require('lodash.groupby');
const filter = require('lodash.filter');
const map = require('lodash.map');
const cliUtils = require('chameleon-tool-utils');
const config = require('./config');
const Message = require('./classes/message');

let isCmlComponent = (templatePath, usingPath) => {
  let currentWorkspace = config.getCurrentWorkspace();
  let interfaceInfo = cliUtils.findInterfaceFile(currentWorkspace, templatePath, usingPath);
  let componentInfo = cliUtils.lintHandleComponentUrl(currentWorkspace, templatePath, usingPath);
  return !!interfaceInfo.filePath || (componentInfo && componentInfo.isCml);
}

let toSrcPath = (filePath = '') => {
  return (filePath && path.isAbsolute(filePath)) ? path.relative(config.getCurrentWorkspace(), filePath) : filePath;
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
  let _result = {
    parts: {},
    messages: []
  };

  _retrieveParts(filepath);

  function _retrieveParts(interfaceFilePath) {
    // terminate condition
    if (!fs.existsSync(interfaceFilePath)) {
      return;
    }

    const content = fs.readFileSync(interfaceFilePath, 'utf8');
    const parts = cliUtils.splitParts({content});
    // search parts.script array for interface defination and platform specific definations.
    if (parts.script) {
      parts.script.forEach(item => {
        let errMsg = null;
        let extraPartInfo = {
          params: {},
          line: item.startLine,
          file: interfaceFilePath,
          rawContent: item.tagContent,
          platformType: item.cmlType
        };
        // for interface portion we should keep the origin filepath
        if (item.cmlType === 'interface') {
          extraPartInfo.file = filepath;
        }
        // check src references for platform definations
        if (item.cmlType != 'interface' && item.attrs && item.attrs.src) {
          const targetScriptPath = path.resolve(path.dirname(interfaceFilePath), item.attrs.src);
          // the referenced source is a js file
          if (/.js$/.test(item.attrs.src)) {
            if (!fs.existsSync(targetScriptPath)) {
              errMsg = new Message({
                line: item.line,
                column: item.tagContent.indexOf(item.attrs.src) + 1,
                token: item.attrs.src,
                msg: `The javascript file: "${toSrcPath(targetScriptPath)}" specified with attribute src was not found`
              });
            } else {
              extraPartInfo.content = extraPartInfo.rawContent = extraPartInfo.tagContent = fs.readFileSync(targetScriptPath, 'utf8');
              extraPartInfo.file = targetScriptPath;
            }
          }
          // the referenced source is a cml file
          if (/.cml$/.test(item.attrs.src)) {
            if (!fs.existsSync(targetScriptPath)) {
              errMsg = new Message({
                line: item.line,
                column: item.tagContent.indexOf(item.attrs.src) + 1,
                token: item.attrs.src,
                msg: `The cml file: "${toSrcPath(targetScriptPath)}" specified with attribute src was not found`
              });
            } else {
              const cmlFileContent = fs.readFileSync(targetScriptPath, 'utf8');
              const cmlParts = cliUtils.splitParts({content: cmlFileContent});
              const scriptPart = cmlParts.script ? cmlParts.script.filter(part => {
                return part.type === 'script';
              }) : null;
              if (scriptPart && scriptPart.length) {
                extraPartInfo.content = extraPartInfo.rawContent = extraPartInfo.tagContent = scriptPart[0].content;
                extraPartInfo.file = targetScriptPath;
              } else {
                errMsg = new Message({
                  line: item.line,
                  column: item.tagContent.indexOf(item.attrs.src) + 1,
                  token: item.attrs.src,
                  msg: `The referenced file: "${toSrcPath(targetScriptPath)}" may not has a script portion`
                });
              }
            }
          }
        }
        // previous cmlType defination has a higher priority.
        if (!errMsg && !_result.parts[item.cmlType]) {
          _result.parts[item.cmlType] = {...item, ...extraPartInfo};
        }
        if (errMsg) {
          _result.messages.push(errMsg);
        }
      });
    }
    // search parts.customBlocks array for include defination which may contains another interface file.
    let include = null;
    if (parts.customBlocks) {
      parts.customBlocks.forEach(item => {
        if (item.type === 'include') {
          include = item;
        }
      });
    }
    if (include && include.attrs && include.attrs.src) {
      let newFilePath = path.resolve(path.dirname(interfaceFilePath), include.attrs.src);
      return _retrieveParts(newFilePath);
    }
    return;
  }

  return _result;
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
            if (preMsg.line == undefined || preMsg.column == undefined || nextMsg.line == undefined || nextMsg.column == undefined) {
              return 0;
            }
            return (preMsg.line - nextMsg.line) * 10000 + (preMsg.column - nextMsg.column);
          })
          .forEach((message) => {
            if (message.line !== undefined && item.start !== undefined && message.column !== undefined) {
              console.log('[' + chalk.cyan(message.line + item.start - 1) + ' (line), ' + chalk.cyan(message.column) + ' (column)]' + ' ' + message.msg);
            }
            else {
              console.log(message.msg);
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
  isCmlComponent,
  toSrcPath
};
