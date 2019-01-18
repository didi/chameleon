module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div abc="" 2fOwj_0o-3="" 0r9jfFJ2=""></div>',
        opts: { 'attr-name-style': false },
        output: 0
    }, {
        desc: 'should pass correctly styled attribute names',
        input: '<div abc="" fowj0wo3=""></div>',
        opts: { 'attr-name-style': 'lowercase' },
        output: 0
    }, {
        desc: 'should pass ignore attribute',
        input: '<div abc="" xlink:href=""></div>',
        opts: { 'attr-name-style': 'dash', 'attr-name-ignore-regex': 'xlink:href' },
        output: 0
    }, {
        desc: 'should pass when set to false with ignore attribute',
        input: '<div abc="" xlink:href=""></div>',
        opts: { 'attr-name-style': false, 'attr-name-ignore-regex': 'notfound' },
        output: 0
    }, {
        desc: 'should fail incorrectly styled attribute names',
        input: '<div foWj0wo3=""></div>',
        opts: { 'attr-name-style': 'lowercase' },
        output: 1
    }, {
        desc: 'should accept "dash" option',
        input: '<div abc="" fowj-awo3-fqowj=""></div>',
        opts: { 'attr-name-style': 'dash' },
        output: 0
    }, {
        desc: 'should accept a custom RegExp',
        input: '<div deadbeef1337="" fail="" fails=""></div>',
        opts: { 'attr-name-style': /^[0-9a-f]+$/ },
        output: 2
    }, {
        desc: 'should accept a string giving a RegExp',
        input: '<div deadbeef1337="" fail="" fails=""></div>',
        opts: { 'attr-name-style': '/^[0-9a-f]+$/g' },
        output: 2
    }, {
        desc: 'should fail when given a non-string value',
        input: '<div></div>',
        opts: { 'attr-name-style': ['camel'] },
        output: 1
    }
];
