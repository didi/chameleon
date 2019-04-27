# CMSS

CMSS(Chameleon Style Sheets)是一套样式语言，用于描述 CML 的组件样式。

## [使用](./../view/cmss/style_way.html)

CMSS支持内联及类选择器等。

## [布局](./../view/cmss/layout.html)

采用 FlexBox 布局模型，请勿使用float方式布局。

## [盒模型](./../view/cmss/box.html)

chameleon中盒模型`box-sizing`默认为`border-box`，即宽度包含内容、内边距盒边框。

## [文本](./../view/cmss/text.html)

文本类组件及通用样式。

## [尺寸单位](./../view/cmss/unit.html)

为了统一多端尺寸单位，呈现效果一致，同时页面响应式，项目中统一采用`cpx`作为尺寸单位，规定以屏幕750px（占满屏幕）视觉稿作为标准。

禁止[.cml](./cml.html)中使用`px`，若要使用请使用[多态协议](view/cmss/css_diff.html)。

## [颜色](./../view/cmss/color.html)

基础颜色关键词及扩展颜色关键词。

## [样式多态](./../view/cmss/css_diff.html)

更加方便地为不同端定制样式。

## [一致性基础样式](./../view/cmss/base_style.html)

统一各端基础样式，增强表现一致性。

## [只跨web和小程序的应用](../example/web_wx.html)
受限于客户端的 CMSS 渲染能力，开发会有诸多限制。如果你只需要跨H5和小程序应用时，开发会变得很轻便。

