var Issue = require('../issue');

module.exports = {
    name: 'id-no-dup',
    table: {},
    on: ['tag'],
    desc: 'If set, values for the `id` attribute may not be duplicated across elements.'
};

module.exports.end = function () {
    // wipe previous table
    this.table = {};
};

module.exports.lint = function (element, opts) {
    // don't process the element if it doesn't have an id
    if (!element.attribs.hasOwnProperty('id')) {
        return [];
    }

    var id = element.attribs.id;

    // if we haven't seen the id before, remember it
    // and pass the element
    if (!this.table.hasOwnProperty(id.value)) {
        this.table[id.value] = element;
        return [];
    }

    // element has a duplicate id
    return new Issue('E012', id.valueLineCol, { id: id.value });
};
