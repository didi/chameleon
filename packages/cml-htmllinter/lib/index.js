var lodash = require('lodash'),
    Linter = require('./linter');

/* istanbul ignore next */
Object.values = Object.values || function (obj) {
    return Object.keys(obj)
        .reduce(function (values, key) {
            values.push(obj[key]);
            return values;
        }, []);
};

/**
 * The htmllint namespace.
 * @namespace
 */
var htmllint = function () {
    var linter = htmllint.defaultLinter;

    return linter.lint.apply(linter, arguments);
};

module.exports = htmllint;

htmllint.Linter = Linter;
htmllint.rules = require('./rules');
htmllint.messages = require('./messages');
htmllint.defaultLinter = new Linter(htmllint.rules);

htmllint.use = function (plugins) {
    plugins.forEach(function (plugin) {
        if (lodash.isString(plugin)) {
            plugin = require(plugin);
        }

        htmllint.defaultLinter.use(plugin);
    });
};
