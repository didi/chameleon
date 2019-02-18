
const babylon = require('babylon');
const t = require('@babel/types');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const {
  tagMap
} = require('../common/cml-map.js')
const utils = require('./utils');
// 注意，所有要再次使用babylon解析html模板的，必须再次将模板转化为符合jsx语法
exports.preParseDiffPlatformTag = function(htmlContent, type) {
  let activeTags = tagMap.diffTagMap[type] || [];
  let deadTags = []
  Object.keys(tagMap.diffTagMap).forEach(key => {
    if (key !== type) {
      deadTags = deadTags.concat(tagMap.diffTagMap[key])
    }
  })

  activeTags.forEach(tag => {
    htmlContent = exports.activeTagHandler(tag, htmlContent);
  })
  deadTags.forEach(tag => {
    htmlContent = exports.deadTagHandler(tag, htmlContent);
  })
  return htmlContent
}
exports.deadTagHandler = function(tag, content) {
  var contentReg = new RegExp(`<\\s*${tag}[\\s\\S]*?>[\\s\\S]*?<\\s*\\/\\s*${tag}[\\s\\S]*?>`, 'ig')
  content = content.replace(contentReg, '')
  return content
}
exports.activeTagHandler = function (tag, content) {
  let startreg = new RegExp(`<\\s*${tag}[\\s\\S]*?>`, 'ig')
  let endreg = new RegExp(`<\\s*\\/\\s*${tag}[\\s\\S]*?>`, 'ig')

  content = content.replace(startreg, '')
  content = content.replace(endreg, '')

  return content;
}


// 模板前置处理器
// 预处理:属性  :name="sth" ==> v-bind:name="sth",因为jsx识别不了 :name="sth"
exports.preParseBindAttr = function (content) {
  content = content.replace(/(\s+):([a-zA-Z_\-0-9]+?\s*=\s*["'][^"']*?["'])/ig, (m, $1, $2) => `${$1}v-bind:${$2}`);
  return content;
}

/**
 * 处理vue的事件
 * <a v-on:click="doSomething"> ... </a>
 * <a @click="doSomething"> ... </a>
 *
 * <a bindclick="doSomething"> ... </a>
 * @param {*} content
 */

