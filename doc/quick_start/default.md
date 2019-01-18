# 简易教程

## [安装启动](./setup.html)
使用chameleon进行开发的第一步，你只需要在全局安装命令行工具`chameleon-tool`，按照[安装启动](./setup.html)一节指导的操作，相信你已经启动了你的第一个chameleon项目。更多命令的使用参见[命令行](../quick_start/cml_cmd.html)。

## [目录结构](../framework/structure.html)
项目的目录结构根据功能划分的非常清晰，充分考虑扩展性、可伸缩性。

```bash
├── chameleon.config.js                 // 项目的配置文件
├── dist                                // 打包产出目录
├── mock                                // 模拟数据目录
├── node_modules                        // npm包依赖，基于多态协议直接使用各端原生组件
├── package.json
└── src                                 // 项目源代码 
    ├── app                             // app入口
    ├── components                      // 组件文件夹
    ├── pages                           // 页面文件夹
    ├── router.config.json              // 路由配置文件
    └── store                           // 全局状态管理
```

## [单文件结构](../framework/cml_file.html)
我们定义了扩展名为`.cml`的文件将一个组件需要的所有部分组合（js、css、html模板、可选json配置）在一起，更方便开发。简单举例：
```html
<template>
</template>
<script>
</script>
<style>
</style>
```

## 开发语言

从事过网页编程的人知道，网页编程采用的是HTML + CSS + JS这样的组合，同样道理，chameleon中采用的是 CML + CMSS + JS。

[JS](../logic/lifecycle.html)语法用于处理页面的逻辑部分，与普通网页编程相比，其内置了类vue的MVVM框架，拥有完整的生命周期，watch，computed，数据双向绑定等优秀的特性，能够快速提高开发速度、降低维护成本。 简单举例：
```javascript
<script>
class Index {
  // data
  data =  {
    message: 'Hello',
  }
  // 计算属性
  computed = {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
  // 观察数据变化
  watch: {
    message: function (newV, oldV) {
    }
  }
  // 各种生命周期
  mounted: function(res) {
    // 模板或者html编译完成,且渲染到dom中完成,在整个vue的生命周期中只执行一次
  }
}
export default new Index();
</script>
```

[CML](../view/cml.html)（Chameleon Markup Language）用于描述页面的结构，我们知道HTML是有一套标准的语义化标签，例如文本是`<span>` 按钮是`<button>`。CML同样具有一套标准的标签，我们将标签定义为`组件`，CML为用户提供了一系列[组件](../component/base/base.html)。同时CML中还支持<b>模板语法</b>，例如条件渲染、列表渲染，数据绑定等等。简单举例：

```html
<template>
  <view> 
     <!--数据绑定 message变量 -->
      <text>
        {{ message }}
      </text> 
  </view>
</template>

```
同时，CML支持使用[类VUE语法](../view/vue.html)，让你更快入手。


[CMSS](../view/cmss.html)(Chameleon Style Sheets)用于描述CML页面结构的样式语言，其具有大部分CSS的特性，并且还可以支持各种css的预处语言`less stylus`。 默认支持less处理，简单举例：

```html
<style>
@import './global.css';
@size: 10px;

.header {
  width: @size;
  height: @size;
}
</style>
```

通过以上对于开发语言的介绍，相信你只要是有过网页编程知识的人都可以快速的上手chameleon的开发。



## [丰富的组件](../component/component.html)
在用CML写页面时，chameleon提供了丰富的组件供开发者使用，内置的有`button switch radio checkbox`等组件，扩展的有`c-picker`、`c-dialog`、`c-loading`等等,覆盖了开发工作中常用的组件。具体参见[组件](../component/component.html')。
组件也提供了可定制化属性，与事件，让组件展示不同的状态，或响应不同的事件，简单举例：

```html
<button
  color="blue"
  text="确定"
  disabled="{{true}}"
  c-bind:onclick="testclick" >
</button>
```

`color`属性控制按钮的颜色，`text`属性控制按钮的文本，`disabled`属性按钮是否禁用，` c-bind:onclick` 绑定点击的事件的处理方法。

用户也可以封装业务组件进行复用。

## [丰富的API](../api/api.html)

为了方便开发者的高效开发，chameleon提供了丰富的API库,发布为npm包`chameleon-api`，里面包括了网络请求、数据存储、地理位置、系统信息、动画等方法。使用方式如下：

```javascript
import cml from 'chameleon-api';

cml.showToast({
  message: JSON.stringify(res),
  duration: 2000
})
```
## [自由定制API和组件](../framework/polymorphism/intro.html)

基于强大的多态组件协议，可自由扩展任意API和组件，不强依赖框架的更新。

代码扩展`setStorage`方法，各端各自实现充分隔离：

```html
<script cml-type="interface">
  // 定义模块的interface
  interface UtilsInterface {
    // 定义setStorage方法 参数个数及返回值类型
    setStorage(key: string, value: string): undefined;
  }
</script>
<script cml-type="web">
// web端接口实现
class Method implements UtilsInterface {
  setStorage(key, value, cb) {
    localStorage.setItem(key, value);
  }
}
export default new Method();
</script>
<script cml-type="weex">
// weex端接口实现
class Method implements UtilsInterface {
  setStorage(key, value) {
    storage.setItem(key, value);
  }
}
export default new Method();
</script>
<script cml-type="wx">
// wx端接口实现
class Method implements UtilsInterface {
  setStorage(key, value) {
      wx.setStorageSync(key, value);
  }
}
export default new Method();
</script>
```
那么各端原始项目中已积累大量组件，也能直接引入到跨端项目里面使用。

## [智能规范校验](../framework/polymorphism/check.html)

代码规范校验，当出现不符合规范要求的代码时，编辑器会展示智能提示，不用挨个调试各端代码，同时命令行启动窗口也会提示代码的错误位置。

## [渐进式跨端](../framework/progressive.html)

既想一套代码运行多端，又不用大刀阔斧的重构项目，可以将多端重用组件用Chameleon开发，直接在原有项目里面调用。

## [先进前端开发体验](../framework/mock.html)

Chameleon 不仅仅是跨端解决方案。基于优秀的前端打包工具Webpack，吸收了业内多年来积累的最有用的工程化设计，提供了前端基础开发脚手架命令工具，帮助端开发者从开发、联调、测试、上线等全流程高效的完成业务开发。


