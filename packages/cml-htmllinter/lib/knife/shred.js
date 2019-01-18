/**
 * 'Shreds' the html by line for linting by line.
 * @param {String} html - your html.
 * @returns {String[]} the array of line objects.
 */
module.exports.shred = function (html) {
    // Take the HTML string
    // Return an array of {line, line number, index}
    var row = 1,
        ind = 0,
        shredded = [];

    while (html) {
        var len = html.search('[\r\n]') + 1;
        if (len === 0) { len = html.length; }
        else if (html[len - 1] === '\r' && html[len] === '\n') { len++; }
        shredded[row] = {
            line: html.substr(0, len),
            index: ind,
            row: row
        };
        row++; ind += len;
        html = html.slice(len);
    }

    return shredded;
};