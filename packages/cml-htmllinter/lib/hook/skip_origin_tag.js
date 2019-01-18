
const Tools = require('../tools');

module.exports = {
    name: 'skip-origin-tag',
    breakOff: true,
    /**
     * The arguments must match with rules' lint function.
     * @param {Object} element
     * @param {Object} opts
     * @return {Array} An array, the first element works together with breakOff to determine
     * whether to break the process before running rules' lint functions and the second element
     * contains the information that you wish to pass down on the way to rule's lint function, which
     * will be the third argument of lint.
     */
    run: function(element, opts) {
        return [Tools.isOriginComponent(element) || ~(opts['origin-tag-list'] || []).indexOf(element.name), null];
    }
}
