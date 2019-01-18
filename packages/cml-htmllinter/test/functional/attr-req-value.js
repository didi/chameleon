module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<img src>',
        opts: {'attr-req-value': false},
        output: 0
    }, {
        desc: 'should pass when attribs are valued',
        input: '<img src="test.jpg" alt="test">',
        opts: {'attr-req-value': true},
        output: 0
    }, {
        desc: 'should pass with spaces in attribute values',
        input: '<img src="test image.jpg" alt="test">',
        opts: {'attr-req-value': true},
        output: 0
    }, {
        desc: 'should fail when attribs aren`t valued',
        input: '<img src>',
        opts: {'attr-req-value': true},
        output: 1
    }, {
        desc: 'should fail when attribs aren`t valued (with equals)',
        input: '<img src=>',
        opts: {'attr-req-value': true},
        output: 1
    }, {
        desc: 'should fail for empty attribs followed by correct ones',
        input: '<img src= alt="test">',
        opts: {'attr-req-value': true},
        output: 1
    }, {
        desc: 'should pass when attribs are valued with the empty string',
        input: '<img src="" alt="">',
        opts: {'attr-req-value': true},
        output: 0
    }, {
        desc: 'should pass for boolean attributes',
        input: '<input type="checkbox" checked name=test>',
        opts: {'attr-req-value': true},
        output: 0
    }, {
        desc: 'should fail for boolean attributes with = but no value',
        input: '<input type="checkbox" checked= name=test>',
        opts: {'attr-req-value': true},
        output: 1
    }
];
