const commonEvents = ['tap', 'click', 'touchstart', 'touchmove', 'touchend'];

module.exports.isCommonEvent = function(eventName) {
    return ~commonEvents.indexOf(eventName);
}
