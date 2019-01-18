const bulk = require('bulk-require');
const ruleExports = bulk(__dirname, '!(index).js');

module.exports = Object.values(ruleExports);
