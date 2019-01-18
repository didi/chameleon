module.exports = [
    {
        desc: 'should match spaces when configured for tabs',
        input: [
            '<body>',
            '  <p>hello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'tabs' },
        output: 1
    }, {
        desc: 'should match tabs when configured for spaces',
        input: [
            '<body>',
            '\t<p> ello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'spaces' },
        output: 1
    }, {
        desc: 'should match tabs when configured for spaces',
        input: [
            '<body>',
            '\t<p> ello</p>',
            '\t<p> ello</p>',
            '\t<p> ello</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'spaces' },
        output: 3
    },
    {
        desc: 'should match inmixed indents',
        input: [
            '<body>',
            '\t <p>this not okay</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'spaces' },
        output: 1
    }, {
        desc: 'should match mixed indents starting with spaces',
        input: [
            '<body>',
            '    <p>this not okay</p>',
            '    <p>this not okay</p>',
            '\t\t\t\t<p>this not okay</p>',
            '\t\t\t\t<p>this not okay</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'nonmixed' },
        output: 2
    }, {
        desc: 'should match mixed indents starting with tabs',
        input: [
            '<body>',
            '\t\t<p>this not okay</p>',
            '\t\t<p>this not okay</p>',
            '      <div>Hey</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'nonmixed' },
        output: 1
    }, {
        desc: 'should not match on false',
        input: [
            '<body>',
            '\t\t<p>this not okay</p>',
            '\t\t<p>this not okay</p>',
            '      <div>Hey</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': false },
        output: 0
    }, {
        desc: 'should work with lines containing only tabs',
        input: '\t',
        opts: { 'indent-style': false },
        output: 0
    },
    {
        desc: 'indent-width should match indents with the wrong number of spaces',
        input: [
            '<body>',
            '       <p>this not okay</p>',
            '  \t  <p>this not okay</p>',
            '        <div>Hey</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': 4 },
        output: 2
    }, {
        desc: 'indent-width should not match when set to false',
        input: [
            '<body>',
            '       <p>this not okay</p>',
            '  \t  <p>this not okay</p>',
            '        <div>Hey</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': false },
        output: 0
    }, {
        desc: 'indent-width should not fail with all-whitespace lines',
        input: [
            '<body>',
            '        <p>okay</p>',
            '',
            '  \t',
            '        ',
            '</body>',
            '    '
        ].join('\n'),
        opts: { 'indent-width': 4 },
        output: 1
    }, {
        desc: 'indent-width should work with strange indent widths',
        input: [
            '<body>',
            '          <p>this is fine</p>',
            '        <p>this not okay</p>',
            '\t        <div>Hey</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': 5 },
        output: 2
    },
    {
        desc: 'indent-width-cont should match indents with the wrong number of spaces starting with <',
        input: [
            '<body>',
            '        <p>eight spaces</p>',
            '          <p>ten spaces</p>',
            '     <div>five spaces</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': 4, 'indent-width-cont': true },
        output: 2
    }, {
        desc: 'indent-width-cont should work with strange indent widths',
        input: [
            '<body>',
            '        <p>eight spaces</p>',
            '          <p>ten spaces</p>',
            '     <div>five spaces</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': 5, 'indent-width-cont': true },
        output: 1
    }, {
        desc: 'indent-width-cont should not match indents that do not start with <',
        input: [
            '<body>',
            '        <div>eight spaces',
            '          ten spaces',
            '     five spaces</div>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-width': 4, 'indent-width-cont': true },
        output: 0
    }, {
        desc: 'indent-width-cont should allow spaces after tabs but not before',
        input: [
            '<body>',
            '\t<div id="a"',
            '\t     class="b">',
            '\t     partial tabbing',
            '\t </div>',
            '  \t<p>illegal</p>',
            '</body>'
        ].join('\n'),
        opts: { 'indent-style': 'tabs', 'indent-width-cont': true },
        output: 2
    }, {
        desc: 'indent-width-cont should check lines with only spaces',
        input: [
            '<div>',
            '     ',
            '    <input type="button" />',
            '</div>',
            '<script>',
            '  var foo = 1;',
            '</script>'
        ].join('\n'),
        opts: { 'indent-width': 4, 'indent-width-cont': true },
        output: 1
    }
];
