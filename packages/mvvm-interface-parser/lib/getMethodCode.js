const cmlUtils = require('chameleon-tool-utils');
const fs = require('fs');
const path = require('path');
const {resolveRequire} = require('./resolveRequire.js');

module.exports = function({interfacePath, content, cmlType, resolve}) {

  let devDeps = [];

  function getMethod(filePath, content) {
    if (filePath !== interfacePath) {
      devDeps.push(filePath);
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
    let methodScript = null;
    for (let i = 0;i < parts.script.length;i++) {
      if (parts.script[i].cmlType === cmlType) {
        methodScript = parts.script[i];
      }
    }

    if (methodScript) {
      return {
        filePath,
        part: methodScript
      }
    }

    if (include) {
      if (!include.attrs.src) {
        throw new Error(`not define src attribute: ${filePath}`)
      }
      let newFilePath = path.resolve(path.dirname(filePath), include.attrs.src);
      if (!cmlUtils.isFile(newFilePath)) {
        throw new Error(`not find file: ${newFilePath}`)
      }
      let newContent = fs.readFileSync(newFilePath, {encoding: 'utf-8'})
      return getMethod(newFilePath, newContent);
    }

    return null;


  }


  function getRawContent() {
    let result = getMethod(interfacePath, content);
    if (result) {
      let {part, filePath} = result;
      // script 有src属性的
      if (part.attrs && part.attrs.src) {
        let newFilePath = path.resolve(path.dirname(filePath), part.attrs.src);
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
      throw new Error(`not find <script cml-type='${cmlType}'></script> in ${interfacePath}`)
    }
  }

  let {content: newContent, contentFilePath} = getRawContent();

  // 需要对原有content中的所有引用路径做解析 解析为绝对路径。
  return {
    content: resolveRequire({content: newContent, filePath: contentFilePath, resolve}),
    devDeps,
    contentFilePath
  }
}
