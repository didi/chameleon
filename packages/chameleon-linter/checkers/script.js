const traverse = require('@babel/traverse')['default'];
const deepTraverse = require('traverse');
const uniq = require('lodash.uniq');
const utils = require('../utils');

const DEFAULT_TOKENS_MAP = {
  WEEX: ['weex', 'global'],
  WX: ['wx', 'global'],
  BAIDU: ['swan', 'global'],
  ALIPAY: ['my', 'global'],
  AMAP: ['my', 'global'],
  WEB: [
    'postMessage', 'blur', 'focus', 'close', 'frames', 'self',
    'window', 'parent', 'opener', 'top', 'length', 'closed',
    'location', 'document', 'origin', 'name', 'history',
    'locationbar', 'menubar', 'personalbar', 'scrollbars',
    'statusbar', 'toolbar', 'status', 'frameElement', 'navigator',
    'customElements', 'external', 'screen', 'innerWidth',
    'innerHeight', 'scrollX', 'pageXOffset', 'scrollY',
    'pageYOffset', 'screenX', 'screenY', 'outerWidth', 'outerHeight',
    'devicePixelRatio', 'clientInformation', 'screenLeft',
    'screenTop', 'defaultStatus', 'defaultstatus', 'styleMedia',
    'onanimationend', 'onanimationiteration', 'onanimationstart',
    'onsearch', 'ontransitionend', 'onwebkitanimationend',
    'onwebkitanimationiteration', 'onwebkitanimationstart',
    'onwebkittransitionend', 'isSecureContext', 'onabort', 'onblur',
    'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick',
    'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag',
    'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart',
    'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror',
    'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress',
    'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata',
    'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave',
    'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel',
    'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset',
    'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onstalled',
    'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange',
    'onwaiting', 'onwheel', 'onauxclick', 'ongotpointercapture',
    'onlostpointercapture', 'onpointerdown', 'onpointermove',
    'onpointerup', 'onpointercancel', 'onpointerover', 'onpointerout',
    'onpointerenter', 'onpointerleave', 'onafterprint', 'onbeforeprint',
    'onbeforeunload', 'onhashchange', 'onlanguagechange', 'onmessage',
    'onmessageerror', 'onoffline', 'ononline', 'onpagehide', 'onpageshow',
    'onpopstate', 'onrejectionhandled', 'onstorage', 'onunhandledrejection',
    'onunload', 'performance', 'stop', 'open', 'alert', 'confirm', 'prompt',
    'print', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback',
    'cancelIdleCallback', 'captureEvents', 'releaseEvents', 'getComputedStyle',
    'matchMedia', 'moveTo', 'moveBy', 'resizeTo', 'resizeBy', 'getSelection', 'find',
    'webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', 'fetch',
    'btoa', 'atob', 'createImageBitmap', 'scroll', 'scrollTo', 'scrollBy',
    'onappinstalled', 'onbeforeinstallprompt', 'crypto', 'ondevicemotion',
    'ondeviceorientation', 'ondeviceorientationabsolute', 'indexedDB',
    'webkitStorageInfo', 'sessionStorage', 'localStorage', 'chrome',
    'visualViewport', 'speechSynthesis', 'webkitRequestFileSystem',
    'webkitResolveLocalFileSystemURL', 'openDatabase', 'applicationCache',
    'caches', 'whichAnimationEvent', 'animationendEvent', 'infinity',
    'SETTING', 'AppView', 'ExtensionOptions', 'ExtensionView', 'WebView',
    'iconPath', '_app', '_ZOOM_', 'Feed', 'md5', '$', 'jQuery', 'Search',
    'windmill', 'Lethargy', 'alertTimeOut', 'supportApps', 'lethargyX',
    'lethargyY', 'iView', 'onModuleResLoaded', 'iEditDelete', 'infinityDrag',
    'i', 'array', 'TEMPORARY', 'PERSISTENT', 'addEventListener',
    'removeEventListener', 'dispatchEvent'
  ]
};


