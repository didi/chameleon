module.exports = [{
  desc: 'should pass template lang error',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='cml'></template>",
      params: {
        lang: ''
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: []
  }
}];
