# richtext

-------

### 示例
```html
<template>
<view class="container">
  <richtext rich-data="{{richData}}" style="width: 200cpx; height: 100cpx;"></richtext>
</view>
</template>
<script>
class Richtext {
  data = {
    richData: {
      message: '这是一段富文本',
      rich_message: [
        {"color": "#666666",
        "font_size": 28,
        "start": 0,
        "end": 3},
        {
          "color": "#fc9153",
          "font_size": 28,
          "start": 4,
          "end": 6
        }
      ]
    }
  }
}

export default new Richtext();
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<script cml-type="json">
{
  "base": {}
}
</script>
```
