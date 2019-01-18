module.exports = [
    {
        desc: 'should pass html-div when set to false',
        input: '<html><div></div></html>',
        opts: { 'html-valid-content-model': false },
        output: 0
    }, {
        desc: 'should fail html-div when set to true',
        input: '<html><div></div></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should pass head when no html is present',
        input: '<head></head>',
        opts: { 'html-valid-content-model': true },
        output: 0
    }, {
        desc: 'should pass html-head-body',
        input: '<html><head></head><body></body></html>',
        opts: { 'html-valid-content-model': true },
        output: 0
    }, {
        desc: 'should fail html-head-div-body',
        input: '<html><head></head><div></div><body></body></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should fail for each illegal element',
        input: '<html><div></div><head></head><div></div><body></body></html>',
        opts: { 'html-valid-content-model': true },
        output: 2
    }, {
        desc: 'should fail html-head-head',
        input: '<html><head></head><head></head></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should fail html-body-body',
        input: '<html><body></body><body></body></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should fail html-body-head',
        input: '<html><body></body><head></head></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should fail html-head-body-head once',
        input: '<html><head></head><body></body><head></head></html>',
        opts: { 'html-valid-content-model': true },
        output: 1
    }, {
        desc: 'should fail html-body-head-head twice',
        input: '<html><body></body><head></head><head></head></html>',
        opts: { 'html-valid-content-model': true },
        output: 2
    }, {
        desc: 'should pass html-head-body',
        input: '<html><head></head><body><div></div></body></html>',
        opts: { 'html-valid-content-model': true },
        output: 0
     }
];
