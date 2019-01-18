# CSS 单位

## CSS color 单位

支持以下写法：

```html
.classA {
  /* 3-chars hex */
  color: #0f0;
  /* 6-chars hex */
  color: #00ff00;
  /* rgba */
  color: rgb(255, 0, 0);
  /* rgba */
  color: rgba(255, 0, 0, 0.5);
  /* transparent */
  color: transparent;
  /* Basic color keywords */
  color: orange;
  /* Extended color keywords */
  color: darkgray;
}
```
**注意**

- 不支持 hsl(), hsla(), currentColor, 8个字符的十六进制颜色。

- rgb(a,b,c) 或 rgba(a,b,c,d) 的性能比其他颜色格式差很多，请选择合适的颜色格式。

颜色名称可查看:[颜色名称列表](./colorname_list.html).

## CSS length 单位

在 chameleon 中，我们支持 cpx 长度单位。并且它将在 JavaScript 运行时和本机渲染器中解析为数字类型。

下面这些不同的写法，解析的结果完全相同。

```html
.classA { font-size: 48cpx; line-height: 64cpx; }
```

## CSS number 单位
仅仅一个数字。用于 opacity，lines等。

有时值必须是整数，例如：lines。

## CSS percentage 单位 (暂不支持)
表示百分比值，如“50％”，“66.7％”等。

它是 CSS 标准的一部分，但 chameleon 暂不支持。

