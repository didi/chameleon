# native-scroller
-------
原生滚动容器。

可容纳排成一列的子组件的滚动器，提供最简单的原生滚动方式。

### 属性

无


### 示例
```html
<template>
<view class="container">
  <native-scroller>
      <view
        class="cell"
        c-for="{{panels}}"
        c-for-index="i"
        c-for-item="item"
        c-bind:tap="change"
        data-idx="{{i}}"
      >
          <view class="panel" style="{{item.computedStyle}}">
               <text class="text">{{item.label}}</text>
          </view>
      </view>
  </native-scroller>
</view>
</template>

<script>
class NativeScroller  {
  data = {
    /**
     * scroller 配置
     */
    bottomOffset: 20,
    scrollDirection: 'vertical',
    panels: [
    ],
    rows: []
  }
  methods = {
    change (e) {
        let target = e.currentTarget
        let dataset = target.dataset
        let i = dataset.idx

        const item = this.panels[i]
        if (item) {
            item.height = item.height === 200 ? 400 : 200
            item.width = item.width === 330 ? 730 : 330
            item.computedStyle = `height:${item.height}cpx;width:${item.width}cpx;background-color:${item.bgc};opacity:${item.opacity}`
        }
    },
    randomfn () {
        let ary = [];
        for(let i = 1; i<= 40; i++) {
            let item = {label: i ,height: 200 , width:730, bgc:'#69BE96',opacity:1}
            item.computedStyle = `height:${item.height}cpx;width:${item.width}cpx;background-color:${item.bgc};opacity:${item.opacity}`

            ary.push(item)
        }
        return ary;
    }
  }
  created (res) {
    this.panels = this.randomfn()

    for (let i = 0; i < 30; i++) {
      this.rows.push('row ' + i)
    }
    console.log('demo page created:', res)
  }
}
export default new NativeScroller();

</script>
<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.title {
  text-align: center;
  flex-direction: row;
  justify-content: center;
}
.panel {
    display: flex;
    margin: 10cpx;
    top:10cpx;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #666;
    border-radius: 10cpx;
    transition-property: width,height;
    transition-duration: 0.5s;
    transition-delay: 0s;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
}
.cell{
    display: flex;
    background-color:white;
    flex-direction: row;
}

.text {
    font-size: 60cpx;
    color: white;

}

</style>

<script cml-type="json">
{
  "base": {}
}
</script>


```
<div style="display: flex;flex-direction: row;justify-content: space-around; align-items: flex-end;">
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/scroller.png" width="200px" height="100%" />
    <text style="color: #fda775;font-size: 24px;">wx</text>
  </div>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/scroller_web.png" width="200px" height="100%"/>
    <text style="color: #fda775;font-size: 24px;">web</text>
  </div>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/scroller_weex.jpg" width="200px" height="100%"/>
    <text style="color: #fda775;font-size: 24px;">native</text>
  </div>
</div>

### Bug & Tip
1. 如果子组件的总高度高于其本身，那么所有的子组件都可滚动。
2. `<native-scroller>`可以当作根元素或者嵌套元素使用。
3. `<native-scroller>` 的子组件定位无效。
