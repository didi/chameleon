var bulk = require('bulk-require');
var lodash = require('lodash');

// import all the js files in the directory
var utilExports = bulk(__dirname, '!(index).js');
var utils = {};

// mixin all the functions from the exports into utils
lodash.values(utilExports).forEach(function (u) {
    lodash.mixin(utils, u);
});

// export utils
module.exports = utils;
