let content = `
@media cml-type(wx) {
  body {
    color: red;
  }
}

@media cml-type(weex) {
  body {
    color: blue;
  }
}

@media cml-type(web) {
  body {
    color: green;
  }
}

@media cml-type(web,wx) {
  body {
    color: orange;
  }
}

.border-scale(@color, @border-radius: 2px,
  @border-width: 1px 1px 1px 1px) {
&:after {
content: " ";
position: absolute;
top: 0;
left: 0;
width: 200%;
height: 200%;
border: 1px solid @color;
border-width: @border-width;
border-radius: 2 * @border-radius;
transform-origin: 0% 0%;
-webkit-transform-origin: 0% 0%;
-webkit-transform: scale(0.5, 0.5);
transform: scale(0.5, 0.5);
pointer-events: none;
-webkit-box-sizing: border-box;
box-sizing: border-box;
}
}
`
const expect = require('chai').expect;
let mediaParse = require('../../parser/media.js');


describe('parse/media.js', function() {
  it('cmltype wx', function() {
    let result = mediaParse(content, 'wx');
    console.log(result)
    expect(/red/.test(result)).to.be.ok;
    expect(/blue/.test(result)).to.equals(false);
  })
})


