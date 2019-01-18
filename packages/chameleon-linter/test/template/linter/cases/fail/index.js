const bulk = require('bulk-require');
const casesExports = bulk(__dirname, '!(index).js');

const entries = Object.keys(casesExports);

module.exports = entries.reduce((cases, currentEntry) => {
  return cases.concat(casesExports[currentEntry]);
}, []);
