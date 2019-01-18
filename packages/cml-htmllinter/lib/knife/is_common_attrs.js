const isCommonAttrRegex = /^(id|class|style|ref|(data-.+))$/;
/**
 * Using a regex to recognize whether an attribute is a common attribute that all tags have.
 * @param {String} attrName  the name of an attribute
 * @return {Boolean}
 */
module.exports.isCommonAttr = function(attrName) {
    return isCommonAttrRegex.test(attrName);
}
