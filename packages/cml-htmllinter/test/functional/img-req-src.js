module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<img>',
        opts: { 'img-req-src': false },
        output: 0
    }, {
        desc: 'should pass when image tags have set src attribs',
        input:'<img src="nyan.mrw">',
        opts: { 'img-req-src': true },
        output: 0
    }, {
        desc: 'should fail when the img src is not set',
        input: '<img id="notasource">',
        opts: { 'img-req-src': true },
        output: 1
    }, {
        desc: 'should fail when the img src is empty',
        input: '<img src>',
        opts: { 'img-req-src': true },
        output: 1
    }
];
