// Given the raw html text, produce a function that transforms an index
// into a line and column number. Indices must be passed to the resulting
// function in order.
module.exports.getLineColFunc = function (htmlText, lineCol, offset) {
    if (offset === undefined) { offset = 1; }
    var lastInd = 0,
        line = 0,
        col = 0;
    if (lineCol && lineCol[0] && lineCol[1]) {
        line = lineCol[0];
        col = lineCol[1];
    }
    return function (i) {
        if (i < lastInd) {
            throw new Error('Index passed to line/column' + ' function (' + i + ') does not keep with order (last was ' + lastInd + ')');
        }
        while (lastInd < i) {
            if (htmlText[lastInd] === '\n') {
                col = 0;
                line++;
            } else {
                col++;
            }
            lastInd++;
        }
        return [line + offset, col + offset];
    };
};
