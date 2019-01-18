const config = require('../config');
const cmlUtils = require('chameleon-tool-utils');

/**
 * 查找token
 *
 * @param  {Object} ast      语法树
 * @param  {Array}  tokens   token列表
 * @param  {string} template 模板
 * @return {Object}          查找结果
 */
let findTokens = (ast, tokens, template) => {
  let result = {};

  if (ast) {
    ast.program.body[0].expression.right.properties.forEach(property => {
      if (property.key.value == tokens[0]) {
        if (tokens.length == 1) {
          result = {
            line: property.key.loc.start.line - 1,
            column: property.key.loc.start.column,
            token: tokens.join('.'),
            msg: template.replace(/\{\{token\}\}/, tokens.join(','))
          };
        }
        else if (tokens.length === 2) {
          property.value.properties.forEach(property => {
            if (property.key.value == tokens[1]) {
              result = {
                line: property.key.loc.start.line - 1,
                column: property.key.loc.start.column,
                token: tokens.join('.'),
                msg: template.replace(/\{\{token\}\}/, tokens.join('.'))
              };
            }
          });
        }
        else {
          property.value.properties.forEach(property => {
            if (property.key.value == tokens[1]) {
              if (property.value.properties) {
                property.value.properties.forEach(property => {
                  if (property.key.value == tokens[2]) {
                    result = {
                      line: property.value.loc.start.line - 1,
                      column: property.value.loc.start.column,
                      token: tokens.join('.'),
                      msg: template
                    };
                  }
                });
              }
            }
          });
        }
      }
    });
  }
  return result;
}

let checkComponentName = (name) => {
  let keys = [
    'a', 'div', 'image', 'indicator', 'input', 'list', 'cell', 'recycle-list',
    'loading', 'refresh', 'scroller', 'slider', 'switch', 'text', 'textarea',
    'video', 'waterfall', 'web', 'richtext'
  ];

  if (keys.indexOf(name) > -1) {
    return false;
  }
  return true;
};

module.exports = (result) => {
  if (result.json && result.json.obj) {
    let json = result.json.obj;
    let platforms = config.getPlatforms();
    if (!result.json.platform || result.json.platform == 'weex') {
      let usingComponents = (json.base || {}).usingComponents || {};
      for (let key in usingComponents) {
        if (!checkComponentName(key)) {
          if (result.json.ast) {
            result.json.messages.push(findTokens(result.json.ast, ['base', 'usingComponents', key], 'component [' + key + '] is conflicted with weex buildin component, please rename the component!'));
          }
        }
      }
      let platformUsingComponents = ((json[result.json.platform] || {}).usingComponents) || {};
      for (let key in platformUsingComponents) {
        if (!checkComponentName(key)) {
          if (result.json.ast) {
            result.json.messages.push(findTokens(result.json.ast, ['weex', 'usingComponents', key], 'component [' + key + '] is conflicted with weex buildin component, please rename the component'));
          }
        }
      }
    }
    
    
    // 分平台
    if (result.json.platform) {
      platforms.forEach((item) => {
        if (json[item] && item != result.json.platform) {
          if (result.json.ast) {
            result.json.messages.push(findTokens(result.json.ast, [item], 'Useless fields: {{token}}'));
          }
        }
      });
    }
    // 不分平台
    else {
      platforms.forEach((item) => {
        if (json[item] && json[item].usingComponents) {
          if (result.json.ast) {
            result.json.messages.push(findTokens(result.json.ast, [item, 'usingComponents'], 'Useless fields: {{token}}'));
          }
        }
      });
    }


    ['base'].concat(platforms).forEach(item => {
      if (json[item] && json[item].usingComponents) {
        for (let key in json[item].usingComponents) {
          let filePath = json[item].usingComponents[key];
          let currentWorkspace = config.getCurrentWorkspace();
          let componentInfo = cmlUtils.lintHandleComponentUrl(currentWorkspace, result.json.file, filePath);

          if (!componentInfo.filePath && componentInfo.refUrl) {
            if (result.json.ast) {
              result.json.messages.push(findTokens(result.json.ast, [item, 'usingComponents', key], 'component: [' + filePath + '] is not found'));
            }
          }
        }
      }
    });
  }

};
