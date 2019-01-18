module.exports = [
  {
    desc: 'should pass when set to false',
    input: '-----------------------------------------------------------------------------------',
    opts: { 'line-max-len': false },
    output: 0
  }, {
    desc: 'should fail when given a non-number',
    input: '',
    opts: { 'line-max-len': 'its-a-string' },
    output: 1
  }, {
    desc: 'should fail when given a negative number',
    input: '1234',
    opts: { 'line-max-len': -5 },
    output: 1
  }, {
    desc: 'should pass when line length not exceeds the maximum value',
    input: '1234',
    opts: { 'line-max-len': 5 },
    output: 0
  }, {
    desc: 'should pass when line length equals to the maximum value',
    input: '12345',
    opts: { 'line-max-len': 5 },
    output: 0
  }, {
    desc: 'should ignore line breaks',
    input: '12345\r\n12345\n',
    opts: { 'line-max-len': 5 },
    output: 0
  }, {
    desc: 'should fail when line length exceeds the maximum value',
    input: '123456',
    opts: { 'line-max-len': 5 },
    output: 1
  }, {
    desc: 'should pass when line length matches ignore-regex',
    input: '<a href="http://www.google.com">12345</a>',
    opts: { 'line-max-len': 5, 'line-max-len-ignore-regex': 'href' },
    output: 0
  }
];
