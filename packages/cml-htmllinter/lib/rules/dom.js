var lodash = require('lodash'),
    knife = require('../knife');

module.exports = {
    name: 'dom'
};

module.exports.lint = function(dom, opts, inlineConfigs) {
    var subs = this.subscribers;

    /*
     * Reset our inline configuration object to be what opts is.
     * Does a deep copy so as to not change opts in the future.
     */
    inlineConfigs.reset(opts);

    var getIssues = function (element) {
        var matcher = knife.matchFilter.bind(knife, element.type);

        // fast-forwards inlineConfig.current to whatever it should be at this index.
        inlineConfigs.getOptsAtIndex(element.index);

        var s = subs.filter(matcher);
        var ret = knife.applyRules(s, element, inlineConfigs.current);

        if (element.children && element.children.length > 0) {
            element.children.forEach(function (child) {
                ret = ret.concat(getIssues(child));
            });
        }
        return ret;
    };

    var issues = dom.length ? dom.map(getIssues) : [];
    return lodash.flattenDeep(issues);
};
