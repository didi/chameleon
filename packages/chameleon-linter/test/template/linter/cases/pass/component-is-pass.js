module.exports = [{
  desc: 'should pass component is attribute check',
  input: {
    part: {
      line: 0,
      rawContent: ["<template lang='vue",
        "<component :is='currentComp' class='comp-normal' :class='comp-directive'></button>",
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
