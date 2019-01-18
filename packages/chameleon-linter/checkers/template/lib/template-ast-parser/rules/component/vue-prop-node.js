const Tools = require('../../tools');
const propRegex = /^v-bind|^:/;

module.exports = {
  name: 'vue-prop-node',
  on: 'vue',
  filter: {
    key: 'name',
    run: function(value) {
      return propRegex.test(value);
    }
  }
}

module.exports.run = function(attr, opts) {
  let preArg = /^(?:\:|v-bind:)([\w-]*)/.exec(attr.name);
  let props = [];
  if (preArg) {
    preArg = preArg[1];
    props.push({
      rawName: preArg,
      name: Tools.dashtoCamelcase(preArg),
      pos: [attr.namePos[0], attr.namePos[1] + attr.name.indexOf(preArg)],
      prop: true,
      event: false
    });
  } else {
    props = Tools.getPropsFromObjectExpression(attr.value);
    props.map((prop) => {
      prop.rawName = prop.name;
      prop.name = Tools.dashtoCamelcase(prop.name);
      prop.pos = [attr.valuePos[0] + prop.pos[0] - 1, attr.valuePos[1] + prop.pos[1]];
      prop.prop = true; prop.event = false;
      return prop;
    });
  }
  return props;
}
