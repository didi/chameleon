const bulk = require('bulk-require');
const toolExports = bulk(__dirname, '!(index).js');
let tools = {};

Object.values(toolExports).forEach(tool => {
  Object.assign(tools, tool);
});

module.exports = tools;
