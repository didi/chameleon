var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'href-style',
    on: ['tag'],
    filter: ['a'],
    desc: [
'* "absolute": All `href` tags must use absolute URLs.',
'* "relative": All `href` tags must use relative URLs.',
'* `false`: No restriction.'
].join('\n'),
    process: proc.options(['absolute', 'relative'])
};

module.exports.lint = function (element, opts) {
    var format = opts[this.name],
        attr = element.attribs;

    // Should return an issue, since a without href is bad
    if (!attr.hasOwnProperty('href')) {
        return [];
    }

    // Link must be absolute iff specified format is absolute
    var isAbsolute = attr.href.value.search('://') !== -1;
    return (isAbsolute === (format === 'absolute'))
        ? []
        : new Issue('E009', element.openLineCol, { format: format });
};
