module.exports = [{
  desc: 'should pass built-in props check with vue-like template language',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='vue'>\n<button :text='{{shouldClose}}' :size='medium' :type='white' :disabled='{{true}}' :btn-style='{{btnStyle}}' :text-style='{{textStyle}}' :disabled-style='{{disabledStyle}}' v-on:onclick='onClick'></button>\n</template>",
      params: {
        lang: 'vue'
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: []
  }
}];
