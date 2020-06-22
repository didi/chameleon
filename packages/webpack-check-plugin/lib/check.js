const parser = require('@babel/parser');
const traverse = require('babel-traverse');
const uniq = require('lodash.uniq');
let DEFAULT_TOKENS_MAP = require('./tokensMap.js');

// 这个path是否有需要校验的token
const needCheck = function (path, tokenList) {
  let flag = false;
  for (let i = 0;i < tokenList.length;i++) {
    let token = tokenList[i];
    // 判断一个token是否是一个变量
    if (checkToken(path, token)) {
      // 如果是对象中的key是需要忽略的
      flag = token;
      break;
    }
  }

  return flag;
};

// 是变量，并且不是对象的key值
function checkToken(path, token) {
  // if( path.node.id.type === "Identifier" && path.node.id.name === token ) {
  if (path.isIdentifier({ name: token })) {

    // 是对象的key值
    //   const api = {
    //     name: weex,
    //     };
    let isObjectKey = path.parent.type === 'ObjectProperty' && path.parentKey === 'key'
    // 对象成员
    /**
     * var a = {
     *  weex: 'a'
     * }
     * console.log(weex.a);
     */
    let isObjectMember = path.parent.type === 'MemberExpression' && path.parentKey === 'property'

    return !(isObjectKey || isObjectMember)
  } else {
    return false;
  }

}

const check = function (code, options) {
  let {
    cmlType: type,
    tokensMap = DEFAULT_TOKENS_MAP } = options;
  const TOKENS_MAP = tokensMap;
  // const TOKENS_ALL = uniq(TOKENS_MAP.WEB.concat(TOKENS_MAP.WEEX).concat(TOKENS_MAP.WX));
  // TOKENS_MAP.ALL = TOKENS_ALL;
  type = type.toUpperCase();
  const ast = parser.parse(code, {
    plugins: ['flow', 'dynamicImport'],
    sourceType: 'module'
  });
  let tokenList = [];

  if (type === 'ALL') {
    // 都要校验
    tokenList = TOKENS_MAP[type]
  } else {
    Object.keys(TOKENS_MAP).forEach(key => {
      // 把自身的和All的去掉，其他端的token放进去
      if (key !== type && key !== 'ALL') {
        tokenList = tokenList.concat(TOKENS_MAP[key]);
      }
    })
    // 然后要把自身的全局变量去掉
    for (let i = 0;i < tokenList.length;) {
      if (~TOKENS_MAP[type].indexOf(tokenList[i])) {
        tokenList.splice(i, 1);
      } else {
        i++;
      }
    }
  }
  tokenList = uniq(tokenList);

  const tokens = [];
  traverse['default'](ast, {
    enter: (path) => {
      // path是一个上下文
      // 需要校验的变量值
      let token = needCheck(path, tokenList);
      // 如果存在该token
      if (token) {
        let globalVariable = true;
        // 当前作用域
        let next = path.scope;

        do {
          // 如果当前作用域存在该变量 就不是全局变量
          if (next.hasOwnBinding(token)) {
            globalVariable = false;
            break;
          }
        }
        // eslint-disable-next-line
        while (next = next.parent);

        if (globalVariable) {
          tokens.push({
            loc: path.node.loc.start,
            name: token
          });
        }
      }
    }
  });
  return tokens;
}


module.exports = check;
