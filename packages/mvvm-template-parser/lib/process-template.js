const parser = require('mvvm-babel-parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse')["default"];
const generate = require('mvvm-babel-generator/lib')["default"];
const _ = module.exports = {};

/* 将vue语法的模板转化为cml语法
主要是将
1 :id="value"  => v-bind:id="value"
2 @click="handleClick" => c-bind:click="handleClick" 或者c-catch
*/
_.vueToCml = function(source, options = {}) {
  // 去掉模板中的注释
  source = _.preDisappearAnnotation(source);
  source = _.preParseTemplate(source);
  source = _.compileTemplate(source, options);
  // 后置处理：用于处理 \u ，便于解析unicode 中文
  source = _.postParseUnicode(source);

  if (/;$/.test(source)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    source = source.slice(0, -1);
  }

  return {
    source,
    usedBuildInTagMap: options.usedBuildInTagMap || {}
  }

}
// 去掉html模板中的注释
_.preDisappearAnnotation = function (content) {
  let annotionReg = /<!--[\s\S]*?-->/g;
  return content.replace(annotionReg, function (match) {
    return '';
  })
}
// 解析属性上的  :  以及 @  v-on这样的语法；
_.preParseTemplate = function(source) {
  let callbacks = {startCallback: _.startCallback};
  let htmlArr = _.preParseHTMLtoArray(source, callbacks);
  let newHtmlArr = [];
  htmlArr.forEach((item) => {
    if (item.type === 'tagContent') { // 标签内置直接push内容
      newHtmlArr.push(item.content);
    }
    if (item.type === 'tagEnd') {
      newHtmlArr.push(item.content);
    }
    if (item.type === 'tagStart') {
      newHtmlArr.push(item.content)
    }
  });
  return newHtmlArr.join('')
}
_.preParseHTMLtoArray = function(html, callbacks) {
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
    // 开始标签也可能是一元标签 通过 isunary 字段进行区分
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
        matchStart.isunary = !!_.trim(end[1] || '');// 标记是否是一元标签
        advance(end[0].length)
        let attrString = startCallback(matchStart) || '';
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
_.startCallback = function(matchStart) {
  let leftAttrsOnComponent = matchStart.attrs;// 遗留在组件上的属性,默认值是所有属性，
  let attrString = (leftAttrsOnComponent || []).reduce((result, item) => {
    if (item[1].indexOf(':') === 0) {
      item[0] = _.preParseBindAttr(item[0]);// :id="value" ==> v-bind:id="value"
    }
    if (item[1].indexOf('@') === 0 || item[1].indexOf('v-on') === 0) {
      item[0] = _.preParseVueEvent(item[0]);// @click="handleClick"  v-on:click="handleClick" ==> c-bind:click="handleClick"
    }
    result = result + (item[0] || '');
    return result;
  }, '')
  return attrString;
}
// 模板前置处理器
// 预处理:属性  :name="sth" ==> v-bind:name="sth",因为jsx识别不了 :name="sth"
_.preParseBindAttr = function (content) {
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
_.preParseVueEvent = function (content) {
  //         v-on | @--> <--  属性名  --><--=-->
  let reg = /(?:v\-on:|@)([^\s"'<>\/=]+?)\s*=\s*/g
  content = content.replace(reg, (m, $1) => {
    if (typeof $1 === "string" && $1.endsWith('.stop')) {
      $1 = $1.replace('.stop', '');
      $1 = $1 === 'click' ? 'tap' : $1;
      return `c-catch:${$1}=`;
    } else {
      $1 = $1 === 'click' ? 'tap' : $1;
      return `c-bind:${$1}=`
    }
  });
  return content;
}
_.compileTemplate = function(source, options) {
  const ast = parser.parse(source, {
    plugins: ['jsx']
  });
  traverse(ast, {
    enter(path) {
      // 所有的入口都以JSXElement为入口解析；
      _.parseAllAttributes(path, options);
      _.parseBuildTag(path, options);
    }
  });
  return generate(ast).code;

}
_.isOriginTagOrNativeComp = function(tagName, options) {
  let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === tagName)
  let isNative = usedComponentInfo && usedComponentInfo.isNative;
  let isOrigin = (tagName && typeof tagName === 'string' && tagName.indexOf('origin-') === 0);
  if (isOrigin || isNative) {
    return true
  }
  return false;
}

/*
以标签为基础，解析attruibutes即可
   1 v-bind:id="value" ==> id="{{value}}"
   2 v-model="value" v-if="value"  ==> c-if="{{value}}"
   3 v-for需要特殊处理
   4 :class  class 需要特殊处理

*/

_.parseAllAttributes = function(path, options) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    let tagName = node.openingElement.name.name
    if (_.isOriginTagOrNativeComp(tagName, options)) {
      return // 原生标签和原生组件直接不解析
    }
    let attributes = node.openingElement.attributes;
    let directives = ['v-if', 'v-else-if', 'v-else', 'v-model', 'v-show', 'v-text', 'v-for'];
    let specialJSXNameSapce = ['c-bind', 'c-catch'];
    let specialJSXName = ['class', 'key']
    let newAttributes = [];
    let bindKeyAttr = attributes.find((attr) => (t.isJSXNamespacedName(attr.name) && attr.name.name.name === 'key'));
    let staticClassAttr = attributes.find((attr) => (t.isJSXIdentifier(attr.name) && attr.name.name === 'class'))
    let dynamicClassAttr = attributes.find((attr) => (t.isJSXNamespacedName(attr.name) && attr.name.name.name === 'class'));
    // 将class  :class节点进行融合
    if (staticClassAttr || dynamicClassAttr) {
      let classNodeValue = '';
      if (staticClassAttr) {
        classNodeValue = `${classNodeValue} ${staticClassAttr.value.value}`
      }
      if (dynamicClassAttr) {
        classNodeValue = `${classNodeValue} {{${dynamicClassAttr.value.value}}}`
      }
      if (classNodeValue) {
        let classAttr = t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(classNodeValue));
        newAttributes.push(classAttr);
      }
    }
    attributes.forEach((attr) => {
      // 处理简单的属性  id="value" ==> id="value" 不要处理class,因为cml语法仅支持单class需要特殊处理
      if (t.isJSXIdentifier(attr.name) && attr.name.name !== 'class') {
        if (!directives.includes(attr.name.name)) {
          newAttributes.push(attr)
        } else if (directives.includes(attr.name.name) && attr.name.name !== 'v-for') {
          attr.value && (attr.value.value = `{{${attr.value.value}}}`);
          attr.name.name = attr.name.name.replace('v-', 'c-')
          newAttributes.push(attr);
        } else if (attr.name.name === 'v-for') {
          let value = attr.value && attr.value.value;
          let {item, list, index} = _.analysisFor(value);
          let cForAttr = t.jsxAttribute(t.jsxIdentifier('c-for'), t.stringLiteral(`{{${list}}}`));
          newAttributes.push(cForAttr);
          let cForItem = t.jsxAttribute(t.jsxIdentifier('c-for-item'), t.stringLiteral(`${item}`));
          newAttributes.push(cForItem);
          let cForIndex = t.jsxAttribute(t.jsxIdentifier('c-for-index'), t.stringLiteral(`${index}`));
          newAttributes.push(cForIndex);
          let bindKeyValue = bindKeyAttr && bindKeyAttr.value && bindKeyAttr.value.value;
          if (bindKeyValue && typeof bindKeyValue === 'string') {
            if (bindKeyValue === item) {
              bindKeyValue = "*this";
            } else {
              let reg = new RegExp(`${item}\\.`, 'g');
              bindKeyValue = bindKeyValue.replace(reg, '');
            }
            let keyAttr = t.jsxAttribute(t.jsxIdentifier('c-key'), t.stringLiteral(`${bindKeyValue}`));
            newAttributes.push(keyAttr);
          }
        }
      }
      // 处理vue语法中的 v-bind:id="value" ==> id="{{value}}"  不包括 :class :key
      if (t.isJSXNamespacedName(attr.name) && (attr.name.namespace.name === 'v-bind') && !specialJSXName.includes(attr.name.name.name)) {
        let name = attr.name.name.name;
        let value = attr.value.value;
        let newAttr = t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(`{{${value}}}`));
        newAttributes.push(newAttr)
      }
      // 将c-bind  c-catch加入
      if (t.isJSXNamespacedName(attr.name) && specialJSXNameSapce.includes(attr.name.namespace.name)) {
        newAttributes.push(attr);
      }
    });
    node.openingElement.attributes = newAttributes;
  }
}
_.analysisFor = function (nodeValue) {
  // v-for="item in items"
  let reg1 = /\s*(.+?)\s+(?:in|of)\s+(.+)\s*/;

  // v-for="(item, index) in items"
  let reg2 = /\s*\(([^\,\s]+?)\s*\,\s*([^\,\s]+?)\s*\)\s*(?:in|of)\s+(.+)\s*/
  let item, index, list;
  let matches1 = nodeValue.match(reg1);
  let matches2 = nodeValue.match(reg2);
  if (matches2) {
    item = matches2[1];
    index = matches2[2];
    list = matches2[3];

  } else if (matches1) {
    item = matches1[1];
    index = 'index';
    list = matches1[2];
  }
  return {
    item,
    index,
    list
  }
}
_.parseBuildTag = function (path, options) {
  let node = path.node;
  let buildInTagMap = options && options.buildInComponents;// {button:"cml-buildin-button"}
  if (t.isJSXElement(node) && buildInTagMap) {
    let currentTag = node.openingElement.name.name;
    let targetTag = buildInTagMap[currentTag];
    // 收集用了哪些内置组件 usedBuildInTagMap:{button:'cml-buildin-button',radio:'cml-buildin-radio'}
    let usingComponents = (options.usingComponents || []).map(item => item.tagName)
    // 兼容用户自己写了组件和内置组件重名
    let isUserComponent = usingComponents.includes(currentTag);
    if (isUserComponent) { // 如果是用户的内置组件，这里不做任何处理，直接返回
      return;
    } else {
      if (targetTag && currentTag !== targetTag) {
        node.openingElement.name.name = targetTag;
        node.closingElement && (node.closingElement.name.name = targetTag);
        (!options.usedBuildInTagMap) && (options.usedBuildInTagMap = {});
        options.usedBuildInTagMap[currentTag] = targetTag;
      }
    }
  }
}

// 后置处理：用于处理 \u ，便于解析unicode 中文
_.postParseUnicode = function(content) {
  let reg = /\\u/g;
  return unescape(content.replace(reg, '%u'));
}
