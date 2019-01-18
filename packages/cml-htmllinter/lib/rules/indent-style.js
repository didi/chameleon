var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'indent-style',
    on: ['line'],
    options: [{
        desc: [
'* "tabs": Only tabs may be used for indentation.',
'* "spaces": Only spaces may be used for indentation.',
'* "nonmixed": Either tabs or spaces may be used, but not both',
'    in the same file.',
'* `false`: No restriction.'
].join('\n'),
        process: proc.options(['tabs', 'spaces', 'nonmixed'])
    }, {
        name: 'indent-width',
        desc: [
'The value of this option is either `false` or a positive integer. If it',
'is a number and spaces are used for indentation, then spaces used to',
'indent must come in multiples of that number.'
].join('\n'),
        process: proc.posInt,
    }, {
        name: 'indent-width-cont',
        desc: [
'If set, ignore `indent-width` for lines whose first non-whitespace',
'character is not `<`. This is known as continuation indent because it',
'enables the user to continue tags onto multiple lines while aligning the',
'attribute names.'
].join('\n'),
        process: proc.bool,
    }, {
        name: 'indent-delta',
        desc: [
'If set, check wether or not two consecutive lines have an indentation delta',
'in the range [-1, 1].'
].join('\n'),
        process: proc.bool,
    }]
};

module.exports.end = function () {
    delete this.current;
};

var previousLineIndentCount = 0;

module.exports.lint = function (line, opts) {
    // The indent, that is, the whitespace characters before the first
    // non-whitespace character.
    var matches = /[^ \t]/.exec(line.line);
    var sliceEnd = matches !== null ? matches.index : line.line.length;
    var indent = line.line.slice(0, sliceEnd);

    // Ignore empty lines
    if (/^[\n\r]*$/.test(line.line)) {
        return [];
    }

    var output = [];

    var width = opts['indent-width'];
    var deltaEnabled = opts['indent-delta'];

    if (deltaEnabled) {
        var currentLineIndentCount = 0,
            l = 0;
        if (width <= 1) {
            currentLineIndentCount = indent.length;
        } else {
            for (var i = 0; i < indent.length; i++) {
                if (indent[i] === '\t' || ++l === width) {
                    currentLineIndentCount++;
                    l = 0;
                }
            }
        }
        var expectedMin = Math.max(previousLineIndentCount - 1, 0);
        var expectedMax = previousLineIndentCount + 1;
        if ( !(expectedMin <= currentLineIndentCount && currentLineIndentCount <= expectedMax) ) {
            output.push(new Issue(
                'E056',
                [line.row],
                {
                    expectedMin: expectedMin,
                    expectedMax: expectedMax,
                    value: currentLineIndentCount,
                }
            ));
        }
        previousLineIndentCount = currentLineIndentCount;
    }

    // if there are no tabs or spaces on this line, don't bother
    if (indent.length === 0) {
        return output;
    }

    var cont = opts['indent-width-cont']
            && !/[\r\n<]/.test(line.line[indent.length]);

    if (width && !cont) {
        var i, l = 0;
        for (i = 0; i < indent.length; i++) {
            var c = indent[i];
            if (c === ' ') {
                l++;
            } else {
                if (l % width !== 0) { break; }
                l = 0;
            }
        }

        if (l % width !== 0) {
            output.push(new Issue('E036', [line.row, i - l + 1],
                                    { width: width }));
        }
    }

    var format = opts['indent-style'];
    if (format) {
        var space = / /.test(indent);
        var tab  = /\t/.test(indent);

        if (!this.current) {
            this.current = space ? 'spaces' : 'tabs';
        }

        // true if we require spaces, false if we require tabs
        var type = ((format === 'spaces') ||
                    (format === 'nonmixed' && this.current === 'spaces'));
        var error = type ? tab : cont ? / \t/.test(indent) : space;

        if (error) {
            output.push(new Issue('E024', [line.row, error.index + 1],
                                    { type: type ? 'Tabs' : 'Spaces' }));
        }
    }

    return output;
};
