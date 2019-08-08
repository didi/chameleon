const cmlUtils = require('chameleon-tool-utils');
const fs = require('fs');
/**
 * 1 先找到所有interface的定义部分
 * 2 校验是否一致 如果多个路径指向同一interface 则合并依赖
 */
module.exports = function({interfacePath, content}) {

  let result;
  let devDeps = []; // 所有interface上的路径都可能影响获取

  function getInterface(filePath, content) {
    if (filePath !== interfacePath) {
      devDeps.push(filePath);
    }
    if (!content) {
      content = fs.readFileSync(filePath, {encoding: 'utf-8'});
    }
    let parts = cmlUtils.splitParts({content});
    let include = [];
    for (let i = 0;i < parts.customBlocks.length;i++) {
      if (parts.customBlocks[i].type === 'include') {
        include.push(parts.customBlocks[i]);
      }
    }
    let interfaceScript = null;
    for (let i = 0;i < parts.script.length;i++) {
      if (parts.script[i].cmlType === 'interface') {
        if (interfaceScript) {
          throw new Error(`multi <script cml-type='interface'></script> has define in : ${filePath}`)
        } else {
          interfaceScript = parts.script[i];
        }
      }
    }
    if (interfaceScript) {
      if (!result) {
        if (interfaceScript.attrs && interfaceScript.attrs.src) {
          let newFilePath = cmlUtils.resolveSync(filePath, interfaceScript.attrs.src);
          if (!cmlUtils.isFile(newFilePath)) {
            throw new Error(`not find file: ${newFilePath}`)
          }
          devDeps.push(newFilePath);
          let newContent = fs.readFileSync(newFilePath, {encoding: 'utf-8'});
          result = {
            content: newContent,
            contentFilePath: newFilePath
          };
        } else {
          result = {
            content: interfaceScript.content,
            contentFilePath: filePath
          };
        }
      } else {
        if (result.contentFilePath !== filePath) {
          throw new Error(`multi <script cml-type='interface'></script> has define in : ${filePath} and ${result.filePath}`)
        }
      }
    }

    include.forEach(item => {
      if (!item.attrs.src) {
        throw new Error(`not define include src attribute in : ${filePath}`)
      }
      let newFilePath = cmlUtils.resolveSync(filePath, item.attrs.src);
      if (!cmlUtils.isFile(newFilePath)) {
        throw new Error(`not find file: ${newFilePath}`)
      }
      // 递归include的文件
      getInterface(newFilePath);
    })

  }

  getInterface(interfacePath, content);

  if (result) {
    return {
      content: result.content,
      devDeps,
      contentFilePath: result.contentFilePath
    };
  } else {
    throw new Error(`not find <script cml-type='interface'></script> in ${interfacePath}`)
  }
}
