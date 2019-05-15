const fs = require('fs');
const chalk = require('chalk');


const utils = require('./utils');
const linters = require('./linters');
const checkers = require('./checkers');
const config = require('./config');


/**
 * 文件语法检查
 *
 * @param  {Object}  parts 片段列表
 * @return {Promise}       promise
 */
const lintCmlFile = async (parts) => {
  let result = {};

  // 语法检查
  for (let partName of ['json', 'interface', 'template', 'script', 'style']) {
    let part = parts[partName];

    // 不存在的片段直接跳过
    if (!part) {
      continue;
    }

    switch (partName) {
      // 模板
      case 'template':
        if (result.json && result.json.obj) {
          result.template = await linters.templatelint(part, result.json.obj);
        }
        break;

      // 接口
      case 'interface':
        result['interface'] = await linters.scriptlint(part);
        break;

      // 脚本
      case 'script':
        result.script = await linters.scriptlint(part);
        break;

      // json
      case 'json':
        result.json = await linters.jsonlint(part);
        break;

      // 样式
      case 'style':
        result.style = await linters.stylelint(part);
        break;

      default:

        break;
    }
    result[partName] = result[partName] || {};
    result[partName].start = part.line;
    result[partName].type = part.type;
    result[partName].file = part.file;
    result[partName].platform = part.platformType;
  }

  return result;
}

/**
 * 文件逻辑检查
 *
 * @param  {Object}  lintedResult 语法校验后的结果
 * @param  {string}  filepath     文件路径
 * @return {Promise}              promise
 */
const checkFile = async (lintedResult, filepath) => {
  // 校验style
  checkers.style(lintedResult);

  // 校验json
  checkers.json(lintedResult);

  // 校验脚本
  checkers.script(lintedResult);

  // 模板校验 BEGIN
  if (
    lintedResult.template && lintedResult.template.ast &&
    lintedResult.script && lintedResult.script.ast &&
    lintedResult.json && lintedResult.json.obj
  ) {
    let templateChecker = new checkers.Template(filepath, lintedResult);
    lintedResult.template.messages.push(...templateChecker.check());
  }
  // 模板校验 END

  return lintedResult;
};

/**
 * 处理过程
 *
 * @param  {string}   filepath   文件路径
 * @return {Promise}             promise
 */
const checkFileContent = async (filepath) => {
  let parts = utils.getCmlParts(filepath);
  let result = await lintCmlFile(parts);
  result = await checkFile(result, filepath);

  return result;
};

/**
 * 检查CML文件格式
 *
 * @param  {string} filepath 文件路径
 * @return {Object}          校验结果
 */
const checkCMLFileSpecification = async (filepath) => {
  let platforms = config.getPlatforms();
  let result = {
    core: {
      messages: []
    }
  };
  if (new RegExp('([^/]*?)\.(' + platforms.join('|') + ')\.cml$', 'g').test(filepath)) {
    let interfaceFile = filepath.replace(new RegExp('\.(' + platforms.join('|') + ')\.cml$', 'g'), '.interface');
    if (!fs.existsSync(interfaceFile)) {
      result.core.messages.push(chalk.red('[error]') + ' file: ' + interfaceFile + ' is not exist!');
    }
    // cml多文件格式
    else {
      Object.assign(result, await checkFileContent(filepath));
    }
  }
  // cml单文件格式
  else {
    Object.assign(result, await checkFileContent(filepath));
  }
  return result;
}

/**
 * 检查接口文件规范
 *
 * @param  {string}  filepath 文件路径
 * @return {Promise}          promise
 */
const checkInterfaceFileSpecification = async (filepath) => {
  let {parts} = utils.getInterfaceParts(filepath);
  let result = {};
  let keys = Object.keys(parts);
  if (keys.length > 1) {

    for (let key in parts) {
      if (parts.hasOwnProperty(key)) {
        let part = parts[key];
        result[key] = await linters.scriptlint(part);
        result[key] = result[key] || {};
        result[key].start = part.line;
        result[key].type = part.type;
        result[key].file = part.file;
        result[key].platform = part.platformType;
      }
    }
    // 校验脚本
    checkers.script(result);
    return result;
  }
  else {
    return {};
  }
}

/**
 * 校验文件格式
 *
 * @param  {string}  filepath 文件路径
 * @param  {string}  filetype 文件类型
 * @return {Promise}          promise
 */
const checkFileSpecification = async (filepath, filetype) => {

  if (filetype == 'cml') {
    return checkCMLFileSpecification(filepath);
  }
  else if (filetype == 'interface') {
    return checkInterfaceFileSpecification(filepath);
  }
};


module.exports = checkFileSpecification;
module.exports.lintCmlFile = lintCmlFile;
