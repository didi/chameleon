var Promise = require('promise');
var lodash = require('lodash'),
    Parser = require('./parser'),
    knife = require('./knife'),
    presets = require('./presets'),
    Config = require('./config'),
    InlineConfig = require('./inline_config');

/**
 * A linter is configured with a set of rules that are fed the raw
 * html and ast nodes.
 * @constructor
 */
var Linter = function (rules, options) {
    this.rules = new Config(rules, options);
    this.parser = new Parser();
    this.inlineConfig = new InlineConfig(this.rules);
};
module.exports = Linter;

/**
 * Adds a plugin to the linter.
 * @param {Object} plugin - the plugin to add to the linter.
 */
Linter.prototype.use = function (plugin) {
    if (plugin.rules) {
        plugin.rules.forEach(function (rule) {
            this.rules.addRule(rule);
        }.bind(this));
    }
};

/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function rawIgnoreRegex(html, opts) {
    var ignore = opts['raw-ignore-regex'];
    if (!ignore) { return [html, function (issue) { return issue; }]; }

    var origLineCol = knife.getLineColFunc(html),
        l = 1, // Current line in the modified string
        d = 0; // Difference between original and modified line numbers
    var lines = [],
        cols = [];
    var total = html.length;
    html = html.replace(ignore, function (match) {
        var offset = arguments[arguments.length - 2],
            start = origLineCol(offset),
            end = origLineCol(offset + match.length),
            linediff = end[0] - start[0],
            newcol = start[0] - d;
        if (linediff) {
            for (; l < newcol; l++) { lines[l] = l + d; }
            d += linediff;
        }
        if (!cols[newcol]) { cols[newcol] = [[1,0,start[0]]]; }
        var col = cols[newcol],
            st = start[1] - col[col.length - 1][1];
        col.push([st, end[1] - st, end[0]]);
        return '';
    });

    var recoverLineCol;
    function findInCol(col, i) {
        var lo = 0, hi = col.length;
        while (lo < hi - 1) {
            var mid = Math.floor((lo + hi) / 2),
                v = col[mid][0];
            if (v === i) {
                return col[mid];
            } else if (v < i) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return col[lo];
    }
    if (d === 0) { // No multi-line ignores
        recoverLineCol = function (issue) {
            var col = cols[issue.line];
            if (col) {
                issue.column += findInCol(col, issue.column)[1];
            }
            return issue;
        };
    } else {
        for (; l < total - d; l++) { lines[l] = l + d; }
        recoverLineCol = function (issue) {
            var col = cols[issue.line];
            if (col) {
                var c = findInCol(col, issue.column);
                issue.column += c[1];
                issue.line = c[2];
            } else {
                issue.line = lines[issue.line];
            }
            return issue;
        };
    }
    return [html, recoverLineCol];
}

/**
 * Lints the HTML with the options supplied in the environments setup.
 * @param {String} html - the html as a string to lint.
 */
Linter.prototype.lint = function (html) {
    var opts = Linter.getOptions(arguments),
        issues = this.rules.initOptions(opts);

    var hf = rawIgnoreRegex(html, opts),
        recoverLineCol = hf[1];
    html = hf[0];

    var lines = knife.shred(html),
        dom = this.parser.parse(html);
    issues = issues.concat(this.setupInlineConfigs(dom));

    try {
        issues = issues.concat(this.lintByLine(lines, opts));
        issues = issues.concat(this.lintDom(dom, opts));
    } finally {
        issues = issues.concat(this.resetRules(opts));
        this.inlineConfig.clear();
    }

    if (opts.maxerr) {
        issues = lodash.take(issues, opts.maxerr);
    }

    return Promise.all(issues)
        .then(function (resolved) {
            return lodash.flattenDeep(resolved).map(recoverLineCol);
        });
};
Linter.prototype.lint = Promise.nodeify(Linter.prototype.lint);

Linter.getOptions = function (args) {
    var optList = Array.prototype.slice.call(args, 1);
    optList = lodash.flattenDeep(optList);

    if (optList[optList.length - 1] !== 'nodefault') {
        optList.unshift('default');
    }

    return presets.flattenOpts(optList);
};

Linter.prototype.lintByLine = function (lines, opts) {
    return this.rules.getRule('line').lint(lines, opts, this.inlineConfig);
};

Linter.prototype.lintDom = function (dom, opts) {
    return this.rules.getRule('dom').lint(dom, opts, this.inlineConfig);
};

Linter.prototype.resetRules = function (opts) {
    return lodash.flattenDeep(
        this.rules.getAllRules().map(function (rule) {
            var r = rule.end && rule.end(opts);
            return r ? r : [];
        })
    );
};

Linter.prototype.setupInlineConfigs = function (dom) {
    var issues = [];
    var feedComments = function (element) {
        if (element.type === 'comment') {
            issues = issues.concat(this.inlineConfig.feedComment(element));
        }
        if (element.children) {
            element.children.map(feedComments);
        }
    }.bind(this);
    dom.forEach(feedComments);
    return issues;
};
