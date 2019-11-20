const fs = require('fs');
const path = require('path');
const cliUtils = require('chameleon-tool-utils');
const partRegExp = /<\s*(script)\s*([^>]*?)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/g;
const paramRegExp = /([^\s\=]+)=?(['"])?([^\s\=\'\"]*)\2/g;

function _retrieveInterfaceContent(filePath = null, currentWorkspace = '') {
  let fileContent = '';
  let splitParts = {};
  let include = null;

  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    // console.warn("cml-interface-parser:", err.message);
  }
  if (fileContent) {
    splitParts = cliUtils.splitParts({ content: fileContent });
  }
  if (splitParts.customBlocks && splitParts.customBlocks.length) {
    splitParts.customBlocks.forEach(part => {
      if (part && (part.type === 'include')) {
        include = part;
      }
    });
  }

  if (include && include.attrs && include.attrs.src) {
    let nextPath = path.resolve(path.dirname(filePath), include.attrs.src);
    if (currentWorkspace) {
      let pathObj = path.parse(include.attrs.src);
      pathObj.base = pathObj.name;
      nextPath = cliUtils.findInterfaceFile(currentWorkspace, filePath, path.format(pathObj));
      if (nextPath.filePath) {
        nextPath = nextPath.filePath;
      }
    }
    return _retrieveInterfaceContent(nextPath, currentWorkspace);
  }
  return fileContent;
}

function getContent(filePath = null, currentWorkspace = '') {
  let fileRawContent = ''; let interfaceContent = '';
  fileRawContent = _retrieveInterfaceContent(filePath, currentWorkspace);

  fileRawContent.replace(partRegExp, (match, type, rawAttribute, definationContent) => {
    !interfaceContent && rawAttribute.replace(paramRegExp, (attrMatch, attrName, mark, attrValue) => {
      if (attrName === 'cml-type' && attrValue === 'interface') {
        interfaceContent = definationContent;
      }
    });
  });
  return interfaceContent;
}

module.exports = {
  getContent
}
