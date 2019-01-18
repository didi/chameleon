const fs = require('fs');
const partRegExp = /<\s*(script)\s*([^>]*?)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/g;
const paramRegExp = /([^\s\=]+)=?(['"])?([^\s\=\'\"]*)\2/g;

function getContent(filePath = null) {
  let fileRawContent = ''; let interfaceContent = '';

  try {
    filePath && (fileRawContent = fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    // console.warn("cml-interface-parser:", err.message);
  }

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
