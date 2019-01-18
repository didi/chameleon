# 样式多态
`cml`文件中的`style`标签支持样式的多态，即可以针对不同的平台写不同的样式，格式如下：
```
<style>
@media cml-type (支持的平台) {

}
.common {
  /**/
}
<style>
```
其中`支持的平台`为可以用逗号分隔多个平台，可选平台为`web,weex,wx,alipay,baidu`。
demo示例，`class1`在各端的差异实现。
```
<template>
  <view><text class="class1">chameleon</text><view>
</template>
<script>
  class DemoPage {

  }
  export default new DemoPage();
</script>
<style>
@media cml-type (web) {
  .class1 {
    color: red;
  }
}
@media cml-type (weex) {
  .class1 {
    color: green;
  }
}
@media cml-type (wx,alipay,baidu) {
  .class1 {
    color: blue;
  }
}
</style>
<script cml-type="json">
{}
</script>
```

**注意**： 多态差异语法只能在`cml`文件中使用，不能在`.css,.less`等其他样式文件中使用，如果需要分文件实现，可以在多态内部分别引入文件。例如：
```html
<style lang="less">
@media cml-type (web) {
  @import "./style1.less";
}
@media cml-type (weex) {
  @import "./style2.less";

}
@media cml-type (wx,alipay,baidu) {
  @import "./style3.less";

}
</style>
```
