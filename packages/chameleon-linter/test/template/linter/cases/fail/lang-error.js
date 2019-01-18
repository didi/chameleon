module.exports = [{
  desc: 'should fail template lang error',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='web'></template>",
      params: {
        lang: ''
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 1,
      column: 16,
      msg: 'the tag template lang attribute: "web" is not valid',
      token: ''
    }]
  }
}];
