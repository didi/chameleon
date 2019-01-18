describe('knife.relative_line_col', function () {
    var knife = require('../../lib/knife');

    it('should throw when called with an index behind the last', function () {
        var posFunc = knife.getLineColFunc('the html', [0, 0]);

        expect(posFunc.bind(this, -10)).to.throw();
    });
});
