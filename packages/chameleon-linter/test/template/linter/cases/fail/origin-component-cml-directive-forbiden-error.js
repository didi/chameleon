module.exports = [{
  desc: 'should fail chamelon built-in directives check for origin components',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='cml'>\n<origin-view c-bind:onclick='onClick'></origin-view>\n</template>",
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
      column: 14,
      msg: 'tag "origin-view" is prefixed with "origin-" directive, so it\'s not allowed to use a chameleon built-in directive:"c-bind"',
      token: 'origin-view'
    }]
  }
}];
