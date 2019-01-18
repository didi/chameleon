const fs = require('fs');
const cliUtils = require('chameleon-tool-utils');

function getContent(filePath = null) {
  let fileRawContent = ''; let parts = {}; let scriptContent = '';
  try {
    filePath && (fileRawContent = fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    // console.warn("cml-interface-parser:", err.message);
  }

  parts = cliUtils.splitParts({content: fileRawContent});

  if (parts.script && parts.script.length) {
    scriptContent = parts.script.filter((item) => Object.keys(item.attrs).length === 0).map((item) => {
      return item.content;
    });
  }

  return scriptContent[0] || '';
}

module.exports = {
  getContent
}
