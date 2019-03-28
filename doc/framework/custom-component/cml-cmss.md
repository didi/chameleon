# 组件模板和样式
类似于页面，自定义组件拥有自己的 wxml 模板和 wxss 样式。

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

初始化的组件模板基本内容如下

```vue
<template>
  <view><text>Hello Chameleonss!</text></view>
</template>
```

组件模板的数据绑定,在组件模板中可以提供一个`<slot>`来承载提供的子节点

注意在组件模板中引用到其他的自定义组件的时候，需要在该组件的`usingComponents`字段中定义

## 模板数据绑定和slot

`component-tag-name.cml`

```vue
<template>
  <view>
    <text>Hello Chameleonss!</text>
    <view>组件模板的数据绑定</view>  
    <view>{{msg}}</view>
  </view>
</template>
```

```javascript
data = {
  msg:"this is message",
}
```

数据绑定的值可以来自`data props computed watch`中

## 模板slot

支持一个`slot`标签用来承载组件引用是提供的子节点；

支持通过具名插槽的方式在模板中使用多个`slot`

`component-tag-name.cml`

```vue
<template>
  <view>
    <view>组件模板的slot</view>
    <slot name="before"></slot>
    <slot></slot>
    <slot name="after"></slot>
  </view>
</template>
```

然后在父组件 `src/pages/index/index.cml`中

```vue
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

- 组件和引用组件的页面不能使用id选择器（`#a`）、属性选择器（`[a]`）和标签名选择器，请改用class选择器。
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



## 多态样式

chameleon扩展了多态样式，用于针对对于不同端有不同的样式需求的情况 [参考](https://cmljs.org/doc/view/cmss/css_diff.html)

## 外部样式类