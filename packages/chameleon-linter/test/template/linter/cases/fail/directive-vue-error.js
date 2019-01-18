module.exports = [{
  desc: 'should fail directive check with vue-like template language',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='vue'>\n<view c-if='{{true}}' c-bind:onclick='onClick'></view>\n</template>",
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
      column: 7,
      msg: 'directive "c-if" is not allowed to be used in this template, as the template language is set to "vue"',
      token: 'c-if'
    }, {
      line: 2,
      column: 23,
      msg: 'directive "c-bind" is not allowed to be used in this template, as the template language is set to "vue"',
      token: 'c-bind'
    }]
  }
}];
