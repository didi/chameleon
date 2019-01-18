module.exports = [
    {
        desc: 'head-req-title should pass when set to false',
        input: '<head></head>',
        opts: { 'head-req-title': false },
        output: 0
    }, {
        desc: 'head-req-title should pass when a title is present',
        input: '<head><title>Title!</title></head>',
        opts: { 'head-req-title': true },
        output: 0
    }, {
        desc: 'head-req-title should fail when no title is present',
        input: '<head></head>',
        opts: { 'head-req-title': true },
        output: 1
    }, {
        desc: 'head-req-title should fail when title is empty',
        input: '<head><title></title></head>',
        opts: { 'head-req-title': true },
        output: 1
    }, {
        desc: 'head-req-title should pass when some title is nonempty',
        input: '<head><title></title><title>For real this time</title></head>',
        opts: { 'head-req-title': true },
        output: 0
    }
]
