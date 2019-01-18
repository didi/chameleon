const commonEvents = ['tap', 'touchstart', 'touchmove', 'touchend'];

module.exports.isCommonEvent = function(eventName) {
    return ~commonEvents.indexOf(eventName);
}
