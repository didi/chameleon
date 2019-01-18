describe('rules.doctype-first', function () {
    var rule = require('../../lib/rules/doctype-first');

    beforeEach(function () {
        rule.end();
    });

    it('should not validate on a comment', function () {
        var comment = { type: 'comment' },
            opts = { 'doctype-first': true };

        rule.lint(comment, opts);

        expect(rule.passedFirst).to.be.eql(false);
    });

    it('should not validate on spaces', function () {
        var spaces = { type: 'text', data: ' \t\n\f\r' },
            opts = { 'doctype-first': true };

        rule.lint(spaces, opts);

        expect(rule.passedFirst).to.be.eql(false);
    });
});
