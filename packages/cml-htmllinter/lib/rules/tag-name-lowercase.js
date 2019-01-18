var Issue = require('../issue');

module.exports = {
    name: 'tag-name-lowercase',
    on: ['tag'],
    desc: [
'If set, tag names must be lowercase.',
'Only the opening tag is checked; mismatches between open and close tags',
'are checked by `tag-name-match`.'
].join('\n')
};

module.exports.lint = function (element, opts) {
    return /[A-Z]/.test(element.name)
        ? new Issue('E017', element.openLineCol)
        : [];
};
