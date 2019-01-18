module.exports = [{
  desc: 'should fail built-in components emebed rule: includes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<video>\n<text></text><textarea></textarea>\n</video>\n</template>',
      params: {
        lang: ''
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 2,
      column: 1,
      msg: 'tag "video" can only have "text" as it\'s direct children or descendant(s), therefor tag "textarea" is not allowed as it\'s direct children or descendant(s)',
      token: ''
    }]
  }
}];