// 这个path是否有需要校验的token
const needCheck = function (path, tokenList) {
  let flag = false;
  for (let i = 0; i < tokenList.length; i++) {
    let token = tokenList[i];
    // 判断一个token是否是一个变量
    if (checkToken(path, token)) {
      // 如果是对象中的key是需要忽略的
      flag = token;
      break;
    }
  }

  return flag;
};

// 是变量，并且不是对象的key值
function checkToken(path, token) {
  if (path.isIdentifier({ name: token })) {
    // 是对象的key值
    //   const api = {
    //     name: weex,
    //     };
    let isObjectKey = path.parent.type === 'ObjectProperty' && path.parentKey === 'key'
    // 对象成员
    /**
     * var a = {
     *  weex: 'a'
     * }
     * console.log(weex.a);
     */
    let isObjectMember = path.parent.type === 'MemberExpression' && path.parentKey === 'property'

    return !(isObjectKey || isObjectMember);
  }
  else {
    return false;
  }
}

const checkGlobal = function (ast, type = 'ALL') {
  const TOKENS_MAP = DEFAULT_TOKENS_MAP;
  let tokenList = [];
  let messages = [];
  type = type.toUpperCase();

  Object.keys(TOKENS_MAP).forEach(key => {
    if (type === 'ALL' || key !== type) {
      tokenList = tokenList.concat(TOKENS_MAP[key]);
    }
  });

  tokenList = uniq(tokenList);

  tokenList.length && traverse(ast, {
    enter: (path) => {
      // path是一个上下文
      // 需要校验的变量值

      let token = needCheck(path, tokenList);

      // 如果存在该token
      if (token) {
        let globalVariable = true;
        // 当前作用域
        let next = path.scope;

        while (next) {
          // 如果当前作用域存在该变量 就不是全局变量
          if (next.hasOwnBinding(token)) {
            globalVariable = false;
            break;
          }
          next = next.parent;
        }
        if (globalVariable && path.parent.type != 'ObjectMethod' && path.parent.type != 'ClassMethod') {
          messages.push({
            line: path.node.loc.start.line,
            column: path.node.loc.start.column,
            token: token,
            msg: 'global variable [' + token + '] should not used in this file'
          });
        }
      }
    }
  });
  return messages;
}


/**
 * 获取接口定义
 *
 * @param  {Object} ast ast
 * @return {Object}     分析结果
 */
const getInterfaces = (ast) => {
  let result = {
    name: '',
    properties: {}
  };
  ast.program.body.forEach(function (node) {
    if (node.type == 'InterfaceDeclaration') {
      let interfaceName = node.id.name;
      result.name = interfaceName;
      result.loc = {
        line: node.id.loc.start.line,
        column: node.id.loc.start.column
      };
      node.body.properties.map((property) => {
        result.properties[property.key.name] = {
          type: property.value.type.replace(/TypeAnnotation/g, ''),
          line: property.key.loc.start.line,
          column: property.key.loc.start.column
        };
      });
    }
  });
  return result;
};

/**
 * 获取类定义
 * @param   {Object} ast ast
 * @param   {Object} isComp a flag indentify whether the ast is component or an interface portion
 * @return  {Object}     类定义
 */
const getClass = (ast, isComp) => {
  return isComp ? getCompClassDef(ast) : getInterfacePortionClassDef(ast);
};

function getCompClassDef(ast) {
  let classes = [];

  traverse(ast, {
    enter(path) {
      if (path.node.type == 'ClassDeclaration') {
        let clazz = {
          interfaces: [],
          properties: [],
          events: [],
          methods: []
        };

        // 接口
        if (path.node['implements']) {
          path.node['implements'].forEach(implament => {
            clazz.interfaces.push(implament.id.name);
          });
        }

        path.node.body.body.forEach(define => {
          if (define.key.name == 'props') {
            define.value.properties.forEach(property => {
              clazz.properties.push(property.key.name);
            });
          }
          else if (define.key.name == 'methods') {
            define.value.properties.filter(property => {
              return property.type === 'ObjectMethod';
            }).forEach(property => {
              clazz.methods.push(property.key.name);
            });
          }
          else {
            deepTraverse(define)
              .nodes()
              .filter(function (item) {
                if (item && item.type == 'CallExpression') {
                  return true;
                }
              })
              .forEach(function (item) {

                if (item.callee.property && item.callee.property.name == '$cmlEmit') {
                  let event = {};

                  item.arguments.map((arg) => {
                    if (arg.value) {
                      event.line = arg.loc.start.line;
                      event.column = arg.loc.start.column;
                      event.event = arg.value;
                    }
                    else if (arg.properties) {
                      event.arguments = arg.properties.map(property => {
                        return property.key.name;
                      });
                    }
                  });
                  clazz.events.push(event);
                }
              });
          }
        });

        classes.push(clazz);
      }
    }
  });

  return classes;
}

