describe('knife.apply_rules', function () {
    var knife = require('../../lib/knife');

    it('should return [] for no rules', function () {
        var output = knife.applyRules(null);

        expect(output).to.be.eql([]);
    });
});
