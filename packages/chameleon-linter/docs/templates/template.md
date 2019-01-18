### 模板书写规范
chameleon 模板书写规范尊从 HTML5 基本规范。

## 模板规范
chameleon 支持三端(三种 native 环境)，每个组件在每个环境对应有一个模板。模板命名格式  `组件名称+端名称.cml` 比如：c-title 组件
```
├── components
│   ├── c-title                              
│   │   ├── c-title.web.cml                          
│   │   ├── c-title.weex.cml                        
│   │   └── c-title.wx.cml 
```

其中： c-title.web.cml 为 web 端模板，c-title.weex.cml 为 iOS、Android 端，c-title.wx.cml 为微信小程序端。

本节模板规范就是指对这三个模板文件的编写规范。

### 模板语言指定
每个端的模板都可以并且必须选择两种语法规范中的一个，cml 语法规范 或者 类 vue 语法规范。指定语法规范的方式为在根节点 template 标签上给属性 lang 指定 "cml" 或者 "vue"。

列如指定模板为 cml 语法规范

```
<template lang="cml"></template>
```

> 注意：每个模板只能够有一个根节点并且必须为 template 标签，template 便签每个模板只能有一个。

### 模板标签使用规范
每个模板可以使用的标签，由模板语言、模板所属的 native 环境以及自定义组件三部分共同组成。 
若模板语言为 cml 的模板，除自定义组件的标签还可以使用 chamelon 支持的便签以及对应 native 环境的原始组件标签。
若模板语言为类 vue 的模板，截止目前[2018-11-05] chamelon 在类 vue 模板语言下能够使用的标签和模板语言为 cml 的模板一致。

> chamelon 支持的标签有: template、view、text、block、scroller、list、cell、image、switch、video、input、button、radio、checkbox

#### 举例
仍以 c-title 组件为例，假设各个模板都有自定义组件配置
```
<script cml-type="json">
{
  "base": {
    "usingComponents": {
      "tickets": "/components/ticket/index"
    }
  }
}
</script>
```
+ c-title.web.cml
    - 可以使用 chameleon 支持的 view、text、block 等基本标签，web 原生标签 div、p、span 等,以及自定义组件 tickets。
+ c-title.weex.cml
    - 可以使用 chameleon 支持的 view、text、block 等基本标签，weex 支持的标签，以及自定义组件 tickets。如果以 vue 作为 weex 使用的前端框架，那么 weex 支持的标签基本和 vue 框架支持的标签基本一致，其中有部分不支持的标签比如：transition 标签，具体请参见 weex 文档。
+ c-title.wx.cml
    - 可以使用 chameleon 支持的 view、text、block 等基本标签，wx 原生标签比如 swiper、movable-area、cover-view、web-view  等,以及自定义组件 tickets。

### 模板指令使用规范

每个模板可使用的指令由模板语言支持的指令和 native 环境支持的指令两部分构成。不同模板语言的模板之间不能相互使用彼此的指令。lang = "cml" 时不能使用 类 vue 语法的指令，lang = "vue" 时不能使用 chameleon 的指令。

+ 模板语言为 cml 时支持的指令有：c-if、c-else、c-else-if、c-for、c-for-index、c-for-item、c-model、c-text、c-show、c-bind、c-catch
+ 模板语言为类 vue 时支持的指令有：v-if、v-else、v-else-if、v-for、v-on、v-bind、v-html、v-show、v-model、v-pre、v-once、slot-scope、is、@、:

> 类 vue 语法支持上述列表中的指令，其他 vue.js 的指令如 v-cloak 是不支持的。

#### 举例
若模板语言为 "cml" 即 template 标签 lang 属性为 "cml"，native 环境为微信小程序。还是以 c-title 组件为例，那么此时对应的是 c-title.wx.cml 模板。
```
c-title.wx.cml:

<template lang="cml">
    <view c-if="{{showMessage}}">{{messageText}}</view>
    <picker-view></picker-view>
</template>
```
那么模板里可以使用 chameleon 支持的指令: c-if、c-else、c-else-if、c-for、c-for-index、c-for-item、c-model、c-text、c-show、c-bind、c-catch, 以及微信小程序原生支持的指令 wx:if、wx:elif、wx:else、wx:for、wx:for-item、wx:for-index、wx:key、bindtap、catchtap。