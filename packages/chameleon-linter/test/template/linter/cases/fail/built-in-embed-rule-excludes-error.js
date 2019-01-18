module.exports = [{
  desc: 'should fail built-in components emebed rule: excludes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<scroller>\n<textarea></textarea>\n</scroller>\n</template>',
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
      msg: 'tag "scroller" can not have  "textarea" as it\'s direct children or descendant(s), and element in this list: "textarea or video" is forbidden as well',
      token: ''
    }]
  }
}];
