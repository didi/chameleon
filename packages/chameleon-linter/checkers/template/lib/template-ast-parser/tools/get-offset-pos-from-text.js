module.exports.getVarOffsetPosFromText = function (text = '', varName = '', offset = 0) {
  if (!text || !varName) {return [1, 0];}
  let preText = text.substr(0, text.indexOf(varName, offset));
  let lines = preText.split('\n');
  return [lines.length - 1, lines[lines.length - 1].length];
}
