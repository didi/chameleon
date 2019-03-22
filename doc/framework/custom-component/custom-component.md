# 自定义组件
`cml`支持简洁的组件化编程。

开发者可以将页面内的功能模块抽象成自定义组件，以便在不同的页面中重复使用；也可以将复杂的页面拆分成多个低耦合的模块，有助于代码维护。

## 创建自定义组件
类似页面，自定义组件由 `<template/>` `<script/>` `<style/>` `<script cml-type="json">` 4部分组成。

要编写一个自定义组件，可以在 `json` 中进行自定义组件声明（将 `component` 字段设为 `true`，这是可选操作，因为`cml`会在引用这个文件时自动识别`自定义组件`）：

```json
{
  "component": true
}
```

接下来，在 `<template/>` 中编写组件模板，在 `<style/>` 中加入组件样式，它们的写法与页面的写法类似。具体细节和注意事项参见 [组件模板和样式](./cml-cmss.md) 。

*代码示例：*

```html
<!-- 这是自定义组件的内部CML结构 -->
<view class="inner">
  {{innerText}}
</view>
<slot></slot>
```

```css
/* 这里的样式只应用于这个自定义组件 */
.inner {
  color: red;
}
```

**注意：在组件CMSS中不应使用ID选择器、属性选择器和标签名选择器。**

组件的属性值和内部数据将被用于组件 CML 的渲染，其中，属性值是可由组件外部传入的。更多细节参见 [组件VM](./comp-vm.md) 。

*代码示例：*

```html
<script>
class CustomCom {
  props = {
    title: String,
    innerText: {
      type: String
    },
    content: {
      type:Object,
      default: {}
    },
    list: {
      type: Array,
      default: []
    }
  }

  data = {}
  computed = {}
  watch  = {}
  methods = {}
  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
  beforeDestroy() {}
  destroyed() {}
}
export default new CustomCom();
</script>
```

## 使用自定义组件
使用已注册的自定义组件前，首先要在页面的 `<script cml-type="json">` 中进行引用声明。

此时需要提供每个自定义组件的标签名和对应的自定义组件文件路径(相对路径或者绝对路径)：

```json
{
  "usingComponents": {
    "component-tag-name": "path/to/the/custom/component"
  }
}
```

这样，在页面的 CML 中就可以像使用基础组件一样使用自定义组件。节点名即自定义组件的标签名，节点属性即传递给组件的属性值。

*代码示例：*

```html
<view>
  <!-- 以下是对一个自定义组件的引用 -->
  <component-tag-name title="xxx" inner-text="Some text"></component-tag-name>
</view>
```
自定义组件的 CML 节点结构在与数据结合之后，将被插入到引用位置内。

### 细节注意事项
**一些需要注意的细节：**

- 因为 CML 节点标签名只能是小写字母、中划线和下划线的组合，所以自定义组件的标签名也只能包含这些字符。
- 自定义组件也是可以引用自定义组件的，引用方法类似于页面引用自定义组件的方式（使用 `usingComponents` 字段）。
- 自定义组件和页面所在项目根目录名不能以“wx-”为前缀，否则会报错。

**注意，**是否在页面文件中使用 `usingComponents` 会使得页面的 `this` 对象的原型稍有差异，包括：

- 使用 `usingComponents` 时会多一些方法，如 `selectComponent` 。
- 如果页面比较复杂，新增或删除 `usingComponents` 定义段时建议重新测试一下。