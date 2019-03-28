# c-tabbar

---

tabbar组件

注意需要升级最新的`cml-ui`,在项目根目录执行`npm i cml-ui@latest -S`

### 属性

<table>
  <tr>
    <th>属性名</th>
    <th>类型</th>
    <th>必填</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>c-bind:onclick</td>
    <td>EventHandle</td>
    <td>是</td>
    <td></td>
    <td>tab被点击的时候会触发该事件，参数详情中`detail.compName`是tabbar.list配置中的compName</td>
  </tr>
  <tr>
    <td>c-model</td>
    <td>String</td>
    <td>是</td>
    <td></td>
    <td>当 使用 component 动态组件的时候，更方便的和动态组件要渲染的组件名有个对应</td>
  </tr>
  <tr>
    <td>tabbar</td>
    <td>Object</td>
    <td>是</td>
    <td>{}</td>
    <td>详情见下表</td>
  </tr>
</table>

tabbar 详情

<table>
  <tr>
    <th>属性名</th>
    <th>类型</th>
    <th>必填</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>useFixedLayout</td>
    <td>Boolean</td>
    <td>否</td>
    <td>false</td>
    <td>用于决定是否使用position:fixed 这种布局方式去布局tabbar组件</td>
  </tr>
  <tr>
    <td>position</td>
    <td>String</td>
    <td>否</td>
    <td>'bottom'</td>
    <td>仅在useFixedLayout 为true的时候生效</td>
  </tr>
  <tr>
    <td>tabbarStyle</td>
    <td>String</td>
    <td>否</td>
    <td>''</td>
    <td>tabbar样式支持自定义</td>
  </tr>
  <tr>
    <td>tabLineStyle</td>
    <td>String</td>
    <td>否</td>
    <td>'background-color:#FC9153;height:2cpx;'</td>
    <td>tabbar的下划线自定义样式，仅在 position 设置为top的时候有效</td>
  </tr>
  <tr>
    <td>textStyle</td>
    <td>String</td>
    <td>否</td>
    <td>'color:#000000'</td>
    <td>tabbar文案默认的样式</td>
  </tr>
  <tr>
    <td>selectedTextStyle</td>
    <td>String</td>
    <td>否</td>
    <td>'color:#61c7fc'</td>
    <td>tabbar文案被选中的时候的样式</td>
  </tr>
  <tr>
    <td>list</td>
    <td>Array</td>
    <td>是</td>
    <td>[]</td>
    <td>配置tabbar的icon，文案等，详情见下表</td>
  </tr>
</table>

list 中数组每一项的配置详情

<table>
  <tr>
    <th>属性名</th>
    <th>类型</th>
    <th>必填</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>text</td>
    <td>String</td>
    <td>是</td>
    <td>''</td>
    <td>tab的文案</td>
  </tr>
  <tr>
    <td>icon</td>
    <td>网络图片地址或者`require(path/to/image)`</td>
    <td>否</td>
    <td></td>
    <td>tab的icon</td>
  </tr>
  <tr>
    <td>selectedIcon</td>
    <td>网络图片地址或者`require(path/to/image)`</td>
    <td>否</td>
    <td></td>
    <td>tab被选中时显示的icon</td>
  </tr>
  <tr>
    <td>iconStyle</td>
    <td>String</td>
    <td>否</td>
    <td>默认的icon的宽高是40cpx;</td>
    <td>设置icon的样式</td>
  </tr>
  <tr>
    <td>selectedIconStyle</td>
    <td>String</td>
    <td>否</td>
    <td></td>
    <td>设置icon被选中的时候的样式</td>
  </tr>
  <tr>
    <td>compName</td>
    <td>String</td>
    <td>是</td>
    <td></td>
    <td>选择'usingComponents'中的组件进行对应，需要结合component动态组件进行渲染</td>
  </tr>
</table>

### 示例

```html
<template>
<view>
  <view style="height:{{viewPortHeight}}cpx;background-color:#42f4f4" >
    <component is="{{currentComp}}" ></component>
  </view>
  <c-tabbar 
    c-bind:onclick='handleTabbarClick' 
    c-model="{{currentComp}}"  
    tabbar="{{tabbar}}"
    ></c-tabbar>
</view>
  
</template>

<script>
import cml from "chameleon-api";
class Index   {

  data = {
    viewPortHeight:0,
    currentComp:'comp1',
    tabbar:{
      "tabbarStyle":"height:120cpx;background-color:#BAF6E8",//tabbar最外层的样式支持自定义
      "tabLineStyle":"background-color:#069ADC;height:2cpx;",//自定义tabline的高度和背景色
      "textStyle":"color:#3b3b3b", //文案默认style ,可以这里控制文案的大小，样式等
      "selectedTextStyle":"color:#3baaff",//文案被选择style
      // "position":"top", //tabbar的位置 top/bottom
      "useFixedLayout":true,  //是否通过fixed布局进行tabbar的布局
      "list":[
        { 
          "compName":"comp1",
          "text": "detail",
          "icon": require("../../assets/images/chameleon.png"),
        },
        {
          "compName":"comp2",
          "text": "home",
          "icon": require("../../assets/images/chameleon.png"),
        }
      ]
    },
  }
  methods = {
    handleTabbarClick(args){
      console.log('tabbar-info',args)
    }
  }
  created(res){
    cml.getSystemInfo().then(info => {
    //这里要减去tabbar的高度，默认是120cpx,如果tabbarStyle中设置了其他高度，则要减去对应的值；
      this.viewPortHeight = Number(info.viewportHeight) - 120;
    });
    if(res.comp){ //这里可以在传递的query中获取到想要激活的组件
      this.currentComp = res.comp;
    }
  }
}

export default new Index();
</script>

<style>

</style>

<script cml-type="json">
{
  "base": {
    "usingComponents": {
      "c-tabbar":"cml-ui/components/c-tabbar/c-tabbar",
      "comp1":"/components/demo-com/comp1",
      "comp2":"/components/demo-com/comp2"
    }
  }
}
</script>

```

<div style="display: flex;flex-direction: row;justify-content: space-around; align-items: flex-end;">
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/c-tabbar-wx.png" width="200px" height="100%" />
    <text style="color: #fda775;font-size: 24px;">wx</text>
  </div>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/c-tabbar-web.png" width="200px" height="100%"/>
    <text style="color: #fda775;font-size: 24px;">web</text>
  </div>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <img src="../../../assets/c-tabbar-weex.png" width="200px" height="100%"/>
    <text style="color: #fda775;font-size: 24px;">native</text>
  </div>
</div>

[查看完整示例](/example/c-tabbar.html)
