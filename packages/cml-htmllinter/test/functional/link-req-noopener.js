module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<a href="index.html" target="_blank">link</a>',
        opts: {'link-req-noopener': false},
        output: 0
    }, {
        desc: 'should pass when there is no target="_blank" attribute',
        input: '<a href="index.html">index</a>',
        opts: {'link-req-noopener': true},
        output: 0
    }, {
        desc: 'should fail on a link with target="_blank" but no rel attribute',
        input: '<a href="https://site.com" target="_blank">',
        opts: {'link-req-noopener': true},
        output: 1
    }, {
        desc: 'should fail on a link with target="_blank" but no rel attribute',
        input: '<a href="http://othersite.com"\ntarget=_blank rel="nofollow">',
        opts: {'link-req-noopener': true},
        output: 1
    }, {
        desc: 'should pass a link with rel="noopener"',
        input: '<a href="https://site.com" rel="noopener" target="_blank">',
        opts: {'link-req-noopener': true},
        output: 0
    }, {
        desc: 'should pass a link with rel=noreferrer',
        input: '<a href="https://site.com" target="_blank" rel=noreferrer>',
        opts: {'link-req-noopener': true},
        output: 0
    }
];
