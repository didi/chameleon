var lodash = require('lodash');
var hooks = require('../hook');

function addRuleToIssue(issue, ruleName) {

    if (Array.isArray(issue)) {
        issue.forEach(function (issue) {
            addRuleToIssue(issue, ruleName);
        });
    } else {
        issue.rule = issue.rule || ruleName;
    }

}


function runHooks(rules, element, opts) {
    let hookResults = {}, ruleHooks = [];
    rules.forEach((rule) => {
        rule.hooks && (ruleHooks = lodash.union(ruleHooks, rule.hooks));
    });
    if (Array.isArray(ruleHooks) && ruleHooks.length) {
        ruleHooks.forEach((hookName) => {
            let matchHook = hooks[hookName];
            if (matchHook) {
                hookResults[hookName] = matchHook.run(element, opts);
                hookResults[hookName].push(matchHook.breakOff);
            }
        });
    }

    return {
        isRulebreakOff: (rule) => {
            let breakOff = false;
            rule.hooks && rule.hooks.forEach((hook) => {
                !breakOff && (breakOff = hookResults[hook] && hookResults[hook][2] && hookResults[hook][0]);
            });
            return breakOff;
        },
        gethookResults: (rule) => {
            let results = {};
            rule.hooks && rule.hooks.forEach((hook) => {
                results[hook] = hookResults[hook] && hookResults[hook][1];
            }); 
            return results;
        }
    };
}

module.exports = {
    applyRules: function (rules, element, opts) {
        if (!rules) {
            return [];
        }

        var { isRulebreakOff, gethookResults } = runHooks(rules, element, opts);

        return lodash.flattenDeep(rules.map(function (rule) {   
            var issues = [];

            if (!rule.hooks ||  !isRulebreakOff(rule))
                issues = rule.lint.call(rule, element, opts, rule.hooks && gethookResults(rule));

            addRuleToIssue(issues, rule.name);

            return issues;
        }));

    }
};
