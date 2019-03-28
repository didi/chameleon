# c-tabbar

---

### 示例
利用component is动态渲染某个组件

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

