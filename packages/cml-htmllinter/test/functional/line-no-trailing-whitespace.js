module.exports = [
    {
        desc: 'should not match anything when set to false',
        input: 's p a c e \n\t\r',
        opts: { 'line-no-trailing-whitespace': false },
        output: 0
    }, {
        desc: 'should match trailing spaces',
        input: 's p a c e \n',
        opts: { 'line-no-trailing-whitespace': true },
        output: 1
    }, {
        desc: 'should match multiple times',
        input: 's p a c e \n a n d\t\nl i n e',
        opts: { 'line-no-trailing-whitespace': true },
        output: 2
    }, {
        desc: 'should match only once for multiple spaces on one line',
        input: 's p a c e\n a n d \t  \t',
        opts: { 'line-no-trailing-whitespace': true },
        output: 1
    }, {
        desc: 'should match unicode spaces',
        input: 's p a c e\u00a0\r a n d\u2007\rl i n e\u205f',
        opts: { 'line-no-trailing-whitespace': true },
        output: 3
    }, {
        desc: 'should not match empty lines with CRLF',
        input: ['<div>','','</div>'].join('\r\n') + '\r\n',
        opts: { 'line-no-trailing-whitespace': true },
        output: 0
    }
];

