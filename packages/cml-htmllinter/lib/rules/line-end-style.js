var Issue = require('../issue');

module.exports = {
    name: 'line-end-style',
    on: ['line'],
    options: [{
        desc: [
'Line endings must conform to the given style.',
'* "lf": Unix style, ending in LF.',
'* "crlf": Windows style, ending in CRLF.',
'* "cr": Ending in CR.',
'* `false`: No restriction.'
].join('\n'),
        process: function (name) {
            var regex = {
                cr:   /(^|[^\n\r])\r$/,
                lf:   /(^|[^\n\r])\n$/,
                crlf: /(^|[^\n\r])\r\n$/
            }[name];
            return regex ? { regex: regex, name: name } : undefined;
        }
    }]
};

module.exports.lint = function (line, opts) {
    var format = opts[this.name];

    if (format.regex.test(line.line)) {
        return [];
    }

    var len = line.line.length,
        pos = [line.row, len];

    if (line.line[len - 2] === '\r') {
        pos[1] -= 1;
    }

    return new Issue('E015', pos, { format: format.name });
};
