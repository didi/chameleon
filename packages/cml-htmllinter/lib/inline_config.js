var lodash = require('lodash'),
    knife = require('./knife'),
    presets = require('./presets'),
    Issue = require('./issue');

// Private vars,
var index = 0; // index used for making sure configs are sent in order

/**
 * An inline configuration class is created to hold each inline configuration
 * and report back what the options should be at a certain index.
 * @constructor
 * @param {Object} config - an option parser
 * If not given here, it must be set with inlineConfig.reset(basis).
 */
var inlineConfig = function (config) {
    this.setOption = config.setOption.bind(config);
    this.isOption = function (name) { return name in config.options; };
    this.clear();
};
module.exports = inlineConfig;

/**
 * Reset the current opts to the basis. if newBasis is supplied, use that as our new basis.
 * @param {Object} newBasis - the new options to use.
 */
inlineConfig.prototype.reset = function (newBasis) {
    this.current = lodash.cloneDeep(newBasis);
    index = 0;
};

/**
 * Clears the indexConfigs object, then calls reset with 'null' - to be called after linting finishes.
 * @param {Object} newBasis - the new options to use.
 */
inlineConfig.prototype.clear = function () {
    this.indexConfigs = [];
    this.previous = {};
    this.previousPreset = {};
};

/**
 * Apply the given cofiguration to this.current. Returns true if the operation resulted in any changes, false otherwise.
 * @param {Object} config - the new config to write onto the current options.
 */
function applyConfig(config) {
    var previous = {};

    config.rules.forEach(function (rule) {
        var isprev = (rule.value === '$previous');
        var setOption = function (name, value) {
            previous[name] = this.current[name];
            this.current[name] = this.setOption(name, value, isprev);
        }.bind(this);
        if (rule.type === 'rule') {
            setOption(rule.name, isprev ? this.previous[rule.name]
                                        : rule.value);
        /* istanbul ignore else */
        } else if (rule.type === 'preset') {
            var preset = isprev ? this.previousPreset
                                : presets.presets[rule.value];
            Object.keys(preset).forEach(function (name) {
                setOption(name, preset[name]);
            });
        }
    }.bind(this));

    lodash.merge(this.previous, this.previousPreset = previous);
}

/**
 * Get the options object to use at this index. Indices must be given in order, or an error is thrown (much speedier).
 * If you must get them out of order, use 'reset' first. Sets the opts to this.current.
 * @param {number} newIndex - The index to get opts for.
 */
inlineConfig.prototype.getOptsAtIndex = function (newIndex) {
    if (newIndex !== 0 && newIndex <= index) {
        throw new Error('Cannot get options for index ' + newIndex + ' when index ' + index + ' has already been checked');
    } else {
        lodash.compact(this.indexConfigs.slice(index + 1, newIndex + 1))
            .forEach(applyConfig, this);
        index = newIndex;
    }
};

/**
 * Add the config when it was given to us from feedComment.
 * @param {Object} config - The config to add.
 */
inlineConfig.prototype.addConfig = function (config) {
    if (this.indexConfigs[config.end]) {
        throw new Error('config exists at index already!');
    }

    this.indexConfigs[config.end] = config;
};

/**
 * Take the comment element and check it for the proper structure.
 * Add it to our array indexConfigs.
 * Return a list of issues encountered.
 * @param {number} newIndex - The index to get opts for.
 */
inlineConfig.prototype.feedComment = function (element) {
    var line = element.data,
        match = line.match(/[\s]*htmllint[\s]+(.*)/);

    if (!match) {
        return [];
    }

    var keyvals = knife.parseHtmlAttrs(match[1]);

    var settings = [],
        issues = [];
    keyvals.forEach(function (pair) {
        // TODO More precise line/column numbers
        var r = parsePair(pair.name, pair.valueRaw, element.lineCol,
                          this.isOption);
        (r.code ? issues : settings).push(r);
    }.bind(this));
    if (settings.length > 0) {
        this.addConfig({
            start: element.index,
            end:   element.index + element.data.length + 6, // 7 for '<!--' and '-->' minus one for last index
            rules: settings
        });
    }
    return issues;
};

/**
 * Accept an attribute and return either a parsed config pair object
 * or an error string.
 * @param {string} name - The attribute name.
 * @param {string} value - The attribute raw value.
 */
function parsePair(name, value, pos, isOption) {
    if (!name || !value || !name.length || !value.length) {
        return new Issue('E050', pos);
    }

    var nameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!nameRegex.test(name)) {
        return new Issue('E051', pos, {name: name});
    }

    // Strip quotes and replace single quotes with double quotes
    var squote = '\'', dquote = '"'; // Single and double quote, for sanity
    if (value[0] === squote  ||  value[0] === dquote) {
        value = value.substr(1, value.length - 2);
    }
    value = value.replace(/\'/g, dquote);

    // Treat _ and - interchangeably
    name = name.replace(/_/g, '-');

    // check if our value is for a preset.
    if (name === 'preset') {
        if (value !== '$previous' && !presets.presets[value]) {
            return new Issue('E052', pos, {preset: value});
        } else {
            return { type: 'preset', value: value };
        }
    }

    // it's not a preset.
    var parsed = null;
    if (value === '$previous') {
        parsed = '$previous';
    } else if (value[0] === '$') {
        var vs = value.substr(1);
        if (!presets.presets[vs]) {
            return new Issue('E052', pos, {preset: vs});
        }
        parsed = presets.presets[vs][name];
    } else {
        if (!isOption(name)) {
            return new Issue('E054', pos, {name: name});
        }
        try {
            parsed = JSON.parse(value);
        } catch (e) {
            if (!nameRegex.test(value)) {
                return new Issue('E053', pos, {rule: name, value: value});
            }
            parsed = value;
        }
    }

    return { type: 'rule', name: name, value: parsed };
}
