# c-picker-time

---

时间选择器

###属性

<table>
  <tr>
    <th>属性名</th>
    <th>类型</th>
    <th>必填</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>data</td>
    <td>Array</td>
    <td>是</td>
    <td></td>
    <td>滚动选择器滚动的数据</td>
  </tr>
  <tr>
    <td>defaultIndex</td>
    <td>Number</td>
    <td>是</td>
    <td>0</td>
    <td>滚动选择器默认的数据索引</td>
  </tr>
  <tr>
    <td>height</td>
    <td>String</td>
    <td>是</td>
    <td>“400”</td>
    <td>滚动选择器的高度</td>
  </tr>
  <tr>
    <td>textAlign</td>
    <td>String</td>
    <td>是</td>
    <td>"center"</td>
    <td>滚动选择器的文本样式:"居中"</td>
  </tr>
  <tr>
    <td>c-bind:selectchange</td>
    <td>EventHandle</td>
    <td>是</td>
    <td></td>
    <td>
    选择器滚动时触发:
    <br/>
    返回事件对象:
    <br/>
    event.type="selectchange"
    <br/>
    event.detail = {index}</td>
  </tr>
</table>

###示例

```html
<template>
    <view>
        <view><text class="select-text">时间选择</text></view>
        <view><text class="select-text" c-bind:tap="showClick">点击选择：{{selectedTimeStr}}</text></view>
        <c-picker-panel
                show="{{panelShow}}"
                height="{{500}}"
                header-height="{{100}}"
                c-bind:cancel="cancel"
                c-bind:confirm="confirm">
                <view style="display:flex; flex-direction: row">
                    <view style="flex:1">
                        <c-picker-time
                            text-align="center"
                            height="{{400}}"
                            data="{{hours}}"
                            default-index="{{defaultHour}}"
                            c-bind:selectchange="changeHour">
                        </c-picker-time>
                    </view>
                    <view style="flex:1">
                        <c-picker-time
                            text-align="center"
                            height="{{400}}"
                            data="{{minutes}}"
                            default-index="{{defaultMinute}}"
                            c-bind:selectchange="changeMinute">
                        </c-picker-time>
                    </view>
                </view>
        </c-picker-panel>
    </view>
</template>
<script>
import { hours, minutes } from "./data";
class Index {
  data = {
    headerTitle: "c-picker-item",
    headerDesc: "c-picker-item组件",
    hours,
    minutes,
    panelShow: false,
    selectedTimeStr: [],
    selectTime: [new Date().getHours(), new Date().getMinutes()]
  }
  computed = {
    defaultHour() {
      for (let i = 0; i < this.hours.length; i++) {
        if (this.hours[i] == this.selectTime[0]) {
          return i;
        }
      }
    },
    defaultMinute() {
      for (let j = 0; j < this.minutes.length; j++) {
        if (this.minutes[j] == this.selectTime[1]) {
          return j;
        }
      }
    }
  }
  watch = {}
  created() {
    this.formate();
  }
  methods = {
    showClick() {
      this.panelShow = true;
    },
    cancel() {
      this.panelShow = false;
    },
    confirm() {
      this.panelShow = false;
    },
    changeHour(e) {
      this.selectTime[0] = this.hours[e.detail.index];
      this.formate();
    },
    changeMinute(e) {
      this.selectTime[1] = this.minutes[e.detail.index];
      this.formate();
    },
    formate() {
      this.selectedTimeStr = this.selectTime.join(":");
    }
  }
};
export default new Index();
</script>
<style scoped>
.weex-page-demo {
  background: #f8f8f8;
  position: absolute;
  top: 88px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.page-demo {
  background: #fafafa;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.title-text {
  color: #999;
  margin: 30px 20px 10px;
  display: block;
  font-size: 28px;
}
.picker-item {
  background: #fff;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-direction: row;
}
.picker-text-left {
  font-size: 40px;
  height: 70px;
  line-height: 70px;
  margin-left: 20px;
  width: 300px;
}
.picker-text-right {
  font-size: 40px;
  height: 70px;
  line-height: 70px;
  margin-left: 20px;
  flex: 1;
  text-align: center;
}
.select-text {
  font-size: 32px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script cml-type="json">
{
  "base": {
    "usingComponents": {
      "c-picker-time": "cml-ui/components/c-picker-time/c-picker-time"
    }
  }
}
</script>
```

<img src="../assets/picker-time.png" width="348px">
