module.exports = [{
  desc: 'should pass built-in components emebed rule: excludes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<scroller>\n<text></text>\n</scroller>\n</template>',
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
