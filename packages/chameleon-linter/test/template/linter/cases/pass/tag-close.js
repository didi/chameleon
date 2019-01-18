module.exports = [{
  desc: 'should pass tag-close check',
  input: {
    part: {
      line: 0,
      rawContent: ["<template lang='cml'>",
        '<input></input>',
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
