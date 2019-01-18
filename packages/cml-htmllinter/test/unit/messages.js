describe('messages', function () {
    var messages = require('../../lib/messages');

    describe('renderMsg', function () {
        it('should return a string', function () {
            var code = 'E000', data = {};

            var output = messages.renderMsg(code, data);

            expect(output).to.be.eql('not a valid error code');
        });
    });

    describe('renderIssue', function () {
        it('should return a string', function () {
            var issue = { code: 'E000', data: {} };

            var output = messages.renderIssue(issue);

            expect(output).to.be.eql('not a valid error code');
        });
    });
});
