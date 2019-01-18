module.exports = [
    {
        desc: 'should not match absolute links given absolute option',
        input: '<a href="http://www.google.com"></a>',
        opts: { 'href-style': 'absolute' },
        output: 0
    }, {
        desc: 'should match relative links given absolute option',
        input: '<a href="/dog/cat"></a>',
        opts: { 'href-style': 'absolute' },
        output: 1
    }, {
        desc: 'should not match relative links given relative option',
        input: '<a href="/dog/cat"></a>',
        opts: { 'href-style': 'relative' },
        output: 0
    }, {
        desc: 'should match absolute links given relative option',
        input: '<a href="http://www.google.com"></a>',
        opts: { 'href-style': 'relative' },
        output: 1
    }, {
        desc: 'should not match any links given false option',
        input: '<a href="/dog/cat"></a><a href="http://www.google.com"></a>',
        opts: { 'href-style': false },
        output: 0
    }, {
        desc: 'should not match on <a> without an href',
        input: '<a></a>',
        opts: { 'href-style': 'absolute' },
        output: 0
    }
];
