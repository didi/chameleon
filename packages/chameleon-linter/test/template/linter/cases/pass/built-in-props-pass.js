module.exports = [{
  desc: 'should pass built-in props check',
  input: {
    part: {
      line: 0,
      rawContent: ["<template lang='cml'>",
        "<button text='{{shouldClose}}' size='medium' type='white' disabled='{{true}}' btn-style='{{btnStyle}}' text-style='{{textStyle}}' disabled-style='{{disabledStyle}}' c-bind:onclick='onClick'></button>",
        '</template>'].join('\n'),
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
