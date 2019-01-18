/*
 * Some options are used directly by the linter and do not control any
 * rules. Since we still want to process the values for these options
 * and generate documentation for them, we use a dummy rule which is
 * never called to contain them. It will be imported with the other
 * rules.
 */
var lodash = require('lodash'),
    proc = require('../process_option');

module.exports = {
    name: 'free-options',
    options: [{
        name: 'maxerr',
        desc: [
'A nonnegative integer, or `false`. If it is a positive integer, limit',
'output to at most that many issues.'
].join('\n'),
        process: function (i) {
            return lodash.isInteger(i) ? (i > 0 && i) : undefined;
        }
    }, {
        name: 'raw-ignore-regex',
        desc: [
'A string giving a regular expression, a RegExp object, or `false`. If',
'set, text matching the given regular expression is removed before any',
'parsing or linting occurs.',
'This option cannot be configured in-line, but it can be set to a value',
'such as `/\\<\\!-- htmllint ignore --\\>[^]*?\\<\\!-- htmllint unignore --\\>/`',
'to allow some control using comment tags.'
].join('\n'),
        process: proc.regexGlobal
    }]
};

module.exports.options.forEach(function (option) { option.rules = []; });
