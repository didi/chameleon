# cml文件
chameleon中的页面和组件是以.cml为后缀的单文件形式，其中包括四部分，分别为模板、逻辑、样式与配置信息。例如：
```html
<template>
  <view>
    <text>Hello Chameleon!</text>
  </view>
</template>
<script>
class Index {

}
export default new Index();
</script>
<style scoped>
</style>
<script cml-type="json">
{
  "base":{
    "usingComponents": {
    }
  },
  "wx": {
    "navigationBarTitleText": "index",
     "backgroundTextStyle": "dark",
     "backgroundColor": "#E2E2E2",
     "component": true
  }
  "web": {
  },
  "weex": {
  }
}
```
### 1 template
`<template></<template>`标签中书写组件的视图层结构，chameleon自定义了一套[标签语言](/view/cml.html)，结合基础组件、事件系统，可以构建出页面的结构。<b>注意最外层需要是单组件，而不能是多个组件。</b>

- 模板语法选择
chameleon支持两套模板语法，分别为[cml](../view/cml.html)和[vue](../view/vue.html)，可以通过在template上设置lang属性进行选择使用某一个语法，一个模板中不可同时使用两种语法。默认的lang为`cml`。

使用类vue语法

```html
<template lang="vue">
</template>
```
使用cml语法
```html
<template lang="cml">
</template>
```
或者不需要设置lang
```html
<template >
</template>
```

### 2 script
`<script></script>`编写组件逻辑层响应页面操作的代码，导出ViewModel对象，简称VM对象。例如：
```
<script>
class Index {
  data = {
    message: 'my first chameleon！'
  }
  computed = {
    message2: function() {
      return '计算属性：' + this.message
    }
  }
  methods = {
    changeMessage() {
      this.message = Date.now();
    }
  }
  created() {

  }
}
export default new Index();
</script>
```
- 采用javascript语法，模块语法采用es6的`import与export`，组件的逻辑层代码必须采用`export default`的形式导出。
- 以class的形式而不是单例对象的模式写VM，是更有利于扩展，在组件多态时可以继承接口。
- 默认class的名称为是文件名的驼峰形式。
- VM中的生命周期，计算属性等使用方式参见[逻辑层](../logic/logic.html).

cml文件中不允许使用某个端[特定的方法或接口](/framework/global_check.html)，若有使用，构建时会检查报错。现有支持大量基础API，提供业务调用，`chameleon-api`, 以模块的方式引入。
如果需要使用某个端特定的接口，请从业务出发使用[接口多态](/framework/polymorphism/api.html)差异化实现接口。

### 3 style
`<style></style>`标签中书写组件的样式，即为chameleon中的[CMSS](/view/cmss.html)。
支持less、stylus 两种css的预处理语言，通过lang指定，默认为less语法。例如：
```
<style lang="stylus" scoped>
</style>
```
<b>style标签必须有scoped属性，否则在web端样式会有问题。</b>

### 4 json
`<script cml-type="json"></script>`标签中书写组件的配置信息，具体含义参见[组件配置](/framework/json.html)


#### 组件的引用
在[组件配置](/framework/json.html)一节介绍了组件引用相关字段的使用。
<b>注意: 不能在.cml文件中通过import或者require的方式引入.cml文件。</b>

