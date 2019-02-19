
const babylon = require('babylon');
const t = require('@babel/types');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const {
  tagMap
} = require('../common/cml-map.js')
const utils = require('./utils');

exports.startCallback = function(matchStart, type, options) {
  let lang = options.lang;
  let usingComponents = options.usingComponents || [];
  let buildInComponents = options.buildInComponents || {};
  if (type === 'alipay') {
    let isComponent = usingComponents.find((comp) => comp.tagName === matchStart.tagName) || Object.keys(buildInComponents).includes(matchStart.tagName);
    let leftAttrsOnComponent = matchStart.attrs;// 遗留在组件上的属性,默认值是所有属性，如果是组件，那么还需要过滤
    if (isComponent) { // 如果是组件，那么需要将组件的c-if c-else去掉
      let filtersAttrs = ['c-if', 'c-else', 'c-else-if', 'v-if', 'v-else', 'v-else-if']
      leftAttrsOnComponent = matchStart.attrs.filter((attr) => !filtersAttrs.includes(attr[1]))
    }

    let attrString = (leftAttrsOnComponent || []).reduce((result, item) => result = result + (item[0] || ''), '')
    return attrString;
  }
}

/*
@description:因为阿里的组件上的样式会被直接忽略掉，所以编译层要做一层标签的包裹处理；
注意只处理alipay端的组件，其他的不作处理
*/
exports.preParseAliComponent = function(source, type, options) {
  if (type === 'alipay') {
    let lang = options.lang;
    let usingComponents = options.usingComponents || [];
    let buildInComponents = options.buildInComponents || {};
    let exceptTags = ['carousel-item'];// 用于包括哪些组件标签不用被view标签包裹
    let callbacks = {startCallback: exports.startCallback};
    let htmlArr = exports.preParseHTMLtoArray(source, type, options, callbacks);
    let newHtmlArr = [];
    htmlArr.forEach((item) => {
      let isExpectTags = exceptTags.includes(item.tagName)
      if (item.type === 'tagContent') { // 标签内置直接push内容
        newHtmlArr.push(item.content);
      }
      if (item.type === 'tagEnd') { // 结束标签的话，先将该标签的内容push,然后判断是否是组件
        newHtmlArr.push(item.content);
        let isComponent = usingComponents.find((comp) => comp.tagName === item.tagName) || Object.keys(buildInComponents).includes(item.tagName);
        if (isComponent && !isExpectTags) {
          newHtmlArr.push('</view>');
        }
      }
      if (item.type === 'tagStart') {
        // 先 push view标签，然后再push组件标签
        let isComponent = usingComponents.find((comp) => comp.tagName === item.tagName) || Object.keys(buildInComponents).includes(item.tagName);
        let inheritNodes = (item.attrs || []).filter((attr) => {
          let inheritAttrsFromComp = ['c-if', 'c-else', 'c-else-if', 'v-if', 'v-else', 'v-else-if', 'class', 'style', 'v-bind:style', 'v-bind:class', ':style', ":class"]
          return inheritAttrsFromComp.includes(attr[1]);
        });
        let inheritString = inheritNodes.reduce((result, styleClassNode) => result = result + (styleClassNode[0] || ''), '');
        if (isComponent && !isExpectTags) { // 如果是组件需要从组件继承一些属性过来
          if (!item.isunary) { // 如果不是一元标签，那么只在该标签前面push一个view
            newHtmlArr.push(`<view ${inheritString} >`);
            newHtmlArr.push(item.content);
          }
          if (item.isunary) { // 如果是一元标签，那么在该标签前后都要push view
            newHtmlArr.push(`<view ${inheritString} >`);
            newHtmlArr.push(item.content);
            newHtmlArr.push(`</view>`)
          }
        } else { // 不是内置组件直接push
          newHtmlArr.push(item.content)
        }
      }
    });
    return newHtmlArr.join('')

  }
  return source;
}

/* @description:提供一个将模板转化为数组的方法，以后各个端如果对模板的处理在jsx中做不了的话，可以通过处理这个数组进行解决
 解析的数组元素分为三种类型 tagStart  tagEnd  和 tagContent,其中tagStart有可能是自闭标签
 @params:html模板
 @return:html模板对应的字符串
 */
