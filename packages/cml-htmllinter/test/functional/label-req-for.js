module.exports = [
    {
        desc: 'should pass when set to false',
        input: [
            '<label for="noexist">',
            '<input type="text" id="thing"/>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': false },
        output: 0
    }, {
        desc: 'should pass valid for attr in strict mode',
        input: [
            '<label for="thing">The Thing</label>',
            '<input type="text" id="thing"/>'
        ].join(''),
        opts: { 'label-req-for': 'strict' },
        output: 0
    }, {
        desc: 'should pass with multiple valid labels',
        input: [
            '<label for="thing-1">Thing 1</label>',
            '<input type="text" id="thing-1"/>',
            '<label for="thing-2">Thing 2</label>',
            '<input type="text" id="thing-2"/>'
        ].join(''),
        opts: { 'label-req-for': 'strict' },
        output: 0
    }, {
        desc: 'should pass even with out-of-order and duplicated elements',
        input: [
            '<label for="thing">The Thing</label>',
            '<input type="text" id="thing"/>',
            '<label for="thing">The Thing</label>',
            '<input type="text" id="thing"/>',
            '<label for="thing">The Thing</label>'
        ].join(''),
        opts: { 'label-req-for': 'strict' },
        output: 0
    }, {
        desc: 'should fail label with only child in strict mode',
        input: [
            '<label>',
            '<input type="text" id="thing"/>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': 'strict' },
        output: 1
    }, {
        desc: 'should pass label with only child in nonstrict mode',
        input: [
            '<label>',
            '<input type="text" id="thing"/>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': true },
        output: 0
    }, {
        desc: 'should fail label with nonexistant for id',
        input: [
            '<label for="noexist">',
            '<input type="text" id="thing"/>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': true },
        output: 1
    }, {
        desc: 'should pass label for with child id',
        input: [
            '<label for="thing">',
            '<input type="text" id="thing"/>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': true },
        output: 0
    }, {
        desc: 'should fail an unlabeable child in nonstrict',
        input: [
            '<label>',
            '<p>not labeable</p>',
            '</label>'
        ].join(''),
        opts: { 'label-req-for': true },
        output: 1
    }, {
        desc: 'should fail an id that points to an unlabeable element',
        input: [
            '<btn></btn><div>',
            '<label for="para"></label>',
            '<div id="para"></div>',
            '</div>'
        ].join(''),
        opts: { 'label-req-for': true },
        output: 1
    }
];
