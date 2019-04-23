# mvvm-template-parser
mvvm-template-parser是标准模板编译的库。

#### standardParser(Object object)
##### 用途：将CML模板编译成AST。

#####参数对象
<table>
<tr>
<th>属性</th><th>类型</th><th>默认值</th><th>必填</th><th>说明</th>
</tr>
<tr>
<td>source</td><td>string</td><td></td><td>是</td><td>需要编译的模板字符串</td>
</tr>
<tr>
<td>lang</td><td>string</td><td>cml</td><td>否</td><td>模板的语法，可选值 cml|vue</td>
</tr>
</table>

#####返回值 (Object object)
#####返回值对象
<table>
<tr>
<th>属性</th><th>类型</th><th>默认值</th><th>必填</th><th>说明</th>
</tr>
<tr>
<td>ast</td><td>Object</td><td></td><td>是</td><td>编译之后的标准AST</td>
</tr>
</table>

注： MVVM的CML模板语法支持两种语法，一种是CML语法，一种是类VUE语法，但是经过standardParser方法，如果lang为vue，会先将类VUE语法转为CML语法，在转为AST，这样保证开发者只需要对CML语法的AST进行编译转换，而不需要支持两种语法的转换。


##### 使用示例
```
const {standardParser} = require('mvvm-template-parser');

const template = `
<view c-bind:tap="click1">
  <text>{{'名称'+name}}</text>
</view>
`

const {ast} = standardParser({
  source: template,
  lang: 'cml'
})

console.log(ast)
```

生成的AST结构可以参考采用babel/parser 的jsx插件对jsx语法的解析。

#### traverse(ast, options)
##### 用途：遍历standardParser方法返回的模板AST
#####参数说明
<table>
<tr>
<th>属性</th><th>类型</th><th>默认值</th><th>必填</th><th>说明</th>
</tr>
<tr>
<td>ast</td><td>Object</td><td></td><td>是</td><td>需要遍历的模板AST</td>
</tr>
<tr>
<td>options</td><td>Object</td><td></td><td>是</td><td>options.enter 属性为遍历AST每一个Path的处理函数</td>
</tr>
</table>
注：AST遍历相关操作<a href="https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md">参考手册</a> 该方法内部调用<a href="https://babeljs.io/docs/en/next/babel-traverse">babel-traverse</a>。



#### generator(ast)
##### 用途：根据ast生成代码。
#####参数说明
<table>
<tr>
<th>属性</th><th>类型</th><th>默认值</th><th>必填</th><th>说明</th>
</tr>
<tr>
<td>ast</td><td>Object</td><td></td><td>是</td><td>生成代码的ast</td>
</tr>

</table>
注：该方法内部调用<a href="https://babeljs.io/docs/en/next/babel-generator">babel-generator</a>

#### types
##### 识别AST节点。

注：该方法内部调用<a href="https://babeljs.io/docs/en/next/babel-types">babel-types</a>

##### 使用示例
```
const {standardParser, generator, types, traverse} = require('mvvm-template-parser');

const template = `
<view c-bind:tap="click1">
  <text>{{'名称'+name}}</text>
</view>
`

const {ast} = standardParser({
  source: template,
  lang: 'cml'
})
debugger
traverse(ast, {
  enter: (path)=>{
    let node = path.node;
    if(types.isJSXOpeningElement(node)) {
      if(types.isJSXIdentifier(node.name) && node.name.name === 'view') {
        node.name.name = 'div';
      }
    }
    if(types.isJSXClosingElement(node)) {
      if(types.isJSXIdentifier(node.name) && node.name.name === 'view') {
        node.name.name = 'div';
      }
    }
  }
})

const output = generator(ast);

console.log(output)
// 打印结果如下：

{ code: '<div c-bind:tap="click1">\n  <text>{\'名称\' + name}</text>\n</div>;',
  map: null,
  rawMappings: null }

```