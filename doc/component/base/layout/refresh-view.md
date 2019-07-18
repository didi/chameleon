# refresh-view
-------
支持下拉刷新、上拉加载的滚动容器。


### 属性

<table>
  <tr>
    <th width="200px">属性名</th>
    <th>类型</th>
    <th width="60px">必填</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>enablePullUpLoad</td>
    <td>Boolean</td>
    <td>否</td>
    <td></td>
    <td>是否开启上拉加载</td>
  </tr>
  <tr>
    <td>pullUpLoadComplete</td>
    <td>Boolean</td>
    <td>使用上拉加载时必传</td>
    <td>false</td>
    <td>当数据加载完成后修改该值更新状态</td>
  </tr>
  <tr>
    <td>pullingUp</td>
    <td>Boolean</td>
    <td></td>
    <td>无</td>
    <td>上拉加载中</td>
  </tr>
  <tr>
    <td>pullUpStart</td>
    <td>Number</td>
    <td>否</td>
    <td>50</td>
    <td>触发上拉加载的的距离</td>
  </tr>
  <tr>
    <td>pullUpStop</td>
    <td>Number</td>
    <td>否</td>
    <td>80</td>
    <td>上拉加载动画停留的位置高度</td>
  </tr>
  <tr>
    <td>pullDownStart</td>
    <td>Number</td>
    <td>否</td>
    <td>50</td>
    <td>下拉刷新开始位置距离</td>
  </tr>
  <tr>
    <td>pullDownStop</td>
    <td>Number</td>
    <td>否</td>
    <td>80</td>
    <td>下拉刷新动画停留的位置高度</td>
  </tr>
  <tr>
    <td>pullingDown</td>
    <td>Boolean</td>
    <td>否</td>
    <td>false</td>
    <td>下拉刷新中</td>
  </tr>
  <tr>
    <td>c-bind:onscroll</td>
    <td>EventHandle</td>
    <td>否</td>
    <td></td>
    <td>滚动时触发，
        <br/>
        返回事件对象：
        <br/>
        event.type = 'scroll'
        <br/>
        event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
    </td>
  </tr>
  <tr>
    <td>c-bind:onPullUpLoad</td>
    <td>EventHandle</td>
    <td>否</td>
    <td></td>
    <td>上拉加载时触发</td>
  </tr>
  <tr>
    <td>c-bind:onPullDownRefresh</td>
    <td>EventHandle</td>
    <td>否</td>
    <td></td>
    <td>下拉刷新时触发</td>
  </tr>
</table>

### 示例
```html
<template>
<refresh-view enablePullUpLoad="{{true}}"
              pullingDown="{{pullingDown}}"
              pullingUp="{{pullingUp}}"
              c-bind:onPullDownRefresh="pullDownRefreshHandle"
              c-bind:onPullUpLoad="pullUploadHandle">
    <view class="content">
      <c-header title="refresh-view"></c-header>
      <text c-for="{{texts}}" class="text-item">{{item}}</text>
    </view>
    <text class="loading-text">{{loadingText}}</text>
</refresh-view>
</template>

<script>
import cml from 'chameleon-api';
class Refresh_view   {

  data = {
    imgGif: require('../../../components/refresh-loading/img/loading.gif'),
    texts: [0,1,2,3,4,5,6],
    pullingDown: false,
    pullingUp: false,
    loadingText: '上拉加载'
  }

  computed = {
  }

  watch  = {
  }

  methods = {
    pullDownRefreshHandle(e) {
      this.pullingDown = true;
      setTimeout(() => {
        let length = this.texts.length;
        for (let i = length; i < length + 5; i ++) {
          this.texts.unshift(i);
        }
        this.pullingDown = false;
      }, 2000);
    },
    pullUploadHandle(e) {
      this.pullingUp = true;
      this.loadingText = '加载中...'
      setTimeout(() => {
        this.loadingText = '加载完成'
        let length = this.texts.length;
        for (let i = length; i < length + 5; i ++) {
          this.texts.push(i);
        }
        this.loadingText = '上拉加载'
        this.pullingUp = false;
      }, 2000);
    }
  }

}

export default new Refresh_view();
</script>
<style>
.container {
  flex: 1;
  width: 750cpx;
}
.text-item {
  width: 710cpx;
  text-align: center;
  line-height: 160cpx;
  height: 160cpx;
  background: #69BE96;
  border: 1px solid #666;
  border-radius: 10cpx;
  align-self: center;
  font-size: 60cpx;
  color: white;
  margin: 20cpx;
}
.loading-text {
  height: 80cpx;
  line-height: 80cpx;
  text-align: center;
  color: #999;
  font-size: 24cpx;
}
</style>

<script cml-type="json">
{
  "base": {}
}
</script>


```

### Bug & Tip
1. `refresh-view`为全屏组件。
2. 如果子组件的总高度高于其本身，那么所有的子组件都可滚动。
