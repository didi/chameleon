var htmlparser2 = require('htmlparser2'),
    util = require('util'),
    knife = require('../knife');
var DomHandler = htmlparser2.DomHandler,
    DomBuilder = function () {
        this.parser = null;
        this.attributes = {};
        this.attribArr = [];
        this.dupes = [];
        DomHandler.apply(this, Array.prototype.slice.call(arguments));
    };
module.exports = DomBuilder;

util.inherits(DomBuilder, DomHandler);

// NOTE: this must be called before parsing begins
DomBuilder.prototype.initialize = function (parser) {
    this.parser = parser;
};

DomBuilder.prototype.start = function (htmlText) {
    this.htmlText = htmlText;
    this.lineColFunc = knife.getLineColFunc(htmlText);
    // When a tag has no close, startIndex is too large by 3 for the
    // next calls to onopentag and _addDomElement. Keep track of this.
    this.wasClosed = true;
};

DomBuilder.prototype.onerror = function (error) {
    // TODO: actually bubble this up or queue errors
    throw error;
};

DomBuilder.prototype.onattribute = function (name, value) {
    if (!this.attributes[name]) {
        this.attributes[name] = {
            value: value
        };
        this.attribArr.push(name);
    } else {
        this.dupes.push(name);
    }
};

/*eslint-disable no-underscore-dangle*/
DomBuilder.prototype.onopentag = function (name, attribs) {
    DomHandler.prototype.onopentag.call(this, name, attribs);

    var ele = this._tagStack[this._tagStack.length - 1];
    ele.openIndex = this.parser.startIndex;
    if (!this.wasClosed) { ele.openIndex -= 3; }
    this.wasClosed = true;
    ele.open = this.htmlText.slice(ele.openIndex + 1, this.parser.endIndex);
    ele.openLineCol = this.lineColFunc(ele.openIndex);
    // remove duplicate data
    delete ele.lineCol;

    ele.attribs = this.attributes;
    //ele.attribsArr = this.attribArr;
    knife.inputIndices(ele.attribs, ele.open, ele.openIndex);

    this.attribArr
        .sort(function (a, b) {
            return ele.attribs[a].nameIndex - ele.attribs[b].nameIndex;
        })
        .forEach(function (attrib) {
            var a = ele.attribs[attrib];
            a.nameLineCol = this.lineColFunc(a.nameIndex);
            a.valueLineCol = this.lineColFunc(a.valueIndex);
        }, this);

    this.attribArr = [];
    this.attributes = {};

    ele.dupes = this.dupes;
    this.dupes = [];
};

DomBuilder.prototype.onclosetag = function () {
    var ele = this._tagStack[this._tagStack.length - 1];
    //&& !knife.isVoidElement(ele.name)
    if (ele) {
        // Mercifully, no whitespace is allowed between < and /
        this.wasClosed = this.htmlText[this.parser.startIndex + 1] === '/';
        ele.close = this.wasClosed
            ? this.htmlText.slice(this.parser.startIndex + 2, this.parser.endIndex)
            : '';
        ele.closeIndex = this.parser.startIndex;
        if (!this.wasClosed && ele.closeIndex == ele.openIndex) {
            ele.closeIndex += ele.open.length + 1;
            this.wasClosed = true;
        }
        ele.closeLineCol = this.lineColFunc(ele.closeIndex);
    }

    DomHandler.prototype.onclosetag.call(this);
};

DomBuilder.prototype.onprocessinginstruction = function (name, data) {
    // htmlparser2 doesn't normally update the position when processing
    // declarations or processing directives (<!doctype ...> or <?...> elements)
    this.parser._updatePosition(2);
    DomHandler.prototype.onprocessinginstruction.call(this, name, data);
};

DomBuilder.prototype._addDomElement = function (ele) {
    if (!this.parser) {
        // TODO: rewrite error msg
        throw new Error('stop being a bone head >.<');
    }
    ele.index = this.parser.startIndex;
    if (!this.wasClosed) { ele.index -= 3; }
    ele.lineCol = this.lineColFunc(ele.index);
    DomHandler.prototype._addDomElement.call(this, ele);
};
/*eslint-enable no-underscore-dangle*/
