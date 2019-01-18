// Export an array of all rules.

var bulk = require('bulk-require');

// All modules in this directory excluding this file
var rulesExport = bulk(__dirname, '!(index).js');

module.exports = Object.values(rulesExport);
