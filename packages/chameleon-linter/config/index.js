let fs = require('fs');
let path = require('path');
let parserConfig = require('./parser-config');
let config = {};
let currentWorkspace;

/**
 * 获取lint的配置
 *
 * @param  {string} workspace 工作空间
 * @return {Object}           配置
 */
let getLintConfig = (workspace) => {
  let config = {};
  let cfgFilePath = path.resolve(workspace, '.cmllintrc');
  let defaultCfgFilePath = path.resolve(__filename, '../.cmllintrc');
  let defaultConfig = {};
  let defaultCfgContent = fs.readFileSync(defaultCfgFilePath);
  defaultConfig = (new Function('return ' + defaultCfgContent))();

  if (fs.existsSync(cfgFilePath)) {
    try {
      let cfgContent = fs.readFileSync(cfgFilePath);
      let userConfig = (new Function('return ' + cfgContent))();
      config = Object.assign({}, defaultConfig, userConfig);
    }
    catch (e) {
      config = defaultConfig;
    }
  }
  else {
    config = defaultConfig;
  }
  return config;
}

/**
 * 初始化
 *
 * @param  {string} workspace 工作空间
 */
let init = (workspace) => {
  currentWorkspace = workspace;
  config = getLintConfig(workspace);
};

/**
 * 获取当前的工作空间
 *
 * @return {string} 工作空间
 */
let getCurrentWorkspace = () => {
  return currentWorkspace;
};

/**
 * 获取规则数据
 *
 * @param  {string} ruleName 规则名称
 * @return {Object}          规则内容
 */
let getRuleOption = (ruleName) => {
  return config[ruleName];
};

let isChameleonProject = () => {
  let cmlCfgFilePath = path.resolve(currentWorkspace, './chameleon.config.js');

  if (!fs.existsSync(cmlCfgFilePath)) {
    return false
  }
  return true;
};

let getParserConfig = () => {
  return parserConfig;
}

let getPlatforms = () => {
  return config.platforms;
};

let getCurrentProjectPlatforms = () => {
  let defaultPlatforms = getPlatforms();
  
  if (global.cml) {
    return global.cml.config.get().platforms || defaultPlatforms;
  }
  return defaultPlatforms;
};

let neexLintWeex = () => {
  let platforms = getCurrentProjectPlatforms();
  if (platforms.indexOf('weex') > -1) {
    return true;
  }
  return false;
}

module.exports = {
  init,
  getCurrentWorkspace,
  getRuleOption,
  isChameleonProject,
  getParserConfig,
  getPlatforms,
  neexLintWeex
}
