## 模板校验功能点
该文档汇集模板校验支持所有检查点。


### 模板语言校验
模板可以指定模板语言，指定方式为在 template 标签上指定 lang 属性， 其合法值为 "cml" 和 "vue"。

校验点:

+ template 可以忽略 lang 属性，此时其默认值为 cml
+ template lang 属性如果指定，则必须为  "cml" 或者 "vue"

> 报错信息：'the tag template lang attribute: "<%= lang %>" is not valid'.

### 模板 template 标签校验
校验点：每个模板只能切必须有一对 template 根标签。

> 报错信息："Each template can only have one group of template tags."

### 模板内 tags 校验
每个模板都有一个模板语言和一个平台类型，其中模板语言由 template 的 lang 属性指定，平台类型由模板文件的文件名解析出来。
对于多态组件平台类型可以直接从文件名解析出来， 比如 index.web.cml, index.weex.cml, index.wx.cml 对应的平台类型分别为 web, weex, wx。
对于单文件组件，由于其模板要跨三端，故模板中只能使用 chameleon 原生支持的内建标签。

校验点：

+ 单文件组件只能使用 chameleon 内建标签，使用非内建标签校验不通过。
    - chameleon 内建标签有: ['template','view','text','block','scroller','list','cell','image','switch','video','input','button','radio','checkbox', 'page', 'router-view', 'slot']

+ 多态组件可以使用 chameleon 内建标签加上各平台类型所支持的原生标签，使用其他标签验证不同过。
    - web 平台原生支持标签: ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","command","datalist","dd","del","details","dir","div","dfn","dialog","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","slot","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"]
    - weex 平台原生支持标签: ['a','div','image','indicator','input','list','cell','recycle-list','loading','refresh','scroller','slider','textarea','text','richtext','video','waterfall','web']
    - wx 平台原生支持标签: ['template','view','block','scroll-view','swiper','movable-view','movable-area','cover-view','cover-image','icon','text','rich-text','progress','lable','input','form','checkbox','picker','picker-view','radio','switch','slider','textarea','navigator','functional-page-navigator','camera','live-player','live-pusher','map','open-data','web-view','ad','official-account','slot']

> 报错信息：'tag: "<%= tag %>" is either not allowed in this template or not referenced as a component'

### 模板指令校验
每个模板可以使用的指令由模板语言和平台类型共同决定。

校验点：

+ 单文件模板只能使用模板语言对应的指令，使用模板语言指令之外的指令校验不通过
    - lang='cml' 支持的指令：['c-if','c-else','c-else-if','c-for','c-for-index','c-for-item','c-model','c-text','c-show','c-bind','c-catch','c-key']
    - lang='vue' 支持的指令：['v-if','v-else','v-else-if','v-for','v-on','v-bind','v-html','v-show','v-model','v-pre','v-once','slot-scope','is','@',':']
+ 多态组件可以使用**模板语言指令**加**平台原生指令**，使用此外其他指令校验不通过
    - web 平台支持指令：无模板指令
    - weex 平台支持指令同 vue.js 框架： ['v-if','v-else','v-else-if','v-for','v-on','v-bind','v-html','v-show','v-model','v-pre','v-once','slot-scope','is','@',':']
    - wx 平台支持指令：['wx:if','wx:elif','wx:else','wx:for','wx:for-item','wx:for-index','wx:key','bindtap','catchtap']

> 报错信息：'attribute name: "<%= name %>" is not allowed in this template'

### 组件属性和事件名称校验
在使用组件的时，会对使用过程中属性名和绑定的事件名称进行校验。组件属性校验分为内建组件与自定义组件两部分。

校验点：

+ 内建组件:使用的属性名和绑定事件必须在组件内有定义否则校验不通过
    - chameleon 内建组件有：['view','text','scroller','list','cell','image','switch','video','input','button','radio','checkbox', 'page', 'router-view']
+ 自定义组件:模板校验时和根据 usingComponents 配置解析对应组件，使用组件时属性名和事件名必须在组件内有定义否则校验不通过。

> 报错信息：
> "The property <%= propName %> is not a property of component <%= componentName %> which path is: <%= componentPath %>"


> 报错信息：
> "The event <%= eventName %> is not defined in component <%= componentName %> which path is: <%= componentPath %>"

### 内置组件嵌套规则校验
在使用 chameleon 内置组件时，内置组件之间需要遵循一定的嵌套关系。

校验点：

+ text 组件
    - text 组件不能够包含任何子组件
+ scroller 组件
    - scroller 组件不能包含 textarea 或者 video 组件
+ list
    - list 组件不能包含 textarea 或者 video 组件
+ video
    - video 组件如果包含子组件，那么只能是 text 组件

> 报错信息
> 'tag "<%= parent %>" can not have any child elements, therefor tag "<%= forbiddenTag %>" is not allowed as it\'s children'

> 报错信息
> 'tag "<%= parent %>" can only have "<%= elements %>" as it\'s child elements, therefor tag "<%= forbiddenTag %>" is not allowed as it\'s children'

> 报错信息
> 'tag "<%= parent %>" can not have  "<%= forbiddenTag %>" as it\'s child elements, and element in this list: "<%= elements %>" is forbidden as well'
