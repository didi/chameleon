const traverse = require('@babel/traverse')['default'];
const utils = require('../utils');

/**
 * 获取接口定义
 *
 * @param  {Object} ast ast
 * @return {Object}     分析结果
 */
const getInterfaces = (ast) => {
  let result = {
    name: '',
    properties: {}
  };
  ast.program.body.forEach(function (node) {
    if (node.type == 'InterfaceDeclaration') {
      let interfaceName = node.id.name;
      result.name = interfaceName;
      result.loc = {
        line: node.id.loc.start.line,
        column: node.id.loc.start.column
      };
      node.body.properties.map((property) => {
        result.properties[property.key.name] = {
          type: property.value.type.replace(/TypeAnnotation/g, ''),
          line: property.key.loc.start.line,
          column: property.key.loc.start.column
        };
      });
    }
  });
  return result;
};

/**
 * 获取类定义
 * @param   {Object} ast ast
 * @param   {Object} isComp a flag indentify whether the ast is component or an interface portion
 * @return  {Object}     类定义
 */
const getClass = (ast, isComp) => {
  return isComp ? getCompClassDef(ast) : getInterfacePortionClassDef(ast);
};


function getCompClassDef(ast) {
  let classes = [];
  let clazz = {
    interfaces: [],
    properties: [],
    events: [],
    methods: []
  };

  traverse(ast, {
    ClassDeclaration(path) {
      // 接口
      if (path.node['implements']) {
        path.node['implements'].forEach(implament => {
          clazz.interfaces.push(implament.id.name);
        });
      }

      path.node.body.body.forEach(define => {
        if (define.key.name == 'props') {
          define.value.properties.forEach(property => {
            clazz.properties.push(property.key.name);
          });
        }
        else if (define.key.name == 'methods') {
          define.value.properties.filter(property => {
            return property.type === 'ObjectMethod';
          }).forEach(property => {
            clazz.methods.push(property.key.name);
          });
        }
      });

      classes.push(clazz);
    },
    MemberExpression(path) {
      if (!path.node.computed && path.get('object').isThisExpression() && path.get('property').isIdentifier()) {
        if (path.node.property.name === '$cmlEmit') {
          let parentNode = path.findParent(path => path.isCallExpression());
          if (parentNode && parentNode.get('arguments')) {
            let event = null;
            let nameArg = parentNode.get('arguments')[0];
            if (nameArg.isStringLiteral()) {
              event = {
                event: nameArg.node.value,
                line: nameArg.node.loc.start.line,
                column: nameArg.node.loc.start.column
              };
            } else if (nameArg.isIdentifier()) {
              let argBinding = nameArg.scope.getBinding(nameArg.node.name);
              let possibleInit = argBinding ? argBinding.path.node.init : null;
              // For now, we only check just one jump along its scope chain.
              if (possibleInit && possibleInit.type === 'StringLiteral') {
                event = {
                  event: possibleInit.value,
                  line: nameArg.node.loc.start.line,
                  column: nameArg.node.loc.start.column
                };
              }
            }
            if (event) {
              clazz.methods.push(event.event);
              clazz.events.push(event);
            }
          }
        }
      }
    }
  });

  return classes;
}

function getInterfacePortionClassDef(ast) {
  let classes = [];

  traverse(ast, {
    enter(path) {
      if (path.node.type == 'ClassDeclaration') {
        let clazz = {
          interfaces: [],
          properties: [],
          events: [],
          methods: []
        };

        // 接口
        if (path.node['implements']) {
          path.node['implements'].forEach(implament => {
            clazz.interfaces.push(implament.id.name);
          });
        }

        path.node.body.body.forEach(define => {
          if (define.type == 'ClassProperty') {
            clazz.properties.push(define.key.name);
          }
          else if (define.key.name == 'methods') {
            define.value.properties.filter(property => {
              return property.type === 'ObjectMethod';
            }).forEach(property => {
              clazz.methods.push(property.key.name);
            });
          }
        });

        classes.push(clazz);
      }
    }
  });

  return classes;
}


/**
 * 校验接口与脚本
 *
 * @param  {Object}  interfaceAst 接口ast
 * @return {Array}                数组
 */
const checkScript = async (result) => {
  let validPlatforms = Object.keys(result)
    .filter(platform => {
      return platform && (!~['json', 'template', 'style', 'script'].indexOf(platform));
    })
    .filter(platform => {
      return platform && (platform != 'interface');
    });
  // add a script type for multi-file components.
  result['interface'] && validPlatforms.concat('script').forEach(platform => {
    let script;
    let isComp = (platform === 'script');
    if (result[platform] && result[platform].ast) {
      script = result[platform];
    }
    if (result['interface'] && result['interface'].ast && script && script.ast) {
      const interfaceDefine = getInterfaces(result['interface'].ast);
      const classDefines = getClass(script.ast, isComp);
      classDefines.forEach(clazz => {
        let define = null;
        clazz.interfaces.forEach(interfaceName => {
          define = interfaceDefine.name === interfaceName ? interfaceDefine.properties : null;
          if (!define) {
            result['interface'].messages.push({
              msg: `The implement class name: "${interfaceName}" used in file: "${utils.toSrcPath(script.file)}" doesn\'t match the name defined in it\'s interface file: "${utils.toSrcPath(result['interface'].file)}"`
            });
            return;
          }
          for (let key of Object.keys(define)) {
            if ((define[key] && define[key].type == 'Generic') && clazz.properties.indexOf(key) == -1) {
              result['interface'].messages.push({
                line: define[key].line,
                column: define[key].column,
                token: key,
                msg: `interface property "${key}" is not defined for platform ${script.platform} in file "${utils.toSrcPath(script.file)}"`
              });
            }
            else if ((define[key] && define[key].type == 'Function' && clazz.methods.indexOf(key) === -1)) {
              result['interface'].messages.push({
                line: define[key].line,
                column: define[key].column,
                token: key,
                msg: `interface method "${key}" is not defined for platform ${script.platform} in file "${utils.toSrcPath(script.file)}"`
              });
            }
          }
        });

        define && clazz.events.forEach(event => {
          if (!define[event.event] || (define[event.event] && (define[event.event].type != 'Function'))) {
            script.messages.push({
              line: event.line,
              column: event.column,
              token: event.event,
              msg: 'event "' + event.event + '" is not defined in interface file "' + utils.toSrcPath(result['interface'].file) + '"'
            });
          }
        });
      });
    }
  });
};


module.exports = checkScript;
