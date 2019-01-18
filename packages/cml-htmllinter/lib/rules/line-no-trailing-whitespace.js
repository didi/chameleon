var Issue = require('../issue');

module.exports = {
    name: 'line-no-trailing-whitespace',
    on: ['line'],
    desc: 'If set, lines may not end with whitespace characters.'
};

module.exports.lint = function (line, opts) {
    var i = line.line.search(/[^\S\n\r]+[\n\r]*$/);
    return i === -1 ? [] : new Issue('E055', [line.row, i]);
};
