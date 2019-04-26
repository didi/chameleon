let templateParser = require('../templateParser');
let content = `
<view>
  <view c-for="{{array}}">
  </view>  
  <view c-if="{{condition}}"> True </view>
  <origin-button></origin-button>
</view>
`

let result = templateParser(content);
console.log(result)

