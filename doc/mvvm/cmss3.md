# CMSS样式协议

CMSS 是一套样式语言，用于支持使用chameleon框架的时候，使得`web native 小程序`端样式保持一致性；

### 尺寸单位

- `cpx`:可以根据屏幕宽度进行自适应。

规定屏幕宽为750cpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750cpx = 375px = 750物理像素，1cpx = 0.5px = 1物理像素。

### 样式导入

使用 `@import` 语句可以导入外联样式表

指定导入的外部样式表及目标媒体。支持导入.css、.less、.stylus类型文件。

该规则必须在样式表头部最先声明。并且其后的分号是必需的，如果省略了此分号，外部样式表将无法正确导入，并会生成错误信息。

```style
<style>
    @import './base.css';
</style>

```

```style
<style lang="less">
    @import './base.less';
</style>

```

```style
<style lang="stylus">
    @import './base.stylus';
</style>


```

### 内联样式

框架组件上支持使用 `style` `class`属性来控制组件的样式。

- `style`:建议静态style统一写到class中。style接受动态的样式，运行时会解析，尽量避免将静态样式写进`style`中，以免影响渲染速度

静态style
```vue
<view style="color:#FF9900"></view>
```
动态style

```vue
<view style="color:{{color}}"></view>
```

- class:用于指定样式规则，其属性值是样式规则中类选择器名（样式类名）的集合，样式类名之间要用空格分割。

静态class

```vue
<view class="cls1  cls2"></view>
```

动态class

```vue
<view class="cls1 {{classVariable}}"></view>
```
### 选择器

`chameleon`是跨`web weex 小程序`的多端框架，受限于native的能力，可以使用的选择器会有很大的限制，基本支持情况见如下表格：

<table>
  <tr>
    <th width="200px">CSS属性</th>
    <th>H5</th>
    <th width="100px">小程序</th>
    <th>weex</th>
  </tr>
  <tr>
    <td>布局</td>
    <td>all</td>
    <td>all</td>
    <td>flexbox</td>
  </tr>
    <tr>
    <td>盒模型</td>
    <td>all</td>
    <td>all</td>
    <td>只支持display:border-box</td>
  </tr>
  <tr>
    <td>float浮动</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>display:inline-block|none</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>ID选择器</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>类选择器</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>属性选择器</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>级联选择器、派生选择器(后代、子元素、相邻兄弟)</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>选择器分组</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>伪类(:active|:focus)</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>伪类(:hover|:link|:visited|:first-child|:lang)</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>伪元素(:first-letter|:first-line|:before|:after)</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>百分比定值</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>line-height:1</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>尺寸</td>
    <td>px|rem|em|vw|vh</td>
    <td>px|rpx</td>
    <td>px</td>
  </tr>
  <tr>
    <td>!important</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
</table>

### 盒模型

chameleon中的盒模型`box-sizing`默认为 `border-box`,
padding和border被包含在定义的width和height之内。对象的实际宽度就等于设置的width值，即使定义有border和padding也不会改变对象的实际宽度，即 ( Element width = width )


### 布局

采用`flex`布局模型，请勿使用float布局

