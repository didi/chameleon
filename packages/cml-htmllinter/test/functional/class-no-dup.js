module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<body><div><p class="hey hey">Text</p></div></body>',
        opts: { 'class-no-dup': false },
        output: 0
    }, {
        desc: 'should pass when there are no duplicates',
        input: '<body><div><p class="hey hi">Text</p></div></body>',
        opts: { 'class-no-dup': true },
        output: 0
    }, {
        desc: 'should catch duplicates when set to true',
        input: '<body><div><p class="hey hey">Text</p></div></body>',
        opts: { 'class-no-dup': true },
        output: 1
    }, {
        desc: 'should catch multiple duplicates in one class',
        input: '<body><div><p class="hey hey hi ho ho">Text</p></div></body>',
        opts: { 'class-no-dup': true },
        output: 2
    }, {
        desc: 'should work with leading and trailing whitespace',
        input: '<body><div><p class=" hey hi\n">Text</p></div></body>',
        opts: { 'class-no-dup': true },
        output: 0
    },

    // check ignore splitting
    {
        desc: 'should catch duplicates with a custom separator',
        input: '<body><div><p class="hey hey">Text</p></div></body>',
        opts: { 'class-no-dup': true, 'id-class-ignore-regex': '{.*?}' },
        output: 1
    }, {
        desc: 'should not catch non-duplicates with a custom separator',
        input: '<body><div><p class="hi {foo bar} {foo x bar} hello ">Text</p></div></body>',
        opts: { 'class-no-dup': true, 'id-class-ignore-regex': '{.*?}' },
        output: 0
    }, {
        desc: 'should catch multiple duplicates with a custom separator',
        input: '<body><div><p class="hey {foo bar} hey hi {foo bar}">Text</p></div></body>',
        opts: { 'class-no-dup': true, 'id-class-ignore-regex': '{.*?}' },
        output: 2
    }, {
        desc: 'should not fail if id-class-ignore-regex has capturing groups',
        input: '<body><div><p class="  hey {foo bar} hi {foo baz}">Text</p></div></body>',
        opts: { 'class-no-dup': true, 'id-class-ignore-regex': '(({)(.*?)})' },
        output: 0
    }, {
        desc: 'should not fail if id-class-ignore-regex has literal parens',
        input: '<body><div><p class="hi {(foo bar)} {(foo baz)} hey">Text</p></div></body>',
        opts: { 'class-no-dup': true, 'id-class-ignore-regex': '{\(.*?\)}' },
        output: 0
    }
];
