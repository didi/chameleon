var input = [
    '<body>\n',
    '  <p>\n',
    '    some\r',
    '    text\n',
    '  </p>\r\n',
    '</body>\r'
].join('');

module.exports = [
    {
        desc: 'should not match anything when set to false',
        input: input,
        opts: { 'line-end-style': false },
        output: 0
    }, {
        desc: 'should fail on unknown style',
        input: '',
        opts: { 'line-end-style': 'inadmissible' },
        output: 1
    }, {
        desc: 'should match CR and CRLF when set to LF',
        input: input,
        opts: { 'line-end-style': 'lf' },
        output: 3
    }, {
        desc: 'should match LF and CRLF when set to CR',
        input: input,
        opts: { 'line-end-style': 'cr' },
        output: 4
    }, {
        desc: 'should match CR and LF when set to CRLF',
        input: input,
        opts: { 'line-end-style': 'crlf' },
        output: 5
    }, {
        desc: 'should not match empty lines',
        input: ['<div>','','</div>'].join('\n') + '\n',
        opts: { 'line-end-style': 'lf' },
        output: 0
    }
];

