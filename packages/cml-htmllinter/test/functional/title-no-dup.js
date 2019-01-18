module.exports = [
    {
        desc: 'title-no-dup should pass when set to false',
        input: '<head><title>Tile</title><title>No wait title</title>'
            + '<title>More titles for good measure</title></head>',
        opts: { 'title-no-dup': false },
        output: 0
    }, {
        desc: 'title-no-dup should pass when only one title is present',
        input: '<head><title>Title!</title></head>',
        opts: { 'title-no-dup': true },
        output: 0
    }, {
        desc: 'title-no-dup should fail when multiple titles are present',
        input: '<head><title>Title</title><title>Another title</title></head>',
        opts: { 'title-no-dup': true },
        output: 1
    }, {
        desc: 'title-no-dup should fail only once for many titles',
        input: '<head><title>Mr.</title><title>Dr.</title>'
            + '<title>Professor</title></head>',
        opts: { 'title-no-dup': true },
        output: 1
    }
]
