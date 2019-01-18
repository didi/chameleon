var lodash = require('lodash');

// these elements are *labelable elements* according to the HTML spec
var elems = [
    'button',
    'input', // if not in the hidden state
    'keygen',
    'meter',
    'output',
    'progress',
    'select',
    'textarea'
];

/**
 * Returns whether or not an html element can be associated with a
 * label element.
 * @param {Object} ele - an html element from the htmlparser2 parser
 * @returns {Boolean} whether or not `ele` is labelable
 */
module.exports.isLabeable = function (ele) {
    if (ele.type !== 'tag' || !lodash.includes(elems, ele.name)) {
        // element isn't a tag or isn't a labeable element
        return false;
    }

    if (ele.name === 'input' && ele.attribs && ele.attribs.type &&
        ele.attribs.type.value === 'hidden') {
        // inputs that are hidden are not labeable elements
        return false;
    }

    // element passed all the tests
    return true;
};
