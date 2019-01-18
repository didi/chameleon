#!/usr/bin/env node

// Generate the wiki Options.md page and send to stdout.

var htmllint = require('../lib'),
    presets = require('../lib/presets');

var options = htmllint.defaultLinter.rules.options,
    def = presets.presets.default;

var preamble = [
'Valid option values are listed in bullet points, or explicitly specified.',
'If no values are specified, then the option is boolean and has only the',
'valid values `true` and `false`. If no default is specified, the default',
'value is `true`.',
'',
'The value `false` is valid for any option. If used, that option does not',
'provide restrictions on the html input.',
'',
'The following values may be used for format specifiers. A format',
'specifier is a requirement on the form of a string.',
'* "lowercase": Consists of lowercase letters.',
'* "underscore": Lowercase and underscore-separated.',
'* "dash": Lowercase and separated by hyphens.',
'* "camel": camelCase (or CamelCase).',
'* "bem": The BEM (block, element, modifier) syntax.',
'* An arbitrary Javascript RegExp object.',
'* A string matching Javascript\'s RegExp format (like \'/^[a-z]+$/g\').',
'',
'Each of the named formats allows digits to be used in addition to letters',
'after the first letter in each word. See `lib/process_option.js`',
'for the actual regular expressions attached to these options.'
].join('\n');

function printVal(v) {
    if (v === true) { return '' };
    var f;
    switch (typeof v) {
        case 'string': f = '"' + v + '"'; break;
        case 'number': f = v; break;
        case 'object': f = '`[\'' + v.join('\', \'') + '\']`'; break;
        default:       f = '`' + v + '`'; break;
    }
    return '\n\nDefault: ' + f;
}

var out = Object.keys(options).sort().map(function(name){
    return '## ' + name
         + printVal(def[name])
         + '\n\n' + options[name].desc;
}).join('\n\n');

console.log(preamble + '\n\n\n' + out);
