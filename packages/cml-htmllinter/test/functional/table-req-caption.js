module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<table></table>',
        opts: { 'table-req-caption': false },
        output: 0
    },
    {
        desc: 'should fail when no caption is present',
        input: '<table></table>',
        opts: { 'table-req-caption': true },
        output: 1
    },
    {
        desc: 'should fail when a caption is a grand-child',
        input: '<table><td><caption>Hello</caption></td></table>',
        opts: { 'table-req-caption': true },
        output: 1
    },
    {
        desc: 'should fail when a caption is a sibling',
        input: '<table></table><caption>Hello</caption>',
        opts: { 'table-req-caption': true },
        output: 1
    },
    {
        desc: 'should fail twice with two tables',
        input: '<table></table><table><caption>Hello</caption></table><table></table>',
        opts: { 'table-req-caption': true },
        output: 2
    },
    {
        desc: 'should pass even if it is the last child',
        input: '<table><p>Hey</p><p>Hey</p><p>Hey</p><p>Hey</p><p>Hey</p><caption>Hello</caption></table>',
        opts: { 'table-req-caption': true },
        output: 0
    }
];