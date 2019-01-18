module.exports = [{
  desc: 'should fail origin component skip emebed rule: excludes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<origin-scroller>\n<textarea><text><view></view></text></textarea>\n</origin-scroller>\n</template>',
      params: {
        lang: ''
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 3,
      column: 11,
      msg: 'tag "text" can only have "text" as it\'s direct children or descendant(s), therefor tag "view" is not allowed as it\'s direct children or descendant(s)',
      token: ''
    }]
  }
}];
