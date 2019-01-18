module.exports = [
    {
        desc: 'title-max-len should pass when set to false',
        input: '<head><title>looooooooooooooooooooooooooooooooooooooooo'
            + 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
            + 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
            + 'ooooooooooooooooooooooooooooooooooooooong</title></head>',
        opts: { 'title-max-len': false },
        output: 0
    }, {
        desc: 'title-max-len should pass when the title fits requirements',
        input: '<head><title>Title!</title></head>',
        opts: { 'title-max-len': 60 },
        output: 0
    }, {
        desc: 'title-max-len should fail for long titles',
        input: '<head><title>Tiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'
            + 'iiiiiiiiiiiiiiiiiiiitle</title></head>',
        opts: { 'title-max-len': 60 },
        output: 1
    }, {
        desc: 'title-max-len should fail for short maximum lengths',
        input: '<head><title>Title!</title></head>',
        opts: { 'title-max-len': 4 },
        output: 1
    }
];
