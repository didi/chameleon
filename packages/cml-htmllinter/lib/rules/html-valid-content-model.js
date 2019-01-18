var Issue = require('../issue');

module.exports = {
    name: 'html-valid-content-model',
    on: ['tag'],
    filter: ['html'],
    desc: [
'If set, the content-model of the `html` element will be enforced:',
'at most one `head` and one `body` tag may appear, in that order.',
'No other tags are allowed.'
].join('\n')
};

module.exports.lint = function (elt, opts) {
    var output = [],
        has_head = false,
        has_body = false;

    elt.children.forEach(function (e) {
        if (e.type !== 'tag') {
            return;
        }
        // E044: Illegal element
        // E045: Duplicated tag
        // E046: Head and body tags out of order
        var err;
        if (e.name === 'head') {
            err = has_body ? 'E046' : has_head ? 'E045' : false;
            has_head = true;
        } else if (e.name === 'body') {
            err = has_body ? 'E045' : false;
            has_body = true;
        } else {
            err = 'E044';
        }
        if (err) {
            output.push(new Issue(err, e.openLineCol));
        }
    });

    return output;
};
