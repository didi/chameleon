var knife = require('../knife'),
    Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'tag-req-attr',
    on: ['tag'],
    desc: 'If set, specified attributes should be present on the specified tag.',
    process: proc.object
};

module.exports.lint = function (element, opts) {
    var tags = opts[this.name],
        errorCount = 0;

    for (var tagName in tags) {
        if (tagName === element.name) {
            var requiredAttributes = tags[tagName],
                elementAttributes = element.attribs;

            requiredAttributes.forEach(function(attribute) {
                var elementAttribute = elementAttributes[attribute.name],
                    allowEmpty = typeof attribute.allowEmpty === 'undefined' ? false : attribute.allowEmpty;

                if (typeof elementAttribute === 'undefined' || (!allowEmpty && !knife.hasNonEmptyAttr(element, attribute.name))) {
                    errorCount++;
                }
            });
        }
    }

    return errorCount === 0 ? [] : new Issue('E057', element.openLineCol);
};
