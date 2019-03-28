module.exports = function({compiler, currentNode}) {
  currentNode.output = `define('${currentNode.modId}', function(require, exports, module){${currentNode.output}\r\n});`
}
