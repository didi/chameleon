const bulk = require('bulk-require');
const passExports = bulk(__dirname, '!(index).js');

const entries = Object.keys(passExports);

module.exports = entries.reduce((cases, currentEntry) => {
  if (currentEntry === 'tag-close') {
    return cases.concat(passExports[currentEntry]);
  } else {
    return cases;
  }
}, []);
