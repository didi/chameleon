const Tools = require('../../tools');

module.exports = {
  name: 'cml-prop-node',
  on: 'cml',
  filter: {
    key: 'name',
    run: function(value) {
      return !~['id', 'class', 'style', 'ref'].indexOf(value) && !/data-(.+)/.test(value) && !/c-(.+)/.test(value);
    }
  }
}

module.exports.run = function(attr, opts) {
  return {
    rawName: attr.name,
    name: Tools.dashtoCamelcase(attr.name),
    pos: attr.namePos,
    prop: true,
    event: false
  }
}
