module.exports.isSelfClosing = function (element) {
    var openRaw = element.open;

    return openRaw[openRaw.length - 1] === '/';
};

// Check whether the given tag has a non-empty attribute with the given
// name. Count "" as a non-empty attribute value only if optional
// parameter allowNull is true,
module.exports.hasNonEmptyAttr = function(tag, attr, allowNull) {
    var a = tag.attribs[attr];
    return (a && (allowNull || (a.value && a.value.length > 0)));
};

/**
 * Go through all child elements and find those that match the given type.
 * @param {Object} tag element object
 * @param {String} type 'tag' | 'text' etc.
 */
module.exports.getChildrenByType = function(tag, type) {
    return tag.children ? tag.children.filter((ele) => ele.type === type).map(ele => ele.name): [];
}