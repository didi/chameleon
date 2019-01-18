module.exports = [{
  desc: 'should fail usingComponents check',
  input: {
    part: {
      line: 0,
      rawContent: '<template><c-geerup></c-geerup></template>',
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
      column: 11,
      msg: 'tag: "c-geerup" is either not allowed in this template or not referenced as a component',
      token: 'c-geerup'
    }]
  }
}];
