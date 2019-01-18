var Issue = require('../issue'),
    knife = require('../knife');

module.exports = {
    name: 'class',
    on: ['attr'],
    filter: ['class']
    // 'id-class-ignore-regex' (non-dependent)
};

module.exports.lint = function (attr, opts) {
    var nodup = opts['class-no-dup'];

    var issues = [];
    var v = attr.value.trim();

    var ignore = opts['id-class-ignore-regex'];
    var classes = [];
    // Parallel to classes; which classes are ignored
    var ignore_class = false;
    if (ignore) {
        var res;
        var start = 0;
        ignore_class = [false];
        while (start < v.length && (res = ignore.exec(v)) !== null) {
            if (res[1] === undefined) {
                classes.push(v.slice(start, res.index));
                start = ignore.lastIndex;
                ignore_class.push(false);
            } else {
                ignore_class[ignore_class.length - 1] = true;
            }
        }
        ignore_class.pop();
    } else {
        classes = v.split(/\s+/);
    }

    classes.ignore_class = ignore_class;
    classes.lineCol = attr.valueLineCol;
    classes.all = v;
    return knife.applyRules(this.subscribers, classes, opts);
};
