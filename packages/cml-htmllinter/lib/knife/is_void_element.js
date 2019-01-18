var elems = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'image',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr',

    //common self closing svg elements
    'path',
    'circle',
    'ellipse',
    'line',
    'rect',
    'use',
    'stop',
    'polyline',
    'polygon'
];

/**
 * Returns whether or not an html tag name is a void element.
 * @param {String} tagName - a name of a html tag
 * @returns {Boolean} whether or not `tagName` is a void element
 */
module.exports.isVoidElement = function (tagName) {
    return elems.indexOf(tagName.toLowerCase()) !== -1;
};
