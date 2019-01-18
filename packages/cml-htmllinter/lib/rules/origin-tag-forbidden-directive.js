var Issue = require('../issue'),
    tools = require('../tools'),
    proc = require('../process_option');

module.exports = {
    name: 'origin-tag-forbidden-directive',
    on: ['origin-tag'],
    options: [{
        name: 'origin-tag-forbiden-directive-regex',
        desc: 'If set, all directives that match this regex is considered as invalid directives.',
        process: proc.regex,
    }]
};


module.exports.lint = function(element, opts) {
    let invalidDirectiveRegex = opts['origin-tag-forbiden-directive-regex'], issues = [];
    if (invalidDirectiveRegex) {
        Object.keys(element.attribs).forEach((attrName) => {
            invalidDirectiveRegex.test(attrName) && issues.push(new Issue(tools.isOriginComponent(element) ? 'E069' : 'E070', element.attribs[attrName].nameLineCol, {
                name: element.name,
                directive: attrName.split(':')[0]
            }));
        });
    }
    return issues;
}
