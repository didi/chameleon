module.exports = [{
  desc: 'should pass built-in components emebed rule: includes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<video>\n<text></text>\n</video>\n</template>',
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
