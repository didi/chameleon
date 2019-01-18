/**
 * @fileOverview to wrap object leterals with _px2rem()
 */

const escodegen = require('escodegen')
const config = require('../config')
const bindingStyleNamesForPx2Rem = config.get()['bindingStyleNamesForPx2Rem']

const { ast } = require('../util')
const { getCompiler } = require('../components')
const { getTransformer } = require('wxv-transformer')

function transformArray (ast, tagName, rootValue) {
  const elements = ast.elements
  for (let i = 0, l = elements.length; i < l; i++) {
    const element = elements[i]
    const result = transformNode(element, tagName, rootValue)
    if (result) {
      elements[i] = result
    }
  }
  return ast
}

/**
 * transform ConditionalExpressions. e.g.:
 *  :style="a ? b : c" => :style="_px2rem(a, rootValue) ? _px2rem(b, rootValue) : _px2rem(c, rootValue)"
 * @param {ConditionalExpression} ast
 */
function transformConditional (ast, tagName, rootValue) {
  ast.consequent = transformNode(ast.consequent, tagName, rootValue)
  ast.alternate = transformNode(ast.alternate, tagName, rootValue)
  return ast
}

/**
 * transform :style="{width:w}" => :style="{width:_px2rem(w, rootValue)}"
 * This kind of style binding with object literal is a good practice.
 * @param {ObjectExpression} ast
 */
function transformObject (ast, tagName, rootValue) {
  const compiler = getCompiler(tagName)
  if (compiler) {
    return compiler.compile(ast, bindingStyleNamesForPx2Rem, rootValue, transformNode)
  }
  const properties = ast.properties
  for (let i = 0, l = properties.length; i < l; i++) {
    const prop = properties[i]
    const keyNode = prop.key
    const keyType = keyNode.type
    const key = keyType === 'Literal' ? keyNode.value : keyNode.name
    if (bindingStyleNamesForPx2Rem.indexOf(key) > -1) {
      prop.value = transformNode(prop.value, tagName, rootValue, true/*asPropValue*/)
    }
  }
  return ast
}

function transformLiteral (...args) {
  // not to transform literal string directly since we don't know
  // if we could use 0.5px to support hairline unless in runtime.
  return transformAsWhole(...args)
}

/**
 * type = 'Identifier'
 * @param {Identifier} ast
 */
function transformIdentifier (...args) {
  return transformAsWhole(...args)
}

/**
 * transform MemberExpression like :styles="myData.styles"
 */
function transformMember (...args) {
  return transformAsWhole(...args)
}

/**
 * transform CallExpression like :stylles="getMyStyles()"
 */
function transformCall (ast, ...args) {
  const name = ast.callee.name
  if (name && name.match(/_processExclusiveStyle|_px2rem/)) {
    return ast // already transformed.
  }
  return transformAsWhole(ast, ...args)
}

/**
 * transform a value object for a property in a object expression.
 * @param {Literal || Identifier} ast a value expression in object literal.
 */
function transformAsValue (ast, tagName, rootValue) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: '_px2rem'
    },
    arguments: [ast, { type: 'Literal', value: rootValue }]
  }
}

/**
 * transform :style="expression" => :style="_px2rem(expression, opts)" directly
 * wrapping with _px2rem or _processExclusiveStyle function.
 * //////////////////////
 * support node type:
 *  - MemberExpression
 *  - Identifier
 *  - CallExpression
 * //////////////////////
 * not support:
 *  - ObjectExpression
 *  - ConditionalExpression
 *  - ArrayExpression
 */
function transformAsWhole (ast, tagName, rootValue) {
  let callName = '_px2rem'
  const args = [ast, { type: 'Literal', value: rootValue }]
  const transformer = getTransformer(tagName)
  if (transformer) {
    // special treatment for exclusive styles, such as text-lines
    callName = '_processExclusiveStyle'
    args.push({
      type: 'Literal',
      value: tagName,
    })
  }
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: callName
    },
    arguments: args
  }
}

/**
 * @param {boolean} asPropValue: whether this ast node is a value node for a style
 * object. If it is, we shouldn't use _processExclusiveStyle.
 */
function transformNode (ast, tagName, rootValue, asPropValue) {
  if (asPropValue) {
    return transformAsValue(ast, tagName, rootValue)
  }
  const type = ast.type
  switch (type) {
    // not as whole types.
    case 'ArrayExpression':
      return transformArray(ast, tagName, rootValue)
    case 'ConditionalExpression':
      return transformConditional(ast, tagName, rootValue)
    case 'ObjectExpression':
      return transformObject(ast, tagName, rootValue)
    // as whole types.
    case 'Identifier':
      return transformIdentifier(ast, tagName, rootValue)
    case 'CallExpression':
      return transformCall(ast, tagName, rootValue)
    case 'MemberExpression':
      return transformMember(ast, tagName, rootValue)
    case 'Literal':
      return transformLiteral(ast, tagName, rootValue)
    default: {
      console.warn('[weex-vue-precompiler]: current expression not in transform lists:', type)
      console.log('[weex-vue-precomiler]: current ast node:', ast)
      return transformAsWhole(ast, tagName, rootValue)
    }
  }
}

function styleBindingHook (
  el,
  attrsMap,
  attrsList,
  attrs,
  staticClass
) {
  try {
    const styleBinding = el.styleBinding
    if (!styleBinding) {
      return
    }
    const parsedAst = ast.parseAst(styleBinding.trim())
    const { rootValue } = this.config.px2rem
    const transformedAst = transformNode(parsedAst, el._origTag || el.tag, rootValue)
    const res = escodegen.generate(transformedAst, {
      format: {
        indent: {
          style: ' '
        },
        newline: '',
      }
    })
    el.styleBinding = res
  } catch (err) {
    console.log(`[weex-vue-precompiler] ooops! There\'s a err`)
  }
}

module.exports = styleBindingHook
