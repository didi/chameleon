var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'tag-white-list',
    on: ['tag'],
    desc: [
'The value of this option is a list of strings, each of which is a tag',
'name. Tags with any of the given names are disallowed.'
].join('\n'),
    options:[{
        name: 'tag-only-allowed-names',
        desc: 'If set, only tags in this list are allowed.',
        process: proc.arrayOfStr
    }]
};

module.exports.lint = function (element, opts) {
    var allowedNames = opts['tag-only-allowed-names'];
    if (!allowedNames || allowedNames.length == 0) {
        return [];
    }
    return allowedNames.indexOf(element.name) < 0
        ? new Issue('E061', element.openLineCol, { tag: element.name }): [];
};