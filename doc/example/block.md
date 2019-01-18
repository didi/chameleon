# view
-------
视图容器

`<view>` 是 chameleon 内置的组件，类似web端的div块级元素标签。

### 示例
```html
<template>
  <view class="page-demo">
    <view class="page-box">
      <view class="page-section">
        <view class="page-section-title">flex-direction: row</view>
        <view class="page-section-content" style="flex-direction: row">
          <view class="flex-item demo-1"><text>I</text></view>
          <view class="flex-item demo-2"><text>II</text></view>
          <view class="flex-item demo-3"><text>III</text></view>
        </view>
      </view>
      <view class="page-section">
        <view class="page-section-title">flex-direction: column</view>
        <view class="page-section-content" style="flex-direction: column">
          <view class="flex-item-V demo-1"><text>I</text></view>
          <view class="flex-item-V demo-2"><text>II</text></view>
          <view class="flex-item-V demo-3"><text>III</text></view>
        </view>
      </view>
    </view>
  </view>
</template>
<style scoped>
 .page-demo {
   background: #FAFAFA;
   position: absolute;
   top: 0;
   bottom: 0;
   left: 0;
   right: 0;
 }
.page-box {
  margin-top: 80cpx;
}
.page-section-title {
  font-size: 32cpx;
  margin: 0 30cpx;
}
.page-section-content {
  margin: 80cpx;
  display: flex;
  font-size: 32cpx;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.flex-item {
  width: 200cpx;
  height: 300cpx;
  line-height: 300cpx;
  justify-content: center;
  align-items: center;
}
.flex-item-V {
  width: 300cpx;
  height: 200cpx;
  line-height: 200cpx;
  justify-content: center;
  align-items: center;
}
.demo-1 {
  background-color: #81c0c0;
}
.demo-2 {
  background-color: #97cbff;
}
.demo-3 {
  background-color: #e0e0e0;
}
</style>
```

<img src="../assets/view.png" width="400px" />

### Bug & Tip
tip: 如果需要使用滚动视图，请使用 [scroller](/component/base/layout/scroller.html) 包裹


