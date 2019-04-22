# 内置API标准

chameleon-api是CML内置API库，说明参见：[API接口文档](https://cml.js.org/doc/api/api.html)。用户需要利用[多态接口扩展](../framework/polymorphism/api_extend.md)在目标端对每一个内置api的接口进行实现，要保证接口参数的一致。



### 扩展新端API（以头条小程序为例，假设端扩展标识为：toutiao）:
``` js
// 引入官方标准interface文件
<include src="chameleon-api/src/interfaces/alert/index.interface"></include>

// 扩展实现新端（以头条小程序为例，假设端扩展标识为：toutiao）
<script cml-type="toutiao">
class Method implements uiInterface {
  alert(opt, successCallBack, failCallBack) {
    // 根据头条小程序实现alert弹窗
    let { message, confirmTitle} = opt;
    tt.showModal({
      showCancel: false,
      title: '',
      content: message,
      confirmText: confirmTitle,
      success() {
        successCallBack(confirmTitle);
      },
      fail() {
        failCallBack(confirmTitle);
      }
    });
  }
}

export default new Method();
</script>

// 想覆写某已有端的方法实现（以微信小程序为例）
<script cml-type="wx">
class Method implements uiInterface {
  alert(opt, successCallBack, failCallBack) {
    // 按你的想法重新实现
  }
}
export default new Method();
</script>
```

需要注意的是，为了方便结合异步流程控制如async、await等进行操作，chameleon官方提供的api接口均以promise形式进行返回。所以你可以在外层使用js文件进行包装，将interface实现进行promise化或进行其他操作（如传入默认值）。

``` js
import ui from './index.interface';

export default function alert(opt) {
  let { message = '操作成功', confirmTitle = '我知道了' } = opt; 
  return new Promise((resolve, reject) => {
    ui.alert({ message, confirmTitle }, resolve, reject)
  }); 
}
```