var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'tag-bans',
    on: ['dom'],
    filter: ['tag', 'style', 'script'],
    desc: [
'The value of this option is a list of strings, each of which is a tag',
'name. Tags with any of the given names are disallowed.'
].join('\n'),
    process: proc.arrayOfStr
};

module.exports.lint = function (element, opts) {
    var format = opts[this.name];
    return format.indexOf(element.name) < 0
        ? []
        : new Issue('E061', element.openLineCol, { tag: element.name });
};
