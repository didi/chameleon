module.exports = [{
  desc: 'should fail directive check with cml template language',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='cml'>\n<view v-if='{{true}}' v-bind:onclick='onClick'></view>\n</template>",
      params: {
        lang: 'cml'
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 2,
      column: 7,
      msg: 'directive "v-if" is not allowed to be used in this template, as the template language is set to "cml"',
      token: 'v-if'
    }, {
      line: 2,
      column: 23,
      msg: 'directive "v-bind" is not allowed to be used in this template, as the template language is set to "cml"',
      token: 'v-bind'
    }]
  }
}];