exports.preParseHTMLtoArray = function(html, type, options, callbacks) {
  let {startCallback} = callbacks;
  // 需要考虑问题 单标签和双标签
  let stack = [];
  // id="value" id='value'  class=red    disabled
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  const ncname = '[a-zA-Z_][\\w\\-\\.]*'
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  // 标签的匹配，这些正则都不是g这种全局匹配，所以仅仅会匹配第一个遇到的标签；
  // const startTag = new RegExp(`^<${qnameCapture}([\\s\\S])*(\\/?)>`);
  // const startTag = /^<([a-zA-Z-:.]*)[^>]*?>/;
  const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始open
  const startTagClose = /^\s*(\/?)>/ // 匹配开始关闭；单标签的关闭有两种情况，第一就是 > 第二个就是 />,可以通过捕获分组 / 来判断是单闭合标签还是双开标签的开始标签的闭合
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
  let index = 0;
  while (html) {
    last = html;
    let textEnd = html.indexOf('<')
    // 解析标签内容，包括开始标签以及结束标签
    if (textEnd === 0) { // 以 < 开头的html
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        stack.push(startTagMatch);
        continue;
      }
      const endTagMatch = parseEndTag();
      if (endTagMatch) {
        stack.push(endTagMatch);
        continue;
      }
    }
    // 解析标签中间的内容
    let text, rest, next
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
      while (
        !endTag.test(rest) &&
          !startTagOpen.test(rest)
      ) {
        // < in plain text, be forgiving and treat it as text
        next = rest.indexOf('<', 1)
        if (next < 0) {break}
        textEnd += next
        rest = html.slice(textEnd)
      }
      let matchText = {
        type: "tagContent"
      };
      text = html.substring(0, textEnd)
      matchText.content = text;
      matchText.isText = true;
      stack.push(matchText);
      advance(textEnd);
      continue;
    }
    if (textEnd < 0) {
      text = html;
      html = '';
      const matchText2 = {
        type: 'tagContent',
        content: text
      }
      stack.push(matchText2)
      continue;

    }
  }
  return stack;
  function advance (n) {
    index += n
    html = html.substring(n)
  }
  function parseStartTag () {
    // 开始标签也可能是一元标签 通过isunary字段进行区分
    const start = html.match(startTagOpen)
    if (start) {
      const matchStart = {
        type: 'tagStart',
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length);

      let end, attr
      // 这里处理标签的属性值；
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        matchStart.attrs.push(attr)
      }
      if (end) {
        matchStart.isunary = !!utils.trim(end[1] || '');// 标记是否是一元标签
        advance(end[0].length)
        let attrString = startCallback(matchStart, type, options) || '';
        let content ;
        if (matchStart.isunary) {
          content = `<${matchStart.tagName} ${attrString} />`
        } else {
          content = `<${matchStart.tagName} ${attrString} >`
        }
        matchStart.content = content;// 每个数组中这个值用于拼接；
        return matchStart
      }
    }
  }
  function parseEndTag() {
    const end = html.match(endTag);
    if (end) {
      const matchEnd = {
        type: 'tagEnd',
        tagName: end[1],
        content: end[0]
      }
      advance(end[0].length)
      return matchEnd;
    }
  }

}
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
exports.wrapAliComponents = function(source, usingComponentsMap, options) {
  let usingComponentsKeys = Object.keys(usingComponentsMap) || [];
  let lang = options.lang;
  for (let i = 0 ; i < usingComponentsKeys.length; i++) {
    let tag = usingComponentsKeys[i];
    let {styleNode, classNode, dynamicStyleNode, dynamicClassNode} = usingComponentsMap[tag] || {};
    let contentReg = new RegExp(`<\\s*${tag}[\\s\\S]*?>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, 'ig');
    let styleAttr = '';
    let classAttr = '';
    let dynamicStyle = '';
    let dynamicClsss = '';
    if (styleNode && styleNode.name) {
      styleAttr = `style="${styleNode.value.value}"`
    }
    if (classNode && classNode.name) {
      classAttr = `class="${classNode.value.value}"`;
    }
    if (lang === 'vue') {
      if (dynamicStyleNode && t.isJSXNamespacedName(dynamicStyleNode.name)) {
        dynamicStyle = `v-bind:style="${dynamicStyleNode.value.value}"`
      }
      if (dynamicClassNode && t.isJSXNamespacedName(dynamicClassNode.name)) {
        dynamicClsss = `v-bind:class="${dynamicClassNode.value.value}"`
      }
    }
    source = source.replace(contentReg, function(match) {
      // 对应没有样式节点的
      if ((lang === 'cml') && !styleNode && !classNode) {
        return match;
      } else if ((lang === 'vue') && !styleNode && !classNode && !dynamicStyleNode && !dynamicClassNode) {
        return match
      }
      return `<view ${styleAttr} ${dynamicStyle} ${classAttr}  ${dynamicClsss}>${match}</view>`
    })
  }
  return source;
}

// 处理支付宝小程序组件添加标签包裹
exports.alipayComponentsWraped = function(source, type, options) {
  if (type === 'alipay') {
    let usingComponents = options.usingComponents || [];
    let buildInComponents = options.buildInComponents || {};
    let usingComponentsMap = {};
    const ast = babylon.parse(source, {
      plugins: ['jsx']
    })
    traverse(ast, {
      enter(path) {
        debugger
        let node = path.node;
        if (t.isJSXElement(node) && (node.openingElement.name && typeof node.openingElement.name.name === 'string')) {
          let isComponent = usingComponents.find((item) => item.tagName === node.openingElement.name.name) || Object.keys(buildInComponents).includes(node.openingElement.name.name);
          if (isComponent) {
            let attributes = node.openingElement.attributes || [];
            let styleNode = attributes.find((attr) => attr.name.name === 'style') ;
            let classNode = attributes.find((attr) => attr.name.name === 'class') ;
            // web端动态的class  style
            let dynamicStyleNode = attributes.find((attr) => {
              if (t.isJSXNamespacedName(attr.name)) {
                return attr.name.name.name === 'style';
              }
              return false;
            });
            let dynamicClassNode = attributes.find((attr) => {
              if (t.isJSXNamespacedName(attr.name)) {
                return attr.name.name.name === 'class';
              }
              return false;
            })
            usingComponentsMap[node.openingElement.name.name] = {
              styleNode, classNode, dynamicStyleNode, dynamicClassNode
            }
          }
        }
      }
    });
    return exports.wrapAliComponents(source, usingComponentsMap, options);
  }
  return source;

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
// 将 {{}} ==> _cml{}lmc_ ,因为jsx无法识别 {{}}
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
  // 这个只在微信端增加callback;
  if (type === 'wx' || type === 'alipay' || type === 'baidu') {
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
  return source;

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
// 这里主要处理1  >{{}}< 双花括号之间的 ==> _cml{}lmc_ ,因为jsx无法识别 {{}}
// 2 同时将 {{}}内的 _cml_gt_lmc_  _cml_lt_lmc_ 复原  < >
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
