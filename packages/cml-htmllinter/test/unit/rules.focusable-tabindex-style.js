describe('rules.focusable-tabindex-style', function () {
    var rule = require('../../lib/rules/focusable-tabindex-style');

    beforeEach(function () {
        rule.end();
    });

    describe('end', function () {
        it('should reset the detected style', function () {
            rule.detectedStyle = true;

            rule.end();

            expect(rule.detectedStyle).to.be.eql(null);
        });
    });

    describe('lint', function () {
        it('should return [] when not enabled', function () {
            var issues = rule.lint({}, { 'focusable-tabindex-style': false });

            expect(issues).to.be.eql([]);
        });
    });

    describe('getTabIndexStyle', function () {
        [
            {
                desc: 'should return null for elements with no tabindex',
                element: {
                    attribs: {}
                },
                style: false
            }, {
                desc: 'should return false for elements with tabindex 0',
                element: {
                    attribs: { tabindex: { value: 0 } }
                },
                style: false
            }, {
                desc: 'should return false for elements with negative tabindex',
                element: {
                    attribs: { tabindex: { value: -1 } }
                },
                style: false
            }, {
                desc: 'should return true for elements with positive tabindex',
                element: {
                    attribs: { tabindex: { value: 1 } }
                },
                style: true
            }
        ].forEach(function (testCase) {
            it(testCase.desc, function () {
                var style = rule.getTabIndexStyle(testCase.element);

                expect(style).to.be.eql(testCase.style);
            });
        });
    });
});
