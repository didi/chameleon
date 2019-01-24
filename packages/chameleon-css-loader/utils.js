const _ = {};
module.exports = _;
// 将字符串中的 单引号变成 双引号；
_.singlequot2doublequot = function (value) {
  return value.replace(/['']/g, '"');
}
// 用于将css样式值中的重复样式去掉
_.uniqueStyle = function(content) {
  const uniqueStyleKeyValue = {};
  const splitStyleKeyValue = content.split(';').filter(item => !!item.trim());
  splitStyleKeyValue.forEach((declaration) => {
    let {key, value} = _.getStyleKeyValue(declaration);
    if (!key || !value) {
      throw new Error('please check if the style that you write is correct')
    }
    uniqueStyleKeyValue[key] = value;
  });

  let result = [];
  Object.keys(uniqueStyleKeyValue).forEach(key => {
    result.push(`${key}:${uniqueStyleKeyValue[key]}`)
  })
  return result.join(';');
}
// 用于删除css样式的注释； /*width:100px;*/ ==> ''
_.disappearCssComment = function(content) {
  let commentReg = /\/\*[\s\S]*?\*\//g;
  return content.replace(commentReg, function (match) {
    return '';
  })
}
_.getStyleKeyValue = function(declaration) {
  let colonIndex = declaration.indexOf(':');
  let key = declaration.slice(0, colonIndex).trim();
  let value = declaration.slice(colonIndex + 1).trim();
  return {
    key, value
  }
}

