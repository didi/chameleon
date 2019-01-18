describe('knife.is_labeable', function () {
    var knife = require('../../lib/knife');

    it('should return false for hidden input element', function () {
        var ele = {
            type: 'tag',
            name: 'input',
            attribs: {
                type: {
                    value: 'hidden'
                }
            }
        };

        var output = knife.isLabeable(ele);

        expect(output).to.be.eql(false);
    });
});
