var knife = require('../knife'),
    Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'tag-embed',
    on: ['tag'],
    options: [{
        name: 'tag-embed-tags',
        desc: 'If set, all specified tags must fellow the embedded rules given by this option.',
        process: proc.object
    }]
};


module.exports.lint = function (element, opts) {
    let embedTags = opts['tag-embed-tags'], issues = [];
    let childEles = element ? knife.getChildrenByType(element, 'tag') : [];

    if (embedTags && embedTags[element.name]) {
        let embedEle = embedTags[element.name];
        //check required elements.
        if (embedEle.required && Array.isArray(embedEle.required)) {
            if (embedEle.required.filter((ele) => {
                return !~childEles.indexOf(ele);
            }).length > 0) {
                issues.push(new Issue('E065', element.openLineCol, {
                    parent: element.name,
                    elements: embedEle.required.join(" and ")
                }));
            }
        }
        //check includes elements.
        if (embedEle.includes && Array.isArray(embedEle.includes)) {
            childEles.filter((ele) => {
                return !~embedEle.includes.indexOf(ele);
            }).forEach((ele) => {
                issues.push(new Issue(embedEle.includes.length === 0 ? 'E066' : 'E067', element.openLineCol, {
                    parent: element.name,
                    elements: embedEle.includes.join(" or "),
                    forbiddenTag: ele
                }));
            });
        }
        //check excludes elements.
        if (embedEle.excludes && Array.isArray(embedEle.excludes)) {
            embedEle.excludes.forEach((ele) => {
                if (childEles.indexOf(ele) > -1) {
                    issues.push(new Issue('E068', element.openLineCol, {
                        parent: element.name,
                        elements: embedEle.excludes.join(" or "),
                        forbiddenTag: ele
                    }));
                }
            });
        }
    }

    return issues;
};