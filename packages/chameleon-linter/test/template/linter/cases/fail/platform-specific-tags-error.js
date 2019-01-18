module.exports = [{
  desc: 'should fail platform specific tags check',
  input: {
    part: {
      line: 0,
      rawContent: '<template>\n<scroll-view></scroll-view>\n</template>',
      platformType: 'cml',
      params: {
        lang: 'cml'
      }
    },
    jsonAst: {}
  },
  output: {
    start: 0,
    messages: [{
      line: 2,
      column: 1,
      msg: 'tag: "scroll-view" is either not allowed in this template or not referenced as a component',
      token: 'scroll-view'
    }]
  }
}];
