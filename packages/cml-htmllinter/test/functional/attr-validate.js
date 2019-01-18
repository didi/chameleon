module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div cl=ss="\' "id=\'"></div>',
        opts: { 'attr-validate': false },
        output: 0
    }, {
        desc: 'should pass valid attribute list 2',
        input: '<div\t  class ="large" id=a\nid\r=\'\n\tb  \' ></div>',
        opts: { 'attr-validate': true },
        output: 0
    }, {
        desc: 'should fail when given malformed attributes',
        input: '<div class="large id="title"></div>',
        opts: { 'attr-validate': true },
        output: 1
    }, {
        desc: 'should fail once per tag with malformed attributes',
        input: '<div class=large" id=\'title\'><p class=="bold">text</p></div>',
        opts: { 'attr-validate': true },
        output: 2
    }, {
        desc: 'should work on self-closing tags with no space before /',
        input: '<meta charset="utf-8"/>',
        opts: { 'attr-validate': true },
        output: 0
    }
];
