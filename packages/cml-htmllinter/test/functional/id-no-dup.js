module.exports = [
    {
        desc: 'should pass html with no duplicate ids',
        input: '<div id="div1"></div>text<div id="div2"></div>',
        opts: { 'id-no-dup': true },
        output: 0
    }, {
        desc: 'should fail html with a duplicate id',
        input: '<div id="div1"></div>text<div id="div1"></div>',
        opts: { 'id-no-dup': true },
        output: 1
    }, {
        desc: 'should pass any html when disabled',
        input: '<div id="div1"></div>text<div id="div1"></div>',
        opts: { 'id-no-dup': false },
        output: 0
    }
];
