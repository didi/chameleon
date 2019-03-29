const parser = require('mvvm-babel-parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse')["default"];
const generate = require('mvvm-babel-generator')["default"];
const _ = module.exports = {};

/* 将vue语法的模板转化为cml语法
主要是将
1 :id="value"  => v-bind:id="value"
2 @click="handleClick" => c-bind:click="handleClick" 或者c-catch
*/
_.vueToCml = function(source) {
  // 去掉模板中的注释
  source = _.preDisappearAnnotation(source);
  // 模板中所有的  :id="value" ==>  v-bind:id="value"
  source = _.preParseBindAttr(source);
  // 模板中所有的 @click="handleClick"  => c-bind:click="handleClick"
  source = _.preParseVueEvent(source);
  // 模板通过 @babel/parser进行解析
  source = _.compileTemplate(source);
  return source;

}
// 去掉html模板中的注释
_.preDisappearAnnotation = function (content) {
  let annotionReg = /<!--[\s\S]*?-->/g;
  return content.replace(annotionReg, function (match) {
    return '';
  })
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
_.compileTemplate = function(source) {
  const ast = parser.parse(source, {
    plugins: ['jsx']
  });
  traverse(ast, {
    enter(path) {
      _.parseAllAttributes(path)
    }
  });
  debugger;
  return generate(ast).code;

}

/*
以标签为基础，解析attruibutes即可
   1 v-bind:id="value" ==> id="{{value}}"
   2 v-model="value" v-if="value"  ==> c-if="{{value}}"
   3 v-for需要特殊处理
   4 :class  class 需要特殊处理

*/

_.parseAllAttributes = function(path) {
  let node = path.node;
  if (t.isJSXElement(node)) {
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
      debugger;
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
