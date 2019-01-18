module.exports = [
    {
        desc: 'should match attributes with mixed case',
        input: '<boDY>',
        opts: { 'tag-name-lowercase': true },
        output: 1
    }, {
        desc: 'should not match attributes with lowered case',
        input: '<body>',
        opts: { 'tag-name-lowercase': true },
        output: 0
    }, {
        desc: 'should multiple mixed-case elements',
        input: '<HTML><seCtion></section></HTML>',
        opts: { 'tag-name-lowercase': true },
        output: 2
    }, {
        desc: 'should not match when disabled',
        input: '<HTML><seCtion></section></HTML>',
        opts: { 'tag-name-lowercase': false },
        output: 0
    }, {
        desc: 'should not match directives',
        input: '<!DOCTYPE html>',
        opts: { 'tag-name-lowercase': true },
        output: 0
    }
];
