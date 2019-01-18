module.exports = [{
  desc: 'should fail built-in props check',
  input: {
    part: {
      line: 0,
      rawContent: "<template lang='cml'>\n<button close-type='{{shouldClose}}' c-bind:up='{{onUp}}'></button>\n</template>",
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
      column: 9,
      msg: 'component "button" doesn\'t have a defined property named "close-type"',
      token: 'button'
    }, {
      line: 2,
      column: 38,
      msg: 'component "button" doesn\'t have a defined event named "up"',
      token: 'button'
    }]
  }
}];
