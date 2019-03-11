const parseCss = require('../../parser/weex.js');
const expect = require('chai').expect;

let source = `body {width:75cpx;border:1cpx solid red;}`;


describe('parse/weex', function() {
  it('if options.rem to be truthy ,parse px to rem,else multiply the px value by options.scale', function() {

    let result = parseCss(source);// body {width:1rem;}
    console.log(result);
    expect(/border\-style/.test(result)).to.be.ok;
    expect(/border\-width/.test(result)).to.be.ok;
    expect(/border\-color/.test(result)).to.be.ok;
    expect(/75px/.test(result)).to.be.ok;
  })

})

describe('parse/weex', function() {
  let css = `
  .a {
    border: solid 1px red;
  }
  .b {
    border: dotted 0 rgb(255,255, 255);
  }
  .c {
    border-left: solid 1px #ccc;
  }
  
`;

  it('border', function() {

    let result = parseCss(css);// body {width:1rem;}
    console.log(result);
    expect(result).to.equal(`.a {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #ff0000;\n}\n\n.b {\n  border-style: dotted;\n  border-width: 0;\n  border-color: rgb(255,255,255);\n}\n\n.c {\n  border-left-style: solid;\n  border-left-width: 1px;\n  border-left-color: #ccc;\n}`);
  })

})


describe('parse/weex', function() {
  let css = `
  .a {
    margin-left: 10px;
  }
  .b {
    margin: 10px;
  }
  .c {
    margin: 10px 20px;
  }
  .d {
    margin: 10px 20px 10px;
  }
  .e {
    margin: 10px 20px 5px 15px;
  }
`;

  it('margin', function() {

    let result = parseCss(css);// body {width:1rem;}
    console.log(result);
    expect(result).to.equal(`.a {\n  margin-left: 10px;\n}\n\n.b {\n  margin-top: 10px;\n  margin-right: 10px;\n  margin-bottom: 10px;\n  margin-left: 10px;\n}\n\n.c {\n  margin-top: 10px;\n  margin-right: 20px;\n  margin-bottom: 10px;\n  margin-left: 20px;\n}\n\n.d {\n  margin-top: 10px;\n  margin-right: 20px;\n  margin-bottom: 10px;\n  margin-left: 20px;\n}\n\n.e {\n  margin-top: 10px;\n  margin-right: 20px;\n  margin-bottom: 5px;\n  margin-left: 15px;\n}`);
  })

})


describe('parse/weex', function() {
  let css = `
    .a {
      padding-left: 10px;
    }
    .b {
      padding: 10px;
    }
  `;
  it('padding', function() {
    let result = parseCss(css);// body {width:1rem;}
    console.log(result);
    expect(result).to.equal(`.a {\n  padding-left: 10px;\n}\n\n.b {\n  padding-top: 10px;\n  padding-right: 10px;\n  padding-bottom: 10px;\n  padding-left: 10px;\n}`);
  })

})


describe('parse/weex', function() {
  let css = `
  .a {
    background: #ccc
                  url(img.png)
                  no-repeat
                  scroll
                  center center / 50%
                  content-box border-box;

  }
  .b {
    background: url(img.png) #ccc;
  }
`;

  it('background', function() {
    let result = parseCss(css);// body {width:1rem;}
    console.log(result);
    expect(result).to.equal(`.a {\n  background-color: #ccc;\n  background-position: center center;\n  background-size: 50%;\n  background-repeat: no-repeat;\n  background-origin: content-box;\n  background-clip: border-box;\n  background-attachment: scroll;\n  background-image: url(img.png);\n}\n\n.b {\n  background-color: #ccc;\n  background-image: url(img.png);\n}`);
  })

})
