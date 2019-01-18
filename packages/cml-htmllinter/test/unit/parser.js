describe('linter', function () {
    var Parser = require('../../lib/parser');

    it('should be a function', function () {
        expect(Parser).to.be.an.instanceOf(Function);
    });

    describe('parse', function () {
        var parser = null;

        beforeEach(function () {
            parser = new Parser();
        });

        it('should return correct line and column numbers', function () {
            var output = parser.parse([
               '<body>\n'
              ,'  <div a="jofwei">\n'
              ,'    TextTextText\n'
              ,'  </div>\n'
              ,'</body>\n'
            ].join(''));

            expect(output[0].openLineCol).to.be.eql([1,1]);
            expect(output[0].closeLineCol).to.be.eql([5,1]);
            expect(output[0].children[1].openLineCol).to.be.eql([2,3]);
            expect(output[0].children[1].closeLineCol).to.be.eql([4,3]);
        });
    });

    describe('onattribute', function () {
        var parser = null;

        beforeEach(function () {
            parser = new Parser();
        });

        it('should correctly return an array of duplicates', function () {
            var output = parser.parse([
               '<body>\n'
              ,'  <div class="hello" id="identityDiv" class="goodbye">\n'
              ,'  </div>\n'
              ,'</body>\n'
            ].join(''));

            expect(output[0].children[1].dupes).to.be.eql(['class']);
        });
    });
});
