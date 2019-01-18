var lodash = require('lodash'),
    Linter = require('../../lib/linter'),
    Issue = require('../../lib/issue');

// Each E will trigger an error. Lowercase letters are targets for
// raw-ignore-regex.
var defaultHtml = [
    'E abb  E ', // 1, 8
    'c\tE  ',    // 3
    'bEbEba E'   // 2, 4, 8
].join('\n') + '\n';

var errors = [
    [1,1], [1,8],
    [2,3],
    [3,2], [3,4], [3,8]
];

function meetExpectations(issues, locs) {
    if (issues.length !== locs.length) {
        return false;
    }

    for (var i = 0; i < locs.length; i++) {
        if (issues[i].line   !== locs[i][0] ||
            issues[i].column !== locs[i][1]) {
            return false;
        }
    }

    return true;
}

var linter = null;
function expectOutput(ignore, expected, html) {
    html = html || defaultHtml;
    return linter.lint(html, { 'raw-ignore-regex': ignore }, 'nodefault')
        .then(function (output) {
            var pos = output.map(
                function(issue){return [issue.line,issue.column];}
            );
            expect(pos).to.be.eql(expected);
        });
}

describe('raw-ignore-regex', function () {
    function findE(lines) {
        var issues = [];
        lines.forEach(function (line) {
            var regex = /E/gm,
                match;
            while (match = regex.exec(line.line)) {
                issues.push(new Issue('EE', [line.row, match.index + 1]));
            }
        });
        return issues;
    }

    beforeEach(function () {
        linter = new Linter([
            {name: 'dom',  lint: function () { return []; }},
            {name: 'line', lint: findE},
            require('../../lib/rules/free-options.js')
        ]);
    });

    it('should work with no regex given', function () {
        return expectOutput(false, errors);
    });

    it('should correct row and column numbers', function () {
        return expectOutput('a', errors);
    });

    it('should work with multiple ignores per line', function () {
        return expectOutput('b', errors);
    });

    it('should work with tabs', function () {
        return expectOutput('c', errors);
    });

    it('should work with a multi-character ignore', function () {
        return expectOutput('abb', errors);
    });

    it('should work with a multi-line ignore', function () {
        return expectOutput('a[^]*a', [errors[0], errors[5]]);
    });

    it('should work with multiple multi-line ignores', function () {
        return expectOutput(
            '{[^]*?}',
            [[1,1], [3,4], [4,1], [7,4], [7,8]],
            'E {\n\n}  E\nE\n{ \n \n  }E{ }E\n'
        );
    });
});
