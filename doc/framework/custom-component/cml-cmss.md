# 组件模板和样式
类似于页面，自定义组件拥有自己的 `<template/>` 模板和 `<style/>` 样式。

首先我们通过 `cml init project` 生成一个 cml项目，然后按照以下操作指引，看下如何使用cml的组件

``` 
cml init component
选择普通组件
输入 component-tag-namecomponent-tag-name
```

在 `src/pages/index/index.cml`中引入这个组件

```javascript
"usingComponents": {
  "component-tag-name":"/components/component-tag-name/component-tag-name"
}
```

## 组件模板

组件模板的写法与页面模板相同。组件模板与组件数据结合后生成的节点树，将被插入到组件的引用位置上。

在组件模板中可以提供一个 `<slot>` 节点，用于承载组件引用时提供的子节点。

**代码示例：**

```html
<!-- component-tag-name.cml -->
<!-- 组件模板 -->
<view class="wrapper">
  <view>这里是组件的内部节点</view>
  <slot></slot>
</view>
```

```html
<!-- index.cml -->
<!-- 引用组件的页面模板 -->
<view>
  <component-tag-name>
    <!-- 这部分内容将被放置在组件 <slot> 的位置上 -->
    <view>这里是插入到组件slot中的内容</view>
  </component-tag-name>
</view>
```

## 模板数据绑定

可以使用数据绑定，这样就可以向子组件的属性传递动态数据。

**代码示例：**

```html
<!-- 引用组件的页面模板 -->
<view>
  <component-tag-name prop-a="{{dataFieldA}}" prop-b="{{dataFieldB}}">
    <!-- 这部分内容将被放置在组件 <slot> 的位置上 -->
    <view>这里是插入到组件slot中的内容</view>
  </component-tag-name>
</view>
```

在以上例子中，组件的属性 `propA` 和 `propB` 将收到页面传递的数据。页面可以通过 `this.dataFieldA`、`this.dataFieldB` 来改变绑定的数据字段。

**注意：这样的数据绑定只能传递 JSON 兼容数据。**

## 组件<template>的slot
在组件的`<template/>`中可以包含 `slot` 节点，用于承载组件使用者提供的`cml`结构。

支持通过具名插槽的方式在模板中使用多个`slot`

```html
<!-- component-tag-name.cml -->
<template>
  <view>
    <view>组件模板的slot</view>
    <slot name="before"></slot>
    <slot></slot>
    <slot name="after"></slot>
  </view>
</template>
```

然后在父页面 `src/pages/index/index.cml`中

```html
<template>
  <component-tag-name >
    <view >this is from index</view>
    <view slot="before">this is before from index</view>
    <view slot="after">this is after from index</view>
    <view >this is from index aaaa</view>
  </component-tag-name>
</template>
```


## 组件样式

### 组件样式

组件对应 `style` 标签内的样式，只对当前节点生效。编写组件样式时，需要注意以下几点：

- 组件和引用组件的页面不能使用id选择器（`#a`）、属性选择器（`[a]`）和标签名选择器，请改用`class`选择器。
- 组件和引用组件的页面中使用后代选择器（`.a .b`）在一些极端情况下会有非预期的表现，如遇，请避免使用。
- 子元素选择器（`.a>.b`）只能用于 `view` 组件与其子节点之间，用于其他组件可能导致非预期的情况。
- 继承样式，如 `font` 、 `color` ，会从组件外继承到组件内。
- 元素选择器不支持

```css
#a {
} /* 在组件中不能使用 */
[a] {
} /* 在组件中不能使用 */
button {
} /* 在组件中不能使用 */
.a > .b {
} /* 除非 .a 是 view 组件节点，否则不一定会生效 */
view{
  
}/* 不支持元素选择器 */
```

## 样式多态

chameleon扩展了多态样式，用于针对对于不同端有不同的样式需求的情况 [参考](https://cmljs.org/doc/view/cmss/css_diff.html)

## 引用外部样式
[参考](https://cmljs.org/doc/api/runtime/@import.html)
