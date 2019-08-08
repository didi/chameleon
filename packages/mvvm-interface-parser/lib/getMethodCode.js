const cmlUtils = require('chameleon-tool-utils');
const fs = require('fs');
const {resolveRequire} = require('./resolveRequire.js');


module.exports = function({interfacePath, content, cmlType}) {

  let devDeps = [];

  function getMethod(filePath, content) {
    if (filePath !== interfacePath) {
      devDeps.push(filePath);
    }

    let parts = cmlUtils.splitParts({content});
    let include = [];
    for (let i = 0;i < parts.customBlocks.length;i++) {
      if (parts.customBlocks[i].type === 'include') {
        include.push(parts.customBlocks[i]);
      }
    }
    let methodScript = null;
    for (let i = 0;i < parts.script.length;i++) {
      if (~parts.script[i].cmlType.split(',').indexOf(cmlType)) {
        methodScript = parts.script[i];
      }
    }

    if (methodScript) {
      return {
        filePath,
        part: methodScript
      }
    }

    for (let i = include.length - 1; i >= 0; i--) {
      let item = include[i];
      if (item) {
        if (!item.attrs.src) {
          throw new Error(`not define include src attribute: ${filePath}`)
        }
        let newFilePath = cmlUtils.resolveSync(filePath, item.attrs.src);
        if (!cmlUtils.isFile(newFilePath)) {
          throw new Error(`not find file: ${newFilePath}`)
        }
        let newContent = fs.readFileSync(newFilePath, {encoding: 'utf-8'})
        return getMethod(newFilePath, newContent);
      }
    }
    return null;
  }


  function getRawContent() {
    let result = getMethod(interfacePath, content);
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
      throw new Error(`not find <script cml-type='${cmlType}'></script> in ${interfacePath}`)
    }
  }

  let {content: newContent, contentFilePath} = getRawContent();

  // 需要对原有content中的所有引用路径做解析 解析为绝对路径。
  return {
    content: resolveRequire({content: newContent, oldFilePath: contentFilePath, newFilePath: interfacePath}),
    devDeps,
    contentFilePath
  }
}
