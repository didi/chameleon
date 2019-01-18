var knife = require('../knife');

module.exports = {
    name: 'attr',
    on: ['tag']
};

module.exports.lint = function(element, opts) {
    var subs = this.subscribers,
        as = element.attribs,
        issues = [];

    Object.keys(as).forEach(function(name) {
        var a = as[name];
        a.name = name;

        var matcher = knife.matchFilter.bind(knife, name);
        var s = subs.filter(matcher);

        issues = issues.concat(knife.applyRules(s, a, opts));
    });

    return issues;
};
