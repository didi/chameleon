module.exports = [{
  desc: 'should pass platform specific tags check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<scroll-view></scroll-view>\n</template>',
      platformType: 'wx',
      params: {
        lang: 'cml'
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: []
  }
}];
