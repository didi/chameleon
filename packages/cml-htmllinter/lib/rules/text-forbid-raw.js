var Issue = require('../issue');

module.exports = {
    name: 'text-forbid-raw',
    on: ['text'],
    hooks: ['skip-empty-text'],
    desc: 'All text must be wrapped with a text tag.'
};

function getPosOffset(str) {
    let fistAlpha = /(\S)/.exec(str);
    let linesBefore = str.substring(0, fistAlpha.index).split('\n');

    return [linesBefore.length - 1, linesBefore[linesBefore.length - 1].length];
}

module.exports.lint = function (element, opts) {
    let parentEle = element.parent;    
    if(!parentEle || parentEle.type != 'tag' || parentEle.name != 'text') {
        let posOffset = getPosOffset(element.data);
        return new Issue('E071', [element.lineCol[0] + posOffset[0], posOffset[0] > 0 ? (posOffset[1] + 1) : (element.lineCol[1] + posOffset[1])]);
    }
    return [];
};