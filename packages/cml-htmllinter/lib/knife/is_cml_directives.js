const isCmlDirectiveRegex = /^c-(?!bind)/;

module.exports.isCmlDirective = function(attrName) {
    return isCmlDirectiveRegex.test(attrName);
}
