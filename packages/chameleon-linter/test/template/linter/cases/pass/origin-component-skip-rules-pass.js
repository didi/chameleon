module.exports = [{
  desc: 'origin component passes emebed rule: excludes check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<scroller origin>\n<textarea></textarea>\n</scroller>\n</template>',
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
