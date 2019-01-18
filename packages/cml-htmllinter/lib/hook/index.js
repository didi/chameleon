var bulk = require('bulk-require');
var lodash = require('lodash');

// import all the js files in the directory
var hookExports = bulk(__dirname, '!(index).js');
var hook = {};

// mixin all the functions from the exports into hook
lodash.values(hookExports).forEach(function (u) {
    hook[u.name] = u;
});

// export hook
module.exports = hook;
