module.exports = [
    {
        desc: 'should pass two inputs with positive tabindexes',
        input: [
            '<input tabindex=2></input>',
            '<input tabindex="3"></input>'
        ].join(''),
        opts: { 'focusable-tabindex-style': true },
        output: 0
    }, {
        desc: 'should pass inputs without positive tabindexes',
        input: [
            '<input tabindex="0"></input>',
            '<input tabindex="-1"></input>',
            '<input></input>'
        ].join(''),
        opts: { 'focusable-tabindex-style': true },
        output: 0
    }, {
        desc: 'should fail mixed inputs',
        input: [
            '<input></input>',
            '<input></input>',
            '<input tabindex="2"></input>',
            '<input tabindex="3"></input>'
        ].join(''),
        opts: { 'focusable-tabindex-style': true },
        output: 2
    }, {
        desc: 'should fail inputs with both positive and negative tabindexes',
        input: [
            '<input tabindex="2"></input>',
            '<input tabindex="-1"></input>',
            '<input></input>',
            '<input tabindex="-3"></input>'
        ].join(''),
        opts: { 'focusable-tabindex-style': true },
        output: 3
    }, {
        desc: 'should ignore disabled inputs',
        input: [
            '<input disabled></input>',
            '<input disabled></input>',
            '<input tabindex="2"></input>',
            '<input tabindex="3"></input>'
        ].join(''),
        opts: { 'focusable-tabindex-style': true },
        output: 0
    }
];
