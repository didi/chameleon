
const parser = require('@babel/parser');
const traverse = require('babel-traverse');
const parsePlugins = require('./parsePlugins.js');

/**
 * 获取定义 两个loader共用代码
 * 构建时的错误信息 直接throw Error
 *
 * @param  {string} code 代码片段
 * @return {Object}      接口及类型定义
 */
const getDefines = (code, filePath) => {
  const showErrorMessage = function(content) {
    throw new Error(`
    文件位置：${filePath}
    错误信息: ${content}`)
  }

  const ast = parser.parse(code, {
    plugins: parsePlugins,
    sourceType: 'module'
  });

  // 接口
  const interfaces = {};

  // 类型
  const types = {};

  // 类
  const classes = {};

  /**
   * 获取函数input类型
   *
   * @param  {Array} params 输入参数
   * @return {Array}       输入参数类型
   */
  const getInput = params => {
    let input = [];
    params.map(param => {
      if (param.typeAnnotation.type == 'GenericTypeAnnotation') {
        input.push(param.typeAnnotation.id.name);
      } else if (param.typeAnnotation.type == 'NullableTypeAnnotation') {
        // let nullableType = param.typeAnnotation.typeAnnotation.type.replace('TypeAnnotation','');
        let nullableType = getNodeType(param.typeAnnotation.typeAnnotation);
        input.push(`${nullableType}_cml_nullable_lmc_`)
      } else if (param.typeAnnotation.type == 'NullLiteralTypeAnnotation') {
        input.push('Null')
      } else {
        let dataType = param.typeAnnotation.type.replace('TypeAnnotation', '');
        dataType === 'Void' && (dataType = 'Undefined');
        input.push(dataType);
      }
    });

    return input;
  };

  /**
   * 获取节点type
   *
   * @param  {Object} typeNode 节点
   * @return {string}          类型
   */
  const getNodeType = typeNode => {
    if (typeNode.type == 'GenericTypeAnnotation') {
      return typeNode.id.name;
    } else if (typeNode.type == 'NullableTypeAnnotation') {
      // let nullableType = typeNode.typeAnnotation.type.replace('TypeAnnotation','');
      let nullableType = getNodeType(typeNode.typeAnnotation);

      return `${nullableType}_cml_nullable_lmc_`;
    } else if (typeNode.type == 'NullLiteralTypeAnnotation') {
      return "Null";
    } else {
      let typeName = typeNode.type.replace('TypeAnnotation', '');
      typeName === "Void" && (typeName = "Undefined")
      // 没有测试到什么时候是Union类型
      if (typeName == 'Union') {
        return typeNode.types.map(node => {
          const typeName = node.type.replace('TypeAnnotation', '');
          if (typeName == 'Generic') {
            return node.id.name;
          }
          return typeName;
        });
      }
      return typeName;
    }
  };

  /**
   * 递归产生type
   * @param {*} typeName
   * @param {*} node
   */
  function getTypeDefine(typeName, node) {
    let result;
    if (node.type === 'FunctionTypeAnnotation') {
      result = {
        input: getInput(node.params),
        output: getNodeType(node.returnType)
      };
      types[typeName] = result;
    } else if (node.type === 'ObjectTypeAnnotation') {
      result = {};
      node.properties.forEach(item => {
        result[item.key.name] = getTypeDefine(`${typeName}__${item.key.name}`, item.value);
      })
      types[typeName] = result;
    } else if (node.type === 'TupleTypeAnnotation') {
      result = [];
      // 数组只取第一个元素
      let length = node.types.length;
      if (length > 1) {
        showErrorMessage(`type ${typeName}定义的数组类型元素类型只能为一种`)
      } else if (length === 0) {
        showErrorMessage(`type ${typeName}未定义数组元素类型`)
      }
      result.push(getTypeDefine(`${typeName}__item`, node.types[0]));
      types[typeName] = result;

    } else {
      // 基本类型 获取type
      typeName = getNodeType(node);
    }
    return typeName;

  }

  traverse["default"](ast, {
    enter(path) {
      if (path.node.type == 'TypeAlias') {
        let tNode = path.node;
        let tName = tNode.id.name;
        getTypeDefine(tName, tNode.right);
      } else if (path.node.type === 'InterfaceDeclaration') {
        let iNode = path.node;
        let iName = iNode.id.name;
        let defines = {};

        interfaces[iName] = defines;
        if (iNode.body.type == 'ObjectTypeAnnotation') {
          iNode.body.properties.forEach(item => {
            if (item.method) {
              defines[item.key.name] = {
                input: getInput(item.value.params),
                output: getNodeType(item.value.returnType)
              };
            } else {
              defines[item.key.name] = getNodeType(item.value)
            }
          });
        }
      } else if (path.node.type === 'ClassDeclaration') {
        classes[path.node.id.name] = path.node["implements"].map(item => item.id.name);
      }
    }
  });

  return {
    ast: ast,
    defines: {
      types,
      interfaces,
      classes
    }
  };
};


module.exports = getDefines;
