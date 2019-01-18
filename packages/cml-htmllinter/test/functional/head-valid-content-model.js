module.exports = [
    {
        desc: 'head-div should pass when head-valid-content-model set to false',
        input: '<head><div></div></head>',
        opts: { 'head-valid-content-model': false },
        output: 0
    }, {
        desc: 'head-div should fail when head-valid-content-model set to true',
        input: '<head><div></div></head>',
        opts: { 'head-valid-content-model': true },
        output: 1
    }, {
        desc: 'should pass when no head is present',
        input: '<html><body></body></html>',
        opts: { 'head-valid-content-model': true },
        output: 0
    }, {
        desc: 'legal elements in head should pass',
        input: '<head><title></title><link></link><script></script><style></style><template></template><noscript></noscript><meta></meta></head>',
        opts: { 'head-valid-content-model': true },
        output: 0
    }, {
        desc: 'illegal elements in head should fail',
        input: '<head><title></title><link></link><div></div></head>',
        opts: { 'head-valid-content-model': true },
        output: 1
   }, {
        desc: 'multiple illegal elements should all fail',
        input: '<head><div></div><h1></h1><a></a></head>',
        opts: { 'head-valid-content-model': true },
        output: 3
   }, {
        desc: 'empty head should pass',
        input: '<head></head>',
        opts: { 'head-valid-content-model': true },
        output: 0
    }
];
