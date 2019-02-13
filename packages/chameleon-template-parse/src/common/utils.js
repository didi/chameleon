// --inspect-brk
const t = require('@babel/types');
const _ = module.exports = {};
const utils = _;
const babylon = require('babylon');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const weexMixins = require('chameleon-mixins/weex-mixins.js');
_.trimCurly = (str) => str.replace(/(?:{{)|(?:}})/ig, '');

_.getModelKey = function(modelKey) {
  modelKey = _.trimCurly(modelKey);
  modelKey = modelKey.trim();
  return modelKey;
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
_.titleLize = function (word) {
  return word.replace(/^\w/, function (match) {
    return match.toUpperCase();
  })
}
// ast遍历相关
_.getSiblingPaths = function (path) {
  let container = path.container;
  let siblingPaths = [];
  for (let i = 0; i < container.length; i++) {
    siblingPaths.push(path.getSibling(i));
  }
  return siblingPaths;
}

/* 获取某个jsxElement 上的某个具体属性的值*
@params:
path:代表JSXElement的path值
return
该JSXElement上所有的属性集合
*/
_.getJSXElementAttrKeyValue = function (path) {
  let attributes = path.node.openingElement.attributes || [];
  return attributes.reduce((attrMap, attr) => {
    let key = attr.name.name;
    let value = attr.value.value;
    if (typeof key === 'string') {
      attrMap[key] = value
    }
    return attrMap;
  }, {});
}
_.trim = function (value) {
  return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
_.isInlineStatementFn = function (statament) {
  let reg = /\(([\s\S]*?)\)/;
  return statament.match(reg);
}
// 判断函数参数值在微信中是否是响应式的属性，'index' 代表字符串 'index'+1 代表表达式；
_.isReactive = function (value) {
  let reg = /(?:^'([^']*?)'$)/;
  return _.trim(value).match(reg);
}
_.doublequot2singlequot = function (value) {
  return value.replace(/["]/g, "'");
}
_.isMustacheReactive = function (value) {
  let reg = /(?=.*[{]{2})(?=.*[}]{2})/;
  return reg.test(value);
}
_.isOnlySpaceContent = function(value) {
  let reg = /[^\s]+/;
  return !reg.test(value);
}
_.getReactiveValue = function(nodeValue) {
  let vLength = nodeValue && nodeValue.length;
  const newValue = [];
  if (nodeValue && _.isMustacheReactive(nodeValue)) {
    for (let idx = 0; idx < vLength; idx++) {
      if (nodeValue[idx] === '{' && idx < vLength - 1 && nodeValue[idx + 1] === '{') {
        newValue.push("'+(");
        idx++;
      } else if (nodeValue[idx] === '}' && idx < vLength - 1 && nodeValue[idx + 1] === '}') {
        newValue.push(")+'");
        idx++;
      } else {
        newValue.push(nodeValue[idx]);
      }
    }

    if (newValue.length != 0) {
      newValue.push("'");
      newValue.unshift("'");
      const nl = newValue.length;
      if (nl > 2 && newValue[nl - 1] === "'" && newValue[nl - 2] === ")+'") {
        newValue.splice(-2, 2);
        newValue.push(')');
      }
      if (newValue.length > 2 && newValue[0] === "'" && newValue[1] === "'+(") {
        newValue.splice(0, 2);
        newValue.unshift('(');
      }
      nodeValue = newValue.join('');
    }
  }
  return nodeValue;
};
// 从 let value = `a b {{true ? 'cls1':'cls2'}} c d {{true ? 'cls1':'cls2'}} `;获取 `a b  c d`
_.getStaticValueFromMixinValue = function(value) {
  let reg = /[{]{2}[^{}]*?[}]{2}/g;
  return value.replace(reg, ' ');
}
// 注意如果匹配不到则会返回null;
_.getDynamicValuefromMixinValue = function(value) {
  let reg = /[{]{2}[^{}]*?[}]{2}/g;
  let matches = value.match(reg);
  if (matches) {
    return matches.join('');
  } else {
    return value;
  }
}

/**
 * @params:
 * <view><text style="width:{{cpx}}cpx;background-color:red;">{{'width{'}}</text></view>
    <view><text style="{{'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red'}}">{{'width+++'}}</text></view>
    cpx：300
    cpx:'300cpx'
  @returnvalue: 将非变量cpx单位转化为rpx;
  转化策略：
  1 首先将非 {{}} 内的cpx全部转化为rpx,因为非{{}}内的肯定都是cpx这个单位；
  2 转化 {{}} 内的cpx 单位，而不能转化变量cpx,

*/
_.transformWxDynamicStyleCpxToRpx = function(value) {
  let reg = /[{]{2}([^{}]*?)[}]{2}/g;
  value = _.transformNotInMustacheCpxToRpx(value);
  value = value.replace(reg, (match, statement) => `{{${_.transformMustacheCpxToRpx(statement)}}}`);
  value = _.doublequot2singlequot(value)
  return value;
}
_.transformNotInMustacheCpxToRpx = function(value) {
  // 第一步
  let isNotMustacheCpxToRpxReg = /}}[^{}]*?(cpx)/g;
  return value.replace(isNotMustacheCpxToRpxReg, (match, key) => {
    if (key === 'cpx') {
      return match.replace(/cpx/, 'rpx')
    }
    return match;
  });

}
_.transformMustacheCpxToRpx = function(source) {
  const ast = babylon.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isStringLiteral(node)) {
        if (node.value.includes('cpx')) {
          node.value = node.value.replace(/cpx/g, `rpx`);
        }
      }
    }
  })
  let result = generate(ast).code;
  if (/;$/.test(result)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    result = result.slice(0, -1);
  }
  return result
}
_.handleCMLClassNodes = function (options) {
  let { type } = options;
  _[`${type}CMLClassNodes`](options);
}
_.webCMLClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      if (utils.isMustacheReactive(itemNode.value.value)) { // 动态的
        attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(`${extraClass}`)))
        itemNode.name.name = `:${itemNode.name.name}`
        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${newClassNodeValue}`;
      } else {// 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  } else if (classNodes.length === 2) {
    classNodes.forEach((itemNode) => {
      if (utils.isMustacheReactive(itemNode.value.value)) { // 动态的
        itemNode.name.name = `:${itemNode.name.name}`
        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${newClassNodeValue}`;
      } else { // 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  }
}
_.weexCMLClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      if (utils.isMustacheReactive(itemNode.value.value)) { // 动态的
        attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(`${extraClass}`)));
        itemNode.name.name = `:${itemNode.name.name}`
        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${weexMixins.weexClassProxy}((${newClassNodeValue}))`
      } else {// 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  } else if (classNodes.length === 2) {
    classNodes.forEach((itemNode) => {
      if (utils.isMustacheReactive(itemNode.value.value)) { // 动态的
        itemNode.name.name = `:${itemNode.name.name}`
        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${weexMixins.weexClassProxy}((${newClassNodeValue}))`
      } else { // 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  }
}
_.miniappCMLClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      itemNode.value.value = `${itemNode.value.value} ${extraClass}`
    })
  } else if (classNodes.length === 2) {
    let reactiveClassNode = classNodes.find((itemNode) => utils.isMustacheReactive(itemNode.value.value));
    let staticClassNode = classNodes.find((itemNode) => !utils.isMustacheReactive(itemNode.value.value));
    let reactiveClassNodeValue = reactiveClassNode && reactiveClassNode.value.value;
    let staticClassNodeValue = staticClassNode && staticClassNode.value.value;

    let newValue = `${reactiveClassNodeValue} ${staticClassNodeValue} ${extraClass}`

    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(newValue)))
    // 将原来的class节点全部删除；
    classNodes.forEach((classNode) => {
      let classNodeIndex = attributes.indexOf(classNode);
      if (classNodeIndex !== -1) {
        attributes.splice(classNodeIndex, 1)
      }
    })
  }
}
_.handleVUEClassNodes = function (options) {
  let { type } = options;
  _[`${type}VUEClassNodes`](options);
}
_.webVUEClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      if (t.isJSXNamespacedName(itemNode.name)) { // 动态的
        attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
        // itemNode.name.name = `:${itemNode.name.name}`
        // let newClassNodeValue = utils.getReactiveValue(itemNode.value.value);
        // itemNode.value.value = `${newClassNodeValue}`;
      } else {// 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  } else if (classNodes.length === 2) {
    classNodes.forEach((itemNode) => {
      if (t.isJSXNamespacedName(itemNode.name)) { // 动态的
        // itemNode.name.name = `:${itemNode.name.name}`
        // let newClassNodeValue = utils.getReactiveValue(itemNode.value.value);
        // itemNode.value.value = `${newClassNodeValue}`;
      } else { // 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  }
}
_.weexVUEClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      if (t.isJSXNamespacedName(itemNode.name)) { // 动态的
        attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))

        // itemNode.value.value = `[${newClassNodeValue}]`;
        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${weexMixins.weexClassProxy}((${newClassNodeValue}))`
      } else {// 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  } else if (classNodes.length === 2) {
    classNodes.forEach((itemNode) => {
      if (t.isJSXNamespacedName(itemNode.name)) { // 动态的
        // itemNode.value.value = `[(${itemNode.value.value})]`;

        let newClassNodeValue = utils.trimCurly(itemNode.value.value);
        itemNode.value.value = `${weexMixins.weexClassProxy}((${newClassNodeValue}))`
      } else { // 静态的
        itemNode.value.value = `${itemNode.value.value}  ${extraClass}`
      }
    })
  }
}
_.miniappVUEClassNodes = function (options) {
  let { classNodes, attributes, extraClass } = options;
  if (classNodes.length === 0) {
    // t.jsxAttribute(t.jsxIdentifier('data-cmlref'),t.stringLiteral(value))
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
  } else if (classNodes.length === 1) { // 可能是动态class或者静态class
    classNodes.forEach((itemNode) => {
      // itemNode.value.value = `${itemNode.value.value} ${extraClass}`
      if (t.isJSXNamespacedName(itemNode.name)) {
        let newValue = `{{${itemNode.value.value}}} ${extraClass}`;
        let classNodeIndex = attributes.indexOf(itemNode)
        if (classNodeIndex !== -1) {
          attributes.splice(classNodeIndex, 1)
        }
        attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(newValue)));
      } else {
        itemNode.value.value = `${itemNode.value.value} ${extraClass}`
      }
    })
  } else if (classNodes.length === 2) {
    let reactiveClassNode = classNodes.find((item) => t.isJSXNamespacedName(item.name));
    let staticClassNode = classNodes.find((item) => t.isJSXIdentifier(item.name));
    let reactiveClassNodeValue = reactiveClassNode && reactiveClassNode.value.value;
    let staticClassNodeValue = staticClassNode && staticClassNode.value.value;

    let newValue = `{{${reactiveClassNodeValue}}} ${staticClassNodeValue} ${extraClass}`

    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(newValue)))
    classNodes.forEach((classNode) => {
      let classNodeIndex = attributes.indexOf(classNode);
      if (classNodeIndex !== -1) {
        attributes.splice(classNodeIndex, 1)
      }
    })

  }
}
