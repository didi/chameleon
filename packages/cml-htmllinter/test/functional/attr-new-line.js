module.exports = [
    {
        desc: 'should not match tags with number of attributes less or equal then provided to rule',
        input: '<div class="role"></div>',
        opts: { 'attr-new-line': 1 },
        output: 0
    }, {
        desc: 'should match tags with number of attributes more then provided to rule',
        input: '<div class="role" id="red"></div>',
        opts: { 'attr-new-line': 1 },
        output: 1
    }, {
        desc: 'should not match tags with attributes splitted on multiple lines',
        input: '<div class="role"\n    id="red"></div>',
        opts: { 'attr-new-line': 1 },
        output: 0
    }, {
        desc: 'should not match tags with attributes splitted on multiple lines with no-value attr',
        input: '<div class="role"\n     id="red"\n     translate>\n</div>',
        opts: { 'attr-new-line': 1 },
        output: 0
    }, {
        desc: 'should not match tags with attributes splitted on multiple lines if first row has attributes less or equal then provided in rule',
        input: '<div class="role"\n    id="red"></div>',
        opts: { 'attr-new-line': 1 },
        output: 0
    }, {
        desc: 'should match tags with attributes splitted on multiple lines if first row has attributes more then provided in rule',
        input: '<div class="role"\n    id="red"></div>',
        opts: { 'attr-new-line': 0 },
        output: 1
    }, {
        desc: 'should not match tags with one attribute in the row for +0',
        input: '<div class="role">\n</div>',
        opts: { 'attr-new-line': '+0' },
        output: 0
    }, {
        desc: 'should not match tags with one attribute in the row and wrapper for +0',
        input: '<html>\n<body>\n    <div class="role"></div>\n</body>\n</html>',
        opts: { 'attr-new-line': '+0' },
        output: 0
    }, {
        desc: 'should match tags with two attribute in the row and wrapper for +0',
        input: '<html>\n<body>\n    <div class="role" id="me"></div>\n</body>\n</html>',
        opts: { 'attr-new-line': '+0' },
        output: 1
    }, {
        desc: 'should not match tags with two attribute in the row and with no-value attr for +0',
        input: '<phone-preview-ios\n        id="dsa"\n        trasclude>\n</phone-preview-ios>',
        opts: { 'attr-new-line': '+0' },
        output: 0
    }, {
        desc: 'should not match tags with 3 boolean attributes for',
        input: '<picker-date\n            ng-model="campaignUiData.end_date"\n            name="endDate"\n            rome-options="endDateOption"\n            required\n            romemin\n            romemax>\n          </picker-date>',
        opts: { 'attr-new-line': '+0' },
        output: 0
    }
];
