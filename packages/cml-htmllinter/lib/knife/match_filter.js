module.exports.matchFilter = function (data, rule) {
    if (!rule.filter) {
        return true;
    }

    return rule.filter.indexOf(data.toLowerCase()) > -1;
};
