const parse = require('@babel/parser').parse;
const config = require('../config/parser-config');
const traverse = require('@babel/traverse')["default"];

const Map = {
  watch: 'watcher',
  computed: 'computed property',
  methods: 'method'
};

const handleProperty = function (property, propertyName, messages) {
  if (property.get('value').isArrowFunctionExpression()) {
    let node = property.get('key').node;
    let name = node.name;
    messages.push({
      line: node.loc.start.line,
      column: node.loc.start.column + 1,
      msg: Map[propertyName]
        ? (Map[propertyName] + ' "' + name + '" cannot be used as an arrow function')
        : ('lifecycle hook "' + name + '" cannot be used as an arrow function')
    });

  }
};

/**
 * 校验语法
 *
 * @param  {Object} part 片段
 * @return {Object}      语法检查结果
 */
const checkSyntax = function (part) {
  const messages = [];
  const opts = config.script;
  let ast;
  try {
    ast = parse(part.content, opts);
  }
  catch (err) {
    messages.push({
      line: err.loc.line,
      column: err.loc.column + 1,
      msg: err.message.replace(/ \((\d+):(\d+)\)$/, '')
    });
  }
  try {
    traverse(ast, {
      enter(path) {
        if (path.isClassProperty() && path.node) {
          switch (path.node.key.name) {
            case 'watch':
            case 'computed':
            case 'methods':
              let properties = path.get('value').get('properties');
              if (properties.forEach) {
                (properties || []).forEach(property => {
                  handleProperty(property, path.node.key.name, messages);
                });
              }
              break;
            case 'beforeCreate':
            case 'created':
            case 'beforeMount':
            case 'mounted':
            case 'beforeDestroy':
            case 'destroyed':
              handleProperty(path, path.node.key.name, messages);
              break;
            default:
              break;
          }
        }

      }
    });
  }
  catch (e) {
    console.log(e);
  }


  return {
    start: part.line,
    ast,
    messages
  };
}

module.exports = function (part) {
  return checkSyntax(part);
};
