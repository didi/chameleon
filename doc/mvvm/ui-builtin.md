# 内置组件扩展

chameleon-ui-builtin是CML内置组件库，说明参见：[内置组件文档](https://cml.js.org/doc/component/base/base.html)。用户需要利用[多态接口扩展](../framework/polymorphism/api_extend.md)在目标端对每一个组件进行实现，要保证组件的属性和事件一致，还有视图的表现一致。


### 扩展新端组件（以头条小程序为例，假设端扩展标识为：toutiao）:
编写 `my-ui-builtin/button/button.interface`

``` js
// 引入官方标准interface文件
<include src="chameleon-ui-builtin/components/button/button.interface"></include>
```

编写 `my-ui-builtin/button/button.toutiao.cml`

``` html
// 扩展实现新端（以头条小程序为例，假设端扩展标识为：toutiao），具体代码可参考在其他端的实现如：chameleon-ui-builtin/components/button/button.wx.cml
<template>
  <button 
    class="cml-btn" 
    c-bind:tap="onclick" 
    style="{{mrBtnStyle}}" 
    open-type="{{openType}}"
    lang="{{lang}}"
    session-from="{{sessionFrom}}"
    send-message-title="{{sendMessageTitle}}"
    send-message-path="{{sendMessagePath}}"
    send-message-img="{{sendMessageImg}}"
    show-message-card="{{showMessageCard}}"
    app-parameter="{{appParameter}}"
    c-bind:getuserinfo="getuserinfo"
    c-bind:contact="contact"
    c-bind:getphonenumber="getphonenumber"
    c-bind:error="error"
    c-bind:opensetting="opensetting"
    >
    <text class="btn-text" style="{{mrTextStyle}}">{{text}}</text>
  </button>
</template>
<script>
// js实现部分
</script>
<style scoped>
// 样式部分
</style>
<script cml-type="json">
// json配置
</script>
```

