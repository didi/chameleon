# <img src="https://cml.js.org/doc/assets/100*100.png"/> Chameleon [![Build Status](https://www.travis-ci.org/didi/chameleon.svg?branch=master)](https://www.travis-ci.org/didi/chameleon) [![license](https://img.shields.io/npm/l/chameleon-tool.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com&style=popout-square)](https://www.npmjs.com/package/chameleon-tool) [![version](https://img.shields.io/npm/v/chameleon-tool.svg?style=flat)](https://www.npmjs.com/package/chameleon-tool)

**Chameleon**/kəˈmiːlɪən/，简写`CML`，中文名`卡梅龙`；中文意思`变色龙`，意味着就像变色龙一样能适应不同环境的跨端整体解决方案。

[English Introduction](https://github.com/didi/chameleon/blob/gh-pages/doc/quick_start/readme-en.md) | 中文介绍

## 文档

主站: [CML.JS.org](https://cml.js.org)

- [安装](https://CML.JS.org/doc/quick_start/quick_start.html)
- [快速上手](https://CML.JS.org/doc/quick_start/quick_start.html)
- [API 文档](https://CML.JS.org/doc/api/api.html)
- [组件文档](https://CML.JS.org/doc/component/component.html)
- [资源汇总 💰awesome-cml](https://github.com/chameleon-team/awesome-cml)：依赖库、demo、完整应用示例、学习资源
- [后续规划](https://github.com/didi/chameleon/wiki/%E5%90%8E%E6%9C%9F%E8%A7%84%E5%88%92)
- [五分钟上手视频教程](https://mp.weixin.qq.com/s/3NY_pbqDVnbQSYQG_D2qiA)
- [青桔单车 chameleon 跨平台实践分享](https://mp.weixin.qq.com/s/N8PpxRHHtlIHVlemQ1Gepg)
- [谁在使用？](https://github.com/didi/chameleon/issues/131)

## 仓库更新说明

本仓库仅包含编译时代码，全部开源代码参见：https://github.com/chameleon-team

master为稳定版本，除了紧急 bug 修复，每份代码提交都有很严格的发布流程规范，会先在分支经历一段时间灰度期，确认稳定可用后才会合并到 master，
[进行中的项目分支介绍](https://github.com/didi/chameleon/wiki/%E8%BF%9B%E8%A1%8C%E4%B8%AD%E7%9A%84%E9%A1%B9%E7%9B%AE)

## CML 即 多端
支持平台：**web、微信小程序、支付宝小程序、百度小程序、[android(weex)](https://github.com/chameleon-team/chameleon-sdk-android)、[ios(weex)](https://github.com/chameleon-team/chameleon-sdk-ios)、[qq 小程序](https://cml.js.org/doc/example/tt_miniapp.html)、[头条小程序（alpha版本）](https://github.com/didi/chameleon/issues/157)、[快应用(进行中)](https://github.com/didi/chameleon/issues/185)、持续更新中**

**一端所见即多端所见**——多端高度一致，无需关注各端文档。

> 基于多态协议不影响各端差异化灵活性

![效果展示](https://cml.js.org/doc/assets/efficient.gif)

|                                                                 web                                                                  |                                                             微信小程序                                                             |                                                              native-weex                                                              |                                                               百度小程序                                                               |                                                              支付宝小程序                                                              |
| :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/web-1.jpg" width="200px"/> </a> | <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/wx-1.jpg" width="200px"/></a> | <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/weex-1.jpg" width="200px"/> </a> | <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/baidu-1.png" width="200px"/> </a> | <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/alipay-1.png" width="200px"/></a> |

## 背景

研发同学在端内既追求 h5 的灵活性，也要追求性能趋近于原生。
面对入口扩张，App 客户端、微信小程序、支付宝小程序、百度小程序、Android 厂商联盟快应用、其他类小程序，单一功能在各平台都要重复实现，开发和维护成本成倍增加。迫切需要维护一套代码可以构建多入口的解决方案，滴滴跨端解决方案 Chameleon 终于发布。真正专注于让一套代码运行多端。

## 设计理念

软件架构设计里面最基础的概念“拆分”和“合并”，拆分的意义是“分而治之”，将复杂问题拆分成单一问题解决，比如后端业务系统的”微服务化“设计；“合并”的意义是将同样的业务需求抽象收敛到一块，达成高效率高质量的目的，例如后端业务系统中的“中台服务”设计。

而 Chameleon 属于后者，通过定义统一的语言框架+<a href="https://CML.JS.org/doc/framework/polymorphism/intro.html">统一多态协议</a>，从多端（对应多个独立服务）业务中抽离出自成体系、连续性强、可维护强的“前端中台服务”。

![设计理念](https://cml.js.org/doc/assets/chameleon-idea.png)

### 跨端目标

虽然不同各端环境千变万化，但万变不离其宗的是 MVVM 架构思想，**Chameleon 目标是让 MVVM 跨端环境大统一**。

![Alt text](https://CML.JS.org/doc/assets/mvvm4.png)

## 开发语言

从事过网页编程的人知道，网页编程采用的是 HTML + CSS + JS 这样的组合，同样道理，chameleon 中采用的是 CML + CMSS + JS。

[JS](https://CML.JS.org/doc/logic/logic.html)语法用于处理页面的逻辑层，与普通网页编程相比，本项目目标定义标准 MVVM 框架，拥有完整的生命周期，watch，computed，数据双向绑定等优秀的特性，能够快速提高开发速度、降低维护成本。

[CML](https://CML.JS.org/doc/view/cml.html)（Chameleon Markup Language）用于描述页面的结构，我们知道 HTML 是有一套标准的语义化标签，例如文本是`<span>` 按钮是`<button>`。CML 同样具有一套标准的标签，我们将标签定义为`组件`，CML 为用户提供了一系列[组件](https://CML.JS.org/doc/component/base/base.html)。同时 CML 中还支持<b>模板语法</b>，例如条件渲染、列表渲染，数据绑定等等。同时，CML 支持使用[类 VUE 语法](https://CML.JS.org/doc/view/vue.html)，让你更快入手。

[CMSS](https://CML.JS.org/doc/view/cmss.html)(Chameleon Style Sheets)用于描述 CML 页面结构的样式语言，其具有大部分 CSS 的特性，并且还可以支持各种 css 的预处语言`less stylus`。

<b>通过以上对于开发语言的介绍，相信你看到只要是有过网页编程知识的人都可以快速的上手 chameleon 的开发</b>。

## 多端高度一致

深入到编程语言维度保障一致性，包括框架、生命周期、内置组件、事件通信、路由、界面布局、界面单位、组件作用域、组件通信等高度统一

## 丰富的组件

在用 CML 写页面时，chameleon 提供了[丰富的组件](https://CML.JS.org/doc/component/component.html)供开发者使用，内置的有`button switch radio checkbox`等组件，扩展的有`c-picker c-dialog c-loading`等等,覆盖了开发工作中常用的组件。

## 丰富的 API

为了方便开发者的高效开发，chameleon 提供了[丰富的 API 库](https://CML.JS.org/doc/api/api.html),发布为 npm 包`chameleon-api`，里面包括了网络请求、数据存储、地理位置、系统信息、动画等方法。

## 自由定制 API 和组件

基于强大的[多态协议](https://CML.JS.org/doc/framework/polymorphism/intro.html)，可自由扩展任意 API 和组件，不强依赖框架的更新。各端原始项目中已积累大量组件，也能直接引入到跨端项目中使用。

基于强大的[多态协议](https://CML.JS.org/doc/framework/polymorphism/intro.html)，充分隔离各端差异化实现，轻松维护一套代码实现跨多端

## <a href="https://CML.JS.org/doc/framework/polymorphism/check.html">智能规范校验</a>

代码规范校验，当出现不符合规范要求的代码时，编辑器会展示智能提示，不用挨个调试各端代码，同时命令行启动窗口也会提示代码的错误位置。

## <a href="https://CML.JS.org/doc/framework/progressive.html">渐进式跨端</a>

既想一套代码运行多端，又不用大刀阔斧的重构项目？不仅可以用 cml 开发页面，也可以将多端重用组件用 cml 开发，直接在原有项目里面调用。

## <a href="https://cml.js.org/doc/framework/engineering.html">先进前端开发体验</a>

Chameleon 不仅仅是跨端解决方案。基于优秀的前端打包工具 Webpack，吸收了业内多年来积累的最有用的工程化设计，提供了前端基础开发脚手架命令工具，帮助端开发者从开发、联调、测试、上线等全流程高效的完成业务开发。

## 联系我们

[ChameleonCore@didiglobal.com](mailto:ChameleonCore@didiglobal.com)

## [Beatles Chameleon 团队](https://github.com/chameleon-team)

负责人：Conan

内部成员：透心凉、Sgoddon、动机不纯、Jalon、Jack、卡尺哈哈、change、Observer、Kevin、guoqingSmile、Mr.MY、JiM、lzc、名字待定、朱智恒、亭、龚磊、w55、小龙、不懂小彬、荣景超

贡献参与者：
快应用官方研发团队、broven（阿里）、Jeany（芒果 TV）、luyixin、z-mirror、夏夜焰火（百度）

## 微信 & QQ 交流群

**微信**<br />
<img width="150px" src="https://CML.JS.org/doc/assets/wx-qr-code.png" />

<br />

**QQ**<br />
<img width="150px" src="https://CML.JS.org/doc/assets/qr-qq.jpeg" />

## 协议

Apache-2.0 license

Chameleon 基于 Apache-2.0 协议进行分发和使用，更多信息参见[协议文件](./LICENSE)。
