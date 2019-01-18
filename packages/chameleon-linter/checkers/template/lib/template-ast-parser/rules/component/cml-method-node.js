const methodRegex = /c-bind:(\w+)/;

module.exports = {
  name: 'cml-method-node',
  on: 'cml',
  filter: {
    key: 'name',
    run: function(value) {
      return methodRegex.test(value);
    }
  }
}

module.exports.run = function(attr, opts) {
  let methodName = methodRegex.exec(attr.name)[1];
  return {
    name: methodName,
    pos: [attr.namePos[0], attr.namePos[1] + attr.name.indexOf(methodName)],
    prop: false,
    event: true
  };
}
