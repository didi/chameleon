var knife = require('../knife'),
    Issue = require('../issue');

module.exports = {
    name: 'input-radio-req-name',
    on: ['tag'],
    filter: ['input'],
    desc: 'If set, each radio-type input must have a nonempty name attribute.'
};

module.exports.lint = function (element, opts) {
    // if it's not a radio-type input, ignore it
    var a = element.attribs;
    if (!(a.type && a.type.value === 'radio')) {
        return [];
    }

    if (knife.hasNonEmptyAttr(element, 'name')) {
        return [];
    }

    return new Issue('E034', element.openLineCol);
};
