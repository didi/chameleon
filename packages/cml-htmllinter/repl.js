#!/usr/bin/env node

var repl = require('repl');
var ctx = repl.start('>> ').context;


var htmllint = require('./');

// export stuff to use in the repl
ctx.htmllint = htmllint;

ctx.lint = function () {
    var promise = ctx.htmllint.apply(ctx.htmllint, arguments);

    function handler(result) {
        ctx['_'] = result;

        console.log(result);
        console.log('You can access the results in the "_" obj');
    }

    promise.then(handler, handler);
};


var parser = ctx.htmllint.defaultLinter.parser;
ctx.parse = parser.parse.bind(parser);
