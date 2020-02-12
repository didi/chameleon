const originReg = /^origin-([^-]+)/;

module.exports.isOriginTag = function(name) {
    return originReg.test(name);
}
