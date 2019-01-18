// We set line-end-style to lf for each option at the end of this file
// for a predictable rule that will fail on each instance of \r.
module.exports = [
    {
        desc: 'should not ignore text if set to false',
        input: '\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r',
        opts: { 'raw-ignore-regex': false },
        output: 9
    }, {
        desc: 'should remove matching text',
        input: '\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r\n',
        opts: { 'raw-ignore-regex': /\r/ },
        output: 0
    }, {
        desc: 'should work across line breaks',
        input: '\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r',
        opts: { 'raw-ignore-regex': /\[\[[^]*?\]\]/ },
        output: 6
    }, {
        desc: 'should remove multiple matches',
        input: '\r{\r\r}\r[[\r\n\t fjq\r\n\r]]\r\r',
        opts: { 'raw-ignore-regex': /(\{[^]*?\}|\[\[[^]*?\]\])/ },
        output: 4
    }
];

module.exports.forEach(function(test) {
    test.opts['line-end-style'] = 'lf';
});
