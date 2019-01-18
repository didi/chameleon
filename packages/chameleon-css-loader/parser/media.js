

module.exports = function(source = '', targetType) {
  let reg = /@media\s*cml-type\s*\(([\w\s,]*)\)\s*/g;
  if (!reg.test(source)) {
    return source;
  }
  while (true) { // eslint-disable-line
    let result = reg.exec(source);
    if (!result) {break;}
    let cmlTypes = result[1] || '';
    cmlTypes = cmlTypes.split(',').map(item => item.trim());
    let isSave = ~cmlTypes.indexOf(targetType);

    let startIndex = result.index; // @media的开始

    let currentIndex = source.indexOf('{', startIndex); // 从第一个@media开始
    let signStartIndex = currentIndex; // 第一个{的位置
    if (currentIndex == -1) {
      throw new Error("@media cml-type format err");
    }

    let signStack = [];
    signStack.push(0);
    while (signStack.length > 0) {
      let index1 = source.indexOf('{', currentIndex + 1);
      let index2 = source.indexOf('}', currentIndex + 1);
      let index;
      // 都有的话 index为最前面的
      if (index1 !== -1 && index2 !== -1) {
        index = Math.min(index1, index2);
      } else {
        index = Math.max(index1, index2);
      }
      if (index === -1) {
        throw new Error("@media cml-type format err");
      }
      let sign = source[index];
      currentIndex = index;
      if (sign === '{') {
        signStack.push(signStack.length);
      } else if (sign === '}') {
        signStack.pop();
      }
    }

    // 操作source
    if (isSave) { // 保存的@media
      var sourceArray = Array.from(source);
      sourceArray.splice(startIndex, currentIndex - startIndex + 1, source.slice(signStartIndex + 1, currentIndex));
      source = sourceArray.join('');
    } else { // 删除的
      source = source.slice(0, startIndex) + source.slice(currentIndex + 1);
    }
    reg.lastIndex = 0;
  }

  return source;

}
