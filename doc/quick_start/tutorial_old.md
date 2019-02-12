

#  学习指南

## 1 基本命令
先熟悉基本的命令，可以加快开发效率。
`cml init`快速初始化项目、页面、组件,
`cml dev|build`  启动开发和生产模式的构建，
`cml web|wx|weex dev|build`单独启动某一端的构建。
详细参见<a href="./cml_cmd.html">脚手架工具</a>。

## 2 目录与文件结构
掌握目录与文件结构，文件、组件、图片资源、mock数据的放置位置等等, 掌握cml文件的结构，组件的配置项。
详细参见<a href="../framework/structure.html">目录结构</a>与<a href="../framework/json.html">组件配置</a>。

## 3 CML语法
CML标准语法的学习，包括数据绑定、条件渲染、列表渲染、事件的学习，过程中会提前涉及逻辑层VM对象中的data属性为模板提供绑定数据。
为了降低学习成本，我们也提供了类vue语法可以使用。
详情参见<a href="../view/cml.html">CML-标准语法</a>与<a href="../view/cml.html">CML-类vue语法</a>。

## 4 CMSS
统一的尺寸单位`cpx`，Flexbox的布局、盒模型、文本样式，静态动态style和class的设置等。
具体参见<a href="../view/cmss.html">CMSS</a>。

## 5 组件
组件分为内置组件和扩展组件，内置组件为最基本的布局、表单相关，扩展组件则提供了更丰富的功能。
具体参见<a href="../component/component.html">组件</a>。


## 6 VM对象
cml文件`<script></script>`标签中的`export default`导出的对象即为VM对象。它负责业务逻辑、交互逻辑的处理与驱动视图更新。
- data为数据。
- props为属性，父组件进行传递。
- computed为计算属性，是动态的数据，可以对数据进行逻辑处理后返回结果。
- watch为侦听属性，监听数据的变化，触发相应操作。
- methods为方法，处理业务逻辑与交互逻辑。
- beforeCreate、created等生命周期，掌握生命周期的触发时机，做相应操作。

具体参见<a href="../logic/logic.html">逻辑层</a>。

## 7 API

学习包括网络请求、数据存储、系统信息、地理位置等API的使用。
具体参见<a href="../api/api.html">API</a>。

## 8 数据mock
如果本地开发时需要模拟数据请参见<a href="../framework/mock.html">数据mock</a>。


## 9 路由配置
chameleon中页面的路由管理统一收敛在router.config.json中，提供应用内跳转和应用外跳转的api。
参见<a href="../framework/router.html">路由管理</a>。

## 10 多态协议
多态协议是是Chameleon业务层代码和各端底层组件和接口的分界点，是跨端底层差异化的解决方案，普通用户开发基本上使用不到多态协议，因为chameleon已经使用多态协议封装了丰富的组件和接口。有两种情况下可能会用到，第一 业务需求导致的各端差异化实现，比如web端和小程序要有不用的逻辑处理。第二 定制化的需求，比如要使用echarts组件，这时就需要使用多态组件实现，例如<a href="../example/poly.html">手把手教你系列- 实现多态 echart</a>。
参见 <a href="../framework/polymorphism/intro.html">多态协议</a>。

## 11 项目配置
chameleon.config.js

线上资源的publicPath  线上api地址的配置


学习chameleon源码  贡献代码

