const styleParser = require('../styleParser');

let content = `
.test {
  font-size: 24cpx;
  lines: 1;
}
`

let result = styleParser(content);
console.log(result);