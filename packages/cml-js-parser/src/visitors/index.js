const bulk = require('bulk-require');
const visitorExports = bulk(__dirname, '!(index).js');

let visitors = {};

Object.values(visitorExports).forEach(visitor => {
  Object.assign(visitors, visitor);
});

module.exports = visitors;
