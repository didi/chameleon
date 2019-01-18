var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'attr-new-line',
    on: ['tag'],
    desc: [
'A non-negative integer, or "+0". If set, no more than this number of',
'attributes may be on the same row.',
'A value of 0 applies only to the first row, restricting subsequent rows',
'to one element, and a value of "+0" is the same but allows an attribute',
'to be on the first row if there is only one attribute.'
].join('\n'),
    process: function (o) {
        return o === '+0' ? o : proc.posInt(o);
    }
};

module.exports.lint = function(element, opts) {
    var option = opts[this.name];

    var total = Object.keys(element.attribs).length;
    if (total === 0 || (option === '+0' && total === 1)) {
        return [];
    }

    var rowLimit = Math.floor(option);

    var rows = Object.values(element.attribs).map(function (attr) {
        return attr.nameLineCol[0];
    }).sort();

    var firstRow = element.openLineCol[0],
        curRow = firstRow,
        n = 0,
        max = -1,
        first;

    rows.push(rows[rows.length - 1] + 1);
    rows.forEach(function (r) {
        if (r !== curRow) {
            if (curRow === firstRow) { first = n; }
            curRow = r;
            if (n > max) { max = n; }
            n = 0;
        }
        n++;
    });

    return (first <= rowLimit && max <= Math.max(1,rowLimit))
        ? []
        : new Issue('E037', element.openLineCol, { limit: rowLimit });
};
