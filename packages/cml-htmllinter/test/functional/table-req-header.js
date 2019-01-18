module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<table></table>',
        opts: { 'table-req-header': false },
        output: 0
    },
    {
        desc: 'should fail when no header is present',
        input: '<table></table>',
        opts: { 'table-req-header': true },
        output: 1
    },
    {
        desc: 'should pass when header is present',
        input: '<table><tr><th>Doges</th></tr></table>',
        opts: { 'table-req-header': true },
        output: 0
    },
	{
        desc: 'should pass when th is not first cell in tr',
        input: '<table><tr><td>Shh</td><th>Doges</th></tr></table>',
        opts: { 'table-req-header': true },
        output: 0
    },
    {
        desc: 'should fail when th not encapsulated in a tr because that\'s technically not valid',
        input: '<table><th>Dog</th></table>',
        opts: { 'table-req-header': true },
        output: 1
    },
    {
        desc: 'should fail when header isn\'t at the top of the table',
        input: '<table><tr><td>goes woof</td></tr><tr><th>Dog</th></tr></table>',
        opts: { 'table-req-header': true },
        output: 1
    },
    {
        desc: 'should pass when table has caption and th',
        input: '<table><caption>DOGS</caption><tr><th>Hey</th></tr></table>',
        opts: { 'table-req-header': true },
        output: 0
    },
    {
        desc: 'should pass when table has caption and thead',
        input: '<table><caption>DOGS</caption><thead>Hey</thead></table>',
        opts: { 'table-req-header': true },
        output: 0
    },
	{
        desc: 'should pass when table has caption and text before thead',
        input: '<table>\n\t<caption>DOGS</caption>\n  <thead></thead>\n</table>',
        opts: { 'table-req-header': true },
        output: 0
    },
    {
        desc: 'should pass when table has caption and text before th',
        input: '<table>\n\t<caption>DOGS</caption>\n  <tr>\n\t  <td>Shh</td>\n  \t<th>Doges</th>\n  </tr>\n</table>',
        opts: { 'table-req-header': true },
        output: 0
    }
];
