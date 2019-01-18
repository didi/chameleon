var Issue = require('../issue');
var regUnsafe = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

module.exports = {
    name: 'attr-no-unsafe-char',
    on: ['attr'],
    desc: [
'If set, unsafe characters may not be used in attribute values.',
'The unsafe characters are those whose unicode values lie in the ranges',
'0000-0009, 000b-000c, 000e-001f, 007f-009f, 00ad, 0600-0604, 070f,',
'17b4, 17b5, 200c-200f, 2028-202f, 2060-206f, feff, fff0-ffff.'
].join('\n')
};

module.exports.lint = function (attr, opts) {
    return regUnsafe.test(attr.value)
        ? new Issue('E004', attr.valueLineCol)
        : [];
};
