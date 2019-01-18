# 模板校验说明

### 模板语法校验
模板校验通过自定义修改 npm module [htmllint](https://github.com/htmllint/htmllint) 实现。

#### 校验规则
##### 标签校验
标签校验采用白名单机制，即只有在给定的标签列表里的标签才能使用。校验代码入口 [linters/template/index.js](../linters/template/index.js)

校验白名单由三部分组成：
- cml 或者 vue 模板支持的标签: [cml 模板支持的标签](../linters/template/config/cml-white-list.js) | [vue 模板支持的标签](../linters/template/config/vue-white-list.js)
- 三端平台对应的 native 标签: [wx 小程序原生支持标签](../linters/template/config/wx-white-list.js) | [weex 原生支持的标签](../linters/template/config/weex-white-list.js) | [web 原生支持标签](../linters/template/config/web-white-list.js)
- 模板中通过 usingComponents 配置引入的自定义标签

白名单获取规则：

假设当前组件名为 index 那么对应三端的模板文件分别为 index.web.cml | index.weex.cml | index.wx.cml 对应三端百名单组成
- index.web.cml
    + template 的 lang 为 cml: cml 支持的标签 + 模板中自定义的标签 + web 原生支持的标签
    + template 的 lang 为 vue: vue 支持的标签 + 模板中自定义的标签 + web 原生支持的标签
- index.weex.cml
    + template 的 lang 为 cml: cml 支持的标签 + 模板中自定义的标签 + weex 原生支持的标签
    + template 的 lang 为 vue: vue 支持的标签 + 模板中自定义的标签 + weex 原生支持的标签
- index.wx.cml
    + template 的 lang 为 cml: cml 支持的标签 + 模板中自定义的标签 + wx 原生支持的标签
    + template 的 lang 为 vue: vue 支持的标签 + 模板中自定义的标签 + wx 原生支持的标签

使用方法：

给 htmllint 新加 ruler: tag-white-list.js 并且增加配置项 tag-only-allowed-names 用于接收标签白名单。
使用时只需要传入配置项 options['tag-only-allowed-names] = ['view','template', ...] 即可。

##### 属性校验
属性校验通过黑名单机制实现，同样是基于 npm module [htmllint](https://github.com/htmllint/htmllint) 实现。

属性校验的两种方式：
- 通过设置 htmllint 的 attr-bans 直接添加禁止的属性列表，比如: cml 模板禁止 v-if | v-show | v-for 等。
- 通过给 htmllint 新加的 ruler:  attr-name-forbidden.js，给定一个正则表达式来匹配禁止的事件绑定以及自定属性绑定指令，比如: cml 模板禁止 v-bind:src | :src | v-on:click | @click 等。

两种方式可以通过把 attr-bans 的列表和 attr-name-fordden ruler 的正则表达式合并为一个表达式来统一，为了语义清晰目前使用的是两种方式并存互补的形式。

黑名单获取规则：
目前需要校验的只有两类指令 cml 与 类vue 指令。现阶段校验 lang 为 cml 的模板时，要求模板里不能出现 vue 的指令，lang 为 vue 时不能出现 cml 的指令。

使用方法：
在使用时给 attr-bans 配置指令黑名单，给 attr-name-forbidden-regex 传入匹配非法指令的正则表达式。 具体代参见 [cml-htmllinter 配置项](../linters/template/index.js)


### 模板事件与模板变量校验

#### 校验规则
校验规则要求，模板里使用的事件方法和变量名要在 script 的 class 有相应的定义。

##### script class 定义方法名和变量名获取
具体提取方法参见源码：[js-ast-parser.js](../checkers/template/lib/js-ast-parser.js) | [template-ast-parser.js](../checkers/template/lib/template-ast-parser.js)
- 方法名: 方法名从 class 定义中 methods 属性提取
- 变量名: 从 class 定义中 props、data、computed 属性中提取

##### template 模板中方法名和变量名获取
- 方法名
    + template lang 为 cml: 从 c-bind 、 c-catch 指令对应的属性值获取
    + template lang 为 vue: 从 v-on、 v-once 、 @ 指令对应的属性值获取
- 变量名
    + template lang 为 cml: 从 属性值由 {{}} 给出的表达式中获取
    + template lang 为 vue: 从 v-if、v-show、v-else-if、v-model、: 等直接绑定数据值得指令获取，具提参见 [template-ast-parser.js](../checkers/template/lib/template-ast-parser.js)

### 资料
[htmllint](https://github.com/htmllint/htmllint)
[htmlparser2](https://github.com/fb55/htmlparser2)
cml-htmllinter