const {vueToCml} = require('./process-template.js');
let source = `<view><input disable :id="value" v-bind:id="value" @click="handleClick" v-on:click="handleClick" /><input style="width:100px;" class="cls1" :class="true ? 'cls2':'cls3'" /></view>`
const result = vueToCml(source);
console.log('vuetocml', source)
