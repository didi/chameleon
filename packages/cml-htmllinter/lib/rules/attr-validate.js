var Issue = require('../issue');

module.exports = {
    name: 'attr-validate',
    on: ['tag'],
    desc: 'If set, attributes in a tag must be well-formed.'
};

module.exports.lint = function (ele, opts) {
    var attrRegex = /^\s*([^ "'>=\^]+(\s*=\s*(("[^"]*")|('[^']*')|([^ \t\n"']+)))?\s+)*$/,
        open = ele.open.slice(ele.name.length).replace(/\/$/,'');
    return attrRegex.test(open + ' ') ? [] : new Issue('E049', ele.openLineCol);
};
