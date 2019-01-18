var knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
    name: 'directive-cml',
    on: ['tag'],
    options: [{
      name: 'cml-directives',
      desc: 'This option holds all the directives that Chameleon framework has.',
      process: proc.arrayOfStr
    }]
};

module.exports.lint = function(element, opts) {
    var subs = this.subscribers,
        as = element.attribs,
        issues = [];

    Object.keys(as).filter(function(name) {
      return ~opts['cml-directives'].indexOf(name);
    }).forEach(function(name) {
        var a = as[name];
        a.name = name;

        var matcher = knife.matchFilter.bind(knife, name);
        var s = subs.filter(matcher);

        issues = issues.concat(knife.applyRules(s, a, opts));
    });

    return issues;
};
