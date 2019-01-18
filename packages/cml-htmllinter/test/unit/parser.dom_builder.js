describe('parser.dom_builder', function () {
    var DomBuilder = require('../../lib/parser/dom_builder'),
        DomHandler = require('htmlparser2').DomHandler;

    it('should be a constructor', function () {
        expect(DomBuilder).to.be.an.instanceOf(Function);
    });

    it('should inherit from DomHandler', function () {
        expect(DomBuilder.prototype).to.be.an.instanceOf(DomHandler);
    });

    it('should throw on addDomElement if not initialized with a parser', function () {
        var builder = new DomBuilder();

        /*eslint-disable no-underscore-dangle*/
        expect(builder._addDomElement.bind(builder)).to.throw(Error);
        /*eslint-enable no-underscore-dangle*/
    });

    describe('onerror', function () {
        it('should throw the error', function () {
            var builder = new DomBuilder();

            expect(function () {
                builder.onerror('error');
            }).to.throw();
        });
    });
});
