const traverse = require('@babel/traverse')['default'];
const deepTraverse = require('traverse');
const uniq = require('lodash.uniq');
const config = require('../config');

const DEFAULT_TOKENS_MAP = {
  WEEX: ['weex', 'global'],
  WX: ['wx', 'global'],
  BAIDU: ['swan', 'global'],
  ALIPAY: ['my', 'global'],
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
  let tokensMap = DEFAULT_TOKENS_MAP;
  const TOKENS_MAP = tokensMap;
  type = type.toUpperCase();

  let tokenList = [];

  if (type === 'ALL') {
    // 都要校验
    tokenList = TOKENS_MAP[type];
  }
  else {
    Object.keys(TOKENS_MAP).forEach(key => {
      // 把自身的和All的去掉，其他端的token放进去
      if (key !== type && key !== 'ALL') {
        tokenList = tokenList.concat(TOKENS_MAP[key]);
      }
    })
    // 然后要把自身的全局变量去掉
    for (let i = 0;i < tokenList.length;) {
      if (~TOKENS_MAP[type].indexOf(tokenList[i])) {
        tokenList.splice(i, 1);
      }
      else {
        i++;
      }
    }
  }
  tokenList = uniq(tokenList);
  const messages = [];

  traverse(ast, {
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
  let result = {};
  ast.program.body.forEach(function (node) {
    if (node.type == 'InterfaceDeclaration') {
      let interfaceName = node.id.name;
      result[interfaceName] = {};
      node.body.properties.map((property) => {
        result[interfaceName][property.key.name] = {
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
 *
 * @param  {Object} ast ast
 * @return {Object}     类定义
 */
const getClass = (ast) => {
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
          if (define.key.name == 'props') {
            define.value.properties.forEach(property => {
              clazz.properties.push(property.key.name);
            });
          }
          else if (define.type == 'ClassMethod') {
            clazz.methods.push(define.key.name);
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
};

/**
 * 校验接口与脚本
 *
 * @param  {Object}  interfaceAst 接口ast
 * @return {Array}                数组
 */
const checkScript = async (result) => {
  let script;
  let platforms = config.getPlatforms();

  ['script'].concat(platforms).forEach(item => {
    if (result[item] && result[item].ast) {
      script = result[item];
    }
  });

  if (!result['interface'] && script) {
    let interfaceFile = script.file.replace(new RegExp('\\.(' + platforms.join('|') + ')\\.cml$', 'ig'), '.interface');
    if (/\.interface$/.test(interfaceFile)) {
      result['interface'] = {
        messages: [{
          msg: 'file: [' + interfaceFile + '] was not found!'
        }],
        file: interfaceFile
      };
    }
  }

  if (result['interface'] && result['interface'].ast && script && script.ast) {
    const interfaceDefine = getInterfaces(result['interface'].ast);
    const classDefines = getClass(script.ast);

    classDefines.forEach(clazz => {
      clazz.interfaces.forEach(interfaceName => {
        let define = interfaceDefine[interfaceName];

        for (let key of Object.keys(define)) {
          if ((define[key] && define[key].type == 'Generic') && clazz.properties.indexOf(key) == -1) {
            result['interface'].messages.push({
              line: define[key].line,
              column: define[key].column,
              token: key,
              msg: 'property [' + key + '] is not found in file [' + script.file + ']'
            });
          }
          else if ((define[key] && define[key].type == 'Function') && clazz.methods.indexOf(key) == -1) {
            platforms.forEach(platform => {
              if (result[platform]) {
                result['interface'].messages.push({
                  line: define[key].line,
                  column: define[key].column,
                  token: key,
                  msg: 'method [' + key + '] is not found in file [' + script.file + ']'
                });
              }
            });
          }
        }

        clazz.events.forEach(event => {
          if (!define[event.event] || (define[event.event] && (define[event.event].type != 'Function'))) {
            script.messages.push({
              line: event.line,
              column: event.column,
              token: event.event,
              msg: 'event [' + event.event + '] is not defined in interface file [' + result['interface'].file + ']'
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
};


module.exports = checkScript;
