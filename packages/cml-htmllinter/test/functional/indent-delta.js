module.exports = [
    {
        desc: 'should work with tabs',
        input: [
            '<body>',
            '\t<p>hello</p>',
            '</body>'
        ].join('\n'),
        opts: {'indent-delta':true },
        output: 0
    }, {
        desc: 'should detect bad tab indent',
        input: [
            '<body>',
            '\t\t\t<p>hello</p>',
            '\t\t\t<p>hello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-delta':true },
        output: 2
    }, {
        desc: 'should work with tabs and spaces',
        input: [
            '<body>',
            '\t<p>hello</p>',
            '  <p>hello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-delta':true, 'indent-width':2 },
        output: 0
    }, {
        desc: 'should tab to next multiple of indent-width',
        input: [
            '<body>',
            '\t<p>hello</p>',         // 1 tab
            '   \t   \t<p>hello</p>', // 2 tabs
            '    <p>hello</p>',       // 1 tab
            '</body>'
        ].join('\n'),
        opts: { 'indent-delta':true, 'indent-width':4 },
        output: 1 // From indent-width; none from indent-delta
    }, {
        desc: 'should ignore empty lines',
        input: [
            '<body>',
            '\t<p>break with</p>',
            '\t\t<p>empty line</p>',
            '',
            '\t<p>is fine</p>',
            '</body>'
        ].join('\r\n'),
        opts: { 'indent-delta':true, 'indent-width':6 },
        output: 0
    }, {
        desc: 'should detect bad indent with tabs and spaces',
        input: [
            '<body>',
            '\t  <p>hello</p>',
            '  <p>hello</p>',
            '\t\t\t<p>hello</p>',
            '    <p>hello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-delta':true, 'indent-width':2 },
        output: 3
    },
]