function getInterfacePortionClassDef(ast) {
  let classes = [];

  traverse(ast, {
    enter(path) {
      if (path.node.type == 'ClassDeclaration') {
        let clazz = {
          interfaces: [],
          properties: [],
          events: [],
          methods: []
        };

        // 接口
        if (path.node['implements']) {
          path.node['implements'].forEach(implament => {
            clazz.interfaces.push(implament.id.name);
          });
        }

        // 参数
        path.node.body.body.forEach(define => {
          if (define.type == 'ClassProperty') {
            clazz.properties.push(define.key.name);
          }
          else if (define.type == 'ClassMethod') {
            clazz.methods.push(define.key.name);
          }
        });

        classes.push(clazz);
      }
    }
  });

  return classes;
}

/**
 * 校验接口与脚本
 *
 * @param  {Object}  interfaceAst 接口ast
 * @return {Array}                数组
 */
const checkScript = async (result) => {
  let validPlatforms = Object.keys(result)
    .filter(platform => {
      return platform && (!~['json', 'template', 'style', 'script'].indexOf(platform));
    })
    .filter(platform => {
      return platform && (platform != 'interface');
    });
  // add a script type for multi-file components.
  result['interface'] && validPlatforms.concat('script').forEach(platform => {
    let script;
    if (result[platform] && result[platform].ast) {
      script = result[platform];
    }
    if (result['interface'] && result['interface'].ast && script && script.ast) {
      const interfaceDefine = getInterfaces(result['interface'].ast);
      const classDefines = getClass(script.ast, platform === 'script');
      classDefines.forEach(clazz => {
        clazz.interfaces.forEach(interfaceName => {
          let define = interfaceDefine.name === interfaceName ? interfaceDefine.properties : null;
          if (!define) {
            result['interface'].messages.push({
              msg: `The implement class name: "${interfaceName}" used in file: "${utils.toSrcPath(script.file)}" doesn\'t match the name defined in it\'s interface file: "${utils.toSrcPath(result['interface'].file)}"`
            });
            return;
          }
          for (let key of Object.keys(define)) {
            if ((define[key] && define[key].type == 'Generic') && clazz.properties.indexOf(key) == -1) {
              result['interface'].messages.push({
                line: define[key].line,
                column: define[key].column,
                token: key,
                msg: `interface property "${key}" is not defined in file "${utils.toSrcPath(script.file)}"`
              });
            }
            else if ((define[key] && define[key].type == 'Function') && clazz.methods.indexOf(key) == -1) {
              result['interface'].messages.push({
                line: define[key].line,
                column: define[key].column,
                token: key,
                msg: `interface method "${key}" is not defined in file "${utils.toSrcPath(script.file)}"`
              });
            }
          }

          clazz.events.forEach(event => {
            if (!define[event.event] || (define[event.event] && (define[event.event].type != 'Function'))) {
              script.messages.push({
                line: event.line,
                column: event.column,
                token: event.event,
                msg: 'event "' + event.event + '" is not defined in interface file "' + utils.toSrcPath(result['interface'].file) + '"'
              });
            }
          });
        });
      });

      if (script.platform) {
        let messages = checkGlobal(script.ast, script.platform);
        script.messages = script.messages.concat(messages);
      }
    }
  });
};


module.exports = checkScript;
