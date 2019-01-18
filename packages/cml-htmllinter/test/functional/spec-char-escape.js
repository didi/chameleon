module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div><p>Hello & hello</p></div>',
        opts: { 'spec-char-escape': false },
        output: 0
    }, {
        desc: 'should recognize special characters inside of text elements',
        input: '<div><p class="className" id="IdName" label="label" >Hello & hello</p></div>',
        opts: { 'spec-char-escape': true },
        output: 1
    }, {
        desc: 'should recognize special characters in attribute values',
        input: '<div><p id="mine&ours" class="yours>mine"></p></div>',
        opts: { 'spec-char-escape': true },
        output: 1
    }, {
        desc: 'should return an error for each invalid escape',
        input: '<div><p id="john&*;paul&;ringo&george^"></p></div>',
        opts: { 'spec-char-escape': true },
        output: 3
    }, {
        desc: 'should ignore text matching text-ignore-regex',
        input: '<div><p id="abc{{angu|ar $#!+}}">Some\n{{>>angular&!!\\}}\n{{!!!!}}\ntext</p></div>',
        opts: { 'spec-char-escape': true , 'text-ignore-regex': /{{.*?}}/ },
        output: 0
    }, {
        desc: 'should check sections of text not matching text-ignore-regex',
        input: '<div><p id="abc{{angu|ar $#!+}}">Some&\n{{>>angular&!!\\}}\n>text</p></div>',
        opts: { 'spec-char-escape': true , 'text-ignore-regex': /{{.*?}}/ },
        output: 2
    }, {
        desc: 'text-ignore-regex should maintain case-insensitive flag',
        input: 'AA&Bb aa&bb',
        opts: { 'spec-char-escape': true , 'text-ignore-regex': /aa.*?bb/i },
        output: 0
    }
];
