var lodash = require('lodash');

var formats = {
    lowercase: /^[a-z][a-z\d]*$/,
    underscore: /^[a-z][a-z\d]*(_[a-z\d]+)*$/,
    dash: /^[a-z][a-z\d]*(-[a-z\d]+)*$/,
    camel: /^[a-zA-Z][a-zA-Z\d]*$/,
    bem: /^[a-z][a-z\d]*(-[a-z\d]+)*(__[a-z\d]+(-[a-z\d]+)*)?(--[a-z\d]+(-[a-z\d]+)*)?$/
};

function getRegExp(val, strFn) {
    if (lodash.isRegExp(val)) {
        return val;
    } else if (lodash.isString(val)) {
        var match = /^\/(.*?)\/([gim]*)$/.exec(val);
        return match ? new RegExp(match[1], match[2]) : strFn(val);
    } else {
        return undefined;
    }
}

module.exports = {
    bool: function (option) {
        return option ? true : false;
    },
    boolPlus: function (option) {
        return function (o) {
            return o === option ? option : o ? true : false;
        }
    },
    str: function(o) {
        return lodash.isString(o) ? o : '';
    },
    arrayOfStr: function (o) {
        return lodash.isArray(o) && lodash.every(o, lodash.isString)
            ? o : undefined;
    },
    options: function (opts) {
        return function (o) {
            return opts.indexOf(o) > -1 ? o : undefined;
        }
    },
    regex: function (regex) {
        return getRegExp(regex, function (s) { return new RegExp(s); });
    },
    regexGlobal: function (r) {
        r = module.exports.regex(r);
        return r && new RegExp(r.source, r.ignoreCase ? 'gi' : 'g');
    },
    posInt: function (i) {
        return (lodash.isInteger(i) && i >= 0) ? i : undefined;
    },
    format: function (name) {
        var regex = getRegExp(name, function (s) { return formats[s]; });

        return regex && { desc: name, test: regex.test.bind(regex) };
    },
    object: function (o) {
        return Object.keys(o).length > 0 ? o : {};
    },
    getRegExp: getRegExp
};
