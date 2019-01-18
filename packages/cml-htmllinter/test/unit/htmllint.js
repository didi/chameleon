describe('htmllint', function () {
    var htmllint = require('../../');

    it('should be a function', function () {
        expect(htmllint).to.be.an.instanceOf(Function);
    });

    it('should return a thenable', function () {
        var thenable = htmllint('');

        expect(thenable).to.have.property('then');
    });

    it('should eventually return an array', function () {
        var result = htmllint('');

        return result.then(function (output) {
            expect(output).to.be.an.instanceOf(Array);
        });
    });

    it('should not throw on sanity.html', function () {
        var fs = require('fs');
        var filePath = '../fixtures/sanity.html';
        var path = require('path');
        var sanityHtml = fs.readFileSync(path.resolve(__dirname, filePath), {encoding: 'utf8'});

        expect(function () {

            htmllint(sanityHtml);
        }).to.not.throw(Error);
    });

    describe('use', function () {
        it('should register a plugin on the defaultLinter', function () {
            var rule = {
                name: 'testrule'
            }, plugins = [
                'chai',
                { rules: [rule] }
            ];

            htmllint.use(plugins);

            expect(htmllint.defaultLinter.rules.getRule(rule.name)).to.be.eql(rule);
        });
    });
});
