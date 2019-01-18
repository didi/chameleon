const fs = require('fs');
const path = require('path');
global.chai = require('chai');
global.chai.use(require('chai-as-promised'));
global.expect = global.chai.expect;

var testFiles = fs.readdirSync(__dirname)
    .filter(function (filepath) {
        return (path.extname(filepath) === '.js' &&
                path.basename(filepath) !== 'runner.test.js');
    })
    .map(function (filepath) {
        var basename = path.basename(filepath, '.js');

        return {
            name: basename,
            mod: require('./' + basename)
        };
    });
