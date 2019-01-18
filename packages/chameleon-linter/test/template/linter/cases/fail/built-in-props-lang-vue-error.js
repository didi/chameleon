module.exports = [{
  desc: 'should fail built-in props check with vue-like template language',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='vue'>\n<button v-bind:close-type='{{shouldClose}}' @up='{{onUp}}'></button>\n</template>",
      params: {
        lang: 'vue'
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 2,
      column: 9,
      msg: 'component "button" doesn\'t have a defined property named "close-type"',
      token: 'button'
    }, {
      line: 2,
      column: 45,
      msg: 'component "button" doesn\'t have a defined event named "up"',
      token: 'button'
    }]
  }
}];