exports.preParseVueEvent = function (content) {
  //         v-on | @--> <--  属性名  --><--=-->
  let reg = /(?:v\-on:|@)([^\s"'<>\/=]+?)\s*=\s*/g
  content = content.replace(reg, (m, $1) => {
    $1 = $1 === 'click' ? 'tap' : $1;
    return `c-bind:${$1}=`
  });
  return content;
}
// 处理 {{}} 里面的 >  < ==>
exports.preParseGtLt = function(content) {
  let reg = /{{([\s\S]*?)}}/g;
  return content.replace(reg, function(match) {
    return exports._operationGtLt(match);
  })
}
// 预处理 标签内的 {{item.id}} 这种语法jsx无法识别，转化为 _cml{item.id}lmc_
exports.preParseMustache = function (content) {
  let reg = />([\s\S]*?)<[a-zA-Z\/\-_]+?/g;
  return content.replace(reg, function (match, key) {
    return exports._operationMustache(match);
  })
}
exports.preDisappearAnnotation = function (content) {
  let annotionReg = /<!--[\s\S]*?-->/g;
  return content.replace(annotionReg, function (match) {
    return '';
  })
}
// 将模板预处理符合jsx解析规则，比如 : {{}} 等
exports.preParseTemplateToSatisfactoryJSX = function(source, callbacks) {
  // 预处理html模板中的注释，jsx不支持，这个需要优先处理，防止解析 < > 的时候出现问题；
  callbacks.forEach((callback) => {
    source = exports[callback](source);
  })
  return source;
}
exports.preParseAnimation = function(source, type) {
  let callbacks = ['preDisappearAnnotation', 'preParseGtLt', 'preParseBindAttr', 'preParseVueEvent', 'preParseMustache', 'postParseLtGt']
  source = exports.preParseTemplateToSatisfactoryJSX(source, callbacks);
  const ast = babylon.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isJSXAttribute(node) && node.name.name === 'c-animation') {
        let value = utils.trimCurly(node.value.value);
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`c-bind:transitionend`), t.stringLiteral(`_animationCb('${value}',$event)`)))
      }
    }
  });
  // 这里注意，每次经过babel之后，中文都需要转义过来；
  return exports.postParseUnicode(generate(ast).code);
}
// 模板后置处理器
exports.postParseMustache = function (content) {
  let reg = />([\s\S]*?)<[a-zA-Z\/\-_]+?/g;
  return content.replace(reg, function (match, key) {
    return exports._deOperationMustache(match);
  })
}
exports.postParseLtGt = function(content) {
  let reg = /{{([\s\S]*?)}}/g;
  return content.replace(reg, function(match) {
    return exports._deOperationGtLt(match);
  })
}
exports.postParseUnicode = function(content) {
  let reg = /\\u/g;
  return unescape(content.replace(reg, '%u'));
}
exports.postParseOriginTag = function(source) {
  let callbacks = ['preDisappearAnnotation', 'preParseGtLt', 'preParseBindAttr', 'preParseMustache', 'postParseLtGt'];
  source = exports.postParseUnicode(source);
  source = exports.preParseTemplateToSatisfactoryJSX(source, callbacks);
  const ast = babylon.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isJSXElement(node) && (node.openingElement.name && typeof node.openingElement.name.name === 'string')) {
        if (node.openingElement.name.name.indexOf('origin-') === 0) {
          let currentTag = node.openingElement.name.name;
          let targetTag = currentTag.replace('origin-', '')
          node.openingElement.name.name = targetTag;
          node.closingElement && (node.closingElement.name.name = targetTag);
        }
      }
    }
  });
  // 这里注意，每次经过babel之后，中文都需要转义过来；
  return exports.postParseUnicode(generate(ast).code);
}
// cli仓库使用
exports.analyzeTemplate = function(source, options) {
  let callbacks = ['preDisappearAnnotation', 'preParseGtLt', 'preParseBindAttr', 'preParseVueEvent', 'preParseMustache', 'postParseLtGt']
  if (!source) {
    return options;
  }
  source = exports.preParseTemplateToSatisfactoryJSX(source, callbacks);
  const ast = babylon.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      let node = path.node;
      let buildInTagMap = options && options.buildInComponents;// {button:"cml-buildin-button"}
      if (t.isJSXElement(node) && buildInTagMap) {
        let currentTag = node.openingElement.name.name;
        let targetTag = buildInTagMap[currentTag];
        // 收集用了哪些内置组件 usedBuildInTagMap:{button:'cml-buildin-button',radio:'cml-buildin-radio'}
        if (targetTag) {
          (!options.usedBuildInTagMap) && (options.usedBuildInTagMap = {});
          options.usedBuildInTagMap[currentTag] = targetTag;
        }
      }
    }
  });
  return options;
}
// 模块内置方法
exports._operationMustache = function (content) {
  let mustacheReg = /{{([\s\S]*?)}}/g
  return content.replace(mustacheReg, function (match, key) {
    key = exports._deOperationGtLt(key);
    return `_cml{${key}}lmc_`
  })
}
exports._deOperationMustache = function (content) {
  let deMustacheReg = /_cml{([\s\S]*?)}lmc_/g;
  return content.replace(deMustacheReg, function (match, key) {
    return `{{${key}}}`
  })
}
exports._operationGtLt = function(content) {
  let gtltReg = />|</g;
  return content.replace(gtltReg, function(match) {
    if (match === '>') {
      return `_cml_gt_lmc_`
    }
    if (match === '<') {
      return `_cml_lt_lmc_`
    }
    return match;
  })
}
exports._deOperationGtLt = function(content) {
  let deGtLtReg = /_cml_gt_lmc_|_cml_lt_lmc_/g;
  return content.replace(deGtLtReg, function(match) {
    if (match === '_cml_gt_lmc_') {
      return '>';
    }
    if (match === '_cml_lt_lmc_') {
      return '<';
    }
    return match;
  })
}
