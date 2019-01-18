const cmlUtils = require('chameleon-tool-utils');

module.exports = (content) => {
  let parts = cmlUtils.splitParts({content})
  parts.styles = parts.style;
  return parts;
}

