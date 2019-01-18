var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'doctype-first',
    on: ['dom'],
    desc: [
'* `true`: The doctype (`<!DOCTYPE ... >`) must be the first element in',
'    the file, excluding comments and whitespace.',
'* "smart": If a `head` tag is present in the document, then the doctype',
'    must come first.',
'* `false`: No restriction.'
].join('\n'),
    process: proc.boolPlus('smart'),

    passedFirst: false
};

module.exports.end = function () {
    this.passedFirst = false;
};

module.exports.lint = function (element, opts) {
    var option = opts[this.name];

    if (this.passedFirst ||
        element.type === 'comment' || isWhitespace(element)) {
        return [];
    }
    this.passedFirst = true;

    if (element.type === 'directive' &&
        element.name.toUpperCase() === '!DOCTYPE') {
        return [];
    }

    // If the option is 'smart', fail only if a head tag is present.
    if (option === 'smart' &&
        !(element.type === 'tag' &&
          element.name.toLowerCase() === 'head')) {
        return [];
    }

    return new Issue('E007', element.openLineCol || element.lineCol);
};

function isWhitespace(element) {
    return element.type === 'text' && /^[ \t\n\f\r]*$/.test(element.data);
};
