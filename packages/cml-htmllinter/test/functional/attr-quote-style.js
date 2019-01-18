module.exports = [
    {
        desc: 'should not run when disabled',
        input: '<button name=unquoted></button>',
        opts: { 'attr-quote-style': false },
        output: 0
    }, {
        desc: 'should fail on unknown style',
        input: '',
        opts: { 'attr-quote-style': 'unknown' },
        output: 1
    }, {
        desc: 'should match unquoted attr',
        input: '<button name=unquoted></button>',
        opts: { 'attr-quote-style': 'quoted' },
        output: 1
    }, {
        desc: 'should match single quoted attr in double mode',
        input: "<button disabled=''></button>",
        opts: { 'attr-quote-style': 'double' },
        output: 1
    }, {
        desc: 'should match double quoted attr in single mode',
        input: '<button disabled="not"></button>',
        opts: { 'attr-quote-style': 'single' },
        output: 1
    }, {
        desc: 'should pass quoted attr',
        input: '<button t="0" t=\'k\'></button>',
        opts: { 'attr-quote-style': 'quoted' },
        output: 0
    }, {
        desc: 'should not match attributes with no values',
        input: '<input type="checkbox" checked name="test">',
        opts: { 'attr-quote-style': 'double' },
        output: 0
    }
];
