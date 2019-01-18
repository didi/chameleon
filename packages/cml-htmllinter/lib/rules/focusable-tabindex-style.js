var Issue = require('../issue');

module.exports = {
    name: 'focusable-tabindex-style',
    on: ['tag'],
    filter: ['a', 'area', 'button', 'input', 'img', 'select', 'textarea'],
    desc: [
'If set, all focusable elements',
'(`a`, `area`, `button`, `input`, `img`, `select`, `textarea`)',
'must have a positive `tabindex` attribute, if any.',
'',
'Reasoning: [IITAA, 10.3 and 10.4](http://www.dhs.state.il.us/IITAA/IITAAWebImplementationGuidelines.html)'
].join('\n'),

    detectedStyle: null
};

module.exports.end = function () {
    this.detectedStyle = null;
};

module.exports.lint = function (element, opts) {
    if (this.isDisabled(element)) {
        return [];
    }

    var tabIndexStyle = this.getTabIndexStyle(element);

    if (this.detectedStyle !== null &&
        this.detectedStyle !== tabIndexStyle) {

        var msg = tabIndexStyle ? 'remove the tabindex'
                                : 'add a positive tabindex';
        return new Issue('E026', element.openLineCol, {op: msg});
    }

    this.detectedStyle = tabIndexStyle;
    return [];
};

module.exports.isDisabled = function (element) {
    return element.attribs && element.attribs.hasOwnProperty('disabled');
};

module.exports.getTabIndexStyle = function (element) {
    var a = element.attribs;

    if (a && a.hasOwnProperty('tabindex') && typeof a !== 'undefined') {
        return a.tabindex.value > 0;
    }

    return false;
};
