# 简易教程
经过了快速上手的学习，你已经体验chameleon使用，下面跟随这个教程，开启你的chameleon跨端开发。

## 端渲染能力接入
如果你需要跨native端渲染，则需要接入<a href="../chameleon_client/introduction.html">chameleon SDK</a>，目前支持的渲染引擎是 weex，即将支持 react native，使用时二者选其一作为项目的 native 渲染引擎。chameleon SDK包括对原生组件和本地api能力的扩展，对性能和稳定性的优化。使用方式可以参见<a href="../example/android_example.html">Android Chameleon SDK</a> 与<a href="../example/ios_example.html">IOS Chameleon SDK</a>。


## 基本命令
熟悉脚手架基本的命令，可以加快开发效率。
`cml init`快速初始化项目、页面、组件,
`cml dev|build`  启动开发和生产模式的构建，
`cml web|wx|weex dev|build`单独启动某一端的构建。
详细参见<a href="./cml_cmd.html">脚手架工具</a>。

## 目录与文件结构
使用`cml init`命令 生成的目录结构如下：
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
chameleon的目录结构将组件、页面、路由、全局状态管理、静态资源、模拟数据等按照功能进行划分。详细参见<a href="../framework/structure.html">目录结构</a>。


## 开发语言

从事过网页编程的人知道，网页编程采用的是HTML + CSS + JS这样的组合，同样道理，chameleon中采用的是 CML + CMSS + JS。

我们定义了扩展名为`.cml`的文件将一个组件需要的所有部分组合（CML、CMSS、JS模板、JSON）在一起，更方便开发。

[JS](../logic/lifecycle.html)语法用于处理页面的逻辑部分，cml文件`<script></script>`标签中的`export default`导出的VM对象即采用JS语法。它负责业务逻辑、交互逻辑的处理与驱动视图更新，拥有完整的生命周期，watch，computed，数据双向绑定等优秀的特性，能够快速提高开发速度、降低维护成本。
- data为数据。
- props为属性，父组件进行传递。
- computed为计算属性，是动态的数据，可以对数据进行逻辑处理后返回结果。
- watch为侦听属性，监听数据的变化，触发相应操作。
- methods为方法，处理业务逻辑与交互逻辑。
- beforeCreate、created等生命周期，掌握生命周期的触发时机，做相应操作。
 简单举例：
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
    <!-- 数据绑定与计算属性 -->
    <text>{{ message }}</text>
    <text class="class1">{{ message2 }}</text>

    <!-- 条件与循环渲染 -->
    <view c-if="{{showlist}}">
      <view c-for="{{array}}" c-for-index="idx" c-for-item="itemName" c-key="city" >
        <text> {{idx}}: {{itemName.city}}</text>
      </view>
    </view>

    <!-- 事件绑定 -->
    <view c-bind:click="changeShow"><text>切换展示</text></view>
  </view>
</template>

```
同时，CML支持使用[类VUE语法](../view/vue.html)，让你更快入手。


[CMSS](../view/cmss.html)(Chameleon Style Sheets)用于描述CML页面结构的样式语言，其具有大部分CSS的特性，也做了一些扩充和修改。
- 1 支持css的预处语言`less `与`stylus`。
- 2 新增了<a href="../view/cmss/unit.html">尺寸单位cpx</a>。在写 CSS 样式时，开发者需要考虑到手机设备的屏幕会有不同的宽度和设备像素比，采用一些技巧来换算一些像素单位。CMSS 在底层支持新的尺寸单位 cpx ，开发者可以免去换算的烦恼，只要交给chameleon底层来换算即可，由于换算采用的浮点数运算，所以运算结果会和预期结果有一点点偏差。
- 3 为了各端样式一致性，内置了一些<a href="../view/cmss/base_style.html">一致性基础样式</a>。
- 4 chameleon <a href="../view/cmss/layout.html">布局模型</a>基于 CSS Flexbox，以便所有页面元素的排版能够一致可预测，同时页面布局能适应各种设备或者屏幕尺寸。
- 5 cml文件中支持<a href="../view/cmss/css_diff.html">样式多态</a>，即可以针对不同的平台写不同的样式。
- 6 如果<a href="../example/web_wx.html">只跨web和小程序端</a>CMSS将会更加灵活。
简单举例：

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

JSON部分用于描述应用、页面或组件的<a href="framework/json.html">配置信息</a>，对应于小程序的json配置文件。其中各端通用的配置字段为`usingComponents`声明组件引用。



## 丰富的组件
在用CML写页面时，chameleon提供了丰富的<a href="../component/component.html">组件</a>供开发者使用，内置的有`button switch radio checkbox`等组件，扩展的有`c-picker`、`c-dialog`、`c-loading`等等,覆盖了开发工作中常用的组件。。
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

我们也提供了<a href="../example/components-link.html">组件实例</a>，方便开发者快速体验。
## 丰富的API

为了方便开发者的高效开发，chameleon提供了丰富的<a href="../api/api.html">API库</a>,发布为npm包`chameleon-api`，里面包括了网络请求、数据存储、地理位置、系统信息、动画等方法。使用方式如下：

```javascript
import cml from 'chameleon-api';

