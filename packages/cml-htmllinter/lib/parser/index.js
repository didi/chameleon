var htmlparser2 = require('htmlparser2');
var DomBuilder = require('./dom_builder'),
    knife = require('../knife');

var Parser = function () {
    this.domBuilder = new DomBuilder();

    // more information for these options can be found at:
    // https://github.com/fb55/htmlparser2/wiki/Parser-options
    this.parser = new htmlparser2.Parser(this.domBuilder, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
        recognizeCDATA: false,
        recognizeSelfClosing: false,
        xmlMode: true
    });
    this.domBuilder.initialize(this.parser);
};
module.exports = Parser;

Parser.prototype.parse = function (htmlText) {
    var dom = null;

    // expose the raw html text to the dom builder and initialize
    this.domBuilder.start(htmlText);

    try {
        // write to the parser
        this.parser.write(htmlText);
        this.parser.end();
    } finally {
        // htmlparser2 is insane >.>
        this.parser.startIndex = 0;
        this.parser.endIndex = -1;

        // store the dom and reset the parser/handler
        dom = this.domBuilder.dom;
        this.parser.reset();
    }

    return dom;
};
