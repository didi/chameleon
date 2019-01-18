var lodash = require('lodash'),
    Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'attr-order',
    on: ['tag'],
    desc: [
'A list of attribute names, or `false`. If set, any attributes present in',
'the list must be ordered as they are in the list.'
].join('\n'),
    process: function (strs) {
        if (!lodash.isArray(strs)) return undefined;
        for (var i = 0; i < strs.length; i++) {
            strs[i] = proc.getRegExp(strs[i], function(a) { return a; });
            if (!strs[i]) return undefined;
        }
        return strs;
    }
};

module.exports.lint = function (element, opts) {
    var order = opts[this.name],
        attrs = element.attribs,
        lastpos = 0,
        lastname,
        issues = [],
        matched = {};
    order.forEach(function(name) {
        if (lodash.isRegExp(name)) {
            var prevpos = lastpos,
                prevname = lastname;
            Object.keys(attrs).forEach(function(n) {
                if (matched[n] || !name.test(n)) return;
                var a = attrs[n];
                matched[n] = true;
                var pos = a.nameIndex;
                n += ' (' + name + ')'; // For error output
                if (pos > lastpos) {
                    lastpos = pos;
                    lastname = n;
                // Check only fails if keys are not ordered by insertion
                /* istanbul ignore else */
                } else if (pos < prevpos) {
                    issues.push(new Issue('E043', a.nameLineCol,
                        { attribute: prevname, previous: n }));
                }
            });
        } else {
            if (!attrs.hasOwnProperty(name)) return;
            var a = attrs[name];
            matched[name] = true;
            var pos = a.nameIndex;
            if (pos > lastpos) {
                lastpos = pos;
                lastname = name;
            } else {
                issues.push(new Issue('E043', a.nameLineCol,
                    { attribute: lastname, previous: name }));
            }
        }
    });

    return issues;
};