cml.showToast({
  message: JSON.stringify(res),
  duration: 2000
})
```
## 自由定制API和组件

基于强大的多态协议，可自由扩展任意API和组件，不强依赖框架的更新。
<a href="../framework/polymorphism/intro.html">多态协议</a>是是Chameleon业务层代码和各端底层组件和接口的分界点，是跨端底层差异化的解决方案，普通用户开发基本上使用不到多态协议，因为chameleon已经使用多态协议封装了丰富的组件和接口。有几种情况下可能会用到，第一 业务需求导致的各端差异化实现，比如web端和小程序要有不用的逻辑处理。第二 定制化的组件，比如要使用echarts组件，这时就需要使用多态组件实现，例如<a href="../example/poly.html">手把手教你系列- 实现多态 echart</a>。第三 定制化的底层接口，可以参考<a href="../example/chameleon-api.html">手把手教你系列- 实现多态API</a>。

## 工程化
Chameleon 不仅仅是跨端解决方案。基于优秀的前端打包工具Webpack，吸收了业内多年来积累的最有用的工程化设计，提供了前端基础开发脚手架命令工具，帮助端开发者从开发、联调、测试、上线等全流程高效的完成业务开发。

mock数据是本地开发必不可少的工作，chameleon项目中在`mock`文件夹的文件中写express中间件的形式<a href="../framework/mock.html">mock数据</a>, 例如：

```javascript

module.exports = [
  {
    method: ['get', 'post'],
    path: '/api/getMessage',
    controller: function (req, res, next) {
      res.json({
        total: 0,
        message: [{
          name: 'Hello chameleon!'
        }]
      });
    }
  }
]

```
chameleon的其他工程化配置统一收敛在项目根目录下的`chameleon.config.js`文件，在该文件中可以使用全局对象cml的api去操作配置对象。例如：

配置当前项目支持的端
```javascript
cml.config.merge({
  platforms: ['web','wx'],
});

```
配置是否进行文件压缩
```javascript
cml.config.merge({
  web: {
    dev: {
      minimize: true
    }
  }
});
```
配置资源发布路径
```javascript
cml.config.merge({
  web: {
    build: {
      publicPath: "http://www.chameleon.com/static"
    }
  }
});
```
更多配置参见<a href="../framework/config.html">工程配置</a>


## 渐进式跨端

既想一套代码运行多端，又不用大刀阔斧的重构项目，可以将多端重用组件用Chameleon开发，直接在原有项目里面调用。参见<a href="../terminal/io.html">导入与导出</a>。也有如下手把手实例进行参考
- <a href="../example/webpack_output.html">手把手教你系列 - 普通项目使用chameleon跨端dialog组件</a>
- <a href="../example/webpack_plugin.html">手把手教你系列 - webpack集成chameleon</a>


## 智能规范校验
chameleon提供了多种规范校验，可以帮助开发者提高开发效率，保证代码质量。

<a href="../framework/polymorphism/check.html">接口校验语法</a> 是使用多态协议扩展多态组件和多态接口时使用。可以通过<a href="../framework/config.html#多态校验控制">配置</a>进行开启或者关闭。

<a href="../framework/polymorphism/check.html">全局变量校验</a> 是保证跨端代码全局变量正确性的检查方法，可以通过<a href="../framework/config.html#全局变量校验">配置</a>进行开启或者关闭。

<a href="../framework/polymorphism/check.html">代码规范校验</a> 是对项目结构,文件规范，样式规范等进行校验，可以通过<a href="../framework/config.html#语法检查">配置</a>进行开启或者关闭。


