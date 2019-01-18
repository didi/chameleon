var lodash = require('lodash'),
    Issue = require('./issue'),
    proc = require('./process_option'),
    presets = require('./presets').presets;

    
/**
 * The config object stores all possible rules and options and manages
 * dependencies based on which options are enabled.
 * As it runs, it updates the subscribers array for each rule to indicate
 * the active rules and options depending on it.
 * @constructor
 * @param {Object[]} rules - The rules to use.
 * @param {Object[]} options - The options.
 */
function Config(rules, options) {
    this.options = {};
    if (options) { options.forEach(this.addOption.bind(this)); }
    this.rulesMap = {};
    if (rules) { rules.forEach(this.addRule.bind(this)); }
}
module.exports = Config;

/**
 * Get a rule by name.
 * @param {string} ruleName
 * @returns {Object}
 */
Config.prototype.getRule = function (ruleName) {
    return this.rulesMap[ruleName];
};

/**
 * Add a rule.
 * @param {Object} rule
 * @param {string} rule.name
 * @param {string[]} [rule.on=[]] - The rules called by rule.
 * @param {string[]} [rule.options] - Options to add with the rule.
 * Options in this list that have no name use the rule's name.
 */
Config.prototype.addRule = function (rule) {
    var oldRule = this.rulesMap[rule.name];
    if (rule === oldRule) { return; }

    if (!rule.on) { rule.on = []; }
    rule.subscribers = [];
    this.rulesMap[rule.name] = rule;

    if (oldRule && oldRule.subscribers.length) {
        this.deactivateRule(oldRule);
        this.activateRule(rule);
        rule.subscribers = oldRule.subscribers;
    }

    if (rule.options) {
        rule.options.forEach(function (o) {
            if (!o.name) { o.name = rule.name; }
            if (!o.rules) { o.rules = [rule.name]; }
            this.addOption(o);
        }.bind(this));
    } else if (rule.desc) {
        this.addOption({
            name: rule.name,
            rules: [rule.name],
            desc: rule.desc,
            process: rule.process || proc.bool
        });
    }
};

/**
 * Remove a rule by name.
 * @param {string} ruleName
 */
Config.prototype.removeRule = function (ruleName) {
    var rule = this.rulesMap[ruleName];
    if (rule) {
        this.deactivateRule(rule);
        delete this.rulesMap[ruleName];
    }
};

/**
 * Return a list of all rules.
 * @returns {Object[]}
 */
Config.prototype.getAllRules = function () {
    return Object.values(this.rulesMap);
};

/**
 * Add an option.
 * @param {Object} option
 * @param {string} option.name
 * @param {string[]} [option.rules=[option.name]] - The rules using option.
 */
Config.prototype.addOption = function (option) {
    var oldOption = this.options[option.name];
    if (option === oldOption) { return; }

    if (!option.rules) { option.rules = [option.name]; }
    option.active = false;
    this.options[option.name] = option;

    if (oldOption && oldOption.active) {
        this.setOptionObj(oldOption, false);
        this.setOptionObj(option, true);
    }
};

/**
 * Remove an option by name.
 * @param {string} optionName
 */
Config.prototype.removeOption = function (optionName) {
    var option = this.options[optionName];
    if (option) {
        this.setOptionObj(option, false);
        delete this.options[optionName];
    }
};

/**
 * Set the values of all options.
 * @param {Object} opts - Option values by name.
 * Values will be replaced with parsed versions.
 * @returns {Object[]} A list of issues
 */
Config.prototype.initOptions = function (opts) {
    this.getAllRules().forEach(function (rule) {
        rule.subscribers = [];
    });
    Object.values(this.options).forEach(function (o) {
        o.active = false;
    });
    var issues = [];
    Object.keys(opts).forEach(function (name) {
        if (!(name in this.options) && !(name in presets.global)) {
            issues.push(new Issue('E054', [0, 0], { name: name }));
            return;
        }

        if (name in presets.global) {
            this.addOption({
                name: name,
                rules: [],
                desc: presets.global[name]['desc'] || '',
                process: presets.global[name]['process'] || proc.bool
            });
        }

        if (name in this.options) {
            var val = opts[name],
            parsed = this.setOption(name, val);
            if (parsed === undefined) {
                issues.push(new Issue('E048', [0, 0], { option: name, value: val }));
                parsed = false;
            }
            opts[name] = parsed;
        }
    }.bind(this));
    return issues;
};

/**
 * Set an option's value given the option name.
 * @param {string} optionName
 * @param value - The new value. Only its truthiness is used.
 * @param noprocess - true if the value should used as is and not parsed.
 * @returns The value, possibly parsed according to the option.
 */
Config.prototype.setOption = function (optionName, value, noprocess) {
    var option = this.options[optionName];
    value = noprocess ? value
          : value !== false ? option.process(value) : false;
    this.setOptionObj(option, value);
    return value;
}

/**
 * Update rule subscriptions according to a new option value.
 * @param {Object} option
 * @param value - The new value. Only its truthiness is used.
 */
Config.prototype.setOptionObj = function (option, value) {
    var active = value !== false && value !== undefined;
    if (active !== option.active) {
        this.onAllSubs(
            option,
            option.rules,
            (active ? this.addSubscriber : this.removeSubscriber).bind(this)
        );
        option.active = active;
    }
};

Config.prototype.onAllSubs = function (obj, subs, action) {
    subs.forEach(function (parentName) {
        if (this.rulesMap[parentName]) {
            action(this.rulesMap[parentName], obj);
        }
    }.bind(this));
};

Config.prototype.activateRule = function (rule) {
    this.onAllSubs(rule, rule.on, this.addSubscriber.bind(this));
}

Config.prototype.addSubscriber = function (rule, sub) {
    if (!rule.subscribers.length) {
        this.activateRule(rule);
    }
    (typeof sub.lint === 'function') && !~rule.subscribers.indexOf(sub) && rule.subscribers.push(sub);
};

Config.prototype.deactivateRule = function (rule) {
    this.onAllSubs(rule, rule.on, this.removeSubscriber.bind(this));
};

Config.prototype.removeSubscriber = function (rule, sub) {
    if (!lodash.pull(rule.subscribers, sub).length) {
        this.deactivateRule(rule);
    }
};
