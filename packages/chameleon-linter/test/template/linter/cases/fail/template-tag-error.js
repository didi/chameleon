module.exports = [{
  desc: 'should fail template tag check',
  input: {
    part: {
      line: 0,
      rawContent: '<template><template></template></template>',
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
      column: 0,
      msg: 'Each template can only have one group of template tags',
      token: 'template'
    }]
  }
}];
