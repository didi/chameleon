module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<body><div><p class="hey" id="fat" class="mdo">Text</p></div></body>',
        opts: { 'attr-no-dup': false },
        output: 0
    }, {
        desc: 'should pass when set to any falsy value',
        input: '<body><div><p class="hey" id="fat" class="mdo">Text</p></div></body>',
        opts: { 'attr-no-dup': '' },
        output: 0
    }, {
        desc: 'should catch duplicates when set to true',
        input: '<body><div><p class="hey" id="fat" class="mdo">Text</p></div></body>',
        opts: { 'attr-no-dup': true },
        output: 1
    }, {
        desc: 'should catch multiple duplicates in one element',
        input: '<body><div><p class="hey" id="fat" class="mdo" id="Whaddup">Text</p></div></body>',
        opts: { 'attr-no-dup': true },
        output: 2
    }, {
        desc: 'should catch duplicates on multiple elements',
        input: '<body><div class="mdo" class="hey"><p id="Whaddup" id="fat">Text</p></div></body>',
        opts: { 'attr-no-dup': true },
        output: 2
    }
];
