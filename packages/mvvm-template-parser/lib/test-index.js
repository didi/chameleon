const {vueToCml} = require('./process-template.js');
let source = `<view class="demo-com">
<view :id="value" v-bind:name="name">index-handleTouchStart</view>
<view @click="handleClick" v-on:click="handleClick" >index-handletap</view>
<view @click.stop="handleClick" v-on:click.stop="handleClick">index-handletap</view>
</view>`
const result = vueToCml(source);
console.log('vuetocml',source)
