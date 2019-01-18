module.exports = [{
  desc: 'should pass usingComponents check',
  input: {
    part: {
      line: 0,
      rawContent: '<template><c-geerup></c-geerup></template>',
      params: {
        lang: ''
      }
    },
    jsonAst: {
      base: {
        usingComponents: {
          'c-geerup': 'path/to/geerup'
        }
      }
    }
  },
  output: {
    start: 0,
    messages: []
  }
}];
