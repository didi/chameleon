const cmlUtils = require('../../mvvm-script-parser/node_modules/chameleon-tool-utils/src');
const fs = require('fs');

module.exports = function({interfacePath, content}) {

  let devDeps = [];

  function getInterface(filePath, content) {
    if (filePath !== interfacePath) {
      devDeps.push(filePath);
    }
    if (!content) {
      content = fs.readFileSync(filePath, {encoding: 'utf-8'});
    }

    let parts = cmlUtils.splitParts({content});
    let include = null;
    for (let i = 0;i < parts.customBlocks.length;i++) {
      if (parts.customBlocks[i].type === 'include') {
        if (include) {
          throw new Error(`file just allow has only one <include></include>: ${filePath}`)
        }
        include = parts.customBlocks[i];
      }
    }
    let interfaceScript = null;
    for (let i = 0;i < parts.script.length;i++) {
      if (parts.script[i].cmlType === 'interface') {
        interfaceScript = parts.script[i];
      }
    }

    if (include && interfaceScript) {
      throw new Error(`file has <include></include> not allow has <script cml-type='interface'></script>: ${filePath}`)
    } else if (include === null && interfaceScript) {
      return {
        filePath: filePath,
        part: interfaceScript
      }
    } else if (include && interfaceScript === null) {
      if (!include.attrs.src) {
        throw new Error(`not define src attribute: ${filePath}`)
      }
      let newFilePath = cmlUtils.resolveSync(filePath, include.attrs.src);
      if (!cmlUtils.isFile(newFilePath)) {
        throw new Error(`not find file: ${newFilePath}`)
      }
      // 递归include的文件
      return getInterface(newFilePath);
    }

    return null;

  }

  let result = getInterface(interfacePath, content);
  if (result) {
    let {part, filePath} = result;
    // script 有src属性的
    if (part.attrs && part.attrs.src) {
      let newFilePath = cmlUtils.resolveSync(filePath, part.attrs.src);
      if (!cmlUtils.isFile(newFilePath)) {
        throw new Error(`not find file: ${newFilePath}`)
      }
      devDeps.push(newFilePath);
      let newContent = fs.readFileSync(newFilePath, {encoding: 'utf-8'});
      return {
        content: newContent,
        devDeps,
        contentFilePath: newFilePath
      };
    } else {
      return {
        content: result.part.content,
        devDeps,
        contentFilePath: result.filePath
      };
    }
  } else {
    throw new Error(`not find <script cml-type='interface'></script> in ${interfacePath}`)
  }
}
